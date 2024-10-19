import {
  Dribble,
  Duel,
  Interception,
  MatchEvent,
  Pass as TPass,
  Shot as TShot,
} from "@/app/types";
import { STAT_KEYS } from "@/lib/hooks";

export default function EventLegend({
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
