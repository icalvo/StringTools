<script setup lang="ts">
const model =  defineModel<boolean>({ required: true })
const props = defineProps<{
  id: string
  label: string
}>()

</script>

<template>
  <div class="inline-flex items-center">
    <div class="flex items-center cursor-pointer relative">
      <input
          :id="id"
          v-model="model"
          type="checkbox"
          class="h-5 w-5 cursor-pointer transition-all rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800" />
    </div>
    <label class="cursor-pointer ml-2 text-slate-600 text-sm" :for="id">
      {{ props.label }}
    </label>
  </div>
</template>

<style scoped>

</style>