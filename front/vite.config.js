/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { transformSync } from '@babel/core';
import path from 'path';
import fs from 'fs';

// https://vite.dev/config/
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// Dev server HTTPS certs, shared with the API (e.g. mkcert localhost).
// Falls back to plain HTTP when absent so the boilerplate runs out of the box.
const certKeyPath = path.resolve(dirname, '../certs/cert.key');
const certCrtPath = path.resolve(dirname, '../certs/cert.crt');
const devCerts = fs.existsSync(certKeyPath) && fs.existsSync(certCrtPath)
  ? { key: fs.readFileSync(certKeyPath), cert: fs.readFileSync(certCrtPath) }
  : undefined;
if (!devCerts) {
  console.warn('[vite] ../certs/cert.{key,crt} not found — dev server runs over HTTP. Generate them (e.g. `mkcert localhost`) to enable HTTPS.');
}

// Backend proxy targets. When the dev server runs on the host, the compose
// services are reached on localhost; when it runs in the front container
// (all-Docker workflow), the compose service names apply — overridden via
// env in compose.yaml (API_PROXY_TARGET / S3_PROXY_TARGET).
const API_PROXY_TARGET = process.env.API_PROXY_TARGET || 'http://localhost:8000';
const S3_PROXY_TARGET = process.env.S3_PROXY_TARGET || 'http://localhost:9000';

// Custom relay plugin with eagerEsModules support (vite-plugin-relay doesn't pass this option)
const relay = {
  name: 'vite:relay',
  transform(src, id) {
    // Only transform source files, not built dist files or node_modules
    if (id.includes('/dist/') || (id.includes('node_modules') && !id.includes('lys-front/src'))) {
      return;
    }
    if (/\.(t|j)sx?$/.test(id) && src.includes('graphql`')) {
      const out = transformSync(src, {
        plugins: [['babel-plugin-relay', { eagerEsModules: true }]],
        code: true,
        filename: id,
        sourceMaps: true,
      });
      if (!out?.code) {
        throw new Error(`vite:relay: Failed to transform ${id}`);
      }
      return { code: out.code, map: out.map };
    }
  },
};

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
      // Force lys-front's peer deps to resolve from this project's node_modules
      // to prevent dual instances when using file: dependency
      'react': path.resolve(dirname, 'node_modules/react'),
      'react-dom': path.resolve(dirname, 'node_modules/react-dom'),
      'react-intl': path.resolve(dirname, 'node_modules/react-intl'),
      'react-relay': path.resolve(dirname, 'node_modules/react-relay'),
      'relay-runtime': path.resolve(dirname, 'node_modules/relay-runtime'),
      'react-router-dom': path.resolve(dirname, 'node_modules/react-router-dom'),
    },
    dedupe: ['react', 'react-dom', 'react-intl', 'react-relay', 'relay-runtime', 'react-router-dom'],
  },
  server: {
    // Bind all interfaces — required when the dev server runs in a container
    host: true,
    headers: {
      "X-Frame-Options": "DENY",
      "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' ws:; img-src 'self' data:; font-src 'self'; frame-ancestors 'none';"
    },
    https: devCerts,
    proxy: {
      '/graphql': {
        target: API_PROXY_TARGET,
        changeOrigin: true,
        cookieDomainRewrite: 'localhost',
        cookiePathRewrite: '/'
      },
      '/sse': {
        target: API_PROXY_TARGET,
        changeOrigin: true,
        cookieDomainRewrite: 'localhost',
        cookiePathRewrite: '/'
      },
      '/auth': {
        target: API_PROXY_TARGET,
        changeOrigin: true,
        cookieDomainRewrite: 'localhost',
        cookiePathRewrite: '/'
      },
      '/s3': {
        target: S3_PROXY_TARGET,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/s3/, '')
      }
    }
  },
  build: {
    sourcemap: false,
  },
  esbuild: {
    pure: ["console.log", "console.warn"],
  },
  plugins: [react(), relay],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        silenceDeprecations: ['color-functions', 'global-builtin', 'import']
      }
    }
  },
  test: {
    // lys-front ships as an externalized ESM package whose peer deps (react-relay…)
    // are CommonJS — inline it so vite-node handles the interop instead of Node.
    server: {
      deps: {
        inline: ['lys-front'],
      },
    },
    projects: [
      // Unit tests project
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: ['node_modules', '**/*.stories.tsx'],
          setupFiles: ['./src/test/setup.ts']
        }
      },
      // Storybook tests project
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook')
          })
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{
              browser: 'chromium'
            }]
          },
          setupFiles: ['.storybook/vitest.setup.ts']
        }
      }
    ]
  }
});
