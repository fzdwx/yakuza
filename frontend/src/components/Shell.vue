<script setup lang="ts">

import {Command} from "./comman/Command";
import {useMagicKeys, whenever} from "@vueuse/core";
import {useViewEvent} from "../composables/useViewEvent";
import {onMounted, ref} from "vue";
import IconShell from "../icon/IconShell.vue";
import {GetRunHistory, RunApplication} from "../../wailsjs/go/main/App";
import {useCommandEvent} from "./comman/Command/useCommandEvent";
import {applications} from "../../wailsjs/go/models";
import {useCommandState} from "./comman/Command/useCommandState";

const inputValue = ref('')

const {backspace, enter} = useMagicKeys()
const {emitter} = useViewEvent();

whenever(backspace, () => {
  if (inputValue.value.length === 0) {
    emitter.emit('changeView', 'self')
  }
})

const history = ref<applications.RunHistoryItem[]>([])
const refreshHistory = async () => {
  history.value = (await GetRunHistory()).shell.sort((a, b) => b.lastRunTime - a.lastRunTime)
};


const event = useCommandEvent();
onMounted(async () => {
  // use `enter` go to shell view
  event.emitter.emit('setInputValue', '')

  await refreshHistory()
})

emitter.on('changeView', (view: string) => {
  if (view === 'builtIn-shell') {
    (refreshHistory)()
  }
})

const {getSelectCurrentItem} = useCommandState();

// execute command
whenever(enter, () => {
  const selectCurrentNode = getSelectCurrentItem();
  if (selectCurrentNode && selectCurrentNode.getAttribute('builtIn') !== 'true') {
    inputValue.value = selectCurrentNode.getAttribute('data-value') ?? '';
  }

  if (inputValue.value === '' || inputValue.value.length === 0) {
    return
  }
  const value = inputValue.value.split(' ');
  const param = value.shift() ?? '';
  let terminal = true;
  if (param != '-b') { // -b: background
    value.unshift(param)
  } else {
    terminal = false;
  }

  const cmd = value.join(' ');
  RunApplication(cmd, "shell", cmd, terminal)
})

</script>

<template>
  <Command :autoSelectFirst="false">
    <IconShell class="absolute w-12 h-12 pt-1 mr-2 rounded-md"/>
    <Command.Input class="ml-14 max-w-[93%] border-none bg-none"
                   placeholder="Run command..."
                   v-model="inputValue"
    />
    <Command.List>
      <Command.Empty>History is empty</Command.Empty>
      <Command.Group heading="" class="pt-3">
        <Command.Item v-for="item in history"
                      :data-value="item.cmd">
          {{ item.cmd }}
        </Command.Item>
      </Command.Group>
    </Command.List>
  </Command>
</template>

<style scoped>

</style>
