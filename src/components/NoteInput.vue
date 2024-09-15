<script setup lang="ts">
import {computed, ref} from "vue";
import {noteNumber} from "@/data/fingerings";

withDefaults(
    defineProps<{
      notes: Array<number>
    }>(),
    { notes: () => [ 43, 50 ]}
)
const notes = ref('G3 D4')
const computedNotes = computed(() => {
  const noteNumbers = notes.value
      .split(' ')
      .map(noteName => ({noteName, noteNumber: noteNumber(noteName)}))

  for (const result of noteNumbers) {
    if (typeof result.noteNumber === 'string') {
      for (const r2 of noteNumbers.filter(r => typeof r.noteNumber === 'string')) {
        console.log(`${r2.noteName} is invalid: ${r2.noteNumber}`)
      }

      return []
    }
  }

  return noteNumbers.map(r => r.noteNumber).filter(f => typeof f === 'number')
})
</script>

<template>
  <input type="text" id="notes" name="notes" v-model="notes" class="flex-1 border-2 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="C5 G5" />
</template>

<style scoped>

</style>