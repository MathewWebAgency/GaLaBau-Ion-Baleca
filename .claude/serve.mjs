import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, resolve, normalize } from 'node:path';

// site/ ist das Wurzelverzeichnis, genau wie später auf dem Server.
const ROOT = resolve(decodeURIComponent(new URL('../site', import.meta.url).pathname));
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript', '.webp': 'image/webp', '.jpg': 'image/jpeg',
  '.png': 'image/png', '.mp4': 'video/mp4', '.webm': 'video/webm',
  '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.xml': 'application/xml',
  '.txt': 'text/plain', '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.ico': 'image/x-icon',
};

const fehlseite = async (res) => {
  try {
    const body = await readFile(join(ROOT, '404.html'));
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'Content-Length': body.length });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404');
  }
};

createServer(async (req, res) => {
  let datei;
  try {
    const pfad = normalize(decodeURIComponent(req.url.split('?')[0]));
    datei = join(ROOT, pfad);
    if (!datei.startsWith(ROOT)) return fehlseite(res);
    const s = await stat(datei);
    if (s.isDirectory()) datei = join(datei, 'index.html');
  } catch {
    return fehlseite(res);
  }

  let groesse;
  try {
    groesse = (await stat(datei)).size;
  } catch {
    return fehlseite(res);
  }

  const kopf = {
    'Content-Type': TYPES[extname(datei).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-store',
    'Accept-Ranges': 'bytes',
  };

  // Bereichsanfragen richtig beantworten. Ohne das bleibt die Videowiedergabe
  // im Browser hängen, weil er einen Ausschnitt anfordert und die ganze Datei
  // ohne Längenangabe zurückbekommt.
  const bereich = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
  if (bereich && groesse > 0) {
    let von = bereich[1] === '' ? null : Number(bereich[1]);
    let bis = bereich[2] === '' ? null : Number(bereich[2]);
    if (von === null) {              // bytes=-500, die letzten 500
      von = Math.max(0, groesse - (bis || 0));
      bis = groesse - 1;
    } else if (bis === null || bis >= groesse) {
      bis = groesse - 1;
    }
    if (von > bis || von >= groesse) {
      res.writeHead(416, { 'Content-Range': `bytes */${groesse}` });
      return res.end();
    }
    kopf['Content-Range'] = `bytes ${von}-${bis}/${groesse}`;
    kopf['Content-Length'] = bis - von + 1;
    res.writeHead(206, kopf);
    if (req.method === 'HEAD') return res.end();
    return createReadStream(datei, { start: von, end: bis }).pipe(res);
  }

  kopf['Content-Length'] = groesse;
  res.writeHead(200, kopf);
  if (req.method === 'HEAD') return res.end();
  createReadStream(datei).pipe(res);
}).listen(4321, () => console.log('serving', ROOT, 'on http://localhost:4321'));
