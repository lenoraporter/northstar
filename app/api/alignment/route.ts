import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { task, goals } = await req.json();

  try {
    const prompt = `
      Task: "${task.title}"
      Category: "${task.category}"
      
      Goals:
      ${goals.map((g: any) => `- ${g.title} (${g.timeframe})`).join('\n')}

      Analyze how well this task aligns with the given goals. Consider:
      1. Direct impact on goal progress
      2. Time investment value
      3. Priority level
      
      Return a JSON response with:
      1. alignmentScore (0-100)
      2. bestAlignedGoal (goal title or null)
      3. explanation (brief text explaining the alignment)
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that analyzes task-goal alignment.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const analysis = JSON.parse(response.choices[0].message.content || '{}');
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing task:', error);
    return NextResponse.json(
      { error: 'Failed to analyze task' },
      { status: 500 }
    );
  }
}
