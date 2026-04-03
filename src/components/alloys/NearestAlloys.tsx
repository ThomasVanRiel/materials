import { useState } from "react";
import type { AlloyMatch } from "../../hooks/useNearestAlloys";
import type { Alloy } from "../../types";
import { getEffectiveComposition } from "../../data/elements";
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

const FAMILY_SHORT: Record<string, string> = {
  "Carbon Steel": "Carbon",
  "Stainless Steel": "Stainless",
  "Tool Steel": "Tool",
  "Nickel Alloy": "Nickel",
  "Aluminum Alloy": "Aluminum",
  "Copper Alloy": "Copper",
};

const FAMILIES = Object.keys(FAMILY_COLORS);

interface Props {
  matches: AlloyMatch[];
  selectedAlloy: Alloy | null;
  onSelect: (alloy: Alloy) => void;
}

export function NearestAlloys({ matches, selectedAlloy, onSelect }: Props) {
  const [activeFamily, setActiveFamily] = useState<string | null>(null);

  const filtered = (activeFamily ? matches.filter((m) => m.alloy.family === activeFamily) : matches).slice(0, 5);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Nearest Alloys</h3>
      <div className={styles.filters}>
        <button
          className={`${styles.chip} ${!activeFamily ? styles.chipActive : ""}`}
          onClick={() => setActiveFamily(null)}
        >
          All
        </button>
        {FAMILIES.map((f) => (
          <button
            key={f}
            className={`${styles.chip} ${activeFamily === f ? styles.chipActiveFamily : ""}`}
            style={activeFamily === f
              ? { background: FAMILY_COLORS[f], borderColor: FAMILY_COLORS[f], color: "#fff" }
              : { borderColor: FAMILY_COLORS[f], color: FAMILY_COLORS[f] }
            }
            onClick={() => setActiveFamily((prev) => (prev === f ? null : f))}
          >
            {FAMILY_SHORT[f]}
          </button>
        ))}
      </div>
      <div className={styles.list}>
        {filtered.map(({ alloy, similarity }) => (
          <AlloyTooltip key={alloy.id} composition={getEffectiveComposition(alloy)}>
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
