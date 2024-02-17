import dynamic from "next/dynamic";
import ChartProyekFilter from "./_components/chart-filter";

const Charts = dynamic(() => import("./_components/charts"), {
  ssr: false,
});

export default async function DashboardPage() {
  return (
    <div className="flex flex-col space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Page</h1>

      <div className="space-x-12 flex flex-row">
        <ChartProyekFilter />
      </div>

      <Charts />
    </div>
  );
}
