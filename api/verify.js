// /api/verify.js  — versión con IDKit y import dinámico
export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }
  if (req.method !== "POST") return res.status(405).end();

  try {
    // ⬇️ importamos @worldcoin/idkit solo cuando hace falta (evita crash al cargar)
    const { verifyProof } = await import("@worldcoin/idkit");

    const payload = req.body; // finalPayload del cliente
    const out = await verifyProof(
      { proof: payload, action: "worldgold" },
      process.env.WORLDCOIN_APP_ID,
      process.env.WORLDCOIN_APP_SECRET
    );

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(out.success ? 200 : 400).json({ ok: !!out.success });
  } catch (e) {
    console.error("verify error:", e);
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(500).json({ ok: false, error: "server_error" });
  }
}


