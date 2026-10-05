
const PHASES=['Conceptualization','Design','Prototype','Iteration','Testing','Reflection','Key Decision','Problem / Challenge'];
const LEGACY_PHASE={Decision:'Key Decision',Problem:'Problem / Challenge'};
const SOURCE_FOLDERS=[
  'Educator AI Literacy & Critical Evaluation',
  'Professional Judgment, Agency & Human-AI Decision Making',
  'Authentic Scenario-Based & Game-Based Professional Learning',
  'Instructional Design, Canvas, Accessibility & OSCQR',
  'Educator Professional Development & Transfer to Practice',
  'Metacognition, Reflection & Learning Transfer',
  'Research Instrumentation, Process Data & Validity',
  'Mixed Methods Action Research & Iterative Design'
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
const IMAGE_TYPES=['Before','After','Prototype','Bug','Final','Reference','Process'];
const MATERIAL_TYPES=['Article / PDF','Book / Chapter','Report / Policy','Dissertation / Thesis','Web Source','Dataset / Table','Diagram / Figure','Screenshot / Image','Presentation / Slide','Notes / Other'];
const MATERIAL_STATUSES=['Captured','Reviewing','Annotated','Ready to Cite','Cited','Archived'];
const ANNOTATION_TYPES=['Key finding','Direct quote','Paraphrase','Definition','Method / measure','Limitation','Figure / diagram','Table / data','Paper idea','Other'];
const RESEARCH_PLAN_VERSION=2;
let editingLogImages=[];
let pendingLogImages=[];
let pendingImportedAnnotations=[];
let researchSourceView='all';
const imageUrlCache=new Map();

function normalizeSeed(seed){if(!seed||!Array.isArray(seed.logs))throw new Error('PromptCraft base data failed to load. Check that seed-data.js is deployed beside app.js.');const x=clone(seed); x.logs=x.logs.map((e,i)=>({...e,id:e.id||'seed-log-'+i,phase:LEGACY_PHASE[e.phase]||e.phase,date:isoDate(e.date)})); x.sources=x.sources.map((s,i)=>({...s,id:s.id||'seed-source-'+i})); x.themes=(x.themes||[]).map((e,i)=>({...e,id:e.id||'seed-theme-'+i})); x.outline=(x.outline||[]).map((e,i)=>({...e,id:e.id||'seed-outline-'+i})); x.reading=(x.reading||[]).map((e,i)=>({...e,id:e.id||'seed-reading-'+i})); x.backups=x.backups||[]; x.paperBackups=x.paperBackups||[]; x.paperUses=x.paperUses||[]; x.researchMaterials=(x.researchMaterials||[]).map((m,i)=>({...m,id:m.id||'seed-material-'+i,annotations:m.annotations||[]})); return x}
function isMissing(v){return v===undefined||v===null||v===''||(Array.isArray(v)&&v.length===0)}
function mergeRecord(base,saved,forceKeys=[]){const out={...clone(base),...(saved||{})};for(const [k,v] of Object.entries(base)){if(isMissing(saved?.[k]))out[k]=clone(v)}for(const k of forceKeys){if(base[k]!==undefined)out[k]=clone(base[k])}return out}
function mergeEditableRecord(base,saved){
 const out=clone(base);
 if(!saved||typeof saved!=='object')return out;
 // Editable records must respect intentional blanks. Only inherit a seed value when
 // an older saved record truly does not contain that property at all.
 for(const [k,v] of Object.entries(saved))out[k]=clone(v);
 return out
}
function dedupeByStableId(items){
 const out=[],byId=new Map();
 for(const item of (Array.isArray(items)?items:[])){
  if(!item?.id){out.push(clone(item));continue}
  const prevIndex=byId.get(item.id);
  if(prevIndex===undefined){byId.set(item.id,out.length);out.push(clone(item));continue}
  const prev=out[prevIndex],pt=prev.updatedAt||prev.created||'',nt=item.updatedAt||item.created||'';
  // The integrated-source-editor bug could leave a seed copy and an edited copy
  // with the same ID. Prefer the newer/editable copy and collapse them back to one.
  out[prevIndex]=clone(nt>=pt?item:prev);
 }
 return out
}
function mergeSourceCollection(baseItems,savedItems){
 const base=Array.isArray(baseItems)?baseItems:[],saved=dedupeByStableId(savedItems),used=new Set();
 const merged=base.map(b=>{
  let idx=saved.findIndex((item,i)=>!used.has(i)&&item.id&&b.id&&item.id===b.id);
  if(idx<0){const key=String(b.title||'').trim().toLowerCase();idx=saved.findIndex((item,i)=>!used.has(i)&&String(item.title||'').trim().toLowerCase()===key)}
  if(idx<0)return clone(b);
  used.add(idx);
  return mergeEditableRecord(b,saved[idx]);
 });
 saved.forEach((item,i)=>{if(!used.has(i))merged.push(clone(item))});
 return dedupeByStableId(merged)
}
function mergeCollection(baseItems,savedItems,keyFn,forceKeys=[]){const saved=Array.isArray(savedItems)?savedItems:[];const used=new Set();const merged=baseItems.map(base=>{const key=keyFn(base);const idx=saved.findIndex((item,i)=>!used.has(i)&&keyFn(item)===key);if(idx<0)return clone(base);used.add(idx);return mergeRecord(base,saved[idx],forceKeys)});saved.forEach((item,i)=>{if(!used.has(i))merged.push(item)});return merged}
function mergePlanCollection(baseItems,savedItems,semanticFn){
 const base=Array.isArray(baseItems)?baseItems:[],saved=(Array.isArray(savedItems)?savedItems:[]).map(clone),used=new Set();
 for(const item of saved){if(item.id)continue;const match=base.find(b=>semanticFn(b)===semanticFn(item));if(match)item.id=match.id}
 const merged=base.map(b=>{let idx=saved.findIndex((item,i)=>!used.has(i)&&item.id&&item.id===b.id);if(idx<0)idx=saved.findIndex((item,i)=>!used.has(i)&&semanticFn(item)===semanticFn(b));if(idx<0)return clone(b);used.add(idx);return mergeRecord(b,saved[idx])});
 saved.forEach((item,i)=>{if(!used.has(i))merged.push(item)});return merged
}
function applyResearchPlanMigration(x,seed){
 x.meta=(x.meta&&typeof x.meta==='object')?x.meta:{};
 const current=Number(x.meta.researchPlanVersion||0);
 if(current<RESEARCH_PLAN_VERSION){
   x.themes=clone(seed.themes||[]);
   x.outline=clone(seed.outline||[]);
   x.reading=clone(seed.reading||[]);
   x.meta.researchPlanVersion=RESEARCH_PLAN_VERSION;
   x.meta.researchPlanUpdated='2026-09-29';
 }
 return x
}
function normalizeResearchLibrary(x){
 const themeMap={
  'AI Literacy & Prompt Engineering':'Educator AI Literacy & Critical Evaluation',
  'AI Overreliance & Critical Evaluation':'Professional Judgment, Agency & Human-AI Decision Making',
  'Instructional Design & OSCQR':'Instructional Design, Canvas, Accessibility & OSCQR',
  'Game-Based & Simulation Learning':'Authentic Scenario-Based & Game-Based Professional Learning',
  'Professional Development Design':'Educator Professional Development & Transfer to Practice',
  'Metacognition & Online Learning':'Metacognition, Reflection & Learning Transfer'
 };
 for(const s of x.sources||[]){s.theme=themeMap[s.theme]||s.theme;s.sourceType=s.sourceType||'Article / PDF';s.paperSection=s.paperSection||'';s.url=s.url||'';s.tags=Array.isArray(s.tags)?s.tags:[];s.annotations=Array.isArray(s.annotations)?s.annotations:[];if(s.notes&&!s.annotations.length)s.annotations.push({id:'legacy-note-'+(s.id||Math.random().toString(16).slice(2)),location:'',type:'Other',text:s.notes,interpretation:'',paperUse:'',tags:['imported legacy note'],created:s.updatedAt||new Date().toISOString(),updatedAt:s.updatedAt||new Date().toISOString()})}
 for(const m of x.researchMaterials||[]){m.annotations=Array.isArray(m.annotations)?m.annotations:[];if(m.sourceId&&!(x.sources||[]).some(v=>v.id===m.sourceId)&&m.sourceTitle){const match=(x.sources||[]).find(v=>String(v.title||'').trim().toLowerCase()===String(m.sourceTitle||'').trim().toLowerCase());if(match)m.sourceId=match.id}if(m.sourceId&&m.annotations.length){const s=(x.sources||[]).find(v=>v.id===m.sourceId);if(s){const known=new Set((s.annotations||[]).map(a=>`${a.location||''}|${a.text||''}`));for(const a of m.annotations){const k=`${a.location||''}|${a.text||''}`;if(!known.has(k)){s.annotations.push(a);known.add(k)}}m.annotations=[]}}
  if(!m.sourceId){const existing=(x.sources||[]).find(s=>s.artifactMaterialId===m.id);if(existing){m.sourceId=existing.id;continue}const id='artifact-'+m.id;(x.sources||[]).push({id,theme:m.theme||'',priority:'Medium',sourceType:'Research Artifact',title:m.title||m.fileName||'Research artifact',authors:m.creator||'',date:m.date||'',publisher:'',apa:m.citation||'',keyArgument:'',connection:'',methodology:'',status:m.status==='Cited'?'Cited':m.status==='Annotated'?'Read':'Not Started',paperSection:m.paperSection||'',url:m.url||'',tags:m.tags||[],annotations:m.annotations||[],artifactMaterialId:m.id,updatedAt:m.updatedAt||m.created||new Date().toISOString()});m.annotations=[];m.sourceId=id}
 }
 return x
}
function mergeBaseData(saved){
 const seed=normalizeSeed(window.PROMPTCRAFT_SEED),x=(saved&&typeof saved==='object')?clone(saved):{};
 x.logs=mergeCollection(seed.logs,x.logs,e=>`${isoDate(e.date)}|${String(e.title||'').trim().toLowerCase()}`);
 x.sources=mergeSourceCollection(seed.sources,x.sources);
 x.themes=mergePlanCollection(seed.themes,x.themes,t=>String(t.theme||'').trim().toLowerCase());
 x.outline=mergePlanCollection(seed.outline,x.outline,o=>`${String(o.chapter||'').trim().toLowerCase()}|${String(o.section||'').trim().toLowerCase()}`);
 x.reading=mergePlanCollection(seed.reading,x.reading,r=>`${String(r.phase||'').trim().toLowerCase()}|${String(r.reading||'').trim().toLowerCase()}`);
 if(!Array.isArray(x.backups))x.backups=[];
 if(!Array.isArray(x.paperBackups))x.paperBackups=[];
 if(!Array.isArray(x.paperUses))x.paperUses=[];
 x.researchMaterials=mergeCollection(seed.researchMaterials||[],x.researchMaterials||[],m=>m.id||`${String(m.title||'').trim().toLowerCase()}|${String(m.fileName||'').trim().toLowerCase()}`);
 normalizeResearchLibrary(x);
 return applyTombstones(applyResearchPlanMigration(x,seed))
}
function loadLocal(){try{const raw=localStorage.getItem(STORAGE_KEY);if(raw)return mergeBaseData(JSON.parse(raw))}catch{}return normalizeSeed(window.PROMPTCRAFT_SEED)}
function persistLocal(){
 try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));return true}
 catch(e){console.warn('Local state save failed',e);return false}
}
function recordKey(type,item){
 if(type==='logs')return item.id||`${isoDate(item.date)}|${String(item.title||'').trim().toLowerCase()}`;
 if(type==='sources')return item.id||String(item.title||'').trim().toLowerCase();
 if(type==='themes')return item.id||String(item.theme||'').trim().toLowerCase();
 if(type==='outline')return item.id||`${String(item.chapter||'').trim().toLowerCase()}|${String(item.section||'').trim().toLowerCase()}`;
 if(type==='reading')return item.id||`${String(item.phase||'').trim().toLowerCase()}|${String(item.reading||'').trim().toLowerCase()}`;
 if(type==='researchMaterials')return item.id||`${String(item.title||'').trim().toLowerCase()}|${String(item.fileName||'').trim().toLowerCase()}`;
 if(type==='paperUses')return item.id||`${item.sourceId||''}|${String(item.paperSection||'').trim().toLowerCase()}|${String(item.point||'').trim().toLowerCase()}`;
 return item.id||`${item.version||''}|${item.fileName||''}|${item.created||''}`;
}
function semanticKey(type,item){
 if(type==='logs')return `${isoDate(item.date)}|${String(item.title||'').trim().toLowerCase()}`;
 if(type==='sources')return String(item.title||'').trim().toLowerCase();
 if(type==='themes')return String(item.theme||'').trim().toLowerCase();
 if(type==='outline')return `${String(item.chapter||'').trim().toLowerCase()}|${String(item.section||'').trim().toLowerCase()}`;
 if(type==='reading')return `${String(item.phase||'').trim().toLowerCase()}|${String(item.reading||'').trim().toLowerCase()}`;
 if(type==='researchMaterials')return item.id||`${String(item.title||'').trim().toLowerCase()}|${String(item.fileName||'').trim().toLowerCase()}`;
 if(type==='paperUses')return item.id||`${item.sourceId||''}|${String(item.paperSection||'').trim().toLowerCase()}|${String(item.point||'').trim().toLowerCase()}`;
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
 const out={};for(const type of ['logs','sources','themes','outline','reading','backups','paperBackups','researchMaterials','paperUses'])out[type]=Array.isArray(d[type])?d[type]:[];return out
}
function mergeDeleted(a,b){
 const out=normalizeDeleted(a),other=normalizeDeleted(b);
 for(const type of ['logs','sources','themes','outline','reading','backups','paperBackups','researchMaterials','paperUses']){
   const map=new Map();
   [...out[type],...other[type]].forEach(t=>{const k=t.id||t.key;if(!k)return;const prev=map.get(k);if(!prev||(t.deletedAt||'')>(prev.deletedAt||''))map.set(k,t)});
   out[type]=[...map.values()];
 }
 return out
}
function recordModifiedAt(item){return item?.updatedAt||item?.created||''}
function tombstoneMatches(type,item,t){
 // Source deletions are record-specific. Multiple source records can legitimately share
 // a title, and older rapid-click duplicates must not all disappear together.
 if(type==='sources')return !!(t.id&&t.id===item.id);
 return !!((t.id&&t.id===item.id)||(t.key&&t.key===semanticKey(type,item)))
}
function tombstoneWins(type,item,t){
 if(!tombstoneMatches(type,item,t))return false;
 const itemTime=recordModifiedAt(item),deletedAt=t.deletedAt||'';
 // A record that was explicitly edited after a deletion marker should be allowed
 // to exist again. Previously, tombstones won forever, which could make a source
 // disappear immediately after a later edit/save.
 if(itemTime&&deletedAt&&itemTime>deletedAt)return false;
 return true
}
function clearTombstonesFor(type,item){
 state.deleted=normalizeDeleted(state.deleted);
 state.deleted[type]=(state.deleted[type]||[]).filter(t=>!tombstoneMatches(type,item,t));
}
function applyTombstones(x){
 x.deleted=normalizeDeleted(x.deleted);
 for(const type of ['logs','sources','themes','outline','reading','backups','paperBackups','researchMaterials','paperUses']){
   const tombs=x.deleted[type]||[];
   x[type]=(x[type]||[]).filter(item=>!tombs.some(t=>tombstoneWins(type,item,t)));
 }
 return x
}
function mergeSyncStates(localState,remoteState){
 const l=mergeBaseData(localState||{}),r=mergeBaseData(remoteState||{});
 const out={...clone(r),...clone(l)};
 for(const type of ['logs','sources','themes','outline','reading','backups','paperBackups','researchMaterials','paperUses'])out[type]=syncCollection(type,l[type],r[type]);
 out.deleted=mergeDeleted(l.deleted,r.deleted);
 return applyTombstones(out)
}
function addTombstone(type,item){
 state.deleted=normalizeDeleted(state.deleted);
 state.deleted[type].push({id:item?.id||'',key:semanticKey(type,item||{}),deletedAt:new Date().toISOString()});
}
async function api(url,opt={}){opt.headers={...(opt.headers||{}),'Content-Type':'application/json'};if(adminKey)opt.headers['X-PromptCraft-Key']=adminKey;const r=await fetch(url,opt);const data=await r.json().catch(()=>({}));if(!r.ok)throw new Error(data.error||`Request failed (${r.status})`);return data}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2300)}
let sourceSaveInFlight=false;
function setSourceSaveState(busy,message=''){
 sourceSaveInFlight=!!busy;
 const btn=$('#sourceSaveBtn'),clear=$('#sourceClear'),status=$('#sourceSaveStatus');
 if(btn){btn.disabled=!!busy;btn.setAttribute('aria-busy',busy?'true':'false');btn.textContent=busy?'Saving…':'Save source'}
 if(clear)clear.disabled=!!busy;
 if(status){status.textContent=message||'';status.classList.toggle('hidden',!message)}
}
function fileBaseName(name=''){return String(name||'').replace(/\.[^.]+$/,'').trim()}
function normalizeSourceUrl(value=''){const v=String(value||'').trim();if(!v)return '';if(/^10\.\d{4,9}\//i.test(v))return 'https://doi.org/'+v;if(/^doi:\s*10\./i.test(v))return 'https://doi.org/'+v.replace(/^doi:\s*/i,'');return v}
let sourceAnalyzeInFlight=false;
function setSourceAnalyzeState(busy,message=''){
 sourceAnalyzeInFlight=!!busy;
 const btn=$('#sourceAutoAnalyze'),status=$('#sourceAutoStatus'),file=$('#sourceFile'),lookup=$('#sourceAutoLookup');
 if(btn){btn.disabled=!!busy;btn.setAttribute('aria-busy',busy?'true':'false');btn.textContent=busy?'Analyzing…':'Analyze & fill source'}
 if(file)file.disabled=!!busy;if(lookup)lookup.disabled=!!busy;
 if(status){status.textContent=message||'';status.classList.toggle('is-error',String(message||'').toLowerCase().includes('failed'))}
}
function sourceAnalysisNotes(result={}){
 const rows=[];
 for(const n of Array.isArray(result.notes)?result.notes:[]){
   if(!n||!String(n.text||'').trim())continue;
   rows.push({id:uuid(),location:String(n.location||'').trim(),type:n.type||'Key finding',text:String(n.text||'').trim(),interpretation:String(n.interpretation||'').trim(),paperUse:String(n.paperUse||'').trim(),tags:Array.isArray(n.tags)?n.tags.map(x=>String(x).trim()).filter(Boolean):[],created:new Date().toISOString(),updatedAt:new Date().toISOString()});
 }
 for(const f of Array.isArray(result.figures)?result.figures:[]){
   const title=String(f.title||'').trim(),relevance=String(f.relevance||'').trim();if(!title&&!relevance)continue;
   rows.push({id:uuid(),location:String(f.location||'').trim(),type:f.type||'Figure / diagram',text:[title,relevance].filter(Boolean).join(': '),interpretation:relevance,paperUse:String(f.paperUse||'').trim(),tags:['figure'],created:new Date().toISOString(),updatedAt:new Date().toISOString()});
 }
 return rows;
}
function renderSourceAnalysisPreview(result={},notes=[]){
 const box=$('#sourceAutoPreview'),content=$('#sourceAutoPreviewContent');if(!box||!content)return;
 const useful=notes.slice(0,8);if(!useful.length&&!result.keyArgument){box.classList.add('hidden');content.innerHTML='';return}
 const blocks=[];if(result.keyArgument)blocks.push(`<div class="source-auto-preview-argument"><b>Key finding</b><p>${esc(result.keyArgument)}</p></div>`);
 if(useful.length)blocks.push(`<div class="source-auto-preview-notes">${useful.map(n=>`<div><span>${esc([n.location,n.type].filter(Boolean).join(' · ')||'Note')}</span><p>${esc(n.text)}</p></div>`).join('')}</div>${notes.length>useful.length?`<p class="small">Plus ${notes.length-useful.length} more staged note${notes.length-useful.length===1?'':'s'}.</p>`:''}`);
 content.innerHTML=blocks.join('');box.classList.remove('hidden');
}
function applySourceAnalysis(result={},lookup=''){
 const map=[['sourceTitle','title'],['sourceAuthors','authors'],['sourceDate','date'],['sourcePublisher','publisher'],['sourceApa','apa'],['sourceArgument','keyArgument'],['sourceConnection','connection'],['sourceMethod','methodology'],['sourcePaperSection','paperSection'],['sourceUrl','url']];
 let filled=0;
 for(const [id,key] of map){const el=$('#'+id),v=result[key];if(el&&v){el.value=String(v);filled++}}
 if(!$('#sourceUrl').value.trim()&&lookup)$('#sourceUrl').value=normalizeSourceUrl(lookup);
 if(result.sourceType&&$('#sourceType')){$('#sourceType').value=result.sourceType;filled++}
 if(result.priority&&$('#sourcePriority')&&['High','Medium','Low'].includes(result.priority)){$('#sourcePriority').value=result.priority;filled++}
 if(result.theme&&$('#sourceTheme')){const select=$('#sourceTheme');if(![...select.options].some(o=>o.value===result.theme)){const o=document.createElement('option');o.value=o.textContent=result.theme;select.appendChild(o)}select.value=result.theme;filled++}
 if(Array.isArray(result.tags)&&$('#sourceTags')){$('#sourceTags').value=result.tags.join(', ');filled++}
 const notes=sourceAnalysisNotes(result),existingKeys=new Set(pendingImportedAnnotations.map(a=>`${a.location||''}|${a.text||''}`));for(const n of notes){const k=`${n.location||''}|${n.text||''}`;if(!existingKeys.has(k)){pendingImportedAnnotations.push(n);existingKeys.add(k)}}
 renderSourceAnalysisPreview(result,notes);
 const details=$('.source-optional-details');if(details&&(result.keyArgument||result.connection||result.methodology||result.theme||result.paperSection))details.open=true;
 refreshSourceEditorRelated(sourceEditorId());
 return {filled,notes:notes.length};
}
async function analyzeSourceIntake(){
 if(sourceAnalyzeInFlight)return;
 const file=$('#sourceFile')?.files?.[0],lookup=($('#sourceAutoLookup')?.value||$('#sourceUrl')?.value||'').trim();
 if(!file&&!lookup)return toast('Choose a paper or paste a DOI/URL first.');
 if(!adminKey)return toast('Connect the Hub with your admin key before using automatic source analysis.');
 if(file&&!cloud)return toast('Connect cloud storage before analyzing an uploaded paper.');
 let temp=null;
 try{
   setSourceAnalyzeState(true,file?'Uploading a temporary copy for analysis…':'Looking up source information…');
   let filePayload=null;
   if(file){
     const ext=(file.name.split('.').pop()||'').toLowerCase();if(!['pdf','docx','txt','rtf'].includes(ext))throw new Error('Automatic analysis supports PDF, DOCX, TXT, and RTF files.');
     const backupId='source-analysis-'+uuid();temp={backupId,chunkCount:0};
     const stored=await storeBackupFile(backupId,file,'sourceFileProgress');
     if(stored.storage!=='cloud')throw new Error('The temporary paper could not reach cloud storage. Reconnect the Hub and try again.');
     temp.chunkCount=stored.chunkCount;filePayload={backupId,chunkCount:stored.chunkCount,fileName:file.name,mimeType:file.type||''};
     setSourceAnalyzeState(true,'Reading the paper and building the source record…');
   }else setSourceAnalyzeState(true,'Looking up the source and building the record…');
   const x=await api('/.netlify/functions/analyze-source',{method:'POST',body:JSON.stringify({lookup,file:filePayload,themes:sourceFolders(),paperSections:paperSectionOptions()})});
   const result=x.result||{},summary=applySourceAnalysis(result,lookup);
   if(result.url&&$('#sourceAutoLookup'))$('#sourceAutoLookup').value=result.url;
   hideProgress('sourceFileProgress');
   const notePart=summary.notes?` · ${summary.notes} note${summary.notes===1?'':'s'} staged`:'';
   const warning=result.warning?` ${result.warning}`:'';
   setSourceAnalyzeState(false,`Filled ${summary.filled} field${summary.filled===1?'':'s'}${notePart}. Review, then Save source.${warning}`);
   toast(result.analysisAvailable===false?'Source details filled; article analysis was unavailable':'Source analyzed and filled for review');
 }catch(err){
   console.error(err);hideProgress('sourceFileProgress');setSourceAnalyzeState(false,`Analysis failed: ${err.message||'Unknown error'}`);toast(err.message||'Could not analyze source');
 }finally{
   if(temp?.chunkCount){try{await api('/.netlify/functions/backup',{method:'POST',body:JSON.stringify({action:'delete',backupId:temp.backupId,chunkCount:temp.chunkCount})})}catch(e){console.warn('Temporary analysis file cleanup skipped',e)}}
 }
}
function setStorageBadge(){
 const b=$('#storageBadge'),btn=$('#connectBtn'),syncBtn=$('#syncBtn');
 const unsynced=localStorage.getItem(UNSYNCED_KEY)==='1';
 if(cloud){b.textContent=unsynced?'Cloud connected · changes pending':'Cloud synced';b.style.color=unsynced?'#e0bb77':'var(--ok)';btn.textContent='Cloud settings';syncBtn?.classList.remove('hidden')}
 else{b.textContent=adminKey?'Local fallback · reconnecting':'Local browser only';b.style.color='';btn.textContent='Connect cloud';syncBtn?.classList.add('hidden')}
}
async function persist(){
 const localOk=persistLocal();
 if(!cloud){
   localStorage.setItem(UNSYNCED_KEY,'1');setStorageBadge();
   if(!localOk)throw new Error('Browser storage is full or unavailable. Connect cloud storage or free browser storage, then try again.');
   return
 }
 try{
   syncing=true;setStorageBadge();
   const remote=await api('/.netlify/functions/state');
   state=remote.initialized&&remote.state?mergeSyncStates(state,remote.state):mergeBaseData(state);
   await api('/.netlify/functions/state',{method:'POST',body:JSON.stringify({state})});
   persistLocal();localStorage.removeItem(UNSYNCED_KEY);
 }catch(e){
   localStorage.setItem(UNSYNCED_KEY,'1');
   if(!localOk)throw e;
   toast('Saved locally; cloud sync will retry');console.error(e)
 }finally{syncing=false;setStorageBadge()}
}

// IndexedDB stores backup bytes in local mode.
function db(){return new Promise((res,rej)=>{const r=indexedDB.open('promptcraft-hub',2);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('files'))r.result.createObjectStore('files')};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function idbPut(k,v){const d=await db();return new Promise((res,rej)=>{const tx=d.transaction('files','readwrite');tx.objectStore('files').put(v,k);tx.oncomplete=res;tx.onerror=()=>rej(tx.error)})}
async function idbGet(k){const d=await db();return new Promise((res,rej)=>{const tx=d.transaction('files');const r=tx.objectStore('files').get(k);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function idbDelete(k){const d=await db();return new Promise((res,rej)=>{const tx=d.transaction('files','readwrite');tx.objectStore('files').delete(k);tx.oncomplete=res;tx.onerror=()=>rej(tx.error)})}

function initSelects(){
 const phaseOpts=PHASES.map(x=>`<option>${x}</option>`).join('');
 const logPhase=$('#logPhase'),backupPhase=$('#backupPhase'),logFilter=$('#logFilter');
 if(!logPhase.options.length)logPhase.innerHTML=phaseOpts;
 if(!backupPhase.options.length)backupPhase.innerHTML=phaseOpts;
 if(!logFilter.options.length)logFilter.innerHTML='<option value="">All phases</option>'+phaseOpts;
 const themeOpts=SOURCE_FOLDERS.map(x=>`<option>${esc(x)}</option>`).join('');
 const sourceTheme=$('#sourceTheme'),sourceThemeFilter=$('#sourceThemeFilter');
 if(!sourceTheme.options.length)sourceTheme.innerHTML=themeOpts;
 if(!sourceThemeFilter.options.length)sourceThemeFilter.innerHTML='<option value="">All source folders</option>'+themeOpts;
}
function imageMetaHtml(img,entryId,editable=false,index=0,kind='existing'){
 const type=esc(img.imageType||'Process'),caption=esc(img.caption||''),checked=img.includeInHistory?'checked':'';
 const preview=kind==='pending'&&img.previewUrl?`src="${esc(img.previewUrl)}"`:`data-cloud-image="${esc(img.id)}"`;
 if(!editable)return `<figure class="dev-image"><button type="button" class="image-open" onclick="openDevelopmentImage('${esc(entryId)}','${esc(img.id)}')"><img ${preview} alt="${caption||esc(img.fileName||'Development image')}" loading="lazy"></button><figcaption><span class="image-type">${type}</span>${caption?`<span>${caption}</span>`:''}</figcaption></figure>`;
 return `<div class="image-edit-card" data-image-kind="${kind}" data-image-index="${index}"><div class="image-edit-preview"><img ${preview} alt="${caption||esc(img.fileName||'Development image')}"></div><div class="image-edit-fields"><label>Type<select onchange="updateLogImageMeta('${kind}',${index},'imageType',this.value)">${IMAGE_TYPES.map(x=>`<option ${x===(img.imageType||'Process')?'selected':''}>${x}</option>`).join('')}</select></label><label>Caption<input value="${caption}" placeholder="What does this image document?" oninput="updateLogImageMeta('${kind}',${index},'caption',this.value)"></label><label class="check"><input type="checkbox" ${checked} onchange="updateLogImageMeta('${kind}',${index},'includeInHistory',this.checked)"> Include in Visual History</label><button type="button" class="ghost danger image-remove" onclick="removeLogImage('${kind}',${index})">Remove</button></div></div>`;
}
function revokePendingPreviews(){for(const x of pendingLogImages)if(x.previewUrl)URL.revokeObjectURL(x.previewUrl)}
function renderLogImageEditor(){
 const el=$('#logImageEditor');if(!el)return;
 const blocks=[];
 if(editingLogImages.length)blocks.push(`<div class="image-editor-section"><h3>Attached images</h3>${editingLogImages.map((img,i)=>imageMetaHtml(img,$('#logId').value,true,i,'existing')).join('')}</div>`);
 if(pendingLogImages.length)blocks.push(`<div class="image-editor-section"><h3>New images</h3>${pendingLogImages.map((img,i)=>imageMetaHtml(img,$('#logId').value,true,i,'pending')).join('')}</div>`);
 el.innerHTML=blocks.join('');hydrateImages(el);
}
window.updateLogImageMeta=(kind,index,key,value)=>{const arr=kind==='pending'?pendingLogImages:editingLogImages;if(arr[index])arr[index][key]=value};
window.removeLogImage=(kind,index)=>{const arr=kind==='pending'?pendingLogImages:editingLogImages;if(!arr[index])return;if(kind==='pending'&&arr[index].previewUrl)URL.revokeObjectURL(arr[index].previewUrl);arr.splice(index,1);renderLogImageEditor()};
async function fileToBase64(file){const buf=new Uint8Array(await file.arrayBuffer());let binary='';for(let i=0;i<buf.length;i+=0x8000)binary+=String.fromCharCode(...buf.subarray(i,i+0x8000));return btoa(binary)}
async function uploadDevelopmentImage(item){
 if(!adminKey)throw new Error('Connect cloud storage before adding development images.');
 const file=item.file,chunkSize=1.25*1024*1024;let index=0;
 for(let start=0;start<file.size;start+=chunkSize){
   const chunk=file.slice(start,Math.min(file.size,start+chunkSize));
   const data=await fileToBase64(chunk);
   await api('/.netlify/functions/image',{method:'POST',body:JSON.stringify({action:'put',imageId:item.id,index,data})});index++;
 }
 return {id:item.id,fileName:file.name,type:file.type||'application/octet-stream',size:file.size,chunkCount:index,caption:item.caption||'',imageType:item.imageType||'Process',includeInHistory:!!item.includeInHistory,created:new Date().toISOString()};
}
async function deleteDevelopmentImageBlob(img){
 if(!img?.id||!img?.chunkCount||!adminKey)return;
 await api('/.netlify/functions/image',{method:'POST',body:JSON.stringify({action:'delete',imageId:img.id,chunkCount:img.chunkCount})});
 const url=imageUrlCache.get(img.id);if(url){URL.revokeObjectURL(url);imageUrlCache.delete(img.id)}
}
async function getDevelopmentImageUrl(img){
 if(!img?.id)return'';if(imageUrlCache.has(img.id))return imageUrlCache.get(img.id);
 const parts=[];
 for(let i=0;i<(img.chunkCount||0);i++){
   const x=await api(`/.netlify/functions/image?imageId=${encodeURIComponent(img.id)}&index=${i}`);
   const bin=atob(x.data),u=new Uint8Array(bin.length);for(let j=0;j<bin.length;j++)u[j]=bin.charCodeAt(j);parts.push(u);
 }
 const url=URL.createObjectURL(new Blob(parts,{type:img.type||'image/png'}));imageUrlCache.set(img.id,url);return url;
}
function findImageMeta(id){for(const log of state.logs||[]){const img=(log.images||[]).find(x=>x.id===id);if(img)return {img,log}}return null}
async function hydrateImages(root=document){
 const nodes=[...root.querySelectorAll('img[data-cloud-image]')];
 await Promise.all(nodes.map(async imgEl=>{const id=imgEl.dataset.cloudImage,found=findImageMeta(id);if(!found)return;try{imgEl.src=await getDevelopmentImageUrl(found.img)}catch(e){imgEl.alt='Image unavailable';console.warn('Image load failed',id,e)}}));
}
window.openDevelopmentImage=async(entryId,imageId)=>{const found=findImageMeta(imageId);if(!found)return;const modal=$('#imageModal'),img=$('#imageModalImg'),cap=$('#imageModalCaption');img.src=await getDevelopmentImageUrl(found.img);img.alt=found.img.caption||found.img.fileName||'Development image';cap.textContent=[found.img.imageType,found.img.caption,found.log.title].filter(Boolean).join(' · ');modal.classList.remove('hidden');document.body.classList.add('modal-open')};
function closeImageModal(){$('#imageModal').classList.add('hidden');$('#imageModalImg').removeAttribute('src');if(typeof researchModalObjectUrl!=='undefined'&&researchModalObjectUrl){URL.revokeObjectURL(researchModalObjectUrl);researchModalObjectUrl=''}document.body.classList.remove('modal-open')}
function render(){initSelects();renderLogs();renderVisualHistory();renderSources();renderPaperUses();renderPlans();renderBackups();renderPaperBackups();setStorageBadge()}
function logImagesHtml(e){const imgs=Array.isArray(e.images)?e.images:[];if(!imgs.length)return'';return `<div class="dev-image-gallery">${imgs.map(img=>imageMetaHtml(img,e.id,false)).join('')}</div>`}
function renderLogs(){let items=[...state.logs].sort((a,b)=>(b.date||'').localeCompare(a.date||''));const q=$('#logSearch').value.toLowerCase().trim(),phase=$('#logFilter').value;if(q)items=items.filter(e=>JSON.stringify(e).toLowerCase().includes(q));if(phase)items=items.filter(e=>e.phase===phase);$('#logCount').textContent=state.logs.length;$('#phaseCount').textContent=new Set(state.logs.map(e=>e.phase)).size;$('#logList').innerHTML=items.length?items.map(e=>`<article class="card"><div class="card-head"><div><span class="phase">${esc(e.phase)}</span><h3>${esc(e.title)}</h3><div class="meta">${esc(humanDate(e.date))}</div></div></div><div class="card-body"><div><h4>What happened</h4><p>${esc(e.what)}</p></div><div><h4>Why / rationale & reflection</h4><p>${esc(e.why)}</p></div></div>${logImagesHtml(e)}<div class="tags">${(e.tags||[]).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div><div class="card-actions"><button class="ghost" onclick="editLog('${e.id}')">Edit</button><button class="ghost danger" onclick="deleteLog('${e.id}')">Delete</button></div></article>`).join(''):'<div class="empty">No matching development entries.</div>';hydrateImages($('#logList'))}
function clearLog(){revokePendingPreviews();editingLogImages=[];pendingLogImages=[];Object.assign($('#logForm'),{});$('#logId').value='';$('#logDate').value=today();$('#logPhase').value='Iteration';$('#logTitle').value='';$('#logWhat').value='';$('#logWhy').value='';$('#logTags').value='';$('#logImages').value='';$('#logFormTitle').textContent='Add new entry';renderLogImageEditor()}
window.editLog=id=>{const e=state.logs.find(x=>x.id===id);if(!e)return;revokePendingPreviews();pendingLogImages=[];editingLogImages=clone(e.images||[]);$('#logId').value=e.id;$('#logDate').value=isoDate(e.date);$('#logPhase').value=e.phase;$('#logTitle').value=e.title;$('#logWhat').value=e.what;$('#logWhy').value=e.why;$('#logTags').value=(e.tags||[]).join(', ');$('#logImages').value='';$('#logFormTitle').textContent='Edit entry';renderLogImageEditor();scrollTo({top:120,behavior:'smooth'})}
window.deleteLog=async id=>{if(!confirm('Delete this development log entry?'))return;const item=state.logs.find(x=>x.id===id);if(!item)return;const imgs=item.images||[];if(imgs.length&&!adminKey)return toast('Connect cloud storage before deleting an entry with images.');try{for(const img of imgs)await deleteDevelopmentImageBlob(img)}catch(e){console.error(e);return toast('Image cleanup failed; entry was not deleted.')}addTombstone('logs',item);state.logs=state.logs.filter(x=>x.id!==id);await persist();renderLogs();renderVisualHistory();toast('Entry deleted')}
function renderVisualHistory(){
 const rows=[];for(const log of state.logs||[])for(const img of log.images||[])if(img.includeInHistory)rows.push({log,img});
 rows.sort((a,b)=>(b.log.date||'').localeCompare(a.log.date||'')||(b.img.created||'').localeCompare(a.img.created||''));
 $('#visualCount').textContent=rows.length;$('#visualEntryCount').textContent=new Set(rows.map(x=>x.log.id)).size;
 const el=$('#visualTimeline');if(!rows.length){el.innerHTML='<div class="empty">No images have been selected for the Visual History yet. Attach images to Development Log entries and check “Include in Visual History.”</div>';return}
 const byDate=new Map();for(const row of rows){const d=row.log.date||'';if(!byDate.has(d))byDate.set(d,[]);byDate.get(d).push(row)}
 el.innerHTML=[...byDate.entries()].map(([date,group])=>`<section class="visual-date"><div class="visual-date-marker"><span></span><time>${esc(humanDate(date))}</time></div><div class="visual-date-content">${group.map(({log,img})=>`<article class="visual-card"><button type="button" class="visual-image-button" onclick="openDevelopmentImage('${esc(log.id)}','${esc(img.id)}')"><img data-cloud-image="${esc(img.id)}" alt="${esc(img.caption||img.fileName||'Development image')}" loading="lazy"></button><div class="visual-card-copy"><span class="phase">${esc(log.phase)}</span><h2>${esc(log.title)}</h2><div class="visual-caption"><span class="image-type">${esc(img.imageType||'Process')}</span>${img.caption?`<p>${esc(img.caption)}</p>`:''}</div><button class="ghost" onclick="editLog('${esc(log.id)}');document.querySelector('[data-view=log]').click()">Open log entry</button></div></article>`).join('')}</div></section>`).join('');hydrateImages(el)
}

function sourceFolders(){return [...new Set([...(state.themes||[]).map(x=>x.theme).filter(Boolean),...(state.sources||[]).map(x=>x.theme).filter(Boolean),...SOURCE_FOLDERS])].sort((a,b)=>a.localeCompare(b))}
function safeHref(url){try{const u=new URL(String(url||''),location.href);return ['http:','https:'].includes(u.protocol)?u.href:''}catch{return''}}
function materialFileId(m){return m?.fileId||m?.id||''}
function sourceAnnotations(s){return Array.isArray(s.annotations)?s.annotations:[]}
function sourceAttachments(sourceId){return (state.researchMaterials||[]).filter(m=>m.sourceId===sourceId)}
function refreshSourceOptions(){
 const theme=$('#sourceTheme'),filter=$('#sourceThemeFilter');const names=sourceFolders();const selectedTheme=theme?.value||'',selectedFilter=filter?.value||'';
 if(theme){theme.innerHTML='<option value="">No theme selected</option>'+names.map(x=>`<option>${esc(x)}</option>`).join('');theme.value=selectedTheme}
 if(filter){filter.innerHTML='<option value="">All themes</option>'+names.map(x=>`<option>${esc(x)}</option>`).join('');filter.value=selectedFilter}
 const dl=$('#sourcePaperSectionOptions');if(dl)dl.innerHTML=(state.outline||[]).map(o=>`<option value="${esc([o.chapter,o.section].filter(Boolean).join(' · '))}"></option>`).join('');
}
function annotationHtml(s,a){return `<article class="annotation-card"><div class="annotation-head"><div><span class="annotation-type">${esc(a.type||'Note')}</span>${a.location?`<span class="annotation-location">${esc(a.location)}</span>`:''}</div></div><div class="annotation-text">${esc(a.text||'')}</div>${a.interpretation?`<div class="annotation-detail"><b>Why it matters</b><p>${esc(a.interpretation)}</p></div>`:''}${a.paperUse?`<div class="annotation-detail"><b>Use in paper</b><p>${esc(a.paperUse)}</p></div>`:''}${a.tags?.length?`<div class="tags">${a.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>`:''}<div class="card-actions"><button type="button" class="ghost" onclick="editSourceAnnotation('${s.id}','${a.id}')">Edit note</button><button type="button" class="ghost danger" onclick="deleteSourceAnnotation('${s.id}','${a.id}')">Delete note</button></div></article>`}
function isImageAttachment(m){const type=String(m?.type||'').toLowerCase(),name=String(m?.fileName||m?.staticPath||'').toLowerCase();return type.startsWith('image/')||/\.(png|jpe?g|gif|webp|svg|bmp|avif)$/i.test(name)}
const researchThumbUrls=new Map();let researchModalObjectUrl='';
function clearResearchThumbUrls(){for(const u of researchThumbUrls.values())URL.revokeObjectURL(u);researchThumbUrls.clear()}
async function hydrateResearchThumbnails(root=document){const imgs=[...root.querySelectorAll('img[data-research-thumb]')];await Promise.all(imgs.map(async img=>{const id=img.dataset.researchThumb,m=(state.researchMaterials||[]).find(x=>x.id===id);if(!m)return;try{let url;if(m.storage==='static'&&m.staticPath)url=m.staticPath;else{const blob=await getResearchAttachmentBlob(m);url=URL.createObjectURL(blob);researchThumbUrls.set(id,url)}img.src=url;img.closest('.research-thumb')?.classList.add('loaded')}catch(e){img.closest('.research-thumb')?.classList.add('unavailable');img.alt='Preview unavailable';console.warn('Research thumbnail unavailable',e)}}))}
function attachmentHtml(m){const image=isImageAttachment(m);return `<div class="source-attachment${image?' source-attachment-image':''}">${image?`<button type="button" class="research-thumb" onclick="previewResearchAttachment('${m.id}')" aria-label="View larger preview of ${esc(m.title||m.fileName||'image')}"><img data-research-thumb="${esc(m.id)}" alt="${esc(m.title||m.fileName||'Research image')}" loading="lazy"><span class="research-thumb-placeholder">Image preview</span></button>`:''}<div class="source-attachment-copy"><span class="phase">${esc(m.materialType||'File')}</span><b>${esc(m.title||m.fileName||'Attachment')}</b>${m.location?`<span class="attachment-location">${esc(m.location)}</span>`:''}${m.notes?`<span class="small">${esc(m.notes)}</span>`:''}<span class="small">${esc(m.fileName||'')}${m.size?' · '+fmtBytes(m.size):''}</span></div><div class="attachment-actions">${image?`<button type="button" class="ghost" onclick="previewResearchAttachment('${m.id}')">View larger</button>`:''}${m.fileName?`<button type="button" class="ghost" onclick="openResearchAttachment('${m.id}')">Open</button><button type="button" class="ghost" onclick="downloadResearchAttachment('${m.id}')">Download</button>`:''}<button type="button" class="ghost" onclick="editSourceAttachment('${m.id}')">Edit</button><button type="button" class="ghost danger" onclick="deleteSourceAttachment('${m.id}')">Delete</button></div></div>`}
function sourceShortCitation(s){
 if(!s)return'';
 const author=String(s.authors||'').trim();
 const year=String(s.date||'').match(/\b(19|20)\d{2}\b/)?.[0]||String(s.date||'').trim();
 if(!author)return year?`(${year})`:'';
 const first=author.split(/,|&| and /)[0].trim();
 return year?`${first} (${year})`:first
}

function sourceAuthorSurnames(authorText){
 const text=String(authorText||'').trim();if(!text)return[];
 const found=[];
 const re=/(?:^|,\s*(?:&\s*)?)([^,]+),\s*(?:[A-Z][A-Za-z.'’\-]*\.?)(?=\s|,|$)/g;
 let m;while((m=re.exec(text))){const name=String(m[1]||'').trim();if(name&&!found.includes(name))found.push(name)}
 if(found.length)return found;
 const parts=text.split(/\s+(?:&|and)\s+/i).map(x=>x.trim()).filter(Boolean);
 return parts.map(x=>x.includes(',')?x.split(',')[0].trim():x).filter(Boolean);
}
function sourceCitationYear(s){return String(s?.date||'').match(/\b(19|20)\d{2}[a-z]?\b/i)?.[0]||String(s?.date||'').trim()}
function sourceParentheticalCitation(s){
 if(!s)return'';const names=sourceAuthorSurnames(s.authors),year=sourceCitationYear(s);
 let who='';if(names.length===1)who=names[0];else if(names.length===2)who=`${names[0]} & ${names[1]}`;else if(names.length>2)who=`${names[0]} et al.`;else who=String(s.authors||'').trim();
 if(who&&year)return`(${who}, ${year})`;if(who)return`(${who})`;if(year)return`(${year})`;return''
}
function sourceNarrativeCitation(s){
 if(!s)return'';const names=sourceAuthorSurnames(s.authors),year=sourceCitationYear(s);
 let who='';if(names.length===1)who=names[0];else if(names.length===2)who=`${names[0]} and ${names[1]}`;else if(names.length>2)who=`${names[0]} et al.`;else who=String(s.authors||'').trim();
 if(who&&year)return`${who} (${year})`;return who||year
}
async function copyText(text,label='Copied'){
 const value=String(text||'').trim();if(!value){toast('Nothing to copy yet');return}
 try{await navigator.clipboard.writeText(value)}catch(e){const ta=document.createElement('textarea');ta.value=value;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove()}
 toast(label)
}
window.copySourceApa=id=>{const s=(state.sources||[]).find(x=>x.id===id);copyText(s?.apa||'','Full APA reference copied')};
window.copySourceInText=id=>{const s=(state.sources||[]).find(x=>x.id===id);copyText(sourceParentheticalCitation(s),'In-text citation copied')};
window.copySourceNarrative=id=>{const s=(state.sources||[]).find(x=>x.id===id);copyText(sourceNarrativeCitation(s),'Narrative citation copied')};
window.copyEditorApa=()=>copyText($('#sourceApa')?.value||'','Full APA reference copied');
window.copyEditorInText=()=>copyText(sourceParentheticalCitation({authors:$('#sourceAuthors')?.value||'',date:$('#sourceDate')?.value||''}),'In-text citation copied');
window.copyEditorNarrative=()=>copyText(sourceNarrativeCitation({authors:$('#sourceAuthors')?.value||'',date:$('#sourceDate')?.value||''}),'Narrative citation copied');
function sourcePaperUseCount(sourceId){return (state.paperUses||[]).filter(x=>x.sourceId===sourceId).length}
function sourceIsUsedInPaper(source){
 if(!source)return false;
 if(source.status==='Cited')return true;
 return (state.paperUses||[]).some(x=>x.sourceId===source.id&&x.status==='Used');
}
function renderSourceNavigation(){
 const all=(state.sources||[]).slice().sort((a,b)=>(a.title||'').localeCompare(b.title||''));
 const used=all.filter(sourceIsUsedInPaper);
 if($('#allSourcesTabCount'))$('#allSourcesTabCount').textContent=all.length;
 if($('#usedSourcesTabCount'))$('#usedSourcesTabCount').textContent=used.length;
 $$('.research-source-tab').forEach(btn=>{const active=btn.dataset.sourceView===researchSourceView;btn.classList.toggle('active',active);btn.setAttribute('aria-selected',active?'true':'false')});
 const jump=$('#sourceJump');
 if(jump){const selected=jump.value;jump.innerHTML='<option value="">Choose a source…</option>'+all.map(s=>`<option value="${esc(s.id)}">${esc(s.title||'Untitled source')}</option>`).join('');if(selected&&all.some(s=>s.id===selected))jump.value=selected}
 const form=$('#sourceFormPanel');if(form)form.classList.toggle('source-view-hidden',researchSourceView==='used');
 const paper=$('#paperUseOverview');if(paper)paper.classList.add('source-view-hidden');
}
window.setResearchSourceView=view=>{
 researchSourceView=view==='used'?'used':'all';
 renderSourceNavigation();renderPaperUses();renderSources();
 if(researchSourceView==='used')requestAnimationFrame(()=>$('#sourceList')?.scrollIntoView({behavior:'smooth',block:'start'}));
};
window.jumpToResearchSource=id=>{
 if(!id)return;const s=(state.sources||[]).find(x=>x.id===id);if(!s)return;
 if(researchSourceView==='used'&&!sourceIsUsedInPaper(s))researchSourceView='all';
 renderSources();renderPaperUses();
 requestAnimationFrame(()=>{const card=document.getElementById('source-card-'+id);if(!card)return;card.scrollIntoView({behavior:'smooth',block:'center'});try{card.focus({preventScroll:true})}catch(e){}card.classList.add('source-jump-highlight');setTimeout(()=>card.classList.remove('source-jump-highlight'),1400)});
};
function paperUseEvidenceHtml(use){
 const s=state.sources.find(x=>x.id===use.sourceId);if(!s)return'';
 const ids=new Set(use.annotationIds||[]),anns=(s.annotations||[]).filter(a=>ids.has(a.id));
 if(!anns.length)return'<div class="annotation-empty">No annotations selected for this paper-use card.</div>';
 return `<div class="paper-use-evidence">${anns.map(a=>`<div class="paper-use-evidence-item"><div class="meta"><b>${esc(a.location||'No page listed')}</b>${a.type?' · '+esc(a.type):''}</div><div>${esc(a.text||'')}</div>${a.interpretation?`<div class="small"><b>Interpretation:</b> ${esc(a.interpretation)}</div>`:''}</div>`).join('')}</div>`
}
function renderPaperUses(){
 const list=$('#paperUseList');if(!list)return;
 const uses=(state.paperUses||[]).slice().sort((a,b)=>{const order={Planned:0,Drafted:1,Used:2};return (order[a.status]??9)-(order[b.status]??9)||String(a.paperSection||'').localeCompare(String(b.paperSection||''))});
 const open=uses.filter(x=>x.status!=='Used').length;if($('#paperUseCount'))$('#paperUseCount').textContent=`${open} active`;
 if(!uses.length){list.innerHTML='<div class="annotation-empty">No paper-use cards yet. Open a source and choose <b>Use in paper</b> to connect evidence to the manuscript.</div>';return}
 list.innerHTML=uses.map(u=>{const s=state.sources.find(x=>x.id===u.sourceId);if(!s)return'';const pages=[...new Set((s.annotations||[]).filter(a=>(u.annotationIds||[]).includes(a.id)).map(a=>a.location).filter(Boolean))];return `<article class="paper-use-card" id="paper-use-${esc(u.id)}"><div class="paper-use-head"><div><span class="phase">${esc(u.paperSection||'Paper section not assigned')}</span><h3>${esc(u.point||'Paper use')}</h3><div class="meta">${esc(s.title||'Untitled source')}${sourceShortCitation(s)?' · '+esc(sourceShortCitation(s)):''}${pages.length?' · '+esc(pages.join(', ')):''}</div></div><select aria-label="Paper use status" onchange="setPaperUseStatus('${u.id}',this.value)"><option${u.status==='Planned'?' selected':''}>Planned</option><option${u.status==='Drafted'?' selected':''}>Drafted</option><option${u.status==='Used'?' selected':''}>Used</option></select></div>${s.apa?`<div class="citation paper-use-citation">${esc(s.apa)}</div>`:''}${paperUseEvidenceHtml(u)}<div class="card-actions"><button type="button" class="ghost" onclick="editPaperUse('${u.id}')">Edit</button><button type="button" class="ghost" onclick="editSource('${s.id}')">Open source</button><button type="button" class="ghost danger" onclick="deletePaperUse('${u.id}')">Delete</button></div></article>`}).join('')
}
function paperSectionOptions(){return [...new Set((state.outline||[]).map(o=>[o.chapter,o.section].filter(Boolean).join(' · ')).filter(Boolean))]}
function fillPaperUseSections(selected=''){
 const sel=$('#paperUseSection');if(!sel)return;const opts=paperSectionOptions();if(selected&&!opts.includes(selected))opts.unshift(selected);sel.innerHTML='<option value="">Choose a paper section…</option>'+opts.map(x=>`<option${x===selected?' selected':''}>${esc(x)}</option>`).join('')
}
function paperUseAnnotationChoices(sourceId,selected=[]){
 const box=$('#paperUseAnnotations');if(!box)return;const s=state.sources.find(x=>x.id===sourceId),chosen=new Set(selected||[]),anns=s?.annotations||[];
 box.innerHTML=anns.length?anns.map(a=>`<label class="paper-use-check"><input type="checkbox" value="${esc(a.id)}"${chosen.has(a.id)?' checked':''}><span><b>${esc(a.location||'No page')}</b>${a.type?' · '+esc(a.type):''}<br>${esc(String(a.text||'').slice(0,240))}${String(a.text||'').length>240?'…':''}</span></label>`).join(''):'<div class="annotation-empty">This source does not have any annotations yet. You can still create a paper-use card, or add notes to the source first.</div>'
}
function clearPaperUse(){for(const id of ['paperUseId','paperUseSourceId','paperUsePoint']){const el=$('#'+id);if(el)el.value=''}if($('#paperUseStatus'))$('#paperUseStatus').value='Planned';fillPaperUseSections('');if($('#paperUseSourceLabel'))$('#paperUseSourceLabel').textContent='';if($('#paperUseCitation'))$('#paperUseCitation').textContent='';if($('#paperUseAnnotations'))$('#paperUseAnnotations').innerHTML='';$('#paperUseEditor')?.classList.add('hidden')}
window.useSourceInPaper=sourceId=>{const s=state.sources.find(x=>x.id===sourceId);if(!s)return;clearPaperUse();$('#paperUseSourceId').value=sourceId;$('#paperUseSourceLabel').textContent=s.title||'Untitled source';$('#paperUseCitation').textContent=s.apa||sourceShortCitation(s)||'';fillPaperUseSections(s.paperSection||'');paperUseAnnotationChoices(sourceId,[]);$('#paperUseEditorTitle').textContent='Use source in paper';$('#paperUseEditor').classList.remove('hidden');$('#paperUseEditor').scrollIntoView({behavior:'smooth',block:'start'})}
window.editPaperUse=id=>{const u=(state.paperUses||[]).find(x=>x.id===id);if(!u)return;const s=state.sources.find(x=>x.id===u.sourceId);if(!s)return;clearPaperUse();$('#paperUseId').value=u.id;$('#paperUseSourceId').value=u.sourceId;$('#paperUseSourceLabel').textContent=s.title||'Untitled source';$('#paperUseCitation').textContent=s.apa||sourceShortCitation(s)||'';$('#paperUsePoint').value=u.point||'';$('#paperUseStatus').value=u.status||'Planned';fillPaperUseSections(u.paperSection||'');paperUseAnnotationChoices(u.sourceId,u.annotationIds||[]);$('#paperUseEditorTitle').textContent='Edit paper use';$('#paperUseEditor').classList.remove('hidden');$('#paperUseEditor').scrollIntoView({behavior:'smooth',block:'start'})}
window.setPaperUseStatus=async(id,status)=>{const u=(state.paperUses||[]).find(x=>x.id===id);if(!u)return;u.status=status;u.updatedAt=new Date().toISOString();await persist();renderPaperUses();toast('Paper-use status updated')}
window.deletePaperUse=async id=>{const u=(state.paperUses||[]).find(x=>x.id===id);if(!u||!confirm('Delete this paper-use card?'))return;addTombstone('paperUses',u);state.paperUses=state.paperUses.filter(x=>x.id!==id);await persist();renderPaperUses();renderSources();toast('Paper-use card deleted')}

function renderSources(){
 refreshSourceOptions();renderSourceNavigation();let items=[...state.sources];if(researchSourceView==='used')items=items.filter(sourceIsUsedInPaper);const q=($('#sourceSearch')?.value||'').toLowerCase().trim(),theme=$('#sourceThemeFilter')?.value||'',status=$('#sourceStatusFilter')?.value||'',type=$('#sourceTypeFilter')?.value||'';
 if(q)items=items.filter(s=>JSON.stringify({...s,attachments:sourceAttachments(s.id)}).toLowerCase().includes(q));if(theme)items=items.filter(s=>s.theme===theme);if(status)items=items.filter(s=>s.status===status);if(type)items=items.filter(s=>(s.sourceType||'Article / PDF')===type);
 items.sort((a,b)=>({High:0,Medium:1,Low:2}[a.priority]??9)-({High:0,Medium:1,Low:2}[b.priority]??9)||(a.title||'').localeCompare(b.title||''));
 $('#sourceCount').textContent=state.sources.length;$('#readCount').textContent=state.sources.filter(x=>['Read','Cited'].includes(x.status)).length;const list=$('#sourceList');if(!items.length){list.innerHTML=`<div class="empty">${researchSourceView==='used'?'No sources are marked as used in the paper yet.':'No matching research sources.'}</div>`;return}
 if(researchSourceView==='used'){
  list.innerHTML=`<section class="used-source-list">${items.map(s=>{const uses=(state.paperUses||[]).filter(u=>u.sourceId===s.id),sections=[...new Set(uses.map(u=>u.paperSection).filter(Boolean))],href=safeHref(s.url);return `<article class="used-source-row" id="source-card-${esc(s.id)}" tabindex="-1"><div class="used-source-main"><h3>${esc(s.title||'Untitled source')}</h3><div class="meta">${esc(sourceShortCitation(s)||s.authors||'')}${sections.length?' · '+esc(sections.join(' • ')):''}</div></div><div class="used-source-actions"><button type="button" class="ghost" onclick="copySourceInText('${s.id}')">Copy citation</button><button type="button" class="ghost" onclick="copySourceApa('${s.id}')">Copy reference</button>${href?`<a class="button-link ghost" href="${esc(href)}" target="_blank" rel="noopener">Open link</a>`:''}<button type="button" onclick="editSource('${s.id}')">Open source</button></div></article>`}).join('')}</section>`;
  return;
 }
 const groups=sourceFolders().map(folder=>[folder,items.filter(s=>s.theme===folder)]).filter(([,g])=>g.length);const unfiled=items.filter(s=>!s.theme);if(unfiled.length)groups.push(['Unfiled / Research Artifacts',unfiled]);
 list.innerHTML=groups.map(([folder,group])=>`<section class="source-folder"><div class="source-folder-head"><span class="folder-icon" aria-hidden="true">📁</span><div><h2>${esc(folder)}</h2><div class="meta">${group.length} item${group.length===1?'':'s'}</div></div></div><div class="source-folder-cards">${group.map(s=>{const anns=sourceAnnotations(s),atts=sourceAttachments(s.id),href=safeHref(s.url);return `<article class="card source-card" id="source-card-${esc(s.id)}" tabindex="-1"><div class="card-head"><div><span class="phase">${esc(s.sourceType||'Article / PDF')}</span><h3>${esc(s.title)}</h3><div class="meta">${esc(s.authors||'')}${s.date?' · '+esc(s.date):''}${s.publisher?' · '+esc(s.publisher):''}</div></div><div><span class="status-pill">${esc(s.status||'Not Started')}</span> <span class="status-pill">${esc(s.priority||'Medium')}</span></div></div>${s.apa?`<div class="citation source-citation">${esc(s.apa)}</div><div class="citation-copy-actions"><button type="button" class="ghost" onclick="copySourceInText('${s.id}')">Copy in-text citation</button><button type="button" class="ghost" onclick="copySourceNarrative('${s.id}')">Copy narrative citation</button><button type="button" class="ghost" onclick="copySourceApa('${s.id}')">Copy APA reference</button></div>`:''}<div class="source-grid"><div><h4>Key argument</h4><p>${esc(s.keyArgument||'')}</p></div><div><h4>Connection to PromptCraft</h4><p>${esc(s.connection||'')}</p></div><div><h4>Methodology</h4><p>${esc(s.methodology||'')}</p></div><div><h4>Paper connection</h4><p>${esc(s.paperSection||'Not assigned yet')}</p>${href?`<p><a href="${esc(href)}" target="_blank" rel="noopener">Open source link</a></p>`:''}</div></div>${s.tags?.length?`<div class="tags">${s.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>`:''}<div class="source-section"><div class="source-section-head"><h4>Documents, diagrams & images</h4><button type="button" class="ghost" onclick="addSourceAttachment('${s.id}')">Add file</button></div>${atts.length?atts.map(attachmentHtml).join(''):'<div class="annotation-empty">No file attached yet. Add the PDF, Word document, diagram, screenshot, table, or other paper material here.</div>'}</div><div class="source-section"><div class="source-section-head"><h4>Notes & annotations</h4><button type="button" onclick="addSourceAnnotation('${s.id}')">Add note</button></div>${anns.length?anns.map(a=>annotationHtml(s,a)).join(''):'<div class="annotation-empty">No notes yet. Page numbers, figures, tables, and section locations can be recorded with each note.</div>'}</div><div class="card-actions"><button type="button" onclick="useSourceInPaper('${s.id}')">Use in paper${sourcePaperUseCount(s.id)?` (${sourcePaperUseCount(s.id)})`:``}</button><button type="button" class="ghost" onclick="editSource('${s.id}')">Edit source</button><button type="button" class="ghost danger" onclick="deleteSource('${s.id}')">Delete</button></div></article>`}).join('')}</div></section>`).join('')
 clearResearchThumbUrls();hydrateResearchThumbnails(list);
}
function sourceEditorId(){return $('#sourceId')?.value||''}
function sourceEditorIsActive(id){return !!id&&sourceEditorId()===id&&$('#sourceFormTitle')?.textContent?.startsWith('Edit')}
function refreshSourceEditorRelated(id){
 const wrap=$('#sourceEditRelated'),attsEl=$('#sourceEditAttachments'),annsEl=$('#sourceEditAnnotations'),primaryEl=$('#sourcePrimaryDocumentCurrent'),help=$('#sourcePrimaryFileHelp');
 if(!wrap||!attsEl||!annsEl)return;
 if(!id){wrap.classList.add('hidden');if(primaryEl)primaryEl.classList.add('hidden');if(help)help.textContent='Optional. Choose the main PDF, Word document, or other source file.';return}
 const s=state.sources.find(x=>x.id===id);if(!s){wrap.classList.add('hidden');return}
 const atts=sourceAttachments(id),anns=sourceAnnotations(s),primary=atts.find(m=>m.role==='primary');
 wrap.classList.remove('hidden');
 attsEl.innerHTML=atts.length?atts.map(attachmentHtml).join(''):'<div class="annotation-empty">No files attached yet. Add the article, figures, screenshots, diagrams, tables, or other supporting material here.</div>';
 annsEl.innerHTML=anns.length?anns.map(a=>annotationHtml(s,a)).join(''):'<div class="annotation-empty">No notes yet. Add page-level notes, quotations, paraphrases, figures, and paper-use ideas here.</div>';
 if(primaryEl){if(primary){primaryEl.innerHTML=`<div><span class="phase">Current primary document</span><b>${esc(primary.fileName||primary.title||'Attached document')}</b><span class="small">${primary.size?fmtBytes(primary.size):''}</span></div><div class="attachment-actions">${primary.fileName?`<button type="button" class="ghost" onclick="openResearchAttachment('${primary.id}')">Open</button>`:''}<button type="button" class="ghost" onclick="editSourceAttachment('${primary.id}')">Edit document details</button></div>`;primaryEl.classList.remove('hidden')}else{primaryEl.classList.add('hidden');primaryEl.innerHTML=''}}
 if(help)help.textContent=primary?'Choose a new file only if you want to replace the current primary document.':'Optional. Choose the main PDF, Word document, or other source file.';
 queueMicrotask(()=>hydrateResearchThumbnails(wrap))
}
function returnToSourceEditorOrCard(sourceId,anchorId){
 if(sourceEditorIsActive(sourceId)){refreshSourceEditorRelated(sourceId);const el=$(anchorId||'#sourceEditRelated')||$('#sourceFormPanel');el?.scrollIntoView({behavior:'smooth',block:'start'});return}
 requestAnimationFrame(()=>returnToResearchSource(sourceId))
}
function citationImportString(v){
 if(v===undefined||v===null)return'';
 if(Array.isArray(v))return v.join(', ');
 if(typeof v==='object')return JSON.stringify(v);
 return String(v).trim()
}
function citationImportArray(v){
 if(Array.isArray(v))return v.map(x=>citationImportString(x)).filter(Boolean);
 if(!v)return[];
 return String(v).split(/[,;]\s*/).map(x=>x.trim()).filter(Boolean)
}
function citationImportValue(obj,keys,def=''){
 for(const k of keys)if(obj&&obj[k]!==undefined&&obj[k]!==null&&obj[k]!=='')return obj[k];
 return def
}
function stripCitationCodeFence(raw){
 let x=String(raw||'').trim();
 const m=x.match(/^```(?:json|javascript|js|text|markdown)?\s*([\s\S]*?)\s*```$/i);
 return m?m[1].trim():x
}
function parseLabeledCitationImport(raw){
 const known={
  'research theme':'theme','theme':'theme','folder':'theme','priority':'priority','source type':'sourceType','type':'sourceType',
  'article name':'title','article title':'title','source name':'title','source title':'title','title':'title',
  'authors':'authors','author':'authors','creator':'authors','creators':'authors','date':'date','year':'date','publication date':'date',
  'journal':'publisher','publisher':'publisher','journal / publisher':'publisher','publication':'publisher',
  'apa citation':'apa','apa 7 citation':'apa','apa 7':'apa','citation':'apa','reference':'apa',
  'key argument':'keyArgument','key finding':'keyArgument','useful finding':'keyArgument','key argument / useful finding':'keyArgument',
  'promptcraft connection':'connection','connection to promptcraft':'connection','relevance to promptcraft':'connection',
  'methodology':'methodology','method':'methodology','methods':'methodology',
  'paper section':'paperSection','likely paper section':'paperSection','paper use':'paperSection',
  'source url':'url','original source url':'url','url':'url','doi':'url','link':'url','tags':'tags','archive filename':'archiveFile','archive file':'archiveFile',
  'notes':'notes','notes / quotes':'notes','annotations':'notes','figures':'figures','figures / tables':'figures','figures/tables':'figures','visuals':'figures'
 };
 const obj={},lines=String(raw||'').replace(/\r/g,'').split('\n');let active='';
 for(const line of lines){
  const m=line.match(/^\s*(?:[-*]\s*)?([^:]{2,45}):\s*(.*)$/);
  if(m){const key=known[m[1].trim().toLowerCase()];if(key){active=key;obj[key]=(obj[key]?obj[key]+'\n':'')+m[2].trim();continue}}
  if(active&&line.trim())obj[active]+='\n'+line.trim()
 }
 if(!Object.keys(obj).length)throw new Error('Could not recognize the source package. Paste JSON or labeled fields such as Title:, Authors:, APA citation:, Key argument:, and Notes:.');
 if(obj.tags)obj.tags=citationImportArray(obj.tags);
 if(obj.notes)obj.notes=[{text:obj.notes,type:'Other'}];
 if(obj.figures)obj.figures=[{title:obj.figures,type:'Figure / diagram'}];
 return obj
}
function normalizeImportedAnnotation(a,defaultType='Other'){
 if(typeof a==='string')a={text:a};
 a=a||{};
 const location=citationImportString(citationImportValue(a,['location','page','pages','pageNumber','figureNumber','tableNumber']));
 const text=citationImportString(citationImportValue(a,['text','note','quote','paraphrase','finding','title','caption','description']));
 const interpretation=citationImportString(citationImportValue(a,['interpretation','relevance','whyItMatters','why','promptcraftConnection']));
 const paperUse=citationImportString(citationImportValue(a,['paperUse','use','intendedUse','paperSection','section']));
 const rawType=citationImportString(citationImportValue(a,['type','annotationType'],defaultType));
 let type=ANNOTATION_TYPES.includes(rawType)?rawType:defaultType;
 if(/table/i.test(rawType))type='Table / data';else if(/figure|diagram|visual|image/i.test(rawType))type='Figure / diagram';
 const extras=[];
 const attribution=citationImportString(citationImportValue(a,['attribution','credit','sourceAttribution']));if(attribution)extras.push(`Attribution: ${attribution}`);
 const archive=citationImportString(citationImportValue(a,['archiveFile','archiveFilename','fileName']));if(archive)extras.push(`Archive file: ${archive}`);
 return {id:uuid(),location,type,text:text||citationImportString(citationImportValue(a,['name'],'Imported research note')),interpretation:[interpretation,...extras].filter(Boolean).join('\n'),paperUse,tags:citationImportArray(citationImportValue(a,['tags'],[])),created:new Date().toISOString(),updatedAt:new Date().toISOString()}
}
function parseCitationImport(raw){
 const clean=stripCitationCodeFence(raw);let data;
 try{data=JSON.parse(clean)}catch{data=parseLabeledCitationImport(clean)}
 if(Array.isArray(data)){if(data.length!==1)throw new Error('Paste one source package at a time.');data=data[0]}
 if(data?.source&&typeof data.source==='object')data={...data.source,notes:data.notes||data.annotations||data.source.notes||data.source.annotations,figures:data.figures||data.visuals||data.tables||data.source.figures||data.source.visuals||data.source.tables};
 if(!data||typeof data!=='object')throw new Error('The citation package does not contain a source record.');
 const rawUrl=citationImportString(citationImportValue(data,['url','sourceUrl','link','doi']));
 const url=rawUrl&&/^10\.\d{4,9}\//.test(rawUrl)?`https://doi.org/${rawUrl}`:rawUrl;
 const imported={
  theme:citationImportString(citationImportValue(data,['theme','researchTheme','folder'])),priority:citationImportString(citationImportValue(data,['priority'],'High')),
  sourceType:citationImportString(citationImportValue(data,['sourceType','type'],'Article / PDF')),title:citationImportString(citationImportValue(data,['title','articleTitle','sourceTitle','articleName'])),
  authors:citationImportString(citationImportValue(data,['authors','author','creators','creator'])),date:citationImportString(citationImportValue(data,['date','year','publicationDate'])),
  publisher:citationImportString(citationImportValue(data,['publisher','journal','publication','journalPublisher'])),apa:citationImportString(citationImportValue(data,['apa','apa7','citation','reference'])),
  keyArgument:citationImportString(citationImportValue(data,['keyArgument','keyFinding','argument','usefulFinding'])),connection:citationImportString(citationImportValue(data,['connection','promptcraftConnection','relevance','relevanceToPromptCraft'])),
  methodology:citationImportString(citationImportValue(data,['methodology','method','methods'])),paperSection:citationImportString(citationImportValue(data,['paperSection','likelyPaperSection','paperUse'])),
  url,tags:citationImportArray(citationImportValue(data,['tags','keywords'],[])),archiveFile:citationImportString(citationImportValue(data,['archiveFile','archiveFilename','fileName']))
 };
 const access=citationImportString(citationImportValue(data,['access','accessStatus','fullText','fullTextStatus']));if(access&&!imported.tags.some(t=>t.toLowerCase()===access.toLowerCase()))imported.tags.push(access);
 const notes=citationImportValue(data,['annotations','notes','notesQuotes'],[]),figures=citationImportValue(data,['figures','visuals','tables','diagrams'],[]);
 const anns=[];
 const addMany=(v,type)=>{if(!v)return;const arr=Array.isArray(v)?v:[v];for(const a of arr)if(a!==''&&a!==null&&a!==undefined)anns.push(normalizeImportedAnnotation(a,type))};
 addMany(notes,'Other');addMany(figures,'Figure / diagram');
 if(!imported.title&&!imported.apa)throw new Error('The source package needs at least a title or APA citation.');
 return {source:imported,annotations:anns}
}
function hideCitationImport(){const p=$('#citationImportPanel');if(p)p.classList.add('hidden');if($('#citationImportSummary')){$('#citationImportSummary').classList.add('hidden');$('#citationImportSummary').textContent=''}if($('#citationImportText'))$('#citationImportText').value=''}
function showCitationImport(){const p=$('#citationImportPanel');if(!p)return;p.classList.remove('hidden');$('#citationImportText')?.focus();p.scrollIntoView({behavior:'smooth',block:'nearest'})}
function loadCitationImportIntoEditor(){
 try{
  const {source,annotations}=parseCitationImport($('#citationImportText').value);
  refreshSourceOptions();
  const map=[['sourceTheme','theme'],['sourceType','sourceType'],['sourcePriority','priority'],['sourceTitle','title'],['sourceAuthors','authors'],['sourceDate','date'],['sourcePublisher','publisher'],['sourceApa','apa'],['sourceArgument','keyArgument'],['sourceConnection','connection'],['sourceMethod','methodology'],['sourcePaperSection','paperSection'],['sourceUrl','url'],['sourceArchive','archiveFile']];
  for(const [id,key] of map){const el=$('#'+id);if(!el)continue;const val=source[key]||'';if(id==='sourceTheme'&&val&&!SOURCE_FOLDERS.includes(val)){el.value=''}else if(id==='sourceType'&&val&&![...el.options].some(o=>o.value===val)){el.value='Other'}else if(id==='sourcePriority'&&!['High','Medium','Low'].includes(val)){el.value='High'}else el.value=val}
  $('#sourceStatus').value='Not Started';$('#sourceTags').value=(source.tags||[]).join(', ');
  pendingImportedAnnotations=annotations;
  const summary=$('#citationImportSummary');if(summary){summary.textContent=`Loaded source details${annotations.length?` and ${annotations.length} page/figure note${annotations.length===1?'':'s'}`:''}. Review the fields, attach the full-text document/images, then save.`;summary.classList.remove('hidden')}
  $('#sourceFormPanel').scrollIntoView({behavior:'smooth',block:'start'});toast('Source package loaded for review')
 }catch(e){toast(e.message||'Could not import citation package')}
}
function clearSource(){pendingImportedAnnotations=[];hideCitationImport();for(const id of ['sourceId','sourceTitle','sourceAuthors','sourceDate','sourcePublisher','sourceApa','sourceArgument','sourceConnection','sourceMethod','sourcePaperSection','sourceUrl','sourceTags','sourceArchive','sourceAutoLookup']){const el=$('#'+id);if(el)el.value=''}if($('#sourceTheme'))$('#sourceTheme').value='';$('#sourcePriority').value='High';$('#sourceStatus').value='Not Started';$('#sourceType').value='Article / PDF';$('#sourceFile').value='';$('#sourceFormTitle').textContent='Add research source';setSourceAnalyzeState(false,'');const ap=$('#sourceAutoPreview');if(ap)ap.classList.add('hidden');if($('#sourceAutoPreviewContent'))$('#sourceAutoPreviewContent').innerHTML='';refreshSourceEditorRelated('')}
function returnToResearchSource(id){
 const card=document.getElementById(`source-card-${id}`);
 if(!card)return;
 card.scrollIntoView({behavior:'smooth',block:'center'});
 try{card.focus({preventScroll:true})}catch{}
 card.classList.add('source-card-return');
 setTimeout(()=>card.classList.remove('source-card-return'),1400);
}

window.editSource=id=>{const s=state.sources.find(x=>x.id===id);if(!s)return;researchSourceView='all';renderSourceNavigation();pendingImportedAnnotations=[];hideCitationImport();setSourceAnalyzeState(false,'');if($('#sourceAutoLookup'))$('#sourceAutoLookup').value='';refreshSourceOptions();for(const [fid,key] of [['sourceId','id'],['sourceTitle','title'],['sourceAuthors','authors'],['sourceDate','date'],['sourcePublisher','publisher'],['sourceApa','apa'],['sourceArgument','keyArgument'],['sourceConnection','connection'],['sourceMethod','methodology'],['sourcePaperSection','paperSection'],['sourceUrl','url'],['sourceArchive','archiveFile'],['sourceTheme','theme'],['sourcePriority','priority'],['sourceStatus','status'],['sourceType','sourceType']]){const el=$('#'+fid);if(el)el.value=s[key]||''}$('#sourceTags').value=(s.tags||[]).join(', ');$('#sourceFile').value='';$('#sourceFormTitle').textContent='Edit research source';refreshSourceEditorRelated(id);$('#sourceFormPanel').scrollIntoView({behavior:'smooth',block:'start'})}
window.deleteSource=async id=>{const item=state.sources.find(x=>x.id===id);if(!item||!confirm(`Delete this source record only: “${item.title}”? Its attached files and notes will also be removed. Other records with the same title will remain.`))return;try{for(const m of sourceAttachments(id)){await deleteResearchAttachmentFile(m);addTombstone('researchMaterials',m)}state.researchMaterials=(state.researchMaterials||[]).filter(m=>m.sourceId!==id);for(const u of (state.paperUses||[]).filter(x=>x.sourceId===id))addTombstone('paperUses',u);state.paperUses=(state.paperUses||[]).filter(x=>x.sourceId!==id);addTombstone('sources',item);state.sources=state.sources.filter(x=>x.id!==id);await persist();renderSources();renderPaperUses();toast('Research source deleted')}catch(e){toast(e.message)}}
function clearSourceAnnotation(){for(const id of ['sourceAnnotationSourceId','sourceAnnotationId','annotationLocation','annotationText','annotationInterpretation','annotationPaperUse','annotationTags']){const el=$('#'+id);if(el)el.value=''}if($('#annotationType'))$('#annotationType').value=ANNOTATION_TYPES[0];$('#sourceAnnotationEditor')?.classList.add('hidden')}
window.addSourceAnnotation=id=>{const s=state.sources.find(x=>x.id===id);if(!s)return;clearSourceAnnotation();$('#sourceAnnotationSourceId').value=id;$('#annotationFormTitle').textContent=`Add note · ${s.title}`;$('#sourceAnnotationEditor').classList.remove('hidden');$('#sourceAnnotationEditor').scrollIntoView({behavior:'smooth',block:'start'})}
window.editSourceAnnotation=(sourceId,annotationId)=>{const s=state.sources.find(x=>x.id===sourceId),a=s?.annotations?.find(x=>x.id===annotationId);if(!a)return;$('#sourceAnnotationSourceId').value=sourceId;$('#sourceAnnotationId').value=annotationId;$('#annotationLocation').value=a.location||'';$('#annotationType').value=a.type||ANNOTATION_TYPES[0];$('#annotationText').value=a.text||'';$('#annotationInterpretation').value=a.interpretation||'';$('#annotationPaperUse').value=a.paperUse||'';$('#annotationTags').value=(a.tags||[]).join(', ');$('#annotationFormTitle').textContent=`Edit note · ${s.title}`;$('#sourceAnnotationEditor').classList.remove('hidden');$('#sourceAnnotationEditor').scrollIntoView({behavior:'smooth',block:'start'})}
window.deleteSourceAnnotation=async(sourceId,annotationId)=>{const s=state.sources.find(x=>x.id===sourceId);if(!s||!confirm('Delete this note?'))return;s.annotations=(s.annotations||[]).filter(x=>x.id!==annotationId);s.updatedAt=new Date().toISOString();await persist();renderSources();renderPaperUses();if(sourceEditorIsActive(sourceId))refreshSourceEditorRelated(sourceId);toast('Note deleted')}
function clearSourceAttachment(){for(const id of ['attachmentId','attachmentSourceId','attachmentTitle','attachmentLocation','attachmentNotes']){const el=$('#'+id);if(el)el.value=''}if($('#attachmentType'))$('#attachmentType').value='Article / PDF';if($('#attachmentFile'))$('#attachmentFile').value='';if($('#attachmentCurrentFile'))$('#attachmentCurrentFile').textContent='Choose a PDF, Word file, diagram, screenshot, spreadsheet, slide, or other paper material.';$('#sourceAttachmentEditor')?.classList.add('hidden')}
window.addSourceAttachment=id=>{const s=state.sources.find(x=>x.id===id);if(!s)return;clearSourceAttachment();$('#attachmentSourceId').value=id;$('#attachmentFormTitle').textContent=`Add file · ${s.title}`;$('#sourceAttachmentEditor').classList.remove('hidden');$('#sourceAttachmentEditor').scrollIntoView({behavior:'smooth',block:'start'})}
window.editSourceAttachment=id=>{const m=(state.researchMaterials||[]).find(x=>x.id===id);if(!m)return;$('#attachmentId').value=m.id;$('#attachmentSourceId').value=m.sourceId||'';$('#attachmentType').value=m.materialType||'Article / PDF';$('#attachmentTitle').value=m.title||'';$('#attachmentLocation').value=m.location||'';$('#attachmentNotes').value=m.notes||'';$('#attachmentCurrentFile').textContent=m.fileName?`Current file: ${m.fileName} (${fmtBytes(m.size||0)}). Leave the file chooser blank to keep it.`:'No file currently attached.';$('#attachmentFile').value='';$('#attachmentFormTitle').textContent='Edit attached file';$('#sourceAttachmentEditor').classList.remove('hidden');$('#sourceAttachmentEditor').scrollIntoView({behavior:'smooth',block:'start'})}
async function getResearchAttachmentBlob(m){if(m.storage==='static'&&m.staticPath){const r=await fetch(m.staticPath);if(!r.ok)throw new Error('Imported tracker image could not be loaded.');return await r.blob()}if(m.storage==='cloud'){if(!cloud)throw new Error('Connect cloud storage first.');const parts=[];for(let i=0;i<(m.chunkCount||0);i++){const x=await api(`/.netlify/functions/backup?backupId=${encodeURIComponent(materialFileId(m))}&index=${i}`);const bin=atob(x.data),u=new Uint8Array(bin.length);for(let j=0;j<bin.length;j++)u[j]=bin.charCodeAt(j);parts.push(u)}return new Blob(parts,{type:m.type||'application/octet-stream'})}const blob=await idbGet(materialFileId(m));if(!blob)throw new Error('Local file bytes are not available in this browser.');return blob}
async function deleteResearchAttachmentFile(m){if(!m?.fileName||m.storage==='static')return;const id=materialFileId(m);if(m.storage==='cloud'){if(!cloud)throw new Error('Connect cloud storage first.');await api('/.netlify/functions/backup',{method:'POST',body:JSON.stringify({action:'delete',backupId:id,chunkCount:m.chunkCount||0})})}else await idbDelete(id)}
window.previewResearchAttachment=async id=>{const m=(state.researchMaterials||[]).find(x=>x.id===id);if(!m||!isImageAttachment(m))return;try{const modal=$('#imageModal'),img=$('#imageModalImg'),cap=$('#imageModalCaption');if(researchModalObjectUrl){URL.revokeObjectURL(researchModalObjectUrl);researchModalObjectUrl=''}let url;if(m.storage==='static'&&m.staticPath)url=m.staticPath;else{const blob=await getResearchAttachmentBlob(m);url=URL.createObjectURL(blob);researchModalObjectUrl=url}img.src=url;img.alt=m.title||m.fileName||'Research image';cap.textContent=[m.title||m.fileName,m.location,m.notes].filter(Boolean).join(' · ');modal.classList.remove('hidden');document.body.classList.add('modal-open')}catch(e){toast(e.message)}}
window.openResearchAttachment=async id=>{const m=(state.researchMaterials||[]).find(x=>x.id===id);if(!m)return;try{const blob=await getResearchAttachmentBlob(m),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';a.click();setTimeout(()=>URL.revokeObjectURL(url),60000)}catch(e){toast(e.message)}}
window.downloadResearchAttachment=async id=>{const m=(state.researchMaterials||[]).find(x=>x.id===id);if(!m)return;try{const blob=await getResearchAttachmentBlob(m),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=m.fileName||'research-file';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}catch(e){toast(e.message)}}
window.deleteSourceAttachment=async id=>{const m=(state.researchMaterials||[]).find(x=>x.id===id);if(!m||!confirm(`Delete attached file “${m.title||m.fileName}”?`))return;const sourceId=m.sourceId;try{await deleteResearchAttachmentFile(m);addTombstone('researchMaterials',m);state.researchMaterials=state.researchMaterials.filter(x=>x.id!==id);await persist();renderSources();if(sourceEditorIsActive(sourceId))refreshSourceEditorRelated(sourceId);toast('Attached file deleted')}catch(e){toast(e.message)}}

function renderPlans(){
 const themes=$('#themesList'),outline=$('#outlineList'),reading=$('#readingList');if(!outline||!reading)return;
 const outlineItems=state.outline||[];
 const progressed=outlineItems.filter(o=>o.status==='Drafted'||o.status==='Complete').length;
 const paperProgress=outlineItems.length?Math.round((progressed/outlineItems.length)*100):0;
 const openTasks=(state.reading||[]).filter(r=>!r.done).length;
 if($('#planPaperProgress'))$('#planPaperProgress').textContent=paperProgress+'%';
 if($('#planTaskCount'))$('#planTaskCount').textContent=openTasks;

 // Research focus remains available as a quiet reference because the Research Library uses it,
 // but it is no longer a separate planning workflow.
 if(themes)themes.innerHTML=(state.themes||[]).length?'<div class="focus-reference">'+state.themes.map(t=>`<span class="tag" title="${esc(t.question||'')}">${esc(t.theme)}</span>`).join('')+'</div>':'<div class="empty compact-empty">No research focus areas saved.</div>';

 const byChapter=new Map(),groups=[];
 for(const o of outlineItems){const key=o.chapter||'Other';if(!byChapter.has(key)){const g={chapter:key,items:[]};byChapter.set(key,g);groups.push(g)}byChapter.get(key).items.push(o)}
 const statusRank={'In Progress':0,'Not Started':1,'Drafted':2,'Complete':3};
 outline.innerHTML=groups.length?'<div class="paper-progress-list">'+groups.map(g=>{
   const active=g.items.filter(x=>x.status!=='Complete');
   const completed=g.items.filter(x=>x.status==='Complete');
   const ordered=[...active].sort((a,b)=>(statusRank[a.status]??9)-(statusRank[b.status]??9));
   const row=o=>`<div class="paper-progress-row ${o.status==='Complete'?'done':''}"><div class="paper-progress-copy"><b>${esc(o.section)}</b>${o.questions?`<small>${esc(o.questions)}</small>`:''}</div><div class="paper-progress-actions"><select aria-label="Paper section status" onchange="updateOutlineStatus('${o.id}',this.value)"><option ${o.status==='Not Started'?'selected':''}>Not Started</option><option ${o.status==='In Progress'?'selected':''}>In Progress</option><option ${o.status==='Drafted'?'selected':''}>Drafted</option><option ${o.status==='Complete'?'selected':''}>Complete</option></select><button class="ghost" onclick="editOutline('${o.id}')">Edit</button></div></div>`;
   return `<details class="paper-chapter" ${ordered.some(x=>x.status==='In Progress')?'open':''}><summary><span>${esc(g.chapter)}</span><small>${g.items.filter(x=>x.status==='Drafted'||x.status==='Complete').length}/${g.items.length} drafted or complete</small></summary><div class="paper-chapter-body">${ordered.map(row).join('')}${completed.length?`<details class="chapter-completed"><summary>${completed.length} completed section${completed.length===1?'':'s'}</summary>${completed.map(row).join('')}</details>`:''}</div></details>`
 }).join('')+'</div>':'<div class="empty">No paper sections yet.</div>';

 const tasks=[...(state.reading||[])],open=tasks.filter(r=>!r.done),done=tasks.filter(r=>r.done);
 const taskRow=r=>`<div class="research-task ${r.done?'done':''}"><label class="check"><input type="checkbox" ${r.done?'checked':''} onchange="updateReading('${r.id}',this.checked)"><span><b>${esc(r.reading)}</b>${r.goal?`<small>${esc(r.goal)}</small>`:''}${r.target?`<small>Target: ${esc(r.target)}</small>`:''}</span></label><div class="card-actions compact"><button class="ghost" onclick="editReading('${r.id}')">Edit</button><button class="ghost danger" onclick="deleteReading('${r.id}')">Delete</button></div></div>`;
 reading.innerHTML=(open.length?`<div class="task-list">${open.map(taskRow).join('')}</div>`:'<div class="empty compact-empty">Nothing is waiting on you right now.</div>')+(done.length?`<details class="completed-tasks"><summary>${done.length} completed task${done.length===1?'':'s'}</summary><div class="task-list">${done.map(taskRow).join('')}</div></details>`:'');
}
function hidePlanEditors(){for(const id of ['themeEditor','outlineEditor','readingEditor'])$('#'+id)?.classList.add('hidden')}
function openPlanEditor(id){hidePlanEditors();$('#'+id)?.classList.remove('hidden');$('#'+id)?.scrollIntoView({behavior:'smooth',block:'nearest'})}
function clearTheme(){for(const id of ['themeId','themeName','themeQuestion','themeSearch','themeChapters','themeScenarios'])$('#'+id).value='';$('#themeSources').value='0';$('#themeStatus').value='Not Started'}
function clearOutline(){for(const id of ['outlineId','outlineChapter','outlineSection','outlineQuestions']){const el=$('#'+id);if(el)el.value=''}if($('#outlineStatus'))$('#outlineStatus').value='Not Started'}
function clearReading(){for(const id of ['readingId','readingTitle','readingGoal','readingTarget']){const el=$('#'+id);if(el)el.value=''}if($('#readingDone'))$('#readingDone').checked=false}
window.editTheme=id=>{const t=state.themes.find(x=>x.id===id);if(!t)return;$('#themeId').value=t.id;$('#themeName').value=t.theme||'';$('#themeQuestion').value=t.question||'';$('#themeSearch').value=t.searchTerms||'';$('#themeChapters').value=t.chapters||'';$('#themeScenarios').value=t.scenarios||'';$('#themeSources').value=t.sourcesFound??0;$('#themeStatus').value=t.status||'Not Started';openPlanEditor('themeEditor')}
window.editOutline=id=>{const o=state.outline.find(x=>x.id===id);if(!o)return;$('#outlineId').value=o.id;$('#outlineChapter').value=o.chapter||'';$('#outlineSection').value=o.section||'';$('#outlineQuestions').value=o.questions||'';$('#outlineStatus').value=o.status||'Not Started';openPlanEditor('outlineEditor')}
window.editReading=id=>{const r=state.reading.find(x=>x.id===id);if(!r)return;$('#readingId').value=r.id;$('#readingTitle').value=r.reading||'';$('#readingGoal').value=r.goal||'';$('#readingTarget').value=r.target||'';$('#readingDone').checked=!!r.done;openPlanEditor('readingEditor')}
async function deletePlanItem(type,id,label){const item=state[type].find(x=>x.id===id);if(!item||!confirm(`Delete this ${label}?`))return;addTombstone(type,item);state[type]=state[type].filter(x=>x.id!==id);await persist();renderPlans();toast(`${label[0].toUpperCase()+label.slice(1)} deleted`)}
window.deleteTheme=id=>deletePlanItem('themes',id,'research theme');window.deleteOutline=id=>deletePlanItem('outline',id,'outline item');window.deleteReading=id=>deletePlanItem('reading',id,'reading item');
window.updateOutlineStatus=async(id,v)=>{const o=state.outline.find(x=>x.id===id);if(!o)return;o.status=v;o.updatedAt=new Date().toISOString();await persist();toast('Outline status saved')};window.updateReading=async(id,v)=>{const r=state.reading.find(x=>x.id===id);if(!r)return;r.done=v;r.updatedAt=new Date().toISOString();await persist();toast('Reading schedule saved')}

function renderBackups(){const items=[...state.backups].sort((a,b)=>b.created.localeCompare(a.created));$('#backupCount').textContent=items.length;$('#backupSize').textContent=(items.reduce((n,x)=>n+(x.size||0),0)/1048576).toFixed(1)+' MB';$('#backupList').innerHTML=items.length?items.map(b=>`<article class="card backup-card"><div class="card-head"><div><span class="phase">${esc(b.phase)}</span><h3>${esc(b.version)} · ${esc(b.title)}</h3><div class="meta">${new Date(b.created).toLocaleString()} · <span class="size">${fmtBytes(b.size)}</span></div></div></div><p>${esc(b.description)}</p><div class="file-meta"><b>${esc(b.fileName)}</b>${b.sha256?`<br><span class="small">SHA-256: ${esc(b.sha256)}</span>`:''}</div><div class="card-actions"><button class="ghost" onclick="downloadBackup('${b.id}')">Download</button><button class="ghost danger" onclick="deleteBackup('${b.id}')">Delete</button></div></article>`).join(''):'<div class="empty">No project snapshots yet. Add a ZIP when you reach a milestone worth preserving.</div>'}
function renderPaperBackups(){const items=[...(state.paperBackups||[])].sort((a,b)=>b.created.localeCompare(a.created));$('#paperBackupCount').textContent=items.length;$('#paperBackupSize').textContent=(items.reduce((n,x)=>n+(x.size||0),0)/1048576).toFixed(1)+' MB';$('#paperBackupList').innerHTML=items.length?items.map(b=>`<article class="card backup-card"><div class="card-head"><div><span class="phase">${esc(b.version||'Working draft')}</span><h3>${esc(b.title)}</h3><div class="meta">${new Date(b.created).toLocaleString()} · <span class="size">${fmtBytes(b.size)}</span></div></div></div><p>${esc(b.description||'')}</p><div class="file-meta"><b>${esc(b.fileName)}</b>${b.sha256?`<br><span class="small">SHA-256: ${esc(b.sha256)}</span>`:''}</div><div class="card-actions"><button class="ghost" onclick="downloadPaperBackup('${b.id}')">Download</button><button class="ghost danger" onclick="deletePaperBackup('${b.id}')">Delete</button></div></article>`).join(''):'<div class="empty">No paper backups yet. Save a copy before major revisions so the writing history stays recoverable.</div>'}
async function hashFile(file){const buf=await file.arrayBuffer();const h=await crypto.subtle.digest('SHA-256',buf);return [...new Uint8Array(h)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function progress(p,msg,id='backupProgress'){const el=$('#'+id);if(!el)return;el.classList.remove('hidden');el.firstElementChild.style.width=p+'%';el.lastElementChild.textContent=msg}function hideProgress(id='backupProgress'){const el=$('#'+id);if(el)el.classList.add('hidden')}
async function storeBackupFile(id,file,progressId='backupProgress'){
 if(!cloud){await idbPut(id,file);return {storage:'local',chunkCount:1}}
 const chunkSize=2.5*1024*1024;let idx=0;
 try{
   for(let start=0;start<file.size;start+=chunkSize){
     const ab=await file.slice(start,Math.min(file.size,start+chunkSize)).arrayBuffer();const bytes=new Uint8Array(ab);let binary='';
     for(let i=0;i<bytes.length;i+=0x8000)binary+=String.fromCharCode(...bytes.subarray(i,i+0x8000));
     const data=btoa(binary);progress(Math.round((Math.min(file.size,start+chunkSize)/file.size)*85),`Uploading chunk ${idx+1}…`,progressId);
     await api('/.netlify/functions/backup',{method:'POST',body:JSON.stringify({action:'put',backupId:id,index:idx,data})});idx++
   }
   return {storage:'cloud',chunkCount:idx}
 }catch(e){
   console.warn('Cloud file upload failed; preserving file locally instead.',e);
   if(idx>0){try{await api('/.netlify/functions/backup',{method:'POST',body:JSON.stringify({action:'delete',backupId:id,chunkCount:idx})})}catch(cleanupErr){console.warn('Partial cloud upload cleanup failed',cleanupErr)}}
   await idbPut(id,file);
   return {storage:'local',chunkCount:1,pendingCloud:true}
 }
}
window.downloadBackup=async id=>{const b=state.backups.find(x=>x.id===id);if(!b)return;progress(5,'Preparing download…');let blob;if(b.storage==='cloud'){if(!cloud){hideProgress();return toast('Connect cloud storage first')};const parts=[];for(let i=0;i<b.chunkCount;i++){progress(Math.round(((i+1)/b.chunkCount)*90),`Downloading chunk ${i+1} of ${b.chunkCount}…`);const x=await api(`/.netlify/functions/backup?backupId=${encodeURIComponent(id)}&index=${i}`);const bin=atob(x.data),u=new Uint8Array(bin.length);for(let j=0;j<bin.length;j++)u[j]=bin.charCodeAt(j);parts.push(u)}blob=new Blob(parts,{type:b.type||'application/zip'})}else{blob=await idbGet(id);if(!blob){hideProgress();return toast('Local backup bytes not found in this browser')}}const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=b.fileName;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);hideProgress();toast('Download ready')}
window.deleteBackup=async id=>{const b=state.backups.find(x=>x.id===id);if(!b||!confirm(`Delete snapshot ${b.version}?`))return;if(b.storage==='cloud'){if(!cloud)return toast('Connect cloud storage first');await api('/.netlify/functions/backup',{method:'POST',body:JSON.stringify({action:'delete',backupId:id,chunkCount:b.chunkCount})})}else await idbDelete(id);addTombstone('backups',b);state.backups=state.backups.filter(x=>x.id!==id);await persist();renderBackups();toast('Snapshot deleted')}
window.downloadPaperBackup=async id=>{const b=(state.paperBackups||[]).find(x=>x.id===id);if(!b)return;progress(5,'Preparing download…','paperBackupProgress');let blob;if(b.storage==='cloud'){if(!cloud){hideProgress('paperBackupProgress');return toast('Connect cloud storage first')};const parts=[];for(let i=0;i<b.chunkCount;i++){progress(Math.round(((i+1)/b.chunkCount)*90),`Downloading chunk ${i+1} of ${b.chunkCount}…`,'paperBackupProgress');const x=await api(`/.netlify/functions/backup?backupId=${encodeURIComponent(id)}&index=${i}`);const bin=atob(x.data),u=new Uint8Array(bin.length);for(let j=0;j<bin.length;j++)u[j]=bin.charCodeAt(j);parts.push(u)}blob=new Blob(parts,{type:b.type||'application/octet-stream'})}else{blob=await idbGet(id);if(!blob){hideProgress('paperBackupProgress');return toast('Local paper backup bytes not found in this browser')}}const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=b.fileName;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);hideProgress('paperBackupProgress');toast('Paper backup download ready')}
window.deletePaperBackup=async id=>{const b=(state.paperBackups||[]).find(x=>x.id===id);if(!b||!confirm(`Delete paper backup ${b.title}?`))return;if(b.storage==='cloud'){if(!cloud)return toast('Connect cloud storage first');await api('/.netlify/functions/backup',{method:'POST',body:JSON.stringify({action:'delete',backupId:id,chunkCount:b.chunkCount})})}else await idbDelete(id);addTombstone('paperBackups',b);state.paperBackups=state.paperBackups.filter(x=>x.id!==id);await persist();renderPaperBackups();toast('Paper backup deleted')}

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
 for(const collection of [state.backups||[],state.paperBackups||[]]){
  for(const b of collection){
   if(b.storage!=='local')continue;
   try{const blob=await idbGet(b.id);if(!blob)continue;await uploadBlobAsCloudBackup(b,blob);moved++}catch(e){console.warn('Backup migration skipped',b.id,e)}
  }
 }
 for(const m of state.researchMaterials||[]){
   if(m.storage!=='local'||!m.fileName)continue;
   const storageId=materialFileId(m);
   try{const blob=await idbGet(storageId);if(!blob)continue;const holder={id:storageId,storage:m.storage,chunkCount:m.chunkCount,updatedAt:m.updatedAt};await uploadBlobAsCloudBackup(holder,blob);m.storage=holder.storage;m.chunkCount=holder.chunkCount;m.updatedAt=holder.updatedAt;moved++}catch(e){console.warn('Research file migration skipped',storageId,e)}
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
 const btn=$('#cloudConnectConfirm');if(btn){btn.disabled=true;btn.textContent='Connecting…'}
 toast('Connecting to cloud…');
 const remember=$('#rememberKey')?.checked!==false;
 sessionStorage.setItem(ADMIN_KEY_STORAGE,adminKey);
 if(remember)localStorage.setItem(ADMIN_KEY_STORAGE,adminKey);else localStorage.removeItem(ADMIN_KEY_STORAGE);
 try{const ok=await syncCloud();if(ok){$('#cloudPanel').classList.add('hidden');toast('Cloud connected')}}finally{if(btn){btn.disabled=false;btn.textContent='Connect'}}
}
function disconnectCloud(){
 cloud=false;adminKey='';sessionStorage.removeItem(ADMIN_KEY_STORAGE);localStorage.removeItem(ADMIN_KEY_STORAGE);
 $('#adminKey').value='';setStorageBadge();toast('Cloud disconnected on this device')
}
async function bootstrap(){
 render();
 clearLog();
 clearSource();
 clearSourceAttachment();
 clearSourceAnnotation();
 await pullCloudReadOnly({silent:true});
 if(adminKey){
   const ok=await syncCloud({silent:true});
   if(!ok)setStorageBadge();
 }else{
   setStorageBadge();
 }
 const requested=requestedMainView();
 if(requested)activateMainView(requested,{updateUrl:false,scroll:false});
}
window.addEventListener('focus',async()=>{await pullCloudReadOnly({silent:true});if(adminKey&&localStorage.getItem(UNSYNCED_KEY)==='1')syncCloud({silent:true})});
document.addEventListener('visibilitychange',async()=>{if(document.visibilityState==='visible'){await pullCloudReadOnly({silent:true});if(adminKey&&localStorage.getItem(UNSYNCED_KEY)==='1')syncCloud({silent:true})}});

$('#logImages').onchange=()=>{
 for(const file of [...$('#logImages').files]){const item={id:uuid(),file,previewUrl:URL.createObjectURL(file),caption:'',imageType:'Process',includeInHistory:true};pendingLogImages.push(item)}
 $('#logImages').value='';renderLogImageEditor();
};
$('#imageModalClose').onclick=closeImageModal;$('#imageModal').onclick=e=>{if(e.target===$('#imageModal'))closeImageModal()};document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#imageModal').classList.contains('hidden'))closeImageModal()});

// Research Library forms save only from their Save buttons. Enter/Shift+Enter remain available for multiline notes.
['sourceForm','sourceAnnotationForm','sourceAttachmentForm'].forEach(formId=>{
 const form=document.getElementById(formId);if(!form)return;
 form.addEventListener('keydown',e=>{
  if(e.key!=='Enter')return;
  if(e.target?.tagName==='TEXTAREA'){e.stopPropagation();return;}
  if(e.target?.tagName==='BUTTON')return;
  e.preventDefault();
  e.stopPropagation();
 });
});

// Events
function activateMainView(view,{updateUrl=true,scroll=false}={}){
 const target=[...$$('.tab')].find(b=>b.dataset.view===view);
 if(!target)return false;
 $$('.tab').forEach(x=>x.classList.toggle('active',x===target));
 $$('.view').forEach(v=>v.classList.toggle('active',v.id==='view-'+view));
 if(updateUrl){
  const hashMap={log:'development-log',visual:'visual-history',research:'research-library',plan:'research-plan',backups:'project-backups'};
  const hash=hashMap[view]||view;
  if(location.hash!==`#${hash}`)history.replaceState(null,'',`${location.pathname}${location.search}#${hash}`);
 }
 if(scroll)document.getElementById('view-'+view)?.scrollIntoView({block:'start'});
 return true;
}
function requestedMainView(){
 const params=new URLSearchParams(location.search);
 const q=(params.get('view')||'').trim().toLowerCase();
 const h=(location.hash||'').replace(/^#/,'').trim().toLowerCase();
 const aliases={
  log:'log','development-log':'log','development':'log',
  visual:'visual','visual-history':'visual',
  research:'research','research-library':'research','library':'research',
  plan:'plan','research-plan':'plan',
  backups:'backups','project-backups':'backups','backup':'backups'
 };
 return aliases[q]||aliases[h]||null;
}
$$('.tab').forEach(b=>b.onclick=()=>activateMainView(b.dataset.view,{updateUrl:true}));
window.addEventListener('hashchange',()=>{const view=requestedMainView();if(view)activateMainView(view,{updateUrl:false,scroll:false})});

$$('.subtab').forEach(b=>b.onclick=()=>{$$('.subtab').forEach(x=>x.classList.toggle('active',x===b));$$('.plan-view').forEach(v=>v.classList.toggle('active',v.id==='plan-'+b.dataset.plan))});
$('#connectBtn').onclick=()=>{$('#cloudPanel').classList.toggle('hidden');$('#adminKey').value=adminKey;$('#rememberKey').checked=!!localStorage.getItem(ADMIN_KEY_STORAGE)};$('#syncBtn').onclick=()=>syncCloud();$('#cloudDisconnect').onclick=disconnectCloud;$('#cloudCancel').onclick=()=>$('#cloudPanel').classList.add('hidden');$('#cloudConnectConfirm').onclick=connectCloud;
$('#logSearch').oninput=renderLogs;$('#logFilter').onchange=renderLogs;$('#sourceSearch').oninput=renderSources;$('#sourceThemeFilter').onchange=renderSources;$('#sourceStatusFilter').onchange=renderSources;$('#sourceTypeFilter').onchange=renderSources;
$$('.research-source-tab').forEach(btn=>btn.addEventListener('click',()=>setResearchSourceView(btn.dataset.sourceView)));
$('#sourceJump')?.addEventListener('change',e=>jumpToResearchSource(e.target.value));
$('#sourceAddQuick')?.addEventListener('click',()=>{researchSourceView='all';renderSourceNavigation();clearSource();$('#sourceFormPanel')?.scrollIntoView({behavior:'smooth',block:'start'});$('#sourceFormPanel')?.classList.add('attention-pulse');setTimeout(()=>$('#sourceFormPanel')?.classList.remove('attention-pulse'),700);$('#sourceTitle')?.focus({preventScroll:true});toast('New source form ready')});
if($('#citationImportOpen'))$('#citationImportOpen').onclick=showCitationImport;if($('#citationImportCancel'))$('#citationImportCancel').onclick=hideCitationImport;if($('#citationImportApply'))$('#citationImportApply').onclick=loadCitationImportIntoEditor;
if($('#sourceAutoAnalyze'))$('#sourceAutoAnalyze').onclick=analyzeSourceIntake;
$('#logClear').onclick=clearLog;$('#sourceClear').onclick=clearSource;$('#annotationCancel').onclick=clearSourceAnnotation;$('#attachmentCancel').onclick=clearSourceAttachment;$('#sourceEditAddFile').onclick=()=>{const id=sourceEditorId();if(id)addSourceAttachment(id)};$('#sourceEditAddNote').onclick=()=>{const id=sourceEditorId();if(id)addSourceAnnotation(id)};$('#exportLogBtn').onclick=exportLog;$('#restoreLogBtn').onclick=restoreBaseLogs;$('#exportAllBtn').onclick=exportAll;
$('#logForm').onsubmit=async e=>{e.preventDefault();const id=$('#logId').value||uuid(),original=state.logs.find(x=>x.id===id),originalImages=clone(original?.images||[]);if(pendingLogImages.length&&!adminKey)return toast('Connect cloud storage before saving new development images.');try{const keptIds=new Set(editingLogImages.map(x=>x.id));for(const oldImg of originalImages)if(!keptIds.has(oldImg.id))await deleteDevelopmentImageBlob(oldImg);const uploaded=[];for(const item of pendingLogImages)uploaded.push(await uploadDevelopmentImage(item));const images=[...editingLogImages,...uploaded];const obj={id,date:$('#logDate').value,phase:$('#logPhase').value,title:$('#logTitle').value.trim(),what:$('#logWhat').value.trim(),why:$('#logWhy').value.trim(),tags:$('#logTags').value.split(',').map(x=>x.trim()).filter(Boolean),images,updatedAt:new Date().toISOString()};const i=state.logs.findIndex(x=>x.id===id);if(i>=0)state.logs[i]=obj;else state.logs.push(obj);await persist();clearLog();renderLogs();renderVisualHistory();toast(images.length?'Development entry and images saved':'Development entry saved')}catch(err){console.error(err);toast(err.message||'Could not save development entry')}};
$('#paperUseForm')?.addEventListener('submit',async e=>{e.preventDefault();const sourceId=$('#paperUseSourceId').value,s=state.sources.find(x=>x.id===sourceId);if(!s)return toast('Research source not found.');const id=$('#paperUseId').value||uuid(),old=(state.paperUses||[]).find(x=>x.id===id),annotationIds=[...document.querySelectorAll('#paperUseAnnotations input[type="checkbox"]:checked')].map(x=>x.value),obj={id,sourceId,paperSection:$('#paperUseSection').value,point:$('#paperUsePoint').value.trim(),status:$('#paperUseStatus').value,annotationIds,created:old?.created||new Date().toISOString(),updatedAt:new Date().toISOString()};if(!obj.paperSection)return toast('Choose a paper section.');if(!obj.point)return toast('Add the point you want to make.');state.paperUses=state.paperUses||[];const i=state.paperUses.findIndex(x=>x.id===id);if(i>=0)state.paperUses[i]=obj;else state.paperUses.push(obj);await persist();clearPaperUse();renderPaperUses();renderSources();requestAnimationFrame(()=>document.getElementById('paper-use-'+id)?.scrollIntoView({behavior:'smooth',block:'center'}));toast('Paper-use card saved')});
$('#paperUseCancel')?.addEventListener('click',clearPaperUse);

$('#sourceForm').onsubmit=async e=>{
 e.preventDefault();
 if(sourceSaveInFlight)return;
 const file=$('#sourceFile').files[0];
 const existingId=$('#sourceId').value;
 const id=existingId||uuid();
 // Claim the ID immediately. A second click during a slow cloud save will update the
 // same record instead of creating another source with a fresh UUID.
 if(!existingId)$('#sourceId').value=id;
 const existing=state.sources.find(x=>x.id===id);
 const enteredTitle=$('#sourceTitle').value.trim();
 const title=enteredTitle||fileBaseName(file?.name||'');
 if(!title){if(!existingId)$('#sourceId').value='';return toast('Add an article/source name or choose a document first.')}
 setSourceSaveState(true,file?'Saving source and attaching document…':'Saving source…');
 toast('Saving source…');
 const obj={...(existing||{}),id,theme:$('#sourceTheme').value,priority:$('#sourcePriority').value,sourceType:$('#sourceType').value,title,authors:$('#sourceAuthors').value.trim(),date:$('#sourceDate').value.trim(),publisher:$('#sourcePublisher').value.trim(),apa:$('#sourceApa').value.trim(),keyArgument:$('#sourceArgument').value.trim(),connection:$('#sourceConnection').value.trim(),methodology:$('#sourceMethod').value.trim(),status:$('#sourceStatus').value,paperSection:$('#sourcePaperSection').value.trim(),url:normalizeSourceUrl($('#sourceUrl').value),tags:$('#sourceTags').value.split(',').map(x=>x.trim()).filter(Boolean),archiveFile:$('#sourceArchive').value.trim(),annotations:[...(existing?.annotations||[]),...pendingImportedAnnotations.filter(a=>!(existing?.annotations||[]).some(x=>`${x.location||''}|${x.text||''}`===`${a.location||''}|${a.text||''}`))],created:existing?.created||new Date().toISOString(),updatedAt:new Date().toISOString()};
 clearTombstonesFor('sources',obj);
 const i=state.sources.findIndex(x=>x.id===id);if(i>=0)state.sources[i]=obj;else state.sources.push(obj);
 const currentPrimary=(state.researchMaterials||[]).find(m=>m.sourceId===id&&m.role==='primary');
 if(currentPrimary){currentPrimary.title=obj.title||currentPrimary.fileName||'Primary source document';currentPrimary.materialType=obj.sourceType;currentPrimary.updatedAt=new Date().toISOString()}
 try{
   await persist();
   setSourceSaveState(true,file?'Source saved. Uploading document…':'Finishing save…');
   let uploadWarning='';
   if(file){
     try{
       const old=(state.researchMaterials||[]).find(m=>m.sourceId===id&&m.role==='primary');
       const fileId=uuid(),sha256=await hashFile(file),location=await storeBackupFile(fileId,file,'sourceFileProgress');
       const att={id:old?.id||uuid(),sourceId:id,role:'primary',materialType:obj.sourceType,title:obj.title||file.name||'Primary source document',location:'',notes:'',fileId,fileName:file.name,size:file.size,type:file.type||'application/octet-stream',sha256,...location,created:old?.created||new Date().toISOString(),updatedAt:new Date().toISOString()};
       if(old){
         const oldSnapshot={...old};
         state.researchMaterials[state.researchMaterials.findIndex(m=>m.id===old.id)]=att;
         await persist();
         try{await deleteResearchAttachmentFile(oldSnapshot)}catch(cleanErr){console.warn('Old source file cleanup skipped',cleanErr)}
       }else{state.researchMaterials.push(att);await persist()}
     }catch(fileErr){console.error(fileErr);uploadWarning=fileErr.message||'Document upload failed'}
   }
   hideProgress('sourceFileProgress');renderSources();renderPaperUses();
   if(uploadWarning){
     window.editSource(id);setSourceSaveState(false,'Source saved, but the document did not attach. You can retry the file without re-entering the source.');
     toast(`Source saved. Document was not attached: ${uploadWarning}`);
   }else{
     setSourceSaveState(false,'Saved');
     clearSource();requestAnimationFrame(()=>returnToResearchSource(id));toast('Research source saved');
     setTimeout(()=>setSourceSaveState(false,''),1800);
   }
 }catch(err){
   hideProgress('sourceFileProgress');setSourceSaveState(false,'Save failed. Your form is still here so you can try again.');
   toast(err.message||'Source could not be saved');console.error(err)
 }
};

$('#sourceAnnotationForm').onsubmit=async e=>{e.preventDefault();const sourceId=$('#sourceAnnotationSourceId').value,s=state.sources.find(x=>x.id===sourceId);if(!s)return toast('Research source not found.');const id=$('#sourceAnnotationId').value||uuid(),old=(s.annotations||[]).find(x=>x.id===id),a={id,location:$('#annotationLocation').value.trim(),type:$('#annotationType').value,text:$('#annotationText').value.trim(),interpretation:$('#annotationInterpretation').value.trim(),paperUse:$('#annotationPaperUse').value.trim(),tags:$('#annotationTags').value.split(',').map(x=>x.trim()).filter(Boolean),created:old?.created||new Date().toISOString(),updatedAt:new Date().toISOString()};s.annotations=s.annotations||[];const i=s.annotations.findIndex(x=>x.id===id);if(i>=0)s.annotations[i]=a;else s.annotations.push(a);s.updatedAt=new Date().toISOString();await persist();clearSourceAnnotation();renderSources();renderPaperUses();returnToSourceEditorOrCard(sourceId,'#sourceEditAnnotations');toast('Research note saved')};
$('#sourceAttachmentForm').onsubmit=async e=>{
 e.preventDefault();const sourceId=$('#attachmentSourceId').value,source=state.sources.find(x=>x.id===sourceId),id=$('#attachmentId').value||uuid(),existing=(state.researchMaterials||[]).find(x=>x.id===id),file=$('#attachmentFile').files[0];
 if(!source)return toast('Research source not found.');if(!existing&&!file)return toast('Choose a file to attach.');
 try{
   let stored=existing?{fileId:existing.fileId,fileName:existing.fileName,size:existing.size,type:existing.type,sha256:existing.sha256,storage:existing.storage,chunkCount:existing.chunkCount,staticPath:existing.staticPath}:{};
   let oldSnapshot=null;
   if(file){oldSnapshot=existing?{...existing}:null;const fileId=uuid(),sha256=await hashFile(file),location=await storeBackupFile(fileId,file,'attachmentProgress');stored={fileId,fileName:file.name,size:file.size,type:file.type||'application/octet-stream',sha256,...location,staticPath:''}}
   const obj={id,sourceId,role:existing?.role||'supporting',materialType:$('#attachmentType').value,title:$('#attachmentTitle').value.trim()||stored.fileName||'Attached file',location:$('#attachmentLocation').value.trim(),notes:$('#attachmentNotes').value.trim(),created:existing?.created||new Date().toISOString(),updatedAt:new Date().toISOString(),...stored};
   const i=state.researchMaterials.findIndex(x=>x.id===id);if(i>=0)state.researchMaterials[i]=obj;else state.researchMaterials.push(obj);await persist();
   if(file&&oldSnapshot){try{await deleteResearchAttachmentFile(oldSnapshot)}catch(cleanErr){console.warn('Old attachment cleanup skipped',cleanErr)}}
   hideProgress('attachmentProgress');clearSourceAttachment();renderSources();returnToSourceEditorOrCard(sourceId,'#sourceEditAttachments');toast('Research file saved')
 }catch(err){hideProgress('attachmentProgress');toast(err.message||'Research file could not be saved');console.error(err)}
};

if($('#themeAdd'))$('#themeAdd').onclick=()=>{clearTheme();openPlanEditor('themeEditor')};if($('#outlineAdd'))$('#outlineAdd').onclick=()=>{clearOutline();openPlanEditor('outlineEditor')};if($('#readingAdd'))$('#readingAdd').onclick=()=>{clearReading();openPlanEditor('readingEditor')};
for(const [id,clear] of [['themeCancel',clearTheme],['outlineCancel',clearOutline],['readingCancel',clearReading]])$('#'+id).onclick=()=>{clear();hidePlanEditors()};
$('#themeForm').onsubmit=async e=>{e.preventDefault();const id=$('#themeId').value||uuid(),obj={id,theme:$('#themeName').value.trim(),question:$('#themeQuestion').value.trim(),searchTerms:$('#themeSearch').value.trim(),chapters:$('#themeChapters').value.trim(),scenarios:$('#themeScenarios').value.trim(),sourcesFound:Number($('#themeSources').value)||0,status:$('#themeStatus').value,updatedAt:new Date().toISOString()};const i=state.themes.findIndex(x=>x.id===id);if(i>=0)state.themes[i]=obj;else state.themes.push(obj);await persist();clearTheme();hidePlanEditors();renderPlans();toast('Research theme saved')};
$('#outlineForm').onsubmit=async e=>{e.preventDefault();const id=$('#outlineId').value||uuid(),i=state.outline.findIndex(x=>x.id===id),prev=i>=0?state.outline[i]:{},obj={...prev,id,chapter:$('#outlineChapter').value.trim(),section:$('#outlineSection').value.trim(),questions:$('#outlineQuestions').value.trim(),status:$('#outlineStatus').value,updatedAt:new Date().toISOString()};if(i>=0)state.outline[i]=obj;else state.outline.push(obj);await persist();clearOutline();hidePlanEditors();renderPlans();toast('Paper section saved')};
$('#readingForm').onsubmit=async e=>{e.preventDefault();const id=$('#readingId').value||uuid(),i=state.reading.findIndex(x=>x.id===id),prev=i>=0?state.reading[i]:{},obj={...prev,id,reading:$('#readingTitle').value.trim(),goal:$('#readingGoal').value.trim(),target:$('#readingTarget').value.trim(),done:$('#readingDone').checked,updatedAt:new Date().toISOString()};if(i>=0)state.reading[i]=obj;else state.reading.push(obj);await persist();clearReading();hidePlanEditors();renderPlans();toast('Task saved')};
$('#backupForm').onsubmit=async e=>{e.preventDefault();const file=$('#backupFile').files[0];if(!file)return;const id=uuid(),version=$('#backupVersion').value.trim(),title=$('#backupTitle').value.trim(),phase=$('#backupPhase').value,description=$('#backupDescription').value.trim();try{progress(2,'Calculating checksum…');const sha256=await hashFile(file);const stored=await storeBackupFile(id,file);progress(90,'Saving snapshot record…');const b={id,version,title,phase,description,fileName:file.name,size:file.size,type:file.type,sha256,created:new Date().toISOString(),updatedAt:new Date().toISOString(),...stored};state.backups.push(b);if($('#backupLogIt').checked)state.logs.push({id:uuid(),date:today(),phase,title:`Project snapshot saved — ${version}: ${title}`,what:`Saved a backup source-control snapshot (${file.name}, ${fmtBytes(file.size)}). ${description}`,why:'Created a milestone copy so the development state can be restored independently of the active working files. This backup complements, rather than replaces, Git/version history.',tags:['backup','source control','project snapshot',version],updatedAt:new Date().toISOString()});await persist();progress(100,'Saved');setTimeout(hideProgress,600);e.target.reset();$('#backupLogIt').checked=true;render();toast('Project snapshot saved')}catch(err){hideProgress();toast(err.message);console.error(err)}};
$('#paperBackupForm').onsubmit=async e=>{
 e.preventDefault();const file=$('#paperBackupFile').files[0];if(!file)return toast('Choose a paper file first.');
 const id=uuid(),date=today(),version=$('#paperBackupVersion').value.trim()||`Working Draft ${date}`,title=$('#paperBackupTitle').value.trim()||fileBaseName(file.name)||'Professional Paper',description=$('#paperBackupDescription').value.trim();
 try{
   progress(2,'Calculating checksum…','paperBackupProgress');
   const sha256=await hashFile(file);
   const stored=await storeBackupFile(id,file,'paperBackupProgress');
   progress(90,'Saving paper backup record…','paperBackupProgress');
   const b={id,version,title,description,fileName:file.name,size:file.size,type:file.type||'application/octet-stream',sha256,created:new Date().toISOString(),updatedAt:new Date().toISOString(),...stored};
   state.paperBackups.push(b);
   await persist();
   progress(100,'Saved','paperBackupProgress');
   setTimeout(()=>hideProgress('paperBackupProgress'),600);
   e.target.reset();
   renderPaperBackups();
   toast(stored.storage==='local'&&cloud?'Paper backup saved locally; cloud upload will retry on sync':'Paper backup saved');
 }catch(err){hideProgress('paperBackupProgress');toast(err.message||'Paper backup could not be saved');console.error(err)}
};

$('#sourceFile')?.addEventListener('change',e=>{const file=e.target.files?.[0];if(file&&!$('#sourceTitle').value.trim())$('#sourceTitle').value=fileBaseName(file.name)});
$('#paperBackupFile')?.addEventListener('change',e=>{const file=e.target.files?.[0];if(!file)return;if(!$('#paperBackupVersion').value.trim())$('#paperBackupVersion').value=`Working Draft ${today()}`;if(!$('#paperBackupTitle').value.trim())$('#paperBackupTitle').value=fileBaseName(file.name)});

bootstrap();
