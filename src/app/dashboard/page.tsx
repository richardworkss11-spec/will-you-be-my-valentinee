import type { Metadata } from "next";
import { getCurrentUser, getProfileByUserId, getAllValentinesForOwner, getPrivateMessages, getUnreadMessageCount } from "@/lib/queries";
import { redirect } from "next/navigation";
import DashboardView from "@/components/pages/DashboardView";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const profile = await getProfileByUserId(user.id);
  if (!profile) redirect("/setup");

  const [valentines, messages, unreadCount] = await Promise.all([
    getAllValentinesForOwner(profile.id),
    getPrivateMessages(profile.id),
    getUnreadMessageCount(profile.id),
  ]);

  return <DashboardView profile={profile} valentines={valentines} messages={messages} unreadCount={unreadCount} />;
}
