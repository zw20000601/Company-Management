'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { HelpCircle, BookOpen, MessageCircle, Video, ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';

const categories = [
  {
    icon: BookOpen,
    title: 'Getting Started',
    color: 'bg-blue-50 text-blue-600',
    articles: [
      'How to create your first task',
      'Setting up your team',
      'Understanding task priorities',
      'Navigating the dashboard',
    ],
  },
  {
    icon: HelpCircle,
    title: 'Task Management',
    color: 'bg-purple-50 text-purple-600',
    articles: [
      'Assigning tasks to team members',
      'Tracking task progress',
      'Setting due dates and reminders',
      'Using tags and categories',
    ],
  },
  {
    icon: Video,
    title: 'Video Tutorials',
    color: 'bg-green-50 text-green-600',
    articles: [
      'Dashboard overview walkthrough',
      'Project management best practices',
      'Analytics and reports guide',
      'Team collaboration tips',
    ],
  },
  {
    icon: MessageCircle,
    title: 'Contact Support',
    color: 'bg-amber-50 text-amber-600',
    articles: [
      'Submit a support ticket',
      'Live chat with support team',
      'Community forum',
      'Feature request board',
    ],
  },
];

const faqs = [
  { q: 'How do I assign a task to multiple people?', a: 'Currently TaskFlow supports single assignee per task. To collaborate, create sub-tasks under the main task and assign each to a different team member.' },
  { q: 'Can I set recurring tasks?', a: 'Recurring tasks are available on Professional and Enterprise plans. Go to task creation and enable the "Repeat" toggle to set daily, weekly, or monthly recurrence.' },
  { q: 'How do I export my data?', a: 'Go to Reports page and click "Export Full Report" to download a PDF. For raw data exports in CSV format, go to Settings > Data & Privacy > Export Data.' },
  { q: 'What are the keyboard shortcuts?', a: 'Press "N" to create a new task, "/" to focus search, "D" to go to dashboard, "T" for tasks page. Full shortcuts list is available in Settings.' },
];

export default function HelpPage() {
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <DashboardLayout title="Help & Support" subtitle="Find answers, tutorials and get in touch with support">
      {/* Search */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 mb-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">How can we help you?</h2>
        <p className="text-blue-100 text-sm mb-6">Search our knowledge base or browse categories below</p>
        <div className="relative max-w-lg mx-auto">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search help articles..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-lg"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.title} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-100 transition-all">
              <div className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center mb-4`}>
                <Icon size={20} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-3">{cat.title}</h3>
              <ul className="space-y-2">
                {cat.articles.map((a) => (
                  <li key={a}>
                    <button className="flex items-center gap-2 text-xs text-gray-500 hover:text-blue-600 transition-colors text-left w-full group">
                      <ChevronRight size={12} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      {a}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 text-sm">{faq.q}</span>
                <ChevronRight size={16} className={`text-gray-400 transition-transform ${openFaq === i ? 'rotate-90' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-50">
                  <div className="pt-3">{faq.a}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
