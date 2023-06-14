<script setup lang="ts">

import {Command, useDebouncedRef} from "@fzdwx/launcher-api";
import {useMagicKeys, whenever} from "@vueuse/core";
import {View} from "../utils";
import {useViewEvent} from "../composables/useViewEvent";
import {ref, watch} from "vue";
import {useExtension} from "../composables/useExtension";

const {escape} = useMagicKeys();
const viewEvent = useViewEvent();
whenever(escape, () => {
  viewEvent.emitter.emit('changeView', View.Self)
})

const inputText = ref('')
const debounceInputText = useDebouncedRef<string>('');
watch(inputText, () => {
  debounceInputText.value = inputText.value
}, {immediate: true})

//@ts-ignore
const {loading, extensions} = useExtension(debounceInputText);

</script>


<template>
  <Command.Dialog :autoSelectFirst="false" :visible="true" theme="raycast">

    <template #header>
      <Command.Input
          disable-filter
          v-model="inputText"
          :loading="loading"
          placeholder="Search extensions..."
      >
      </Command.Input>
    </template>

    <template #body>
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>
        <Command.Group v-if="extensions" heading="Extension List">
          <Command.Item v-for="item in extensions.items">
            <img :src="item.icon" alt="" style="width: 20px; height: 20px;"/>
            <span>{{ item.name }}</span>
            <span class="ml-4 text-[10px] text-bgray9 ">{{ item.description }}</span>
            <div class="absolute right-10">
              <span class="pr-2">by</span>
              <span class="text-bgray10">
              {{ item.author }}
              </span>
            </div>
          </Command.Item>
        </Command.Group>
      </Command.List>
    </template>

    <template #footer>
    </template>
  </Command.Dialog>
</template>

<style scoped>

</style>
