import { useEffect, useState } from "react";
import {
  Competition,
  Match,
  PlayerPosition,
  BallLost as TBallLost,
  BallRecovery as TBallRecovery,
  Block as TBlock,
  Carry as TCarry,
  Clearance as TClearance,
  Dribble as TDribble,
  Duel as TDuel,
  Interception as TInterception,
  Pass as TPass,
  Shot as TShot,
} from "@/app/types";
import { API_URL } from "@/lib/consts";

export type Player = {
  id: number;
  name: string;
  team_id: number;
  jersey_number?: number;
  position: { id: number; name: PlayerPosition } | PlayerPosition;
  is_starter: boolean;
};

export function useMatches() {
  const [matches, setMatches] = useState<{
    competition: Competition;
    matches: Match[];
  } | null>();

  useEffect(() => {
    fetch(`${API_URL}/matches`).then(async (res) => {
      const matches = await res.json();
      setMatches(matches);
    });
  }, []);

  return matches;
}

export function useMatchTeams(matchId: string) {
  const [matchTeams, setMatchTeams] = useState<
    { id: number; name: string; players: Player[] }[]
  >([]);

  useEffect(() => {
    fetch(`${API_URL}/matches/${matchId}/teams`).then(async (res) => {
      const matchTeams = await res.json();
      setMatchTeams(matchTeams);
    });
  }, [matchId]);

  return matchTeams;
}

export function useMatchInfo(matchId: string) {
  const [matchInfo, setMatchInfo] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/matches/${matchId}`).then(async (res) => {
      const matchInfo = await res.json();
      setMatchInfo(matchInfo);
    });
  }, [matchId]);

  return matchInfo;
}

export function usePlayerStats(matchId: string, playerId: number | null) {
  const [playerStats, setPlayerStats] = useState<{
    shots: TShot[];
    passes: TPass[];
    carries: TCarry[];
    dribbles: TDribble[];
    balls_lost: TBallLost[];
    defensive_actions: (
      | TBallRecovery
      | TBlock
      | TInterception
      | TDuel
      | TClearance
    )[];
  } | null>(null);

  useEffect(() => {
    if (!playerId) return;

    fetch(`${API_URL}/matches/${matchId}/player-stats/${playerId}`).then(
      async (res) => {
        const playerStats = await res.json();
        console.log({ playerStats });
        setPlayerStats(playerStats);
      }
    );
  }, [matchId, playerId]);

  return playerStats;
}

export function useMatchPassTendencies(matchId: string) {
  const [passTendencies, setPassTendencies] = useState<{
    [player_id: number]: {
      avg_position: [number, number];
      passes: { [recipient_id: number]: number };
    };
  }>({});

  useEffect(() => {
    fetch(`${API_URL}/matches/${matchId}/pass-tendencies`).then(async (res) => {
      const passTendencies = await res.json();
      setPassTendencies(passTendencies);
    });
  }, [matchId]);

  return passTendencies;
}
