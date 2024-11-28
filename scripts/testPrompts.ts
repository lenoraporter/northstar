import { comparePrompts } from '@/app/utils/promptTesting';

async function main() {
  console.log('Starting prompt testing...');

  // Test multiple scenarios
  const testCases = [
    {
      task: 'Morning Run',
      goal: 'Complete first marathon under 4:30:00',
    },
    {
      task: 'Run a 5K',
      goal: 'Complete first marathon under 4:30:00',
    },
    {
      task: 'Write documentation',
      goal: 'Improve code quality',
    },
  ];

  for (const testCase of testCases) {
    console.log(`\nTesting: ${testCase.task} → ${testCase.goal}`);
    await comparePrompts(testCase.task, testCase.goal);
  }
}

main().catch(console.error);
