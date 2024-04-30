import { Competition, Match, PlayerPosition, Shot as TShot } from "@/app/types";
import { API_URL, EventType } from "@/lib/consts";
import { useQuery } from "@tanstack/react-query";
import { adjustLocation } from "./consts";

export type Player = {
  id: number;
  name: string;
  team_id: number;
  jersey_number?: number;
  position: { id: number; name: PlayerPosition } | PlayerPosition;
  is_starter: boolean;
};

export function useMatches() {
  return useQuery({
    queryKey: ["matches"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/matches`);
      return (await res.json()) as {
        competition: Competition;
        matches: Match[];
      };
    },
  });
}

export function useMatchTeams(matchId: string) {
  return useQuery({
    queryKey: ["matches", matchId, "teams"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/matches/${matchId}/teams`);
      return (await res.json()) as {
        id: number;
        name: string;
        players: Player[];
      }[];
    },
  });
}

export function useMatchInfo(matchId: string) {
  return useQuery({
    queryKey: ["matches", matchId, "info"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/matches/${matchId}`);
      return (await res.json()) as Record<string, any>;
    },
  });
}

export function usePlayerStatsByJerseyNumber(
  matchId: string,
  teamName: string,
  jerseyNumber: number | null
) {
  return useQuery({
    queryKey: ["matches", matchId, "player-stats", teamName, jerseyNumber],
    enabled: !!jerseyNumber,
    queryFn: async () => {
      if (!jerseyNumber) return null;

      const res = await fetch(
        `${API_URL}/matches/${matchId}/player-stats/${teamName}/${jerseyNumber}`
      );
      const data = (await res.json()) as Record<string, any>;
      return data;
    },
  });
}

export function useMatchPassTendencies(matchId: string) {
  return useQuery({
    queryKey: ["matches", matchId, "pass-tendencies"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/matches/${matchId}/pass-tendencies`);
      return (await res.json()) as {
        [player_id: number]: {
          avg_position: [number, number];
          passes: { [recipient_id: number]: number };
        };
      };
    },
  });
}

export function useMatchSummary(matchId: string) {
  return useQuery({
    queryKey: ["matches", matchId, "summary"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/matches/${matchId}/summary`);
      return (await res.json()) as {
        [team_name: string]: {
          Poss: number;
          "Touches in Att 3rd": number;
          Shots: number;
          "Shots on Target": number;
          "Passing Accuracy": number;
          "Forward Passing": number;
          "Def. Actions in Att 3rd": number;
          Corners: number;
          "Fouls Commited": number;
        };
      };
    },
  });
}

export function useShotChart(matchId: string) {
  return useQuery({
    queryKey: ["matches", matchId, "shotchart"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/matches/${matchId}/shotchart`);
      const data = (await res.json()) as TShot[];

      data.forEach((shot) => {
        shot.location = adjustLocation(shot.location);
        shot.shot.end_location = [
          ...adjustLocation(
            shot.shot.end_location.slice(0, 2) as [number, number]
          ),
          shot.shot.end_location[2],
        ];
      });

      return data;
    },
  });
}

export function useMatchEvents(matchId: string) {
  return useQuery({
    queryKey: ["matches", matchId, "events"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/matches/${matchId}/events`);
      return (await res.json()) as Record<EventType, Record<string, any>[]>;
    },
  });
}
