import { getCurrentUser } from "@/lib/queries";
import ProfileSetupForm from "@/components/pages/ProfileSetupForm";

export default async function SetupPage() {
  const user = await getCurrentUser();

  const initialName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    "";
  const initialAvatar =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    null;

  return (
    <ProfileSetupForm initialName={initialName} initialAvatar={initialAvatar} />
  );
}
