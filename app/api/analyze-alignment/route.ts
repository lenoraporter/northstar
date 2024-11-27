import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    if (!req.body) {
      return NextResponse.json({ error: 'No request body' }, { status: 400 });
    }

    const { taskTitle, goals } = await req.json();

    if (!taskTitle || !goals) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const alignments = await Promise.all(
      goals.map(async (goal) => {
        const prompt = `
Evaluate how directly this task contributes to achieving the specified goal.

TASK: "${taskTitle}"
GOAL: "${goal.title}"

Consider:
- Direct Impact: How directly does this task contribute to the goal?
- Core Skills: Is this a primary skill/activity for the goal?
- Resource Efficiency: Is this the most effective way to progress toward the goal?

Scoring Guide:
80-100: Essential, directly contributes to the goal
40-79: Supportive, but not essential
1-39: Marginally related, minimal impact on goal
0: No meaningful connection to the goal

Be very strict in your evaluation. Only score above 20 if the task is clearly supportive and relevant to the core skills needed for the goal.

Provide your response in this format:
Score: [0-100]
Explanation: [Brief explanation of the score]
`;

        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'You are a strict goal alignment analyzer. Evaluate tasks based solely on their direct contribution to achieving the specified goal. Be conservative with scores.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.1,
        });

        const result = response.choices[0].message.content?.trim() || '';
        const scoreMatch = result.match(/Score: (\d+)/);
        const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
        const explanation = result.replace(/Score: \d+/, '').trim();

        return {
          goalId: goal.id,
          score,
          explanation,
        };
      })
    );

    return NextResponse.json({
      alignments: alignments.filter((a) => a.score > 0),
    });
  } catch (error) {
    console.error('Error analyzing alignment:', error);
    return NextResponse.json(
      { error: 'Failed to analyze alignment' },
      { status: 500 }
    );
  }
}
