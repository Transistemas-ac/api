# Transistemas API 🔐

REST API para autenticar y gestionar miembrxs de Transistemas.

<br>

## 💾 Instalación

```sh
\# 📥 Clonar el repositorio
git clone https://github.com/Transistemas-ac/api.git

# 📂 Moverse a la carpeta del proyecto
cd api

# 📦 Instalar dependencias
npm install

# 🛠️ Crear archivo .env
cat <<EOF > .envh
NODE_ENV="development"
PORT=3000
JWT_SECRET="+V:E}Wz>M~B?Ew"
DB_URL="postgresql://postgres.ljlfihvoremfzgqnxotr:dgxf6acQCUeJhn2q@aws-1-us-east-2.pooler.supabase.com:5432/postgres"
SELF_URL="http://localhost:3000"
EOF

# 🔧 Ejecutar migraciones
npm run prisma:migrate

# 🚀 Correr el servidor en desarrollo
npm run dev
```

<br>

## 🚀 Tech Stack

| Technology   | Version          |
| ------------ | ---------------- |
| Node.js      | 20.x             |
| Express.js   | 5.x              |
| TypeScript   | 5.x              |
| Prisma       | 6.x              |
| PostgreSQL   | Managed Supabase |
| Zod          | 4.x              |
| bcrypt       | 6.x              |
| jsonwebtoken | 9.x              |
| cors         | 2.x              |
| node-fetch   | 3.x              |
| ts-node-dev  | 2.x              |

<br>

## 👩🏻‍💻 Scripts

| Script                      | Description                                 |
| --------------------------- | ------------------------------------------- |
| \`npm run dev\`             | Start dev server with ts-node-dev           |
| \`npm run build\`           | Generate Prisma client + compile TypeScript |
| \`npm run start\`           | Run compiled server                         |
| \`npm run test\`            | Run tests with Jest                         |
| \`npm run prisma:generate\` | Generate Prisma client                      |
| \`npm run prisma:migrate\`  | Apply migrations in dev                     |
| \`npm run prisma:reset\`    | Reset database                              |
| \`npm run prisma:deploy\`   | Deploy migrations to production             |

<br>

## 🔐️ Variables de Entorno

| Variable   | Description                           | Example                             |
| ---------- | ------------------------------------- | ----------------------------------- |
| NODE_ENV   | Environment mode                      | development                         |
| PORT       | API server port                       | 3000                                |
| JWT_SECRET | Secret for signing JWT tokens         | "+V:E}Wz>M~B?Ew"                    |
| DB_URL     | Connection string to PostgreSQL DB    | postgresql://user:pass@host:5432/db |
| SELF_URL   | URL for self-ping / Render keep-alive | http://localhost:3000               |

<br>

## 💾 Base de Datos

| Enum            | Valores                       |
| --------------- | ----------------------------- |
| CredentialsType | "admin", "teacher", "student" |

<br>

### `User`

| Columna     | Tipo            | Restricciones               |
| ----------- | --------------- | --------------------------- |
| id          | SERIAL          | PRIMARY KEY                 |
| username    | VARCHAR(255)    | NOT NULL, UNIQUE            |
| email       | VARCHAR(255)    | NOT NULL, UNIQUE            |
| password    | VARCHAR(255)    | NOT NULL                    |
| credentials | CredentialsType | NOT NULL, DEFAULT 'student' |
| pronouns    | VARCHAR(255)    |                             |
| first_name  | VARCHAR(255)    |                             |
| last_name   | VARCHAR(255)    |                             |
| description | TEXT            |                             |
| photo_url   | TEXT            |                             |
| link        | TEXT            |                             |
| team        | VARCHAR(255)    |                             |

### `Course`

| Columna          | Tipo         | Restricciones |
| ---------------- | ------------ | ------------- |
| id               | SERIAL       | PRIMARY KEY   |
| title            | VARCHAR(255) | NOT NULL      |
| description      | TEXT         |               |
| start_date       | TIMESTAMPTZ  |               |
| end_date         | TIMESTAMPTZ  |               |
| syllabus_url     | TEXT         |               |
| subscription_url | TEXT         |               |

### `Subscription` (n:n)

| Columna     | Tipo            | Restricciones                               |
| ----------- | --------------- | ------------------------------------------- |
| user_id     | INT             | NOT NULL, FK → User(id) ON DELETE CASCADE   |
| course_id   | INT             | NOT NULL, FK → Course(id) ON DELETE CASCADE |
| credentials | CredentialsType | NOT NULL, DEFAULT 'student'                 |
|             |                 | PRIMARY KEY (user_id, course_id)            |

<br>

## 🛠️ Endpoints

### Auth

| Method | Endpoint      | Auth | Description             |
| ------ | ------------- | ---- | ----------------------- |
| POST   | \`/register\` | None | Register new user       |
| POST   | \`/login\`    | None | Login user, returns JWT |
| POST   | \`/logout\`   | None | Clear session cookies   |

### User

| Method | Endpoint                        | Auth | Role                | Description               |
| ------ | ------------------------------- | ---- | ------------------- | ------------------------- |
| GET    | \`/user/\`                      | ✅   | admin               | List all users            |
| POST   | \`/user/\`                      | ✅   | admin               | Create new user           |
| GET    | \`/user/:userId\`               | ✅   | owner/teacher/admin | Get user by ID            |
| PUT    | \`/user/:userId\`               | ✅   | owner/admin         | Update user               |
| DELETE | \`/user/:userId\`               | ✅   | admin               | Delete user               |
| GET    | \`/user/:userId/courses\`       | ✅   | owner/teacher/admin | List user's courses       |
| GET    | \`/user/:userId/subscriptions\` | ✅   | owner/teacher/admin | List user's subscriptions |

### Course

| Method | Endpoint              | Auth | Role          | Description       |
| ------ | --------------------- | ---- | ------------- | ----------------- |
| GET    | \`/course/\`          | ❌   | Public        | List all courses  |
| GET    | \`/course/:courseId\` | ❌   | Public        | Get course by ID  |
| POST   | \`/course/\`          | ✅   | teacher/admin | Create new course |
| PUT    | \`/course/:courseId\` | ✅   | teacher/admin | Update course     |
| DELETE | \`/course/:courseId\` | ✅   | admin         | Delete course     |

### Subscription

| Method | Endpoint                           | Auth | Role                | Description                       |
| ------ | ---------------------------------- | ---- | ------------------- | --------------------------------- |
| GET    | \`/subscription/user/:userId\`     | ✅   | owner/teacher/admin | List subscriptions of a user      |
| GET    | \`/subscription/course/:courseId\` | ✅   | teacher/admin       | List users subscribed to a course |
| POST   | \`/subscription/\`                 | ✅   | Authenticated       | Subscribe user to course          |
| DELETE | \`/subscription/\`                 | ✅   | Authenticated       | Unsubscribe user from course      |

### Health & Root

| Method | Endpoint     | Auth | Description               |
| ------ | ------------ | ---- | ------------------------- |
| GET    | \`/\`        | ❌   | API welcome message       |
| GET    | \`/healthz\` | ❌   | Health check (returns 💚) |

<br>

## ❌ Logs de Errores

- Todos los errores pasan por el middleware`errorHandler`.
- Zod validation errors retornan con status 400 y un array de mensajes.
- Prisma errors como P2025 (registro no encontrado) se manejan individualmente en cada controlador.
- Otros errores retornan status 500 con mensaje y stack en consola.
- Self-ping logs:
  - \`💚 Self-ping successful\` si la app responde correctamente.
  - \`❌ Self-ping failed\` si hay error en el ping.

<br>

---

_Creado con orgullo por el Equipo de Desarrollo de Transistemas ❤_
