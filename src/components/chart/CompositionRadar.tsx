import { useCallback, useRef, useState } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { Alloy, Composition } from "../../types";
import { ELEMENT_MAP } from "../../data/elements";
import { buildRadarData } from "../../lib/normalization";
import styles from "./CompositionRadar.module.css";

const ALLOY_COLORS = [
  "#f97316", "#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b",
  "#6366f1", "#ef4444", "#22c55e", "#06b6d4", "#a855f7",
];

interface Props {
  composition: Composition;
  selectedElements: Set<string>;
  balanceElement: string;
  prevalence: Map<string, number>;
  pinnedAlloys: Alloy[];
  onElementChange?: (symbol: string, value: number) => void;
}

function CustomTooltip({ active, payload, pinnedAlloys }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;

  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipAxis}>{data.axis}</div>
      <div>Your mix: {data.rawValue.toFixed(2)}%</div>
      {pinnedAlloys.map((alloy: Alloy) => {
        const raw = data[`${alloy.id}_raw`];
        return raw !== undefined ? (
          <div key={alloy.id}>{alloy.name}: {Number(raw).toFixed(2)}%</div>
        ) : null;
      })}
    </div>
  );
}

export function CompositionRadar({
  composition,
  selectedElements,
  balanceElement,
  prevalence,
  pinnedAlloys,
  onElementChange,
}: Props) {
  const chartRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<string | null>(null);
  const [frozenAxisMax, setFrozenAxisMax] = useState<number | undefined>(undefined);

  const { points: data, axisMax } = buildRadarData(
    composition, selectedElements, balanceElement, prevalence, pinnedAlloys, frozenAxisMax
  );

  const getAngleAndRadius = useCallback(
    (clientX: number, clientY: number) => {
      const el = chartRef.current;
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const outerRadius = Math.min(rect.width, rect.height) * 0.75 / 2;

      const dx = clientX - cx;
      const dy = clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const ratio = Math.min(Math.max(dist / outerRadius, 0), 1);

      let angle = Math.atan2(dx, -dy) * (180 / Math.PI);
      if (angle < 0) angle += 360;

      return { angle, ratio };
    },
    []
  );

  const findNearestAxis = useCallback(
    (angle: number): { axis: string; index: number } | null => {
      const n = data.length;
      if (n === 0) return null;
      const step = 360 / n;
      let bestIdx = 0;
      let bestDiff = 360;
      for (let i = 0; i < n; i++) {
        const axisAngle = i * step;
        let diff = Math.abs(angle - axisAngle);
        if (diff > 180) diff = 360 - diff;
        if (diff < bestDiff) {
          bestDiff = diff;
          bestIdx = i;
        }
      }
      if (bestDiff > step / 2) return null;
      return { axis: data[bestIdx].axis, index: bestIdx };
    },
    [data]
  );

  const updateElement = useCallback(
    (axis: string, ratio: number) => {
      if (!onElementChange || axis === "Other" || axis === balanceElement) return;
      const info = ELEMENT_MAP.get(axis);
      const step = info?.step ?? 0.1;
      const max = info?.sliderMax ?? 100;
      // Convert ratio to wt% using the frozen axis max
      const rawValue = ratio * axisMax;
      const snapped = Math.round(rawValue / step) * step;
      const clamped = Math.min(Math.max(snapped, 0), max);
      onElementChange(axis, parseFloat(clamped.toFixed(4)));
    },
    [onElementChange, balanceElement, axisMax]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const pos = getAngleAndRadius(e.clientX, e.clientY);
      if (!pos) return;
      const nearest = findNearestAxis(pos.angle);
      if (!nearest || nearest.axis === "Other" || nearest.axis === balanceElement) return;
      draggingRef.current = nearest.axis;
      // Freeze the axis max for the duration of the drag
      setFrozenAxisMax(axisMax);
      updateElement(nearest.axis, pos.ratio);
    },
    [getAngleAndRadius, findNearestAxis, updateElement, balanceElement, axisMax]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!draggingRef.current) return;
      const pos = getAngleAndRadius(e.clientX, e.clientY);
      if (!pos) return;
      updateElement(draggingRef.current, pos.ratio);
    },
    [getAngleAndRadius, updateElement]
  );

  const handleMouseUp = useCallback(() => {
    if (draggingRef.current) {
      draggingRef.current = null;
      // Unfreeze so next render recalculates the axis max
      setFrozenAxisMax(undefined);
    }
  }, []);

  return (
    <div
      className={styles.container}
      ref={chartRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: draggingRef.current ? "grabbing" : "crosshair" }}
    >
      <div className={styles.axisLabel}>0–{axisMax.toFixed(1)} wt%</div>
      <ResponsiveContainer width="100%" height={550}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fontSize: 13, fontWeight: 600 }}
          />
          <PolarRadiusAxis
            domain={[0, 1]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Your composition"
            dataKey="normalizedValue"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.15}
            strokeWidth={2}
          />
          {pinnedAlloys.map((alloy, i) => (
            <Radar
              key={alloy.id}
              name={alloy.name}
              dataKey={`${alloy.id}_norm`}
              stroke={ALLOY_COLORS[i % ALLOY_COLORS.length]}
              fill={ALLOY_COLORS[i % ALLOY_COLORS.length]}
              fillOpacity={0.05}
              strokeWidth={2}
              strokeDasharray="4 3"
            />
          ))}
          <Tooltip content={<CustomTooltip pinnedAlloys={pinnedAlloys} />} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
