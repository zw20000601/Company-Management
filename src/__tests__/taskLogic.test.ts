import { Task, TaskStatus, Priority } from '@/lib/data';

// Simulate the task status change logic used in TaskContext
function updateTaskStatus(tasks: Task[], taskId: number, newStatus: TaskStatus): Task[] {
  return tasks.map(t =>
    t.id === taskId
      ? {
          ...t,
          status: newStatus,
          progress: newStatus === 'completed' ? 100 : newStatus === 'in_progress' ? Math.max(t.progress, 10) : t.progress,
        }
      : t
  );
}

function createTask(tasks: Task[], task: Omit<Task, 'id'>): Task[] {
  const maxId = tasks.reduce((max, t) => Math.max(max, t.id), 0);
  return [{ ...task, id: maxId + 1 }, ...tasks];
}

function deleteTask(tasks: Task[], taskId: number): Task[] {
  return tasks.filter(t => t.id !== taskId);
}

function filterTasks(
  tasks: Task[],
  search: string,
  status: TaskStatus | 'all',
  priority: Priority | 'all'
): Task[] {
  return tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.assignee.toLowerCase().includes(search.toLowerCase()) ||
      t.project.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === 'all' || t.status === status;
    const matchPriority = priority === 'all' || t.priority === priority;
    return matchSearch && matchStatus && matchPriority;
  });
}

const sampleTasks: Task[] = [
  {
    id: 1, title: 'Build login page', description: 'Create login UI',
    assignee: 'John Smith', assigneeAvatar: 'JS', priority: 'high',
    status: 'in_progress', project: 'Frontend', dueDate: '2026-04-05',
    createdAt: '2026-03-15', progress: 50, tags: ['React', 'UI'],
  },
  {
    id: 2, title: 'Setup database', description: 'Configure PostgreSQL',
    assignee: 'Linda Johnson', assigneeAvatar: 'LJ', priority: 'medium',
    status: 'todo', project: 'Backend', dueDate: '2026-04-10',
    createdAt: '2026-03-20', progress: 0, tags: ['Database'],
  },
  {
    id: 3, title: 'Write tests', description: 'Unit tests for API',
    assignee: 'Mark Chen', assigneeAvatar: 'MC', priority: 'low',
    status: 'completed', project: 'Backend', dueDate: '2026-03-30',
    createdAt: '2026-03-01', progress: 100, tags: ['Testing'],
  },
];

describe('Task Status Updates', () => {
  it('should mark task as completed with 100% progress', () => {
    const updated = updateTaskStatus(sampleTasks, 1, 'completed');
    const task = updated.find(t => t.id === 1)!;
    expect(task.status).toBe('completed');
    expect(task.progress).toBe(100);
  });

  it('should set minimum 10% progress when moving to in_progress', () => {
    const updated = updateTaskStatus(sampleTasks, 2, 'in_progress');
    const task = updated.find(t => t.id === 2)!;
    expect(task.status).toBe('in_progress');
    expect(task.progress).toBe(10);
  });

  it('should preserve higher progress when moving to in_progress', () => {
    const updated = updateTaskStatus(sampleTasks, 1, 'in_progress');
    const task = updated.find(t => t.id === 1)!;
    expect(task.progress).toBe(50); // Should keep 50, not downgrade to 10
  });

  it('should not change other tasks when updating one', () => {
    const updated = updateTaskStatus(sampleTasks, 1, 'completed');
    expect(updated.find(t => t.id === 2)!.status).toBe('todo');
    expect(updated.find(t => t.id === 3)!.status).toBe('completed');
  });

  it('should preserve progress when moving to overdue', () => {
    const updated = updateTaskStatus(sampleTasks, 1, 'overdue');
    const task = updated.find(t => t.id === 1)!;
    expect(task.status).toBe('overdue');
    expect(task.progress).toBe(50); // Keep existing progress
  });
});

describe('Task Creation', () => {
  it('should assign next available ID', () => {
    const newTask: Omit<Task, 'id'> = {
      title: 'New task', description: 'Description',
      assignee: 'Test User', assigneeAvatar: 'TU', priority: 'high',
      status: 'todo', project: 'Test', dueDate: '2026-05-01',
      createdAt: '2026-04-01', progress: 0, tags: ['Test'],
    };
    const updated = createTask(sampleTasks, newTask);
    expect(updated[0].id).toBe(4); // max existing is 3
    expect(updated.length).toBe(4);
  });

  it('should add new task at the beginning', () => {
    const newTask: Omit<Task, 'id'> = {
      title: 'First task', description: '',
      assignee: 'Test', assigneeAvatar: 'T', priority: 'low',
      status: 'todo', project: 'X', dueDate: '2026-05-01',
      createdAt: '2026-04-01', progress: 0, tags: [],
    };
    const updated = createTask(sampleTasks, newTask);
    expect(updated[0].title).toBe('First task');
  });
});

describe('Task Deletion', () => {
  it('should remove the specified task', () => {
    const updated = deleteTask(sampleTasks, 2);
    expect(updated.length).toBe(2);
    expect(updated.find(t => t.id === 2)).toBeUndefined();
  });

  it('should not remove anything if ID does not exist', () => {
    const updated = deleteTask(sampleTasks, 999);
    expect(updated.length).toBe(3);
  });
});

describe('Task Filtering', () => {
  it('should return all tasks with no filters', () => {
    const result = filterTasks(sampleTasks, '', 'all', 'all');
    expect(result.length).toBe(3);
  });

  it('should filter by status', () => {
    const result = filterTasks(sampleTasks, '', 'todo', 'all');
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Setup database');
  });

  it('should filter by priority', () => {
    const result = filterTasks(sampleTasks, '', 'all', 'high');
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Build login page');
  });

  it('should filter by search term (title)', () => {
    const result = filterTasks(sampleTasks, 'login', 'all', 'all');
    expect(result.length).toBe(1);
  });

  it('should filter by search term (assignee)', () => {
    const result = filterTasks(sampleTasks, 'john', 'all', 'all');
    expect(result.length).toBe(2); // matches 'John Smith' and 'Linda Johnson'
    expect(result.some(t => t.assignee === 'John Smith')).toBe(true);
  });

  it('should filter by search term (project)', () => {
    const result = filterTasks(sampleTasks, 'backend', 'all', 'all');
    expect(result.length).toBe(2);
  });

  it('should combine status + priority filters', () => {
    const result = filterTasks(sampleTasks, '', 'in_progress', 'high');
    expect(result.length).toBe(1);
  });

  it('should combine search + status filters', () => {
    const result = filterTasks(sampleTasks, 'backend', 'completed', 'all');
    expect(result.length).toBe(1);
  });

  it('should return empty when no matches', () => {
    const result = filterTasks(sampleTasks, 'nonexistent', 'all', 'all');
    expect(result.length).toBe(0);
  });
});
