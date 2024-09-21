import * as esbuild from 'esbuild';

await esbuild.build({
    entryPoints: ['src/**/*.ts'],
    bundle: false,
    outdir: 'dist',
    format: 'esm',
    outExtension: { '.js': '.mjs' },
    keepNames: true,
    target: 'node22',
    platform: 'node',
    packages: 'external'
});
