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

- Add dark mode (stretch goal)
