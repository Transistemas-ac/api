# Transistemas auth-api 🔐

## 💾 Instalación

```sh
# 📥 Clonar el repositorio
git clone https://github.com/nady4/ai-face-detect-api.git

# 📂 Moverse a la carpeta del proyecto
cd ai-face-detect-api

# 📦 Instalar dependencias
npm install

# 🛠️ Crear archivo .env
cat <<EOF > .env
DB_URL="postgresql://postgres:1369@localhost:5432/transistemas?schema=public"
PORT=3000
JWT_SECRET="+V:E}Wz>M~B?Ew"
EOF

# 🔧 Asegurarse de que la base de datos esté disponible
npm run prisma:migrate

# 🚀 Correr el servidor
npm run dev
```

<br>

## 🚀 Tech Stack

| Technology   | Version |
| ------------ | ------- |
| TypeScript   | ^5.8.3  |
| ts-node-dev  | ^2.0.0  |
| Express      | ^5.1.0  |
| Prisma ORM   | ^6.12.0 |
| Zod          | ^4.0.5  |
| Bcrypt       | ^6.0.0  |
| jsonwebtoken | ^9.0.2  |

<br>

## Endpoints 🛠️

- GET /: ruta protegida que requiere un token JSON Web válido para acceder.

- POST /login: ruta para iniciar sesión. Acepta un username y password en el cuerpo de la solicitud y devuelve un token JSON Web si el inicio de sesión es exitoso.

- POST /register: ruta para registrar un nuevo usuario. Acepta un username y password en el cuerpo de la solicitud y devuelve un token JSON Web si el registro es exitoso.

- POST /image: ruta protegida que requiere un token JSON Web válido para acceder. Acepta una URL de imagen en el cuerpo de la solicitud y devuelve los datos de la imagen procesados por la API de face-api.js.

<br>

## Variables de Entorno 🔐️

Las siguientes variables de entorno se utilizan en este proyecto:

- DB_URL: URL de la base de datos PostgreSQL

- JWT_KEY: clave secreta para firmar los tokens JSON Web

- PORT: puerto en el que se ejecutará el servidor web

<br>

---

_Creado con orgullo por el Equipo de Desarrollo de Transistemas ❤_
