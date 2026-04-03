# Alloy Composition Explorer

An interactive tool for exploring metal alloy compositions and properties.

## Features

- **Composition tab** — adjust element sliders to build a custom composition. The balance element (Fe by default) auto-fills to keep the total at 100%. Switch the balance element via the dropdown.
- **Radar chart** — visualises the current composition. Drag along any axis to adjust that element directly. Toggle element chips to control which axes are shown.
- **Nearest alloys** — the closest matching alloys from the database update live as you adjust sliders. Hover any alloy to see its full composition.
- **Properties tab** — XY scatter plot of all alloys. Click the axis labels to change what's plotted. Alloy families appear as coloured patches.
- **Pin & compare** — pin alloys to overlay them on the radar chart and highlight them in the scatter plot.

## Stack

React 19 · TypeScript · Vite · Recharts

## Dev

```
npm install
npm run dev
```

## TODO

1. Shareable composition URL — encode slider values in the URL so compositions can be bookmarked or shared
2. Copy composition — button to copy the current composition as JSON or formatted text
3. Reset button — clear sliders back to default (pure Fe) or to the last selected known alloy
4. Highlight nearest alloys on the scatter plot — mark the closest matches when on the Properties tab
5. Property estimates for custom compositions — interpolate from nearest alloys and show rough values in the Property Display panel
6. Composition diff view — when an alloy is selected, show ± deviation per element from the current sliders
7. Wt% ↔ at% toggle — convert between weight percent and atomic percent
8. Save/name custom compositions — store compositions locally with a user label and recall them later
9. Multi-composition radar overlay — overlay a second custom composition on the radar chart
10. Property range selection on scatter plot — drag a selection box to filter alloys by a region, with names listed
11. Add dark mode (stretch goal)
