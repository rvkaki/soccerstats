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
  const [stat, setStat] = useState<EventType>("Pass");
  const { data: matchTeams = [] } = useMatchTeams(matchId);
  const { data: events } = useMatchEvents(matchId);

  const homeTeamId = matchTeams[0]?.id;
  const awayTeamId = matchTeams[1]?.id;

  const homeEventsToDisplay =
    events?.[stat]?.filter((e) => {
      if (e.team.id !== homeTeamId) return false;
      if (homePlayerId === null) return true;
      return e.player_id === homePlayerId;
    }) || [];

  const awayEventsToDisplay =
    events?.[stat]?.filter((e) => {
      if (e.team.id !== awayTeamId) return false;
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
                      "Starting XI",
                      "Half Start",
                      "Half End",
                      "Player Off",
                      "Player On",
                      "Substitution",
                      "Tactical Shift",
                      "Referee Ball-Drop",
                      "Injury Stoppage",
                      "Bad Behaviour",
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
    case "Pass":
      return (
        <Pass
          key={event.id}
          startPosition={location}
          endPosition={adjustLocation(event.pass.end_location.slice(0, 2))}
        />
      );
    case "Carry":
      return (
        <Carry
          key={event.id}
          startPosition={location}
          endPosition={adjustLocation(event.carry.end_location.slice(0, 2))}
        />
      );
    case "Shot":
      return (
        <Shot
          key={event.id}
          startPosition={location}
          endPosition={adjustLocation(event.shot.end_location.slice(0, 2))}
          outcome={event.shot.outcome.name}
        />
      );
    case "Dribble":
      return (
        <Dribble
          key={event.id}
          location={location}
          outcome={event.dribble.outcome.name}
        />
      );
  }

  let radius = 0.8;
  if (stat === "Pressure") {
    radius = 0.8 + 1 * event.duration;
  }

  let color = "black";
  if (stat === "Ball Recovery") {
    color = "ball_recovery" in event ? "red" : "blue";
  } else if (
    stat === "Foul Committed" &&
    "foul_committed" in event &&
    "card" in event.foul_committed
  ) {
    color = event.foul_committed.card.name === "Yellow Card" ? "yellow" : "red";
  } else if (stat === "Duel" && "outcome" in event.duel) {
    if (["Lost In Play", "Lost Out", null].includes(event.duel.outcome.name)) {
      color = "red";
    } else {
      color = "blue";
    }
  } else if (stat === "Interception") {
    if (
      ["Lost", "Lost In Play", "Lost Out", null].includes(
        event.interception.outcome.name
      )
    ) {
      color = "red";
    } else {
      color = "blue";
    }
  } else if (stat === "50/50") {
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
