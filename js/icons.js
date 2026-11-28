// (own <script> tag on purpose: an error anywhere in the big script above used to stop everything after it, icons included)
// ===== game icons instead of emoji. ONE table (emoji -> Icons/<key>.png, from the Blue Archive wiki "Game Icons" category, fetched by
// get_icons.ps1) and ONE pass over the page's text, run again on whatever re-renders (cards, timers, theme button, dialogue), so no
// template has to know about icons. An icon file that is missing turns back into its emoji, and that key isn't tried again.
(function(){
 // value = icon files to try in order. "rp-*" = the RidhonPota Blue Archive badge pack (one look for the whole page, copied by
 // copy_rp_icons.ps1); "rp-card/help/heal/buff/pat" = drawn in the same badge style for what the pack lacks (svg_to_png.ps1); home = the player's own
 // in-game screenshot; "st-*" = real battle status icons (get_status_icons.ps1), the drawn icon stays as fallback
 const MAP={'📋':'rp-tasks','👥':'rp-students','💠':'rp-eligma','⚔':'rp-attack','🎟':'rp-recruit','🏠':'home','🏆':'rp-tc-coin',
  '🎯':'rp-boss','🃏':'rp-card','🌐':'rp-urban','☀':'rp-outdoor','🌙':'rp-indoor','🔄':'rp-dice','🧮':'rp-eligma','🛡':'rp-emblem','💚':'st-heal|rp-heal',
  '✨':'st-buff|rp-buff','🧭':'rp-event','✅':'rp-check','📅':'rp-schedule','⏱':'rp-schedule','📜':'rp-book','💡':'rp-notice','🧩':'rp-formation',
  '🔭':'rp-search','👆':'rp-pat','❔':'rp-help','🛠':'rp-crafting','⚠':'rp-caution','🔒':'rp-lock'};
 const RE=new RegExp('('+Object.keys(MAP).join('|')+')\\uFE0F?','gu'),BAD=new Set();
 const SKIP='script,style,textarea,option,select,title,svg,canvas,.bai-fb';
 const ok=v=>v.split('|').filter(f=>!BAD.has(f));
 const mk=(ch,L)=>{const i=new Image();i.className='bai';i.alt=ch;i.draggable=false;i.decoding='async';
  const go=()=>{const f=L.shift();if(!f){const s=document.createElement('span');s.className='bai-fb';s.textContent=ch;i.replaceWith(s);return;}i.dataset.k=f;i.src='Icons/'+f+'.png';};
  i.onerror=()=>{BAD.add(i.dataset.k);go();};go();return i;};
 const one=t=>{const p=t.parentElement,s=t.nodeValue;if(!p||!s||p.closest(SKIP))return;RE.lastIndex=0;if(!RE.test(s))return;
  const f=document.createDocumentFragment();let i=0;RE.lastIndex=0; // matchAll starts where test() stopped: reset, or the first emoji is skipped
  for(const m of s.matchAll(RE)){const L=MAP[m[1]]&&ok(MAP[m[1]]);if(!L||!L.length)continue;f.append(s.slice(i,m.index),mk(m[0],L));i=m.index+m[0].length;}
  if(!i)return;f.append(s.slice(i));t.replaceWith(f);};
 const scan=n=>{if(!n||!n.isConnected)return;if(n.nodeType===3)return one(n);if(n.nodeType!==1||n.closest(SKIP))return;
  const w=document.createTreeWalker(n,NodeFilter.SHOW_TEXT),L=[];while(w.nextNode())L.push(w.currentNode);L.forEach(one);};
 scan(document.body);
 // runs as a microtask right after each change, before the browser paints, so the emoji never shows for a frame
 new MutationObserver(ms=>{const Q=new Set();for(const m of ms){if(m.type==='characterData')Q.add(m.target);else m.addedNodes.forEach(n=>Q.add(n));}
  Q.forEach(n=>{if(!(n.nodeType===1&&n.classList.contains('bai')))scan(n);});})
  .observe(document.body,{childList:true,subtree:true,characterData:true});
})();
