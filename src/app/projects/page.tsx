'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { projects, tasks, teamMembers, Project } from '@/lib/data';
import {
  Plus, MoreHorizontal, Search, Calendar, Users,
  CheckSquare, AlertTriangle, Clock, TrendingUp, X
} from 'lucide-react';

const statusConfig: Record<string, { label: string; style: string; dot: string }> = {
  active: { label: 'Active', style: 'bg-blue-50 text-blue-700', dot: 'bg-blue-500' },
  at_risk: { label: 'At Risk', style: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  completed: { label: 'Completed', style: 'bg-green-50 text-green-700', dot: 'bg-green-500' },
  on_hold: { label: 'On Hold', style: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' },
};

const priorityConfig: Record<string, string> = {
  high: 'bg-red-50 text-red-600',
  medium: 'bg-amber-50 text-amber-600',
  low: 'bg-green-50 text-green-600',
};

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered = projects.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getProjectTasks = (projectName: string) => tasks.filter(t => t.project === projectName);

  const statsBar = [
    { label: 'Total Projects', value: projects.length, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active', value: projects.filter(p => p.status === 'active').length, icon: CheckSquare, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'At Risk', value: projects.filter(p => p.status === 'at_risk').length, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'On Hold', value: projects.filter(p => p.status === 'on_hold').length, icon: Clock, color: 'text-gray-500', bg: 'bg-gray-100' },
  ];

  return (
    <DashboardLayout title="Projects" subtitle="Track and manage all your ongoing projects">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsBar.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <Icon size={18} className={s.color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {['all', 'active', 'at_risk', 'on_hold', 'completed'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                filterStatus === s ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {s === 'all' ? 'All' : s === 'at_risk' ? 'At Risk' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-white w-52"
            />
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
            <Plus size={16} />
            New Project
          </button>
        </div>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((project) => {
          const projectTasks = getProjectTasks(project.name);
          const cfg = statusConfig[project.status];
          return (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg hover:shadow-blue-50 hover:border-blue-100 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.style}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                      {cfg.label}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${priorityConfig[project.priority]}`}>
                      {project.priority}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mt-2">{project.name}</h3>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">{project.description}</p>
                </div>
                <button className="text-gray-200 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-400">Overall Progress</span>
                  <span className="text-xs font-bold text-gray-900">{project.progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      project.status === 'at_risk' ? 'bg-amber-400' :
                      project.status === 'completed' ? 'bg-green-500' :
                      project.status === 'on_hold' ? 'bg-gray-400' : 'bg-blue-500'
                    }`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                  <p className="text-sm font-bold text-gray-900">{project.tasksTotal}</p>
                  <p className="text-xs text-gray-400">Total</p>
                </div>
                <div className="bg-green-50 rounded-xl p-2.5 text-center">
                  <p className="text-sm font-bold text-green-700">{project.tasksCompleted}</p>
                  <p className="text-xs text-green-500">Done</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-2.5 text-center">
                  <p className="text-sm font-bold text-blue-700">{project.tasksTotal - project.tasksCompleted}</p>
                  <p className="text-xs text-blue-500">Left</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-gray-400" />
                  <span className="text-xs text-gray-400">{project.dueDate}</span>
                </div>
                <div className="flex -space-x-2">
                  {project.members.slice(0, 3).map((member, i) => (
                    <div
                      key={member}
                      className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                      title={member}
                    >
                      {member.split(' ').map(n => n[0]).join('')}
                    </div>
                  ))}
                  {project.members.length > 3 && (
                    <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-gray-500 text-xs font-bold">
                      +{project.members.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedProject(null)}>
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig[selectedProject.status].style}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[selectedProject.status].dot}`}></span>
                      {statusConfig[selectedProject.status].label}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${priorityConfig[selectedProject.priority]}`}>
                      {selectedProject.priority} priority
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedProject.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{selectedProject.description}</p>
                </div>
                <button onClick={() => setSelectedProject(null)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 shrink-0 ml-3">
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5">
                  <Calendar size={15} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Due Date</p>
                    <p className="text-sm font-semibold text-gray-700">{selectedProject.dueDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Users size={15} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Team Size</p>
                    <p className="text-sm font-semibold text-gray-700">{selectedProject.members.length} members</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold text-gray-700">Progress</p>
                  <p className="text-sm font-bold text-blue-600">{selectedProject.progress}%</p>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${selectedProject.progress}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{selectedProject.tasksCompleted} tasks completed</span>
                  <span>{selectedProject.tasksTotal} total</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Team Members</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.members.map((member) => (
                    <div key={member} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-1.5">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                        {member.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-xs font-medium text-gray-700">{member}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Project Tasks</p>
                <div className="space-y-2">
                  {getProjectTasks(selectedProject.name).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          task.status === 'completed' ? 'bg-green-500' :
                          task.status === 'overdue' ? 'bg-red-400' :
                          task.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-700">{task.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{task.progress}%</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${
                          task.priority === 'high' ? 'bg-red-50 text-red-600' :
                          task.priority === 'medium' ? 'bg-amber-50 text-amber-600' :
                          'bg-green-50 text-green-600'
                        }`}>{task.priority}</span>
                      </div>
                    </div>
                  ))}
                  {getProjectTasks(selectedProject.name).length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">No tasks in this project yet</p>
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
