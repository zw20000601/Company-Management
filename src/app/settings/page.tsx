'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Bell, Lock, User, Palette, Globe, Shield, Check } from 'lucide-react';

const settingsSections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'language', label: 'Language & Region', icon: Globe },
  { id: 'privacy', label: 'Privacy', icon: Shield },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    taskAssigned: true, taskOverdue: true, projectUpdate: false, weeklyReport: true, teamMessage: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <DashboardLayout title="Settings" subtitle="Manage your account preferences">
      <div className="flex gap-4">
        {/* Settings Sidebar */}
        <div className="w-48 bg-white rounded-2xl border border-gray-100 p-3 h-fit shrink-0">
          {settingsSections.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeSection === s.id ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Icon size={15} />
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {activeSection === 'profile' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-6">Profile Information</h3>
              <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-100">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xl">AC</div>
                <div>
                  <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors">Change Photo</button>
                  <p className="text-xs text-gray-400 mt-1.5">JPG, PNG or GIF. Max 5MB.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'First Name', value: 'Alex' },
                  { label: 'Last Name', value: 'Chen' },
                  { label: 'Email', value: 'alex.chen@company.com' },
                  { label: 'Role', value: 'Product Manager' },
                  { label: 'Department', value: 'Product' },
                  { label: 'Phone', value: '+1 (555) 123-4567' },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.label}</label>
                    <input
                      defaultValue={f.value}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 bg-gray-50 focus:bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-6">Notification Preferences</h3>
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => {
                  const labels: Record<string, { title: string; desc: string }> = {
                    taskAssigned: { title: 'Task Assigned', desc: 'Receive a notification when a task is assigned to you' },
                    taskOverdue: { title: 'Task Overdue', desc: 'Get alerted when your tasks are past their due date' },
                    projectUpdate: { title: 'Project Updates', desc: 'Stay informed about project status changes' },
                    weeklyReport: { title: 'Weekly Report', desc: 'Receive a weekly performance summary every Monday' },
                    teamMessage: { title: 'Team Messages', desc: 'Get notified when teammates send you messages' },
                  };
                  const info = labels[key];
                  return (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{info.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{info.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, [key]: !value })}
                        className={`w-12 h-6 rounded-full transition-colors relative ${value ? 'bg-blue-600' : 'bg-gray-200'}`}
                      >
                        <div className={`w-4.5 h-4.5 bg-white rounded-full shadow absolute top-0.5 transition-all ${value ? 'left-6' : 'left-0.5'}`} style={{ width: '18px', height: '18px' }}></div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {(activeSection === 'security' || activeSection === 'appearance' || activeSection === 'language' || activeSection === 'privacy') && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4 capitalize">{settingsSections.find(s => s.id === activeSection)?.label}</h3>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {(() => {
                    const Icon = settingsSections.find(s => s.id === activeSection)!.icon;
                    return <Icon size={28} className="text-blue-400" />;
                  })()}
                </div>
                <p className="text-gray-500 font-medium">Settings coming soon</p>
                <p className="text-sm text-gray-400 mt-1">This section is under development</p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button className="border border-gray-200 text-gray-600 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">
              {saved ? <><Check size={15} /> Saved!</> : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
