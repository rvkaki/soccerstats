import { Group, Line } from "react-konva";

export default function Pass({
  startPosition,
  endPosition,
  strokeWidth = 0.1,
  strokeColor = "black",
  opacity = 1,
}: {
  startPosition: [number, number];
  endPosition: [number, number];
  strokeWidth?: number;
  strokeColor?: string;
  opacity?: number;
}) {
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
        points={[
          startPosition[0],
          startPosition[1],
          endPosition[0],
          endPosition[1],
        ]}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        opacity={opacity}
      />
      {/* Arrow */}
      <Line
        points={arrowPoints}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        opacity={opacity}
      />
    </Group>
  );
}
