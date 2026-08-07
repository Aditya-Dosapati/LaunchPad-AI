'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';
import { ErrorState } from '../ui/ErrorState';
import { Toast } from '../ui/Toast';
import { 
  Sparkles, 
  Send, 
  Plus, 
  Trash2, 
  Search, 
  Copy, 
  Check, 
  Terminal, 
  Code2,
  FileText,
  Mic,
  Paperclip,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  Compass,
  MessageSquare,
  Cpu
} from 'lucide-react';
import { CopilotBadge } from '../ui/CopilotWidgets';

export const AIChatView: React.FC = () => {
  const { 
    chats, 
    activeChatId, 
    setActiveChatId, 
    addChatMessage, 
    createNewChat, 
    deleteChat,
    searchChats,
    setSearchChats,
    demoState, 
    setDemoState 
  } = useApp();

  const [inputMsg, setInputMsg] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'up' | 'down'>>({});
  const [selectedLLM, setSelectedLLM] = useState('GPT-4o (Default)');

  if (demoState === 'error') {
    return <ErrorState onRetry={() => setDemoState('normal')} />;
  }

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    addChatMessage(inputMsg);
    setInputMsg('');
  };

  const handleCopyCode = (snippet: string, id: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedId(id);
    setToastMsg('Code snippet copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleQuickPrompt = (promptText: string) => {
    addChatMessage(promptText);
  };

  const handleUploadDoc = () => {
    setToastMsg('Document upload container initialized. Select PDF / Markdown file.');
  };

  const toggleVoice = () => {
    setIsVoiceActive(!isVoiceActive);
    setToastMsg(!isVoiceActive ? 'Voice Assistant listening... Speak your question' : 'Voice Assistant stopped');
  };

  const handleFeedback = (msgId: string, type: 'up' | 'down') => {
    setFeedbackGiven(prev => ({ ...prev, [msgId]: type }));
    setToastMsg(type === 'up' ? 'Feedback recorded: Helpful response!' : 'Feedback recorded: We will refine this answer.');
  };

  const filteredChats = chats.filter(c => 
    c.title.toLowerCase().includes(searchChats.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row gap-4 overflow-hidden text-left animate-fade-in widescreen-container pb-4">
      
      {/* 1. LEFT SIDEBAR: Discussion History */}
      <div className="w-full md:w-72 shrink-0 flex flex-col rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 bg-zinc-50/80 dark:bg-[#080a14]/60 p-3.5 space-y-3">
        <button
          onClick={createNewChat}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-2xs transition-transform active:scale-98 cursor-pointer"
        >
          <Plus size={14} />
          New Copilot Chat
        </button>

        {/* Search Chats */}
        <div className="relative group">
          <Search size={13} className="absolute left-3 top-2.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search discussions..."
            value={searchChats}
            onChange={(e) => setSearchChats(e.target.value)}
            className="w-full text-xs font-semibold pl-8 pr-3 py-1.5 bg-white dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800 rounded-xl text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 outline-none shadow-2xs"
          />
        </div>

        {/* History Items List */}
        <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest px-2 pt-1">Recent Discussions</p>
          {filteredChats.map((c) => {
            const isActive = c.id === activeChatId;
            return (
              <div
                key={c.id}
                onClick={() => setActiveChatId(c.id)}
                className={`group flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  isActive 
                    ? 'bg-indigo-500/10 dark:bg-indigo-500/8 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-bold shadow-2xs' 
                    : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/40'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <MessageSquare size={13} className="shrink-0 opacity-70" />
                  <span className="truncate">{c.title}</span>
                </div>
                {chats.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(c.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-500 transition-opacity cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. MAIN CHAT WORKSPACE */}
      <div className="flex-1 flex flex-col rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 bg-white dark:bg-[#080a14]/90 overflow-hidden shadow-2xs">
        
        {/* Workspace Header */}
        <div className="px-6 py-4 border-b border-zinc-200/50 dark:border-zinc-800/40 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/10">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-2xs">
              <Sparkles size={15} className="copilot-sparkle" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5">
                LaunchPad Copilot
                <CopilotBadge />
              </h2>
              <p className="text-[10px] font-semibold text-zinc-400">Contextual Codebase & SOP Assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* LLM Model Picker */}
            <select
              value={selectedLLM}
              onChange={(e) => setSelectedLLM(e.target.value)}
              className="text-[10.5px] font-bold px-2.5 py-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-xl text-zinc-700 dark:text-zinc-300 outline-none cursor-pointer"
            >
              <option value="GPT-4o (Default)">GPT-4o (Default)</option>
              <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
              <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
            </select>

            <button
              onClick={handleUploadDoc}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-xl border border-zinc-200/50 dark:border-zinc-800 cursor-pointer transition-colors"
            >
              <Paperclip size={12} />
              Upload Doc
            </button>

            <button
              onClick={toggleVoice}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                isVoiceActive 
                  ? 'bg-rose-500 text-white border-rose-500 animate-pulse' 
                  : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200/50 dark:border-zinc-800'
              }`}
            >
              <Mic size={12} />
              {isVoiceActive ? 'Listening...' : 'Voice Mode'}
            </button>
          </div>
        </div>

        {/* Quick Explanation Prompts Scroll Row */}
        <div className="px-6 py-2 border-b border-zinc-100 dark:border-zinc-900/60 bg-zinc-50/30 dark:bg-zinc-900/5 flex items-center gap-2 overflow-x-auto custom-scrollbar shrink-0">
          <span className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-widest shrink-0">Prompts:</span>
          <button 
            onClick={() => handleQuickPrompt('Explain Payment Service OAuth2 authentication flow in detail')}
            className="px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-500 hover:text-white text-indigo-600 dark:text-indigo-400 text-[10.5px] font-bold rounded-lg shrink-0 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Code2 size={11} /> Explain Auth Flow
          </button>
          <button 
            onClick={() => handleQuickPrompt('Show Neo4j graph architecture map for Project Phoenix')}
            className="px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500 hover:text-white text-purple-600 dark:text-purple-400 text-[10.5px] font-bold rounded-lg shrink-0 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Compass size={11} /> Architecture Overview
          </button>
          <button 
            onClick={() => handleQuickPrompt('List JWT token rotation API endpoints and headers')}
            className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-600 dark:text-emerald-400 text-[10.5px] font-bold rounded-lg shrink-0 transition-colors cursor-pointer flex items-center gap-1"
          >
            <FileText size={11} /> API Endpoints SOP
          </button>
        </div>

        {/* Messages Stream Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {activeChat?.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <Sparkles size={24} />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Ask LaunchPad Copilot</h3>
              <p className="text-xs text-zinc-400 max-w-sm font-medium">Ask questions about codebase setups, SOPs, architectural flows, or coding standards.</p>
            </div>
          ) : (
            activeChat?.messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div key={m.id} className={`flex gap-3.5 ${isUser ? 'flex-row-reverse' : ''}`}>
                  <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-2xs ${
                    isUser ? 'bg-zinc-800 dark:bg-zinc-700' : 'bg-gradient-to-tr from-indigo-500 to-purple-500'
                  }`}>
                    {isUser ? 'U' : <Sparkles size={14} />}
                  </div>

                  <div className={`space-y-2 max-w-2xl ${isUser ? 'items-end text-right' : ''}`}>
                    <div className={`p-4 rounded-2xl text-xs font-medium leading-relaxed shadow-2xs ${
                      isUser 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200'
                    }`}>
                      {m.text}

                      {/* Code Block Snippet */}
                      {m.codeSnippet && (
                        <div className="mt-3 rounded-xl overflow-hidden bg-zinc-950 text-zinc-200 font-mono text-[11px] border border-zinc-800 text-left">
                          <div className="flex items-center justify-between px-3.5 py-1.5 bg-zinc-900 border-b border-zinc-800 text-[10px] text-zinc-400 font-sans font-bold">
                            <span className="flex items-center gap-1.5"><Terminal size={11} /> {m.language || 'code'}</span>
                            <button
                              onClick={() => handleCopyCode(m.codeSnippet!, m.id)}
                              className="flex items-center gap-1 text-zinc-400 hover:text-white cursor-pointer"
                            >
                              {copiedId === m.id ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                              <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                          <pre className="p-3.5 overflow-x-auto">
                            <code>{m.codeSnippet}</code>
                          </pre>
                        </div>
                      )}

                      {/* Sources and Confidence Score */}
                      {!isUser && (m.sources || m.confidence) && (
                        <div className="mt-3 pt-3 border-t border-zinc-200/40 dark:border-zinc-800/40 space-y-2 text-left">
                          {m.confidence && (
                            <div className="flex items-center gap-1.5 text-[9.5px] font-bold text-emerald-500">
                              <ShieldCheck size={11} />
                              Confidence Score: {m.confidence}% Verified
                            </div>
                          )}
                          {m.sources && m.sources.length > 0 && (
                            <div className="space-y-1">
                              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Cited Workspace Sources:</p>
                              <div className="flex flex-wrap gap-1.5">
                                {m.sources.map((src, sIdx) => (
                                  <span key={sIdx} className="px-2 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[9px] font-bold rounded-md border border-indigo-500/10 flex items-center gap-1">
                                    <FileText size={9} />
                                    {src}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Feedback Thumbs */}
                    {!isUser && (
                      <div className="flex items-center gap-2 px-1 text-[10px] text-zinc-400 font-semibold">
                        <span>Was this answer helpful?</span>
                        <button
                          onClick={() => handleFeedback(m.id, 'up')}
                          className={`p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer ${feedbackGiven[m.id] === 'up' ? 'text-emerald-500 font-bold' : ''}`}
                        >
                          <ThumbsUp size={11} />
                        </button>
                        <button
                          onClick={() => handleFeedback(m.id, 'down')}
                          className={`p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer ${feedbackGiven[m.id] === 'down' ? 'text-rose-500 font-bold' : ''}`}
                        >
                          <ThumbsDown size={11} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-4 border-t border-zinc-200/50 dark:border-zinc-800/40 bg-zinc-50/50 dark:bg-zinc-900/10 flex items-center gap-3">
          <input
            type="text"
            placeholder="Ask Copilot about codebase setup, SOPs, or architecture..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            className="flex-1 text-xs font-semibold px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 focus:border-indigo-500/40 rounded-xl outline-none text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 shadow-2xs"
          />
          <button
            type="submit"
            className="px-4 py-3 bg-indigo-650 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-2xs transition-transform active:scale-98 flex items-center gap-1.5 cursor-pointer"
          >
            <Send size={13} />
            Send
          </button>
        </form>

      </div>

      {toastMsg && <Toast message={toastMsg} type="info" onClose={() => setToastMsg(null)} />}
    </div>
  );
};
