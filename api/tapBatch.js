// /api/tapBatch.js
import * as crypto from "crypto";   // 👈 IMPORT corregido

// Clave secreta para firmar el estado
const SECRET = process.env.WGG_SECRET || "dev-secret-change-me";

// --- Helpers para firmar y verificar tokens de estado ---
function signState(stateObj) {
  const data = Buffer.from(JSON.stringify(stateObj)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

function verifyState(token) {
  try {
    const [data, sig] = String(token || "").split(".");
    if (!data || !sig) return null;
    const calc = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
    if (calc !== sig) return null;
    return JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

// --- Parámetros del juego ---
const CAP = 100;
const REGEN_PER_SEC = 100;
const POWER_BASE = 0.10;

export default async function handler(req, res) {
  // --- Manejo CORS / preflight ---
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(405).end();
  }

  try {
    const { token, taps = 0 } = req.body || {};
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Verificar token de estado
    const st = verifyState(token);
    if (!st) {
      return res.status(401).json({ ok: false, error: "invalid_token" });
    }

    // Regenerar energía
    const now = Date.now();
    const dt = (now - (st.lastTs || now)) / 1000;
    st.energy = Math.min(CAP, st.energy + dt * REGEN_PER_SEC);
    st.lastTs = now;

    // Aplicar taps
    let applied = 0, gained = 0;
    for (let i = 0; i < Number(taps || 0); i++) {
      if (st.energy < 1) break;
      st.energy -= 1;
      st.wlgp = +(st.wlgp + POWER_BASE).toFixed(4);
      gained += POWER_BASE;
      applied++;
    }

    const newToken = signState(st);

    return res.status(200).json({
      ok: true,
      token: newToken,
      state: {
        wld: st.wld,
        wlgp: st.wlgp,
        energy: st.energy,
        lastTs: st.lastTs,
        applied,
        gained
      }
    });

  } catch (e) {
    console.error("tapBatch error:", e);
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(500).json({ ok: false, error: "server_error" });
  }
}


