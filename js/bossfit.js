/* ===== BOSS FACE BOXES for the lobby cards TA·GA and Cơ chế boss (marked by the player on face_grid.html, 24/11/2026).
   Grid = 20 columns A→T × 10 rows 1→10 laid over each Boss_Portrait file. Each entry = the box that must stay visible,
   [first column, last column, top row, bottom row] = the smallest area that must stay visible on the card;
   'full' = the whole picture (Hovercraft is a ship, Shiro / Per / Goz whole body).
   The picture then fills the card (see fit below), so the card shows the box plus as much around it as the picture has. Bosses not listed = 'full'.
   24/11/2026: pictures replaced by the Fandom banners (923×284, Set 566×1045), marks redone on the new pictures (same day).
   The SAME table is copied into face_grid.html (BFACE there): marked bosses show "Xong" + their box on that page. */
const BFACE={Binah:'D I 1 10',Chesed:'G L 1 9',Hod:'E J 2 9',Hovercraft:'G P 2 10',Kaiten:'E Q 2 9',Hieronymus:'F O 2 9',
 Gregorius:'E M 2 9',Geburah:'D L 2 9',Nightmare:'F O 2 9',Shiro:'F P 2 9',Perorodzilla:'F K 1 10',Goz:'G P 1 10',Kurokage:'C I 2 9',
 Yesod:'G O 1 7',Drum:'G L 4 8',Set:'F O 2 5'};
{const COL='ABCDEFGHIJKLMNOPQRST';
 // box in fractions of the picture: x0 x1 y0 y1
 const box=k=>{const s=BFACE[k];if(!s||s==='full')return[0,1,0,1];const[a,b,t,u]=s.split(' ');
  return[COL.indexOf(a)/20,(COL.indexOf(b)+1)/20,(+t-1)/10,(+u)/10];};
 // boss key = the file name (Boss_Portrait/<key>.png or .webp)
 const keyOf=img=>(img.getAttribute('src')||'').split('/').pop().replace(/\.(png|webp)$/,'');
 const TEXT=.24; // bottom share of the card kept for the title / sub line (the frosted scrim)
 // The marked box = the smallest area that should show. The picture always fills the whole card and its own edges never come
 // inside the card window (player's rule, 25/11/2026); within that it is slid so the box sits in the middle of the area above
 // the title. A box wider than the card's shape allows gets its far sides cropped: mark a tighter box for that boss.
 const K8=Math.tan(8*Math.PI/180);   // the card window leans 8°: its corners reach tan(8°)·H/2 past each side
 function fit(img){const w=img.naturalWidth,h=img.naturalHeight,host=img.closest('.tbg');if(!w||!host)return;
  // phone strip cards (TA/GA): the face goes into the right 45% of the card, the left side is the text safe zone
  const strip=matchMedia('(max-width:900px)').matches&&!!img.closest('#tRaid,#tBan,#tPvp,#tStu,#tUe');
  const W=host.clientWidth,Hf=host.clientHeight,H=strip?Hf:Hf*(1-TEXT);if(!W||!Hf)return;
  const AW=strip?W*.45:W,AX=strip?W-AW:0;                  // the area the face must sit in: x from AX, width AW
  const[x0,x1,y0,y1]=box(keyOf(img)),ex=K8*Hf/2;
  const s=strip?Math.max((AW+ex)/w,Hf/h):Math.max((W+2*ex)/w,Hf/h),iw=w*s,ih=h*s;   // smallest scale that covers the card
  const cx=(x0+x1)/2*iw,cy=(y0+y1)/2*ih;                   // box centre inside the scaled picture (px)
  let L=AX+AW/2-cx,T=H/2-cy;
  // clamp so the picture's edge never comes inside the card window (the scale above always leaves enough picture for it).
  // Phone strip: the picture only has to cover the right art area (the left is the text zone, its fade hides the room behind)
  L=strip?Math.min(AX,Math.max(W+ex-iw,L)):Math.min(-ex,Math.max(W+ex-iw,L));
  T=Math.min(0,Math.max(Hf-ih,T));
  const set=(p,v)=>img.style.setProperty(p,v,'important');
  set('height',ih+'px');set('width',iw+'px');set('left',L+'px');set('top',T+'px');
  set('transform','skewX(var(--usk))');set('transform-origin',(W/2-L)+'px '+(Hf/2-T)+'px');}
 const all=()=>document.querySelectorAll('#home .tbg img[data-strip]').forEach(fit);
 document.addEventListener('load',e=>{if(e.target.matches&&e.target.matches('#home .tbg img[data-strip]'))fit(e.target);},true);
 const tl=document.querySelector('#home .tiles');
 if(tl&&'ResizeObserver' in window){let q=0;new ResizeObserver(()=>{if(!q)q=requestAnimationFrame(()=>{q=0;all();});}).observe(tl);}
 // the lobby rebuilds a card picture when the boss changes: fit only the boss pictures that just arrived (the tiles' text also
 // changes on every keystroke in the Eligma box, that must not refit anything)
 if(tl)new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1)
  (n.matches('img[data-strip]')?[n]:n.querySelectorAll('img[data-strip]')).forEach(i=>requestAnimationFrame(()=>fit(i)));})
  .observe(tl,{childList:true,subtree:true});
 all();}
// ===== phone Dock minimize-on-scroll (Safari style, <=900px only): scrolling down shrinks it to icons, scrolling up,
// 300ms without scrolling, the top of the page, a screen change or a tap springs it back. While small, the first tap only opens it.
{const D=document.getElementById('dock'),GMS=document.getElementById('gm'),mq=matchMedia('(max-width:900px)'),last=new WeakMap();let t=0,acc=0;
 const open=()=>{clearTimeout(t);acc=0;D.classList.remove('mini');};
 addEventListener('scroll',e=>{
  const el=e.target===document?document.scrollingElement:e.target;
  if(!mq.matches||!(el instanceof Element)||el.closest('.dock')||GMS?.classList.contains('on'))return;
  const y=el.scrollTop,dy=y-(last.get(el)??y);last.set(el,y);
  if(!dy||y<0||y>el.scrollHeight-el.clientHeight)return;   // sideways scrolling, or iOS rubber-band past the top / bottom edge
  if(y<40)return open();                                   // near the top: full size
  acc=Math.sign(dy)===Math.sign(acc)?acc+dy:dy;            // distance moved in the same direction, so a jittery finger does nothing
  if(acc<-16)return open();                                // scrolled up a little: full size
  if(acc>16)D.classList.add('mini');
  clearTimeout(t);t=setTimeout(open,300);                  // debounce: still for 300ms = back to full size
 },{capture:true,passive:true});
 D.addEventListener('click',e=>{if(D.classList.contains('mini')){e.preventDefault();e.stopImmediatePropagation();open();}},true);
 D.addEventListener('focusin',e=>{if(e.target.matches(':focus-visible'))open();});   // keyboard users never meet a small dock
 addEventListener('hashchange',open);}
