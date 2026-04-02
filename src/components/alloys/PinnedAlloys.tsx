import type { Alloy } from "../../types";
import { ALLOYS } from "../../data/alloys";
import styles from "./PinnedAlloys.module.css";

const ALLOY_COLORS = [
  "#f97316", "#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b",
  "#6366f1", "#ef4444", "#22c55e", "#06b6d4", "#a855f7",
];

interface Props {
  pinnedAlloys: Alloy[];
  onToggle: (alloy: Alloy) => void;
}

export function PinnedAlloys({ pinnedAlloys, onToggle }: Props) {
  const pinnedIds = new Set(pinnedAlloys.map((a) => a.id));

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Compare Alloys</h3>
      {pinnedAlloys.length > 0 && (
        <div className={styles.pinned}>
          {pinnedAlloys.map((alloy, i) => (
            <button
              key={alloy.id}
              className={styles.pinnedItem}
              onClick={() => onToggle(alloy)}
              title="Click to remove"
            >
              <span
                className={styles.colorDot}
                style={{ background: ALLOY_COLORS[i % ALLOY_COLORS.length] }}
              />
              <span className={styles.pinnedName}>{alloy.name}</span>
              <span className={styles.remove}>x</span>
            </button>
          ))}
        </div>
      )}
      <div className={styles.list}>
        {ALLOYS.filter((a) => !pinnedIds.has(a.id)).map((alloy) => (
          <button
            key={alloy.id}
            className={styles.item}
            onClick={() => onToggle(alloy)}
          >
            <span className={styles.itemName}>{alloy.name}</span>
            <span className={styles.itemFamily}>{alloy.family}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
