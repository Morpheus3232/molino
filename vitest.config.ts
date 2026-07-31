import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = {
  resolve: {
    alias: {
      '@': __dirname,
    },
  },
  test: {
    environment: 'node',
    include: ['**/__tests__/**/*.test.ts', '**/*.test.ts'],
    exclude: ['**/e2e/**', '**/node_modules/**'],
  },
};

export default config;
