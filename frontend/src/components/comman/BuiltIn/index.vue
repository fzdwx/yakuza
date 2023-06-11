<script setup lang="ts">
import {Command} from "../Command/";
import IconShell from "../../../icon/IconShell.vue";
import {useViewEvent} from "../../../composables/useViewEvent";
import {View} from "../../../utils";

const {emitter} = useViewEvent();

const builtinItems = [
  {
    viewName: View.Shell,
    icon: IconShell,
    value: 'shell'
  }
]
</script>

<template>
  <Command.Group heading="Built in">
    <Command.Item v-for="item in builtinItems" :key="item.value" :builtIn="true" :data-value="item.value" @select="() => {
      emitter.emit('changeView', item.viewName)
    }">
      <component :is="item.icon" class="icon"/>
      <span>{{item.value}}</span>
    </Command.Item>
  </Command.Group>

</template>

<style scoped>

</style>
