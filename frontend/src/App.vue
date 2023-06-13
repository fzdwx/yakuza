<script lang="ts" setup>

import Self from "./components/Self.vue";
import {Hide, ToBlur, ToFocus} from "../wailsjs/go/main/App";
import {EventsOn} from "../wailsjs/runtime";
import {useViewState} from "./composables/useViewState";
import Shell from "./components/Shell.vue";
import {useViewEvent} from "./composables/useViewEvent";
import Translator from "./components/Translate.vue";
import {View} from "./utils";
import {onMounted} from "vue";
import {init} from "./extApiHandle";
import {useCommandEvent, Command} from "@fzdwx/launcher-api";
import ExtensionFrame from "./components/ExtensionFrame.vue";

onMounted(() => {
  init()
})

window.onkeydown = (e: KeyboardEvent) => {
  if (e.code === "Escape") {
    if (currentView.value == View.Self) {
      Hide()
      return
    }
  }
}

window.onfocus = () => {
  ToFocus()
}

window.onblur = () => {
  ToBlur()
}

const event = useCommandEvent();
const {currentView} = useViewState();
const {emitter} = useViewEvent();

EventsOn("show", () => {
  // location.reload()
  event.emitter.emit('setInputValue', '')
  emitter.emit('changeView', View.Self)
})

emitter.on('changeView', (view: string) => {
  // 防止空格输入到下一个view
  setTimeout(() => currentView.value = view, 5)
})

</script>

<template>
  <div class="dark">
    <Self v-if="currentView == View.Self"/>
    <Shell v-else-if="currentView == View.Shell"/>
    <Translator v-else-if="currentView == View.Translate"/>
    <ExtensionFrame v-else-if="currentView == 'ext'"/>
  </div>
</template>

<style>
</style>
