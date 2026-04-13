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
          <span class="uid-badge">uid:{{ user.id || "—" }}</span>
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
        <div class="avatar-name">{{ user.username || "—" }}</div>
        <span class="role-badge role">
          {{ user.admin ? "Admin" : "User" }}
        </span>
      </div>
    </div>
    <!-- daemons -->
    <div class="border rounded-lg border-[#1e2530] mt-4">
      <div class="header-title p-4 text-base!">Daemons del usuario:</div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- card -->
        <div
          v-if="user && user.daemons?.length"
          v-for="daemon in user.daemons || []"
          :key="daemon.id"
          class="bg-[#0f141b] border border-[#1f2937] relative flex p-6 m-4 shadow-lg hover:scale-105 transition-all duration-300 rounded-lg"
        >
          <div class="absolute top-5 left-3">
            <span class="badge-race text-amber-400! border-[#1f2937]!"
              >Raza: {{ daemon.race?.name }}
            </span>
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
</template>
<script setup>
import { ref, onMounted } from "vue";
import { getUserById, getDaemonsByUserId, getRaceById } from "@/api/index.js";
import { useRouter } from "vue-router";

const router = useRouter();
const user = ref({});

async function fetchUser() {
  const id = router.currentRoute.value.params.id;
  try {
    const data = await getUserById(id);
    user.value = data;

    // Obtener los daemons asociados al usuario
    if (user.value.id) {
      const daemons = await getDaemonsByUserId(user.value.id);
      user.value.daemons = daemons;
    }
    /* get race */
    if (user.value.daemons) {
      for (let i = 0; i < user.value.daemons.length; i++) {
        const daemon = user.value.daemons[i];
        const race = await getRaceById(daemon.id);
        user.value.daemons[i].race = race;
      }
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    // Manejar el error, por ejemplo, mostrando un mensaje o redirigiendo
  }
}

onMounted(() => {
  fetchUser();
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
</style>
