<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { noteName, noteNumber } from '@/data/fingerings'

const notes = defineModel<Array<number>>()

const notesToRepr = computed(() => notes.value?.map((n) => noteName(n)).join(' ') ?? '')
const representation = ref('')

const reprToNotes = computed(() => {
  const noteNumbers = representation.value
    .split(' ')
    .filter((s) => s !== '')
    .map((noteName) => ({ noteName, noteNumber: noteNumber(noteName) }))

  for (const result of noteNumbers) {
    if (typeof result.noteNumber === 'string') {
      for (const r2 of noteNumbers.filter((r) => typeof r.noteNumber === 'string')) {
        console.log(`${r2.noteName} is invalid: ${r2.noteNumber}`)
      }

      return []
    }
  }

  return noteNumbers.map((r) => r.noteNumber).filter((f) => typeof f === 'number')
})

watch(notesToRepr, (newValue) => {
  console.log('Updating representation with ', newValue)
  if (newValue.length > 0) representation.value = newValue
})

watch(reprToNotes, (newValue) => {
  console.log('Updating notes with ', newValue)
  notes.value = newValue
})

onMounted(() => (representation.value = notesToRepr.value))
</script>

<template>
  <input type="text" v-model="representation" />
</template>

<style scoped></style>
