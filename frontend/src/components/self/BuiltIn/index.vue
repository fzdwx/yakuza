<script setup lang="ts">
import {Command} from "@fzdwx/launcher-api";
import {useViewEvent} from "../../../composables/useViewEvent";
import {builtinItems} from "./utils";
import {GetShortcut} from "../../../../wailsjs/go/main/App";
import {onMounted, ref} from "vue";

const {emitter} = useViewEvent();

const shortcut = ref();
onMounted(async () => {
  shortcut.value = await GetShortcut();

})

const getShortcut = (name: string) => {
  if (shortcut.value) {
    return shortcut.value[name]
  }
  return undefined
}
</script>

<template>
  <Command.Group heading="Built in">
    <Command.Item v-for="item in builtinItems" :key="item.value" :builtIn="true" :data-value="item.value" @select="() => {
      emitter.emit('changeView', item.viewName)
    }">
      <component :is="item.icon" class="icon"/>
      <span>{{ item.value }}</span>

      <kbd class="absolute right-10">
        {{ getShortcut(item.viewName) }}
      </kbd>
    </Command.Item>
  </Command.Group>

</template>

<style scoped>

</style>
