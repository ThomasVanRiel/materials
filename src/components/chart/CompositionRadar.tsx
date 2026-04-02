import { useCallback, useMemo, useRef, useState } from "react";
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

/**
 * Cardinal closed spline through radar polygon points.
 * Tension 0 = Catmull-Rom, 1 = straight lines.
 */
function SmoothRadar({ points, stroke, fill, fillOpacity, strokeWidth }: any) {
  if (!points || points.length < 3) return null;
  // Close the loop by wrapping first two points at end and last at start
  const pts = [points[points.length - 1], ...points, points[0], points[1]];
  const tension = 0.3;
  const t = Math.max(0, Math.min(1, tension));

  let d = "";
  for (let i = 1; i < pts.length - 2; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2];

    const cp1x = p1.x + (p2.x - p0.x) / 6 * (1 - t);
    const cp1y = p1.y + (p2.y - p0.y) / 6 * (1 - t);
    const cp2x = p2.x - (p3.x - p1.x) / 6 * (1 - t);
    const cp2y = p2.y - (p3.y - p1.y) / 6 * (1 - t);

    if (i === 1) {
      d += `M ${p1.x},${p1.y} `;
    }
    d += `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y} `;
  }
  d += "Z";

  return (
    <path
      d={d}
      stroke={stroke}
      fill={fill}
      fillOpacity={fillOpacity}
      strokeWidth={strokeWidth}
    />
  );
}

/** Pick a "nice" step size that gives roughly `count` ticks */
function niceStep(max: number, count: number): number {
  const rough = max / count;
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const norm = rough / mag;
  let nice: number;
  if (norm <= 1) nice = 1;
  else if (norm <= 2) nice = 2;
  else if (norm <= 5) nice = 5;
  else nice = 10;
  return nice * mag;
}

function CustomTooltip({ active, payload, pinnedAlloys, hiddenSeries }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;
  const hidden = (hiddenSeries as Set<string>) ?? new Set();

  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipAxis}>{data.axis}</div>
      {!hidden.has("normalizedValue") && (
        <div style={{ color: "#3b82f6" }}>Your mix: {data.rawValue.toFixed(2)}%</div>
      )}
      {pinnedAlloys.map((alloy: Alloy, i: number) => {
        if (hidden.has(`${alloy.id}_norm`)) return null;
        const raw = data[`${alloy.id}_raw`];
        const color = ALLOY_COLORS[i % ALLOY_COLORS.length];
        return raw !== undefined ? (
          <div key={alloy.id} style={{ color }}>{alloy.name}: {Number(raw).toFixed(2)}%</div>
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
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(() => new Set());
  const [logScale, setLogScale] = useState(false);
  const [smooth, setSmooth] = useState(false);

  const handleLegendClick = useCallback((entry: any) => {
    const key = entry.dataKey as string;
    setHiddenSeries((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const { points: data, axisMax } = buildRadarData(
    composition, selectedElements, balanceElement, prevalence, pinnedAlloys, frozenAxisMax, logScale
  );

  // Generate ~5 nice tick values in wt%, then convert to normalized [0,1] for the axis
  const ticks = useMemo(() => {
    const count = 5;
    const rawTicks: number[] = [];
    // Pick nice round numbers up to axisMax
    const step = niceStep(axisMax, count);
    for (let v = step; v < axisMax; v += step) {
      rawTicks.push(Math.round(v * 100) / 100);
    }
    return rawTicks.map((v) => ({
      raw: v,
      normalized: logScale
        ? Math.log1p(v) / Math.log1p(axisMax)
        : v / axisMax,
    }));
  }, [axisMax, logScale]);

  const getAngleAndRadius = useCallback(
    (clientX: number, clientY: number, clampOnly?: boolean) => {
      const el = chartRef.current;
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const outerRadius = Math.min(rect.width, rect.height) * 0.75 / 2;

      const dx = clientX - cx;
      const dy = clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // For initial click: reject if outside chart circle
      // For active drag: clamp to [0, 1]
      if (!clampOnly && dist > outerRadius) return null;

      const ratio = Math.min(dist / outerRadius, 1);

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
      // Convert ratio to wt%: invert log if log scale is active
      let rawValue: number;
      if (logScale) {
        // ratio = log(1+v) / log(1+axisMax), so v = exp(ratio * log(1+axisMax)) - 1
        rawValue = Math.expm1(ratio * Math.log1p(axisMax));
      } else {
        rawValue = ratio * axisMax;
      }
      const snapped = Math.round(rawValue / step) * step;
      const clamped = Math.min(Math.max(snapped, 0), max);
      onElementChange(axis, parseFloat(clamped.toFixed(4)));
    },
    [onElementChange, balanceElement, axisMax, logScale]
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
      const pos = getAngleAndRadius(e.clientX, e.clientY, true);
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
      <div className={styles.controls}>
        <span className={styles.axisLabel}>0–{axisMax.toFixed(1)} wt%</span>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={logScale}
            onChange={(e) => setLogScale(e.target.checked)}
          />
          <span className={styles.toggleLabel}>Log</span>
        </label>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={smooth}
            onChange={(e) => setSmooth(e.target.checked)}
          />
          <span className={styles.toggleLabel}>Smooth</span>
        </label>
      </div>
      <ResponsiveContainer width="100%" height={550}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid
            stroke="#e5e7eb"
            gridType="circle"
          />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fontSize: 13, fontWeight: 600 }}
          />
          <PolarRadiusAxis
            domain={[0, 1]}
            ticks={ticks.map((t) => t.normalized)}
            tick={({ x, y, payload }: any) => {
              const t = ticks.find((t) => Math.abs(t.normalized - payload.value) < 0.001);
              if (!t) return <text />;
              return (
                <text
                  x={x}
                  y={y}
                  fontSize={10}
                  fill="#9ca3af"
                  textAnchor="middle"
                  dy={-4}
                >
                  {t.raw < 1 ? t.raw.toFixed(1) : Math.round(t.raw)}
                </text>
              );
            }}
            axisLine={false}
          />
          <Radar
            name="Your composition"
            dataKey="normalizedValue"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={hiddenSeries.has("normalizedValue") ? 0 : 0.15}
            strokeWidth={2}
            hide={hiddenSeries.has("normalizedValue")}
            shape={smooth ? <SmoothRadar stroke="#3b82f6" fill="#3b82f6" fillOpacity={hiddenSeries.has("normalizedValue") ? 0 : 0.15} strokeWidth={2} /> : undefined}
          />
          {pinnedAlloys.map((alloy, i) => {
            const dataKey = `${alloy.id}_norm`;
            const hidden = hiddenSeries.has(dataKey);
            const color = ALLOY_COLORS[i % ALLOY_COLORS.length];
            return (
              <Radar
                key={alloy.id}
                name={alloy.name}
                dataKey={dataKey}
                stroke={color}
                fill={color}
                fillOpacity={hidden ? 0 : 0.05}
                strokeWidth={2}
                hide={hidden}
                shape={smooth ? <SmoothRadar stroke={color} fill={color} fillOpacity={hidden ? 0 : 0.05} strokeWidth={2} /> : undefined}
              />
            );
          })}
          <Tooltip content={<CustomTooltip pinnedAlloys={pinnedAlloys} hiddenSeries={hiddenSeries} />} />
          <Legend
            onClick={handleLegendClick}
            formatter={(value: string, entry: any) => (
              <span style={{
                color: hiddenSeries.has(entry.dataKey) ? "#d1d5db" : undefined,
                cursor: "pointer",
                textDecoration: hiddenSeries.has(entry.dataKey) ? "line-through" : undefined,
              }}>
                {value}
              </span>
            )}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
