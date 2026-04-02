export type ElementSymbol = string;

export interface ElementInfo {
  symbol: ElementSymbol;
  name: string;
  atomicNumber: number;
  sliderMin: number;
  sliderMax: number;
  step: number;
  color: string;
}

export type Composition = Record<ElementSymbol, number>;

export interface MechanicalProperties {
  hardnessHRC: number | null;
  tensileStrengthMPa: number | null;
  yieldStrengthMPa: number | null;
  elongationPercent: number | null;
}

export interface ThermalProperties {
  thermalConductivityWmK: number | null;
  maxServiceTempC: number | null;
  meltingRangeLowC: number;
  meltingRangeHighC: number;
}

export interface CorrosionProperties {
  corrosionResistance: "Poor" | "Fair" | "Good" | "Excellent";
  pren: number | null;
}

export interface AlloyProperties {
  mechanical: MechanicalProperties;
  thermal: ThermalProperties;
  corrosion: CorrosionProperties;
}

export type AlloyFamily =
  | "Carbon Steel"
  | "Stainless Steel"
  | "Tool Steel"
  | "Nickel Alloy";

export interface Alloy {
  id: string;
  name: string;
  family: AlloyFamily;
  composition: Composition;
  properties: AlloyProperties;
}

/** Each data point has the user's value plus dynamic keys per pinned alloy */
export interface RadarDataPoint {
  axis: string;
  normalizedValue: number;
  rawValue: number;
  [key: string]: string | number | undefined;
}
