<script lang="ts" setup>

import Self from "./components/Self.vue";
import {Hide, ToBlur, ToFocus} from "../wailsjs/go/main/App";
import {EventsOn} from "../wailsjs/runtime";
import {useViewState} from "./composables/useViewState";
import Shell from "./components/Shell.vue";
import {useViewEvent} from "./composables/useViewEvent";

window.onkeydown = (e: KeyboardEvent) => {
  if (e.code === "Escape") {
    Hide()
  }
}

window.onfocus = () => {
  ToFocus()
}

window.onblur = () => {
  ToBlur()
}

EventsOn("show", () => {
  location.reload()
})

const {currentView} = useViewState();
const {emitter} = useViewEvent();

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
