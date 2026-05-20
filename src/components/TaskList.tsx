import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  SlidersHorizontal,
  Calendar,
  Tag,
  AlertTriangle,
  Plus,
  Trash2,
  Edit3,
  CheckCircle,
  HelpCircle,
  Briefcase,
  User,
  GraduationCap,
  ShoppingCart,
  Inbox,
  Clock,
  Sparkles
} from 'lucide-react';
import { Task, Priority, Category } from '../types';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onOpenForm: () => void;
}

export default function TaskList({
  tasks,
  onToggleComplete,
  onToggleSubtask,
  onEditTask,
  onDeleteTask,
  onOpenForm,
}: TaskListProps) {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering states
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'yuqori' | 'o‘rta' | 'past'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | Category>('all');

  // Sorting state
  const [sortBy, setSortBy] = useState<'deadline' | 'priority' | 'createdAt'>('deadline');

  const todayStr = new Date().toISOString().split('T')[0];

  // Helper getters
  const getCategoryIcon = (cat: Category) => {
    switch (cat) {
      case 'ish':
        return <Briefcase className="w-3.5 h-3.5 text-indigo-500" />;
      case 'shaxsiy':
        return <User className="w-3.5 h-3.5 text-rose-500" />;
      case 'o‘qish':
        return <GraduationCap className="w-3.5 h-3.5 text-pink-500" />;
      case 'xaridlar':
        return <ShoppingCart className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <Inbox className="w-3.5 h-3.5 text-teal-500" />;
    }
  };

  const getCategoryLabel = (cat: Category) => {
    switch (cat) {
      case 'ish':
        return 'Ish';
      case 'shaxsiy':
        return 'Shaxsiy';
      case 'o‘qish':
        return 'O‘qish';
      case 'xaridlar':
        return 'Xaridlar';
      default:
        return 'Boshqa';
    }
  };

  const getPriorityBadgeColor = (prio: Priority) => {
    switch (prio) {
      case 'yuqori':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20';
      case 'o‘rta':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
      case 'past':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
    }
  };

  // Math helper for mapping priority to a number for sorting
  const getPriorityWeight = (prio: Priority) => {
    if (prio === 'yuqori') return 3;
    if (prio === 'o‘rta') return 2;
    return 1;
  };

  // Filtering implementation
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && task.completed) ||
      (statusFilter === 'pending' && !task.completed);

    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Sorting implementation
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'deadline') {
      // Completed last, then closest deadline first, then high priority
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return a.deadline.localeCompare(b.deadline);
    } else if (sortBy === 'priority') {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
    } else {
      // Created date (newest first)
      return b.createdAt.localeCompare(a.createdAt);
    }
  });

  return (
    <div className="space-y-4">
      {/* Dynamic Search & Fast Sort toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white/40 dark:bg-slate-900/30 p-3.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 backdrop-blur-md">
        {/* Global Search Bar */}
        <div className="relative md:col-span-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Vazifalardan qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/60 dark:bg-slate-950/65 text-slate-800 dark:text-white"
          />
        </div>

        {/* Sorting controls */}
        <div className="md:col-span-7 flex items-center gap-2 justify-end overflow-x-auto whitespace-nowrap">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
            <SlidersHorizontal className="w-3 h-3" />
            <span>Tartiblash:</span>
          </div>
          <div className="flex gap-1.5 bg-slate-200/40 dark:bg-slate-950/50 p-1 rounded-lg">
            <button
              onClick={() => setSortBy('deadline')}
              className={`px-2.5 py-1 text-[10px] font-semibold rounded-md transition duration-150 cursor-pointer ${
                sortBy === 'deadline'
                  ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Muddati bo‘yicha
            </button>
            <button
              onClick={() => setSortBy('priority')}
              className={`px-2.5 py-1 text-[10px] font-semibold rounded-md transition duration-150 cursor-pointer ${
                sortBy === 'priority'
                  ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Prioritetli
            </button>
            <button
              onClick={() => setSortBy('createdAt')}
              className={`px-2.5 py-1 text-[10px] font-semibold rounded-md transition duration-150 cursor-pointer ${
                sortBy === 'createdAt'
                  ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Yangi qo‘shilgan
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters: Status, Priority, Category */}
      <div className="flex flex-wrap gap-2.5 bg-white/20 dark:bg-slate-900/10 p-3 rounded-2xl border border-slate-200/20 dark:border-slate-800/10 text-xs">
        {/* Status filters */}
        <div className="flex gap-1 items-center bg-white/40 dark:bg-slate-950/20 p-1 rounded-xl">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-lg transition text-[11px] font-medium cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-slate-800 dark:bg-slate-800 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/30'
            }`}
          >
            Barchasi
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-2.5 py-1 rounded-lg transition text-[11px] font-medium cursor-pointer ${
              statusFilter === 'pending'
                ? 'bg-slate-800 dark:bg-slate-800 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/30'
            }`}
          >
            Kutilmoqda ({tasks.filter((t) => !t.completed).length})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-2.5 py-1 rounded-lg transition text-[11px] font-medium cursor-pointer ${
              statusFilter === 'completed'
                ? 'bg-slate-800 dark:bg-slate-800 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/30'
            }`}
          >
            Yakunlandi ({tasks.filter((t) => t.completed).length})
          </button>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-400 font-semibold px-1 uppercase tracking-wider">Prioritet:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="px-2 py-1 bg-white/50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">Hammasi</option>
            <option value="yuqori">Yuqori</option>
            <option value="o‘rta">O‘rta</option>
            <option value="past">Past</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-400 font-semibold px-1 uppercase tracking-wider">Kategoriya:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="px-2 py-1 bg-white/50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">Hammasi</option>
            <option value="ish">💼 Ish</option>
            <option value="shaxsiy">🏠 Shaxsiy</option>
            <option value="o‘qish">📚 O‘qish</option>
            <option value="xaridlar">🛒 Xaridlar</option>
            <option value="boshqa">⚙️ Boshqa</option>
          </select>
        </div>
      </div>

      {/* Main Task List Area */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {sortedTasks.length === 0 ? (
            /* Premium Empty State as requested */
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-dashed border-slate-200/60 dark:border-slate-800/60 bg-white/20 dark:bg-slate-900/10 min-h-[300px]"
            >
              <div className="relative w-16 h-16 bg-indigo-500/10 dark:bg-indigo-500/5 text-indigo-500 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              <h4 className="text-base font-heading font-bold text-slate-800 dark:text-white capitalize">
                Vazifalar ro‘yxati bo‘sh
              </h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1.5 mx-auto leading-relaxed">
                Hech qanday vazifa topilmadi. Yangi reja qo‘shing yoki filter sozlangan bo‘lsa uni tozalab ko‘ring.
              </p>
              <button
                onClick={onOpenForm}
                className="mt-5 px-4.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/10 cursor-pointer flex items-center gap-1.5 transition active:scale-95"
              >
                <Plus className="w-4 h-4" /> Vazifa qo‘shish
              </button>
            </motion.div>
          ) : (
            sortedTasks.map((task) => {
              const overdue = !task.completed && task.deadline < todayStr;
              const dueToday = !task.completed && task.deadline === todayStr;

              // Calculate subtasks progress
              const totalSubtasks = task.subtasks.length;
              const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
              const hasSubtasks = totalSubtasks > 0;
              const subtaskProgress = hasSubtasks ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className={`group relative p-4 rounded-3xl transition-all duration-300 border backdrop-blur-md ${
                    task.completed
                      ? 'bg-slate-50/40 dark:bg-slate-900/10 border-slate-200/30 dark:border-slate-800/20'
                      : overdue
                      ? 'bg-red-50/20 dark:bg-red-950/5 border-red-200/50 dark:border-red-950/20 shadow-sm shadow-red-500/5'
                      : dueToday
                      ? 'bg-blue-50/20 dark:bg-blue-950/5 border-blue-200/50 dark:border-blue-950/20 shadow-sm shadow-blue-500/5'
                      : 'bg-white/65 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Checkbox box & task text */}
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      {/* Interactive Task complete check */}
                      <button
                        onClick={() => onToggleComplete(task.id)}
                        className={`mt-1 w-5.5 h-5.5 rounded-xl border flex items-center justify-center transition-all duration-200 cursor-pointer flex-shrink-0 ${
                          task.completed
                            ? 'bg-emerald-500 border-emerald-600 text-white'
                            : overdue
                            ? 'border-red-400 dark:border-red-900 bg-red-500/5 hover:border-red-500'
                            : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-white/20'
                        }`}
                      >
                        {task.completed && (
                          <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        {/* Title and tags row */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-1 bg-transparent">
                          {/* Priority badge */}
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full capitalize ${getPriorityBadgeColor(task.priority)}`}>
                            {task.priority}
                          </span>

                          {/* Category badge */}
                          <span className="text-[9px] font-medium font-sans px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 inline-flex items-center gap-1">
                            {getCategoryIcon(task.category)}
                            <span>{getCategoryLabel(task.category)}</span>
                          </span>

                          {/* Status Alerts */}
                          {overdue && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white animate-pulse flex items-center gap-0.5">
                              <AlertTriangle className="w-2.5 h-2.5" /> Muddati o‘tgan!
                            </span>
                          )}
                          {dueToday && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-500 text-white flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" /> Bugun yakunlanadi
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h4
                          className={`text-sm font-semibold truncate ${
                            task.completed
                              ? 'line-through text-slate-400 dark:text-slate-500 font-medium'
                              : 'text-slate-800 dark:text-white font-heading'
                          }`}
                        >
                          {task.title}
                        </h4>

                        {/* Description */}
                        {task.description && (
                          <p
                            className={`text-[11px] mt-1 line-clamp-2 ${
                              task.completed
                                ? 'text-slate-400 dark:text-slate-500 line-through'
                                : 'text-slate-500 dark:text-slate-400 leading-relaxed'
                            }`}
                          >
                            {task.description}
                          </p>
                        )}

                        {/* Date info */}
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] font-mono font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            Muddat: {task.deadline}
                          </span>

                          <span className="text-[10px] text-slate-400 dark:text-slate-500">
                            Qo‘shilgan: {new Date(task.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Subtasks Progress view */}
                        {hasSubtasks && (
                          <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/40">
                            <div className="flex items-center justify-between text-[10px] mb-1 font-sans">
                              <span className="text-slate-400">
                                Bosqichlar: {completedSubtasks} tasid {totalSubtasks} tasi bajarildi
                              </span>
                              <span className="font-semibold text-slate-600 dark:text-slate-300 font-mono">
                                {subtaskProgress}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-150 dark:bg-slate-800 h-1 rounded-full overflow-hidden mb-2">
                              <div
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300"
                                style={{ width: `${subtaskProgress}%` }}
                              />
                            </div>

                            {/* Subtask interactive items */}
                            <div className="space-y-1 mt-2.5">
                              {task.subtasks.map((sub) => (
                                <button
                                  key={sub.id}
                                  onClick={() => onToggleSubtask(task.id, sub.id)}
                                  className="w-full text-left flex items-center gap-2 p-1 px-1.5 rounded-lg hover:bg-slate-100/40 dark:hover:bg-slate-950/20 text-[10px] font-medium text-slate-600 dark:text-slate-400 transition cursor-pointer"
                                >
                                  <div
                                    className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center transition-all flex-shrink-0 ${
                                      sub.completed
                                        ? 'bg-indigo-500 border-indigo-600 text-white'
                                        : 'border-slate-300 dark:border-slate-700 bg-white/20'
                                    }`}
                                  >
                                    {sub.completed && (
                                      <svg className="w-2.5 h-2.5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </div>
                                  <span className={sub.completed ? 'line-through text-slate-400' : ''}>
                                    {sub.title}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick controls per task (edit, delete) */}
                    <div className="flex items-center gap-1.5 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditTask(task)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-850 transition cursor-pointer"
                        title="Tahrirlash"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-850 transition cursor-pointer"
                        title="O‘chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
