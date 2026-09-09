/* Screenshot-Werkzeug über das DevTools-Protokoll.
   Anders als --screenshot laufen hier rAF und Timer wirklich.
   node .claude/shot.mjs <url> <datei> <breite> <hoehe> [--full] [--scroll] */
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const [url, out, wArg, hArg, ...flags] = process.argv.slice(2);
const W = Number(wArg || 1440), H = Number(hArg || 900);
const full = flags.includes('--full');
const scroll = flags.includes('--scroll');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9333 + Math.floor(Math.random() * 400);

const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--mute-audio',
  '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-port=' + PORT,
  '--user-data-dir=/tmp/shot-' + PORT,
  'about:blank'
], { stdio: 'ignore' });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function targets() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const j = await r.json();
      const page = j.find(t => t.type === 'page');
      if (page) return page;
    } catch {}
    await sleep(180);
  }
  throw new Error('Chrome nicht erreichbar');
}

const page = await targets();
const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0;
const warte = new Map();
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && warte.has(m.id)) { warte.get(m.id)(m.result); warte.delete(m.id); }
});
await new Promise(r => ws.addEventListener('open', r, { once: true }));

const send = (method, params = {}) => new Promise(res => {
  const n = ++id; warte.set(n, res);
  ws.send(JSON.stringify({ id: n, method, params }));
});

await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', {
  width: W, height: H, deviceScaleFactor: 2, mobile: W < 700
});
await send('Page.navigate', { url });
await sleep(3200);

if (scroll) {
  // einmal langsam durchscrollen, damit alle Auftritte ausgelöst werden
  await send('Runtime.evaluate', { expression: `
    (async () => {
      const h = document.body.scrollHeight;
      for (let y = 0; y < h; y += ${Math.round(H * 0.6)}) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 220));
      }
      window.scrollTo(0, 0);
      await new Promise(r => setTimeout(r, 500));
    })()`, awaitPromise: true });
  await sleep(700);
}

const res = await send('Page.captureScreenshot', {
  format: 'png', captureBeyondViewport: full, optimizeForSpeed: false
});
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, Buffer.from(res.data, 'base64'));
console.log('gespeichert:', out);
ws.close();
chrome.kill();
process.exit(0);
