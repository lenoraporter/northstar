import OpenAI from 'openai';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const prompts = {
  basic: `Given a task and a set of goals, analyze how well the task aligns with achieving these goals. 
         Rate the alignment on a scale of 1-10 and explain why.`,

  detailed: `Analyze how a given task contributes to achieving specific goals. Consider:
            - Direct impact on goal progress
            - Time efficiency
            - Resource requirements
            - Potential obstacles
            Rate alignment on a scale of 1-10 and provide detailed reasoning.`,

  structured: `Evaluate the alignment between a task and goals using the following structure:
              1. Direct Impact Analysis:
                 - How directly does this task contribute to each goal?
                 - What specific outcomes support goal achievement?
              
              2. Efficiency Assessment:
                 - Time investment vs. expected returns
                 - Resource requirements
              
              3. Risk Evaluation:
                 - Potential obstacles or challenges
                 - Mitigation strategies
              
              4. Overall Alignment Score:
                 - Rate on a scale of 1-10
                 - Provide specific justification
                 - Suggest potential improvements`,
};

async function testPrompt(
  version: keyof typeof prompts,
  task: string,
  goal: string
) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant that precisely analyzes task-goal alignment.

Scoring Guidelines:
100: Perfect alignment - The task is exactly what's needed for the goal
  Examples: Marathon-distance training run → Run a marathon
           Full project implementation → Complete project deliverable
           Full language immersion → Achieve language fluency

70-99: Strong alignment - The task builds directly towards the goal but isn't complete
  Examples: 5K run → Marathon goal (builds endurance but wrong distance)
           Half-marathon → Marathon goal
           Code module → Complete project

40-69: Moderate alignment - The task helps but isn't optimal
  Examples: Morning jog → Marathon goal
           Reading documentation → Project completion
           Flashcards → Language fluency

0-39: Weak or no alignment

Always consider:
1. Scale/scope match (Is it the right size/intensity?)
2. Specificity match (Is it targeting the exact skill needed?)
3. Progression relevance (Is it at the right level?)

Return your response as:
SCORE: [number 1-100]
REASONING: [explanation including scale/scope/specificity analysis]`,
        },
        {
          role: 'user',
          content: `${prompts[version]}
            
Task: ${task}
Goal: ${goal}

Evaluate the alignment of this task with the goal.`,
        },
      ],
      max_tokens: 300,
      temperature: 0.2,
    });

    const content = response.choices[0]?.message?.content || '';
    const scoreMatch = content.match(/SCORE:\s*(\d+)/);
    const score = scoreMatch ? parseInt(scoreMatch[1], 10) / 10 : 5;

    // Log the full reasoning for debugging
    console.log(`\nFull response for ${task} → ${goal}:`);
    console.log(content);

    return score;
  } catch (error) {
    console.error(`Error testing prompt ${version}:`, error);
    return 0;
  }
}

export async function comparePrompts(task: string, goal: string) {
  const results: Record<keyof typeof prompts, number> = {} as Record<
    keyof typeof prompts,
    number
  >;

  for (const version of Object.keys(prompts) as (keyof typeof prompts)[]) {
    console.log(`\nTesting prompt version: ${version}`);
    results[version] = await testPrompt(version, task, goal);
  }

  console.log('\nFinal Results:');
  Object.entries(results).forEach(([version, score]) => {
    console.log(`${version}: Score = ${score.toFixed(2)}`);
  });

  return results;
}

// Example usage:
// comparePrompts('Morning Run', 'Complete first marathon under 4:30:00');
// comparePrompts('Write unit tests', 'Improve code quality');
