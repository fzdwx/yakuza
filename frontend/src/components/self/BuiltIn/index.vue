<script setup lang="ts">
import {Command} from "@fzdwx/launcher-api";
import {useViewEvent} from "../../../composables/useViewEvent";
import {builtinItems} from "./utils";

const {emitter} = useViewEvent();

</script>

<template>
  <Command.Group heading="Built in">
    <Command.Item v-for="item in builtinItems" :key="item.value" :builtIn="true" :data-value="item.value" @select="() => {
      emitter.emit('changeView', item.viewName)
    }">
      <component :is="item.icon" class="icon"/>
      <span>{{ item.value }}</span>
    </Command.Item>
  </Command.Group>

</template>

<style scoped>

</style>
