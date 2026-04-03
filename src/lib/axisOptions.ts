import type { Alloy, AlloyFamily } from "../types";
import { ELEMENTS, FAMILY_BALANCE, getEffectiveComposition } from "../data/elements";

export interface AxisOption {
  key: string;
  label: string;
  category: "mechanical" | "thermal" | "corrosion" | "element";
  getValue: (alloy: Alloy) => number | null;
}

const CORROSION_MAP: Record<string, number> = {
  Poor: 1,
  Fair: 2,
  Good: 3,
  Excellent: 4,
};

export const AXIS_OPTIONS: AxisOption[] = [
  // Mechanical
  { key: "hardnessHRC", label: "Hardness (HRC)", category: "mechanical", getValue: (a) => a.properties.mechanical.hardnessHRC },
  { key: "tensileStrengthMPa", label: "Tensile Strength (MPa)", category: "mechanical", getValue: (a) => a.properties.mechanical.tensileStrengthMPa },
  { key: "yieldStrengthMPa", label: "Yield Strength (MPa)", category: "mechanical", getValue: (a) => a.properties.mechanical.yieldStrengthMPa },
  { key: "elongationPercent", label: "Elongation (%)", category: "mechanical", getValue: (a) => a.properties.mechanical.elongationPercent },
  // Thermal
  { key: "thermalConductivityWmK", label: "Thermal Conductivity (W/m·K)", category: "thermal", getValue: (a) => a.properties.thermal.thermalConductivityWmK },
  { key: "maxServiceTempC", label: "Max Service Temp (°C)", category: "thermal", getValue: (a) => a.properties.thermal.maxServiceTempC },
  { key: "meltingRangeLowC", label: "Melting Range Low (°C)", category: "thermal", getValue: (a) => a.properties.thermal.meltingRangeLowC },
  { key: "meltingRangeHighC", label: "Melting Range High (°C)", category: "thermal", getValue: (a) => a.properties.thermal.meltingRangeHighC },
  // Corrosion
  { key: "corrosionResistance", label: "Corrosion Resistance", category: "corrosion", getValue: (a) => CORROSION_MAP[a.properties.corrosion.corrosionResistance] ?? null },
  { key: "pren", label: "PREN", category: "corrosion", getValue: (a) => a.properties.corrosion.pren },
  // Balance element (varies per alloy family)
  {
    key: "elem_balance",
    label: "Balance (wt%)",
    category: "element" as const,
    getValue: (a: Alloy) => {
      const sym = FAMILY_BALANCE[a.family];
      return sym ? (getEffectiveComposition(a)[sym] ?? 0) : null;
    },
  },
  // Elements
  ...ELEMENTS.map((el) => ({
    key: `elem_${el.symbol}`,
    label: `${el.symbol} (wt%)`,
    category: "element" as const,
    getValue: (a: Alloy) => getEffectiveComposition(a)[el.symbol] ?? 0,
  })),
];

export const AXIS_OPTIONS_MAP = new Map(AXIS_OPTIONS.map((o) => [o.key, o]));

export const DEFAULT_X_AXIS = "elem_Cr";
export const DEFAULT_Y_AXIS = "tensileStrengthMPa";

export const FAMILY_COLORS: Record<AlloyFamily, string> = {
  "Carbon Steel": "#78716c",
  "Stainless Steel": "#3b82f6",
  "Tool Steel": "#ef4444",
  "Nickel Alloy": "#f59e0b",
  "Aluminum Alloy": "#22c55e",
  "Copper Alloy": "#b45309",
};

export const CATEGORY_LABELS: Record<AxisOption["category"], string> = {
  mechanical: "Mechanical",
  thermal: "Thermal",
  corrosion: "Corrosion",
  element: "Elements",
};
