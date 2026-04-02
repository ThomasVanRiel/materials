import type { Alloy, Composition, RadarDataPoint } from "../types";

export interface RadarResult {
  points: RadarDataPoint[];
  /** The uniform axis max (wt%) used for normalization */
  axisMax: number;
}

/**
 * Build radar data points with a uniform axis scale.
 * All axes share the same max, determined by the largest value
 * across user composition, pinned alloys, and "Other".
 */
export function buildRadarData(
  composition: Composition,
  selectedElements: Set<string>,
  balanceElement: string,
  prevalence: Map<string, number>,
  pinnedAlloys: Alloy[],
  /** If provided, use this as the axis max instead of computing it (used during drag) */
  frozenAxisMax?: number
): RadarResult {
  const shownElements = new Set(selectedElements);
  shownElements.delete(balanceElement);
  shownElements.delete("Other");

  const showOther = selectedElements.has("Other");

  // Collect all symbols across user composition and all pinned alloys
  const allSymbols = new Set(Object.keys(composition));
  for (const alloy of pinnedAlloys) {
    for (const sym of Object.keys(alloy.composition)) {
      allSymbols.add(sym);
    }
  }

  // First pass: collect raw values to find the global max
  let otherSum = 0;
  const otherSums = new Map<string, number>();
  for (const alloy of pinnedAlloys) {
    otherSums.set(alloy.id, 0);
  }

  interface RawPoint {
    axis: string;
    userVal: number;
    alloyVals: Map<string, number>;
  }
  const rawPoints: RawPoint[] = [];

  let globalMax = 0;

  for (const sym of allSymbols) {
    if (sym === balanceElement) continue;

    const userVal = composition[sym] ?? 0;

    if (shownElements.has(sym)) {
      const alloyVals = new Map<string, number>();
      globalMax = Math.max(globalMax, userVal);
      for (const alloy of pinnedAlloys) {
        const val = alloy.composition[sym] ?? 0;
        alloyVals.set(alloy.id, val);
        globalMax = Math.max(globalMax, val);
      }
      rawPoints.push({ axis: sym, userVal, alloyVals });
    } else {
      otherSum += userVal;
      for (const alloy of pinnedAlloys) {
        const val = alloy.composition[sym] ?? 0;
        otherSums.set(alloy.id, (otherSums.get(alloy.id) ?? 0) + val);
      }
    }
  }

  if (showOther) {
    globalMax = Math.max(globalMax, otherSum);
    for (const val of otherSums.values()) {
      globalMax = Math.max(globalMax, val);
    }
  }

  // Use frozen max during drag, otherwise computed max
  const axisMax = frozenAxisMax ?? (globalMax > 0 ? globalMax : 1);

  // Second pass: normalize using uniform max
  const points: RadarDataPoint[] = rawPoints.map(({ axis, userVal, alloyVals }) => {
    const point: RadarDataPoint = {
      axis,
      rawValue: userVal,
      normalizedValue: userVal / axisMax,
    };
    for (const alloy of pinnedAlloys) {
      const val = alloyVals.get(alloy.id) ?? 0;
      point[`${alloy.id}_norm`] = val / axisMax;
      point[`${alloy.id}_raw`] = val;
    }
    return point;
  });

  // Sort axes by prevalence (descending)
  points.sort((a, b) => (prevalence.get(b.axis) ?? 0) - (prevalence.get(a.axis) ?? 0));

  if (showOther) {
    const otherPoint: RadarDataPoint = {
      axis: "Other",
      rawValue: otherSum,
      normalizedValue: otherSum / axisMax,
    };
    for (const alloy of pinnedAlloys) {
      const val = otherSums.get(alloy.id) ?? 0;
      otherPoint[`${alloy.id}_norm`] = val / axisMax;
      otherPoint[`${alloy.id}_raw`] = val;
    }
    points.push(otherPoint);
  }

  return { points, axisMax };
}
