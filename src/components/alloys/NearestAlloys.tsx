import type { AlloyMatch } from "../../hooks/useNearestAlloys";
import type { Alloy } from "../../types";
import { AlloyTooltip } from "./AlloyTooltip";
import styles from "./NearestAlloys.module.css";

const FAMILY_COLORS: Record<string, string> = {
  "Carbon Steel": "#78716c",
  "Stainless Steel": "#059669",
  "Tool Steel": "#dc2626",
  "Nickel Alloy": "#d97706",
  "Aluminum Alloy": "#2563eb",
  "Copper Alloy": "#b45309",
};

interface Props {
  matches: AlloyMatch[];
  selectedAlloy: Alloy | null;
  onSelect: (alloy: Alloy) => void;
}

export function NearestAlloys({ matches, selectedAlloy, onSelect }: Props) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Nearest Alloys</h3>
      <div className={styles.list}>
        {matches.map(({ alloy, similarity }) => (
          <AlloyTooltip key={alloy.id} composition={alloy.composition}>
            <button
              className={`${styles.item} ${selectedAlloy?.id === alloy.id ? styles.active : ""}`}
              onClick={() => onSelect(alloy)}
            >
              <div className={styles.itemHeader}>
                <span className={styles.name}>{alloy.name}</span>
                <span className={styles.similarity}>{similarity}%</span>
              </div>
              <span
                className={styles.family}
                style={{ color: FAMILY_COLORS[alloy.family] ?? "#6b7280" }}
              >
                {alloy.family}
              </span>
            </button>
          </AlloyTooltip>
        ))}
      </div>
    </div>
  );
}
