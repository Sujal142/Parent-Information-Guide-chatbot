import React from 'react';
import { Bot, GraduationCap, Calendar, Code2, Users, Globe2, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'chat' | 'students' | 'calendar' | 'python';
  setActiveTab: (tab: 'chat' | 'students' | 'calendar' | 'python') => void;
  language: string;
  setLanguage: (lang: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 px-4 py-2 text-xs sm:text-sm font-medium flex flex-wrap items-center justify-between text-blue-50">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-amber-300" />
          <span>Dept. of Computer Engineering • B.Tech (TY) • Continuous Internal Evaluation (CIE) Project</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-200 border border-blue-400/30 text-xs">
            <Sparkles className="w-3 h-3 text-amber-300" />
            AI Chatbot System
          </span>
          <div className="flex items-center gap-1 text-xs">
            <Globe2 className="w-3.5 h-3.5 text-blue-300" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-blue-950/80 text-white border border-blue-400/40 rounded px-2 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-300 cursor-pointer"
            >
              <option value="English">English</option>
              <option value="Hindi">हिन्दी (Hindi)</option>
              <option value="Marathi">मराठी (Marathi)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-2 ring-blue-400/30">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Parent Information Guide
              </h1>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Live AI
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous College Parent Portal • Academic Progress, CIE Marks & Policy Assistance
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 overflow-x-auto text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'chat'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>AI Chatbot</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'students'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Student Lookup</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'calendar'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>CIE Schedule & Rules</span>
          </button>

          <button
            onClick={() => setActiveTab('python')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'python'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-sm'
                : 'text-amber-300 hover:text-amber-200 hover:bg-amber-950/40 border border-amber-500/30'
            }`}
          >
            <Code2 className="w-4 h-4 text-amber-300" />
            <span>Python CIE Kit</span>
          </button>
        </div>
      </div>
    </header>
  );
};
