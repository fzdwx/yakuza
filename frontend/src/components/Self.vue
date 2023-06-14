<script setup lang="ts">
import {Command, useCommandEvent} from "@fzdwx/launcher-api";
import Applications from "./comman/Applications/index.vue";
import BuiltIn from "./comman/BuiltIn/index.vue";
import {useMagicKeys, whenever} from "@vueuse/core";
import {computed, ref} from "vue";
import {useViewState} from "../composables/useViewState";
import {View} from "../utils";
import Logo from "../icon/Logo.vue";
import {BrowserOpenURL} from "../../wailsjs/runtime";
import ArrowUp from "../icon/ArrowUp.vue";
import ArrowDown from "../icon/ArrowDown.vue";
import Enter from "../icon/Enter.vue";

const {emitter} = useCommandEvent()

const inputValue = ref('')
const {space} = useMagicKeys()
const {currentView} = useViewState();

whenever(space, () => {
  if (inputValue.value === '' || inputValue.value.length === 0) {
    return
  }
  const value = inputValue.value.trim();
  if (value === '') {
    return
  }
  emitter.emit('selectCurrentItem', true)
})

const visible = computed(() => {
  return currentView.value === View.Self
})
</script>

<template>
  <Command.Dialog v-if="visible" auto-select-first :visible="visible" theme="raycast">
    <template #header>
      <Command.Input placeholder="Search for apps and commands..."
                     v-model="inputValue"
      />
    </template>
    <template #body>
      <!-- <Command.Loading> Hang on... </Command.Loading> -->
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>
        <BuiltIn/>
        <Applications/>
      </Command.List>
    </template>
    <template #footer>
      <ul class="command-palette-commands">
        <li>
          <kbd class="command-palette-commands-key">
            <Enter/>
          </kbd>
          <span>to select</span>
        </li>
        <li>
          <kbd class="command-palette-commands-key">
            <ArrowUp/>
          </kbd>
          <kbd class="command-palette-commands-key">
            <ArrowDown/>
          </kbd>
          <span>to navigate</span>
        </li>
        <li>
          <kbd class="command-palette-commands-key">
            esc
          </kbd>
          <span>
            to close
          </span>
        </li>
      </ul>

      <div class="footer cursor-default">
        <a class="flex items-center" @click="()=>{
          BrowserOpenURL('https://github.com/fzdwx')
        }">
          <span class="mr-1">Power By</span>
          <Logo class="footer-icon"/>
        </a>
      </div>
    </template>
  </Command.Dialog>
</template>

<style scoped>
span{
  @apply text-bgray12 font-bold
}
</style>
