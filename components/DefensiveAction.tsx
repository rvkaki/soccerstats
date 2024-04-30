import {
  BallRecovery as TBallRecovery,
  Block as TBlock,
  Clearance as TClearance,
  Duel as TDuel,
  Interception as TInterception,
} from "@/app/types";
import { Circle } from "react-konva";

type DefensiveActionEvent =
  | TBallRecovery
  | TBlock
  | TInterception
  | TDuel
  | TClearance;

export default function DefensiveAction(event: DefensiveActionEvent) {
  const { location, type: eventType } = event;

  const color = (() => {
    switch (eventType) {
      case "Ball Recovery":
        return "blue";
      case "Block":
        return "red";
      case "Clearance":
        return "yellow";
      case "Duel":
        return "purple";
      case "Interception":
        return "white";
      default:
        eventType satisfies never;
        return "black";
    }
  })();

  return <Circle x={location[0]} y={location[1]} radius={1} fill={color} />;
}

export function DefensiveActionLegend() {
  return (
    <div className="flex flex-row gap-8">
      <div className="flex flex-row items-center">
        <div className="w-4 h-4 bg-blue-500 rounded-full border-[1px] border-gray-700" />
        <div className="ml-2">Ball Recovery</div>
      </div>
      <div className="flex flex-row items-center">
        <div className="w-4 h-4 bg-red-500 rounded-full border-[1px] border-gray-700" />
        <div className="ml-2">Block</div>
      </div>
      <div className="flex flex-row items-center">
        <div className="w-4 h-4 bg-yellow-500 rounded-full border-[1px] border-gray-700" />
        <div className="ml-2">Clearance</div>
      </div>
      <div className="flex flex-row items-center">
        <div className="w-4 h-4 bg-purple-500 rounded-full border-[1px] border-gray-700" />
        <div className="ml-2">Duel Won</div>
      </div>
      <div className="flex flex-row items-center">
        <div className="w-4 h-4 bg-white-500 rounded-full border-[1px] border-gray-700" />
        <div className="ml-2">Interception</div>
      </div>
    </div>
  );
}
