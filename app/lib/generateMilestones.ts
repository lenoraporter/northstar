import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateMilestones(goal: string, timeframe: string) {
  const prompt = `
    Create a structured action plan for the goal: "${goal}" within a ${timeframe} timeframe.
    
    Format the response as JSON with the following structure:
    {
      "milestones": [
        {
          "title": "milestone name",
          "description": "detailed description",
          "weight": number between 1-5 representing importance,
          "suggestedTasks": ["list", "of", "related", "daily/weekly", "tasks"]
        }
      ]
    }

    Make the milestones specific, measurable, and actionable.
    Include 5-7 key milestones.
    For suggestedTasks, include common tasks that would align with this milestone.
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are a goal-setting and achievement expert.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0].message.content);
}
