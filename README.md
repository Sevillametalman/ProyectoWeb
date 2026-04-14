# Proyecto Web: Gestión de Demonios y Usuarios

## Definición del Tema y Alcance

Aplicación web dinámica para la gestión de Demonios y usuarios, permitiendo la administración de entidades, asignación y control de atributos, con autenticación y autorización segura. El sistema resuelve la problemática de gestión de criaturas y usuarios en un entorno gamificado.

## Requisitos Técnicos

### Frontend

- **Framework:** Vue.js 3
- **UI:** Totalmente responsive usando Tailwind CSS
- **Consumo de API:** Comunicación asíncrona con fetch

### Backend

- **Servidor:** Node.js con Express
- **API RESTful:** Endpoints siguiendo convenciones HTTP (GET, POST, PUT, DELETE)
- **Validación:** Todas las entradas validadas con Zod

### Base de Datos

- **DB:** PostgreSQL
- **Modelo Relacional:** Tablas para usuarios, daemons, razas, relaciones usuario-daemon
- **CRUD Completo:** Crear, leer, actualizar y eliminar entidades complejas

### Seguridad

- **Autenticación:** Login/registro funcional
- **Autorización:** JWT para rutas privadas
- **Protección de datos:** Contraseñas hasheadas con bcrypt

## Instalación y configuración

1. **Clona el repositorio:**

   ```bash
   git clone <URL-del-repositorio>
   cd ProyectoWeb
   ```

2. **Instala las dependencias:**

   ```bash
   npm install
   cd frontend && npm install
   ```

3. **Configura la base de datos:**
   - Crea una base de datos PostgreSQL (ej: `proyectoweb`).
     > En la consola podría realizarse el comando `CREATE DATABASE proyectoweb;` luego de conectarse haciendo `psql -U <usuario>`
   - Modifica la conexión en `src/db.js` si es necesario.
   - Ejecuta el script de tablas:
     ```bash
     psql -U <usuario> -d proyectoweb -f database/db.sql
     ```

4. **Variables de entorno:**
   - Crea `.env` en la raíz:
     ```env
     PORT=4000
     DB_USER=tu_usuario
     DB_PASSWORD=tu_password
     DB_HOST=localhost
     DB_PORT=5432
     DB_DATABASE=proyectoweb
     JWT_SECRET=tu_clave_secreta
     ```

5. **Inicia el backend:**

   ```bash
   npm run dev
   ```

   El backend estará en `http://localhost:4000`.

6. **Inicia el frontend:**
   ```bash
   npm run dev:frontend
   ```
   El frontend estará en `http://localhost:5173` (por defecto).

## Estructura del proyecto

```
ProyectoWeb/
├── database/
│   └── db.sql
├── frontend/
│   ├── src/
│   └── ...
├── src/
│   ├── config.js
│   ├── db.js
│   ├── server.js
│   ├── controllers/
│   │   ├── daemon.controllers.js
│   │   ├── user.controllers.js
│   │   └── ...
│   └── routes/
│       ├── daemon.routes.js
│       ├── user.routes.js
│       └── ...
└── package.json
```

## Endpoints principales (RESTful)

- **Usuarios**
  - `GET /users` — Listar usuarios
  - `POST /users` — Crear usuario
  - `PUT /users/:id` — Actualizar usuario
  - `DELETE /users/:id` — Eliminar usuario
- **Demonios**
  - `GET /daemon` — Listar daemons
  - `POST /daemon` — Crear daemon
  - `GET /daemon/id/:id` — Buscar daemon por ID
  - `GET /daemon/name/:name` — Buscar daemon por nombre
  - `PUT /daemon/name/:name` — Editar daemon
  - `DELETE /daemon/name/:name` — Eliminar daemon
- **Relaciones usuario-daemon**
  - `GET /daemonUsers/:user_id` — Demonios de un usuario
  - `POST /daemonUsers/:user_id/:daemon_id` — Asignar daemon a usuario
  - `DELETE /daemonUsers/:user_id/:daemon_id` — Desasignar daemon
- **Auth**
  - `POST /auth/login` — Login
  - `POST /auth/logout` — Logout
  - `GET /auth/me` — Usuario autenticado
---
