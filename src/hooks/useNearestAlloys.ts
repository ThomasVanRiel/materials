import { useMemo } from "react";
import type { Alloy, Composition } from "../types";
import { ELEMENTS } from "../data/elements";
import { alloyDistance } from "../lib/distance";

export interface AlloyMatch {
  alloy: Alloy;
  distance: number;
  similarity: number;
}

export function useNearestAlloys(
  currentComposition: Composition,
  alloys: Alloy[],
  topN = 5
): AlloyMatch[] {
  return useMemo(() => {
    const maxDistance = Math.sqrt(ELEMENTS.length); // theoretical max when all normalized diffs = 1
    return alloys
      .map((alloy) => {
        const dist = alloyDistance(currentComposition, alloy.composition, ELEMENTS);
        return {
          alloy,
          distance: dist,
          similarity: Math.max(0, Math.round((1 - dist / maxDistance) * 1000) / 10),
        };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, topN);
  }, [currentComposition, alloys, topN]);
}
