import Link from "next/link";
import { Competition, Match } from "./types";
import { Metadata } from "next";

export default async function Home() {
  const competition = await fetch(`http://localhost:3000/api/matches`).then(
    async (res) => {
      const data = await res.json();
      return data as { competition: Competition; matches: Match[] };
    }
  );

  return (
    <main>
      <h1>
        {competition.competition.competition_name}{" "}
        {competition.competition.season_name}
      </h1>
      <ul>
        {competition.matches.map((match) => (
          <Link
            key={match.match_id}
            href={`/matches/${match.match_id}`}
            className="flex flex-col gap-4 hover:bg-gray-700 p-2 rounded-md cursor-pointer"
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

type Props = {
  params: { competitionId: number; seasonId: number };
  searchParams: URLSearchParams;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // fetch data
  const competition = await fetch(`http://localhost:3000/api/matches`).then(
    async (res) => {
      const data = await res.json();
      return data as { competition: Competition; matches: Match[] };
    }
  );

  const title = `${competition.competition.competition_name} ${competition.competition.season_name}`;
  return {
    title,
  };
}
