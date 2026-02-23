"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Loader2, Code2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Role = "user" | "assistant";

interface Message {
  role: Role;
  content: string;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 192) + "px";
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user" as Role, content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder("utf-8");

      // Add empty assistant message to append to
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastIndex = newMessages.length - 1;
            newMessages[lastIndex] = {
              ...newMessages[lastIndex],
              content: newMessages[lastIndex].content + chunk,
            };
            return newMessages;
          });
        }
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "**Error**: Sorry, I failed to process your request. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-[#0d1117] text-[#c9d1d9] font-sans selection:bg-[#388bfd]/30">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-[#161b22] border-b border-[#30363d] sticky top-0 z-10 w-full shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-md bg-[#238636]/10 border border-[#238636]/20">
            <Code2 className="w-5 h-5 text-[#3fb950]" />
          </div>
          <div className="flex items-baseline gap-2">
            <h1 className="text-[17px] font-semibold text-[#e6edf3] tracking-tight font-mono">
              dsa-instructor
            </h1>
            <span className="text-xs text-[#8b949e] font-mono">v1.2.0</span>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 w-full max-w-4xl mx-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-500">
            <div className="flex items-center justify-center mb-6">
              <Code2 className="w-16 h-16 text-[#30363d]" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-semibold text-[#e6edf3] mb-3 text-center tracking-tight font-mono">
              Algorithms & Data Structures
            </h2>
            <p className="text-[#8b949e] text-center max-w-md leading-relaxed text-sm">
              I&apos;m your technical mentor. Ask me about a problem, and
              let&apos;s discover the minimal time complexity approach together.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center w-full max-w-md">
              <button
                className="px-4 py-2.5 bg-[#21262d] border border-[#30363d] rounded-md text-sm text-[#c9d1d9] hover:bg-[#30363d] hover:border-[#8b949e] transition-colors text-left flex-1 font-mono hover:text-white"
                onClick={() => setInput("How do I approach Two Sum optimally?")}
              >
                <span className="text-[#8b949e] mr-2 text-xs">$</span> Two Sum
                optimally?
              </button>
              <button
                className="px-4 py-2.5 bg-[#21262d] border border-[#30363d] rounded-md text-sm text-[#c9d1d9] hover:bg-[#30363d] hover:border-[#8b949e] transition-colors text-left flex-1 font-mono hover:text-white"
                onClick={() =>
                  setInput("What's the intuition behind sliding window?")
                }
              >
                <span className="text-[#8b949e] mr-2 text-xs">$</span> Sliding
                window intuition?
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 pb-24 fade-in duration-200">
            {messages.map((m, index) => (
              <div
                key={index}
                className={`flex w-full group relative ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex flex-col max-w-full sm:max-w-[85%] rounded-lg overflow-hidden ${
                    "bg-transparent border-transparent"
                  }`}
                >
                  {/* Role Badge / Header for Messages */}
                  {m.role === "user" && (
                    <div className="flex items-center gap-2 text-xs font-mono text-[#8b949e] mb-2 px-1">
                      <User className="w-3.5 h-3.5" />
                      <span>User</span>
                    </div>
                  )}
                  {m.role === "assistant" && (
                    <div className="flex items-center gap-2 text-xs font-mono text-[#3fb950] mb-2 px-1">
                      <Bot className="w-4 h-4" />
                      <span>Instructor</span>
                    </div>
                  )}

                  {/* Standardizing typography strictly to look like github markdown / IDE text */}
                  <div
                    className={`text-[15px] leading-relaxed wrap-break-word ${m.role === 'user' ? 'px-4 bg-[#0d1117] text-[#e6edf3]' : 'px-1 text-[#c9d1d9]'} [&>p]:mb-4 last:[&>p]:mb-0 [&>pre]:bg-[#161b22] [&>pre]:p-4 [&>pre]:rounded-md [&>pre]:overflow-x-auto [&>pre]:border [&>pre]:border-[#30363d] [&>pre]:my-4 [&>code]:bg-[#161b22] [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded-md [&>code]:font-mono [&>code]:text-[0.9em] [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4 [&>h1]:text-2xl [&>h1]:font-semibold [&>h1]:mb-4 [&>h1]:border-b [&>h1]:border-[#30363d] [&>h1]:pb-2 [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:mb-3 [&>h2]:border-b [&>h2]:border-[#30363d] [&>h2]:pb-1.5 [&>h3]:text-lg [&>h3]:font-medium [&>h3]:mb-2 [&>strong]:text-[#e6edf3] [&>strong]:font-semibold`}
                  >
                    {m.role === "assistant" ? (
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    ) : (
                      <span className="whitespace-pre-wrap font-mono text-sm leading-6">
                        {m.content}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex flex-col max-w-full sm:max-w-[85%]">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#8b949e] mb-2 px-1 animate-pulse">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Computing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input Area (Command Palette Style) */}
      <div className="p-4 sm:p-6 bg-[#0d1117] sticky bottom-0 border-t border-[#30363d] ">
        <div className="max-w-4xl mx-auto relative group ">
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 bg-[#0d1117] border border-[#30363d] rounded-md shadow-sm focus-within:border-[#58a6ff] focus-within:ring-1 focus-within:ring-[#58a6ff] transition-all "
          >
            <div className="pl-4 flex items-center h-full">
              <span className="text-[#3fb950] font-mono font-bold">{">"}</span>
            </div>
            <textarea
              ref={textareaRef}
              className="flex-1 bg-transparent border-none text-[#e6edf3] placeholder-[#8b949e] px-3 py-3.5 focus:outline-none focus:ring-0 resize-none max-h-48 min-h-12.5 font-mono text-sm overflow-y-scroll 
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar]:h-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-gray-400
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:border-none"
              placeholder="Ask an algorithm question..."
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto"; // Reset height
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 192) + "px"; // Max 48*4
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="mr-2 p-1.5 text-[#8b949e] rounded hover:bg-[#21262d] hover:text-[#c9d1d9] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#8b949e] transition-colors shrink-0 flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex justify-between items-center mt-2 px-1 text-[11px] text-[#8b949e] font-sans">
            <span>Focuses on building intuition first.</span>
            <span className="hidden sm:inline">
              Press{" "}
              <kbd className="font-mono bg-[#161b22] border border-[#30363d] rounded px-1.5 py-0.5 mx-0.5 text-[#c9d1d9] font-semibold">
                Enter
              </kbd>{" "}
              ↵ to send
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
