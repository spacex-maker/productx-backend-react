import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import autoprefixer from 'autoprefixer';

export default defineConfig(() => {
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
      preprocessorOptions: {
        scss: {
          // 消除 Dart Sass 弃用警告：legacy-js-api（Vite 仍通过旧 API 调用）、import（@coreui 等依赖仍使用 @import）
          silenceDeprecations: ['legacy-js-api', 'import'],
        },
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
      hmr: {
        overlay: true,
      },
      watch: {
        usePolling: false,
        interval: 100,
      },
    },
  };
});
