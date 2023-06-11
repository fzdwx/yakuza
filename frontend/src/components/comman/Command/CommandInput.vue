<template>
  <div class="command-input-container">
    <slot name="head"></slot>
    <input
        ref="inputRef"
        command-input=""
        v-focus
        auto-complete="off"
        auto-correct="off"
        :spell-check="false"
        aria-autocomplete="list"
        role="combobox"
        :aria-expanded="true"
        :placeholder="placeholder"
        :value="modelValue"
        @input="handleInput"
        class="command-input"
    />
    <slot name="tail"></slot>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, watchEffect} from 'vue'

export default defineComponent({
  name: 'Command.Input'
})
</script>

<script lang="ts" setup>
import {computed} from 'vue'
import {useCommandState} from './useCommandState'
import {EventsOn} from "../../../../wailsjs/runtime";
import {useCommandEvent} from "./useCommandEvent";

defineProps<{
  placeholder: string
  modelValue?: string
}>()

const emit = defineEmits<{
  (e: 'input', ie: InputEvent): void
  (e: 'update:modelValue', val: any): void
}>()

const inputRef = ref()
const {search} = useCommandState()

const handleInput = (e: Event) => {
  const event = e as InputEvent
  const input = e.target as HTMLInputElement
  search.value = input?.value
  emit('input', event)
  emit('update:modelValue', input.value)
}

const {emitter} = useCommandEvent();

emitter.on('setInputValue', (value: string) => {
  search.value = value;
  emit('update:modelValue', search.value)
})

watchEffect(() => {
  inputRef.value?.focus()
})

</script>
