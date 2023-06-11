<script setup lang="ts">
import {useMagicKeys, whenever} from "@vueuse/core";
import {useViewEvent} from "../composables/useViewEvent";
import {GetClipText} from "../../wailsjs/go/main/App";
import {onMounted, reactive, ref, watch} from "vue";
import {Command} from "./comman/Command/";
import {translate, View} from "../utils";
import {GoogleTranslateResp} from "../types";

const {escape, enter} = useMagicKeys()
const {emitter} = useViewEvent();

whenever(enter, async () => {
  translateResult.value = await doTranslate()
})

whenever(escape, () => {
  emitter.emit('changeView', View.Self)
})

const clipText = ref('');
const targetLang = ['en', 'zh', 'ja']

const translateResult = ref<GoogleTranslateResp[]>([])

onMounted(async () => {
  await reload()
  translateResult.value = await doTranslate()
})

const reload = async () => {
  clipText.value = await GetClipText()
}

const doTranslate = async () => {
  return Promise.all(targetLang.map(async (to) => {
    return translate(clipText.value, 'auto', to)
  }))
}
</script>

<template>
  <Command>
    <Command.Input placeholder="Type to translate..."
                   v-focus
                   v-model="clipText"
    />
    <Command.List>
      <div v-for="resp in translateResult">
      {{ resp.text}}
      </div>
    </Command.List>

  </Command>
</template>

<style scoped>

</style>
