import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

type TestCase = {
  task: string;
  goal: string;
  description: string;
  expectedScore: number;
};

const testCases: TestCase[] = [
  {
    task: "Read 'The Phoenix Project'",
    goal: 'Land my first Cyber Security Job',
    description:
      'Complete certifications and necessary learning to transition into cybersecurity',
    expectedScore: 90,
  },
  {
    task: 'Complete AWS Security Certification',
    goal: 'Land my first Cyber Security Job',
    description:
      'Complete certifications and necessary learning to transition into cybersecurity',
    expectedScore: 95,
  },
  {
    task: 'Buy groceries',
    goal: 'Land my first Cyber Security Job',
    description:
      'Complete certifications and necessary learning to transition into cybersecurity',
    expectedScore: 0,
  },
];

const prompts = {
  basic: (task: string, goal: string, description: string) => `
Task: "${task}"
Goal: "${goal}"
Description: "${description}"

How well does this task align with the goal? Provide a score from 0 to 100 and a brief explanation.
`,

  detailed: (task: string, goal: string, description: string) => `
You are an expert career and personal development advisor. Analyze how the following task contributes to achieving the specified goal.

GOAL
Title: ${goal}
Description: ${description}

TASK
${task}

Evaluate the task's alignment with the goal using these criteria:
1. Direct Impact: How directly does this task contribute to the goal?
2. Time Relevance: Is this a timely task for the goal?
3. Resource Efficiency: Is this a good use of time/resources for the goal?

Provide your response in this format:
Score: [0-100]
Explanation: [Your analysis]
`,

  structured: (task: string, goal: string, description: string) => `
Analyze the alignment between task and goal:

Task: "${task}"
Goal: "${goal}"
Context: "${description}"

Requirements:
1. Score must be 0-100
2. High scores (80-100) only for tasks directly contributing to the goal
3. Medium scores (40-79) for indirect but relevant tasks
4. Low scores (1-39) for marginally related tasks
5. Zero (0) for unrelated tasks

Output format:
Score: [number]
Explanation: [1-2 sentences]
`,
};

async function testPrompt(promptVersion: keyof typeof prompts) {
  console.log(`Testing prompt version: ${promptVersion}`);
  console.log('----------------------------------------');

  const results = [];

  for (const testCase of testCases) {
    const prompt = prompts[promptVersion](
      testCase.task,
      testCase.goal,
      testCase.description
    );

    try {
      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt,
        max_tokens: 150,
        temperature: 0.3, // Lower temperature for more consistent results
      });

      const result = response.data.choices[0].text?.trim() || '';

      // Extract score from response
      const scoreMatch = result.match(/Score: (\d+)/);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;

      results.push({
        task: testCase.task,
        expectedScore: testCase.expectedScore,
        actualScore: score,
        difference: Math.abs(testCase.expectedScore - score),
        response: result,
      });
    } catch (error) {
      console.error(`Error testing prompt for task "${testCase.task}":`, error);
    }
  }

  // Calculate average difference from expected scores
  const avgDifference =
    results.reduce((sum, r) => sum + r.difference, 0) / results.length;

  console.log('Results:');
  results.forEach((r) => {
    console.log(`\nTask: ${r.task}`);
    console.log(`Expected Score: ${r.expectedScore}`);
    console.log(`Actual Score: ${r.actualScore}`);
    console.log(`Difference: ${r.difference}`);
    console.log('Response:', r.response);
  });

  console.log(
    `\nAverage difference from expected scores: ${avgDifference.toFixed(2)}`
  );
  return avgDifference;
}

// Function to run all prompt versions and compare results
async function comparePrompts() {
  const results = {};

  for (const version of Object.keys(prompts) as (keyof typeof prompts)[]) {
    console.log(`\nTesting prompt version: ${version}`);
    results[version] = await testPrompt(version);
  }

  console.log('\nFinal Results:');
  Object.entries(results).forEach(([version, avgDiff]) => {
    console.log(`${version}: Average difference = ${avgDiff.toFixed(2)}`);
  });
}

export { comparePrompts, testPrompt };
