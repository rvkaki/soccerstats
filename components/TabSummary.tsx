import { useMatchSummary } from "@/app/matches/[matchId]/hooks";

export default function TabSummary({ matchId }: { matchId: string }) {
  const { data: summary } = useMatchSummary(matchId);

  if (!summary) {
    return <div>Loading...</div>;
  }

  const [homeTeam, awayTeam] = Object.keys(summary);
  const keys = Object.keys(summary[homeTeam]) as (keyof (typeof summary)[0])[];

  return (
    <div className="flex flex-col gap-2">
      {keys.map((key) => {
        return (
          <div
            key={key}
            className="flex flex-row w-full border-b border-gray-400 p-2 max-w-xl"
          >
            <span>{summary[homeTeam][key]}</span>
            <h2 className="flex-1 text-center">{key}</h2>
            <span>{summary[awayTeam][key]}</span>
          </div>
        );
      })}
    </div>
  );
}
