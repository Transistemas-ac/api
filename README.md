# Transistemas API 🔐

REST API para autenticar y gestionar miembrxs de Transistemas.

<br>

## 💾 Instalación

```sh
# 📥 Clonar el repositorio
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
| Node.js      | 22.14            |
| Express.js   | ^5.1.0           |
| TypeScript   | ^5.8.3           |
| Prisma       | ^6.12.0          |
| PostgreSQL   | Managed Supabase |
| Zod          | ^4.0.5           |
| bcrypt       | ^6.0.0           |
| jsonwebtoken | ^9.0.2           |
| cors         | ^2.8.5           |
| node-fetch   | ^3.3.2           |
| ts-node-dev  | ^2.0.0           |

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

<br>

### Enums

| Enum            | Values                        |
| --------------- | ----------------------------- |
| CredentialsType | "admin", "teacher", "student" |

<br>

### `User`

| Column      | Type            | Restrictions                |
| ----------- | --------------- | --------------------------- |
| id          | SERIAL          | PRIMARY KEY 🔑              |
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

<br>

### `Course`

| Column           | Type         | Restrictions   |
| ---------------- | ------------ | -------------- |
| id               | SERIAL       | PRIMARY KEY 🔑 |
| title            | VARCHAR(255) | NOT NULL       |
| description      | TEXT         |                |
| start_date       | TIMESTAMPTZ  |                |
| end_date         | TIMESTAMPTZ  |                |
| syllabus_url     | TEXT         |                |
| subscription_url | TEXT         |                |

<br>

### `Subscription` (n:n)

| Column      | Type            | Restrictions                                   |
| ----------- | --------------- | ---------------------------------------------- |
| id          | INT             | PRIMARY KEY 🔑 (user_id, course_id)            |
| user_id     | INT             | NOT NULL, FK 🔑 → User(id) ON DELETE CASCADE   |
| course_id   | INT             | NOT NULL, FK 🔑 → Course(id) ON DELETE CASCADE |
| credentials | CredentialsType | NOT NULL, DEFAULT 'student'                    |

<br>

## 🛠️ Endpoints

## 🛠️ Endpoints

### Auth

| Method | Endpoint  | Credentials | Description                           |
| ------ | --------- | ----------- | ------------------------------------- |
| POST   | /register | public      | Registrar un nuevo usuarix            |
| POST   | /login    | public      | Iniciar sesión, devuelve un token JWT |
| POST   | /logout   | public      | Borrar las cookies de la sesión       |

<br>

### User

| Method | Endpoint                    | Credentials           | Description                          |
| ------ | --------------------------- | --------------------- | ------------------------------------ |
| GET    | /user/                      | admin, teacher        | Listar todos los usuarixs            |
| POST   | /user/                      | teacher, admin        | Crear un nuevo usuarix               |
| GET    | /user/:userId               | owner, teacher, admin | Obtener usuarix por ID               |
| PUT    | /user/:userId               | owner, teacher, admin | Actualizar un usuarix                |
| DELETE | /user/:userId               | owner, teacher, admin | Eliminar un usuarix                  |
| GET    | /user/:userId/courses       | owner, teacher, admin | Listar los cursos del usuarix        |
| GET    | /user/:userId/subscriptions | owner, teacher, admin | Listar las suscripciones del usuarix |

<br>

### Course

| Method | Endpoint          | Credentials    | Description             |
| ------ | ----------------- | -------------- | ----------------------- |
| GET    | /course/          | public         | Listar todos los cursos |
| GET    | /course/:courseId | public         | Obtener curso por ID    |
| POST   | /course/          | teacher, admin | Crear un nuevo curso    |
| PUT    | /course/:courseId | teacher, admin | Actualizar un curso     |
| DELETE | /course/:courseId | teacher, admin | Eliminar un curso       |

<br>

### Subscription

| Method | Endpoint                       | Credentials             | Description                              |
| ------ | ------------------------------ | ----------------------- | ---------------------------------------- |
| GET    | /subscription/user/:userId     | student, teacher, admin | Listar las suscripciones de un usuarix   |
| GET    | /subscription/course/:courseId | student, teacher, admin | Listar los usuarixs suscritos a un curso |
| POST   | /subscription/                 | student, teacher, admin | Suscribir a un usuarix a un curso        |
| DELETE | /subscription/                 | student, teacher, admin | Desuscribir a un usuarix de un curso     |

<br>

### Health and root

| Method | Endpoint   | Credentials | Description                         |
| ------ | ---------- | ----------- | ----------------------------------- |
| GET    | `/`        | public      | Mensaje de bienvenida de la API     |
| GET    | `/healthz` | public      | Verificación de salud (devuelve 💚) |

<br>

## ❌ Logs de Errores

- Todos los errores pasan por el middleware `errorHandler`.
- Zod validation errors retornan con status 400 y un array de mensajes.
- Prisma errors como P2025 (registro no encontrado) se manejan individualmente en cada controlador.
- Otros errores retornan status 500 con mensaje y stack en consola.
- Self-ping logs:
  - \`💚 Self-ping successful\` si la app responde correctamente.
  - \`❌ Self-ping failed\` si hay error en el ping.

<br>

---

_Creado con orgullo por el Equipo de Desarrollo de Transistemas ❤_
