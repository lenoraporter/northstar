const analyzeAlignment = async (task: string) => {
  try {
    const response = await fetch('/api/analyze-alignment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskTitle: task,
        goals: goals, // Your goals array
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze alignment');
    }

    const data = await response.json();
    console.log('Alignment response:', data); // Debug log
    return data.alignments;
  } catch (error) {
    console.error('Error analyzing alignment:', error);
    return [];
  }
};
