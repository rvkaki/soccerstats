type PlayPattern =
  | "From Corner"
  | "From Counter"
  | "From Free Kick"
  | "From Goal Kick"
  | "From Keeper"
  | "From Kick Off"
  | "From Throw In"
  | "Other"
  | "Regular Play";

type BodyPart =
  | "Drop Kick"
  | "Head"
  | "Left Foot"
  | "Other"
  | "Right Foot"
  | "Keeper Arm"
  | "No Touch";

type PassType =
  | "Kick Off"
  | "Free Kick"
  | "Corner"
  | "Throw-in"
  | "Goal Kick"
  | "Interception"
  | "Recovery";

type PassHeight = "Ground Pass" | "Low Pass" | "High Pass";

export type PlayerPosition =
  | "Goalkeeper"
  | "Right Back"
  | "Right Center Back"
  | "Center Back"
  | "Left Center Back"
  | "Left Back"
  | "Right Wing Back"
  | "Left Wing Back"
  | "Right Defensive Midfield"
  | "Center Defensive Midfield"
  | "Left Defensive Midfield"
  | "Right Midfield"
  | "Right Center Midfield"
  | "Center Midfield"
  | "Left Center Midfield"
  | "Left Midfield"
  | "Right Wing"
  | "Right Attacking Midfield"
  | "Center Attacking Midfield"
  | "Left Attacking Midfield"
  | "Left Wing"
  | "Right Center Forward"
  | "Center Forward"
  | "Striker"
  | "Left Center Forward"
  | "Secondary Striker";

export type Location = [number, number];
export type Location3D = [number, number, number];

type BaseEvent = {
  id: string;
  index: number;
  period: number;
  timestamp: string;
  minute: number;
  second: number;
  possession: number;
  possession_team: string;
  play_pattern: PlayPattern;
  team: string;
  player: string;
  player_id: number;
  position: PlayerPosition;
  location: Location;
  duration: number;
  under_pressure: boolean | null;
  off_camera: boolean | null;
  out: boolean | null;
  related_events: string[];
  match_id: number;
  possession_team_id: number;
  team_id: number;
};

export type Pass = BaseEvent & {
  type: "Pass";
  pass: {
    recipient: { id: number; name: string };
    length: number;
    angle: number;
    height: { id: number; name: PassHeight };
    end_location: Location;
    body_part: { id: number; name: BodyPart };
    type: { id: number; name: PassType };
    outcome?: {
      id: number;
      name:
        | "Incomplete"
        | "Injury Clearance"
        | "Out"
        | "Pass Offside"
        | "Unknown";
    };
  };
};

export type Lineup = BaseEvent & {
  type: "Starting XI";
  tactics: {
    formation: number;
    lineup: {
      player: { id: number; name: string };
      position: { id: number; name: PlayerPosition };
      jersey_number: number;
    }[];
  };
};

type FoulType =
  | "6 Seconds"
  | "Backpass Pick"
  | "Dangerous Play"
  | "Dive"
  | "Foul Out"
  | "Handball";
export type FoulCommitted = BaseEvent & {
  type: "Foul Committed";
  foul_committed: {
    counterpress?: boolean;
    offensive?: boolean;
    type: { id: number; name: FoulType };
    advantage?: boolean;
    penalty?: boolean;
    card?: {
      id: number;
      name: "Yellow Card" | "Red Card" | "Second Yellow";
    };
  } | null;
};

type ShotTechnique =
  | "Normal"
  | "Volley"
  | "Half Volley"
  | "Lob"
  | "Diving Header"
  | "Overhead Kick"
  | "Backheel";

type ShotType = "Open Play" | "Kick Off" | "Penalty" | "Corner" | "Free Kick";

export type ShotOutcome =
  | "Goal"
  | "Saved"
  | "Off T"
  | "Post"
  | "Blocked"
  | "Wayward"
  | "Saved Off T"
  | "Saved To Post";

export type Shot = BaseEvent & {
  type: "Shot";
  shot: {
    statsbomb_xg: number;
    end_location: Location3D;
    technique: {
      id: number;
      name: ShotTechnique;
    };
    body_part: {
      id: number;
      name: BodyPart;
    };
    type: {
      id: number;
      name: ShotType;
    };
    outcome: {
      id: number;
      name: ShotOutcome;
    };
  };
};

export type Dribble = BaseEvent & {
  type: "Dribble";
  dribble: {
    Overrun?: boolean;
    Nutmeg?: boolean;
    "No Touch"?: boolean;
    outcome: {
      id: number;
      name: "Incomplete" | "Complete";
    };
  };
};

export type BallRecovery = BaseEvent & {
  type: "Ball Recovery";
};

export type Carry = BaseEvent & {
  type: "Carry";
  carry: {
    end_location: Location;
  };
};

export type BallReceipt = BaseEvent & {
  type: "Ball Receipt*";
};

export type Pressure = BaseEvent & {
  type: "Pressure";
};

export type Block = BaseEvent & {
  type: "Block";
  block: {
    save_block?: boolean;
    deflection?: boolean;
    offensive?: boolean;
    counterpress?: boolean;
  };
};

export type Dispossessed = BaseEvent & {
  type: "Dispossessed";
};

type GoalkeeperType =
  | "Collected"
  | "Goal Conceded"
  | "Keeper Sweeper"
  | "Penalty Conceded"
  | "Penalty Saved"
  | "Punch"
  | "Save"
  | "Shot Faced"
  | "Shot Saved"
  | "Smother"
  | "Shot Saved To Post"
  | "Shot Saved Off T"
  | "Saved To Post"
  | "Penalty Saved To Post";

type GoalkeeperBodyPart =
  | "Left Foot"
  | "Right Foot"
  | "Left Hand"
  | "Right Hand"
  | "Head"
  | "Chest"
  | "Both Hands";

type GoalkeeperOutcome =
  | "Claim"
  | "Clear"
  | "Collected Twice"
  | "Fail"
  | "In Play"
  | "In Play Danger"
  | "In Play Safe"
  | "No Touch"
  | "Saved Twice"
  | "Success"
  | "Touched In"
  | "Touched Out"
  | "Won"
  | "Success In Play"
  | "Success Out"
  | "Lost In Play"
  | "Lost Out"
  | "Punched Out";

export type Goalkeeper = BaseEvent & {
  type: "Goal Keeper";
  goalkeeper: {
    end_location?: Location;
    position: {
      id: number;
      name: "Moving" | "Prone" | "Set";
    };
    type: {
      id: number;
      name: GoalkeeperType;
    };
    body_part?: {
      id: number;
      name: GoalkeeperBodyPart;
    };
    technique?: {
      id: number;
      name: "Standing" | "Diving";
    };
    outcome?: {
      id: number;
      name: GoalkeeperOutcome;
    };
  };
};

export type DuelOutcome =
  | "Won"
  | "Lost In Play"
  | "Lost Out"
  | "Success"
  | "Success In Play"
  | "Success Out";

export type Duel = BaseEvent & {
  type: "Duel";
  duel: {
    type: {
      id: number;
      name: "Aerial Lost" | "Tackle";
    };
    outcome?: {
      id: number;
      name: DuelOutcome;
    };
    counterpress?: boolean;
  };
};

export type InterceptionOutcome =
  | "Won"
  | "Lost"
  | "Lost In Play"
  | "Lost Out"
  | "Success"
  | "Success In Play"
  | "Success Out";

export type Interception = BaseEvent & {
  type: "Interception";
  interception: {
    outcome: {
      id: number;
      name: InterceptionOutcome;
    };
  };
};

export type Miscontrol = BaseEvent & {
  type: "Miscontrol";
  miscontrol: {
    aerial_won?: boolean;
  } | null;
};

export type Clearance = BaseEvent & {
  type: "Clearance";
  clearance: {
    body_part: {
      id: number;
      name: "Head" | "Other" | "Left Foot" | "Right Foot";
    };
    aerial_won?: boolean;
  };
};

export type BallLost =
  | Pass
  | Dribble
  | Duel
  | FoulCommitted
  | Miscontrol
  | Dispossessed;

export type MatchEvent =
  | Pass
  | Shot
  | Dribble
  | Carry
  | Duel
  | Interception
  | Goalkeeper
  | Block
  | Pressure
  | BallRecovery
  | BallReceipt
  | Dispossessed
  | Lineup
  | FoulCommitted
  | Miscontrol
  | Clearance;

export type Competition = {
  competition_id: number;
  season_id: number;
  country_name: string;
  competition_name: string;
  competition_gender: "female" | "male";
  competition_youth: boolean;
  competition_international: boolean;
  season_name: string;
  match_updated: string;
  match_updated_360: string | null;
  match_available_360: string | null;
  match_available: string;
};

export type Match = {
  match_id: number;
  match_date: string;
  kick_off: string;
  competition: string;
  season: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  match_status: "available" | "deleted" | "scheduled";
  match_status_360: "available" | "deleted" | "scheduled";
  last_updated: string;
  last_updated_360: string;
  match_week: number;
  competition_stage: string;
  stadium: string;
  referee: string;
  home_managers: string;
  away_managers: string;
  data_version: string;
  shot_fidelity_version: string;
  xy_fidelity_version: string;
};
