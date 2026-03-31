'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, Search, ChevronDown, Check, Clock, AlertCircle, CheckCircle2, X } from 'lucide-react';

interface Notification {
  id: number;
  type: 'task_assigned' | 'task_overdue' | 'task_completed' | 'project_update';
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: 1, type: 'task_assigned', title: 'New task assigned', desc: 'Mark Chen assigned you "Design onboarding flow"', time: '2 min ago', read: false },
  { id: 2, type: 'task_overdue', title: 'Task overdue', desc: '"Update database schema" is 3 days overdue', time: '1 hour ago', read: false },
  { id: 3, type: 'task_completed', title: 'Task completed', desc: 'Sarah Wilson completed "Setup CI/CD pipeline"', time: '2 hours ago', read: false },
  { id: 4, type: 'project_update', title: 'Project at risk', desc: '"Backend Infrastructure" is now marked At Risk', time: 'Yesterday', read: true },
  { id: 5, type: 'task_assigned', title: 'Task reassigned', desc: 'You have been assigned "Performance optimization audit"', time: 'Yesterday', read: true },
];

const notifIcon = {
  task_assigned: <Clock size={14} className="text-blue-500" />,
  task_overdue: <AlertCircle size={14} className="text-red-500" />,
  task_completed: <CheckCircle2 size={14} className="text-green-500" />,
  project_update: <AlertCircle size={14} className="text-amber-500" />,
};

interface TopBarProps {
  title?: string;
  subtitle?: string;
}

export default function TopBar({ title = 'Welcome back, Alex!', subtitle = "Here's what's happening with your team today" }: TopBarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
  const dismiss = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(ns => ns.filter(n => n.id !== id));
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-10">
      <div>
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search size={15} className="absolute left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search here..."
            className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl w-52 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
          />
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); }}
            className="relative w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <Bell size={17} className="text-gray-500" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900 text-sm">Notifications</p>
                  {unreadCount > 0 && <p className="text-xs text-gray-400">{unreadCount} unread</p>}
                </div>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                    <Check size={11} />
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-10 text-center">
                    <Bell size={24} className="text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">All caught up!</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors group border-b border-gray-50 last:border-0 ${!n.read ? 'bg-blue-50/30' : ''}`}
                    >
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        n.type === 'task_assigned' ? 'bg-blue-50' :
                        n.type === 'task_overdue' ? 'bg-red-50' :
                        n.type === 'task_completed' ? 'bg-green-50' : 'bg-amber-50'
                      }`}>
                        {notifIcon[n.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold leading-tight ${!n.read ? 'text-gray-900' : 'text-gray-600'}`}>{n.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{n.desc}</p>
                        <p className="text-xs text-gray-300 mt-1">{n.time}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {!n.read && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                        <button
                          onClick={(e) => dismiss(n.id, e)}
                          className="w-5 h-5 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={10} className="text-gray-500" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <div className="px-4 py-2.5 border-t border-gray-100">
                  <button className="w-full text-center text-xs text-blue-600 font-semibold hover:underline">
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }}
            className="flex items-center gap-2.5 pl-3 border-l border-gray-100"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              AC
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-900 leading-tight">Alex Chen</p>
              <p className="text-xs text-gray-400 leading-tight">hello@company.com</p>
            </div>
            <ChevronDown size={14} className={`text-gray-400 transition-transform ${userOpen ? 'rotate-180' : ''}`} />
          </button>

          {userOpen && (
            <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden py-1">
              {[
                { label: 'My Profile', href: '/settings' },
                { label: 'Settings', href: '/settings' },
                { label: 'Help & Support', href: '/help' },
                { label: 'Logout', href: '/' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                    item.label === 'Logout' ? 'text-red-500 font-medium border-t border-gray-100 mt-1 pt-3' : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
