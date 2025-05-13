import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2, Loader2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import QuestionListContainer from "./QuestionListContainer";
import { useUser } from "@/app/provider";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/services/supabaseClient";

function QuestionList({ formData, onCreateLink }) {
  const [loading, setLoading] = useState(true);
  const [questionList, setQuestionList] = useState([]);
  const { user } = useUser();
  const [saveLoading, setSaveLoading] = useState(false);
  useEffect(() => {
    if (formData) {
      GenerateQuestionList();
    }
  }, [formData]);

  const GenerateQuestionList = async () => {
    setLoading(true);
    setQuestionList([]); // Clear old questions on re-generate

    try {
      const result = await axios.post("/api/ai-model", formData);
      let content = result.data?.content || "";

      // Strip code block markdown or formatting issues
      content = content.replace(/```json|```/g, "").trim();

      const parsed = JSON.parse(content);

      if (parsed?.interviewQuestions?.length > 0) {
        setQuestionList(parsed.interviewQuestions);
      } else {
        toast.warning("No interview questions found in the response.");
      }
    } catch (e) {
      console.error("Error generating questions:", e);
      toast.error("Failed to generate questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async () => {
    setSaveLoading(true);
    const interview_id = uuidv4();

    const { data, error } = await supabase
      .from("interviews")
      .insert([
        {
          ...formData,
          questionList: questionList,
          userEmail: user?.email,
          interview_id: interview_id,
        },
      ])
      .select();

    //Update User Credits
    const userUpdate = await supabase
      .from("Users")
      .update({ credits: Number(user?.credits) - 1 })
      .eq("email", user?.email)
      .select();

    console.log(userUpdate);

    setSaveLoading(false);

    onCreateLink(interview_id);
  };

  return (
    <div>
      {loading && (
        <div className="p-5 bg-blue-50 rounded-xl border border-primary flex gap-5 items-center">
          <Loader2Icon className="animate-spin" />
          <div>
            <h2 className="font-medium">Generating Interview Questions...</h2>
            <p className="text-primary">
              Our AI is crafting personalized questions based on your job
              position.
            </p>
          </div>
        </div>
      )}

      {!loading && questionList?.length === 0 && (
        <div className="p-5 border rounded-xl text-sm text-gray-500 text-center">
          No questions generated. Please try again or refine your inputs.
        </div>
      )}

      {!loading && questionList?.length > 0 && (
        <div>
          <QuestionListContainer questionList={questionList} />
        </div>
      )}

      <div className="flex justify-end mt-10">
        <Button onClick={() => onFinish()} disabled={saveLoading}>
          {saveLoading && <Loader2 className="animate-spin" />}
          Create Interview Link & Finish
        </Button>
      </div>
    </div>
  );
}

export default QuestionList;
