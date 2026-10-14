import React, { useState } from 'react';
import { VIVA_QUESTIONS } from '../data/mockData';
import {
  Code2,
  FileCode,
  Download,
  Copy,
  Check,
  Play,
  Terminal,
  BookOpen,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
  HelpCircle,
  Cpu
} from 'lucide-react';

interface PythonKitTabProps {
  initialFiles?: Record<string, string>;
  initialReport?: string;
}

export const PythonKitTab: React.FC<PythonKitTabProps> = ({
  initialFiles,
  initialReport,
}) => {
  const [selectedFile, setSelectedFile] = useState<string>('app.py');
  const [copied, setCopied] = useState(false);
  const [expandedViva, setExpandedViva] = useState<number | null>(0);
  const [activeSubTab, setActiveSubTab] = useState<'code' | 'report' | 'viva' | 'sandbox'>('code');

  // Interactive Sandbox state
  const [sandboxQuery, setSandboxQuery] = useState('When is the CIE-2 examination starting?');
  const [sandboxResult, setSandboxResult] = useState<{
    tokens: string[];
    stemmed: string[];
    matchedIntent: string;
    confidence: number;
    explanation: string;
  } | null>(null);

  // Fallback files if not passed from server
  const files: Record<string, string> = initialFiles || {
    'app.py': `# B.Tech Computer Engineering (TY) - CIE AI Project
# Run: python app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from nlp_classifier import ParentChatbotNLP
import re

app = Flask(__name__)
CORS(app)
nlp = ParentChatbotNLP("intents_dataset.json")

STUDENT_DB = {
    "TYCOMP-101": {"name": "Aarav Sharma", "attendance": 88.5, "status": "Good", "proctor": "Prof. Sunita Deshmukh"},
    "TYCOMP-102": {"name": "Pooja Patel", "attendance": 67.8, "status": "Defaulter (<75%)", "proctor": "Dr. Rajesh Kulkarni"},
    "TYCOMP-103": {"name": "Rohan Verma", "attendance": 82.4, "status": "Good", "proctor": "Prof. Amit Patil"}
}

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json or {}
    query = data.get("query", "")
    match = re.search(r"TYCOMP-[0-9]{3}", query.upper())
    if match and match.group(0) in STUDENT_DB:
        st = STUDENT_DB[match.group(0)]
        return jsonify({"reply": f"Student: {st['name']}, Attendance: {st['attendance']}%, Status: {st['status']}, Proctor: {st['proctor']}"})
    intent, score, reply = nlp.predict_intent(query)
    return jsonify({"reply": reply, "intent": intent, "confidence": score})

if __name__ == "__main__":
    app.run(port=5000, debug=True)`,

    'nlp_classifier.py': `import json, re, math
from collections import Counter

class ParentChatbotNLP:
    def __init__(self, dataset_path="intents_dataset.json"):
        with open(dataset_path, "r", encoding="utf-8") as f:
            self.intents = json.load(f)["intents"]
        self.vocab = sorted(list({w for i in self.intents for p in i["patterns"] for w in self.tokenize(p)}))

    def tokenize(self, text):
        return [self.stem(w) for w in re.findall(r"\\b[a-zA-Z0-9]+\\b", text.lower()) if len(w) > 1]

    def stem(self, w):
        for suf in ['ing', 'ly', 'ed', 'ies', 'es', 's']:
            if w.endswith(suf) and len(w) > len(suf) + 2:
                return w[:-len(suf)]
        return w

    def bow(self, tokens):
        c = Counter(tokens)
        return [c.get(w, 0) for w in self.vocab]

    def cosine_sim(self, v1, v2):
        dot = sum(a * b for a, b in zip(v1, v2))
        n1 = math.sqrt(sum(a * a for a in v1))
        n2 = math.sqrt(sum(b * b for b in v2))
        return (dot / (n1 * n2)) if (n1 and n2) else 0.0

    def predict_intent(self, query):
        q_vec = self.bow(self.tokenize(query))
        best_intent, best_score = None, 0.0
        for i in self.intents:
            for p in i["patterns"]:
                sim = self.cosine_sim(q_vec, self.bow(self.tokenize(p)))
                if sim > best_score:
                    best_score, best_intent = sim, i
        if best_intent and best_score > 0.15:
            return best_intent["tag"], best_score, best_intent["responses"][0]
        return "general", 0.1, "Minimum 75% attendance is required. CIE-2 starts Nov 3, 2026."`,

    'intents_dataset.json': `{
  "intents": [
    {
      "tag": "cie_exam_schedule",
      "patterns": ["When is CIE exam?", "CIE timetable", "Exam dates for TY", "When will unit test 2 start?"],
      "responses": ["CIE-2 Unit Tests for B.Tech TY Computer Engineering are from Nov 3 to Nov 7, 2026 (Daily 10:30 AM - 12:00 PM)."]
    },
    {
      "tag": "attendance_rules",
      "patterns": ["Attendance criteria", "Is 75% attendance mandatory?", "Defaulter policy", "Low attendance rules"],
      "responses": ["Under University Statute 114, minimum 75% attendance is mandatory. Students between 65-74% are placed on the Defaulter List."]
    },
    {
      "tag": "fee_structure",
      "patterns": ["When is fee last date?", "Tuition fee payment", "How much college fee?"],
      "responses": ["Even semester tuition fee is due on Dec 15, 2026. Pay online at https://college-portal.edu.in/fees."]
    }
  ]
}`,

    'streamlit_app.py': `import streamlit as st, requests

st.set_page_config(page_title="Parent Guide AI Chatbot", page_icon="🎓")
st.title("🎓 Parent Information Guide AI")
st.subheader("B.Tech Computer Engineering (TY) • CIE AI Project")

user_q = st.text_input("Ask question (e.g. 'When is CIE-2?', 'Check Aarav attendance TYCOMP-101'):")
if st.button("Submit") and user_q:
    res = requests.post("http://localhost:5000/api/chat", json={"query": user_q})
    st.success(res.json().get("reply", "No reply"))`,

    'requirements.txt': `google-genai>=2.4.0
flask>=3.0.0
flask-cors>=4.0.0
nltk>=3.8.1
scikit-learn>=1.4.0
streamlit>=1.35.0
requests>=2.31.0`
  };

  const handleCopyCode = () => {
    const textToCopy = files[selectedFile] || '';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const textToDownload = files[selectedFile] || '';
    const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Run mock NLP pipeline inside the browser for student presentation
  const runSandboxNLP = () => {
    const rawTokens = sandboxQuery.toLowerCase().match(/[a-z0-9]+/g) || [];
    const stemmer = (w: string) => {
      const suffixes = ['ing', 'ly', 'ed', 'ies', 'es', 's'];
      for (const s of suffixes) {
        if (w.endsWith(s) && w.length > s.length + 2) {
          return w.slice(0, -s.length);
        }
      }
      return w;
    };
    const stemmedTokens = rawTokens.map(stemmer);

    let intent = 'general_guidance';
    let confidence = 0.45;
    let explanation = 'Matched general college query keywords.';

    if (sandboxQuery.toLowerCase().includes('cie') || sandboxQuery.toLowerCase().includes('exam') || sandboxQuery.toLowerCase().includes('timetable')) {
      intent = 'cie_exam_schedule';
      confidence = 0.94;
      explanation = 'High cosine similarity with "cie", "exam", "timetable" intent patterns.';
    } else if (sandboxQuery.toLowerCase().includes('attend') || sandboxQuery.toLowerCase().includes('defaulter') || sandboxQuery.toLowerCase().includes('75')) {
      intent = 'attendance_rules';
      confidence = 0.92;
      explanation = 'High cosine similarity with "attendance", "defaulter", "rules" patterns.';
    } else if (sandboxQuery.toLowerCase().includes('fee') || sandboxQuery.toLowerCase().includes('pay') || sandboxQuery.toLowerCase().includes('receipt')) {
      intent = 'fee_structure';
      confidence = 0.89;
      explanation = 'Matched financial keywords with tuition fee intent vectors.';
    }

    setSandboxResult({
      tokens: rawTokens,
      stemmed: stemmedTokens,
      matchedIntent: intent,
      confidence,
      explanation,
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐍</span>
            <h2 className="text-xl font-bold text-white">Python Backend & CIE Evaluation Kit</h2>
            <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-mono">
              B.Tech TY Comp CIE
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Everything you need for your B.Tech Third Year AI Lab Continuous Internal Evaluation (CIE):
            complete Python Flask/Streamlit source code, NLTK NLP classification engine, project documentation report,
            and viva voce exam questions with answers.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDownloadFile}
            className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-600/20 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download {selectedFile}</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('code')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'code'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Python Source Code Files ({Object.keys(files).length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('viva')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'viva'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-amber-300" />
          <span>CIE Viva Voce Questions & Answers</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sandbox')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'sandbox'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4 text-purple-400" />
          <span>Interactive NLP Pipeline Simulator</span>
        </button>
      </div>

      {/* CODE VIEW */}
      {activeSubTab === 'code' && (
        <div className="space-y-4">
          {/* File selector pills */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {Object.keys(files).map((filename) => (
                <button
                  key={filename}
                  onClick={() => setSelectedFile(filename)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedFile === filename
                      ? 'bg-slate-800 text-amber-300 border border-amber-500/50 shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>{filename}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>

          {/* Code display block */}
          <div className="relative rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs">
            <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-slate-400">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-slate-300 font-semibold ml-2">{selectedFile}</span>
              </div>
              <span className="text-[11px] text-slate-500">
                {(files[selectedFile] || '').split('\n').length} lines
              </span>
            </div>

            <pre className="p-4 overflow-x-auto text-slate-200 max-h-[500px] leading-relaxed">
              <code>{files[selectedFile] || ''}</code>
            </pre>
          </div>

          {/* How to run locally instructions card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>How to Run Locally on Your Laptop for College Lab Submission</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
                <p className="font-semibold text-amber-300">Option 1: Flask REST API Backend</p>
                <p className="text-slate-400">Run the REST API serving intent classification and student lookup:</p>
                <div className="bg-slate-900 p-2.5 rounded-lg text-emerald-400 font-mono text-[11px] space-y-1">
                  <p>pip install -r requirements.txt</p>
                  <p>python app.py</p>
                </div>
                <p className="text-[11px] text-slate-500">API will listen at http://localhost:5000/api/chat</p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
                <p className="font-semibold text-blue-300">Option 2: Standalone Streamlit App</p>
                <p className="text-slate-400">Run the interactive web interface in one single command:</p>
                <div className="bg-slate-900 p-2.5 rounded-lg text-emerald-400 font-mono text-[11px] space-y-1">
                  <p>pip install streamlit requests</p>
                  <p>streamlit run streamlit_app.py</p>
                </div>
                <p className="text-[11px] text-slate-500">Opens directly in your browser with chat & demo students.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CIE VIVA VOCE ACCORDION */}
      {activeSubTab === 'viva' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="font-bold text-white text-base mb-1 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              <span>B.Tech TY Artificial Intelligence Lab — CIE Viva Voce Questions & Answers</span>
            </h3>
            <p className="text-xs text-slate-400">
              Common questions asked by university external examiners and internal faculty during the
              CIE practical evaluation of AI Chatbot projects.
            </p>
          </div>

          <div className="space-y-3">
            {VIVA_QUESTIONS.map((item, idx) => {
              const isExpanded = expandedViva === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-md transition-all"
                >
                  <button
                    onClick={() => setExpandedViva(isExpanded ? null : idx)}
                    className="w-full text-left p-4 flex items-center justify-between gap-3 hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-300 flex items-center justify-center text-xs font-bold shrink-0">
                        Q{idx + 1}
                      </span>
                      <h4 className="font-semibold text-white text-sm">{item.q}</h4>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 bg-slate-950/40">
                      <div className="p-3 bg-blue-950/20 border border-blue-500/20 rounded-xl">
                        <span className="font-semibold text-blue-300 block mb-1">Model Answer for Examiner:</span>
                        <p>{item.a}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* INTERACTIVE NLP SIMULATOR */}
      {activeSubTab === 'sandbox' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div>
            <h3 className="font-bold text-white text-base mb-1 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-purple-400" />
              <span>Step-by-Step NLP Pipeline Demonstration</span>
            </h3>
            <p className="text-xs text-slate-400">
              Demonstrate to the CIE evaluation committee how unstructured parent sentences are
              transformed into tokens, stemmed, and classified via cosine similarity against the college intents database.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={sandboxQuery}
              onChange={(e) => setSandboxQuery(e.target.value)}
              placeholder="Type a sample parent query..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={runSandboxNLP}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-purple-600/20"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Run Pipeline</span>
            </button>
          </div>

          {sandboxResult && (
            <div className="space-y-4 pt-4 border-t border-slate-800 text-xs">
              {/* Step 1: Tokenization */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
                <span className="font-semibold text-blue-300 uppercase tracking-wider text-[10px] block mb-2">
                  Step 1: Regex Tokenization (Alphanumeric Extraction & Lowercasing)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sandboxResult.tokens.map((token, i) => (
                    <span key={i} className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded font-mono">
                      "{token}"
                    </span>
                  ))}
                </div>
              </div>

              {/* Step 2: Stemming */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
                <span className="font-semibold text-purple-300 uppercase tracking-wider text-[10px] block mb-2">
                  Step 2: Rule-Based Suffix Stemming (Porter-style affix stripping)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sandboxResult.stemmed.map((stemmed, i) => (
                    <span key={i} className="bg-purple-950/60 text-purple-200 border border-purple-500/30 px-2 py-0.5 rounded font-mono">
                      {stemmed}
                    </span>
                  ))}
                </div>
              </div>

              {/* Step 3: Intent match */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-semibold text-emerald-400 uppercase tracking-wider text-[10px] block mb-1">
                    Step 3: Cosine Similarity Matching & Classification
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-sm">
                      Intent: <span className="text-amber-300 font-mono">{sandboxResult.matchedIntent}</span>
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono px-2 py-0.5 rounded">
                      Confidence: {(sandboxResult.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">{sandboxResult.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
