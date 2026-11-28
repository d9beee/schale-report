// ===== ACCESSIBILITY (keyboard + screen reader), one place, no template changes =====
(function(){
 // 1) things that open a popup on click but are plain span / div / img (student names & avatars, growth chips, boss links):
 //    make them reachable with Tab, announce them as buttons, and let Enter / Space click them. One delegated key handler;
 //    new elements from later renders are marked in one batch per frame.
 const ACT='[data-stu],.hasg,.bl';
 const mark=root=>{(root.matches&&root.matches(ACT)?[root]:[]).concat([...(root.querySelectorAll?root.querySelectorAll(ACT):[])]).forEach(el=>{
  if(el.hasAttribute('tabindex')||el.closest('button,a[href]'))return;el.tabIndex=0;el.setAttribute('role','button');
  if(el.tagName==='IMG'&&el.dataset.stu)el.setAttribute('aria-label',el.dataset.stu);});};
 mark(document.body);
 let Q=[],f=0;new MutationObserver(ms=>{ms.forEach(m=>m.addedNodes.forEach(n=>n.nodeType===1&&Q.push(n)));
  if(!f)f=requestAnimationFrame(()=>{f=0;Q.splice(0).forEach(n=>n.isConnected&&mark(n));});}).observe(document.body,{childList:true,subtree:true});
 document.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const el=e.target.closest&&e.target.closest('[role=button]');
  if(!el||el.matches('button,a[href],input,textarea,select'))return;e.preventDefault();el.click();});
 // 2) results that change when you type (Eligma plan, refresh notes) are read out politely; countdowns are NOT live (they tick every second)
 ['cplan','csum','cpyro','lupd','bupd','pupd'].forEach(id=>{const el=document.getElementById(id);if(el)el.setAttribute('aria-live','polite');});
 // 3) the dock / topbar link of the open screen says so
 const cur=()=>{const h=location.hash.split('/')[0]||'#home';
  document.querySelectorAll('#dock a[href^="#"]').forEach(a=>a.getAttribute('href')===h?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));};
 addEventListener('hashchange',cur);cur();
})();
