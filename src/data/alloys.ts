import type { Alloy } from "../types";

export const ALLOYS: Alloy[] = [
  // ── Carbon Steels ──
  {
    id: "aisi-1045",
    name: "AISI 1045",
    family: "Carbon Steel",
    composition: { C: 0.45, Mn: 0.75, Si: 0.25, Cr: 0, Ni: 0, Mo: 0, P: 0.04, S: 0.05 },
    properties: {
      mechanical: { hardnessHRC: 20, tensileStrengthMPa: 585, yieldStrengthMPa: 450, elongationPercent: 16 },
      thermal: { thermalConductivityWmK: 49.8, maxServiceTempC: 400, meltingRangeLowC: 1410, meltingRangeHighC: 1460 },
      corrosion: { corrosionResistance: "Poor", pren: null },
    },
  },
  {
    id: "aisi-4140",
    name: "AISI 4140",
    family: "Carbon Steel",
    composition: { C: 0.40, Mn: 0.88, Si: 0.25, Cr: 0.95, Ni: 0, Mo: 0.20, P: 0.035, S: 0.04 },
    properties: {
      mechanical: { hardnessHRC: 28, tensileStrengthMPa: 655, yieldStrengthMPa: 415, elongationPercent: 25 },
      thermal: { thermalConductivityWmK: 42.6, maxServiceTempC: 450, meltingRangeLowC: 1416, meltingRangeHighC: 1460 },
      corrosion: { corrosionResistance: "Poor", pren: null },
    },
  },
  {
    id: "aisi-4340",
    name: "AISI 4340",
    family: "Carbon Steel",
    composition: { C: 0.40, Mn: 0.70, Si: 0.25, Cr: 0.80, Ni: 1.83, Mo: 0.25 },
    properties: {
      mechanical: { hardnessHRC: 32, tensileStrengthMPa: 745, yieldStrengthMPa: 470, elongationPercent: 22 },
      thermal: { thermalConductivityWmK: 44.5, maxServiceTempC: 450, meltingRangeLowC: 1427, meltingRangeHighC: 1477 },
      corrosion: { corrosionResistance: "Poor", pren: null },
    },
  },

  // ── Stainless Steels ──
  {
    id: "aisi-304",
    name: "AISI 304",
    family: "Stainless Steel",
    composition: { C: 0.08, Mn: 2.0, Si: 0.75, Cr: 18.0, Ni: 8.0, N: 0.10, P: 0.045, S: 0.03 },
    properties: {
      mechanical: { hardnessHRC: null, tensileStrengthMPa: 515, yieldStrengthMPa: 205, elongationPercent: 40 },
      thermal: { thermalConductivityWmK: 16.2, maxServiceTempC: 870, meltingRangeLowC: 1400, meltingRangeHighC: 1455 },
      corrosion: { corrosionResistance: "Good", pren: 18.0 },
    },
  },
  {
    id: "aisi-316",
    name: "AISI 316",
    family: "Stainless Steel",
    composition: { C: 0.08, Mn: 2.0, Si: 0.75, Cr: 16.5, Ni: 10.0, Mo: 2.1, N: 0.10, P: 0.045, S: 0.03 },
    properties: {
      mechanical: { hardnessHRC: null, tensileStrengthMPa: 515, yieldStrengthMPa: 205, elongationPercent: 40 },
      thermal: { thermalConductivityWmK: 16.3, maxServiceTempC: 870, meltingRangeLowC: 1390, meltingRangeHighC: 1440 },
      corrosion: { corrosionResistance: "Excellent", pren: 23.4 },
    },
  },
  {
    id: "aisi-410",
    name: "AISI 410",
    family: "Stainless Steel",
    composition: { C: 0.15, Mn: 1.0, Si: 1.0, Cr: 12.5, Ni: 0, P: 0.04, S: 0.03 },
    properties: {
      mechanical: { hardnessHRC: 25, tensileStrengthMPa: 485, yieldStrengthMPa: 275, elongationPercent: 20 },
      thermal: { thermalConductivityWmK: 24.9, maxServiceTempC: 650, meltingRangeLowC: 1480, meltingRangeHighC: 1530 },
      corrosion: { corrosionResistance: "Fair", pren: 12.5 },
    },
  },
  {
    id: "aisi-430",
    name: "AISI 430",
    family: "Stainless Steel",
    composition: { C: 0.12, Mn: 1.0, Si: 1.0, Cr: 17.0, Ni: 0, P: 0.04, S: 0.03 },
    properties: {
      mechanical: { hardnessHRC: null, tensileStrengthMPa: 450, yieldStrengthMPa: 205, elongationPercent: 22 },
      thermal: { thermalConductivityWmK: 26.1, maxServiceTempC: 815, meltingRangeLowC: 1425, meltingRangeHighC: 1510 },
      corrosion: { corrosionResistance: "Good", pren: 17.0 },
    },
  },
  {
    id: "17-4ph",
    name: "17-4 PH",
    family: "Stainless Steel",
    composition: { C: 0.07, Mn: 1.0, Si: 1.0, Cr: 16.0, Ni: 4.0, Cu: 4.0, Nb: 0.30, P: 0.04, S: 0.03 },
    properties: {
      mechanical: { hardnessHRC: 36, tensileStrengthMPa: 1070, yieldStrengthMPa: 1000, elongationPercent: 10 },
      thermal: { thermalConductivityWmK: 18.3, maxServiceTempC: 550, meltingRangeLowC: 1400, meltingRangeHighC: 1440 },
      corrosion: { corrosionResistance: "Good", pren: 16.0 },
    },
  },
  {
    id: "duplex-2205",
    name: "Duplex 2205",
    family: "Stainless Steel",
    composition: { C: 0.03, Mn: 2.0, Si: 1.0, Cr: 22.0, Ni: 5.5, Mo: 3.0, N: 0.17, P: 0.03, S: 0.02 },
    properties: {
      mechanical: { hardnessHRC: 28, tensileStrengthMPa: 620, yieldStrengthMPa: 450, elongationPercent: 25 },
      thermal: { thermalConductivityWmK: 19.0, maxServiceTempC: 315, meltingRangeLowC: 1385, meltingRangeHighC: 1445 },
      corrosion: { corrosionResistance: "Excellent", pren: 34.6 },
    },
  },

  // ── Tool Steels ──
  {
    id: "d2",
    name: "D2 Tool Steel",
    family: "Tool Steel",
    composition: { C: 1.55, Mn: 0.35, Si: 0.35, Cr: 12.0, Mo: 0.80, V: 0.90 },
    properties: {
      mechanical: { hardnessHRC: 62, tensileStrengthMPa: null, yieldStrengthMPa: null, elongationPercent: null },
      thermal: { thermalConductivityWmK: 20.0, maxServiceTempC: 425, meltingRangeLowC: 1395, meltingRangeHighC: 1440 },
      corrosion: { corrosionResistance: "Fair", pren: null },
    },
  },
  {
    id: "m2",
    name: "M2 HSS",
    family: "Tool Steel",
    composition: { C: 0.85, Mn: 0.30, Si: 0.30, Cr: 4.15, Mo: 5.0, V: 1.85, W: 6.35 },
    properties: {
      mechanical: { hardnessHRC: 65, tensileStrengthMPa: null, yieldStrengthMPa: null, elongationPercent: null },
      thermal: { thermalConductivityWmK: 25.5, maxServiceTempC: 600, meltingRangeLowC: 1260, meltingRangeHighC: 1340 },
      corrosion: { corrosionResistance: "Poor", pren: null },
    },
  },
  {
    id: "h13",
    name: "H13 Tool Steel",
    family: "Tool Steel",
    composition: { C: 0.40, Mn: 0.35, Si: 1.0, Cr: 5.25, Mo: 1.35, V: 1.0 },
    properties: {
      mechanical: { hardnessHRC: 52, tensileStrengthMPa: 1580, yieldStrengthMPa: 1365, elongationPercent: 8 },
      thermal: { thermalConductivityWmK: 28.6, maxServiceTempC: 600, meltingRangeLowC: 1425, meltingRangeHighC: 1470 },
      corrosion: { corrosionResistance: "Poor", pren: null },
    },
  },

  // ── Nickel Alloys ──
  {
    id: "inconel-625",
    name: "Inconel 625",
    family: "Nickel Alloy",
    composition: { C: 0.05, Mn: 0.25, Si: 0.25, Cr: 21.5, Ni: 61.0, Mo: 9.0, Nb: 3.65, Al: 0.2, Ti: 0.2 },
    properties: {
      mechanical: { hardnessHRC: 20, tensileStrengthMPa: 827, yieldStrengthMPa: 414, elongationPercent: 30 },
      thermal: { thermalConductivityWmK: 9.8, maxServiceTempC: 980, meltingRangeLowC: 1290, meltingRangeHighC: 1350 },
      corrosion: { corrosionResistance: "Excellent", pren: null },
    },
  },
  {
    id: "inconel-718",
    name: "Inconel 718",
    family: "Nickel Alloy",
    composition: { C: 0.04, Mn: 0.18, Si: 0.18, Cr: 19.0, Ni: 52.5, Mo: 3.05, Nb: 5.13, Ti: 0.9, Al: 0.5, Co: 1.0 },
    properties: {
      mechanical: { hardnessHRC: 40, tensileStrengthMPa: 1240, yieldStrengthMPa: 1036, elongationPercent: 12 },
      thermal: { thermalConductivityWmK: 11.4, maxServiceTempC: 700, meltingRangeLowC: 1260, meltingRangeHighC: 1336 },
      corrosion: { corrosionResistance: "Excellent", pren: null },
    },
  },
  {
    id: "hastelloy-c276",
    name: "Hastelloy C-276",
    family: "Nickel Alloy",
    composition: { C: 0.01, Mn: 0.50, Si: 0.05, Cr: 15.5, Ni: 57.0, Mo: 16.0, W: 3.75, Co: 2.5, V: 0.2 },
    properties: {
      mechanical: { hardnessHRC: null, tensileStrengthMPa: 790, yieldStrengthMPa: 355, elongationPercent: 40 },
      thermal: { thermalConductivityWmK: 10.2, maxServiceTempC: 1040, meltingRangeLowC: 1325, meltingRangeHighC: 1370 },
      corrosion: { corrosionResistance: "Excellent", pren: null },
    },
  },
  {
    id: "hastelloy-x",
    name: "Hastelloy X",
    family: "Nickel Alloy",
    composition: { C: 0.10, Mn: 0.50, Si: 0.50, Cr: 22.0, Ni: 47.0, Mo: 9.0, Co: 1.5, W: 0.6 },
    properties: {
      mechanical: { hardnessHRC: null, tensileStrengthMPa: 755, yieldStrengthMPa: 360, elongationPercent: 43 },
      thermal: { thermalConductivityWmK: 11.6, maxServiceTempC: 1095, meltingRangeLowC: 1260, meltingRangeHighC: 1355 },
      corrosion: { corrosionResistance: "Excellent", pren: null },
    },
  },
  {
    id: "monel-400",
    name: "Monel 400",
    family: "Nickel Alloy",
    composition: { C: 0.15, Mn: 1.0, Si: 0.25, Cr: 0, Ni: 66.5, Cu: 31.5, S: 0.012 },
    properties: {
      mechanical: { hardnessHRC: null, tensileStrengthMPa: 550, yieldStrengthMPa: 240, elongationPercent: 40 },
      thermal: { thermalConductivityWmK: 21.8, maxServiceTempC: 480, meltingRangeLowC: 1300, meltingRangeHighC: 1350 },
      corrosion: { corrosionResistance: "Excellent", pren: null },
    },
  },
  {
    id: "monel-k500",
    name: "Monel K-500",
    family: "Nickel Alloy",
    composition: { C: 0.13, Mn: 0.75, Si: 0.25, Cr: 0, Ni: 65.0, Cu: 29.5, Al: 2.7, Ti: 0.6 },
    properties: {
      mechanical: { hardnessHRC: 30, tensileStrengthMPa: 1100, yieldStrengthMPa: 790, elongationPercent: 20 },
      thermal: { thermalConductivityWmK: 17.5, maxServiceTempC: 480, meltingRangeLowC: 1315, meltingRangeHighC: 1350 },
      corrosion: { corrosionResistance: "Excellent", pren: null },
    },
  },

  // ── Additional Stainless Steels ──
  {
    id: "aisi-316l",
    name: "AISI 316L",
    family: "Stainless Steel",
    composition: { C: 0.03, Mn: 2.0, Si: 0.75, Cr: 16.5, Ni: 10.0, Mo: 2.1, N: 0.10, P: 0.045, S: 0.03 },
    properties: {
      mechanical: { hardnessHRC: null, tensileStrengthMPa: 485, yieldStrengthMPa: 170, elongationPercent: 40 },
      thermal: { thermalConductivityWmK: 16.3, maxServiceTempC: 870, meltingRangeLowC: 1390, meltingRangeHighC: 1440 },
      corrosion: { corrosionResistance: "Excellent", pren: 23.4 },
    },
  },
  {
    id: "aisi-321",
    name: "AISI 321",
    family: "Stainless Steel",
    composition: { C: 0.08, Mn: 2.0, Si: 0.75, Cr: 17.5, Ni: 9.5, Ti: 0.40, P: 0.045, S: 0.03 },
    properties: {
      mechanical: { hardnessHRC: null, tensileStrengthMPa: 515, yieldStrengthMPa: 205, elongationPercent: 40 },
      thermal: { thermalConductivityWmK: 16.1, maxServiceTempC: 870, meltingRangeLowC: 1400, meltingRangeHighC: 1425 },
      corrosion: { corrosionResistance: "Good", pren: 17.5 },
    },
  },
  {
    id: "aisi-347",
    name: "AISI 347",
    family: "Stainless Steel",
    composition: { C: 0.08, Mn: 2.0, Si: 0.75, Cr: 18.0, Ni: 11.0, Nb: 0.80, P: 0.045, S: 0.03 },
    properties: {
      mechanical: { hardnessHRC: null, tensileStrengthMPa: 515, yieldStrengthMPa: 205, elongationPercent: 40 },
      thermal: { thermalConductivityWmK: 16.2, maxServiceTempC: 870, meltingRangeLowC: 1400, meltingRangeHighC: 1425 },
      corrosion: { corrosionResistance: "Good", pren: 18.0 },
    },
  },
  {
    id: "aisi-904l",
    name: "904L",
    family: "Stainless Steel",
    composition: { C: 0.02, Mn: 2.0, Si: 1.0, Cr: 20.0, Ni: 25.0, Mo: 4.5, Cu: 1.5, N: 0.10 },
    properties: {
      mechanical: { hardnessHRC: null, tensileStrengthMPa: 490, yieldStrengthMPa: 220, elongationPercent: 35 },
      thermal: { thermalConductivityWmK: 12.2, maxServiceTempC: 400, meltingRangeLowC: 1350, meltingRangeHighC: 1400 },
      corrosion: { corrosionResistance: "Excellent", pren: 35.5 },
    },
  },

  // ── Aluminum Alloys ── (balance = Al)
  {
    id: "al-1100",
    name: "AA 1100",
    family: "Aluminum Alloy",
    composition: { Al: 99.0, Si: 0.25, Fe: 0.40, Cu: 0.10, Mn: 0.05 },
    properties: {
      mechanical: { hardnessHRC: null, tensileStrengthMPa: 90, yieldStrengthMPa: 34, elongationPercent: 35 },
      thermal: { thermalConductivityWmK: 222, maxServiceTempC: 200, meltingRangeLowC: 643, meltingRangeHighC: 657 },
      corrosion: { corrosionResistance: "Excellent", pren: null },
    },
  },
  {
    id: "al-2024",
    name: "AA 2024",
    family: "Aluminum Alloy",
    composition: { Al: 93.5, Cu: 4.4, Mg: 1.5, Mn: 0.6 },
    properties: {
      mechanical: { hardnessHRC: null, tensileStrengthMPa: 470, yieldStrengthMPa: 325, elongationPercent: 20 },
      thermal: { thermalConductivityWmK: 121, maxServiceTempC: 175, meltingRangeLowC: 500, meltingRangeHighC: 638 },
      corrosion: { corrosionResistance: "Poor", pren: null },
    },
  },
  {
    id: "al-5052",
    name: "AA 5052",
    family: "Aluminum Alloy",
    composition: { Al: 97.2, Mg: 2.5, Cr: 0.25, Fe: 0.10 },
    properties: {
      mechanical: { hardnessHRC: null, tensileStrengthMPa: 230, yieldStrengthMPa: 195, elongationPercent: 12 },
      thermal: { thermalConductivityWmK: 138, maxServiceTempC: 200, meltingRangeLowC: 607, meltingRangeHighC: 650 },
      corrosion: { corrosionResistance: "Excellent", pren: null },
    },
  },
  {
    id: "al-6061",
    name: "AA 6061-T6",
    family: "Aluminum Alloy",
    composition: { Al: 97.3, Mg: 1.0, Si: 0.6, Cu: 0.28, Cr: 0.20, Fe: 0.35 },
    properties: {
      mechanical: { hardnessHRC: null, tensileStrengthMPa: 310, yieldStrengthMPa: 276, elongationPercent: 12 },
      thermal: { thermalConductivityWmK: 167, maxServiceTempC: 175, meltingRangeLowC: 582, meltingRangeHighC: 652 },
      corrosion: { corrosionResistance: "Good", pren: null },
    },
  },
  {
    id: "al-7075",
    name: "AA 7075-T6",
    family: "Aluminum Alloy",
    composition: { Al: 90.0, Zn: 5.6, Mg: 2.5, Cu: 1.6, Cr: 0.23 },
    properties: {
      mechanical: { hardnessHRC: null, tensileStrengthMPa: 572, yieldStrengthMPa: 503, elongationPercent: 11 },
      thermal: { thermalConductivityWmK: 130, maxServiceTempC: 120, meltingRangeLowC: 477, meltingRangeHighC: 635 },
      corrosion: { corrosionResistance: "Fair", pren: null },
    },
  },
  {
    id: "al-356",
    name: "A356 (Casting)",
    family: "Aluminum Alloy",
    composition: { Al: 92.0, Si: 7.0, Mg: 0.35, Fe: 0.15 },
    properties: {
      mechanical: { hardnessHRC: null, tensileStrengthMPa: 234, yieldStrengthMPa: 165, elongationPercent: 3.5 },
      thermal: { thermalConductivityWmK: 151, maxServiceTempC: 175, meltingRangeLowC: 557, meltingRangeHighC: 613 },
      corrosion: { corrosionResistance: "Good", pren: null },
    },
  },

  // ── Copper Alloys ── (balance = Cu)
  {
    id: "c11000",
    name: "C11000 (ETP Copper)",
    family: "Copper Alloy",
    composition: { Cu: 99.9 },
    properties: {
      mechanical: { hardnessHRC: null, tensileStrengthMPa: 220, yieldStrengthMPa: 69, elongationPercent: 50 },
      thermal: { thermalConductivityWmK: 391, maxServiceTempC: 200, meltingRangeLowC: 1065, meltingRangeHighC: 1083 },
      corrosion: { corrosionResistance: "Good", pren: null },
    },
  },
  {
    id: "c26000",
    name: "C26000 (Cartridge Brass)",
    family: "Copper Alloy",
    composition: { Cu: 70.0, Zn: 30.0 },
    properties: {
      mechanical: { hardnessHRC: null, tensileStrengthMPa: 340, yieldStrengthMPa: 105, elongationPercent: 63 },
      thermal: { thermalConductivityWmK: 121, maxServiceTempC: 250, meltingRangeLowC: 915, meltingRangeHighC: 955 },
      corrosion: { corrosionResistance: "Fair", pren: null },
    },
  },
  {
    id: "c36000",
    name: "C36000 (Free-Cut Brass)",
    family: "Copper Alloy",
    composition: { Cu: 61.5, Zn: 35.5, Pb: 3.0 },
    properties: {
      mechanical: { hardnessHRC: null, tensileStrengthMPa: 340, yieldStrengthMPa: 125, elongationPercent: 53 },
      thermal: { thermalConductivityWmK: 115, maxServiceTempC: 250, meltingRangeLowC: 885, meltingRangeHighC: 900 },
      corrosion: { corrosionResistance: "Fair", pren: null },
    },
  },
  {
    id: "c51000",
    name: "C51000 (Phosphor Bronze)",
    family: "Copper Alloy",
    composition: { Cu: 94.8, Sn: 5.0, P: 0.20 },
    properties: {
      mechanical: { hardnessHRC: null, tensileStrengthMPa: 380, yieldStrengthMPa: 165, elongationPercent: 57 },
      thermal: { thermalConductivityWmK: 69, maxServiceTempC: 200, meltingRangeLowC: 1000, meltingRangeHighC: 1050 },
      corrosion: { corrosionResistance: "Good", pren: null },
    },
  },
  {
    id: "c71500",
    name: "C71500 (Cu-Ni 70/30)",
    family: "Copper Alloy",
    composition: { Cu: 69.5, Ni: 30.0, Fe: 0.40, Mn: 0.50 },
    properties: {
      mechanical: { hardnessHRC: null, tensileStrengthMPa: 380, yieldStrengthMPa: 125, elongationPercent: 36 },
      thermal: { thermalConductivityWmK: 29, maxServiceTempC: 350, meltingRangeLowC: 1170, meltingRangeHighC: 1240 },
      corrosion: { corrosionResistance: "Excellent", pren: null },
    },
  },
  {
    id: "c95400",
    name: "C95400 (Al Bronze)",
    family: "Copper Alloy",
    composition: { Cu: 85.0, Al: 11.0, Fe: 4.0 },
    properties: {
      mechanical: { hardnessHRC: null, tensileStrengthMPa: 586, yieldStrengthMPa: 241, elongationPercent: 12 },
      thermal: { thermalConductivityWmK: 59, maxServiceTempC: 400, meltingRangeLowC: 1030, meltingRangeHighC: 1040 },
      corrosion: { corrosionResistance: "Excellent", pren: null },
    },
  },
];

/** All element symbols that appear across the dataset */
export const ALL_ELEMENTS_IN_DATA = Array.from(
  new Set(ALLOYS.flatMap((a) => Object.keys(a.composition)))
).sort();
