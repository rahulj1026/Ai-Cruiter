"use client";
import { InterviewDataContext } from "@/context/InterviewDataContext";
import {
  Loader2Icon,
  Mic,
  Phone,
  Timer,
  Video,
  VideoOff,
  FileText,
} from "lucide-react";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import AlertConfirmation from "./_componenets/AlertConfirmation";
import { toast } from "sonner";
import axios from "axios";
import { supabase } from "@/services/supabaseClient";
import { useParams, useRouter } from "next/navigation";
import TimerComponent from "./_componenets/TimerComponent";

function StartInterview() {
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const videoRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);

  const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
  const [activeUser, setActiveUser] = useState(false);
  const [conversation, setConversation] = useState();
  const { interview_id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [callEnd, setCallEnd] = useState(false);

  // Feedback generation guard
  const hasGeneratedFeedback = useRef(false);
  const switchCount = useRef(0);

  useEffect(() => {
    if (interviewInfo) {
      startCall();
      initializeCamera();
    }
  }, [interviewInfo]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        switchCount.current += 1;
        alert("Tab switching is not allowed during the interview!");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast.error("Could not access camera. Please check permissions.");
    }
  };

  const toggleCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getVideoTracks();
      tracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsCameraOn(!isCameraOn);
    }
  };

  const toggleMute = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getAudioTracks();
      tracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const startCall = () => {
    // Format questions with their types
    const formattedQuestions = interviewInfo?.interviewData?.questionList
      .map((item, index) => {
        return `${index + 1}. [${item.type}] ${item.question}`;
      })
      .join("\n");

    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage:
        "Hi " +
        interviewInfo?.userName +
        ", how are you? Ready for your interview on " +
        interviewInfo?.interviewData?.jobPosition,
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      voice: {
        provider: "playht",
        voiceId: "jennifer",
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an AI voice assistant conducting mock interviews with candidates. Your job is to ask the candidate one question at a time from the following list of questions:

${formattedQuestions}

IMPORTANT INSTRUCTIONS:
1. After asking each question, wait for the candidate to respond.
2. Once the candidate finishes answering, ask the next question from the list in order.
3. Do not repeat any questions and ask only one question at a time.
4. If the candidate says any of these phrases, immediately end the interview:
   - "end the interview"
   - "stop the interview"
   - "cut the call"
   - "end the call"
   - "I want to stop"
   - "I want to end"
   - "let's end this"
   - "that's enough"
5. When ending the interview, say "Thank you for your time. The interview is now concluded." and then trigger the end_interview action.
6. Once all questions are asked, say thank you and end the interview.
7. Be polite and encouraging throughout the conversation.
8. If the candidate is not responding or seems disengaged, you can politely remind them to participate.
9. Maintain the order of questions as listed above.
10. Do not skip any questions unless the interview is ended early.

Remember to use the end_interview action when the candidate requests to end the interview or when all questions are completed.`,
          },
        ],
        functions: [
          {
            name: "end_interview",
            description: "End the interview session",
            parameters: {
              type: "object",
              properties: {},
              required: [],
            },
          },
        ],
      },
    };

    vapi.start(assistantOptions);
  };

  const stopInterview = async () => {
    try {
      setLoading(true);

      // Stop all media tracks
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }

      try {
        // Stop the Vapi call
        await vapi.stop();
      } catch (vapiError) {
        console.warn("Error stopping Vapi call:", vapiError);
        // Continue with cleanup even if Vapi stop fails
      }

      setCallEnd(true);

      // Generate feedback
      await handleGenerateFeedback();

      // Redirect to completed page
      router.replace("/interview/" + interview_id + "/completed");
    } catch (error) {
      console.error("Error stopping interview:", error);
      toast.error("Error ending interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = (message) => {
    if (message?.conversation) {
      const convoString = JSON.stringify(message.conversation);
      setConversation(convoString);

      // Update question counter if it's an AI question
      const lastMessage = message.conversation[message.conversation.length - 1];
      if (lastMessage?.role === "assistant") {
        setCurrentQuestion((prev) => prev + 1);
      }
    }
  };

  const handleGenerateFeedback = async () => {
    if (hasGeneratedFeedback.current) {
      console.log("Feedback already generated. Skipping duplicate.");
      return;
    }

    hasGeneratedFeedback.current = true;
    setLoading(true);

    try {
      const result = await axios.post("/api/ai-feedback", {
        conversation: conversation,
      });

      const content = result.data.content;
      const cleanedContent = content.replace("```json", "").replace("```", "");

      const { data, error } = await supabase
        .from("interview-feedback")
        .insert([
          {
            userName: interviewInfo?.userName,
            userEmail: interviewInfo?.userEmail,
            interview_id: interview_id,
            feedback: JSON.parse(cleanedContent),
            recommended: false,
          },
        ])
        .select();

      if (error) throw error;
      router.replace("/interview/" + interview_id + "/completed");
    } catch (err) {
      console.error("Feedback generation error:", err);
      toast.error("Failed to generate feedback.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleMessage = (message) => {
      if (message?.conversation) {
        const convoString = JSON.stringify(message.conversation);
        setConversation(convoString);

        // Update question counter if it's an AI question
        const lastMessage =
          message.conversation[message.conversation.length - 1];
        if (lastMessage?.role === "assistant") {
          setCurrentQuestion((prev) => prev + 1);
        }
      }
    };

    const handleCallStart = () => {
      toast("Call Connected...");
    };

    const handleSpeechStart = () => {
      setActiveUser(false);
    };

    const handleSpeechEnd = () => {
      setActiveUser(true);
    };

    const handleCallEnd = () => {
      toast("Interview Ended");
      handleGenerateFeedback();
    };

    const handleFunctionCall = async (functionCall) => {
      if (functionCall.name === "end_interview") {
        await stopInterview();
      }
    };

    const handleError = (error) => {
      console.warn("Vapi error:", error);
      if (error.message?.includes("Meeting has ended")) {
        toast.error("Interview session ended unexpectedly");
        stopInterview();
      }
    };

    // Attach event listeners
    vapi.on("message", handleMessage);
    vapi.on("call-start", handleCallStart);
    vapi.on("speech-start", handleSpeechStart);
    vapi.on("speech-end", handleSpeechEnd);
    vapi.on("call-end", handleCallEnd);
    vapi.on("function-call", handleFunctionCall);
    vapi.on("error", handleError);

    // Cleanup listeners on unmount
    return () => {
      vapi.off("message", handleMessage);
      vapi.off("call-start", handleCallStart);
      vapi.off("speech-start", handleSpeechStart);
      vapi.off("speech-end", handleSpeechEnd);
      vapi.off("call-end", handleCallEnd);
      vapi.off("function-call", handleFunctionCall);
      vapi.off("error", handleError);
    };
  }, []);

  return (
    <div className="p-20 lg-px-48 xl:px-56">
      <h2 className="font-bold text-xl flex justify-between">
        AI Interview Session
        <span className="flex gap-2 items-center">
          <Timer />
          <TimerComponent start={true} />
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-5">
        <div className="bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center">
          <div className="relative">
            {!activeUser && (
              <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping" />
            )}
            <Image
              src={"/ai.png"}
              alt="ai"
              width={100}
              height={100}
              className="w-[60px] h-[60px] rounded-full object-cover"
            />
          </div>
          <h2>AI Recruiter</h2>
        </div>

        <div className="bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center relative overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isMuted}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4">
            <h2 className="text-white font-bold">{interviewInfo?.userName}</h2>
          </div>
        </div>
      </div>

      {/* Notes Panel */}
      <div className="mt-5 bg-white p-4 rounded-lg border">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold">Interview Notes</h3>
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="text-primary hover:text-primary/80"
          >
            {showNotes ? "Hide Notes" : "Show Notes"}
          </button>
        </div>
        {showNotes && (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-32 p-2 border rounded"
            placeholder="Take notes during the interview..."
          />
        )}
      </div>

      <div className="flex items-center gap-5 justify-center mt-7">
        <button
          onClick={toggleMute}
          className={`h-12 w-12 p-3 rounded-full cursor-pointer ${
            isMuted ? "bg-red-500" : "bg-gray-500"
          } text-white`}
        >
          <Mic className={isMuted ? "line-through" : ""} />
        </button>
        <button
          onClick={toggleCamera}
          className={`h-12 w-12 p-3 rounded-full cursor-pointer ${
            !isCameraOn ? "bg-red-500" : "bg-gray-500"
          } text-white`}
        >
          {isCameraOn ? <Video /> : <VideoOff />}
        </button>
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="h-12 w-12 p-3 bg-gray-500 text-white rounded-full cursor-pointer"
        >
          <FileText />
        </button>
        <AlertConfirmation stopInterview={stopInterview}>
          {!loading ? (
            <Phone
              className="h-12 w-12 p-3 bg-red-500 text-white rounded-full cursor-pointer"
              onClick={stopInterview}
            />
          ) : (
            <Loader2Icon className="animate-spin" />
          )}
        </AlertConfirmation>
      </div>

      <h2 className="text-sm text-gray-400 text-center mt-5">
        Interview in Progress...
      </h2>
    </div>
  );
}

export default StartInterview;
