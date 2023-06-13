<script setup lang="ts">
import {buildEvent, Command, setConfigAction, userInputAction} from "@fzdwx/launcher-api";
import {useViewEvent} from "../composables/useViewEvent";
import {View} from "../utils";
import {useMagicKeys, whenever} from "@vueuse/core";
import {onMounted, ref, watch} from "vue";
import {GetConfig} from "../../wailsjs/go/main/App";
import {inputState} from "../extApiHandle";

const frameSrc = "http://localhost:5174"
const userInput = ref('')
const extensionFrame = ref()

const viewEvent = useViewEvent();
const {escape} = useMagicKeys();

whenever(escape, () => {
  viewEvent.emitter.emit('changeView', View.Self)
})

watch(userInput, (value) => {
  extensionFrame.value.contentWindow.postMessage(buildEvent(userInputAction, userInput.value), "*")
})

onMounted(async () => {
  const config = await GetConfig();
  extensionFrame.value.onload = () => {
    extensionFrame.value.contentWindow.postMessage(buildEvent(setConfigAction, JSON.stringify(config)), "*")
  }
})


</script>

<template>
  <Command.Dialog :autoSelectFirst="true" :visible="true" theme="raycast">
    <template #header>
      <Command.Input :loading="inputState.loading" placeholder="Type a command or search..." v-model="userInput"/>
    </template>
    <template #body>
      <iframe ref="extensionFrame" :src="frameSrc"/>
    </template>
  </Command.Dialog>
</template>

<style scoped>

</style>
