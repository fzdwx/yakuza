import path from 'node:path'
import {defineConfig} from 'vite'
import renderer from 'vite-plugin-electron-renderer'
import react from "@vitejs/plugin-react";
import UnoCSS from "unocss/vite";

export default defineConfig({
    resolve: {
        alias: {
            '@': path.join(__dirname, 'src')
        },
    },
    plugins: [
        react(),
        UnoCSS(),
        renderer(),
    ],
    build: {
        outDir: 'dist',
        emptyOutDir: false,
        minify: false,
        rollupOptions: {
            input: path.join(__dirname, 'src/settings.html'),
        },
    },
    esbuild: {
        target: 'node12',
    },
})