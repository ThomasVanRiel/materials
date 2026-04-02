import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AXIS_OPTIONS,
  AXIS_OPTIONS_MAP,
  CATEGORY_LABELS,
  type AxisOption,
} from "../../lib/axisOptions";
import styles from "./AxisSelector.module.css";

interface Props {
  value: string;
  onChange: (key: string) => void;
}

const CATEGORIES: AxisOption["category"][] = [
  "mechanical",
  "thermal",
  "corrosion",
  "element",
];

export function AxisSelector({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const current = AXIS_OPTIONS_MAP.get(value);

  const handleSelect = useCallback(
    (key: string) => {
      onChange(key);
      setOpen(false);
    },
    [onChange]
  );

  const dropdownPos = () => {
    if (!triggerRef.current) return { top: 0, left: 0 };
    const rect = triggerRef.current.getBoundingClientRect();
    return { top: rect.bottom + 4, left: rect.left };
  };

  return (
    <>
      <button
        ref={triggerRef}
        className={styles.trigger}
        onClick={() => setOpen((p) => !p)}
      >
        {current?.label ?? value}
        <span className={styles.arrow}>&#9662;</span>
      </button>
      {open &&
        createPortal(
          <>
            <div
              className={styles.backdrop}
              onClick={() => setOpen(false)}
            />
            <div className={styles.dropdown} style={dropdownPos()}>
              {CATEGORIES.map((cat) => {
                const options = AXIS_OPTIONS.filter((o) => o.category === cat);
                return (
                  <div key={cat}>
                    <div className={styles.categoryLabel}>
                      {CATEGORY_LABELS[cat]}
                    </div>
                    {options.map((opt) => (
                      <button
                        key={opt.key}
                        className={
                          opt.key === value
                            ? styles.optionActive
                            : styles.option
                        }
                        onClick={() => handleSelect(opt.key)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </>,
          document.body
        )}
    </>
  );
}
