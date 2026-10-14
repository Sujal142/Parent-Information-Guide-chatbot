import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatTab } from './components/ChatTab';
import { StudentLookupTab } from './components/StudentLookupTab';
import { AcademicCalendarTab } from './components/AcademicCalendarTab';
import { PythonKitTab } from './components/PythonKitTab';
import { StudentRecord } from './types';
import { INITIAL_STUDENTS } from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'students' | 'calendar' | 'python'>('chat');
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);
  const [selectedRoll, setSelectedRoll] = useState<string>('');
  const [language, setLanguage] = useState<string>('English');
  const [pythonFiles, setPythonFiles] = useState<Record<string, string> | undefined>(undefined);
  const [report, setReport] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Fetch students from server API
    fetch('/api/students')
      .then((res) => {
        if (!res.ok) throw new Error('API request failed');
        return res.json();
      })
      .then((data) => {
        if (data.students && data.students.length > 0) {
          setStudents(data.students);
        }
      })
      .catch((err) => {
        console.warn('Using client-side mock student data:', err);
      });

    // Fetch Python kit source files
    fetch('/api/python-kit')
      .then((res) => res.json())
      .then((data) => {
        if (data.files) {
          setPythonFiles(data.files);
        }
        if (data.report) {
          setReport(data.report);
        }
      })
      .catch((err) => {
        console.warn('Using fallback python kit files:', err);
      });
  }, []);

  const handleSelectStudentForChat = (rollNo: string, studentName: string) => {
    setSelectedRoll(rollNo);
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
      />

      <main className="flex-1 p-3 sm:p-6 max-w-7xl mx-auto w-full">
        {activeTab === 'chat' && (
          <ChatTab
            students={students}
            selectedRoll={selectedRoll}
            setSelectedRoll={setSelectedRoll}
            language={language}
          />
        )}

        {activeTab === 'students' && (
          <StudentLookupTab
            students={students}
            onSelectForChat={handleSelectStudentForChat}
          />
        )}

        {activeTab === 'calendar' && <AcademicCalendarTab />}

        {activeTab === 'python' && (
          <PythonKitTab
            initialFiles={pythonFiles}
            initialReport={report}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-3 text-center text-xs text-slate-500">
        <p>
          B.Tech Computer Engineering (Third Year - TY) • AI Lab Continuous Internal Evaluation (CIE) Project
        </p>
      </footer>
    </div>
  );
}
