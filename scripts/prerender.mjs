import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');

const routes = [
  '/',
  '/products/hsk1-6',
  '/products/hsk1-3',
  '/products/hsk4-6',
  '/products/hsk1',
  '/products/hsk2',
  '/products/hsk3',
  '/products/hsk4',
  '/products/hsk5',
  '/products/hsk6',
  '/products/starter-sentences',
  '/products/practice-sentences',
  '/products/immersion-sentences',
  '/products/advanced-sentences',
  '/products/pro-sentences',
  '/products/master-sentences',
];

// Simple static file server for the dist directory
function createStaticServer(dir) {
  return createServer((req, res) => {
    let filePath = join(dir, req.url === '/' ? 'index.html' : req.url);

    // SPA fallback: if file doesn't exist, serve index.html
    if (!existsSync(filePath)) {
      filePath = join(dir, 'index.html');
    }

    try {
      const content = readFileSync(filePath);
      const ext = filePath.split('.').pop();
      const mimeTypes = {
        html: 'text/html',
        js: 'application/javascript',
        css: 'text/css',
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        svg: 'image/svg+xml',
        pdf: 'application/pdf',
        json: 'application/json',
        woff2: 'font/woff2',
      };
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      res.end(content);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  });
}

async function prerender() {
  const server = createStaticServer(DIST);
  const port = 4173;

  await new Promise((resolve) => server.listen(port, resolve));
  console.log(`Static server running on http://localhost:${port}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let successCount = 0;

  for (const route of routes) {
    try {
      const page = await browser.newPage();
      await page.goto(`http://localhost:${port}${route}`, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      // Wait a bit for React to fully render
      await page.waitForSelector('#root > *', { timeout: 10000 });

      const html = await page.content();

      // Determine output path
      const outputPath = route === '/'
        ? join(DIST, 'index.html')
        : join(DIST, route, 'index.html');

      const outputDir = dirname(outputPath);
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }

      writeFileSync(outputPath, html);
      successCount++;
      console.log(`  Pre-rendered: ${route}`);

      await page.close();
    } catch (err) {
      console.error(`  Failed: ${route} - ${err.message}`);
    }
  }

  await browser.close();
  server.close();

  console.log(`\nPre-rendering complete: ${successCount}/${routes.length} pages rendered.`);
}

prerender().catch((err) => {
  console.error('Pre-rendering failed:', err);
  process.exit(1);
});
