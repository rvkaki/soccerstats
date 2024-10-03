import { Circle, Group, Line } from "react-konva";
import { ShotOutcome } from "../app/types";

export default function Shot({
  startPosition,
  endPosition,
  outcome,
  xg = 0.5,
  onMouseOut,
  onMouseOver,
  strokeWidth = 0.2,
  strokeColor = "white",
}: {
  startPosition: [number, number];
  endPosition?: [number, number] | [number, number, number];
  outcome: ShotOutcome;
  xg?: number;
  strokeWidth?: number;
  strokeColor?: string;
} & { onMouseOver?: () => void; onMouseOut?: () => void }) {
  if (!endPosition) {
    return (
      <Circle
        x={startPosition[0]}
        y={startPosition[1]}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        radius={1.7 * Math.max(0.5, xg)}
        fill={strokeColor}
      />
    );
  }

  // Calculate the angle of the line segment
  const angle = Math.atan2(
    endPosition[1] - startPosition[1],
    endPosition[0] - startPosition[0]
  );

  // Define the length of the arrowhead
  const arrowLength = 1;

  // Calculate the points for the arrowhead
  const arrowPoints = [
    endPosition[0] - arrowLength * Math.cos(angle - Math.PI / 6),
    endPosition[1] - arrowLength * Math.sin(angle - Math.PI / 6),
    endPosition[0],
    endPosition[1],
    endPosition[0] - arrowLength * Math.cos(angle + Math.PI / 6),
    endPosition[1] - arrowLength * Math.sin(angle + Math.PI / 6),
  ];

  return (
    <Group>
      <Line
        points={[...startPosition, ...endPosition]}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      {/* Arrow */}
      <Line
        points={arrowPoints}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    </Group>
  );
}
