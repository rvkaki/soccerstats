import { BallLost as TBallLost } from "@/app/types";
import { Circle, Star } from "react-konva";

export default function BallLost({ location, type: eventType }: TBallLost) {
  return (
    <Circle
      x={location[0]}
      y={location[1]}
      radius={1}
      fill="black"
      opacity={0.7}
    />
  );
  switch (eventType) {
    case "Pass":
    case "Dribble":
      return (
        <Star
          x={location[0]}
          y={location[1]}
          numPoints={5}
          innerRadius={0.5}
          outerRadius={1}
          fill="red"
          opacity={0.7}
        />
      );
    case "Duel":
      return (
        <Circle
          x={location[0]}
          y={location[1]}
          radius={0.5}
          fill="red"
          opacity={0.7}
        />
      );
    case "Foul Committed":
      return (
        <Circle
          x={location[0]}
          y={location[1]}
          radius={0.5}
          fill="red"
          opacity={0.7}
        />
      );
    case "Miscontrol":
      return (
        <Circle
          x={location[0]}
          y={location[1]}
          radius={0.5}
          fill="red"
          opacity={0.7}
        />
      );
    case "Dispossessed":
      return (
        <Circle
          x={location[0]}
          y={location[1]}
          radius={0.5}
          fill="red"
          opacity={0.7}
        />
      );
    default:
      // eventType satisfies never;
      return null;
  }
}
