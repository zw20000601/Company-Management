'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { teamMembers, projects, statusLabels, monthlyData } from '@/lib/data';
import { useTasks } from '@/lib/TaskContext';
import {
  MoreHorizontal, TrendingUp, AlertTriangle, CheckCircle2, Clock,
  ArrowUpRight, Plus, Eye, Download, RefreshCw, Calendar,
  ChevronRight, Zap
} from 'lucide-react';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';

const priorityData = [
  { name: 'High Priority', value: 40, color: '#1e3a5f' },
  { name: 'Medium Priority', value: 26, color: '#3b82f6' },
  { name: 'Low Priority', value: 18, color: '#bfdbfe' },
];

const statusDotColor: Record<string, string> = {
  on_track: 'bg-green-500',
  under_pressure: 'bg-amber-500',
  sustained: 'bg-blue-500',
  overloaded: 'bg-red-500',
  balanced: 'bg-purple-500',
};

const statusBgColor: Record<string, string> = {
  on_track: 'bg-green-50 text-green-700',
  under_pressure: 'bg-amber-50 text-amber-700',
  sustained: 'bg-blue-50 text-blue-700',
  overloaded: 'bg-red-50 text-red-700',
  balanced: 'bg-purple-50 text-purple-700',
};

function CardMenu({ items }: { items: { label: string; icon?: React.ReactNode; danger?: boolean }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="text-gray-300 hover:text-gray-500 transition-colors p-1 rounded-lg hover:bg-gray-100"
      >
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-1 overflow-hidden">
            {items.map((item) => (
              <button
                key={item.label}
                onClick={() => setOpen(false)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium hover:bg-gray-50 transition-colors text-left ${
                  item.danger ? 'text-red-500' : 'text-gray-600'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { tasks } = useTasks();
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const overdue = tasks.filter(t => t.status === 'overdue').length;
  const atRisk = projects.filter(p => p.status === 'at_risk').length;
  const activeProjects = projects.filter(p => p.status === 'active').length;

  const menuItems = [
    { label: 'View Details', icon: <Eye size={12} /> },
    { label: 'Change Date Range', icon: <Calendar size={12} /> },
    { label: 'Export', icon: <Download size={12} /> },
    { label: 'Refresh', icon: <RefreshCw size={12} /> },
  ];

  return (
    <DashboardLayout title="Welcome back, Alex! 👋" subtitle="Here's what's happening with your team today">

      {/* Quick Action Bar */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <Link href="/tasks" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-100">
          <Plus size={15} />
          New Task
        </Link>
        <Link href="/projects" className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
          <FolderIcon />
          New Project
        </Link>
        <Link href="/team" className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
          <TeamIcon />
          Invite Member
        </Link>
        <Link href="/analytics" className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors ml-auto">
          <ArrowUpRight size={15} />
          Full Analytics
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          {
            label: 'Active Projects', value: activeProjects, icon: TrendingUp,
            color: 'text-blue-600', bg: 'bg-blue-50', change: '+2 this month', changeUp: true,
          },
          {
            label: 'Utilization Rate', value: '82%', icon: CheckCircle2,
            color: 'text-green-600', bg: 'bg-green-50', change: '+6% vs last week', changeUp: true,
          },
          {
            label: 'Average Time', value: '2.4d', icon: Clock,
            color: 'text-purple-600', bg: 'bg-purple-50', change: '-0.3d faster', changeUp: true,
          },
          {
            label: 'At Risk Projects', value: atRisk, icon: AlertTriangle,
            color: 'text-amber-600', bg: 'bg-amber-50', change: 'Needs attention', changeUp: false,
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md hover:border-blue-50 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon size={18} className={stat.color} />
                </div>
                <CardMenu items={menuItems} />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-0.5">{stat.value}</p>
              <p className="text-xs text-gray-400 mb-2">{stat.label}</p>
              <div className={`flex items-center gap-1 text-xs font-semibold ${stat.changeUp ? 'text-green-600' : 'text-amber-500'}`}>
                <TrendingUp size={11} />
                {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Task Status */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <p className="font-semibold text-gray-900 text-sm">Task Status Distribution</p>
            <CardMenu items={menuItems} />
          </div>
          <div className="space-y-4">
            {[
              { label: 'In Progress', value: inProgress, total: tasks.length, color: 'bg-blue-500', pct: Math.round(inProgress / tasks.length * 100) },
              { label: 'Completed', value: completed, total: tasks.length, color: 'bg-green-500', pct: Math.round(completed / tasks.length * 100) },
              { label: 'Overdue', value: overdue, total: tasks.length, color: 'bg-amber-400', pct: Math.round(overdue / tasks.length * 100) },
              { label: 'To Do', value: tasks.filter(t => t.status === 'todo').length, total: tasks.length, color: 'bg-gray-300', pct: Math.round(tasks.filter(t => t.status === 'todo').length / tasks.length * 100) },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color}`}></div>
                    <span className="text-sm text-gray-600">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{item.value} tasks</span>
                    <span className="text-sm font-bold text-gray-900 w-8 text-right">{item.pct}%</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.color} transition-all duration-700`} style={{ width: `${item.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/tasks" className="flex items-center gap-1 text-xs text-blue-600 font-semibold mt-4 hover:underline">
            View all tasks <ChevronRight size={12} />
          </Link>
        </div>

        {/* Task Priority Pie */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="font-semibold text-gray-900 text-sm">Task Priority</p>
              <p className="text-xs text-gray-400">Distribution by priority level</p>
            </div>
            <CardMenu items={menuItems} />
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={68}
                paddingAngle={3}
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${Number(v)} tasks`]} contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-1">
            {priorityData.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></div>
                  <span className="text-xs text-gray-500">{d.name}</span>
                </div>
                <span className="text-xs font-bold text-gray-700">{d.value} tasks</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Activity */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold text-gray-900 text-sm">Task Activity</p>
              <p className="text-xs text-gray-400">Created vs Completed (6 months)</p>
            </div>
            <CardMenu items={menuItems} />
          </div>
          <ResponsiveContainer width="100%" height={185}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="dashCreated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dbeafe" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#dbeafe" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="dashCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              <Area type="monotone" dataKey="created" stroke="#93c5fd" fill="url(#dashCreated)" strokeWidth={2} name="Created" />
              <Area type="monotone" dataKey="completed" stroke="#2563eb" fill="url(#dashCompleted)" strokeWidth={2} name="Completed" />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Team Activity Heatmap */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="font-semibold text-gray-900 text-sm">Team Activity</p>
              <p className="text-xs text-gray-400">Understand your team productivity and workload.</p>
            </div>
            <CardMenu items={menuItems} />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-bold text-gray-900">63%</span>
            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-xs font-semibold">
              <TrendingUp size={12} />
              6% vs last week
            </div>
            <span className="text-xs text-gray-400 ml-auto">This week</span>
          </div>
          {/* Heatmap */}
          <div className="grid grid-cols-7 gap-1.5">
            {['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, di) => (
              <div key={day} className="space-y-1.5">
                {[
                  [0, 0, 3, 4, 2, 3, 1],
                  [0, 0, 4, 5, 3, 4, 2],
                  [1, 1, 5, 6, 4, 5, 3],
                  [2, 1, 6, 7, 5, 6, 4],
                  [3, 2, 5, 6, 4, 5, 3],
                  [0, 0, 4, 5, 3, 4, 2],
                  [2, 1, 3, 4, 2, 3, 1],
                  [1, 0, 2, 3, 1, 2, 0],
                  [0, 0, 1, 2, 0, 1, 0],
                ].map((row, ri) => {
                  const val = row[di];
                  const cls = val === 0 ? 'bg-gray-100' : val <= 2 ? 'bg-blue-200' : val <= 4 ? 'bg-blue-400' : 'bg-blue-600';
                  return (
                    <div key={ri} className={`h-5 rounded-md ${cls} hover:opacity-80 transition-opacity cursor-default`} title={`${val} tasks`}></div>
                  );
                })}
                <p className="text-center text-xs text-gray-400">{day}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3 justify-end">
            <span className="text-xs text-gray-400">Less</span>
            {['bg-gray-100', 'bg-blue-200', 'bg-blue-400', 'bg-blue-600'].map((c) => (
              <div key={c} className={`w-3 h-3 rounded-sm ${c}`}></div>
            ))}
            <span className="text-xs text-gray-400">More</span>
          </div>
        </div>

        {/* Team Workload */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-gray-900 text-sm">Team Workload</p>
            <Link href="/team" className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:underline">
              See All <ArrowUpRight size={13} />
            </Link>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-50">
                <th className="text-left pb-3 font-medium">Name</th>
                <th className="text-center pb-3 font-medium">Active</th>
                <th className="text-center pb-3 font-medium">Overdue</th>
                <th className="text-left pb-3 font-medium">Status</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.slice(0, 5).map((member) => (
                <tr key={member.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {member.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 leading-tight">{member.name}</p>
                        <p className="text-xs text-gray-400">{member.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-center text-sm text-gray-700 font-medium">{member.activeWork}</td>
                  <td className="py-3 text-center">
                    <span className={`text-sm font-bold ${member.overdue > 3 ? 'text-red-500' : 'text-gray-700'}`}>{member.overdue}</span>
                  </td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusBgColor[member.status]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDotColor[member.status]}`}></span>
                      {statusLabels[member.status]}
                    </span>
                  </td>
                  <td className="py-3">
                    <CardMenu items={menuItems} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Overview & Recent Tasks side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Active Projects Mini */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-gray-900 text-sm">Active Projects</p>
            <Link href="/projects" className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:underline">
              See All <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="space-y-3">
            {projects.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-blue-50/50 transition-colors">
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  p.status === 'at_risk' ? 'bg-amber-400' :
                  p.status === 'active' ? 'bg-blue-500' : 'bg-green-500'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                    <span className="text-xs font-bold text-gray-500 ml-2 shrink-0">{p.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${p.status === 'at_risk' ? 'bg-amber-400' : 'bg-blue-500'}`}
                      style={{ width: `${p.progress}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{p.dueDate.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-gray-900 text-sm">Recent Tasks</p>
            <Link href="/tasks" className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:underline">
              See All <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="space-y-2.5">
            {tasks.slice(0, 5).map((task) => {
              const statusStyle: Record<string, string> = {
                in_progress: 'bg-blue-50 text-blue-700',
                completed: 'bg-green-50 text-green-700',
                overdue: 'bg-red-50 text-red-700',
                todo: 'bg-gray-50 text-gray-600',
              };
              return (
                <div key={task.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className={`w-1.5 h-8 rounded-full shrink-0 ${
                    task.priority === 'high' ? 'bg-red-400' :
                    task.priority === 'medium' ? 'bg-amber-400' : 'bg-green-400'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{task.title}</p>
                    <p className="text-xs text-gray-400">{task.assignee} · {task.dueDate}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize shrink-0 ${statusStyle[task.status]}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function FolderIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function TeamIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
