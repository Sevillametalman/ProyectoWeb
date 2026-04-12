<template>
  <div class="login-bg">
    <!-- Animated grid background -->
    <div class="grid-overlay"></div>

    <div class="login-wrapper">
      <!-- Logo / Brand -->
      <div class="brand">
        <div class="brand-hex">⬡</div>
        <div class="brand-text">
          <span class="brand-name">ProyectoWeb</span>
          <span class="brand-sub text-white!"
            >Sistema de Control de Daemons</span
          >
        </div>
      </div>

      <!-- Card -->
      <div class="login-card">
        <div class="card-bar"></div>

        <div class="card-header">
          <span class="terminal-prompt">user@sys:~$</span>
          <span class="terminal-cmd">authenticate --session</span>
          <span class="cursor">▊</span>
        </div>

        <div class="card-body">
          <!-- Email -->
          <div class="field">
            <label class="field-label">
              <span class="label-icon">◈</span> Nombre de usuario
            </label>
            <div
              class="input-wrap"
              :class="{
                'input-wrap--focus': focusEmail,
                'input-wrap--error': !!error,
              }"
            >
              <input
                ref="emailRef"
                v-model="form.username"
                class="field-input"
                type="text"
                autocomplete="username"
                @focus="focusEmail = true"
                @blur="focusEmail = false"
                @keyup.enter="$refs.passRef.focus()"
              />
            </div>
          </div>

          <!-- Password -->
          <div class="field">
            <label class="field-label">
              <span class="label-icon">◉</span> Contraseña
            </label>
            <div
              class="input-wrap"
              :class="{
                'input-wrap--focus': focusPass,
                'input-wrap--error': !!error,
              }"
            >
              <input
                ref="passRef"
                v-model="form.password"
                class="field-input"
                :type="showPass ? 'text' : 'password'"
                placeholder="••••••••••••"
                autocomplete="current-password"
                @focus="focusPass = true"
                @blur="focusPass = false"
                @keyup.enter="submit"
              />
              <button
                class="toggle-pass"
                tabindex="-1"
                @click="showPass = !showPass"
              >
                {{ showPass ? "◔" : "●" }}
              </button>
            </div>
          </div>

          <!-- Error message -->
          <transition name="err">
            <div v-if="error" class="error-msg"><span>✖</span> {{ error }}</div>
          </transition>

          <!-- Submit -->
          <button
            class="btn-login"
            :class="{ 'btn-login--loading': loading }"
            :disabled="loading"
            @click="submit"
          >
            <span v-if="!loading" class="btn-inner">
              <span>iniciar sesión</span>
              <span class="btn-arrow">→</span>
            </span>
            <span v-else class="btn-inner">
              <span class="spinner"></span>
              <span>autenticando...</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "@/api/index.js";
import { useAuth } from "@/stores/auth.js";

const router = useRouter();
const { setSession } = useAuth();

const form = ref({ username: "", password: "" });
const loading = ref(false);
const error = ref(null);
const showPass = ref(false);
const focusEmail = ref(false);
const focusPass = ref(false);
const emailRef = ref(null);
const passRef = ref(null);

async function submit() {
  error.value = null;

  if (!form.value.username.trim() || !form.value.password.trim()) {
    error.value = "Completa todos los campos.";
    return;
  }

  loading.value = true;
  try {
    const res = await login(form.value);

    // Acepta { token } o { jwt } o { accessToken } o token directo como string
    const jwt =
      res?.token ||
      res?.jwt ||
      res?.accessToken ||
      (typeof res === "string" ? res : null);

    if (!jwt) {
      error.value = res?.message || res?.error || "Credenciales incorrectas.";
      return;
    }

    setSession(jwt, res?.user || null);
    router.push({ name: "dashboard" });
  } catch {
    error.value = "No se pudo conectar con el servidor.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* ── Layout ──────────────────────────────── */
.login-bg {
  min-height: 100vh;
  background: #070910;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "JetBrains Mono", monospace;
  position: relative;
  overflow: hidden;
}

/* Grid background */
.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 229, 160, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 229, 160, 0.04) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
}
.grid-overlay::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 60% 60% at 50% 50%,
    transparent 30%,
    #070910 100%
  );
}

.login-wrapper {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: min(420px, 92vw);
}

/* ── Brand ───────────────────────────────── */
.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.brand-hex {
  font-size: 2rem;
  color: #00e5a0;
  filter: drop-shadow(0 0 12px rgba(0, 229, 160, 0.5));
  animation: pulse 3s ease-in-out infinite;
}
@keyframes pulse {
  0%,
  100% {
    filter: drop-shadow(0 0 8px rgba(0, 229, 160, 0.4));
  }
  50% {
    filter: drop-shadow(0 0 18px rgba(0, 229, 160, 0.8));
  }
}
.brand-text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
.brand-name {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: #e2e8f0;
}
.brand-sub {
  font-size: 0.77rem;
  color: #747b86;
  letter-spacing: 0.1em;
}

/* ── Card ────────────────────────────────── */
.login-card {
  width: 100%;
  background: #0d1117;
  border: 1px solid #1e2530;
  position: relative;
  animation: cardIn 0.4s ease both;
}
@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-bar {
  height: 3px;
  background: linear-gradient(90deg, #00e5a0, #0090ff, #a855f7);
}

.card-header {
  padding: 0.9rem 1.25rem;
  border-bottom: 1px solid #1e2530;
  font-size: 0.72rem;
  color: #4a5568;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.terminal-prompt {
  color: #00e5a0;
}
.terminal-cmd {
  color: #c8d0dc;
}
.cursor {
  color: #00e5a0;
  animation: blink 0.9s step-end infinite;
}
@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.card-body {
  padding: 1.75rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

/* ── Fields ──────────────────────────────── */
.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.field-label {
  font-size: 0.8rem;
  letter-spacing: 0.15em;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}
.label-icon {
  color: #00e5a0;
}

.input-wrap {
  display: flex;
  align-items: center;
  border: 1px solid #1e2530;
  background: #070910;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
.input-wrap--focus {
  border-color: #00e5a0;
  box-shadow: 0 0 0 2px rgba(0, 229, 160, 0.08);
}
.input-wrap--error {
  border-color: #ff4466;
}

.field-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #c8d0dc;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.82rem;
  padding: 0.65rem 0.85rem;
}
.field-input::placeholder {
  color: #2d3748;
}

.toggle-pass {
  background: transparent;
  border: none;
  color: #4a5568;
  cursor: pointer;
  padding: 0 0.75rem;
  font-size: 0.8rem;
  transition: color 0.2s;
}
.toggle-pass:hover {
  color: #c8d0dc;
}

/* ── Error ───────────────────────────────── */
.error-msg {
  font-size: 0.73rem;
  color: #ff4466;
  background: rgba(255, 68, 102, 0.08);
  border: 1px solid rgba(255, 68, 102, 0.2);
  padding: 0.5rem 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.err-enter-active,
.err-leave-active {
  transition: all 0.2s ease;
}
.err-enter-from,
.err-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ── Button ──────────────────────────────── */
.btn-login {
  width: 100%;
  background: #00e5a0;
  color: #000;
  border: none;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 0.8rem;
  cursor: pointer;
  transition:
    opacity 0.2s,
    transform 0.1s;
  margin-top: 0.25rem;
}
.btn-login:hover:not(:disabled) {
  opacity: 0.88;
}
.btn-login:active:not(:disabled) {
  transform: scale(0.99);
}
.btn-login:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-login--loading {
  background: #1e2530;
  color: #4a5568;
}

.btn-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
}
.btn-arrow {
  transition: transform 0.2s;
}
.btn-login:hover .btn-arrow {
  transform: translateX(4px);
}

.spinner {
  width: 13px;
  height: 13px;
  border: 2px solid #2d3748;
  border-top-color: #00e5a0;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── Footer ──────────────────────────────── */
.card-footer {
  padding: 0.65rem 1.25rem;
  border-top: 1px solid #1e2530;
  font-size: 0.62rem;
  color: #2d3748;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  letter-spacing: 0.08em;
}
.footer-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #2d3748;
}
</style>
