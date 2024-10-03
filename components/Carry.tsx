import { Group, Line, Text } from "react-konva";

export default function Carry({
  startPosition,
  endPosition,
  strokeWidth = 0.2,
  strokeColor = "white",
}: {
  startPosition: [number, number];
  endPosition: [number, number];
  opacity?: number;
  strokeWidth?: number;
  strokeColor?: string;
}) {
  const [x1, y1] = startPosition;
  const [x2, y2] = endPosition;
  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const angle = Math.atan2(y2 - y1, x2 - x1);

  return (
    <Group>
      {/* Display carried distance aligned with the line */}
      {distance > 5 && (
        <Text
          x={x1}
          y={y1}
          text={distance.toFixed(1) + "m"}
          fontSize={1.5}
          fill={strokeColor}
          rotation={angle * (180 / Math.PI)}
          offsetX={-distance / 2 + 1}
          offsetY={-0.3}
        />
      )}
      <Line
        points={[...startPosition, ...endPosition]}
        strokeWidth={strokeWidth}
        stroke={strokeColor}
        dash={[0.5, 0.5]}
      />
    </Group>
  );
}
