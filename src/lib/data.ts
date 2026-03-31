export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'overdue';
export type MemberStatus = 'on_track' | 'under_pressure' | 'sustained' | 'overloaded' | 'balanced';

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatar: string;
  email: string;
  activeWork: number;
  overdue: number;
  status: MemberStatus;
  department: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  assignee: string;
  assigneeAvatar: string;
  priority: Priority;
  status: TaskStatus;
  project: string;
  dueDate: string;
  createdAt: string;
  progress: number;
  tags: string[];
}

export interface Project {
  id: number;
  name: string;
  description: string;
  progress: number;
  status: 'active' | 'at_risk' | 'completed' | 'on_hold';
  dueDate: string;
  members: string[];
  tasksTotal: number;
  tasksCompleted: number;
  priority: Priority;
}

export const teamMembers: TeamMember[] = [
  { id: 1, name: 'Mark Chen', role: 'Product Manager', avatar: 'MC', email: 'mark.chen@company.com', activeWork: 12, overdue: 5, status: 'on_track', department: 'Product' },
  { id: 2, name: 'Emily Davis', role: 'UI/UX Designer', avatar: 'ED', email: 'emily.davis@company.com', activeWork: 10, overdue: 2, status: 'under_pressure', department: 'Design' },
  { id: 3, name: 'John Smith', role: 'Frontend Developer', avatar: 'JS', email: 'john.smith@company.com', activeWork: 15, overdue: 4, status: 'sustained', department: 'Engineering' },
  { id: 4, name: 'Linda Johnson', role: 'Backend Developer', avatar: 'LJ', email: 'linda.johnson@company.com', activeWork: 9, overdue: 1, status: 'overloaded', department: 'Engineering' },
  { id: 5, name: 'Michael Brown', role: 'QA Specialist', avatar: 'MB', email: 'michael.brown@company.com', activeWork: 20, overdue: 6, status: 'balanced', department: 'QA' },
  { id: 6, name: 'Sarah Wilson', role: 'DevOps Engineer', avatar: 'SW', email: 'sarah.wilson@company.com', activeWork: 8, overdue: 1, status: 'on_track', department: 'Engineering' },
  { id: 7, name: 'David Lee', role: 'Data Analyst', avatar: 'DL', email: 'david.lee@company.com', activeWork: 11, overdue: 3, status: 'sustained', department: 'Analytics' },
  { id: 8, name: 'Anna Garcia', role: 'Project Coordinator', avatar: 'AG', email: 'anna.garcia@company.com', activeWork: 7, overdue: 0, status: 'balanced', department: 'Operations' },
];

export const tasks: Task[] = [
  { id: 1, title: 'Design new onboarding flow', description: 'Create wireframes and prototypes for the new user onboarding experience', assignee: 'Emily Davis', assigneeAvatar: 'ED', priority: 'high', status: 'in_progress', project: 'Product Redesign', dueDate: '2026-04-05', createdAt: '2026-03-15', progress: 65, tags: ['Design', 'UX'] },
  { id: 2, title: 'Implement authentication API', description: 'Build JWT-based authentication endpoints with refresh tokens', assignee: 'John Smith', assigneeAvatar: 'JS', priority: 'high', status: 'in_progress', project: 'Backend Infrastructure', dueDate: '2026-04-02', createdAt: '2026-03-10', progress: 80, tags: ['Backend', 'Security'] },
  { id: 3, title: 'Write unit tests for payment module', description: 'Achieve 90% code coverage for the payment processing module', assignee: 'Michael Brown', assigneeAvatar: 'MB', priority: 'medium', status: 'todo', project: 'Payment System', dueDate: '2026-04-10', createdAt: '2026-03-20', progress: 0, tags: ['QA', 'Testing'] },
  { id: 4, title: 'Update database schema', description: 'Migrate database to new schema supporting multi-tenancy', assignee: 'Linda Johnson', assigneeAvatar: 'LJ', priority: 'high', status: 'overdue', project: 'Backend Infrastructure', dueDate: '2026-03-28', createdAt: '2026-03-01', progress: 45, tags: ['Database', 'Backend'] },
  { id: 5, title: 'Create dashboard analytics widgets', description: 'Develop interactive charts and KPI widgets for the main dashboard', assignee: 'Mark Chen', assigneeAvatar: 'MC', priority: 'medium', status: 'in_progress', project: 'Analytics Platform', dueDate: '2026-04-08', createdAt: '2026-03-18', progress: 55, tags: ['Frontend', 'Analytics'] },
  { id: 6, title: 'Setup CI/CD pipeline', description: 'Configure automated build and deployment pipeline using GitHub Actions', assignee: 'Sarah Wilson', assigneeAvatar: 'SW', priority: 'high', status: 'completed', project: 'DevOps', dueDate: '2026-03-30', createdAt: '2026-03-05', progress: 100, tags: ['DevOps', 'Automation'] },
  { id: 7, title: 'Mobile responsive redesign', description: 'Ensure all pages are fully responsive on mobile and tablet devices', assignee: 'Emily Davis', assigneeAvatar: 'ED', priority: 'medium', status: 'todo', project: 'Product Redesign', dueDate: '2026-04-15', createdAt: '2026-03-22', progress: 10, tags: ['Design', 'Frontend'] },
  { id: 8, title: 'Integrate third-party payment gateway', description: 'Integrate Stripe payment gateway with webhook support', assignee: 'John Smith', assigneeAvatar: 'JS', priority: 'high', status: 'in_progress', project: 'Payment System', dueDate: '2026-04-12', createdAt: '2026-03-12', progress: 70, tags: ['Backend', 'Integration'] },
  { id: 9, title: 'Quarterly performance review report', description: 'Analyze Q1 data and prepare comprehensive performance report', assignee: 'David Lee', assigneeAvatar: 'DL', priority: 'low', status: 'completed', project: 'Analytics Platform', dueDate: '2026-03-31', createdAt: '2026-03-01', progress: 100, tags: ['Analytics', 'Reporting'] },
  { id: 10, title: 'User acceptance testing', description: 'Conduct UAT sessions with 20 beta users for new features', assignee: 'Michael Brown', assigneeAvatar: 'MB', priority: 'medium', status: 'overdue', project: 'Product Redesign', dueDate: '2026-03-25', createdAt: '2026-03-08', progress: 30, tags: ['QA', 'Testing'] },
  { id: 11, title: 'API documentation update', description: 'Update Swagger documentation for all v2 API endpoints', assignee: 'Anna Garcia', assigneeAvatar: 'AG', priority: 'low', status: 'todo', project: 'Backend Infrastructure', dueDate: '2026-04-20', createdAt: '2026-03-25', progress: 0, tags: ['Documentation'] },
  { id: 12, title: 'Performance optimization audit', description: 'Profile and optimize slow database queries and frontend rendering', assignee: 'Linda Johnson', assigneeAvatar: 'LJ', priority: 'high', status: 'in_progress', project: 'Backend Infrastructure', dueDate: '2026-04-06', createdAt: '2026-03-14', progress: 40, tags: ['Performance', 'Backend'] },
];

export const projects: Project[] = [
  { id: 1, name: 'Product Redesign', description: 'Complete overhaul of user interface and experience', progress: 42, status: 'active', dueDate: '2026-05-30', members: ['Emily Davis', 'Mark Chen', 'Michael Brown'], tasksTotal: 24, tasksCompleted: 10, priority: 'high' },
  { id: 2, name: 'Backend Infrastructure', description: 'Scalability improvements and architecture migration', progress: 68, status: 'at_risk', dueDate: '2026-04-15', members: ['Linda Johnson', 'John Smith', 'Sarah Wilson'], tasksTotal: 18, tasksCompleted: 12, priority: 'high' },
  { id: 3, name: 'Payment System', description: 'New payment processing system with multiple gateway support', progress: 55, status: 'active', dueDate: '2026-05-01', members: ['John Smith', 'Michael Brown'], tasksTotal: 15, tasksCompleted: 8, priority: 'high' },
  { id: 4, name: 'Analytics Platform', description: 'Real-time analytics dashboard and reporting tools', progress: 80, status: 'active', dueDate: '2026-04-20', members: ['David Lee', 'Mark Chen'], tasksTotal: 12, tasksCompleted: 10, priority: 'medium' },
  { id: 5, name: 'DevOps', description: 'CI/CD pipeline and infrastructure automation', progress: 90, status: 'active', dueDate: '2026-04-10', members: ['Sarah Wilson'], tasksTotal: 10, tasksCompleted: 9, priority: 'medium' },
  { id: 6, name: 'Mobile App', description: 'Native mobile application for iOS and Android', progress: 15, status: 'on_hold', dueDate: '2026-08-01', members: ['Emily Davis', 'John Smith'], tasksTotal: 30, tasksCompleted: 4, priority: 'low' },
];

export const weeklyActivity = [
  { day: 'Sat', hours: [0, 0, 0, 2, 3, 0, 0, 0, 1] },
  { day: 'Sun', hours: [0, 0, 1, 1, 2, 0, 0, 0, 0] },
  { day: 'Mon', hours: [3, 4, 5, 6, 5, 4, 3, 2, 1] },
  { day: 'Tue', hours: [4, 5, 6, 7, 6, 5, 4, 3, 2] },
  { day: 'Wed', hours: [2, 3, 4, 5, 4, 3, 2, 1, 0] },
  { day: 'Thu', hours: [3, 4, 5, 6, 5, 4, 3, 2, 1] },
  { day: 'Fri', hours: [1, 2, 3, 4, 3, 2, 1, 0, 0] },
];

export const monthlyData = [
  { month: 'Oct', completed: 45, created: 60 },
  { month: 'Nov', completed: 52, created: 65 },
  { month: 'Dec', completed: 38, created: 48 },
  { month: 'Jan', completed: 60, created: 72 },
  { month: 'Feb', completed: 55, created: 68 },
  { month: 'Mar', completed: 70, created: 80 },
];

export const statusColors: Record<MemberStatus, string> = {
  on_track: '#10b981',
  under_pressure: '#f59e0b',
  sustained: '#3b82f6',
  overloaded: '#ef4444',
  balanced: '#8b5cf6',
};

export const statusLabels: Record<MemberStatus, string> = {
  on_track: 'On Track',
  under_pressure: 'Under Pressure',
  sustained: 'Sustained',
  overloaded: 'Overloaded',
  balanced: 'Balanced',
};

export const priorityColors: Record<Priority, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981',
};

export const taskStatusColors: Record<TaskStatus, string> = {
  todo: '#94a3b8',
  in_progress: '#3b82f6',
  completed: '#10b981',
  overdue: '#ef4444',
};

export const taskStatusLabels: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  completed: 'Completed',
  overdue: 'Overdue',
};
