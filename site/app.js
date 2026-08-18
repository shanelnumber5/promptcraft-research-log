
const PHASES=['Conceptualization','Design','Prototype','Iteration','Testing','Reflection','Key Decision','Problem / Challenge'];
const LEGACY_PHASE={Decision:'Key Decision',Problem:'Problem / Challenge'};
const SOURCE_FOLDERS=[
  'AI Literacy & Prompt Engineering',
  'AI Overreliance & Critical Evaluation',
  'Game-Based & Simulation Learning',
  'Instructional Design & OSCQR',
  'Synchronous vs Asynchronous Design'
];
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const clone=o=>JSON.parse(JSON.stringify(o));
const uuid=()=>crypto.randomUUID?crypto.randomUUID():'id-'+Date.now()+'-'+Math.random().toString(16).slice(2);
const today=()=>new Date().toISOString().slice(0,10);
const humanDate=d=>{if(!d)return''; if(/^\d{4}-\d{2}-\d{2}$/.test(d)){const x=new Date(d+'T12:00:00');return x.toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'})} return d};
const isoDate=d=>{if(/^\d{4}-\d{2}-\d{2}$/.test(d))return d; const x=new Date(d); return isNaN(x)?today():x.toISOString().slice(0,10)};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtBytes=n=>n<1024?`${n} B`:n<1048576?`${(n/1024).toFixed(1)} KB`:`${(n/1048576).toFixed(1)} MB`;
const STORAGE_KEY='promptcraft-hub-state-v1';
const ADMIN_KEY_STORAGE='pc-admin-key';
const UNSYNCED_KEY='pc-cloud-unsynced';
let state=loadLocal();
let cloud=false;
let syncing=false;
let adminKey=localStorage.getItem(ADMIN_KEY_STORAGE)||sessionStorage.getItem(ADMIN_KEY_STORAGE)||'';

function normalizeSeed(seed){if(!seed||!Array.isArray(seed.logs))throw new Error('PromptCraft base data failed to load. Check that seed-data.js is deployed beside app.js.');const x=clone(seed); x.logs=x.logs.map((e,i)=>({...e,id:e.id||'seed-log-'+i,phase:LEGACY_PHASE[e.phase]||e.phase,date:isoDate(e.date)})); x.sources=x.sources.map((s,i)=>({...s,id:s.id||'seed-source-'+i})); x.backups=x.backups||[]; return x}
function isMissing(v){return v===undefined||v===null||v===''||(Array.isArray(v)&&v.length===0)}
function mergeRecord(base,saved,forceKeys=[]){const out={...clone(base),...(saved||{})};for(const [k,v] of Object.entries(base)){if(isMissing(saved?.[k]))out[k]=clone(v)}for(const k of forceKeys){if(base[k]!==undefined)out[k]=clone(base[k])}return out}
function mergeCollection(baseItems,savedItems,keyFn,forceKeys=[]){const saved=Array.isArray(savedItems)?savedItems:[];const used=new Set();const merged=baseItems.map(base=>{const key=keyFn(base);const idx=saved.findIndex((item,i)=>!used.has(i)&&keyFn(item)===key);if(idx<0)return clone(base);used.add(idx);return mergeRecord(base,saved[idx],forceKeys)});saved.forEach((item,i)=>{if(!used.has(i))merged.push(item)});return merged}
function mergeBaseData(saved){
 const seed=normalizeSeed(window.PROMPTCRAFT_SEED),x=(saved&&typeof saved==='object')?clone(saved):{};
 x.logs=mergeCollection(seed.logs,x.logs,e=>`${isoDate(e.date)}|${String(e.title||'').trim().toLowerCase()}`);
 x.sources=mergeCollection(seed.sources,x.sources,s=>String(s.title||'').trim().toLowerCase(),['theme','archiveFile']);
 x.themes=mergeCollection(seed.themes,x.themes,t=>String(t.theme||'').trim().toLowerCase());
 x.outline=mergeCollection(seed.outline,x.outline,o=>`${String(o.chapter||'').trim().toLowerCase()}|${String(o.section||'').trim().toLowerCase()}`);
 x.reading=mergeCollection(seed.reading,x.reading,r=>`${String(r.phase||'').trim().toLowerCase()}|${String(r.reading||'').trim().toLowerCase()}`);
 if(!Array.isArray(x.backups))x.backups=[];
 return x
}
function loadLocal(){try{const raw=localStorage.getItem(STORAGE_KEY);if(raw)return mergeBaseData(JSON.parse(raw))}catch{}return normalizeSeed(window.PROMPTCRAFT_SEED)}
function persistLocal(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
function recordKey(type,item){
 if(type==='logs')return item.id||`${isoDate(item.date)}|${String(item.title||'').trim().toLowerCase()}`;
 if(type==='sources')return item.id||String(item.title||'').trim().toLowerCase();
 if(type==='themes')return item.id||String(item.theme||'').trim().toLowerCase();
 if(type==='outline')return item.id||`${String(item.chapter||'').trim().toLowerCase()}|${String(item.section||'').trim().toLowerCase()}`;
 if(type==='reading')return item.id||`${String(item.phase||'').trim().toLowerCase()}|${String(item.reading||'').trim().toLowerCase()}`;
 return item.id||`${item.version||''}|${item.fileName||''}|${item.created||''}`;
}
function semanticKey(type,item){
 if(type==='logs')return `${isoDate(item.date)}|${String(item.title||'').trim().toLowerCase()}`;
 if(type==='sources')return String(item.title||'').trim().toLowerCase();
 if(type==='themes')return String(item.theme||'').trim().toLowerCase();
 if(type==='outline')return `${String(item.chapter||'').trim().toLowerCase()}|${String(item.section||'').trim().toLowerCase()}`;
 if(type==='reading')return `${String(item.phase||'').trim().toLowerCase()}|${String(item.reading||'').trim().toLowerCase()}`;
 return item.id||`${item.version||''}|${item.fileName||''}|${item.created||''}`;
}
function syncCollection(type,localItems,remoteItems){
 const local=Array.isArray(localItems)?localItems:[],remote=Array.isArray(remoteItems)?remoteItems:[];
 const out=[],usedRemote=new Set();
 for(const l of local){
   let ri=remote.findIndex((r,i)=>!usedRemote.has(i)&&recordKey(type,r)===recordKey(type,l));
   if(ri<0)ri=remote.findIndex((r,i)=>!usedRemote.has(i)&&semanticKey(type,r)===semanticKey(type,l));
   if(ri<0){out.push(clone(l));continue}
   usedRemote.add(ri);const r=remote[ri],lt=l.updatedAt||l.created||'',rt=r.updatedAt||r.created||'';
   if(lt&&rt&&lt!==rt)out.push(clone(lt>rt?l:r));
   else out.push({...clone(r),...clone(l)});
 }
 remote.forEach((r,i)=>{if(!usedRemote.has(i))out.push(clone(r))});
 return out
}
function normalizeDeleted(x){
 const d=x&&typeof x==='object'?x:{};
 return {logs:Array.isArray(d.logs)?d.logs:[],sources:Array.isArray(d.sources)?d.sources:[],backups:Array.isArray(d.backups)?d.backups:[]}
}
function mergeDeleted(a,b){
 const out=normalizeDeleted(a),other=normalizeDeleted(b);
 for(const type of ['logs','sources','backups']){
   const map=new Map();
   [...out[type],...other[type]].forEach(t=>{const k=t.id||t.key;if(!k)return;const prev=map.get(k);if(!prev||(t.deletedAt||'')>(prev.deletedAt||''))map.set(k,t)});
   out[type]=[...map.values()];
 }
 return out
}
function applyTombstones(x){
 x.deleted=normalizeDeleted(x.deleted);
 for(const type of ['logs','sources','backups']){
   const tombs=x.deleted[type]||[];
   x[type]=(x[type]||[]).filter(item=>!tombs.some(t=>(t.id&&t.id===item.id)||(t.key&&t.key===semanticKey(type,item))));
 }
 return x
}
function mergeSyncStates(localState,remoteState){
 const l=mergeBaseData(localState||{}),r=mergeBaseData(remoteState||{});
 const out={...clone(r),...clone(l)};
 for(const type of ['logs','sources','themes','outline','reading','backups'])out[type]=syncCollection(type,l[type],r[type]);
 out.deleted=mergeDeleted(l.deleted,r.deleted);
 return applyTombstones(out)
}
function addTombstone(type,item){
 state.deleted=normalizeDeleted(state.deleted);
 state.deleted[type].push({id:item?.id||'',key:semanticKey(type,item||{}),deletedAt:new Date().toISOString()});
}
async function api(url,opt={}){opt.headers={...(opt.headers||{}),'Content-Type':'application/json'};if(adminKey)opt.headers['X-PromptCraft-Key']=adminKey;const r=await fetch(url,opt);const data=await r.json().catch(()=>({}));if(!r.ok)throw new Error(data.error||`Request failed (${r.status})`);return data}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2300)}
function setStorageBadge(){
 const b=$('#storageBadge'),btn=$('#connectBtn'),syncBtn=$('#syncBtn');
 const unsynced=localStorage.getItem(UNSYNCED_KEY)==='1';
 if(cloud){b.textContent=unsynced?'Cloud connected · changes pending':'Cloud synced';b.style.color=unsynced?'#e0bb77':'var(--ok)';btn.textContent='Cloud settings';syncBtn?.classList.remove('hidden')}
 else{b.textContent=adminKey?'Local fallback · reconnecting':'Local browser only';b.style.color='';btn.textContent='Connect cloud';syncBtn?.classList.add('hidden')}
}
async function persist(){
 persistLocal();
 if(!cloud){localStorage.setItem(UNSYNCED_KEY,'1');setStorageBadge();return}
 try{
   syncing=true;setStorageBadge();
   const remote=await api('/.netlify/functions/state');
   state=remote.initialized&&remote.state?mergeSyncStates(state,remote.state):mergeBaseData(state);
   await api('/.netlify/functions/state',{method:'POST',body:JSON.stringify({state})});
   persistLocal();localStorage.removeItem(UNSYNCED_KEY);
 }catch(e){
   localStorage.setItem(UNSYNCED_KEY,'1');toast('Saved locally; cloud sync will retry');console.error(e)
 }finally{syncing=false;setStorageBadge()}
}

// IndexedDB stores backup bytes in local mode.
function db(){return new Promise((res,rej)=>{const r=indexedDB.open('promptcraft-hub',1);r.onupgradeneeded=()=>r.result.createObjectStore('files');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function idbPut(k,v){const d=await db();return new Promise((res,rej)=>{const tx=d.transaction('files','readwrite');tx.objectStore('files').put(v,k);tx.oncomplete=res;tx.onerror=()=>rej(tx.error)})}
async function idbGet(k){const d=await db();return new Promise((res,rej)=>{const tx=d.transaction('files');const r=tx.objectStore('files').get(k);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function idbDelete(k){const d=await db();return new Promise((res,rej)=>{const tx=d.transaction('files','readwrite');tx.objectStore('files').delete(k);tx.oncomplete=res;tx.onerror=()=>rej(tx.error)})}

function initSelects(){const phaseOpts=PHASES.map(x=>`<option>${x}</option>`).join(''); $('#logPhase').innerHTML=phaseOpts;$('#backupPhase').innerHTML=phaseOpts;$('#logFilter').innerHTML='<option value="">All phases</option>'+phaseOpts;const themeOpts=SOURCE_FOLDERS.map(x=>`<option>${esc(x)}</option>`).join('');$('#sourceTheme').innerHTML=themeOpts;$('#sourceThemeFilter').innerHTML='<option value="">All source folders</option>'+themeOpts}
function render(){initSelects();renderLogs();renderSources();renderPlans();renderBackups();setStorageBadge()}

function renderLogs(){let items=[...state.logs].sort((a,b)=>(b.date||'').localeCompare(a.date||''));const q=$('#logSearch').value.toLowerCase().trim(),phase=$('#logFilter').value;if(q)items=items.filter(e=>JSON.stringify(e).toLowerCase().includes(q));if(phase)items=items.filter(e=>e.phase===phase);$('#logCount').textContent=state.logs.length;$('#phaseCount').textContent=new Set(state.logs.map(e=>e.phase)).size;$('#logList').innerHTML=items.length?items.map(e=>`<article class="card"><div class="card-head"><div><span class="phase">${esc(e.phase)}</span><h3>${esc(e.title)}</h3><div class="meta">${esc(humanDate(e.date))}</div></div></div><div class="card-body"><div><h4>What happened</h4><p>${esc(e.what)}</p></div><div><h4>Why / rationale & reflection</h4><p>${esc(e.why)}</p></div></div><div class="tags">${(e.tags||[]).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div><div class="card-actions"><button class="ghost" onclick="editLog('${e.id}')">Edit</button><button class="ghost danger" onclick="deleteLog('${e.id}')">Delete</button></div></article>`).join(''):'<div class="empty">No matching development entries.</div>'}
function clearLog(){Object.assign($('#logForm'),{});$('#logId').value='';$('#logDate').value=today();$('#logPhase').value='Iteration';$('#logTitle').value='';$('#logWhat').value='';$('#logWhy').value='';$('#logTags').value='';$('#logFormTitle').textContent='Add new entry'}
window.editLog=id=>{const e=state.logs.find(x=>x.id===id);if(!e)return;$('#logId').value=e.id;$('#logDate').value=isoDate(e.date);$('#logPhase').value=e.phase;$('#logTitle').value=e.title;$('#logWhat').value=e.what;$('#logWhy').value=e.why;$('#logTags').value=(e.tags||[]).join(', ');$('#logFormTitle').textContent='Edit entry';scrollTo({top:120,behavior:'smooth'})}
window.deleteLog=async id=>{if(!confirm('Delete this development log entry?'))return;const item=state.logs.find(x=>x.id===id);addTombstone('logs',item);state.logs=state.logs.filter(x=>x.id!==id);await persist();renderLogs();toast('Entry deleted')}

function renderSources(){
 let items=[...state.sources];
 const q=$('#sourceSearch').value.toLowerCase().trim(),theme=$('#sourceThemeFilter').value,status=$('#sourceStatusFilter').value;
 if(q)items=items.filter(e=>JSON.stringify(e).toLowerCase().includes(q));
 if(theme)items=items.filter(e=>e.theme===theme);
 if(status)items=items.filter(e=>e.status===status);
 items.sort((a,b)=>({High:0,Medium:1,Low:2}[a.priority]-{High:0,Medium:1,Low:2}[b.priority]||a.title.localeCompare(b.title)));
 $('#sourceCount').textContent=state.sources.length;
 $('#readCount').textContent=state.sources.filter(x=>['Read','Cited'].includes(x.status)).length;
 if(!items.length){$('#sourceList').innerHTML='<div class="empty">No matching research sources.</div>';return}
 const folderHtml=SOURCE_FOLDERS.map(folder=>{
   const group=items.filter(s=>s.theme===folder);
   if(!group.length)return '';
   const cards=group.map(s=>`<article class="card source-card"><div class="card-head"><div><h3>${esc(s.title)}</h3><div class="meta">${esc(s.authors)}${s.date?' · '+esc(s.date):''}${s.publisher?' · '+esc(s.publisher):''}</div></div><div><span class="status-pill">${esc(s.status)}</span> <span class="status-pill">${esc(s.priority)}</span></div></div><div class="card-body"><div class="citation">${esc(s.apa)}</div><div class="source-grid"><div><h4>Key argument</h4><p>${esc(s.keyArgument)}</p></div><div><h4>Connection to PromptCraft</h4><p>${esc(s.connection)}</p></div><div><h4>Methodology</h4><p>${esc(s.methodology)}</p></div><div><h4>Notes / quotes</h4><p>${esc(s.notes)}</p></div></div>${s.archiveFile?`<div class="file-meta">Archive source file: <b>${esc(s.archiveFile)}</b> <span class="small">(kept outside the public site folder)</span></div>`:''}</div><div class="card-actions"><button class="ghost" onclick="editSource('${s.id}')">Edit</button><button class="ghost danger" onclick="deleteSource('${s.id}')">Delete</button></div></article>`).join('');
   return `<section class="source-folder"><div class="source-folder-head"><span class="folder-icon" aria-hidden="true">📁</span><div><h2>${esc(folder)}</h2><div class="meta">${group.length} source${group.length===1?'':'s'}</div></div></div><div class="source-folder-cards">${cards}</div></section>`;
 }).join('');
 $('#sourceList').innerHTML=folderHtml;
}
function clearSource(){for(const id of ['sourceId','sourceTitle','sourceAuthors','sourceDate','sourcePublisher','sourceApa','sourceArgument','sourceConnection','sourceMethod','sourceNotes','sourceArchive'])$('#'+id).value='';$('#sourcePriority').value='High';$('#sourceStatus').value='Not Started';$('#sourceFormTitle').textContent='Add research source'}
window.editSource=id=>{const s=state.sources.find(x=>x.id===id);if(!s)return;for(const [id,key] of [['sourceId','id'],['sourceTitle','title'],['sourceAuthors','authors'],['sourceDate','date'],['sourcePublisher','publisher'],['sourceApa','apa'],['sourceArgument','keyArgument'],['sourceConnection','connection'],['sourceMethod','methodology'],['sourceNotes','notes'],['sourceArchive','archiveFile'],['sourceTheme','theme'],['sourcePriority','priority'],['sourceStatus','status']])$('#'+id).value=s[key]||'';$('#sourceFormTitle').textContent='Edit research source';scrollTo({top:120,behavior:'smooth'})}
window.deleteSource=async id=>{if(!confirm('Delete this research source?'))return;const item=state.sources.find(x=>x.id===id);addTombstone('sources',item);state.sources=state.sources.filter(x=>x.id!==id);await persist();renderSources();toast('Source deleted')}

function renderPlans(){
 $('#plan-themes').innerHTML='<div class="plan-grid">'+state.themes.map(t=>`<article class="plan-card"><span class="status-pill">${esc(t.status)}</span><h3>${esc(t.theme)}</h3><div class="label">Research question</div><p>${esc(t.question)}</p><div class="label">Dissertation chapters</div><p>${esc(t.chapters)}</p><div class="label">PromptCraft scenarios</div><p>${esc(t.scenarios)}</p><div class="meta">Sources found: ${esc(t.sourcesFound)}</div></article>`).join('')+'</div>';
 $('#plan-outline').innerHTML=state.outline.map((o,i)=>`<article class="plan-card"><div class="card-head"><div><span class="phase">${esc(o.chapter)}</span><h3>${esc(o.section)}</h3></div><select aria-label="Outline status" onchange="updateOutlineStatus(${i},this.value)" style="width:auto;margin:0"><option ${o.status==='Not Started'?'selected':''}>Not Started</option><option ${o.status==='In Progress'?'selected':''}>In Progress</option><option ${o.status==='Drafted'?'selected':''}>Drafted</option><option ${o.status==='Complete'?'selected':''}>Complete</option></select></div><div class="label">Questions to answer</div><p>${esc(o.questions)}</p>${o.themes?`<div class="label">Themes</div><p>${esc(o.themes)}</p>`:''}</article>`).join('');
 $('#plan-reading').innerHTML=state.reading.map((r,i)=>`<article class="plan-card"><div class="card-head"><div><span class="phase">${esc(r.phase)}</span><h3>${esc(r.reading)}</h3><div class="meta">${esc(r.theme)} · Target: ${esc(r.target)}</div></div><label class="check"><input type="checkbox" ${r.done?'checked':''} onchange="updateReading(${i},this.checked)"> Done</label></div><div class="label">Goal</div><p>${esc(r.goal)}</p></article>`).join('')}
window.updateOutlineStatus=async(i,v)=>{state.outline[i].status=v;await persist();toast('Outline status saved')};window.updateReading=async(i,v)=>{state.reading[i].done=v;await persist();toast('Reading schedule saved')}

function renderBackups(){const items=[...state.backups].sort((a,b)=>b.created.localeCompare(a.created));$('#backupCount').textContent=items.length;$('#backupSize').textContent=(items.reduce((n,x)=>n+(x.size||0),0)/1048576).toFixed(1)+' MB';$('#backupList').innerHTML=items.length?items.map(b=>`<article class="card backup-card"><div class="card-head"><div><span class="phase">${esc(b.phase)}</span><h3>${esc(b.version)} · ${esc(b.title)}</h3><div class="meta">${new Date(b.created).toLocaleString()} · <span class="size">${fmtBytes(b.size)}</span></div></div></div><p>${esc(b.description)}</p><div class="file-meta"><b>${esc(b.fileName)}</b>${b.sha256?`<br><span class="small">SHA-256: ${esc(b.sha256)}</span>`:''}</div><div class="card-actions"><button class="ghost" onclick="downloadBackup('${b.id}')">Download</button><button class="ghost danger" onclick="deleteBackup('${b.id}')">Delete</button></div></article>`).join(''):'<div class="empty">No project snapshots yet. Add a ZIP when you reach a milestone worth preserving.</div>'}
async function hashFile(file){const buf=await file.arrayBuffer();const h=await crypto.subtle.digest('SHA-256',buf);return [...new Uint8Array(h)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function progress(p,msg){const el=$('#backupProgress');el.classList.remove('hidden');el.firstElementChild.style.width=p+'%';el.lastElementChild.textContent=msg}function hideProgress(){$('#backupProgress').classList.add('hidden')}
async function storeBackupFile(id,file){if(!cloud){await idbPut(id,file);return {storage:'local',chunkCount:1}}const chunkSize=2.5*1024*1024;let idx=0;for(let start=0;start<file.size;start+=chunkSize){const ab=await file.slice(start,Math.min(file.size,start+chunkSize)).arrayBuffer();const bytes=new Uint8Array(ab);let binary='';for(let i=0;i<bytes.length;i+=0x8000)binary+=String.fromCharCode(...bytes.subarray(i,i+0x8000));const data=btoa(binary);progress(Math.round((Math.min(file.size,start+chunkSize)/file.size)*85),`Uploading chunk ${idx+1}…`);await api('/.netlify/functions/backup',{method:'POST',body:JSON.stringify({action:'put',backupId:id,index:idx,data})});idx++}return {storage:'cloud',chunkCount:idx}}
window.downloadBackup=async id=>{const b=state.backups.find(x=>x.id===id);if(!b)return;progress(5,'Preparing download…');let blob;if(b.storage==='cloud'){if(!cloud){hideProgress();return toast('Connect cloud storage first')};const parts=[];for(let i=0;i<b.chunkCount;i++){progress(Math.round(((i+1)/b.chunkCount)*90),`Downloading chunk ${i+1} of ${b.chunkCount}…`);const x=await api(`/.netlify/functions/backup?backupId=${encodeURIComponent(id)}&index=${i}`);const bin=atob(x.data),u=new Uint8Array(bin.length);for(let j=0;j<bin.length;j++)u[j]=bin.charCodeAt(j);parts.push(u)}blob=new Blob(parts,{type:b.type||'application/zip'})}else{blob=await idbGet(id);if(!blob){hideProgress();return toast('Local backup bytes not found in this browser')}}const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=b.fileName;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);hideProgress();toast('Download ready')}
window.deleteBackup=async id=>{const b=state.backups.find(x=>x.id===id);if(!b||!confirm(`Delete snapshot ${b.version}?`))return;if(b.storage==='cloud'){if(!cloud)return toast('Connect cloud storage first');await api('/.netlify/functions/backup',{method:'POST',body:JSON.stringify({action:'delete',backupId:id,chunkCount:b.chunkCount})})}else await idbDelete(id);addTombstone('backups',b);state.backups=state.backups.filter(x=>x.id!==id);await persist();renderBackups();toast('Snapshot deleted')}

function downloadText(name,text,type='text/plain'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function restoreBaseLogs(){const seed=normalizeSeed(window.PROMPTCRAFT_SEED);const existing=new Set((state.logs||[]).map(e=>`${e.date}|${e.title}`));let added=0;for(const e of seed.logs){const k=`${e.date}|${e.title}`;if(!existing.has(k)){state.logs.push(clone(e));existing.add(k);added++}}persist().then(()=>{renderLogs();toast(added?`Restored ${added} missing base entr${added===1?'y':'ies'}`:'All 26 base entries are already present')})}
function exportLog(){const out=[`PromptCraft Research & Development Log`,`Exported: ${new Date().toLocaleString()}`,`${state.logs.length} entries`,''];[...state.logs].sort((a,b)=>a.date.localeCompare(b.date)).forEach(e=>out.push(`${humanDate(e.date)} | ${e.phase}\n${e.title}\n\nWHAT HAPPENED\n${e.what}\n\nWHY / RATIONALE & REFLECTION\n${e.why}\n\nTags: ${(e.tags||[]).join(' · ')}\n\n${'='.repeat(70)}\n`));downloadText(`PromptCraft_Research_Log_${today()}.txt`,out.join('\n'))}
function exportAll(){downloadText(`PromptCraft_Hub_Archive_${today()}.json`,JSON.stringify(state,null,2),'application/json')}

async function uploadBlobAsCloudBackup(b,blob){
 const chunkSize=2.5*1024*1024;let idx=0;
 for(let start=0;start<blob.size;start+=chunkSize){
   const ab=await blob.slice(start,Math.min(blob.size,start+chunkSize)).arrayBuffer(),bytes=new Uint8Array(ab);
   let binary='';for(let i=0;i<bytes.length;i+=0x8000)binary+=String.fromCharCode(...bytes.subarray(i,i+0x8000));
   await api('/.netlify/functions/backup',{method:'POST',body:JSON.stringify({action:'put',backupId:b.id,index:idx,data:btoa(binary)})});idx++
 }
 b.storage='cloud';b.chunkCount=idx;b.updatedAt=new Date().toISOString();return true
}
async function migrateLocalBackups(){
 if(!cloud)return 0;let moved=0;
 for(const b of state.backups||[]){
   if(b.storage!=='local')continue;
   try{const blob=await idbGet(b.id);if(!blob)continue;await uploadBlobAsCloudBackup(b,blob);moved++}catch(e){console.warn('Backup migration skipped',b.id,e)}
 }
 if(moved){persistLocal();await api('/.netlify/functions/state',{method:'POST',body:JSON.stringify({state})})}
 return moved
}
async function pullCloudReadOnly({silent=true}={}){
 try{
   const x=await api('/.netlify/functions/state');
   if(x.initialized&&x.state){
     state=mergeSyncStates(state,x.state);
     persistLocal();
     render();
     if(!silent)toast('Latest cloud data loaded');
     return true
   }
   return false
 }catch(e){
   if(!silent)toast('Could not load cloud data');
   console.error(e);
   return false
 }
}
async function syncCloud({silent=false}={}){
 if(!adminKey||syncing)return false;
 try{
   syncing=true;if(!silent)toast('Syncing with cloud…');
   const x=await api('/.netlify/functions/state');
   cloud=true;
   state=x.initialized&&x.state?mergeSyncStates(state,x.state):mergeBaseData(state);
   await api('/.netlify/functions/state',{method:'POST',body:JSON.stringify({state})});
   const moved=await migrateLocalBackups();
   persistLocal();localStorage.removeItem(UNSYNCED_KEY);
   render();
   if(!silent)toast(moved?`Cloud synced · ${moved} local backup${moved===1?'':'s'} uploaded`:'Cloud synced');
   return true
 }catch(e){
   cloud=false;localStorage.setItem(UNSYNCED_KEY,'1');setStorageBadge();
   if(!silent)toast(e.message);console.error(e);return false
 }finally{syncing=false;setStorageBadge()}
}
async function connectCloud(){
 adminKey=$('#adminKey').value.trim();if(!adminKey)return toast('Enter the Netlify admin key');
 const remember=$('#rememberKey')?.checked!==false;
 sessionStorage.setItem(ADMIN_KEY_STORAGE,adminKey);
 if(remember)localStorage.setItem(ADMIN_KEY_STORAGE,adminKey);else localStorage.removeItem(ADMIN_KEY_STORAGE);
 const ok=await syncCloud();
 if(ok)$('#cloudPanel').classList.add('hidden')
}
function disconnectCloud(){
 cloud=false;adminKey='';sessionStorage.removeItem(ADMIN_KEY_STORAGE);localStorage.removeItem(ADMIN_KEY_STORAGE);
 $('#adminKey').value='';setStorageBadge();toast('Cloud disconnected on this device')
}
async function bootstrap(){
 clearLog();
 clearSource();
 render();
 await pullCloudReadOnly({silent:true});
 if(adminKey){
   const ok=await syncCloud({silent:true});
   if(!ok)setStorageBadge();
 }else{
   setStorageBadge();
 }
}
window.addEventListener('focus',async()=>{await pullCloudReadOnly({silent:true});if(adminKey&&localStorage.getItem(UNSYNCED_KEY)==='1')syncCloud({silent:true})});
document.addEventListener('visibilitychange',async()=>{if(document.visibilityState==='visible'){await pullCloudReadOnly({silent:true});if(adminKey&&localStorage.getItem(UNSYNCED_KEY)==='1')syncCloud({silent:true})}});

// Events
$$('.tab').forEach(b=>b.onclick=()=>{$$('.tab').forEach(x=>x.classList.toggle('active',x===b));$$('.view').forEach(v=>v.classList.toggle('active',v.id==='view-'+b.dataset.view))});
$$('.subtab').forEach(b=>b.onclick=()=>{$$('.subtab').forEach(x=>x.classList.toggle('active',x===b));$$('.plan-view').forEach(v=>v.classList.toggle('active',v.id==='plan-'+b.dataset.plan))});
$('#connectBtn').onclick=()=>{$('#cloudPanel').classList.toggle('hidden');$('#adminKey').value=adminKey;$('#rememberKey').checked=!!localStorage.getItem(ADMIN_KEY_STORAGE)};$('#syncBtn').onclick=()=>syncCloud();$('#cloudDisconnect').onclick=disconnectCloud;$('#cloudCancel').onclick=()=>$('#cloudPanel').classList.add('hidden');$('#cloudConnectConfirm').onclick=connectCloud;
$('#logSearch').oninput=renderLogs;$('#logFilter').onchange=renderLogs;$('#sourceSearch').oninput=renderSources;$('#sourceThemeFilter').onchange=renderSources;$('#sourceStatusFilter').onchange=renderSources;
$('#logClear').onclick=clearLog;$('#sourceClear').onclick=clearSource;$('#exportLogBtn').onclick=exportLog;$('#restoreLogBtn').onclick=restoreBaseLogs;$('#exportAllBtn').onclick=exportAll;
$('#logForm').onsubmit=async e=>{e.preventDefault();const id=$('#logId').value||uuid();const obj={id,date:$('#logDate').value,phase:$('#logPhase').value,title:$('#logTitle').value.trim(),what:$('#logWhat').value.trim(),why:$('#logWhy').value.trim(),tags:$('#logTags').value.split(',').map(x=>x.trim()).filter(Boolean),updatedAt:new Date().toISOString()};const i=state.logs.findIndex(x=>x.id===id);if(i>=0)state.logs[i]=obj;else state.logs.push(obj);await persist();clearLog();renderLogs();toast('Development entry saved')};
$('#sourceForm').onsubmit=async e=>{e.preventDefault();const id=$('#sourceId').value||uuid(),obj={id,theme:$('#sourceTheme').value,priority:$('#sourcePriority').value,title:$('#sourceTitle').value.trim(),authors:$('#sourceAuthors').value.trim(),date:$('#sourceDate').value.trim(),publisher:$('#sourcePublisher').value.trim(),apa:$('#sourceApa').value.trim(),keyArgument:$('#sourceArgument').value.trim(),connection:$('#sourceConnection').value.trim(),methodology:$('#sourceMethod').value.trim(),status:$('#sourceStatus').value,notes:$('#sourceNotes').value.trim(),archiveFile:$('#sourceArchive').value.trim(),updatedAt:new Date().toISOString()};const i=state.sources.findIndex(x=>x.id===id);if(i>=0)state.sources[i]=obj;else state.sources.push(obj);await persist();clearSource();renderSources();toast('Research source saved')};
$('#backupForm').onsubmit=async e=>{e.preventDefault();const file=$('#backupFile').files[0];if(!file)return;const id=uuid(),version=$('#backupVersion').value.trim(),title=$('#backupTitle').value.trim(),phase=$('#backupPhase').value,description=$('#backupDescription').value.trim();try{progress(2,'Calculating checksum…');const sha256=await hashFile(file);const stored=await storeBackupFile(id,file);progress(90,'Saving snapshot record…');const b={id,version,title,phase,description,fileName:file.name,size:file.size,type:file.type,sha256,created:new Date().toISOString(),updatedAt:new Date().toISOString(),...stored};state.backups.push(b);if($('#backupLogIt').checked)state.logs.push({id:uuid(),date:today(),phase,title:`Project snapshot saved — ${version}: ${title}`,what:`Saved a backup source-control snapshot (${file.name}, ${fmtBytes(file.size)}). ${description}`,why:'Created a milestone copy so the development state can be restored independently of the active working files. This backup complements, rather than replaces, Git/version history.',tags:['backup','source control','project snapshot',version],updatedAt:new Date().toISOString()});await persist();progress(100,'Saved');setTimeout(hideProgress,600);e.target.reset();$('#backupLogIt').checked=true;render();toast('Project snapshot saved')}catch(err){hideProgress();toast(err.message);console.error(err)}};

bootstrap();
