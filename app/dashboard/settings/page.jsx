"use client";
import { supabase } from "@/services/supabaseClient";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SettingsPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Sign out failed");
    } else {
      toast.success("Signed out successfully");
      router.replace("/login"); // Change to your login route if different
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <Button
        onClick={handleSignOut}
        className="bg-red-600 hover:bg-red-700 text-white"
      >
        Sign Out
      </Button>
    </div>
  );
}
