export interface MeasureBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
}

export interface MeasureLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  value: number;
}

const axisGaps = (start: number, end: number, otherStart: number, otherEnd: number): number[][] => {
  if (end <= otherStart) return [[end, otherStart]];
  if (otherEnd <= start) return [[otherEnd, start]];
  return [[Math.min(start, otherStart), Math.max(start, otherStart)],
    [Math.min(end, otherEnd), Math.max(end, otherEnd)]];
};

export const measureDistances = (anchor: MeasureBounds, target: MeasureBounds): MeasureLine[] => {
  const lines: MeasureLine[] = [];
  const horizontalY = (anchor.top + anchor.bottom) / 2;
  const verticalX = (anchor.left + anchor.right) / 2;
  for (const [start, end] of axisGaps(anchor.left, anchor.right, target.left, target.right)) {
    if (start === undefined || end === undefined || start === end) continue;
    lines.push({ x1: start, y1: horizontalY, x2: end, y2: horizontalY, value: end - start });
  }
  for (const [start, end] of axisGaps(anchor.top, anchor.bottom, target.top, target.bottom)) {
    if (start === undefined || end === undefined || start === end) continue;
    lines.push({ x1: verticalX, y1: start, x2: verticalX, y2: end, value: end - start });
  }
  return lines;
};

export const formatMeasurement = (value: number): string => String(Math.round(value * 10) / 10);
