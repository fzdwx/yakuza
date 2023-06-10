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
  console.log(currentView.value)
})

</script>

<template>
  <Suspense>
    <div class="m-4" autofocus>
      <Self v-if="currentView == 'self'"/>
      <Shell v-if="currentView == 'builtIn-shell'"/>
    </div>
  </Suspense>
</template>

<style>
</style>
