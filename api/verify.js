// /api/verify.js  (Vercel Serverless Function)
import { verifyProof } from "@worldcoin/idkit";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }
  if (req.method !== "POST") return res.status(405).end();

  try {
    const payload = req.body; // el finalPayload del cliente (MiniKit.verify)
    const out = await verifyProof(
      { proof: payload, action: "worldgold" },     // <-- tu Action ID
      process.env.WORLDCOIN_APP_ID,               // app_33bb8068826b85d4cd56d2ec2caba7cc
      process.env.WORLDCOIN_APP_SECRET            // lo pones en Vercel → Settings → Env
    );
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(out.success ? 200 : 400).json({ ok: !!out.success });
  } catch (e) {
    console.error(e);
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(500).json({ ok: false, error: "server_error" });
  }
}
