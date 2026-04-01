'use client';

import { TaskProvider } from '@/lib/TaskContext';
import { AuthProvider } from '@/lib/AuthContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TaskProvider>{children}</TaskProvider>
    </AuthProvider>
  );
}
