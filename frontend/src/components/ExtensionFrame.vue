<!-- 插件 view -->
<script setup lang="ts">
import {
  buildEvent,
  Command,
  commandKeyDownAction,
  setConfigAction,
  userInputAction
} from "@fzdwx/launcher-api";
import {useViewEvent} from "../composables/useViewEvent";
import {View} from "../utils";
import {useMagicKeys, whenever} from "@vueuse/core";
import {onMounted, ref, watch} from "vue";
import {GetConfig} from "../../wailsjs/go/main/App";
import {inputState} from "../extApiHandle";
import {useViewState} from "../composables/useViewState";

const frameSrc = ref("http://localhost:58585")
const userInput = ref('')
const extensionFrame = ref()

const viewEvent = useViewEvent();
const {currentView} = useViewState();
const {escape} = useMagicKeys();

whenever(escape, () => {
  viewEvent.emitter.emit('changeView', View.Self)
})

watch(userInput, (value) => {
  extensionFrame.value.contentWindow.postMessage(buildEvent(userInputAction, userInput.value), "*")
})

const listener = (e: KeyboardEvent) => {
  let event = {
    code: e.code,
    key: e.key,
    ctrlKey: e.ctrlKey,
    altKey: e.altKey,
    metaKey: e.metaKey,
  }
  const data = JSON.stringify(event);
  extensionFrame.value.contentWindow.postMessage(buildEvent(commandKeyDownAction, data), "*")
};
onMounted(async () => {
  if (currentView.value === View.ExtensionDev) {
    frameSrc.value = "http://localhost:58586"
  }
  const config = await GetConfig();
  extensionFrame.value.onload = () => {
    extensionFrame.value.contentWindow.postMessage(buildEvent(setConfigAction, JSON.stringify(config)), "*")
  }

  window.removeEventListener('keydown', listener)
  window.addEventListener('keydown', listener)
})


</script>

<template>
  <Command.Dialog :autoSelectFirst="true" :visible="true" theme="raycast">
    <template #header>
      <Command.Input :loading="inputState.loading"
                     :disable-filter="inputState.disableFilter"
                     placeholder="Type a command or search..."
                     v-model="userInput"/>
    </template>
    <template #body>
      <iframe ref="extensionFrame" :src="frameSrc"/>
    </template>
  </Command.Dialog>
</template>

<style scoped>

</style>
