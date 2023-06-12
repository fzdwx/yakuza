<script setup lang="ts">
import {useMagicKeys, whenever} from "@vueuse/core";
import {useViewEvent} from "../composables/useViewEvent";
import {GetClipText, Hide, SetClipText} from "../../wailsjs/go/main/App";
import {computed, onMounted, ref, watch, watchEffect} from "vue";
import {Command} from "./comman/Command/";
import {View} from "../utils";
import {GoogleTranslateResp} from "../types";
import {useCommandState} from "./comman/Command/useCommandState";
import {useCommandEvent} from "./comman/Command/useCommandEvent";
import {translate} from "../common/translate";
import {LanguageCode, languagesByCode} from "../common/translate/languages";
import {useDebouncedRef} from "../composables/useDebouncedRef";
import {useViewState} from "../composables/useViewState";
import IconTranslator from "../icon/IconTranslator.vue";

const {escape, enter} = useMagicKeys()
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
                     v-focus
                     disable-filter
                     v-model="clipText"
                     :loading="loading"
      />
    </template>
    <template #body>
      <div class="flex ">
        <div class="w-72">
          <Command.List>
            <Command.Item v-for="resp in translateResult"
                          noHandleSpace
                          force-render
                          :translate-item="JSON.stringify(resp)"
                          :data-value="resp.text"
                          @select="itemInfo => {
                            handleCopy(resp)
                        }"
            >
              <div class="flex">
                <span class="font-bold ellipse w-40">{{ resp.text }}</span>
                <span class="ml-2  text-gray-100/40">{{ langMap(resp) }}
              </span>
              </div>
            </Command.Item>
          </Command.List>
        </div>
        <div class="basis-[65%] ml-4 text-white">
          {{ currentSelectResult?.text }}
          <br>
          {{ currentSelectRevertResult?.text }}
        </div>
      </div>
    </template>

    <template #footer>
      <IconTranslator>
        123123
      </IconTranslator>
      <button command-raycast-open-trigger="" @click="()=>{
        handleCopy(currentSelectResult)
      }">
        Copy
        <kbd>↵</kbd>
      </button>

      <hr>
    </template>
  </Command.Dialog>
</template>

<style scoped>

</style>
