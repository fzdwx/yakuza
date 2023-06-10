<script setup lang="ts">
import {Command} from "./comman/Command/";
import Applications from "./comman/Applications/index.vue";

</script>

<template>
  <Command theme="custom">
    <Command.Input placeholder="Search for apps and commands..."/>
    <Applications/>
    <Command.List>
<!--      <Command.Empty>No results found.</Command.Empty>-->
<!--      <Command.Group heading="Letters">-->
<!--        <Command.Item data-value="a">a</Command.Item>-->
<!--        <Command.Item data-value="b">b</Command.Item>-->
<!--        <Command.Separator/>-->
<!--        <Command.Item data-value="c">c</Command.Item>-->
<!--      </Command.Group>-->
<!--      <Command.Item data-value="apple">Apple</Command.Item>-->
    </Command.List>
  </Command>
</template>

<style scoped>

</style>
