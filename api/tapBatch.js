// /api/tapBatch.js  (Vercel Serverless Function)
import crypto from "crypto";

constSECRET = process.env.WGG_SECRET || "dev-secret-change-me";

// === helpers de token firmado (estado dentro del token) ===
function signState(o){
  const data = Buffer.from(JSON.stringify(o)).toString("base64url");
  const sig  = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}
function verifyState(token){
  const [data, sig] = String(token || "").split(".");
  if (!data || !sig) return null;
  const calc = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  if (calc !== sig) return null;
  try { return JSON.parse(Buffer.from(data, "base64url").toString("utf8")); }
  catch { return null; }
}

// === parámetros de juego (mismo feeling que el front) ===
const CAP = 100;
const REGEN_PER_SEC = 100;
const POWER_BASE = 0.10;

export default async function handler(req, res){
  // --- CORS preflight ---
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { token, taps = 0 } = req.body || {};
    const st = verifyState(token);
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (!st) return res.status(401).json({ ok:false, error:"invalid_token" });

    // regen energía autoritativa
    const now = Date.now();
    const dt = (now - (st.lastTs || now)) / 1000;
    st.energy = Math.min(CAP, st.energy + dt * REGEN_PER_SEC);
    st.lastTs = now;

    // aplicar taps (gastan 1 de energy por tap)
    let applied = 0, gained = 0;
    for (let i = 0; i < Number(taps||0); i++){
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
      state: { wld: st.wld, wlgp: st.wlgp, energy: st.energy, lastTs: st.lastTs, applied, gained }
    });
  } catch (e){
    console.error(e);
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(500).json({ ok:false, error:"server_error" });
  }
}
