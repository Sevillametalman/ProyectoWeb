# Proyecto Web: Gestión de Daemons y Usuarios

## Requisitos previos

- Node.js (v16 o superior recomendado)
- PostgreSQL
- Git

## Instalación y configuración

1. **Clona el repositorio:**
   ```bash
   git clone <URL-del-repositorio>
   cd ProyectoWeb
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura la base de datos:**
   - Crea una base de datos en PostgreSQL (por ejemplo, `proyectoweb`).
   - Modifica la configuración de conexión en `src/db.js` si es necesario.
   - Ejecuta el script de creación de tablas:
     ```bash
     psql -U <usuario> -d proyectoweb -f database/db.sql
     ```

4. **Configura las variables de entorno:**
   - Crea un archivo `.env` en la raíz del proyecto si es necesario.
   - Ejemplo de variables:
     ```env
     PORT=4000
     DB_USER=tu_usuario
     DB_PASSWORD=tu_password
     DB_HOST=localhost
     DB_PORT=5432
     DB_DATABASE=proyectoweb
     ```

5. **Inicia el servidor:**
   ```bash
   npm start
   ```
   El servidor estará disponible en `http://localhost:4000`.

## Estructura del proyecto

```
ProyectoWeb/
├── database/
│   └── db.sql
├── public/
├── src/
│   ├── config.js
│   ├── db.js
│   ├── server.js
│   ├── controllers/
│   │   ├── daemon.controllers.js
│   │   └── user.controllers.js
│   └── routes/
│       ├── daemon.routes.js
│       └── user.routes.js
└── package.json
```

## Endpoints principales

- **Usuarios**
  - `GET /users` — Obtener todos los usuarios
  - `POST /users` — Crear usuario
  - ...
- **Daemons**
  - `GET /daemon` — Obtener todos los daemons
  - `POST /daemon` — Crear daemon
  - `GET /daemon/id/:id` — Buscar daemon por ID
  - `GET /daemon/name/:name` — Buscar daemon por nombre
  - ...

## Notas
- Usa Postman o similar para probar los endpoints.
- Asegúrate de que la base de datos esté corriendo antes de iniciar el servidor.
- Si tienes problemas de conexión, revisa la configuración en `src/db.js` y las variables de entorno.

---

¡Listo! Ahora puedes empezar a trabajar en el proyecto.
