import react from '@vitejs/plugin-react';
import { UserConfig, ConfigEnv } from 'vite';
import { join } from 'path';
import { mkdirSync } from 'fs';

const srcRoot = join(__dirname, 'src/renderer');
const distDir = join(__dirname, 'dist');
mkdirSync(distDir, { recursive: true });

export default ({ command }: ConfigEnv): UserConfig => {
  // Development
  if (command === 'serve') {
    return {
      root: srcRoot,
      base: '/',
      plugins: [react()],
      resolve: {
        alias: {
          '/@': srcRoot,
          '@renderer': srcRoot
        }
      },
      build: {
        outDir: join(distDir, '/renderer'),
        emptyOutDir: true,
        rollupOptions: {}
      },
      server: {
        port: 3000
      },
      optimizeDeps: {
        exclude: ['path']
      }
    };
  }
  // Production
  return {
    root: srcRoot,
    base: './',
    plugins: [react()],
    resolve: {
      alias: {
        '/@': srcRoot,
        '@renderer': srcRoot
      }
    },
    build: {
      outDir: join(distDir, '/renderer'),
      emptyOutDir: true,
      rollupOptions: {}
    },
    server: {
      port: process.env.PORT === undefined ? 3000 : +process.env.PORT
    },
    optimizeDeps: {
      exclude: ['path']
    }
  };
};
