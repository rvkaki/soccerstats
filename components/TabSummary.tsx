import {
  useMatchInfo,
  useMatchSummary,
  useMatchTeams,
} from "@/app/matches/[matchId]/hooks";

export default function TabSummary({ matchId }: { matchId: string }) {
  const { data: summary } = useMatchSummary(matchId);
  const { data: matchTeams = [] } = useMatchTeams(matchId);
  const { data: matchInfo } = useMatchInfo(matchId);

  if (!summary) {
    return <div>Loading...</div>;
  }

  const homeTeam = matchTeams.find(
    (team) => team.name === matchInfo?.home_team
  );
  const awayTeam = matchTeams.find(
    (team) => team.name === matchInfo?.away_team
  );

  if (!homeTeam || !awayTeam) {
    return <div>Teams not found</div>;
  }

  const keys = Object.keys(
    summary[homeTeam.id]
  ) as (keyof (typeof summary)[0])[];

  return (
    <div className="flex flex-col gap-2">
      {keys.map((key) => {
        return (
          <div
            key={key}
            className="flex flex-row w-full border-b border-gray-400 p-2 max-w-xl"
          >
            <span>{summary[homeTeam.id][key]}</span>
            <h2 className="flex-1 text-center">{key}</h2>
            <span>{summary[awayTeam.id][key]}</span>
          </div>
        );
      })}
    </div>
  );
}
