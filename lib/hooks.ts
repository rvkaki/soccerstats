import {
  Competition,
  Match,
  MatchEvent,
  PlayerAction,
  PlayerPosition,
} from "@/app/types";
import { API_URL } from "@/lib/consts";
import { useQuery } from "@tanstack/react-query";

export type Player = {
  id: number;
  name: string;
  team_id: number;
  jersey_number?: number;
  position: { id: number; name: PlayerPosition } | PlayerPosition;
  is_starter: boolean;
  nickname?: string;
  img?: string;
};

export function useCompetitions() {
  return useQuery({
    queryKey: ["competitions"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/competitions`);
      return (await res.json()) as Competition[];
    },
  });
}

export function useMatches({
  competitionId,
  seasonId,
}: {
  competitionId: number;
  seasonId: number;
}) {
  return useQuery({
    queryKey: ["competitions", competitionId, seasonId, "matches"],
    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/competitions/${competitionId}/season/${seasonId}/matches`
      );
      return (await res.json()) as {
        competition: Competition;
        matches: Match[];
      };
    },
  });
}

export function useMatchTeams({
  competitionId,
  seasonId,
  matchId,
}: {
  competitionId: number;
  seasonId: number;
  matchId: string;
}) {
  return useQuery({
    queryKey: [
      "competitions",
      competitionId,
      seasonId,
      "matches",
      matchId,
      "teams",
    ],
    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/competitions/${competitionId}/season/${seasonId}/matches/${matchId}/teams`
      );
      return (await res.json()) as {
        id: number;
        name: string;
        players: Player[];
      }[];
    },
  });
}

export function useMatchInfo({
  competitionId,
  seasonId,
  matchId,
}: {
  competitionId: number;
  seasonId: number;
  matchId: string;
}) {
  return useQuery({
    queryKey: [
      "competitions",
      competitionId,
      seasonId,
      "matches",
      matchId,
      "info",
    ],
    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/competitions/${competitionId}/season/${seasonId}/matches/${matchId}`
      );
      return (await res.json()) as Match;
    },
  });
}

export function useMatchPlayerActions({
  matchId,
  playerId,
}: {
  matchId: string;
  playerId: number;
}) {
  return useQuery({
    queryKey: ["matches", matchId, "player-actions", playerId],
    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/matches/${matchId}/player-actions/${playerId}`
      );
      return (await res.json()) as PlayerAction[];
    },
  });
}

export const STAT_KEYS = [
  "passes.total",
  "passes.progressive_made",
  "passes.progressive_received",
  "passes.into_box",
  "passes.chance_creation",
  "shots.total",
  "shots.on_target",
  "defensive_actions.total",
  "defensive_actions.block",
  "defensive_actions.ball_recovery",
  "defensive_actions.clearance",
  "defensive_actions.interception",
  "defensive_actions.duel",
  "carries.total",
  "carries.progressive",
  // "carries.chance_creation", // not implemented
  "pressure.total",
  "dribbles.total",
  "heatmaps",
] as const;

export function useMatchComparisonEvents({
  competitionId,
  seasonId,
  stat,
  matchId,
  ids,
}: {
  competitionId: number;
  seasonId: number;
  stat: (typeof STAT_KEYS)[number];
  matchId: string;
  ids: number[];
}) {
  return useQuery({
    queryKey: [
      "competitions",
      competitionId,
      seasonId,
      "matches",
      matchId,
      "compare",
      stat,
      ids,
    ],
    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/competitions/${competitionId}/season/${seasonId}/matches/${matchId}/compare?stat=${stat}&ids=${ids.join(
          ","
        )}`
      );
      return (await res.json()) as { [key: number]: MatchEvent[] };
    },
    enabled: Boolean(ids.length && stat),
  });
}
