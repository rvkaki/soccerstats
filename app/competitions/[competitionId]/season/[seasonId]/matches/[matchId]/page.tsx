"use client";

import {
  Dribble,
  Duel,
  Interception,
  MatchEvent,
  Carry as TCarry,
  Pass as TPass,
  Shot as TShot,
} from "@/app/types";
import Carry from "@/components/Carry";
import Pass from "@/components/Pass";
import Pitch from "@/components/Pitch";
import Shot from "@/components/Shot";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Player,
  STAT_KEYS,
  useMatchComparisonEvents,
  useMatchInfo,
  useMatchTeams,
} from "@/lib/hooks";
import twColors from "@/lib/tailwindColors";
import { cn } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Circle, Layer, Stage } from "react-konva";
import Heatmap from "./_components/Heatmap";
import { FIELD_HEIGHT, FIELD_WIDTH, PlayerPositionToShort } from "./consts";

const SCALE = 6;

function getActualScale(availableWidth: number, availableHeight: number) {
  const denom1 = Math.floor(availableWidth / FIELD_HEIGHT);
  const denom2 = Math.floor(availableHeight / FIELD_WIDTH);

  const factor = Math.min(denom1, denom2);

  return factor;
}

export default function Page({
  params: { competitionId, seasonId, matchId },
}: {
  params: {
    competitionId: number;
    seasonId: number;
    matchId: string;
  };
  searchParams: URLSearchParams;
}) {
  const { data: matchInfo } = useMatchInfo({
    competitionId,
    seasonId,
    matchId,
  });
  const { data: matchTeams = [] } = useMatchTeams({
    competitionId,
    seasonId,
    matchId,
  });

  const [pitchContainerRef, setPitchContainerRef] =
    useState<HTMLDivElement | null>(null);
  const [homeItemId, setHomeItemId] = useState<number | null>(
    matchInfo?.home_team.home_team_id || null
  );
  const [awayItemId, setAwayItemId] = useState<number | null>(
    matchInfo?.away_team.away_team_id || null
  );
  const [stat, setStat] = useState<(typeof STAT_KEYS)[number] | null>(null);

  const [scale, setScale] = useState<number>(SCALE);

  const { data = { [homeItemId!]: [], [awayItemId!]: [] } } =
    useMatchComparisonEvents({
      competitionId,
      seasonId,
      stat: stat!,
      matchId,
      ids: [homeItemId, awayItemId].filter(Boolean) as number[],
    });

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      const newScale = getActualScale(width, height - 50);
      setScale(newScale);
    });
    if (pitchContainerRef) {
      resizeObserver.observe(pitchContainerRef);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [pitchContainerRef]);

  useEffect(() => {
    if (matchInfo?.home_team) {
      setHomeItemId(matchInfo.home_team.home_team_id);
    }
    if (matchInfo?.away_team) {
      setAwayItemId(matchInfo.away_team.away_team_id);
    }
  }, [matchInfo?.home_team, matchInfo?.away_team]);

  function handleItemSelect(id: number, side: "home" | "away") {
    if (side === "home") {
      setHomeItemId((prev) => (prev === id ? null : id));
      if (stat === "heatmaps") {
        setAwayItemId(null);
      }
    } else {
      setAwayItemId((prev) => (prev === id ? null : id));
      if (stat === "heatmaps") {
        setHomeItemId(null);
      }
    }
  }

  if (!matchInfo || !matchTeams.length) {
    return null;
  }

  return (
    <main className="w-full h-screen flex flex-col items-center gap-24 p-8 mx-auto text-white">
      <header className="flex flex-row w-full items-center gap-12 text-white max-w-lg">
        <div className="flex-1 flex flex-row items-center justify-between">
          <h1 className="text-xl font-bold">
            {matchInfo.home_team.home_team_name}
          </h1>
          <h2 className="text-3xl font-bold">{matchInfo.home_score}</h2>
        </div>
        <div className="flex flex-col items-center">
          <h3>{matchInfo.match_date}</h3>

          <h4 className="text-sm text-neutral-400 leading-none pt-2">
            {matchInfo.competition_stage.name}
          </h4>
          <h4 className="font-bold">
            {matchInfo.competition.competition_name}
          </h4>
        </div>
        <div className="flex-1 flex flex-row items-center justify-between">
          <h2 className="text-2xl font-bold">{matchInfo.away_score}</h2>
          <h1 className="text-xl font-bold">
            {matchInfo.away_team.away_team_name}
          </h1>
        </div>
      </header>

      <div className="grid grid-cols-[minmax(250px,auto),1fr,minmax(250px,auto)] gap-4 flex-1 w-full">
        <div className="flex flex-col rounded-lg p-4 h-full border-[2px] border-neutral-700 text-white bg-neutral-800 bg-opacity-20">
          <TeamOrPlayerSelector
            players={matchTeams[0].players}
            teamName={matchTeams[0].name}
            teamId={matchTeams[0].id}
            onClick={(id) => handleItemSelect(id, "home")}
            teamIndex={0}
            selectedId={homeItemId}
          />
        </div>
        <div
          ref={setPitchContainerRef}
          className="w-full h-full flex justify-center"
        >
          <div className="flex flex-col gap-4 h-full max-w-fit">
            <StatSelector selected={stat} onSelect={setStat} />

            <div className="w-full flex-1">
              <Stage
                width={120 * scale}
                height={80 * scale}
                scale={{ x: scale, y: scale }}
              >
                <Layer>
                  <Pitch color={twColors.neutral[400]} />

                  {stat === "heatmaps" ? (
                    <Heatmap
                      id={homeItemId ?? awayItemId}
                      actions={
                        homeItemId
                          ? data[homeItemId]
                          : awayItemId
                          ? data[awayItemId]
                          : []
                      }
                      colorName={homeItemId ? "violet" : "amber"}
                    />
                  ) : (
                    <>
                      {homeItemId &&
                        data[homeItemId].map((p) => (
                          <EventItem
                            key={p.id}
                            event={p}
                            color={twColors.violet[500]}
                          />
                        ))}

                      {awayItemId &&
                        data[awayItemId].map((p) => (
                          <EventItem
                            key={p.id}
                            event={p}
                            color={twColors.amber[500]}
                          />
                        ))}
                    </>
                  )}
                </Layer>
              </Stage>
            </div>

            <div className="flex flex-row justify-between gap-4">
              <EventLegend
                events={homeItemId ? data[homeItemId] : []}
                color={twColors.violet[500]}
                stat={stat}
              />
              <EventLegend
                events={awayItemId ? data[awayItemId] : []}
                color={twColors.amber[500]}
                stat={stat}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col rounded-lg p-4 h-full border-[2px] border-neutral-700 text-white bg-neutral-800 bg-opacity-20">
          <TeamOrPlayerSelector
            players={matchTeams[1].players}
            teamName={matchTeams[1].name}
            teamId={matchTeams[1].id}
            reverse
            onClick={(id) => handleItemSelect(id, "away")}
            teamIndex={1}
            selectedId={awayItemId}
          />
        </div>
      </div>
    </main>
  );
}

function EventLegend({
  events,
  color,
  stat,
}: {
  events: MatchEvent[];
  color: string;
  stat: (typeof STAT_KEYS)[number] | null;
}) {
  if (!stat || !events.length) {
    return null;
  }

  let total = 0;
  let successful = 0;

  events.forEach((event) => {
    total++;
    switch (stat) {
      case "passes.total":
      case "passes.progressive":
      case "passes.into_box":
      case "passes.chance_creation":
        if (!(event as TPass).pass.outcome) {
          successful++;
        }
        break;
      case "shots.total":
      case "shots.on_target":
        if ((event as TShot).shot.outcome.name === "Goal") {
          successful++;
        }
        break;
      case "defensive_actions.block":
      case "defensive_actions.clearance":
        successful++;
        break;
      case "defensive_actions.interception":
        const interception = (event as Interception).interception;
        if (
          ["Success", "Success In Play", "Success Out", "Won"].includes(
            interception.outcome.name
          )
        ) {
          successful++;
        }
        break;
      case "defensive_actions.duel":
        const duel = (event as Duel).duel;
        if (
          ["Success", "Success In Play", "Success Out", "Won"].includes(
            duel.outcome?.name || ""
          )
        ) {
          successful++;
        }
        break;
      case "defensive_actions.ball_recovery":
        const unsuccessful =
          "ball_recovery" in event && "recovery_failure" in event.ball_recovery;
        if (!unsuccessful) {
          successful++;
        }
        break;
      case "defensive_actions.total":
        switch (event.type.name) {
          case "Ball Recovery":
            const unsuccessful =
              "ball_recovery" in event &&
              "recovery_failure" in event.ball_recovery;
            if (!unsuccessful) {
              successful++;
            }
            break;
          case "Duel":
            const duel = (event as Duel).duel;
            if (
              ["Success", "Success In Play", "Success Out", "Won"].includes(
                duel.outcome?.name || ""
              )
            ) {
              successful++;
            }
            break;
          case "Interception":
            const interception = (event as Interception).interception;
            if (
              ["Success", "Success In Play", "Success Out", "Won"].includes(
                interception.outcome.name
              )
            ) {
              successful++;
            }
            break;
          default:
            successful++;
            break;
        }
        break;
      case "carries.total":
      case "carries.progressive":
      case "pressure.total":
        successful++;
        break;
      case "dribbles.total":
        const dribble = (event as Dribble).dribble;
        if (dribble.outcome.name === "Complete") {
          successful++;
        }
        break;
      case "heatmaps":
        // TODO:
        break;
      default:
        stat satisfies never;
        throw new Error("Invalid stat");
    }
  });

  const StatToLabel: Record<(typeof STAT_KEYS)[number], string> = {
    "defensive_actions.ball_recovery": "Ball Recoveries",
    "defensive_actions.block": "Blocks",
    "defensive_actions.clearance": "Clearances",
    "defensive_actions.duel": "Duels",
    "defensive_actions.interception": "Interceptions",
    "defensive_actions.total": "Defensive Actions",
    "passes.chance_creation": "Chance Creation Passes",
    "passes.into_box": "Passes Into Box",
    "passes.progressive": "Progressive Passes",
    "passes.total": "Passes",
    "shots.on_target": "Shots On Target",
    "shots.total": "Shots",
    "carries.total": "Carries",
    "carries.progressive": "Progressive Carries",
    "pressure.total": "Pressure",
    "dribbles.total": "Dribbles",
    heatmaps: "Heatmaps",
  };

  return (
    <span style={{ color }}>
      {StatToLabel[stat]}: {successful}/{total}
    </span>
  );
}

function EventItem({ event, color }: { event: MatchEvent; color: string }) {
  const type = event.type.name;
  const location = event.location;

  switch (type) {
    case "Pass": {
      const pass = (event as TPass).pass;
      const endLocation = pass.end_location;
      const successful = !Boolean(pass.outcome);
      return (
        <Pass
          key={event.id}
          startPosition={location}
          endPosition={endLocation}
          strokeWidth={0.3}
          strokeColor={successful ? color : color + "66"}
        />
      );
    }
    case "Shot": {
      const shot = (event as TShot).shot;
      const endLocation = shot.end_location;
      return (
        <Shot
          key={event.id}
          startPosition={location}
          endPosition={endLocation}
          outcome={shot.outcome.name}
          xg={shot.statsbomb_xg}
          strokeWidth={0.3}
          strokeColor={shot.outcome.name === "Goal" ? color : color + "99"}
        />
      );
    }
    case "Ball Recovery": {
      const unsuccessful =
        "ball_recovery" in event && "recovery_failure" in event.ball_recovery;
      return (
        <Circle
          key={event.id}
          x={location[0]}
          y={location[1]}
          radius={0.5}
          fill={unsuccessful ? color + "66" : color}
        />
      );
    }
    case "Block":
    case "Clearance": {
      return (
        <Circle
          key={event.id}
          x={location[0]}
          y={location[1]}
          radius={0.5}
          fill={color}
        />
      );
    }
    case "Interception": {
      const interception = (event as Interception).interception;
      const successful = [
        "Success",
        "Success In Play",
        "Success Out",
        "Won",
      ].includes(interception.outcome.name);

      return (
        <Circle
          key={event.id}
          x={location[0]}
          y={location[1]}
          radius={0.5}
          fill={successful ? color : color + "66"}
        />
      );
    }
    case "Duel": {
      const duel = (event as Duel).duel;
      const successful = [
        "Success",
        "Success In Play",
        "Success Out",
        "Won",
      ].includes(duel.outcome?.name || "");

      return (
        <Circle
          key={event.id}
          x={location[0]}
          y={location[1]}
          radius={0.5}
          fill={successful ? color : color + "66"}
        />
      );
    }
    case "Carry": {
      const carry = (event as TCarry).carry;
      const endLocation = carry.end_location;
      return (
        <Carry
          key={event.id}
          startPosition={location}
          endPosition={endLocation}
          strokeWidth={0.3}
          strokeColor={color}
        />
      );
    }
    case "Pressure":
      return (
        <Circle
          key={event.id}
          x={location[0]}
          y={location[1]}
          radius={0.5}
          fill={color}
        />
      );
    case "Dribble":
      const dribble = (event as Dribble).dribble;
      const successful = dribble.outcome.name === "Complete";
      return (
        <Circle
          key={event.id}
          x={location[0]}
          y={location[1]}
          radius={0.5}
          fill={successful ? color : color + "66"}
        />
      );
    default:
      return null;
  }
}

function StatSelector({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (stat: (typeof STAT_KEYS)[number]) => void;
}) {
  const [open, setOpen] = useState(false);

  const stats: {
    label: string;
    items: { label: string; value: (typeof STAT_KEYS)[number] }[];
  }[] = [
    {
      label: "Passes",
      items: [
        { label: "Total", value: "passes.total" },
        { label: "Progressive", value: "passes.progressive" },
        { label: "Into Box", value: "passes.into_box" },
        { label: "Chance Creation", value: "passes.chance_creation" },
      ],
    },
    {
      label: "Shots",
      items: [
        { label: "Total", value: "shots.total" },
        { label: "On Target", value: "shots.on_target" },
      ],
    },
    {
      label: "Defensive Actions",
      items: [
        { label: "Total", value: "defensive_actions.total" },
        { label: "Blocks", value: "defensive_actions.block" },
        { label: "Ball Recovery", value: "defensive_actions.ball_recovery" },
        { label: "Clearance", value: "defensive_actions.clearance" },
        { label: "Interception", value: "defensive_actions.interception" },
        { label: "Duel", value: "defensive_actions.duel" },
      ],
    },
    {
      label: "Carries",
      items: [
        { label: "Total", value: "carries.total" },
        { label: "Progressive", value: "carries.progressive" },
      ],
    },
    {
      label: "Pressure",
      items: [{ label: "Total", value: "pressure.total" }],
    },
    {
      label: "Dribbles",
      items: [{ label: "Total", value: "dribbles.total" }],
    },
    {
      label: "Heatmaps",
      items: [{ label: "Heatmaps", value: "heatmaps" }],
    },
  ];

  const selectedStat = stats
    .flatMap((stat) => stat.items)
    .find((stat) => stat.value === selected);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="none"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between border-[2px] border-neutral-700 rounded-lg hover:bg-neutral-700 hover:bg-opacity-20",
            selected ? "text-white" : "text-neutral-400"
          )}
        >
          {selectedStat ? selectedStat.label : "Select stat..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command>
          <CommandInput placeholder="Search stat..." className="h-9" />
          <CommandList>
            <CommandEmpty>No stat found.</CommandEmpty>
            {stats.map((stat) => (
              <CommandGroup key={stat.label} heading={stat.label}>
                {stat.items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={() => {
                      onSelect(item.value);
                      setOpen(false);
                    }}
                  >
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function TeamOrPlayerSelector({
  players,
  teamName,
  teamId,
  reverse,
  onClick,
  teamIndex,
  selectedId,
}: {
  players: Player[];
  teamName: string;
  teamId: number;
  reverse?: boolean;
  onClick?: (id: number) => void;
  teamIndex: 0 | 1;
  selectedId: number | null;
}) {
  return (
    <div className={cn("flex flex-col gap-2", reverse && "justify-end")}>
      <div
        className={cn(
          "flex items-center gap-2 cursor-pointer p-2 rounded-md border border-transparent bg-opacity-0 hover:bg-opacity-10",
          reverse && "flex-row-reverse",
          teamIndex === 0
            ? "bg-violet-500 hover:border-violet-500"
            : "bg-amber-500 hover:border-amber-500",
          selectedId === teamId ? "bg-opacity-20" : ""
        )}
        onClick={() => onClick?.(teamId)}
      >
        <span>{teamName}</span>
      </div>
      {players.map((player) => {
        const position =
          player.position instanceof Object
            ? player.position.name
            : player.position;

        return (
          <div
            key={player.id}
            className={cn(
              "flex items-center gap-2 cursor-pointer p-2 rounded-md border border-transparent bg-opacity-0 hover:bg-opacity-10",
              reverse && "flex-row-reverse",
              teamIndex === 0
                ? "bg-violet-500 hover:border-violet-500"
                : "bg-amber-500 hover:border-amber-500",
              selectedId === player.id ? "bg-opacity-20" : ""
            )}
            onClick={() => onClick?.(player.id)}
          >
            <span>{PlayerPositionToShort[position]}</span>
            <span>{player.name}</span>
          </div>
        );
      })}
    </div>
  );
}
