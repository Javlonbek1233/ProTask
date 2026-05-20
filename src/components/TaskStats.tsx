import { CheckCircle2, Clock, AlertTriangle, Calendar, Award, Activity } from 'lucide-react';
import { DailyStats } from '../types';

interface TaskStatsProps {
  stats: DailyStats;
}

export default function TaskStats({ stats }: TaskStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {/* 1. Jami Vazifalar */}
      <div className="flex flex-col justify-between p-4 rounded-2xl glass-card-light dark:glass-card-dark transition-all duration-300 hover:scale-[1.02] border border-white/20 dark:border-white/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-sans">Jami reja</span>
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div>
          <span className="text-2xl font-bold font-heading text-slate-800 dark:text-white tracking-tight">
            {stats.total}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">vazifalar</span>
        </div>
      </div>

      {/* 2. Bajarildi */}
      <div className="flex flex-col justify-between p-4 rounded-2xl glass-card-light dark:glass-card-dark transition-all duration-300 hover:scale-[1.02] border border-white/20 dark:border-white/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-sans">Bajarildi</span>
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-heading text-slate-800 dark:text-white tracking-tight">
              {stats.completed}
            </span>
            <span className="text-xs text-slate-400">/ {stats.total}</span>
          </div>
          <div className="w-full bg-slate-200/55 dark:bg-slate-700/50 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.completedPercentage}%` }}
            />
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-1 font-mono font-medium">
            {stats.completedPercentage}% yakunlandi
          </span>
        </div>
      </div>

      {/* 3. Kutilmoqda */}
      <div className="flex flex-col justify-between p-4 rounded-2xl glass-card-light dark:glass-card-dark transition-all duration-300 hover:scale-[1.02] border border-white/20 dark:border-white/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-sans">Kutilmoqda</span>
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div>
          <span className="text-2xl font-bold font-heading text-slate-800 dark:text-white tracking-tight">
            {stats.pending}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">bajarilishi kerak</span>
        </div>
      </div>

      {/* 4. Bugun Muddatli */}
      <div className="flex flex-col justify-between p-4 rounded-2xl glass-card-light dark:glass-card-dark transition-all duration-300 hover:scale-[1.02] border border-white/20 dark:border-white/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-sans">Bugun</span>
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div>
          <span className="text-2xl font-bold font-heading text-slate-800 dark:text-white tracking-tight">
            {stats.dueTodayCount}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">bugun yakunlanadi</span>
        </div>
      </div>

      {/* 5. Muhim (Yuqori) */}
      <div className="flex flex-col justify-between p-4 rounded-2xl glass-card-light dark:glass-card-dark transition-all duration-300 hover:scale-[1.02] border border-white/20 dark:border-white/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-sans">Muhim</span>
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div>
          <span className="text-2xl font-bold font-heading text-slate-800 dark:text-white tracking-tight">
            {stats.highPriorityCount}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">yuqori prioritet</span>
        </div>
      </div>

      {/* 6. Kechikkanlar */}
      <div className="flex flex-col justify-between p-4 rounded-2xl glass-card-light dark:glass-card-dark transition-all duration-300 hover:scale-[1.02] border border-white/20 dark:border-white/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-sans">Kechikkan</span>
          <div className="p-1.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
            <Award className="w-4 h-4 rotate-180" />
          </div>
        </div>
        <div>
          <span className={`text-2xl font-bold font-heading tracking-tight ${stats.overdueCount > 0 ? 'text-red-500 font-extrabold' : 'text-slate-800 dark:text-white'}`}>
            {stats.overdueCount}
          </span>
          <span className={`text-[10px] block mt-1 ${stats.overdueCount > 0 ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
            muddati o‘tgan
          </span>
        </div>
      </div>
    </div>
  );
}
