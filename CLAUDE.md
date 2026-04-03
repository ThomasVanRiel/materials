# Alloy Composition Explorer

React + TypeScript app for exploring metal alloy compositions and properties.

## Stack
- React 19, TypeScript, Vite, Recharts

## Key concepts
- **Balance element**: The dominant element (Fe for steels, Ni for nickel alloys, Al for aluminum, Cu for copper) is not stored explicitly in alloy compositions — it's computed as `100 - sum(others)`. Use `getEffectiveComposition(alloy)` from `src/data/elements.ts` to get the full composition including the balance element.
- **FAMILY_BALANCE** (`src/data/elements.ts`): maps each `AlloyFamily` to its balance element symbol.
- **Composition tab**: radar chart + sliders. Balance element auto-adjusts to keep total at 100%.
- **Properties tab**: scatter plot of all alloys. Axis options in `src/lib/axisOptions.ts`.
- **State persistence**: `balanceElement`, `selectedElements`, and `hiddenFamilies` are stored in `localStorage`. Tab and axis selections are in the URL.

## Dev
```
npm run dev
npm run build
```
