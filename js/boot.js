// ===== BOOT SCREEN: loading video while the lobby + its Spine load, then the 0.25s CRT switch-off (css/ui.css "BOOT SCREEN").
// html.booting is already set by the small script in <head> (before first paint),
// opens on the lobby; a deep link like #tier has no .booting, so the screen is removed at once.
// Ends when the lobby is ready AND the video has been on screen 0.5 s, or on a tap, or at 6 s, whichever comes first.
(()=>{const b=document.getElementById('boot');if(!b)return;
 const R=document.documentElement;
 if(!R.classList.contains('booting')){b.remove();return;}
 let done=0;
 // the page colour (html.booting) goes the moment the CRT starts, so the shrinking screen uncovers the lobby, not a flash of
 // the boot colour; the boot layer itself keeps its colour while it shrinks
 const off=()=>{if(done)return;done=1;R.classList.remove('booting');b.classList.add('off');setTimeout(()=>b.remove(),260);};
 b.addEventListener('click',off);
 setTimeout(off,6000);
 // the video shows for 0.5 s counted from its first frame; no file / no autoplay -> 0.6 s so the screen never just flashes
 const v=b.querySelector('video');
 // desktop only: give the video its files (a phone shows the flat colour + logo and never downloads the video)
 if(!matchMedia('(max-width:900px)').matches){
  v.innerHTML='<source src="Videos/loading.webm" type="video/webm"><source src="Videos/loading.mp4" type="video/mp4">';v.load();}
 const once=new Promise(r=>{const t=setTimeout(r,600);
  v.addEventListener('playing',()=>{clearTimeout(t);setTimeout(r,500);},{once:true});});
 // lobby ready = window load, then the lobby cast has something drawn (canvas / img inside #lobbyCast)
 const loaded=new Promise(r=>document.readyState==='complete'?r():addEventListener('load',r,{once:true}));
 const cast=()=>new Promise(r=>{const c=document.getElementById('lobbyCast');if(!c)return r();
  const ok=()=>!!c.querySelector('canvas,img');if(ok())return r();
  const mo=new MutationObserver(()=>{if(ok()){mo.disconnect();r();}});mo.observe(c,{childList:true,subtree:true});});
 Promise.all([loaded.then(cast),once]).then(()=>requestAnimationFrame(off));
})();
