export function fixSpecificTaskAlignments(tasks, goals, setTasks) {
  // Find the tasks by title
  const runningShoeTask = tasks.find((task) =>
    task.title.toLowerCase().includes('running shoes')
  );

  const designTokenTask = tasks.find((task) =>
    task.title.toLowerCase().includes('design token')
  );

  // Find the goals by title
  const marathonGoal = goals.find((goal) =>
    goal.title.toLowerCase().includes('marathon')
  );

  const designSystemGoal = goals.find((goal) =>
    goal.title.toLowerCase().includes('design system')
  );

  // Create a new tasks array
  let updatedTasks = [...tasks];

  // Fix running shoes task
  if (runningShoeTask && marathonGoal) {
    updatedTasks = updatedTasks.map((task) => {
      if (task.id === runningShoeTask.id) {
        return {
          ...task,
          goalIds: [marathonGoal.id],
          alignmentPercentages: { [marathonGoal.id]: 100 },
        };
      }
      return task;
    });
  }

  // Fix design token task
  if (designTokenTask && designSystemGoal) {
    updatedTasks = updatedTasks.map((task) => {
      if (task.id === designTokenTask.id) {
        return {
          ...task,
          goalIds: [designSystemGoal.id],
          alignmentPercentages: { [designSystemGoal.id]: 100 },
        };
      }
      return task;
    });
  }

  // Update tasks
  setTasks(updatedTasks);
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));

  return updatedTasks;
}
