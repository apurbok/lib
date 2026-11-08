import { getStarFills } from '@libraries/star-rating-core';
import { defineLinearStarRating } from '@libraries/linear-star-rating-element';
import { mountReact } from './react-demo';
import { mountVue } from './vue-demo';

const sampleValue = 4.6;
const max = 5;

const fills = getStarFills(sampleValue, max);
const meta = document.getElementById('core-meta');
const output = document.getElementById('core-output');
if (meta) {
  meta.textContent = `Rating ${sampleValue} / ${max}`;
}
if (output) {
  output.textContent = JSON.stringify(fills, null, 2);
}

mountReact();
mountVue();

defineLinearStarRating();

const wc = document.getElementById('wc-rating');
const wcValue = document.getElementById('wc-value');
wc?.addEventListener('change', ((event: CustomEvent<{ value: number }>) => {
  if (wcValue) {
    wcValue.textContent = `Value: ${event.detail.value}`;
  }
}) as EventListener);
