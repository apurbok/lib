import { STAR_PATH, STAR_VIEW_BOX } from '@libraries/star-rating-core';

export type StarIconProps = {
  size: number;
  fill: number;
  filledColor: string;
  emptyColor: string;
  gradientId: string;
};

export function StarIcon({
  size,
  fill,
  filledColor,
  emptyColor,
  gradientId,
}: StarIconProps) {
  const clampedFill = Math.min(1, Math.max(0, fill));
  const fillPercent = clampedFill * 100;

  return (
    <svg
      width={size}
      height={size}
      viewBox={STAR_VIEW_BOX}
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={filledColor} />
          <stop offset={`${fillPercent}%`} stopColor={filledColor} />
          <stop offset={`${fillPercent}%`} stopColor={emptyColor} />
          <stop offset="100%" stopColor={emptyColor} />
        </linearGradient>
      </defs>
      <path d={STAR_PATH} fill={`url(#${gradientId})`} />
    </svg>
  );
}
