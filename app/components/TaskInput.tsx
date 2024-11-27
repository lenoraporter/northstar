/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const analyzeAlignment = async (
  task: string,
  goals: { id: string; title: string; timeframe: string }[]
) => {
  try {
    const response = await fetch('/api/analyze-alignment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskTitle: task,
        goals: goals,
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
