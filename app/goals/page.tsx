import dynamic from "next/dynamic";

const GoalsTab = dynamic(import("./components/GoalsTab"), { ssr: false });

export default async function Goals() {
  const goals = await fetch(
    "http://localhost:3000/api/matches/3794686/goals"
  ).then(async (res) => {
    const goals = await res.json();
    // const result: { [key: string]: any } = {};
    // Object.keys(goals).forEach((key) => {
    //   result[key] = JSON.parse(goals[key]);
    // });
    return JSON.parse(goals);
  });

  return (
    <main>
      <GoalsTab goals={goals} />
    </main>
  );
}
