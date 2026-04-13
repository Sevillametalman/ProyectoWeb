<template>
  <div class="p-6">
    <div class="flex items-center gap-5 mb-6">
      <div
        class="relative w-20 h-20 bg-[#151b23] border border-[#1f2937] flex items-center justify-center shadow-inner"
      >
        <span class="text-[#00d8ff] opacity-50 text-3xl tracking-widest"
          >◎</span
        >
        <div
          class="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00d8ff]"
        ></div>
        <div
          class="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00d8ff]"
        ></div>
      </div>

      <div class="grow">
        <div class="flex justify-between items-end mb-1">
          <h2 class="text-xl font-bold text-gray-100 uppercase tracking-wide">
            {{ daemon.name }}
          </h2>
          <span class="text-gray-600 text-xs">ID #{{ daemon.id }}</span>
        </div>
        <p class="text-gray-400 text-xs mb-2">
          Raza: <span class="text-gray-200">{{ daemon.race?.name }}</span>
        </p>
        <span
          class="inline-block text-[#00ffaa] border border-[#1e2530] text-[10px] px-2 py-0.5 uppercase tracking-wider"
        >
          Level {{ daemon.level }}
        </span>
      </div>
    </div>

    <div class="w-full border-t border-dashed border-[#1f2937] my-5"></div>

    <div class="space-y-4 mb-6">
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

    <div class="bg-[#0f141b] border border-[#1f2937] p-4">
      <div class="grid grid-cols-2 gap-x-8 gap-y-3">
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
</template>
<script setup>
import { ref, onMounted } from "vue";
/* props */
const props = defineProps(["daemon"]);
</script>
