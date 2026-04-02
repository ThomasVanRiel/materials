import { useState, useRef, useEffect } from "react";
import type { Alloy } from "../../types";
import styles from "./AlloySearch.module.css";

interface Props {
  alloys: Alloy[];
  selectedAlloy: Alloy | null;
  onSelect: (alloy: Alloy | null) => void;
}

export function AlloySearch({ alloys, selectedAlloy, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = query
    ? alloys.filter(
        (a) =>
          a.name.toLowerCase().includes(query.toLowerCase()) ||
          a.family.toLowerCase().includes(query.toLowerCase())
      )
    : alloys;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <input
        type="text"
        className={styles.input}
        placeholder="Search alloys..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />
      {selectedAlloy && (
        <button className={styles.clear} onClick={() => { onSelect(null); setQuery(""); }}>
          Clear
        </button>
      )}
      {open && (
        <div className={styles.dropdown}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>No alloys found</div>
          ) : (
            filtered.map((alloy) => (
              <button
                key={alloy.id}
                className={`${styles.item} ${selectedAlloy?.id === alloy.id ? styles.selected : ""}`}
                onClick={() => {
                  onSelect(alloy);
                  setQuery(alloy.name);
                  setOpen(false);
                }}
              >
                <span className={styles.itemName}>{alloy.name}</span>
                <span className={styles.itemFamily}>{alloy.family}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
