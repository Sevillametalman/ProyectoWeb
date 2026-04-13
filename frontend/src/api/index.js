/* const BASE_URL = import.meta.env.VITE_API_URL || "" */
const BASE_URL = "http://localhost:4000";

// ── Helper: headers con JWT ───────────────────────────
function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ── Auth ──────────────────────────────────────────────
export const login = (credentials) =>
  fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  }).then((r) => r.json());

// ── Usuarios ──────────────────────────────────────────
export const getUsers = () =>
  fetch(`${BASE_URL}/users`, { headers: authHeaders() }).then((r) => r.json());
export const getUserById = (id) =>
  fetch(`${BASE_URL}/users/${id}`, { headers: authHeaders() }).then((r) =>
    r.json(),
  );

export const createUser = (data) =>
  fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const deleteUser = (id) =>
  fetch(`${BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  }).then((r) => r.json());
export const updateUser = (id, data) =>
  fetch(`${BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then((r) => r.json());

// ── Daemons ───────────────────────────────────────────
export const getDaemons = () =>
  fetch(`${BASE_URL}/daemon`, { headers: authHeaders() }).then((r) => r.json());

export const getDaemonById = (id) =>
  fetch(`${BASE_URL}/daemon/id/${id}`, { headers: authHeaders() }).then((r) =>
    r.json(),
  );

export const getDaemonByName = (name) =>
  fetch(`${BASE_URL}/daemon/name/${name}`, { headers: authHeaders() }).then(
    (r) => r.json(),
  );

export const createDaemon = (data) =>
  fetch(`${BASE_URL}/daemon`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const deleteDaemon = (id) =>
  fetch(`${BASE_URL}/daemon/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  }).then((r) => r.json());
