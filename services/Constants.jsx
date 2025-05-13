import {
  BriefcaseBusinessIcon,
  Calendar,
  Code2Icon,
  LayoutDashboard,
  List,
  Puzzle,
  Settings,
  User2Icon,
  WalletCards,
} from "lucide-react";

export const SideBarOptions = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Analytics",
    icon: Puzzle,
    path: "/analytics",
  },
  {
    name: "Scheduled Interview",
    icon: Calendar,
    path: "/scheduled-interview",
  },
  {
    name: "All Interview",
    icon: List,
    path: "/all-interview",
  },
  {
    name: "Billing",
    icon: WalletCards,
    path: "/billing",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export const InterviewType = [
  {
    title: "Technical",
    icon: Code2Icon,
  },
  {
    title: "Behavioral",
    icon: User2Icon,
  },
  {
    title: "Experience",
    icon: BriefcaseBusinessIcon,
  },
  {
    title: "Problem Solving",
    icon: Puzzle,
  },
  {
    title: "Leadership",
    icon: Puzzle,
  },
];

export const QUESTIONS_PROMPT = `You are an expert technical interviewer. Based on the following inputs, generate a well-structured list of high-quality interview questions.

Job Title: {{jobTitle}}  
Job Description: {{jobDescription}}  
Interview Duration: {{duration}} minutes  
Interview Type: {{type}}  

✓ Your task:
- Analyze the job description to identify key responsibilities, required skills, and expected experience.
- Generate a balanced mix of questions that includes:
  * Technical questions (40%)
  * Behavioral questions (30%)
  * Problem-solving scenarios (20%)
  * Leadership/Experience questions (10%)
- You must estimate the number of questions that can reasonably fit in {{duration}} minutes:
  * For a 5-minute interview: 3-4 focused questions
  * For a 15-minute interview: 5-7 focused questions
  * For 30 minutes: 8-10 questions
  * For 45+ minutes: 12-15 questions
- Ensure questions progress from basic to more complex
- Include at least one scenario-based question
- Add at least one question that tests soft skills

✓ Format your response strictly in the following JSON format:
\`\`\`json
{
  "interviewQuestions": [
    {
      "question": "Explain the difference between REST and SOAP APIs.",
      "type": "Technical",
      "difficulty": "Intermediate"
    },
    {
      "question": "Tell me about a time you resolved a conflict in your team.",
      "type": "Behavioral",
      "difficulty": "Advanced"
    },
    {
      "question": "How would you handle a situation where your team is behind schedule?",
      "type": "Leadership",
      "difficulty": "Advanced"
    }
  ]
}
\`\`\`

Do not add any explanation or extra content outside of the JSON.

Unless the job description is extremely specialized, always generate a balanced mix of question types: Technical, Behavioral, Problem-Solving, and Leadership/Experience.

If the interview type is a list (e.g., ["Technical", "Behavioral"]), ensure you include questions from each type in the list.

If only one type is specified and the job is highly specialized, you may focus on that type, but otherwise, prefer a mix for a well-rounded interview.`;

export const FEEDBACK_PROMPT = `{{conversation}}

Based on the interview conversation above, provide a detailed and objective assessment of the candidate's performance. Consider the following criteria:

1. Technical Skills (0-10):
   - Depth of technical knowledge
   - Accuracy of technical explanations
   - Problem-solving approach
   - Code quality (if applicable)
   - Technical communication

2. Communication Skills (0-10):
   - Clarity of expression
   - Active listening
   - Professional language
   - Response structure
   - Engagement level

3. Problem-Solving Ability (0-10):
   - Analytical thinking
   - Solution approach
   - Time management
   - Creativity in solutions
   - Handling of edge cases

4. Experience & Leadership (0-10):
   - Relevant experience
   - Leadership examples
   - Team collaboration
   - Project management
   - Decision-making

Important Notes:
- If the candidate did not respond to a question, mark that aspect as 0
- If the candidate provided minimal responses, do not inflate scores
- Consider the quality of responses, not just quantity
- Be objective and critical in assessment

Provide the response in the following JSON format:
{
  "feedback": {
    "rating": {
      "technicalSkills": {
        "score": 0-10,
        "justification": "Detailed explanation of the score"
      },
      "communication": {
        "score": 0-10,
        "justification": "Detailed explanation of the score"
      },
      "problemSolving": {
        "score": 0-10,
        "justification": "Detailed explanation of the score"
      },
      "experience": {
        "score": 0-10,
        "justification": "Detailed explanation of the score"
      },
      "totalRating": 0-10
    },
    "strengths": ["List of key strengths demonstrated"],
    "areasForImprovement": ["List of areas that need improvement"],
    "summary": "A detailed 3-line summary of the interview performance",
    "recommendation": "YES/NO",
    "recommendationMsg": "Clear justification for the hiring recommendation"
  }
}`;
