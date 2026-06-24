import { Student, Teacher, Attendance, ExamResult, FeePayment, Notice } from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 's1',
    name: 'Sarah Connor',
    rollNumber: 'S2026001',
    class: 'Class 10',
    section: 'A',
    email: 'sarah.connor@school.com',
    phone: '+1 (555) 019-2831',
    guardianName: 'John Connor',
    guardianPhone: '+1 (555) 019-2832',
    address: '123 Cyberdyne Blvd, Los Angeles, CA',
    status: 'active',
    admissionDate: '2024-09-01'
  },
  {
    id: 's2',
    name: 'Harry Potter',
    rollNumber: 'S2026002',
    class: 'Class 10',
    section: 'A',
    email: 'harry.potter@school.com',
    phone: '+1 (555) 014-9821',
    guardianName: 'Vernon Dursley',
    guardianPhone: '+1 (555) 014-9822',
    address: '4 Privet Drive, Little Whinging, Surrey',
    status: 'active',
    admissionDate: '2024-09-01'
  },
  {
    id: 's3',
    name: 'Peter Parker',
    rollNumber: 'S2026003',
    class: 'Class 10',
    section: 'B',
    email: 'peter.parker@school.com',
    phone: '+1 (555) 018-4720',
    guardianName: 'May Parker',
    guardianPhone: '+1 (555) 018-4721',
    address: '20 Ingram St, Forest Hills, Queens, NY',
    status: 'active',
    admissionDate: '2024-09-01'
  },
  {
    id: 's4',
    name: 'Hermione Granger',
    rollNumber: 'S2026004',
    class: 'Class 11',
    section: 'A',
    email: 'hermione.g@school.com',
    phone: '+1 (555) 017-3810',
    guardianName: 'Mr. Granger',
    guardianPhone: '+1 (555) 017-3811',
    address: '88 Hampstead Way, London, UK',
    status: 'active',
    admissionDate: '2023-09-01'
  },
  {
    id: 's5',
    name: 'Bruce Wayne',
    rollNumber: 'S2026005',
    class: 'Class 12',
    section: 'A',
    email: 'student@school.com', // Assigned as default student login
    phone: '+1 (555) 011-0000',
    guardianName: 'Alfred Pennyworth',
    guardianPhone: '+1 (555) 011-0001',
    address: '1007 Mountain Drive, Gotham City, NJ',
    status: 'active',
    admissionDate: '2022-09-01'
  }
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 't1',
    name: 'Minerva McGonagall',
    employeeId: 'T2026001',
    subject: 'Mathematics & Transfiguration',
    classTeacherOf: 'Class 10-A',
    email: 'teacher@school.com', // Assigned as default teacher login
    phone: '+1 (555) 123-4567',
    joiningDate: '2015-08-15',
    qualification: 'Ph.D. in Education & Advanced Arithmancy',
    status: 'active'
  },
  {
    id: 't2',
    name: 'Charles Xavier',
    employeeId: 'T2026002',
    subject: 'Social Studies & Genetics',
    classTeacherOf: 'Class 12-A',
    email: 'charles.xavier@school.com',
    phone: '+1 (555) 234-5678',
    joiningDate: '2018-09-10',
    qualification: 'M.A. in Psychology, Ph.D. in Biology',
    status: 'active'
  },
  {
    id: 't3',
    name: 'Walter White',
    employeeId: 'T2026003',
    subject: 'Chemistry',
    classTeacherOf: 'Class 11-A',
    email: 'walter.white@school.com',
    phone: '+1 (555) 345-6789',
    joiningDate: '2020-01-05',
    qualification: 'M.S. in Organic Chemistry',
    status: 'active'
  },
  {
    id: 't4',
    name: 'Albus Dumbledore',
    employeeId: 'T2026004',
    subject: 'History & Ethics',
    phone: '+1 (555) 456-7890',
    email: 'albus.d@school.com',
    joiningDate: '2010-09-01',
    qualification: 'Doctorate in Philosophy & Educational Leadership',
    status: 'on-leave'
  }
];

// Seed attendance for current month (some days)
export const INITIAL_ATTENDANCE: Attendance[] = [
  // 2026-06-22 (Sarah Connor)
  { id: 'att1', studentId: 's1', studentName: 'Sarah Connor', rollNumber: 'S2026001', date: '2026-06-22', status: 'present', class: 'Class 10' },
  { id: 'att2', studentId: 's2', studentName: 'Harry Potter', rollNumber: 'S2026002', date: '2026-06-22', status: 'absent', class: 'Class 10', remarks: 'Medical Checkup' },
  { id: 'att3', studentId: 's3', studentName: 'Peter Parker', rollNumber: 'S2026003', date: '2026-06-22', status: 'late', class: 'Class 10', remarks: 'Missed school bus' },
  { id: 'att4', studentId: 's4', studentName: 'Hermione Granger', rollNumber: 'S2026004', date: '2026-06-22', status: 'present', class: 'Class 11' },
  { id: 'att5', studentId: 's5', studentName: 'Bruce Wayne', rollNumber: 'S2026005', date: '2026-06-22', status: 'present', class: 'Class 12' },

  // 2026-06-23 (Today)
  { id: 'att6', studentId: 's1', studentName: 'Sarah Connor', rollNumber: 'S2026001', date: '2026-06-23', status: 'present', class: 'Class 10' },
  { id: 'att7', studentId: 's2', studentName: 'Harry Potter', rollNumber: 'S2026002', date: '2026-06-23', status: 'present', class: 'Class 10' },
  { id: 'att8', studentId: 's3', studentName: 'Peter Parker', rollNumber: 'S2026003', date: '2026-06-23', status: 'present', class: 'Class 10' },
  { id: 'att9', studentId: 's4', studentName: 'Hermione Granger', rollNumber: 'S2026004', date: '2026-06-23', status: 'present', class: 'Class 11' },
  { id: 'att10', studentId: 's5', studentName: 'Bruce Wayne', rollNumber: 'S2026005', date: '2026-06-23', status: 'present', class: 'Class 12' }
];

export const INITIAL_EXAMS: ExamResult[] = [
  // Class 10 Mid-Term
  { id: 'ex1', studentId: 's1', studentName: 'Sarah Connor', rollNumber: 'S2026001', class: 'Class 10', examName: 'Mid-Term', subject: 'Mathematics', marksObtained: 85, maxMarks: 100, grade: 'A', remarks: 'Excellent Analytical Skills', date: '2026-05-15' },
  { id: 'ex2', studentId: 's2', studentName: 'Harry Potter', rollNumber: 'S2026002', class: 'Class 10', examName: 'Mid-Term', subject: 'Mathematics', marksObtained: 72, maxMarks: 100, grade: 'B', remarks: 'Good improvement', date: '2026-05-15' },
  { id: 'ex3', studentId: 's3', studentName: 'Peter Parker', rollNumber: 'S2026003', class: 'Class 10', examName: 'Mid-Term', subject: 'Mathematics', marksObtained: 98, maxMarks: 100, grade: 'A+', remarks: 'Outstanding performance', date: '2026-05-15' },

  // Class 10 Mid-Term - Chemistry
  { id: 'ex4', studentId: 's1', studentName: 'Sarah Connor', rollNumber: 'S2026001', class: 'Class 10', examName: 'Mid-Term', subject: 'Chemistry', marksObtained: 90, maxMarks: 100, grade: 'A', remarks: 'Very attentive', date: '2026-05-17' },
  { id: 'ex5', studentId: 's2', studentName: 'Harry Potter', rollNumber: 'S2026002', class: 'Class 10', examName: 'Mid-Term', subject: 'Chemistry', marksObtained: 68, maxMarks: 100, grade: 'C', remarks: 'Needs more practical focus', date: '2026-05-17' },
  { id: 'ex6', studentId: 's3', studentName: 'Peter Parker', rollNumber: 'S2026003', class: 'Class 10', examName: 'Mid-Term', subject: 'Chemistry', marksObtained: 95, maxMarks: 100, grade: 'A+', remarks: 'Superb grasp of details', date: '2026-05-17' },

  // Class 11 - Hermione (Outstanding)
  { id: 'ex7', studentId: 's4', studentName: 'Hermione Granger', rollNumber: 'S2026004', class: 'Class 11', examName: 'Mid-Term', subject: 'Chemistry', marksObtained: 100, maxMarks: 100, grade: 'A+', remarks: 'Flawless score', date: '2026-05-17' },
  { id: 'ex8', studentId: 's4', studentName: 'Hermione Granger', rollNumber: 'S2026004', class: 'Class 11', examName: 'Mid-Term', subject: 'Mathematics', marksObtained: 99, maxMarks: 100, grade: 'A+', remarks: 'Top of class', date: '2026-05-15' },

  // Class 12 - Bruce Wayne
  { id: 'ex9', studentId: 's5', studentName: 'Bruce Wayne', rollNumber: 'S2026005', class: 'Class 12', examName: 'Mid-Term', subject: 'Social Studies', marksObtained: 92, maxMarks: 100, grade: 'A+', remarks: 'Exceptional ethics overview', date: '2026-05-16' },
  { id: 'ex10', studentId: 's5', studentName: 'Bruce Wayne', rollNumber: 'S2026005', class: 'Class 12', examName: 'Mid-Term', subject: 'Mathematics', marksObtained: 94, maxMarks: 100, grade: 'A+', remarks: 'Extremely methodical', date: '2026-05-15' }
];

export const INITIAL_FEES: FeePayment[] = [
  { id: 'f1', studentId: 's1', studentName: 'Sarah Connor', rollNumber: 'S2026001', class: 'Class 10', feeType: 'Tuition Fee', amount: 1200, dueDate: '2026-07-01', paidAmount: 1200, paymentDate: '2026-06-15', status: 'paid', transactionId: 'TXN89123' },
  { id: 'f2', studentId: 's2', studentName: 'Harry Potter', rollNumber: 'S2026002', class: 'Class 10', feeType: 'Tuition Fee', amount: 1200, dueDate: '2026-07-01', paidAmount: 0, status: 'unpaid' },
  { id: 'f3', studentId: 's3', studentName: 'Peter Parker', rollNumber: 'S2026003', class: 'Class 10', feeType: 'Tuition Fee', amount: 1200, dueDate: '2026-07-01', paidAmount: 600, paymentDate: '2026-06-18', status: 'partial', transactionId: 'TXN89124' },
  { id: 'f4', studentId: 's4', studentName: 'Hermione Granger', rollNumber: 'S2026004', class: 'Class 11', feeType: 'Tuition Fee', amount: 1300, dueDate: '2026-07-01', paidAmount: 1300, paymentDate: '2026-06-10', status: 'paid', transactionId: 'TXN89101' },
  { id: 'f5', studentId: 's5', studentName: 'Bruce Wayne', rollNumber: 'S2026005', class: 'Class 12', feeType: 'Tuition Fee', amount: 1500, dueDate: '2026-07-01', paidAmount: 1500, paymentDate: '2026-06-05', status: 'paid', transactionId: 'TXN89102' },
  { id: 'f6', studentId: 's5', studentName: 'Bruce Wayne', rollNumber: 'S2026005', class: 'Class 12', feeType: 'Transportation', amount: 300, dueDate: '2026-07-05', paidAmount: 0, status: 'unpaid' },
  { id: 'f7', studentId: 's3', studentName: 'Peter Parker', rollNumber: 'S2026003', class: 'Class 10', feeType: 'Library Fee', amount: 150, dueDate: '2026-07-10', paidAmount: 0, status: 'unpaid' }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'n1',
    title: 'Annual Science Fair 2026 Registration',
    content: 'Registration is now open for the Annual Science Fair. Projects should be submitted to Mr. Walter White in Chemistry Lab by July 15th. Exciting scholarships and prizes are up for grabs!',
    date: '2026-06-20',
    category: 'event',
    postedBy: 'Walter White',
    authorRole: 'teacher',
    important: true
  },
  {
    id: 'n2',
    title: 'Mid-Term Exam Report Card Release',
    content: 'Mid-Term exam report cards are now compiled. Parents are requested to log into their student portal to view report cards. Parent-Teacher meeting (PTM) will take place this Saturday from 9:00 AM to 1:00 PM.',
    date: '2026-06-22',
    category: 'exam',
    postedBy: 'Minerva McGonagall',
    authorRole: 'teacher',
    important: true
  },
  {
    id: 'n3',
    title: 'Summer Holiday Notice',
    content: 'School will remain closed for summer holidays from July 20th to August 25th. Online classes and remedial coaching for Class 10 and 12 will resume on August 1st. Enjoy your holidays responsibly!',
    date: '2026-06-23',
    category: 'holiday',
    postedBy: 'Principal Office',
    authorRole: 'admin',
    important: false
  },
  {
    id: 'n4',
    title: 'Football Championship Selection Trials',
    content: 'Trials for the regional high school football team will be conducted on June 28th at 4:00 PM on the main sports ground. Bring your full kit.',
    date: '2026-06-23',
    category: 'general',
    postedBy: 'Sports Department',
    authorRole: 'admin',
    important: false
  }
];
