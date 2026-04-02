import { useState, useCallback, useMemo, useEffect } from "react";
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
import { ScatterPlot } from "./components/chart/ScatterPlot";
import {
  AXIS_OPTIONS_MAP,
  DEFAULT_X_AXIS,
  DEFAULT_Y_AXIS,
} from "./lib/axisOptions";
import "./App.css";

type Tab = "composition" | "properties";

const VALID_TABS = new Set<Tab>(["composition", "properties"]);

interface RouteState {
  tab: Tab;
  xAxis: string;
  yAxis: string;
}

function getRouteState(): RouteState {
  const path = window.location.pathname.replace(/^\//, "").replace(/\/$/, "");
  const tab = VALID_TABS.has(path as Tab) ? (path as Tab) : "composition";
  const params = new URLSearchParams(window.location.search);
  const x = params.get("x");
  const y = params.get("y");
  return {
    tab,
    xAxis: x && AXIS_OPTIONS_MAP.has(x) ? x : DEFAULT_X_AXIS,
    yAxis: y && AXIS_OPTIONS_MAP.has(y) ? y : DEFAULT_Y_AXIS,
  };
}

function buildUrl(tab: Tab, xAxis: string, yAxis: string): string {
  if (tab === "composition") return "/";
  const params = new URLSearchParams();
  if (xAxis !== DEFAULT_X_AXIS) params.set("x", xAxis);
  if (yAxis !== DEFAULT_Y_AXIS) params.set("y", yAxis);
  const qs = params.toString();
  return `/properties${qs ? `?${qs}` : ""}`;
}

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
  const initRoute = useMemo(() => getRouteState(), []);
  const [activeTab, setActiveTab] = useState<Tab>(initRoute.tab);
  const [scatterXAxis, setScatterXAxis] = useState(initRoute.xAxis);
  const [scatterYAxis, setScatterYAxis] = useState(initRoute.yAxis);

  const pushUrl = useCallback((tab: Tab, x: string, y: string) => {
    const url = buildUrl(tab, x, y);
    window.history.pushState(null, "", url);
  }, []);

  const navigateTab = useCallback((tab: Tab) => {
    setActiveTab(tab);
    pushUrl(tab, scatterXAxis, scatterYAxis);
  }, [pushUrl, scatterXAxis, scatterYAxis]);

  const handleScatterXChange = useCallback((key: string) => {
    setScatterXAxis(key);
    pushUrl("properties", key, scatterYAxis);
  }, [pushUrl, scatterYAxis]);

  const handleScatterYChange = useCallback((key: string) => {
    setScatterYAxis(key);
    pushUrl("properties", scatterXAxis, key);
  }, [pushUrl, scatterXAxis]);

  useEffect(() => {
    const onPopState = () => {
      const state = getRouteState();
      setActiveTab(state.tab);
      setScatterXAxis(state.xAxis);
      setScatterYAxis(state.yAxis);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

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

  const isComposition = activeTab === "composition";

  return (
    <div className="app">
      <header className="header">
        <h1>Alloy Composition Explorer</h1>
        <p>Adjust elements to explore alloy compositions and properties</p>
      </header>

      <div className="tabs">
        <button
          className={`tab ${isComposition ? "tab-active" : ""}`}
          onClick={() => navigateTab("composition")}
        >
          Composition
        </button>
        <button
          className={`tab ${!isComposition ? "tab-active" : ""}`}
          onClick={() => navigateTab("properties")}
        >
          Properties
        </button>
      </div>

      <div className={isComposition ? "layout" : "layout layout-properties"}>
        {isComposition && (
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
        )}

        <main className="center-column">
          {isComposition ? (
            <>
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
            </>
          ) : (
            <div className="panel center-panel">
              <ScatterPlot
                pinnedAlloys={pinnedAlloys}
                xAxisKey={scatterXAxis}
                yAxisKey={scatterYAxis}
                onXAxisChange={handleScatterXChange}
                onYAxisChange={handleScatterYChange}
              />
            </div>
          )}
        </main>

        <aside className="panel right-panel">
          <div className="panel-section-fill">
            <PinnedAlloys
              pinnedAlloys={pinnedAlloys}
              onToggle={handleTogglePinned}
            />
          </div>
          {isComposition && (
            <>
              <div className="panel-divider" />
              <NearestAlloys
                matches={nearestAlloys}
                selectedAlloy={selectedAlloy}
                onSelect={handleSelectFromNearest}
              />
            </>
          )}
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
            <p>Click alloys in the "Compare Alloys" panel on the right to pin them to the chart. Each pinned alloy appears as a colored overlay. Click a pinned alloy again to remove it.</p>
          </div>
          <div className="guide-item">
            <h3>Explore properties</h3>
            <p>Switch to the Properties tab to see an XY scatter plot of all alloys. Click the axis labels to change what's plotted. Families appear as colored patches. Pinned alloys are highlighted.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
