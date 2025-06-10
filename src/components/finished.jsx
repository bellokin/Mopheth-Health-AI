import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function FinishedLogs({ state, diagnosis, confidence, actions }) {
  // Sort diagnoses by probability (descending)
  const sortedDiagnoses = Object.entries(diagnosis || {}).sort(
    (a, b) => b[1] - a[1]
  );

  const getConfidenceColor = (level) => {
    switch (level?.toLowerCase()) {
      case "high":
        return "bg-green-100 text-green-800";
      case "moderate":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center">
          <div className="bg-indigo-600 rounded-full p-2 mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-800">Diagnosis Results</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto max-w-4xl w-full mx-auto py-6 px-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Diagnosis Summary */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-indigo-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                  clipRule="evenodd"
                />
              </svg>
              Probable Conditions
            </h2>
            
            <div className="space-y-4">
              {sortedDiagnoses.map(([condition, probability]) => (
                <div key={condition} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-medium text-gray-800">{condition}</h3>
                    <span className="text-sm font-semibold text-indigo-600">
                      {probability}% probability
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-2">Confidence:</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getConfidenceColor(
                        confidence?.[condition]
                      )}`}
                    >
                      {confidence?.[condition] || "Unknown"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-indigo-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clipRule="evenodd"
                />
              </svg>
              Recommended Actions
            </h2>
            <ul className="space-y-2">
              {actions?.map((action, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-blue-700">
                This is a preliminary assessment based on the information provided. 
                It's not a substitute for professional medical advice. Please consult 
                a healthcare provider for an accurate diagnosis and treatment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl w-full mx-auto pb-6 px-4 text-center">
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Start New Diagnosis
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}