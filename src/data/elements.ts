import type { ElementInfo } from "../types";

export const ELEMENTS: ElementInfo[] = [
  { symbol: "C",  name: "Carbon",      atomicNumber:  6, sliderMin: 0, sliderMax: 2.5,  step: 0.01,  color: "#374151" },
  { symbol: "N",  name: "Nitrogen",    atomicNumber:  7, sliderMin: 0, sliderMax: 0.5,  step: 0.005, color: "#0d9488" },
  { symbol: "Mg", name: "Magnesium",   atomicNumber: 12, sliderMin: 0, sliderMax: 10,   step: 0.05,  color: "#16a34a" },
  { symbol: "Al", name: "Aluminum",    atomicNumber: 13, sliderMin: 0, sliderMax: 100,  step: 0.05,  color: "#65a30d" },
  { symbol: "Si", name: "Silicon",     atomicNumber: 14, sliderMin: 0, sliderMax: 14,   step: 0.05,  color: "#2563eb" },
  { symbol: "P",  name: "Phosphorus",  atomicNumber: 15, sliderMin: 0, sliderMax: 0.5,  step: 0.005, color: "#a3a3a3" },
  { symbol: "S",  name: "Sulfur",      atomicNumber: 16, sliderMin: 0, sliderMax: 0.1,  step: 0.005, color: "#fbbf24" },
  { symbol: "Ti", name: "Titanium",    atomicNumber: 22, sliderMin: 0, sliderMax: 5,    step: 0.05,  color: "#6366f1" },
  { symbol: "V",  name: "Vanadium",    atomicNumber: 23, sliderMin: 0, sliderMax: 5,    step: 0.05,  color: "#0891b2" },
  { symbol: "Cr", name: "Chromium",    atomicNumber: 24, sliderMin: 0, sliderMax: 30,   step: 0.1,   color: "#059669" },
  { symbol: "Mn", name: "Manganese",   atomicNumber: 25, sliderMin: 0, sliderMax: 15,   step: 0.1,   color: "#7c3aed" },
  { symbol: "Fe", name: "Iron",        atomicNumber: 26, sliderMin: 0, sliderMax: 100,  step: 0.1,   color: "#78716c" },
  { symbol: "Co", name: "Cobalt",      atomicNumber: 27, sliderMin: 0, sliderMax: 15,   step: 0.1,   color: "#be185d" },
  { symbol: "Ni", name: "Nickel",      atomicNumber: 28, sliderMin: 0, sliderMax: 75,   step: 0.1,   color: "#d97706" },
  { symbol: "Cu", name: "Copper",      atomicNumber: 29, sliderMin: 0, sliderMax: 100,  step: 0.1,   color: "#b45309" },
  { symbol: "Zn", name: "Zinc",        atomicNumber: 30, sliderMin: 0, sliderMax: 45,   step: 0.1,   color: "#64748b" },
  { symbol: "Nb", name: "Niobium",     atomicNumber: 41, sliderMin: 0, sliderMax: 5.5,  step: 0.05,  color: "#e11d48" },
  { symbol: "Mo", name: "Molybdenum",  atomicNumber: 42, sliderMin: 0, sliderMax: 20,   step: 0.1,   color: "#dc2626" },
  { symbol: "Sn", name: "Tin",         atomicNumber: 50, sliderMin: 0, sliderMax: 15,   step: 0.1,   color: "#94a3b8" },
  { symbol: "W",  name: "Tungsten",    atomicNumber: 74, sliderMin: 0, sliderMax: 20,   step: 0.1,   color: "#4f46e5" },
  { symbol: "Pb", name: "Lead",        atomicNumber: 82, sliderMin: 0, sliderMax: 5,    step: 0.05,  color: "#57534e" },
];

export const ELEMENT_MAP = new Map(ELEMENTS.map((e) => [e.symbol, e]));

/** Default elements shown as radar axes */
export const DEFAULT_SELECTED_ELEMENTS = new Set(["C", "Cr", "Ni", "Mo", "Mn", "V"]);

/**
 * Precompute total wt% prevalence per element across all alloys.
 * Called once at module load from alloys data.
 */
export function computePrevalence(
  alloys: Array<{ composition: Record<string, number> }>
): Map<string, number> {
  const totals = new Map<string, number>();
  for (const alloy of alloys) {
    // Sum explicit elements
    let explicitSum = 0;
    for (const [sym, wt] of Object.entries(alloy.composition)) {
      totals.set(sym, (totals.get(sym) ?? 0) + wt);
      explicitSum += wt;
    }
    // Attribute the balance (100% - explicit) to Fe if Fe isn't listed
    if (!("Fe" in alloy.composition)) {
      const feBalance = Math.max(0, 100 - explicitSum);
      totals.set("Fe", (totals.get("Fe") ?? 0) + feBalance);
    }
  }
  return totals;
}

/**
 * Return ELEMENTS sorted by prevalence (descending), excluding the balance element.
 */
export function getElementsByPrevalence(
  prevalence: Map<string, number>,
  balanceElement: string
): ElementInfo[] {
  return ELEMENTS
    .filter((e) => e.symbol !== balanceElement)
    .sort((a, b) => (prevalence.get(b.symbol) ?? 0) - (prevalence.get(a.symbol) ?? 0));
}
