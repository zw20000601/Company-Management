'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { tasks } from '@/lib/data';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const priorityDot: Record<string, string> = {
  high: 'bg-red-400',
  medium: 'bg-amber-400',
  low: 'bg-green-400',
};

const statusDot: Record<string, string> = {
  todo: 'bg-gray-400',
  in_progress: 'bg-blue-500',
  completed: 'bg-green-500',
  overdue: 'bg-red-500',
};

export default function CalendarPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const getTasksForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(t => t.dueDate === dateStr);
  };

  const selectedDayTasks = selectedDay ? getTasksForDay(selectedDay) : [];
  const selectedDateStr = selectedDay
    ? `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
    : null;

  // Upcoming tasks this month
  const upcomingTasks = tasks
    .filter(t => {
      const d = new Date(t.dueDate);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear && t.status !== 'completed';
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 8);

  return (
    <DashboardLayout title="Calendar" subtitle="View tasks and deadlines on your calendar">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Calendar */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">{MONTHS[currentMonth]} {currentYear}</h2>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <ChevronLeft size={16} className="text-gray-600" />
              </button>
              <button
                onClick={() => { setCurrentMonth(today.getMonth()); setCurrentYear(today.getFullYear()); setSelectedDay(today.getDate()); }}
                className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
              >
                Today
              </button>
              <button onClick={nextMonth} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <ChevronRight size={16} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">{d}</div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-20 rounded-xl"></div>
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayTasks = getTasksForDay(day);
              const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
              const isSelected = day === selectedDay;
              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`h-20 rounded-xl p-1.5 cursor-pointer transition-all border ${
                    isSelected ? 'bg-blue-50 border-blue-200' :
                    isToday ? 'border-blue-300 bg-blue-50/30' :
                    'border-transparent hover:bg-gray-50'
                  }`}
                >
                  <div className={`text-xs font-semibold mb-1 w-6 h-6 rounded-full flex items-center justify-center ${
                    isToday ? 'bg-blue-600 text-white' :
                    isSelected ? 'text-blue-600' : 'text-gray-700'
                  }`}>
                    {day}
                  </div>
                  <div className="space-y-0.5">
                    {dayTasks.slice(0, 2).map((task) => (
                      <div key={task.id} className={`flex items-center gap-1 text-xs rounded-md px-1 py-0.5 truncate
                        ${task.status === 'completed' ? 'bg-green-50 text-green-700' :
                          task.status === 'overdue' ? 'bg-red-50 text-red-600' :
                          'bg-blue-50 text-blue-700'}`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${priorityDot[task.priority]}`}></div>
                        <span className="truncate">{task.title}</span>
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <div className="text-xs text-gray-400 px-1">+{dayTasks.length - 2} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Selected Day Details */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                {selectedDay || today.getDate()}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  {selectedDay
                    ? `${MONTHS[currentMonth].slice(0, 3)} ${selectedDay}, ${currentYear}`
                    : 'Select a date'}
                </p>
                <p className="text-xs text-gray-400">{selectedDayTasks.length} tasks due</p>
              </div>
            </div>
            {selectedDayTasks.length > 0 ? (
              <div className="space-y-2">
                {selectedDayTasks.map((task) => (
                  <div key={task.id} className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-start gap-2">
                      <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${statusDot[task.status]}`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{task.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{task.assignee}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${
                            task.priority === 'high' ? 'bg-red-50 text-red-600' :
                            task.priority === 'medium' ? 'bg-amber-50 text-amber-600' :
                            'bg-green-50 text-green-600'
                          }`}>{task.priority}</span>
                          <span className="text-xs text-gray-400">{task.progress}% done</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Clock size={18} className="text-gray-300" />
                </div>
                <p className="text-sm text-gray-400">No tasks due on this day</p>
              </div>
            )}
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="font-semibold text-gray-900 text-sm mb-4">Upcoming Deadlines</p>
            <div className="space-y-2">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-2.5 p-2.5 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${priorityDot[task.priority]}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{task.title}</p>
                    <p className="text-xs text-gray-400">{task.dueDate} · {task.assignee.split(' ')[0]}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold shrink-0 ${
                    task.status === 'overdue' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {task.status === 'overdue' ? 'Overdue' : task.dueDate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
