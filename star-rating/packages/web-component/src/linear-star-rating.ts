import {
  getStarFills,
  normalizeRating,
  STAR_PATH,
  STAR_VIEW_BOX,
} from '@libraries/star-rating-core';

const TAG = 'linear-star-rating';

export class LinearStarRatingElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return [
      'value',
      'max',
      'precision',
      'readonly',
      'size',
      'gap',
      'filled-color',
      'empty-color',
      'aria-label',
    ];
  }

  #shadow: ShadowRoot;
  #root: HTMLDivElement;
  #fillsContainer: HTMLDivElement;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = `
      :host { display: inline-block; }
      .root { display: inline-flex; align-items: center; }
      button {
        padding: 0;
        border: none;
        background: transparent;
        line-height: 0;
        cursor: pointer;
      }
      button:disabled { cursor: default; }
      button:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px; border-radius: 2px; }
    `;
    this.#root = document.createElement('div');
    this.#root.className = 'root';
    this.#fillsContainer = document.createElement('div');
    this.#fillsContainer.style.display = 'contents';
    this.#root.appendChild(this.#fillsContainer);
    this.#shadow.append(style, this.#root);
  }

  connectedCallback(): void {
    this.render();
    this.#root.addEventListener('keydown', this.onKeyDown);
  }

  disconnectedCallback(): void {
    this.#root.removeEventListener('keydown', this.onKeyDown);
  }

  attributeChangedCallback(): void {
    if (this.isConnected) {
      this.render();
    }
  }

  get value(): number {
    return Number(this.getAttribute('value') ?? 0);
  }

  set value(next: number) {
    this.setAttribute('value', String(next));
  }

  get max(): number {
    return Number(this.getAttribute('max') ?? 5);
  }

  get precision(): number {
    return Number(this.getAttribute('precision') ?? 1);
  }

  get readOnly(): boolean {
    return this.hasAttribute('readonly');
  }

  get size(): number {
    return Number(this.getAttribute('size') ?? 24);
  }

  get gap(): number {
    return Number(this.getAttribute('gap') ?? 4);
  }

  get filledColor(): string {
    return this.getAttribute('filled-color') ?? '#f5a623';
  }

  get emptyColor(): string {
    return this.getAttribute('empty-color') ?? '#d8d8d8';
  }

  get ariaLabelText(): string {
    return this.getAttribute('aria-label') ?? 'Star rating';
  }

  private readonly onKeyDown = (event: KeyboardEvent) => {
    if (this.readOnly) return;
    const max = this.max;
    let normalized = normalizeRating(this.value, max, this.precision);
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault();
        normalized = Math.min(max, normalized + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        event.preventDefault();
        normalized = Math.max(0, normalized - 1);
        break;
      case 'Home':
        event.preventDefault();
        normalized = 0;
        break;
      case 'End':
        event.preventDefault();
        normalized = max;
        break;
      default:
        return;
    }
    this.value = normalized;
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: normalized },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private render(): void {
    const max = this.max;
    const normalized = normalizeRating(this.value, max, this.precision);
    const interactive = !this.readOnly;

    this.#root.style.gap = `${this.gap}px`;
    this.#root.setAttribute('role', interactive ? 'slider' : 'img');
    this.#root.setAttribute('aria-label', this.ariaLabelText);
    if (interactive) {
      this.#root.tabIndex = 0;
      this.#root.setAttribute('aria-valuemin', '0');
      this.#root.setAttribute('aria-valuemax', String(max));
      this.#root.setAttribute('aria-valuenow', String(normalized));
    } else {
      this.#root.removeAttribute('tabindex');
      this.#root.removeAttribute('aria-valuemin');
      this.#root.removeAttribute('aria-valuemax');
      this.#root.removeAttribute('aria-valuenow');
    }

    const fills = getStarFills(normalized, max);
    const uid = `lsr-${Math.random().toString(36).slice(2, 9)}`;

    this.#fillsContainer.replaceChildren(
      ...fills.map((star) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.disabled = this.readOnly;
        btn.setAttribute('aria-label', `${star.index} of ${max} stars`);
        btn.setAttribute(
          'aria-pressed',
          String(star.index <= Math.ceil(normalized)),
        );
        if (!interactive) {
          btn.style.cursor = 'default';
        }
        btn.addEventListener('click', () => {
          if (this.readOnly) return;
          const next = normalizeRating(star.index, max, this.precision);
          this.value = next;
          this.dispatchEvent(
            new CustomEvent('change', {
              detail: { value: next },
              bubbles: true,
              composed: true,
            }),
          );
        });

        const fillPercent = Math.min(1, Math.max(0, star.fill)) * 100;
        const gradientId = `${uid}-g-${star.index}`;
        btn.innerHTML = `
          <svg width="${this.size}" height="${this.size}" viewBox="${STAR_VIEW_BOX}" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="${this.filledColor}" />
                <stop offset="${fillPercent}%" stop-color="${this.filledColor}" />
                <stop offset="${fillPercent}%" stop-color="${this.emptyColor}" />
                <stop offset="100%" stop-color="${this.emptyColor}" />
              </linearGradient>
            </defs>
            <path d="${STAR_PATH}" fill="url(#${gradientId})" />
          </svg>
        `;
        return btn;
      }),
    );
  }
}

export function defineLinearStarRating(tag = TAG): void {
  if (!customElements.get(tag)) {
    customElements.define(tag, LinearStarRatingElement);
  }
}
