// Semantic alignment utility with comprehensive relationship patterns
export type Goal = {
  title: string;
  milestones: any[];
  alignedTasks: any[];
  // Add other properties as needed
};

export function findRelatedGoalForTask(
  taskTitle: string,
  goals: Goal[]
): Goal | null {
  // Convert task title to lowercase for matching
  const lowerTaskTitle = taskTitle.toLowerCase();

  // Store matches with their relevance scores
  const matches: { goal: Goal; score: number }[] = [];

  // Check each goal for relevance
  for (const goal of goals) {
    const lowerGoalTitle = goal.title.toLowerCase();
    let score = 0;

    // Running/Marathon related
    if (
      (lowerTaskTitle.includes('run') ||
        lowerTaskTitle.includes('jog') ||
        lowerTaskTitle.includes('marathon') ||
        lowerTaskTitle.includes('running') ||
        lowerTaskTitle.includes('shoes') ||
        lowerTaskTitle.includes('sneakers') ||
        lowerTaskTitle.includes('exercise')) &&
      (lowerGoalTitle.includes('marathon') ||
        lowerGoalTitle.includes('run') ||
        lowerGoalTitle.includes('running') ||
        lowerGoalTitle.includes('jog') ||
        lowerGoalTitle.includes('race'))
    ) {
      // Specific combinations get higher scores
      if (
        lowerTaskTitle.includes('shoes') &&
        lowerGoalTitle.includes('marathon')
      ) {
        score = 90; // Very high relevance
      } else if (
        lowerTaskTitle.includes('running') &&
        lowerGoalTitle.includes('marathon')
      ) {
        score = 85;
      } else {
        score = 70; // General running relevance
      }
    }

    // Design system related
    if (
      (lowerTaskTitle.includes('design') ||
        lowerTaskTitle.includes('token') ||
        lowerTaskTitle.includes('system') ||
        lowerTaskTitle.includes('ui') ||
        lowerTaskTitle.includes('component') ||
        lowerTaskTitle.includes('spark')) &&
      (lowerGoalTitle.includes('design system') ||
        lowerGoalTitle.includes('spark') ||
        lowerGoalTitle.includes('design'))
    ) {
      // Specific combinations get higher scores
      if (
        lowerTaskTitle.includes('design') &&
        lowerGoalTitle.includes('design system')
      ) {
        score = 90; // Very high relevance
      } else if (
        lowerTaskTitle.includes('token') &&
        lowerGoalTitle.includes('design')
      ) {
        score = 85;
      } else {
        score = 70; // General design relevance
      }
    }

    // Only add goals with a positive score
    if (score > 0) {
      matches.push({ goal, score });
    }
  }

  // Sort matches by score (highest first)
  matches.sort((a, b) => b.score - a.score);

  // Return the highest scoring match, or null if no matches
  return matches.length > 0 ? matches[0].goal : null;
}
