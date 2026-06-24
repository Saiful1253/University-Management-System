import React, { useState } from 'react';
import { 
  Plus, Search, Edit2, Trash2, Filter, X, 
  UserPlus, Calendar, Phone, Mail, MapPin, UserCheck 
} from 'lucide-react';
import { Student, Role } from '../types';

interface StudentManagementProps {
  role: Role;
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onUpdateStudent: (id: string, student: Partial<Student>) => void;
  onDeleteStudent: (id: string) => void;
}

export default function StudentManagement({
  role,
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent
}: StudentManagementProps) {
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('All');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form values
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [studentClass, setStudentClass] = useState('Class 10');
  const [section, setSection] = useState('A');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState<'active' | 'suspended' | 'graduated'>('active');
  const [admissionDate, setAdmissionDate] = useState('2026-06-23');

  // Reset form
  const resetForm = () => {
    setName('');
    setRollNumber('');
    setStudentClass('Class 10');
    setSection('A');
    setEmail('');
    setPhone('');
    setGuardianName('');
    setGuardianPhone('');
    setAddress('');
    setStatus('active');
    setAdmissionDate('2026-06-23');
    setEditingStudent(null);
  };

  // Open modal for editing
  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setName(student.name);
    setRollNumber(student.rollNumber);
    setStudentClass(student.class);
    setSection(student.section);
    setEmail(student.email);
    setPhone(student.phone);
    setGuardianName(student.guardianName);
    setGuardianPhone(student.guardianPhone);
    setAddress(student.address);
    setStatus(student.status);
    setAdmissionDate(student.admissionDate);
    setIsModalOpen(true);
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      name,
      rollNumber: rollNumber || `S${Date.now().toString().slice(-7)}`,
      class: studentClass,
      section,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@school.com`,
      phone,
      guardianName,
      guardianPhone,
      address,
      status,
      admissionDate
    };

    if (editingStudent) {
      onUpdateStudent(editingStudent.id, payload);
    } else {
      onAddStudent(payload);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDeleteClick = (id: string) => {
    if (confirm('Are you sure you want to remove this student?')) {
      onDeleteStudent(id);
    }
  };

  // Unique classes for filtering
  const classesList = ['All', ...Array.from(new Set(students.map(s => s.class)))].sort();

  // Filtered Students
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'All' || student.class === classFilter;
    return matchesSearch && matchesClass;
  });

  const canManage = role === 'admin' || role === 'teacher';
  const isReadOnly = role === 'student';

  return (
    <div className="space-y-6" id="student-management-portal">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Directory</h1>
          <p className="text-xs text-slate-500 font-medium">Manage enrolled students, enrollment records, and parental associations</p>
        </div>
        {canManage && (
          <button
            id="add-student-btn"
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-2xl text-xs font-black cursor-pointer shadow-md shadow-slate-100 transition-colors self-start uppercase tracking-wider"
          >
            <Plus className="h-4 w-4" /> Add Student
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4" id="student-filter-bar">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
          <input
            id="student-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students by name, roll, email..."
            className="w-full pl-11 pr-4 py-2.5 border-2 border-slate-100 focus:border-indigo-500 rounded-2xl text-xs font-medium focus:outline-none bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto bg-slate-50 p-2 rounded-2xl border border-slate-100">
          <Filter className="h-4 w-4 text-slate-400 ml-1" />
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Class:</span>
          <select
            id="class-filter"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl p-1 px-3 text-xs font-bold focus:outline-none"
          >
            {classesList.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xs overflow-hidden" id="student-directory-table">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-widest">
                <th className="p-4 pl-6">Student Details</th>
                <th className="p-4">Roll Number</th>
                <th className="p-4">Class / Sec</th>
                <th className="p-4">Guardian Contact</th>
                <th className="p-4">Status</th>
                {canManage && <th className="p-4 pr-6 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs font-medium">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center shadow-sm shadow-indigo-100">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{student.name}</span>
                          <span className="text-[11px] text-slate-400 block font-medium">{student.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-600">
                      {student.rollNumber}
                    </td>
                    <td className="p-4">
                      <span className="font-extrabold text-slate-800">{student.class}</span>
                      <span className="text-slate-400 font-bold"> - Sec {student.section}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-800 block">{student.guardianName}</span>
                      <span className="text-[11px] text-slate-400 block font-semibold">{student.guardianPhone}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block border ${
                        student.status === 'active' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : student.status === 'suspended'
                          ? 'bg-amber-50 text-amber-700 border-amber-100'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    {canManage && (
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            title="Edit"
                            onClick={() => handleEditClick(student)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg hover:text-slate-950 transition-colors cursor-pointer"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          {role === 'admin' && (
                            <button
                              title="Remove"
                              onClick={() => handleDeleteClick(student.id)}
                              className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg hover:text-rose-700 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={canManage ? 6 : 5} className="p-8 text-center text-slate-400">
                    No student logs found matching the description.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto" id="student-modal-overlay">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" id="student-modal">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-indigo-600" />
                {editingStudent ? 'Modify Student Profile' : 'Enroll New Student'}
              </h2>
              <button 
                onClick={() => { setIsModalOpen(false); resetForm(); }}
                className="p-1 text-slate-400 hover:text-slate-950 hover:bg-slate-50 rounded-lg cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1" htmlFor="student-name">
                    Full Name *
                  </label>
                  <input
                    id="student-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950 focus:border-slate-950 bg-slate-50/50"
                    placeholder="e.g. Clark Kent"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1" htmlFor="student-roll">
                    Roll Number (Optional)
                  </label>
                  <input
                    id="student-roll"
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950 focus:border-slate-950 bg-slate-50/50"
                    placeholder="e.g. S2026009"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1" htmlFor="student-class-select">
                    Class *
                  </label>
                  <select
                    id="student-class-select"
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950 bg-white"
                  >
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1" htmlFor="student-section-select">
                    Section *
                  </label>
                  <select
                    id="student-section-select"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950 bg-white"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1" htmlFor="student-status-select">
                    Status
                  </label>
                  <select
                    id="student-status-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950 bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="graduated">Graduated</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1" htmlFor="student-email">
                    Student Email
                  </label>
                  <input
                    id="student-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950 focus:border-slate-950 bg-slate-50/50"
                    placeholder="student@school.com"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1" htmlFor="student-phone">
                    Phone Number
                  </label>
                  <input
                    id="student-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950 focus:border-slate-950 bg-slate-50/50"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100 space-y-3">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Guardian Details</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1" htmlFor="guardian-name">
                      Guardian Full Name *
                    </label>
                    <input
                      id="guardian-name"
                      type="text"
                      required
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950 bg-white"
                      placeholder="e.g. Martha Kent"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1" htmlFor="guardian-phone">
                      Guardian Phone *
                    </label>
                    <input
                      id="guardian-phone"
                      type="tel"
                      required
                      value={guardianPhone}
                      onChange={(e) => setGuardianPhone(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950 bg-white"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1" htmlFor="student-address">
                  Residential Address
                </label>
                <textarea
                  id="student-address"
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950 focus:border-slate-950 bg-slate-50/50"
                  placeholder="Street details, City, ZIP"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1" htmlFor="student-admission">
                  Date of Admission
                </label>
                <input
                  id="student-admission"
                  type="date"
                  value={admissionDate}
                  onChange={(e) => setAdmissionDate(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950 bg-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  id="student-modal-cancel"
                  onClick={() => { setIsModalOpen(false); resetForm(); }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="student-modal-submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  {editingStudent ? 'Save Changes' : 'Enroll Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
