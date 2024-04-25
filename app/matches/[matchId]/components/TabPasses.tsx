import { Layer, Stage } from "react-konva";
import { FIELD_HEIGHT, FIELD_WIDTH, adjustLocation } from "../consts";
import { useMatchPassTendencies, useMatchTeams } from "../hooks";
import FieldImage from "./FieldImage";
import Pass from "./Pass";
import Player from "./Player";

const scale = 6;

function shortenName(name: string) {
  const first = name.split(" ")[0];
  const last = name.split(" ").at(-1);
  return `${first[0]}. ${last}`;
}

export default function TabPasses({ matchId }: { matchId: string }) {
  const matchTeams = useMatchTeams(matchId);
  const passTendencies = useMatchPassTendencies(matchId);

  const maxPasses = Math.max(
    ...Object.values(passTendencies).flatMap((player) =>
      Object.values(player.passes)
    )
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {matchTeams.map((team, i) => {
        const tendencies: {
          from: number;
          to: number;
          count: number;
        }[] = [];

        Object.entries(passTendencies).forEach(([playerId, playerData]) => {
          if (team.players.find((p) => p.id === parseInt(playerId))) {
            Object.entries(playerData.passes).forEach(
              ([recipientId, count]) => {
                if (team.players.find((p) => p.id === parseInt(recipientId))) {
                  tendencies.push({
                    from: parseInt(playerId),
                    to: parseInt(recipientId),
                    count,
                  });
                }
              }
            );
          }
        });

        const topTendencies = tendencies
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        return (
          <div key={team.id} className="flex flex-col gap-4 items-start">
            <Stage
              width={FIELD_WIDTH * scale}
              height={FIELD_HEIGHT * scale}
              scaleX={scale}
              scaleY={scale}
            >
              <Layer name={team.name}>
                <FieldImage />
                {tendencies.map((tendency, i) => {
                  const passerPosition =
                    passTendencies[tendency.from].avg_position;
                  const recipientPosition =
                    passTendencies[tendency.to].avg_position;

                  return (
                    <Pass
                      key={`passes_from_${tendency.from}_to_${tendency.to}`}
                      startPosition={adjustLocation(passerPosition)}
                      endPosition={adjustLocation(recipientPosition)}
                      strokeWidth={Math.min(1, tendency.count / maxPasses)}
                      opacity={Math.min(1, tendency.count / maxPasses)}
                    />
                  );
                })}
                {/* {passTendencies &&
                    team.players.map((player) => {
                      const playerData = passTendencies[player.id];
                      if (!playerData) return null;
                      return Object.entries(playerData.passes).map(
                        ([recipientId, count]) => {
                          const recipientData =
                            passTendencies[parseInt(recipientId)];
                          return (
                            <Pass
                              key={`passes_from_${player.id}_to_${recipientId}`}
                              startPosition={adjustLocation(
                                playerData.avg_position
                              )}
                              endPosition={adjustLocation(
                                recipientData.avg_position
                              )}
                              strokeWidth={Math.min(1, count / maxPasses)}
                              opacity={Math.min(1, count / maxPasses)}
                            />
                          );
                        }
                      );
                    })} */}

                {/* Players' average positions */}
                {team.players.map((player) => {
                  const tendencies = passTendencies[player.id];
                  if (!tendencies) return null;

                  return (
                    <Player
                      key={player.id}
                      {...player}
                      location={adjustLocation(tendencies.avg_position)}
                      color={i === 0 ? "blue" : "red"}
                    />
                  );
                })}
              </Layer>
            </Stage>
            {/* Top 5 pass tendencies for each team */}
            <div
              className="flex flex-row justify-between"
              style={{ gap: scale * 16 }}
            >
              <div
                key={team.id}
                className="flex flex-col flex-grow gap-4 items-start"
              >
                <h2>{team.name}</h2>
                <ul>
                  {topTendencies.map((tendency, i) => {
                    const fromPlayer = team.players.find(
                      (p) => p.id === tendency.from
                    );
                    const toPlayer = team.players.find(
                      (p) => p.id === tendency.to
                    );

                    return (
                      <li key={i}>
                        {shortenName(fromPlayer!.name)} to{" "}
                        {shortenName(toPlayer!.name)}: {tendency.count}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
