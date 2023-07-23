<script lang="ts" setup>

import Self from "./components/Self.vue";
import {Hide, ToBlur, ToFocus} from "../wailsjs/go/main/App";
import {EventsOn} from "../wailsjs/runtime";
import {useViewState} from "./composables/useViewState";
import Shell from "./components/self/BuiltIn/Shell.vue";
import {useViewEvent} from "./composables/useViewEvent";
import Translator from "./components/self/BuiltIn/Translate.vue";
import {View} from "./utils";
import {onMounted} from "vue";
import {init} from "./extApiHandle";
import {useCommandEvent, Command} from "@fzdwx/launcher-api";
import ExtensionFrame from "./components/ExtensionFrame.vue";
import ExtensionManager from "./components/self/BuiltIn/ExtensionManager.vue";
import Setting from "./components/self/BuiltIn/Setting.vue";

onMounted(() => {
  init()
})

window.addEventListener('keydown', e => {
  if (e.code === "Escape") {
    if (currentView.value == View.Self) {
      Hide()
      return
    }
  }
})

window.onfocus = () => {
  ToFocus()
}

window.onblur = () => {
  ToBlur()
}

const event = useCommandEvent();
const {currentView} = useViewState();
const {emitter} = useViewEvent();

EventsOn("show", (array) => {
  if (array) {
    const data = array[0];
    emitter.emit('changeView', data['view'])
    event.emitter.emit('setInputValue', '')
  } else {
    event.emitter.emit('setInputValue', '')
    if (currentView.value !== View.Self) {
      emitter.emit('changeView', View.Self)
    }
  }
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
    <ExtensionManager v-else-if="currentView == View.ExtensionManager"/>
    <Setting v-else-if="currentView == View.Setting"/>
    <ExtensionFrame v-else-if="currentView == View.Extension || currentView==View.ExtensionDev"/>
  </div>
</template>

<style>
</style>
