'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, CheckSquare, FolderKanban, BarChart2,
  Calendar, Users, FileText, MessageSquare, Settings,
  HelpCircle, LogOut, Zap, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Tasks', icon: CheckSquare, href: '/tasks' },
  { label: 'Projects', icon: FolderKanban, href: '/projects' },
  { label: 'Analytics', icon: BarChart2, href: '/analytics' },
  { label: 'Calendar', icon: Calendar, href: '/calendar' },
  { label: 'Team Members', icon: Users, href: '/team' },
  { label: 'Reports', icon: FileText, href: '/reports' },
  { label: 'Messages', icon: MessageSquare, href: '/messages', badge: 3 },
];

const generalItems = [
  { label: 'Settings', icon: Settings, href: '/settings' },
  { label: 'Help & Support', icon: HelpCircle, href: '/help' },
  { label: 'Logout', icon: LogOut, href: '/', danger: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="w-56 bg-white border-r border-gray-100 flex flex-col h-full fixed left-0 top-0 bottom-0 z-10">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-sm shadow-blue-200 group-hover:shadow-md group-hover:shadow-blue-300 transition-all">
            <Zap size={15} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg tracking-tight">TaskFlow</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">Menu</p>
        <nav className="space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                  active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <Icon size={17} className={active ? 'text-blue-600' : 'group-hover:text-gray-700 transition-colors'} />
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                ) : active ? (
                  <ChevronRight size={13} className="text-blue-400" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mt-6 mb-2">General</p>
        <nav className="space-y-0.5">
          {generalItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            if (item.danger) {
              return (
                <button
                  key={item.label}
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-red-400 hover:bg-red-50 hover:text-red-500"
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                  active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Upgrade Banner */}
      <div className="mx-3 mb-4 p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/10"></div>
        <div className="absolute -bottom-6 -left-2 w-20 h-20 rounded-full bg-white/5"></div>
        <p className="font-bold text-sm mb-1 relative">Upgrade to Pro</p>
        <p className="text-xs text-blue-100 mb-3 leading-relaxed relative">Unlock advanced analytics and manage unlimited projects</p>
        <button className="w-full bg-white text-blue-600 text-xs font-bold py-2 rounded-xl hover:bg-blue-50 transition-colors relative shadow-sm">
          Upgrade Now
        </button>
      </div>
    </aside>
  );
}
