<script setup lang="ts">
import {
  getStarFills,
  normalizeRating,
  type StarFillState,
} from '@libraries/star-rating-core';
import { computed, useId } from 'vue';
import StarIcon from './StarIcon.vue';

import type { StarRatingColors } from './types';

const props = withDefaults(
  defineProps<{
    value: number;
    max?: number;
    precision?: number;
    readOnly?: boolean;
    size?: number;
    gap?: number;
    colors?: StarRatingColors;
    class?: string;
    ariaLabel?: string;
    id?: string;
  }>(),
  {
    max: 5,
    precision: 1,
    readOnly: false,
    size: 24,
    gap: 4,
    ariaLabel: 'Star rating',
  },
);

const emit = defineEmits<{
  change: [value: number];
}>();

const DEFAULT_COLORS = { filled: '#f5a623', empty: '#d8d8d8' };

const baseId = useId();

const normalized = computed(() =>
  normalizeRating(props.value, props.max, props.precision),
);

const fills = computed<StarFillState[]>(() =>
  getStarFills(normalized.value, props.max),
);

const resolvedColors = computed(() => ({
  ...DEFAULT_COLORS,
  ...props.colors,
}));

const interactive = computed(() => !props.readOnly);

function setRating(next: number) {
  if (props.readOnly) return;
  emit('change', normalizeRating(next, props.max, props.precision));
}

function onKeyDown(event: KeyboardEvent) {
  if (props.readOnly) return;
  let next = normalized.value;
  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowUp':
      event.preventDefault();
      next = Math.min(props.max, normalized.value + 1);
      break;
    case 'ArrowLeft':
    case 'ArrowDown':
      event.preventDefault();
      next = Math.max(0, normalized.value - 1);
      break;
    case 'Home':
      event.preventDefault();
      next = 0;
      break;
    case 'End':
      event.preventDefault();
      next = props.max;
      break;
    default:
      return;
  }
  setRating(next);
}
</script>

<template>
  <div
    :id="id"
    :class="props.class"
    :role="interactive ? 'slider' : 'img'"
    :aria-label="ariaLabel"
    :aria-valuemin="interactive ? 0 : undefined"
    :aria-valuemax="interactive ? max : undefined"
    :aria-valuenow="interactive ? normalized : undefined"
    :aria-readonly="readOnly || undefined"
    :tabindex="interactive ? 0 : undefined"
    :style="{
      display: 'inline-flex',
      alignItems: 'center',
      gap: `${gap}px`,
    }"
    @keydown="interactive ? onKeyDown : undefined"
  >
    <button
      v-for="star in fills"
      :key="star.index"
      type="button"
      :disabled="readOnly"
      :aria-label="`${star.index} of ${max} stars`"
      :aria-pressed="star.index <= Math.ceil(normalized)"
      :style="{
        padding: '0',
        border: 'none',
        background: 'transparent',
        cursor: interactive ? 'pointer' : 'default',
        lineHeight: '0',
      }"
      @click="setRating(star.index)"
    >
      <StarIcon
        :size="size"
        :fill="star.fill"
        :filled-color="resolvedColors.filled"
        :empty-color="resolvedColors.empty"
        :gradient-id="`${baseId}-star-${star.index}`"
      />
    </button>
  </div>
</template>
