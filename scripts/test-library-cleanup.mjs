import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=path=>fs.readFileSync(path,'utf8');
const plain=x=>JSON.parse(JSON.stringify(x));
const context=vm.createContext({window:{},localStorage:{getItem:()=>null},sessionStorage:{getItem:()=>null},crypto:{randomUUID:()=> 'test-id'},console});
vm.runInContext(read('site/library-cleanup.js'),context);
vm.runInContext(read('site/seed-data.js'),context);
const lib=context.PromptCraftLibrary,seed=plain(context.window.PROMPTCRAFT_SEED);
const originalContext=vm.createContext({window:{}});
vm.runInContext(read('archive/project-records/research-library-before-2026-10-19.js'),originalContext);
const original=plain(originalContext.window.PROMPTCRAFT_SEED);
assert.equal(seed.sources.length,13);
assert.deepEqual(seed.sources.map(s=>s.id),original.sources.map(s=>s.id));
assert.deepEqual(seed.researchMaterials,original.researchMaterials);
for(const collection of ['logs','backups','outline','reading','themes'])assert.deepEqual(seed[collection],original[collection]);
assert.deepEqual(seed.researchArchives[0].state.sources,original.sources);
assert.equal(seed.sources.reduce((n,s)=>n+s.annotations.length,0),38);
for(const s of seed.sources){
 assert(lib.categories.includes(s.theme));
 const old=original.sources.find(x=>x.id===s.id);
 assert.deepEqual(s.annotations.map(a=>a.text),old.annotations.map(a=>a.text));
 assert.equal(s.apa,old.apa);
}
const old={meta:{researchPlanVersion:1},sources:[{id:'custom',title:' Custom   source ',theme:'AI Literacy & Prompt Engineering',authors:'Sara Rye,\nMicael Sousa,\nCarla Sousa',status:'Cited',paperSection:'Old section',annotations:[{id:'note',text:'Keep this quotation',paperUse:'Old claim',visualAttachmentId:'image'}]}],paperUses:[{id:'old-use',sourceId:'custom',point:'Old argument',annotationIds:['note']}],researchMaterials:[{id:'image',sourceId:'custom',fileId:'unchanged',storage:'local'}],logs:[{id:'log',what:'Keep'}],backups:[{id:'backup',sha256:'unchanged'}],outline:[{id:'custom-outline',section:'Keep my section'}],unknownField:{keep:true}};
const migrated=plain(lib.migrate(old));
assert.deepEqual(migrated.paperUses,[]);
assert.deepEqual(migrated.researchArchives[0].state,old);
assert.equal(migrated.sources[0].status,'Read');
assert.equal(migrated.sources[0].annotations[0].previousPaperUse,'Old claim');
assert.deepEqual(migrated.researchMaterials,old.researchMaterials);
assert.deepEqual(plain(lib.migrate(migrated)),migrated,'Cleanup must be idempotent');
migrated.paperUses.push({id:'new-use',sourceId:'custom',point:'New argument'});
assert.equal(lib.migrate(migrated).paperUses.length,1,'New paper uses survive reload');
const app=read('site/app.js');
vm.runInContext(app.slice(0,app.indexOf('async function api(')),context);
context.input=old;context.current=migrated;
const merged=plain(vm.runInContext('mergeBaseData(input)',context));
assert(merged.outline.some(x=>x.id==='custom-outline'),'Older planning must survive');
assert(merged.sources.some(x=>x.id==='custom'));
const synced=plain(vm.runInContext('mergeSyncStates(current,input)',context));
assert(synced.paperUses.some(x=>x.id==='new-use'));
assert(!synced.paperUses.some(x=>x.id==='old-use'));
assert(synced.researchArchives.some(x=>x.state.paperUses?.some(u=>u.id==='old-use')));
context.left={...migrated,sources:[{...migrated.sources[0],id:'same-title-a'}]};
context.right={...migrated,sources:[{...migrated.sources[0],id:'same-title-b'}]};
const distinct=plain(vm.runInContext('mergeSyncStates(left,right)',context));
assert(distinct.sources.some(s=>s.id==='same-title-a')&&distinct.sources.some(s=>s.id==='same-title-b'));
context.left=migrated;
context.right=structuredClone(migrated);
context.right.sources[0].annotations[0].text='Alternate device note';
context.right.sources[0].updatedAt='2026-10-20T00:00:00Z';
const conflict=plain(vm.runInContext('mergeSyncStates(left,right)',context));
assert(conflict.researchArchives.some(a=>a.state.sources?.some(s=>s.annotations?.some(n=>n.text==='Alternate device note'))));
assert(conflict.researchArchives.some(a=>a.state.sources?.some(s=>s.annotations?.some(n=>n.text==='Keep this quotation'))));
for(const [authors,names] of [
 ['Sara Rye; Micael Sousa; Carla Sousa',['Rye','Sousa','Sousa']],
 ['Smith, J., Doe, A., & Brown, B.',['Smith','Doe','Brown']],
 ['John Smith\nJane Doe',['Smith','Doe']],
 ['Alejandra Álvarez-Chaves; Silvia Saborío-Taylor',['Álvarez-Chaves','Saborío-Taylor']],
 ['Digital Promise',['Digital Promise']],
 ['Ludwig van Beethoven',['van Beethoven']],
 ['Smith et al.',['Smith']]
])assert.deepEqual(plain(lib.authorInfo(authors).surnames),names,authors);
vm.runInContext(app.slice(app.indexOf('function sourceShortCitation('),app.indexOf('async function copyText(')),context);
assert.equal(vm.runInContext("sourceNarrativeCitation({authors:'Sara Rye; Micael Sousa; Carla Sousa',date:'2025'})",context),'Rye et al. (2025)');
assert.equal(vm.runInContext("sourceNarrativeCitation({authors:'John Smith; Jane Doe',date:'2025'})",context),'Smith and Doe (2025)');
assert.equal(vm.runInContext("sourceParentheticalCitation({authors:'John Smith; Jane Doe',date:''})",context),'(Smith & Doe, n.d.)');
const html=read('site/index.html');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'HTML element IDs must be unique');
for(const file of fs.readdirSync('site/research-assets/tracker-import'))assert(fs.statSync('site/research-assets/tracker-import/'+file).size>0);
console.log('PASS: seed preservation, 38 annotations, 11 attachment records, repeat migration, old/new device sync, conflict archives, distinct IDs, citation parsing and HTML IDs.');
// Exercise the complete startup and rendering code without contacting cloud services.
const elements=new Map();
function element(id){
 if(!elements.has(id))elements.set(id,{value:'',innerHTML:'',textContent:'',options:[],files:[],style:{},dataset:{},classList:{add(){},remove(){},toggle(){},contains(){return false}},setAttribute(){},addEventListener(){},querySelectorAll(){return[]},scrollIntoView(){},focus(){},firstElementChild:{style:{}},lastElementChild:{textContent:''}});
 return elements.get(id);
}
const browser=vm.createContext({console,URL,URLSearchParams,Map,Set,Date,Blob,crypto:{randomUUID:()=> 'test-id'},localStorage:{getItem:()=>null,setItem(){},removeItem(){}},sessionStorage:{getItem:()=>null},document:{querySelector:element,querySelectorAll:()=>[],getElementById:id=>element('#'+id),addEventListener(){},body:{classList:{add(){},remove(){}}}},location:{href:'https://example.test/',search:'',hash:''},fetch:async()=>({ok:true,json:async()=>({initialized:false})}),queueMicrotask,requestAnimationFrame:fn=>fn(),setTimeout:()=>0});
browser.window=browser;
browser.addEventListener=()=>{};
vm.runInContext(read('site/library-cleanup.js'),browser);
vm.runInContext(read('site/seed-data.js'),browser);
vm.runInContext(app,browser);
await new Promise(resolve=>setImmediate(resolve));
assert.equal(elements.get('#sourceCount').textContent,13);
assert(elements.get('#sourceList').innerHTML.includes('Instructional-Design Reasoning &amp; Course Redesign'));
assert(elements.get('#researchArchiveContent').innerHTML.includes('preserved record snapshot'));
assert(elements.get('#sourceList').innerHTML.includes('Citation needs review'));
assert.equal(vm.runInContext('state.paperUses.length',browser),0);
console.log('PASS: full application startup and library/archive rendering with a simulated DOM (no cloud writes).');
