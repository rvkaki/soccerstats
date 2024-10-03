"use client";

import { useMatchPlayerActions, useMatchTeams } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useState } from "react";
const CanvasStage = dynamic(() => import("./_components/CanvasStage"), {
  ssr: false,
});

const MATCH_ID = "3930168";
const PLAYER_ID = 5574;
const TEAM_ID = 770;

export default function Sandbox() {
  const [currentActionIdx, setCurrentActionIdx] = useState(0);
  const { data: playerActions = [], isLoading } = useMatchPlayerActions({
    matchId: MATCH_ID,
    playerId: PLAYER_ID,
  });
  const { data: teams = [], isLoading: isTeamsLoading } = useMatchTeams({
    matchId: MATCH_ID,
    competitionId: 1,
    seasonId: 1,
  });

  if (isLoading || isTeamsLoading) {
    return <div>Loading...</div>;
  }

  const team = teams.find((t) => t.id === TEAM_ID);
  const player = team?.players.find((p) => p.id === PLAYER_ID)!;

  const { event360, ...action } = playerActions[currentActionIdx]!;

  console.log({ action });

  if (action.type.name !== "Pass") {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 items-start">
      <div className="flex items-center gap-4 overflow-hidden w-full px-6 py-3">
        <button
          className="p-3"
          onClick={() => setCurrentActionIdx(currentActionIdx - 1)}
          disabled={currentActionIdx === 0}
        >
          {"<"}
        </button>
        <div className="flex gap-2 overflow-auto">
          {playerActions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentActionIdx(idx)}
              className={cn("p-3", idx === currentActionIdx && "bg-gray-200")}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <button
          className="p-3"
          onClick={() => setCurrentActionIdx(currentActionIdx + 1)}
          disabled={currentActionIdx === playerActions.length - 1}
        >
          {">"}
        </button>
      </div>

      <CanvasStage action={action} player={player} event360={event360} />
    </div>
  );
}
