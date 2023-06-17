<script setup lang="ts">

import {useCommandEvent, Command, useCommandState} from "@fzdwx/launcher-api";
import {ref} from "vue";
import IconSetting from "../../../icon/IconSetting.vue";
import {builtinItems} from "./utils";
import {useMagicKeys, whenever} from "@vueuse/core";
import {useViewEvent} from "../../../composables/useViewEvent";
import {View} from "../../../utils";

const {escape} = useMagicKeys()
const {emitter} = useViewEvent();

const inputText = ref('');

whenever(escape, () => {
  emitter.emit('changeView', View.Self)
})

</script>

<template>
  <Command.Dialog :autoSelectFirst="false" :visible="true" theme="raycast">

    <template #header>
      <Command.Input
          placeholder="Search extension name..."
          v-model="inputText"
      >
      </Command.Input>
    </template>

    <template #body>
      <Command.List>
        <Command.Empty>Extension is empty</Command.Empty>
        <Command.Item v-for="item in builtinItems" :data-value="item.value">
          <component :is="item.icon" class="icon"/>
          <span>{{ item.value }}</span>
        </Command.Item>
      </Command.List>
    </template>

    <template #footer>
      <IconSetting class="footer-icon"/>
      <button command-raycast-open-trigger="" @click="()=>{
      }">
        Execute command
        <kbd>↵</kbd>
      </button>
    </template>
  </Command.Dialog>
</template>

<style scoped>

</style>
