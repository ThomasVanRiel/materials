import type { Composition, ElementInfo } from "../../types";
import { BALANCE_ELEMENTS } from "../../hooks/useComposition";
import { SliderControl } from "./SliderControl";
import styles from "./CompositionSliders.module.css";

interface Props {
  elements: ElementInfo[];
  composition: Composition;
  balanceElement: string;
  balanceValue: number;
  onElementChange: (symbol: string, value: number) => void;
  onBalanceChange: (symbol: string) => void;
}

export function CompositionSliders({
  elements,
  composition,
  balanceElement,
  balanceValue,
  onElementChange,
  onBalanceChange,
}: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.balanceRow}>
        <label className={styles.balanceLabel}>
          Balance:
          <select
            className={styles.balanceSelect}
            value={balanceElement}
            onChange={(e) => onBalanceChange(e.target.value)}
          >
            {BALANCE_ELEMENTS.map((sym) => (
              <option key={sym} value={sym}>
                {sym}
              </option>
            ))}
          </select>
        </label>
        <span className={styles.balanceValue}>{balanceValue.toFixed(2)}%</span>
      </div>
      <div className={styles.sliders}>
        {elements.map((el) => (
          <SliderControl
            key={el.symbol}
            element={el}
            value={composition[el.symbol] ?? 0}
            onChange={onElementChange}
          />
        ))}
      </div>
    </div>
  );
}
