type MilestoneProgress = {
  id: string;
  title: string;
  progress: number;
  weight: number;
  alignedTasks: {
    id: string;
    title: string;
    completed: boolean;
    alignment: number;
  }[];
};

export function calculateGoalProgress(goal: Goal): {
  totalProgress: number;
  milestones: MilestoneProgress[];
} {
  // Calculate progress for each milestone
  const milestoneProgress = goal.milestones.map((milestone) => {
    const alignedTasks = goal.alignedTasks.filter((task) =>
      task.alignments.some((a) => a.milestoneId === milestone.id)
    );

    // Calculate milestone progress based on completed aligned tasks
    const completedTasksWeight = alignedTasks.reduce((sum, task) => {
      if (task.completed) {
        // Use the alignment percentage as a weight factor
        const alignment =
          task.alignments.find((a) => a.milestoneId === milestone.id)
            ?.alignment || 0;
        return sum + alignment / 100;
      }
      return sum;
    }, 0);

    // Progress is weighted by task completions and their alignment strength
    const progress =
      alignedTasks.length > 0
        ? (completedTasksWeight / alignedTasks.length) * 100
        : 0;

    return {
      id: milestone.id,
      title: milestone.title,
      progress,
      weight: milestone.weight,
      alignedTasks: alignedTasks.map((task) => ({
        id: task.id,
        title: task.title,
        completed: task.completed,
        alignment:
          task.alignments.find((a) => a.milestoneId === milestone.id)
            ?.alignment || 0,
      })),
    };
  });

  // Calculate total progress weighted by milestone importance
  const totalWeight = milestoneProgress.reduce((sum, m) => sum + m.weight, 0);
  const weightedProgress = milestoneProgress.reduce(
    (sum, milestone) => sum + milestone.progress * milestone.weight,
    0
  );

  const totalProgress =
    totalWeight > 0 ? Math.round(weightedProgress / totalWeight) : 0;

  return {
    totalProgress,
    milestones: milestoneProgress,
  };
}
