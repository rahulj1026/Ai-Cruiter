import React from "react";
import moment from "moment";
import { Button } from "@/components/ui/button";
import CandidateFeedbackDialog from "./CandidateFeedbackDialog";

function CandidateList({ candidateList }) {
  if (!candidateList || !Array.isArray(candidateList)) {
    return (
      <div className="p-5">
        <h2 className="font-bold my-5">Candidates (0)</h2>
        <p className="text-sm text-gray-500">No candidates found.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-bold my-5">Candidates ({candidateList.length})</h2>
      {candidateList.map((candidate, index) => (
        <div
          key={index}
          className="p-5 flex gap-3 items-center justify-between  bg-white rounded-lg"
        >
          <div className="flex items-center gap-5">
            <h2 className="bg-primary p-3 px-4.5 font-bold text-white rounded-full">
              {candidate?.userName?.[0] || "?"}
            </h2>
            <div>
              <h2 className="font-bold">{candidate?.userName || "Unknown"}</h2>
              <h2 className="text-sm text-gray-500">
                Completed On:{" "}
                {candidate?.created_at
                  ? moment(candidate.created_at).format("MMM DD, yyyy")
                  : "N/A"}
              </h2>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <h2 className="text-green-600">
              {candidate?.feedback?.feedback?.rating?.totalRating || 0}/10
            </h2>

            <CandidateFeedbackDialog candidate={candidate} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default CandidateList;
