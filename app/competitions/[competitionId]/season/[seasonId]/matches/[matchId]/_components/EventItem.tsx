"use client";

import {
  Dribble,
  Duel,
  Interception,
  MatchEvent,
  Carry as TCarry,
  Pass as TPass,
  Shot as TShot,
} from "@/app/types";
import Carry from "@/components/Carry";
import Pass from "@/components/Pass";
import Shot from "@/components/Shot";
import { Circle } from "react-konva";

export default function EventItem({
  event,
  color,
}: {
  event: MatchEvent;
  color: string;
}) {
  const type = event.type.name;
  const location = event.location;

  switch (type) {
    case "Pass": {
      const pass = (event as TPass).pass;
      const endLocation = pass.end_location;
      const successful = !Boolean(pass.outcome);
      return (
        <Pass
          key={event.id}
          startPosition={location}
          endPosition={endLocation}
          strokeWidth={0.3}
          strokeColor={successful ? color : color + "66"}
        />
      );
    }
    case "Shot": {
      const shot = (event as TShot).shot;
      const endLocation = shot.end_location;
      return (
        <Shot
          key={event.id}
          startPosition={location}
          endPosition={endLocation}
          outcome={shot.outcome.name}
          xg={shot.statsbomb_xg}
          strokeWidth={0.3}
          strokeColor={shot.outcome.name === "Goal" ? color : color + "99"}
        />
      );
    }
    case "Ball Recovery": {
      const unsuccessful =
        "ball_recovery" in event && "recovery_failure" in event.ball_recovery;
      return (
        <Circle
          key={event.id}
          x={location[0]}
          y={location[1]}
          radius={0.5}
          fill={unsuccessful ? color + "66" : color}
        />
      );
    }
    case "Block":
    case "Clearance": {
      return (
        <Circle
          key={event.id}
          x={location[0]}
          y={location[1]}
          radius={0.5}
          fill={color}
        />
      );
    }
    case "Interception": {
      const interception = (event as Interception).interception;
      const successful = [
        "Success",
        "Success In Play",
        "Success Out",
        "Won",
      ].includes(interception.outcome.name);

      return (
        <Circle
          key={event.id}
          x={location[0]}
          y={location[1]}
          radius={0.5}
          fill={successful ? color : color + "66"}
        />
      );
    }
    case "Duel": {
      const duel = (event as Duel).duel;
      const successful = [
        "Success",
        "Success In Play",
        "Success Out",
        "Won",
      ].includes(duel.outcome?.name || "");

      return (
        <Circle
          key={event.id}
          x={location[0]}
          y={location[1]}
          radius={0.5}
          fill={successful ? color : color + "66"}
        />
      );
    }
    case "Carry": {
      const carry = (event as TCarry).carry;
      const endLocation = carry.end_location;
      return (
        <Carry
          key={event.id}
          startPosition={location}
          endPosition={endLocation}
          strokeWidth={0.3}
          strokeColor={color}
        />
      );
    }
    case "Pressure":
      return (
        <Circle
          key={event.id}
          x={location[0]}
          y={location[1]}
          radius={0.5}
          fill={color}
        />
      );
    case "Dribble":
      const dribble = (event as Dribble).dribble;
      const successful = dribble.outcome.name === "Complete";
      return (
        <Circle
          key={event.id}
          x={location[0]}
          y={location[1]}
          radius={0.5}
          fill={successful ? color : color + "66"}
        />
      );
    default:
      return null;
  }
}
