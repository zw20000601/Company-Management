'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { teamMembers, statusLabels, tasks } from '@/lib/data';
import {
  Search, Plus, MoreHorizontal, Mail, Briefcase,
  CheckCircle2, AlertCircle, Clock, X
} from 'lucide-react';

const statusBgColor: Record<string, string> = {
  on_track: 'bg-green-50 text-green-700',
  under_pressure: 'bg-amber-50 text-amber-700',
  sustained: 'bg-blue-50 text-blue-700',
  overloaded: 'bg-red-50 text-red-700',
  balanced: 'bg-purple-50 text-purple-700',
};

const statusDot: Record<string, string> = {
  on_track: 'bg-green-500',
  under_pressure: 'bg-amber-500',
  sustained: 'bg-blue-500',
  overloaded: 'bg-red-500',
  balanced: 'bg-purple-500',
};

const avatarColors = [
  'from-blue-400 to-blue-600',
  'from-purple-400 to-purple-600',
  'from-green-400 to-green-600',
  'from-rose-400 to-rose-600',
  'from-amber-400 to-amber-600',
  'from-cyan-400 to-cyan-600',
  'from-indigo-400 to-indigo-600',
  'from-pink-400 to-pink-600',
];

export default function TeamPage() {
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [selectedMember, setSelectedMember] = useState<typeof teamMembers[0] | null>(null);

  const departments = ['all', ...Array.from(new Set(teamMembers.map(m => m.department)))];

  const filtered = teamMembers.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase()) ||
      m.department.toLowerCase().includes(search.toLowerCase());
    const matchDept = filterDept === 'all' || m.department === filterDept;
    return matchSearch && matchDept;
  });

  const getMemberTasks = (name: string) => tasks.filter(t => t.assignee === name);

  return (
    <DashboardLayout title="Team Members" subtitle="Manage your team and track individual workloads">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setFilterDept(dept)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                filterDept === dept ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {dept === 'all' ? 'All Departments' : dept}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
          <Plus size={16} />
          Add Member
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members by name, role..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {filtered.map((member, i) => {
          const memberTasks = getMemberTasks(member.name);
          const completedCount = memberTasks.filter(t => t.status === 'completed').length;
          const completionRate = memberTasks.length > 0 ? Math.round(completedCount / memberTasks.length * 100) : 0;
          return (
            <div
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg hover:shadow-blue-50 hover:border-blue-100 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white font-bold text-sm`}>
                  {member.avatar}
                </div>
                <button className="text-gray-200 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontal size={16} />
                </button>
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-0.5">{member.name}</h3>
              <p className="text-xs text-gray-400 mb-3">{member.role}</p>

              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-4 ${statusBgColor[member.status]}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusDot[member.status]}`}></span>
                {statusLabels[member.status]}
              </span>

              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                <div className="bg-gray-50 rounded-xl p-2">
                  <p className="text-sm font-bold text-gray-900">{member.activeWork}</p>
                  <p className="text-xs text-gray-400">Active</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-2">
                  <p className="text-sm font-bold text-gray-900">{member.overdue}</p>
                  <p className="text-xs text-gray-400">Overdue</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-2">
                  <p className="text-sm font-bold text-gray-900">{completionRate}%</p>
                  <p className="text-xs text-gray-400">Done</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400">Completion rate</span>
                  <span className="text-xs font-bold text-gray-700">{completionRate}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full">
                  <div
                    className={`h-full rounded-full ${completionRate >= 70 ? 'bg-green-500' : completionRate >= 40 ? 'bg-blue-500' : 'bg-amber-400'}`}
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Member Detail Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <p className="font-semibold text-gray-900 text-sm">Team Overview Table</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-xs text-gray-400 border-b border-gray-100 bg-gray-50/50">
              <th className="text-left py-3 px-5 font-semibold uppercase tracking-wider">Member</th>
              <th className="text-left py-3 px-4 font-semibold uppercase tracking-wider">Department</th>
              <th className="text-center py-3 px-4 font-semibold uppercase tracking-wider">Active</th>
              <th className="text-center py-3 px-4 font-semibold uppercase tracking-wider">Overdue</th>
              <th className="text-left py-3 px-4 font-semibold uppercase tracking-wider">Status</th>
              <th className="text-left py-3 px-4 font-semibold uppercase tracking-wider">Workload</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((member, i) => (
              <tr key={member.id} className="border-b border-gray-50 last:border-0 hover:bg-blue-50/20 transition-colors">
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-xs font-bold`}>
                      {member.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-400">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-sm text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">{member.department}</span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="text-sm font-bold text-gray-900">{member.activeWork}</span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className={`text-sm font-bold ${member.overdue > 3 ? 'text-red-500' : 'text-gray-900'}`}>{member.overdue}</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusBgColor[member.status]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot[member.status]}`}></span>
                    {statusLabels[member.status]}
                  </span>
                </td>
                <td className="py-3.5 px-4 w-32">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                      <div
                        className={`h-full rounded-full ${
                          member.status === 'overloaded' ? 'bg-red-400' :
                          member.status === 'under_pressure' ? 'bg-amber-400' :
                          member.status === 'on_track' || member.status === 'sustained' ? 'bg-blue-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min((member.activeWork / 20) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-400">{member.activeWork}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <button className="text-gray-300 hover:text-gray-600 transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedMember(null)}>
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${avatarColors[selectedMember.id % avatarColors.length]} flex items-center justify-center text-white font-bold text-lg`}>
                    {selectedMember.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{selectedMember.name}</h3>
                    <p className="text-sm text-gray-400">{selectedMember.role}</p>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mt-1.5 ${statusBgColor[selectedMember.status]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[selectedMember.status]}`}></span>
                      {statusLabels[selectedMember.status]}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedMember(null)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail size={15} className="text-gray-400" />
                {selectedMember.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Briefcase size={15} className="text-gray-400" />
                {selectedMember.department} Department
              </div>
              <div className="grid grid-cols-3 gap-3 mt-2">
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-blue-600">{selectedMember.activeWork}</p>
                  <p className="text-xs text-blue-500">Active Tasks</p>
                </div>
                <div className="bg-red-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-red-600">{selectedMember.overdue}</p>
                  <p className="text-xs text-red-500">Overdue</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-green-600">{getMemberTasks(selectedMember.name).filter(t => t.status === 'completed').length}</p>
                  <p className="text-xs text-green-500">Completed</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Assigned Tasks</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {getMemberTasks(selectedMember.name).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        {task.status === 'completed' ? <CheckCircle2 size={14} className="text-green-500" /> :
                         task.status === 'overdue' ? <AlertCircle size={14} className="text-red-500" /> :
                         <Clock size={14} className="text-blue-500" />}
                        <span className="text-xs font-medium text-gray-700 truncate max-w-40">{task.title}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize
                        ${task.priority === 'high' ? 'bg-red-50 text-red-600' :
                          task.priority === 'medium' ? 'bg-amber-50 text-amber-600' :
                          'bg-green-50 text-green-600'}`}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                  {getMemberTasks(selectedMember.name).length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">No tasks assigned</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
