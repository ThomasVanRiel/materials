import { useState, useCallback, useMemo } from "react";
import type { Alloy } from "./types";
import { ALLOYS } from "./data/alloys";
import { computePrevalence, getElementsByPrevalence } from "./data/elements";
import { useComposition } from "./hooks/useComposition";
import { useElementSelection } from "./hooks/useElementSelection";
import { useNearestAlloys } from "./hooks/useNearestAlloys";
import { AlloySearch } from "./components/alloys/AlloySearch";
import { NearestAlloys } from "./components/alloys/NearestAlloys";
import { PinnedAlloys } from "./components/alloys/PinnedAlloys";
import { ElementSelector } from "./components/composition/ElementSelector";
import { CompositionSliders } from "./components/composition/CompositionSliders";
import { CompositionRadar } from "./components/chart/CompositionRadar";
import { PropertyDisplay } from "./components/chart/PropertyDisplay";
import "./App.css";

const PREVALENCE = computePrevalence(ALLOYS);

export default function App() {
  const {
    composition,
    setElement,
    setAllComposition,
    balanceElement,
    balanceValue,
    changeBalanceElement,
  } = useComposition();
  const { selectedElements, toggleElement } = useElementSelection();
  const [selectedAlloy, setSelectedAlloy] = useState<Alloy | null>(null);
  const [pinnedAlloys, setPinnedAlloys] = useState<Alloy[]>([]);

  const sortedElements = useMemo(
    () => getElementsByPrevalence(PREVALENCE, balanceElement),
    [balanceElement]
  );

  const nearestAlloys = useNearestAlloys(composition, ALLOYS);

  const handleElementChange = useCallback(
    (symbol: string, value: number) => {
      setSelectedAlloy(null);
      setElement(symbol, value);
    },
    [setElement]
  );

  const handleSelectAlloy = useCallback(
    (alloy: Alloy | null) => {
      setSelectedAlloy(alloy);
      if (alloy) {
        setAllComposition(alloy.composition);
      }
    },
    [setAllComposition]
  );

  const handleSelectFromNearest = useCallback(
    (alloy: Alloy) => {
      setSelectedAlloy(alloy);
      setAllComposition(alloy.composition);
    },
    [setAllComposition]
  );

  const handleTogglePinned = useCallback((alloy: Alloy) => {
    setPinnedAlloys((prev) => {
      const exists = prev.some((a) => a.id === alloy.id);
      if (exists) {
        return prev.filter((a) => a.id !== alloy.id);
      }
      return [...prev, alloy];
    });
  }, []);

  const displayAlloy = selectedAlloy ?? nearestAlloys[0]?.alloy ?? null;

  return (
    <div className="app">
      <header className="header">
        <h1>Alloy Composition Explorer</h1>
        <p>Adjust elements to explore alloy compositions and properties</p>
      </header>

      <div className="layout">
        <aside className="panel left-panel">
          <div className="panel-section">
            <h2 className="panel-title">Select Alloy</h2>
            <AlloySearch
              alloys={ALLOYS}
              selectedAlloy={selectedAlloy}
              onSelect={handleSelectAlloy}
            />
          </div>

          <div className="panel-section">
            <ElementSelector
              elements={sortedElements}
              selectedElements={selectedElements}
              onToggle={toggleElement}
            />
          </div>

          <div className="panel-section panel-section-fill">
            <h2 className="panel-title">Composition</h2>
            <CompositionSliders
              elements={sortedElements}
              composition={composition}
              balanceElement={balanceElement}
              balanceValue={balanceValue}
              onElementChange={handleElementChange}
              onBalanceChange={changeBalanceElement}
            />
          </div>
        </aside>

        <main className="center-column">
          <div className="panel center-panel">
            <CompositionRadar
              composition={composition}
              selectedElements={selectedElements}
              balanceElement={balanceElement}
              prevalence={PREVALENCE}
              pinnedAlloys={pinnedAlloys}
              onElementChange={handleElementChange}
            />
          </div>
          <div className="panel">
            <PropertyDisplay
              pinnedAlloys={pinnedAlloys}
              nearestAlloy={displayAlloy}
            />
          </div>
        </main>

        <aside className="panel right-panel">
          <div className="panel-section-fill">
            <PinnedAlloys
              pinnedAlloys={pinnedAlloys}
              onToggle={handleTogglePinned}
            />
          </div>
          <div className="panel-divider" />
          <NearestAlloys
            matches={nearestAlloys}
            selectedAlloy={selectedAlloy}
            onSelect={handleSelectFromNearest}
          />
        </aside>
      </div>

      <footer className="guide">
        <h2 className="guide-title">How to use</h2>
        <div className="guide-grid">
          <div className="guide-item">
            <h3>Adjust composition</h3>
            <p>Use the sliders on the left to set element concentrations. The balance element (default: Fe) auto-adjusts to keep the total at 100%. You can change which element is the balance with the dropdown.</p>
          </div>
          <div className="guide-item">
            <h3>Drag on the chart</h3>
            <p>Click and drag along any axis on the radar chart to adjust that element directly. The chart scale stays fixed while dragging for stability.</p>
          </div>
          <div className="guide-item">
            <h3>Choose radar axes</h3>
            <p>Toggle element chips to control which elements appear as individual axes on the radar chart. Unselected elements are grouped into "Other" (if enabled). Elements are sorted by prevalence across all alloys.</p>
          </div>
          <div className="guide-item">
            <h3>Select a known alloy</h3>
            <p>Search for a known alloy at the top left. Selecting one sets all sliders to its composition. Moving any slider afterwards clears the selection and recalculates the nearest match.</p>
          </div>
          <div className="guide-item">
            <h3>Compare alloys</h3>
            <p>Click alloys in the "Compare Alloys" panel on the right to pin them to the chart. Each pinned alloy appears as a dashed overlay with its own color. Click a pinned alloy again to remove it.</p>
          </div>
          <div className="guide-item">
            <h3>View properties</h3>
            <p>The table below the chart shows mechanical, thermal, and corrosion properties for all pinned alloys and the nearest match side by side.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
