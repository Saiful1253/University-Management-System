import React, { useState, useEffect } from 'react';
import { Award, BookOpen, Search, Filter, AlertCircle, Check, HelpCircle, Eye } from 'lucide-react';
import { Student, ExamResult, Role } from '../types';

interface ExamManagementProps {
  role: Role;
  students: Student[];
  exams: ExamResult[];
  onSaveExamResults: (results: Omit<ExamResult, 'id'>[]) => void;
}

export default function ExamManagement({
  role,
  students,
  exams,
  onSaveExamResults
}: ExamManagementProps) {
  const [selectedExam, setSelectedExam] = useState('Mid-Term');
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  
  // Grade sheet state
  const [gradeSheet, setGradeSheet] = useState<{ [studentId: string]: { marks: string; maxMarks: string; remarks: string } }>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  const studentsInClass = students.filter(s => s.class === selectedClass && s.status === 'active');

  // Load existing grade results
  useEffect(() => {
    const existingGrades = exams.filter(e => e.examName === selectedExam && e.class === selectedClass && e.subject === selectedSubject);
    
    const initialSheet: typeof gradeSheet = {};
    studentsInClass.forEach(student => {
      const match = existingGrades.find(g => g.studentId === student.id);
      initialSheet[student.id] = {
        marks: match ? String(match.marksObtained) : '',
        maxMarks: match ? String(match.maxMarks) : '100',
        remarks: match?.remarks || ''
      };
    });
    setGradeSheet(initialSheet);
    setSaveSuccess(false);
  }, [selectedExam, selectedClass, selectedSubject, exams, students.length]);

  const handleMarksChange = (studentId: string, marks: string) => {
    setGradeSheet(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        marks
      }
    }));
  };

  const handleMaxMarksChange = (studentId: string, maxMarks: string) => {
    setGradeSheet(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        maxMarks
      }
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setGradeSheet(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks
      }
    }));
  };

  // Helper to calculate Grade
  const calculateGrade = (obtained: number, max: number): string => {
    if (max <= 0) return 'F';
    const pct = (obtained / max) * 100;
    if (pct >= 90) return 'A+';
    if (pct >= 80) return 'A';
    if (pct >= 70) return 'B';
    if (pct >= 60) return 'C';
    if (pct >= 50) return 'D';
    return 'F';
  };

  const handleSave = () => {
    const batch: Omit<ExamResult, 'id'>[] = [];
    
    studentsInClass.forEach(student => {
      const state = gradeSheet[student.id];
      if (state && state.marks !== '') {
        const obtained = Number(state.marks);
        const max = Number(state.maxMarks) || 100;
        
        batch.push({
          studentId: student.id,
          studentName: student.name,
          rollNumber: student.rollNumber,
          class: selectedClass,
          examName: selectedExam,
          subject: selectedSubject,
          marksObtained: obtained,
          maxMarks: max,
          grade: calculateGrade(obtained, max),
          remarks: state.remarks || undefined,
          date: '2026-06-23'
        });
      }
    });

    onSaveExamResults(batch);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const canManage = role === 'admin' || role === 'teacher';

  // Stats for current class grade sheet
  const scoredRecords = (Object.entries(gradeSheet) as [string, { marks: string; maxMarks: string; remarks: string }][]).filter(([_, val]) => val.marks !== '');
  const averagePct = scoredRecords.length > 0 
    ? Math.round(scoredRecords.reduce((acc, [_, val]) => acc + (Number(val.marks) / (Number(val.maxMarks) || 100)) * 100, 0) / scoredRecords.length)
    : 0;

  // Student portal Report Card
  const studentId = 's5'; // Default student login details
  const myResults = exams.filter(e => e.studentId === studentId);
  const myGpa = myResults.length > 0
    ? (myResults.reduce((acc, r) => {
        const grade = r.grade;
        if (grade === 'A+') return acc + 4.0;
        if (grade === 'A') return acc + 3.7;
        if (grade === 'B') return acc + 3.0;
        if (grade === 'C') return acc + 2.0;
        if (grade === 'D') return acc + 1.0;
        return acc;
      }, 0) / myResults.length).toFixed(2)
    : '0.00';

  return (
    <div className="space-y-6" id="exam-results-portal">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Exams & Academic Results</h1>
          <p className="text-xs text-slate-500 font-medium">Record, compile, and publish grade scorecards, transcripts, and term reports</p>
        </div>
      </div>

      {/* Student Portal - Report Card */}
      {role === 'student' && (
        <div className="space-y-6" id="student-reportcard-portal">
          <div className="bg-slate-950 text-white p-6 md:p-8 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-md border border-slate-800">
            <div className="text-center md:text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-400 block">Personal Academic Standing</span>
              <h2 className="text-xl font-extrabold text-white mt-1">GPA Transcript</h2>
              <p className="text-xs text-slate-400 mt-1 leading-normal">Derived from {myResults.length} published terminal term courses</p>
            </div>
            <div className="text-center bg-white/5 p-4 py-5 rounded-2xl border border-white/10 min-w-[140px] backdrop-blur-md shadow-inner">
              <span className="text-[10px] text-slate-400 uppercase font-black block tracking-widest">Cumulative GPA</span>
              <span className="text-3xl font-black text-sky-400 block mt-1">{myGpa}</span>
              <span className="text-[9px] text-emerald-400 block font-bold mt-0.5">Top Tier Standing</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b-2 border-slate-100 flex items-center gap-2 bg-slate-50">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Term-wise Published Results</h3>
            </div>
            <div className="divide-y divide-slate-100 font-medium">
              {myResults.length > 0 ? (
                myResults.map((res) => (
                  <div key={res.id} className="p-5 px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{res.examName}</span>
                      <h4 className="font-extrabold text-slate-900 text-sm">{res.subject}</h4>
                      {res.remarks && <p className="text-[11px] text-slate-400 leading-normal font-semibold">Teacher Comments: "{res.remarks}"</p>}
                    </div>

                    <div className="flex items-center gap-4 self-start sm:self-center">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase block font-black tracking-wider">Score</span>
                        <span className="font-mono font-bold text-slate-700">{res.marksObtained} / {res.maxMarks}</span>
                      </div>
                      <div className="h-10 w-10 rounded-xl bg-slate-900 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                        {res.grade}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400">
                  No academic results logged for your student ID.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin/Teacher Portal - Roster Gradebook */}
      {canManage && (
        <div className="space-y-6" id="faculty-grade-entry">
          {/* Controls Panel */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2" htmlFor="exam-selector">
                Exam Type
              </label>
              <select
                id="exam-selector"
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-indigo-500 rounded-2xl text-xs font-bold focus:outline-none bg-white"
              >
                <option value="Mid-Term">Mid-Term</option>
                <option value="Final Exam">Final Exam</option>
                <option value="First Assessment">First Assessment</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2" htmlFor="exam-class-selector">
                Assigned Class
              </label>
              <select
                id="exam-class-selector"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-indigo-500 rounded-2xl text-xs font-bold focus:outline-none bg-white"
              >
                <option value="Class 10">Class 10</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2" htmlFor="subject-selector">
                Select Course / Subject
              </label>
              <select
                id="subject-selector"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-indigo-500 rounded-2xl text-xs font-bold focus:outline-none bg-white"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Social Studies">Social Studies</option>
                <option value="History & Ethics">History & Ethics</option>
              </select>
            </div>
          </div>

          {/* Graphical Progress Bar */}
          {scoredRecords.length > 0 && (
            <div className="bg-slate-50 border-2 border-slate-100 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-700">
              <div className="space-y-0.5">
                <span className="font-extrabold text-slate-900 block">Syllabus Gradebook Status</span>
                <p className="text-slate-500 text-[11px] font-medium">{scoredRecords.length} / {studentsInClass.length} Students Graded for {selectedExam} - {selectedSubject}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-black block tracking-wider">Class average</span>
                  <span className="font-extrabold text-indigo-600 text-sm">{averagePct}%</span>
                </div>
                <div className="w-28 bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-900 h-full rounded-full" style={{ width: `${averagePct}%` }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Score Roster List */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b-2 border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-widest">
                    <th className="p-4 pl-6">Student Name</th>
                    <th className="p-4">Roll Number</th>
                    <th className="p-4 w-40">Marks Obtained</th>
                    <th className="p-4 w-32">Max Marks</th>
                    <th className="p-4">Auto Grade</th>
                    <th className="p-4 pr-6">Feedback Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-xs font-medium">
                  {studentsInClass.length > 0 ? (
                    studentsInClass.map((student) => {
                      const state = gradeSheet[student.id] || { marks: '', maxMarks: '100', remarks: '' };
                      const scoreNum = Number(state.marks);
                      const maxNum = Number(state.maxMarks) || 100;
                      const hasScore = state.marks !== '';
                      
                      return (
                        <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 pl-6">
                            <span className="font-bold text-slate-900 block">{student.name}</span>
                            <span className="text-[11px] text-slate-400 block font-semibold">{student.class} • Sec {student.section}</span>
                          </td>
                          <td className="p-4 font-mono font-bold text-slate-500">{student.rollNumber}</td>
                          <td className="p-4">
                            <input
                              type="number"
                              min="0"
                              max={maxNum}
                              value={state.marks}
                              onChange={(e) => handleMarksChange(student.id, e.target.value)}
                              placeholder="Score"
                              className="w-full max-w-[120px] px-4 py-2 border-2 border-slate-100 focus:border-indigo-500 rounded-2xl text-xs bg-slate-50/50 font-black text-slate-800 focus:outline-none"
                            />
                          </td>
                          <td className="p-4">
                            <input
                              type="number"
                              min="1"
                              value={state.maxMarks}
                              onChange={(e) => handleMaxMarksChange(student.id, e.target.value)}
                              placeholder="Max"
                              className="w-full max-w-[100px] px-4 py-2 border-2 border-slate-100 focus:border-indigo-500 rounded-2xl text-xs bg-slate-50/50 text-slate-400 font-bold focus:outline-none"
                            />
                          </td>
                          <td className="p-4">
                            {hasScore ? (
                              <span className="px-3.5 py-1.5 bg-slate-900 text-white font-extrabold rounded-xl text-[10px] shadow-sm font-mono uppercase tracking-wider">
                                {calculateGrade(scoreNum, maxNum)}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic font-semibold">Not Graded</span>
                            )}
                          </td>
                          <td className="p-4 pr-6">
                            <input
                              type="text"
                              value={state.remarks}
                              onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                              placeholder="Outstanding, needs revision..."
                              className="w-full px-4 py-2 border-2 border-slate-100 focus:border-indigo-500 rounded-2xl text-xs font-medium bg-slate-50/50 focus:outline-none"
                            />
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        No active student enrollments for {selectedClass} to record grades.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Actions Bar */}
            {studentsInClass.length > 0 && (
              <div className="p-5 px-6 bg-slate-50 border-t-2 border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <span className="text-xs text-slate-500 font-bold flex items-center gap-1.5">
                  <AlertCircle className="h-4.5 w-4.5 text-indigo-600" />
                  Saving updates existing grades or adds scores for students with values.
                </span>
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {saveSuccess && (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 rounded-xl animate-fade-in">
                      <Check className="h-4 w-4" /> Scores Published Successfully
                    </span>
                  )}
                  <button
                    id="save-grades-btn"
                    onClick={handleSave}
                    className="bg-slate-900 hover:bg-indigo-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider cursor-pointer transition-colors shadow-md shadow-slate-100"
                  >
                    Publish Grades & Remarks
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
