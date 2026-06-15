import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig(({ command, mode }) => {
  return {
    plugins: [
      dts({
        insertTypesEntry: true
      })
    ],
    compilerOptions: {
      composite: true
    },
    build: {
      lib: {
        entry: "src/index.ts",
        // UMD global 名稱：必須是合法的 JS 識別字，且需與 plugin-basic 的
        // rollupOptions.output.globals['@orbcharts/core']（orbchartsCore）一致
        name: 'orbchartsCore',
        formats: ["es", "umd"],
        fileName: format => `orbcharts-core.${format}.js`
      },
    }
  }
})