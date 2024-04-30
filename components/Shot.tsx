import { useState } from "react";
import { Circle, Group, Line } from "react-konva";
import { ShotOutcome, Shot as TShot } from "../app/types";

export default function Shot({
  startPosition,
  endPosition,
  outcome,
  xg = 0.5,
  onMouseOut,
  onMouseOver,
}: {
  startPosition: [number, number];
  endPosition?: [number, number];
  outcome: ShotOutcome;
  xg?: number;
} & { onMouseOver?: () => void; onMouseOut?: () => void }) {
  const color = (() => {
    switch (outcome) {
      case "Goal":
        return "blue";
      case "Blocked":
      case "Saved":
      case "Saved Off T":
      case "Saved To Post":
        return "yellow";
      case "Off T":
      case "Post":
      case "Wayward":
        return "red";
      default:
        outcome satisfies never;
        return "white";
    }
  })();

  console.log("Shot", startPosition, endPosition);

  if (!endPosition) {
    return (
      <Circle
        x={startPosition[0]}
        y={startPosition[1]}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        radius={1.7 * Math.max(0.5, xg)}
        fill={color}
      />
    );
  }

  return (
    <Line
      points={[...startPosition, ...endPosition]}
      stroke={color}
      strokeWidth={0.2}
    />
  );
}
