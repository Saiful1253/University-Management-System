import React, { useState } from 'react';
import { Bell, Search, Plus, Filter, Trash2, Tag, Calendar, User, X, Check, Megaphone } from 'lucide-react';
import { Notice, Role } from '../types';

interface NoticeBoardProps {
  role: Role;
  name: string;
  notices: Notice[];
  onAddNotice: (notice: Omit<Notice, 'id'>) => void;
  onDeleteNotice: (id: string) => void;
}

export default function NoticeBoard({
  role,
  name,
  notices,
  onAddNotice,
  onDeleteNotice
}: NoticeBoardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'general' | 'exam' | 'event' | 'holiday'>('general');
  const [important, setImportant] = useState(false);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('general');
    setImportant(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert('Please fill in all fields.');
      return;
    }

    onAddNotice({
      title,
      content,
      category,
      date: '2026-06-23', // Today's simulated date
      postedBy: name,
      authorRole: role,
      important
    });

    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this notice? This action cannot be undone.')) {
      onDeleteNotice(id);
    }
  };

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || notice.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const canPost = role === 'admin' || role === 'teacher';

  return (
    <div className="space-y-6" id="noticeboard-portal">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Campus Bulletin Board</h1>
          <p className="text-xs text-slate-500 font-medium">View and publish announcements, athletic event registries, holidays, and examination schedules</p>
        </div>
        {canPost && (
          <button
            id="add-notice-btn"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-2xl text-xs font-black cursor-pointer shadow-md shadow-slate-100 transition-colors self-start uppercase tracking-wider"
          >
            <Plus className="h-4 w-4" /> Publish Notice
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 border-2 border-slate-200 shadow-xs rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4" id="notice-filter-bar">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
          <input
            id="notice-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search bulletins..."
            className="w-full pl-11 pr-4 py-2.5 border-2 border-slate-100 focus:border-indigo-500 rounded-2xl text-xs font-medium focus:outline-none bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto bg-slate-50 p-2 rounded-2xl border border-slate-100">
          <Filter className="h-4 w-4 text-slate-400 ml-1" />
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Category:</span>
          <select
            id="category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl p-1 px-3 text-xs font-bold focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="general">General</option>
            <option value="exam">Exams</option>
            <option value="event">Events</option>
            <option value="holiday">Holidays</option>
          </select>
        </div>
      </div>

      {/* Bulletins Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="bulletin-feed-grid">
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice) => (
            <div 
              key={notice.id} 
              className={`bg-white border-2 p-6 rounded-3xl shadow-xs hover:shadow-lg hover:border-indigo-300 transition-all relative flex flex-col justify-between ${
                notice.important ? 'border-rose-300 bg-rose-50/10 shadow-rose-50/40' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider ${
                      notice.category === 'exam' ? 'bg-amber-50 text-amber-800 border border-amber-100' :
                      notice.category === 'holiday' ? 'bg-blue-50 text-blue-800 border border-blue-100' :
                      notice.category === 'event' ? 'bg-purple-50 text-purple-800 border border-purple-100' :
                      'bg-slate-100 text-slate-800 border border-slate-200'
                    }`}>
                      {notice.category}
                    </span>
                    {notice.important && (
                      <span className="bg-rose-600 text-white font-black text-[9px] uppercase px-2 py-1 rounded-xl flex items-center gap-1 tracking-wider shadow-sm shadow-rose-100">
                        <Megaphone className="h-3 w-3 animate-bounce" /> High priority
                      </span>
                    )}
                  </div>
                  
                  {/* Delete button (Admin can delete all, Teachers can delete their own notices) */}
                  {(role === 'admin' || (role === 'teacher' && notice.postedBy === name)) && (
                    <button
                      title="Delete Bulletin"
                      onClick={() => handleDelete(notice.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <h3 className="text-slate-900 font-black text-base leading-snug mb-3 tracking-tight">
                  {notice.title}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-5 whitespace-pre-wrap font-semibold">
                  {notice.content}
                </p>
              </div>

              {/* Author footer */}
              <div className="border-t-2 border-slate-100 pt-4 flex items-center justify-between text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-indigo-500" /> By: <strong className="text-slate-700 font-black">{notice.postedBy}</strong>
                  <span className="text-slate-400 font-bold">({notice.authorRole})</span>
                </span>
                <span className="flex items-center gap-1 font-mono font-bold">
                  <Calendar className="h-3.5 w-3.5 text-indigo-500" /> {notice.date}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="md:col-span-2 bg-white border-2 border-slate-200 p-12 rounded-3xl text-center text-slate-400 text-xs font-semibold">
            No bulletins found on the campus board.
          </div>
        )}
      </div>

      {/* Add Notice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto" id="notice-modal-overlay">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl w-full max-w-md p-6" id="notice-modal">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-indigo-600" />
                Publish Campus Bulletin
              </h2>
              <button 
                onClick={() => { setIsModalOpen(false); resetForm(); }}
                className="p-1 text-slate-400 hover:text-slate-950 hover:bg-slate-50 rounded-lg cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1" htmlFor="notice-title">
                  Notice Title *
                </label>
                <input
                  id="notice-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950 focus:border-slate-950 bg-slate-50/50"
                  placeholder="e.g. Annual Sports Selection trials"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1" htmlFor="notice-category">
                  Bulletin Category
                </label>
                <select
                  id="notice-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950 bg-white"
                >
                  <option value="general">General</option>
                  <option value="exam">Exams</option>
                  <option value="event">Events</option>
                  <option value="holiday">Holidays</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1" htmlFor="notice-content">
                  Detailed Notice Description *
                </label>
                <textarea
                  id="notice-content"
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950 focus:border-slate-950 bg-slate-50/50 leading-relaxed"
                  placeholder="Type the detailed content of the announcement here..."
                />
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  id="notice-priority"
                  type="checkbox"
                  checked={important}
                  onChange={(e) => setImportant(e.target.checked)}
                  className="h-4.5 w-4.5 border-slate-300 rounded text-rose-600 focus:ring-rose-500"
                />
                <label htmlFor="notice-priority" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Mark as High Priority (Borders bulletin card in Amber/Rose)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); resetForm(); }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-sm"
                >
                  Post Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
