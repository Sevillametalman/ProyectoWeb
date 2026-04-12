<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
const clock = ref("");
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

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body,
#app {
  height: 100%;
  font-family: "JetBrains Mono", monospace;
}

.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #0f1218;
  color: #c8d0dc;
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
  color: #fff;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.75rem;
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
  gap: 1rem;
}
.sys-clock {
  font-size: 0.7rem;
  color: #4a5568;
  letter-spacing: 0.05em;
}
.sys-status {
  font-size: 0.65rem;
  color: #00e5a0;
  letter-spacing: 0.1em;
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
