"use client";
import { Circle, Group, Text } from "react-konva";
import { PlayerPosition } from "../app/types";
import { PlayerPositionToLocation } from "@/app/competitions/[competitionId]/season/[seasonId]/matches/[matchId]/consts";

export default function Player({
  jersey_number,
  position,
  location,
  color = "blue",
  radius = 2,
}: {
  jersey_number?: number;
  position: { id: number; name: PlayerPosition } | PlayerPosition;
  location?: [number, number];
  is_starter?: boolean;
  color?: string;
  radius?: number;
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
        radius={radius}
        stroke={color}
        strokeWidth={radius * 0.12}
        fill="transparent"
        opacity={0.9}
        shadowColor={color}
        shadowBlur={1}
        shadowOffsetX={0}
        shadowOffsetY={0}
      />
      <Text
        width={4}
        height={4.5}
        align="center"
        verticalAlign="middle"
        text={jersey_number?.toString()}
        fontSize={Math.round(radius * 2 * 0.5)}
        x={-2}
        y={-2}
        fill={color}
        shadowColor={color}
        shadowBlur={1}
        shadowOffsetX={0}
        shadowOffsetY={0}
      />
    </Group>
  );
}
