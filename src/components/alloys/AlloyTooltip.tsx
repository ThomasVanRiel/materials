import { useState, useRef, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { Composition } from "../../types";
import styles from "./AlloyTooltip.module.css";

interface Props {
  composition: Composition;
  children: ReactNode;
}

export function AlloyTooltip({ composition, children }: Props) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const entries = Object.entries(composition)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);

  const handleEnter = useCallback(() => {
    timerRef.current = setTimeout(() => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        setPos({ top: rect.top, left: rect.right + 8 });
      }
      setVisible(true);
    }, 400);
  }, []);

  const handleLeave = useCallback(() => {
    clearTimeout(timerRef.current);
    setVisible(false);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}
      {visible &&
        createPortal(
          <div className={styles.tooltip} style={{ top: pos.top, left: pos.left }}>
            {entries.map(([sym, wt]) => (
              <span key={sym} className={styles.entry}>
                <span className={styles.sym}>{sym}</span>
                <span className={styles.val}>{wt < 1 ? wt.toFixed(2) : wt.toFixed(1)}%</span>
              </span>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}
