<script setup lang="ts">
import {Command} from "@fzdwx/launcher-api";
import {ChangeExtension, ListInstalled} from "../../../wailsjs/go/main/App";
import {onMounted, ref} from "vue";
import {extensions} from "../../../wailsjs/go/models";
import Extension = extensions.Extension;
import {useViewEvent} from "../../composables/useViewEvent";
import {View} from "../../utils";

const installExtensionList = ref<Extension[]>([]);

onMounted(async () => {
  installExtensionList.value = await ListInstalled();
})

const viewEvent = useViewEvent();
const openExtension = (ext: Extension) => {
  viewEvent.emitter.emit('changeView', View.Extension)
  ChangeExtension(ext)
}
</script>

<template>
  <Command.Group heading="Extension" v-if="installExtensionList">
    <Command.Item v-for="item in installExtensionList"
                  :data-value="item.name"
                  @select="()=>{
                    openExtension(item)
                  }"
    >
      <img :src="item.icon" alt="" style="width: 20px; height: 20px;"/>
      {{ item.name }}
    </Command.Item>
  </Command.Group>
</template>

<style scoped>

</style>
