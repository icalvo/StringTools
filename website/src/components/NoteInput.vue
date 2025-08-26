<script setup lang="ts">

import type { Note } from 'string-fingerings'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { noteName, tryParse } from 'string-fingerings'

const note = defineModel<Note>()

const notesToRepr = computed(() => note.value?.text())
const representation = ref('')
const connectedPorts = ref<Set<string>>(new Set())
const midiEnabled = computed(() => connectedPorts.value.size > 0)
const midiAccess = ref<MIDIAccess | null>(null)
const activeNotes = ref<Set<number>>(new Set())
const pressedNotes = ref<Set<number>>(new Set())

const reprToNotes = computed(() => {
  const result = { noteName: representation.value, note: tryParse(representation.value) }

  if (typeof result.note === 'string') {
      console.log(`${result.noteName} is invalid: ${result.note}`)

    return undefined
  }

  return result.note as Note
})

watch(notesToRepr, (newValue) => {
  console.log('Updating representation with ', newValue)
  if (newValue) representation.value = newValue
})

watch(reprToNotes, (newValue) => {
  console.debug('Updating note with ', newValue)
  note.value = newValue
})

onMounted(() => {
  representation.value = notesToRepr.value ?? ''

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
    updateRepresentationFromMidi(note)
  }
}

// Update representation with MIDI notes
function updateRepresentationFromMidi(note: number) {
  // TODO: update value only when input is focused
  representation.value = noteName(note) ?? ''
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
