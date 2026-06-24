import React, { useState, useEffect } from 'react';
import { Calendar, UserCheck, Search, Filter, AlertCircle, Sparkles, Check, X, ShieldAlert } from 'lucide-react';
import { Student, Attendance, Role } from '../types';

interface AttendanceManagementProps {
  role: Role;
  students: Student[];
  attendance: Attendance[];
  onSaveAttendanceBatch: (records: Omit<Attendance, 'id'>[]) => void;
}

export default function AttendanceManagement({
  role,
  students,
  attendance,
  onSaveAttendanceBatch
}: AttendanceManagementProps) {
  const [selectedDate, setSelectedDate] = useState('2026-06-23');
  const [selectedClass, setSelectedClass] = useState('Class 10');
  
  // Local state representing the attendance sheet being edited
  const [sheet, setSheet] = useState<{ [studentId: string]: { status: 'present' | 'absent' | 'late' | 'excused'; remarks: string } }>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  const studentsInClass = students.filter(s => s.class === selectedClass && s.status === 'active');

  // Load existing attendance records for the selected date and class when parameters change
  useEffect(() => {
    const existingRecords = attendance.filter(a => a.date === selectedDate && a.class === selectedClass);
    
    const initialSheet: typeof sheet = {};
    studentsInClass.forEach(student => {
      const match = existingRecords.find(r => r.studentId === student.id);
      initialSheet[student.id] = {
        status: match ? match.status : 'present', // Default to present
        remarks: match?.remarks || ''
      };
    });
    setSheet(initialSheet);
    setSaveSuccess(false);
  }, [selectedDate, selectedClass, attendance, students.length]);

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    setSheet(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setSheet(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks
      }
    }));
  };

  const handleSave = () => {
    const batch: Omit<Attendance, 'id'>[] = studentsInClass.map(student => {
      const state = sheet[student.id] || { status: 'present', remarks: '' };
      return {
        studentId: student.id,
        studentName: student.name,
        rollNumber: student.rollNumber,
        date: selectedDate,
        status: state.status,
        remarks: state.remarks || undefined,
        class: selectedClass
      };
    });

    onSaveAttendanceBatch(batch);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const canManage = role === 'admin' || role === 'teacher';

  // Stats for the class sheet
  const sheetValues = Object.values(sheet) as { status: 'present' | 'absent' | 'late' | 'excused'; remarks: string }[];
  const presentCount = sheetValues.filter(v => v.status === 'present').length;
  const lateCount = sheetValues.filter(v => v.status === 'late').length;
  const absentCount = sheetValues.filter(v => v.status === 'absent').length;
  const excusedCount = sheetValues.filter(v => v.status === 'excused').length;

  // Student portal personal attendance log
  const studentId = 's5'; // Default student
  const myAttendanceLogs = attendance.filter(a => a.studentId === studentId).sort((a,b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6" id="attendance-management-portal">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Attendance Registry</h1>
          <p className="text-xs text-slate-500 font-medium">Record daily attendance, report tardiness, and track student physical presence</p>
        </div>
      </div>

      {/* Student View (Read-Only Personal Log) */}
      {role === 'student' && (
        <div className="space-y-6" id="student-attendance-view">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border-2 border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Total Tracked Days</span>
              <span className="text-4xl font-black text-slate-800 mt-2 block">{myAttendanceLogs.length}</span>
            </div>
            
            {/* Present is a styled green-ish highlight block */}
            <div className="bg-emerald-600 text-white p-6 rounded-3xl relative overflow-hidden shadow-lg shadow-emerald-100/50 flex flex-col justify-between">
              <span className="text-xs font-bold text-emerald-200 uppercase tracking-widest block">Present / On Time</span>
              <span className="text-4xl font-black text-white mt-2 block">
                {myAttendanceLogs.filter(l => l.status === 'present').length}
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Absences / Tardiness</span>
              <span className="text-4xl font-black text-amber-600 mt-2 block">
                {myAttendanceLogs.filter(l => l.status === 'absent' || l.status === 'late').length}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b-2 border-slate-100 bg-slate-50">
              <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">My Attendance History</h2>
            </div>
            <div className="divide-y divide-slate-100 font-medium">
              {myAttendanceLogs.map((log) => (
                <div key={log.id} className="p-4 px-6 flex items-center justify-between text-xs hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4.5 w-4.5 text-indigo-500" />
                    <div>
                      <span className="font-extrabold text-slate-800 block">{log.date}</span>
                      {log.remarks && <span className="text-[11px] text-slate-400 block font-semibold">Note: {log.remarks}</span>}
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase border tracking-wider ${
                    log.status === 'present' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    log.status === 'late' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                    'bg-rose-50 text-rose-700 border-rose-100'
                  }`}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Admin/Teacher Bulk Editor */}
      {canManage && (
        <div className="space-y-6" id="faculty-attendance-editor">
          {/* Controls bar */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6 items-end shadow-xs">
            <div>
              <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2" htmlFor="date-picker">
                Select Date
              </label>
              <input
                id="date-picker"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-indigo-500 rounded-2xl text-xs font-bold focus:outline-none bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2" htmlFor="class-picker">
                Select Class
              </label>
              <select
                id="class-picker"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-indigo-500 rounded-2xl text-xs font-bold focus:outline-none bg-white"
              >
                <option value="Class 10">Class 10</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
              </select>
            </div>

            <div className="text-right pb-1">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-extrabold block mb-1">Roster Class Size</span>
              <span className="text-base font-black text-indigo-600 block">{studentsInClass.length} Active Students Enrolled</span>
            </div>
          </div>

          {/* Quick Metrics of the edited sheet */}
          <div className="grid grid-cols-4 gap-4 text-center bg-slate-50 p-5 rounded-3xl border-2 border-slate-100">
            <div>
              <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">Present</span>
              <span className="text-xl font-black text-emerald-600 block mt-0.5">{presentCount}</span>
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">Late</span>
              <span className="text-xl font-black text-amber-500 block mt-0.5">{lateCount}</span>
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">Absent</span>
              <span className="text-xl font-black text-rose-600 block mt-0.5">{absentCount}</span>
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">Excused</span>
              <span className="text-xl font-black text-indigo-600 block mt-0.5">{excusedCount}</span>
            </div>
          </div>

          {/* Attendance Roster */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b-2 border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-widest">
                    <th className="p-4 pl-6">Student Name</th>
                    <th className="p-4">Roll Number</th>
                    <th className="p-4">Attendance Status Toggles</th>
                    <th className="p-4 pr-6">Remarks / Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-xs font-medium">
                  {studentsInClass.length > 0 ? (
                    studentsInClass.map((student) => {
                      const record = sheet[student.id] || { status: 'present', remarks: '' };
                      return (
                        <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 pl-6">
                            <span className="font-bold text-slate-900 block">{student.name}</span>
                            <span className="text-[11px] text-slate-400 block font-semibold">Class {student.class} • Section {student.section}</span>
                          </td>
                          <td className="p-4 font-mono font-bold text-slate-500">{student.rollNumber}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5">
                              {(['present', 'late', 'absent', 'excused'] as const).map((st) => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => handleStatusChange(student.id, st)}
                                  className={`px-3.5 py-2 rounded-xl text-[10px] font-bold uppercase cursor-pointer border tracking-wider transition-all ${
                                    record.status === st
                                      ? st === 'present'
                                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                                        : st === 'late'
                                        ? 'bg-amber-500 border-amber-500 text-white shadow-xs'
                                        : st === 'absent'
                                        ? 'bg-rose-600 border-rose-600 text-white shadow-xs'
                                        : 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 pr-6">
                            <input
                              type="text"
                              value={record.remarks}
                              onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                              placeholder="e.g. medical reason, late bus"
                              className="w-full px-4 py-2 border-2 border-slate-100 focus:border-indigo-500 rounded-2xl text-xs font-medium focus:outline-none bg-slate-50/50"
                            />
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-400">
                        No active student enrollments for {selectedClass}.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Save Area */}
            {studentsInClass.length > 0 && (
              <div className="p-5 px-6 bg-slate-50 border-t-2 border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <span className="text-xs text-slate-500 font-bold flex items-center gap-1.5">
                  <AlertCircle className="h-4.5 w-4.5 text-indigo-600" />
                  Make sure to save changes before leaving the page.
                </span>
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {saveSuccess && (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 rounded-xl animate-fade-in">
                      <Check className="h-4 w-4" /> Attendance Saved Successfully
                    </span>
                  )}
                  <button
                    id="save-attendance-btn"
                    onClick={handleSave}
                    className="bg-slate-900 hover:bg-indigo-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider cursor-pointer transition-colors shadow-md shadow-slate-100"
                  >
                    Save Attendance Sheet
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
