<script setup lang="ts">
import {Command} from "@fzdwx/launcher-api";
import {useViewEvent} from "../composables/useViewEvent";
import {View} from "../utils";
import {useMagicKeys, whenever} from "@vueuse/core";
import {onMounted, ref, watch} from "vue";
import {useExtensionEvent} from "../composables/useExtensionEvent";
import {setExtensionFrameWindow} from "../extApiHandle";

const frameSrc = "http://localhost:5174"
const userInput = ref('')
const extensionFrame = ref()

const viewEvent = useViewEvent();
const {escape} = useMagicKeys();

whenever(escape, () => {
  viewEvent.emitter.emit('changeView', View.Self)
})

const extensionEvent = useExtensionEvent();
watch(userInput, (value) => {
  extensionEvent.emitter.emit('userInput', value)
})

watch(extensionFrame, (value) => {
  if (extensionFrame.value) {
    setExtensionFrameWindow(extensionFrame.value.contentWindow)
  }
})
</script>

<template>
  <Command.Dialog :autoSelectFirst="true" :visible="true" theme="raycast">
    <template #header>
      <Command.Input placeholder="Type a command or search..." v-model="userInput"/>
    </template>
    <template #body class="qwe">
      <iframe ref="extensionFrame" :src="frameSrc"/>
    </template>
  </Command.Dialog>
</template>

<style scoped>

</style>
