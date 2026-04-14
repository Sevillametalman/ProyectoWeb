<template>
  <div class="daemon-panel flex flex-col items-center">
    <div class="panel-header w-full max-w-6xl">
      <div class="header-left">
        <span class="status-dot" :class="{ active: !loading }"></span>
        <span class="panel-title">CALCULADORA DE FUSIONES</span>
        <span class="pid-badge" v-if="daemons.length"
          >CANTIDAD DE DEMONIOS: {{ daemons.length }}</span
        >
      </div>
      <div class="header-right">
        <button class="btn-ghost" @click="resetSelection">✕ reset</button>
        <button
          class="btn-primary"
          :disabled="selectedIds.length < 2 || calculating"
          @click="startCalculation"
        >
          {{ calculating ? "EJECUTANDO ALGORITMO..." : "⚔ FUSIONAR" }}
        </button>
      </div>
    </div>

    <div class="w-full max-w-6xl mt-4">
      <transition name="slide-down">
        <div v-if="winner" class="winner-announcement mb-6">
          <div class="winner-box">
            <span
              class="text-[0.6rem] text-[#00e5a0] tracking-[0.3em] font-bold"
              >RESULTADO DE LA FUSION</span
            >
            <h2 class="text-2xl font-black text-white uppercase mt-1">
              {{ winner.name }}
            </h2>
            <div class="flex justify-center gap-4 mt-2">
              <span class="text-[0.7rem] text-gray-400"
                >ID: #{{ winner.id }}</span
              >
              <span class="text-[0.7rem] text-[#00e5a0]"
                >NIVEL: {{ winner.level }}</span
              >
            </div>
          </div>
        </div>
      </transition>

      <div
        class="battle-arena grid grid-cols-1 md:grid-cols-7 gap-2 items-center mb-10"
      >
        <div
          class="md:col-span-3 selection-slot"
          :class="{
            'slot--filled': selection[0],
            'is-winner': winner?.id === selection[0]?.id,
          }"
        >
          <div v-if="selection[0]" class="slot-content">
            <span class="slot-label text-[#00e5a0]">DEMONIO A</span>
            <div class="slot-name">{{ selection[0].name }}</div>
            <div class="text-xs font-mono">LVL {{ selection[0].level }}</div>
          </div>
          <div v-else class="slot-empty">ESPERANDO_DATA_A</div>
        </div>

        <div
          class="md:col-span-1 text-center font-black text-2xl text-[#ff4466] italic"
        >
          +
        </div>

        <div
          class="md:col-span-3 selection-slot"
          :class="{
            'slot--filled': selection[1],
            'is-winner': winner?.id === selection[1]?.id,
          }"
        >
          <div v-if="selection[1]" class="slot-content">
            <span class="slot-label text-[#0090ff]">DEMONIO B</span>
            <div class="slot-name">{{ selection[1].name }}</div>
            <div class="text-xs font-mono">LVL {{ selection[1].level }}</div>
          </div>
          <div v-else class="slot-empty">ESPERANDO_DATA_B</div>
        </div>
      </div>
    </div>

    <div class="w-full max-w-6xl px-2">
      <div class="section-divider mb-6">
        <span>LISTA DE DEMONIOS</span>
      </div>

      <div
        v-if="loading"
        class="text-center py-10 text-gray-500 font-mono text-sm"
      >
        <span class="animate-pulse">CARGANDO BASE DE DATOS...</span>
      </div>

      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <div
          v-for="daemon in daemons"
          :key="daemon.id"
          class="daemon-card-horizontal"
          :class="{ 'card--selected': isSelected(daemon.id) }"
          @click="toggleSelection(daemon)"
        >
          <div class="card-selection-indicator"></div>
          <div class="flex flex-col h-full justify-between">
            <div>
              <div class="flex justify-between items-start">
                <span class="text-[0.6rem] text-gray-500 font-mono"
                  >ID:{{ daemon.id }}</span
                >
                <span class="status-indicator" :class="daemon.status"></span>
              </div>
              <span
                class="font-bold text-base text-white block mt-1 truncate"
                >{{ daemon.name }}</span
              >
            </div>

            <div class="flex justify-between items-end mt-4">
              <div
                class="text-[0.65rem] border border-[#1e2530] px-2 py-0.5 bg-[#0a0d11]"
              >
                LVL <span class="text-[#00e5a0]">{{ daemon.level }}</span>
              </div>
              <span class="text-[0.6rem] text-gray-400 font-mono uppercase">{{
                daemon.raceName || "Cargando..."
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div
        v-if="showErrorModal"
        class="modal-overlay"
        @click.self="showErrorModal = false"
      >
        <div class="modal-error">
          <div class="modal-error-header">
            <span>ERROR DE FUSIÓN</span>
            <button @click="showErrorModal = false">✕</button>
          </div>
          <div class="modal-error-body">
            <div class="error-icon">⚠️</div>
            <p class="error-msg">
              Los daemons seleccionados no pueden ser fusionados.
            </p>
            <p class="error-sub">Dios trabaja de formas misteriosas.</p>
            <button class="btn-error-close" @click="showErrorModal = false">
              CERRAR
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const showErrorModal = ref(false); // Agrégalo junto a tus otros 'ref'
import { getDaemons, getBattleResult, getDaemonRace } from "@/api/index.js";

const daemons = ref([]);
const selection = ref([null, null]);
const selectedIds = ref([]);
const loading = ref(false);
const calculating = ref(false);
const winner = ref(null);

async function fetchDaemons() {
  loading.value = true;
  try {
    const data = (await getDaemons()).sort((a, b) => a.id - b.id); // Ordenamos por ID ascendente

    // Mapeamos los daemons para traer sus razas en paralelo
    daemons.value = await Promise.all(
      data.map(async (d) => {
        try {
          const raceData = await getDaemonRace(d.id);
          // Asumimos que raceData trae un campo .name o .race_name
          return { ...d, raceName: raceData.name };
        } catch (e) {
          return { ...d, raceName: "Desconocida" };
        }
      }),
    );
  } catch (e) {
    console.error("Error al sincronizar");
  } finally {
    loading.value = false;
  }
}

function toggleSelection(daemon) {
  // Si ya hay un ganador, limpiar el resultado al cambiar selección
  if (winner.value) winner.value = null;

  const index = selectedIds.value.indexOf(daemon.id);

  if (index > -1) {
    // Deseleccionar
    selectedIds.value.splice(index, 1);
    if (selection.value[0]?.id === daemon.id) selection.value[0] = null;
    else selection.value[1] = null;
  } else {
    // Seleccionar (máximo 2)
    if (selectedIds.value.length < 2) {
      selectedIds.value.push(daemon.id);
      if (!selection.value[0]) selection.value[0] = daemon;
      else selection.value[1] = daemon;
    }
  }
}

const isSelected = (id) => selectedIds.value.includes(id);

function resetSelection() {
  selectedIds.value = [];
  selection.value = [null, null];
  winner.value = null;
}

async function startCalculation() {
  if (selectedIds.value.length < 2) return;
  calculating.value = true;
  winner.value = null;

  try {
    const result = await getBattleResult(
      selectedIds.value[0],
      selectedIds.value[1],
    );

    // Si la API responde pero el objeto está vacío o no existe
    if (!result || Object.keys(result).length === 0) {
      showErrorModal.value = true;
    } else {
      winner.value = result;
    }
  } catch (e) {
    // Si el servidor no responde o hay error de red
    showErrorModal.value = true;
  } finally {
    calculating.value = false;
  }
}

onMounted(fetchDaemons);
</script>

<style scoped>
.daemon-panel {
  padding: 2rem 1.5rem;
  background: #0f1218;
  min-height: 100vh;
  font-family: "JetBrains Mono", monospace;
}

/* Header */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #1e2530;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.panel-title {
  font-size: 0.8rem;
  font-weight: 800;
  color: #00e5a0;
  letter-spacing: 0.2em;
}
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #1e2530;
}
.status-dot.active {
  background: #00e5a0;
  box-shadow: 0 0 8px #00e5a0;
}
.pid-badge {
  font-size: 0.65rem;
  color: #4a5568;
  border: 1px solid #1e2530;
  padding: 0.2rem 0.5rem;
}

/* Arena Slots */
.selection-slot {
  background: #0d1117;
  border: 1px solid #1e2530;
  padding: 2rem;
  text-align: center;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slot--filled {
  border-color: #4a5568;
  background: #111418;
}
.is-winner {
  border-color: #00e5a0;
  box-shadow: 0 0 20px rgba(0, 229, 160, 0.15);
  background: rgba(0, 229, 160, 0.05);
}
.slot-label {
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  display: block;
  margin-bottom: 0.5rem;
}
.slot-name {
  font-size: 1.4rem;
  font-weight: 900;
  color: #fff;
  margin-bottom: 0.25rem;
}
.slot-empty {
  font-size: 0.7rem;
  color: #333;
  letter-spacing: 0.1em;
}

/* Winner Announcement */
.winner-box {
  background: linear-gradient(to bottom, #111418, #0a0d11);
  border: 1px solid #00e5a0;
  border-top: 4px solid #00e5a0;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

/* Daemon Cards */
.daemon-card-horizontal {
  background: #0d1117;
  border: 1px solid #1e2530;
  padding: 1.2rem;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
  min-height: 100px;
}
.daemon-card-horizontal:hover {
  border-color: #4a5568;
  transform: translateY(-3px);
}
.card--selected {
  border-color: #00e5a0;
  background: rgba(0, 229, 160, 0.03);
}
.card-selection-indicator {
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 20px 20px 0;
  border-color: transparent transparent transparent transparent;
}
.card--selected .card-selection-indicator {
  border-color: transparent #00e5a0 transparent transparent;
}

.section-divider {
  border-bottom: 1px solid #1e2530;
  font-size: 0.7rem;
  color: #4a5568;
  letter-spacing: 0.3em;
  padding-bottom: 0.75rem;
}

/* UI Elements */
.btn-primary {
  background: #00e5a0;
  color: #000;
  border: none;
  font-weight: 900;
  font-size: 0.75rem;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
}
.btn-primary:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.btn-ghost {
  background: transparent;
  border: 1px solid #1e2530;
  color: #4a5568;
  font-size: 0.7rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin-right: 0.5rem;
}

/* Animations */
.slide-down-enter-active {
  animation: slideIn 0.4s ease-out;
}
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .selection-slot {
    padding: 1rem;
  }
  .slot-name {
    font-size: 1.1rem;
  }
}
/* Transiciones */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-error {
  background: #0d1117;
  border: 1px solid #ff4466;
  width: 100%;
  max-width: 450px; /* Tamaño máximo en desktop */
  box-shadow: 0 0 30px rgba(255, 68, 102, 0.2);
  display: flex;
  flex-direction: column;
}

.modal-error-header {
  background: #ff4466;
  color: #000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  font-weight: 900;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
}

.modal-error-body {
  padding: 2.5rem 1.5rem;
  text-align: center;
}
.error-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.error-msg {
  color: #ff4466;
  font-weight: 900;
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
  line-height: 1.2;
  text-transform: uppercase;
}
.error-sub {
  color: #4a5568;
  font-size: 0.8rem;
  margin-bottom: 2rem;
  font-style: italic;
}
.btn-error-close {
  background: transparent;
  border: 1px solid #ff4466;
  color: #ff4466;
  padding: 0.8rem 2rem;
  cursor: pointer;
  font-family: "JetBrains Mono", monospace;
  font-weight: 700;
  font-size: 0.8rem;
  transition: all 0.2s;
  width: 100%; /* Botón ancho completo en móviles */
}
.btn-error-close:hover {
  background: rgba(255, 68, 102, 0.1);
  letter-spacing: 0.1em;
}

/* --- MEDIA QUERIES PARA MÓVIL --- */
@media (max-width: 480px) {
  .modal-error-body {
    padding: 2rem 1rem;
  }

  .error-msg {
    font-size: 0.95rem; /* Texto un poco más pequeño en móviles */
  }

  .error-icon {
    font-size: 2rem;
  }

  .modal-error-header span {
    font-size: 0.7rem;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
