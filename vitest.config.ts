import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        fileParallelism: false,
        maxConcurrency: 1,
        globalSetup: path.join(__dirname, 'src/infra/tests/setup.ts'),
        coverage: {
            thresholds: {
                lines: 80,
                functions: 80,
                statements: 80,
                branches: 80
            },
            include: ['src/**/*'],
            exclude: [
                'src/infra/tests/**/*',
                'src/infra/openapi/**/*',
                'src/infra/logger/**/*',
                'src/infra/config/**/*',
                'src/infra/auth/**/*',
                'src/**/schema.ts',
                'src/app.ts',
                'src/index.ts',
                'src/telemetry.ts'
            ],
            enabled: false,
            all: true,
            reporter: ['lcov'],
            provider: 'v8'
        }
    }
});
