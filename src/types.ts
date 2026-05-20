export type Priority = 'yuqori' | 'o‘rta' | 'past';

export type Category = 'ish' | 'shaxsiy' | 'o‘qish' | 'xaridlar' | 'boshqa';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string; // YYYY-MM-DD
  priority: Priority;
  category: Category;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  subtasks: SubTask[];
}

export interface DailyGoal {
  id: string;
  title: string;
  completed: boolean;
  time?: string; // e.g. "08:30"
}

export interface Habit {
  id: string;
  title: string;
  streak: number;
  completedToday: boolean;
}

export interface DailyStats {
  total: number;
  completed: number;
  pending: number;
  completedPercentage: number;
  highPriorityCount: number;
  overdueCount: number;
  dueTodayCount: number;
}
