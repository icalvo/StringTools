<script setup lang="ts">

import type { Note } from 'string-fingerings'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { noteName, tryParse } from 'string-fingerings'

const notes = defineModel<Note[]>()

const notesToRepr = computed(() => notes.value?.map((n) => n.text()).join(' ') ?? '')
const representation = ref('')
const connectedPorts = ref<Set<string>>(new Set())
const midiEnabled = computed(() => connectedPorts.value.size > 0)
const midiAccess = ref<MIDIAccess | null>(null)
const activeNotes = ref<Set<number>>(new Set())
const pressedNotes = ref<Set<number>>(new Set())

const reprToNotes = computed(() => {
  const parsedNotes = representation.value
    .split(' ')
    .filter((s) => s !== '')
    .map((noteName) => ({ noteName, note: tryParse(noteName) }))

  for (const result of parsedNotes) {
    if (typeof result.note === 'string') {
      for (const r2 of parsedNotes.filter((r) => typeof r.note === 'string')) {
        console.log(`${r2.noteName} is invalid: ${r2.note}`)
      }

      return []
    }
  }

  return parsedNotes.map((r) => r.note as Note)
})

watch(notesToRepr, (newValue) => {
  console.log('Updating representation with ', newValue)
  if (newValue.length > 0) representation.value = newValue
})

watch(reprToNotes, (newValue) => {
  console.debug('Updating notes with ', newValue)
  notes.value = newValue
})

onMounted(() => {
  representation.value = notesToRepr.value

  // Initialize MIDI if available in the browser
  if (navigator.requestMIDIAccess) {
    navigator
      .requestMIDIAccess()
      .then((access) => {
        midiAccess.value = access

        // Set up MIDI input event listeners
        const inputs = access.inputs.values()
        for (let input = inputs.next(); !input.done; input = inputs.next()) {
          console.log('MIDI input connected:', input.value.name)
          connectedPorts.value.add(input.value.id)
          input.value.onmidimessage = handleMIDIMessage
        }

        // Listen for connected/disconnected devices
        access.onstatechange = (ev) => {
          const event = ev as MIDIConnectionEvent
          if (event.port === null) return;
          if (event.port.type === 'input') {
            if (event.port.state === 'connected') {
              const input = event.port as MIDIInput
              
              input.onmidimessage = handleMIDIMessage
              console.log('MIDI input connected:', event.port.name)
              connectedPorts.value.add(event.port.id)
            } else {
              console.log('MIDI input disconnected:', event.port.name)
              connectedPorts.value.delete(event.port.id)
            }
          }
        }
      })
      .catch((error) => {
        console.error('MIDI access request failed:', error)
      })
  } else {
    console.log('Web MIDI API not supported in this browser')
  }
})

onUnmounted(() => {
  // Clean up MIDI connections
  if (midiAccess.value) {
    const inputs = midiAccess.value.inputs.values()
    for (let input = inputs.next(); !input.done; input = inputs.next()) {
      input.value.onmidimessage = null
    }
  }
})

// Handle MIDI messages
const handleMIDIMessage = (event: MIDIMessageEvent) => {
  if (event.data === null) return;
  const [status, note, velocity] = event.data
  // Note on (144-159) with velocity > 0
  if (status >= 144 && status <= 159 && velocity > 0) {
    console.log('Note on:', note, velocity)
    activeNotes.value.add(note)
    pressedNotes.value.add(note)
  }
  // Note off (128-143) or note on with velocity 0
  else if ((status >= 128 && status <= 143) || (status >= 144 && status <= 159 && velocity === 0)) {
    console.log('Note off:', note, velocity)
    activeNotes.value.delete(note)

    // If all keys are released, update the representation
    if (activeNotes.value.size === 0) {
      updateRepresentationFromMidi()
    }
  }
}

// Update representation with MIDI notes
const updateRepresentationFromMidi = () => {
  // Convert MIDI note numbers to note names (e.g., C5)
  const noteNames = Array.from(pressedNotes.value)
    .sort((a, b) => a - b) // Sort notes from lowest to highest
    .map((noteNum) => {
      const name = noteName(noteNum)
      return name ? name.toUpperCase() : ''
    })
    .filter((name) => name !== '')
  pressedNotes.value.clear()
  // Update the representation and trigger the model update
  if (noteNames.length > 0) {
    const newRep = noteNames.join(' ')
    console.log('Updating representation from MIDI:', newRep)
    representation.value = newRep
  }
}
</script>

<template>
  <div class="relative">
    <input v-model="representation" type="text" />
    <span
      v-if="midiEnabled"
      class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-green-600 font-medium"
      >MIDI</span
    >
  </div>
</template>

<style scoped></style>
