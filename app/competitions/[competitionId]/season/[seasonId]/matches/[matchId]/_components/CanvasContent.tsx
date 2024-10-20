"use client";

import ImageNoBackground from "@/components/ImageNoBackground";
import Pitch from "@/components/Pitch";
import { Button } from "@/components/ui/button";
import {
  STAT_KEYS,
  useMatchComparisonEvents,
  useMatchInfo,
  useMatchTeams,
} from "@/lib/hooks";
import twColors from "@/lib/tailwindColors";
import { Layer as TLayer } from "konva/lib/Layer";
import { Text as TText } from "konva/lib/shapes/Text";
import { Stage as TStage } from "konva/lib/Stage";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Layer, Stage } from "react-konva";
import { FIELD_HEIGHT, FIELD_WIDTH } from "../consts";
import EventItem from "./EventItem";
import EventLegend from "./EventLegend";
import Heatmap from "./Heatmap";
import StatSelector from "./StatSelector";
import TeamOrPlayerSelector from "./TeamOrPlayerSelector";

const SCALE = 6;

function getActualScale(availableWidth: number, availableHeight: number) {
  const denom1 = Math.floor(availableWidth / FIELD_HEIGHT);
  const denom2 = Math.floor(availableHeight / FIELD_WIDTH);

  const factor = Math.min(denom1, denom2);

  return factor;
}

export default function CanvasContent({
  matchInfo,
  matchTeams,
}: {
  matchInfo: ReturnType<typeof useMatchInfo>["data"];
  matchTeams: NonNullable<ReturnType<typeof useMatchTeams>["data"]>;
}) {
  const [stageRef, setStageRef] = useState<TStage | null>(null);
  const [scale, setScale] = useState<number>(SCALE);
  const [pitchContainerRef, setPitchContainerRef] =
    useState<HTMLDivElement | null>(null);
  const [homeItemId, setHomeItemId] = useState<number | null>(
    matchInfo?.home_team.home_team_id || null
  );
  const [awayItemId, setAwayItemId] = useState<number | null>(
    matchInfo?.away_team.away_team_id || null
  );
  const [stat, setStat] = useState<(typeof STAT_KEYS)[number] | null>(null);

  const { competitionId, matchId, seasonId } = useParams();

  const { data = { [homeItemId!]: [], [awayItemId!]: [] } } =
    useMatchComparisonEvents({
      competitionId: parseInt(competitionId as string),
      seasonId: parseInt(seasonId as string),
      stat: stat!,
      matchId: matchId as string,
      ids: [homeItemId, awayItemId].filter(Boolean) as number[],
    });

  const homePlayer = matchTeams[0]?.players.find(
    (player) => player.id === homeItemId
  );

  const awayPlayer = matchTeams[1]?.players.find(
    (player) => player.id === awayItemId
  );

  function downloadImage() {
    if (!stageRef) {
      return;
    }

    const container = document.createElement("div");
    const newStage = new TStage({
      width: stageRef.width(),
      height: stageRef.height() + 70,
      container,
    });
    // Create new layer with match and player info
    const newLayer = new TLayer({
      width: stageRef.width(),
      height: 70,
    });
    const matchScoreText = new TText({
      x: 5,
      y: 15,
      text: `${matchInfo?.home_team.home_team_name} ${matchInfo?.home_score} - ${matchInfo?.away_score} ${matchInfo?.away_team.away_team_name}`,
      fontSize: 16,
      fill: "white",
    });
    newLayer.add(matchScoreText);

    const matchDateText = new TText({
      x: 5,
      y: 5,
      text: matchInfo?.match_date,
      fontSize: 10,
      fill: twColors.neutral[400],
    });
    newLayer.add(matchDateText);

    if (homeItemId) {
      const text = homePlayer
        ? `${homePlayer.nickname ?? homePlayer.name}`
        : matchInfo?.home_team.home_team_name;

      const homePlayerText = new TText({
        x: 5,
        y: 35,
        text: text,
        fontSize: 12,
        fill: twColors.violet[500],
      });
      newLayer.add(homePlayerText);

      const homeStatText = EventLegend({
        events: homeItemId ? data[homeItemId] : [],
        color: "white",
        stat,
      });
      const homeStatTextLayer = new TText({
        x: 5,
        y: 50,
        text: homeStatText?.props.children.join(""),
        fontSize: 12,
        fill: "white",
      });
      newLayer.add(homeStatTextLayer);
    }

    if (awayItemId) {
      const text = awayPlayer
        ? `${awayPlayer.nickname ?? awayPlayer.name}`
        : matchInfo?.away_team.away_team_name;

      const awayPlayerText = new TText({
        x: stageRef.width() - 5,
        y: 35,
        text: text,
        fontSize: 12,
        fill: twColors.amber[500],
      });
      awayPlayerText.offsetX(awayPlayerText.width());
      newLayer.add(awayPlayerText);

      const awayStatText = EventLegend({
        events: awayItemId ? data[awayItemId] : [],
        color: "white",
        stat,
      });
      const awayStatTextLayer = new TText({
        x: stageRef.width() - 5,
        y: 50,
        text: awayStatText?.props.children.join(""),
        fontSize: 12,
        fill: "white",
      });
      awayStatTextLayer.offsetX(awayStatTextLayer.width());
      newLayer.add(awayStatTextLayer);
    }

    newStage.add(newLayer);
    // add the content of the original stage
    const layer = stageRef.clone().children[0];
    layer.setPosition({ x: 0, y: 70 });
    layer.scale(stageRef.scale());
    newStage.add(layer);

    const dataURL = newStage.toDataURL({
      pixelRatio: 2,
    });
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "match.png";
    link.click();
  }

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

  return (
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

          <div className="w-full flex-1 relative">
            <div className="absolute top-0 right-0 p-4 z-10">
              <Button onClick={downloadImage} size="sm">
                Export
              </Button>
            </div>
            <Stage
              ref={setStageRef}
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
            <div className="flex flex-col items-center gap-2">
              {homePlayer && homePlayer.img && (
                <ImageNoBackground
                  src={homePlayer.img}
                  width={100}
                  height={100}
                  alt=""
                />
              )}
              <EventLegend
                events={homeItemId ? data[homeItemId] : []}
                color={twColors.violet[500]}
                stat={stat}
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              {awayPlayer && awayPlayer.img && (
                <ImageNoBackground
                  src={awayPlayer.img}
                  width={100}
                  height={100}
                  alt=""
                />
              )}
              <EventLegend
                events={awayItemId ? data[awayItemId] : []}
                color={twColors.amber[500]}
                stat={stat}
              />
            </div>
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
  );
}
