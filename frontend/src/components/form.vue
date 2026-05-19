<script setup>
const props = defineProps({
  modelValue: Object
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="form-base">
    <slot />
  </div>
</template>

<style scoped>
.form-base {
  display: grid;
  gap: 16px;
}
</style>