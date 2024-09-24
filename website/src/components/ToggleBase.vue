<script setup lang="ts">
  const model =  defineModel<boolean>('input')

  const props = defineProps<{
    id: string
    color: string
  }>()
</script>

<template>
    <span class="checkbox-wrapper-2 ali">
      <input
          :id="props.id" v-model="model" :name="props.id" type="checkbox" :style="{'--bgColor': props.color}" />
      <slot></slot>
    </span>
</template>

<style scoped>
.checkbox-wrapper-2 {
  --bgColor: black;
}

.checkbox-wrapper-2 input {
  appearance: none;
  background-color: #dfe1e4;
  border-radius: 72px;
  border-style: none;
  flex-shrink: 0;
  height: 20px;
  margin: 0;
  position: relative;
  width: 30px;
}

.checkbox-wrapper-2 input::before {
  bottom: -6px;
  content: "";
  left: -6px;
  position: absolute;
  right: -6px;
  top: -6px;
}

.checkbox-wrapper-2 input,
.checkbox-wrapper-2 input::after {
  transition: all 100ms ease-out;
}

.checkbox-wrapper-2 input::after {
  background-color: #fff;
  border-radius: 50%;
  content: "";
  height: 14px;
  left: 3px;
  position: absolute;
  top: 3px;
  width: 14px;
}

.checkbox-wrapper-2 input[type=checkbox] {
  cursor: default;
}

.checkbox-wrapper-2 input:hover {
  background-color: #c9cbcd;
  transition-duration: 0s;
}

.checkbox-wrapper-2 input:checked {
  background-color: var(--bgColor);
}

.checkbox-wrapper-2 input:checked::after {
  background-color: #fff;
  left: 13px;
}

.checkbox-wrapper-2 :focus:not(.focus-visible) {
  outline: 0;
}

.checkbox-wrapper-2 input:checked:hover {
  background-color: color-mix(in srgb, var(--bgColor), black 20%);
}
</style>