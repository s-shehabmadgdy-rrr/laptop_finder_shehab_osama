// Small local server for the assignment; no extra libraries needed.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';

const root = process.cwd();
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost');
  const name = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
  const filename = resolve(join(root, '.' + name));

  if (filename !== root && !filename.startsWith(root + sep)) {
    response.writeHead(403);
    response.end('Access denied');
    return;
  }
  if (!types[extname(filename)]) {
    response.writeHead(404);
    response.end('File not found');
    return;
  }
  try {
    const content = await readFile(filename);
    response.writeHead(200, { 'Content-Type': types[extname(filename)] });
    response.end(content);
  } catch {
    response.writeHead(404);
    response.end('File not found');
  }
}).listen(3000, () => {
  console.log('Student Laptop Finder: http://localhost:3000');
});
