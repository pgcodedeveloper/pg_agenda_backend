## Este proyecto fue construido utilizando
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

## Para comenzar

Primero deberá configurar sus ENVs:

```env
PORT=5000
SESSION_SECRET=palabrasecreta2024.secret
FRONT_END=http://localhost:3000
CLIENT_ID=514866670970-5vqthbncg9sks049i6glipi8qrnd322q.apps.googleusercontent.com
CLIENT_SECRET=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
REDIRECT_URI=http://localhost:5000/api/users/get-auth-token
DB_URI=
```

1. CLIENT_ID: Se obtiene de la consola de Google Cloud accediendo las credenciales de OAuth 2.0.
2. CLIENT_SECRET: También se obtiene de la consola de Google Cloud.
3. REDIRECT_URI: Es la URL del servidor donde se redireccionará para obtener el token del usuario cuando se inicia sesión.
   > Opción correcta: http://ORIGIN_DEL_SERVIDOR/api/users/get-auth-token.
5. DB_URI: Reperesenta al URL de conexión de su Cluster de MongoDB.

## 
