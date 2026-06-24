import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Shield, Users, Calendar, Award, 
  CreditCard, Bell, LogOut, Menu, X, ChevronRight, UserCircle2, ArrowRightLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Import Types
import { 
  Student, Teacher, Attendance, ExamResult, FeePayment, Notice, Role, User,
  StudentInput, TeacherInput, AttendanceInput, ExamResultInput, FeePaymentInput, NoticeInput
} from './types';

// Import Initial Data
import { 
  INITIAL_STUDENTS, INITIAL_TEACHERS, INITIAL_ATTENDANCE, 
  INITIAL_EXAMS, INITIAL_FEES, INITIAL_NOTICES 
} from './data/mockData';

// Import Modules
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StudentManagement from './components/StudentManagement';
import TeacherManagement from './components/TeacherManagement';
import AttendanceManagement from './components/AttendanceManagement';
import ExamManagement from './components/ExamManagement';
import FeeManagement from './components/FeeManagement';
import NoticeBoard from './components/NoticeBoard';

export default function App() {
  // Session details
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Data State
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [exams, setExams] = useState<ExamResult[]>([]);
  const [fees, setFees] = useState<FeePayment[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  // Navigation state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load state on mount
  useEffect(() => {
    // Helper to read localStorage or default to initial mock data using standard function syntax to avoid TSX parser bug
    function getStoredOrInitial<T>(key: string, initialData: T): T {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          return JSON.parse(stored) as T;
        } catch (e) {
          console.error(`Error parsing localStorage key: ${key}`, e);
        }
      }
      return initialData;
    }

    setStudents(getStoredOrInitial<Student[]>('academix_students', INITIAL_STUDENTS));
    setTeachers(getStoredOrInitial<Teacher[]>('academix_teachers', INITIAL_TEACHERS));
    setAttendance(getStoredOrInitial<Attendance[]>('academix_attendance', INITIAL_ATTENDANCE));
    setExams(getStoredOrInitial<ExamResult[]>('academix_exams', INITIAL_EXAMS));
    setFees(getStoredOrInitial<FeePayment[]>('academix_fees', INITIAL_FEES));
    setNotices(getStoredOrInitial<Notice[]>('academix_notices', INITIAL_NOTICES));

    // Try auto-login with stored user session
    const storedUser = localStorage.getItem('academix_user_session');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('academix_user_session');
      }
    }
  }, []);

  // Save hooks
  const saveToStore = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleLogin = (email: string, role: Role, name: string) => {
    const userSession: User = {
      id: role === 'student' ? 's5' : role === 'teacher' ? 't1' : 'admin_root',
      email,
      role,
      name,
      detailsId: role === 'student' ? 's5' : role === 'teacher' ? 't1' : undefined
    };
    setCurrentUser(userSession);
    localStorage.setItem('academix_user_session', JSON.stringify(userSession));
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('academix_user_session');
  };

  // State manipulation methods passed down to child components
  const handleAddStudent = (newStudent: StudentInput) => {
    const freshStudent: Student = {
      ...newStudent,
      id: `s_${Date.now()}`
    };
    const updated = [freshStudent, ...students];
    setStudents(updated);
    saveToStore('academix_students', updated);
  };

  const handleUpdateStudent = (id: string, updatedFields: Partial<Student>) => {
    const updated = students.map(s => s.id === id ? { ...s, ...updatedFields } : s);
    setStudents(updated);
    saveToStore('academix_students', updated);
  };

  const handleDeleteStudent = (id: string) => {
    const updated = students.filter(s => s.id !== id);
    setStudents(updated);
    saveToStore('academix_students', updated);
  };

  const handleAddTeacher = (newTeacher: TeacherInput) => {
    const freshTeacher: Teacher = {
      ...newTeacher,
      id: `t_${Date.now()}`
    };
    const updated = [freshTeacher, ...teachers];
    setTeachers(updated);
    saveToStore('academix_teachers', updated);
  };

  const handleUpdateTeacher = (id: string, updatedFields: Partial<Teacher>) => {
    const updated = teachers.map(t => t.id === id ? { ...t, ...updatedFields } : t);
    setTeachers(updated);
    saveToStore('academix_teachers', updated);
  };

  const handleDeleteTeacher = (id: string) => {
    const updated = teachers.filter(t => t.id !== id);
    setTeachers(updated);
    saveToStore('academix_teachers', updated);
  };

  const handleSaveAttendanceBatch = (batch: AttendanceInput[]) => {
    // Remove existing records for this date and class, then append new ones
    if (batch.length === 0) return;
    const targetDate = batch[0].date;
    const targetClass = batch[0].class;

    let filtered = attendance.filter(a => !(a.date === targetDate && a.class === targetClass));
    
    const newRecords: Attendance[] = batch.map((item, idx) => ({
      ...item,
      id: `att_${Date.now()}_${idx}`
    }));

    const updated = [...newRecords, ...filtered];
    setAttendance(updated);
    saveToStore('academix_attendance', updated);
  };

  const handleSaveExamResults = (results: ExamResultInput[]) => {
    if (results.length === 0) return;
    const targetExam = results[0].examName;
    const targetClass = results[0].class;
    const targetSubject = results[0].subject;

    let filtered = exams.filter(e => !(e.examName === targetExam && e.class === targetClass && e.subject === targetSubject));
    
    const newRecords: ExamResult[] = results.map((item, idx) => ({
      ...item,
      id: `ex_${Date.now()}_${idx}`
    }));

    const updated = [...newRecords, ...filtered];
    setExams(updated);
    saveToStore('academix_exams', updated);
  };

  const handleAddFeeAllocation = (newFee: FeePaymentInput) => {
    const freshFee: FeePayment = {
      ...newFee,
      id: `fee_${Date.now()}`
    };
    const updated = [freshFee, ...fees];
    setFees(updated);
    saveToStore('academix_fees', updated);
  };

  const handlePayFee = (id: string, payAmount: number, txId: string) => {
    const updated = fees.map(f => {
      if (f.id === id) {
        const newPaidAmount = f.paidAmount + payAmount;
        const newStatus = newPaidAmount >= f.amount ? 'paid' : 'partial';
        return {
          ...f,
          paidAmount: newPaidAmount,
          status: newStatus as 'paid' | 'partial',
          transactionId: txId,
          paymentDate: '2026-06-23'
        };
      }
      return f;
    });
    setFees(updated);
    saveToStore('academix_fees', updated);
  };

  const handleAddNotice = (newNotice: NoticeInput) => {
    const freshNotice: Notice = {
      ...newNotice,
      id: `notice_${Date.now()}`
    };
    const updated = [freshNotice, ...notices];
    setNotices(updated);
    saveToStore('academix_notices', updated);
  };

  const handleDeleteNotice = (id: string) => {
    const updated = notices.filter(n => n.id !== id);
    setNotices(updated);
    saveToStore('academix_notices', updated);
  };

  // Utility to switch role instantly on active sandbox session for demo purposes
  const handleSandboxRoleSwitch = (targetRole: Role) => {
    if (!currentUser) return;
    const nameMap = {
      admin: 'Super Admin',
      teacher: 'Minerva McGonagall',
      student: 'Bruce Wayne'
    };
    const userSession: User = {
      id: targetRole === 'student' ? 's5' : targetRole === 'teacher' ? 't1' : 'admin_root',
      email: `${targetRole}@school.com`,
      role: targetRole,
      name: nameMap[targetRole],
      detailsId: targetRole === 'student' ? 's5' : targetRole === 'teacher' ? 't1' : undefined
    };
    setCurrentUser(userSession);
    localStorage.setItem('academix_user_session', JSON.stringify(userSession));
    setActiveTab('dashboard');
  };

  // Render Login screen if not signed in
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  // Define sidebar menu options based on current user role permission levels
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BookOpen, roles: ['admin', 'teacher', 'student'] },
    { id: 'students', label: 'Student Management', icon: Users, roles: ['admin', 'teacher', 'student'] },
    { id: 'teachers', label: 'Teacher Management', icon: Shield, roles: ['admin', 'teacher', 'student'] },
    { id: 'attendance', label: 'Attendance', icon: Calendar, roles: ['admin', 'teacher', 'student'] },
    { id: 'exams', label: 'Exam & Result', icon: Award, roles: ['admin', 'teacher', 'student'] },
    { id: 'fees', label: 'Fee Management', icon: CreditCard, roles: ['admin', 'teacher', 'student'] },
    { id: 'notices', label: 'Notice Board', icon: Bell, roles: ['admin', 'teacher', 'student'] },
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800 antialiased font-sans" id="app-shell">
      
      {/* PERSISTENT SIDEBAR - DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 bg-white text-slate-700 border-r-2 border-slate-200" id="desktop-sidebar">
        {/* Title */}
        <div className="p-6 border-b-2 border-slate-100 flex items-center gap-3">
          <div className="bg-indigo-600 p-2.5 rounded-xl text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-indigo-100 h-10 w-10 shrink-0">
            I
          </div>
          <div>
            <h2 className="text-slate-800 font-black text-base tracking-tight leading-none">IUBAT Portal</h2>
            <span className="text-[9px] text-indigo-600 font-black uppercase tracking-widest block mt-1">Made By Saiful</span>
          </div>
        </div>

        {/* Navigation Menu Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const IconComponent = item.icon;
            const isTabActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  isTabActive 
                    ? 'bg-indigo-50 text-indigo-700 font-bold' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <IconComponent className={`h-4 w-4 transition-colors ${isTabActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sandbox Role Switcher utility */}
        <div className="p-4 mx-4 mb-4 bg-slate-50 border-2 border-slate-200/80 rounded-2xl space-y-2 text-center">
          <span className="text-[9px] font-black uppercase text-indigo-600 tracking-wider flex items-center justify-center gap-1">
            <ArrowRightLeft className="h-3 w-3" /> Sandbox View Switcher
          </span>
          <div className="flex justify-between gap-1.5 pt-1">
            {(['admin', 'teacher', 'student'] as const).map(r => (
              <button
                key={r}
                onClick={() => handleSandboxRoleSwitch(r)}
                className={`flex-1 py-1 px-1 rounded-lg text-[9px] font-bold uppercase transition-all border ${
                  currentUser.role === r 
                    ? 'bg-indigo-600 border-indigo-600 text-white font-black shadow-sm' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* User Account Bar & Logout */}
        <div className="p-4 border-t-2 border-slate-100 bg-white flex flex-col gap-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-9 w-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <span className="text-slate-800 text-xs font-bold block truncate">{currentUser.name}</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold block truncate">{currentUser.role}</span>
            </div>
          </div>
          <button
            id="desktop-logout-btn"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-all border border-rose-100 cursor-pointer shadow-xs"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER & DRAWER */}
      <header className="md:hidden bg-white border-b-2 border-slate-200 text-slate-800 px-4 py-3 flex items-center justify-between" id="mobile-header">
        <div className="flex items-center gap-2.5">
          <div className="bg-indigo-600 h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-sm">I</div>
          <div>
            <h2 className="text-slate-800 font-black text-sm tracking-tight leading-none">IUBAT Portal</h2>
            <span className="text-[8px] text-indigo-600 font-black uppercase tracking-wider block mt-0.5">Made By Saiful</span>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 hover:bg-slate-50 text-slate-600 rounded-lg cursor-pointer"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile Menu Backdrop & Sheet */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 z-40 md:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-64 bg-white text-slate-700 border-r-2 border-slate-200 z-50 md:hidden flex flex-col justify-between"
            >
              <div>
                <div className="p-4 border-b-2 border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-indigo-600 h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-sm">I</div>
                    <div>
                      <span className="text-slate-800 font-black text-sm tracking-tight block animate-fade-in">IUBAT Portal</span>
                      <span className="text-[8px] text-indigo-600 font-black uppercase tracking-wider block">Made By Saiful</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 hover:bg-slate-50 rounded-lg text-slate-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="p-4 space-y-1">
                  {filteredMenuItems.map((item) => {
                    const IconComponent = item.icon;
                    const isTabActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                          isTabActive ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <IconComponent className={`h-4 w-4 ${isTabActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Role Switcher & Account */}
              <div className="space-y-4">
                <div className="p-4 mx-4 bg-slate-50 border-2 border-slate-200/80 rounded-2xl space-y-2 text-center">
                  <span className="text-[9px] font-black uppercase text-indigo-600 tracking-wider">Sandbox Role View</span>
                  <div className="flex justify-between gap-1">
                    {(['admin', 'teacher', 'student'] as const).map(r => (
                      <button
                        key={r}
                        onClick={() => { handleSandboxRoleSwitch(r); setMobileMenuOpen(false); }}
                        className={`flex-1 py-1 rounded-lg text-[9px] font-bold uppercase transition-all border ${
                          currentUser.role === r ? 'bg-indigo-600 border-indigo-600 text-white font-black' : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 border-t-2 border-slate-100 bg-white flex flex-col gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold border border-indigo-100">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-slate-800 text-xs font-bold block">{currentUser.name}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">{currentUser.role}</span>
                    </div>
                  </div>
                  <button
                    id="mobile-logout-btn"
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-all border border-rose-100 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MAIN VIEW AREA */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto" id="main-content-scroller">
        <div className="w-full max-w-7xl mx-auto" id="main-container-limit">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && (
                <Dashboard
                  role={currentUser.role}
                  name={currentUser.name}
                  students={students}
                  teachers={teachers}
                  attendance={attendance}
                  exams={exams}
                  fees={fees}
                  notices={notices}
                  onNavigate={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'students' && (
                <StudentManagement
                  role={currentUser.role}
                  students={students}
                  onAddStudent={handleAddStudent}
                  onUpdateStudent={handleUpdateStudent}
                  onDeleteStudent={handleDeleteStudent}
                />
              )}

              {activeTab === 'teachers' && (
                <TeacherManagement
                  role={currentUser.role}
                  teachers={teachers}
                  onAddTeacher={handleAddTeacher}
                  onUpdateTeacher={handleUpdateTeacher}
                  onDeleteTeacher={handleDeleteTeacher}
                />
              )}

              {activeTab === 'attendance' && (
                <AttendanceManagement
                  role={currentUser.role}
                  students={students}
                  attendance={attendance}
                  onSaveAttendanceBatch={handleSaveAttendanceBatch}
                />
              )}

              {activeTab === 'exams' && (
                <ExamManagement
                  role={currentUser.role}
                  students={students}
                  exams={exams}
                  onSaveExamResults={handleSaveExamResults}
                />
              )}

              {activeTab === 'fees' && (
                <FeeManagement
                  role={currentUser.role}
                  students={students}
                  fees={fees}
                  onAddFeeAllocation={handleAddFeeAllocation}
                  onPayFee={handlePayFee}
                />
              )}

              {activeTab === 'notices' && (
                <NoticeBoard
                  role={currentUser.role}
                  name={currentUser.name}
                  notices={notices}
                  onAddNotice={handleAddNotice}
                  onDeleteNotice={handleDeleteNotice}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

    </div>
  );
}
