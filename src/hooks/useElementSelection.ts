import { useState, useCallback } from "react";
import { DEFAULT_SELECTED_ELEMENTS } from "../data/elements";

export function useElementSelection() {
  const [selectedElements, setSelectedElements] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("selectedElements");
      return saved ? new Set(JSON.parse(saved) as string[]) : new Set(DEFAULT_SELECTED_ELEMENTS);
    } catch {
      return new Set(DEFAULT_SELECTED_ELEMENTS);
    }
  });

  const toggleElement = useCallback((symbol: string) => {
    setSelectedElements((prev) => {
      const next = new Set(prev);
      if (next.has(symbol)) {
        next.delete(symbol);
      } else {
        next.add(symbol);
      }
      try { localStorage.setItem("selectedElements", JSON.stringify([...next])); } catch {}
      return next;
    });
  }, []);

  return { selectedElements, toggleElement };
}
