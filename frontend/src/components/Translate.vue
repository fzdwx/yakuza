<!--

inspired by https://github.com/antfu/raycast-multi-translate

-->
<script setup lang="ts">
import {useMagicKeys, whenever} from "@vueuse/core";
import {useViewEvent} from "../composables/useViewEvent";
import {GetClipText, Hide, SetClipText} from "../../wailsjs/go/main/App";
import {computed, onMounted, ref, watch} from "vue";
import {useCommandEvent, Command, useCommandState} from "@fzdwx/launcher-api";
import {View} from "../utils";
import {GoogleTranslateResp} from "../types";
import {getLanguageName, translate} from "../common/translate";
import {LanguageCode, languagesByCode} from "../common/translate/languages";
import {useDebouncedRef} from "../composables/useDebouncedRef";
import {useViewState} from "../composables/useViewState";
import IconTranslator from "../icon/IconTranslator.vue";
import CheckMark from "../icon/CheckMark.vue";
import Info from "../icon/Info.vue";

const {escape} = useMagicKeys()
const {emitter} = useViewEvent();

const clipText = ref('');
const targetLang: LanguageCode[] = [
  languagesByCode["zh-CN"].code,
  languagesByCode["en"].code,
  languagesByCode["ja"].code,
]
const translateResult = ref<GoogleTranslateResp[]>([])
const currentSelectResult = ref<GoogleTranslateResp>()
const currentSelectRevertResult = ref<GoogleTranslateResp>()

const translateSame = computed(() => {
  return currentSelectRevertResult.value?.text === clipText.value
})

const commandEvent = useCommandEvent();

const loading = ref(false)

async function refreshTranslate() {
  if (!clipText.value) {
    translateResult.value = []
    currentSelectResult.value = undefined
    currentSelectRevertResult.value = undefined
    return
  }

  commandEvent.emitter.emit('selectFirstItem', true)
  translateResult.value = await doTranslate()
  currentSelectResult.value = translateResult.value[0]
  await reverseTranslate()
}

async function reverseTranslate() {
  const value = currentSelectResult.value;
  if (!value) {
    return
  }
  currentSelectRevertResult.value = await translate(value.text, value.to.language, value.from.language.iso)
}

const debouncedValue = useDebouncedRef('', 500)
watch(clipText, () => {
  if (clipText.value === debouncedValue.value) {
    return
  }
  debouncedValue.value = clipText.value
})

watch(debouncedValue, () => {
  updateLoading(refreshTranslate)()
})

const updateLoading = (fn: () => Promise<void>) => {
  return async () => {
    loading.value = true
    await fn()
    loading.value = false
  }
}

whenever(escape, () => {
  emitter.emit('changeView', View.Self)
})

onMounted(async () => {
  await updateLoading(async () => {
    commandEvent.emitter.emit('setInputValue', '')
    await reload()
    await refreshTranslate()
  })();
})

const reload = async () => {
  clipText.value = await GetClipText()
}

const doTranslate = async () => {
  return Promise.all(targetLang.map(async (to) => {
    return translate(clipText.value, 'auto', to)
  }))
}

const ATTR_TRANSLATE_ITEM = 'translate-item'
const {selectedNode, allItems} = useCommandState();
watch(selectedNode, () => {
  const item = allItems.value.get(selectedNode.value);
  if (item && item.getAttribute(ATTR_TRANSLATE_ITEM)) {
    currentSelectResult.value = JSON.parse(item.getAttribute('translate-item') || '{}')
    reverseTranslate()
  }
})
const {currentView} = useViewState();

const visible = computed(() => {
  return currentView.value === View.Translate
})

const handleCopy = (item: GoogleTranslateResp | undefined) => {
  if (!item) {
    return
  }
  if (clipText.value === '' || clipText.value.length == 0) {
    return;
  }

  SetClipText(item.text)
  Hide()
}

const langMap = (item: GoogleTranslateResp) => {
  if (item.from.language.iso == item.to.language) {
    return item.from.language.iso
  }
  return `${item.from.language.iso} => ${item.to.language}`
}
</script>

<template>
  <Command.Dialog auto-select-first :visible="visible" theme="raycast">
    <template #header>
      <Command.Input placeholder="Type to translate..."
                     disable-filter
                     v-model="clipText"
                     :loading="loading"
      />
    </template>
    <template #body>
      <div class="flex ">
        <div class="w-72">
          <Command.List>
            <Command.Group heading="">
              <Command.Item v-for="resp in translateResult"
                            noHandleSpace
                            force-render
                            :translate-item="JSON.stringify(resp)"
                            :data-value="resp.text"
                            @select="() => {
                            handleCopy(resp)
                        }"
              >
                <div class="flex">
                  <span class="font-bold ellipse w-40">{{ resp.text }}</span>
                  <span class="ml-2  text-gray-100/40">{{ langMap(resp) }}
              </span>
                </div>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </div>

        <div class="border-l border-bgray6"/>

        <div class="basis-[65%] pt-4 ml-2 text-white" v-if="currentSelectResult">
          <div class="h-[60%] border-b border-bgray6">
            <span>{{ currentSelectResult?.text }}</span>

            <span v-if="translateSame == false" class="text-bgray11">
              <br><br>
              {{ currentSelectRevertResult?.text }}
            </span>
          </div>

          <div class="py-3 pl-3 border-b border-bgray6">
            <div>
              <span class="text-bgray10 font-bold">From</span>
              <span class="absolute right-8 font-bold">{{
                  getLanguageName(currentSelectResult?.from.language.iso)
                }}</span>
            </div>
            <div>
              <span class="text-bgray10 font-bold">To</span>
              <span class="absolute right-8 font-bold">{{ getLanguageName(currentSelectResult?.to.language) }}</span>
            </div>

          </div>

          <div class="py-3 pl-3 flex">
            <div class="text-bgray10 font-bold">Translate Back</div>

            <div v-if="translateSame" class="flex absolute right-8 font-bold">
              <CheckMark class="text-green-400 icon pr-2 pb-2"/>
              <span>Same</span>
            </div>
            <div v-else class="flex absolute right-8 font-bold">
              <Info class="text-red-400 icon pb-1.5"/>
              <div>Different</div>
            </div>
          </div>
        </div>

      </div>
    </template>

    <template #footer>
      <IconTranslator/>

      <button class="cursor-default" command-raycast-open-trigger @click="reload">
        Reload
      </button>

      <hr>

      <button class="cursor-default" command-raycast-open-trigger="" @click="()=>{
        handleCopy(currentSelectResult)
      }">
        Copy
        <kbd>↵</kbd>
      </button>

    </template>
  </Command.Dialog>
</template>

<style scoped>

</style>
