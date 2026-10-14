import React from 'react';
import { StudentRecord } from '../types';
import { AlertTriangle, CheckCircle2, Phone, Mail, MapPin, Clock, CreditCard, BookOpen, User } from 'lucide-react';

interface StudentCardProps {
  student: StudentRecord;
  onSelectForChat?: (rollNo: string, studentName: string) => void;
  compact?: boolean;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onSelectForChat,
  compact = false,
}) => {
  const isDefaulter = student.overallAttendance < 75;

  return (
    <div
      className={`rounded-2xl border transition-all ${
        isDefaulter
          ? 'bg-gradient-to-b from-rose-950/20 via-slate-900 to-slate-900 border-rose-500/40 shadow-rose-950/30'
          : 'bg-slate-900/90 border-slate-700/70 hover:border-slate-600'
      } shadow-lg p-5 text-slate-200`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-lg">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-lg">{student.name}</h3>
              <span className="text-xs bg-slate-800 border border-slate-700 px-2 py-0.5 rounded font-mono text-slate-300">
                {student.rollNo}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {student.yearBranch} • {student.semester} • PRN: {student.prn}
            </p>
          </div>
        </div>

        {/* Overall Attendance Tag */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-sm font-semibold ${
              isDefaulter
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
            }`}
          >
            {isDefaulter ? (
              <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
            <span>{student.overallAttendance}% Attendance</span>
          </div>
        </div>
      </div>

      {/* Defaulter Alert Message */}
      {isDefaulter && (
        <div className="mt-4 p-3 bg-rose-950/40 border border-rose-500/50 rounded-xl flex items-start gap-3 text-xs text-rose-200">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-300">
              Attendance Alert: Ward is on the University Defaulter List
            </p>
            <p className="mt-0.5 text-rose-200/90">
              Attendance is below the mandatory 75% threshold (Statute 114). A meeting with Proctor{' '}
              <span className="font-medium underline">{student.proctorTeacher.name}</span> is
              requested this Saturday.
            </p>
          </div>
        </div>
      )}

      {/* Subject-Wise Attendance Breakdown */}
      <div className="mt-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-blue-400" />
          <span>Subject Attendance & CIE Scores</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {student.subjectAttendance.map((sub, idx) => {
            const cieMatch = student.cieMarks.find((c) => c.code === sub.code);
            const isSubLow = sub.percentage < 75;
            return (
              <div
                key={sub.code}
                className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-2.5 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-medium text-slate-200 truncate pr-2" title={sub.subject}>
                    {sub.subject}
                  </span>
                  <span
                    className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${
                      isSubLow ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {sub.percentage}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full ${
                      isSubLow ? 'bg-rose-500' : sub.percentage >= 85 ? 'bg-emerald-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(100, sub.percentage)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>
                    Attended: {sub.attended}/{sub.conducted}
                  </span>
                  {cieMatch && (
                    <span className="font-semibold text-amber-300">
                      CIE Avg: {cieMatch.avgCie}/30
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fee & Proctor Row */}
      <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Fee status */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-blue-400" />
              <span>Tuition Fee Status</span>
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                student.fees.pending === 0
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              {student.fees.status}
            </span>
          </div>
          <div className="flex items-baseline justify-between text-slate-200 mt-1">
            <span>Paid: ₹{student.fees.paid.toLocaleString()}</span>
            {student.fees.pending > 0 ? (
              <span className="text-amber-400 font-semibold">
                Due: ₹{student.fees.pending.toLocaleString()}
              </span>
            ) : (
              <span className="text-emerald-400 text-[11px]">All Cleared</span>
            )}
          </div>
        </div>

        {/* Proctor Contact */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3">
          <p className="text-slate-400 font-medium mb-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-blue-400" />
            <span>Assigned Faculty Proctor</span>
          </p>
          <p className="text-white font-semibold truncate">{student.proctorTeacher.name}</p>
          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-500" />
              {student.proctorTeacher.phone}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              Saturdays 10 AM
            </span>
          </div>
        </div>
      </div>

      {/* Action button */}
      {onSelectForChat && (
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => onSelectForChat(student.rollNo, student.name)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-600/20"
          >
            <span>💬 Ask AI Chatbot About {student.name.split(' ')[0]}</span>
          </button>
        </div>
      )}
    </div>
  );
};
