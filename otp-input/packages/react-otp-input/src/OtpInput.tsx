import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import {
  cellsToValue,
  clearAt,
  focusInputAt,
  isComplete,
  isDigit,
  mergeDigitAt,
  nextIndex,
  parsePaste,
  prevIndex,
  valueToCells,
} from "@libraries/otp-input-core";

export type OtpInputProps = {
  /** Number of digit boxes (default 6). */
  length?: number;
  /** Controlled string of digits (no separators). */
  value?: string;
  /** Fired when any cell changes. */
  onChange?: (value: string) => void;
  /** Fired once all cells are filled. */
  onComplete?: (value: string) => void;
  /** Visible label; also used for aria-labelledby. */
  label?: string;
  /** Visually hide the label (still available to assistive tech). */
  hideLabel?: boolean;
  id?: string;
  name?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  /** Passed to each digit input (default "numeric"). */
  inputMode?: "numeric" | "text";
  autoComplete?: string;
  className?: string;
  inputClassName?: string;
  /** test id prefix; cells get `${data-testid}-${index}` */
  "data-testid"?: string;
};

export function OtpInput({
  length = 6,
  value: valueProp,
  onChange,
  onComplete,
  label = "One-time code",
  hideLabel = false,
  id: idProp,
  name,
  disabled = false,
  autoFocus = false,
  inputMode = "numeric",
  autoComplete = "one-time-code",
  className,
  inputClassName,
  "data-testid": dataTestId = "otp-input",
}: OtpInputProps) {
  const reactId = useId();
  const groupId = idProp ?? `otp-${reactId}`;
  const labelId = `${groupId}-label`;
  const hintId = `${groupId}-hint`;

  const isControlled = valueProp !== undefined;
  const [uncontrolled, setUncontrolled] = useState(() =>
    valueToCells("", length)
  );

  const cells = isControlled ? valueToCells(valueProp, length) : uncontrolled;

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const setCells = useCallback(
    (next: string[]) => {
      if (!isControlled) setUncontrolled(next);
      const str = cellsToValue(next);
      onChange?.(str);
      if (isComplete(next, length)) onComplete?.(str);
    },
    [isControlled, length, onChange, onComplete]
  );

  const didAutoFocus = useRef(false);
  useEffect(() => {
    if (didAutoFocus.current || !autoFocus || disabled) return;
    didAutoFocus.current = true;
    const firstEmpty = cells.findIndex((c) => c === "");
    const idx = firstEmpty === -1 ? 0 : firstEmpty;
    focusInputAt(inputRefs.current, idx);
  }, [autoFocus, disabled, cells]);

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>, _index: number) => {
      e.preventDefault();
      const parsed = parsePaste(e.clipboardData.getData("text"), length);
      if (!parsed) return;
      setCells(parsed);
      const lastFilled = parsed.findIndex((c) => c === "");
      const focusIdx = lastFilled === -1 ? length - 1 : lastFilled;
      focusInputAt(inputRefs.current, focusIdx);
    },
    [length, setCells]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>, index: number) => {
      if (disabled) return;

      if (e.key === "Backspace") {
        e.preventDefault();
        if (cells[index] !== "") {
          setCells(clearAt(cells, index));
          focusInputAt(inputRefs.current, index);
        } else if (index > 0) {
          const prev = prevIndex(index);
          setCells(clearAt(cells, prev));
          focusInputAt(inputRefs.current, prev);
        }
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        focusInputAt(inputRefs.current, prevIndex(index));
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        focusInputAt(inputRefs.current, nextIndex(index, length));
        return;
      }

      if (e.key === "Delete") {
        e.preventDefault();
        setCells(clearAt(cells, index));
        return;
      }

      if (isDigit(e.key)) {
        e.preventDefault();
        const next = mergeDigitAt(cells, index, e.key);
        setCells(next);
        if (index < length - 1) {
          focusInputAt(inputRefs.current, nextIndex(index, length));
        }
      }
    },
    [cells, disabled, length, setCells]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, index: number) => {
      const v = e.target.value;
      const digit = v.slice(-1);
      if (v === "") {
        setCells(clearAt(cells, index));
        return;
      }
      if (!isDigit(digit)) {
        e.target.value = cells[index] ?? "";
        return;
      }
      const next = mergeDigitAt(cells, index, digit);
      setCells(next);
      if (index < length - 1) {
        focusInputAt(inputRefs.current, nextIndex(index, length));
      }
    },
    [cells, length, setCells]
  );

  return (
    <div className={className} data-testid={dataTestId}>
      <label
        id={labelId}
        htmlFor={`${groupId}-0`}
        className={hideLabel ? "sr-only" : undefined}
        style={
          hideLabel
            ? {
                position: "absolute",
                width: 1,
                height: 1,
                padding: 0,
                margin: -1,
                overflow: "hidden",
                clip: "rect(0,0,0,0)",
                whiteSpace: "nowrap",
                border: 0,
              }
            : undefined
        }
      >
        {label}
      </label>
      <p
        id={hintId}
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {length} digit code. Paste the full code or type one digit per box.
      </p>
      <div
        role="group"
        aria-labelledby={labelId}
        aria-describedby={hintId}
        style={{ display: "flex", gap: "0.5rem" }}
      >
        {cells.map((cell, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            id={`${groupId}-${index}`}
            name={name ? `${name}-${index}` : undefined}
            type="text"
            inputMode={inputMode}
            autoComplete={index === 0 ? autoComplete : "off"}
            pattern={inputMode === "numeric" ? "[0-9]*" : undefined}
            maxLength={1}
            value={cell}
            disabled={disabled}
            className={inputClassName}
            aria-label={`${label}, digit ${index + 1} of ${length}`}
            data-testid={`${dataTestId}-${index}`}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={(e) => handlePaste(e, index)}
            style={{
              width: "2.5rem",
              height: "2.75rem",
              textAlign: "center",
              fontSize: "1.25rem",
              borderRadius: "0.375rem",
              border: "1px solid #ccc",
            }}
          />
        ))}
      </div>
    </div>
  );
}
