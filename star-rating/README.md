# star-rating

Monorepo for **linear** decimal star ratings — framework-agnostic core plus React, Vue, and a web component.

## Packages

| Package | NPM name | Description |
|---------|----------|-------------|
| `packages/core` | `@libraries/star-rating-core` | Fill math, types, SVG path constants |
| `packages/react` | `@libraries/react-star-rating` | React 18+ component |
| `packages/vue` | `@libraries/vue-star-rating` | Vue 3 component |
| `packages/web-component` | `@libraries/linear-star-rating-element` | `<linear-star-rating>` custom element |
| `apps/demo` | `demo` | Vite playground |

## Quick start

### Core

```ts
import { getStarFills } from '@libraries/star-rating-core';

getStarFills(4.6, 5);
// → stars 1–4 at 100%, star 5 at 60% (fill: 0.6)
```

### React

```tsx
import { StarRating } from '@libraries/react-star-rating';

<StarRating value={4.6} onChange={setValue} aria-label="Rating" />
```

### Vue

```vue
<script setup>
import StarRating from '@libraries/vue-star-rating';
import { ref } from 'vue';
const value = ref(4.6);
</script>

<template>
  <StarRating :value="value" @change="value = $event" />
</template>
```

### Web component

```html
<script type="module">
  import { defineLinearStarRating } from '@libraries/linear-star-rating-element';
  defineLinearStarRating();
</script>

<linear-star-rating value="4.6" max="5"></linear-star-rating>
```

Attributes: `value`, `max`, `precision`, `readonly`, `size`, `gap`, `filled-color`, `empty-color`, `aria-label`.

Events: `change` with `detail.value`.

## Develop

Requires [pnpm](https://pnpm.io) 9+ and Node 18+.

```bash
cd star-rating
pnpm install
pnpm build
pnpm test
pnpm demo   # → http://localhost:5173
```

## Accessibility

When not `readOnly` / when `onChange` is provided (React), the control exposes `role="slider"` with arrow keys, Home, and End. Individual stars are buttons with labels like `3 of 5 stars`. Focus styles are provided on the web component; consumers may add CSS for React/Vue.

## License

MIT (add `LICENSE` as needed for publication).
