'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { tasks, projects, teamMembers, monthlyData } from '@/lib/data';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

const tasksByPriority = [
  { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#ef4444' },
  { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#f59e0b' },
  { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#10b981' },
];

const tasksByStatus = [
  { name: 'To Do', value: tasks.filter(t => t.status === 'todo').length, color: '#94a3b8' },
  { name: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length, color: '#3b82f6' },
  { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length, color: '#10b981' },
  { name: 'Overdue', value: tasks.filter(t => t.status === 'overdue').length, color: '#ef4444' },
];

const projectProgress = projects.map(p => ({
  name: p.name.length > 12 ? p.name.slice(0, 12) + '...' : p.name,
  progress: p.progress,
  target: 100,
}));

const teamPerformance = teamMembers.map(m => ({
  name: m.name.split(' ')[0],
  active: m.activeWork,
  overdue: m.overdue,
  completed: Math.floor(Math.random() * 15) + 5,
}));

const weeklyTrend = [
  { week: 'W1', tasks: 12, completed: 8, hours: 42 },
  { week: 'W2', tasks: 18, completed: 14, hours: 56 },
  { week: 'W3', tasks: 15, completed: 11, hours: 48 },
  { week: 'W4', tasks: 22, completed: 19, hours: 64 },
  { week: 'W5', tasks: 20, completed: 16, hours: 60 },
  { week: 'W6', tasks: 25, completed: 22, hours: 72 },
];

const kpis = [
  { label: 'Task Completion Rate', value: '83%', change: '+5%', up: true, desc: 'vs last month' },
  { label: 'On-Time Delivery', value: '91%', change: '+3%', up: true, desc: 'vs last month' },
  { label: 'Avg. Task Duration', value: '2.4d', change: '-0.3d', up: true, desc: 'faster than avg' },
  { label: 'Team Utilization', value: '82%', change: '+6%', up: true, desc: 'vs last week' },
  { label: 'Overdue Rate', value: '9%', change: '-2%', up: true, desc: 'improvement' },
  { label: 'Active Projects', value: '5', change: '+1', up: true, desc: 'new this month' },
];

export default function AnalyticsPage() {
  return (
    <DashboardLayout title="Analytics" subtitle="Track performance, trends and team productivity">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
            <p className="text-xs text-gray-400 mb-2 leading-tight">{kpi.label}</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</p>
            <div className={`flex items-center gap-1 text-xs font-semibold ${kpi.up ? 'text-green-600' : 'text-red-500'}`}>
              {kpi.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{kpi.change}</span>
              <span className="text-gray-400 font-normal">{kpi.desc}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Monthly Task Activity */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-semibold text-gray-900 text-sm">Monthly Task Activity</p>
              <p className="text-xs text-gray-400">Tasks created vs completed over 6 months</p>
            </div>
            <ArrowUpRight size={16} className="text-gray-300" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dbeafe" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#dbeafe" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              <Area type="monotone" dataKey="created" stroke="#93c5fd" fill="url(#colorCreated)" strokeWidth={2} name="Created" />
              <Area type="monotone" dataKey="completed" stroke="#2563eb" fill="url(#colorCompleted)" strokeWidth={2} name="Completed" />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Trend */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-semibold text-gray-900 text-sm">Weekly Performance Trend</p>
              <p className="text-xs text-gray-400">Task completion trend over 6 weeks</p>
            </div>
            <ArrowUpRight size={16} className="text-gray-300" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weeklyTrend}>
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              <Line type="monotone" dataKey="tasks" stroke="#93c5fd" strokeWidth={2} dot={{ fill: '#93c5fd', r: 4 }} name="Created" />
              <Line type="monotone" dataKey="completed" stroke="#2563eb" strokeWidth={2} dot={{ fill: '#2563eb', r: 4 }} name="Completed" />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Task by Status Donut */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <p className="font-semibold text-gray-900 text-sm mb-1">Tasks by Status</p>
          <p className="text-xs text-gray-400 mb-4">Current distribution</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={tasksByStatus}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {tasksByStatus.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${Number(v)} tasks`]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {tasksByStatus.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></div>
                  <span className="text-xs text-gray-500">{d.name}</span>
                </div>
                <span className="text-xs font-bold text-gray-700">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks by Priority */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <p className="font-semibold text-gray-900 text-sm mb-1">Tasks by Priority</p>
          <p className="text-xs text-gray-400 mb-4">Priority breakdown</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={tasksByPriority}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {tasksByPriority.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${Number(v)} tasks`]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {tasksByPriority.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></div>
                  <span className="text-xs text-gray-500">{d.name} Priority</span>
                </div>
                <span className="text-xs font-bold text-gray-700">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Project Progress */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <p className="font-semibold text-gray-900 text-sm mb-1">Project Progress</p>
          <p className="text-xs text-gray-400 mb-4">Completion status</p>
          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600 font-medium truncate max-w-32">{p.name}</span>
                  <span className="text-xs font-bold text-gray-700 ml-2">{p.progress}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full">
                  <div
                    className={`h-full rounded-full ${p.status === 'at_risk' ? 'bg-amber-400' : p.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${p.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Performance */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-semibold text-gray-900 text-sm">Team Performance Overview</p>
            <p className="text-xs text-gray-400">Active vs overdue tasks per team member</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={teamPerformance} barSize={12} barGap={3}>
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
            <Bar dataKey="active" fill="#dbeafe" radius={[4, 4, 0, 0]} name="Active" />
            <Bar dataKey="completed" fill="#2563eb" radius={[4, 4, 0, 0]} name="Completed" />
            <Bar dataKey="overdue" fill="#fca5a5" radius={[4, 4, 0, 0]} name="Overdue" />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardLayout>
  );
}
