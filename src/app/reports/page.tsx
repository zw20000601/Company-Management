'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { tasks, projects, teamMembers, monthlyData } from '@/lib/data';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { Download, FileText, TrendingUp, Users, CheckSquare, AlertTriangle } from 'lucide-react';

const completedTasks = tasks.filter(t => t.status === 'completed').length;
const overdueCount = tasks.filter(t => t.status === 'overdue').length;
const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;

const deptData = [
  { dept: 'Engineering', tasks: 18, completed: 14 },
  { dept: 'Design', tasks: 8, completed: 5 },
  { dept: 'Product', tasks: 12, completed: 9 },
  { dept: 'QA', tasks: 10, completed: 6 },
  { dept: 'Analytics', tasks: 6, completed: 5 },
  { dept: 'DevOps', tasks: 5, completed: 5 },
];

export default function ReportsPage() {
  const handleExport = (type: string) => {
    alert(`Exporting ${type} report... (This would generate a real file in production)`);
  };

  return (
    <DashboardLayout title="Reports" subtitle="Generate and view comprehensive performance reports">
      {/* Report Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { icon: FileText, label: 'Task Report', desc: 'All tasks summary', color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: Users, label: 'Team Report', desc: 'Workload analysis', color: 'text-purple-600', bg: 'bg-purple-50' },
          { icon: TrendingUp, label: 'Progress Report', desc: 'Monthly trends', color: 'text-green-600', bg: 'bg-green-50' },
          { icon: AlertTriangle, label: 'Risk Report', desc: 'At-risk projects', color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((r) => {
          const Icon = r.icon;
          return (
            <button
              key={r.label}
              onClick={() => handleExport(r.label)}
              className="bg-white rounded-2xl p-5 border border-gray-100 text-left hover:shadow-md hover:border-blue-100 transition-all group"
            >
              <div className={`w-10 h-10 ${r.bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon size={18} className={r.color} />
              </div>
              <p className="font-semibold text-gray-900 text-sm mb-0.5">{r.label}</p>
              <p className="text-xs text-gray-400 mb-3">{r.desc}</p>
              <div className="flex items-center gap-1 text-blue-600 text-xs font-semibold group-hover:gap-2 transition-all">
                <Download size={13} />
                Export PDF
              </div>
            </button>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Tasks', value: tasks.length, color: 'text-gray-900' },
          { label: 'Completed', value: completedTasks, color: 'text-green-600' },
          { label: 'In Progress', value: inProgressCount, color: 'text-blue-600' },
          { label: 'Overdue', value: overdueCount, color: 'text-red-500' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
            <p className={`text-3xl font-bold mb-1 ${s.color}`}>{s.value}</p>
            <p className="text-sm text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Monthly Chart */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-gray-900 text-sm">Monthly Summary</p>
              <p className="text-xs text-gray-400">Task creation vs completion trend</p>
            </div>
            <button onClick={() => handleExport('Monthly')} className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline">
              <Download size={13} />
              Export
            </button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="repGradCreated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dbeafe" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#dbeafe" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="repGradCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              <Area type="monotone" dataKey="created" stroke="#93c5fd" fill="url(#repGradCreated)" strokeWidth={2} name="Created" />
              <Area type="monotone" dataKey="completed" stroke="#2563eb" fill="url(#repGradCompleted)" strokeWidth={2} name="Completed" />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Department Performance */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-gray-900 text-sm">Department Performance</p>
              <p className="text-xs text-gray-400">Tasks assigned vs completed by dept</p>
            </div>
            <button onClick={() => handleExport('Department')} className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline">
              <Download size={13} />
              Export
            </button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deptData} barSize={12} barGap={4}>
              <XAxis dataKey="dept" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              <Bar dataKey="tasks" fill="#dbeafe" radius={[4, 4, 0, 0]} name="Assigned" />
              <Bar dataKey="completed" fill="#2563eb" radius={[4, 4, 0, 0]} name="Completed" />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Task Report Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900 text-sm">Detailed Task Report</p>
            <p className="text-xs text-gray-400">Complete task performance overview</p>
          </div>
          <button onClick={() => handleExport('Full Task')} className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors">
            <Download size={15} />
            Export Full Report
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-5 font-semibold uppercase tracking-wider">Task</th>
                <th className="text-left py-3 px-4 font-semibold uppercase tracking-wider">Assignee</th>
                <th className="text-left py-3 px-4 font-semibold uppercase tracking-wider">Project</th>
                <th className="text-left py-3 px-4 font-semibold uppercase tracking-wider">Priority</th>
                <th className="text-left py-3 px-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 font-semibold uppercase tracking-wider">Progress</th>
                <th className="text-left py-3 px-4 font-semibold uppercase tracking-wider">Due</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-5 text-sm font-medium text-gray-900">{task.title}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                        {task.assigneeAvatar}
                      </div>
                      <span className="text-sm text-gray-600 hidden lg:block">{task.assignee}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">{task.project}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                      task.priority === 'high' ? 'bg-red-50 text-red-600' :
                      task.priority === 'medium' ? 'bg-amber-50 text-amber-600' :
                      'bg-green-50 text-green-600'
                    }`}>{task.priority}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                      task.status === 'completed' ? 'bg-green-50 text-green-700' :
                      task.status === 'in_progress' ? 'bg-blue-50 text-blue-700' :
                      task.status === 'overdue' ? 'bg-red-50 text-red-700' :
                      'bg-gray-50 text-gray-600'
                    }`}>{task.status.replace('_', ' ')}</span>
                  </td>
                  <td className="py-3 px-4 w-28">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                        <div className={`h-full rounded-full ${task.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{ width: `${task.progress}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-400 w-7">{task.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">{task.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
