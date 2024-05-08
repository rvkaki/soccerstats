"use client";

import Link from "next/link";
import { useMatches } from "./matches/[matchId]/hooks";
import { Match as TMatch } from "./types";

// Component for displaying a single match
const Match = ({ match }: { match: TMatch }) => {
  return (
    <Link
      key={match.match_id}
      href={`/matches/${match.match_id}`}
      className="flex flex-col gap-4 hover:bg-gray-300 p-2 rounded-md cursor-pointer"
      prefetch={false}
    >
      <div>
        {match.home_team.home_team_name} {match.home_score} - {match.away_score}{" "}
        {match.away_team.away_team_name}
      </div>
    </Link>
  );
};

// Component for rendering a single round of matches
const BracketRound = ({ matches }: { matches: TMatch[] }) => {
  return (
    <div className="grid grid-cols-4">
      {matches.map((match) => (
        <Match key={match.match_id} match={match} />
      ))}
    </div>
  );
};

// Bracket component for displaying elimination matches
const Bracket = ({ matches }: { matches: TMatch[] }) => {
  // Group matches by round number
  const rounds = matches.reduce((acc, match) => {
    acc[match.match_week] = [...(acc[match.match_week] || []), match];
    return acc;
  }, {} as Record<string, TMatch[]>);

  return (
    <div>
      {Object.keys(rounds).map((roundNumber) => (
        <div key={roundNumber}>
          <h3>Round {roundNumber}</h3>
          <BracketRound matches={rounds[roundNumber]} />
        </div>
      ))}
    </div>
  );
};

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
      <Bracket matches={competition!.matches} />
      {/* <ul>
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
      </ul> */}
    </main>
  );
}
