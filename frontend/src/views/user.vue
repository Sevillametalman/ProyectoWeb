<template>
  <div class="container mx-auto mt-4">
    <div class="page-header">
      <div class="header-left">
        <button class="btn-back" @click="router.push({ name: 'users' })">
          ← volver
        </button>
        <div class="header-title">
          <span class="header-icon">◎</span>
          <span>USUARIO</span>
          <span class="uid-badge">uid:{{ user_.id || "—" }}</span>
        </div>
      </div>
      <div class="header-meta">
        <span class="meta-item">
          <span class="meta-dot meta-dot--green"></span>sesión activa
        </span>
      </div>
    </div>
    <!-- card  -->
    <div
      class="border flex justify-center items-center h-64 rounded-lg border-[#1e2530]"
    >
      <div class="avatar-card">
        <div class="avatar-hex">
          <span class="avatar-initials">C</span>
        </div>
        <div class="avatar-name">{{ user_.username || "—" }}</div>
        <span class="role-badge role">
          {{ user_.admin ? "Admin" : "User" }}
        </span>
      </div>
    </div>
    <!-- daemons -->
    <div class="border rounded-lg border-[#1e2530] mt-4 relative">
      <div class="header-title p-4 text-xl!">
        <h3>Daemons del usuario:</h3>
      </div>
      <div class="absolute top-4 right-3">
        <button
          @click="openModal = true"
          class="text-black px-4 py-2 cursor-pointer bg-[#00ffaa] hover:bg-[#00ffaa]/80"
        >
          Asignar daemon
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- card -->
        <div
          v-if="user_ && user_.daemons?.length"
          v-for="daemon in user_.daemons || []"
          :key="daemon.id"
          class="bg-[#0f141b] border border-[#1f2937] relative flex p-6 m-4 shadow-lg hover:scale-105 transition-all duration-300 rounded-lg"
        >
          <div class="absolute top-5 left-3">
            <span class="badge-race text-amber-400! border-[#1f2937]!"
              >Raza: {{ daemon.race?.name }}
            </span>
          </div>
          <!-- Solo admin -->
          <div
            v-if="user.admin"
            @click="handleUnasign(daemon)"
            class="absolute top-2 right-2 text-red-300 cursor-pointer w-6 h-6 text-center hover:text-red-500 transition-colors duration-300 flex items-center justify-center"
          >
            <span>X</span>
          </div>

          <div
            class="p-4 border-r border-[#1f2937] w-1/2 flex flex-col items-center relative mt-[15%]"
          >
            <span class="text-6xl"> ◎ </span>
            <p>{{ daemon.name }}</p>
            <p
              class="text-green-500 absolute border border-[#1f2937] p-1 bottom-0 right-6 text-sm"
            >
              Level:{{ daemon.level }}
            </p>
          </div>
          <div class="py-4 w-2/3">
            <!-- 2 rows 2 colunms -->
            <div class="space-y-4 mb-6 ml-6">
              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-gray-500 tracking-wider"
                    >HP <span class="text-gray-700">(Health)</span></span
                  >
                  <span class="text-[#00ffaa] font-bold"
                    >{{ daemon.hp }} / {{ daemon.hp }}</span
                  >
                </div>
                <div class="w-full bg-[#151b23] h-1.5 border border-[#1f2937]">
                  <div
                    class="bg-[#00ffaa] h-full shadow-[0_0_5px_#00ffaa]"
                    style="width: 100%"
                  ></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-gray-500 tracking-wider"
                    >MP <span class="text-gray-700">(Mana)</span></span
                  >
                  <span class="text-[#3b82f6] font-bold"
                    >{{ daemon.mp }} / {{ daemon.mp }}</span
                  >
                </div>
                <div class="w-full bg-[#151b23] h-1.5 border border-[#1f2937]">
                  <div
                    class="bg-[#3b82f6] h-full shadow-[0_0_5px_#3b82f6] w-full"
                  ></div>
                </div>
              </div>
            </div>

            <div class="bg-[#0f141b] border border-[#1f2937] p-4 w-full ml-3">
              <div class="grid grid-cols-2 gap-x-2 gap-y-3">
                <div
                  class="flex justify-between items-center border-b border-[#1f2937] pb-1"
                >
                  <span class="text-gray-500 text-xs">Strength</span>
                  <span class="text-gray-200 text-sm font-semibold">{{
                    daemon.strength
                  }}</span>
                </div>

                <div
                  class="flex justify-between items-center border-b border-[#1f2937] pb-1"
                >
                  <span class="text-gray-500 text-xs">Intelligence</span>
                  <span class="text-gray-200 text-sm font-semibold">{{
                    daemon.intelligence
                  }}</span>
                </div>

                <div
                  class="flex justify-between items-center border-b border-[#1f2937] pb-1"
                >
                  <span class="text-gray-500 text-xs">Magic</span>
                  <span class="text-gray-200 text-sm font-semibold">{{
                    daemon.magic
                  }}</span>
                </div>

                <div
                  class="flex justify-between items-center border-b border-[#1f2937] pb-1"
                >
                  <span class="text-gray-500 text-xs">Vitality</span>
                  <span class="text-gray-200 text-sm font-semibold">{{
                    daemon.vitality
                  }}</span>
                </div>

                <div
                  class="flex justify-between items-center border-b border-[#1f2937] pb-1"
                >
                  <span class="text-gray-500 text-xs">Agility</span>
                  <span class="text-gray-200 text-sm font-semibold">{{
                    daemon.agility
                  }}</span>
                </div>

                <div
                  class="flex justify-between items-center border-b border-[#1f2937] pb-1"
                >
                  <span class="text-gray-500 text-xs">Luck</span>
                  <span class="text-gray-200 text-sm font-semibold">{{
                    daemon.luck
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="p-4 text-gray-500">
          Este usuario no tiene daemons asociados.
        </div>
      </div>
    </div>
  </div>
  <transition name="fade">
    <div v-if="openModal" class="modal-overlay">
      <div class="modal">
        <div
          class="w-full max-w-lg bg-[#0f141b] border border-[#1f2937] shadow-2xl relative"
        >
          <div
            class="flex justify-between items-center px-5 py-3 border-b border-[#1f2937] bg-[#0b1016]"
          >
            <span class="text-[#3b82f6] text-xs font-bold tracking-widest"
              >Asignar Daemon ::</span
            >
            <button
              class="text-[#3b82f6] hover:text-white transition-colors font-bold"
            >
              ✕
            </button>
          </div>

          <div class="p-4">
            <div
              class="grid grid-cols-[40px_60px_1fr_1fr_80px] gap-2 px-3 py-2 border-b border-[#1f2937] text-xs text-gray-500 mb-2 uppercase tracking-wider"
            >
              <div>Sel</div>
              <div>ID</div>
              <div>Nombre</div>
              <div>Raza</div>
              <div class="text-right">Level</div>
            </div>

            <div class="max-h-60 overflow-y-auto flex flex-col gap-1 pr-1 list">
              <label
                v-for="daemon in daemons"
                :key="daemon.id"
                class="grid grid-cols-[40px_60px_1fr_1fr_80px] gap-2 px-3 py-3 items-center border border-[#1f2937] hover:border-[#1e3a8a] hover:bg-[#0b2136] cursor-pointer transition-colors"
              >
                <div>
                  <input
                    type="radio"
                    name="daemon_select"
                    :value="daemon"
                    v-model="daemonSelected"
                    checked
                    class="w-4 h-4 text-[#3b82f6] bg-[#0f141b] border-[#3b82f6] focus:ring-[#3b82f6] focus:ring-1 cursor-pointer"
                  />
                </div>
                <div class="text-gray-400 text-xs">#{{ daemon.id }}</div>
                <div class="text-white text-sm font-semibold">
                  {{ daemon.name }}
                </div>
                <div class="text-gray-400 text-xs">{{ daemon.race }}</div>
                <div class="text-right text-[#00ffaa] text-xs font-bold">
                  {{ daemon.level }}
                </div>
              </label>
            </div>
          </div>

          <div
            class="flex justify-center gap-4 p-4 border-t border-[#1f2937] bg-[#0b1016]"
          >
            <button
              @click="openModal = false"
              class="px-4 py-2 cursor-pointer border border-[#1f2937] text-gray-400 text-sm hover:border-[#1f2937]/80 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="handleAdd"
              class="px-4 py-2 cursor-pointer border border-[#1f2937] text-gray-300 text-sm hover:border-[#3b82f6] hover:text-[#3b82f6] transition-colors"
            >
              Asignar Daemon
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <transition name="fade">
    <div v-if="openModalUnasign" class="modal-overlay">
      <div class="modal">
        <div class="modal-header text-red-500!">
          <span>Daemon :: </span>
          <button class="btn-icon" @click="openModalUnasign = false">✕</button>
        </div>
        <div class="modal-body">
          <span class="text-center">
            ¿ Estas seguro que deseas desasignar este daemon ?
          </span>
          <div class="flex gap-2 justify-center">
            <button
              @click="openModalUnasign = false"
              class="border border-[#1f2937] cursor-pointer hover:border-[#1f2937]/80 py-2 px-1"
            >
              Cancelar
            </button>
            <button
              @click="handleDesasignar()"
              class="border border-[#1f2937] cursor-pointer hover:border-red-500 py-2 px-1"
            >
              Desasignar
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script setup>
import { ref, onMounted } from "vue";
import {
  getUserById,
  getDaemonsByUserId,
  getRaceById,
  getDaemons,
  asignDaemonUser,
  unasignDaemonToUser,
} from "@/api/index.js";
import { useRouter } from "vue-router";
import { useAuth } from "@/stores/auth.js";
const { user } = useAuth();

const router = useRouter();
const openModal = ref(false);
const user_ = ref({});
const daemons = ref([]);
const daemonSelected = ref({});
const daemonDesasignar = ref({});
const openModalUnasign = ref(false);

async function fetchUser() {
  const id = router.currentRoute.value.params.id;
  try {
    const data = await getUserById(id);
    user_.value = data;

    // Obtener los daemons asociados al usuario
    if (user_.value.id) {
      const daemons = await getDaemonsByUserId(user_.value.id);
      user_.value.daemons = daemons;
    }
    /* get race */
    if (user_.value.daemons) {
      for (let i = 0; i < user_.value.daemons.length; i++) {
        const daemon = user_.value.daemons[i];
        const race = await getRaceById(daemon.id);
        user_.value.daemons[i].race = race;
      }
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    // Manejar el error, por ejemplo, mostrando un mensaje o redirigiendo
  }
}
function handleUnasign(daemon) {
  daemonDesasignar.value = daemon;
  openModalUnasign.value = true;
}
async function fetchDaemons() {
  try {
    const res = await getDaemons();
    daemons.value = res;
  } catch (error) {
    console.log(error);
  }
}
async function handleAdd() {
  try {
    const daemonAsign = {
      name: daemonSelected.value.name,
      race_id: daemonSelected.value.race_id,
      level: daemonSelected.value.level,
      hp: daemonSelected.value.hp,
      mp: daemonSelected.value.mp,
      strength: daemonSelected.value.strength,
      intelligence: daemonSelected.value.intelligence,
      magic: daemonSelected.value.magic,
      vitality: daemonSelected.value.vitality,
      agility: daemonSelected.value.agility,
      luck: daemonSelected.value.luck,
    };
    await asignDaemonUser(daemonAsign, user_.value.id, daemonSelected.value.id);
    await fetchUser();
    openModal.value = false;
  } catch (error) {
    console.log("error", error);
  }
}
async function handleDesasignar() {
  try {
    await unasignDaemonToUser(user_.value.id, daemonDesasignar.value.id);
    await fetchUser();
    openModalUnasign.value = false;
  } catch (error) {
    console.log(error);
  }
}
onMounted(() => {
  fetchUser();
  fetchDaemons();
});
</script>
<style scoped>
.badge-race {
  font-size: 0.85rem;
  font-weight: 400;
  color: #ffffff;
  border: 1px solid #1e2530;
  padding: 0.12rem 0.45rem;
}
.avatar-name {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text);
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
  width: 90px;
  height: 90px;
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

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #1e2530;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.btn-back {
  background: transparent;
  border: 1px solid #1e2530;
  color: #ffffff;
  font-family: "JetBrains Mono", monospace;
  font-size: 1rem;
  padding: 0.3rem 0.7rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-back:hover {
  color: #fff;
  border-color: #fff;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: #00e5a0;
}
.header-icon {
  font-size: 1rem;
}
.uid-badge {
  font-size: 0.65rem;
  font-weight: 400;
  color: #ffffff;
  border: 1px solid #1e2530;
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
  color: #ffffff;
}
.meta-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.meta-dot--green {
  background: #00e5a0;
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
.list::-webkit-scrollbar {
  display: none; /* Chrome, Safari y Opera */
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
  background: #111418;
  border: 1px solid #1e2530;
  border-top: 3px solid #0090ff;
  width: min(480px, 90vw);
  max-height: 70vh;
  overflow-y: auto;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #1e2530;
  font-size: 0.8rem;
  font-weight: 700;
  color: #0090ff;
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
  color: #4a5568;
  min-width: 110px;
  font-size: 0.75rem;
}
.modal-val {
  color: #c8d0dc;
  word-break: break-all;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
