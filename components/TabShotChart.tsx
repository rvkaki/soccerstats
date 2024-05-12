import { FIELD_HEIGHT, FIELD_WIDTH } from "@/app/matches/[matchId]/consts";
import { useMatchTeams, useShotChart } from "@/app/matches/[matchId]/hooks";
import { Shot as TShot } from "@/app/types";
import FieldImage from "@/components/FieldImage";
import { shortenName } from "@/lib/utils";
import { useState } from "react";
import { Layer, Stage } from "react-konva";
import Shot from "./Shot";

const scale = 6;

export default function TabShotChart({ matchId }: { matchId: string }) {
  const { data: matchTeams = [] } = useMatchTeams(matchId);
  const { data: shotChart = [] } = useShotChart(matchId);
  const [hoveredShot, setHoveredShot] = useState<TShot | null>(null);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col lg:flex-row gap-8 relative">
        {matchTeams.map((team) => (
          <Stage
            key={team.id}
            width={FIELD_WIDTH * scale}
            height={(FIELD_HEIGHT * scale) / 2}
            scaleX={scale}
            scaleY={scale}
          >
            <Layer>
              <FieldImage />
            </Layer>
            <Layer name="shots">
              {shotChart.map((shot) => {
                if (shot.possession_team.id !== team.id) return null;

                return (
                  <Shot
                    key={shot.id}
                    startPosition={shot.location}
                    outcome={shot.shot.outcome.name}
                    xg={shot.shot.statsbomb_xg}
                    onMouseOver={() => setHoveredShot(shot)}
                    onMouseOut={() => setHoveredShot(null)}
                  />
                );
              })}
            </Layer>
          </Stage>
        ))}

        {hoveredShot && (
          <div
            className="absolute bg-white p-2 rounded shadow-lg flex flex-col items-start gap-2 text-sm"
            style={{
              top: hoveredShot.location[1] * scale + 10,
              left:
                hoveredShot.team.name === matchTeams[0].name
                  ? hoveredShot.location[0] * scale + 10
                  : hoveredShot.location[0] * scale + 10 + FIELD_WIDTH * scale,
            }}
          >
            <div className="flex flex-row w-full justify-between gap-6">
              <span className="font-bold">
                {shortenName(hoveredShot.player.name)}
              </span>
              <span className="font-bold">
                {hoveredShot.minute}&apos;{hoveredShot.second}
              </span>
            </div>

            <div>
              <span className="font-bold">Outcome: </span>
              {hoveredShot.shot.outcome.name}
            </div>
            <div>
              <span className="font-bold">Type: </span>
              {hoveredShot.shot.type.name}
            </div>
            <div>
              <span className="font-bold">XG: </span>
              {hoveredShot.shot.statsbomb_xg.toFixed(2)}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-row gap-4">
        <div className="flex flex-row gap-2 items-center">
          <div className="w-4 h-4 bg-blue-500 rounded-full" />
          <span>Goal</span>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <div className="w-4 h-4 bg-red-500 rounded-full" />
          <span>Missed</span>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <div className="w-4 h-4 bg-yellow-400 rounded-full" />
          <span>Saved/Blocked</span>
        </div>
      </div>
    </div>
  );
}
