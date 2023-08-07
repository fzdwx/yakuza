<script setup lang="ts">

import {onMounted, ref, watch} from "vue";
import {GetShortcut} from "../../../wailsjs/go/main/App";


defineProps<{
  name: string
}>()

const shortcut = ref();
onMounted(async () => {
  shortcut.value = await GetShortcut();
})

const getShortcut = (name: string) => {
  if (shortcutText.value){
    return shortcutText.value
  }

  if (shortcut.value && shortcut.value[name]) {
    const text = shortcut.value[name]["shortcuts"];
    if (text) {
      shortcutText.value = text
    }
  }

  return shortcutText.value
}

const shortcutText = ref("");


</script>

<template>
  <kbd class="absolute right-10" v-if="getShortcut(name)">
    {{ shortcutText }}
  </kbd>
</template>

<style scoped>

</style>
