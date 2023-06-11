<script setup lang="ts">
import {Command} from "./comman/Command/";
import Applications from "./comman/Applications/index.vue";
import BuiltIn from "./comman/BuiltIn/index.vue";
import {useMagicKeys, whenever} from "@vueuse/core";
import {ref} from "vue";
import {useCommandEvent} from "./comman/Command/useCommandEvent";

const {emitter} = useCommandEvent()

const inputValue = ref('')
const {space} = useMagicKeys()

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

</script>

<template>
  <Command>
    <Command.Input placeholder="Search for apps and commands..."
                   v-focus
                   v-model="inputValue"
    />
    <Command.List>
      <Command.Empty>No results found.</Command.Empty>
      <BuiltIn/>
      <Applications/>
    </Command.List>
  </Command>
</template>

<style scoped>

</style>
