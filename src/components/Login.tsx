import React, { useState } from 'react';
import { LogIn, Shield, Users, Award, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { Role } from '../types';

interface LoginProps {
  onLogin: (email: string, role: Role, name: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Role detection / login logic
    const normalizedEmail = email.toLowerCase().trim();
    if (normalizedEmail === 'admin@school.com' && password === 'admin') {
      onLogin(email, 'admin', 'Super Admin');
    } else if (normalizedEmail === 'teacher@school.com' && password === 'teacher') {
      onLogin(email, 'teacher', 'Minerva McGonagall');
    } else if (normalizedEmail === 'student@school.com' && password === 'student') {
      onLogin(email, 'student', 'Bruce Wayne');
    } else {
      setError('Invalid email or password. Use the quick logins below!');
    }
  };

  const handleQuickLogin = (role: Role) => {
    if (role === 'admin') {
      setEmail('admin@school.com');
      setPassword('admin');
      onLogin('admin@school.com', 'admin', 'Super Admin');
    } else if (role === 'teacher') {
      setEmail('teacher@school.com');
      setPassword('teacher');
      onLogin('teacher@school.com', 'teacher', 'Minerva McGonagall');
    } else if (role === 'student') {
      setEmail('student@school.com');
      setPassword('student');
      onLogin('student@school.com', 'student', 'Bruce Wayne');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" id="login-container">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden"
        id="login-card"
      >
        {/* Banner */}
        <div className="bg-slate-900 px-6 py-8 text-center relative overflow-hidden" id="login-header">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 opacity-90"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md mb-3">
              <BookOpen className="h-8 w-8 text-sky-400" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white font-sans">IUBAT Portal</h1>
            <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mt-1.5">Made By Saiful</p>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8" id="login-form-body">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm" id="login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1" htmlFor="email-input">
                Email Address
              </label>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all text-sm bg-slate-50/50"
                placeholder="email@school.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1" htmlFor="password-input">
                Password
              </label>
              <input
                id="password-input"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all text-sm bg-slate-50/50"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              id="login-submit-button"
              type="submit"
              className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm shadow-sm"
            >
              <LogIn className="h-4 w-4" /> Sign In
            </button>
          </form>

          {/* Quick Logins Section */}
          <div className="mt-8 pt-6 border-t border-slate-100" id="quick-login-section">
            <h3 className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Demo Quick Access
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                id="quick-login-admin"
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="flex flex-col items-center justify-center p-3 border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-slate-200 transition-all cursor-pointer group text-center"
              >
                <Shield className="h-5 w-5 text-indigo-600 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold text-slate-700">Admin</span>
                <span className="text-[9px] text-slate-400">admin</span>
              </button>

              <button
                id="quick-login-teacher"
                type="button"
                onClick={() => handleQuickLogin('teacher')}
                className="flex flex-col items-center justify-center p-3 border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-slate-200 transition-all cursor-pointer group text-center"
              >
                <Users className="h-5 w-5 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold text-slate-700">Teacher</span>
                <span className="text-[9px] text-slate-400">teacher</span>
              </button>

              <button
                id="quick-login-student"
                type="button"
                onClick={() => handleQuickLogin('student')}
                className="flex flex-col items-center justify-center p-3 border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-slate-200 transition-all cursor-pointer group text-center"
              >
                <Award className="h-5 w-5 text-amber-600 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold text-slate-700">Student</span>
                <span className="text-[9px] text-slate-400">student</span>
              </button>
            </div>
            <p className="text-center text-[11px] text-slate-400 mt-4 leading-normal">
              Click any quick access button above to pre-fill credentials and automatically log into the system with that specific role.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
