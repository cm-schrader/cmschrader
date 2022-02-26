import { resolve } from 'path'
import { defineConfig } from 'rollup'

const root = resolve(__dirname, "src")
const outDir =  resolve(__dirname, "docs")

export default defineConfig({
    root,
    build: {
        outDir,
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(root, "index.html"),
                page404: resolve(root, "404.html"),
                wip: resolve(root, "wip", "index.html"),
                wolf: resolve(root, "wolf", "index.html"),
            }
        }
    }
})