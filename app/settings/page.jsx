"use client";
import { supabase } from "@/services/supabaseClient";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { useUser } from "@/app/provider";

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useUser();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Sign out failed");
    } else {
      toast.success("Signed out successfully");
      router.replace("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-md w-full flex flex-col items-center border border-blue-100">
        <div className="flex flex-col items-center mb-6">
          {user?.picture ? (
            <img
              src={user.picture}
              alt="User Avatar"
              className="rounded-full w-20 h-20 object-cover mb-3 shadow-lg"
            />
          ) : (
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full w-20 h-20 flex items-center justify-center shadow-lg mb-3">
              <span className="text-4xl font-bold text-white">
                {user?.name?.[0]?.toUpperCase() || "?"}
              </span>
            </div>
          )}
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {user?.name || "User"}
          </h2>
          <p className="text-gray-500 text-sm">{user?.email}</p>
        </div>
        <div className="w-full text-center mb-8">
          <h3 className="text-lg font-semibold text-blue-700 mb-2 flex items-center justify-center gap-2">
            <LogOut className="h-5 w-5 text-blue-500" />
            Ready to sign out?
          </h3>
          <p className="text-gray-600 text-sm">
            You will be securely signed out and redirected to the homepage.
          </p>
        </div>
        <Button
          onClick={handleSignOut}
          className="w-full py-3 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
