import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, GlassWater, Flame, Plus, Check, Trash2, Trophy, Clock } from 'lucide-react';
import { DailyGoal, Habit } from '../types';

interface DailyGoalsProps {
  goals: DailyGoal[];
  habits: Habit[];
  waterGlassCount: number; // 0 to 10
  onAddGoal: (title: string, time?: string) => void;
  onToggleGoal: (id: string) => void;
  onDeleteGoal: (id: string) => void;
  onToggleHabit: (id: string) => void;
  onAddHabit: (title: string) => void;
  onDeleteHabit: (id: string) => void;
  onUpdateWater: (count: number) => void;
}

export default function DailyGoals({
  goals,
  habits,
  waterGlassCount,
  onAddGoal,
  onToggleGoal,
  onDeleteGoal,
  onToggleHabit,
  onAddHabit,
  onDeleteHabit,
  onUpdateWater,
}: DailyGoalsProps) {
  const [goalText, setGoalText] = useState('');
  const [goalTime, setGoalTime] = useState('');
  const [habitText, setHabitText] = useState('');

  const handleAddGoalSubmit = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (!goalText.trim()) return;
    onAddGoal(goalText, goalTime || undefined);
    setGoalText('');
    setGoalTime('');
  };

  const handleAddHabitSubmit = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (!habitText.trim()) return;
    onAddHabit(habitText);
    setHabitText('');
  };

  // Safe range for water is 0 to 10 glasses (8 is standard goal)
  const handleWaterClick = (index: number) => {
    onUpdateWater(index + 1);
  };

  const resetWater = () => {
    onUpdateWater(0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* 1. KUNLIK TEZKOR REJALAR */}
      <div className="p-5 rounded-3xl glass-card-light dark:glass-card-dark flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-slate-800 dark:text-white">Tezkor maqsadlar</h3>
              <p className="text-xs text-slate-400">Kun davomidagi kichik vazifalar</p>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <div className="flex-1 flex flex-col gap-1.5">
              <input
                type="text"
                placeholder="Yangi tezkor maqsad..."
                value={goalText}
                onChange={(e) => setGoalText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddGoalSubmit();
                  }
                }}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/50 bg-white/50 dark:bg-slate-900/45 text-slate-800 dark:text-white"
              />
              <div className="flex items-center gap-1">
                <Clock className="w-3 text-slate-400" />
                <input
                  type="time"
                  value={goalTime}
                  onChange={(e) => setGoalTime(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddGoalSubmit();
                    }
                  }}
                  className="text-[10px] bg-transparent border-none text-slate-500 focus:outline-none focus:ring-0 w-24 p-0"
                  placeholder="Vaqt"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleAddGoalSubmit()}
              className="p-3 text-xs bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition duration-200 self-start shadow-sm flex items-center justify-center cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Goal List */}
          <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
            <AnimatePresence initial={false}>
              {goals.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  Tezkor maqsad yo‘q
                </div>
              ) : (
                goals.map((goal) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/40 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-900/50"
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <button
                        onClick={() => onToggleGoal(goal.id)}
                        className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all duration-250 cursor-pointer ${
                          goal.completed
                            ? 'bg-emerald-500 border-emerald-600 text-white shadow-sm'
                            : 'border-slate-300 dark:border-slate-700 hover:border-violet-500 dark:hover:border-violet-400 bg-white/20'
                        }`}
                      >
                        {goal.completed && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      </button>
                      <div className="truncate flex-1">
                        <p
                          className={`text-xs font-medium truncate ${
                            goal.completed
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          {goal.title}
                        </p>
                        {goal.time && (
                          <span className="text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500 flex items-center gap-0.5 mt-0.5">
                            <Clock className="w-2.5 h-2.5" /> {goal.time}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteGoal(goal.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition duration-150 cursor-pointer rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 2. ODATIY TARBIYACHI (HABITS) */}
      <div className="p-5 rounded-3xl glass-card-light dark:glass-card-dark flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-slate-800 dark:text-white">Doimiy odatlar</h3>
              <p className="text-xs text-slate-400">Kunlik streaklar bilan ishlash</p>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Yangi kundalik odat..."
              value={habitText}
              onChange={(e) => setHabitText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddHabitSubmit();
                }
              }}
              className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/50 bg-white/50 dark:bg-slate-900/45 text-slate-800 dark:text-white h-10"
            />
            <button
              type="button"
              onClick={() => handleAddHabitSubmit()}
              className="p-3 text-xs bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition duration-200 shadow-sm flex items-center justify-center cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Habits List */}
          <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
            <AnimatePresence initial={false}>
              {habits.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  Kundalik odat yo‘q
                </div>
              ) : (
                habits.map((habit) => (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/40 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-900/50"
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <button
                        onClick={() => onToggleHabit(habit.id)}
                        className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all duration-250 cursor-pointer ${
                          habit.completedToday
                            ? 'bg-rose-500 border-rose-600 text-white shadow-sm'
                            : 'border-slate-300 dark:border-slate-700 hover:border-rose-500 dark:hover:border-rose-400 bg-white/20'
                        }`}
                      >
                        {habit.completedToday && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      </button>
                      <div className="truncate flex-1">
                        <p
                          className={`text-xs font-semibold truncate ${
                            habit.completedToday
                              ? 'text-slate-400 dark:text-slate-500 line-through'
                              : 'text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          {habit.title}
                        </p>
                        <span className="text-[10px] font-mono font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-0.5">
                          <Flame className="w-3 h-3 fill-current inline" />
                          <span>{habit.streak} kun ketma-ket</span>
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteHabit(habit.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition duration-150 cursor-pointer rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 3. SUV DINAMIKASI */}
      <div className="p-5 rounded-3xl glass-card-light dark:glass-card-dark flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <GlassWater className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex justify-between w-full items-center">
              <div>
                <h3 className="font-heading font-semibold text-slate-800 dark:text-white">SuvBalansi</h3>
                <p className="text-xs text-slate-400">Gidratsiya darajasi</p>
              </div>
              {waterGlassCount > 0 && (
                <button
                  onClick={resetWater}
                  className="text-[10px] text-slate-400 hover:text-blue-500 transition font-sans cursor-pointer hover:underline"
                >
                  Nollash
                </button>
              )}
            </div>
          </div>

          <div className="text-center mb-4">
            <div className="inline-block relative">
              <div className="text-3xl font-heading font-extrabold text-slate-800 dark:text-white font-mono tracking-tight">
                {waterGlassCount * 250} <span className="text-lg">ml</span>
              </div>
              <div className="text-[10px] text-blue-500 font-semibold font-mono tracking-wide">
                KUNLIK MAQSAD: {waterGlassCount >= 8 ? 'ERISHILDI! 🎉' : '2000 ml (8 stakan)'}
              </div>
            </div>
          </div>

          {/* Glasses grid */}
          <div className="grid grid-cols-4 gap-2.5 mb-2">
            {Array.from({ length: 8 }).map((_, idx) => {
              const isFilled = idx < waterGlassCount;
              return (
                <button
                  key={idx}
                  onClick={() => handleWaterClick(idx)}
                  className={`relative p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all duration-300 transform active:scale-95 cursor-pointer ${
                    isFilled
                      ? 'bg-blue-500 border-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-blue-400 bg-white/20 text-slate-400 dark:text-slate-600'
                  }`}
                >
                  <GlassWater className={`w-5 h-5 ${isFilled ? 'animate-bounce' : ''}`} />
                  <span className="text-[9px] font-mono font-medium block">{(idx + 1) * 250}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-2 text-center">
            {waterGlassCount >= 8 ? (
              <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Tabriklaymiz, bugungi suv balansi bajarildi!</span>
              </div>
            ) : (
              <p className="text-[10px] text-slate-400">
                Sog‘lom bo‘lish uchun har 2 soatda bittadan stakan suv ichib boring.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
