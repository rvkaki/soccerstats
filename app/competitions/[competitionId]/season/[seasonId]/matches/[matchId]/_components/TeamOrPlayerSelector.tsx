import { Player } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { PlayerPositionToShort } from "../consts";

export default function TeamOrPlayerSelector({
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
              "flex items-center gap-2 cursor-pointer p-2 rounded-md justify-between border border-transparent bg-opacity-0 hover:bg-opacity-10",
              reverse && "flex-row-reverse",
              teamIndex === 0
                ? "bg-violet-500 hover:border-violet-500"
                : "bg-amber-500 hover:border-amber-500",
              selectedId === player.id ? "bg-opacity-20" : ""
            )}
            onClick={() => onClick?.(player.id)}
          >
            <span className="flex gap-2">
              <span>{PlayerPositionToShort[position]}</span>
              <span>{player.nickname ?? player.name}</span>
            </span>
            <span className="text-neutral-400">#{player.jersey_number}</span>
          </div>
        );
      })}
    </div>
  );
}
