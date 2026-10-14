import React from 'react';
import { Calendar, Clock, AlertTriangle, FileText, CheckCircle2, Phone, Mail, Award, BookCheck } from 'lucide-react';

export const AcademicCalendarTab: React.FC = () => {
  const events = [
    {
      title: 'CIE-1 (Unit Test 1)',
      dates: 'August 18 – 22, 2026',
      status: 'Completed',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      description: 'Covered Units 1 & 2 across AI, DBMS, OS, and CN. Evaluated answer sheets distributed.',
      weightage: '30 Marks (Scaled to 15)',
    },
    {
      title: 'CIE-2 (Unit Test 2 / Mid-Term)',
      dates: 'November 3 – 7, 2026',
      status: 'Upcoming (Next Week)',
      statusColor: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
      description: 'Covers Units 3, 4 & 5. Daily timing: 10:30 AM to 12:00 PM. Seating plan released in Dept.',
      weightage: '30 Marks (Scaled to 15)',
    },
    {
      title: 'AI Lab & Mini-Project CIE Evaluation',
      dates: 'November 15, 2026',
      status: 'Scheduled',
      statusColor: 'text-blue-300 bg-blue-500/10 border-blue-500/30',
      description: 'Departmental review of AI working code, lab journal, and project documentation (CIE practical component).',
      weightage: '25 Marks Lab CIE',
    },
    {
      title: 'Autonomous Practical & Viva Voce Exam',
      dates: 'November 24 – 28, 2026',
      status: 'External Examiner Appointed',
      statusColor: 'text-purple-300 bg-purple-500/10 border-purple-500/30',
      description: 'University oral examinations conducted with external academic assessors.',
      weightage: '50 Marks Practical/Oral',
    },
    {
      title: 'Semester End Theory Examination (SEE)',
      dates: 'December 8 – 22, 2026',
      status: 'Hall Tickets: Dec 1',
      statusColor: 'text-slate-300 bg-slate-800 border-slate-700',
      description: 'Autonomous university theory examination. Hall tickets require ≥75% attendance and fee clearance.',
      weightage: '50 Marks Theory',
    },
  ];

  const facultyList = [
    {
      name: 'Dr. Rajesh Kulkarni',
      role: 'Professor & Head of Computer Engineering (HOD)',
      email: 'hod.comp@engg.edu.in',
      phone: '+91 94220 11289',
      cabin: 'HOD Office, Ground Floor',
      hours: 'Mon & Fri 3:00 PM - 5:00 PM',
    },
    {
      name: 'Dr. Priya Mehta',
      role: 'Associate Professor, Artificial Intelligence Course Lead',
      email: 'p.mehta@engg.edu.in',
      phone: '+91 99221 88765',
      cabin: 'Room 312, Central Computing Facility',
      hours: 'Wed 2:00 PM - 4:00 PM',
    },
    {
      name: 'Prof. Sunita Deshmukh',
      role: 'Associate Professor, Third Year Class Teacher & Proctor',
      email: 's.deshmukh@engg.edu.in',
      phone: '+91 98230 45671',
      cabin: 'Room 304, IT & Computer Block',
      hours: 'Saturdays 10:00 AM - 1:00 PM',
    },
    {
      name: 'Prof. Amit Patil',
      role: 'Assistant Professor, Computer Networks & Proctor',
      email: 'a.patil@engg.edu.in',
      phone: '+91 97654 32190',
      cabin: 'Room 208, Computer Block',
      hours: 'Tue & Thu 11:00 AM - 1:00 PM',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Academic Calendar & Evaluation Rules</h2>
        </div>
        <p className="text-xs text-slate-400 max-w-2xl">
          Comprehensive guide on Continuous Internal Evaluation (CIE), university attendance statutes,
          and contact directory for parents of B.Tech Computer Engineering (Third Year).
        </p>
      </div>

      {/* CIE Scheme Explanation Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/30 rounded-2xl p-5 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-3">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm mb-1">CIE Evaluation Architecture</h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Internal marks account for 50% of the total 100-mark course credit:
          </p>
          <ul className="text-xs text-slate-300/90 space-y-1.5 list-disc list-inside">
            <li><span className="font-semibold text-white">CIE-1</span> (Unit Test 1): 30 Marks</li>
            <li><span className="font-semibold text-white">CIE-2</span> (Unit Test 2): 30 Marks</li>
            <li>Average of CIE-1 & CIE-2 = <span className="text-amber-300 font-semibold">30 Marks</span></li>
            <li>Continuous Lab & Quizzes = <span className="text-amber-300 font-semibold">20 Marks</span></li>
            <li>Total Internal CIE = <span className="text-emerald-400 font-bold">50 Marks</span></li>
            <li>Semester End Exam (SEE) = <span className="text-emerald-400 font-bold">50 Marks</span></li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 rounded-2xl p-5 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-3">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm mb-1">75% Attendance Statute</h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            University regulation strictly mandates continuous lecture presence:
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-300">
              <span className="font-bold">≥ 75%:</span> Full eligibility for exams and placements.
            </div>
            <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-300">
              <span className="font-bold">65% – 74%:</span> Placed on monthly Defaulter List. Mandatory parent undertaking.
            </div>
            <div className="p-2 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-300">
              <span className="font-bold">&lt; 65%:</span> Detained from Semester End Exams.
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30 rounded-2xl p-5 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-3">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm mb-1">Leave & Medical Policy</h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Procedures for student absence notification:
          </p>
          <ul className="text-xs text-slate-300/90 space-y-1.5 list-disc list-inside">
            <li><span className="font-semibold text-white">1–2 Days</span>: Written application signed by parent submitted to Proctor.</li>
            <li><span className="font-semibold text-white">&gt;3 Days (Medical)</span>: Doctor's prescription, fitness certificate, and parent signature within 3 working days.</li>
            <li><span className="font-semibold text-white">Hostel Night Out</span>: Parent authorization required via registered SMS/WhatsApp.</li>
          </ul>
        </div>
      </div>

      {/* Timeline of CIE & Semester Exams */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <span>Timeline of B.Tech TY Examinations & Milestones</span>
        </h3>

        <div className="space-y-4">
          {events.map((ev, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-slate-600 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-bold text-white text-sm">{ev.title}</h4>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${ev.statusColor}`}>
                    {ev.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{ev.description}</p>
                <div className="text-xs text-blue-300 font-medium">Dates: {ev.dates}</div>
              </div>

              <div className="self-start md:self-auto shrink-0 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700/80 text-xs font-mono text-amber-300 font-semibold">
                {ev.weightage}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Faculty Proctor & HOD Directory */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
          <Phone className="w-4 h-4 text-blue-400" />
          <span>Faculty Proctors & Department Directory</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {facultyList.map((fac, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 flex flex-col justify-between space-y-3"
            >
              <div>
                <h4 className="font-bold text-white text-sm">{fac.name}</h4>
                <p className="text-xs text-blue-300 font-medium mt-0.5">{fac.role}</p>
                <p className="text-xs text-slate-400 mt-1">Location: {fac.cabin}</p>
              </div>

              <div className="pt-2 border-t border-slate-700/60 text-xs text-slate-300 space-y-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{fac.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{fac.email}</span>
                </div>
                <div className="flex items-center gap-2 text-amber-300">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Visiting Hours: {fac.hours}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
