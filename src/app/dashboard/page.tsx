'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { teamMembers, tasks, projects, statusColors, statusLabels, monthlyData } from '@/lib/data';
import { MoreHorizontal, TrendingUp, AlertTriangle, CheckCircle2, Clock, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const taskStatusData = [
  { name: 'In Progress', value: 67, color: '#3b82f6' },
  { name: 'Completed', value: 24, color: '#10b981' },
  { name: 'Overdue', value: 9, color: '#f59e0b' },
];

const priorityData = [
  { name: 'High Priority', value: 40, color: '#1e3a5f' },
  { name: 'Medium Priority', value: 26, color: '#3b82f6' },
  { name: 'Low Priority', value: 18, color: '#bfdbfe' },
];

const WEEK_HOURS = [
  { time: '08:00', Sat: 0, Sun: 0, Mon: 3, Tue: 4, Wed: 2, Thu: 3, Fri: 1 },
  { time: '08:30', Sat: 0, Sun: 0, Mon: 4, Tue: 5, Wed: 3, Thu: 4, Fri: 2 },
  { time: '09:00', Sat: 1, Sun: 1, Mon: 5, Tue: 6, Wed: 4, Thu: 5, Fri: 3 },
  { time: '09:30', Sat: 2, Sun: 1, Mon: 6, Tue: 7, Wed: 5, Thu: 6, Fri: 4 },
  { time: '10:00', Sat: 3, Sun: 2, Mon: 5, Tue: 6, Wed: 4, Thu: 5, Fri: 3 },
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

export default function DashboardPage() {
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const overdue = tasks.filter(t => t.status === 'overdue').length;
  const atRisk = projects.filter(p => p.status === 'at_risk').length;

  return (
    <DashboardLayout title="Welcome back, Alex! 👋" subtitle="Here's what's happening with your team today">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Active Projects', value: projects.filter(p => p.status === 'active').length, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Utilization Rate', value: '82%', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Average Time', value: '2.4 Days', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'At Risk Projects', value: atRisk, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <Icon size={18} className={stat.color} />
                </div>
                <MoreHorizontal size={16} className="text-gray-300" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Task Status Distribution */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-semibold text-gray-900 text-sm">Task Status Distribution</p>
            </div>
            <MoreHorizontal size={16} className="text-gray-300 cursor-pointer" />
          </div>
          <div className="space-y-4">
            {[
              { label: 'In Progress', value: inProgress, total: tasks.length, color: 'bg-blue-500', pct: `${Math.round(inProgress/tasks.length*100)}%` },
              { label: 'Completed', value: completed, total: tasks.length, color: 'bg-green-500', pct: `${Math.round(completed/tasks.length*100)}%` },
              { label: 'Overdue', value: overdue, total: tasks.length, color: 'bg-amber-400', pct: `${Math.round(overdue/tasks.length*100)}%` },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color}`}></div>
                    <span className="text-sm text-gray-600">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{item.pct}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className={`h-full rounded-full ${item.color} transition-all`} style={{ width: item.pct }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Priority Pie */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold text-gray-900 text-sm">Task Priority</p>
              <p className="text-xs text-gray-400">Distribution by priority level</p>
            </div>
            <MoreHorizontal size={16} className="text-gray-300 cursor-pointer" />
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={65}
                paddingAngle={3}
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${Number(v)} tasks`]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-between text-xs mt-1">
            {priorityData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                <span className="text-gray-500">{d.name}: <span className="font-semibold text-gray-700">{d.value}</span></span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Chart */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold text-gray-900 text-sm">Task Activity</p>
              <p className="text-xs text-gray-400">Created vs Completed</p>
            </div>
            <MoreHorizontal size={16} className="text-gray-300 cursor-pointer" />
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={monthlyData} barSize={6} barGap={2}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }}
              />
              <Bar dataKey="created" fill="#dbeafe" radius={3} name="Created" />
              <Bar dataKey="completed" fill="#2563eb" radius={3} name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Team Activity */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="font-semibold text-gray-900 text-sm">Team Activity</p>
              <p className="text-xs text-gray-400">Understand your team productivity and workload.</p>
            </div>
            <MoreHorizontal size={16} className="text-gray-300 cursor-pointer" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-bold text-gray-900">63%</span>
            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-semibold">
              <TrendingUp size={12} />
              6% vs last week
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, di) => (
              <div key={day} className="space-y-1">
                {[9, 8, 7, 6, 5, 4, 3, 2, 1].map((intensity, i) => {
                  const intensity_val = [
                    [0, 0, 3, 4, 2, 3, 1],
                    [0, 0, 4, 5, 3, 4, 2],
                    [1, 1, 5, 6, 4, 5, 3],
                    [2, 1, 6, 7, 5, 6, 4],
                    [3, 2, 5, 6, 4, 5, 3],
                    [0, 0, 4, 5, 3, 4, 2],
                    [2, 1, 3, 4, 2, 3, 1],
                    [1, 0, 2, 3, 1, 2, 0],
                    [0, 0, 1, 2, 0, 1, 0],
                  ][i][di];
                  const opacity = intensity_val === 0 ? 'bg-gray-100' : intensity_val <= 2 ? 'bg-blue-200' : intensity_val <= 4 ? 'bg-blue-400' : 'bg-blue-600';
                  return <div key={i} className={`h-5 rounded-md ${opacity}`}></div>;
                })}
                <p className="text-center text-xs text-gray-400">{day}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Workload */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-gray-900 text-sm">Team Workload</p>
            </div>
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
                <tr key={member.id} className="border-b border-gray-50 last:border-0">
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
                  <td className="py-3 text-center text-sm text-gray-700 font-medium">{member.overdue}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusBgColor[member.status]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDotColor[member.status]}`}></span>
                      {statusLabels[member.status]}
                    </span>
                  </td>
                  <td className="py-3">
                    <button className="text-gray-300 hover:text-gray-500">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                <th className="text-left pb-3 font-medium">Task</th>
                <th className="text-left pb-3 font-medium">Assignee</th>
                <th className="text-left pb-3 font-medium">Priority</th>
                <th className="text-left pb-3 font-medium">Due Date</th>
                <th className="text-left pb-3 font-medium">Progress</th>
                <th className="text-left pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.slice(0, 6).map((task) => {
                const statusStyle: Record<string, string> = {
                  in_progress: 'bg-blue-50 text-blue-700',
                  completed: 'bg-green-50 text-green-700',
                  overdue: 'bg-red-50 text-red-700',
                  todo: 'bg-gray-50 text-gray-600',
                };
                const priorityStyle: Record<string, string> = {
                  high: 'bg-red-50 text-red-600',
                  medium: 'bg-amber-50 text-amber-600',
                  low: 'bg-green-50 text-green-600',
                };
                return (
                  <tr key={task.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{task.title}</p>
                        <p className="text-xs text-gray-400">{task.project}</p>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                          {task.assigneeAvatar}
                        </div>
                        <span className="text-sm text-gray-600 hidden lg:block">{task.assignee.split(' ')[0]}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${priorityStyle[task.priority]}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-500">{task.dueDate}</td>
                    <td className="py-3 w-28">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${task.progress}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-400 w-7 text-right">{task.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusStyle[task.status]}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
