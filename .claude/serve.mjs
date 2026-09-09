import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, resolve } from 'node:path';
// site/ ist das Wurzelverzeichnis, genau wie später auf dem Server.
const ROOT = resolve(decodeURIComponent(new URL('../site', import.meta.url).pathname));
const TYPES = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.mp4':'video/mp4','.woff2':'font/woff2','.svg':'image/svg+xml','.xml':'application/xml','.txt':'text/plain','.json':'application/json','.ico':'image/x-icon'};
createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(req.url.split('?')[0]);
    let f = join(ROOT, p);
    const s = await stat(f).catch(() => null);
    if (s && s.isDirectory()) f = join(f, 'index.html');
    const body = await readFile(f);
    res.writeHead(200, {'Content-Type': TYPES[extname(f).toLowerCase()] || 'application/octet-stream', 'Cache-Control':'no-store', 'Accept-Ranges':'bytes'});
    res.end(body);
  } catch (e) {
    try {
      const body = await readFile(join(ROOT, '404.html'));
      res.writeHead(404, {'Content-Type':'text/html; charset=utf-8'});
      res.end(body);
    } catch { res.writeHead(404, {'Content-Type':'text/plain'}); res.end('404'); }
  }
}).listen(4321, () => console.log('serving', ROOT, 'on http://localhost:4321'));
