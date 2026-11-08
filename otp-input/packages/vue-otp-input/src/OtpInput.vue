<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  ref,
  useId,
  watch,
  type Ref,
} from "vue";
import {
  cellsToValue,
  clearAt,
  focusInputAt,
  isComplete,
  isDigit,
  mergeDigitAt,
  nextIndex,
  parsePaste,
  prevIndex,
  valueToCells,
} from "@libraries/otp-input-core";

import type { OtpInputProps } from "./types";

const props = withDefaults(defineProps<OtpInputProps>(), {
  length: 6,
  modelValue: "",
  label: "One-time code",
  hideLabel: false,
  disabled: false,
  autoFocus: false,
  inputMode: "numeric",
  autoComplete: "one-time-code",
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  complete: [value: string];
}>();

const uid = useId();
const groupId = computed(() => props.id ?? `otp-${uid}`);
const labelId = computed(() => `${groupId.value}-label`);
const hintId = computed(() => `${groupId.value}-hint`);

const inputRefs: Ref<Array<HTMLInputElement | null>> = ref([]);

const cells = computed(() => valueToCells(props.modelValue, props.length));

function setInputRef(el: unknown, index: number) {
  inputRefs.value[index] = el as HTMLInputElement | null;
}

function emitCells(next: string[]) {
  const str = cellsToValue(next);
  emit("update:modelValue", str);
  if (isComplete(next, props.length)) emit("complete", str);
}

function focusAt(index: number) {
  nextTick(() => focusInputAt(inputRefs.value, index));
}

function onPaste(e: ClipboardEvent) {
  e.preventDefault();
  const parsed = parsePaste(e.clipboardData?.getData("text") ?? "", props.length);
  if (!parsed) return;
  emitCells(parsed);
  const lastFilled = parsed.findIndex((c) => c === "");
  const focusIdx = lastFilled === -1 ? props.length - 1 : lastFilled;
  focusAt(focusIdx);
}

function onKeyDown(e: KeyboardEvent, index: number) {
  if (props.disabled) return;
  const current = cells.value;

  if (e.key === "Backspace") {
    e.preventDefault();
    if (current[index] !== "") {
      emitCells(clearAt(current, index));
      focusAt(index);
    } else if (index > 0) {
      const prev = prevIndex(index);
      emitCells(clearAt(current, prev));
      focusAt(prev);
    }
    return;
  }

  if (e.key === "ArrowLeft") {
    e.preventDefault();
    focusAt(prevIndex(index));
    return;
  }

  if (e.key === "ArrowRight") {
    e.preventDefault();
    focusAt(nextIndex(index, props.length));
    return;
  }

  if (e.key === "Delete") {
    e.preventDefault();
    emitCells(clearAt(current, index));
    return;
  }

  if (isDigit(e.key)) {
    e.preventDefault();
    emitCells(mergeDigitAt(current, index, e.key));
    if (index < props.length - 1) {
      focusAt(nextIndex(index, props.length));
    }
  }
}

function onInput(e: Event, index: number) {
  const target = e.target as HTMLInputElement;
  const v = target.value;
  const current = cells.value;

  if (v === "") {
    emitCells(clearAt(current, index));
    return;
  }

  const digit = v.slice(-1);
  if (!isDigit(digit)) {
    target.value = current[index] ?? "";
    return;
  }

  emitCells(mergeDigitAt(current, index, digit));
  if (index < props.length - 1) {
    focusAt(nextIndex(index, props.length));
  }
}

onMounted(() => {
  if (!props.autoFocus || props.disabled) return;
  const firstEmpty = cells.value.findIndex((c) => c === "");
  const idx = firstEmpty === -1 ? 0 : firstEmpty;
  focusAt(idx);
});

watch(
  () => props.length,
  (len) => {
    const trimmed = valueToCells(props.modelValue, len);
    if (cellsToValue(trimmed) !== props.modelValue) {
      emit("update:modelValue", cellsToValue(trimmed));
    }
  }
);
</script>

<template>
  <div class="otp-input-root" data-testid="otp-input">
    <label
      :id="labelId"
      :for="`${groupId}-0`"
      :class="{ 'sr-only': hideLabel }"
    >
      {{ label }}
    </label>
    <p :id="hintId" class="sr-only">
      {{ length }} digit code. Paste the full code or type one digit per box.
    </p>
    <div
      role="group"
      :aria-labelledby="labelId"
      :aria-describedby="hintId"
      class="otp-input-group"
    >
      <input
        v-for="(cell, index) in cells"
        :key="index"
        :ref="(el) => setInputRef(el, index)"
        :id="`${groupId}-${index}`"
        :name="name ? `${name}-${index}` : undefined"
        type="text"
        :inputmode="inputMode"
        :autocomplete="index === 0 ? autoComplete : 'off'"
        :pattern="inputMode === 'numeric' ? '[0-9]*' : undefined"
        maxlength="1"
        :value="cell"
        :disabled="disabled"
        :class="inputClass"
        :aria-label="`${label}, digit ${index + 1} of ${length}`"
        :data-testid="`otp-input-${index}`"
        class="otp-input-cell"
        @input="onInput($event, index)"
        @keydown="onKeyDown($event, index)"
        @paste="onPaste"
      />
    </div>
  </div>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.otp-input-group {
  display: flex;
  gap: 0.5rem;
}

.otp-input-cell {
  width: 2.5rem;
  height: 2.75rem;
  text-align: center;
  font-size: 1.25rem;
  border-radius: 0.375rem;
  border: 1px solid #ccc;
}
</style>
