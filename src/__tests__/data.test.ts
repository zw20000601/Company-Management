import {
  tasks, projects, teamMembers, Task, TaskStatus, Priority,
  statusLabels, priorityColors, taskStatusLabels, taskStatusColors,
} from '@/lib/data';

describe('Mock Data Integrity', () => {
  describe('tasks', () => {
    it('should have at least 1 task', () => {
      expect(tasks.length).toBeGreaterThan(0);
    });

    it('should have unique IDs', () => {
      const ids = tasks.map(t => t.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('should only have valid statuses', () => {
      const validStatuses: TaskStatus[] = ['todo', 'in_progress', 'completed', 'overdue'];
      tasks.forEach(task => {
        expect(validStatuses).toContain(task.status);
      });
    });

    it('should only have valid priorities', () => {
      const validPriorities: Priority[] = ['high', 'medium', 'low'];
      tasks.forEach(task => {
        expect(validPriorities).toContain(task.priority);
      });
    });

    it('should have progress between 0 and 100', () => {
      tasks.forEach(task => {
        expect(task.progress).toBeGreaterThanOrEqual(0);
        expect(task.progress).toBeLessThanOrEqual(100);
      });
    });

    it('completed tasks should have 100% progress', () => {
      tasks.filter(t => t.status === 'completed').forEach(task => {
        expect(task.progress).toBe(100);
      });
    });

    it('should have non-empty title and assignee', () => {
      tasks.forEach(task => {
        expect(task.title.length).toBeGreaterThan(0);
        expect(task.assignee.length).toBeGreaterThan(0);
      });
    });

    it('should have valid date formats (YYYY-MM-DD)', () => {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      tasks.forEach(task => {
        expect(task.dueDate).toMatch(dateRegex);
        expect(task.createdAt).toMatch(dateRegex);
      });
    });
  });

  describe('projects', () => {
    it('should have at least 1 project', () => {
      expect(projects.length).toBeGreaterThan(0);
    });

    it('should have unique IDs', () => {
      const ids = projects.map(p => p.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('should have progress between 0 and 100', () => {
      projects.forEach(project => {
        expect(project.progress).toBeGreaterThanOrEqual(0);
        expect(project.progress).toBeLessThanOrEqual(100);
      });
    });

    it('should have tasksCompleted <= tasksTotal', () => {
      projects.forEach(project => {
        expect(project.tasksCompleted).toBeLessThanOrEqual(project.tasksTotal);
      });
    });

    it('should have at least one member', () => {
      projects.forEach(project => {
        expect(project.members.length).toBeGreaterThan(0);
      });
    });
  });

  describe('teamMembers', () => {
    it('should have at least 1 member', () => {
      expect(teamMembers.length).toBeGreaterThan(0);
    });

    it('should have unique IDs', () => {
      const ids = teamMembers.map(m => m.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('should have unique emails', () => {
      const emails = teamMembers.map(m => m.email);
      expect(new Set(emails).size).toBe(emails.length);
    });

    it('should have non-negative active work and overdue counts', () => {
      teamMembers.forEach(member => {
        expect(member.activeWork).toBeGreaterThanOrEqual(0);
        expect(member.overdue).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('configuration maps', () => {
    it('statusLabels should cover all member statuses', () => {
      const expected = ['on_track', 'under_pressure', 'sustained', 'overloaded', 'balanced'];
      expected.forEach(status => {
        expect(statusLabels[status as keyof typeof statusLabels]).toBeDefined();
      });
    });

    it('taskStatusLabels should cover all task statuses', () => {
      const expected: TaskStatus[] = ['todo', 'in_progress', 'completed', 'overdue'];
      expected.forEach(status => {
        expect(taskStatusLabels[status]).toBeDefined();
      });
    });

    it('priorityColors should cover all priorities', () => {
      const expected: Priority[] = ['high', 'medium', 'low'];
      expected.forEach(priority => {
        expect(priorityColors[priority]).toBeDefined();
      });
    });

    it('taskStatusColors should cover all statuses', () => {
      const expected: TaskStatus[] = ['todo', 'in_progress', 'completed', 'overdue'];
      expected.forEach(status => {
        expect(taskStatusColors[status]).toBeDefined();
      });
    });
  });
});

describe('Task Status Flow Logic', () => {
  it('should have the correct status labels', () => {
    expect(taskStatusLabels.todo).toBe('To Do');
    expect(taskStatusLabels.in_progress).toBe('In Progress');
    expect(taskStatusLabels.completed).toBe('Completed');
    expect(taskStatusLabels.overdue).toBe('Overdue');
  });

  it('should have the correct priority colors', () => {
    expect(priorityColors.high).toBe('#ef4444');
    expect(priorityColors.medium).toBe('#f59e0b');
    expect(priorityColors.low).toBe('#10b981');
  });

  it('overdue tasks should have dueDate in the past', () => {
    const today = new Date('2026-04-01');
    tasks.filter(t => t.status === 'overdue').forEach(task => {
      expect(new Date(task.dueDate).getTime()).toBeLessThan(today.getTime());
    });
  });
});
