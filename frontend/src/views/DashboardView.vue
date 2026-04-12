<template>
  <div class="app">
    <!-- Topbar -->
    <header class="topbar">
      <div class="brand">
        <span class="brand-icon">⬡</span>
        <span class="brand-name">ProyectoWeb</span>
        <span class="brand-ver">v1.0</span>
      </div>

      <nav class="nav">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="nav-tab"
          :class="{ 'nav-tab--active': activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <span>{{ tab.icon }}</span>
          <span>{{ tab.label }}</span>
        </button>
      </nav>

      <div class="topbar-right">
        <span class="sys-clock">{{ clock }}</span>

        <!-- User info + logout -->
        <div class="user-menu">
          <span class="user-label">
            <span class="user-dot"></span>
            {{ displayName }}
          </span>
          <button
            class="btn-logout"
            @click="handleLogout"
            title="Cerrar sesión"
          >
            ⏻ salir
          </button>
        </div>
      </div>
    </header>

    <!-- Main -->
    <main class="main">
      <transition name="view" mode="out-in">
        <DaemonList v-if="activeTab === 'daemons'" key="daemons" />
      </transition>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import DaemonList from "@/components/DaemonList.vue";
import { useAuth } from "@/stores/auth.js";

const router = useRouter();
const { user, clearSession } = useAuth();

const activeTab = ref("daemons");
const clock = ref("");

const tabs = [
  { id: "daemons", label: "Daemons", icon: "◈" },
  { id: "Calculadora", label: "Calculadora", icon: "◎" },
];

const displayName = computed(() => {
  return user.value?.name || user.value?.email || "operador";
});

function handleLogout() {
  clearSession();
  router.push({ name: "login" });
}

let timer;
function updateClock() {
  clock.value = new Date().toLocaleTimeString("es-MX", { hour12: false });
}
onMounted(() => {
  updateClock();
  timer = setInterval(updateClock, 1000);
});
onUnmounted(() => clearInterval(timer));
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #0a0c10;
  color: #c8d0dc;
  font-family: "JetBrains Mono", monospace;
}

/* ── Topbar ─────────────────────────────── */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  height: 52px;
  background: #0d1117;
  border-bottom: 1px solid #1e2530;
  flex-shrink: 0;
  gap: 1rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.brand-icon {
  font-size: 1.1rem;
  color: #00e5a0;
}
.brand-name {
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #e2e8f0;
}
.brand-ver {
  font-size: 0.65rem;
  color: #4a5568;
}

.nav {
  display: flex;
  gap: 0.25rem;
}
.nav-tab {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  border: 1px solid transparent;
  color: #f1f5fa;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.85rem;
  padding: 0.35rem 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.08em;
}
.nav-tab:hover {
  color: #c8d0dc;
  border-color: #1e2530;
}
.nav-tab--active {
  color: #00e5a0;
  border-color: #00e5a0;
  background: rgba(0, 229, 160, 0.06);
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}
.sys-clock {
  font-size: 0.7rem;
  color: #4a5568;
  letter-spacing: 0.05em;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-left: 1px solid #1e2530;
  padding-left: 1.25rem;
}
.user-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  color: #c8d0dc;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.user-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00e5a0;
  box-shadow: 0 0 5px rgba(0, 229, 160, 0.6);
  flex-shrink: 0;
}
.btn-logout {
  background: transparent;
  border: 1px solid #1e2530;
  color: #c8d0dc;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.8rem;
  padding: 0.3rem 0.7rem;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.05em;
}
.btn-logout:hover {
  color: #ff4466;
  border-color: #ff4466;
  background: rgba(255, 68, 102, 0.06);
}

/* ── Main ───────────────────────────────── */
.main {
  flex: 1;
  overflow-y: auto;
}

/* ── View Transition ────────────────────── */
.view-enter-active,
.view-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}
.view-enter-from {
  opacity: 0;
  transform: translateX(8px);
}
.view-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}
</style>
