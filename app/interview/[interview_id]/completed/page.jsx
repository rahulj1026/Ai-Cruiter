"use client";

export default function InterviewCompleted() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-lg w-full flex flex-col items-center border border-blue-100">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full w-24 h-24 flex items-center justify-center shadow-lg mb-3">
            <span className="text-5xl font-bold text-white">🎉</span>
          </div>
          <h1 className="text-3xl font-extrabold text-blue-900 mb-2 text-center">
            Interview Completed!
          </h1>
          <p className="text-gray-600 text-lg text-center">
            Thank you for participating.
            <br />
            Your interview session has ended.
            <br />
            <span className="text-blue-700 font-semibold">Best of luck!</span>
          </p>
        </div>
      </div>
    </div>
  );
}
