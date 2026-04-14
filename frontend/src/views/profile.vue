<template>
  <div class="profile-page">
    <!-- Page header -->
    <div class="page-header">
      <div class="header-left">
        <button class="btn-back" @click="router.push({ name: 'dashboard' })">
          ← volver
        </button>
        <div class="header-title">
          <span class="header-icon">◎</span>
          <span>PERFIL DE USUARIO</span>
          <span class="uid-badge">uid:{{ profile.id || "—" }}</span>
        </div>
      </div>
      <div class="header-meta">
        <span class="meta-item">
          <span class="meta-dot meta-dot--green"></span>sesión activa
        </span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="state-full">
      <span class="loader"></span>
      <span>cargando perfil...</span>
    </div>

    <!-- Error loading -->
    <div v-else-if="loadError" class="state-full state-full--error">
      <span>✖ {{ loadError }}</span>
      <button class="btn-ghost" @click="fetchProfile">reintentar</button>
    </div>

    <!-- Content -->
    <div v-else class="profile-layout">
      <!-- LEFT: Avatar + info rápida -->
      <aside class="profile-aside">
        <div class="avatar-card">
          <div class="avatar-hex">
            <span class="avatar-initials">{{ initials }}</span>
          </div>
          <div class="avatar-name">{{ profile.username || "—" }}</div>
          <div class="avatar-email">Entrenador</div>
          <span class="role-badge role">
            {{ profile.admin ? "Admin" : "User" }}
          </span>
        </div>

        <!-- Quick stats -->
        <div class="stats-card">
          <div class="stat-row">
            <span class="stat-label">▸ ID</span>
            <span class="stat-val">#{{ profile.id }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">▸ ROL</span>
            <span class="stat-val">{{ profile.admin ? "Admin" : "User" }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">▸ ESTADO</span>
            <span class="stat-val stat-val--green">activo</span>
          </div>
        </div>

        <!-- Danger zone -->
        <div class="danger-card">
          <div class="danger-title">
            <span class="danger-icon">⚠</span> ZONA DE PELIGRO
          </div>
          <p class="danger-desc">
            Cerrar sesión eliminará el token de acceso del almacenamiento local.
          </p>
          <button class="btn-danger-full" @click="handleLogout">
            ⏻ cerrar sesión
          </button>
        </div>
      </aside>

      <!-- RIGHT: Edit form -->
      <main class="profile-main">
        <!-- Section: Datos personales -->
        <section class="form-section">
          <div class="section-header">
            <span class="section-dot"></span>
            <span class="section-title">DATOS PERSONALES</span>
            <span class="section-line"></span>
          </div>

          <div class="gap-6 flex">
            <!-- Nombre -->
            <div class="field">
              <label class="field-label">
                <span class="lbl-icon">◈</span> NOMBRE COMPLETO
              </label>
              <div
                class="input-wrap"
                :class="{
                  'input-wrap--focus': focus.name,
                  'input-wrap--changed': isDirty('username'),
                }"
              >
                <input
                  v-model="form.username"
                  class="field-input"
                  type="text"
                  placeholder="Nombre completo"
                  :disabled="saving"
                  @focus="focus.name = true"
                  @blur="focus.name = false"
                />
                <span
                  v-if="isDirty('username')"
                  class="changed-dot"
                  title="Campo modificado"
                  >●</span
                >
              </div>
            </div>

            <!-- Role (read-only) -->
            <div class="field">
              <label class="field-label">
                <span class="lbl-icon">◉</span> ROL DEL SISTEMA
                <span class="lbl-hint">[ solo lectura ]</span>
              </label>
              <div class="input-wrap input-wrap--readonly">
                <input
                  :value="profile.admin ? 'Admin' : 'User'"
                  class="field-input"
                  type="text"
                  disabled
                />
                <span class="lock-icon">🔒</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Section: Seguridad -->
        <section class="form-section">
          <div class="section-header">
            <span class="section-dot section-dot--blue"></span>
            <span class="section-title">SEGURIDAD</span>
            <span class="section-line"></span>
          </div>

          <div class="pass-notice" v-if="!changePass">
            <span class="notice-icon">◉</span>
            <span class="text-base">Contraseña establecida — </span>
            <button class="btn-link" @click="changePass = true">
              cambiar contraseña
            </button>
          </div>

          <transition name="slide-down">
            <div v-if="changePass" class="fields-grid">
              <!-- Nueva contraseña -->
              <div class="field">
                <label class="field-label">
                  <span class="lbl-icon">◈</span> NUEVA CONTRASEÑA
                </label>
                <div
                  class="input-wrap"
                  :class="{ 'input-wrap--focus': focus.password }"
                >
                  <input
                    v-model="form.password"
                    class="field-input"
                    :type="showPass ? 'text' : 'password'"
                    :disabled="saving"
                    @focus="focus.password = true"
                    @blur="focus.password = false"
                  />
                  <button
                    class="toggle-btn"
                    tabindex="-1"
                    @click="showPass = !showPass"
                  >
                    {{ showPass ? "◔" : "●" }}
                  </button>
                </div>
              </div>

              <!-- Confirmar -->
              <div class="field">
                <label class="field-label">
                  <span class="lbl-icon">◈</span> CONFIRMAR CONTRASEÑA
                  <span v-if="passMatchError" class="lbl-error">{{
                    passMatchError
                  }}</span>
                </label>
                <div
                  class="input-wrap"
                  :class="{
                    'input-wrap--focus': focus.confirm,
                    'input-wrap--error': !!passMatchError,
                    'input-wrap--ok': form.confirmPassword && !passMatchError,
                  }"
                >
                  <input
                    v-model="form.confirmPassword"
                    class="field-input"
                    :type="showPass ? 'text' : 'password'"
                    placeholder="repite la contraseña"
                    :disabled="saving"
                    @focus="focus.confirm = true"
                    @blur="focus.confirm = false"
                  />
                  <span
                    v-if="form.confirmPassword && !passMatchError"
                    class="ok-icon"
                    >✓</span
                  >
                </div>
              </div>

              <div class="field-action">
                <button class="btn-ghost-sm" @click="cancelPassword">
                  ✕ cancelar
                </button>
              </div>
            </div>
          </transition>
        </section>

        <!-- Toast / feedback -->
        <transition name="toast">
          <div v-if="toast.show" class="toast" :class="`toast--${toast.type}`">
            <span>{{ toast.type === "success" ? "✔" : "✖" }}</span>
            <span>{{ toast.message }}</span>
          </div>
        </transition>

        <!-- Actions -->
        <div class="form-actions">
          <div class="actions-right">
            <button
              v-if="hasChanges"
              class="btn-ghost"
              :disabled="saving"
              @click="resetForm"
            >
              ↺ descartar
            </button>
            <button
              class="btn-save"
              :class="{ 'btn-save--loading': saving }"
              :disabled="saving || !hasChanges || !!passMatchError"
              @click="saveProfile"
            >
              <span v-if="!saving" class="btn-inner"> ✔ guardar cambios </span>
              <span v-else class="btn-inner">
                <span class="spinner"></span> guardando...
              </span>
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/stores/auth.js";
import { updateUser } from "@/api/index.js";

const router = useRouter();
const { user, clearSession } = useAuth();

// ── State ───────────────────────────────────────────
const loading = ref(false);
const loadError = ref(null);
const saving = ref(false);
const showPass = ref(false);
const changePass = ref(false);

const profile = ref({}); // datos originales del backend
const form = reactive({
  // copia editable
  username: "",
  password: "",
  admin: false,
  confirmPassword: "",
  passwordSecurity: "",
});
const focus = reactive({
  username: false,
  password: false,
  confirm: false,
});
const toast = reactive({ show: false, type: "success", message: "" });

// ── Computed ────────────────────────────────────────
const initials = computed(() => {
  const n = profile.value.username || "";
  return (
    n
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
});

const passMatchError = computed(() => {
  if (!form.confirmPassword) return null;
  return form.password !== form.confirmPassword
    ? "Las contraseñas no coinciden"
    : null;
});

function isDirty(field) {
  return form[field] !== (profile.value[field] ?? "");
}

const dirtyFields = computed(() => ["name", "email"].filter((f) => isDirty(f)));

const hasChanges = computed(
  () => dirtyFields.value.length > 0 || (changePass.value && !!form.password),
);

const dirtyCount = computed(
  () => dirtyFields.value.length + (changePass.value && form.password ? 1 : 0),
);

// ── Methods ─────────────────────────────────────────
async function fetchProfile() {
  loading.value = true;
  loadError.value = null;
  try {
    // Toma los datos del store (ya hidratados en el login)
    // Si el store está vacío, puedes hacer GET /users/:id
    const stored = user.value;
    if (!stored) throw new Error("Sin datos de sesión.");
    profile.value = { ...stored };
    form.admin = profile.value.admin;

    resetForm();
  } catch (e) {
    loadError.value = e.message || "No se pudo cargar el perfil.";
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  form.username = profile.value.username || "";
  form.admin = profile.value.admin;
  form.password = "";
  form.confirmPassword = "";
  changePass.value = false;
  showPass.value = false;
}

function cancelPassword() {
  form.password = "";
  form.confirmPassword = "";
  changePass.value = false;
}

async function saveProfile() {
  if (passMatchError.value) return;
  saving.value = true;

  try {
    const payload = {};
    payload.username = form.username;
    payload.admin = form.admin;
    if (changePass.value && form.password) payload.password = form.password;
    const updated = await updateUser(profile.value.id, payload);
    // Actualiza el perfil local con la respuesta
    profile.value = { ...profile.value, ...updated };
    resetForm();
    showToast("success", "Perfil actualizado correctamente.");
    /* actualizar useAuth*/
    user.value = { ...user.value, ...updated };
    /* actualizar localstorage */
    localStorage.setItem("user", JSON.stringify(user.value));
  } catch {
    showToast("error", "No se pudo guardar. Intenta de nuevo.");
  } finally {
    saving.value = false;
  }
}

function handleLogout() {
  clearSession();
  router.push({ name: "login" });
}

function showToast(type, message) {
  toast.show = true;
  toast.type = type;
  toast.message = message;
  setTimeout(() => {
    toast.show = false;
  }, 3500);
}

onMounted(fetchProfile);
</script>

<style scoped>
/* ── Variables ─────────────────────── */
.profile-page {
  --bg: #0a0c10;
  --surface: #111418;
  --surface2: #0d1117;
  --border: #1e2530;
  --accent: #00e5a0;
  --blue: #0090ff;
  --danger: #ff4466;
  --warn: #ffb020;
  --purple: #a855f7;
  --text: #ffffff;
  --muted: #ffffff;
  --font: "JetBrains Mono", monospace;
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  min-height: 100%;
  padding: 1.75rem 2rem;
  box-sizing: border-box;
}

/* ── Page header ───────────────────── */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}
.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.btn-back {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--muted);
  font-family: var(--font);
  font-size: 1rem;
  padding: 0.3rem 0.7rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-back:hover {
  color: var(--text);
  border-color: var(--text);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: var(--accent);
}
.header-icon {
  font-size: 1rem;
}
.uid-badge {
  font-size: 0.65rem;
  font-weight: 400;
  color: var(--muted);
  border: 1px solid var(--border);
  padding: 0.12rem 0.45rem;
}
.header-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: var(--muted);
}
.meta-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.meta-dot--green {
  background: var(--accent);
  box-shadow: 0 0 5px rgba(0, 229, 160, 0.5);
  animation: pulse 2.5s ease-in-out infinite;
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* ── States ────────────────────────── */
.state-full {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 4rem;
  color: var(--muted);
  font-size: 0.8rem;
}
.state-full--error {
  color: var(--danger);
}
.loader {
  width: 14px;
  height: 14px;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── Layout ────────────────────────── */
.profile-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 1.5rem;
  align-items: start;
}
@media (max-width: 820px) {
  .profile-layout {
    grid-template-columns: 1fr;
  }
}

/* ── Aside ─────────────────────────── */
.profile-aside {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.avatar-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-top: 3px solid var(--accent);
  padding: 1.75rem 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  text-align: center;
}
.avatar-hex {
  width: 72px;
  height: 72px;
  background: linear-gradient(
    135deg,
    rgba(0, 229, 160, 0.15),
    rgba(0, 144, 255, 0.1)
  );
  border: 2px solid rgba(0, 229, 160, 0.3);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.25rem;
}
.avatar-initials {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--accent);
}
.avatar-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text);
}
.avatar-email {
  font-size: 0.7rem;
  color: var(--muted);
  word-break: break-all;
}

.role-badge {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 0.2rem 0.55rem;
  border-radius: 2px;
  margin-top: 0.25rem;
}

.role {
  background: rgba(0, 144, 255, 0.12);
  color: var(--blue);
  border: 1px solid rgba(0, 144, 255, 0.3);
}

.stats-card {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 0.9rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}
.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.45rem;
}
.stat-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.stat-label {
  color: var(--muted);
  letter-spacing: 0.08em;
}
.stat-val {
  color: var(--text);
  font-weight: 600;
}
.stat-val--green {
  color: var(--accent);
}

.danger-card {
  background: rgba(255, 68, 102, 0.04);
  border: 1px solid rgba(255, 68, 102, 0.2);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}
.danger-title {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--danger);
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.danger-icon {
  font-size: 0.85rem;
}
.danger-desc {
  font-size: 0.68rem;
  color: var(--muted);
  line-height: 1.5;
}
.btn-danger-full {
  width: 100%;
  background: transparent;
  border: 1px solid rgba(255, 68, 102, 0.4);
  color: var(--danger);
  font-family: var(--font);
  font-size: 1rem;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.08em;
}
.btn-danger-full:hover {
  background: rgba(255, 68, 102, 0.1);
  border-color: var(--danger);
}

/* ── Main form ─────────────────────── */
.profile-main {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-section {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 1.4rem 1.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.25rem;
}
.section-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
}
.section-dot--blue {
  background: var(--blue);
}
.section-title {
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: var(--muted);
}
.section-line {
  flex: 1;
  height: 1px;
  background: var(--border);
}

.fields-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

/* ── Field ─────────────────────────── */
.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.field-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  color: var(--muted);
}
.lbl-icon {
  color: var(--accent);
}
.lbl-hint {
  margin-left: auto;
  font-size: 0.75rem;
  color: #4a5464;
  letter-spacing: 0.06em;
}
.lbl-error {
  margin-left: auto;
  color: var(--danger);
  font-size: 0.85rem;
  letter-spacing: 0;
}

.input-wrap {
  display: flex;
  align-items: center;
  border: 1px solid var(--border);
  background: var(--bg);
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
.input-wrap--focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(0, 229, 160, 0.07);
}
.input-wrap--changed {
  border-color: var(--warn);
}
.input-wrap--error {
  border-color: var(--danger);
}
.input-wrap--ok {
  border-color: var(--accent);
}
.input-wrap--readonly {
  opacity: 0.45;
  cursor: not-allowed;
}

.field-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text);
  font-family: var(--font);
  font-size: 0.82rem;
  padding: 0.6rem 0.85rem;
}
.field-input:disabled {
  cursor: not-allowed;
}
.field-input::placeholder {
  color: #2d3748;
}

.changed-dot {
  color: var(--warn);
  padding-right: 0.7rem;
  font-size: 0.65rem;
}
.ok-icon {
  color: var(--accent);
  padding-right: 0.7rem;
  font-size: 0.8rem;
}
.lock-icon {
  padding-right: 0.75rem;
  font-size: 0.75rem;
  opacity: 0.4;
}
.toggle-btn {
  background: transparent;
  border: none;
  color: var(--muted);
  cursor: pointer;
  padding: 0 0.75rem;
  font-size: 0.8rem;
  transition: color 0.2s;
}
.toggle-btn:hover {
  color: var(--text);
}

/* Password section ─────────────────── */
.pass-notice {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--muted);
}
.notice-icon {
  color: var(--blue);
}
.btn-link {
  background: transparent;
  border: none;
  color: var(--blue);
  font-family: var(--font);
  font-size: 0.85rem;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
  padding: 0;
}
.btn-link:hover {
  color: var(--accent);
}

.field-action {
  display: flex;
  align-items: flex-end;
}
.btn-ghost-sm {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--muted);
  font-family: var(--font);
  font-size: 0.7rem;
  padding: 0.35rem 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-ghost-sm:hover {
  color: var(--danger);
  border-color: var(--danger);
}

/* ── Toast ─────────────────────────── */
.toast {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.78rem;
  padding: 0.65rem 1rem;
  border-left: 3px solid;
}
.toast--success {
  background: rgba(0, 229, 160, 0.07);
  border-color: var(--accent);
  color: var(--accent);
}
.toast--error {
  background: rgba(255, 68, 102, 0.07);
  border-color: var(--danger);
  color: var(--danger);
}
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ── Form actions ──────────────────── */
.form-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}
.actions-left {
  display: flex;
  align-items: center;
}
.actions-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.changes-hint {
  font-size: 0.7rem;
  color: var(--warn);
  letter-spacing: 0.05em;
}
.btn-ghost {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--muted);
  font-family: var(--font);
  font-size: 0.75rem;
  padding: 0.45rem 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-ghost:hover:not(:disabled) {
  color: var(--text);
  border-color: var(--text);
}
.btn-ghost:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-save {
  background: var(--accent);
  color: #000;
  border: none;
  font-family: var(--font);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 0.5rem 1.4rem;
  cursor: pointer;
  transition:
    opacity 0.2s,
    transform 0.1s;
}
.btn-save:hover:not(:disabled) {
  opacity: 0.87;
}
.btn-save:active:not(:disabled) {
  transform: scale(0.99);
}
.btn-save:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.btn-save--loading {
  background: var(--surface);
  color: var(--muted);
}

.btn-inner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.spinner {
  width: 11px;
  height: 11px;
  border: 2px solid #2d3748;
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* ── Transitions ───────────────────── */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
