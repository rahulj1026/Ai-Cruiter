"use client";
import { useEffect, useState, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import { InterviewDataContext } from "@/context/InterviewDataContext";
import { toast } from "sonner";

export default function InterviewPage() {
  const { interview_id } = useParams();
  const router = useRouter();
  const { setInterviewInfo } = useContext(InterviewDataContext);
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchInterviewData = async () => {
      try {
        const { data, error } = await supabase
          .from("interviews")
          .select("*")
          .eq("interview_id", interview_id)
          .single();
        if (error) throw error;
        if (!data) {
          toast.error("Interview not found");
          return;
        }
        setInterview(data);
      } catch (error) {
        console.error("Error fetching interview:", error);
        toast.error("Failed to load interview");
      } finally {
        setLoading(false);
      }
    };
    fetchInterviewData();
  }, [interview_id]);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please enter your name and email");
      return;
    }
    setSubmitting(true);
    setInterviewInfo({
      interviewData: interview,
      userName: name.trim(),
      userEmail: email.trim(),
    });
    router.replace(`/interview/${interview_id}/start`);
  };

  function isValidEmail(email) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-lg w-full flex flex-col items-center border border-blue-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (!interview) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleJoin}
        className="bg-white shadow-2xl rounded-3xl p-10 max-w-xl w-full flex flex-col items-center border border-blue-100"
      >
        <img src="/logo.png" alt="logo" className="h-10 mb-2" />
        <h2 className="font-bold text-xl mb-1">
          AI-Powered Interview Platform
        </h2>
        <img src="/interview_join.png" alt="interview" className="w-48 my-4" />
        <div className="text-center mb-4">
          <h2 className="font-bold text-2xl">{interview.jobPosition}</h2>
          <div className="flex items-center justify-center gap-2 text-gray-500 mt-1">
            <span>🕒</span>
            <span>{interview.duration} Min</span>
          </div>
        </div>
        <h2 className="text-lg font-bold mb-2">Enter Your Email ID</h2>
        <input
          className="w-full border rounded px-3 py-2 mb-3"
          placeholder="e.g. john@gmail.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <h2 className="text-lg font-bold mb-2">Enter Your Name</h2>
        <input
          className="w-full border rounded px-3 py-2 mb-3"
          placeholder="e.g. John Smith"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className="w-full bg-blue-50 rounded p-3 mb-4 text-sm">
          <b>Before you begin</b>
          <ul className="list-disc ml-5 mt-1 text-gray-700">
            <li>Test your camera and microphone</li>
            <li>Ensure you have a stable internet connection</li>
            <li>Find a Quiet place for interview</li>
          </ul>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-400 text-white font-semibold py-2 rounded mt-2 disabled:opacity-60"
          disabled={!name.trim() || !isValidEmail(email) || submitting}
        >
          Join Interview
        </button>
      </form>
    </div>
  );
}
