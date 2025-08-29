# WorldGold API

Backend para la miniapp **WorldGold** (World App).  
Incluye endpoints para verificación de World ID, pagos y manejo de taps.

---

## Endpoints

- `POST /api/verify` → Valida el proof de World ID.
- `POST /api/pay/confirm` → Registra pagos exitosos.
- `POST /api/tapBatch` → Aplica taps y devuelve nuevo estado (energía, WLD, WLGp).

Todos los endpoints responden JSON y tienen CORS habilitado para el frontend.

---

## Variables de entorno (solo en Vercel)

Configúralas en **Vercel → Project → Settings → Environment Variables**:

WORLDCOIN_APP_ID=app_33bb8068826b85d4cd56d2ec2caba7cc
WORLDCOIN_APP_SECRET=xxxx
WGG_SECRET=xxxx

## Despliegue

Este backend está pensado para **Vercel**.  
Ya está publicado en:

https://worldgold-api-o87j.vercel.app

Usa esa URL en el frontend para llamar a:  
- `/api/verify`  
- `/api/pay/confirm`  
- `/api/tapBatch`

---

## Seguridad

- Los tokens de estado se firman (HMAC) en el servidor (`tapBatch.js`).  
- La verificación World ID se hace con `WORLDCOIN_APP_ID` y `WORLDCOIN_APP_SECRET` guardados en **variables de entorno**.  
- No se almacenan datos biométricos ni información sensible de usuarios.



