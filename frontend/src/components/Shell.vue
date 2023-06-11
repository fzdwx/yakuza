<script setup lang="ts">

import {Command} from "./comman/Command";
import {useMagicKeys, whenever} from "@vueuse/core";
import {useViewEvent} from "../composables/useViewEvent";
import {onMounted, ref} from "vue";
import IconShell from "../icon/IconShell.vue";
import {RunApplication} from "../../wailsjs/go/main/App";
import {useCommandEvent} from "./comman/Command/useCommandEvent";

const inputValue = ref('')

const {backspace, enter} = useMagicKeys()
const {emitter} = useViewEvent();

whenever(backspace, () => {
  if (inputValue.value.length === 1) {
    emitter.emit('changeView', 'self')
  }
})

const event = useCommandEvent();
onMounted(() => {
  // use `enter` go to shell view
  event.emitter.emit('setInputValue', 'sh ')
})


// execute command
whenever(enter, () => {
  const value = inputValue.value.split(' ');
  value.shift();

  const param = value.shift();
  let terminal = false;
  if (param != '-t') {
    value.unshift(param)
  } else {
    terminal = true;
  }

  const cmd = value.join(' ');
  RunApplication(cmd, cmd, terminal)
})

</script>

<template>
  <Command>
    <IconShell class="absolute w-12 h-12 pt-1 mr-2 rounded-md"/>
    <Command.Input class="ml-14 max-w-[93%] border-none bg-none"
                   placeholder="Run command..."
                   v-model:value="inputValue"
    />
    <Command.List>
      <Command.Empty>History is empty.</Command.Empty>
    </Command.List>
  </Command>
</template>

<style scoped>

</style>
