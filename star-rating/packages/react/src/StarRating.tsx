import {
  getStarFills,
  normalizeRating,
  type StarFillState,
} from '@libraries/star-rating-core';
import {
  useCallback,
  useId,
  useMemo,
  type CSSProperties,
  type KeyboardEvent,
} from 'react';
import { StarIcon } from './StarIcon';

export type StarRatingColors = {
  filled?: string;
  empty?: string;
};

export type StarRatingProps = {
  value: number;
  max?: number;
  precision?: number;
  readOnly?: boolean;
  size?: number;
  gap?: number;
  colors?: StarRatingColors;
  onChange?: (value: number) => void;
  className?: string;
  /** Accessible label; defaults to "Star rating". */
  'aria-label'?: string;
  id?: string;
};

const DEFAULT_COLORS: Required<StarRatingColors> = {
  filled: '#f5a623',
  empty: '#d8d8d8',
};

export function StarRating({
  value,
  max = 5,
  precision = 1,
  readOnly = false,
  size = 24,
  gap = 4,
  colors,
  onChange,
  className,
  'aria-label': ariaLabel = 'Star rating',
  id,
}: StarRatingProps) {
  const baseId = useId().replace(/:/g, '');
  const normalized = normalizeRating(value, max, precision);
  const fills: StarFillState[] = useMemo(
    () => getStarFills(normalized, max),
    [normalized, max],
  );

  const resolvedColors = { ...DEFAULT_COLORS, ...colors };

  const setRating = useCallback(
    (next: number) => {
      if (readOnly || !onChange) return;
      onChange(normalizeRating(next, max, precision));
    },
    [readOnly, onChange, max, precision],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (readOnly || !onChange) return;
      let next = normalized;
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          event.preventDefault();
          next = Math.min(max, normalized + 1);
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          event.preventDefault();
          next = Math.max(0, normalized - 1);
          break;
        case 'Home':
          event.preventDefault();
          next = 0;
          break;
        case 'End':
          event.preventDefault();
          next = max;
          break;
        default:
          return;
      }
      setRating(next);
    },
    [readOnly, onChange, normalized, max, setRating],
  );

  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap,
  };

  const interactive = !readOnly && !!onChange;

  return (
    <div
      id={id}
      className={className}
      role={interactive ? 'slider' : 'img'}
      aria-label={ariaLabel}
      aria-valuemin={interactive ? 0 : undefined}
      aria-valuemax={interactive ? max : undefined}
      aria-valuenow={interactive ? normalized : undefined}
      aria-readonly={readOnly || undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? onKeyDown : undefined}
      style={style}
    >
      {fills.map((star) => {
        const starValue = star.index;
        return (
          <button
            key={star.index}
            type="button"
            disabled={readOnly || !onChange}
            aria-label={`${starValue} of ${max} stars`}
            aria-pressed={starValue <= Math.ceil(normalized)}
            onClick={() => setRating(starValue)}
            style={{
              padding: 0,
              border: 'none',
              background: 'transparent',
              cursor: interactive ? 'pointer' : 'default',
              lineHeight: 0,
            }}
          >
            <StarIcon
              size={size}
              fill={star.fill}
              filledColor={resolvedColors.filled}
              emptyColor={resolvedColors.empty}
              gradientId={`${baseId}-star-${star.index}`}
            />
          </button>
        );
      })}
    </div>
  );
}
