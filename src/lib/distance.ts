import type { Composition, ElementInfo } from "../types";

/**
 * Normalized Euclidean distance between two compositions.
 * Each element is divided by its max range so trace elements
 * (like C at 0-2%) weigh proportionally to major elements (Ni at 0-70%).
 */
export function alloyDistance(
  a: Composition,
  b: Composition,
  elements: ElementInfo[]
): number {
  let sumSq = 0;
  for (const el of elements) {
    if (el.sliderMax === 0) continue;
    const va = (a[el.symbol] ?? 0) / el.sliderMax;
    const vb = (b[el.symbol] ?? 0) / el.sliderMax;
    sumSq += (va - vb) ** 2;
  }
  return Math.sqrt(sumSq);
}
