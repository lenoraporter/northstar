import { OpenAIStream } from '@/lib/openai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { task, goals } = await req.json();

    const prompt = `
      Analyze how the following task might align with the given goals. 
      Consider both direct and indirect relationships.
      
      Task: "${task.title}"
      Task Context: ${task.context}

      Goals:
      ${goals
        .map(
          (goal) => `
        - Title: ${goal.title}
        - Description: ${goal.description}
        - Context: ${goal.context}
      `
        )
        .join('\n')}

      For each goal, determine:
      1. If there's any potential alignment (direct or indirect)
      2. A score from 0-100 indicating alignment strength
      3. A brief explanation of how they align

      Consider that tasks often support goals indirectly. For example:
      - Buying equipment/supplies supports related activities
      - Administrative tasks support larger projects
      - Self-care tasks support health and performance goals
      - Learning/preparation tasks support achievement goals

      Provide the analysis in the following JSON format:
      {
        "alignments": [
          {
            "goalId": "goal-id",
            "score": number,
            "explanation": "explanation"
          }
        ]
      }
    `;

    // Your existing OpenAI call logic here...
  } catch (error) {
    console.error('Error in analyze-alignment:', error);
    return NextResponse.json(
      { error: 'Failed to analyze alignment' },
      { status: 500 }
    );
  }
}
