export type Role = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  detailsId?: string; // Links to Student ID or Teacher ID
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
  section: string;
  email: string;
  phone: string;
  guardianName: string;
  guardianPhone: string;
  address: string;
  status: 'active' | 'suspended' | 'graduated';
  admissionDate: string;
}

export interface Teacher {
  id: string;
  name: string;
  employeeId: string;
  subject: string;
  classTeacherOf?: string; // e.g., "Class 10-A"
  email: string;
  phone: string;
  joiningDate: string;
  qualification: string;
  status: 'active' | 'on-leave' | 'inactive';
}

export interface Attendance {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  date: string; // YYYY-MM-DD
  status: 'present' | 'absent' | 'late' | 'excused';
  class: string;
  remarks?: string;
}

export interface ExamResult {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  class: string;
  examName: string; // e.g., "Mid-Term", "Final Exam"
  subject: string;
  marksObtained: number;
  maxMarks: number;
  grade: string;
  remarks?: string;
  date: string;
}

export interface FeePayment {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  class: string;
  feeType: 'Tuition Fee' | 'Exam Fee' | 'Library Fee' | 'Sports Fee' | 'Transportation';
  amount: number;
  dueDate: string;
  paidAmount: number;
  paymentDate?: string;
  status: 'paid' | 'partial' | 'unpaid';
  transactionId?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'general' | 'exam' | 'event' | 'holiday';
  postedBy: string;
  authorRole: Role;
  important: boolean;
}

// Input type aliases to bypass TSX parser issues
export type StudentInput = Omit<Student, 'id'>;
export type TeacherInput = Omit<Teacher, 'id'>;
export type AttendanceInput = Omit<Attendance, 'id'>;
export type ExamResultInput = Omit<ExamResult, 'id'>;
export type FeePaymentInput = Omit<FeePayment, 'id'>;
export type NoticeInput = Omit<Notice, 'id'>;

