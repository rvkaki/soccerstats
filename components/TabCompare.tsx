import { PlayerPositionToShort } from "@/app/matches/[matchId]/consts";
import {
  Player,
  useMatchTeams,
  usePlayerStatsById,
} from "@/app/matches/[matchId]/hooks";
import { shortenName } from "@/lib/utils";
import { useState } from "react";

function PlayerItem({
  player,
  isActive,
  onClick,
  isReverse = false,
}: {
  player: Player;
  isActive: boolean;
  onClick: () => void;
  isReverse?: boolean;
}) {
  const position =
    typeof player.position === "object"
      ? player.position.name
      : player.position;

  return (
    <li
      className="w-full border-b p-2"
      style={{
        backgroundColor: isActive ? "#e5e7eb" : "white",
      }}
    >
      <button
        className="w-full flex gap-2 items-center"
        style={{
          flexDirection: isReverse ? "row-reverse" : "row",
          textAlign: isReverse ? "end" : "start",
        }}
        onClick={onClick}
      >
        <span className="text-gray-600 text-sm">
          {PlayerPositionToShort[position]}
        </span>
        <span className="flex-1">{shortenName(player.name)}</span>
        <span className="text-gray-600">#{player.jersey_number}</span>
      </button>
    </li>
  );
}

export default function TabCompare({ matchId }: { matchId: string }) {
  const [homePlayerId, setHomePlayerId] = useState<number | null>(null);
  const [awayPlayerId, setAwayPlayerId] = useState<number | null>(null);
  const { data: homePlayerStats } = usePlayerStatsById(matchId, homePlayerId);
  const { data: awayPlayerStats } = usePlayerStatsById(matchId, awayPlayerId);

  const { data: matchTeams = [] } = useMatchTeams(matchId);

  const keys = Object.keys(homePlayerStats || {});

  return (
    <div className="flex flex-row gap-4 items-start">
      <ul className="flex-1">
        {matchTeams[0]?.players?.map(
          (player) =>
            player.is_starter && (
              <PlayerItem
                key={player.id}
                player={player}
                isActive={homePlayerId === player.id}
                onClick={() => setHomePlayerId(player.id)}
              />
            )
        )}
      </ul>
      <div className="flex-1 flex flex-col gap-2">
        {keys.map((key) => {
          return (
            <div
              key={key}
              className="flex flex-row w-full border-b border-gray-400 p-2"
            >
              <span>{homePlayerStats?.[key]}</span>
              <h2 className="flex-1 text-center">{key}</h2>
              <span>{awayPlayerStats?.[key]}</span>
            </div>
          );
        })}
      </div>
      <ul className="flex-1">
        {matchTeams[1]?.players?.map(
          (player) =>
            player.is_starter && (
              <PlayerItem
                key={player.id}
                player={player}
                isActive={awayPlayerId === player.id}
                onClick={() => setAwayPlayerId(player.id)}
                isReverse
              />
            )
        )}
      </ul>
    </div>
  );
}
