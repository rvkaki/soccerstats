import { Circle, Group, Text } from "react-konva";
import { PlayerPosition } from "../app/types";
import { PlayerPositionToLocation, reverseLocation } from "../app/matches/[matchId]/consts";

export default function Player({
  jersey_number,
  position,
  location,
  is_starter,
  color = "blue",
}: {
  jersey_number?: number;
  position: { id: number; name: PlayerPosition } | PlayerPosition;
  location?: [number, number];
  is_starter?: boolean;
  color?: string;
}) {
  const actualLocation = (() => {
    if (location) {
      return location;
    }

    if (typeof position === "object") {
      return PlayerPositionToLocation[position.name];
    }

    return PlayerPositionToLocation[position];
  })();

  return (
    <Group x={actualLocation[0]} y={actualLocation[1]}>
      <Circle
        radius={2}
        fill={is_starter ? color : "white"}
        opacity={0.7}
        stroke={color}
        strokeWidth={0.1}
      />
      <Text
        width={4}
        height={4.5}
        align="center"
        verticalAlign="middle"
        text={jersey_number?.toString()}
        fontSize={2.5}
        x={-2}
        y={-2}
        fill={is_starter ? "white" : color}
      />
    </Group>
  );
}
