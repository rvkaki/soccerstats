import Link from "next/link";
import { Competition } from "./types";

export default async function Home() {
  const competitions = await fetch(
    "http://localhost:3000/api/competitions"
  ).then(async (res) => {
    return (await res.json()) as Competition[];
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {competitions.map((competition) => (
        <Link
          key={competition.competition_id}
          className="flex flex-col gap-4 hover:bg-gray-700 p-2 rounded-md cursor-pointer"
          href={`/competitions/${competition.competition_id}/${competition.season_id}`}
        >
          <span>
            {competition.competition_name} {competition.season_name}
          </span>
        </Link>
      ))}
    </main>
  );
}
