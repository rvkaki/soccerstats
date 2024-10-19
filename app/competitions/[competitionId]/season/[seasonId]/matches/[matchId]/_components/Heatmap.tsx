"use client";

import { MatchEvent } from "@/app/types";
import twColors from "@/lib/tailwindColors";
import { Group, Rect } from "react-konva";
import { FIELD_HEIGHT, FIELD_WIDTH } from "../consts";

const FACTOR = 4;

function getActionsMatrix(actions: MatchEvent[]) {
  const matrix: number[][] = Array.from(
    { length: FIELD_WIDTH / FACTOR + 1 },
    () => Array(FIELD_HEIGHT / FACTOR + 1).fill(0)
  );

  actions.forEach((action) => {
    if (!action.location) {
      console.log(action);
      return;
    }
    const x = Math.floor(action.location[0] / FACTOR);
    const y = Math.floor(action.location[1] / FACTOR);

    matrix[y][x] += 1;
  });

  return matrix;
}

export default function Heatmap({
  id,
  actions,
  colorName,
}: {
  id: number | null;
  actions: MatchEvent[];
  colorName: keyof typeof twColors;
}) {
  const actionsMatrix = getActionsMatrix(actions);

  const colorGradientGrid = [
    // twColors[colorName][200],
    // twColors[colorName][300],
    twColors[colorName][400],
    twColors[colorName][500],
    twColors[colorName][600],
    twColors[colorName][700],
    twColors[colorName][800],
    twColors[colorName][900],
    twColors[colorName][950],
  ];

  const flatData = actionsMatrix.flat();
  const minValue = Math.min(...flatData);
  const maxValue = Math.max(...flatData);

  function getColor(val: number) {
    const index = Math.floor(
      ((val - minValue) / (maxValue - minValue)) * colorGradientGrid.length
    );
    return colorGradientGrid[index];
  }

  return (
    <Group opacity={0.6}>
      {actionsMatrix.map((row, x) =>
        row.map((count, y) => {
          if (count === 0) {
            return null;
          }

          const xPos = y * FACTOR;
          const yPos = x * FACTOR;

          return (
            <Rect
              key={`${x}-${y}`}
              x={xPos}
              y={yPos}
              width={FACTOR}
              height={FACTOR}
              fill={getColor(count)}
              opacity={1}
            />
          );
        })
      )}
    </Group>
  );
}
