import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // tsconfig's "jsx": "preserve" leaves JSX for Next's compiler; tests that
  // render a page to static markup need esbuild to compile it the way Next
  // does, with React's automatic runtime.
  esbuild: {
    jsx: 'automatic',
  },
  resolve: {
    // Mirror the tsconfig "@/*" -> "./*" path alias so tests can import the real
    // page and lib modules (which use "@/..." imports) instead of re-parsing
    // their source text.
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['**/__tests__/**/*.test.ts'],
  },
});
