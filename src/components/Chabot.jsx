"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown"; // ✅ Import react-markdown

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm your food storage assistant. Ask for a recipe based on your ingredients!",
    },
  ]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUserIdFromToken = () => {
      const token = localStorage.getItem("token");
      if (!token) return null;
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.id;
      } catch (err) {
        console.error("Token decode error:", err);
        return null;
      }
    };

    const uid = getUserIdFromToken();
    setUserId(uid);
  }, []);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    if (
      input.toLowerCase().includes("resep") ||
      input.toLowerCase().includes("recipe")
    ) {
      if (!userId) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Silakan login terlebih dahulu untuk mendapatkan resep." },
        ]);
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/gemini/recipe/${userId}`);
        const data = await res.json();
        setMessages((prev) => [...prev, { sender: "bot", text: data.recipe }]);
      } catch (err) {
        console.error("Gemini error:", err);
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Gagal mengambil resep dari AI." },
        ]);
      }
    } else {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Ketik 'resep' untuk mendapatkan saran masakan dari bahan yang kamu simpan." },
      ]);
    }

    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span>Chatbot</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 dark:bg-blue-500 text-white p-4 flex justify-between items-center">
            <h3 className="font-semibold text-sm">Food Assistant</h3>
            <button onClick={toggleChat} className="text-white hover:text-gray-200 transition-colors">
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {msg.sender === "bot" ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : (
                    <p>{msg.text}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Ketik pesan..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
