import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vitePluginRequire from "vite-plugin-require";
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin({
      exclude: ['electron-store']
    })]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },

  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    css: {
      // postcss: './postcss.js',
      preprocessorOptions: {
        styl: {
          // additionalData: '@import "tailwindcss/tailwind.css";'
        }
      }
    },
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'src/renderer/src/assets/icons')],
        symbolId: 'icon-[name]',
      }),
      vitePluginRequire({
        // @fileRegex RegExp
        // optional：default file processing rules are as follows
        // fileRegex:/(.jsx?|.tsx?|.vue)$/

              // Conversion mode. The default mode is import
              // importMetaUrl | import
              // importMetaUrl see https://vitejs.cn/guide/assets.html#new-url-url-import-meta-url
              // translateType: "importMetaUrl" | "import";
      }),

    ]
  }
})
