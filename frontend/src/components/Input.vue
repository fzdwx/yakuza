<script setup lang="ts">
import {EventsOn} from "../../wailsjs/runtime";
import {Command} from "./Command/";

EventsOn("show", () => {
  location.reload()
})

</script>

<template>
  <Command theme="custom">
    <Command.Input placeholder="Search for apps and commands..."/>
    <Command.List>
      <Command.Empty>No results found.</Command.Empty>
      <Command.Group heading="Letters">
        <Command.Item>a</Command.Item>
        <Command.Item>b</Command.Item>
        <Command.Separator/>
        <Command.Item>c</Command.Item>
      </Command.Group >
      <Command.Item>Apple</Command.Item>
    </Command.List>
  </Command>
</template>

<style scoped>

</style>
