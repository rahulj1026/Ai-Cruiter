import React, { useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { Download } from "lucide-react";

function CandidateFeedbackDialog({ candidate }) {
  const feedback = candidate?.feedback?.feedback || {};
  const rating = feedback?.rating || {};

  const formatEmailContent = useCallback(() => {
    if (!candidate?.userEmail) return null;

    const subject = "Your Interview Feedback - AiCruiter";
    const message = `
Dear ${candidate?.userName || "Candidate"},

Thank you for participating in the interview. Here is your feedback:

Overall Rating: ${rating?.totalRating || 0}/10

Skills Assessment:
- Technical Skills: ${rating?.technicalSkills?.score || 0}/10
  ${rating?.technicalSkills?.justification || "No feedback provided"}
- Communication: ${rating?.communication?.score || 0}/10
  ${rating?.communication?.justification || "No feedback provided"}
- Problem Solving: ${rating?.problemSolving?.score || 0}/10
  ${rating?.problemSolving?.justification || "No feedback provided"}
- Experience: ${rating?.experience?.score || 0}/10
  ${rating?.experience?.justification || "No feedback provided"}

Performance Summary:
${feedback?.summary || "No summary provided"}

Recommendation:
${feedback?.recommendationMsg || "No recommendation message provided"}

Best regards,
AiCruiter Team`.trim();

    return {
      subject,
      message,
      mailtoLink: `mailto:${candidate.userEmail}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(message)}`,
    };
  }, [candidate, feedback, rating]);

  const handleSendMessage = useCallback(() => {
    if (!candidate?.userEmail) {
      toast.error("No email address available for the candidate");
      return;
    }

    const emailContent = formatEmailContent();
    if (!emailContent) {
      toast.error("Failed to format email content");
      return;
    }

    try {
      // Create a temporary link element
      const link = document.createElement("a");
      link.href = emailContent.mailtoLink;
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Opening email client...");
    } catch (error) {
      console.error("Error opening email client:", error);
      toast.error(
        "Failed to open email client. Please try copying the email address manually: " +
          candidate.userEmail
      );
    }
  }, [candidate, formatEmailContent]);

  // PDF Document Component
  const FeedbackPDF = () => {
    const styles = StyleSheet.create({
      page: {
        padding: 0,
        fontFamily: "Helvetica",
        backgroundColor: "#f8fafc",
      },
      header: {
        backgroundColor: "#2563eb",
        padding: 24,
        flexDirection: "row",
        alignItems: "center",
        color: "#fff",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
      },
      avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#1e40af",
        color: "#fff",
        fontSize: 24,
        fontWeight: 700,
        textAlign: "center",
        textAlignVertical: "center",
        marginRight: 16,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
      },
      headerText: { color: "#fff", fontSize: 18, fontWeight: 700 },
      email: { color: "#dbeafe", fontSize: 10, marginTop: 2 },
      date: { color: "#dbeafe", fontSize: 10, marginTop: 2 },
      section: { margin: 24, marginBottom: 12 },
      sectionTitle: {
        fontSize: 14,
        color: "#2563eb",
        fontWeight: 700,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#dbeafe",
        paddingBottom: 4,
      },
      scoreBox: {
        backgroundColor: "#f1f5f9",
        borderRadius: 8,
        padding: 16,
        alignItems: "center",
        marginBottom: 16,
      },
      score: { fontSize: 32, color: "#2563eb", fontWeight: 700 },
      scoreLabel: { fontSize: 12, color: "#64748b", marginTop: 2 },
      skillRow: { marginBottom: 12 },
      skillNameRow: { flexDirection: "row", justifyContent: "space-between" },
      skillName: { fontSize: 12, fontWeight: 700 },
      skillScore: { fontSize: 12, color: "#2563eb", fontWeight: 700 },
      progressBarBg: {
        width: "100%",
        height: 6,
        backgroundColor: "#e0e7ef",
        borderRadius: 3,
        marginTop: 4,
        marginBottom: 4,
      },
      progressBar: {
        height: 6,
        backgroundColor: "#2563eb",
        borderRadius: 3,
      },
      skillJustification: { fontSize: 10, color: "#334155" },
      summaryBox: {
        backgroundColor: "#f1f5f9",
        borderRadius: 6,
        padding: 12,
        fontSize: 11,
        color: "#334155",
      },
      recommendationBox: {
        backgroundColor:
          feedback?.recommendation === "NO" ||
          feedback?.recommendation === "Not recommended for hire"
            ? "#fee2e2"
            : "#dcfce7",
        borderRadius: 6,
        padding: 14,
        marginTop: 16,
        marginBottom: 24,
      },
      recommendationText: {
        color:
          feedback?.recommendation === "NO" ||
          feedback?.recommendation === "Not recommended for hire"
            ? "#dc2626"
            : "#059669",
        fontWeight: 700,
        fontSize: 13,
        marginBottom: 4,
      },
      recommendationMsg: {
        color:
          feedback?.recommendation === "NO" ||
          feedback?.recommendation === "Not recommended for hire"
            ? "#b91c1c"
            : "#166534",
        fontSize: 11,
      },
    });
    // Helper for progress bar width
    const getBarWidth = (score) =>
      `${
        Math.max(0, Math.min(10, typeof score === "number" ? score : 0)) * 10
      }%`;
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text>{candidate?.userName?.[0]?.toUpperCase() || "?"}</Text>
            </View>
            <View>
              <Text style={styles.headerText}>
                {candidate?.userName || "Unknown"}
              </Text>
              <Text style={styles.email}>{candidate?.userEmail}</Text>
              <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
            </View>
          </View>

          {/* Overall Score */}
          <View style={styles.section}>
            <View style={styles.scoreBox}>
              <Text style={styles.score}>
                {typeof rating?.totalRating === "number"
                  ? rating?.totalRating
                  : 0}
                /10
              </Text>
              <Text style={styles.scoreLabel}>Overall Score</Text>
            </View>
          </View>

          {/* Skills Assessment */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills Assessment</Text>
            {/* Technical Skills */}
            <View style={styles.skillRow}>
              <View style={styles.skillNameRow}>
                <Text style={styles.skillName}>Technical Skills</Text>
                <Text style={styles.skillScore}>
                  {typeof rating?.technicalSkills?.score === "number"
                    ? rating?.technicalSkills?.score
                    : 0}
                  /10
                </Text>
              </View>
              <View style={styles.progressBarBg}>
                <View
                  style={{
                    ...styles.progressBar,
                    width: getBarWidth(rating?.technicalSkills?.score),
                  }}
                />
              </View>
              <Text style={styles.skillJustification}>
                {rating?.technicalSkills?.justification ||
                  "No feedback provided"}
              </Text>
            </View>
            {/* Communication */}
            <View style={styles.skillRow}>
              <View style={styles.skillNameRow}>
                <Text style={styles.skillName}>Communication</Text>
                <Text style={styles.skillScore}>
                  {typeof rating?.communication?.score === "number"
                    ? rating?.communication?.score
                    : 0}
                  /10
                </Text>
              </View>
              <View style={styles.progressBarBg}>
                <View
                  style={{
                    ...styles.progressBar,
                    width: getBarWidth(rating?.communication?.score),
                  }}
                />
              </View>
              <Text style={styles.skillJustification}>
                {rating?.communication?.justification || "No feedback provided"}
              </Text>
            </View>
            {/* Problem Solving */}
            <View style={styles.skillRow}>
              <View style={styles.skillNameRow}>
                <Text style={styles.skillName}>Problem Solving</Text>
                <Text style={styles.skillScore}>
                  {typeof rating?.problemSolving?.score === "number"
                    ? rating?.problemSolving?.score
                    : 0}
                  /10
                </Text>
              </View>
              <View style={styles.progressBarBg}>
                <View
                  style={{
                    ...styles.progressBar,
                    width: getBarWidth(rating?.problemSolving?.score),
                  }}
                />
              </View>
              <Text style={styles.skillJustification}>
                {rating?.problemSolving?.justification ||
                  "No feedback provided"}
              </Text>
            </View>
            {/* Experience */}
            <View style={styles.skillRow}>
              <View style={styles.skillNameRow}>
                <Text style={styles.skillName}>Experience</Text>
                <Text style={styles.skillScore}>
                  {typeof rating?.experience?.score === "number"
                    ? rating?.experience?.score
                    : 0}
                  /10
                </Text>
              </View>
              <View style={styles.progressBarBg}>
                <View
                  style={{
                    ...styles.progressBar,
                    width: getBarWidth(rating?.experience?.score),
                  }}
                />
              </View>
              <Text style={styles.skillJustification}>
                {rating?.experience?.justification || "No feedback provided"}
              </Text>
            </View>
          </View>

          {/* Performance Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance Summary</Text>
            <Text style={styles.summaryBox}>
              {feedback?.summary || "No summary provided"}
            </Text>
          </View>

          {/* Recommendation */}
          <View style={styles.section}>
            <View style={styles.recommendationBox}>
              <Text style={styles.recommendationText}>Recommendation</Text>
              <Text style={styles.recommendationMsg}>
                {feedback?.recommendationMsg ||
                  "No recommendation message provided"}
              </Text>
            </View>
          </View>
        </Page>
      </Document>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-primary">
          View Report
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Feedback</DialogTitle>
          <DialogDescription asChild>
            <div className="mt-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-5">
                  <h2 className="bg-primary p-3 px-4.5 font-bold text-white rounded-full">
                    {candidate?.userName?.[0] || "?"}
                  </h2>
                  <div>
                    <h2 className="font-bold">
                      {candidate?.userName || "Unknown"}
                    </h2>
                    <h2 className="text-sm text-gray-500">
                      {candidate?.userEmail}
                    </h2>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <h2 className="text-primary text-2xl font-bold">
                    {rating?.totalRating || 0}/10
                  </h2>
                </div>
              </div>
              <div className="mt-5 ">
                <h2 className="font-bold">Skills Assessment</h2>
                <div className="mt-3 grid grid-cols-2 gap-5">
                  <div>
                    <h2 className="flex justify-between">
                      Technical Skills
                      <span>{rating?.technicalSkills?.score || 0}/10</span>
                    </h2>
                    <Progress
                      value={(rating?.technicalSkills?.score || 0) * 10}
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {rating?.technicalSkills?.justification ||
                        "No feedback provided"}
                    </p>
                  </div>
                  <div>
                    <h2 className="flex justify-between">
                      Communication
                      <span>{rating?.communication?.score || 0}/10</span>
                    </h2>
                    <Progress
                      value={(rating?.communication?.score || 0) * 10}
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {rating?.communication?.justification ||
                        "No feedback provided"}
                    </p>
                  </div>
                  <div>
                    <h2 className="flex justify-between">
                      Problem Solving
                      <span>{rating?.problemSolving?.score || 0}/10</span>
                    </h2>
                    <Progress
                      value={(rating?.problemSolving?.score || 0) * 10}
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {rating?.problemSolving?.justification ||
                        "No feedback provided"}
                    </p>
                  </div>
                  <div>
                    <h2 className="flex justify-between">
                      Experience
                      <span>{rating?.experience?.score || 0}/10</span>
                    </h2>
                    <Progress
                      value={(rating?.experience?.score || 0) * 10}
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {rating?.experience?.justification ||
                        "No feedback provided"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <h2 className="font-bold">Performance Summary</h2>
                <div className="p-5 bg-secondary mt-3 rounded-md">
                  {feedback?.summary
                    ?.split("\n")
                    .map((line, index) => <p key={index}>{line}</p>) ||
                    "No summary provided"}
                </div>
              </div>

              <div
                className={`p-5 mt-10 flex items-center justify-between rounded-md ${
                  feedback?.recommendation === "NO" ||
                  feedback?.recommendation === "Not recommended for hire"
                    ? "bg-red-200"
                    : "bg-green-200"
                }`}
              >
                <div>
                  <h2
                    className={` font-bold ${
                      feedback?.recommendation === "NO" ||
                      feedback?.recommendation === "Not recommended for hire"
                        ? "text-red-700"
                        : "text-green-700"
                    }`}
                  >
                    Recommendation Msg:
                  </h2>
                  <p
                    className={`${
                      feedback?.recommendation === "NO" ||
                      feedback?.recommendation === "Not recommended for hire"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {feedback?.recommendationMsg ||
                      "No recommendation message provided"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleSendMessage}
                    className={`$${
                      feedback?.recommendation === "NO" ||
                      feedback?.recommendation === "Not recommended for hire"
                        ? "bg-red-700"
                        : "bg-green-700"
                    }`}
                  >
                    Send Msg
                  </Button>
                  <PDFDownloadLink
                    document={<FeedbackPDF />}
                    fileName={`interview-feedback-${
                      candidate?.userName || "candidate"
                    }.pdf`}
                  >
                    {({ loading }) => (
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        disabled={loading}
                      >
                        <Download className="h-4 w-4" />
                        {loading ? "Generating..." : "Download PDF"}
                      </Button>
                    )}
                  </PDFDownloadLink>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default CandidateFeedbackDialog;
