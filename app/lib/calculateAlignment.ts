export function calculateTaskAlignment(
  taskTitle: string,
  milestone: GoalMilestone
): number {
  // Convert everything to lowercase for comparison
  const taskWords = taskTitle.toLowerCase().split(' ');

  // Check each suggested task for matches
  const alignmentScores = milestone.suggestedTasks.map((suggestion) => {
    const suggestionWords = suggestion.toLowerCase().split(' ');

    // Count matching words
    const matchingWords = taskWords.filter((word) =>
      suggestionWords.some(
        (sugWord) => sugWord.includes(word) || word.includes(sugWord)
      )
    ).length;

    // Calculate similarity score
    return matchingWords / Math.max(taskWords.length, suggestionWords.length);
  });

  // Return the highest alignment score
  return Math.max(...alignmentScores) * 100;
}
