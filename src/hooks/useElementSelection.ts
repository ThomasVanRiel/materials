import { useState, useCallback } from "react";
import { DEFAULT_SELECTED_ELEMENTS } from "../data/elements";

export function useElementSelection() {
  const [selectedElements, setSelectedElements] = useState<Set<string>>(
    () => new Set(DEFAULT_SELECTED_ELEMENTS)
  );

  const toggleElement = useCallback((symbol: string) => {
    setSelectedElements((prev) => {
      const next = new Set(prev);
      if (next.has(symbol)) {
        next.delete(symbol);
      } else {
        next.add(symbol);
      }
      return next;
    });
  }, []);

  return { selectedElements, toggleElement };
}
