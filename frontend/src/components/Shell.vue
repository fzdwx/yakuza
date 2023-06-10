<script setup lang="ts">

import {Command} from "./comman/Command";
import {useMagicKeys, whenever} from "@vueuse/core";
import {useViewEvent} from "../composables/useViewEvent";
import {ref} from "vue";

const inputValue = ref('')

const {backspace} = useMagicKeys()
const {emitter} = useViewEvent();

whenever(backspace, () => {
  if (inputValue.value.length === 1) {
    emitter.emit('changeView', 'self')
  }
})

</script>

<template>
  <Command>
    <Command.Input placeholder="Search for apps and commands..."
                   v-model:value="inputValue"
    />
    <Command.List>
<!--      <Command.Empty>No results found.</Command.Empty>-->
      123123
    </Command.List>
  </Command>
</template>

<style scoped>

</style>
