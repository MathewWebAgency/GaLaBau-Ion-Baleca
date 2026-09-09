import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
const [url, scriptFile, wArg, hArg] = process.argv.slice(2);
const W = Number(wArg||1440), H = Number(hArg||900);
const PORT = 9800 + Math.floor(Math.random()*300);
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ['--headless=new','--disable-gpu','--hide-scrollbars','--mute-audio','--no-first-run',
   '--remote-debugging-port='+PORT,'--user-data-dir=/tmp/probe-'+PORT,'about:blank'], {stdio:'ignore'});
const sleep = ms => new Promise(r=>setTimeout(r,ms));
let page;
for (let i=0;i<60;i++){ try{ const j=await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
  page=j.find(t=>t.type==='page'); if(page) break; }catch{} await sleep(180); }
const ws = new WebSocket(page.webSocketDebuggerUrl); let id=0; const w=new Map();
ws.addEventListener('message', e=>{ const m=JSON.parse(e.data); if(m.id&&w.has(m.id)){w.get(m.id)(m);w.delete(m.id);} });
await new Promise(r=>ws.addEventListener('open',r,{once:true}));
const send=(method,params={})=>new Promise(res=>{const n=++id;w.set(n,res);ws.send(JSON.stringify({id:n,method,params}));});
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride',{width:W,height:H,deviceScaleFactor:1,mobile:W<700});
if (process.env.CPU) await send('Emulation.setCPUThrottlingRate',{rate:Number(process.env.CPU)});
if (process.env.RM) await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
if (process.env.NOJS) await send('Emulation.setScriptExecutionDisabled',{value:true});
await send('Page.navigate',{url});
await sleep(3500);
const r = await send('Runtime.evaluate',{expression:readFileSync(scriptFile,'utf8'),awaitPromise:true,returnByValue:true});
console.log(JSON.stringify(r.result?.result?.value ?? r.result, null, 2));
ws.close(); chrome.kill(); process.exit(0);
