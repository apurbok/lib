<script setup lang="ts">
import { STAR_PATH, STAR_VIEW_BOX } from '@libraries/star-rating-core';
import { computed } from 'vue';

const props = defineProps<{
  size: number;
  fill: number;
  filledColor: string;
  emptyColor: string;
  gradientId: string;
}>();

const fillPercent = computed(() => {
  const clamped = Math.min(1, Math.max(0, props.fill));
  return clamped * 100;
});
</script>

<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="STAR_VIEW_BOX"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient :id="gradientId" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" :stop-color="filledColor" />
        <stop :offset="`${fillPercent}%`" :stop-color="filledColor" />
        <stop :offset="`${fillPercent}%`" :stop-color="emptyColor" />
        <stop offset="100%" :stop-color="emptyColor" />
      </linearGradient>
    </defs>
    <path :d="STAR_PATH" :fill="`url(#${gradientId})`" />
  </svg>
</template>
