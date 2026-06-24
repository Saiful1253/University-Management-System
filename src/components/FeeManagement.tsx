import React, { useState } from 'react';
import { 
  CreditCard, DollarSign, Plus, Search, Filter, 
  X, Check, AlertCircle, TrendingUp, RefreshCw, Layers 
} from 'lucide-react';
import { Student, FeePayment, Role } from '../types';

interface FeeManagementProps {
  role: Role;
  students: Student[];
  fees: FeePayment[];
  onAddFeeAllocation: (fee: Omit<FeePayment, 'id'>) => void;
  onPayFee: (id: string, payAmount: number, txId: string) => void;
}

export default function FeeManagement({
  role,
  students,
  fees,
  onAddFeeAllocation,
  onPayFee
}: FeeManagementProps) {
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Allocation Modal State
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);
  const [allocStudentId, setAllocStudentId] = useState('');
  const [allocFeeType, setAllocFeeType] = useState<'Tuition Fee' | 'Exam Fee' | 'Library Fee' | 'Sports Fee' | 'Transportation'>('Tuition Fee');
  const [allocAmount, setAllocAmount] = useState('');
  const [allocDueDate, setAllocDueDate] = useState('2026-07-01');

  // Pay Modal State
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payingFee, setPayingFee] = useState<FeePayment | null>(null);
  const [payAmountInput, setPayAmountInput] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Handle pay submission
  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingFee) return;

    const parsedPayAmount = Number(payAmountInput);
    if (isNaN(parsedPayAmount) || parsedPayAmount <= 0) {
      alert('Please enter a valid amount to pay.');
      return;
    }

    const maxAllowed = payingFee.amount - payingFee.paidAmount;
    if (parsedPayAmount > maxAllowed) {
      alert(`You cannot pay more than the outstanding balance of $${maxAllowed}`);
      return;
    }

    const generatedTxId = `TXN${Math.floor(100000 + Math.random() * 900000)}`;
    onPayFee(payingFee.id, parsedPayAmount, generatedTxId);
    
    // Reset and close
    setIsPayModalOpen(false);
    setPayingFee(null);
    setPayAmountInput('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvc('');
  };

  // Open pay modal
  const handlePayClick = (fee: FeePayment) => {
    setPayingFee(fee);
    setPayAmountInput(String(fee.amount - fee.paidAmount));
    setIsPayModalOpen(true);
  };

  // Handle allocation submission
  const handleAllocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocStudentId || !allocAmount) {
      alert('Please select a student and enter an amount.');
      return;
    }

    const selectedStudent = students.find(s => s.id === allocStudentId);
    if (!selectedStudent) return;

    onAddFeeAllocation({
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      rollNumber: selectedStudent.rollNumber,
      class: selectedStudent.class,
      feeType: allocFeeType,
      amount: Number(allocAmount),
      dueDate: allocDueDate,
      paidAmount: 0,
      status: 'unpaid'
    });

    // Reset and close
    setIsAllocationModalOpen(false);
    setAllocStudentId('');
    setAllocAmount('');
    setAllocDueDate('2026-07-01');
  };

  // Calculations for Admin / Global views
  const totalInvoiced = fees.reduce((acc, f) => acc + f.amount, 0);
  const totalReceived = fees.reduce((acc, f) => acc + f.paidAmount, 0);
  const totalOutstanding = totalInvoiced - totalReceived;

  // Filtered lists
  const filteredFees = fees.filter(fee => {
    const matchesSearch = fee.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          fee.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          fee.feeType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'All' || fee.class === classFilter;
    const matchesStatus = statusFilter === 'All' || fee.status === statusFilter;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const canAllocate = role === 'admin';
  const myStudentId = 's5'; // Default student login ID
  const myPersonalFees = fees.filter(f => f.studentId === myStudentId);

  return (
    <div className="space-y-6" id="fee-management-portal">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Fee & Ledger Management</h1>
          <p className="text-xs text-slate-500 font-medium">Track pending class billings, record financial receipts, and process student fee clearings</p>
        </div>
        {canAllocate && (
          <button
            id="alloc-fee-btn"
            onClick={() => { setIsAllocationModalOpen(true); }}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-2xl text-xs font-black cursor-pointer shadow-md shadow-slate-100 transition-colors self-start uppercase tracking-wider"
          >
            <Plus className="h-4 w-4" /> Allocate Fee
          </button>
        )}
      </div>

      {/* Global Financial Summary Cards */}
      {role !== 'student' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="ledger-financial-summary">
          <div className="bg-white p-6 border-2 border-slate-200 shadow-xs rounded-3xl flex items-center justify-between hover:border-indigo-300 transition-colors">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Gross Billings</span>
              <span className="text-3xl font-black text-slate-900 mt-2 block">${totalInvoiced.toLocaleString()}</span>
              <span className="text-[10px] text-slate-500 font-bold block mt-1 uppercase tracking-wider">Class-wide distributions</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl text-slate-700 border border-slate-100">
              <Layers className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white p-6 border-2 border-slate-200 shadow-xs rounded-3xl flex items-center justify-between hover:border-indigo-300 transition-colors">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Cleared Payments</span>
              <span className="text-3xl font-black text-emerald-600 mt-2 block">${totalReceived.toLocaleString()}</span>
              <span className="text-[10px] text-emerald-600 font-extrabold block mt-1 uppercase tracking-wider">
                {totalInvoiced > 0 ? Math.round((totalReceived / totalInvoiced) * 100) : 0}% cleared rate
              </span>
            </div>
            <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600 border border-emerald-100">
              <Check className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white p-6 border-2 border-slate-200 shadow-xs rounded-3xl flex items-center justify-between hover:border-indigo-300 transition-colors">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Outstanding Balances</span>
              <span className="text-3xl font-black text-rose-600 mt-2 block">${totalOutstanding.toLocaleString()}</span>
              <span className="text-[10px] text-rose-500 font-extrabold block mt-1 uppercase tracking-wider">Pending notices</span>
            </div>
            <div className="bg-rose-50 p-4 rounded-2xl text-rose-600 border border-rose-100">
              <AlertCircle className="h-6 w-6" />
            </div>
          </div>
        </div>
      )}

      {/* Student Personal Fee Portal */}
      {role === 'student' && (
        <div className="space-y-6" id="student-bill-panel">
          <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-md border border-slate-800">
            <div className="text-center md:text-left">
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest block">Student billing dues</span>
              <h2 className="text-xl font-extrabold mt-1">My Outstanding balance</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-md">Pay outstanding bills online securely using sandbox test credentials</p>
            </div>
            <div className="text-center min-w-[170px] bg-white/5 p-4 py-5 border border-white/10 rounded-2xl backdrop-blur-sm shadow-inner">
              <span className="text-[10px] text-slate-400 uppercase block tracking-widest font-black">Net Outstanding</span>
              <span className="text-3xl font-black text-amber-400 block mt-1">
                ${myPersonalFees.filter(f => f.status !== 'paid').reduce((acc, f) => acc + (f.amount - f.paidAmount), 0)}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b-2 border-slate-100 bg-slate-50">
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Personal Ledger Details</h3>
            </div>
            <div className="divide-y divide-slate-100 font-medium">
              {myPersonalFees.length > 0 ? (
                myPersonalFees.map((fee) => (
                  <div key={fee.id} className="p-5 px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs hover:bg-slate-50/50 transition-colors">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">Due: {fee.dueDate}</span>
                      <h4 className="font-extrabold text-slate-900 text-sm mt-0.5">{fee.feeType}</h4>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Amount: <span className="font-bold text-slate-700">${fee.amount}</span> • Paid: <span className="font-bold text-emerald-600">${fee.paidAmount}</span> • Dues: <span className="font-black text-rose-600">${fee.amount - fee.paidAmount}</span>
                      </p>
                      {fee.transactionId && <p className="text-[10px] font-mono text-emerald-600 mt-1 font-bold">Paid via Ref: {fee.transactionId}</p>}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider border ${
                        fee.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        fee.status === 'partial' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        {fee.status}
                      </span>
                      {fee.status !== 'paid' && (
                        <button
                          onClick={() => handlePayClick(fee)}
                          className="bg-slate-900 hover:bg-indigo-600 text-white text-[11px] font-black px-4 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm uppercase tracking-wider"
                        >
                          <CreditCard className="h-3.5 w-3.5" /> Clear dues
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400">
                  No fee distributions logged for your profile.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin/Teacher Ledger listings */}
      {role !== 'student' && (
        <div className="space-y-4" id="ledger-listings">
          {/* Filters Bar */}
          <div className="bg-white p-5 border-2 border-slate-200 shadow-xs rounded-3xl flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
              <input
                id="fee-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ledger by student, fee type..."
                className="w-full pl-11 pr-4 py-2.5 border-2 border-slate-100 focus:border-indigo-500 rounded-2xl text-xs font-medium focus:outline-none bg-slate-50/50"
              />
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto bg-slate-50 p-2 rounded-2xl border border-slate-100">
              <Filter className="h-4 w-4 text-slate-400 ml-1" />
              <select
                id="fee-class-filter"
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl p-1 px-3 text-xs font-bold focus:outline-none"
              >
                <option value="All">All Classes</option>
                <option value="Class 10">Class 10</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
              </select>

              <select
                id="fee-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl p-1 px-3 text-xs font-bold focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b-2 border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-widest">
                    <th className="p-4 pl-6">Student</th>
                    <th className="p-4">Class</th>
                    <th className="p-4">Fee Type</th>
                    <th className="p-4">Billing Amount</th>
                    <th className="p-4">Receipts</th>
                    <th className="p-4">Outstanding</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Clearance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-xs font-medium">
                  {filteredFees.length > 0 ? (
                    filteredFees.map((fee) => (
                      <tr key={fee.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 pl-6">
                          <span className="font-bold text-slate-900 block">{fee.studentName}</span>
                          <span className="text-[10px] text-slate-400 block font-mono font-bold">Roll: {fee.rollNumber}</span>
                        </td>
                        <td className="p-4 font-extrabold text-slate-800">{fee.class}</td>
                        <td className="p-4 font-bold text-slate-800">{fee.feeType}</td>
                        <td className="p-4 font-bold font-mono text-slate-900">${fee.amount}</td>
                        <td className="p-4 font-bold font-mono text-emerald-600">${fee.paidAmount}</td>
                        <td className="p-4 font-bold font-mono text-rose-600">${fee.amount - fee.paidAmount}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider border ${
                            fee.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            fee.status === 'partial' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            'bg-rose-50 text-rose-700 border-rose-100'
                          }`}>
                            {fee.status}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          {fee.status !== 'paid' ? (
                            <button
                              onClick={() => handlePayClick(fee)}
                              className="bg-slate-900 hover:bg-indigo-600 text-white font-black text-[10px] uppercase px-3 py-2 rounded-xl cursor-pointer transition-all inline-flex items-center gap-1 shadow-xs tracking-wider"
                            >
                              <CreditCard className="h-3.5 w-3.5" /> Record pay
                            </button>
                          ) : (
                            <span className="text-emerald-600 font-extrabold text-[10px] uppercase flex items-center justify-end gap-1 tracking-wider">
                              <Check className="h-4 w-4" /> Fully Cleared
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400">
                        No financial records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Allocate Fee Modal (Admin only) */}
      {isAllocationModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto" id="allocation-modal-overlay">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl w-full max-w-md p-6" id="allocation-modal">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-indigo-600" />
                Allocate New Fee Billings
              </h2>
              <button 
                onClick={() => setIsAllocationModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-950 hover:bg-slate-50 rounded-lg cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={handleAllocSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1" htmlFor="alloc-student-select">
                  Select Target Student *
                </label>
                <select
                  id="alloc-student-select"
                  required
                  value={allocStudentId}
                  onChange={(e) => setAllocStudentId(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950 bg-white font-medium"
                >
                  <option value="">-- Choose Enrolled Student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.class} - Roll: {s.rollNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1" htmlFor="alloc-type-select">
                  Ledger Billing Type *
                </label>
                <select
                  id="alloc-type-select"
                  value={allocFeeType}
                  onChange={(e) => setAllocFeeType(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950 bg-white"
                >
                  <option value="Tuition Fee">Tuition Fee</option>
                  <option value="Exam Fee">Exam Fee</option>
                  <option value="Library Fee">Library Fee</option>
                  <option value="Sports Fee">Sports Fee</option>
                  <option value="Transportation">Transportation</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1" htmlFor="alloc-amount-input">
                    Billing Amount ($) *
                  </label>
                  <input
                    id="alloc-amount-input"
                    type="number"
                    min="1"
                    required
                    value={allocAmount}
                    onChange={(e) => setAllocAmount(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950 bg-slate-50/50"
                    placeholder="e.g. 250"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1" htmlFor="alloc-due-input">
                    Payment Due Date
                  </label>
                  <input
                    id="alloc-due-input"
                    type="date"
                    required
                    value={allocDueDate}
                    onChange={(e) => setAllocDueDate(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950 bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAllocationModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Post Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Checkout / Clear Dues Modal */}
      {isPayModalOpen && payingFee && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto" id="pay-modal-overlay">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl w-full max-w-sm p-6" id="pay-modal">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <CreditCard className="h-4.5 w-4.5 text-emerald-600" />
                Receipt & Checkout Sandbox
              </h2>
              <button 
                onClick={() => { setIsPayModalOpen(false); setPayingFee(null); }}
                className="p-1 text-slate-400 hover:text-slate-950 hover:bg-slate-50 rounded-lg cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-xs space-y-1">
              <span className="font-extrabold text-slate-400 uppercase tracking-widest block text-[9px]">Account billing details</span>
              <div className="flex justify-between font-bold text-indigo-950">
                <span>{payingFee.studentName} ({payingFee.class})</span>
                <span>{payingFee.feeType}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Due:</span>
                <span>${payingFee.amount - payingFee.paidAmount}</span>
              </div>
            </div>

            <form onSubmit={handlePaySubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1" htmlFor="pay-amount-field">
                  Receipt Payment Amount ($) *
                </label>
                <input
                  id="pay-amount-field"
                  type="number"
                  min="1"
                  max={payingFee.amount - payingFee.paidAmount}
                  required
                  value={payAmountInput}
                  onChange={(e) => setPayAmountInput(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950 bg-slate-50/50 font-bold text-slate-900"
                />
              </div>

              {/* Fake Credit Card input */}
              <div className="bg-slate-950 text-white rounded-xl p-4 space-y-3 shadow-lg border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black tracking-widest uppercase text-slate-400">Sandbox Payment card</span>
                  <div className="h-5 w-8 bg-amber-500 rounded-sm"></div>
                </div>
                
                <div>
                  <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5" htmlFor="card-number-input">Card Number</label>
                  <input
                    id="card-number-input"
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                    placeholder="4000 1234 5678 9010"
                    className="w-full bg-white/15 px-2.5 py-1 rounded text-xs focus:outline-none focus:ring-1 focus:ring-sky-400 font-mono text-white placeholder-slate-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5" htmlFor="expiry-input">Expiry Date</label>
                    <input
                      id="expiry-input"
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value.slice(0,5))}
                      placeholder="MM/YY"
                      className="w-full bg-white/15 px-2.5 py-1 rounded text-xs focus:outline-none focus:ring-1 focus:ring-sky-400 font-mono text-white placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5" htmlFor="cvc-input">Security CVC</label>
                    <input
                      id="cvc-input"
                      type="password"
                      required
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      placeholder="•••"
                      className="w-full bg-white/15 px-2.5 py-1 rounded text-xs focus:outline-none focus:ring-1 focus:ring-sky-400 font-mono text-white placeholder-slate-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsPayModalOpen(false); setPayingFee(null); }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-sm"
                >
                  Confirm payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
