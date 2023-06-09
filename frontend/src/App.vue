<script lang="ts" setup>

import Input from "./components/Input.vue";
import {Hide, ToBlur, ToFocus} from "../wailsjs/go/main/App";

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

</script>

<template>
  <div class="m-4" autofocus>
    <Input/>
  </div>
</template>

<style>
</style>
