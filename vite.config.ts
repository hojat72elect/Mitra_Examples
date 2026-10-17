import {defineConfig} from 'vite';
import {resolve} from 'path';
import {existsSync, readdirSync, readFileSync} from 'fs';

// Custom plugin to handle .tsx files as static assets
function tiledTsxPlugin() {
  return {
    name: 'tiled-tsx',
    enforce: 'pre',
    load(id: string) {
      // Load .tsx files in assets directories as raw text before TypeScript transformation
      if (id.includes('/assets/') && id.endsWith('.tsx')) {
        return {
          code: `export default ${JSON.stringify(readFileSync(id, 'utf-8'))};`,
          map: null
        };
      }
    },
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.url && req.url.includes('/assets/') && req.url.endsWith('.tsx')) {
          const possiblePaths = [
            resolve(process.cwd(), req.url.startsWith('/') ? req.url.slice(1) : req.url),
            resolve(process.cwd(), 'examples', req.url.startsWith('/') ? req.url.slice(1) : req.url),
            resolve(process.cwd(), req.url)
          ];
          
          for (const filePath of possiblePaths) {
            if (existsSync(filePath)) {
              res.setHeader('Content-Type', 'application/xml');
              res.end(readFileSync(filePath, 'utf-8'));
              return;
            }
          }
        }
        next();
      });
    }
  };
}

// Automatically discover all example HTML files in the examples/ directory.
// Each example should have its own folder: examples/<name>/index.html
function discoverExamples(): Record<string, string> {
    const examplesDir = resolve(import.meta.dirname, 'examples');
    const inputs: Record<string, string> = {};

    if (!existsSync(examplesDir)) {
        return inputs;
    }

    for (const entry of readdirSync(examplesDir, {withFileTypes: true})) {
        if (entry.isDirectory()) {
            const htmlPath = resolve(examplesDir, entry.name, 'index.html');
            if (existsSync(htmlPath)) {
                inputs[entry.name] = htmlPath;
            }
        }
    }

    return inputs;
}

export default defineConfig({
    plugins: [tiledTsxPlugin()],
    assetsInclude: ['**/assets/**/*.tsx'],
    build: {
        rollupOptions: {
            input: discoverExamples(),
        },
    },
});
