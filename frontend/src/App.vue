<template>
  <div class="app">
    <!-- Topbar -->
    <header
      v-if="router.currentRoute.value.name !== 'login'"
      class="topbar h-20!"
    >
      <div class="brand">
        <span class="brand-icon">⬡</span>
        <span class="brand-name text-base!">ProyectoWeb</span>
        <span class="brand-ver">v1.0</span>
      </div>
      <button class="menu-toggle" @click="isMenuOpen = !isMenuOpen">
        {{ isMenuOpen ? "✕" : "☰" }}
      </button>
      <nav class="nav" :class="{ 'nav--open': isMenuOpen }">
        <router-link to="/">
          <div
            class="nav-tab"
            :class="{
              'nav-tab--active': router.currentRoute.value.name === 'dashboard',
            }"
          >
            <span>Daemons</span>
            <span>◎</span>
          </div>
        </router-link>
        <router-link to="/calculadora">
          <div
            class="nav-tab"
            :class="{
              'nav-tab--active':
                router.currentRoute.value.name === 'calculadora',
            }"
          >
            <span>Calculadora</span>
            <span>◎</span>
          </div>
        </router-link>
        <router-link to="/users">
          <div
            class="nav-tab"
            :class="{
              'nav-tab--active': router.currentRoute.value.name === 'users',
            }"
          >
            <span>Usuarios</span>
            <span>◈</span>
          </div>
        </router-link>
      </nav>

      <div class="topbar-right">
        <span class="sys-clock">{{ clock }}</span>

        <!-- User info + logout -->
        <div class="user-menu">
          <RouterLink to="/profile">
            <div
              class="flex items-center gap-2 w-40 cursor-pointer hover:scale-110 transition-all overflow-auto duration-300"
            >
              <div class="avatar-hex"></div>

              <div class="user-text hide-mobile">
                <h2 class="font-bold text-gray-300 text-lg">
                  {{ user?.username }}
                </h2>
                <span class="text-[#00e5a0]">Entrenador</span>
              </div>
            </div>
          </RouterLink>
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
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useAuth } from "@/stores/auth.js";
import { useRouter } from "vue-router";
const isMenuOpen = ref(false);
const { user, clearSession } = useAuth();
const router = useRouter();
const clock = ref("");
let timer;
router.afterEach(() => {
  isMenuOpen.value = false;
});
function updateClock() {
  clock.value = new Date().toLocaleTimeString("es-MX", { hour12: false });
}
function handleLogout() {
  clearSession();
  router.push({ name: "login" });
}
onMounted(() => {
  updateClock();
  timer = setInterval(updateClock, 1000);
});
onUnmounted(() => clearInterval(timer));
</script>

<style scoped>
#app {
  height: 100%;
  font-family: "JetBrains Mono", monospace;
}
/* hex */
.avatar-hex {
  width: 32px;
  height: 32px;
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
}
* {
  box-sizing: border-box;
}
.app {
  width: auto;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #0f1218;
  color: #c8d0dc;
}

/* ── Topbar ─────────────────────────────── */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
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
/* ── Topbar ─────────────────────────────── */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  height: 64px;
  background: #0d1117;
  border-bottom: 1px solid #1e2530;

  /* CAMBIOS CLAVE: */
  width: 100%; /* Asegura que ocupe el ancho */
  flex-shrink: 0; /* Evita que se colapse */
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
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  height: 64px; /* Altura fija más estándar */
  background: #0d1117;
  border-bottom: 1px solid #1e2530;
  position: relative;
  z-index: 100;
}

.user-profile-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.3s;
}

.user-profile-info:hover {
  transform: scale(1.05);
}

.username {
  font-size: 0.9rem;
  font-weight: bold;
  color: #c8d0dc;
  margin: 0;
  line-height: 1;
}

.user-role {
  font-size: 0.65rem;
  color: #00e5a0;
}

/* ── Responsive Logic ── */

.menu-toggle {
  display: none; /* Oculto en desktop */
  background: transparent;
  border: 1px solid #1e2530;
  color: #00e5a0;
  font-size: 1.2rem;
  padding: 0.2rem 0.5rem;
  cursor: pointer;
}

.mobile-only {
  display: none;
}

@media (max-width: 850px) {
  .menu-toggle {
    display: block;
    order: 2;
  }
  .brand {
    order: 1;
  }
  .topbar-right {
    order: 3;
    gap: 0.5rem;
  }

  .desktop-only {
    display: none;
  }
  .mobile-only {
    display: block;
  }

  .nav {
    position: absolute;
    top: 64px;
    left: 0;
    width: 100%;
    background: #0d1117;
    flex-direction: column;
    padding: 1rem;
    gap: 0.5rem;
    border-bottom: 1px solid #1e2530;
    display: none; /* Oculto por defecto */
  }

  .nav--open {
    display: flex;
  } /* Clase para abrir */

  .nav-tab {
    width: 100%;
    justify-content: space-between;
    padding: 0.8rem 1rem;
  }

  .user-menu {
    border-left: none;
    padding-left: 0;
  }
}

/* Ajuste para pantallas muy pequeñas */
@media (max-width: 480px) {
  .brand-name {
    display: none;
  } /* Solo queda el icono y versión */
}
</style>
