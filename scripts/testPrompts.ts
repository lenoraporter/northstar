import { comparePrompts } from '../utils/promptTesting';

async function main() {
  console.log('Starting prompt testing...');
  await comparePrompts();
}

main().catch(console.error);
