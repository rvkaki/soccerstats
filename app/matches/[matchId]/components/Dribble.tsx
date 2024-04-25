import { Star } from "react-konva";
import { Dribble as TDribble } from "../../../types";

export default function Dribble({ location, dribble }: TDribble) {
  const successfull = dribble.outcome.name === "Complete";

  return (
    <Star
      x={location[0]}
      y={location[1]}
      numPoints={5}
      innerRadius={0.5}
      outerRadius={1}
      fill={successfull ? "blue" : "red"}
      opacity={0.7}
    />
  );
}
