import type { ElementInfo } from "../../types";
import styles from "./ElementSelector.module.css";

interface Props {
  elements: ElementInfo[];
  selectedElements: Set<string>;
  onToggle: (symbol: string) => void;
}

export function ElementSelector({ elements, selectedElements, onToggle }: Props) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Radar Axes</h3>
      <div className={styles.chips}>
        {elements.map((el) => (
          <button
            key={el.symbol}
            className={`${styles.chip} ${selectedElements.has(el.symbol) ? styles.active : ""}`}
            style={
              selectedElements.has(el.symbol)
                ? { borderColor: el.color, backgroundColor: el.color + "18" }
                : undefined
            }
            onClick={() => onToggle(el.symbol)}
            title={el.name}
          >
            {el.symbol}
          </button>
        ))}
        <button
          className={`${styles.chip} ${styles.otherChip} ${selectedElements.has("Other") ? styles.active : ""}`}
          style={
            selectedElements.has("Other")
              ? { borderColor: "#9ca3af", backgroundColor: "#9ca3af18" }
              : undefined
          }
          onClick={() => onToggle("Other")}
          title="Sum of all non-selected, non-balance elements"
        >
          Other
        </button>
      </div>
    </div>
  );
}
