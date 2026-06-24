import React, { useState } from 'react';
import { 
  Plus, Search, Edit2, Trash2, Filter, X, 
  UserPlus, Calendar, Phone, Mail, Award, ShieldAlert 
} from 'lucide-react';
import { Teacher, Role } from '../types';

interface TeacherManagementProps {
  role: Role;
  teachers: Teacher[];
  onAddTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  onUpdateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  onDeleteTeacher: (id: string) => void;
}

export default function TeacherManagement({
  role,
  teachers,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher
}: TeacherManagementProps) {
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  // Form values
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [subject, setSubject] = useState('');
  const [classTeacherOf, setClassTeacherOf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [joiningDate, setJoiningDate] = useState('2026-06-23');
  const [qualification, setQualification] = useState('');
  const [status, setStatus] = useState<'active' | 'on-leave' | 'inactive'>('active');

  // Reset Form
  const resetForm = () => {
    setName('');
    setEmployeeId('');
    setSubject('');
    setClassTeacherOf('');
    setEmail('');
    setPhone('');
    setJoiningDate('2026-06-23');
    setQualification('');
    setStatus('active');
    setEditingTeacher(null);
  };

  // Open Edit Modal
  const handleEditClick = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setName(teacher.name);
    setEmployeeId(teacher.employeeId);
    setSubject(teacher.subject);
    setClassTeacherOf(teacher.classTeacherOf || '');
    setEmail(teacher.email);
    setPhone(teacher.phone);
    setJoiningDate(teacher.joiningDate);
    setQualification(teacher.qualification);
    setStatus(teacher.status);
    setIsModalOpen(true);
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name,
      employeeId: employeeId || `T${Date.now().toString().slice(-7)}`,
      subject,
      classTeacherOf: classTeacherOf ? classTeacherOf : undefined,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@school.com`,
      phone,
      joiningDate,
      qualification,
      status
    };

    if (editingTeacher) {
      onUpdateTeacher(editingTeacher.id, payload);
    } else {
      onAddTeacher(payload);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDeleteClick = (id: string) => {
    if (confirm('Are you sure you want to remove this teacher from the database?')) {
      onDeleteTeacher(id);
    }
  };

  // Filtered teachers
  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          teacher.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || teacher.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const canManage = role === 'admin';

  return (
    <div className="space-y-6" id="teacher-management-portal">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Faculty Registry</h1>
          <p className="text-xs text-slate-500 font-medium">Manage academic departments, instructor courses, homerooms, and qualification logs</p>
        </div>
        {canManage && (
          <button
            id="add-teacher-btn"
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-2xl text-xs font-black cursor-pointer shadow-md shadow-slate-100 transition-colors self-start uppercase tracking-wider"
          >
            <Plus className="h-4 w-4" /> Register Teacher
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4" id="teacher-filter-bar">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
          <input
            id="teacher-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search teachers by name, subject, ID..."
            className="w-full pl-11 pr-4 py-2.5 border-2 border-slate-100 focus:border-indigo-500 rounded-2xl text-xs font-medium focus:outline-none bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto bg-slate-50 p-2 rounded-2xl border border-slate-100">
          <Filter className="h-4 w-4 text-slate-400 ml-1" />
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Status:</span>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl p-1 px-3 text-xs font-bold focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="active">Active</option>
            <option value="on-leave">On Leave</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xs overflow-hidden" id="teacher-directory-table">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-widest">
                <th className="p-4 pl-6">Faculty Member</th>
                <th className="p-4">Employee ID</th>
                <th className="p-4">Primary Subject</th>
                <th className="p-4">Class Homeroom</th>
                <th className="p-4">Credentials</th>
                <th className="p-4">Status</th>
                {canManage && <th className="p-4 pr-6 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs font-medium">
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center shadow-sm shadow-indigo-100">
                          {teacher.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{teacher.name}</span>
                          <span className="text-[11px] text-slate-400 block font-medium">{teacher.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-600">
                      {teacher.employeeId}
                    </td>
                    <td className="p-4">
                      <span className="font-extrabold text-slate-800">{teacher.subject}</span>
                    </td>
                    <td className="p-4 font-medium">
                      {teacher.classTeacherOf ? (
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-xl font-extrabold text-[10px] uppercase tracking-wider border border-indigo-100">
                          {teacher.classTeacherOf}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">No Class Assigned</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-slate-700 block truncate max-w-xs font-bold">{teacher.qualification}</span>
                      <span className="text-[10px] text-slate-400 block font-semibold">Joined: {teacher.joiningDate}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block border ${
                        teacher.status === 'active' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : teacher.status === 'on-leave'
                          ? 'bg-amber-50 text-amber-700 border-amber-100'
                          : 'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        {teacher.status}
                      </span>
                    </td>
                    {canManage && (
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            title="Edit Profile"
                            onClick={() => handleEditClick(teacher)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg hover:text-slate-950 transition-colors cursor-pointer"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            title="De-register"
                            onClick={() => handleDeleteClick(teacher.id)}
                            className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg hover:text-rose-700 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={canManage ? 7 : 6} className="p-8 text-center text-slate-400">
                    No faculty records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto" id="teacher-modal-overlay">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" id="teacher-modal">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-indigo-600" />
                {editingTeacher ? 'Modify Instructor Credentials' : 'Register New Faculty'}
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
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1" htmlFor="teacher-name">
                    Full Name *
                  </label>
                  <input
                    id="teacher-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950 focus:border-slate-950 bg-slate-50/50"
                    placeholder="e.g. Severus Snape"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1" htmlFor="teacher-empid">
                    Employee ID (Optional)
                  </label>
                  <input
                    id="teacher-empid"
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950 focus:border-slate-950 bg-slate-50/50"
                    placeholder="e.g. T2026101"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1" htmlFor="teacher-subject">
                    Primary Course / Subject *
                  </label>
                  <input
                    id="teacher-subject"
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950 focus:border-slate-950 bg-slate-50/50"
                    placeholder="e.g. Defence Against the Dark Arts"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1" htmlFor="teacher-homeroom">
                    Class Homeroom Teacher Of (Optional)
                  </label>
                  <input
                    id="teacher-homeroom"
                    type="text"
                    value={classTeacherOf}
                    onChange={(e) => setClassTeacherOf(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950 focus:border-slate-950 bg-slate-50/50"
                    placeholder="e.g. Class 11-A"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1" htmlFor="teacher-email">
                    Faculty Email
                  </label>
                  <input
                    id="teacher-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950 focus:border-slate-950 bg-slate-50/50"
                    placeholder="teacher@school.com"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1" htmlFor="teacher-phone">
                    Phone Number
                  </label>
                  <input
                    id="teacher-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950 focus:border-slate-950 bg-slate-50/50"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1" htmlFor="teacher-qual">
                    Qualifications & Degrees *
                  </label>
                  <input
                    id="teacher-qual"
                    type="text"
                    required
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950 focus:border-slate-950 bg-slate-50/50"
                    placeholder="e.g. Ph.D. in Magic, M.S. in Biology"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1" htmlFor="teacher-status">
                    Availability Status
                  </label>
                  <select
                    id="teacher-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950 bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="on-leave">On Leave</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1" htmlFor="teacher-joining">
                  Joining Date
                </label>
                <input
                  id="teacher-joining"
                  type="date"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950 bg-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  id="teacher-modal-cancel"
                  onClick={() => { setIsModalOpen(false); resetForm(); }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="teacher-modal-submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  {editingTeacher ? 'Save Changes' : 'Register Faculty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
