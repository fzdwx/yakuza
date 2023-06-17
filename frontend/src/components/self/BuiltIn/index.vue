<script setup lang="ts">
import {Command} from "@fzdwx/launcher-api";
import IconShell from "../../../icon/IconShell.vue";
import {useViewEvent} from "../../../composables/useViewEvent";
import {View} from "../../../utils";
import IconTranslator from "../../../icon/IconTranslator.vue";
import IconExtensionMananger from "../../../icon/IconExtensionMananger.vue";
import IconSetting from "../../../icon/IconSetting.vue";

const {emitter} = useViewEvent();

const builtinItems = [
  {
    viewName: View.Shell,
    icon: IconShell,
    value: 'Shell'
  },
  {
    viewName: View.Translate,
    icon: IconTranslator,
    value: 'Translate'
  },
  {
    viewName: View.ExtensionManager,
    icon: IconExtensionMananger,
    value: 'Extension manager'
  }, {
    viewName: View.Setting,
    icon: IconSetting,
    value: 'Setting'
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
