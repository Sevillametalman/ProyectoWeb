<template>
  <div class="daemon-panel">
    <!-- Header -->
    <div class="panel-header">
      <div class="header-left">
        <span class="status-dot" :class="{ active: !loading }"></span>
        <span class="panel-title">DAEMONs MONITOR</span>
        <span class="pid-badge">PID::{{ daemons.length }}</span>
      </div>
      <div class="header-right">
        <input
          v-model="search"
          class="search-input"
          placeholder="buscar Daemons..."
          @input="filterDaemons"
        />
        <button class="btn-primary" @click="showForm = !showForm">
          {{ showForm ? "✕ cancelar" : "+ spawn" }}
        </button>
        <button class="btn-ghost" @click="fetchDaemons">↺ sync</button>
      </div>
    </div>

    <!-- New Daemon Form -->
    <transition name="slide-down">
      <div v-if="showForm" class="spawn-form">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">nombre del Daemons</label>
            <input
              v-model="newDaemon.name"
              class="form-input"
              placeholder="ej: worker-01"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Tipo</label>
            <input v-model="newDaemon.description" class="form-input" />
          </div>
          <!-- <div class="form-group form-group--sm">
            <label class="form-label">estado</label>
            <select v-model="newDaemon.status" class="form-input">
              <option value="active">active</option>
              <option value="idle">idle</option>
              <option value="stopped">stopped</option>
            </select>
          </div> -->
          <button class="btn-spawn" :disabled="spawning" @click="spawnDaemon">
            {{ spawning ? "..." : "spawn" }}
          </button>
        </div>
        <p v-if="formError" class="form-error">⚠ {{ formError }}</p>
      </div>
    </transition>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <span class="loader"></span>
      <span>inicializando procesos...</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state">
      <span class="error-icon">✖</span>
      <span>{{ error }}</span>
      <button class="btn-ghost" @click="fetchDaemons">reintentar</button>
    </div>

    <!-- Empty -->
    <div v-else-if="filtered.length === 0" class="empty-state">
      <span>[ sin procesos activos ]</span>
    </div>

    <!-- Daemon Table -->
    <div v-else class="daemon-table">
      <div class="table-header">
        <span>ID</span>
        <span>NOMBRE</span>
        <span>DESCRIPCIÓN</span>
        <span>ESTADO</span>
        <span>ACCIONES</span>
      </div>
      <transition-group name="row" tag="div">
        <div
          v-for="daemon in filtered"
          :key="daemon.id"
          class="table-row"
          :class="`row--${daemon.status || 'idle'}`"
        >
          <span class="cell cell--id">#{{ daemon.id }}</span>
          <span class="cell cell--name">{{ daemon.name }}</span>
          <span class="cell cell--desc">{{ daemon.description || "—" }}</span>
          <span class="cell">
            <span
              class="status-badge"
              :class="`badge--${daemon.status || 'idle'}`"
            >
              {{ daemon.status || "idle" }}
            </span>
          </span>
          <span class="cell cell--actions">
            <button
              class="btn-icon text-white!"
              title="Ver detalle"
              @click="viewDaemon(daemon)"
            >
              ⊕
            </button>
            <button
              class="btn-icon btn-icon--danger text-white!"
              title="Eliminar"
              @click="killDaemon(daemon.id)"
            >
              ✕
            </button>
          </span>
        </div>
      </transition-group>
    </div>

    <!-- Detail Modal -->
    <transition name="fade">
      <div
        v-if="selectedDaemon"
        class="modal-overlay"
        @click.self="selectedDaemon = null"
      >
        <div class="modal">
          <div class="modal-header">
            <span>Daemon :: {{ selectedDaemon.name }}</span>
            <button class="btn-icon" @click="selectedDaemon = null">✕</button>
          </div>
          <div class="modal-body">
            <div
              v-for="(val, key) in selectedDaemon"
              :key="key"
              class="modal-row"
            >
              <span class="modal-key">{{ key }}</span>
              <span class="modal-val">{{ val }}</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getDaemons, createDaemon, deleteDaemon } from "@/api/index.js";

const daemons = ref([]);
const filtered = ref([]);
const loading = ref(false);
const error = ref(null);
const search = ref("");
const showForm = ref(false);
const spawning = ref(false);
const formError = ref(null);
const selectedDaemon = ref(null);

const newDaemon = ref({ name: "", description: "", status: "active" });

async function fetchDaemons() {
  loading.value = true;
  error.value = null;
  try {
    daemons.value = await getDaemons();
    filtered.value = [...daemons.value];
  } catch (e) {
    error.value = "No se pudo conectar con el servidor.";
  } finally {
    loading.value = false;
  }
}

function filterDaemons() {
  const q = search.value.toLowerCase();
  filtered.value = daemons.value.filter(
    (d) =>
      d.name?.toLowerCase().includes(q) ||
      d.description?.toLowerCase().includes(q),
  );
}

async function spawnDaemon() {
  formError.value = null;
  if (!newDaemon.value.name.trim()) {
    formError.value = "El nombre del proceso es requerido.";
    return;
  }
  spawning.value = true;
  try {
    await createDaemon(newDaemon.value);
    newDaemon.value = { name: "", description: "", status: "active" };
    showForm.value = false;
    await fetchDaemons();
  } catch (e) {
    formError.value = "Error al crear el daemon.";
  } finally {
    spawning.value = false;
  }
}

async function killDaemon(id) {
  if (!confirm(`¿Terminar proceso #${id}?`)) return;
  try {
    await deleteDaemon(id);
    await fetchDaemons();
  } catch {
    alert("No se pudo eliminar el proceso.");
  }
}

function viewDaemon(daemon) {
  selectedDaemon.value = daemon;
}

onMounted(fetchDaemons);
</script>

<style scoped>
/* ── Variables ─────────────────────────────── */
.daemon-panel {
  --bg: transparent;
  --surface: #111418;
  --border: #1e2530;
  --accent: #00e5a0;
  --accent2: #0090ff;
  --danger: #ff4466;
  --warn: #ffb020;
  --text: #c8d0dc;
  --muted: #4a5568;
  --font: "JetBrains Mono", monospace;

  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  min-height: 100%;
  padding: 1.5rem;
}

/* ── Header ──────────────────────────────── */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 1.25rem;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--muted);
  transition: background 0.4s;
}
.status-dot.active {
  background: var(--accent);
  box-shadow: 0 0 6px var(--accent);
}

.panel-title {
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--accent);
}
.pid-badge {
  font-size: 0.7rem;
  color: var(--muted);
  border: 1px solid var(--border);
  padding: 0.15rem 0.5rem;
  border-radius: 2px;
}

/* ── Inputs / Buttons ────────────────────── */
.search-input {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
  font-family: var(--font);
  font-size: 0.75rem;
  padding: 0.35rem 0.75rem;
  outline: none;
  width: 180px;
  transition: border-color 0.2s;
}
.search-input:focus {
  border-color: var(--accent2);
}
.search-input::placeholder {
  color: var(--muted);
}

.btn-primary {
  background: var(--accent);
  color: #000;
  border: none;
  font-family: var(--font);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.4rem 0.9rem;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-primary:hover {
  opacity: 0.85;
}

.btn-ghost {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--muted);
  font-family: var(--font);
  font-size: 0.75rem;
  padding: 0.35rem 0.75rem;
  cursor: pointer;
  transition:
    color 0.2s,
    border-color 0.2s;
}
.btn-ghost:hover {
  color: var(--text);
  border-color: var(--text);
}

.btn-icon {
  background: transparent;
  border: none;
  color: var(--muted);
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0.2rem 0.35rem;
  transition: color 0.2s;
}
.btn-icon:hover {
  color: var(--accent2);
}
.btn-icon--danger:hover {
  color: var(--danger);
}

/* ── Spawn Form ──────────────────────────── */
.spawn-form {
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  padding: 1rem;
  margin-bottom: 1.25rem;
}
.form-row {
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
  min-width: 140px;
}
.form-group--sm {
  flex: 0 0 120px;
  min-width: 100px;
}
.form-label {
  font-size: 0.65rem;
  color: var(--muted);
  letter-spacing: 0.1em;
}
.form-input {
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--text);
  font-family: var(--font);
  font-size: 0.8rem;
  padding: 0.4rem 0.6rem;
  outline: none;
  transition: border-color 0.2s;
}
.form-input:focus {
  border-color: var(--accent);
}
.form-input option {
  background: var(--bg);
}
.btn-spawn {
  background: var(--accent);
  color: #000;
  border: none;
  font-family: var(--font);
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.4rem 1.2rem;
  cursor: pointer;
  height: 2rem;
  align-self: flex-end;
}
.btn-spawn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.form-error {
  font-size: 0.75rem;
  color: var(--danger);
  margin-top: 0.5rem;
}

/* ── States ──────────────────────────────── */
.loading-state,
.error-state,
.empty-state {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
  color: var(--muted);
  font-size: 0.8rem;
  justify-content: center;
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
.error-icon {
  color: var(--danger);
}

/* ── Table ───────────────────────────────── */
.daemon-table {
  border: 1px solid var(--border);
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 60px 1fr 2fr 100px 90px;
  padding: 0.5rem 1rem;
  background: var(--surface);
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  color: #fff;
  border-bottom: 1px solid var(--border);
}

.table-row {
  display: grid;
  grid-template-columns: 60px 1fr 2fr 100px 90px;
  padding: 0.6rem 1rem;
  border-bottom: 1px solid var(--border);
  align-items: center;
  transition: background 0.15s;
}
.table-row:last-child {
  border-bottom: none;
}
.table-row:hover {
  background: rgba(255, 255, 255, 0.025);
}
.row--active {
  border-left: 2px solid var(--accent);
}
.row--stopped {
  border-left: 2px solid var(--danger);
  opacity: 0.7;
}
.row--idle {
  border-left: 2px solid var(--warn);
}

.cell {
  font-size: 0.8rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #fff;
}
.cell--id {
  color: #fff;
}
.cell--name {
  color: #32496b;
  font-weight: 600;
}
.cell--desc {
  color: #fff;
  font-size: 0.75rem;
}
.cell--actions {
  display: flex;
  gap: 0.25rem;
}

.status-badge {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 0.15rem 0.5rem;
  border-radius: 2px;
}
.badge--active {
  background: rgba(0, 229, 160, 0.12);
  color: var(--accent);
  border: 1px solid rgba(0, 229, 160, 0.3);
}
.badge--stopped {
  background: rgba(255, 68, 102, 0.12);
  color: var(--danger);
  border: 1px solid rgba(255, 68, 102, 0.3);
}
.badge--idle {
  background: rgba(255, 176, 32, 0.12);
  color: var(--warn);
  border: 1px solid rgba(255, 176, 32, 0.3);
}

/* ── Modal ───────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(4px);
}
.modal {
  background: var(--surface);
  border: 1px solid var(--border);
  border-top: 3px solid var(--accent2);
  width: min(480px, 90vw);
  max-height: 70vh;
  overflow-y: auto;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--accent2);
  letter-spacing: 0.1em;
}
.modal-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.modal-row {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
}
.modal-key {
  color: var(--muted);
  min-width: 110px;
  font-size: 0.75rem;
}
.modal-val {
  color: var(--text);
  word-break: break-all;
}

/* ── Transitions ─────────────────────────── */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.row-enter-active {
  transition: all 0.25s ease;
}
.row-enter-from {
  opacity: 0;
  transform: translateX(-12px);
}
.row-leave-active {
  transition: all 0.2s ease;
  position: absolute;
  width: 100%;
}
.row-leave-to {
  opacity: 0;
  transform: translateX(12px);
}
</style>
