// Utility to completely reset and rebuild the data model

export function resetEntireDataModel() {
  // Clear all existing data
  localStorage.removeItem('tasks');
  localStorage.removeItem('goals');

  // Define fresh goals
  const goals = [
    {
      id: 'goal-1',
      title: 'Run a Marathon',
      createdAt: new Date().toISOString(),
      progress: 0,
      deadline: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ).toISOString(),
    },
    {
      id: 'goal-2',
      title: 'Launch the Spark Design System',
      createdAt: new Date().toISOString(),
      progress: 0,
      deadline: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ).toISOString(),
    },
  ];

  // Define fresh tasks with correct alignments
  const tasks = [
    {
      id: 'task-1',
      title: 'Purchase running shoes',
      completed: false,
      category: 'Health',
      goalIds: ['goal-1'], // Only aligned with marathon
      alignmentPercentages: { 'goal-1': 100 },
    },
    {
      id: 'task-2',
      title: 'Complete the design token system',
      completed: false,
      category: 'Other',
      goalIds: ['goal-2'], // Only aligned with design system
      alignmentPercentages: { 'goal-2': 100 },
    },
  ];

  // Save the fresh data
  localStorage.setItem('goals', JSON.stringify(goals));
  localStorage.setItem('tasks', JSON.stringify(tasks));

  return { goals, tasks };
}
