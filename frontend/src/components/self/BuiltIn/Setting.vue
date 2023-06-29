<script setup lang="ts">

import {Command} from "@fzdwx/launcher-api";
import {computed, onMounted, ref} from "vue";
import IconSetting from "../../../icon/IconSetting.vue";
import {useMagicKeys, whenever} from "@vueuse/core";
import {useViewEvent} from "../../../composables/useViewEvent";
import {View} from "../../../utils";
import {applications} from "../../../../wailsjs/go/models";
import {ListApplications} from "../../../../wailsjs/go/main/App";

import {showSettingItem} from "./SettingItem"

const {escape} = useMagicKeys()
const {emitter} = useViewEvent();

const inputText = ref('');

whenever(escape, () => {
  emitter.emit('changeView', View.Self)
})

const apps = ref<applications.Application[]>([])
const refreshApps = async () => {
  apps.value = (await ListApplications()).sort((a, b) => b.count - a.count)
};

onMounted(refreshApps)

const update = (application: applications.Application) => {
  showSettingItem(application)
}


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
        <Command.Item v-for="application in apps"
                      @select="update(application)"
                      noHandleSpace
                      :data-value="application.name">
          <img :src="'/favicon.ico?/'+application.icon" alt="icon" class="w-6 h-6 mr-2"/>
          {{ application.name }}
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
