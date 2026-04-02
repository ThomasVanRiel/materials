import type { ElementInfo } from "../../types";
import styles from "./SliderControl.module.css";

interface Props {
  element: ElementInfo;
  value: number;
  onChange: (symbol: string, value: number) => void;
}

export function SliderControl({ element, value, onChange }: Props) {
  return (
    <div className={styles.slider}>
      <label className={styles.label}>
        <span className={styles.symbol} style={{ color: element.color }}>
          {element.symbol}
        </span>
        <span className={styles.name}>{element.name}</span>
      </label>
      <div className={styles.controls}>
        <input
          type="range"
          min={element.sliderMin}
          max={element.sliderMax}
          step={element.step}
          value={value}
          onChange={(e) => onChange(element.symbol, parseFloat(e.target.value))}
          className={styles.range}
          style={{ accentColor: element.color }}
        />
        <span className={styles.value}>{value.toFixed(2)}%</span>
      </div>
    </div>
  );
}
