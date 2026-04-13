<template>
  <div class="mt-4! rounded-lg">
    <div class="mb-8 flex items-center gap-3">
      <span class="text-[#00ffaa] text-lg ml-4">◉</span>
      <h2 class="text-sm tracking-widest text-gray-300 uppercase">
        Lista de Usuarios
      </h2>
      <div class="grow border-b border-[#1f2937] ml-4"></div>
      <!-- solo admin agregar usuarios-->

      <button
        v-if="user.admin"
        @click="handleModal('Create', true)"
        class="bg-[#00e5a0] text-base mr-4 text-black px-4 py-2 cursor-pointer hover:bg-[#00ffaa] transition-colors duration-300"
      >
        Agregar Usuario
      </button>
    </div>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto container"
    >
      <!-- card -->
      <div
        v-for="_user in filtered"
        :key="_user.id"
        class="bg-[#0f141b] border border-[#1f2937] relative flex flex-col items-center p-6 shadow-lg h-80 hover:scale-105 transition-all duration-300 rounded-lg cursor-pointer"
      >
        <!-- Solo admin -->
        <div
          v-if="user.admin"
          @click="handleModal('Delete', true, _user.id)"
          class="absolute top-2 right-2 text-red-300 cursor-pointer w-6 h-6 text-center hover:text-red-500 transition-colors duration-300 flex items-center justify-center"
        >
          X
        </div>
        <router-link
          :to="{ name: 'user', params: { id: _user.id } }"
          class="w-full h-full flex flex-col items-center"
        >
          <div class="absolute top-0 left-0 w-full h-0.5 bg-[#00ffaa]"></div>

          <div class="relative w-16 h-16 flex items-center justify-center mb-4">
            <div
              class="absolute inset-0 bg-[#005544] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]"
            ></div>
            <div
              class="absolute inset-px bg-[#0b1b19] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)] flex items-center justify-center"
            >
              <span class="text-[#00ffaa] text-xl font-bold">{{
                _user.username.slice(0, 1).toLocaleUpperCase()
              }}</span>
            </div>
          </div>

          <h3 class="text-white text-sm font-semibold mb-1">
            {{ _user.username }}
          </h3>
          <span
            class="bg-[#0b2136] text-[#3b82f6] border border-[#1e3a8a] text-[10px] px-3 py-1 mb-4 uppercase tracking-wider"
          >
            {{ _user.admin ? "admin" : "usuario" }}
          </span>

          <div class="w-full border-t border-[#1f2937] my-3"></div>

          <div class="w-full flex justify-between items-center text-xs">
            <div class="flex items-center gap-2">
              <span class="text-gray-500">▸ ID</span>
              <span class="text-white font-bold">{{ _user.id }}</span>
            </div>

            <div class="text-[#00ffaa]">activo</div>
          </div>

          <div class="w-full mt-2">
            <h3>Daemons</h3>
            <div class="flex overflow-hidden gap-2 mt-1">
              <span
                v-for="value in [1, 2, 3]"
                :key="value"
                class="shrink-0 border border-[#00e5a0] px-3 font-mono text-md font-medium tracking-tight text-white overflow-hidden max-w-30 whitespace-nowrap"
              >
                name daemons # {{ value }}
              </span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <!-- Detail Modal -->
    <transition name="fade">
      <div v-if="modalOpen" class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <span v-if="modalType == 'Delete'">◈ Eliminar Usuario</span>
            <span v-else>◈ Agregar Usuario</span>

            <button
              class="text-blue-300 cursor-pointer w-6 h-6 text-center hover:text-blue-500 transition-colors duration-300 flex items-center justify-center"
              @click="modalOpen = false"
            >
              ✕
            </button>
          </div>
          <div class="modal-body">
            <span v-if="modalType == 'Delete'" class="text-center">
              ¿ Estas seguro que deseas eliminar este usuario ?
            </span>
            <formCreateUser v-else @updateUsers="updateUsers"></formCreateUser>
            <button
              v-if="modalType == 'Delete'"
              @click="handleDelete()"
              class="border border-red-300 cursor-pointer hover:border-red-500 py-2"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { getUsers, createUser, deleteUser } from "@/api/index.js";
import { useAuth } from "@/stores/auth.js";
import formCreateUser from "@/components/formCreateUser.vue";
const { user } = useAuth();
const users = ref([]);
const filtered = ref([]);
const loading = ref(false);
const error = ref(null);
const modalOpen = ref(false);
const modalType = ref("Delete");
const userSelected = ref(null);
/* obtener usuarios */
onMounted(fetchUsers);

/* metodos */
async function fetchUsers() {
  loading.value = true;
  error.value = null;
  try {
    users.value = await getUsers();
    filtered.value = [...users.value];
  } catch {
    error.value = "No se pudo conectar con el servidor.";
  } finally {
    loading.value = false;
  }
}
async function handleDelete() {
  try {
    await deleteUser(userSelected.value.id);
  } catch (error) {
    console.log("Error al eliminar usuario:", error);
  }
  updateUsers();
}
async function updateUsers() {
  await fetchUsers();
  modalOpen.value = false;
}
function handleModal(type, open, id = null) {
  modalType.value = type;
  modalOpen.value = open;
  if (id) {
    userSelected.value = users.value.find((u) => u.id === id);
  }
}
</script>
<style scoped>
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
</style>
