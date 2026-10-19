import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
export default async function audit({send,evaluate,artifacts}){
 const before=await evaluate('JSON.stringify(state)');
 await evaluate(`globalThis.citationAudit=(()=>{
  const rgb=value=>value.match(/[\\d.]+/g).map(Number);
  const luminance=color=>rgb(color).slice(0,3).map(c=>{c/=255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4}).reduce((s,c,i)=>s+c*[.2126,.7152,.0722][i],0);
  const ratio=(a,b)=>{const x=luminance(a),y=luminance(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
  const bg=el=>{for(let p=el;p;p=p.parentElement){const c=getComputedStyle(p).backgroundColor;const channels=rgb(c);if(channels.length<4||channels[3]===1)return c;}return'rgb(255,255,255)'};
  const results=[];
  const check=(name,fg,bg,min)=>{const contrast=ratio(fg,bg);results.push({name,foreground:fg,background:bg,contrast,minimum:min});};
  const text=(el,name,pseudo)=>{const s=getComputedStyle(el,pseudo);check(name,s.color,bg(el),4.5)};
  const control=(el,name)=>{text(el,name);const s=getComputedStyle(el);check(name+' border/inside',s.borderColor,bg(el),3);check(name+' border/outside',s.borderColor,bg(el.parentElement),3);if(el.getBoundingClientRect().height<24)throw new Error(name+' target is too short')};
  return{results,ratio,bg,text,control,check};
 })()`);
 const summary='.editor-citation-actions .citation-starter-menu>summary';
 const menu='.editor-citation-actions .citation-starter-menu';
 for(const preference of ['dark','light']){
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:preference}]});
  assert.equal(await evaluate("getComputedStyle(document.documentElement).colorScheme"),'dark');
  await evaluate(`(()=>{
   for(const id of ['sourceTitle','sourceAuthors','sourceDate','sourcePublisher','sourceApa','sourceUrl']){
    const el=document.getElementById(id);if(!el.labels.length)throw new Error(id+' has no label');
    citationAudit.text(el.labels[0],'${preference}: '+id+' label');
    citationAudit.control(el,'${preference}: '+id);
    if(el.placeholder)citationAudit.text(el,'${preference}: '+id+' placeholder','::placeholder');
    const selection=getComputedStyle(el,'::selection');citationAudit.check(id+' selected text',selection.color,selection.backgroundColor,4.5);
   }
   document.querySelectorAll('.source-citation').forEach(el=>citationAudit.text(el,'${preference}: source preview'));
   document.querySelectorAll('.citation-copy-actions button,.citation-copy-actions summary').forEach(el=>{if(el.checkVisibility())citationAudit.control(el,'${preference}: '+el.textContent.trim())});
  })()`);
 }
 await send('DOM.enable');await send('CSS.enable');
 const {root}=await send('DOM.getDocument');
 await evaluate(`document.querySelector(${JSON.stringify(menu)}).open=true`);
 for(const selector of [summary,'.editor-citation-actions button','.editor-citation-actions .citation-starter-options button']){
  const {nodeId}=await send('DOM.querySelector',{nodeId:root.nodeId,selector});
  for(const state of ['hover','active']){
   await send('CSS.forcePseudoState',{nodeId,forcedPseudoClasses:[state]});
   await evaluate(`citationAudit.control(document.querySelector(${JSON.stringify(selector)}),${JSON.stringify(state+' '+selector)})`);
  }
  await send('CSS.forcePseudoState',{nodeId,forcedPseudoClasses:[]});
 }
 await evaluate(`document.querySelector(${JSON.stringify(menu)}).open=false;document.querySelector(${JSON.stringify(summary)}).focus()`);
 const key=async(key,code,virtual)=>{await send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:virtual,...(key==='Enter'?{text:'\r',unmodifiedText:'\r'}:{})});await send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:virtual});};
 await key(' ','Space',32);
 assert(await evaluate(`document.querySelector(${JSON.stringify(menu)}).open`),'Space opens starter');
 await evaluate(`citationAudit.control(document.querySelector(${JSON.stringify(summary)}),'Open starter')`);
 const tree=await send('Accessibility.getFullAXTree');
 assert(tree.nodes.some(n=>n.name?.value?.startsWith('Copy citation starter')&&n.properties?.some(p=>p.name==='expanded'&&p.value.value===true)),'Native expanded state is exposed to accessibility APIs');
 await key('Tab','Tab',9);
 assert(await evaluate("document.activeElement.matches('.editor-citation-actions .citation-starter-options button')"),'Tab reaches starter choice');
 await evaluate(`(()=>{const el=document.activeElement,s=getComputedStyle(el);if(s.outlineStyle==='none'||parseFloat(s.outlineWidth)<3)throw new Error('Missing focus indicator');citationAudit.check('Keyboard focus',s.outlineColor,citationAudit.bg(el.parentElement),3)})()`);
 await evaluate(`(()=>{document.querySelectorAll('.citation-starter-menu').forEach(el=>el.open=true);document.querySelectorAll('.citation-starter-options button').forEach(el=>citationAudit.control(el,'Open choice '+el.textContent.trim()));Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{globalThis.copiedCitation=text}}});document.getElementById('sourceAuthors').value='John Smith; Jane Doe';document.getElementById('sourceDate').value='2025'})()`);
 for(const [kind,expected] of [['found','Smith and Doe (2025) found that'],['according','According to Smith and Doe (2025),'],['argued','Smith and Doe (2025) argued that']]){
  const selector=`.editor-citation-actions button[onclick="copyEditorStarter('${kind}')"]`;
  await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  assert.equal((await evaluate('copiedCitation')).trim(),expected);
 }
 await evaluate(`document.querySelector(${JSON.stringify(summary)}).focus()`);
 await key('Enter','Enter',13);
 assert(!await evaluate(`document.querySelector(${JSON.stringify(menu)}).open`),'Enter closes starter');
 await key('Enter','Enter',13);
 assert(await evaluate(`document.querySelector(${JSON.stringify(menu)}).open`),'Enter opens starter');
 for(const width of [320,390,768,1440]){
  await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
  await evaluate(`document.querySelector(${JSON.stringify(menu)}).scrollIntoView({block:'center'})`);
  const bounds=await evaluate(`(()=>{const el=document.querySelector('.editor-citation-actions .citation-starter-options'),r=el.getBoundingClientRect();return{left:r.left,right:r.right,width:document.documentElement.clientWidth}})()`);
  assert(bounds.left>=0&&bounds.right<=bounds.width,'Open menu fits '+width+'px');
  if(width===390||width===1440){const image=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(artifacts,`citation-${width}.png`),Buffer.from(image.data,'base64'));}
 }
 assert.equal(await evaluate('JSON.stringify(state)'),before,'Citation interactions do not modify saved research state');
 const results=await evaluate('citationAudit.results');
 const failures=results.filter(r=>r.contrast<r.minimum);
 fs.writeFileSync(path.join(artifacts,'citation-contrast.json'),JSON.stringify(results,null,2));
 console.log(JSON.stringify({checks:results.length,failures,minimumText:Math.min(...results.filter(r=>r.minimum===4.5).map(r=>r.contrast)),minimumControl:Math.min(...results.filter(r=>r.minimum===3).map(r=>r.contrast)),keyboard:'Space, Enter, Tab, visible focus and exposed expanded state pass',clipboard:'All three editor starters unchanged',theme:'Dark only; tested with both OS color-scheme preferences',artifacts},null,2));
 assert.equal(failures.length,0,'All contrast pairs must meet AA thresholds');
}
