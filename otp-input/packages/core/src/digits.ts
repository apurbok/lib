const DIGIT_RE = /^\d$/;

export function isDigit(char: string): boolean {
  return char.length === 1 && DIGIT_RE.test(char);
}

/** Extract up to `length` digits from arbitrary text (paste, autofill). */
export function extractDigits(text: string, length: number): string[] {
  const digits: string[] = [];
  for (const ch of text) {
    if (isDigit(ch)) {
      digits.push(ch);
      if (digits.length >= length) break;
    }
  }
  return digits;
}

/** Pad or trim a digit array to exactly `length` cells (empty string = unfilled). */
export function toCells(digits: string[], length: number): string[] {
  const cells = Array.from({ length }, () => "");
  for (let i = 0; i < Math.min(digits.length, length); i++) {
    cells[i] = digits[i]!;
  }
  return cells;
}

export function cellsToValue(cells: string[]): string {
  return cells.join("");
}

export function valueToCells(value: string, length: number): string[] {
  const trimmed = value.replace(/\D/g, "").slice(0, length);
  return toCells(trimmed.split(""), length);
}

export function parsePaste(text: string, length: number): string[] | null {
  const digits = extractDigits(text, length);
  if (digits.length === 0) return null;
  return toCells(digits, length);
}

export function mergeDigitAt(
  cells: string[],
  index: number,
  digit: string
): string[] {
  if (!isDigit(digit) || index < 0 || index >= cells.length) return cells;
  const next = [...cells];
  next[index] = digit;
  return next;
}

export function clearAt(cells: string[], index: number): string[] {
  if (index < 0 || index >= cells.length) return cells;
  const next = [...cells];
  next[index] = "";
  return next;
}

export function isComplete(cells: string[], length: number): boolean {
  return (
    cells.length === length &&
    cells.every((c) => c.length === 1 && isDigit(c))
  );
}
