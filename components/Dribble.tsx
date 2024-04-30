import { Star } from "react-konva";

export default function Dribble({
  location,
  outcome,
}: {
  location: [number, number];
  outcome: "Incomplete" | "Complete";
}) {
  const successfull = outcome === "Complete";

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
