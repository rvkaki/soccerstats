"use client";

import { useCompetitions } from "@/lib/hooks";
import Link from "next/link";

export default function Home() {
  const { data: competitions = [], isLoading } = useCompetitions();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="w-full h-screen grid grid-cols-3 max-w-6xl gap-6 p-8 my-12 mx-auto">
      {competitions.map((competition) => (
        <Link
          key={competition.competition_id}
          href={`/competitions/${competition.competition_id}/season/${competition.season_id}/matches`}
        >
          <div className="bg-neutral-900 rounded-md border border-neutral-800 p-5 cursor-pointer hover:bg-neutral-800 h-full flex items-center text-neutral-100 hover:text-white">
            <p className="text-lg">
              {competition.competition_name} {competition.season_name}
            </p>
          </div>
        </Link>
      ))}
    </main>
  );
}
