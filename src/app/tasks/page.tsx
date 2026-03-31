'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { tasks as initialTasks, teamMembers, Task, Priority, TaskStatus, taskStatusLabels } from '@/lib/data';
import {
  Plus, Search, Filter, MoreHorizontal,
  Calendar, User, Tag, X, Check, Clock, AlertCircle,
  LayoutList, Kanban, GripVertical, ArrowRight
} from 'lucide-react';

type ViewMode = 'list' | 'kanban';

const priorityBadge: Record<Priority, string> = {
  high: 'bg-red-50 text-red-600 border border-red-100',
  medium: 'bg-amber-50 text-amber-600 border border-amber-100',
  low: 'bg-green-50 text-green-600 border border-green-100',
};

const statusBadge: Record<TaskStatus, string> = {
  todo: 'bg-gray-50 text-gray-600 border border-gray-200',
  in_progress: 'bg-blue-50 text-blue-700 border border-blue-100',
  completed: 'bg-green-50 text-green-700 border border-green-100',
  overdue: 'bg-red-50 text-red-700 border border-red-100',
};

const statusIcon: Record<TaskStatus, React.ReactNode> = {
  todo: <Clock size={13} className="text-gray-400" />,
  in_progress: <Clock size={13} className="text-blue-500" />,
  completed: <Check size={13} className="text-green-500" />,
  overdue: <AlertCircle size={13} className="text-red-500" />,
};

const kanbanColumns: { id: TaskStatus; label: string; color: string; headerBg: string; dot: string }[] = [
  { id: 'todo', label: 'To Do', color: 'border-t-gray-300', headerBg: 'bg-gray-50', dot: 'bg-gray-400' },
  { id: 'in_progress', label: 'In Progress', color: 'border-t-blue-500', headerBg: 'bg-blue-50', dot: 'bg-blue-500' },
  { id: 'overdue', label: 'Overdue', color: 'border-t-red-400', headerBg: 'bg-red-50', dot: 'bg-red-400' },
  { id: 'completed', label: 'Completed', color: 'border-t-green-500', headerBg: 'bg-green-50', dot: 'bg-green-500' },
];

interface NewTaskForm {
  title: string;
  description: string;
  assignee: string;
  priority: Priority;
  status: TaskStatus;
  project: string;
  dueDate: string;
  tags: string;
}

function KanbanCard({ task, onStatusChange, onClick }: {
  task: Task;
  onStatusChange: (id: number, s: TaskStatus) => void;
  onClick: () => void;
}) {
  const nextStatus: Record<TaskStatus, TaskStatus | null> = {
    todo: 'in_progress',
    in_progress: 'completed',
    overdue: 'in_progress',
    completed: null,
  };
  const next = nextStatus[task.status];

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-100 p-3.5 hover:shadow-md hover:border-blue-100 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <p className="text-sm font-semibold text-gray-900 leading-snug flex-1">{task.title}</p>
        <button className="text-gray-200 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" onClick={(e) => e.stopPropagation()}>
          <MoreHorizontal size={15} />
        </button>
      </div>

      <p className="text-xs text-gray-400 mb-3 line-clamp-2 leading-relaxed">{task.description}</p>

      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${priorityBadge[task.priority]}`}>
          {task.priority}
        </span>
        {task.tags.slice(0, 1).map(tag => (
          <span key={tag} className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">{tag}</span>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Progress</span>
          <span className="font-semibold">{task.progress}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${task.status === 'completed' ? 'bg-green-500' : task.status === 'overdue' ? 'bg-red-400' : 'bg-blue-500'}`}
            style={{ width: `${task.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
            {task.assigneeAvatar}
          </div>
          <span className="text-xs text-gray-500">{task.assignee.split(' ')[0]}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar size={11} className="text-gray-300" />
          <span className="text-xs text-gray-400">{task.dueDate.slice(5)}</span>
          {next && (
            <button
              onClick={(e) => { e.stopPropagation(); onStatusChange(task.id, next); }}
              className="ml-1 p-1 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              title={`Move to ${taskStatusLabels[next]}`}
            >
              <ArrowRight size={11} className="text-blue-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [form, setForm] = useState<NewTaskForm>({
    title: '', description: '', assignee: '', priority: 'medium',
    status: 'todo', project: '', dueDate: '', tags: ''
  });

  const filtered = tasks.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.assignee.toLowerCase().includes(search.toLowerCase()) ||
      t.project.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchPriority = filterPriority === 'all' || t.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    const newTask: Task = {
      id: tasks.length + 1,
      title: form.title,
      description: form.description,
      assignee: form.assignee || 'Unassigned',
      assigneeAvatar: form.assignee ? form.assignee.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'UN',
      priority: form.priority,
      status: form.status,
      project: form.project || 'General',
      dueDate: form.dueDate || '2026-04-30',
      createdAt: new Date().toISOString().split('T')[0],
      progress: form.status === 'completed' ? 100 : form.status === 'in_progress' ? 30 : 0,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    setTasks([newTask, ...tasks]);
    setShowModal(false);
    setForm({ title: '', description: '', assignee: '', priority: 'medium', status: 'todo', project: '', dueDate: '', tags: '' });
  };

  const handleStatusChange = (taskId: number, newStatus: TaskStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? {
      ...t, status: newStatus,
      progress: newStatus === 'completed' ? 100 : newStatus === 'in_progress' ? Math.max(t.progress, 10) : t.progress
    } : t));
    if (selectedTask?.id === taskId) {
      setSelectedTask(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const statusCounts = {
    all: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.status === 'overdue').length,
  };

  return (
    <DashboardLayout title="Tasks" subtitle="Manage and track all your team tasks">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {(['all', 'todo', 'in_progress', 'completed', 'overdue'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filterStatus === s ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className="capitalize">{s === 'all' ? 'All Tasks' : taskStatusLabels[s]}</span>
              <span className={`text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold ${
                filterStatus === s ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {statusCounts[s]}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <LayoutList size={15} />
              List
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === 'kanban' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Kanban size={15} />
              Board
            </button>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
          >
            <Plus size={16} />
            Assign Task
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks, assignees, projects..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50 focus:bg-white transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-gray-400" />
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as Priority | 'all')}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-blue-400 text-gray-600"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <p className="text-xs text-gray-400 ml-auto">{filtered.length} task{filtered.length !== 1 ? 's' : ''} found</p>
      </div>

      {/* ── KANBAN VIEW ── */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kanbanColumns.map((col) => {
            const colTasks = filtered.filter(t => t.status === col.id);
            return (
              <div key={col.id} className="flex flex-col min-h-96">
                {/* Column Header */}
                <div className={`${col.headerBg} rounded-t-2xl border border-b-0 border-gray-100 px-4 py-3 flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`}></span>
                    <span className="text-sm font-bold text-gray-800">{col.label}</span>
                    <span className="text-xs bg-white/70 text-gray-600 font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {colTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => { setForm(f => ({ ...f, status: col.id })); setShowModal(true); }}
                    className="w-6 h-6 rounded-lg bg-white/70 hover:bg-white flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Cards */}
                <div className="flex-1 border border-gray-100 rounded-b-2xl bg-gray-50/50 p-3 space-y-3">
                  {colTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mb-2">
                        <GripVertical size={16} className="text-gray-300" />
                      </div>
                      <p className="text-xs text-gray-400">No tasks here</p>
                    </div>
                  ) : (
                    colTasks.map(task => (
                      <KanbanCard
                        key={task.id}
                        task={task}
                        onStatusChange={handleStatusChange}
                        onClick={() => setSelectedTask(task)}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── LIST VIEW ── */}
      {viewMode === 'list' && (
        filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">No tasks found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-3 px-5 font-semibold uppercase tracking-wider">Task</th>
                  <th className="text-left py-3 px-4 font-semibold uppercase tracking-wider">Assignee</th>
                  <th className="text-left py-3 px-4 font-semibold uppercase tracking-wider">Project</th>
                  <th className="text-left py-3 px-4 font-semibold uppercase tracking-wider">Priority</th>
                  <th className="text-left py-3 px-4 font-semibold uppercase tracking-wider">Due Date</th>
                  <th className="text-left py-3 px-4 font-semibold uppercase tracking-wider">Progress</th>
                  <th className="text-left py-3 px-4 font-semibold uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((task) => (
                  <tr
                    key={task.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-blue-50/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedTask(task)}
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5">{statusIcon[task.status]}</div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{task.title}</p>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            {task.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {task.assigneeAvatar}
                        </div>
                        <span className="text-sm text-gray-600 hidden xl:block">{task.assignee}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">{task.project}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${priorityBadge[task.priority]}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">{task.dueDate}</td>
                    <td className="py-4 px-4 w-28">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${task.status === 'completed' ? 'bg-green-500' : task.status === 'overdue' ? 'bg-red-400' : 'bg-blue-500'}`}
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-400 w-7 shrink-0 text-right">{task.progress}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300 ${statusBadge[task.status]}`}
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </td>
                    <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                      <button className="text-gray-300 hover:text-gray-600 transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* ── TASK DETAIL MODAL ── */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedTask(null)}>
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${priorityBadge[selectedTask.priority]}`}>
                      {selectedTask.priority} priority
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge[selectedTask.status]}`}>
                      {taskStatusLabels[selectedTask.status]}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">{selectedTask.title}</h3>
                </div>
                <button onClick={() => setSelectedTask(null)} className="text-gray-400 hover:text-gray-600 w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <p className="text-sm text-gray-600 leading-relaxed">{selectedTask.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2.5">
                  <User size={15} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Assignee</p>
                    <p className="text-sm font-semibold text-gray-700">{selectedTask.assignee}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar size={15} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Due Date</p>
                    <p className="text-sm font-semibold text-gray-700">{selectedTask.dueDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Tag size={15} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Project</p>
                    <p className="text-sm font-semibold text-gray-700">{selectedTask.project}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock size={15} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Created</p>
                    <p className="text-sm font-semibold text-gray-700">{selectedTask.createdAt}</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold text-gray-700">Progress</p>
                  <p className="text-sm font-bold text-blue-600">{selectedTask.progress}%</p>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${selectedTask.progress}%` }}></div>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {selectedTask.tags.map((tag) => (
                  <span key={tag} className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full font-medium">{tag}</span>
                ))}
              </div>
              {/* Quick status change */}
              <div>
                <p className="text-xs text-gray-400 mb-2">Change Status</p>
                <div className="flex gap-2 flex-wrap">
                  {(['todo', 'in_progress', 'completed', 'overdue'] as TaskStatus[]).map(s => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(selectedTask.id, s)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        selectedTask.status === s
                          ? 'bg-blue-600 text-white'
                          : `${statusBadge[s]} hover:opacity-80`
                      }`}
                    >
                      {taskStatusLabels[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE TASK MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Assign New Task</h3>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Task Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Enter task title"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 bg-gray-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the task..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 bg-gray-50 focus:bg-white resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Assignee</label>
                  <select
                    value={form.assignee}
                    onChange={(e) => setForm({ ...form, assignee: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 bg-gray-50"
                  >
                    <option value="">Select member</option>
                    {teamMembers.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 bg-gray-50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Initial Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 bg-gray-50"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Project</label>
                  <input
                    value={form.project}
                    onChange={(e) => setForm({ ...form, project: e.target.value })}
                    placeholder="Project name"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 bg-gray-50"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Due Date</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 bg-gray-50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tags (comma separated)</label>
                <input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="Design, Frontend, Backend..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 bg-gray-50"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleSubmit} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">
                Assign Task
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
