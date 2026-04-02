import type { Alloy } from "../../types";
import styles from "./PropertyDisplay.module.css";

const ALLOY_COLORS = [
  "#f97316", "#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b",
  "#6366f1", "#ef4444", "#22c55e", "#06b6d4", "#a855f7",
];

interface Props {
  pinnedAlloys: Alloy[];
  nearestAlloy: Alloy | null;
}

function fmt(value: number | string | null, unit?: string): string {
  if (value === null) return "—";
  return `${value}${unit ? ` ${unit}` : ""}`;
}

export function PropertyDisplay({ pinnedAlloys, nearestAlloy }: Props) {
  // Build list of alloys to show: pinned first, then nearest if not already pinned
  const alloys: Alloy[] = [...pinnedAlloys];
  if (nearestAlloy && !alloys.some((a) => a.id === nearestAlloy.id)) {
    alloys.push(nearestAlloy);
  }

  if (alloys.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>Pin alloys or adjust sliders to compare properties</div>
      </div>
    );
  }

  const rows: { section: string; label: string; unit?: string; getValue: (a: Alloy) => number | string | null }[] = [
    { section: "Mechanical", label: "Hardness", unit: "HRC", getValue: (a) => a.properties.mechanical.hardnessHRC },
    { section: "", label: "Tensile Strength", unit: "MPa", getValue: (a) => a.properties.mechanical.tensileStrengthMPa },
    { section: "", label: "Yield Strength", unit: "MPa", getValue: (a) => a.properties.mechanical.yieldStrengthMPa },
    { section: "", label: "Elongation", unit: "%", getValue: (a) => a.properties.mechanical.elongationPercent },
    { section: "Thermal", label: "Conductivity", unit: "W/m·K", getValue: (a) => a.properties.thermal.thermalConductivityWmK },
    { section: "", label: "Max Service Temp", unit: "°C", getValue: (a) => a.properties.thermal.maxServiceTempC },
    { section: "", label: "Melting Range", unit: "°C", getValue: (a) => `${a.properties.thermal.meltingRangeLowC}–${a.properties.thermal.meltingRangeHighC}` },
    { section: "Corrosion", label: "Resistance", getValue: (a) => a.properties.corrosion.corrosionResistance },
    { section: "", label: "PREN", getValue: (a) => a.properties.corrosion.pren },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.propHeader}>Property</th>
              {alloys.map((alloy) => {
                const isPinned = pinnedAlloys.some((a) => a.id === alloy.id);
                const colorIdx = pinnedAlloys.findIndex((a) => a.id === alloy.id);
                return (
                  <th key={alloy.id} className={styles.alloyHeader}>
                    {isPinned && (
                      <span
                        className={styles.colorDot}
                        style={{ background: ALLOY_COLORS[colorIdx % ALLOY_COLORS.length] }}
                      />
                    )}
                    {alloy.name}
                    {!isPinned && <span className={styles.nearestBadge}>nearest</span>}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={row.section ? styles.sectionStart : undefined}>
                <td className={styles.propLabel}>
                  {row.section && <span className={styles.sectionLabel}>{row.section}</span>}
                  {row.label}
                </td>
                {alloys.map((alloy) => (
                  <td key={alloy.id} className={styles.propValue}>
                    {fmt(row.getValue(alloy), row.unit)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
