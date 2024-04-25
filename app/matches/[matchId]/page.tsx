"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import TabPasses from "./components/TabPasses";
import { useMatchInfo } from "./hooks";

const scale = 6;

export default function Dashboard({
  params,
}: {
  params: { matchId: string; tab?: string };
  searchParams: URLSearchParams;
}) {
  const router = useRouter();
  // const playerStats = usePlayerStats(params.matchId, selectedPlayerId);
  const matchInfo = useMatchInfo(params.matchId);

  return (
    <main className="w-full h-screen flex flex-col items-center max-w-6xl gap-24 p-8 mx-auto">
      {matchInfo && (
        <header className="flex flex-row w-full items-center gap-12">
          <div className="flex-1 flex flex-row items-center justify-between">
            <h1 className="text-xl font-bold">{matchInfo.home_team}</h1>
            <h2 className="text-3xl font-bold">{matchInfo.home_score}</h2>
          </div>
          <div className="flex flex-col items-center">
            <h3>{matchInfo.match_date}</h3>

            <h4 className="text-sm text-gray-600 leading-none pt-2">
              {matchInfo.competition_stage}
            </h4>
            <h4 className="font-bold">{matchInfo.competition}</h4>
          </div>
          <div className="flex-1 flex flex-row items-center justify-between">
            <h2 className="text-2xl font-bold">{matchInfo.away_score}</h2>
            <h1 className="text-xl font-bold">{matchInfo.away_team}</h1>
          </div>
        </header>
      )}

      <Tabs
        defaultValue="summary"
        className="w-full"
        onValueChange={(value) =>
          router.replace(`/matches/${params.matchId}?tab=${value}`)
        }
      >
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="passes">Passes</TabsTrigger>
        </TabsList>
        <TabsContent value="summary">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="passes">
          <TabPasses matchId={params.matchId} />
        </TabsContent>
      </Tabs>
    </main>
  );
}

// function _Dashboard({ params }: any) {
//   const matchTeams = useMatchTeams(params.matchId);
//   const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
//   const [tab, setTab] = useState<any>("progressive_passes");
//   const playerStats = usePlayerStats(params.matchId, selectedPlayerId);

//   return (
//     <main className="w-full h-screen flex flex-col items-center justify-center">
//       <div className="flex flex-col items-start">
//         <div className="flex flex-row gap-4">
//           {/* {matchTeams[0] && (
//             <TeamPlayers
//               players={matchTeams[0].players}
//               selectedPlayerId={selectedPlayerId}
//               onClick={setSelectedPlayerId}
//             />
//           )} */}

//           <div className="flex flex-col items-start gap-4">
//             {/* <Select
//               options={statsTabs.map((tab) => ({
//                 value: tab,
//                 label: TabToLabel[tab],
//               }))}
//               onChange={(v) => setTab(v.target.value as StatsTab)}
//             /> */}
//             <Stage
//               width={FIELD_WIDTH * scale}
//               height={FIELD_HEIGHT * scale}
//               scaleX={scale}
//               scaleY={scale}
//             >
//               <Layer>
//                 <FieldImage />
//               </Layer>
//               {playerStats && (
//                 <>
//                   {tab === "shots" && (
//                     <Layer>
//                       {playerStats["shots"].map((shot, i) => (
//                         <Shot key={i} {...shot} />
//                       ))}
//                     </Layer>
//                   )}
//                   {/* {tab === "progressive_passes" && (
//                     <Layer>
//                       {playerStats["passes"].map((pass, i) => (
//                         <Pass key={i} {...pass} />
//                       ))}
//                     </Layer>
//                   )} */}
//                   {tab === "carries_and_dribbles" && (
//                     <Layer>
//                       {playerStats["carries"].map((carry, i) => (
//                         <Carry key={i} {...carry} />
//                       ))}
//                       {playerStats["dribbles"].map((dribble, i) => (
//                         <Dribble key={i} {...dribble} />
//                       ))}
//                     </Layer>
//                   )}
//                   {tab === "balls_lost" && (
//                     <Layer>
//                       {playerStats["balls_lost"].map((event, i) => (
//                         <BallLost key={i} {...event} />
//                       ))}
//                     </Layer>
//                   )}
//                   {tab === "defense" && (
//                     <Layer>
//                       {playerStats["defensive_actions"].map((event, i) => (
//                         <DefensiveAction key={i} {...event} />
//                       ))}
//                     </Layer>
//                   )}
//                 </>
//               )}
//             </Stage>
//             {tab === "defense" && <DefensiveActionLegend />}
//           </div>
//           {/* {matchTeams[1] && (
//             <TeamPlayers
//               players={matchTeams[1].players}
//               selectedPlayerId={selectedPlayerId}
//               onClick={setSelectedPlayerId}
//             />
//           )} */}
//           {/* <CanvasField matchTeams={matchTeams as any} /> */}
//         </div>
//       </div>
//     </main>
//   );
// }
