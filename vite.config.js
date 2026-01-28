import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [],
    server: {
        hmr: {
            overlay: true,
        },
        watch: {
            usePolling: true,
            interval: 5000,
        },
        port: 3000,
        open: true,
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
    },
    base: './',
})
