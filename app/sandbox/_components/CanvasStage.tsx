"use client";

import {
  adjustLocation,
  FIELD_HEIGHT,
  FIELD_WIDTH,
} from "@/app/competitions/[competitionId]/season/[seasonId]/matches/[matchId]/consts";
import { Location } from "@/app/types";
import FieldImage from "@/components/FieldImage";
import Pass from "@/components/Pass";
import Player from "@/components/Player";
import { useMatchPlayerActions, useMatchTeams } from "@/lib/hooks";
import { Circle, Group, Layer, Line, Stage, Text } from "react-konva";

const scale = 6;

type PlayerAction = NonNullable<
  ReturnType<typeof useMatchPlayerActions>["data"]
>[number];
type Event360 = PlayerAction["event360"];
type Action = Omit<PlayerAction, "event360">;
type TPlayer = NonNullable<
  ReturnType<typeof useMatchTeams>["data"]
>[number]["players"][number];

export default function CanvasStage({
  action,
  player,
  event360,
}: {
  action: Action;
  player: TPlayer;
  event360: Event360;
}) {
  return (
    <Stage
      width={FIELD_WIDTH * scale}
      height={FIELD_HEIGHT * scale}
      scaleX={scale}
      scaleY={scale}
    >
      <Layer>
        <FieldImage />

        <Player
          location={adjustLocation(action.location)}
          {...player}
          color="blue"
        />

        <Pass
          startPosition={adjustLocation(action.location)}
          endPosition={adjustLocation((action as any).pass.end_location)}
          strokeWidth={0.3}
          opacity={1}
        />

        <Group
          x={adjustLocation((action as any).pass.end_location)[0]}
          y={adjustLocation((action as any).pass.end_location)[1]}
        >
          <Circle
            radius={1}
            fill={(action as any).pass.recipient ? "blue" : "red"}
            opacity={0.4}
            stroke={(action as any).pass.recipient ? "blue" : "red"}
            strokeWidth={0.1}
          />
          <Text
            text={`${(action as any).pass.end_location[0].toFixed(0)}, ${(
              action as any
            ).pass.end_location[1].toFixed(0)}`}
            fontSize={2}
            x={-1}
            y={-3}
            fill="white"
          />
        </Group>
      </Layer>
      <Event360Details
        event360={event360}
        passLine={[action.location, (action as any).pass.end_location]}
      />
    </Stage>
  );
}

function Event360Details({
  event360,
  passLine,
}: {
  event360: PlayerAction["event360"];
  passLine: [Location, Location];
}) {
  const adjustedVisibleArea: number[] = [];
  // Group visible area points into pairs
  for (let i = 0; i < event360.visible_area.length; i += 2) {
    adjustedVisibleArea.push(
      ...adjustLocation([
        event360!.visible_area[i],
        event360!.visible_area[i + 1],
      ])
    );
  }

  // Try to find opponent team lines
  const opponents = event360.freeze_frame.filter((frame) => !frame.teammate);
  function findLines() {
    // Build an undirected graph connecting all the opponents that are in a 6 meter distance (x-axis) from each other
    // Edges are weighted by the distance (y-axis) between the two opponents
    const MAX_X_DISTANCE = 6;

    const graph = new Map<number, Map<number, number>>();
    for (let i = 0; i < opponents.length; i++) {
      for (let j = i + 1; j < opponents.length; j++) {
        const xDistance = Math.abs(
          opponents[i].location[0] - opponents[j].location[0]
        );
        const yDistance = Math.abs(
          opponents[i].location[1] - opponents[j].location[1]
        );
        if (xDistance < MAX_X_DISTANCE) {
          if (!graph.has(i)) {
            graph.set(i, new Map());
          }
          if (!graph.has(j)) {
            graph.set(j, new Map());
          }

          graph.get(i)!.set(j, yDistance);
          graph.get(j)!.set(i, yDistance);
        }
      }
    }
    const nodes = new Set(graph.keys());

    function difference<T>(set: Set<T>, otherSet: Set<T>) {
      let result = new Set<T>(set);
      otherSet.forEach((value) => {
        result.delete(value);
      });
      return result;
    }

    function intersection<T>(set: Set<T>, otherSet: Set<T>) {
      let result = new Set<T>();
      otherSet.forEach((value) => {
        if (set.has(value)) {
          result.add(value);
        }
      });
      return result;
    }

    function union<T>(set: Set<T>, otherSet: Set<T>) {
      let result = new Set<T>();
      otherSet.forEach((value) => {
        if (set.has(value)) {
          result.add(value);
        }
      });
      return result;
    }

    function bronKerbosch() {
      let cliques: number[][] = [];
      let f = (
        clique: Set<number>,
        candidates: Set<number>,
        excludedCandidates: Set<number>
      ) => {
        if (!candidates.size && !excludedCandidates.size) {
          cliques.push(Array.from(clique));
        }
        let pivotNeighbors = new Set<number>();
        union(candidates, excludedCandidates).forEach((candidate) => {
          let t = intersection(
            new Set(graph.get(candidate)?.keys()),
            candidates
          );
          if (t.size > pivotNeighbors.size) {
            pivotNeighbors = t;
          }
        });
        difference(candidates, pivotNeighbors).forEach((candidate) => {
          let candidateNeighbors = new Set(graph.get(candidate)?.keys());
          f(
            new Set(clique).add(candidate),
            intersection(candidates, candidateNeighbors),
            intersection(excludedCandidates, candidateNeighbors)
          );
          candidates.delete(candidate);
          excludedCandidates.add(candidate);
        });
      };
      f(new Set(), nodes, new Set());
      return cliques;
    }

    let allCliques = bronKerbosch().sort((a, b) => b.length - a.length);
    const lines: number[][] = [];
    const included = new Set<number>();
    while (allCliques.length) {
      const clique = allCliques.shift()!;
      if (clique.every((i) => !included.has(i))) {
        lines.push(clique);
        clique.forEach((i) => included.add(i));
      }
    }

    return lines.map((line) =>
      line.map((i) => opponents[i].location).sort((a, b) => a[1] - b[1])
    );
  }

  const lines = findLines();

  function isLineBreakingPass() {
    function linesIntersect(
      line1: [Location, Location],
      line2: [Location, Location]
    ) {
      const [p1, q1] = line1;
      const [p2, q2] = line2;

      function orientation(p: Location, q: Location, r: Location): number {
        const val =
          (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
        if (val === 0) return 0; // collinear
        return val > 0 ? 1 : 2; // clockwise or counterclockwise
      }

      function onSegment(p: Location, q: Location, r: Location): boolean {
        return (
          q[0] <= Math.max(p[0], r[0]) &&
          q[0] >= Math.min(p[0], r[0]) &&
          q[1] <= Math.max(p[1], r[1]) &&
          q[1] >= Math.min(p[1], r[1])
        );
      }

      const o1 = orientation(p1, q1, p2);
      const o2 = orientation(p1, q1, q2);
      const o3 = orientation(p2, q2, p1);
      const o4 = orientation(p2, q2, q1);

      // General case
      if (o1 !== o2 && o3 !== o4) return true;

      // Special Cases
      // p1, q1 and p2 are collinear and p2 lies on segment p1q1
      if (o1 === 0 && onSegment(p1, p2, q1)) return true;

      // p1, q1 and q2 are collinear and q2 lies on segment p1q1
      if (o2 === 0 && onSegment(p1, q2, q1)) return true;

      // p2, q2 and p1 are collinear and p1 lies on segment p2q2
      if (o3 === 0 && onSegment(p2, p1, q2)) return true;

      // p2, q2 and q1 are collinear and q1 lies on segment p2q2
      if (o4 === 0 && onSegment(p2, q1, q2)) return true;

      // Doesn't fall in any of the above cases
      return false;
    }

    // Check if the pass is breaking a line
    // A pass is breaking a line if the pass end location is between the opponents that are forming a line
    const intersect = lines.some((line) => {
      const start = line[0];
      const end = line.at(-1)!;
      return linesIntersect([start, end], passLine);
    });

    const goal_location = [120, 40];
    const startDistanceToGoal = Math.sqrt(
      Math.pow(passLine[0][0] - goal_location[0], 2) +
        Math.pow(passLine[0][1] - goal_location[1], 2)
    );
    const endDistanceToGoal = Math.sqrt(
      Math.pow(passLine[1][0] - goal_location[0], 2) +
        Math.pow(passLine[1][1] - goal_location[1], 2)
    );

    // Advances the ball at least 10% towards the goal
    const advancesTowardsGoal =
      startDistanceToGoal - endDistanceToGoal > 0.1 * startDistanceToGoal;

    return intersect && advancesTowardsGoal;
  }

  console.log({ isLineBreakingPass: isLineBreakingPass() });

  return (
    <Layer name={event360.event_uuid + "_360"}>
      {/* <Line points={adjustedVisibleArea} stroke="red" strokeWidth={0.1} /> */}
      <Group name="opponent lines">
        {lines.map((line, idx) => {
          const points = line.map((loc) => adjustLocation(loc)).flat();

          return (
            <Line key={idx} points={points} stroke="white" strokeWidth={0.1} />
          );
        })}
      </Group>

      <Group name="player positions">
        {event360.freeze_frame.map((frame, idx) => {
          const color = frame.teammate ? "blue" : "red";
          const location = adjustLocation(frame.location);

          return (
            <Group key={idx} x={location[0]} y={location[1]}>
              <Circle
                key={idx}
                radius={1}
                fill={color}
                opacity={0.7}
                stroke={color}
                strokeWidth={0.1}
              />
              {!frame.teammate && (
                <Text
                  text={`${frame.location[0].toFixed(
                    0
                  )}, ${frame.location[1].toFixed(0)}`}
                  fontSize={2}
                  x={-0.5}
                  y={-1}
                  fill="white"
                />
              )}
            </Group>
          );
        })}
      </Group>
    </Layer>
  );
}
