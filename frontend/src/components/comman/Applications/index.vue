<script setup lang="ts">

import {ListApplications, RunApplication} from "../../../../wailsjs/go/main/App";
import {onMounted, ref} from "vue";
import {Command} from "../Command/";
import {applications} from "../../../../wailsjs/go/models";
import {useViewEvent} from "../../../composables/useViewEvent";

const apps = ref<applications.Application[]>([])
const refreshApps = async () => {
  apps.value = (await ListApplications()).sort((a, b) => b.count - a.count)
};

onMounted(refreshApps)

const {emitter} = useViewEvent();
emitter.on('changeView', (view: string) => {
  if (view === 'self') {
    (refreshApps)()
  }
})

const handleSelectItem = (item: applications.Application) => {
  RunApplication(item.name, "apps", item.Exec, item.terminal)
}

</script>

<template>
  <Command.Group heading="Applications">
    <Command.Item v-for="application in apps"
                  @select="handleSelectItem(application)"
                  noHandleSpace
                  :data-value="application.name">
      <img :src="'/favicon.ico?/'+application.icon" alt="icon" class="w-6 h-6 mr-2"/>
      {{ application.name }}
    </Command.Item>
  </Command.Group>
</template>

<style scoped>

</style>
