<template>
  <!-- formulario -->
  <div class="p-4">
    <div class="mb-4">
      <label class="block text-sm text-gray-300 mb-1" for="username"
        >Username</label
      >
      <input
        id="username"
        type="text"
        v-model="formCreate.username"
        class="w-full px-3 py-2 bg-[#0f141b] border border-[#1f2937] rounded focus:outline-none focus:ring-2 focus:ring-[#00ffaa] text-sm text-gray-300"
      />
    </div>

    <div class="mb-4">
      <label class="flex items-center space-x-3 cursor-pointer">
        <div class="relative">
          <input
            type="checkbox"
            class="sr-only peer"
            v-model="formCreate.admin"
          />
          <div
            class="w-6 h-6 bg-gray-700 peer-checked:bg-[#00e5a0] transition-all duration-300 clip-path-hexagon"
          ></div>
          <div
            class="absolute opacity-0 w-3 h-3 border-b-2 border-r-2 border-white transform rotate-45 left-1.5 top-1 peer-checked:opacity-100 transition-opacity duration-300 delay-100"
          ></div>
        </div>
        <span class="text-white">Admin</span>
      </label>
    </div>

    <div class="mb-4">
      <label class="block text-sm text-gray-300 mb-1" for="password"
        >Password</label
      >
      <input
        id="password"
        type="password"
        v-model="formCreate.password"
        class="w-full px-3 py-2 bg-[#0f141b] border border-[#1f2937] rounded focus:outline-none focus:ring-2 focus:ring-[#00ffaa] text-sm text-gray-300"
      />
    </div>
  </div>
  <button
    @click="handleCreateUser"
    class="border border-[#00e5a0] cursor-pointer hover:border-[#00e5a0]/80 py-2"
  >
    Agregar usuario
  </button>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { createUser } from "@/api/index.js";

/* emit */
const emit = defineEmits(["updateUsers"]);

const formCreate = ref({
  username: "",
  password: "",
  admin: false,
});
/* metodos */
async function handleCreateUser() {
  if (!formCreate.value.username || !formCreate.value.password) {
    return;
  }
  try {
    await createUser(formCreate.value);
    formCreate.value = { username: "", password: "", admin: false };
    emit("updateUsers"); // Emitir evento para actualizar la lista de usuarios
  } catch (error) {
    console.error("Error al crear usuario:", error);
  }
}
</script>
<style scoped>
.clip-path-hexagon {
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}
</style>
