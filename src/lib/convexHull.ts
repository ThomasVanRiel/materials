export interface Point {
  x: number;
  y: number;
}

/** Cross product of vectors OA and OB where O is the origin */
function cross(O: Point, A: Point, B: Point): number {
  return (A.x - O.x) * (B.y - O.y) - (A.y - O.y) * (B.x - O.x);
}

/** Andrew's monotone chain algorithm — returns convex hull in CCW order */
export function convexHull(points: Point[]): Point[] {
  if (points.length <= 1) return [...points];

  const sorted = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
  const n = sorted.length;

  if (n === 2) return sorted;

  // Build lower hull
  const lower: Point[] = [];
  for (const p of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }

  // Build upper hull
  const upper: Point[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const p = sorted[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }

  // Remove last point of each half because it's repeated
  lower.pop();
  upper.pop();

  return [...lower, ...upper];
}

/** Generate a smooth closed SVG path (cubic bezier) through hull points */
export function smoothHullPath(hull: Point[], tension = 0.3): string {
  if (hull.length < 3) return "";

  const n = hull.length;
  const t = Math.max(0, Math.min(1, tension));
  let d = "";

  for (let i = 0; i < n; i++) {
    const p0 = hull[(i - 1 + n) % n];
    const p1 = hull[i];
    const p2 = hull[(i + 1) % n];
    const p3 = hull[(i + 2) % n];

    const cp1x = p1.x + ((p2.x - p0.x) / 6) * (1 - t);
    const cp1y = p1.y + ((p2.y - p0.y) / 6) * (1 - t);
    const cp2x = p2.x - ((p3.x - p1.x) / 6) * (1 - t);
    const cp2y = p2.y - ((p3.y - p1.y) / 6) * (1 - t);

    if (i === 0) {
      d += `M ${p1.x},${p1.y} `;
    }
    d += `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y} `;
  }

  return d + "Z";
}

/** Expand a convex hull outward from its centroid by `padding` pixels */
export function padHull(hull: Point[], padding: number): Point[] {
  if (hull.length === 0) return [];

  const cx = hull.reduce((s, p) => s + p.x, 0) / hull.length;
  const cy = hull.reduce((s, p) => s + p.y, 0) / hull.length;

  return hull.map((p) => {
    const dx = p.x - cx;
    const dy = p.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0) return p;
    return {
      x: p.x + (dx / dist) * padding,
      y: p.y + (dy / dist) * padding,
    };
  });
}
