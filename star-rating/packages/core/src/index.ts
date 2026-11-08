export type StarRatingConfig = {
  /** Current rating value (may include decimals). */
  value: number;
  /** Maximum number of stars (default 5). */
  max?: number;
  /** Decimal places when rounding displayed value (default 1). */
  precision?: number;
};

export type StarFillState = {
  /** 1-based star index. */
  index: number;
  /** Linear fill from 0 (empty) to 1 (full). */
  fill: number;
  /** Same as fill, expressed as 0–100 percentage. */
  fillPercent: number;
};

const DEFAULT_MAX = 5;

/**
 * Clamps a rating into [0, max] and rounds to precision when provided.
 */
export function normalizeRating(
  value: number,
  max: number = DEFAULT_MAX,
  precision?: number,
): number {
  const clamped = Math.min(Math.max(0, value), max);
  if (precision === undefined) {
    return clamped;
  }
  const factor = 10 ** precision;
  return Math.round(clamped * factor) / factor;
}

/**
 * Computes per-star linear fill for a decimal rating.
 * Example: value 4.6, max 5 → stars 1–4 at 100%, star 5 at 60%.
 */
export function getStarFills(
  value: number,
  max: number = DEFAULT_MAX,
): StarFillState[] {
  const clamped = normalizeRating(value, max);
  const fills: StarFillState[] = [];

  for (let index = 1; index <= max; index++) {
    const raw = Math.min(1, Math.max(0, clamped - (index - 1)));
    const fill = Math.round(raw * 10000) / 10000;
    fills.push({
      index,
      fill,
      fillPercent: Math.round(fill * 10000) / 100,
    });
  }

  return fills;
}

export { STAR_PATH, STAR_VIEW_BOX } from './star-path';

export function starRatingFromConfig(config: StarRatingConfig): StarFillState[] {
  const max = config.max ?? DEFAULT_MAX;
  const value =
    config.precision !== undefined
      ? normalizeRating(config.value, max, config.precision)
      : normalizeRating(config.value, max);
  return getStarFills(value, max);
}
