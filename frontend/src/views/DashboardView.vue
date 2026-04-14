<template>
  <div class="app">
    <!-- Main -->
    <main class="main">
      <DaemonList />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import DaemonList from "@/components/DaemonList.vue";
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
