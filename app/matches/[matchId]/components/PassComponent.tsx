import { Line } from "react-konva";
import { Lineup, Pass as TPass } from "../../../types";
import { PlayerPositionToLocation, reverseLocation } from "../consts";

export default function PassComponent({
  pass,
  lineup,
  reverse,
}: {
  pass: TPass;
  lineup: Lineup;
  reverse?: boolean;
}) {
  const passer = lineup.tactics.lineup.find(
    (player) => player.player.id === pass.player_id
  );
  const recipient = lineup.tactics.lineup.find(
    (player) => player.player.id === pass.pass.recipient.id
  );

  if (!passer || !recipient) {
    return null;
  }

  const startLocation = reverse
    ? reverseLocation(PlayerPositionToLocation[passer.position.name])
    : PlayerPositionToLocation[passer.position.name];
  const endLocation = reverse
    ? reverseLocation(PlayerPositionToLocation[recipient.position.name])
    : PlayerPositionToLocation[recipient.position.name];

  return (
    <Line
      points={[
        startLocation[0],
        startLocation[1],
        endLocation[0],
        endLocation[1],
      ]}
      stroke="white"
      opacity={0.1}
      strokeWidth={0.2}
    />
  );
}
