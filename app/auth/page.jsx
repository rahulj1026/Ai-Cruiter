"use client";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supabaseClient";

function Login() {
  /**
   * Used to Sign In with Google
   */

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/dashboard`,
      },
    });

    if (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center border rounded-2xl p-8">
        <Image
          src={"/logo.png"}
          alt="logo"
          width={100}
          height={100}
          className="w-[180px] "
        />

        <div className="flex items-center flex-col">
          <Image
            src={"/login.png"}
            alt="login"
            width={600}
            height={400}
            className="w-[400px] h-[250px] rounded-2xl"
          />
          <h2 className="text-wxl font-bold text-center mt-5">
            Welcome to AiCruiter
          </h2>
          <p className="text-gray-500 text-center">
            Sign in with Google Authentication
          </p>
          <Button className="mt-7 w-full" onClick={signInWithGoogle}>
            Login With Google{" "}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
