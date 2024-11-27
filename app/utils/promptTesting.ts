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

async function testPrompt(version: keyof typeof prompts) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are an AI assistant specialized in analyzing task-goal alignment.',
        },
        {
          role: 'user',
          content: prompts[version],
        },
      ],
      max_tokens: 150,
      temperature: 0.3,
    });

    // Extract the score from the response
    return Math.random() * 10; // Replace with actual scoring logic
  } catch (error) {
    console.error(`Error testing prompt ${version}:`, error);
    return 0;
  }
}

export async function comparePrompts() {
  const results: Record<keyof typeof prompts, number> = {} as Record<
    keyof typeof prompts,
    number
  >;

  for (const version of Object.keys(prompts) as (keyof typeof prompts)[]) {
    console.log(`\nTesting prompt version: ${version}`);
    results[version] = await testPrompt(version);
  }

  console.log('\nFinal Results:');
  Object.entries(results).forEach(([version, score]) => {
    console.log(`${version}: Score = ${score.toFixed(2)}`);
  });

  return results;
}
