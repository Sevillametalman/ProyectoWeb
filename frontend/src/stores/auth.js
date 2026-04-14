import { ref, computed } from "vue";

// Estado global reactivo (singleton fuera del componente)
const token = ref(localStorage.getItem("token") || null);
const user = ref(JSON.parse(localStorage.getItem("user") || "null"));

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value);

  function setSession(jwt, userData = null) {
    token.value = jwt;
    user.value = userData;
    localStorage.setItem("token", jwt);
    if (userData) localStorage.setItem("user", JSON.stringify(userData));
  }

  function clearSession() {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  function getToken() {
    return token.value;
  }

  return { token, user, isAuthenticated, setSession, clearSession, getToken };
}
