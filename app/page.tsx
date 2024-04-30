"use client";

import Link from "next/link";
import { useMatches } from "./matches/[matchId]/hooks";

export default function Home() {
  const { data: competition, isLoading } = useMatches();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <h1>
        {competition!.competition.competition_name}{" "}
        {competition!.competition.season_name}
      </h1>
      <ul>
        {competition!.matches.map((match) => (
          <Link
            key={match.match_id}
            href={`/matches/${match.match_id}`}
            className="flex flex-col gap-4 hover:bg-gray-700 p-2 rounded-md cursor-pointer"
            prefetch={false}
          >
            <li>
              {match.match_date}: {match.home_team} {match.home_score} -{" "}
              {match.away_score} {match.away_team}
            </li>
          </Link>
        ))}
      </ul>
    </main>
  );
}
