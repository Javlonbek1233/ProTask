import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Calendar, ShieldAlert, Tag, ListPlus } from 'lucide-react';
import { Task, Priority, Category, SubTask } from '../types';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: {
    title: string;
    description: string;
    deadline: string;
    priority: Priority;
    category: Category;
    subtasks: Omit<SubTask, 'id'>[];
    id?: string;
  }) => void;
  taskToEdit?: Task | null;
}

export default function TaskForm({ isOpen, onClose, onSave, taskToEdit }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<Priority>('o‘rta');
  const [category, setCategory] = useState<Category>('ish');
  const [subtasks, setSubtasks] = useState<{ title: string; completed: boolean }[]>([]);
  const [newSubtaskText, setNewSubtaskText] = useState('');

  // Sync state if editing a task
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setDeadline(taskToEdit.deadline);
      setPriority(taskToEdit.priority);
      setCategory(taskToEdit.category);
      setSubtasks(taskToEdit.subtasks.map(({ title, completed }) => ({ title, completed })));
    } else {
      // Defaults for a new task
      setTitle('');
      setDescription('');
      // Set tomorrow as default deadline
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDeadline(tomorrow.toISOString().split('T')[0]);
      setPriority('o‘rta');
      setCategory('ish');
      setSubtasks([]);
    }
  }, [taskToEdit, isOpen]);

  const handleAddSubtask = () => {
    if (!newSubtaskText.trim()) return;
    setSubtasks([...subtasks, { title: newSubtaskText.trim(), completed: false }]);
    setNewSubtaskText('');
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      deadline,
      priority,
      category,
      subtasks,
      id: taskToEdit?.id,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl p-6 glass-card-light dark:glass-card-dark border border-white/40 dark:border-white/10 shadow-2xl max-h-[90vh] flex flex-col justify-between"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 dark:border-slate-800/50 mb-4 bg-transparent">
              <div>
                <h2 className="text-xl font-heading font-bold text-slate-800 dark:text-white">
                  {taskToEdit ? 'Vazifani tahrirlash' : 'Yangi vazifa qo‘shish'}
                </h2>
                <p className="text-xs text-slate-400">
                  {taskToEdit ? 'Taqvim va tafsilotlarni yangilang' : 'Kun rejasiga yangi topshiriq bering'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1 mb-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Vazifa sarlavhasi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Hisobotlarni tayyorlash..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/70 dark:bg-slate-900/60 text-slate-800 dark:text-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Batafsil tavsif
                </label>
                <textarea
                  rows={2}
                  placeholder="Vazifa haqida qisqacha ma’lumot bering..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/70 dark:bg-slate-900/60 text-slate-800 dark:text-white resize-none"
                />
              </div>

              {/* Grid: Deadline, Priority, Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Deadline */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                    <Calendar className="w-3.5 h-3.5" /> Muddat (Deadline)
                  </label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/70 dark:bg-slate-900/60 text-slate-800 dark:text-white"
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> Prioritet
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/70 dark:bg-slate-900/60 text-slate-800 dark:text-white"
                  >
                    <option value="yuqori">🔴 Yuqori</option>
                    <option value="o‘rta">🟡 O‘rta</option>
                    <option value="past">🟢 Past</option>
                  </select>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                  <Tag className="w-3.5 h-3.5" /> Kategoriya (Turkum)
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/70 dark:bg-slate-900/60 text-slate-800 dark:text-white"
                >
                  <option value="ish">💼 Ish / Loyiha</option>
                  <option value="shaxsiy">🏠 Shaxsiy hayot</option>
                  <option value="o‘qish">📚 O‘qish / Ta’lim</option>
                  <option value="xaridlar">🛒 Xaridlar</option>
                  <option value="boshqa">⚙️ Boshqa</option>
                </select>
              </div>

              {/* Subtasks Builder */}
              <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1.5">
                  <ListPlus className="w-3.5 h-3.5" /> Kichik vazifalar (Subtasks)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Masalan: Boqichni tahlil qilish..."
                    value={newSubtaskText}
                    onChange={(e) => setNewSubtaskText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubtask();
                      }
                    }}
                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50 dark:bg-slate-900/40 text-slate-800 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubtask}
                    className="px-3 py-2 text-xs bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 hover:dark:bg-indigo-950/60 transition cursor-pointer font-medium flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Qo‘shish
                  </button>
                </div>

                {/* Subtask list */}
                {subtasks.length > 0 && (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/20 p-2.5 rounded-2xl border border-slate-200/30 dark:border-slate-800/30">
                    {subtasks.map((sub, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 p-1.5 bg-white/40 dark:bg-slate-900/35 rounded-lg text-xs"
                      >
                        <span className="text-slate-700 dark:text-slate-300 font-medium truncate flex-1 pl-1">
                          {sub.title}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubtask(idx)}
                          className="p-1 text-slate-400 hover:text-red-500 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200/50 dark:border-slate-800/50">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!title.trim()}
                className={`px-5 py-2.5 text-xs font-semibold text-white rounded-xl shadow-lg transition duration-200 cursor-pointer ${
                  title.trim()
                    ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/10'
                    : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                Saqlash
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
