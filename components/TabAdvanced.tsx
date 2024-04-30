import {
  FIELD_HEIGHT,
  FIELD_WIDTH,
  adjustLocation,
} from "@/app/matches/[matchId]/consts";
import { useMatchEvents, useMatchTeams } from "@/app/matches/[matchId]/hooks";
import { shortenName } from "@/lib/utils";
import { useState } from "react";
import { Circle, Layer, Line, Stage } from "react-konva";
import FieldImage from "./FieldImage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { EventType, EventTypeToLabel } from "@/lib/consts";
import Pass from "./Pass";
import Carry from "./Carry";
import Shot from "./Shot";
import Dribble from "./Dribble";

const scale = 4;

export default function TabAdvanced({ matchId }: { matchId: string }) {
  const [homePlayerId, setHomePlayerId] = useState<number | null>(null);
  const [awayPlayerId, setAwayPlayerId] = useState<number | null>(null);
  const [stat, setStat] = useState<EventType>("passes");
  const { data: matchTeams = [] } = useMatchTeams(matchId);
  const { data: events } = useMatchEvents(matchId);

  const homeTeamId = matchTeams[0]?.id;
  const awayTeamId = matchTeams[1]?.id;

  const homeEventsToDisplay =
    events?.[stat]?.filter((e) => {
      if (e.team_id !== homeTeamId) return false;
      if (homePlayerId === null) return true;
      return e.player_id === homePlayerId;
    }) || [];

  const awayEventsToDisplay =
    events?.[stat]?.filter((e) => {
      if (e.team_id !== awayTeamId) return false;
      if (awayPlayerId === null) return true;
      return e.player_id === awayPlayerId;
    }) || [];

  return (
    <div className="flex flex-row gap-4 items-start">
      <ul className="flex-1">
        <li
          className="w-full border-b p-2"
          style={{
            backgroundColor: homePlayerId === null ? "#e5e7eb" : "white",
          }}
        >
          <button
            className="w-full text-start"
            onClick={() => setHomePlayerId(null)}
          >
            {matchTeams[0]?.name}
          </button>
        </li>
        {matchTeams[0]?.players?.map(
          (player) =>
            player.is_starter && (
              <li
                key={player.id}
                className="w-full border-b p-2"
                style={{
                  backgroundColor:
                    homePlayerId === player.id ? "#e5e7eb" : "white",
                }}
              >
                <button
                  className="w-full text-start"
                  onClick={() => setHomePlayerId(player.id)}
                >
                  {shortenName(player.name)}
                </button>
              </li>
            )
        )}
      </ul>
      <div className="flex-1 flex flex-col gap-2">
        {events && (
          <Select value={stat} onValueChange={(v) => setStat(v as EventType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select stat" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(events)
                .filter(
                  (k) =>
                    ![
                      "ball_receipts",
                      "foul_wons",
                      "goal_keepers",
                      "injury_stoppages",
                      "offsides",
                      "shields",
                      "bad_behaviours",
                      "referee_ball_drops",
                    ].includes(k)
                )
                .map((key) => (
                  <SelectItem key={key} value={key}>
                    {EventTypeToLabel[key as EventType]}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}
        <div className="flex-1 flex flex-row gap-2">
          {/* Home Team */}
          <Stage
            key={matchTeams[0]?.id}
            width={FIELD_WIDTH * scale}
            height={FIELD_HEIGHT * scale}
            scaleX={scale}
            scaleY={scale}
          >
            <Layer>
              <FieldImage />
            </Layer>
            <Layer>
              {homeEventsToDisplay.map((event) => {
                return <EventItem key={event.id} event={event} stat={stat} />;
              })}
            </Layer>
          </Stage>
          {/* Away Team */}
          <Stage
            key={matchTeams[1]?.id}
            width={FIELD_WIDTH * scale}
            height={FIELD_HEIGHT * scale}
            scaleX={scale}
            scaleY={scale}
          >
            <Layer>
              <FieldImage />
            </Layer>
            <Layer>
              {awayEventsToDisplay.map((event) => {
                return <EventItem key={event.id} event={event} stat={stat} />;
              })}
            </Layer>
          </Stage>
        </div>
      </div>
      <ul className="flex-1">
        <li
          className="w-full border-b p-2"
          style={{
            backgroundColor: awayPlayerId === null ? "#e5e7eb" : "white",
          }}
        >
          <button
            className="w-full text-end"
            onClick={() => setAwayPlayerId(null)}
          >
            {matchTeams[1]?.name}
          </button>
        </li>
        {matchTeams[1]?.players?.map(
          (player) =>
            player.is_starter && (
              <li
                key={player.id}
                className="w-full border-b p-2"
                style={{
                  backgroundColor:
                    awayPlayerId === player.id ? "#e5e7eb" : "white",
                }}
              >
                <button
                  className="w-full text-end"
                  onClick={() => setAwayPlayerId(player.id)}
                >
                  {shortenName(player.name)}
                </button>
              </li>
            )
        )}
      </ul>
    </div>
  );
}

function EventItem({
  event,
  stat,
}: {
  event: Record<string, any>;
  stat: EventType;
}) {
  const location = adjustLocation(event.location);

  switch (stat) {
    case "passes":
      return (
        <Pass
          key={event.id}
          startPosition={location}
          endPosition={adjustLocation(event.pass_end_location.slice(0, 2))}
        />
      );
    case "carrys":
      console.log(event);
      return (
        <Carry
          key={event.id}
          startPosition={location}
          endPosition={adjustLocation(event.carry_end_location.slice(0, 2))}
        />
      );
    case "shots":
      return (
        <Shot
          key={event.id}
          startPosition={location}
          endPosition={adjustLocation(event.shot_end_location.slice(0, 2))}
          outcome={event.shot_outcome}
        />
      );
    case "dribbles":
      return (
        <Dribble
          key={event.id}
          location={location}
          outcome={event.dribble_outcome}
        />
      );
  }

  let radius = 0.8;
  if (stat === "pressures") {
    radius = 0.8 + 1 * event.duration;
  }

  let color = "black";
  if (stat === "ball_recoverys") {
    color = event.ball_recovery_recovery_failure ? "red" : "blue";
  } else if (stat === "foul_committeds" && event.foul_committed_card) {
    color = event.foul_committed_card === "Yellow Card" ? "yellow" : "red";
  } else if (stat === "duels") {
    if (["Lost In Play", "Lost Out", null].includes(event.duel_outcome)) {
      color = "red";
    } else {
      color = "blue";
    }
  } else if (stat === "interceptions") {
    if (
      ["Lost", "Lost In Play", "Lost Out", null].includes(
        event.interception_outcome
      )
    ) {
      color = "red";
    } else {
      color = "blue";
    }
  } else if (stat === "50/50s") {
    if (
      ["Lost", "Success To Opposition"].includes(event["50_50"].outcome.name)
    ) {
      color = "red";
    } else {
      color = "blue";
    }
  }

  return (
    <Circle
      key={event.id}
      x={location[0]}
      y={location[1]}
      radius={radius}
      fill={color}
      opacity={0.8}
    />
  );
}
