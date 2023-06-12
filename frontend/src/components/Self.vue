<script setup lang="ts">
import {Command} from "./comman/Command/";
import Applications from "./comman/Applications/index.vue";
import BuiltIn from "./comman/BuiltIn/index.vue";
import {useMagicKeys, whenever} from "@vueuse/core";
import {computed, ref} from "vue";
import {useCommandEvent} from "./comman/Command/useCommandEvent";
import {useViewState} from "../composables/useViewState";
import {View} from "../utils";

const {emitter} = useCommandEvent()

const inputValue = ref('')
const {space} = useMagicKeys()
const {currentView} = useViewState();

whenever(space, () => {
  if (inputValue.value === '' || inputValue.value.length === 0) {
    return
  }
  const value = inputValue.value.trim();
  if (value === '') {
    return
  }
  emitter.emit('selectCurrentItem', true)
})

const visible = computed(() => {
  return currentView.value === View.Self
})
</script>

<template>
  <Command.Dialog auto-select-first :visible="visible" theme="raycast">
    <template #header>
      <Command.Input placeholder="Search for apps and commands..."
                     v-focus
                     v-model="inputValue"
      />
    </template>
    <template #body>
      <!-- <Command.Loading> Hang on... </Command.Loading> -->
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>
        <BuiltIn/>
        <Applications/>
      </Command.List>
    </template>
    <template #footer>
      <Command.Footer>
        <kbd>↵</kbd>
      </Command.Footer>
    </template>
  </Command.Dialog>
</template>

<style>
</style>
