<script lang="ts" setup>

import Self from "./components/Self.vue";
import {Hide, ToBlur, ToFocus} from "../wailsjs/go/main/App";
import {EventsOn} from "../wailsjs/runtime";
import {useViewState} from "./composables/useViewState";
import Shell from "./components/Shell.vue";
import {useViewEvent} from "./composables/useViewEvent";
import {useCommandEvent} from "./components/comman/Command/useCommandEvent";

window.onkeydown = (e: KeyboardEvent) => {
  if (e.code === "Escape") {
    if (currentView.value == 'self') {
      Hide()
      return
    }

    emitter.emit('changeView', 'self') // TODO 一个列表, push/pop
    event.emitter.emit('setInputValue', '')
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
  emitter.emit('changeView', 'self')
})

emitter.on('changeView', (view: string) => {
  currentView.value = view
})

</script>

<template>
  <div class="m-4" autofocus>
    <Transition name="fade" mode="out-in">
      <Self v-if="currentView == 'self'"/>
      <Shell v-else-if="currentView == 'builtIn-shell'"/>
    </Transition>
  </div>
</template>

<style>
</style>
