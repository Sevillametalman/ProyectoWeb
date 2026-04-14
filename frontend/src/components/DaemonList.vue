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
          placeholder="buscar Demonios..."
          @input="filterDaemons"
        />
        <button
          v-if="user.admin"
          class="btn-primary"
          @click="showForm = !showForm"
        >
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
            <label class="form-label text-base! text-white!"
              >Nombre del Demonio</label
            >
            <input v-model="newDaemon.name" class="form-input" placeholder="" />
          </div>
          <div class="form-group">
            <label class="form-label text-base! text-white!">Raza</label>

            <div class="form-group">
              <select v-model="newDaemon.race_id" class="form-input">
                <option v-for="race in races" :value="race.id">
                  {{ race.name }}
                </option>
              </select>
            </div>
          </div>

          <button class="btn-spawn" :disabled="spawning" @click="spawnDaemon">
            spawn
          </button>
        </div>
        <p v-if="formError" class="form-error">⚠ {{ formError }}</p>
        <div class="mt-4">
          <div class="flex w-full gap-x-4">
            <div class="flex flex-col">
              <div class="flex flex-col pb-1 w-52">
                <span class="text-gray-500 text-sm">Level:</span>
                <input
                  type="number"
                  v-model="newDaemon.level"
                  name=""
                  id=""
                  value="2"
                  class="form-input text-center"
                />
              </div>
            </div>
            <div class="flex flex-col">
              <div class="flex flex-col pb-1 w-52">
                <span class="text-gray-500 text-sm">HP:</span>
                <input
                  type="number"
                  v-model="newDaemon.HP"
                  name=""
                  id=""
                  value="2"
                  class="form-input text-center"
                />
              </div>
            </div>
            <div class="flex flex-col">
              <div class="flex flex-col pb-1 w-52">
                <span class="text-gray-500 text-sm">MP:</span>
                <input
                  type="number"
                  v-model="newDaemon.MP"
                  name=""
                  id=""
                  value="2"
                  class="form-input text-center"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <span class="">Estadisticas</span>
          <div class="grid grid-cols-2 gap-y-2 mt-4 justify-items-center">
            <div class="flex flex-col items-center pb-1 w-52">
              <span class="text-gray-500 text-sm">Strength:</span>
              <input
                type="number"
                v-model="newDaemon.strength"
                name=""
                id=""
                value="2"
                class="form-input ml-3 text-center"
              />
            </div>
            <div class="flex flex-col items-center pb-1 w-52">
              <span class="text-gray-500 text-sm">Intelligence:</span>
              <input
                type="number"
                v-model="newDaemon.intelligence"
                name=""
                id=""
                value="2"
                class="form-input ml-3 text-center"
              />
            </div>
            <div class="flex flex-col items-center pb-1 w-52">
              <span class="text-gray-500 text-sm">Magic:</span>
              <input
                type="number"
                v-model="newDaemon.magic"
                name=""
                id=""
                value="2"
                class="form-input ml-3 text-center"
              />
            </div>
            <div class="flex flex-col items-center pb-1 w-52">
              <span class="text-gray-500 text-sm">Vitality:</span>
              <input
                type="number"
                v-model="newDaemon.vitality"
                name=""
                id=""
                value="2"
                class="form-input ml-3 text-center"
              />
            </div>
            <div class="flex flex-col items-center pb-1 w-52">
              <span class="text-gray-500 text-sm">Agility:</span>
              <input
                type="number"
                v-model="newDaemon.agility"
                name=""
                id=""
                value="2"
                class="form-input ml-3 text-center"
              />
            </div>
            <div class="flex flex-col items-center pb-1 w-52">
              <span class="text-gray-500 text-sm">Luck:</span>
              <input
                type="number"
                v-model="newDaemon.luck"
                name=""
                id=""
                value="2"
                class="form-input ml-3 text-center"
              />
            </div>
          </div>
        </div>
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
    <div v-else class="daemon-table h-96! overflow-auto!">
      <div class="table-header text-base!">
        <span>ID</span>
        <span>NOMBRE</span>
        <span>RAZA</span>
        <span>NIVEL</span>
        <span>ACCIONES</span>
      </div>
      <transition-group name="row" tag="div">
        <div v-for="daemon in filtered" :key="daemon.id" class="table-row">
          <span class="cell text-base!">#{{ daemon.id }}</span>
          <span class="cell cell--name text-base!">{{ daemon.name }}</span>
          <span class="cell cell--desc text-base!">{{ daemon.race.name }}</span>
          <span class="cell">
            <span class="border border-[#1e2530] p-1 text-[#00ffaa] text-base">
              {{ daemon.level }}
            </span>
          </span>
          <span class="cell cell--actions">
            <button
              class="btn-icon text-white! text-xl! hover:text-[#0090ff]!"
              title="Ver detalle"
              @click="viewDaemon(daemon)"
            >
              ◎
            </button>
            <button
              v-if="user.admin"
              class="btn-icon btn-icon--danger text-white! text-xl! hover:text-[#00ffaa]!"
              title="Eliminar"
              @click="editDaemonModal(daemon.id)"
            >
              ✎
            </button>

            <button
              v-if="user.admin"
              class="btn-icon btn-icon--danger text-white! text-xl! hover:text-[#ff4466]!"
              title="Eliminar"
              @click="killDaemon(daemon.id)"
            >
              ✕
            </button>
          </span>
        </div>
      </transition-group>
    </div>
    <div class="daemon-table h-96! overflow-auto mt-4">
      <div class="p-4">
        <div class="header-left">
          <span class="status-dot" :class="{ active: !loading }"></span>
          <span class="panel-title">RAZAs MONITOR</span>
          <span class="pid-badge">PID::{{ races.length }}</span>
        </div>
      </div>
      <div class="table-header text-base!">
        <span>ID</span>
        <span>Raza</span>
      </div>
      <transition-group name="row" tag="div">
        <div v-for="race in races" :key="race.id" class="table-row">
          <span class="cell text-base!">#{{ race.id }}</span>
          <span class="cell cell--name text-base!">{{ race.name }}</span>
        </div>
      </transition-group>
    </div>

    <!-- Detail Modal -->
    <transition name="fade">
      <div v-if="viewModal && selectedDaemon" class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <span>Demonio :: {{ selectedDaemon.name }}</span>
            <button
              class="btn-icon"
              @click="
                selectedDaemon = null;
                viewModal = false;
              "
            >
              ✕
            </button>
          </div>
          <div class="modal-body">
            <daemonV :daemon="selectedDaemon"></daemonV>
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="deleteModal && selectedDaemon" class="modal-overlay">
        <div class="modal">
          <div class="modal-header text-red-500!">
            <span>Demonio :: {{ selectedDaemon.name }} </span>
            <button
              class="btn-icon"
              @click="
                selectedDaemon = null;
                deleteModal = false;
              "
            >
              ✕
            </button>
          </div>
          <div class="modal-body">
            <span class="text-center">
              ¿ Estas seguro que deseas eliminar este daemon ?
            </span>
            <div class="flex gap-2 justify-center">
              <button
                @click="
                  selectedDaemon = null;
                  deleteModal = false;
                "
                class="border border-[#1f2937] cursor-pointer hover:border-[#1f2937]/80 py-2 px-1"
              >
                Cancelar
              </button>
              <button
                @click="handleDelete()"
                class="border border-[#1f2937] cursor-pointer hover:border-red-500 py-2 px-1"
              >
                Eliminar Demonio
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="editModal && selectedDaemon" class="modal-overlay">
        <div class="modal">
          <div class="modal-header text-[#00ffaa]!">
            <span>Demonio :: {{ selectedDaemon.name }} </span>
            <button
              class="btn-icon"
              @click="
                selectedDaemon = null;
                editModal = false;
              "
            >
              ✕
            </button>
          </div>
          <div class="modal-body">
            <div class="p-6">
              <div class="flex items-center gap-5 mb-6">
                <div
                  class="relative w-20 h-20 bg-[#151b23] border border-[#1f2937] flex items-center justify-center shadow-inner"
                >
                  <span
                    class="text-[#00d8ff] opacity-50 text-3xl tracking-widest"
                    >◎</span
                  >
                  <div
                    class="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00d8ff]"
                  ></div>
                  <div
                    class="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00d8ff]"
                  ></div>
                </div>

                <div class="grow">
                  <div class="flex justify-between items-end mb-1">
                    <h2
                      class="text-base font-bold text-gray-100 uppercase tracking-wide"
                    >
                      Nombre:{{ selectedDaemon.name }}
                    </h2>

                    <span class="text-gray-600 text-xs"
                      >ID #{{ selectedDaemon.id }}</span
                    >
                  </div>
                  <p class="text-gray-400 text-xs mb-2">
                    Raza:
                    <span class="text-gray-200">{{
                      selectedDaemon.race?.name
                    }}</span>
                  </p>
                  Level:
                  <input
                    class="form-input"
                    type="number"
                    v-model="selectedDaemon.level"
                  />
                </div>
              </div>

              <div
                class="w-full border-t border-dashed border-[#1f2937] my-5"
              ></div>

              <div class="space-y-4 mb-6">
                <div>
                  <div class="flex justify-between text-xs mb-1">
                    <span class="text-gray-500 tracking-wider"
                      >HP
                      <span class="text-gray-700">
                        <input
                          class="form-input"
                          type="number"
                          v-model="selectedDaemon.hp"
                        /> </span
                    ></span>
                    <span class="text-[#00ffaa] font-bold"
                      >{{ selectedDaemon.hp }} / {{ selectedDaemon.hp }}</span
                    >
                  </div>
                  <div
                    class="w-full bg-[#151b23] h-1.5 border border-[#1f2937]"
                  >
                    <div
                      class="bg-[#00ffaa] h-full shadow-[0_0_5px_#00ffaa]"
                      style="width: 100%"
                    ></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-xs mb-1">
                    <span class="text-gray-500 tracking-wider"
                      >MP
                      <span class="text-gray-700">
                        <input
                          class="form-input"
                          type="number"
                          v-model="selectedDaemon.mp"
                        /> </span
                    ></span>
                    <span class="text-[#3b82f6] font-bold"
                      >{{ selectedDaemon.mp }} / {{ selectedDaemon.mp }}</span
                    >
                  </div>
                  <div
                    class="w-full bg-[#151b23] h-1.5 border border-[#1f2937]"
                  >
                    <div
                      class="bg-[#3b82f6] h-full shadow-[0_0_5px_#3b82f6] w-full"
                    ></div>
                  </div>
                </div>
              </div>

              <div class="bg-[#0f141b] border border-[#1f2937] p-4">
                <div class="grid grid-cols-2 gap-x-8 gap-y-3">
                  <div
                    class="flex justify-between items-center border-b border-[#1f2937] pb-1"
                  >
                    <span class="text-gray-500 text-xs">Strength</span>
                    <input
                      class="form-input w-20! text-end!"
                      type="number"
                      v-model="selectedDaemon.strength"
                    />
                  </div>

                  <div
                    class="flex justify-between items-center border-b border-[#1f2937] pb-1"
                  >
                    <span class="text-gray-500 text-xs">Intelligence</span>

                    <input
                      class="form-input w-20! text-end!"
                      type="number"
                      v-model="selectedDaemon.intelligence"
                    />
                  </div>

                  <div
                    class="flex justify-between items-center border-b border-[#1f2937] pb-1"
                  >
                    <span class="text-gray-500 text-xs">Magic</span>
                    <input
                      class="form-input w-20! text-end!"
                      type="number"
                      v-model="selectedDaemon.magic"
                    />
                  </div>

                  <div
                    class="flex justify-between items-center border-b border-[#1f2937] pb-1"
                  >
                    <span class="text-gray-500 text-xs">Vitality</span>
                    <input
                      class="form-input w-20! text-end!"
                      type="number"
                      v-model="selectedDaemon.vitality"
                    />
                  </div>

                  <div
                    class="flex justify-between items-center border-b border-[#1f2937] pb-1"
                  >
                    <span class="text-gray-500 text-xs">Agility</span>
                    <input
                      class="form-input w-20! text-end!"
                      type="number"
                      v-model="selectedDaemon.agility"
                    />
                  </div>

                  <div
                    class="flex justify-between items-center border-b border-[#1f2937] pb-1"
                  >
                    <span class="text-gray-500 text-xs">Luck</span>
                    <input
                      class="form-input w-20! text-end!"
                      type="number"
                      v-model="selectedDaemon.luck"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="flex gap-2 justify-center">
              <button
                @click="
                  selectedDaemon = null;
                  editModal = false;
                "
                class="border border-[#1f2937] cursor-pointer hover:border-[#1f2937]/80 py-2 px-1"
              >
                Cancelar
              </button>
              <button
                @click="handleEdit()"
                class="border border-[#1f2937] cursor-pointer hover:border-[#00ffaa] py-2 px-1"
              >
                Editar Demonio
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import daemonV from "@/components/ViewDaemon.vue";
import { useAuth } from "@/stores/auth.js";
const { user } = useAuth();

import {
  getDaemons,
  createDaemon,
  deleteDaemon,
  editDaemon,
  getAllRaces,
} from "@/api/index.js";

const daemons = ref([]);
const filtered = ref([]);
const loading = ref(false);
const error = ref(null);
const search = ref("");
const showForm = ref(false);
const spawning = ref(false);
const formError = ref(null);
const selectedDaemon = ref(null);
const races = ref([]);
const deleteModal = ref(false);
const viewModal = ref(false);
const editModal = ref(false);

const newDaemon = ref({
  name: "",
  race_id: 0,
  level: 10,
  HP: 10,
  MP: 10,
  strength: 10,
  intelligence: 10,
  magic: 10,
  vitality: 10,
  agility: 10,
  luck: 10,
});

async function fetchDaemons() {
  loading.value = true;
  error.value = null;
  try {
    daemons.value = await getDaemons();
    filtered.value = [...daemons.value];
    filtered.value.sort((a, b) => a.id - b.id);

    /* obtener razas */
    races.value = await getAllRaces();
    for (let i = 0; i < filtered.value.length; i++) {
      const daemon = filtered.value[i];
      const race = races.value.find((r) => r.id === daemon.race_id);
      filtered.value[i].race = race || { name: "Desconocida", id: -1 };
    }
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
function validateInteger() {
  const { name, ...validar } = newDaemon.value;

  return Object.values(validar).every((value) => Number.isInteger(value));
}
function validateIntegerEdit() {
  const { name, race, ...validar } = selectedDaemon.value;
  /* console.log(validar); */
  return Object.values(validar).every((value) => Number.isInteger(value));
}

async function spawnDaemon() {
  formError.value = null;
  console.log(newDaemon.value);
  if (!newDaemon.value.name.trim()) {
    formError.value = "El nombre es requerido.";
    return;
  }
  if(newDaemon.value.race_id === 0){
    formError.value = "La raza es requerida.";
    return;
  }
  if(newDaemon.value.strength <= 0 || newDaemon.value.intelligence <= 0 || newDaemon.value.magic <= 0 || newDaemon.value.vitality <= 0 || newDaemon.value.agility <= 0 || newDaemon.value.luck <= 0 || newDaemon.value.HP <= 0 || newDaemon.value.MP <= 0 || newDaemon.value.level <= 0){
    formError.value = "Las estadisticas no pueden ser negativas o cero.";
    return;
  }
  if (!validateInteger()) {
    formError.value = "El campo debe ser un entero";
    return;
  }
  spawning.value = true;
  try {
    await createDaemon(newDaemon.value);
    newDaemon.value = {
      name: "",
      race_id: 0,
      level: 10,
      HP: 10,
      MP: 10,
      strength: 10,
      intelligence: 10,
      magic: 10,
      vitality: 10,
      agility: 10,
      luck: 10,
    };
    showForm.value = false;
    await fetchDaemons();
  } catch (e) {
    formError.value = "Error al crear el daemon.";
  } finally {
    spawning.value = false;
  }
}

function killDaemon(id) {
  deleteModal.value = true;
  selectedDaemon.value = daemons.value.find((d) => d.id === id);
}
function editDaemonModal(id) {
  editModal.value = true;
  selectedDaemon.value = daemons.value.find((d) => d.id === id);
}
async function handleDelete() {
  try {
    await deleteDaemon(selectedDaemon.value.name);
  } catch (error) {
    console.log("error intentando eliminar daemon:", error);
  }

  await fetchDaemons();
  deleteModal.value = false;
  selectedDaemon.value = null;
}
async function handleEdit() {
  if (!selectedDaemon.value.name.trim()) {
    return;
  }
  if (!validateIntegerEdit()) {
    return;
  }
  const newDemonEdit = {
    name: selectedDaemon.value.name,
    level: selectedDaemon.value.level,
    HP: selectedDaemon.value.hp,
    MP: selectedDaemon.value.mp,
    strength: selectedDaemon.value.strength,
    intelligence: selectedDaemon.value.intelligence,
    vitality: selectedDaemon.value.vitality,
    magic: selectedDaemon.value.magic,
    agility: selectedDaemon.value.agility,
    luck: selectedDaemon.value.luck,
    race_id: selectedDaemon.value.race_id,
  };
  try {
    await editDaemon(newDemonEdit);
  } catch (error) {
    console.log("error:", error);
  }

  editModal.value = false;
}

function viewDaemon(daemon) {
  selectedDaemon.value = daemon;
  viewModal.value = true;
}

onMounted(fetchDaemons);
</script>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -appearance: textfield;
}
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
  overflow: auto;
}
.daemon-table::-webkit-scrollbar {
  display: none; /* Chrome, Safari y Opera */
}

.elemento::-webkit-scrollbar {
  display: none; /* Chrome, Safari y Opera */
}

.table-header {
  display: grid;
  grid-template-columns: 60px 1fr 300px 100px 90px;
  padding: 0.5rem 1rem;
  background: var(--surface);
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  color: #fff;
  border-bottom: 1px solid var(--border);
}

.table-row {
  display: grid;
  grid-template-columns: 60px 1fr 300px 100px 90px;
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
  color: #fff;
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
