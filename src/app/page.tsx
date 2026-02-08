import { redirect } from "next/navigation";
import { getCurrentUser, getProfileByUserId } from "@/lib/queries";
import HomePage from "@/components/pages/HomePage";

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    const profile = await getProfileByUserId(user.id);
    if (profile) {
      redirect("/dashboard");
    } else {
      redirect("/setup");
    }
  }

  return <HomePage />;
}
