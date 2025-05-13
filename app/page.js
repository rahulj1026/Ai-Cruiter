"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/services/supabaseClient";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Get the session using the correct method
    const getSession = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user); // Set the user from the session if authenticated
      }
    };

    // Check if the user is already logged in when the component mounts
    getSession();
  }, []);

  // If the user is authenticated, redirect to /dashboard
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="text-2xl font-bold text-blue-600">AI-Cruiter</div>
        <nav className="space-x-4 hidden md:block">
          <Link href="#features">Features</Link>
          <Link href="#demo">Demo</Link>
          <Link href="#contact">Contact</Link>
        </nav>
        {!user ? (
          <Button asChild>
            <Link href="/auth">Get Started</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href="/dashboard">Create Interview</Link>
          </Button>
        )}
      </header>

      {/* Hero Section */}
      <section className="text-center py-24 px-6">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          AI-Powered Interview Assistant
        </h1>
        <p className="mt-6 text-lg max-w-2xl mx-auto">
          Create job interviews instantly using the power of AI. Save time, find better candidates.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          {!user ? (
            <Button variant="outline" asChild>
              <Link href="/auth">Sign in to Get Started</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/dashboard">Create Interview</Link>
            </Button>
          )}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">Why Choose AI-Cruiter?</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <Feature
              title="Generate Interviews Instantly"
              desc="No more manual questions—let AI do the work."
              icon="🧠"
            />
            <Feature
              title="Evaluate Smartly"
              desc="Use AI-generated metrics to make better hiring decisions."
              icon="📊"
            />
            <Feature
              title="Save Time & Money"
              desc="Reduce screening time by up to 70%."
              icon="⏱️"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} AI Recruiter. All rights reserved.
      </footer>
    </div>
  );
}

function Feature({ title, desc, icon }) {
  return (
    <div className="bg-blue-50 p-6 rounded-2xl shadow-md">
      <div className="text-4xl">{icon}</div>
      <h3 className="text-xl font-semibold mt-4">{title}</h3>
      <p className="mt-2 text-sm">{desc}</p>
    </div>
  );
}
