export type FocusableElement = HTMLElement & { focus: () => void; select?: () => void };

export function clampIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  return Math.max(0, Math.min(index, length - 1));
}

export function nextFilledIndex(cells: string[], from: number): number {
  for (let i = from; i < cells.length; i++) {
    if (cells[i] === "") return i;
  }
  return cells.length - 1;
}

export function prevIndex(current: number): number {
  return Math.max(0, current - 1);
}

export function nextIndex(current: number, length: number): number {
  return Math.min(length - 1, current + 1);
}

export function focusInputAt(
  refs: Array<FocusableElement | null | undefined>,
  index: number,
  options?: { select?: boolean }
): void {
  const el = refs[clampIndex(index, refs.length)];
  if (!el) return;
  el.focus();
  if (options?.select && typeof el.select === "function") {
    el.select();
  }
}

export function firstEmptyIndex(cells: string[]): number {
  const idx = cells.findIndex((c) => c === "");
  return idx === -1 ? cells.length - 1 : idx;
}
