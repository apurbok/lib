import StarRating from '@libraries/vue-star-rating';
import { createApp, ref } from 'vue';

export function mountVue(): void {
  const el = document.getElementById('vue-root');
  if (!el) return;

  createApp({
    components: { StarRating },
    setup() {
      const value = ref(3.2);
      return { value };
    },
    template: `
      <div>
        <StarRating :value="value" :size="28" @change="value = $event" aria-label="Vue demo rating" />
        <p class="meta" style="margin-top: 0.5rem; color: #555">Value: {{ value }}</p>
      </div>
    `,
  }).mount(el);
}
