<script setup lang="ts">
import {ref} from "vue";

interface Props {
  onSave: (val: string) => void
}

defineProps<Props>()

const val = ref('')
</script>

<template>
  <div>
    <label class="flex items-center space-x-2">
      <span>快捷键:</span>
      <input v-model="val">
    </label>

    <button @click="onSave(val)">保存</button>
  </div>
</template>

<style scoped>

</style>
