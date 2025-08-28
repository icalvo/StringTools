<template>
  <div class="relative inline-block font-medium">
    <!-- Info Symbol Button -->
    <button
      class="bg-transparent border-0 text-blue-500 cursor-pointer rounded-md transition-all duration-200 ease-in-out flex items-center justify-center hover:bg-blue-500/10 hover:scale-110 focus:outline-2 focus:outline-blue-500 focus:outline-offset-2"
      type="button"
      aria-label="Show information"
      @click="showOverlay = true"
    >
      🛈
    </button>

    <!-- Overlay -->
    <div
      v-if="showOverlay"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-5"
      @click="showOverlay = false"
    >
      <div
        class="relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto p-6 mx-auto dark:text-gray-50"
        @click.stop
      >
        <!-- Close Button -->
        <button
          class="absolute top-3 right-3 bg-transparent border-0 text-xl text-gray-500 dark:text-gray-400 cursor-pointer p-1 rounded transition-all duration-200 ease-in-out leading-none w-7 h-7 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-2 focus:outline-blue-500 focus:outline-offset-2"
          type="button"
          aria-label="Close information"
          @click="showOverlay = false"
        >
          ✕
        </button>

        <!-- Slot Content -->
        <div class="mr-5">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showOverlay = ref(false)
</script>
