import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const src = (path) => fileURLToPath(new URL(`./src/${path}`, import.meta.url));

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@assets': src('assets'),
            '@components': src('components'),
            '@layout': src('layout'),
            '@nav': src('nav'),
            '@pages': src('pages'),
            '@styles': src('styles'),
            '@provider': src('provider'),
            '@hooks': src('hooks'),
        },
    },
    build: {
        outDir: 'build',
        sourcemap: false,
    },
});
