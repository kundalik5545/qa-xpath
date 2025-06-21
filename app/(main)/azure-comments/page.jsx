"use client";
import React from "react";
import { toast } from "sonner";

/**
 * AzureComments is a React functional component that renders a container
 * for displaying Azure-related comments. It includes a heading and a placeholder
 * div for future comment content.
 *
 * @component
 * @returns {JSX.Element} The rendered AzureComments component.
 */

const AzureComments = () => {
  // Copy to clipboard handler
  const handleCopy = async (comment) => {
    try {
      await navigator.clipboard.writeText(comment);
      toast.success("Comment copied to clipboard!");
    } catch (err) {
      // fallback or error handling
      alert("Failed to copy!");
    }
  };

  return (
    <div
      className="container min-h-screen mx-auto pt-5 flex flex-col items-center pb-4"
      id="azure-comments"
    >
      <h2 className="text-2xl font-semibold mb-6">Azure Comments</h2>
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {comments.map((comment, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-lg shadow p-4 flex flex-col justify-between"
          >
            <pre className="text-gray-800 whitespace-pre-wrap">{comment}</pre>
            <button
              onClick={() => handleCopy(comment)}
              className="mt-4 px-3 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-sm font-medium transition self-end"
              title="Copy comment"
            >
              Copy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AzureComments;

// Predefined comments array
const comments = [
  `Hi @username
  Completed testing for the new feature. Everything looks good!
  No Issue found. Attached testing results for your reference.
  Closing this QA task.
  
  Thanks,
  Kundalik
  
  FYI - @Ni @Rohan`,
  `👉 Steps To Reproduce:
1. Go to Scheme Level - 
2.  
3.  

👉 Expected: Show proper error

👉 Actual: Page reloads without any message.`,
  "Great work! 🚀",
  "Please add more details here.",
  "Can you provide an example?",
  "This needs some refactoring.",
  "Test case passed successfully. ✅",
  "Found a bug during execution. Please check the logs.",
  "Unexpected behavior observed on clicking the button.",
  "UI alignment issue on smaller screen sizes.",
  "Please handle null/undefined values here.",
  "Validation is missing for this input field.",
  "Can we improve the error message for better clarity?",
  "Response time is too high — consider optimizing the API.",
  "Test data is not consistent; needs correction.",
  `Found an issue during boundary value testing:
- Input: 0
- Expected: Validation error
- Actual: Input accepted.`,
  "Please add automation coverage for this scenario.",
  "Functionality working as expected across browsers. ✅",
  "This is a flaky test — passes sometimes and fails randomly.",
  "Add screenshots for failed steps in the report.",
  "Consider adding negative test cases for this flow.",
  "Please re-run the test with latest build. Might be fixed.",
  "Test blocked due to unavailable test environment.",
  "Ambiguous requirement — needs clarification from BA/PO.",
  "Edge case not handled when input exceeds character limit.",
];
