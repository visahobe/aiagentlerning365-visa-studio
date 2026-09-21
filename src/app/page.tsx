import { HomeExtra } from "@/components/home-extra";
import { HomeView } from "@/components/home-view";
import { getHomeStats } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const stats = await getHomeStats();
  return (
    <>
      <HomeView stats={stats} />
      <HomeExtra />
    </>
  );
}
