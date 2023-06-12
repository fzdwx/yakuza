<script setup lang="ts">

import {Command} from "./comman/Command";
import {useMagicKeys, whenever} from "@vueuse/core";
import {useViewEvent} from "../composables/useViewEvent";
import {computed, onMounted, ref} from "vue";
import IconShell from "../icon/IconShell.vue";
import {GetRunHistory, RunApplication} from "../../wailsjs/go/main/App";
import {useCommandEvent} from "./comman/Command/useCommandEvent";
import {applications} from "../../wailsjs/go/models";
import {useCommandState} from "./comman/Command/useCommandState";
import {View} from "../utils";
import {useViewState} from "../composables/useViewState";

const inputValue = ref('')

const {backspace, enter, escape} = useMagicKeys()
const {emitter} = useViewEvent();

whenever(backspace, () => {
  if (inputValue.value.length === 0) {
    emitter.emit('changeView', View.Self)
  }
})

whenever(escape, () => {
  emitter.emit('changeView', View.Self) // TODO 一个列表, push/pop
  event.emitter.emit('setInputValue', '')
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
  if (view === View.Shell) {
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

const {currentView} = useViewState();

const visible = computed(() => {
  return currentView.value === View.Shell
})

</script>

<template>
  <Command.Dialog :autoSelectFirst="false" :visible="visible" theme="raycast">

    <template #header>
      <Command.Input
          placeholder="Run command..."
          v-focus
          v-model="inputValue"
      >
      </Command.Input>
    </template>

    <template #body>
      <Command.List>
        <Command.Empty>History is empty</Command.Empty>
        <Command.Group heading="Command history" >
          <Command.Item v-for="item in history"
                        :data-value="item.cmd">
            {{ item.cmd }}
          </Command.Item>
        </Command.Group>
      </Command.List>
    </template>

    <template #footer>
      <IconShell class="footer-icon"/>
    </template>
  </Command.Dialog>
</template>

<style>
</style>
