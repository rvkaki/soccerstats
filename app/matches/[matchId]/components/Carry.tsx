import { Carry as TCarry } from "@/app/types";
import { Group, Line } from "react-konva";

export default function Carry({ carry, location }: TCarry) {
  const { end_location } = carry;

  return (
    <Group>
      <Line
        points={[location[0], location[1], end_location[0], end_location[1]]}
        stroke="white"
        dash={[2, 2]}
        opacity={0.7}
        strokeWidth={0.2}
      />
    </Group>
  );
}
