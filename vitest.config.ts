import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = {
  resolve: {
    alias: {
      '@': __dirname,
      // `server-only` throws outside a React Server runtime; in vitest we want
      // to import the data/engine modules directly, so point it at a no-op.
      'server-only': path.join(__dirname, 'test/server-only-stub.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['**/__tests__/**/*.test.{ts,tsx}', '**/*.test.{ts,tsx}'],
    exclude: ['**/e2e/**', '**/node_modules/**', '**/.claude/worktrees/**', '**/.next/**', '**/playwright-report/**', '**/test-results/**'],
  },
};

export default config;
