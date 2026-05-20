import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Moon,
  Sun,
  Plus,
  Clock,
  Sparkles,
  Calendar,
  Flame,
  Trophy,
  BrainCircuit,
  Quote,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { Task, DailyGoal, Habit, DailyStats, Priority, Category } from './types';
import TaskStats from './components/TaskStats';
import DailyGoals from './components/DailyGoals';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

// Initial dummy data for first launch to give the user a beautiful preview
const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Mobil ilova dizaynini yakunlash',
    description: 'Figma loyihasidagi barcha ekranlarni ko‘rib chiqish va asosiy UI o‘zgarishlarini yakunlash.',
    deadline: new Date().toISOString().split('T')[0], // Bugun
    priority: 'yuqori',
    category: 'ish',
    completed: false,
    createdAt: new Date().toISOString(),
    subtasks: [
      { id: 's1', title: 'Splash screen va Kirish ekranlari', completed: true },
      { id: 's2', title: 'Dashboard bento-grid dizayni', completed: false },
      { id: 's3', title: 'Sozlamalar va Dark mode tugmalari', completed: false },
    ],
  },
  {
    id: 't2',
    title: 'Matematika topshiriqlari',
    description: 'Matematik tahlil fanidan 5-ma’ruzani konspekt qilish va integral misollarni yechish.',
    deadline: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 kundan keyin
    priority: 'o‘rta',
    category: 'o‘qish',
    completed: false,
    createdAt: new Date().toISOString(),
    subtasks: [
      { id: 's4', title: 'Tenglamalar tizimini tushunish', completed: false },
    ],
  },
  {
    id: 't3',
    title: 'Haftalik oziq-ovqat xaridi',
    description: 'Korzinka yoki Makro supermarketidan reja asosida ro‘yxatdagi mevalar va mahsulotlarni sotib olish.',
    deadline: new Date().toISOString().split('T')[0],
    priority: 'past',
    category: 'xaridlar',
    completed: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Kecha
    subtasks: [],
  },
];

const INITIAL_GOALS: DailyGoal[] = [
  { id: 'g1', title: 'Ertalabki yugurish', completed: true, time: '06:30' },
  { id: 'g2', title: 'Kitob o‘qish (20 sahifa)', completed: false, time: '21:00' },
];

const INITIAL_HABITS: Habit[] = [
  { id: 'h1', title: 'Ingliz tili (Duolingo)', streak: 12, completedToday: true },
  { id: 'h2', title: 'Kodni tekshirish (Code Review)', streak: 5, completedToday: false },
];

const MOTIVATIONAL_QUOTES = [
  { text: "Muvaffaqiyat — bu har kuni takrorlanadigan kichik g‘alabalar yig‘indisidir.", author: "Robert Kollier" },
  { text: "Vaqtingizni rejalashtirish degani — hayotingizni nazorat qilish demakdir.", author: "Alan Lakeyn" },
  { text: "Hozir boshlamasangiz, ertaga ham bugungi joyingizda qolasiz.", author: "Donishmandlar o‘giti" },
  { text: "Reja tuzmaslik — muvaffaqiyatsizlikka reja tuzish demakdir.", author: "Benjamin Franklin" },
  { text: "Eng yaxshi rejalashtirish — hozirgi lahzada boshlangan amallardir.", author: "Sharq falsafasi" },
  { text: "Ishlarni keyinga qoldirish — umrning eng katta o‘g‘risidir.", author: "Edvard Yang" }
];

export default function App() {
  // Local storage checks
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('planner_tasks');
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch (e) {
      console.error(e);
      return INITIAL_TASKS;
    }
  });

  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>(() => {
    try {
      const saved = localStorage.getItem('planner_daily_goals');
      return saved ? JSON.parse(saved) : INITIAL_GOALS;
    } catch (e) {
      console.error(e);
      return INITIAL_GOALS;
    }
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem('planner_habits');
      return saved ? JSON.parse(saved) : INITIAL_HABITS;
    } catch (e) {
      console.error(e);
      return INITIAL_HABITS;
    }
  });

  const [waterGlassCount, setWaterGlassCount] = useState<number>(() => {
    const saved = localStorage.getItem('planner_water_glasses');
    return saved ? parseInt(saved, 10) : 4;
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('planner_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  // Modal and edit state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Quote state
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Time state
  const [currentTime, setCurrentTime] = useState(new Date());

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('planner_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('planner_daily_goals', JSON.stringify(dailyGoals));
  }, [dailyGoals]);

  useEffect(() => {
    localStorage.setItem('planner_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('planner_water_glasses', waterGlassCount.toString());
  }, [waterGlassCount]);

  useEffect(() => {
    localStorage.setItem('planner_dark_mode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update quote once a day or randomly
  const handleRotateQuote = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  // Greeting based on current time
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 11) return 'Xayrli tong! 🌅';
    if (hour >= 11 && hour < 17) return 'Xayrli kun! ☀️';
    if (hour >= 17 && hour < 22) return 'Xayrli kech! 🌆';
    return 'Xayrli tun! 🌌';
  };

  // Format date natively in Uzbek language
  const formattedDate = currentTime.toLocaleDateString('uz-UZ', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Calculate stats
  const calculateStats = (): DailyStats => {
    const todayStr = new Date().toISOString().split('T')[0];
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const completedPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    const highPriorityCount = tasks.filter((t) => t.priority === 'yuqori' && !t.completed).length;
    const overdueCount = tasks.filter((t) => !t.completed && t.deadline < todayStr).length;
    const dueTodayCount = tasks.filter((t) => t.deadline === todayStr && !t.completed).length;

    return {
      total,
      completed,
      pending,
      completedPercentage,
      highPriorityCount,
      overdueCount,
      dueTodayCount,
    };
  };

  const stats = calculateStats();

  // === TASKS WORKFLOW ===
  const handleSaveTask = (taskData: {
    title: string;
    description: string;
    deadline: string;
    priority: Priority;
    category: Category;
    subtasks: { title: string; completed: boolean }[];
    id?: string;
  }) => {
    if (taskData.id) {
      // Editing
      setTasks(
        tasks.map((t) =>
          t.id === taskData.id
            ? {
                ...t,
                title: taskData.title,
                description: taskData.description,
                deadline: taskData.deadline,
                priority: taskData.priority,
                category: taskData.category,
                subtasks: taskData.subtasks.map((sub, idx) => ({
                  id: t.subtasks[idx]?.id || 's_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                  title: sub.title,
                  completed: sub.completed,
                })),
              }
            : t
        )
      );
    } else {
      // Creating new
      const newTask: Task = {
        id: 't_' + Date.now(),
        title: taskData.title,
        description: taskData.description,
        deadline: taskData.deadline,
        priority: taskData.priority,
        category: taskData.category,
        completed: false,
        createdAt: new Date().toISOString(),
        subtasks: taskData.subtasks.map((sub) => ({
          id: 's_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          title: sub.title,
          completed: sub.completed,
        })),
      };
      setTasks([newTask, ...tasks]);
    }
    setTaskToEdit(null);
  };

  const handleEditTaskClick = (task: Task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm('Haqiqatdan ham ushbu vazifani o‘chirmoqchimisiz?')) {
      setTasks(tasks.filter((t) => t.id !== id));
    }
  };

  const handleToggleComplete = (id: string) => {
    setTasks(
      tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? new Date().toISOString() : undefined,
            }
          : t
      )
    );
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map((sub) =>
            sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
          );
          return {
            ...t,
            subtasks: updatedSubtasks,
          };
        }
        return t;
      })
    );
  };

  // === TEZKOR MAQSADLAR WORKFLOW ===
  const handleAddGoal = (title: string, time?: string) => {
    const newGoal: DailyGoal = {
      id: 'g_' + Date.now(),
      title,
      completed: false,
      time,
    };
    setDailyGoals([...dailyGoals, newGoal]);
  };

  const handleToggleGoal = (id: string) => {
    setDailyGoals(dailyGoals.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g)));
  };

  const handleDeleteGoal = (id: string) => {
    setDailyGoals(dailyGoals.filter((g) => g.id !== id));
  };

  // === HABITS WORKFLOW ===
  const handleAddHabit = (title: string) => {
    const newHabit: Habit = {
      id: 'h_' + Date.now(),
      title,
      streak: 0,
      completedToday: false,
    };
    setHabits([...habits, newHabit]);
  };

  const handleToggleHabit = (id: string) => {
    setHabits(
      habits.map((h) => {
        if (h.id === id) {
          const willComplete = !h.completedToday;
          return {
            ...h,
            completedToday: willComplete,
            streak: willComplete ? h.streak + 1 : Math.max(0, h.streak - 1),
          };
        }
        return h;
      })
    );
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(habits.filter((h) => h.id !== id));
  };

  return (
    <div className={`min-h-screen font-sans antialiased text-slate-800 dark:text-slate-200 transition-colors duration-500 bg-slate-50/70 dark:bg-slate-950`}>
      
      {/* Absolute Decorative Background Elements for High-Fidelity Feel */}
      <div className="absolute top-10 left-[10%] w-96 h-96 bg-indigo-400/10 dark:bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[5%] w-80 h-80 bg-rose-400/10 dark:bg-rose-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-5 left-[20%] w-72 h-72 bg-emerald-400/10 dark:bg-emerald-600/5 rounded-full blur-[90px] pointer-events-none" />

      {/* Main Page Container */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 relative z-10">
        
        {/* Header Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          
          {/* Welcome and Greeting Panel */}
          <div className="lg:col-span-8 p-6 md:p-8 rounded-3xl glass-card-light dark:glass-card-dark flex flex-col justify-between transition-all duration-300 relative overflow-hidden group">
            <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-44 h-44 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/15 transition-all duration-500" />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 font-sans block mb-1">DASHBOARD</span>
                <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-slate-800 dark:text-white leading-tight">
                  {getGreeting()}
                </h1>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5 capitalize font-sans font-medium">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{formattedDate}</span>
                </p>
              </div>

              {/* Action and Settings Row */}
              <div className="flex items-center gap-2.5 self-stretch md:self-auto bg-transparent">
                {/* Dark mode button */}
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-3 bg-white/60 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition border border-slate-200/50 dark:border-slate-800/50 text-slate-500 dark:text-amber-400 cursor-pointer shadow-xs"
                  title="Mavzuni o‘zgartirish"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-slate-700" />}
                </button>

                {/* Add new task main button */}
                <button
                  onClick={() => {
                    setTaskToEdit(null);
                    setIsFormOpen(true);
                  }}
                  className="flex-1 md:flex-initial px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition shadow-lg shadow-indigo-600/15 cursor-pointer flex items-center justify-center gap-2 text-sm font-semibold active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Yangi Vazifa</span>
                </button>
              </div>
            </div>

            {/* Quick progress summary footer */}
            <div className="mt-6 pt-5 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs bg-transparent">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                Sizda bugun jami <strong className="text-indigo-600 dark:text-indigo-400">{stats.pending} ta</strong> kutilayotgan vazifa bor.
              </span>
              {stats.total > 0 && (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-slate-400">Kunlik progress:</span>
                  <div className="w-24 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${stats.completedPercentage}%` }} />
                  </div>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{stats.completedPercentage}%</span>
                </div>
              )}
            </div>
          </div>

          {/* Inspirational / Motivational Box */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-110 transition duration-300 pointer-events-none" />
            
            <div className="flex items-center justify-between">
              <div className="p-2 bg-indigo-500/15 rounded-xl text-indigo-400 inline-flex">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <button
                onClick={handleRotateQuote}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Boshqa motivatsiya"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="my-6">
              <Quote className="w-6 h-6 text-indigo-400 mb-2 opacity-50 fill-current" />
              <p className="text-xs font-medium italic text-slate-200 leading-relaxed font-sans">
                “{MOTIVATIONAL_QUOTES[currentQuoteIndex].text}”
              </p>
              <span className="text-[10px] text-indigo-400 mt-2 block font-semibold font-mono tracking-wider">
                — {MOTIVATIONAL_QUOTES[currentQuoteIndex].author}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Hozirgi vaqt:</span>
              <span className="font-bold text-indigo-200 tracking-wider">
                {currentTime.toLocaleTimeString('uz-UZ', { hour12: false })}
              </span>
            </div>
          </div>

        </div>

        {/* Statistical counters block */}
        <TaskStats stats={stats} />

        {/* Planner Widgets (Daily Goals, Habits, Water tracker) */}
        <DailyGoals
          goals={dailyGoals}
          habits={habits}
          waterGlassCount={waterGlassCount}
          onAddGoal={handleAddGoal}
          onToggleGoal={handleToggleGoal}
          onDeleteGoal={handleDeleteGoal}
          onToggleHabit={handleToggleHabit}
          onAddHabit={handleAddHabit}
          onDeleteHabit={handleDeleteHabit}
          onUpdateWater={setWaterGlassCount}
        />

        {/* Core Task Management Grid */}
        <div className="p-5 md:p-6 rounded-3xl glass-card-light dark:glass-card-dark border border-white/20 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-4 bg-transparent pb-3.5 border-b border-slate-200/50 dark:border-slate-800/50">
            <div>
              <h2 className="text-lg font-heading font-extrabold text-slate-800 dark:text-white uppercase tracking-tight">
                📅 Vazifalar & Rejalar
              </h2>
              <p className="text-[11px] text-slate-400">Prioritet, muddat va bosqichlar asosida boshqaruv</p>
            </div>
            <button
              onClick={() => {
                setTaskToEdit(null);
                setIsFormOpen(true);
              }}
              className="p-1 px-3 text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/15 rounded-xl font-semibold transition cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Qo‘shish
            </button>
          </div>

          <TaskList
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onToggleSubtask={handleToggleSubtask}
            onEditTask={handleEditTaskClick}
            onDeleteTask={handleDeleteTask}
            onOpenForm={() => {
              setTaskToEdit(null);
              setIsFormOpen(true);
            }}
          />
        </div>

        {/* Page Footer / Deployment Instructions representation */}
        <footer className="mt-12 text-center text-slate-400 text-[10px] space-y-2 border-t border-slate-200/30 dark:border-slate-800/30 pt-6">
          <p>© 2026 To-do List & Daily Planner. Barcha huquqlar saqlangan.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 font-mono">
            <span>Texnologiyalar: React, TypeScript, Tailwind CSS v4, LocalStorage</span>
            <span>•</span>
            <span>Xosting: Google Cloud Run</span>
          </div>
        </footer>

        {/* Add/Edit Task Form Modal */}
        <TaskForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setTaskToEdit(null);
          }}
          onSave={handleSaveTask}
          taskToEdit={taskToEdit}
        />

      </div>
    </div>
  );
}
