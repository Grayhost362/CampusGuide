import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const publicRoot = join(root, 'public');
const port = Number(process.env.PORT || 3000);
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

const safePath = (pathname) => {
  const decoded = decodeURIComponent(pathname);
  const normalized = normalize(decoded).replace(/^([.][.][/\\])+/, '');
  return join(publicRoot, normalized === '/' ? 'index.html' : normalized);
};

const sendFile = async (res, filePath) => {
  const extension = extname(filePath).toLowerCase();
  res.writeHead(200, {
    'Content-Type': mimeTypes[extension] || 'application/octet-stream',
    'Cache-Control': extension === '.html' || extension === '.json' ? 'no-cache' : 'public, max-age=31536000'
  });
  createReadStream(filePath).pipe(res);
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  if (url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: true, service: 'campusguide' }));
    return;
  }
  try {
    let filePath = safePath(url.pathname);
    try {
      const fileInfo = await stat(filePath);
      if (!fileInfo.isFile()) throw new Error('Not a file');
    } catch {
      filePath = join(publicRoot, 'index.html');
    }
    await sendFile(res, filePath);
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('CampusGuide could not load this page.');
    console.error(error);
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`CampusGuide listening on http://0.0.0.0:${port}`);
});
