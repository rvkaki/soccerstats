"use client";

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
import { STAT_KEYS } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";

export default function StatSelector({
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
        { label: "Progressive", value: "passes.progressive_made" },
        { label: "Progressive Received", value: "passes.progressive_received" },
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
            "w-full justify-between border-[2px] border-neutral-700 rounded-lg hover:bg-neutral-700 hover:bg-opacity-20 capitalize",
            selected ? "text-white" : "text-neutral-400"
          )}
        >
          {selectedStat
            ? selectedStat.value.split(".").reverse().join(" ")
            : "Select stat..."}
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
