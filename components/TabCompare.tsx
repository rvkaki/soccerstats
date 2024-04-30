import {
  useMatchTeams,
  usePlayerStatsByJerseyNumber,
} from "@/app/matches/[matchId]/hooks";
import { PlayerStatToLabel } from "@/lib/consts";
import { shortenName } from "@/lib/utils";
import { useState } from "react";

export default function TabCompare({
  matchId,
  homeTeam,
  awayTeam,
}: {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
}) {
  const [homePlayerNumber, setHomePlayerNumber] = useState<number | null>(null);
  const [awayPlayerNumber, setAwayPlayerNumber] = useState<number | null>(null);
  const { data: homePlayerStats } = usePlayerStatsByJerseyNumber(
    matchId,
    homeTeam,
    homePlayerNumber
  );
  const { data: awayPlayerStats } = usePlayerStatsByJerseyNumber(
    matchId,
    awayTeam,
    awayPlayerNumber
  );

  const { data: matchTeams = [] } = useMatchTeams(matchId);

  const keys = Object.keys(homePlayerStats || {});

  return (
    <div className="flex flex-row gap-4 items-start">
      <ul className="flex-1">
        {matchTeams[0]?.players?.map(
          (player) =>
            player.is_starter && (
              <li
                key={player.id}
                className="w-full border-b p-2"
                style={{
                  backgroundColor:
                    homePlayerNumber === player.jersey_number
                      ? "#e5e7eb"
                      : "white",
                }}
              >
                <button
                  className="w-full text-start"
                  onClick={() => setHomePlayerNumber(player.jersey_number!)}
                >
                  {shortenName(player.name)}
                </button>
              </li>
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
              <h2 className="flex-1 text-center">{PlayerStatToLabel[key]}</h2>
              <span>{awayPlayerStats?.[key]}</span>
            </div>
          );
        })}
      </div>
      <ul className="flex-1">
        {matchTeams[1]?.players?.map(
          (player) =>
            player.is_starter && (
              <li
                key={player.id}
                className="w-full border-b p-2"
                style={{
                  backgroundColor:
                    awayPlayerNumber === player.jersey_number
                      ? "#e5e7eb"
                      : "white",
                }}
              >
                <button
                  className="w-full text-end"
                  onClick={() => setAwayPlayerNumber(player.jersey_number!)}
                >
                  {shortenName(player.name)}
                </button>
              </li>
            )
        )}
      </ul>
    </div>
  );
}
