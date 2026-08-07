'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Maximize2, 
  History, 
  Send, 
  FileText, 
  BookOpen, 
  Code, 
  Layers, 
  CheckCircle2, 
  Brain, 
  Plus,
  MessageSquare,
  Mic,
  Paperclip,
  ExternalLink,
  Compass,
  Terminal,
  Volume2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Toast } from '../ui/Toast';

interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  timestamp: string;
  confidence?: number;
  sources?: string[];
  codeSnippet?: string;
  architecturePreview?: string;
  followUps?: string[];
}

const initialHistory = [
  { id: 'sess-1', title: 'Payment Service Auth Flow', date: 'Today' },
  { id: 'sess-2', title: 'Kubernetes Cluster Peer Setup', date: 'Yesterday' },
  { id: 'sess-3', title: 'Frontend Glassmorphism Spec', date: '3 days ago' },
];

export const FloatingAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const { route, setRoute } = useApp();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'copilot',
      text: 'Good morning! I am LaunchPad Copilot, your workspace AI companion. Ask about your onboarding checks, workspace projects, or company knowledge.',
      timestamp: '10:00 AM',
      followUps: [
        'Explain Payment Service authentication flow',
        'Which SOP am I missing for Project Phoenix?',
        'How do I deploy local Kubernetes helm charts?'
      ]
    }
  ]);

  const hintText = route === 'dashboard' ? 'Ask about your daily goals' : route === 'knowledge-base' ? 'Query company knowledge' : 'Ask Copilot anything';

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setShowHint(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, [route, isOpen]);

  useEffect(() => {
    if (showHint) {
      const timer = setTimeout(() => setShowHint(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showHint]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      const isAuthQuery = text.toLowerCase().includes('auth') || text.toLowerCase().includes('payment');
      
      const copilotMsg: ChatMessage = {
        id: `copilot-${Date.now()}`,
        sender: 'copilot',
        text: isAuthQuery 
          ? "The Payment Service uses OAuth2 with JWT bearer tokens. Incoming requests pass through the API Gateway layer where signatures and scopes are validated."
          : `I parsed the workspace index for "${text}" and mapped 2 matching document volumes.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: 96,
        sources: [
          'Authentication Flow SOP',
          'API Gateway Proxying Specs'
        ],
        codeSnippet: isAuthQuery ? `// API Gateway JWT Verification
export async function verifyPaymentToken(req: Request) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) throw new AuthError('Missing Bearer Token');
  return await jwt.verify(token, process.env.JWT_SECRET);
}` : undefined,
        architecturePreview: isAuthQuery ? `[ Gateway JWT Validate ] → [ Payment Service ]` : undefined,
        followUps: isAuthQuery ? [
          'How do I rotate JWT secrets in dev?',
          'Open Authentication Flow document'
        ] : [
          'Show related code snippets',
          'Which team members own this area?'
        ]
      };

      setMessages(prev => [...prev, copilotMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleMaximize = () => {
    setRoute('assistant');
    setIsOpen(false);
  };

  const quickActions = [
    { label: 'Explain Flow', icon: <Compass size={11} />, prompt: 'Explain the authentication flow for the Payment Service.' },
    { label: 'Show Code', icon: <Terminal size={11} />, prompt: 'Show the JWT validation gateway middleware code.' },
    { label: 'Voice Stream', icon: <Volume2 size={11} />, toast: 'Voice stream active. Listening...' }
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-40 flex select-none pointer-events-none">
      
      {/* 1. Slide-over Workspace Panel */}
      <div 
        className={`h-screen bg-white dark:bg-zinc-950 border-l border-zinc-200/50 dark:border-zinc-800/40 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-out pointer-events-auto ${
          isOpen ? 'w-[420px] sm:w-[500px] translate-x-0' : 'w-0 translate-x-full'
        }`}
      >
        {/* Top Header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-zinc-200/50 dark:border-zinc-800/40 bg-zinc-50/50 dark:bg-[#080a14]/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 text-white flex items-center justify-center shadow-sm">
              <Sparkles size={14} className="copilot-sparkle" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold text-zinc-900 dark:text-zinc-50">LaunchPad Copilot</span>
                <span className="px-1.5 py-0.5 text-[8px] font-extrabold uppercase bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md tracking-wider">AI</span>
              </div>
              <p className="text-[10px] text-zinc-400 font-semibold">Enterprise Slide-over Companion</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className={`p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-205 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer ${showHistory ? 'text-indigo-500 bg-indigo-500/10' : ''}`}
              title="History"
            >
              <History size={13} />
            </button>
            
            <button 
              onClick={handleMaximize}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-205 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
              title="Open Full Workspace"
            >
              <Maximize2 size={13} />
            </button>

            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-205 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
              title="Close"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Workspace Body */}
        <div className="flex-1 flex min-h-0 overflow-hidden relative">
          
          {/* History drawer inside slide-over */}
          {showHistory && (
            <div className="w-44 border-r border-zinc-200/50 dark:border-zinc-800/40 bg-zinc-50/50 dark:bg-zinc-900/20 p-3 overflow-y-auto space-y-3 shrink-0 animate-fade-in text-left">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Sessions</span>
              <div className="space-y-1">
                {initialHistory.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => handleSend(h.title)}
                    className="w-full text-left p-2 rounded-xl text-xs hover:bg-zinc-100 dark:hover:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 transition-colors truncate block font-semibold"
                  >
                    <p className="truncate">{h.title}</p>
                    <p className="text-[9px] text-zinc-400 font-medium mt-0.5">{h.date}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 p-5 overflow-y-auto space-y-5 custom-scrollbar flex flex-col text-left">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex flex-col space-y-1.5 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 text-[9px] text-zinc-400 font-semibold">
                  {msg.sender === 'copilot' ? (
                    <span className="flex items-center gap-1 font-bold text-indigo-500">
                      <Sparkles size={9} /> Copilot
                    </span>
                  ) : (
                    <span>You</span>
                  )}
                  <span>• {msg.timestamp}</span>
                </div>

                <div className={`p-4 rounded-2xl text-xs max-w-[90%] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'glass-panel text-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-800/80 font-normal'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Sources, Code, Diagrams */}
                  {msg.sender === 'copilot' && (msg.confidence || msg.sources) && (
                    <div className="mt-3.5 pt-3 border-t border-zinc-200/40 dark:border-zinc-800/60 space-y-2">
                      <div className="flex items-center justify-between text-[9px] font-bold">
                        <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          {msg.confidence}% Match
                        </span>
                      </div>

                      {msg.sources && (
                        <div className="flex flex-wrap gap-1.5">
                          {msg.sources.map((src, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-805 text-[9px] font-semibold text-zinc-700 dark:text-zinc-400">
                              <FileText size={9} className="text-indigo-500" />
                              {src}
                            </span>
                          ))}
                        </div>
                      )}

                      {msg.codeSnippet && (
                        <div className="mt-2 p-3 rounded-lg bg-zinc-950 text-zinc-300 text-[10px] font-mono border border-zinc-900 overflow-x-auto">
                          <pre className="whitespace-pre">{msg.codeSnippet}</pre>
                        </div>
                      )}

                      {msg.architecturePreview && (
                        <div className="mt-2 p-2 rounded-lg bg-indigo-500/5 border border-indigo-500/10 text-[9px] font-mono text-indigo-600 dark:text-indigo-300">
                          {msg.architecturePreview}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Follow-up suggestions */}
                {msg.sender === 'copilot' && msg.followUps && (
                  <div className="flex flex-col gap-1 pl-1 max-w-[90%]">
                    {msg.followUps.map((fu, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(fu)}
                        className="text-[10px] font-bold px-3 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 hover:text-indigo-650 dark:hover:text-indigo-400 rounded-lg transition-all text-left"
                      >
                        → {fu}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-zinc-450 font-semibold animate-pulse">
                <Sparkles size={11} className="text-indigo-500 copilot-sparkle animate-pulse-slow" />
                <span>Reading codebase structures...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Bottom Input Area */}
        <div className="p-4 border-t border-zinc-200/50 dark:border-zinc-800/40 bg-zinc-50/50 dark:bg-[#080a14]/60 space-y-3 shrink-0">
          {/* Quick actions row */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {quickActions.map((action, aIdx) => (
              <button
                key={aIdx}
                onClick={() => {
                  if (action.prompt) handleSend(action.prompt);
                  if (action.toast) setToastMsg(action.toast);
                }}
                className="flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-lg text-[9.5px] font-bold text-zinc-600 dark:text-zinc-350 hover:text-indigo-600 dark:hover:text-indigo-400 shrink-0 cursor-pointer shadow-xs"
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>

          <div className="relative flex items-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute left-2.5 p-1 rounded-md text-zinc-450 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            >
              <Paperclip size={13} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files && setToastMsg(`Attached ${e.target.files[0].name}`)}
              className="hidden"
            />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Copilot anything..."
              className="w-full text-xs font-semibold pl-9 pr-10 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 focus:border-indigo-500/50 rounded-xl text-zinc-800 dark:text-zinc-250 placeholder-zinc-400 dark:placeholder-zinc-550 outline-none transition-all shadow-sm"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputVal.trim() || isTyping}
              className="absolute right-2 p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-colors cursor-pointer"
            >
              <Send size={11} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Toggle Hint (Trigger bubble hover) */}
      {showHint && !isOpen && (
        <div className="absolute bottom-16 right-0 mb-2 px-3.5 py-2 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10.5px] font-bold shadow-2xl animate-fade-in flex items-center gap-2 max-w-[200px] pointer-events-auto">
          <Sparkles size={11} className="text-indigo-400 dark:text-indigo-600 shrink-0 copilot-sparkle" />
          <span>{hintText}</span>
        </div>
      )}

      {/* 3. Slide Trigger Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => { setIsOpen(true); setShowHint(false); }}
          className="h-12 w-12 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 hover:scale-105 active:scale-95 text-white shadow-xl shadow-indigo-500/25 flex items-center justify-center border border-white/20 absolute bottom-5 right-5 cursor-pointer pointer-events-auto transition-transform"
          title="Open LaunchPad Copilot"
        >
          <Sparkles size={20} className="copilot-sparkle" />
          <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-emerald-400 border-2 border-white dark:border-[#060814] animate-pulse" />
        </button>
      )}

      {toastMsg && <Toast message={toastMsg} type="info" onClose={() => setToastMsg(null)} />}
    </div>
  );
};
