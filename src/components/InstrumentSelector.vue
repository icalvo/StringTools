<script setup lang="ts">
import { ref } from 'vue'
import { instruments } from '@/data/instruments'

const selectedInstrument = defineModel<number>()
const instrumentOptions = ref(
  instruments.map((instrument, i) => ({ text: instrument.name, index: i }))
)
</script>

<template>
  <select v-model="selectedInstrument">
    <option
      v-for="instrument in instrumentOptions"
      :key="instrument.index"
      :value="instrument.index"
    >
      {{ instrument.text }}
    </option>
  </select>
</template>

<style scoped></style>
