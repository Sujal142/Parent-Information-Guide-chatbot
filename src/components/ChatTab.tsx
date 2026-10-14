import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, StudentRecord } from '../types';
import { StudentCard } from './StudentCard';
import {
  Send,
  Bot,
  User,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Info,
  ChevronRight,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

interface ChatTabProps {
  students: StudentRecord[];
  selectedRoll: string;
  setSelectedRoll: (roll: string) => void;
  language: string;
}

export const ChatTab: React.FC<ChatTabProps> = ({
  students,
  selectedRoll,
  setSelectedRoll,
  language,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `### 🎓 Namaste & Welcome Parents!\nI am the **Parent Information Guide AI Chatbot** for the Department of Computer Engineering (B.Tech TY).\n\nI can assist you with:\n• **Student Academic Progress & CIE Marks** (e.g. CIE-1, CIE-2, Lab submissions)\n• **Attendance Verification** (Minimum 75% university statute & defaulter notices)\n• **Examination Timetables & Schedules** (Upcoming CIE-2 & SEE dates)\n• **Tuition Fee Schedules & Due Dates**\n• **Proctor Teacher & HOD Visiting Hours**\n• **Hostel Curfew & Campus Regulations**\n\n*Select a student or type any question below to begin!*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.8-flash',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Clean speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting for cleaner speech
    const cleanText = text
      .replace(/[#*_`]/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/•/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsgId = `user-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          rollNo: selectedRoll || undefined,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('Server responded with an error');
      }

      const data = await response.json();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'Thank you for asking. How else can I assist you?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        studentData: data.student || undefined,
        modelUsed: data.modelUsed || 'gemini-3.8-flash',
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Error fetching chat response:', err);
      // Fallback local response
      const fallbackReply = selectedRoll
        ? `I have noted your inquiry regarding student **${selectedRoll}**. The B.Tech TY Computer Engineering Continuous Internal Evaluation (CIE-2) starts on November 3, 2026. The minimum required attendance is 75%. Proctor office hours are every Saturday 10:00 AM - 1:00 PM.`
        : `Namaste! The college requires 75% minimum attendance as per university statute. Upcoming CIE-2 examinations are scheduled from Nov 3 to Nov 7, 2026. You may also specify your ward's Roll Number (e.g. TYCOMP-101) for real-time attendance and marks check.`;

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'local-fallback',
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string, roll?: string) => {
    if (roll) {
      setSelectedRoll(roll);
    }
    handleSend(prompt);
  };

  const clearChat = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setSpeakingId(null);
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'bot',
        text: `### 💬 Conversation Cleared\nNamaste! How may I assist you with your ward's B.Tech Computer Engineering information today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const quickPrompts = [
    { label: "Check Aarav's Attendance (101)", query: "Check attendance and academic progress for Aarav Sharma (TYCOMP-101)", roll: "TYCOMP-101" },
    { label: "Why is Pooja on Defaulter list? (102)", query: "Is Pooja Patel (TYCOMP-102) on the attendance defaulter list? What is her current percentage?", roll: "TYCOMP-102" },
    { label: "When is CIE-2 Exam Timetable?", query: "What are the exact dates and subjects for B.Tech TY CIE-2 examination?" },
    { label: "How to pay Semester Fees?", query: "What is the fee payment deadline, amount, and online link for TY Comp?" },
    { label: "Hostel In-time & Leave Rules", query: "What are the hostel curfew timings and how can parents grant night-out leave?" },
    { label: "Faculty Proctor Meeting Hours", query: "When can parents meet the Proctor Teacher and HOD in Computer Department?" },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-6xl mx-auto">
      {/* Top Student Selection Strip */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 mb-3 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-semibold text-slate-300">Quick Student Context:</span>
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <button
              onClick={() => setSelectedRoll('')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                !selectedRoll
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              General Campus Inquiry
            </button>
            {students.map((st) => (
              <button
                key={st.rollNo}
                onClick={() => setSelectedRoll(st.rollNo)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedRoll === st.rollNo
                    ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400/50'
                    : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                }`}
              >
                <span>{st.name.split(' ')[0]}</span>
                <span className="text-[10px] opacity-75">({st.rollNo.split('-')[1]})</span>
                {st.overallAttendance < 75 && (
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" title="Defaulter Alert" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {selectedRoll && (
            <span className="text-xs text-blue-300 bg-blue-950/80 border border-blue-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Active: {selectedRoll}
            </span>
          )}
          <button
            onClick={clearChat}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Reset Chat"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Chat Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-3 space-y-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 shadow-inner">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-4xl ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white ring-2 ring-blue-400/30'
                  : 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white ring-2 ring-purple-400/30'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>

            {/* Bubble */}
            <div
              className={`rounded-2xl p-4 text-sm leading-relaxed shadow-lg ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none w-full'
              }`}
            >
              {/* Sender label and model tag */}
              <div className="flex items-center justify-between text-xs mb-2 opacity-80 pb-1.5 border-b border-white/10">
                <span className="font-semibold">
                  {msg.sender === 'user' ? 'Parent / Guardian' : 'AI Parent Guide'}
                </span>
                <div className="flex items-center gap-2">
                  {msg.modelUsed && (
                    <span className="text-[10px] bg-slate-800/80 px-1.5 py-0.5 rounded text-blue-300 font-mono">
                      {msg.modelUsed}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400">{msg.timestamp}</span>
                </div>
              </div>

              {/* Message text with basic markdown format */}
              <div className="whitespace-pre-wrap break-words space-y-2">
                {msg.text.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={idx} className="text-base font-bold text-amber-300 mt-2 mb-1">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }
                  return (
                    <p key={idx} className="text-slate-200 leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Attached Student Card if available */}
              {msg.studentData && (
                <div className="mt-4 pt-3 border-t border-slate-800">
                  <p className="text-xs font-semibold text-blue-300 mb-2 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>Verified Academic Record Attached:</span>
                  </p>
                  <StudentCard student={msg.studentData} />
                </div>
              )}

              {/* Message Actions */}
              {msg.sender === 'bot' && (
                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-end gap-2 text-xs text-slate-400">
                  <button
                    onClick={() => handleSpeak(msg.id, msg.text)}
                    className="p-1 hover:text-white rounded hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                    title={speakingId === msg.id ? 'Stop Voice' : 'Listen to Answer'}
                  >
                    {speakingId === msg.id ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                        <span className="text-rose-300 text-[11px]">Speaking...</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[11px]">Listen</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="p-1 hover:text-white rounded hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Copy Answer"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 text-[11px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[11px]">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-xl mr-auto">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white ring-2 ring-purple-400/30 animate-pulse">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl rounded-tl-none text-slate-300 text-sm flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              <span>Analyzing academic guidelines and student records...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="py-2.5 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Suggestions:
        </span>
        {quickPrompts.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickPrompt(item.query, item.roll)}
            className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span>{item.label}</span>
            <ChevronRight className="w-3 h-3 text-slate-500" />
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 sm:p-2.5 shadow-xl flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Ask anything (e.g., 'What is Rohan's attendance?', 'When is CIE-2?', 'How to meet Proctor?')..."
          className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20 cursor-pointer"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
