import { Circle, Group, Line, Path, Rect } from "react-konva";

export default function Pitch({ color = "white" }: { color?: string }) {
  return (
    <Group x={0} y={0} width={120} height={80}>
      {/* <!-- Outer boundary --> */}
      <Rect
        x={0}
        y={0}
        width={120}
        height={80}
        fill="transparent"
        stroke={color}
        strokeWidth={0.5}
      />
      {/* <!-- Center line --> */}
      <Line points={[60, 0, 60, 80]} stroke={color} strokeWidth={0.5} />
      {/* <!-- Center circle --> */}
      <Circle
        x={60}
        y={40}
        radius={9.15}
        fill="transparent"
        stroke={color}
        strokeWidth={0.5}
      />
      {/* <!-- Left Penalty area --> */}
      <Rect
        x={0}
        y={18}
        width={18}
        height={44}
        fill="transparent"
        stroke={color}
        strokeWidth={0.5}
      />
      {/* <!-- Left 6-yard box --> */}
      <Rect
        x={0}
        y={30}
        width={6}
        height={20}
        fill="transparent"
        stroke={color}
        strokeWidth={0.5}
      />
      {/* <!-- Right Penalty area --> */}
      <Rect
        x={102}
        y={18}
        width={18}
        height={44}
        fill="transparent"
        stroke={color}
        strokeWidth={0.5}
      />
      {/* <!-- Right 6-yard box --> */}
      <Rect
        x={114}
        y={30}
        width={6}
        height={20}
        fill="transparent"
        stroke={color}
        strokeWidth={0.5}
      />
      {/* <!-- Left Goal --> */}
      <Rect
        x={-1}
        y={36}
        width={1}
        height={8}
        fill="transparent"
        stroke={color}
        strokeWidth={0.5}
      />
      {/* <!-- Right Goal --> */}
      <Rect
        x={120}
        y={36}
        width={1}
        height={8}
        fill="transparent"
        stroke={color}
        strokeWidth={0.5}
      />
      {/* <!-- Left Arc --> */}
      <Path
        d="M18,40 A9.15,9.15 0 0,0 18,40.5"
        fill="transparent"
        stroke={color}
        strokeWidth={0.5}
      />
      {/* <!-- Right Arc --> */}
      <Path
        d="M102,40 A9.15,9.15 0 0,1 102,40.5"
        fill="transparent"
        stroke={color}
        strokeWidth={0.5}
      />
    </Group>
  );
}
