const { defineConfig } = require('vite')
const react = require('@vitejs/plugin-react')
const path = require('node:path')
const autoprefixer = require('autoprefixer')

module.exports = defineConfig(() => {
  return {
    base: './',
    build: {
      outDir: 'build',
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
      },
      postcss: {
        plugins: [
          autoprefixer({}),
        ],
      },
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      force: true,
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: [
        {
          find: 'src/',
          replacement: path.resolve(__dirname, 'src') + '/',
        },
      ],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss'],
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      proxy: {},
    },
  }
})
