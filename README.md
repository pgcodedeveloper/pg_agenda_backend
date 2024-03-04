## Este proyecto fue construido utilizando
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

## Para comenzar

Primero deberá configurar sus ENVs:

```env
PORT=5000
SESSION_SECRET=
FRONT_END= //Si es estas en desarrollo http://localhost:3000
CLIENT_ID=
CLIENT_SECRET=
REDIRECT_URI=
DB_URI=
```

1. CLIENT_ID: Se obtiene de la consola de Google Cloud accediendo las credenciales de OAuth 2.0.
2. CLIENT_SECRET: También se obtiene de la consola de Google Cloud.
3. REDIRECT_URI: Es la URL del servidor donde se redireccionará para obtener el token del usuario cuando se inicia sesión.
   > Opción si esta en entorno de desarrollo: http://localhost:5000/api/users/get-auth-token.
5. DB_URI: Reperesenta al URL de conexión de su Cluster de MongoDB.

## 
