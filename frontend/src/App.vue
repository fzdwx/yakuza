<script lang="ts" setup>

import Self from "./components/Self.vue";
import {Hide, ToBlur, ToFocus} from "../wailsjs/go/main/App";
import {EventsOn} from "../wailsjs/runtime";

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

</script>

<template>
  <Suspense>
    <div class="m-4" autofocus>
      <Self/>
    </div>
  </Suspense>
</template>

<style>
</style>
