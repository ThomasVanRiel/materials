import { useState, useCallback } from "react";
import type { Composition } from "../types";
import { ELEMENTS } from "../data/elements";

/** All possible balance elements */
export const BALANCE_ELEMENTS = ELEMENTS.map((e) => e.symbol);

function makeDefaultComposition(): Composition {
  const comp: Composition = {};
  for (const el of ELEMENTS) {
    comp[el.symbol] = 0;
  }
  comp["Fe"] = 100;
  return comp;
}

/**
 * Manages slider composition state.
 * The balance element auto-adjusts to keep total at ~100%.
 */
export function useComposition() {
  const [composition, setComposition] = useState<Composition>(makeDefaultComposition);
  const [balanceElement, setBalanceElement] = useState(
    () => localStorage.getItem("balanceElement") ?? "Fe"
  );

  const recalcBalance = (comp: Composition, bal: string): Composition => {
    let sum = 0;
    for (const [sym, wt] of Object.entries(comp)) {
      if (sym !== bal) sum += wt;
    }
    return { ...comp, [bal]: Math.max(0, Math.round((100 - sum) * 100) / 100) };
  };

  const setElement = useCallback(
    (symbol: string, value: number) => {
      setComposition((prev) => recalcBalance({ ...prev, [symbol]: value }, balanceElement));
    },
    [balanceElement]
  );

  const setAllComposition = useCallback(
    (comp: Composition) => {
      const next: Composition = {};
      for (const el of ELEMENTS) {
        next[el.symbol] = comp[el.symbol] ?? 0;
      }
      next["Fe"] = comp["Fe"] ?? 0;
      // Recalculate balance from the loaded composition
      setComposition(recalcBalance(next, balanceElement));
    },
    [balanceElement]
  );

  const changeBalanceElement = useCallback(
    (newBalance: string) => {
      try { localStorage.setItem("balanceElement", newBalance); } catch {}
      setBalanceElement(newBalance);
      setComposition((prev) => recalcBalance(prev, newBalance));
    },
    []
  );

  const balanceValue = composition[balanceElement] ?? 0;

  return {
    composition,
    setElement,
    setAllComposition,
    balanceElement,
    balanceValue,
    changeBalanceElement,
  };
}
