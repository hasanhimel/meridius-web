/// <reference types="vitest" />
import type { IncomingMessage, ServerResponse } from 'http';
import { createServer, defineConfig, loadEnv, type Plugin, type ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Local stand-in for Vercel's functions, in both `vite` (dev) and
 * `vite preview`: requests to /api/<name> run the handler in api/<name>.ts,
 * with server-only variables from .env.local in process.env. Files starting
 * with "_" are never routed, as on Vercel. Never part of a build.
 */
function localApi(mode: string): Plugin {
  type Load = (path: string) => Promise<{ default: (req: IncomingMessage, res: ServerResponse) => unknown }>;

  const loadServerEnv = () => {
    const env = loadEnv(mode, process.cwd(), '');
    for (const [k, v] of Object.entries(env)) if (!k.startsWith('VITE_') && process.env[k] === undefined) process.env[k] = v;
  };

  const handle = (load: Load, log: (msg: string) => void) => async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const path = req.url?.split('?')[0] ?? '';
    const match = /^\/api\/([a-z0-9/_-]+)$/i.exec(path);
    if (!match || match[1].split('/').some((part) => part.startsWith('_'))) return next();
    try {
      const mod = await load(`/api/${match[1]}.ts`);
      await mod.default(req, res);
    } catch (err) {
      log(String(err));
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Local API error' }));
      }
    }
  };

  return {
    name: 'meridius-local-api',
    configureServer(server) {
      loadServerEnv();
      server.middlewares.use(handle((p) => server.ssrLoadModule(p) as ReturnType<Load>, (m) => server.config.logger.error(m)));
    },
    configurePreviewServer(server) {
      loadServerEnv();
      // The preview server has no module loader; borrow one from a bare,
      // middleware-mode Vite server, created on the first API call.
      let loader: Promise<ViteDevServer> | null = null;
      const load: Load = async (p) => {
        loader ??= createServer({ configFile: false, appType: 'custom', server: { middlewareMode: true, hmr: false }, logLevel: 'error' });
        return (await loader).ssrLoadModule(p) as ReturnType<Load>;
      };
      server.middlewares.use(handle(load, (m) => server.config.logger.error(m)));
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), localApi(mode)],
  server: {
    port: 3000,
    open: false,
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    globals: true,
    // Tests never talk to a real project, whatever .env.local holds.
    env: { VITE_SUPABASE_URL: '', VITE_SUPABASE_ANON_KEY: '' },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-gsap': ['gsap', 'lenis'],
          'vendor-motion': ['framer-motion'],
          'vendor-icons': ['lucide-react'],
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
    },
  },
}));
