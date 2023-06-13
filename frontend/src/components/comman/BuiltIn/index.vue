<script setup lang="ts">
import {Command} from "@fzdwx/launcher-api";
import IconShell from "../../../icon/IconShell.vue";
import {useViewEvent} from "../../../composables/useViewEvent";
import {View} from "../../../utils";
import IconTranslator from "../../../icon/IconTranslator.vue";

const {emitter} = useViewEvent();

const builtinItems = [
  {
    viewName: View.Shell,
    icon: IconShell,
    value: 'shell'
  },
  {
    viewName: View.Translate,
    icon: IconTranslator,
    value: 'translate'
  }, {
    viewName: 'ext',
    icon: IconTranslator,
    value: 'ext'
  }
]
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
