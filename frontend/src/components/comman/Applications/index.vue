<script setup lang="ts">

import {ListApplications, RunApplication} from "../../../../wailsjs/go/main/App";
import Application from "../../../types";
import {onMounted, ref} from "vue";
import {Command} from "../Command/";

const applications = ref<Application[]>([])

onMounted(async () => {
  (await ListApplications()).map<Application>(v => {
    return {
      Type: v.Type,
      Name: v.Name,
      GenericName: v.GenericName,
      Comment: v.Comment,
      Icon: v.Icon,
      Path: v.Path,
      Exec: v.Exec,
      Url: v.Url,
      Terminal: v.Terminal,
    } as Application
  }).forEach(v => {
    applications.value.push(v)
  })
})

const handleSelectItem = (item: Application) => {
  RunApplication(item.Name,item.Exec,item.Terminal)
}
</script>

<template>
  <Command.Group heading="Applications">
    <Command.Item v-for="application in applications"
                  @select="handleSelectItem(application)"
                  noHandleSpace
                  :data-value="application.Name">
      <img :src="'/favicon.ico?/'+application.Icon" alt="icon" class="w-6 h-6 mr-2"/>
      {{ application.Name }}
    </Command.Item>
  </Command.Group>

</template>

<style scoped>

</style>
