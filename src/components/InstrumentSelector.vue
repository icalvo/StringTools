<script setup lang="ts">
import {ref} from "vue";
import {instruments} from "@/data/instruments";

const selectedInstrument = defineModel<number>()
const instrumentOptions = ref(instruments.map((instrument, i) => ({ text: instrument.name, value: i })))
</script>

<template>
  <select v-model="selectedInstrument">
    <option v-for="option in instrumentOptions" :value="option.value">
      {{ option.text }}
    </option>
  </select>
</template>

<style scoped>

</style>