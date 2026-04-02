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

          <div className="panel-section">
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
          <PinnedAlloys
            pinnedAlloys={pinnedAlloys}
            onToggle={handleTogglePinned}
          />
          <div className="panel-divider" />
          <NearestAlloys
            matches={nearestAlloys}
            selectedAlloy={selectedAlloy}
            onSelect={handleSelectFromNearest}
          />
        </aside>
      </div>
    </div>
  );
}
