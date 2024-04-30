import { Group, Line } from "react-konva";

export default function Carry({
  startPosition,
  endPosition,
  opacity = 0.7,
  strokeWidth = 0.2,
}: {
  startPosition: [number, number];
  endPosition: [number, number];
  opacity?: number;
  strokeWidth?: number;
}) {
  return (
    <Group>
      <Line
        points={[...startPosition, ...endPosition]}
        stroke="white"
        opacity={opacity}
        strokeWidth={strokeWidth}
      />
    </Group>
  );
}
