"use client";

import { Group, Layer, Stage } from "react-konva";
import { Dribble as TDribble, Lineup, Pass, Shot as TShot } from "../../../types";
import FieldImage from "../../../../components/FieldImage";
import PassComponent from "../../../../components/PassComponent";
import Player from "../../../../components/Player";
import { useState } from "react";
import Shot from "../../../../components/Shot";
import { FIELD_HEIGHT, FIELD_WIDTH } from "../consts";
import Dribble from "../../../../components/Dribble";

const scale = 8;

export default function CanvasField({
  matchInfo,
}: {
  matchInfo: {
    passes: Pass[];
    lineups: Lineup[];
    shots: TShot[];
    dribbles: TDribble[];
  };
}) {
  const { passes, lineups, shots, dribbles } = matchInfo;

  const [selectedTeam, setSelectedTeam] = useState<number>(lineups[0].team_id);
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [tab, setTab] = useState<"passes" | "shots" | "dribbles">("passes");

  const currentLineup = lineups.find((l) => l.team_id === selectedTeam);
  const passesToRender = passes.filter(
    (p) =>
      p.pass.recipient &&
      (selectedPlayer !== null
        ? p.player_id === selectedPlayer ||
          p.pass.recipient.id === selectedPlayer
        : true)
  );
  const shotsToRender = shots.filter((s) =>
    selectedPlayer !== null
      ? s.player_id === selectedPlayer
      : s.team_id === selectedTeam
  );
  const dribblesToRender = dribbles.filter((d) =>
    selectedPlayer !== null
      ? d.player_id === selectedPlayer
      : d.team_id === selectedTeam
  );

  return (
    <main className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col items-start">
        {/* Team selector */}
        <div className="flex flex-row gap-4">
          <input
            id="team1"
            type="checkbox"
            checked={selectedTeam === lineups[0].team_id}
            className="border-2 border-gray-400 rounded-md p-2"
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedTeam(lineups[0].team_id);
              }
            }}
          />
          <label htmlFor="team1">{lineups[0].team}</label>

          <input
            id="team2"
            type="checkbox"
            checked={selectedTeam === lineups[1].team_id}
            className="border-2 border-gray-400 rounded-md p-2"
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedTeam(lineups[1].team_id);
              }
            }}
          />
          <label htmlFor="team2">{lineups[1].team}</label>
        </div>

        <div className="flex flex-row gap-4">
          <Stage
            width={FIELD_WIDTH * scale}
            height={FIELD_HEIGHT * scale}
            scaleX={scale}
            scaleY={scale}
          >
            <Layer>
              <FieldImage />
            </Layer>
            {tab === "passes" && (
              <Layer>
                {passesToRender.map((pass, i) => (
                  <PassComponent
                    key={i}
                    pass={pass}
                    lineup={currentLineup!}
                    reverse={selectedTeam === lineups[1].team_id}
                  />
                ))}
                <Group>
                  {currentLineup?.tactics.lineup.map((player, i) => (
                    <Player
                      key={i}
                      {...player}
                      // reverse={selectedTeam === lineups[1].team_id}
                    />
                  ))}
                </Group>
              </Layer>
            )}
            {tab === "shots" && (
              <Layer>
                {shotsToRender.map((shot, i) => (
                  <Shot key={i} {...shot} />
                ))}
              </Layer>
            )}
            {tab === "dribbles" && (
              <Layer>
                {dribblesToRender.map((dribble, i) => (
                  <Dribble key={i} {...dribble} />
                ))}
              </Layer>
            )}
          </Stage>

          <div className="flex flex-col gap-4">
            {currentLineup?.tactics.lineup.map((l) => {
              const isActive = l.player.id === selectedPlayer;

              return (
                <div
                  key={l.player.id}
                  className={`flex flex-row gap-4 hover:bg-gray-700 p-2 rounded-md cursor-pointer ${
                    isActive ? "bg-gray-700" : ""
                  }`}
                  onClick={() =>
                    setSelectedPlayer((prev) =>
                      prev === l.player.id ? null : l.player.id
                    )
                  }
                >
                  <div>{l.jersey_number}</div>
                  <div>{l.player.name}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-row gap-4">
          <button
            className={`p-2 rounded-md ${
              tab === "passes" ? "bg-gray-700" : ""
            }`}
            onClick={() => setTab("passes")}
          >
            Passes
          </button>
          <button
            className={`p-2 rounded-md ${tab === "shots" ? "bg-gray-700" : ""}`}
            onClick={() => setTab("shots")}
          >
            Shots
          </button>
          <button
            className={`p-2 rounded-md ${
              tab === "dribbles" ? "bg-gray-700" : ""
            }`}
            onClick={() => setTab("dribbles")}
          >
            Dribbles
          </button>
          <a
            className={`p-2 rounded-md ${
              tab === "dribbles" ? "bg-gray-700" : ""
            }`}
            href="/goals"
          >
            Goals
          </a>
        </div>
      </div>
    </main>
  );
}
