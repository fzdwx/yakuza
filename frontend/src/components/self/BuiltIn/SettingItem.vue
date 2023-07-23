<script setup lang="ts">
import {ref} from "vue";

interface Props {
  onSave: (val: string) => void
  name: string
}

defineProps<Props>()

const val = ref('')
</script>

<template>
  <div>
    <span>{{name}}</span>
    <label class="flex items-center space-x-2">
      <span>快捷键:</span>
      <input v-model="val">
    </label>

    <button @click="onSave(val)">保存</button>
  </div>
</template>

<style scoped>

</style>
