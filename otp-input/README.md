# otp-input

Monorepo of accessible OTP (one-time code) inputs for **React** and **Vue 3**, with shared parsing and focus helpers.

## Packages

| Package | Description |
|---------|-------------|
| `@libraries/otp-input-core` | Paste parsing, digit validation, focus helpers |
| `@libraries/react-otp-input` | React 18+ component |
| `@libraries/vue-otp-input` | Vue 3 component |

## Features

- Configurable length (N digit boxes)
- Paste a full code from any cell
- Auto-advance on digit entry
- Backspace: clear current cell, or move back and clear previous when empty
- Arrow keys, Delete
- Labels, `role="group"`, per-digit `aria-label`, screen-reader hint

## Install (within monorepo)

```bash
pnpm install
```

## Build

```bash
# all packages
pnpm build

# single package
pnpm --filter @libraries/otp-input-core build
pnpm --filter @libraries/react-otp-input build
pnpm --filter @libraries/vue-otp-input build
```

## Demo

```bash
pnpm dev
```

Open http://localhost:5173 — React and Vue examples on one page.

## React API

```tsx
import { OtpInput } from "@libraries/react-otp-input";

<OtpInput
  length={6}
  value={code}
  onChange={setCode}
  onComplete={(full) => console.log("done", full)}
  label="Verification code"
  hideLabel={false}
  autoFocus
  disabled={false}
  inputMode="numeric"
  autoComplete="one-time-code"
  name="otp"
/>
```

### `OtpInputProps`

| Prop | Type | Default |
|------|------|---------|
| `length` | `number` | `6` |
| `value` | `string` | uncontrolled `""` |
| `onChange` | `(value: string) => void` | — |
| `onComplete` | `(value: string) => void` | — |
| `label` | `string` | `"One-time code"` |
| `hideLabel` | `boolean` | `false` |
| `id` | `string` | auto |
| `name` | `string` | — |
| `disabled` | `boolean` | `false` |
| `autoFocus` | `boolean` | `false` |
| `inputMode` | `"numeric" \| "text"` | `"numeric"` |
| `autoComplete` | `string` | `"one-time-code"` |
| `className` | `string` | — |
| `inputClassName` | `string` | — |

## Vue API

```vue
<script setup>
import { ref } from "vue";
import { OtpInput } from "@libraries/vue-otp-input";

const code = ref("");
</script>

<template>
  <OtpInput
    v-model="code"
    :length="6"
    label="Verification code"
    auto-focus
    @complete="onDone"
  />
</template>
```

### Props / events

| Prop | Type | Default |
|------|------|---------|
| `length` | `number` | `6` |
| `modelValue` / `v-model` | `string` | `""` |
| `label` | `string` | `"One-time code"` |
| `hideLabel` | `boolean` | `false` |
| `autoFocus` | `boolean` | `false` |
| … | same as React where applicable | |

| Event | Payload |
|-------|---------|
| `update:modelValue` | `string` |
| `complete` | `string` (all digits filled) |

## Core API (`@libraries/otp-input-core`)

```ts
import {
  parsePaste,
  valueToCells,
  cellsToValue,
  isDigit,
  isComplete,
  mergeDigitAt,
  clearAt,
  focusInputAt,
  nextIndex,
  prevIndex,
} from "@libraries/otp-input-core";
```

- **`parsePaste(text, length)`** — digits from clipboard → length-sized cell array
- **`valueToCells` / `cellsToValue`** — string ↔ per-cell arrays
- **`focusInputAt(refs, index)`** — focus managed list of inputs

## License

MIT
