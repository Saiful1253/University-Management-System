import React from 'react';
import { 
  Users, UserCheck, CreditCard, Bell, Award, 
  BookOpen, Calendar, Clock, DollarSign, ArrowUpRight, CheckCircle
} from 'lucide-react';
import { Student, Teacher, Attendance, ExamResult, FeePayment, Notice, Role } from '../types';

interface DashboardProps {
  role: Role;
  name: string;
  students: Student[];
  teachers: Teacher[];
  attendance: Attendance[];
  exams: ExamResult[];
  fees: FeePayment[];
  notices: Notice[];
  onNavigate: (tab: string) => void;
}

export default function Dashboard({
  role,
  name,
  students,
  teachers,
  attendance,
  exams,
  fees,
  notices,
  onNavigate
}: DashboardProps) {
  
  // Computations
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  
  // Total fees analysis
  const totalExpectedFees = fees.reduce((acc, f) => acc + f.amount, 0);
  const totalCollectedFees = fees.reduce((acc, f) => acc + f.paidAmount, 0);
  const totalPendingFees = totalExpectedFees - totalCollectedFees;
  const collectedPct = totalExpectedFees > 0 ? Math.round((totalCollectedFees / totalExpectedFees) * 100) : 0;

  // Attendance metrics
  const todayDate = '2026-06-23';
  const todayAttendance = attendance.filter(a => a.date === todayDate);
  const presentToday = todayAttendance.filter(a => a.status === 'present').length;
  const lateToday = todayAttendance.filter(a => a.status === 'late').length;
  const absentToday = todayAttendance.filter(a => a.status === 'absent').length;
  const totalTodayLogged = todayAttendance.length;
  const attendanceRate = totalTodayLogged > 0 
    ? Math.round(((presentToday + lateToday) / totalTodayLogged) * 100) 
    : 92; // default high rate if no logs for today

  // Student specific computations (Bruce Wayne - default student s5)
  const studentId = 's5'; 
  const myDetails = students.find(s => s.id === studentId);
  const myExams = exams.filter(e => e.studentId === studentId);
  const myFees = fees.filter(f => f.studentId === studentId);
  const myAttendanceLogs = attendance.filter(a => a.studentId === studentId);
  const myPresentCount = myAttendanceLogs.filter(a => a.status === 'present' || a.status === 'late').length;
  const myAttendanceRate = myAttendanceLogs.length > 0 
    ? Math.round((myPresentCount / myAttendanceLogs.length) * 100) 
    : 100;

  // Teacher specific computations (Minerva McGonagall - default teacher t1)
  const teacherId = 't1';
  const myTeacherDetails = teachers.find(t => t.id === teacherId);
  const studentsInMyClass = students.filter(s => s.class === 'Class 10');

  // Notices
  const importantNotices = notices.filter(n => n.important).slice(0, 3);
  const recentNotices = notices.slice(0, 4);

  return (
    <div className="space-y-6" id="dashboard-container">
      {/* Welcome Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg border-2 border-slate-800" id="welcome-banner">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 md:flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-indigo-300 backdrop-blur-md mb-4 uppercase tracking-wider">
              {role === 'admin' ? '🛡️ Administrator Access' : role === 'teacher' ? '📚 Educator Portal' : '🎓 Student Portal'}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-sans">
              Welcome back, {name}!
            </h1>
            <p className="text-slate-300 text-sm mt-2 max-w-xl font-medium">
              {role === 'admin' 
                ? 'Manage academic sessions, configure accounts, track fee structures, and monitor campus health.'
                : role === 'teacher'
                ? `You are scheduled for transfiguration sessions and managing ${studentsInMyClass.length} students in Class 10-A.`
                : `You are in Class 12-A. Keep up your ${myAttendanceRate}% attendance record and review recent mid-term results.`}
            </p>
          </div>
          <div className="hidden md:block bg-white/10 p-5 rounded-2xl border border-white/10 backdrop-blur-sm text-center">
            <span className="text-xs text-slate-400 block uppercase tracking-widest font-black">Academic Year</span>
            <span className="text-2xl font-black text-white mt-1 block">2026 - 2027</span>
          </div>
        </div>
      </div>

      {/* Admin Dashboard Metrics */}
      {role === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="admin-stats-grid">
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Total Students</span>
                <span className="text-4xl font-black text-slate-800 mt-2 block">{totalStudents}</span>
              </div>
              <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <span className="text-xs text-emerald-500 font-bold flex items-center gap-1 mt-4">
              ↑ 12% from last term
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Faculty Members</span>
                <span className="text-4xl font-black text-slate-800 mt-2 block">{totalTeachers}</span>
              </div>
              <div className="bg-purple-50 p-3 rounded-2xl text-purple-600">
                <UserCheck className="h-6 w-6" />
              </div>
            </div>
            <span className="text-xs text-slate-400 font-bold mt-4 block">
              Full capacity reached
            </span>
          </div>

          {/* Let's style the collected fees as a gorgeous Indigo Bento card! */}
          <div className="col-span-1 bg-indigo-600 rounded-3xl p-6 flex flex-col justify-between text-white overflow-hidden relative hover:opacity-95 transition-opacity shadow-lg shadow-indigo-100">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="flex justify-between items-start z-10">
              <div>
                <span className="text-xs font-bold text-indigo-200 uppercase tracking-widest block">Collected Fees</span>
                <span className="text-3xl font-black text-white mt-2 block">${totalCollectedFees.toLocaleString()}</span>
              </div>
              <div className="bg-white/15 p-3 rounded-2xl text-white">
                <CreditCard className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 z-10">
              <div className="flex justify-between text-xs font-bold opacity-90 mb-1">
                <span>Completed</span>
                <span>{collectedPct}%</span>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div className="bg-white h-full rounded-full" style={{ width: `${collectedPct}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Attendance Rate</span>
                <span className="text-4xl font-black text-slate-800 mt-2 block">{attendanceRate}%</span>
              </div>
              <div className="bg-amber-50 p-3 rounded-2xl text-amber-600">
                <Clock className="h-6 w-6" />
              </div>
            </div>
            <span className="text-xs text-indigo-600 font-bold mt-4 block">
              {presentToday} students present today
            </span>
          </div>
        </div>
      )}

      {/* Teacher Dashboard Metrics */}
      {role === 'teacher' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="teacher-stats-grid">
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">My Homeroom</span>
                <span className="text-3xl font-black text-slate-800 mt-2 block font-sans">Class 10-A</span>
              </div>
              <div className="bg-purple-50 p-3 rounded-2xl text-purple-600">
                <BookOpen className="h-6 w-6" />
              </div>
            </div>
            <span className="text-xs text-slate-500 font-bold mt-4 block">
              {studentsInMyClass.length} Enrolled Students
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Primary Subject</span>
                <span className="text-3xl font-black text-slate-800 mt-2 block font-sans">Mathematics</span>
              </div>
              <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
                <Award className="h-6 w-6" />
              </div>
            </div>
            <span className="text-xs text-indigo-600 font-bold mt-4 block">
              Class 10 & 11 syllabus
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Attendance Today</span>
                <span className="text-3xl font-black text-slate-800 mt-2 block font-sans">
                  {attendance.filter(a => a.date === '2026-06-23' && a.class === 'Class 10').length} / {studentsInMyClass.length}
                </span>
              </div>
              <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
                <UserCheck className="h-6 w-6" />
              </div>
            </div>
            <span className="text-xs text-emerald-600 font-bold mt-4 block">
              Completed logging
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Mid-Term Marks</span>
                <span className="text-3xl font-black text-slate-800 mt-2 block font-sans">85.4%</span>
              </div>
              <div className="bg-amber-50 p-3 rounded-2xl text-amber-600">
                <Award className="h-6 w-6" />
              </div>
            </div>
            <span className="text-xs text-slate-500 font-bold mt-4 block">
              Class Math Average
            </span>
          </div>
        </div>
      )}

      {/* Student Dashboard Metrics */}
      {role === 'student' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="student-stats-grid">
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Enrolled Class</span>
                <span className="text-3xl font-black text-slate-800 mt-2 block font-sans">Class 12-A</span>
              </div>
              <div className="bg-sky-50 p-3 rounded-2xl text-sky-600">
                <BookOpen className="h-6 w-6" />
              </div>
            </div>
            <span className="text-xs text-slate-500 font-bold mt-4 block">
              Roll: S2026005
            </span>
          </div>

          {/* Style student attendance rate as Indigo Bento card */}
          <div className="col-span-1 bg-indigo-600 rounded-3xl p-6 flex flex-col justify-between text-white overflow-hidden relative hover:opacity-95 transition-opacity shadow-lg shadow-indigo-100">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="flex justify-between items-start z-10">
              <div>
                <span className="text-xs font-bold text-indigo-200 uppercase tracking-widest block">Attendance Rate</span>
                <span className="text-4xl font-black text-white mt-2 block font-sans">{myAttendanceRate}%</span>
              </div>
              <div className="bg-white/15 p-3 rounded-2xl text-white">
                <UserCheck className="h-6 w-6" />
              </div>
            </div>
            <span className="text-xs text-indigo-200 font-bold mt-4 block z-10">
              Excellent standing
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Pending Fees</span>
                <span className="text-3xl font-black text-rose-600 mt-2 block font-sans">
                  ${myFees.filter(f => f.status !== 'paid').reduce((acc, f) => acc + (f.amount - f.paidAmount), 0)}
                </span>
              </div>
              <div className="bg-rose-50 p-3 rounded-2xl text-rose-600">
                <CreditCard className="h-6 w-6" />
              </div>
            </div>
            <span className="text-xs text-slate-500 font-bold mt-4 block">
              1 transportation outstanding
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Exam Score</span>
                <span className="text-3xl font-black text-slate-800 mt-2 block font-sans">
                  {myExams.length > 0 
                    ? `${Math.round(myExams.reduce((acc, e) => acc + e.marksObtained, 0) / myExams.length)}%`
                    : 'N/A'}
                </span>
              </div>
              <div className="bg-purple-50 p-3 rounded-2xl text-purple-600">
                <Award className="h-6 w-6" />
              </div>
            </div>
            <span className="text-xs text-indigo-600 font-bold mt-4 block">
              GPA: 4.0 (A+ average)
            </span>
          </div>
        </div>
      )}

      {/* Main Dual Column Dashboard Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-secondary-grid">
        
        {/* Left Column (2-spans wide on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Admin fee graph or quick details */}
          {role === 'admin' && (
            <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-xs hover:border-indigo-300 transition-colors" id="admin-fee-progress-panel">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Fee Collection Overview</h2>
                  <p className="text-xs text-slate-500">Track paid and pending dues across classes</p>
                </div>
                <button
                  onClick={() => onNavigate('fees')}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 group cursor-pointer"
                >
                  Fee Dashboard <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>

              {/* Graphical representation of total fee split */}
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Total Billing</span>
                    <span className="text-lg font-extrabold text-slate-900">${totalExpectedFees.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Total Received</span>
                    <span className="text-lg font-extrabold text-emerald-600">${totalCollectedFees.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Dues Outstanding</span>
                    <span className="text-lg font-extrabold text-rose-600">${totalPendingFees.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600">Collection progress ({collectedPct}%)</span>
                    <span className="text-slate-900">${totalCollectedFees.toLocaleString()} / ${totalExpectedFees.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${collectedPct}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Teacher Student list overview */}
          {role === 'teacher' && (
            <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-xs hover:border-indigo-300 transition-colors" id="teacher-class-panel">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Homeroom Class 10 roster</h2>
                  <p className="text-xs text-slate-500">Quick view of your assigned class status</p>
                </div>
                <button
                  onClick={() => onNavigate('students')}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 group cursor-pointer"
                >
                  Manage Roster <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>

              <div className="divide-y divide-slate-100 overflow-hidden border border-slate-200 rounded-2xl">
                {studentsInMyClass.slice(0, 3).map((std) => (
                  <div key={std.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 bg-indigo-600 text-white flex items-center justify-center font-bold text-sm rounded-xl shadow-sm shadow-indigo-100">
                        {std.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 text-sm block">{std.name}</span>
                        <span className="text-xs text-slate-400 font-medium block">Roll No: {std.rollNumber} • Section {std.section}</span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${std.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700'}`}>
                      {std.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Student exam details chart */}
          {role === 'student' && (
            <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-xs hover:border-indigo-300 transition-colors" id="student-scorecard-panel">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Recent Exam Scorecard</h2>
                  <p className="text-xs text-slate-500">Mid-Term grades across registered subjects</p>
                </div>
                <button
                  onClick={() => onNavigate('exams')}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 group cursor-pointer"
                >
                  Report Card <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>

              <div className="space-y-4">
                {myExams.map((ex) => (
                  <div key={ex.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700">{ex.subject}</span>
                      <span className="text-slate-950 font-black">{ex.marksObtained}/{ex.maxMarks} ({ex.grade})</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${(ex.marksObtained / ex.maxMarks) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Core lists links depending on role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              onClick={() => onNavigate('attendance')}
              className="bg-white p-6 rounded-3xl border-2 border-slate-200 hover:border-indigo-300 transition-all shadow-xs cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-indigo-50 text-indigo-600 p-3.5 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Attendance Registry</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5 leading-relaxed">Track, record, and generate class attendance sheets.</p>
                </div>
              </div>
            </div>

            <div 
              onClick={() => onNavigate('notices')}
              className="bg-white p-6 rounded-3xl border-2 border-slate-200 hover:border-rose-300 transition-all shadow-xs cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-rose-50 text-rose-600 p-3.5 rounded-2xl group-hover:bg-rose-600 group-hover:text-white transition-all">
                  <Bell className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors">Active Notices</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5 leading-relaxed">Publish and broadcast school events & notifications.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info Grid / System Details */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 flex items-center justify-between text-slate-600 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-slate-700">IUBAT Admin is Online</span>
            </div>
            <span className="text-slate-400 font-mono font-bold">Local Time: 2026-06-23</span>
          </div>

        </div>

        {/* Right Column - School Notices & Announcements as a gorgeous dark Bento card */}
        <div className="space-y-6" id="dashboard-noticeboard-column">
          <div className="bg-slate-900 text-white rounded-3xl border-2 border-slate-800 p-6 shadow-xs flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔔</span>
                  <h2 className="text-base font-bold text-white">Notice Board</h2>
                </div>
                <button 
                  onClick={() => onNavigate('notices')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer"
                >
                  View All
                </button>
              </div>

              {/* Notices List with custom styled line tags */}
              <div className="space-y-5 max-h-[380px] overflow-y-auto pr-1">
                {recentNotices.length > 0 ? (
                  recentNotices.map((notice) => (
                    <div key={notice.id} className="border-l-2 border-indigo-500 pl-4 py-1 space-y-1 hover:bg-white/5 rounded-r-xl transition-all">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{notice.postedBy}</p>
                        <span className="text-[10px] text-slate-500 font-mono">{notice.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-100 leading-snug">
                        {notice.title}
                      </h4>
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {notice.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    No notifications recorded.
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Event highlight at the bottom of the notice board */}
            {importantNotices.length > 0 ? (
              <div className="mt-6 bg-indigo-600/20 border border-indigo-500/30 p-4 rounded-2xl">
                <p className="text-[10px] text-indigo-400 uppercase font-black tracking-widest mb-1">Upcoming Event</p>
                <p className="text-sm font-bold text-white line-clamp-1">{importantNotices[0].title}</p>
                <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{importantNotices[0].date} • Main Campus</p>
              </div>
            ) : (
              <div className="mt-6 bg-indigo-600/20 border border-indigo-500/30 p-4 rounded-2xl">
                <p className="text-[10px] text-indigo-400 uppercase font-black tracking-widest mb-1">Upcoming Event</p>
                <p className="text-sm font-bold text-white">Annual Sports Meet 2026</p>
                <p className="text-xs text-slate-300">June 25 • Main Stadium</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
