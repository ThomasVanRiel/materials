import { useMemo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Label,
  LabelList,
  useXAxisScale,
  useYAxisScale,
} from "recharts";
import type { Alloy, AlloyFamily } from "../../types";
import { ALLOYS } from "../../data/alloys";
import {
  AXIS_OPTIONS_MAP,
  FAMILY_COLORS,
} from "../../lib/axisOptions";
import { convexHull, padHull, smoothHullPath } from "../../lib/convexHull";
import { AxisSelector } from "./AxisSelector";
import styles from "./ScatterPlot.module.css";

interface Props {
  pinnedAlloys: Alloy[];
  xAxisKey: string;
  yAxisKey: string;
  onXAxisChange: (key: string) => void;
  onYAxisChange: (key: string) => void;
  hiddenFamilies: Set<AlloyFamily>;
  onToggleFamily: (family: AlloyFamily) => void;
}

interface DataPoint {
  x: number;
  y: number;
  alloy: Alloy;
}

const FAMILIES = Object.keys(FAMILY_COLORS) as AlloyFamily[];
const PINNED_ALLOY_COLORS = [
  "#f97316", "#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b",
  "#6366f1", "#ef4444", "#22c55e", "#06b6d4", "#a855f7",
];

function CustomTooltip({ active, payload, xLabel, yLabel }: any) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload as DataPoint | undefined;
  if (!point) return null;

  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipName}>{point.alloy.name}</div>
      <div className={styles.tooltipFamily}>{point.alloy.family}</div>
      <div className={styles.tooltipValue}>
        {xLabel}: {point.x.toFixed(2)}
      </div>
      <div className={styles.tooltipValue}>
        {yLabel}: {point.y.toFixed(2)}
      </div>
    </div>
  );
}

/** Custom SVG layer rendered inside ScatterChart to draw convex hull patches */
function FamilyPatches({
  data,
  hiddenFamilies,
}: {
  data: Map<AlloyFamily, DataPoint[]>;
  hiddenFamilies: Set<AlloyFamily>;
}) {
  const xScale = useXAxisScale();
  const yScale = useYAxisScale();
  if (!xScale || !yScale) return null;

  return (
    <g>
      {FAMILIES.map((family) => {
        if (hiddenFamilies.has(family)) return null;
        const points = data.get(family);
        if (!points || points.length < 3) return null;

        const screenPoints = points.map((p) => ({
          x: xScale(p.x) as number,
          y: yScale(p.y) as number,
        }));

        const hull = convexHull(screenPoints);
        const padded = padHull(hull, 14);
        if (padded.length < 3) return null;

        const pathD = smoothHullPath(padded, 0.3);

        return (
          <path
            key={family}
            d={pathD}
            fill={FAMILY_COLORS[family]}
            fillOpacity={0.08}
            stroke={FAMILY_COLORS[family]}
            strokeOpacity={0.25}
            strokeWidth={1.5}
          />
        );
      })}
    </g>
  );
}

export function ScatterPlot({ pinnedAlloys, xAxisKey, yAxisKey, onXAxisChange, onYAxisChange, hiddenFamilies, onToggleFamily }: Props) {
  const xOpt = AXIS_OPTIONS_MAP.get(xAxisKey)!;
  const yOpt = AXIS_OPTIONS_MAP.get(yAxisKey)!;

  const { familyData, pinnedData } = useMemo(() => {
    const fam = new Map<AlloyFamily, DataPoint[]>();
    for (const family of FAMILIES) fam.set(family, []);

    const pinSet = new Set(pinnedAlloys.map((a) => a.id));
    const pinned: DataPoint[] = [];

    for (const alloy of ALLOYS) {
      const xVal = xOpt.getValue(alloy);
      const yVal = yOpt.getValue(alloy);
      if (xVal === null || yVal === null) continue;

      const point: DataPoint = { x: xVal, y: yVal, alloy };
      fam.get(alloy.family)!.push(point);

      if (pinSet.has(alloy.id)) {
        pinned.push(point);
      }
    }

    return { familyData: fam, pinnedData: pinned };
  }, [xOpt, yOpt, pinnedAlloys]);

  return (
    <div className={styles.container}>
      <div className={styles.xAxisControl}>
        <AxisSelector value={xAxisKey} onChange={onXAxisChange} />
        <span className={styles.vsLabel}>vs</span>
        <AxisSelector value={yAxisKey} onChange={onYAxisChange} />
      </div>
      <ResponsiveContainer width="100%" height={550}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            type="number"
            dataKey="x"
            name={xOpt.label}
            tick={{ fontSize: 11 }}
            stroke="#9ca3af"
          >
            <Label value={xOpt.label} position="bottom" offset={0} style={{ fontSize: 12, fill: "#6b7280" }} />
          </XAxis>
          <YAxis
            type="number"
            dataKey="y"
            name={yOpt.label}
            tick={{ fontSize: 11 }}
            stroke="#9ca3af"
          >
            <Label value={yOpt.label} angle={-90} position="insideLeft" offset={10} style={{ fontSize: 12, fill: "#6b7280", textAnchor: "middle" }} />
          </YAxis>
          <Tooltip
            content={
              <CustomTooltip xLabel={xOpt.label} yLabel={yOpt.label} />
            }
          />
          {/* Convex hull patches — uses recharts scale hooks internally */}
          <FamilyPatches
            data={familyData}
            hiddenFamilies={hiddenFamilies}
          />
          {/* One Scatter per family for color grouping */}
          {FAMILIES.map((family) => {
            if (hiddenFamilies.has(family)) return null;
            const points = familyData.get(family) ?? [];
            if (points.length === 0) return null;
            return (
              <Scatter
                key={family}
                name={family}
                data={points}
                fill={FAMILY_COLORS[family]}
                fillOpacity={0.7}
                strokeWidth={0}
              >
                {points.map((_, idx) => (
                  <Cell key={idx} r={5} />
                ))}
              </Scatter>
            );
          })}
          {/* Pinned alloys highlighted */}
          {pinnedData.length > 0 && (
            <Scatter
              name="Pinned"
              data={pinnedData}
              fill="none"
              isAnimationActive={false}
            >
              {pinnedData.map((p) => {
                const pinIdx = pinnedAlloys.findIndex((a) => a.id === p.alloy.id);
                const color = PINNED_ALLOY_COLORS[pinIdx % PINNED_ALLOY_COLORS.length];
                return (
                  <Cell
                    key={p.alloy.id}
                    r={8}
                    fill={color}
                    fillOpacity={0.3}
                    stroke={color}
                    strokeWidth={2.5}
                  />
                );
              })}
              <LabelList
                dataKey="alloy.name"
                position="top"
                offset={10}
                style={{ fontSize: 11, fontWeight: 600, fill: "#374151" }}
              />
            </Scatter>
          )}
        </ScatterChart>
      </ResponsiveContainer>
      <div className={styles.legend}>
        {FAMILIES.map((family) => (
          <div
            key={family}
            className={hiddenFamilies.has(family) ? styles.legendItemHidden : styles.legendItem}
            onClick={() => onToggleFamily(family)}
          >
            <span
              className={styles.legendDot}
              style={{ background: FAMILY_COLORS[family] }}
            />
            {family}
          </div>
        ))}
      </div>
    </div>
  );
}
