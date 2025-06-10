import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FinishedLogs from "./finished";

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationComplete, setConversationComplete] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const messageBoxRef = useRef(null);

  // Predefined symptom options
  const symptomOptions = [
    "I have a headache",
    "I have a cold",
    "I have a sore throat",
    "I have a fever",
    "I feel fatigued",
    "I have a cough",
  ];

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("https://healthai-1.onrender.com/health/api/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          userId: "user123",  // Added required userId field
          message: input      // Changed from 'content' to 'message'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data) {
        // Mark conversation as complete if flagged
        if (data.conversation_complete === true) {
          setConversationComplete(true);
        }

        // Store the response data
        setResponseData(data);

        // Optionally append the next question if present
        if (data.next_question) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: data.next_question }
          ]);
        }
      } else {
        // Handle completely missing or invalid response
        const aiMessage = "No response received.";
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: aiMessage }
        ]);
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle clicking a symptom option to auto-fill the textarea
  const handleOptionClick = (symptom) => {
    setInput(symptom);
  };

  // If conversation is complete, render FinishedLogs
  if (conversationComplete && responseData) {
    return (
      <FinishedLogs
        state={responseData}
        diagnosis={responseData.diagnosis}
        confidence={responseData.confidence}
        actions={responseData.actions}
      />
    );
  }

  // Otherwise, render the chat interface
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
          <h1 className="text-xl font-semibold text-gray-800">Mophets HealthAI Diagnosis</h1>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden max-w-4xl w-full mx-auto py-6 px-4">
        <div
          ref={messageBoxRef}
          className="h-full overflow-y-auto rounded-lg bg-white shadow-sm p-4 space-y-4"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mb-4 text-indigo-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <h3 className="text-lg font-medium mb-1">Welcome to HealthAI</h3>
              <p className="max-w-md">
                Describe your symptoms and I'll help diagnose your condition.
                For example: "My throat has been sore for 3 days."
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none px-4 py-2">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="max-w-4xl w-full mx-auto pb-6 px-4">
        {/* Symptom Options */}
        <div className="mb-4 flex flex-wrap gap-2">
          {symptomOptions.map((symptom, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(symptom)}
              className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              {symptom}
            </button>
          ))}
        </div>

        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your symptoms..."
            className="w-full rounded-lg border border-gray-300 shadow-sm py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            rows="2"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className={`absolute right-3 bottom-3 p-2 rounded-full ${
              isLoading || !input.trim()
                ? "bg-gray-300 text-gray-500"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            } transition-colors`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          HealthAI provides preliminary information only. Always consult a doctor for medical advice.
        </p>
      </div>
    </div>
  );
}