// ===== BOOT SCREEN: loading video while the lobby + its Spine load, then the 0.25s CRT switch-off (css/ui.css "BOOT SCREEN").
// Only when the page opens on the lobby (no hash or #home); a deep link like #tier skips it at once.
// Ends when the lobby is ready AND the video has been on screen 0.5 s, or on a tap, or at 6 s, whichever comes first.
(()=>{const b=document.getElementById('boot');if(!b)return;
 const h=location.hash.slice(1);
 if(h&&h!=='home'){b.remove();return;}
 const R=document.documentElement;R.classList.add('booting');
 // browser bars (theme-color) black while booting, old colours back afterwards
 const tc=[...document.querySelectorAll('meta[name=theme-color]')],tc0=tc.map(m=>m.content);tc.forEach(m=>m.content='#000000');
 let done=0;
 const off=()=>{if(done)return;done=1;b.classList.add('off');setTimeout(()=>{b.remove();R.classList.remove('booting');tc.forEach((m,i)=>m.content=tc0[i]);},260);};
 b.addEventListener('click',off);
 setTimeout(off,6000);
 // the video shows for 0.5 s counted from its first frame (before, the clock started before the video had even begun);
 // no file / no autoplay -> 0.6 s so the screen never just flashes
 const v=b.querySelector('video');
 const once=new Promise(r=>{const t=setTimeout(r,600);
  v.addEventListener('playing',()=>{clearTimeout(t);setTimeout(r,500);},{once:true});});
 // lobby ready = window load, then the lobby cast has something drawn (canvas / img inside #lobbyCast)
 const loaded=new Promise(r=>document.readyState==='complete'?r():addEventListener('load',r,{once:true}));
 const cast=()=>new Promise(r=>{const c=document.getElementById('lobbyCast');if(!c)return r();
  const ok=()=>!!c.querySelector('canvas,img');if(ok())return r();
  const mo=new MutationObserver(()=>{if(ok()){mo.disconnect();r();}});mo.observe(c,{childList:true,subtree:true});});
 Promise.all([loaded.then(cast),once]).then(()=>requestAnimationFrame(off));
})();
