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
  class?: string;
  ariaLabel?: string;
  id?: string;
};
