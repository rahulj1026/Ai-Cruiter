"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Copy, Send } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

function InterviewCard({ interview, viewDetail = false }) {
  const url = `${window.location.origin}/interview/${interview?.interview_id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  };

  const onSend = () => {
    const subject = encodeURIComponent("AiCruiter Interview Link");
    const body = encodeURIComponent(`Interview Link: ${url}`);

    setTimeout(() => {
      window.location.href = `mailto:rahuljadha7365@gmail.com?subject=${subject}&body=${body}`;
    }, 100);
  };

  return (
    <div className="p-5 bg-white rounded-2xl border shadow-md w-full max-w-xl mx-auto transition-all duration-300">
      {/* Header Row */}
      <div className="flex items-center justify-between flex-wrap">
        <div className="h-10 w-10 bg-primary rounded-full"></div>
        <h2 className="text-sm text-gray-500 mt-2 sm:mt-0">
          {moment(interview?.created_at).format("DD MMM YYYY")}
        </h2>
      </div>

      {/* Job Info */}
      <h2 className="mt-4 font-bold text-lg sm:text-xl">
        {interview?.jobPosition}
      </h2>
      <p className="mt-1 text-gray-500 text-sm sm:text-base flex justify-between ">
        {interview?.duration}
        <span className="text-green-700">
          {interview["interview-feedback"]?.length} Candidates
        </span>
      </p>

      {/* Buttons */}
      {!viewDetail ? (
        <div className="flex flex-col sm:flex-row gap-3 w-full mt-6">
          <Button
            variant="outline"
            className="w-full sm:flex-1 flex items-center justify-center hover:shadow-lg"
            onClick={copyLink}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
          <Button
            className="w-full sm:flex-1 flex items-center justify-center hover:shadow-lg"
            onClick={onSend}
          >
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
        </div>
      ) : (
        <Link
          href={"/scheduled-interview/" + interview?.interview_id + "/details"}
        >
          <Button className="mt-5 w-full" variant="outline">
            View Detail <ArrowRight />
          </Button>
        </Link>
      )}
    </div>
  );
}

export default InterviewCard;
