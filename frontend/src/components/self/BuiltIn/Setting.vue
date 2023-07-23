<script setup lang="ts">

import {Command} from "@fzdwx/launcher-api";
import {onMounted, ref} from "vue";
import IconSetting from "../../../icon/IconSetting.vue";
import {useMagicKeys, whenever} from "@vueuse/core";
import {useViewEvent} from "../../../composables/useViewEvent";
import {View} from "../../../utils";
import {applications, extensions} from "../../../../wailsjs/go/models";
import {ListApplications, ListInstalled, SetShortcut} from "../../../../wailsjs/go/main/App";
import SettingItem from "./SettingItem.vue";
import {builtinItems} from "./utils";
import Extension = extensions.Extension;


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


const showSettingItem = ref(false)
const currentApplicationName = ref('')
const currentItemType = ref('')
const update = (name: string, type: string) => {
  showSettingItem.value = true
  currentApplicationName.value = name
  currentItemType.value = type
}

const type = {
  builtin: 'builtin',
  extension: 'extension',
  application: 'application'
}

const installExtensionList = ref<Extension[]>([]);

onMounted(async () => {
  installExtensionList.value = await ListInstalled();
})

</script>

<template>
  <Command.Dialog :autoSelectFirst="false" :visible="!showSettingItem" theme="raycast">

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

        <Command.Group heading="Built in">
          <Command.Item @select="update(item.viewName,type.builtin)" v-for="item in builtinItems" :key="item.value"
                        :builtIn="true"
                        :data-value="item.value">
            <component :is="item.icon" class="icon"/>
            <span>{{ item.value }}</span>
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Extension" v-if="installExtensionList">
          <Command.Item v-for="item in installExtensionList"
                        :data-value="item.name"
                        @select="()=>{
                    update(item.name,type.extension)
                  }"
          >
            <img :src="item.icon" alt="" style="width: 20px; height: 20px;"/>
            {{ item.name }}
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Applications">
          <Command.Item v-for="application in apps"
                        @select="update(application.name,type.application)"
                        noHandleSpace
                        :data-value="application.name">
            <img :src="'/favicon.ico?/'+application.icon" alt="icon" class="w-6 h-6 mr-2"/>
            {{ application.name }}
          </Command.Item>
        </Command.Group>


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
  <SettingItem v-if="showSettingItem"
               :name="currentApplicationName"
               :on-save="(shortcut:string)=>{
                 showSettingItem = false

                 if(shortcut.length===0 ){
                    return
                 }

                 SetShortcut(currentApplicationName,shortcut,currentItemType)
               }"
  />
</template>

<style scoped>

</style>
