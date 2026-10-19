// Run against an isolated local browser profile; never connects to the live Hub.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import {spawn} from 'node:child_process';
const candidates=[process.env.LAYOUT_BROWSER,'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe','C:/Program Files/Microsoft/Edge/Application/msedge.exe','C:/Program Files/Google/Chrome/Application/chrome.exe'].filter(Boolean);
const executable=candidates.find(p=>fs.existsSync(p));
if(!executable)throw new Error('Set LAYOUT_BROWSER to a Chromium browser executable.');
const artifacts=fs.mkdtempSync(path.join(os.tmpdir(),'promptcraft-layout-'));
console.log('Layout browser artifacts: '+artifacts);
const root=path.resolve('site');
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname.startsWith('/.netlify/')){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({initialized:false}));return;}
 const file=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404);res.end();return;}
 res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'application/javascript','.png':'image/png'})[path.extname(file)]||'application/octet-stream');
 res.end(fs.readFileSync(file));
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=spawn(executable,['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=0','--user-data-dir='+path.join(artifacts,'profile'),'about:blank'],{windowsHide:true,stdio:'ignore'});
let ws;
try{
 const portFile=path.join(artifacts,'profile','DevToolsActivePort');
 for(let n=0;n<150&&!fs.existsSync(portFile);n++)await new Promise(r=>setTimeout(r,100));
 if(!fs.existsSync(portFile))throw new Error('Browser did not start.');
 const port=fs.readFileSync(portFile,'utf8').split('\n')[0];
 const pages=await (await fetch(`http://127.0.0.1:${port}/json/list`,{signal:AbortSignal.timeout(10000)})).json();
 ws=new WebSocket(pages.find(p=>p.type==='page').webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(new Error('Browser connection timed out')),10000);ws.addEventListener('open',()=>{clearTimeout(timeout);resolve()},{once:true});ws.addEventListener('error',reject,{once:true});});
 let nextId=0;const pending=new Map(),errors=[];
 ws.addEventListener('message',event=>{const data=JSON.parse(event.data);if(data.method==='Runtime.exceptionThrown')errors.push(data.params.exceptionDetails.text);if(data.id){const p=pending.get(data.id);pending.delete(data.id);data.error?p.reject(new Error(JSON.stringify(data.error))):p.resolve(data.result)}});
 const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++nextId;const timeout=setTimeout(()=>{pending.delete(id);reject(new Error('Browser command timed out: '+method))},10000);pending.set(id,{resolve:value=>{clearTimeout(timeout);resolve(value)},reject:error=>{clearTimeout(timeout);reject(error)}});ws.send(JSON.stringify({id,method,params}));});
 const evaluate=async expression=>{const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw new Error(JSON.stringify(result.exceptionDetails));return result.result.value;};
 await send('Runtime.enable');await send('Page.enable');
 await send('Page.navigate',{url:`http://127.0.0.1:${server.address().port}/#research-library`});
 for(let n=0;n<100;n++){if(await evaluate("document.querySelectorAll('.source-card').length===13"))break;await new Promise(r=>setTimeout(r,100));}
 if(!await evaluate("document.querySelectorAll('.source-card').length===13"))throw new Error('Library did not render.');
 if(process.argv.includes('--citations')){
  const {default:audit}=await import('./audit-citation-starter.mjs');
  await audit({send,evaluate,artifacts});
 }else{
 const results=[];
 const measure=async(name,width)=>{
  const result=await evaluate(`(()=>{const width=document.documentElement.clientWidth;return {viewport:width,page:document.documentElement.scrollWidth,overflow:[...document.querySelectorAll('body *')].filter(el=>{const r=el.getBoundingClientRect();return el.checkVisibility()&&r.width&&r.height&&(r.right>width+1||r.left< -1)&&!el.closest('.tabs')}).slice(0,12).map(el=>({tag:el.tagName,id:el.id,class:el.className,width:Math.round(el.getBoundingClientRect().width),right:Math.round(el.getBoundingClientRect().right)}))}})()`);
  results.push({name,width,...result});
 };
 for(const width of [320,390,560,768,820,900,1024,1440]){
  await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
  for(const view of ['log','visual','research','plan','backups']){
   await evaluate(`activateMainView('${view}',{updateUrl:false,scroll:false});window.scrollTo(0,0)`);
   await measure(view,width);
  }
  await evaluate("activateMainView('research',{updateUrl:false,scroll:false});document.querySelector('#researchArchive').open=true;document.querySelector('.source-optional-details').open=true;document.querySelector('#cloudPanel').classList.remove('hidden')");
  await measure('expanded-research-and-cloud',width);
  await evaluate("document.querySelector('#cloudPanel').classList.add('hidden');useSourceInPaper(state.sources[0].id)");
  await measure('paper-use-editor',width);
  await evaluate("clearPaperUse();window.scrollTo(0,0)");
  if(width===390||width===1440){const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(artifacts,`research-${width}.png`),Buffer.from(shot.data,'base64'));}
 }
 fs.writeFileSync(path.join(artifacts,'results.json'),JSON.stringify({results,errors},null,2));
 const failures=results.filter(r=>r.page>r.viewport+1||r.overflow.length);
 console.log(JSON.stringify({artifacts,checks:results.length,failures,errors},null,2));
 if(failures.length||errors.length)process.exitCode=1;
 }
}finally{ws?.close();browser.kill();server.closeAllConnections();server.close();}
