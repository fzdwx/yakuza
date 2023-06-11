<script setup lang="ts">
import {Command} from "../Command/";
import IconShell from "../../../icon/IconShell.vue";
import {useViewEvent} from "../../../composables/useViewEvent";

const {emitter} = useViewEvent();
</script>

<template>
  <Command.Group heading="Built in">
    <Command.Item builtIn="true" data-value="shell"  @select="() => {
      emitter.emit('changeView', 'builtIn-shell')
    }">
      <IconShell class="icon"/>
      <span>shell</span>
    </Command.Item>
  </Command.Group>

</template>

<style scoped>

</style>
