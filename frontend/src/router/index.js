import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/loginView.vue";
import DashboardView from "@/views/DashboardView.vue";
import Profile from "@/views/profile.vue";

const routes = [
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { public: true },
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: "/",
    name: "dashboard",
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  // Redirigir cualquier ruta desconocida
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ── Navigation Guard ─────────────────────────────────
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    // Ruta protegida sin sesión → al login
    return next({ name: "login" });
  }

  if (to.meta.public && token) {
    // Ya autenticado intentando ir al login → al dashboard
    return next({ name: "dashboard" });
  }

  next();
});

export default router;
