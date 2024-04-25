import { Group, Line } from "react-konva";

export default function Pass({
  startPosition,
  endPosition,
  strokeWidth = 0.1,
  opacity = 1,
}: {
  startPosition: [number, number];
  endPosition: [number, number];
  strokeWidth?: number;
  opacity?: number;
}) {
  return (
    <Group>
      <Line
        points={[
          startPosition[0],
          startPosition[1],
          endPosition[0],
          endPosition[1],
        ]}
        stroke="black"
        strokeWidth={strokeWidth}
        opacity={opacity}
      />
      {/* Arrow */}
      <Line
        points={[
          endPosition[0],
          endPosition[1],
          endPosition[0] - Math.cos(Math.PI / 6),
          endPosition[1] - Math.sin(Math.PI / 6),
        ]}
        stroke="black"
        strokeWidth={0.1}
        opacity={opacity}
      />
      <Line
        points={[
          endPosition[0],
          endPosition[1],
          endPosition[0] - Math.cos(Math.PI / 6),
          endPosition[1] - Math.sin(Math.PI / 6),
        ]}
        stroke="black"
        strokeWidth={0.1}
        opacity={opacity}
      />
    </Group>
  );
}
