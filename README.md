# worldgold-api

Backend mínimo para WorldGold (Vercel). Incluye:

- `POST /api/verify` — valida el proof de World ID (MiniKit.verify).
- `POST /api/pay/confirm` — registra pagos exitosos (MiniKit.pay).

## Deploy rápido (Vercel)

1. Sube este repo a GitHub (o importa el ZIP y crea un repo).
2. Entra a https://vercel.com → **Add New Project** → conecta el repo.
3. En **Settings → Environment Variables** agrega:

```
WORLDCOIN_APP_ID=app_33bb8068826b85d4cd56d2ec2caba7cc
WORLDCOIN_APP_SECRET=TU_SECRET_DEL_PORTAL
```

4. Deploy. Obtendrás una URL como `https://worldgold-api.vercel.app`.

## Endpoints

### POST /api/verify
Body: el `finalPayload` devuelto por `MiniKit.commandsAsync.verify(...)`

Responde `200 { ok: true }` si la verificación es válida.

### POST /api/pay/confirm
Body: el objeto que retorna `MiniKit.commandsAsync.pay(...)`

Responde `200 { ok: true }`

## CORS
Ambos endpoints devuelven `Access-Control-Allow-Origin: *` para permitir llamadas desde GitHub Pages.

