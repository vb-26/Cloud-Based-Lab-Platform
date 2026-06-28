import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { User as UserType } from '../../types';

interface Message {
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface StudentChatProps {
  currentUser: UserType;
}

export const StudentChat = ({ currentUser }: StudentChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: `Hello ${currentUser.name}! I'm your Virtual Lab Assistant. How can I help you with your labs today?`,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      const chatHistory = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: [
          ...chatHistory,
          { role: 'user', parts: [{ text: input }] }
        ],
        config: {
          systemInstruction: `
            You are a helpful and knowledgeable Virtual Lab Assistant. 
            The user is a student named ${currentUser.name} in a Virtual Lab application.
            Your goal is to answer their doubts regarding programming, virtual laboratory setups, networking, and security.
            
            Guidelines:
            - Be concise but thorough.
            - If they ask about specific coding tasks, guide them with logic rather than giving the direct answer immediately.
            - Use a professional yet encouraging tone.
            - You can format code using markdown.
            - If you don't know something specific to this private portal's internal configuration, admit it and suggest they contact their staff coordinator.
          `
        }
      });

      const botMessage: Message = {
        role: 'bot',
        content: response.text || "I'm sorry, I couldn't process that. Please try again.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: "Sorry, I'm having trouble connecting to my brain right now. Please check your connection.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? '64px' : '450px'
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-80 bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-indigo-600 p-3 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest italic">Lab Assistant</h4>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold opacity-80 uppercase tracking-tight">Always Active</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 custom-scrollbar"
                >
                  {messages.map((m, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${
                          m.role === 'user' ? 'bg-indigo-100 text-indigo-600 border-indigo-200' : 'bg-white text-slate-500 border-slate-200'
                        }`}>
                          {m.role === 'user' ? <User size={16} /> : <Sparkles size={16} className="text-indigo-400" />}
                        </div>
                        <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm border ${
                          m.role === 'user' 
                            ? 'bg-indigo-600 text-white border-indigo-500' 
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}>
                          {m.content}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex gap-3 max-w-[85%]">
                        <div className="w-8 h-8 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400">
                          <Loader2 size={16} className="animate-spin" />
                        </div>
                        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-sm">
                          <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-3 bg-white border-t border-slate-100 shrink-0">
                  <div className="relative flex items-center gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask a doubt..."
                      className="flex-1 bg-slate-100 border-0 rounded-2xl px-5 py-3 text-sm focus:ring-2 ring-indigo-500/20 outline-none transition-all placeholder:text-slate-400 font-medium"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!input.trim() || isLoading}
                      className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 disabled:grayscale disabled:opacity-50"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(!isOpen);
          setIsMinimized(false);
        }}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all relative group ${
          isOpen ? 'bg-slate-900 rotate-90' : 'bg-indigo-600 shadow-indigo-600/40'
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ opacity: 0, rotate: -45 }} animate={{ opacity: 1, rotate: 0 }}>
              <X className="text-white" size={24} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ opacity: 0, rotate: 45 }} animate={{ opacity: 1, rotate: 0 }}>
              <MessageSquare className="text-white" size={24} />
            </motion.div>
          )}
        </AnimatePresence>
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full" />
        )}
        <div className="absolute right-full mr-4 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Lab Assistant
        </div>
      </motion.button>
    </div>
  );
};
