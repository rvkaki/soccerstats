"use client";

import { useMatchInfo, useMatchTeams } from "@/lib/hooks";
import dynamic from "next/dynamic";
const CanvasContent = dynamic(() => import("./_components/CanvasContent"), {
  ssr: false,
});

export default function Page({
  params: { competitionId, seasonId, matchId },
}: {
  params: {
    competitionId: number;
    seasonId: number;
    matchId: string;
  };
  searchParams: URLSearchParams;
}) {
  const { data: matchInfo } = useMatchInfo({
    competitionId,
    seasonId,
    matchId,
  });
  const { data: matchTeams = [] } = useMatchTeams({
    competitionId,
    seasonId,
    matchId,
  });

  if (!matchInfo || !matchTeams.length) {
    return null;
  }

  return (
    <main className="w-full h-screen flex flex-col items-center gap-24 p-8 mx-auto text-white">
      <header className="flex flex-row w-full items-center gap-12 text-white max-w-lg">
        <div className="flex-1 flex flex-row items-center justify-between">
          <h1 className="text-xl font-bold">
            {matchInfo.home_team.home_team_name}
          </h1>
          <h2 className="text-3xl font-bold">{matchInfo.home_score}</h2>
        </div>
        <div className="flex flex-col items-center">
          <h3>{matchInfo.match_date}</h3>

          <h4 className="text-sm text-neutral-400 leading-none pt-2">
            {matchInfo.competition_stage.name}
          </h4>
          <h4 className="font-bold">
            {matchInfo.competition.competition_name}
          </h4>
        </div>
        <div className="flex-1 flex flex-row items-center justify-between">
          <h2 className="text-2xl font-bold">{matchInfo.away_score}</h2>
          <h1 className="text-xl font-bold">
            {matchInfo.away_team.away_team_name}
          </h1>
        </div>
      </header>

      <CanvasContent matchInfo={matchInfo} matchTeams={matchTeams} />
    </main>
  );
}
