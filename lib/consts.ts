export const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000/api"
    : "https://soccerstats-api-production.up.railway.app/api";

export const PlayerStatToLabel: Record<string, string> = {
  Gls: "Goals",
  Ast: "Assists",
  PK: "Penalties",
  PKatt: "Penalty Attempts",
  Sh: "Shots",
  SoT: "Shots on Target",
  CrdY: "Yellow Cards",
  CrdR: "Red Cards",
  Touches: "Touches",
  Tkl: "Tackles",
  Int: "Interceptions",
  Blocks: "Blocks",
};

export const EventTypes = [
  "passes",
  "ball_receipts",
  "carrys",
  "pressures",
  "foul_committeds",
  "foul_wons",
  "ball_recoverys",
  "blocks",
  "miscontrols",
  "clearances",
  "duels",
  "interceptions",
  "dribbles",
  "shots",
  "goal_keepers",
  "dispossesseds",
  "dribbled_pasts",
  "injury_stoppages",
  "offsides",
  "shields",
  "50/50s",
  "bad_behaviours",
] as const;
export type EventType = typeof EventTypes[number];

export const EventTypeToLabel: Record<(typeof EventTypes)[number], string> = {
  passes: "Passes",
  ball_receipts: "Ball Receipts",
  carrys: "Carrys",
  pressures: "Pressures",
  foul_committeds: "Fouls Committed",
  foul_wons: "Fouls Won",
  ball_recoverys: "Ball Recoverys",
  blocks: "Blocks",
  miscontrols: "Miscontrols",
  clearances: "Clearances",
  duels: "Duels",
  interceptions: "Interceptions",
  dribbles: "Dribbles",
  shots: "Shots",
  goal_keepers: "Goalkeepers",
  dispossesseds: "Dispossessed",
  dribbled_pasts: "Dribbled Past",
  injury_stoppages: "Injury Stoppages",
  offsides: "Offsides",
  shields: "Shields",
  "50/50s": "50/50s",
  bad_behaviours: "Bad Behaviours",
};
