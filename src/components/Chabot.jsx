"use client"

import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm your food storage assistant. Click the button below to get recipes from the ingredients you have stored!",
    },
  ])
  const [userId, setUserId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    try {
      const token = localStorage.getItem("token")
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]))
        setUserId(payload.id)
      }
    } catch (err) {
      console.error("Token decode error:", err)
    }
  }, [])

  const toggleChat = () => setIsOpen(!isOpen)

  const sendMessage = async (textToSend) => {
    const text = textToSend?.trim() || input.trim()
    if (!text) return

    setMessages((prev) => [...prev, { sender: "user", text }])
    setInput("")
    setIsLoading(true)

    try {
      let botReply = ""
      if (text.toLowerCase().includes("ingredient") || text.toLowerCase().includes("recipe") || textToSend) {
        // Use storage ingredients
        if (!userId) {
          botReply = "Please login first to get recipes from your stored ingredients."
        } else {
          const res = await fetch(`https://backend-frigora.vercel.app/api/gemini/recipe/${userId}`)
          const data = await res.json()
          botReply = data.recipe || "No recipes can be made from the available ingredients."
        }
      } else {
        // Use text input
        const res = await fetch("https://backend-frigora.vercel.app/api/gemini/text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        })
        const data = await res.json()
        botReply = data.recipe || "Recipe not found or AI failed to respond."
      }

      setMessages((prev) => [...prev, { sender: "bot", text: botReply }])
    } catch (err) {
      console.error("Fetch error:", err)
      setMessages((prev) => [...prev, { sender: "bot", text: "An error occurred while calling the AI." }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className={`${
          isOpen ? "hidden" : "flex"
        } bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 dark:from-blue-600 dark:to-purple-700 dark:hover:from-blue-700 dark:hover:to-purple-800 text-white px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 items-center space-x-3 group backdrop-blur-sm`}
      >
        <svg
          className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <span className="font-semibold">Food Assistant</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-0 right-0 w-96 h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300 backdrop-blur-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white p-5 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12.5 2C13.3 2 14 2.7 14 3.5v17c0 .8-.7 1.5-1.5 1.5S11 21.3 11 20.5v-17c0-.8.7-1.5 1.5-1.5zM8.5 6C9.3 6 10 6.7 10 7.5v9c0 .8-.7 1.5-1.5 1.5S7 17.3 7 16.5v-9C7 6.7 7.7 6 8.5 6zM16.5 10c.8 0 1.5.7 1.5 1.5v5c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5v-5c0-.8.7-1.5 1.5-1.5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">Food Assistant</h3>
                <p className="text-blue-100 text-sm opacity-90">Always here to help</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[280px] px-4 py-3 rounded-2xl text-sm shadow-sm ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white rounded-br-md"
                      : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-bl-md"
                  }`}
                >
                  {msg.sender === "bot" ? (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown
                        components={{
                          // Headings
                          h1: ({ children }) => (
                            <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-2 mt-3 first:mt-0">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-2 mt-3 first:mt-0">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 mt-2 first:mt-0">
                              {children}
                            </h3>
                          ),
                          // Paragraphs
                          p: ({ children }) => (
                            <p className="text-gray-700 dark:text-gray-300 mb-2 last:mb-0 leading-relaxed">
                              {children}
                            </p>
                          ),
                          // Lists
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside space-y-1 mb-2 text-gray-700 dark:text-gray-300 ml-2">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside space-y-1 mb-2 text-gray-700 dark:text-gray-300 ml-2">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
                          // Code blocks
                          code: ({ inline, children }) => {
                            if (inline) {
                              return (
                                <code className="bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded text-xs font-mono border border-gray-200 dark:border-gray-700">
                                  {children}
                                </code>
                              )
                            }
                            return (
                              <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-3 mb-2 mt-2 border border-gray-200 dark:border-gray-700">
                                <code className="text-green-400 text-xs font-mono block whitespace-pre-wrap leading-relaxed">
                                  {children}
                                </code>
                              </div>
                            )
                          },
                          // Pre blocks (for code blocks)
                          pre: ({ children }) => <div className="mb-2">{children}</div>,
                          // Links
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 underline underline-offset-2 transition-colors duration-200"
                            >
                              {children}
                            </a>
                          ),
                          // Blockquotes
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-blue-500 dark:border-blue-400 pl-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg mb-2 italic text-gray-600 dark:text-gray-400">
                              {children}
                            </blockquote>
                          ),
                          // Tables
                          table: ({ children }) => (
                            <div className="overflow-x-auto mb-2">
                              <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                {children}
                              </table>
                            </div>
                          ),
                          th: ({ children }) => (
                            <th className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                              {children}
                            </th>
                          ),
                          td: ({ children }) => (
                            <td className="border-b border-gray-200 dark:border-gray-700 px-3 py-2 text-xs text-gray-600 dark:text-gray-400">
                              {children}
                            </td>
                          ),
                          // Strong/Bold
                          strong: ({ children }) => (
                            <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>
                          ),
                          // Emphasis/Italic
                          em: ({ children }) => <em className="italic text-gray-700 dark:text-gray-300">{children}</em>,
                          // Horizontal rule
                          hr: () => <hr className="border-gray-300 dark:border-gray-600 my-3" />,
                          // Images
                          img: ({ src, alt }) => (
                            <img
                              src={src || "/placeholder.svg"}
                              alt={alt}
                              className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700 mb-2"
                            />
                          ),
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="leading-relaxed">{msg.text}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Reply */}
          <div className="px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={() => sendMessage("Give me recipes from my stored ingredients")}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 dark:hover:from-blue-800/40 dark:hover:to-purple-800/40 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-xl transition-all duration-200 w-full text-left border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">🍳</span>
                <span className="text-sm font-medium">Get recipes from my stored ingredients</span>
              </div>
            </button>
          </div>

          {/* Input */}
          <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700">
            <div className="flex space-x-3">
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    sendMessage()
                  }
                }}
                disabled={isLoading}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 dark:from-blue-600 dark:to-purple-700 dark:hover:from-blue-700 dark:hover:to-purple-800 text-white px-4 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  )
}

export default Chatbot
