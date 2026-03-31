'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { teamMembers } from '@/lib/data';
import { Send, Search, MoreHorizontal } from 'lucide-react';

const conversations = teamMembers.map((m, i) => ({
  ...m,
  lastMessage: [
    'Can you review the latest designs?',
    'The backend API is ready for testing.',
    'I finished the unit tests for payment.',
    'Database migration completed successfully.',
    'All QA checks passed on staging.',
    'CI/CD pipeline is fully automated.',
    'Dashboard analytics are ready for review.',
    'Updated the project documentation.',
  ][i],
  time: ['2m ago', '15m ago', '1h ago', '2h ago', '3h ago', 'Yesterday', 'Yesterday', '2 days ago'][i],
  unread: [3, 0, 1, 0, 2, 0, 0, 0][i],
}));

const initialMessages = [
  { id: 1, from: 'Mark Chen', text: 'Hey, can you review the latest dashboard designs I sent?', time: '09:30 AM', mine: false },
  { id: 2, from: 'Me', text: "Sure! I'll take a look and give feedback by EOD.", time: '09:32 AM', mine: true },
  { id: 3, from: 'Mark Chen', text: 'The priority section needs some work on the color scheme.', time: '09:35 AM', mine: false },
  { id: 4, from: 'Me', text: 'Agreed. I was thinking we go with a blue-to-navy gradient for high priority.', time: '09:38 AM', mine: true },
  { id: 5, from: 'Mark Chen', text: "That sounds great! Let's sync up on the call at 2 PM.", time: '09:40 AM', mine: false },
];

export default function MessagesPage() {
  const [active, setActive] = useState(conversations[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');

  const filtered = conversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: messages.length + 1, from: 'Me', text: input, time: 'Just now', mine: true }]);
    setInput('');
  };

  return (
    <DashboardLayout title="Messages" subtitle="Communicate with your team members">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex h-[calc(100vh-220px)]">
        {/* Sidebar */}
        <div className="w-72 border-r border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c)}
                className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 ${active.id === c.id ? 'bg-blue-50/50' : ''}`}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {c.avatar}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white bg-green-400"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900 truncate">{c.name}</p>
                    <span className="text-xs text-gray-400 shrink-0">{c.time}</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{c.lastMessage}</p>
                </div>
                {c.unread > 0 && (
                  <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center font-bold shrink-0">
                    {c.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {active.avatar}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{active.name}</p>
                <p className="text-xs text-gray-400">{active.role} · Online</p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md ${msg.mine ? '' : 'flex items-end gap-2'}`}>
                  {!msg.mine && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mb-1">
                      {active.avatar}
                    </div>
                  )}
                  <div>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                      msg.mine
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                    }`}>
                      {msg.text}
                    </div>
                    <p className={`text-xs text-gray-400 mt-1 ${msg.mine ? 'text-right' : 'text-left ml-1'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={`Message ${active.name}...`}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 bg-gray-50 focus:bg-white"
              />
              <button
                onClick={sendMessage}
                className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
