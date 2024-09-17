<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="flex flex-col h-full">
    <header class="flex-initial text-white bg-red-700 flex flex-row items-end justify-between">
      <h1 class="text-5xl text font-extrabold p-8">String tools</h1>

      <div class="wrapper">
        <nav>
          <RouterLink to="/" class="inline-block p-2">Home</RouterLink>
          <RouterLink to="/stringstops" class="inline-block p-2">String stops</RouterLink>
          <RouterLink to="/about" class="inline-block p-2">About</RouterLink>
        </nav>
      </div>
    </header>

    <div class="flex-auto px-4 pt-4">
      <RouterView />
    </div>
  </div>
</template>
<style lang="postcss" scoped>
nav .router-link-active {
  @apply text-black bg-white rounded-t-md;
}
</style>
