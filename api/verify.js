export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }
  if (req.method !== "POST") return res.status(405).end();

  // 🔴 PARCHE TEMPORAL — esto evita el 500 para que puedas seguir probando
  res.setHeader("Access-Control-Allow-Origin", "*");
  return res.status(200).json({ ok: true, note: "TEMP_FAKE_VERIFY" });
}


