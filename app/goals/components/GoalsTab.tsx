"use client";

import { Circle, Group, Layer, Line, Stage, Text } from "react-konva";
import {
  Block,
  Carry,
  Goalkeeper,
  MatchEvent,
  Pass,
  Shot as TShot,
} from "../../types";
import { FIELD_HEIGHT, FIELD_WIDTH } from "../../matches/[matchId]/consts";
import FieldImage from "../../matches/[matchId]/components/FieldImage";
import { useState } from "react";

const scale = 8;

type TGoal = TShot & { events: MatchEvent[] };
export default function GoalsTab({ goals }: { goals: TGoal[] }) {
  const [selectedGoal, setSelectedGoal] = useState<TGoal | null>(null);

  console.log({ goals });

  return (
    <main className="w-full h-screen flex items-center justify-center">
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
          <Layer>{selectedGoal && <Goal goal={selectedGoal} />}</Layer>
        </Stage>
      </div>

      <div className="flex flex-col gap-4">
        {goals.map((goal) => {
          const isActive = goal.id === selectedGoal?.id;

          return (
            <div
              key={goal.id}
              className={`flex flex-row gap-4 hover:bg-gray-700 p-2 rounded-md cursor-pointer ${
                isActive ? "bg-gray-700" : ""
              }`}
              onClick={() =>
                setSelectedGoal((prev) => (prev?.id === goal.id ? null : goal))
              }
            >
              <span>
                {goal.team} - {goal.player}, {goal.minute}:{goal.second}
              </span>
            </div>
          );
        })}
      </div>
    </main>
  );
}

function Goal({ goal }: { goal: TShot & { events: MatchEvent[] } }) {
  return (
    <>
      {goal.events.map((event, i) => {
        const { location, player } = event;

        switch (event.type) {
          case "Pass": {
            const { recipient, end_location, angle } = (event as Pass).pass;

            return (
              <Group key={event.id}>
                <Circle
                  radius={0.5}
                  fill={"blue"}
                  opacity={0.7}
                  x={location[0]}
                  y={location[1]}
                />
                <Circle
                  radius={0.5}
                  fill={"blue"}
                  opacity={0.7}
                  x={end_location[0]}
                  y={end_location[1]}
                />
                <Line
                  points={[
                    location[0],
                    location[1],
                    end_location[0],
                    end_location[1],
                  ]}
                  stroke="white"
                  strokeWidth={0.1}
                />
              </Group>
            );
          }

          case "Carry": {
            const { end_location } = (event as Carry).carry;
            return (
              <Group key={event.id}>
                <Line
                  dash={[2, 2]}
                  points={[
                    location[0],
                    location[1],
                    end_location[0],
                    end_location[1],
                  ]}
                  stroke="white"
                  strokeWidth={0.1}
                />
              </Group>
            );
          }

          case "Shot": {
            const { end_location, outcome } = (event as TShot).shot;

            return (
              <Line
                key={event.id}
                points={[
                  location[0],
                  location[1],
                  end_location[0],
                  end_location[1],
                ]}
                stroke={outcome.name === "Goal" ? "blue" : "yellow"}
                strokeWidth={0.1}
              />
            );
          }

          case "Ball Recovery": {
            return (
              <Circle
                key={event.id}
                radius={0.5}
                fill={"yellow"}
                opacity={0.7}
                x={location[0]}
                y={location[1]}
              />
            );
          }

          case "Goal Keeper": {
            const { end_location, type } = (event as Goalkeeper).goalkeeper;

            if (!end_location) {
              return null;
            }

            return (
              <Line
                key={event.id}
                stroke={"yellow"}
                strokeWidth={0.1}
                points={[
                  location[0],
                  location[1],
                  end_location[0],
                  end_location[1],
                ]}
              />
            );
          }

          case "Block":
          case "Interception": {
            return (
              <Circle
                key={event.id}
                radius={0.5}
                fill={"red"}
                opacity={0.7}
                x={location[0]}
                y={location[1]}
              />
            );
          }

          default:
            console.log(event.type);
            return null;
        }
      })}
    </>
  );
}
