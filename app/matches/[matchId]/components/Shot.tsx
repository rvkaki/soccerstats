import { Circle, Group, Line } from "react-konva";
import { Shot as TShot } from "../../../types";
import { useState } from "react";

export default function Shot({ shot, location }: TShot) {
  const [showShotInfo, setShowShotInfo] = useState(false);

  const color = (() => {
    switch (shot.outcome.name) {
      case "Goal":
        return "blue";
      case "Blocked":
      case "Saved":
      case "Saved Off T":
      case "Saved To Post":
        return "yellow";
      case "Off T":
      case "Post":
      case "Wayward":
        return "red";
      default:
        shot.outcome.name satisfies never;
        return "white";
    }
  })();

  return (
    <Group
      x={location[0]}
      y={location[1]}
      onClick={() => {
        console.log("clicked", shot, location);
        setShowShotInfo((prev) => !prev);
      }}
    >
      <Circle radius={1.7 * Math.max(0.5, shot.statsbomb_xg)} fill={color} />
      {showShotInfo && (
        <Line
          points={[
            0,
            0,
            shot.end_location[0] - location[0],
            shot.end_location[1] - location[1],
          ]}
          stroke="white"
          strokeWidth={0.2}
          opacity={0.6}
        />
      )}
    </Group>
  );
}
