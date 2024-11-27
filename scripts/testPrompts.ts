import { comparePrompts } from '@/app/utils/promptTesting';

async function main() {
  console.log('Starting prompt testing...');
  await comparePrompts();
}

main().catch(console.error);
