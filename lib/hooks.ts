import {
  Competition,
  Duel,
  Interception,
  Match,
  MatchEvent,
  Pass,
  PlayerAction,
  PlayerPosition,
  Pressure,
  Shot as TShot,
} from "@/app/types";
import { API_URL, EventType } from "@/lib/consts";
import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import { adjustLocation } from "../app/competitions/[competitionId]/season/[seasonId]/matches/[matchId]/consts";

export type Player = {
  id: number;
  name: string;
  team_id: number;
  jersey_number?: number;
  position: { id: number; name: PlayerPosition } | PlayerPosition;
  is_starter: boolean;
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

// export function usePlayerStatsById(matchId: string, playerId: number | null) {
//   return useQuery({
//     queryKey: ["matches", matchId, "player-stats", playerId],
//     enabled: !!playerId,
//     queryFn: async () => {
//       const res = await fetch(
//         `${API_URL}/matches/${matchId}/player-stats/${playerId}`
//       );
//       const data = (await res.json()) as Record<string, any>;
//       return data;
//     },
//   });
// }

// export function useMatchPassTendencies(matchId: string) {
//   return useQuery({
//     queryKey: ["matches", matchId, "pass-tendencies"],
//     queryFn: async () => {
//       const res = await fetch(`${API_URL}/matches/${matchId}/pass-tendencies`);
//       return (await res.json()) as {
//         [player_id: number]: {
//           avg_position: [number, number];
//           passes: { [recipient_id: number]: number };
//         };
//       };
//     },
//   });
// }

// export function useMatchSummary(matchId: string) {
//   return useQuery({
//     queryKey: ["matches", matchId, "summary"],
//     queryFn: async () => {
//       const res = await fetch(`${API_URL}/matches/${matchId}/summary`);
//       return (await res.json()) as {
//         [team_name: string]: {
//           Poss: number;
//           "Touches in Att 3rd": number;
//           Shots: number;
//           "Shots on Target": number;
//           "Passing Accuracy": number;
//           "Forward Passing": number;
//           "Def. Actions in Att 3rd": number;
//           Corners: number;
//           "Fouls Commited": number;
//         };
//       };
//     },
//   });
// }

// export function useShotChart(matchId: string) {
//   return useQuery({
//     queryKey: ["matches", matchId, "shotchart"],
//     queryFn: async () => {
//       const res = await fetch(`${API_URL}/matches/${matchId}/shotchart`);
//       const data = (await res.json()) as TShot[];

//       data.forEach((shot) => {
//         shot.location = adjustLocation(shot.location);
//         shot.shot.end_location = [
//           ...adjustLocation(
//             shot.shot.end_location.slice(0, 2) as [number, number]
//           ),
//           shot.shot.end_location[2],
//         ];
//       });

//       return data;
//     },
//   });
// }

// export function useMatchEvents(matchId: string) {
//   return useQuery({
//     queryKey: ["matches", matchId, "events"],
//     queryFn: async () => {
//       const res = await fetch(`${API_URL}/matches/${matchId}/events`);
//       return (await res.json()) as Record<EventType, Record<string, any>[]>;
//     },
//   });
// }

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

// export function useMatchProgressivePasses(matchId: string) {
//   return useQuery({
//     queryKey: ["matches", matchId, "progressive-passes"],
//     queryFn: async () => {
//       const res = await fetch(
//         `${API_URL}/matches/${matchId}/progressive-passes`
//       );
//       return (await res.json()) as Pass[];
//     },
//   });
// }

// export function useMatchPassesIntoBox(matchId: string) {
//   return useQuery({
//     queryKey: ["matches", matchId, "passes-into-box"],
//     queryFn: async () => {
//       const res = await fetch(`${API_URL}/matches/${matchId}/passes-into-box`);
//       return (await res.json()) as Pass[];
//     },
//   });
// }

// export function useMatchChanceCreatingPasses(matchId: string) {
//   return useQuery({
//     queryKey: ["matches", matchId, "chance-creating-passes"],
//     queryFn: async () => {
//       const res = await fetch(
//         `${API_URL}/matches/${matchId}/chance-creating-passes`
//       );
//       return (await res.json()) as Pass[];
//     },
//   });
// }

// export function useMatchDefensiveActions(matchId: string) {
//   return useQuery({
//     queryKey: ["matches", matchId, "defensive-actions"],
//     queryFn: async () => {
//       const res = await fetch(
//         `${API_URL}/matches/${matchId}/defensive-actions`
//       );
//       return (await res.json()) as MatchEvent[];
//     },
//   });
// }

// export function useMatchPressingActions(matchId: string) {
//   return useQuery({
//     queryKey: ["matches", matchId, "pressing-actions"],
//     queryFn: async () => {
//       const res = await fetch(`${API_URL}/matches/${matchId}/pressing-actions`);
//       return (await res.json()) as Pressure[];
//     },
//   });
// }

// export function useTeamTotalPressingActions(teamId: number) {
//   return useQuery({
//     queryKey: ["teams", teamId, "total-pressing-actions"],
//     queryFn: async () => {
//       const res = await fetch(
//         `${API_URL}/teams/${teamId}/totals/pressing-actions`
//       );
//       return (await res.json()) as Pressure[];
//     },
//     enabled: !!teamId,
//   });
// }

// export function useTeamTotalDefensiveActions(teamId: number) {
//   return useQuery({
//     queryKey: ["teams", teamId, "total-defensive-actions"],
//     queryFn: async () => {
//       const res = await fetch(
//         `${API_URL}/teams/${teamId}/totals/defensive-actions`
//       );
//       return (await res.json()) as MatchEvent[];
//     },
//     enabled: !!teamId,
//   });
// }

// export function useTeams() {
//   return useQuery({
//     queryKey: ["teams"],
//     queryFn: async () => {
//       const res = await fetch(`${API_URL}/teams`);
//       return (await res.json()) as {
//         id: number;
//         name: string;
//         country: { id: number; name: string };
//       }[];
//     },
//   });
// }

// export function useTeam(teamId: number) {
//   return useQuery({
//     queryKey: ["teams", teamId],
//     queryFn: async () => {
//       const res = await fetch(`${API_URL}/teams/${teamId}`);
//       return (await res.json()) as {
//         id: number;
//         name: string;
//         country: { id: number; name: string };
//         players: Record<
//           number,
//           {
//             id: number;
//             name: string;
//             jersey_number: number | null;
//             position: { id: number; name: PlayerPosition };
//           }
//         >;
//       };
//     },
//     enabled: !!teamId,
//   });
// }

// export function usePlayer(playerId: number) {
//   return useQuery({
//     queryKey: ["players", playerId],
//     queryFn: async () => {
//       const res = await fetch(`${API_URL}/players/${playerId}`);
//       return (await res.json()) as {
//         id: number;
//         name: string;
//         jersey_number: number | null;
//         position: { id: number; name: PlayerPosition };
//         team_id: number;
//       };
//     },
//     enabled: !!playerId,
//   });
// }

// export function usePlayerTotalsActions(playerId: number, teamId: number) {
//   return useQuery({
//     queryKey: ["players", playerId, "totals", "actions"],
//     queryFn: async () => {
//       const res = await fetch(
//         `${API_URL}/players/${playerId}/totals/actions?team_id=${teamId}`
//       );
//       return (await res.json()) as MatchEvent[];
//     },
//     enabled: !!playerId && !!teamId,
//   });
// }

export const STAT_KEYS = [
  "passes.total",
  "passes.progressive",
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
