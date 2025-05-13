import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        testTimeout: 30 * 1000,
        hookTimeout: 60 * 1000,
        hideSkippedTests: true,
        passWithNoTests: true,
        environment: 'node',
        include: ['src/**/*.spec.ts'],
        coverage: {
            reporter: ['text', 'json', 'html'],
        },
    },
});
