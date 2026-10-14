import React, { useState } from 'react';
import { StudentRecord } from '../types';
import { StudentCard } from './StudentCard';
import { Search, Filter, AlertTriangle, CheckCircle2, Users, Sparkles } from 'lucide-react';

interface StudentLookupTabProps {
  students: StudentRecord[];
  onSelectForChat: (rollNo: string, studentName: string) => void;
}

export const StudentLookupTab: React.FC<StudentLookupTabProps> = ({
  students,
  onSelectForChat,
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'defaulters' | 'fee-pending'>('all');

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      s.prn.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'defaulters') {
      return s.overallAttendance < 75;
    }
    if (filter === 'fee-pending') {
      return s.fees.pending > 0;
    }
    return true;
  });

  const totalDefaulters = students.filter((s) => s.overallAttendance < 75).length;
  const totalPendingFees = students.filter((s) => s.fees.pending > 0).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Student Academic Monitor</h2>
            <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-mono">
              B.Tech Comp (TY)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Live evaluation records for Semester 5. Parents can inspect continuous evaluation marks
            (CIE-1 & CIE-2), 75% attendance quota, pending dues, and faculty proctor assignments.
          </p>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2 text-center">
            <div className="text-xs text-slate-400">Total Enrolled</div>
            <div className="text-lg font-bold text-white">{students.length}</div>
          </div>
          <div className="bg-rose-950/30 border border-rose-500/40 rounded-xl px-3.5 py-2 text-center">
            <div className="text-xs text-rose-300 flex items-center gap-1 justify-center">
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              <span>Defaulters (&lt;75%)</span>
            </div>
            <div className="text-lg font-bold text-rose-400">{totalDefaulters}</div>
          </div>
          <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl px-3.5 py-2 text-center">
            <div className="text-xs text-amber-300">Fee Due</div>
            <div className="text-lg font-bold text-amber-400">{totalPendingFees}</div>
          </div>
        </div>
      </div>

      {/* Search and Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, Roll No (e.g. 101), or PRN..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" />
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All Students ({students.length})
          </button>
          <button
            onClick={() => setFilter('defaulters')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
              filter === 'defaulters'
                ? 'bg-rose-600 text-white'
                : 'text-rose-400 hover:text-rose-300 hover:bg-rose-950/40'
            }`}
          >
            <span>Attendance Warning (&lt;75%)</span>
            <span className="px-1.5 py-0.2 rounded bg-rose-900/60 text-[10px]">{totalDefaulters}</span>
          </button>
          <button
            onClick={() => setFilter('fee-pending')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
              filter === 'fee-pending'
                ? 'bg-amber-600 text-white'
                : 'text-amber-400 hover:text-amber-300 hover:bg-amber-950/40'
            }`}
          >
            <span>Pending Fees</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-900/60 text-[10px]">{totalPendingFees}</span>
          </button>
        </div>
      </div>

      {/* Student Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredStudents.map((st) => (
          <StudentCard
            key={st.rollNo}
            student={st}
            onSelectForChat={onSelectForChat}
          />
        ))}

        {filteredStudents.length === 0 && (
          <div className="col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-10 text-center text-slate-400">
            <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="font-medium text-slate-300">No student records match your search.</p>
            <p className="text-xs mt-1">Try searching with "Aarav", "101", "Pooja", or reset the filter.</p>
            <button
              onClick={() => {
                setSearch('');
                setFilter('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-medium cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
