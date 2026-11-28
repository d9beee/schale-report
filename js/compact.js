// ===== AUTO-COMPACT (desktop ≥901px): a row whose text doesn't fit any more switches to icons (.cmp), and back as soon as it fits.
// Test = drop .cmp, measure the full-text layout, put .cmp back if it overflows; all in one frame, so nothing flickers.
// Runs when one of the rows changes size (window resize, screen opened) or its text changes (TA countdown, task count...).
(function(){
 const mq=matchMedia('(min-width:901px)');
 const shown=el=>el.offsetParent!==null;
 const over=el=>el&&shown(el)&&el.scrollWidth>el.clientWidth+1;
 const wraps=r=>{const k=[...r.children].filter(shown);return k.length>1&&k[k.length-1].offsetTop>k[0].offsetTop+4;};
 const txt=el=>el.textContent.replace(/\s+/g,' ').trim();
 const G=[
  // top bar: the pill row is cut (it scrolls sideways) -> round icons; tooltip = label + value
  {sel:'.topbar .tb-res',test:over,
   tip:el=>el.querySelectorAll('.res').forEach(a=>{if(a.dataset.t==null)a.dataset.t=a.title||'';
    const v=[...a.querySelectorAll('b,small')].map(txt).join(' ');a.title=a.dataset.t?`${a.dataset.t}: ${v}`:v;})},
  // lobby cards (not Joint Firing Drill: its short title + time line must stay as text, no icon swap): title or sub line cut, or
  // the text taller than the card -> the card's icon in a circle
  {sel:'#home .tile:not(#tLock)',test:t=>{const l=t.querySelector('.tlab');if(!l||!shown(t))return false;
    const cs=getComputedStyle(t),room=t.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);
    return [...l.children].some(over)||l.offsetHeight>room+1;},
   prep:t=>{if(!t.querySelector('.tic')&&t.dataset.ic)t.insertAdjacentHTML('beforeend',`<span class="tic" aria-hidden="true">${t.dataset.ic}</span>`);},
   tip:t=>{const l=t.querySelector('.tlab');if(l)t.title=[...l.children].map(txt).filter(Boolean).join(' · ');}},
  // student filters: a row of chips that is cut or wraps onto a 2nd line -> ammo / armor chips show their icon only
  {sel:'.sfil .fr',test:r=>shown(r)&&(over(r)||wraps(r)),
   tip:r=>r.querySelectorAll('.fb').forEach(b=>{if(!b.title)b.title=txt(b);})}];
 let q=0;
 const run=()=>{q=0;G.forEach(g=>document.querySelectorAll(g.sel).forEach(el=>{
  g.prep&&g.prep(el);el.classList.remove('cmp');
  const on=mq.matches&&g.test(el);el.classList.toggle('cmp',on);g.tip&&g.tip(el);}));};
 const ask=()=>{if(!q)q=requestAnimationFrame(run);};
 const els=()=>G.flatMap(g=>[...document.querySelectorAll(g.sel)]);
 if('ResizeObserver' in window){const ro=new ResizeObserver(ask);els().forEach(el=>ro.observe(el));}
 // text changes only (childList / characterData), not attributes: the class + title written here can't retrigger it
 const mo=new MutationObserver(ask);
 document.querySelectorAll('.topbar .tb-res,#home .tiles,.sfil').forEach(el=>mo.observe(el,{childList:true,characterData:true,subtree:true}));
 mq.addEventListener?mq.addEventListener('change',ask):mq.addListener(ask);
 addEventListener('hashchange',()=>setTimeout(ask,60));
 if(document.fonts&&document.fonts.ready)document.fonts.ready.then(ask);
 ask();
})();
