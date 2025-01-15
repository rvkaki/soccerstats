"use client";

import Link from "next/link";

import { Match as TMatch } from "@/app/types";
import { useMatches } from "@/lib/hooks";
import { Skeleton } from "@/components/ui/skeleton";

// Component for displaying a single match
const Match = ({ match }: { match: TMatch }) => {
  return (
    <Link
      key={match.match_id}
      href={`/competitions/${match.competition.competition_id}/season/${match.season.season_id}/matches/${match.match_id}`}
      className="bg-neutral-900 rounded-md border border-neutral-800 p-5 cursor-pointer hover:bg-neutral-800 h-full flex items-center text-neutral-100 hover:text-white"
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
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
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
    acc[match.competition_stage.name] = [
      ...(acc[match.competition_stage.name] || []),
      match,
    ];
    return acc;
  }, {} as Record<string, TMatch[]>);

  const roundsOrder = [
    "Group Stage",
    "Round of 16",
    "Quarter-finals",
    "Semi-finals",
    "3rd Place Final",
    "Final",
  ];

  return (
    <div className="flex flex-col gap-12">
      {Object.keys(rounds)
        .sort((a, b) => roundsOrder.indexOf(a) - roundsOrder.indexOf(b))
        .map((roundName) => (
          <div key={roundName}>
            <h3 className="text-2xl font-bold">{roundName}</h3>
            <BracketRound matches={rounds[roundName]} />
          </div>
        ))}
    </div>
  );
};

export default function Home({
  params: { competitionId, seasonId },
}: {
  params: {
    competitionId: number;
    seasonId: number;
  };
}) {
  const { data: competition, isLoading } = useMatches({
    competitionId,
    seasonId,
  });

  if (isLoading) {
    return (
      <main className="w-full h-screen flex flex-col items-center max-w-6xl gap-24 p-8 mx-auto">
        <Skeleton className="h-9 w-[400px]" />
        <div className="w-full flex flex-col gap-2 items-start">
          <Skeleton className="h-8 w-[200px]" />
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 w-full">
            {new Array(8).fill(null).map((_, idx) => (
              <div key={idx}>
                <div className="bg-neutral-900 rounded-md border border-neutral-800 p-5 cursor-pointer hover:bg-neutral-800 h-[90px] flex items-center text-neutral-100 hover:text-white">
                  <Skeleton className="h-7 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full h-screen flex flex-col items-center max-w-6xl gap-24 p-8 mx-auto">
      <h1 className="text-3xl font-bold">
        {competition!.competition.competition_name}{" "}
        {competition!.competition.season_name}
      </h1>
      <Bracket matches={competition!.matches} />
    </main>
  );
}
