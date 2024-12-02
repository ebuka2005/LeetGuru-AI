"use client";
import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 Hey there! Ready to crush some leetcode problems? Let's make interview prep fun and engaging! What would you like to practice today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

   // Create a reference to the chat container
   const chatContainerRef = useRef(null);

   // Scroll to the bottom whenever messages change
   useEffect(() => {
     if (chatContainerRef.current) {
       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
     }
   }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Send the user input to the backend API
      const response = await axios.post("/api/ask", {
        message: input, // Send input as JSON
      });
      

      // Extract the assistant's reply from the backend response
      const assistantMessage = { role: "assistant", content: response.data.reply };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white p-6">
      <div className="flex items-center justify-between bg-[#ffffff] backdrop-blur-lg p-6 rounded-2xl border border-[#8b5cf6]/20">
        <div className="flex items-center gap-3">
          <i className="fas fa-robot text-2xl text-[#8b5cf6]"></i>
          <h1 className="text-2xl font-bold font-poppins bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] text-transparent bg-clip-text">
            LeetGuru AI
          </h1>
        </div>
        <div className="flex gap-3">
          <i className="fas fa-code text-[#8b5cf6]"></i>
          <i className="fas fa-brain text-[#6d28d9]"></i>
        </div>
      </div>

      <div className="flex-1 overflow-auto my-6 rounded-2xl bg-white p-6 border-2 border-[#8b5cf6]/20">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === "user"
                ? "flex justify-end"
                : "flex justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl ${
                message.role === "user"
                  ? "bg-[#8b5cf6] text-white"
                  : "bg-gray-100 text-black"
              }`}
            >
              <ReactMarkdown className="font-inter leading-relaxed">
                {message.content}
                </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about algorithms, data structures, or system design..."
          className="flex-1 p-4 rounded-2xl bg-white text-black placeholder-gray-500 border-2 border-[#8b5cf6]/20 focus:outline-none focus:border-[#8b5cf6] font-inter"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#8b5cf6] text-white px-8 py-4 rounded-2xl hover:bg-[#7c3aed] transition-all font-inter flex items-center gap-2"
        >
          {loading ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            <i className="fas fa-paper-plane"></i>
          )}
          Send
        </button>
      </form>
    </div>
  );
}


export default Chatbot;

