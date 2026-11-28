// ===== sound priority: every voice clip (new Audio) is tagged with the screen it was started on. Opening another screen fades the
// old screen's clips out in 200 ms (in step with the zoom) and pauses them, so only the screen in front talks; hiding the tab /
// locking the phone pauses everything and resumes the clips of the screen still in front when it comes back.
const MEDIA=new Set();
// Phones (Safari on iPhone, Chrome on Android) only let a sound start from a timer if that same <audio> element was started once
// inside a tap. The voices all start from timers (intro after the zoom, lines every 15 s, the next line of a dialogue), so on a
// phone they stayed silent. Fix: on the very first tap / key, 4 audio elements are started with a silent clip (= unlocked), and
// every voice afterwards reuses one of those instead of a brand-new element.
{const N=window.Audio;if(N){
 const SIL='data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',POOL=[];let primed=false;
 const prime=()=>{if(primed)return;primed=true;for(let i=0;i<4;i++){const a=new N();a.src=SIL;a.__pool=1;
   try{const p=a.play();if(p&&p.then)p.then(()=>a.pause(),()=>{});}catch(_){}POOL.push(a);}};
 ['pointerdown','touchend','keydown','click'].forEach(t=>addEventListener(t,prime,{capture:true,passive:true}));
 const W=function(src){const now=performance.now();
  let a=POOL.find(x=>(x.paused||x.ended)&&!x.__hid&&!x.__fading&&!(x.__t>now-200));
  if(a){MEDIA.delete(a);a.onended=a.onerror=a.oncanplay=null;try{a.pause();}catch(_){}a.volume=1;a.__fading=0;a.loop=false;if(src)a.src=src;}
  else a=new N(src);
  a.__t=now;a.__own=window.__scr||'home';MEDIA.add(a);
  if(!a.__l){a.__l=1;a.addEventListener('ended',()=>MEDIA.delete(a));}
  return a;};
 W.prototype=N.prototype;window.Audio=W;}}
function mStop(a,ms=200){if(!a||a.paused||a.ended||a.__fading)return;a.__fading=1;const v0=a.volume,t0=performance.now();
 const end=()=>{a.pause();a.volume=v0;a.__fading=0;MEDIA.delete(a);};
 if(document.hidden){end();return;}
 const f=t=>{const k=Math.min(1,(t-t0)/ms);try{a.volume=v0*(1-k);}catch(_){}if(k<1)requestAnimationFrame(f);else end();};requestAnimationFrame(f);}
const mDuck=keep=>MEDIA.forEach(a=>{if(a.__own!==keep)mStop(a);});
{const HID=[];document.addEventListener('visibilitychange',()=>{
 if(document.hidden){MEDIA.forEach(a=>{if(!a.paused&&!a.ended){a.pause();a.__hid=1;HID.push(a);}});}
 else HID.splice(0).forEach(a=>{a.__hid=0;if(a.__own===(window.__scr||'home'))a.play().catch(()=>{});else MEDIA.delete(a);});});}
const TYPE={E:['t-exp','Explosive','var(--exp)'],P:['t-pie','Piercing','var(--pie)'],M:['t-mys','Mystic','var(--mys)'],S:['t-son','Sonic','var(--son)'],C:['t-cor','Corrosive','var(--cor)']};
const ueChip=u=>u>0?`<span class="ue u${u}">UE${u}</span>`:`<span class="ue u0">Chưa UE</span>`;
// avatar from Avatar_Collection; file names are web-safe: "Hina (Dress)" -> "Hina_Dress.webp". Hidden if the file is missing
const avFile=n=>n.replace(/[^A-Za-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
const avImg=(n,c)=>`<img class="${c}" data-stu="${n}" src="Avatar_Collection/${avFile(n)}.webp" alt="" loading="lazy" onerror="this.remove()">`;
const porImg=(n,c)=>`<img class="${c}" src="Portrait_Full/${avFile(n)}.webp" alt="" loading="lazy" onerror="this.remove()">`;
// boss art: BlueArchive_TA_GA_Bosses_HD/Boss_Icon|Boss_Portrait/{key}.png, falls back to .webp, hidden if both are missing.
// Every file is named by the boss key (Fandom wiki banners / icons, 24/11/2026)
function bimgErr(el){if(!el.dataset.f){el.dataset.f=1;el.src=el.src.replace(/\.png$/,'.webp')}else{(el.closest('.bhero,.lbg')||el).remove()}}
const bossImg=(k,kind,c)=>`<img class="${c}" src="BlueArchive_TA_GA_Bosses_HD/Boss_${kind}/${k}.png" alt="" loading="lazy" onerror="bimgErr(this)">`;
const SSP=[
 ['Hina (Dress)',3,'Striker','E','Đánh giáp Light, AoE; PvP S'],
 ['Hanako (Swimsuit)',3,'Striker','S','Đánh giáp Elastic, AoE; PvP SS; map SS'],
 ['Neru (School)',3,'Striker','P','Đánh giáp Heavy, đơn mục tiêu'],
 ['Hoshino (Armed)',2,'Striker','M','Đánh giáp Special, Perorodzilla; PvP SS'],
 ['Hoshino (Swimsuit)',2,'Striker','E','Buff Explosive + tank phụ; top raid JP'],
 ['Mika (Swimsuit)',2,'Striker','S','Đánh giáp Elastic, đơn mục tiêu; top raid JP'],
 ['Aris (Armed)',2,'Striker','M','Đánh giáp Special; map SS'],
 ['Kei',2,'Striker','M','Support Mystic 2 cost; giáp Composite chịu tốt Mystic, Sonic'],
 ['Mari (Pop Idol)',2,'Striker','E','Healer 2 cost; Hieronymus'],
 ['Kisaki',2,'Special','S','Buff EX, dùng ở mọi raid'],
 ['Rio',2,'Special','M','Copy EX, có mặt gần như mọi raid'],
 ['Nagisa (Swimsuit)',2,'Special','S','Cost Over, bắt buộc ở độ khó cao'],
 ['Himari (Armed)',2,'Special','P','T.S cho đội Heavy: hồi máu, buff, debuff'],
 ['Shiroko (Swimsuit)',2,'Special','M','Raid SS+, PvP SS, map SS'],
 ['Michiru (Dress)',2,'Special','E','Giảm cost mở màn; map SS+; PvP SS'],
 ['Iroha (Swimsuit)',2,'Striker','E','DPS Explosive, đánh giáp Light'],
 ['Ibuki (Swimsuit)',0,'Special','E','Buff chí mạng cho 2 đồng đội']];
const SS=[
 ['Mika',3,'Striker','P','DPS Piercing, đánh giáp Heavy'],
 ['Shiroko*Terror',2,'Striker','M','DPS Mystic; PvP SS'],
 ['Wakamo',2,'Striker','M','DPS Mystic đơn mục tiêu'],
 ['Kokona',1,'Striker','P','Healer 2 cost; Hieronymus'],
 ['Hikari',1,'Striker','S','Buff Sonic cho đội đánh giáp Elastic'],
 ['Satsuki (Swimsuit)',2,'Striker','S','Healer + giảm giáp; Hieronymus, Gevurah'],
 ['Fuuka (New Year)',1,'Special','P','Giảm nửa cost EX + buff chí mạng'],
 ['Hare (Camp)',1,'Striker','E','Buff ATK hiếm hoi ở slot Striker'],
 ['Kayoko (New Year)',0,'Striker','M','Buff Mystic'],
 ['Aru (Dress)',0,'Striker','P','Buff sát thương chí mạng'],
 ['Seia',0,'Striker','P','Buff Piercing + giảm cost'],
 ['Seia (Swimsuit)',0,'Striker','P','Buff EX lâu hơn Kisaki'],
 ['Suzumi (Magical)',0,'Striker','S','Buff summon, giảm né tránh của địch'],
 ['Himari',0,'Special','P','+105% ATK'],
 ['Ako',0,'Special','M','Buff chí mạng + hồi máu'],
 ['Reisa (Magical)',0,'Special','S','Buff chí mạng, đội Sonic']];
const z=s=>s.split('|').map(n=>[n,0]);
const S=[['Tsubaki',3],['Koharu',3],['Iori',3],['Aru',2],['Nozomi',2],['Maki',2],['Rio (Armed)',2],['Shun',1],['Kurumi',1],['Niko',1],['Makoto (Swimsuit)',1],['Tsukuyo (Dress)',1],
 ...z('Yuuka (Track)|Mine|Midori (Maid)|Cherino|Kanna (Swimsuit)|Ui|Aris (Maid)|Atsuko|Sakurako (Pop Idol)|Yuuka (Pajamas)|Sena (Casual)|Kanoe|Haruka (Dress)|Haruka (New Year)|Takane|Misaki (Swimsuit)')];
const A=[['Yuuka',3],['Momoi',3],['Utaha',3],['Koharu (Swimsuit)',2],['Serina',2],['Eimi',2],['Hanako',2],['Mari',2],['Ibuki',2],
 ['Hibiki',1],['Iroha',1],['Haruna (New Year)',1],['Tsurugi',1],['Toki (Armed)',1],['Mine (Pop Idol)',1],['Konoka',1],['Natsu',1],['Akane',1],['Kotama',1],['Shigure (Hot Spring)',1],
 ...z('Noa|Kaede|Saki|Miyo|Reisa|Neru|Miyako|Miyako (Swimsuit)|Hinata|Tsukuyo|Kazusa|Natsu (Band)|Juri (Part-Timer)|Asuna (School)|Rabu|Ui (Swimsuit)|Saki (Swimsuit)|Eimi (Swimsuit)|Chinatsu (Hot Spring)|Serina (Christmas)|Nodoka (Hot Spring)|Shizuko (Swimsuit)|Atsuko (Swimsuit)|Ayane (Swimsuit)|Akari (New Year)|Kirino (Swimsuit)|Karin (School)|Akane (School)|Ichika (Swimsuit)|Erika|Tomoe (Qipao)|Saya (Casual)')];
const BC=[['Hasumi (Track)',3],['Hifumi',2],['Mutsuki',2],['Midori',2],['Haruka',2],['Kayoko',2],['Junko',2],['Azusa',2],
 ...'Airi|Yoshimi|Momiji|Pina|Chinatsu|Chise|Hina|Hasumi|Akari|Fuuka|Ayane|Hanae|Shizuko|Suzumi|Sumire|Serika|Asuna (Bunny)|Kotori|Shimiko|Haruna|Hoshino'.split('|').map(n=>[n,1]),
 ...z('Izuna|Shun (Small)|Aoba|Kirino|Nonomi|Mimori|Airi (Band)|Shiroko|Asuna|Saori (Swimsuit)|Sena|Juri|Hare|Mashiro|Renge|Kanna|Chiaki|Reijo|Meru|Mina|Rumi|Nonomi (Swimsuit)|Ichika|Megu|Miyu|Kotori (Cheer Squad)|Haruna (Track)|Wakamo (Swimsuit)|Miyu (Swimsuit)|Akane (Bunny)|Izumi|Junko (New Year)|Kaho|Hiyori (Swimsuit)|Hifumi (Swimsuit)|Toki (Bunny)|Kotama (Camp)|Sakurako|Nodoka|Shigure|Serika (New Year)|Hiyori|Yuzu (Maid)|Saori|Umika|Yuzu|Mimori (Swimsuit)|Saya|Karin|Misaki|Momoi (Maid)|Moe|Serika (Swimsuit)|Yukari|Tsubaki (Guide)|Saori (Dress)|Shiroko (Cycling)|Aris|Chihiro|Yukari (Swimsuit)|Moe (Swimsuit)|Kasumi|Nagusa|Koyuki|Utaha (Cheer Squad)|Izumi (Swimsuit)|Tsurugi (Swimsuit)|Tomoe|Fubuki|Michiru|Renge (Swimsuit)|Chiaki (Swimsuit)|Otogi')];

// saved progress (this browser only): UE overrides the player marked in the growth popup
const LS={get(k,d){try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}},
 set(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}}};
const UEX=LS.get('ba_ue',{});
[SSP,SS,S,A,BC].forEach(g=>g.forEach(x=>{if(x[0] in UEX)x[1]=UEX[x[0]]}));
// roster edits from the Roster screen (this browser only). RALL = the full default roster [name, tier index, UE] taken before
// anything is removed; a student marked "not owned" (o:0) then leaves every tier list, so the whole report treats them as
// not owned. Level / stars / skills: only what differs from "maxed" (Lv 90, 5★, skills 5/10/10/10) is stored.
const RST=LS.get('ba_roster',{}),RDEF={o:1,s:5,l:90,k:[5,10,10,10]};
const RALL=[SSP,SS,S,A,BC].flatMap((g,t)=>g.map(x=>[x[0],t,x[1]]));
const rget=n=>{const r=RST[n]||{};return {o:r.o??1,s:r.s??5,l:r.l??90,k:Array.isArray(r.k)?r.k:RDEF.k};};
[SSP,SS,S,A,BC].forEach(g=>{for(let i=g.length;i--;)if(rget(g[i][0]).o===0)g.splice(i,1);});
// role · ammo · armor · slot of every roster student (Blue Archive Wiki "Characters" table, 11/2026)
// code: role T Tank / A Dealer / H Healer / S Support / X Tactical Support · ammo E P M S · armor l h s e c · 1 Striker / 0 Special
const STAT={};('Hina (Dress):AEe1|Hanako (Swimsuit):ASh1|Neru (School):APe1|Hoshino (Armed):TMh1|Hoshino (Swimsuit):SEs1|Mika (Swimsuit):ASs1|Aris (Armed):AMc1|Kei:SMc1|Mari (Pop Idol):HEh1|Kisaki:SSe0|Rio:SMe0|Nagisa (Swimsuit):SSe0|Himari (Armed):XPe0|Shiroko (Swimsuit):AMl0|Michiru (Dress):HEl0|Iroha (Swimsuit):AEs1|Ibuki (Swimsuit):SEs0'
 +'|Mika:APl1|Shiroko*Terror:AMs1|Wakamo:AMl1|Kokona:HPs1|Hikari:SSl1|Satsuki (Swimsuit):HSe1|Fuuka (New Year):SPs0|Hare (Camp):SEl1|Kayoko (New Year):SMs1|Aru (Dress):SPh1|Seia:SPe1|Seia (Swimsuit):SPs1|Suzumi (Magical):SSs1|Himari:SPl0|Ako:SMh0|Reisa (Magical):HSs0'
 +'|Tsubaki:TPs1|Koharu:HEh1|Iori:APh1|Aru:AEl1|Nozomi:ASl1|Maki:APl1|Rio (Armed):AEs1|Shun:AEl1|Kurumi:TEl1|Niko:SEe1|Makoto (Swimsuit):AMh1|Tsukuyo (Dress):TPl1|Yuuka (Track):TMs1|Mine:TEl1|Midori (Maid):ASl1|Cherino:APl1|Kanna (Swimsuit):SEl1|Ui:SEl1|Aris (Maid):AMl1|Atsuko:TEs1|Sakurako (Pop Idol):SEh1|Yuuka (Pajamas):TEh1|Sena (Casual):HSh1|Kanoe:TMh1|Haruka (Dress):AEl1|Haruka (New Year):SEl0|Takane:HMl1|Misaki (Swimsuit):AEs0'
 +'|Yuuka:TEh1|Momoi:APl1|Utaha:APh0|Koharu (Swimsuit):AMh1|Serina:HMl0|Eimi:TEl1|Hanako:HPs0|Mari:SMs0|Ibuki:SMh1|Hibiki:AEh0|Iroha:XMh0|Haruna (New Year):AEl1|Tsurugi:APh1|Toki (Armed):SPl1|Mine (Pop Idol):TEh1|Konoka:TMl1|Natsu:TMh1|Akane:SPl1|Kotama:SEl0|Shigure (Hot Spring):HPs0|Noa:SMs1|Kaede:SEs0|Saki:APs0|Miyo:SSe1|Reisa:TPh1|Neru:APl1|Miyako:TPh1|Miyako (Swimsuit):TEh1|Hinata:AMh1|Tsukuyo:TMl1|Kazusa:APh1|Natsu (Band):HEs1|Juri (Part-Timer):TMl1|Asuna (School):SEh1|Rabu:ASs1|Ui (Swimsuit):SPe1|Saki (Swimsuit):SEh1|Eimi (Swimsuit):SMs0|Chinatsu (Hot Spring):SMl1|Serina (Christmas):SPs1|Nodoka (Hot Spring):HEs0|Shizuko (Swimsuit):SMh0|Atsuko (Swimsuit):HSs0|Ayane (Swimsuit):XPl0|Akari (New Year):XMs0|Kirino (Swimsuit):SMh0|Karin (School):AEh0|Akane (School):AEl0|Ichika (Swimsuit):SSs0|Erika:SSl0|Tomoe (Qipao):SMs0|Saya (Casual):APs0'
 +'|Hasumi (Track):AMs1|Hifumi:SPl1|Mutsuki:AEl1|Midori:APl1|Haruka:TEl1|Kayoko:SEh1|Junko:APl1|Azusa:AEh1|Airi:SEl0|Yoshimi:APh0|Momiji:ASh1|Pina:APl1|Chinatsu:HPl0|Chise:AMh1|Hina:AEh1|Hasumi:APh1|Akari:AEh1|Fuuka:HEh0|Ayane:HPl0|Hanae:HEh0|Shizuko:SMs0|Suzumi:SEh1|Sumire:APs1|Serika:AEl1|Asuna (Bunny):SMl1|Kotori:SPl1|Shimiko:SEl0|Haruna:AMh1|Hoshino:TPh1'
 +'|Izuna:AMl1|Shun (Small):AEl1|Aoba:TSl1|Kirino:SEs1|Nonomi:APl1|Mimori:SMl1|Airi (Band):AEs1|Shiroko:AEl1|Asuna:AMl1|Saori (Swimsuit):AMh1|Sena:XMl0|Juri:SEl0|Hare:SEl0|Mashiro:AEh0|Renge:ASh1|Kanna:APh0|Chiaki:ASs1|Reijo:SMh1|Meru:APl1|Mina:SEh1|Rumi:HEh1|Nonomi (Swimsuit):AEs1|Ichika:ASh1|Megu:AEs1|Miyu:SPl1|Kotori (Cheer Squad):AEs1|Haruna (Track):HSh0|Wakamo (Swimsuit):APh1|Miyu (Swimsuit):AEl0|Akane (Bunny):AMh0|Izumi:AEl1|Junko (New Year):AMh1|Kaho:AMh1|Hiyori (Swimsuit):APh1|Hifumi (Swimsuit):XPh0|Toki (Bunny):AEl1|Kotama (Camp):SPh1|Sakurako:AMs1|Nodoka:SEh0|Shigure:AEh1|Serika (New Year):SPs0|Hiyori:SEl0|Yuzu (Maid):AEe0|Saori:AEs1|Umika:AMs1|Yuzu:APs1|Mimori (Swimsuit):SMs0|Saya:AEl0|Karin:APh0|Misaki:AEs1|Momoi (Maid):ASl1|Moe:APl0|Serika (Swimsuit):AMh0|Yukari:ASh1|Tsubaki (Guide):SPh0|Saori (Dress):ASl1|Shiroko (Cycling):AMh1|Aris:AMs1|Chihiro:APh0|Yukari (Swimsuit):APl1|Moe (Swimsuit):ASs1|Kasumi:ASh1|Nagusa:ASe1|Koyuki:AMh1|Utaha (Cheer Squad):AMs1|Izumi (Swimsuit):SEl1|Tsurugi (Swimsuit):AMs1|Tomoe:SPs1|Fubuki:APh1|Michiru:AMl1|Renge (Swimsuit):ASs1|Chiaki (Swimsuit):APh0|Otogi:AEs1')
 .split('|').forEach(p=>{const i=p.lastIndexOf(':'),c=p.slice(i+1);STAT[p.slice(0,i)]={r:c[0],a:c[1],m:c[2],k:c[3]==='1'};});
STAT['Hoshino (Armed)'].r2='A'; // switches between Tank and Attacker form
// battle position (Blue Archive Wiki "Characters" table, 11/2026; wiki JP-style names mapped to the Global ones used here)
{const P={F:'Neru (School)|Hoshino (Armed)|Hoshino (Swimsuit)|Mika (Swimsuit)|Mika|Tsubaki|Kurumi|Niko|Tsukuyo (Dress)|Yuuka (Track)|Mine|Atsuko|Yuuka (Pajamas)|Kanoe|Haruka (Dress)'
  +'|Yuuka|Eimi|Tsurugi|Mine (Pop Idol)|Konoka|Natsu|Reisa|Neru|Miyako|Miyako (Swimsuit)|Tsukuyo|Natsu (Band)|Juri (Part-Timer)|Rabu|Haruka|Sumire|Hoshino|Izuna|Aoba|Airi (Band)|Rumi|Megu|Utaha (Cheer Squad)|Tsurugi (Swimsuit)|Michiru',
 M:'Hanako (Swimsuit)|Aris (Armed)|Mari (Pop Idol)|Iroha (Swimsuit)|Shiroko*Terror|Kokona|Hikari|Satsuki (Swimsuit)|Hare (Camp)|Kayoko (New Year)|Seia|Seia (Swimsuit)|Suzumi (Magical)'
  +'|Nozomi|Rio (Armed)|Cherino|Kanna (Swimsuit)|Sakurako (Pop Idol)|Sena (Casual)|Takane|Momoi|Ibuki|Toki (Armed)|Akane|Noa|Hinata|Asuna (School)|Chinatsu (Hot Spring)|Serina (Christmas)'
  +'|Hifumi|Kayoko|Junko|Azusa|Chise|Akari|Suzumi|Serika|Asuna (Bunny)|Kirino|Mimori|Shiroko|Asuna|Saori (Swimsuit)|Chiaki|Reijo|Meru|Mina|Ichika|Junko (New Year)|Kaho|Toki (Bunny)'
  +'|Kotama (Camp)|Sakurako|Shigure|Saori|Umika|Yuzu|Momoi (Maid)|Saori (Dress)|Shiroko (Cycling)|Moe (Swimsuit)|Kasumi',
 B:'Hina (Dress)|Kei|Kisaki|Rio|Nagisa (Swimsuit)|Himari (Armed)|Shiroko (Swimsuit)|Michiru (Dress)|Ibuki (Swimsuit)|Wakamo|Fuuka (New Year)|Aru (Dress)|Himari|Ako|Reisa (Magical)'
  +'|Koharu|Iori|Aru|Maki|Shun|Makoto (Swimsuit)|Midori (Maid)|Ui|Aris (Maid)|Haruka (New Year)|Misaki (Swimsuit)|Utaha|Koharu (Swimsuit)|Serina|Hanako|Mari|Hibiki|Iroha|Haruna (New Year)'
  +'|Kotama|Shigure (Hot Spring)|Kaede|Saki|Miyo|Kazusa|Ui (Swimsuit)|Saki (Swimsuit)|Eimi (Swimsuit)|Nodoka (Hot Spring)|Shizuko (Swimsuit)|Atsuko (Swimsuit)|Ayane (Swimsuit)|Akari (New Year)'
  +'|Kirino (Swimsuit)|Karin (School)|Akane (School)|Ichika (Swimsuit)|Erika|Tomoe (Qipao)|Saya (Casual)|Hasumi (Track)|Mutsuki|Midori|Airi|Yoshimi|Momiji|Pina|Chinatsu|Hina|Hasumi|Fuuka'
  +'|Ayane|Hanae|Shizuko|Kotori|Shimiko|Haruna|Shun (Small)|Nonomi|Sena|Juri|Hare|Mashiro|Renge|Kanna|Nonomi (Swimsuit)|Miyu|Kotori (Cheer Squad)|Haruna (Track)|Wakamo (Swimsuit)|Miyu (Swimsuit)'
  +'|Akane (Bunny)|Izumi|Hiyori (Swimsuit)|Hifumi (Swimsuit)|Nodoka|Serika (New Year)|Hiyori|Yuzu (Maid)|Mimori (Swimsuit)|Saya|Karin|Misaki|Moe|Serika (Swimsuit)|Yukari|Tsubaki (Guide)|Aris'
  +'|Chihiro|Yukari (Swimsuit)|Nagusa|Koyuki|Izumi (Swimsuit)|Tomoe|Fubuki|Renge (Swimsuit)|Chiaki (Swimsuit)|Otogi'};
 for(const k in P)P[k].split('|').forEach(n=>{if(STAT[n])STAT[n].p=k;});}
const PLV={F:'Front',M:'Middle',B:'Back'};
// position badge = the game's FRONT / MIDDLE / BACK plate (Icons/pos-*.png), text if the file is missing
const posIc=p=>PLV[p]?`<img class="psic" src="Icons/pos-${PLV[p].toLowerCase()}.png" alt="${PLV[p]}" title="Vị trí: ${PLV[p]}" onerror="this.replaceWith('${PLV[p]}')">`:'';
const RLV={T:'Tank',A:'Dealer',H:'Healer',S:'Support',X:'T.S.'},ARMK={l:'light',h:'heavy',s:'special',e:'elastic',c:'composite'};
// role label -> game icon (Icons/role-*.png); icon only, the name stays in the tooltip / for screen readers. Unknown label = text
const RIC={Tank:'tank',Dealer:'dealer',Attacker:'dealer',Healer:'healer',Support:'support','T.S.':'tactical-support','T.S':'tactical-support','Tactical Support':'tactical-support'};
const roleIc=l=>RIC[l]?`<img class="rlic" src="Icons/role-${RIC[l]}.png" alt="${l}" title="${l}" onerror="this.replaceWith('${l}')">`:l||'';
// student profile (Blue Archive Wiki "Characters trivia list", 11/2026) + short Vietnamese intro from the in-game profile.
// key = base name (costumes share it); [JP name, reading, school, age, birthday d/m, height cm, hobbies, voice, intro]
const BIO={};
Object.assign(BIO,{
 'Airi':['栗村アイリ','Kurimura Airi','Trinity',15,'30/1',160,'Tìm đồ ngọt ngon, tiệc trà','Mizumori Chiko','Thành viên Hội Nghiên cứu Đồ ngọt Trinity. Hiền lành, hay lo, thường là người can ngăn cả nhóm.'],
 'Akane':['室笠アカネ','Murokasa Akane','Millennium',16,'1/4',164,'Dọn dẹp','Hara Yumi','Thành viên C&C, đội đặc vụ hầu gái của Millennium. Lịch sự, nhã nhặn nhưng rất mê chất nổ và "dọn sạch" mục tiêu.'],
 'Akari':['鰐渕アカリ','Wanibuchi Akari','Gehenna',17,'9/12',167,'Ăn thật nhiều','Morishima Yūka','Thành viên Hội Nghiên cứu Ẩm thực Gehenna. Luôn tươi cười, ăn khỏe vô đáy.'],
 'Ako':['天雨アコ','Amau Ako','Gehenna',17,'22/12',165,'Chủ tịch Hina','Kouno Marika','Thư ký của Ban Kỷ luật Gehenna, cánh tay phải của Hina. Giỏi tham mưu nhưng hễ dính tới Hina là mất bình tĩnh.'],
 'Aoba':['内海アオバ','Utsumi Aoba','Highlander',16,'19/7',151,'Mơ mộng, nói mỉa','Tajima Saran','Học sinh Học viện Đường sắt Highlander. Hay buông lời châm chọc nhưng vẫn làm tròn việc.'],
 'Aris':['天童アリス','Tendou Aris','Millennium','??','25/3',152,'Chơi game (nhất là RPG)','Tanaka Minami','Thành viên Câu lạc bộ Phát triển Game. Được tìm thấy trong một phế tích, học cách nói chuyện qua game nên hay nói như nhân vật RPG.'],
 'Aru':['陸八魔アル','Rikuhachima Aru','Gehenna',16,'12/3',160,'Học quản trị kinh doanh','Kondō Reina','Thủ lĩnh tự xưng của Problem Solver 68. Muốn làm "phản diện ngầu" nhưng hay hớ hênh nên lộ ra là người tốt bụng.'],
 'Asuna':['一之瀬アスナ','Ichinose Asuna','Millennium',17,'24/3',167,'Tấn công','Hasegawa Ikumi','Thành viên C&C. Vô tư, hành động theo trực giác, và trực giác ấy hầu như luôn đúng.'],
 'Atsuko':['秤アツコ','Hakari Atsuko','Arius',15,'20/1',158,'Chăm sóc hoa','Hanazawa Kana','Thành viên Arius Squad, luôn đeo mặt nạ. Ít nói, giao tiếp bằng ký hiệu tay, được cả đội che chở.'],
 'Ayane':['奥空アヤネ','Okusora Ayane','Abydos',15,'12/11',153,'Ghi sổ sách, sưu tầm đồ cổ','Harada Sayaka','Thành viên Đội Đối sách Abydos, phụ trách hậu cần và liên lạc. Chu đáo, là người tỉnh táo nhất nhóm.'],
 'Azusa':['白洲アズサ','Shirasu Azusa','Trinity',16,'26/12',149,'Chưa có','Taneda Risa','Học sinh chuyển trường vào Lớp Phụ đạo Trinity. Được huấn luyện như lính, nghiêm túc, đang dần học cách tận hưởng cuộc sống.'],
 'Cherino':['連河チェリノ','Renkawa Cherino','Red Winter','??','27/10',128,'Thanh trừng, ném tuyết','Yano Hinaki','Chủ tịch Hội học sinh Red Winter. Thấp bé nhưng thích ra oai, hay ban hành mệnh lệnh kỳ quặc.'],
 'Chiaki':['元宮チアキ','Motomiya Chiaki','Gehenna',16,'22/9',167,'Ra tạp chí tuần, kết bạn','Kanno Mai','Thành viên Pandemonium Society của Gehenna, phụ trách truyền thông. Hoạt bát, thích kết bạn.'],
 'Chihiro':['各務チヒロ','Kagami Chihiro','Millennium',17,'26/4',160,'Mua đồ điện tử','Yamamura Hibiku','Phó hội trưởng Veritas, câu lạc bộ hacker của Millennium. Điềm tĩnh, là người lý trí của nhóm.'],
 'Chinatsu':['火宮チナツ','Hinomiya Chinatsu','Gehenna',15,'22/8',159,'Đọc sách triết học','Kouzuki Haruka','Thành viên Ban Kỷ luật Gehenna, lo y tế cho đội. Điềm đạm, thích suy ngẫm.'],
 'Chise':['和楽チセ','Waraku Chise','Hyakkiyako',16,'13/7',159,'Làm thơ haiku','Shimamura Yuu','Thành viên Ban Âm Dương Hyakkiyako. Nói năng mơ màng, khó đoán.'],
 'Eimi':['和泉元エイミ','Izumimoto Eimi','Millennium',15,'1/5',167,'Thả hồn, nghe nhạc','Matsunaga Akane','Đặc vụ của Đội Xử lý Hiện tượng Siêu nhiên Millennium. Ít nói, hay nhìn xa xăm nhưng làm nhiệm vụ cực kỳ hiệu quả.'],
 'Erika':['旗見エリカ','Hatami Erika','Gehenna',16,'1/2',166,'Ngắm đồ, sưu tầm catalogue','Nakano Saima','Học sinh Gehenna, thích mua sắm và ngắm đồ.'],
 'Fubuki':['合歓垣フブキ','Nemugaki Fubuki','Valkyrie',15,'21/10',148,'Ô chữ, nghe radio','Hirayama Emi','Cảnh sát Valkyrie, Cục An ninh Công cộng. Lười biếng, chỉ muốn ăn bánh donut và trốn việc.'],
 'Fuuka':['愛清フウカ','Aikiyo Fuuka','Gehenna',16,'30/4',159,'Nấu ăn, làm cơm hộp','Fairouz Ai','Trưởng Bộ phận Bếp ăn Gehenna. Chăm chỉ, hay bị Hội Nghiên cứu Ẩm thực bắt cóc.'],
 'Hanae':['朝顔ハナエ','Asagao Hanae','Trinity',15,'12/5',150,'Nhảy, cổ vũ','Yūki Kana','Thành viên Đội Cứu hộ Trinity. Nhiệt tình quá mức, chữa trị theo kiểu "càng nhiều càng tốt".'],
 'Hanako':['浦和ハナコ','Urawa Hanako','Trinity',16,'3/1',161,'Đi dạo lang thang','Toyota Moe','Thành viên Lớp Phụ đạo Trinity. Thông minh xuất chúng nhưng thích trêu người bằng những câu nói đùa táo bạo.'],
 'Hare':['小鈎ハレ','Omagari Hare','Millennium',16,'19/4',153,'Chơi game, xem phim','Kaihara Reina','Thành viên Veritas, câu lạc bộ hacker Millennium. Trầm lặng, mê nước tăng lực.'],
 'Haruka':['伊草ハルカ','Igusa Haruka','Gehenna',15,'13/5',157,'Trồng cỏ dại','Ishitobi Erika','Thành viên Problem Solver 68. Nhút nhát, hay xin lỗi, nhưng sẵn sàng làm mọi thứ (kể cả nổ tung) vì Aru.'],
 'Haruna':['黒舘ハルナ','Kurodate Haruna','Gehenna',17,'1/3',163,'Tìm món ngon','Tadokoro Azusa','Hội trưởng Hội Nghiên cứu Ẩm thực Gehenna. Thanh lịch nhưng sẵn sàng cho nổ nhà hàng nào làm đồ ăn dở.']});
Object.assign(BIO,{
 'Hasumi':['羽川ハスミ','Hanekawa Hasumi','Trinity',17,'12/12',179,'Đọc sách, quan sát người khác','Seto Asami','Phó đội trưởng Đội Chính nghĩa Thực thi Trinity. Điềm tĩnh, là xạ thủ đáng tin, nhưng rất để ý chuyện cân nặng.'],
 'Hibiki':['猫塚ヒビキ','Nekozuka Hibiki','Millennium',15,'2/4',154,'Mua sắm, cosplay','Nazuka Kaori','Thành viên Câu lạc bộ Kỹ thuật Millennium. Kiệm lời, giỏi chế tạo vũ khí hạng nặng.'],
 'Hifumi':['阿慈谷ヒフミ','Ajitani Hifumi','Trinity',16,'27/11',158,'Sưu tầm đồ Peroro, đồ dễ thương, mua sắm, nghe tâm sự','Hondo Kaede','Trưởng Lớp Phụ đạo Trinity. Học sinh "bình thường", dễ mến, mê linh vật Peroro.'],
 'Hikari':['橘ヒカリ','Tachibana Hikari','Highlander',15,'14/6',147,'Học lái xe (biểu diễn), quan sát kiến','Iwami Manaka','Học sinh Highlander, chị em sinh đôi với Nozomi. Trầm tính hơn, hay bị Nozomi kéo vào rắc rối.'],
 'Himari':['明星ヒマリ','Akeboshi Himari','Millennium',17,'10/12',162,'Bói toán, huyền bí','Yukana','Hội trưởng Veritas, tự xưng "thiên tài thiếu nữ xinh đẹp". Ngồi xe lăn, là hacker hàng đầu Millennium.'],
 'Hina':['空崎ヒナ','Sorasaki Hina','Gehenna',17,'19/2',142,'Ngủ, nghỉ ngơi','Hirohashi Ryō','Trưởng Ban Kỷ luật Gehenna. Hay than "phiền quá" nhưng xử lý vi phạm và chiến đấu cực kỳ dứt khoát, được kẻ thù của Gehenna nể sợ.'],
 'Hinata':['若葉ヒナタ','Wakaba Hinata','Trinity',17,'17/5',166,'Cầu nguyện, dọn dẹp','Hidaka Rina','Thành viên Hội Sứ đồ (Sisterhood) Trinity. Sức mạnh phi thường, hay vô tình làm hỏng đồ.'],
 'Hiyori':['槌永ヒヨリ','Tsuchinaga Hiyori','Arius',16,'8/1',155,'Sưu tầm tạp chí','Nakahara Mai','Xạ thủ của Arius Squad. Bi quan, hay than số khổ.'],
 'Hoshino':['小鳥遊ホシノ','Takanashi Hoshino','Abydos',17,'2/1',145,'Ngủ trưa, lười biếng','Hanamori Yumiri','Phó hội trưởng (sau là hội trưởng) Hội học sinh Abydos, trưởng Đội Đối sách. Ra vẻ "ông già" lười nhác nhưng xông pha tuyến đầu để bảo vệ bạn bè.'],
 'Ibuki':['丹花イブキ','Tanga Ibuki','Gehenna',11,'14/4',128,'Làm bài tập, sưu tầm thú bông','Haruse Natsumi','Thành viên nhỏ tuổi nhất Pandemonium Society. Ngây thơ, được cả Gehenna cưng chiều.'],
 'Ichika':['仲正イチカ','Nakamasa Ichika','Trinity',16,'11/11',163,'Giúp đỡ mọi người, thử nhiều công việc','Sumi Tomomi Jiena','Thành viên Đội Chính nghĩa Thực thi Trinity. Thân thiện, nhưng đáng sợ khi nghiêm túc.'],
 'Iori':['銀鏡イオリ','Shiromi Iori','Gehenna',16,'8/11',157,'Đi tuần, quát mắng','Sakura Ayane','Chuyên gia chiến đấu của Ban Kỷ luật Gehenna. Mạnh và quyết liệt nhưng cứng đầu nên dễ dính bẫy.'],
 'Iroha':['棗イロハ','Natsume Iroha','Gehenna',16,'16/11',151,'Đọc sách, trốn học','Fukuen Misato','Sĩ quan Pandemonium Society, chỉ huy xe tăng Toramaru. Lười biếng nhưng đầu óc nhạy bén.'],
 'Izumi':['獅子堂イズミ','Shishidou Izumi','Gehenna',16,'11/5',161,'Nấu và ăn món kỳ lạ','Kubo Yurika','Thành viên Hội Nghiên cứu Ẩm thực Gehenna. Ăn được mọi thứ, kể cả những món không nên ăn.'],
 'Izuna':['久田イズナ','Kuda Izuna','Hyakkiyako',15,'16/12',155,'Học nhẫn thuật, hộ tống chủ nhân','Asumi Kana','Thành viên Câu lạc bộ Nghiên cứu Nhẫn thuật Hyakkiyako. Năng nổ, gọi Sensei là "chủ nhân".'],
 'Junko':['赤司ジュンコ','Akashi Junko','Gehenna',15,'27/12',149,'Đi ăn khắp nơi','Kanemoto Hisako','Thành viên Hội Nghiên cứu Ẩm thực Gehenna. Lúc nào cũng đói và dễ nổi cáu khi đói.'],
 'Juri':['牛牧ジュリ','Ushimaki Juri','Gehenna',15,'20/10',170,'Tự nghiên cứu nấu ăn','Tanabe Rui','Thành viên Bộ phận Bếp ăn Gehenna. Rất nhiệt tình nhưng món ăn hay biến thành thứ "sống động" khó tả.'],
 'Kaede':['勇美カエデ','Isami Kaede','Hyakkiyako',15,'9/7',142,'Nghịch ngợm (cố kiềm chế), bắt bọ cánh cứng','Kato Emiri','Thành viên nhỏ của Ban Tu luyện Hyakkiyako. Muốn trở thành người lớn đáng tin cậy.'],
 'Kaho':['桑上カホ','Kuwakami Kaho','Hyakkiyako',17,'9/10',173,'Quảng bá văn hóa Hyakkiyako, sưu tầm đồ lưu niệm','Matsui Eriko','Thư ký Hội Âm Dương Hyakkiyako. Lịch thiệp, tận tụy với văn hóa của trường.'],
 'Kanna':['尾刃カンナ','Ogata Kanna','Valkyrie',17,'7/9',166,'Đọc sách, xem phim trinh thám','Matsuoka Misato','Trưởng Cục An ninh Công cộng Valkyrie, biệt danh "Chó săn điên". Nghiêm khắc, cứng rắn nhưng có tinh thần trách nhiệm cao.'],
 'Kanoe':['板垣カノエ','Itagaki Kanoe','Wildhunt',17,'2/11',144,'Mơ mộng','Hyōsei','Học sinh Học viện Nghệ thuật Wildhunt.'],
 'Karin':['角楯カリン','Kakudate Karin','Millennium',16,'2/2',170,'Dọn dẹp','Numakura Manami','Xạ thủ bắn tỉa của C&C. Ít nói, nghiêm túc, hay lúng túng với đồ hầu gái.'],
 'Kasumi':['鬼怒川カスミ','Kinugawa Kasumi','Gehenna',16,'24/5',148,'Đánh bom, khai thác suối nước nóng','Uesaka Sumire','Thủ lĩnh Hội Phát triển Suối nước nóng Gehenna. Tự tin thái quá, đào bới khắp nơi để tìm suối nóng.'],
 'Kayoko':['鬼方カヨコ','Onikata Kayoko','Gehenna',18,'17/3',157,'Sưu tầm CD','Fujī Yukiyo','Trưởng phòng Problem Solver 68. Gương mặt lạnh lùng nhưng là người chín chắn và quan tâm đồng đội nhất nhóm.'],
 'Kazusa':['杏山カズサ','Kyoyama Kazusa','Trinity',15,'5/8',155,'Ăn đồ ngọt "bình thường"','Natsuyoshi Yuuko','Thành viên Hội Nghiên cứu Đồ ngọt Trinity. Từng là "Kyalyl" khét tiếng, giờ muốn sống như học sinh bình thường.'],
 'Kei':['天童ケイ','Tendou Kei','Millennium','??','25/3',152,'Chăm sóc Aris, thời trang, game (dù chối)','Tanaka Minami','Một trí tuệ gắn với Aris, nay có cơ thể riêng ở Millennium. Kiêu kỳ, hay chối nhưng rất quan tâm Aris.']});
Object.assign(BIO,{
 'Kirino':['中務キリノ','Nakatsukasa Kirino','Valkyrie',15,'22/10',161,'Vừa đi vừa ăn','Nakajima Yui','Cảnh sát tuần tra Valkyrie. Đầy chính nghĩa nhưng bắn rất tệ.'],
 'Kisaki':['竜華キサキ','Ryuuge Kisaki','Shanhaijing',17,'19/2',142,'Trà đạo, vi hành','Aisaka Yūka','Hội trưởng Ban Huyền Long (Hội học sinh) Shanhaijing. Uy nghi, thích lén đi dạo phố.'],
 'Koharu':['下江コハル','Shimoe Koharu','Trinity',15,'16/4',148,'Tưởng tượng, mơ mộng, sưu tầm tạp chí "người lớn"','Akao Hikaru','Thành viên Đội Chính nghĩa Thực thi, bị chuyển vào Lớp Phụ đạo Trinity. Hay hét "cấm dâm ô!" nhưng tự mình lại tò mò nhất.'],
 'Kokona':['春原ココナ','Sunohara Kokona','Shanhaijing',11,'1/6',139,'Đọc truyện tranh thiếu nhi','Igarashi Hiromi','Giáo viên nhỏ tuổi của Lớp Mai Hoa Shanhaijing. Rất muốn được đối xử như người lớn.'],
 'Konoka':['志真コノカ','Shima Konoka','Valkyrie',16,'19/8',165,'Ngồi ghế massage, giải ô chữ báo','Sembongi Sayaka','Cảnh sát Valkyrie.'],
 'Kotama':['音瀬コタマ','Otose Kotama','Millennium',17,'5/1',158,'Liên lạc vô tuyến, nghe lén','Takagawa Mina','Thành viên Veritas. Chuyên nghe lén, có thú vui khó nói.'],
 'Kotori':['豊見コトリ','Toyomi Kotori','Millennium',15,'31/12',151,'Nói chuyện','Shinohara Narumi','Thành viên Câu lạc bộ Kỹ thuật Millennium. Nói nhiều, thích giải thích mọi thứ.'],
 'Koyuki':['黒崎コユキ','Kurosaki Koyuki','Millennium',15,'14/2',149,'Cờ bạc, trốn thoát','Inui Natsune','Thành viên Seminar Millennium, giỏi giải mã. Ham chơi, hay bị Yuuka nhốt lại.'],
 'Kurumi':['高倉クルミ','Takakura Kurumi','SRT',17,'30/9',151,'Sưu tầm sticker, dọn dẹp','Tachibana Ichika','Học sinh Học viện Đặc nhiệm SRT.'],
 'Maki':['小塗マキ','Konuri Maki','Millennium',15,'1/8',149,'Vẽ graffiti, chơi game','Mikami Shiori','Thành viên Veritas. Mê vẽ graffiti lên mọi bức tường.'],
 'Makoto':['羽沼マコト','Hanuma Makoto','Gehenna',18,'19/3',169,'Mưu kế, chơi khăm, chơi với Ibuki','Asakawa Yuu','Chủ tịch Pandemonium Society (Hội học sinh) Gehenna. Ngạo mạn, luôn tìm cách hạ bệ Hina nhưng thường tự làm hỏng việc.'],
 'Mari':['伊落マリー','Iochi Mari','Trinity',15,'12/9',151,'Cầu nguyện, suy ngẫm','Ozawa Ari','Nữ tu tập sự của Hội Sứ đồ Trinity. Dịu dàng, tận tụy giúp đỡ mọi người.'],
 'Mashiro':['静山マシロ','Shizuyama Mashiro','Trinity',15,'5/6',155,'Leo lên chỗ cao, viết nhật ký quan sát','Kitō Akari','Xạ thủ của Đội Chính nghĩa Thực thi Trinity. Đầy nhiệt huyết với "chính nghĩa".'],
 'Megu':['下倉メグ','Shimokura Megu','Gehenna',17,'25/4',164,'Phá dỡ','Aihara Arisa','Thành viên Hội Phát triển Suối nước nóng Gehenna. Vui vẻ, cầm súng phun lửa.'],
 'Meru':['姫木メル','Himeki Meru','Red Winter',16,'21/12',137,'Vẽ manga, ghép cặp nhân vật','Arai Satomi','Học sinh Red Winter, thành viên câu lạc bộ vẽ manga.'],
 'Michiru':['千鳥ミチル','Chidori Michiru','Hyakkiyako',17,'22/2',153,'Sáng tạo nhẫn thuật mới, làm video','Mizuhashi Kaori','Hội trưởng Câu lạc bộ Nghiên cứu Nhẫn thuật Hyakkiyako. Mê ninja, thích quay video.'],
 'Midori':['才羽ミドリ','Saiba Midori','Millennium',15,'8/12',143,'Vẽ tranh','Takada Yūki','Thành viên Câu lạc bộ Phát triển Game, phụ trách vẽ minh họa. Chín chắn hơn cô chị song sinh Momoi.'],
 'Mika':['聖園ミカ','Misono Mika','Trinity',17,'8/5',157,'Tán gẫu, sưu tầm phụ kiện','Tōyama Nao','Một trong ba thủ lĩnh Trà Đoàn Trinity (phe Pater). Vô tư, nói thẳng, sức mạnh phi thường.'],
 'Mimori':['水羽ミモリ','Mizuha Mimori','Hyakkiyako',16,'15/3',156,'Truyện shoujo, việc nhà','Tanaka Rie','Thành viên Ban Tu luyện Hyakkiyako. Ra dáng "Yamato Nadeshiko", mơ về chuyện tình lãng mạn.'],
 'Mina':['近衛ミナ','Konoe Mina','Shanhaijing',16,'9/9',166,'Xem phim (hành động hard-boiled)','Sato Rina','Thành viên Ban Huyền Long Shanhaijing, cận vệ của Kisaki. Ít nói, hay bị hiểu lầm là đáng sợ.'],
 'Mine':['蒼森ミネ','Aomori Mine','Trinity',17,'23/11',168,'Sưu tầm dụng cụ y tế','Horie Yui','Đội trưởng Đội Cứu hộ Trinity. Nghiêm túc, cứu người bằng cách lao thẳng vào chiến trường.'],
 'Misaki':['戒野ミサキ','Imashino Misaki','Arius',16,'13/1',163,'Ở một mình','Tsuchiya Rio','Thành viên Arius Squad, dùng bệ phóng tên lửa. Trầm lặng, hay nghĩ tiêu cực.'],
 'Miyako':['月雪ミヤコ','Tsukiyuki Miyako','SRT',15,'7/1',156,'Xem video động vật','Fujita Akane','Đội trưởng Thỏ Đội (RABBIT) của SRT. Kỷ luật, gánh vác cả đội sau khi SRT bị đóng cửa.'],
 'Miyo':['桜井ミヨ','Sakurai Miyo','Wildhunt',16,'24/8',155,'Sưu tầm máy đánh chữ','Hanaiwa Kana','Học sinh Học viện Nghệ thuật Wildhunt.'],
 'Miyu':['霞沢ミユ','Kasumizawa Miyu','SRT',15,'12/7',149,'Suy nghĩ tiêu cực, trốn tránh, nhặt sỏi','Goto Yuko','Xạ thủ Thỏ Đội SRT. Rất nhút nhát, hay bị mọi người quên mất.'],
 'Moe':['風倉モエ','Kazekura Moe','SRT',15,'13/9',163,'Pháo hoa','Izawa Shiori','Thành viên Thỏ Đội SRT, phụ trách pháo binh. Mê những vụ nổ lớn.'],
 'Momiji':['秋泉モミジ','Akiizumi Momiji','Red Winter',15,'7/8',135,'Sưu tầm manga','Ōgame Asuka','Học sinh Red Winter, mê manga.'],
 'Momoi':['才羽モモイ','Saiba Momoi','Millennium',15,'8/12',143,'Chơi game','Tokui Sora','Thành viên Câu lạc bộ Phát triển Game, phụ trách kịch bản. Hiếu động, hay gây chuyện.']});
Object.assign(BIO,{
 'Mutsuki':['浅黄ムツキ','Asagi Mutsuki','Gehenna',16,'29/7',144,'Sưu tầm bom','Ōkubo Rumi','Phó giám đốc Problem Solver 68. Tinh nghịch, thích trêu chọc và ném bom.'],
 'Nagisa':['桐藤ナギサ','Kirifuji Nagisa','Trinity',17,'4/7',160,'Sưu tầm lá trà, làm bánh, chăm vườn','Hayami Saori','Chủ tịch đương nhiệm Trà Đoàn Trinity (phe Philius). Thanh lịch, gánh trọng trách nên hay đa nghi.'],
 'Nagusa':['御稜ナグサ','Goryou Nagusa','Hyakkiyako',17,'7/12',161,'Thiền, đọc sách','Sakura Kaoru','Học sinh Hyakkiyako, điềm tĩnh, thích thiền định.'],
 'Natsu':['柚鳥ナツ','Yutori Natsu','Trinity',15,'4/12',152,'Lãng mạn hóa suy nghĩ, chiêm nghiệm','Naganawa Maria','Thành viên Hội Nghiên cứu Đồ ngọt Trinity. Thích nói những câu triết lý về đồ ngọt.'],
 'Neru':['美甘ネル','Mikamo Neru','Millennium',17,'17/8',146,'Chiến thắng','Koshimizu Ami','Đội trưởng C&C, mật danh "Double 0". Nóng tính, thô lỗ, nhưng là chiến binh mạnh nhất Millennium.'],
 'Niko':['吉野ニコ','Yoshino Niko','SRT',17,'11/2',160,'Nấu ăn (nhất là inarizushi)','Asami Kazuki','Học sinh Học viện Đặc nhiệm SRT.'],
 'Noa':['生塩ノア','Ushio Noa','Millennium',16,'13/4',161,'Đọc sách, ngâm thơ','Suzushiro Sayumi','Thư ký Seminar Millennium. Trí nhớ siêu phàm, nụ cười bí ẩn, hay trêu Yuuka.'],
 'Nodoka':['天見ノドカ','Amami Nodoka','Red Winter',16,'20/2',147,'Thiên văn học','Satou Satomi','Học sinh Red Winter, sống ở khu tập thể và mê ngắm sao.'],
 'Nonomi':['十六夜ノノミ','Izayoi Nonomi','Abydos',16,'1/9',160,'Mua sắm','Miura Chiyuki','Thành viên Đội Đối sách Abydos. Dịu dàng, giàu có, luôn dùng súng máy.'],
 'Nozomi':['橘ノゾミ','Tachibana Nozomi','Highlander',15,'14/6',147,'Phá kỷ lục tốc độ','Hoshitani Mio','Học sinh Highlander, chị em sinh đôi với Hikari. Hiếu động, mê tốc độ.'],
 'Otogi':['天神山オトギ','Tenjinyama Otogi','SRT',17,'20/5',150,'Giải đố, mơ mộng','Sasaki Hitomi','Học sinh Học viện Đặc nhiệm SRT.'],
 'Pina':['朝比奈フィーナ','Asahina Pina','Hyakkiyako',17,'3/11',165,'Xem phim yakuza','Kido Ibuki','Học sinh Hyakkiyako, thích phim yakuza.'],
 'Rabu':['河駒風ラブ','Komakaze Rabu','Trinity',16,'6/5',161,'Đánh bóng mũ bảo hiểm, mò dưới máy bán hàng','Suzuki Hina','Học sinh Trinity.'],
 'Reijo':['鹿山レイジョ','Kayama Reijo','Shanhaijing',17,'3/3',169,'Luyện kung fu, ẩm thực','Suganuma Chisa','Học sinh Shanhaijing, võ sĩ kung fu.'],
 'Reisa':['宇沢レイサ','Uzawa Reisa','Trinity',15,'31/5',153,'Thách đấu, tự giới thiệu','Nemoto Miyari','Thành viên tự xưng của Đội Tự vệ Trinity. Rất nhiệt tình, luôn muốn thách đấu Kazusa.'],
 'Renge':['不破レンゲ','Fuwa Renge','Hyakkiyako',16,'23/7',157,'Đọc light novel, luyện tập','Koichi Makoto','Thành viên Ban Tu luyện Hyakkiyako. Nhiệt huyết, nói năng như nhân vật chính anime.'],
 'Rio':['調月リオ','Tsukatsuki Rio','Millennium',17,'6/6',171,'Thiết kế','Lynn','Hội trưởng Seminar Millennium. Lý trí đến lạnh lùng, sẵn sàng đưa ra quyết định khó vì lợi ích lớn.'],
 'Rumi':['朱城ルミ','Akeshiro Rumi','Shanhaijing',17,'5/3',168,'Nấu ăn, phát triển món mới','Aoyama Yoshino','Học sinh Shanhaijing, đam mê nấu ăn và phát triển món mới.'],
 'Saki':['空井サキ','Sorai Saki','SRT',15,'9/4',161,'Bảo dưỡng súng, hái cây cỏ…','Tomonaga Akane','Thành viên Thỏ Đội SRT. Kỷ luật kiểu quân đội, dễ nổi nóng.'],
 'Sakurako':['歌住サクラコ','Utazumi Sakurako','Trinity',17,'4/10',160,'Cầu nguyện','Kakuma Ai','Trưởng Hội Sứ đồ Trinity. Trang nghiêm, hay bị đồn đại vô căn cứ.'],
 'Saori':['錠前サオリ','Joumae Saori','Arius',17,'3/9',167,'Chưa có','Ishigami Shizuka','Đội trưởng Arius Squad. Lạnh lùng, được huấn luyện để chiến đấu, đang học cách sống bình thường.'],
 'Satsuki':['京極サツキ','Kyougoku Satsuki','Gehenna',17,'10/4',172,'Nghiên cứu thôi miên, mua sắm','Sakurai Harumi','Thành viên Pandemonium Society của Gehenna.'],
 'Saya':['薬子サヤ','Yakushi Saya','Shanhaijing',16,'3/1',149,'Nghiên cứu','Tamura Yukari','Thành viên Hội Luyện đan Shanhaijing. Tự xưng thiên tài, hay thử thuốc lạ.'],
 'Seia':['百合園セイア','Yurizono Seia','Trinity',17,'29/9',149,'Giải đố, đọc sách','Tanezaki Atsumi','Một trong ba thủ lĩnh Trà Đoàn Trinity (phe Sanctus). Có khả năng nhìn thấy tương lai, nói năng triết lý.'],
 'Sena':['氷室セナ','Himuro Sena','Gehenna',17,'7/4',155,'Túc trực, pha thuốc','Ōnishi Saori','Trưởng Bộ phận Y tế Khẩn cấp Gehenna. Lạnh lùng, hay gọi người bị thương là "thi thể".'],
 'Serika':['黒見セリカ','Kuromi Serika','Abydos',15,'25/6',153,'Tiết kiệm tiền, làm thêm','Ōhashi Ayaka','Thành viên Đội Đối sách Abydos. Hay cáu gắt (tsundere), làm thêm khắp nơi để trả nợ cho trường.'],
 'Serina':['鷲見セリナ','Sumi Serina','Trinity',16,'6/1',156,'Tình nguyện ở bệnh viện','Suzumoto Akiho','Thành viên Đội Cứu hộ Trinity. Dịu dàng, luôn xuất hiện đúng lúc có người bị thương.'],
 'Shigure':['間宵シグレ','Mayoi Shigure','Red Winter',16,'22/1',156,'Tự làm đồ uống','Kawase Maki','Học sinh Red Winter, mê nấu đồ uống tự chế.'],
 'Shimiko':['円堂シミコ','Endou Shimiko','Trinity',15,'30/11',157,'Đọc sách, làm bookmark','Tomita Miyu','Thành viên Ủy ban Thư viện Trinity. Mê sách, nói nhiều khi nhắc tới sách.']});
Object.assign(BIO,{
 'Shiroko':['砂狼シロコ','Sunaookami Shiroko','Abydos',16,'16/5',156,'Chạy bộ, tập thể lực, đạp xe','Ogura Yui','Thành viên Đội Đối sách Abydos. Ít biểu cảm, thể lực dồi dào, hay đề xuất… cướp ngân hàng để trả nợ cho trường.'],
 'Shiroko*Terror':['砂狼シロコ＊テラー','Sunaookami Shiroko＊Terror','Abydos',17,'16/5',165,'Chạy bộ, tập thể lực, đạp xe','Ogura Yui','Một Shiroko đến từ tương lai khác, nơi mọi thứ đã mất. Trầm mặc, mang sức mạnh của "Terror".'],
 'Shizuko':['河和シズコ','Kawawa Shizuko','Hyakkiyako',16,'7/7',153,'Tiếp khách bằng sự đáng yêu, kéo khách vào quán','Morinaga Chitose','Chủ tịch Hội Lễ hội Hyakkiyako, chủ quán trà. Trước khách thì ngọt ngào, sau lưng thì tính toán.'],
 'Shun':['春原シュン','Sunohara Shun','Shanhaijing','Bí mật','5/2',174,'Chơi với trẻ con','Itou Shizuka','Giáo viên Lớp Mai Hoa Shanhaijing, chị của Kokona. Hiền hậu, một lần uống thuốc lạ của Saya thì bị teo nhỏ.'],
 'Sumire':['乙花スミレ','Otohana Sumire','Millennium',16,'20/8',167,'Tập luyện, làm vườn','Imai Asami','Thành viên Câu lạc bộ Thể dục Millennium. Mê vận động, hay khiến người khác tập theo.'],
 'Suzumi':['守月スズミ','Morizuki Suzumi','Trinity',16,'31/8',162,'Đi tuần, dạo phố','Shamoto Haruka','Thành viên Đội Tự vệ Trinity. Nghiêm túc giữ trật tự đường phố.'],
 'Takane':['三善タカネ','Miyoshi Takane','Red Winter',16,'18/6',148,'Đọc sách, chụp ảnh, xem khúc côn cầu','Harumi Momo','Học sinh Red Winter.'],
 'Toki':['飛鳥馬トキ','Asuma Toki','Millennium',16,'16/8',165,'Đang tìm','Ishikawa Yui','Hầu gái riêng của Rio, thành viên C&C. Mặt không cảm xúc nhưng hay nói đùa tỉnh bơ.'],
 'Tomoe':['佐城トモエ','Sashiro Tomoe','Red Winter',17,'10/11',165,'Kích động quần chúng','Atsugi Nanami','Thư ký Hội học sinh Red Winter, người thực sự điều hành mọi việc sau lưng Cherino.'],
 'Tsubaki':['春日ツバキ','Kasuga Tsubaki','Hyakkiyako',16,'3/2',162,'Ngủ trưa','Shirasu Saho','Thành viên Ban Tu luyện Hyakkiyako. Cực kỳ dễ buồn ngủ, nhưng khi tỉnh thì là lá chắn vững chắc.'],
 'Tsukuyo':['大野ツクヨ','Ono Tsukuyo','Hyakkiyako',15,'5/4',180,'Thế thân thuật, trốn','Goto Ayasa','Thành viên Câu lạc bộ Nghiên cứu Nhẫn thuật. Cao lớn nhưng rất nhút nhát, giỏi ẩn mình.'],
 'Tsurugi':['剣先ツルギ','Kenzaki Tsurugi','Trinity',17,'24/6',162,'Xem phim, đọc tiểu thuyết lãng mạn','Kobayashi Yū','Đội trưởng Đội Chính nghĩa Thực thi Trinity. Chiến đấu như quái vật, nhưng bên trong là cô gái mơ mộng chuyện tình yêu.'],
 'Ui':['古関ウイ','Kozeki Ui','Trinity',17,'23/4',165,'Đọc sách, quản lý và nghiên cứu sách cổ','Goto Saori','Trưởng Hội Lưu trữ Sách cổ Trinity. Sống khép kín trong thư viện, rất quý sách.'],
 'Umika':['里浜ウミカ','Satohama Umika','Hyakkiyako',15,'1/7',165,'Đi lễ hội, sưu tầm tờ rơi lễ hội','Nitta Hiyori','Thành viên Hội Lễ hội Hyakkiyako.'],
 'Utaha':['白石ウタハ','Shiraishi Utaha','Millennium',17,'13/11',162,'Phát minh và sửa chữa','Aochi Nozomi','Hội trưởng Câu lạc bộ Kỹ thuật Millennium. Tự tin vào phát minh của mình, dù chúng hay nổ.'],
 'Wakamo':['狐坂ワカモ','Kosaka Wakamo','Hyakkiyako',18,'3/4',161,'Phá hoại, cướp bóc','Saito Chiwa','"Tai họa Thất Tù" bị truy nã, đã vượt ngục. Nguy hiểm và thích phá hoại, nhưng lại si mê Sensei.'],
 'Yoshimi':['伊原木ヨシミ','Ibaragi Yoshimi','Trinity',15,'29/8',146,'Đủ loại sự kiện, đi quán cà phê săn bánh giới hạn','Mano Ayumi','Thành viên Hội Nghiên cứu Đồ ngọt Trinity. Tự tin, hay bày trò.'],
 'Yukari':['勘解由小路ユカリ','Kadenokouji Yukari','Hyakkiyako',15,'16/6',155,'Cầu nguyện, ghé tiệm kẹo','Murakami Manatsu','Thành viên Ban Tu luyện Hyakkiyako, xuất thân gia đình danh giá. Ngây thơ, cách nói chuyện cổ kính.'],
 'Yuuka':['早瀬ユウカ','Hayase Yuuka','Millennium',16,'14/3',156,'Tính toán','Haruka Ran','Kế toán của Seminar Millennium. Giỏi toán, hay càu nhàu chuyện chi tiêu của Sensei.'],
 'Yuzu':['花岡ユズ','Hanaoka Yuzu','Millennium',16,'12/8',150,'Làm game','Terasawa Momoka','Hội trưởng Câu lạc bộ Phát triển Game. Cực kỳ nhút nhát, hay trốn trong tủ đồ, nhưng là thiên tài làm game.']});
//BIO-END
const bioOf=n=>BIO[n]||BIO[n.replace(/\s*\(.*\)$/,'')];
function bioHTML(n){const b=bioOf(n);if(!b)return '';const [jp,rd,sc,age,bd,h,hob,cv,txt]=b;
 return `<div class="gbio"><h5>Hồ sơ học sinh</h5><div class="bgrid"><span><i>Họ tên</i>${rd} <small>${jp}</small></span><span><i>Trường</i>${sc}</span>
  <span><i>Tuổi</i>${typeof age==='number'?age+' tuổi':age}</span><span><i>Sinh nhật</i>${bd}</span><span><i>Chiều cao</i>${typeof h==='number'?h+' cm':h}</span>
  <span><i>Lồng tiếng</i>${cv}</span><span class="w"><i>Sở thích</i>${hob}</span></div>${txt?`<p class="btxt">${txt}</p>`:''}
  <p class="bsrc">Thông số: Blue Archive Wiki. Đoạn giới thiệu tóm lược hồ sơ học sinh trong game.</p></div>`;}
// armor each student wears (Blue Archive Wiki); the card text describes what they hit
const ARMC={light:['ar-light','Light'],heavy:['ar-heavy','Heavy'],special:['ar-special','Special'],elastic:['ar-elastic','Elastic'],composite:['ar-comp','Composite']};
const ARM={'Hina (Dress)':'elastic','Hanako (Swimsuit)':'heavy','Neru (School)':'elastic','Hoshino (Armed)':'heavy','Hoshino (Swimsuit)':'special',
 'Mika (Swimsuit)':'special','Aris (Armed)':'composite','Kei':'composite','Mari (Pop Idol)':'heavy','Kisaki':'elastic','Rio':'elastic',
 'Nagisa (Swimsuit)':'elastic','Himari (Armed)':'elastic','Shiroko (Swimsuit)':'light','Michiru (Dress)':'light','Iroha (Swimsuit)':'special',
 'Ibuki (Swimsuit)':'special','Mika':'light','Shiroko*Terror':'special','Wakamo':'light','Kokona':'special','Hikari':'light',
 'Satsuki (Swimsuit)':'elastic','Fuuka (New Year)':'special','Hare (Camp)':'light','Kayoko (New Year)':'special','Aru (Dress)':'heavy',
 'Seia':'elastic','Seia (Swimsuit)':'special','Suzumi (Magical)':'special','Himari':'light','Ako':'heavy','Reisa (Magical)':'special'};
const armOf=n=>ARM[n]||(STAT[n]&&ARMK[STAT[n].m]);
const armChip=n=>armOf(n)?`<span class="own">Mặc</span><span class="ar ${ARMC[armOf(n)][0]}">${ARMC[armOf(n)][1]}</span>`:'';

// boss each student is especially good at
const BK={
 'Hina (Dress)':'Kaiten · Hieronymus · Gregorius · Nightmare Express','Hanako (Swimsuit)':'Yesod (phá đèn) · Kurokage',
 'Neru (School)':'Binah · Hod · Hovercraft','Mika':'Binah · Hod · Chesed',
 'Hoshino (Armed)':'Perorodzilla ngoài trời · Gregorius (tank) · Kurokage · Shiro & Kuro (vật cản)','Hoshino (Swimsuit)':'Kaiten · Hieronymus · Gregorius · Yesod',
 'Mika (Swimsuit)':'Yesod (phá đèn)','Aris (Armed)':'Goz · Drum Crab · Shiro & Kuro','Kei':'Goz · Drum Crab · Perorodzilla',
 'Mari (Pop Idol)':'Hieronymus (thánh vật) · Geburah (máy sưởi) · Kurokage (overheal) · Perorodzilla (giải debuff)','Kokona':'Hieronymus · Kurokage','Satsuki (Swimsuit)':'Hieronymus',
 'Kisaki':'Mọi raid','Rio':'Mọi raid','Nagisa (Swimsuit)':'Goz · Drum Crab · Yesod · Perorodzilla',
 'Shiroko (Swimsuit)':'Geburah (DPS Special) · Shiro & Kuro · Goz','Michiru (Dress)':'Shiro & Kuro · Goz','Iroha (Swimsuit)':'Hieronymus',
 'Wakamo':'Shiro & Kuro (DPS chính)','Shiroko*Terror':'Shiro & Kuro · Goz','Fuuka (New Year)':'Gregorius · Hieronymus',
 'Kayoko (New Year)':'Goz · Shiro & Kuro · Perorodzilla','Hare (Camp)':'Kaiten · Hieronymus · Hod','Seia (Swimsuit)':'Drum Crab · Goz · Perorodzilla',
 'Seia':'Binah · Chesed · Hod','Suzumi (Magical)':'Yesod phase 2 · Goz',
 'Aru (Dress)':'Chesed · Shiro & Kuro · Perorodzilla','Ako':'Kaiten · Hod · Perorodzilla','Himari':'Shiro & Kuro',
 'Yuuka (Track)':'Goz (né tàu) · Geburah (di chuyển) · Shiro & Kuro (né Kuro)','Makoto (Swimsuit)':'Perorodzilla trong nhà',
 'Kanoe':'Perorodzilla (giải debuff)','Natsu':'Perorodzilla (giải debuff)','Sakurako (Pop Idol)':'Geburah · Gregorius',
 'Sena (Casual)':'Kurokage (overheal)','Atsuko':'Kurokage (overheal)','Koharu':'Kurokage (overheal)','Haruka (Dress)':'Drum Crab',
 'Tsubaki':'Hod (CC) · Yesod (CC)','Kayoko':'Yesod (CC)','Noa':'Yesod (tập hỏa)','Miyo':'Yesod','Nozomi':'Tiphareth',
 'Eimi (Swimsuit)':'Shiro (né Kuro)','Eimi':'Drum Crab (tank)','Mimori':'Geburah (di chuyển)','Kirino (Swimsuit)':'Shiro (vật cản)',
 'Mine':'Gregorius (tank)','Mine (Pop Idol)':'Geburah (di chuyển)','Asuna (School)':'Geburah','Niko':'Drum Crab (giải debuff)',
 'Erika':'Drum Crab (giải debuff)','Mari':'Drum Crab (giải debuff)','Cherino':'Chesed','Kotama (Camp)':'Hod','Kanna (Swimsuit)':'Binah',
 'Hina':'Kurokage (AoE giáp Light)','Shun':'Binah'};
const BOSS_KEYS=['Binah','Chesed','Hod','Hovercraft','Kaiten','Hieronymus','Gregorius','Geburah','Nightmare','Shiro','Perorodzilla','Goz','Kurokage','Yesod','Drum','Set'];
const bkLinks=s=>s.split(' · ').map(p=>{const k=p.trim().split(' ')[0];
 return BOSS_KEYS.includes(k)?`<a class="bl" data-k="${k}" title="Xem boss ${k}">${p}</a>`:p}).join(' · ');
const bkLine=n=>BK[n]?`<div class="bk">🎯 ${bkLinks(BK[n])}</div>`:'';
function cards(id,arr){document.getElementById(id).innerHTML=arr.map(([n,u,slot,t,d])=>{const T=TYPE[t];
 return `<div class="sc" data-n="${n.toLowerCase()}" style="--c:${T[2]}">${porImg(n,'pbg')}<div class="n">${avImg(n,'av-c')}<span>${n}</span></div><div class="row">${ueChip(u)}<span class="tag ${T[0]}">${T[1]}</span><span class="slot">${slot}</span>${armChip(n)}</div><div class="d">${d}</div>${bkLine(n)}</div>`}).join('');}
function chips(id,arr){document.getElementById(id).innerHTML=arr.map(([n,u])=>`<span class="chip" data-n="${n.toLowerCase()}">${avImg(n,'av-s')}${n}${ueChip(u)}${BK[n]?`<span class="bk2">🎯 ${bkLinks(BK[n])}</span>`:''}</span>`).join('');}
// student list as a grid of cards (like the in-game Student List): avatar, UE stars, ammo corner, Striker/Special badge
const TIERROW={};[SSP,SS].forEach(g=>g.forEach(x=>TIERROW[x[0]]=x));
function gridCards(id,arr){const el=document.getElementById(id);el.className='sgrid';
 el.innerHTML=arr.map(([n,u,slot,t])=>{const st=STAT[n];if(st){t=t||st.a;slot=slot||(st.k?'Striker':'Special');}const T=t?TYPE[t]:null;
  return `<div class="scard" data-n="${n.toLowerCase()}"${st?` data-r="${st.r}${st.r2||''}" data-a="${st.a}" data-m="${st.m}" data-k="${st.k?1:0}" data-p="${st.p||''}"`:''}${T?` style="--c:${T[2]}"`:''}><div class="ph">${avImg(n,'')}${slot?`<span class="sl${slot==='Special'?' sp':''}">${slot==='Special'?'SPECIAL':'STRIKER'}</span>`:''}<span class="us">${u?'★'.repeat(u):'<span class="no">Chưa UE</span>'}</span>${T?`<span class="am ai ${T[0]}" title="${T[1]}"></span>`:''}</div><b>${n}</b></div>`}).join('');}
gridCards('ssp',SSP);gridCards('ss',SS);gridCards('s',S);gridCards('a',A);gridCards('bc',BC);
// tier headers count what is really listed (the Roster screen can remove students)
document.querySelectorAll('#tier .tier-badge small').forEach((s,i)=>s.textContent=[SSP,SS,S,A,BC][i].length+' em');
document.querySelector('footer').insertAdjacentHTML('afterbegin',`<div class="fcast">${SSP.map(x=>avImg(x[0],'')).join('')}</div>`);

// bosses
const AR={light:['ar-light','Giáp Light','t-exp','Explosive','var(--exp)'],heavy:['ar-heavy','Giáp Heavy','t-pie','Piercing','var(--pie)'],
 special:['ar-special','Giáp Special','t-mys','Mystic','var(--mys)'],elastic:['ar-elastic','Giáp Elastic','t-son','Sonic','var(--son)']};
AR.composite=['ar-comp','Giáp Composite','t-cor','Corrosive','var(--cor)'];
const ATK={E:['t-exp','Explosive'],P:['t-pie','Piercing'],M:['t-mys','Mystic']};
// armor that takes only 50% from each boss attack type
const RES={E:['special','elastic'],P:['light'],M:['heavy','composite']};
const DIFF=['','Dễ','Hơi dễ','Trung bình','Hơi khó','Khó','Rất khó','Cực khó'];
const OWN={};[SSP,SS,S,A,BC].forEach(g=>g.forEach(x=>OWN[x[0]]=x[1]));
// student chip; data-stu = the exact name, so a click anywhere on it opens the right profile (reading the chip's text failed:
// the UE badge right after the name, "KokonaUE2", broke the name match)
const nm=n=>n in OWN?`<span class="chip" data-stu="${n}">${avImg(n,'av-s')}${n}${ueChip(OWN[n])}</span>`:`<span class="chip no" data-stu="${n}">${avImg(n,'av-s')}${n}<span class="ue u0">chưa có · mượn</span></span>`;
const MX={must:'Bắt buộc',warn:'Cẩn thận',tip:'Mẹo'};
const BOSSES3=[
 {n:'Binah',a:['heavy'],atk:'P',t:'Đô thị · Ngoài trời',d:1,time:'3:00',
  ph:'3 phase. Dưới ~60% HP Binah chui xuống đất, cả đội phải đổi chỗ đuổi theo; dưới ~20% HP vào phase cuối.',
  sk:[['must','Fires of Severity · 大道の劫火','Đánh cả đội, rồi dồn đòn rất nặng lên <b>4 Striker đứng gần Binah nhất</b> (Insane+: <b>750% / 300% / 300% / 150% ATK</b>, gần nhất nhận nặng nhất). Summon và Tactical Support <b>không đỡ hộ được</b>.','Canh thanh choáng (groggy) để <b>làm boss choáng đúng lúc và ngắt skill</b>. Torment nên mang tank hoặc healer.'],
      ['must','Purifying Storm · 浄化の嵐','Chỉ dùng ở phase 3 khi đầy ATG: <b>300% ATK cả đội và −50% DEF trong 30 giây</b>. Torment+ ATG tăng chậm từ phase 1–2 (reset khi sang phase 3).','Không chặn được; <b>chỉ ngắt bằng cách làm đầy thanh choáng</b> trước khi ATG đầy.'],
      ['warn','Atsilut’s Light · アツィルトの光','Laser đường thẳng 120% ATK. Torment: 160% và để lại <b>vùng cháy 15 giây</b>.','Cho tank đứng đầu để hứng; <b>từ Torment bắt buộc mang tank</b> (Eimi, Haruka, Mine).'],
      ['tip','Heavy Sandstorm · 吹き荒れる砂塵 (Insane+)','Học sinh nấp sau vật cản chỉ nhận 50% damage nhưng <b>không né được</b>. Torment+: boss <b>miễn giảm tốc đánh</b>.','Đừng mang debuff giảm tốc đánh; dồn vào giảm DEF.'],
      ['must','DEF rất cao (5.000–7.200)','Đánh không giảm DEF thì damage rất thấp.','<b>Bắt buộc có giảm DEF</b>: Kanna (Swimsuit) tới 47,8%, Noa 40,5%, Shiroko (Swimsuit) 34,2%.']],
  k:['Neru (School)','Mika','Seia','Kanna (Swimsuit)'],
  team:['Kamigame, ngoài trời',['Mika','Kanna (Swimsuit)','Shun','Seia'],['Kisaki','Rio']],op:['Kanna (Swimsuit)','Kisaki','Mika','Rio']},
 {n:'Chesed',a:['heavy'],atk:'E',t:'Ngoài trời · Trong nhà',d:3,time:'4:00',
  ph:'Phase 1 đánh qua các đợt lính giáp Heavy để tới phòng boss; phase 2 đánh lính bảo vệ lõi của Chesed.',
  sk:[['must','Exposed Throne · 剥き出し玉座','Lõi đóng: boss giảm damage nhận rất mạnh và <b>miễn mọi hiệu ứng tăng damage nhận</b>. Diệt đủ <b>4 đợt lính → lõi mở 20 giây, nhận thêm 900% damage</b>.','Giữ EX của DPS đơn mục tiêu cho 20 giây lõi mở. <b>Tiến độ mở lõi giữ nguyên khi đổi đội</b>: đội 1 dọn lính tới ~90%, đội 2 vào mở lõi rồi xả.'],
      ['warn','Call of the Throne · 玉座への喚び声は此処にありて','Gọi lính máy; lính sống quá 20 giây là <b>tự nổ 3.000% ATK</b>. ATG boss tăng khi còn lính, reset khi dọn hết. Insane+: mỗi lính chết sinh thêm 1 sweeper.','Dọn bằng AoE thật nhanh (Hanako (Swimsuit) rất hợp).'],
      ['warn','Witness My Supreme Powers · 至高の権能を目撃せよ','ATG đầy một nửa: lính còn sống <b>+50% ATK và tốc chạy trong 60 giây</b>.','<b>Ngắt được bằng CC</b> (taunt của Tsubaki).'],
      ['must','Majesty’s Mercy · 王は慈悲を施すものなり','ATG đầy: <b>2.000% ATK cả đội</b>.','Dọn sạch lính để reset ATG trước khi đầy.'],
      ['tip','Tháp súng cố định & Goliath','Tháp súng <b>bỏ qua tank, bắn thẳng hàng sau</b>; Goliath gồng AoE mạnh nếu để sống lâu.','Taunt của Tsubaki ngắt được đòn Goliath (lính nhỏ tự nổ thì không ngắt được).']],
  k:['Mika','Neru (School)','Cherino'],
  team:['Kamigame, cả 2 địa hình',['Seia','Mika','Aru (Dress)','Cherino'],['Kisaki','Rio']],op:['Kisaki','Aru (Dress)','Mika','Rio']},
 {n:'Hod',a:['heavy'],atk:'M',t:'Đô thị · Trong nhà',d:4,time:'4:00',
  ph:'Phase 1 phá Invader Pillar 2 lần để tới boss; phase 2 đánh Hod cùng 1 cột mới. Boss và cột giảm damage nhận rất cao.',
  sk:[['must','Thanh CC (vòng tròn cạnh thanh máu)','Mọi CC (taunt, choáng, sợ hãi) <b>cộng dồn thời gian</b> vào thanh. Đầy → boss nhận thêm damage 30 giây, <b>+25% thanh choáng và giảm ATG</b>. Cần 10 giây CC ở Extreme, <b>15 giây ở Insane</b>, 20 giây ở Lunatic. Từ Insane, chỉ số CC Power cũng được tính.','Mang CC mạnh: <b>Kotama (Camp)</b> (11,5 giây; UE40 lên 20 giây), Kayoko (EX 10 giây), Tsubaki.'],
      ['must','Radiance of Glory (ATG)','Đầy 3 ô ATG: đánh cả đội rồi <b>boss +50% ATK vĩnh viễn</b> tới hết trận.','Liên tục làm đầy thanh CC để kéo ATG xuống. Đầy CC 4 lần → <b>boss choáng 20 giây</b>.'],
      ['warn','Invader Pillar · vùng xâm thực','Đứng trong vùng xanh bị <b>giảm hồi cost</b>; vùng lan dần và <b>chiếm luôn tháp súng của bạn để bắn lại</b>.','CC lên cột để thu nhỏ vùng; phá cột cũng nạp thanh choáng.'],
      ['tip','Chặn triệu hồi cột','Hod triệu cột mới khoảng 1 phút sau khi cột cũ vỡ.','Làm đầy thanh choáng <b>đúng lúc boss đang triệu cột</b> → cả trận không còn cột.'],
      ['tip','Crit RES cao, HP thấp','DPS thường rất khó chí mạng.','Mika (luôn chí mạng) và Neru (School) là DPS chính.']],
  k:['Neru (School)','Mika','Kotama (Camp)','Tsubaki'],
  team:['Kamigame, đô thị',['Seia','Neru (School)','Hare (Camp)','Kotama (Camp)'],['Kisaki','Ako']],op:['Kotama (Camp)','Hare (Camp)','Kisaki','Neru (School)','Ako']},
 {n:'Hovercraft',a:['heavy'],atk:'P',t:'Ngoài trời',d:3,time:'4:00',
  ph:'Phase 1 đánh Wakamo (Swimsuit), phase 2 đánh tàu đệm khí. Cả 2 phase boss giảm 75% damage nhận.',
  sk:[['must','Dấu của Wakamo · Eliminate Disturbers','Mỗi EX của Wakamo khắc <b>2 dấu</b> lên người trúng; <b>đủ 5 dấu là rút lui ngay</b>, xuyên cả khiên và bất tử.','Làm Wakamo choáng để xóa toàn bộ dấu; xoay vị trí để dấu không dồn vào 1 người.'],
      ['must','Just for You','Wakamo miễn CC nhưng <b>tích thời gian CC</b> (Insane: 10 / 14 / 18 giây). Đầy → choáng (tối đa 3 lần), xóa dấu, boss +25/50/75% ATK nhưng <b>nhận thêm 100/200/300% damage</b>.','Mang CC (nhân theo CC Power); canh choáng vừa để sống vừa để xả.'],
      ['tip','Howitzer','Tên lửa nhắm <b>người đứng xa nhất</b>, bị chặn bởi học sinh, summon hoặc vật cản.','Đặt summon hoặc vật cản trước hàng sau.'],
      ['must','If It Comes to This...! (phase 2)','Tàu vào chế độ tên lửa nhắm khu nghỉ dưỡng: còn <b>5 máu (Insane) / 4 (Torment)</b>, mất hết là <b>thua ngay</b>. Tên lửa chỉ trúng bằng EX hoặc AoE.','Phá Missile Guidance System (damage truyền 100% sang tàu, <b>+50% thanh choáng</b>). Từ Insane, hệ thống đánh chặn bắt đầu ở 0 HP: <b>phải hồi máu cho nó</b> thì nó mới tự bắn tên lửa.'],
      ['tip','Surprise Landing Operation','Cứ 15 hit trúng tàu: <b>+10% damage nhận</b> (10 giây, tối đa 30 lần).','Ưu tiên DPS bắn nhiều hit.']],
  k:['Neru (School)','Mika']},
 {n:'Kaiten FX Mk.0',a:['light'],atk:'P',t:'Đô thị · Ngoài trời',d:3,time:'3:00',
  ph:'Phase 1: 5 Kaitenger dùng chung 1 thanh máu (cần AoE). Phase 2: robot KAITEN FX Mk.0 (cần đơn mục tiêu).',
  sk:[['must','Kaitenger Đỏ','Cứ 20 giây <b>khiêu khích (taunt) mọi Striker 10 giây</b>: không dùng được EX, đang ra chiêu thì bị hủy.','Taunt của Tsubaki ngắt được; canh EX ngoài nhịp 20 giây.'],
      ['tip','Kaitenger Đen / Xanh lá / Vàng / Hồng','Đen: 300% + người trúng <b>nhận thêm 50% damage 5 giây</b>. Xanh lá: quét hình quạt 400%. Vàng: bắn tỉa 500%. Hồng: buff ATK cả nhóm 15 giây.','Marina hoặc Yakumo đẩy gom Kaitenger để EX AoE trúng nhiều con.'],
      ['must','Ultra Cap Shield (phase 2)','Khiên giảm mạnh damage nhận; <b>chỉ vỡ khi trúng EX đủ nhiều hit</b> (≥10 hit; Torment+ ≥15).','Neru (60 hit, 2 cost), Shiroko (10 hit), Marina (20 hit), Nagisa (20 hit).'],
      ['warn','Aura & Hyper Sardine Missiles','Aura đổi màu mỗi 20 giây (vòng dưới chân robot). Bắn tên lửa khi <b>aura đỏ là choáng cả đội</b>.','Nhìn màu aura để canh EX.'],
      ['must','Final Mackerel Slash (ATG)','ATG đầy <b>đúng sau 1 phút</b> và luôn dùng chiêu này. Lunatic bỏ qua khiên.','Chuẩn bị khiên, hồi máu trước mốc 1 phút.'],
      ['tip','Phá bộ phận để làm choáng','Robot chỉ choáng khi <b>phá bộ phận đang phát sáng</b> (Insane 3,5 triệu, Torment 11 triệu damage): choáng 10 giây và <b>mất luôn skill của bộ phận đó</b> tới hết trận.','Dồn damage vào bộ phận đang active.']],
  k:['Hina (Dress)','Hoshino (Swimsuit)','Hare (Camp)'],
  team:['Kamigame',['Hina (Dress)','Hoshino (Swimsuit)','Hare (Camp)','Marina'],['Kisaki','Ako']],op:['Marina','Hoshino (Swimsuit)','Kisaki','Hina (Dress)']},
 {n:'Hieronymus',a:['light'],atk:'E',t:'Đô thị · Trong nhà',d:4,time:'4:00',
  ph:'Phase 1 (trên 50% HP) boss không tăng ATG; phase 2 ATG tăng đều. DEF cao và giảm damage nhận tự nhiên.',
  sk:[['must','Thánh vật xanh · 聖なる光','Thánh vật bắt đầu ở 5% máu và bị đòn boss đánh trúng. Hồi đầy 100% → <b>Hieronymus nhận thêm 55% damage tới hết trận</b> (cộng dồn tối đa 5 lần). Sau mỗi lần bật, lượng hồi lên thánh vật giảm 50% trong 20 giây.','Mang healer đơn mục tiêu mạnh: Kokona, Mari (Pop Idol), Koharu. <b>Đổi đội là mất hết stack.</b>'],
      ['warn','Vulgata · ウルガータ','Nguyền 1 người: mất máu liên tục, <b>10 giây sau nổ 325% ATK</b> vùng tròn.','<b>Hồi người đó lên 100% máu</b> là giải nguyền.'],
      ['must','Desert Penance · 砂漠の苦痛','40% ATK cả đội mỗi 10 giây. ATG đầy (khoảng <b>110 giây sau khi vào phase 2</b>) → damage bằng <b>1.000% max HP mỗi người = xóa đội</b>.','Dưới Insane: thánh vật đỏ hủy được đòn này. <b>Từ Insane không còn thánh vật đỏ</b>, đây là đồng hồ đếm ngược: phải giết kịp.'],
      ['must','Thánh vật tím · Ominous Light (Insane+)','Chỉ EX đánh được; 40.000 HP (Torment 60.000). Phá xong: <b>cả đội +25% ATK</b> (Torment thêm +25% damage), <b>boss −1.500 DEF</b>, đổi lại Striker bị −7.000 lượng hồi. Người bị nguyền được bù hồi nên vẫn giải nguyền được.','<b>Phá sớm bằng EX.</b> Torment vẫn cần thêm giảm DEF, vì boss chỉ mất khoảng 20% DEF.'],
      ['tip','Thánh vật đỏ (dưới Insane)','Hồi đầy ở phase 2: <b>ngắt skill boss đang dùng</b>, boss choáng, 4 học sinh được bơm cost.','']],
  k:['Mari (Pop Idol)','Kokona','Satsuki (Swimsuit)','Hina (Dress)'],
  team:['Game8, Grand Assault Insane',['Mari (Pop Idol)','Hoshino (Swimsuit)','Hina (Dress)','Hare (Camp)'],['Fuuka (New Year)','Kisaki']],op:['Hoshino (Swimsuit)','Fuuka (New Year)','Kisaki','Hina (Dress)','Hare (Camp)']},
 {n:'Gregorius',a:['light'],atk:'M',t:'Trong nhà',d:5,time:'4:00',
  ph:'Cả trận chạy theo kịch bản cố định. Mấu chốt là giữ đúng số debuff trên boss.',
  sk:[['must','Bộ đếm debuff · 聖者のしもべのしもべ','Số debuff trên boss quyết định trạng thái (Insane): <b>5–6 debuff = An toàn, boss nhận +200% damage</b>; 3–4 hoặc 7–8 = Cảnh báo (+100% damage nhận, boss +20% ATK); <b>0–2 hoặc từ 9 trở lên = Nguy hiểm (boss +40% ATK)</b>. Extreme trở xuống: an toàn ở 4–5.','<b>Không phải càng nhiều debuff càng tốt</b>: giữ đúng 5–6. Mine (4 debuff), Saki (Swimsuit) (3), Mina (3).'],
      ['warn','Solemn Repentance · 厳粛なる悔悟','Boss đang ≤5 debuff: <b>xóa 1 debuff khỏi boss và cả dàn hợp xướng</b>. Từ 6 debuff trở lên: cả đội bạn −10% ATK 120 giây.','Bù debuff ngay sau đòn này (ví dụ tung EX của Reisa ngay trước lúc đòn đánh trúng).'],
      ['must','Whispers of the Saint · 聖者の囁き','<b>500% ATK cả đội, luôn chí mạng</b>, và −40% ATK 120 giây.','Đây là lý do DPS slot Special mạnh hơn. <b>Mari (Pop Idol) hồi vượt máu</b> giúp sống qua đòn này.'],
      ['tip','Organ trung tâm & Gregorius Chant','Organ chỉ nhận damage từ EX; tụt dưới 1% máu thì <b>xoay 180°</b> rồi bất tử 30 giây. Bài thánh ca luân phiên theo hướng ống đen/trắng: phe bị chiếu nhận +50% damage 60 giây, hoặc được xóa 1 debuff.','Xoay organ sao cho phe boss nhận +50% damage còn đội bạn được xóa debuff.'],
      ['tip','Dàn hợp xướng · Sanctus','Hợp xướng nhận chung debuff với boss và <b>truyền 100% damage sang boss</b>. Hạ 1 thành viên: +5% thanh choáng. Hợp xướng hai bên +100% ATK sau 40 giây; nửa sau trận chúng đứng cạnh boss, tốc đánh tăng 10% mỗi 10 giây.','AoE quét cả cụm. Game8: <b>không lấy được choáng thì nên chơi lại</b>.'],
      ['warn','Salvation for Everyone · 万人の救恤','<b>999.999 damage cả đội</b>, xuyên bất tử.','Đồng hồ cuối trận: phải giết trước.']],
  k:['Hina (Dress)','Hoshino (Armed)','Mine','Fuuka (New Year)'],
  team:['Game8, Torment',['Hoshino (Swimsuit)','Hoshino (Armed)','Hina (Dress)','Mine'],['Fuuka (New Year)','Kisaki']],op:['Mine','Hoshino (Swimsuit)','Fuuka (New Year)','Kisaki','Hina (Dress)'],
  s:'Game8 chạy Hina (Dress) và Hoshino (Armed) ở UE 4★; Mine chỉ cần 4★.'},
 {n:'Geburah',a:['light'],atk:'M',t:'Ngoài trời',d:6,time:'4:00',
  ph:'Dưới 60% HP đổi địa hình (cột băng vỡ). Cả trận chỉ choáng được 1 lần.',
  sk:[['must','Source of Intelligence · 知性の根源','Học sinh Special <b>+80% damage</b>; Striker, Tactical Support và summon <b>−75% damage</b>; cả đội +25% hồi cost.','<b>DPS đặt ở slot Special</b>; Striker chỉ để tank, heal, buff.'],
      ['must','Máy sưởi · ラジエーター稼動','Công suất bằng máu máy sưởi, tụt dần theo thời gian. <b>Từ 30% trở lên</b>: hồi máu cả đội mỗi 6 giây (trên 70% hồi nhiều hơn) và cả đội giảm 25% damage nhận. <b>Chỉ hồi được bằng EX</b>, không nhận khiên.','Giữ trên 30% bằng EX hồi máu: <b>Mari (Pop Idol) hồi vượt</b> giữ được 100% lâu hơn; Kokona, Koharu.'],
      ['tip','Quá tải · ラジエーター過負荷','Đạt 100%: cả đội <b>+500 hồi cost, +30% ATK, +60% Crit DMG</b>; đổi lại công suất tụt càng lúc càng nhanh, dưới 30% là mất trạng thái.','Canh xả EX của DPS lúc quá tải.'],
      ['warn','Cột băng · 審判の柱','Mọc ra sau Hell and High Water: khiên bằng 400% máu trong 20 giây, chỉ EX đánh được. Còn tồn tại thì <b>cả đội −45% DEF và gần như không được hồi máu</b>. Phá được: máy sưởi nhận hồi +100%, cả đội +200% hồi máu 20 giây.','Phá ngay khi hết khiên: Shiroko (Swimsuit); Fubuki (Swimsuit) và Maki (Camp) bỏ qua được khiên.'],
      ['must','Hạ thân nhiệt (Insane+)','Đứng yên thì thanh tăng 1 mỗi 5 giây, <b>đầy 10 là bị đóng băng</b>. Di chuyển là reset.','EX dời cả đội: <b>Mine (Pop Idol)</b>, Mimori, Yuuka (Track).'],
      ['tip','Holy Arbiter (ATG)','Thả núi băng 320% ATK cả đội; trong lúc dùng, thanh choáng không tăng.','']],
  k:['Mari (Pop Idol)','Mine (Pop Idol)','Shiroko (Swimsuit)','Sakurako (Pop Idol)'],
  team:['Game8, Insane',['Mari (Pop Idol)','Asuna (School)','Sakurako (Pop Idol)','Mine (Pop Idol)'],['Shiroko (Swimsuit)','Satsuki']],op:['Mari (Pop Idol)','Mine (Pop Idol)','Shiroko (Swimsuit)']},
 {n:'Nightmare Express',a:['light'],atk:'E',t:'Trong nhà → Đô thị',d:4,time:'4:00',
  ph:'Phase 1 đánh 2 con khỉ Monkey Crew, phase 2 đánh Nightmare Core. Đổi địa hình giữa trận: nên dùng 2 đội riêng.',
  sk:[['must','Express Ekiben Delivery · 駅弁速達サービス','Trên tàu <b>học sinh không hồi máu được cho nhau</b>. Drone bento chỉ EX đánh được; <b>phá nó là cả đội hồi máu</b>, 30 giây sau có drone mới.','Đừng mang healer; dành 1 EX phá drone mỗi khi cần hồi.'],
      ['warn','Endless Dream · 醒めぬ夢','50% ATK cả đội mỗi 5 giây; ai dưới 50% máu bị <b>−3.000 hồi cost</b> (không giải được). <b>Không né được đòn nào</b>, chỉ giảm damage theo chỉ số né.','Giữ máu trên 50% bằng drone bento.'],
      ['must','Boarding Area Control (phase 1)','Striker bị chia vào <b>2 toa theo vị trí trong đội hình</b>; mỗi toa có 1 con khỉ. Khỉ chỉ nhận đủ damage từ <b>người ở toa bên kia</b> (học sinh Special đánh vào bị giảm).','Xếp đội để mỗi toa có DPS bắn sang con khỉ toa đối diện.'],
      ['must','Boarding Denied · ご乗車いただけません','Hút hồn và <b>choáng người trong cùng toa 14 giây</b>, sau đó 400% ATK và choáng thêm 20 giây. Lúc này khỉ miễn mọi damage trừ damage từ toa bên kia.','Toa còn lại dồn <b>1.000 damage là ngắt được</b>: khỉ choáng và nhận +80% damage 16 giây.'],
      ['tip','Handling Unruly Passengers · 迷惑客対応','800% ATK 1 người và −25% né (tối đa 3 lần, không giải được). Người đó dùng EX là xóa; đủ 3 lần thì EX của họ giảm 3 cost.',''],
      ['must','Plush Bomb · ぬいぐるみ爆弾 (phase 2)','Gọi 5 bom thú bông, chỉ EX đánh được; nổ thì 300% ATK và <b>−80% ATK tới hết trận</b> (không giải được).','<b>Bắt buộc phá bom</b> bằng EX AoE nhiều hit.'],
      ['tip','Dead Man’s Switch · デッドマンスイッチ','Tàu đạt tốc tối đa: lõi <b>miễn damage và +50% ATK</b>; lúc đó chỉ đánh được cần phanh (damage truyền sang lõi). Kích hoạt phanh 3 lần → <b>lõi choáng</b> và cả đội +125% hồi cost 16 giây.','Dồn đánh cần phanh mỗi khi tàu chạy nhanh nhất.']],
  k:['Hina (Dress)','Iroha (Swimsuit)'],s:'JP ra 4/11/2026; có thể chưa có ở server của bạn.'},
 {n:'Shiro & Kuro',a:['special'],atk:'P',t:'Đô thị · Trong nhà',d:2,time:'4:00',
  ph:'Phase 1 đánh Shiro (ném bom, khó đoán), phase 2 đánh Kuro (lao thẳng, đoán trước được).',
  sk:[['must','Keep Rollin’ · 転がれ転がれー！ (Shiro)','Bom lăn 600% ATK (Insane 1.500%, Torment 5.000%). Gặp vật cản không vỡ thì <b>dội ngược về Shiro</b>; Insane+ Shiro khi đó <b>nhận thêm 50% damage 40 giây</b>.','Đặt vật cản: Hoshino (Armed), Mimori (Swimsuit), Kirino (Swimsuit), Shizuko. Peroro của Hifumi không dội được.'],
      ['must','Dun-Dun-Dun! · ドッカァーン！！ (Shiro)','Ném bom nổ chậm; <b>ATG càng cao bom càng đau</b>. Torment có 3 loại: bom thường 1.800–3.000%, <b>bom băng (−80% tốc chạy, −40% ATK 40 giây)</b>, bom dính (choáng 4 giây).','Né bằng EX tự dời chỗ hoặc hộp y tế của Serina.'],
      ['warn','Bị làm chậm = nhận cực đau (Insane+)','Học sinh bị giảm tốc chạy nhận thêm <b>600.000 damage</b> (Torment <b>1.000.000</b>) từ bom lăn và cú lao của Kuro.','<b>Giải debuff làm chậm ngay</b>, hoặc né.'],
      ['must','Charge! · 突進だぁ！！！ (Kuro)','Cho xe lao thẳng hàng (đoán trước được); ATG càng cao càng đau. Insane+: sau đó Kuro <b>nhận thêm 50% damage 40 giây</b>.','Né bằng EX di chuyển: Yuuka (Track), Eimi (Swimsuit). Insane+: đặt DPS tầm bắn 650 ở vị trí 1 và 4 trong đội để tránh phần lớn cú lao.'],
      ['warn','Lethargy (Kuro) & Horror of Slumpia','Kuro giảm 80% tốc chạy của 1–2 người trong 40 giây; cả trận <b>healing của bạn −80%</b> (Insane+).','Healer kém hiệu quả; trụ bằng khiên và né.']],
  k:['Wakamo','Aris (Armed)','Yuuka (Track)','Hoshino (Armed)'],
  s:'Vật cản trong roster của bạn: Hoshino (Armed), Kirino (Swimsuit). Né Kuro: Yuuka (Track), Eimi (Swimsuit).'},
 {n:'Perorodzilla',a:['special'],atk:'M',t:'Ngoài trời · Trong nhà',d:4,time:'4:00',
  ph:'Không chia phase: cả trận lặp lại vòng gọi Peroro → laser → hút Peroro → choáng.',
  sk:[['must','Incandescent Eye Laser · 白熱眼光','Laser 10 giây vào người gần nhất, <b>giảm 9999 DEF trong 60 giây</b>. Insane+: hết skill mà chưa giải thì <b>nổ hình quạt 250% ATK</b>. Torment: laser lan thêm sang 2 người gần nhất. Luôn bắn ngay sau khi Peroro mới xuất hiện.','<b>Bắt buộc giải debuff</b>: Natsu, Kanoe (tự giải bằng EX), Mari (khiên + giải 1 debuff), Reisa. Peroro của Hifumi làm mồi nhử được.'],
      ['must','Summon & Absorb Perorominions · ペロロミニオン','Peroro to <b>truyền 100% damage sang boss</b>, dưới 50% máu thì gục (gục rồi vẫn truyền damage). Boss hút Peroro: mỗi con đã gục nạp thanh choáng; đủ <b>7 / 10 (Insane) / 12 (Torment)</b> con là <b>choáng 20 giây</b> và gọi 5 Peroro nhỏ chỉ 2.000 DEF. Insane+ có Peroro lấp lánh: khi gục gây damage lên các Peroro xung quanh.','AoE Mystic quét cả boss lẫn Peroro. Trong 20 giây choáng, <b>cố tung ít nhất 2 EX</b> lên Peroro nhỏ. Số Peroro đã hút được giữ sang lượt sau.'],
      ['warn','Hyper Spiral Glare Beam · ハイパースパイラル熱視線','ATG đầy: <b>300% ATK cả đội</b>, không né được; sau đó đổi cảnh nền.','Cấp khiên trước đòn. Kayoko (New Year) giáp Special thường không sống nổi ở Torment+.'],
      ['tip','Bubble · 泡沫 & Burning Perorodzilla','Bong bóng 400% vào 1 người. Torment: boss và Peroro <b>+50% hiệu quả Mystic</b>.',''],
      ['warn','Địa hình','Trong nhà Hoshino (Armed) chỉ có thích ứng D.','Trong nhà dùng Makoto (Swimsuit) làm DPS chính.']],
  k:['Makoto (Swimsuit)','Hoshino (Armed)','Kanoe','Natsu']},
 {n:'Goz',a:['special'],atk:'E',t:'Ngoài trời · Trong nhà',d:3,time:'4:00',
  ph:'Phase 1 đoàn tàu + lính Slumpia; phase 2 Goz tách phân thân. Grand Assault Goz mở ở JP từ 18/11/2026.',
  sk:[['must','Scream Rider · スクリームライダー','Đoàn tàu định kỳ lao qua: <b>1.200% ATK</b> lên người trên đường đi và thả lính; Insane+ đứng gần cũng dính 600%. Từ JP mùa 87 có đèn đỏ báo trước chuyến tàu đầu.','<b>Né bằng EX dời cả đội</b>: Yuuka (Track) (vừa dời vừa cấp khiên), Eimi (Swimsuit).'],
      ['must','Prank or Protect','Học sinh có khiên chỉ nhận <b>25% damage (Insane+: 50%)</b> từ Goz. Cả đội <b>giảm hồi máu 50% (Insane+: 90%)</b>, không giải được.','<b>Khiên là cách trụ chính</b>; healer gần như vô dụng.'],
      ['must','Now You See Us & Three Light Monte · スリーライトモンテ','Goz biến mất, xóa debuff trên người, tạo <b>2 phân thân</b> (Insane+: 50% ATK). Mỗi con chiếu đèn trước mặt; vùng đèn của phân thân <b>nổ 1.500% ATK</b>.','Đứng trong vùng đèn của Goz thật. Giữ EX để soi: <b>phân thân có lá bài màu đỏ</b>. Focus Fire (Noa, Cherino) để đánh đúng con thật.'],
      ['warn','Magical Coin Hats · マジカルコインハット','Xáo 3 mũ; ai đứng thẳng hàng mũ không có xu dính <b>800%, bị đẩy lùi và choáng 5 giây</b> (Torment: thêm −50% tốc đánh 30 giây).','Dời đội vào hàng mũ có xu. Từ JP mùa 79, mũ gần Goz thật luôn có xu (Torment trở xuống).'],
      ['tip','Surprise Present · サプライズプレゼント','Bom 900% ATK vào 1 mục tiêu ngẫu nhiên, kể cả Tactical Support.','Khiên cho người yếu máu.'],
      ['tip','Crit RES cao','DPS sống nhờ chí mạng bị thiệt.','Dùng DPS không phụ thuộc chí mạng hoặc mang giảm Crit RES.']],
  k:['Yuuka (Track)','Aris (Armed)','Kei'],
  team:['Game8, Torment',['Aris (Armed)','Kei','Yuuka (Track)','Kayoko (New Year)'],['Kisaki','Nagisa (Swimsuit)']],op:['Kayoko (New Year)','Kisaki','Nagisa (Swimsuit)','Aris (Armed)','Yuuka (Track)']},
 {n:'Kurokage',a:['elastic'],atk:'M',t:'Đô thị',d:4,time:'4:00',
  ph:'Chuyển phase ở 75% và 10% HP. Từ Insane, mỗi lần có người rút lui boss mạnh lên nhiều (Game8).',
  sk:[['must','Uy áp · 猫鬼の威圧','Dính khi đứng trên <b>dấu con mắt dưới sàn</b> hoặc trong lãnh địa boss: máu bị bào dần và <b>không hồi lên tối đa được</b>. Bào từ 50% trở lên → <b>hỗn loạn, bắn đồng đội</b> tới khi uy áp về 0.','<b>Hồi vượt máu (overheal)</b>: phần hồi dư trừ vào uy áp; độ khó càng cao phần trừ càng ít (tới 1/4). Ưu tiên healer hồi liên tục cả đội: Sena (Casual), Atsuko, Koharu, Mari (Pop Idol).'],
      ['warn','The Urban Legend’s Final Act','Mọi đòn của Kurokage <b>xuyên khiên</b>.','Khiên vô dụng; trụ bằng hồi máu.'],
      ['must','Piece of Myouki · 猫鬼の片鱗','Các mảnh quanh boss <b>chỉ hiện khi đang nhắm EX</b>; nhận damage thì truyền 100% sang boss và nạp thanh choáng (chỉ choáng được khi boss đã vào lãnh địa). Boss choáng: tách thêm 4 mảnh và <b>cả đội đạt tỉ lệ chí mạng tối đa</b>.','EX AoE nhắm trúng nhiều mảnh; dồn EX lúc boss choáng.'],
      ['warn','Shriek of Summoning · 化身を呼ぶ鬼哭','Gọi hóa thân màu hồng <b>lao vào người gần nhất rồi tự nổ</b> 200%.','Hanako (Swimsuit) EX rẻ, nhiều lượt nên dễ diệt trước khi nổ.'],
      ['tip','Whispered Legends · 広がる街談巷説','Đốt sân, hút vào rồi đẩy ra (2 lần 250%). Ai còn uy áp: uy áp giảm 300/giây nhưng nhận damage bằng 20% uy áp còn lại.',''],
      ['tip','Procession / Wail / Aftershock','Lao tới đẩy lùi 300%; các vùng tròn 200–250%.','']],
  k:['Hanako (Swimsuit)','Sena (Casual)','Atsuko','Koharu'],
  s:'Healer Game8 gợi ý: Sena (Casual), Atsuko, Koharu, Mari (Pop Idol), Kokona; bạn có đủ cả 5.'},
 {n:'Yesod',a:['elastic'],atk:'E',t:'Đô thị',d:7,time:'4:30',
  ph:'Phase 1 phá đèn để mở buff; phase 2 chạy trốn, bị tay phải Yesod chặn 2 lần. Yesod không bao giờ choáng.',
  sk:[['must','Unshakeable Bedrock · 不動の地盤','Boss <b>giảm 99% damage nhận</b>. Mỗi lần dùng EX, gọi 3 đèn xanh + 3 đèn đỏ. <b>Một học sinh phá 2 đèn trong vòng 2 giây</b> → 10 giây sau cả đội choáng và nhận 999.999 damage (xóa đội).','Phá <b>từng đèn một</b> bằng đòn đơn mục tiêu; <b>không dùng AoE ở phase 1</b>.'],
      ['must','Purification by Force (Đỏ / Xanh) & Rebuilt Foundation','Đấm 1.500% ATK cả đội (Insane 3.000%). Chặn được nếu sàn đang đúng màu. <b>Tay phải giơ (đỏ)</b>: chừa lại 1 đèn đỏ, sàn xanh, phá theo thứ tự Xanh > Đỏ > Xanh > Đỏ > Xanh. <b>Tay trái giơ (xanh)</b>: ngược lại. <b>Ngực mở</b>: không chừa đèn, sàn trung tính. Thứ tự skill cố định: Đỏ > Xanh > Rebuilt > Đỏ.','Chặn thành công thì chỉ nhận damage nhỏ và Striker <b>+100% hồi cost</b> tới skill kế tiếp.'],
      ['must','Revelation · 啓示','Mỗi đèn phá <b>+1 Analysis Level</b> (tối đa 5): mỗi cấp +20% ATK, +20% chí mạng, +25% damage EX, +25% Crit DMG; Striker +200% hiệu quả Sonic. Không chặn được đòn → reset về 0.','Xả EX của DPS Sonic khi đủ cấp 5 và vừa chặn đòn.'],
      ['warn','Mark of Prophecy / Eschaton (Insane+)','Đèn có <b>dấu X</b>: phá cuối cùng. Đèn có <b>dấu reset</b>: phá đầu tiên.',''],
      ['tip','Phá đèn giảm cost','Người phá đèn được <b>giảm 50% cost cho EX kế tiếp</b>; cả đội nhận thêm 0,6 cost cho mỗi học sinh còn sống.','Xoay vòng EX rẻ: Hanako (Swimsuit), Neru (School).'],
      ['must','Phase 2 · Tay phải Yesod','Drone hỗ trợ đi theo mỗi Striker, <b>sao chép buff từ EX và Basic Skill</b> (+100% ATK, không chí mạng, +100% damage lên mục tiêu bị Focus Fire). <b>Cột trái</b> tự hồi máu, cần CC 3 giây (Insane+: 5 giây) để tự gây damage. <b>Cột phải</b> phá được → tay phải nhận <b>+1.000% damage</b>.','Mang Focus Fire (Noa), buff (Suzumi (Magical), Miyo), CC (Tsubaki, Kayoko) và giảm DEF cho cột phải.']],
  k:['Mika (Swimsuit)','Hanako (Swimsuit)','Suzumi (Magical)'],
  s:'Phase 2: Noa (tập hỏa), Tsubaki / Kayoko (CC), Hoshino (Swimsuit) (buff), Miyo.'},
 {n:'Drum Crab',a:['special','light'],atk:'P',t:'Ngoài trời · Đô thị',d:6,time:'4:30',
  ph:'Đổi phase ở 50% HP. Thân và càng phase 1 giáp Special; vỏ tàu (phase 1) và càng thép (phase 2) giáp Light. Debuff lên bộ phận nào cũng lan sang các phần khác.',
  sk:[['must','Từ Insane: không mang giáp Heavy','Cua có hệ số <b>5x thay vì 2x</b> lên học sinh giáp Heavy; Water Cannon phase 1 gây <b>600% thay vì 100%</b> lên giáp Heavy.','Không xếp Striker giáp Heavy.'],
      ['must','Phase 1 · Vỏ tàu & càng','Vỏ tàu (Light): dùng DPS Explosive đánh thường và Basic Skill (cần Focus Fire nếu không tự nhắm được). Càng (Special): <b>chỉ nhắm được bằng EX sau Claw Thrust</b>, dùng EX Mystic. <b>Phá cả 3 bộ phận</b> → mọi phần nhận thêm damage. Torment+: thân phase 1 giảm 50% damage nhận.','Aris (Armed) xả EX sau khi đã phá hết bộ phận.'],
      ['must','Bảng điều khiển trái / phải','Khi cua tung đấm trái/phải, bệ đứng của đội nằm ngay đường đấm.','<b>Giải debuff bảng điều khiển phía đối diện</b> để dời bệ và né, rồi đánh vào càng. Niko hợp nhất cho phase 1.'],
      ['must','Thùng phuy rỉ sét (phase 2)','Thùng định kỳ bắn cả đội và <b>tích debuff Adhesive Fluid liên tục</b>; càng nhiều stack càng đau. Giải debuff → cả đội +ATK, +tốc đánh và <b>cua nhận thêm damage vĩnh viễn</b> (cộng dồn).','Erika giải tới 3 debuff một lần (tốt nhất từ Insane).'],
      ['must','Counter Claw & cần cẩu','DPS Mystic đánh thường vào thân để <b>nạp cần cẩu</b>. Khi cua thủ Counter Claw, nó tích damage (thanh đỏ); <b>kích hoạt cần cẩu lúc này trả lại toàn bộ damage</b> và cua choáng. Trong Counter Claw, mọi đòn tự nhắm vào càng.','Dồn EX Explosive lên càng để tích nhanh (Haruka (Dress) bỏ qua 68% DEF). Torment+: DEF của càng gấp 5 lần thân.'],
      ['tip','Đòn thường & Crab Bubble','Đòn thường 10 hit, Crab Bubble 30 hit.','Tank chịu được nhiều hit liên tục.']],
  k:['Aris (Armed)','Kei','Niko','Haruka (Dress)'],
  team:['Game8, Extreme',['Eimi','Aris (Armed)','Kei','Seia (Swimsuit)'],['Nagisa (Swimsuit)','Mari']],op:['Seia (Swimsuit)','Nagisa (Swimsuit)','Aris (Armed)']},
 // Final Restriction Release (not TA/GA): floors 1→124, the armor alternates by season (v:1 = "one armor per season", not per body part).
 // Skills = floor 50+ (Explosive attacks); Blue Archive Wiki / Fandom "The Fury of Set" guide, 11/2026
 {n:'Set (The Fury of Set)',a:['light','special'],v:1,atk:'E',t:'Ngoài trời',d:5,time:'4:30',
  ph:'Final Restriction Release (chế độ riêng, không thuộc TA/GA): leo tầng 1 → 124, giáp đổi giữa Light và Special theo mùa. Không chia phase: cả trận chạy theo kịch bản cố định và boss mạnh dần. Từ tầng 50 boss bắn Explosive.',
  sk:[['must','Dawn-Devouring Storm · Bão nuốt bình minh','Boss nằm trong bão: <b>nhận ít hơn 80% damage từ EX</b>. ATG dưới 33%: boss gây ít hơn 70% damage; <b>ATG từ 66%: boss gây thêm 80%</b>.','DPS chính phải gây damage bằng <b>đánh thường và Normal Skill</b>, không phải EX. Suzumi (Magical) buff đúng loại damage này.'],
      ['must','Flash of Light Through A Hawk · 2 cột obelisk','Sét đánh định kỳ vào <b>cột còn nhiều máu nhất</b> và học sinh đứng quanh nó: 35% ATK và <b>−70% damage gây ra trong 40 giây</b>. Cột bị đánh nhiễm điện tới khi được hồi đầy máu; <b>cột chỉ hồi được bằng EX</b>. Cả 2 cột nhiễm điện thì sét chuyển sang học sinh nhiều máu nhất.','Dồn DPS về một phía, <b>dùng EX hồi đầy cột phía bên kia</b>. Kokona hồi đầy cột chỉ bằng 1 EX.'],
      ['warn','Arrow Through a Moment · quả cầu đỏ (tầng 25+)','475% ATK cả đội và gọi quả cầu đỏ. Cầu <b>chỉ EX đánh được</b>, gây 45% ATK quanh nó. Phá được: học sinh trong vùng +30% damage 35 giây. <b>Cầu chạm tới Set: thanh sét tăng vọt</b>.','Mang 1 người phá cầu bằng EX (Shiroko (Swimsuit) phá được cầu đỏ).'],
      ['tip','Power to Eternity · thanh sét','Thanh sét tự tăng, giảm khi boss nhận damage. Về 0%: gọi quả cầu xanh, <b>cả đội +30% damage 30 giây</b>.','Đủ hỏa lực để kéo thanh sét về 0 càng sớm càng tốt.'],
      ['must','Thunder Spear of Rage · cú choáng duy nhất','ATG đầy: 410% ATK cả đội rồi <b>boss tự choáng 24 giây</b>. Theo tốc độ ATG thì cả trận chỉ có 1 lần. Lúc choáng: cả đội <b>+500 hồi cost</b>, mọi đòn bỏ qua độ ổn định (luôn gây damage tối đa), và boss gọi thêm cầu đỏ.','Dồn buff và EX tốt nhất vào 24 giây choáng này.'],
      ['warn','Vortex of Blue Lightning (tầng 75+)','390% ATK cả đội (trừ cột), thanh sét tăng mạnh. Từ tầng 100: khi ATG từ 66%, đòn này và Roar of Blue Thunder đánh thêm 450% vào cột nhiều máu nhất.','Healer AoE hồi liên tục; giữ máu cột.'],
      ['tip','Đánh thường nảy 6 lần','Mỗi đòn 170% ATK, nảy sang người chưa bị trúng, tối đa 6 người. Từ tầng 50 nên mang Striker giáp Special / Elastic.','']],
  k:['Kokona','Hoshino (Swimsuit)','Suzumi (Magical)','Shiroko (Swimsuit)'],
  s:'Healer AoE nguồn gợi ý: Atsuko, Shigure (Hot Spring), Hanako, Natsu (Band). Mùa Light mang DPS Explosive, mùa Special mang DPS Mystic.'}];

// damage multiplier: attacker ammo -> defender armor
const MTX={E:{light:200,heavy:100,special:50,elastic:50,composite:100},P:{light:50,heavy:200,special:100,elastic:100,composite:100},
 M:{light:100,heavy:50,special:200,elastic:100,composite:50},S:{light:100,heavy:50,special:150,elastic:200,composite:50},
 C:{light:50,heavy:150,special:100,elastic:100,composite:200}};
const AM={E:['t-exp','Explosive'],P:['t-pie','Piercing'],M:['t-mys','Mystic'],S:['t-son','Sonic'],C:['t-cor','Corrosive']};
const pcA=v=>`<span class="pc ${v>=200?'w':v>100?'e':v<100?'r':'n'}">${v}%</span>`;
const pcD=v=>`<span class="pc ${v>100?'r':v<100?'w':'n'}">${v}%</span>`;
// per-boss walkthrough (fl) and what each listed student does (ro)
const GUIDE={
 Binah:{fl:['Mở trận: tung giảm DEF trước (Kanna (Swimsuit)), rồi buff, rồi mới xả EX của DPS. DEF Binah 5.000–7.200, không giảm DEF thì damage rất thấp.',
  'Phase 1–2: theo dõi thanh choáng. Làm Binah choáng đúng lúc để ngắt Fires of Severity, đòn dồn lên 4 Striker đứng gần nhất.',
  'Dưới khoảng 60% HP Binah chui xuống đất: cả đội phải đổi chỗ đuổi theo, đừng để DPS đứng hàng đầu.',
  'Phase 3 (dưới khoảng 20% HP): Purifying Storm khi đầy ATG (300% ATK cả đội, −50% DEF 30 giây). Chỉ ngắt được bằng cách làm đầy thanh choáng trước.',
  'Torment: laser để lại vùng cháy 15 giây, bắt buộc mang tank hoặc healer. Đừng mang debuff giảm tốc đánh vì boss miễn.'],
  ro:{'Mika':'DPS Piercing chính. Sub skill khiến mọi hit đều chí mạng, chỉ còn lo độ ổn định.','Kanna (Swimsuit)':'Giảm DEF mạnh nhất cho Binah (tới 47,8%). Luôn là thẻ đầu tiên.',
  'Shun':'Striker thứ 3 trong đội mẫu Kamigame.','Seia':'Buffer Striker.','Kisaki':'Tăng damage EX cho 1 người: dùng lên Mika ngay trước EX của Mika.',
  'Rio':'Chép EX của Mika và tăng ATK: Mika ra EX thêm 1 lần.','Neru (School)':'DPS Piercing thay thế.'}},
 Chesed:{fl:['Phase 1: đi qua các đợt lính giáp Heavy bằng AoE. Lính sống quá 20 giây sẽ tự nổ 3.000% ATK.',
  'Dọn đủ 4 đợt lính thì lõi mở 20 giây và nhận thêm 900% damage. Giữ EX đơn mục tiêu cho đúng 20 giây này.',
  'Tiến độ mở lõi giữ nguyên khi đổi đội: đội 1 dọn tới khoảng 90%, đội 2 vào mở lõi rồi xả.',
  'ATG đầy một nửa: lính +50% ATK và tốc chạy 60 giây. Ngắt được bằng taunt của Tsubaki.',
  'ATG đầy: 2.000% ATK cả đội. Dọn sạch lính để reset ATG trước khi đầy.'],
  ro:{'Seia':'Buffer Striker.','Mika':'DPS Piercing, xả vào lõi lúc mở.','Aru (Dress)':'Tăng Crit DMG cho DPS từ slot Striker (lớn hơn Ako). Giáp Heavy nên dễ chết hơn.',
  'Cherino':'Thành viên đội mẫu Kamigame.','Kisaki':'Tăng damage EX cho Mika.','Rio':'Chép EX của Mika trong 20 giây lõi mở.','Neru (School)':'DPS Piercing thay thế.'}},
 Hod:{fl:['Phase 1: phá Invader Pillar 2 lần để tới boss. CC lên cột để thu nhỏ vùng xâm thực (vùng xanh giảm hồi cost và chiếm tháp súng của bạn).',
  'Phase 2: đánh Hod cùng 1 cột mới. Dồn CC liên tục để đầy thanh CC (Insane cần 15 giây CC): boss nhận thêm damage 30 giây, +25% thanh choáng, giảm ATG.',
  'Đầy thanh CC 4 lần thì boss choáng 20 giây: đây là lúc xả EX của DPS.',
  'Không để ATG đầy 3 ô: Radiance of Glory làm boss +50% ATK vĩnh viễn.',
  'Mẹo: làm đầy thanh choáng đúng lúc Hod đang triệu cột mới thì cả trận không còn cột.'],
  ro:{'Seia':'Buffer Striker.','Neru (School)':'DPS Piercing chính. Hod Crit RES cao nên DPS thường khó chí mạng.','Hare (Camp)':'Tăng ATK từ slot Striker.',
  'Kotama (Camp)':'CC 11,5 giây (UE40 lên 20 giây): nạp thanh CC nhanh nhất.','Kisaki':'Tăng damage EX cho Neru (School).','Ako':'Tăng chí mạng và Crit DMG lớn, thỉnh thoảng hồi máu.',
  'Mika':'DPS Piercing luôn chí mạng, không sợ Crit RES.','Tsubaki':'Tank, taunt cũng là CC nạp thanh.'}},
 Hovercraft:{fl:['Phase 1 đánh Wakamo (Swimsuit): mỗi EX của Wakamo khắc 2 dấu lên người trúng, đủ 5 dấu là rút lui ngay (xuyên cả khiên và bất tử). Xoay vị trí để dấu không dồn vào 1 người.',
  'Dồn CC để tích thời gian CC (Insane 10 / 14 / 18 giây). Đầy thì Wakamo choáng (tối đa 3 lần), xóa dấu và nhận thêm 100 / 200 / 300% damage.',
  'Howitzer nhắm người đứng xa nhất: đặt summon hoặc vật cản chắn trước hàng sau.',
  'Phase 2: tàu vào chế độ tên lửa, khu nghỉ dưỡng còn 5 máu (Torment 4), mất hết là thua. Phá Missile Guidance System; từ Insane phải hồi máu hệ thống đánh chặn thì nó mới bắn.',
  'Cả 2 phase boss giảm 75% damage nhận. Ưu tiên DPS bắn nhiều hit: mỗi 15 hit trúng tàu +10% damage nhận (tối đa 30 lần).'],
  ro:{'Neru (School)':'DPS Piercing chính.','Mika':'DPS Piercing luôn chí mạng.'}},
 Kaiten:{fl:['Phase 1: 5 Kaitenger dùng chung 1 thanh máu. Marina gom cả nhóm lại rồi EX AoE.',
  'Kaitenger Đỏ taunt mọi Striker 10 giây, cứ 20 giây một lần: canh EX ngoài nhịp đó, hoặc ngắt bằng taunt của Tsubaki.',
  'Phase 2: robot có khiên Ultra Cap, chỉ vỡ khi trúng EX đủ nhiều hit (từ 10 hit; Torment từ 15).',
  'Final Mackerel Slash luôn đến đúng sau 1 phút: chuẩn bị khiên và hồi máu trước mốc này.',
  'Phá bộ phận đang phát sáng thì robot choáng 10 giây và mất luôn skill đó. Tránh tung EX lúc aura đỏ vì tên lửa sẽ choáng cả đội.'],
  ro:{'Hina (Dress)':'DPS Explosive chính, EX có độ ổn định tối đa.','Hoshino (Swimsuit)':'Buff ATK vùng quanh mình và tăng hiệu quả Explosive.','Hare (Camp)':'Tăng ATK từ slot Striker.',
  'Marina':'Gom Kaitenger cho AoE; EX 20 hit cũng phá được khiên phase 2.','Kisaki':'Tăng damage EX cho Hina (Dress).','Ako':'Tăng chí mạng và Crit DMG.'}},
 Hieronymus:{fl:['Phase 1 (trên 50% HP) boss không tăng ATG: tập trung hồi đầy thánh vật xanh (bắt đầu ở 5% máu). Mỗi lần đầy, boss nhận thêm 55% damage tới hết trận, tối đa 5 lần.',
  'Insane+: phá thánh vật tím bằng EX thật sớm: cả đội +25% ATK, boss −1.500 DEF.',
  'Vulgata nguyền 1 người, 10 giây sau nổ 325%: hồi người đó lên 100% máu là giải.',
  'Phase 2: ATG đầy khoảng 110 giây sau khi vào phase thì xóa đội. Từ Insane không còn thánh vật đỏ cứu, phải giết kịp.',
  'Đổi đội là mất hết stack thánh vật: cố kết thúc bằng 1 đội.'],
  ro:{'Mari (Pop Idol)':'Healer đơn mục tiêu: hồi thánh vật xanh và giải nguyền.','Hoshino (Swimsuit)':'Buff ATK vùng và tăng hiệu quả Explosive.','Hina (Dress)':'DPS Explosive chính.',
  'Hare (Camp)':'Tăng ATK từ slot Striker.','Fuuka (New Year)':'Giảm cost 1 lần EX của Hina (Dress) và tăng Crit DMG.','Kisaki':'Tăng damage EX cho Hina (Dress).',
  'Kokona':'Healer đơn mục tiêu thay Mari (Pop Idol).','Satsuki (Swimsuit)':'Chìa khóa theo Game8.'}},
 Gregorius:{fl:['Giữ đúng 5–6 debuff trên boss (Insane) để boss nhận +200% damage. 0–2 hoặc từ 9 debuff trở lên thì boss +40% ATK. Không phải càng nhiều càng tốt.',
  'Solemn Repentance xóa 1 debuff khỏi boss và dàn hợp xướng: bù debuff ngay sau đòn.',
  'Whispers of the Saint: 500% ATK cả đội, luôn chí mạng, kèm −40% ATK 120 giây. Hồi vượt máu trước đòn.',
  'AoE quét dàn hợp xướng: chúng truyền 100% damage sang boss và nạp thanh choáng. Không lấy được choáng thì nên chơi lại (Game8).',
  'Xoay organ trung tâm bằng EX để thánh ca có lợi cho bạn. Phải giết trước Salvation for Everyone (999.999 damage cả đội).'],
  ro:{'Hoshino (Swimsuit)':'Buff ATK vùng và hiệu quả Explosive.','Hoshino (Armed)':'Striker chính trong đội mẫu Game8 Torment (UE 4★).','Hina (Dress)':'DPS Explosive chính (UE 4★ theo Game8).',
  'Mine':'Áp 4 debuff một lượt, giúp đạt ngưỡng 5–6 nhanh; Mine chỉ cần 4★.','Fuuka (New Year)':'Giảm cost EX cho DPS, tăng Crit DMG.','Kisaki':'Tăng damage EX cho DPS.'}},
 Geburah:{fl:['DPS đặt ở slot Special (+80% damage). Striker, Tactical Support và summon −75% damage, nên Striker chỉ để tank, heal, buff.',
  'Giữ máy sưởi trên 30% bằng EX hồi máu. Đạt 100% là quá tải: cả đội +500 hồi cost, +30% ATK, +60% Crit DMG. Xả EX của DPS lúc này.',
  'Dưới 60% HP đổi địa hình. Cột băng mọc sau Hell and High Water: phá ngay bằng EX khi hết khiên, nếu không cả đội −45% DEF và gần như không được hồi.',
  'Insane+: dời cả đội trước khi thanh hạ thân nhiệt đầy 10 (khoảng 50 giây đứng yên).',
  'Cả trận chỉ choáng được 1 lần: dồn EX lớn nhất vào lần choáng đó.'],
  ro:{'Mari (Pop Idol)':'Hồi vượt máy sưởi bằng EX, giữ 100% lâu hơn.','Asuna (School)':'Thành viên Striker đội mẫu Game8 Insane.','Sakurako (Pop Idol)':'Thành viên Striker đội mẫu Game8 Insane.',
  'Mine (Pop Idol)':'EX dời cả đội, reset thanh hạ thân nhiệt.','Shiroko (Swimsuit)':'DPS ở slot Special, phá cột băng.','Satsuki':'Thành viên Special đội mẫu Game8.'}},
 Nightmare:{fl:['Chuẩn bị 2 đội riêng: giữa trận đổi địa hình từ Trong nhà sang Đô thị.',
  'Phase 1: Striker bị chia vào 2 toa theo vị trí trong đội hình. Mỗi con khỉ chỉ nhận đủ damage từ người ở toa đối diện, nên xếp DPS ở cả 2 toa.',
  'Boarding Denied choáng cả toa: toa còn lại dồn 1.000 damage để ngắt, khỉ choáng và nhận +80% damage 16 giây.',
  'Trên tàu không ai hồi máu được cho nhau: phá drone bento bằng EX để hồi cả đội, giữ máu trên 50% để không bị −3.000 hồi cost.',
  'Phase 2: phá 5 bom thú bông bằng EX AoE trước khi nổ (nổ là −80% ATK tới hết trận). Tàu chạy tốc tối đa thì đánh cần phanh 3 lần để lõi choáng.'],
  ro:{'Hina (Dress)':'DPS Explosive chính.','Iroha (Swimsuit)':'Chìa khóa theo nguồn JP.'}},
 Shiro:{fl:['Phase 1 (Shiro): đặt vật cản để bom lăn dội ngược về Shiro. Insane+ Shiro nhận thêm 50% damage 40 giây mỗi lần dội.',
  'Né bom nổ chậm bằng EX tự dời chỗ. Torment có bom băng (làm chậm) và bom dính (choáng 4 giây).',
  'Bị làm chậm là nhận thêm 600.000 damage (Torment 1.000.000): giải debuff làm chậm ngay.',
  'Phase 2 (Kuro): né cú lao thẳng hàng bằng EX di chuyển. Insane+: đặt DPS tầm bắn 650 ở vị trí 1 và 4 trong đội hình.',
  'Cả trận hồi máu −80% (Insane+): trụ bằng khiên và né thay vì healer.'],
  ro:{'Wakamo':'DPS Mystic.','Aris (Armed)':'DPS Mystic, giáp Composite.','Yuuka (Track)':'Né cú lao của Kuro bằng EX dời đội.','Hoshino (Armed)':'Đặt vật cản dội bom lăn.'}},
 Perorodzilla:{fl:['Mỗi vòng lặp: boss gọi Peroro, bắn laser giảm 9999 DEF người gần nhất. Bắt buộc giải debuff trước khi hết skill (Insane+ nổ 250%).',
  'AoE Mystic quét cả boss lẫn Peroro: Peroro truyền 100% damage sang boss.',
  'Boss hút đủ 7 / 10 (Insane) / 12 (Torment) Peroro đã gục thì choáng 20 giây và gọi 5 Peroro nhỏ chỉ 2.000 DEF: tung ít nhất 2 EX.',
  'ATG đầy: Hyper Spiral Glare Beam 300% ATK cả đội, không né được. Cấp khiên trước.',
  'Trong nhà Hoshino (Armed) chỉ có thích ứng D: dùng Makoto (Swimsuit) làm DPS chính.'],
  ro:{'Makoto (Swimsuit)':'DPS Mystic chính khi đánh trong nhà.','Hoshino (Armed)':'DPS Mystic chính khi đánh ngoài trời.','Kanoe':'Tự giải debuff bằng EX.','Natsu':'Giải debuff laser.'}},
 Goz:{fl:['Phase 1: đoàn tàu Scream Rider lao qua (1.200% ATK) và thả lính: né bằng EX dời cả đội.',
  'Học sinh có khiên chỉ nhận 25% damage (Insane+ 50%), còn hồi máu bị giảm 50–90%: khiên là cách trụ chính.',
  'Phase 2: Goz tách 2 phân thân. Đứng trong vùng đèn của Goz thật; phân thân có lá bài màu đỏ. Dùng Focus Fire để đánh đúng con thật.',
  'Magical Coin Hats: dời đội vào hàng mũ có xu, sai hàng là 800% kèm đẩy lùi và choáng 5 giây.',
  'Goz Crit RES cao: ưu tiên DPS không phụ thuộc chí mạng.'],
  ro:{'Aris (Armed)':'DPS Mystic chính.','Kei':'Hỗ trợ Mystic, giáp Composite.','Yuuka (Track)':'Vừa dời cả đội né tàu vừa cấp khiên.','Kayoko (New Year)':'Tăng hiệu quả Mystic.',
  'Kisaki':'Tăng damage EX cho Aris (Armed).','Nagisa (Swimsuit)':'Tăng Crit DMG lớn; Cost Overload cho EX của DPS dùng sớm hơn.'}},
 Kurokage:{fl:['Tránh dấu con mắt dưới sàn và lãnh địa boss: uy áp bào máu, từ 50% trở lên là hỗn loạn, bắn đồng đội.',
  'Hồi vượt máu để trừ uy áp (độ khó càng cao phần trừ càng ít). Đòn của Kurokage xuyên khiên nên khiên vô dụng.',
  'Nhắm EX AoE trúng nhiều mảnh Myouki (chỉ hiện khi đang nhắm EX) để nạp thanh choáng.',
  'Boss choáng: cả đội đạt tỉ lệ chí mạng tối đa, dồn EX lúc này.',
  'Diệt hóa thân hồng trước khi nó lao vào và tự nổ. Từ Insane, mỗi lần có người rút lui boss mạnh lên nhiều.'],
  ro:{'Hanako (Swimsuit)':'DPS Sonic AoE, EX rẻ và nhiều lượt.','Sena (Casual)':'Healer hồi liên tục cả đội.','Atsuko':'Healer hồi liên tục cả đội.','Koharu':'Healer hồi liên tục cả đội.'}},
 Yesod:{fl:['Phase 1: boss giảm 99% damage nhận. Phá đèn từng cái một bằng đòn đơn mục tiêu, không dùng AoE. Một học sinh phá 2 đèn trong 2 giây là xóa đội.',
  'Đọc tay Yesod: tay phải giơ (đỏ) thì chừa 1 đèn đỏ, phá Xanh > Đỏ > Xanh > Đỏ > Xanh; tay trái giơ thì ngược lại; ngực mở thì không chừa đèn.',
  'Chặn đúng màu thì chỉ nhận damage nhỏ và Striker +100% hồi cost. Mỗi đèn phá +1 Analysis Level (tối đa 5); chặn sai là reset về 0.',
  'Xả EX Sonic khi đủ Analysis 5 và vừa chặn đòn. Insane+: đèn dấu reset phá đầu, đèn dấu X phá cuối.',
  'Phase 2: CC cột trái để nó tự gây damage, phá cột phải để tay phải nhận +1.000% damage; Focus Fire cho drone sao chép buff.'],
  ro:{'Mika (Swimsuit)':'DPS Sonic đơn mục tiêu.','Hanako (Swimsuit)':'EX rẻ, xoay vòng phá đèn (phá đèn giảm 50% cost EX kế tiếp).','Suzumi (Magical)':'Buff cho drone sao chép ở phase 2.'}},
 Drum:{fl:['Từ Insane không mang Striker giáp Heavy: cua gây 5x lên Heavy, Water Cannon 600%.',
  'Phase 1: phá vỏ tàu (Light) bằng Explosive, càng (Special) bằng EX Mystic ngay sau Claw Thrust. Phá đủ 3 bộ phận thì mọi phần nhận thêm damage.',
  'Khi cua tung đấm trái hoặc phải: giải debuff bảng điều khiển phía đối diện để dời bệ né.',
  'Phase 2 (dưới 50% HP): giải debuff Adhesive Fluid từ thùng phuy, mỗi lần giải cua nhận thêm damage vĩnh viễn.',
  'DPS Mystic đánh thường nạp cần cẩu; kích hoạt lúc cua thủ Counter Claw để trả lại toàn bộ damage và làm choáng.'],
  ro:{'Eimi':'Tank chịu nhiều hit liên tục.','Aris (Armed)':'DPS Mystic, xả EX sau khi phá hết bộ phận.','Kei':'Hỗ trợ Mystic, giáp Composite.','Seia (Swimsuit)':'Tăng damage EX cho 1 người, kèm hồi máu.',
  'Nagisa (Swimsuit)':'Tăng Crit DMG; Cost Overload.','Mari':'Khiên và giải 1 debuff.','Niko':'Hợp nhất cho phase 1.','Haruka (Dress)':'EX bỏ qua 68% DEF, tích Counter Claw nhanh.'}},
 Set:{fl:['Xếp đội: DPS gây damage bằng đánh thường / Normal Skill (EX bị giảm 80%), cùng healer AoE hồi liên tục và 1 người hồi cột bằng EX.',
  'Dồn DPS về một phía sân. Sét luôn đánh cột còn nhiều máu nhất: hồi đầy cột phía bên kia bằng EX để sét không trúng người mình (−70% damage 40 giây).',
  'Mỗi lần Arrow Through a Moment gọi cầu đỏ: phá bằng EX trước khi nó bay tới Set (phá được thì cả nhóm +30% damage).',
  'Kéo thanh sét về 0 để có cầu xanh (+30% damage cả đội). Giữ máu cả đội vì ATG từ 66% boss đánh mạnh thêm 80%.',
  'ATG đầy: Thunder Spear of Rage rồi boss choáng 24 giây, cả trận chỉ 1 lần. Xả toàn bộ buff vào lúc này.'],
  ro:{'Kokona':'Healer đơn mục tiêu số 1: EX hồi đầy cột ngay; giáp Special hợp từ tầng 50.','Hoshino (Swimsuit)':'Buff ATK vùng và hiệu quả Explosive (mùa Light).',
  'Suzumi (Magical)':'Buff ATK và Basics Proficiency (đánh thường, Normal Skill) đúng thứ Set nhận đủ damage.','Shiroko (Swimsuit)':'Sub skill Cost Recovery, giảm DEF, phá cầu đỏ bằng EX.'}}};
function guide(b){const g=GUIDE[b.n.split(' ')[0]]||{fl:[],ro:{}};const A=AM[b.atk];
 const off=b.a.map(a=>`<div class="gr"><span class="ar ${AR[a][0]}">${AR[a][1]}</span><span class="arrow">nhận</span><div class="gl">${Object.keys(AM).map(k=>`<span class="gi"><span class="tag ${AM[k][0]}">${AM[k][1]}</span>${pcA(MTX[k][a])}</span>`).join('')}</div></div>`).join('');
 const arms=['light','heavy','special','elastic','composite'];
 const dfn=arms.map(a=>`<span class="gi"><span class="ar ${AR[a][0]}">${AR[a][1].replace('Giáp ','')}</span>${pcD(MTX[b.atk][a])}</span>`).join('');
 const bad=arms.filter(a=>MTX[b.atk][a]>100).map(a=>AR[a][1].replace('Giáp ','')).join(', ');
 const good=arms.filter(a=>MTX[b.atk][a]<100).map(a=>AR[a][1].replace('Giáp ','')).join(', ');
 const mem=b.team?[...b.team[1].map(n=>[n,'Striker']),...b.team[2].map(n=>[n,'Special'])]:[];
 b.k.forEach(n=>{if(!mem.some(m=>m[0]===n))mem.push([n,'Chìa khóa'])});
 const must=b.sk.filter(s=>s[0]==='must');
 return `<div class="guide">
  <h5>⚔️ Bạn đánh boss</h5>${off}
  <p class="gp">Mang DPS <b>${b.a.map(a=>AR[a][3]).join(' + ')}</b> (200%).${b.a.length>1?(b.v?' Giáp đổi theo mùa: xem mùa đang mở rồi mang đúng 1 hệ đạn.':' Boss có 2 loại giáp theo bộ phận, nên cần cả 2 hệ đạn.'):''} Đạn sai hệ (ô đỏ) chỉ gây 50%.</p>
  <h5>🛡️ Boss bắn <span class="tag ${A[0]}">${A[1]}</span> vào đội bạn</h5><div class="gl">${dfn}</div>
  <p class="gp">Striker giáp <b>${good}</b> chỉ nhận 50%.${bad?` Tránh đặt giáp <b>${bad}</b> ở hàng đầu (nhận ${bad.includes(',')?'150–200':'200'}%).`:''}</p>
  <h5>🧭 Diễn biến trận</h5><ol>${g.fl.map(x=>`<li>${x}</li>`).join('')}</ol>
  <h5>👥 Đội hình chi tiết${b.team?` · ${b.team[0]}`:''}</h5>
  <ul class="ros">${mem.map(([n,s])=>`<li>${nm(n)}<span class="slot">${s}</span><span class="rt">${g.ro[n]||'Có trong danh sách chìa khóa của nguồn.'}</span></li>`).join('')}</ul>
  ${b.team?'':'<p class="gp">Nguồn chưa có đội mẫu đầy đủ cho boss này: ghép các chìa khóa trên với tank, healer và buffer phù hợp hệ đạn.</p>'}
  <h5>✅ Checklist bắt buộc</h5><ul class="ck">${must.map(s=>`<li><b>${s[1]}</b>${s[3]?`: ${s[3]}`:''}</li>`).join('')}</ul></div>`;}
document.getElementById('bosses').innerHTML=BOSSES3.map(b=>{const A0=AR[b.a[0]];
 const vs=b.a.map(a=>`<span class="ar ${AR[a][0]}">${AR[a][1]}</span>`).join(' ')+' <span class="arrow">←</span> '+b.a.map(a=>`<span class="tag ${AR[a][2]}">${AR[a][3]}</span>`).join(' ');
 const at=ATK[b.atk];
 return `<div class="bpage" data-key="${b.n.split(' ')[0]}" data-a="${b.a.join(' ')}"><div class="boss" style="--c:${A0[4]};${b.a.length>1?'border-image:linear-gradient(90deg,var(--mys),var(--exp)) 1;border-radius:0':''}">
  <div class="bhero">${bossImg(b.n.split(' ')[0],'Portrait','bpor')}</div>
  <div class="bh"><h4>${bossImg(b.n.split(' ')[0],'Icon','bico')}${b.n}</h4><span class="dif d${b.d}">${DIFF[b.d]}</span></div>
  <div class="vs">${vs}<span>· ${b.t}</span></div>
  <div class="def"><span>Boss bắn <span class="tag ${at[0]}">${at[1]}</span></span><span>Striker chịu tốt: ${RES[b.atk].map(a=>`<span class="ar ${AR[a][0]}">${AR[a][1].replace('Giáp ','')}</span>`).join(' ')}</span></div>
  <div class="meta"><span class="tm">⏱ ${b.time}</span>${b.ph}</div>
  <ul class="mx sk">${b.sk.map(([c,sn,e,f])=>`<li class="${c}"><div class="sh"><span class="lab">${MX[c]}</span><span class="sn">${sn}</span></div><div class="se">${e}</div>${f?`<div class="sf"><span>Cách xử lý</span>${f}</div>`:''}</li>`).join('')}</ul>
  <div class="k">Chìa khóa trong roster</div><div class="keys">${b.k.map(nm).join('')}</div>
  ${b.team?`<div class="k">Đội mẫu · ${b.team[0]}</div><div class="keys">${b.team[1].map(nm).join('')}<span class="plus">+</span>${b.team[2].map(nm).join('')}</div>`:''}
  ${b.op?`<div class="k">Thẻ mở đầu gợi ý <a class="opl" href="#order">cách đọc</a></div><div class="keys">${b.op.map((n,i)=>`<span class="opn${i>2?' x':''}">${i+1}</span>${nm(n)}`).join('')}</div>`:''}
  ${b.s?`<p class="sub">${b.s}</p>`:''}</div>${guide(b)}</div>`}).join('');

// one boss per page: selector chips + prev/next, armor filter narrows the list
let BF='all',CUR=BOSSES3[0].n.split(' ')[0];
const keyOf=b=>b.n.split(' ')[0];
const visible=()=>BOSSES3.filter(b=>BF==='all'||b.a.includes(BF));
function renderSel(){document.getElementById('bsel').innerHTML=visible().map(b=>
 `<button data-k="${keyOf(b)}" style="--c:${AR[b.a[0]][4]}" class="${keyOf(b)===CUR?'on':''}">${bossImg(keyOf(b),'Icon','bsi')}${b.n}</button>`).join('');}
function showBoss(k,flash){CUR=k;
 document.querySelectorAll('#bosses .bpage').forEach(p=>p.classList.toggle('cur',p.dataset.key===k));
 renderSel();const v=visible(),i=v.findIndex(b=>keyOf(b)===k);
 document.getElementById('bcnt').textContent=`${i+1} / ${v.length}`;
 if(flash){const p=document.querySelector(`#bosses .bpage[data-key="${k}"]`);
  document.getElementById('bsel').scrollIntoView({behavior:'smooth',block:'start'});
  p.classList.remove('flash');void p.offsetWidth;p.classList.add('flash');setTimeout(()=>p.classList.remove('flash'),2600);}}
document.getElementById('bsel').addEventListener('click',e=>{const t=e.target.closest('button');if(t)showBoss(t.dataset.k);});
const step=d=>{const v=visible(),i=v.findIndex(b=>keyOf(b)===CUR);showBoss(keyOf(v[(i+d+v.length)%v.length]));
 document.getElementById('bsel').scrollIntoView({behavior:'smooth',block:'start'});};
document.getElementById('bprev').addEventListener('click',()=>step(-1));
document.getElementById('bnext').addEventListener('click',()=>step(1));
document.querySelectorAll('#bf button').forEach(btn=>btn.addEventListener('click',()=>{
 document.querySelectorAll('#bf button').forEach(x=>x.classList.toggle('on',x===btn));
 BF=btn.dataset.a;const v=visible();showBoss(v.some(b=>keyOf(b)===CUR)?CUR:keyOf(v[0]));}));
showBoss(CUR);

// click a boss name (or a tracker button) -> open that boss page and highlight it
document.addEventListener('click',e=>{const l=e.target.closest('.bl,.go');if(!l)return;e.preventDefault();
 const b=BOSSES3.find(x=>keyOf(x)===l.dataset.k);if(!b)return;
 if(BF!=='all'&&!b.a.includes(BF))document.querySelector('#bf button[data-a="all"]').click();
 if(location.hash!=='#teams')location.hash='#teams';
 setTimeout(()=>showBoss(l.dataset.k,true),60);});

// TA/GA Global tracker: embedded schedule (server time UTC+9), picks active or next season
const SCHED=[
 {m:'TA',k:'Gregorius',n:'Gregorius',a:['light'],s:'2026-10-20T11:00:00+09:00',e:'2026-10-27T03:59:59+09:00',x:'Mùa 87'},
 {m:'TA',k:'Hieronymus',n:'Hieronymus',a:['light'],s:'2026-11-17T11:00:00+09:00',e:'2026-11-24T03:59:59+09:00',x:'Mùa 88 · TA chỉ có 1 loại giáp'},
 {m:'GA',k:'Binah',n:'Binah',a:['light','heavy','elastic'],s:'2026-12-01T11:00:00+09:00',e:'2026-12-08T03:59:59+09:00',
  x:'Mùa 36 · Ngoài trời. 3 giáp theo bản JP cùng mùa: Light và Heavy tới Torment, Elastic tới Insane'},
 {m:'TA',k:'Perorodzilla',n:'Perorodzilla',a:['special'],s:'2026-12-15T11:00:00+09:00',e:'2026-12-22T03:59:59+09:00',x:'Trong nhà · lịch dự đoán theo JP'},
 {m:'GA',k:'Shiro',n:'Shiro & Kuro',a:['light','special','elastic'],s:'2026-12-29T11:00:00+09:00',e:'2027-01-05T03:59:59+09:00',x:'Đô thị · Light và Special tới Torment · lịch dự đoán theo JP'},
 {m:'TA',k:'Drum',n:'Drum Crab',a:['light','special'],s:'2027-01-12T11:00:00+09:00',e:'2027-01-19T03:59:59+09:00',x:'Đô thị · lịch dự đoán theo JP'}];
// modes shown as cards / ranked for the lobby: key -> card title, short label for text. Only TA and GA: Set belongs to
// Final Restriction Release, a separate mode, so it is not scheduled here (its guide stays in Cơ chế boss)
const MODES=[['TA','TOTAL ASSAULT','Total Assault'],['GA','GRAND ASSAULT','Grand Assault']];
const VN=d=>d.toLocaleString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',weekday:'short',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
const left=ms=>{const s=Math.max(0,Math.floor(ms/1000)),d=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60),z=s%60;
 return `${d} ngày ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(z).padStart(2,'0')}`};
// src: the schedule to pick from (TA / GA by default, the Joint Firing Drill card passes JFD)
function pick(mode,now,src=SCHED){const L=src.filter(x=>x.m===mode).map(x=>({...x,S:new Date(x.s),E:new Date(x.e)})).sort((p,q)=>p.S-q.S);
 return L.find(x=>x.S<=now&&now<=x.E)||L.find(x=>x.S>now)||L[L.length-1];}
// ===== Joint Firing Drill schedule (lobby card, guide screen #jfd, Nhiệm vụ, lobby reminders); defined here, before the task
// list, because that list is first built while the page loads.
// Global schedule: bluearchive.wiki "Joint Firing Drill", Global tab (read 24/11/2026), server time UTC+9; the 24/11 start is also in
// the official @EN_BlueArchive preview post. t = exercise, a = enemy armor (AR key), g = terrain (JFDG key).
// Armor / terrain come from the wiki season pages via the handoff notes (the schedule table doesn't list them).
// p:1 = predicted from the JP order, not on the Global table yet.
// Guide screen extras (season page on bluearchive.wiki): n = exercise number, tm = time limit of phase 1–4, sch = schools whose
// Mystic gets the phase 3 / 4 bonus, r = special rules by phase, u:1 = armor / terrain from the handoff notes, not checked yet
// (the current Escort's Special / Indoor was confirmed in game by the player, 24/11/2026).
const JFD=[
 {m:'JFD',t:'Escort',a:'special',g:'indoor',s:'2026-11-24T11:00:00+09:00',e:'2026-12-01T03:59:59+09:00',n:9,
  tm:['3:00','3:00','2:00','2:30'],sch:['Trinity','Gehenna'],
  r:['Phase 1–2: không có luật thêm.','Phase 3: học sinh <b>Trinity</b> và <b>Gehenna</b> được <b>+100% hiệu quả Mystic</b>.',
   'Phase 4: như phase 3, thêm: Avant Garde-kun còn <b>từ 80% HP</b> thì cả đội <b>+900 hồi cost</b> và <b>+30% damage EX</b>; địch <b>+100% HP tối đa</b>.']},
 {m:'JFD',t:'Shooting',a:'special',g:'outdoor',s:'2026-12-22T11:00:00+09:00',e:'2026-12-29T03:59:59+09:00',u:1},
 {m:'JFD',t:'Escort',a:'heavy',g:'urban',s:'2027-01-19T11:00:00+09:00',e:'2027-01-26T03:59:59+09:00',p:1,u:1}];
// terrain -> name (card tooltip, guide screen, task text)
const JFDG={indoor:'Trong nhà',outdoor:'Ngoài trời',urban:'Đô thị'};
function renderLive(){const now=new Date();
 // quick prep inside each card, from the boss page: sample team (or the roster's keys) + the first "must" rules
 const prep=k=>{const B=BOSSES3.find(x=>keyOf(x)===k);if(!B)return '';const must=B.sk.filter(s=>s[0]==='must').slice(0,2);
  return `<div class="lprep">${B.team?`<div class="k">Đội mẫu · ${B.team[0]}</div><div class="keys">${B.team[1].map(nm).join('')}<span class="plus">+</span>${B.team[2].map(nm).join('')}</div>`
   :`<div class="k">Chìa khóa trong roster</div><div class="keys">${B.k.map(nm).join('')}</div>`}
   ${must.length?`<div class="k">Phải nhớ</div><ul class="rl">${must.map(s=>`<li><b>${s[1]}</b>${s[3]?`: ${s[3]}`:''}</li>`).join('')}</ul>`:''}</div>`;};
 document.getElementById('lgrid').innerHTML=MODES.map(([mode,title])=>{const b=pick(mode,now);if(!b)return '';
  const st=now<b.S?['soon','Sắp mở']:now<=b.E?['on','Đang diễn ra']:['off','Đã kết thúc'];
  const target=st[0]==='soon'?b.S:b.E;
  return `<div class="lc"><div class="lbg">${bossImg(b.k,'Portrait','')}</div><div class="mode">${title}<span class="st ${st[0]}">${st[1]}</span></div>
   <h3>${bossImg(b.k,'Icon','lci')}${b.n}</h3>
   <div class="row">${b.a.map(a=>`<span class="ar ${AR[a][0]}">${AR[a][1]}</span><span class="arrow">←</span><span class="tag ${AR[a][2]}">${AR[a][3]}</span>`).join('&nbsp;&nbsp;')}</div>
   <div class="when">Mở: <b>${VN(b.S)}</b><br>Kết thúc: <b>${VN(b.E)}</b><br>
    ${st[0]==='off'?'Chưa có lịch mùa tiếp theo trên wiki.':`${st[0]==='soon'?'Mở sau':'Còn lại'}: <span class="cd" data-t="${target.getTime()}">${left(target-now)}</span>`}</div>
   <div class="row">${b.x}</div>
   <details class="lqk"${matchMedia('(min-width:1200px) and (min-height:820px)').matches?' open':''}><summary>Xem nhanh · đội mẫu &amp; luật phải nhớ</summary>${prep(b.k)}</details>
   <button class="go" data-k="${b.k}">Xem cơ chế ${b.n} ở mục ④ →</button></div>`}).join('');
 // the rest of the season list: every TA / GA still to come, tap one to open its boss page
 const dd=d=>d.toLocaleDateString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',day:'2-digit',month:'2-digit'});
 document.getElementById('lsched').innerHTML='<h4>📅 Lịch TA / GA Global sắp tới</h4><div class="lsg">'+SCHED.map(x=>({...x,S:new Date(x.s),E:new Date(x.e)})).filter(x=>x.E>=now).sort((p,q)=>p.S-q.S)
  .map(x=>{const on=x.S<=now;return `<a href="#teams" class="bl ls${on?' on':''}" data-k="${x.k}" style="--c:${AR[x.a[0]][4]}"><span class="lm">${x.m} · ${on?'đang mở':'sắp tới'}</span><b>${bossImg(x.k,'Icon','bsi')}${x.n}</b>
   <span class="ld">${dd(x.S)} → ${dd(x.E)}</span><span class="la">${x.a.map(a=>`<span class="ar ${AR[a][0]}">${AR[a][1].replace('Giáp ','')}</span>`).join(' ')}</span></a>`;}).join('')+'</div>';
 document.getElementById('lupd').textContent='Giờ Việt Nam (UTC+7) · cập nhật lúc '+now.toLocaleTimeString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'});}
renderLive();
document.getElementById('lrf').addEventListener('click',renderLive);
// countdowns tick once a second only while their screen is open and the tab is visible (they were running on every screen)
setInterval(()=>{if(document.hidden||!document.querySelector('#s-raid.on'))return;const now=Date.now();let flip=false;
 document.querySelectorAll('#lgrid .cd').forEach(el=>{const ms=+el.dataset.t-now;if(ms<=0)flip=true;el.textContent=left(ms);});
 if(flip)renderLive();},1000);

// Upcoming Global banners (ba.joexyz.online, times UTC). Student: [name, ammo, armor, slot, role, Game8 tier, limited 'L'/'F'/'', verdict if not owned, reason]
const BAN=[
 {s:'2026-11-17T02:00:00Z',e:'2026-11-24T01:59:59Z',st:[
  ['Iroha (Swimsuit)','E','special','Striker','DPS','SS+','F','go','DPS Explosive đánh giáp Light, gom damage của cả đội.'],
  ['Ibuki (Swimsuit)','E','special','Special','Buffer','SS+','F','go','Buff chí mạng cho 2 người, đi cặp với Iroha (Swimsuit). Không cần UE.'],
  ['Rio','M','elastic','Special','Buffer','SS+','F','go','Chép EX của đồng đội, có mặt gần như mọi raid.'],
  ['Neru (School)','P','elastic','Striker','DPS','SS+','F','go','DPS Piercing đơn mục tiêu tốt nhất cho boss giáp Heavy.']]},
 {s:'2026-11-24T02:00:00Z',e:'2026-12-08T01:59:59Z',st:[
  ['Sena (Casual)','S','heavy','Striker','Healer','S','','maybe','Healer hồi liên tục cho Kurokage.'],
  ['Juri (Part-Timer)','M','light','Striker','Tank','A','','skip','Tank cho Hovercraft phase 1.'],
  ['Nagusa','S','elastic','Striker','DPS','ngoài top A','','skip','Không có trong bảng tier của Game8.'],
  ['Niya','S','heavy','Special','DPS','A','','skip','DPS Sonic có giảm DEF, nhưng bạn đã có Mika (Swimsuit) và Hanako (Swimsuit) mạnh hơn.']]},
 {s:'2026-12-08T02:00:00Z',e:'2026-12-22T01:59:59Z',st:[
  ['Kokoro','M','special','Striker','Buffer','SS','','go','Buffer Mystic ở slot Striker: buff EX và giảm ATK boss. Banner mở ngay trước Perorodzilla (15/12, giáp Special) nên dùng được luôn.'],
  ['Kotone','E','special','Striker','Tank','S','','maybe','Tank giáp Special, buff EX và giảm DEF. Chỉ quay nếu còn dư pyroxene sau Kokoro.']]},
 {s:'2026-12-22T02:00:00Z',e:'2027-01-05T01:59:59Z',st:[
  ['Kasumi (Swimsuit)','P','special','Special','Buffer','A','','skip','Đội Piercing của bạn đã có Himari, Fuuka (New Year), Seia.'],
  ['Seia (Swimsuit)','P','special','Striker','Buffer','SS','L','maybe','Buff EX lâu hơn Kisaki.'],
  ['Hasumi (Swimsuit)','P','light','Striker','DPS','S','L','pvp','SS+ PvP ở JP và bạn chưa có. Với raid thì chỉ tier S, không cần.'],
  ['Moe (Swimsuit)','S','special','Striker','DPS','ngoài top A','','skip','Không có trong bảng tier của Game8.'],
  ['Fubuki (Swimsuit)','E','heavy','Special','DPS','A','','skip','DPS Explosive Special; bạn đã có Hina (Dress), Iroha (Swimsuit).']]},
 {s:'2027-01-05T02:00:00Z',e:'2027-01-19T01:59:59Z',st:[
  ['Anna','P','light','Striker','DPS','A','','skip','DPS Piercing; Neru (School) và Mika đã mạnh hơn.'],
  ['Erina','S','light','Special','Buffer','A','','skip','Cấp khiên và buff ATK, chủ yếu dùng cho Tiphareth (FRR).']]},
 {s:'2027-01-19T02:00:00Z',e:'2027-02-02T01:59:59Z',st:[
  ['Tsumugi','P','special','Striker','Tank','A','','skip','Tank gây hỗn loạn, mạnh ở Chesed và PvP; bạn đã có Tsubaki.'],
  ['Eri','S','special','Striker','DPS','A','','skip','DPS Sonic; bạn đã có Mika (Swimsuit), Hanako (Swimsuit).'],
  ['Kanoe','M','heavy','Striker','Tank','S','','maybe','Tank tự giải debuff, chìa khóa Perorodzilla.'],
  ['Miyako (Swimsuit)','E','heavy','Striker','Tank','A','','skip','Tank Explosive cho Gregorius.'],
  ['Saki (Swimsuit)','E','heavy','Striker','Buffer','A','','skip','3 debuff một lượt cho Gregorius.']]},
 {s:'2027-02-02T02:00:00Z',e:'2027-02-09T01:59:59Z',st:[
  ['Marina (Qipao)','P','heavy','Striker','DPS','A','','skip','Raid chỉ tier A (PvP S). Không cần.'],
  ['Tomoe (Qipao)','M','special','Special','Buffer','S','','maybe','Gom 5 mục tiêu và buff/debuff cho đội Mystic.'],
  ['Kanna','P','heavy','Special','DPS','ngoài top A','','skip','Không có trong bảng tier của Game8.'],
  ['Noa','M','special','Striker','Buffer','A','','skip','Focus Fire và giảm DEF, dùng ở Goz.']]},
 {s:'2027-02-09T02:00:00Z',e:'2027-02-23T01:59:59Z',st:[
  ['Hifumi (Racing)','E','special','Striker','DPS','S','L','maybe','Game8: rất hợp Hina (Dress), mà bạn đã có UE 3★. Đánh dấu boss giáp Light nhận thêm damage.'],
  ['Azusa (Racing)','E','special','Special','Buffer','SS','L','go','Buffer Special đa dụng: buff damage và hồi máu diện rộng. Limited nên khó có lại.']]},
 {s:'2027-02-23T02:00:00Z',e:'2027-03-02T01:59:59Z',st:[
  ['Miyo','S','elastic','Striker','Buffer','A','','skip','Buff tốc đánh cho Yesod phase 2.'],
  ['Fuyu','S','special','Striker','Buffer','S','','maybe','Giảm DEF chỉ 2 cost và buff tốc đánh; dùng ở Hieronymus, Binah.'],
  ['Ritsu','M','special','Special','Buffer','A','','skip','Buff tốc đánh cho 1 người, chủ yếu dùng ở Set (FRR).']]}
].map(b=>({...b,S:new Date(b.s),E:new Date(b.e)}));
const VD={go:'Nên quay',pvp:'Nên quay nếu chơi PvP',maybe:'Cân nhắc',skip:'Bỏ qua'};
const ROLE={DPS:'DPS',Buffer:'Buffer',Healer:'Healer',Tank:'Tank'};
const dshort=d=>d.toLocaleDateString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',day:'2-digit',month:'2-digit'});
let BSEL=null;
function curBan(now){return BAN.findIndex(b=>b.S<=now&&now<=b.E)>=0?BAN.findIndex(b=>b.S<=now&&now<=b.E):Math.max(0,BAN.findIndex(b=>b.S>now));}
function stuRow([n,am,ar,slot,role,tier,lim,vd,why]){const own=n in OWN,T=TYPE[am],A=AR[ar];
 const v=own?`<span class="vd own">Đã có</span>${ueChip(OWN[n])}`:`<span class="vd ${vd}">${VD[vd]}</span>`;
 return `<div class="bs"><div class="nr">${avImg(n,'av-m')}<b class="stu" data-stu="${n}">${n}</b>${lim?`<span class="lim${lim==='F'?' f':''}">${lim==='F'?'FEST':'Limited'}</span>`:''}${v}</div>
  <div class="nr"><span class="tag ${T[0]}">${T[1]}</span><span class="ar ${A[0]}">${A[1]}</span><span class="slot">${slot} · ${ROLE[role]}</span><span class="tierb">Tier ${tier}</span></div>
  <div class="why">${own?'Bạn đã có, không cần quay. ':''}${why}</div></div>`;}
function renderBan(){const now=new Date(),cur=curBan(now);if(BSEL===null)BSEL=cur;
 document.getElementById('bw').innerHTML=BAN.map((b,i)=>`<button data-i="${i}" class="${i===BSEL?'on':''}${b.E<now?' past':''}">${i===cur?'● ':''}${dshort(b.S)}</button>`).join('');
 const b=BAN[BSEL],live=b.S<=now&&now<=b.E,soon=now<b.S,t=soon?b.S:b.E;
 // background: best not-yet-owned pick of this window, else its first student
 const top=b.st.find(s=>!(s[0] in OWN)&&s[7]==='go')||b.st.find(s=>!(s[0] in OWN)&&s[7]!=='skip')||b.st[0];
 document.getElementById('bcard').innerHTML=porImg(top[0],'bpg')+`<div class="bh"><b>${dshort(b.S)} → ${dshort(b.E)}</b><span class="st ${live?'on':soon?'soon':'off'}">${live?'Đang mở':soon?'Sắp mở':'Đã kết thúc'}</span></div>
  <div class="bt">${live||soon?`${soon?'Mở sau':'Còn lại'}: <span class="bcd" data-t="${t.getTime()}">${left(t-now)}</span> · `:''}Giờ VN: ${VN(b.S)} → ${VN(b.E)}</div>
  ${b.st.map(stuRow).join('')}`;
 const picks=BAN.filter(x=>x.E>=now).flatMap(x=>x.st.filter(s=>!(s[0] in OWN)&&(s[7]==='go'||s[7]==='pvp')).map(s=>`<b class="stu" data-stu="${s[0]}">${s[0]}</b> (${dshort(x.S)}${s[7]==='pvp'?', nếu chơi PvP':''})`));
 document.getElementById('bpick').innerHTML=picks.join(' → ')||'Chưa có học sinh nào đáng quay trong lịch.';}
document.getElementById('bw').addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;BSEL=+t.dataset.i;renderBan();});
renderBan();
setInterval(()=>{if(document.hidden||!document.querySelector('#s-banner.on'))return;const now=Date.now();let flip=false;
 document.querySelectorAll('#bcard .bcd').forEach(el=>{const ms=+el.dataset.t-now;if(ms<=0)flip=true;el.textContent=left(ms);});
 if(flip){BSEL=null;renderBan();}},1000);

// PvP Global (Tactical Challenge). Season start = end of Global maintenance; S11 end is an estimate (S10 lasted 168 days)
const PVS={n:11,bgm:"WE'RE CCC",t:'Ngoài trời',S:new Date('2026-09-08T06:00:00Z'),E:new Date('2027-02-23T06:00:00Z'),
 rule:['Mọi học sinh, kể cả Special và vật triệu hồi, được <b>+400% HP</b> (giống S10). Trận dài 3 phút.',
  '<b>Bản đồ không có vật cản</b>, rộng gần như hình vuông; hai đội đứng đối mặt nhau.',
  'Giữa mỗi bên có <b>thùng phuy nổ</b>: trúng đòn AoE là nổ và <b>đẩy văng</b> học sinh xung quanh, làm lệch đội hình. Đòn đơn mục tiêu không làm nổ.',
  '<b>FEVER (1 phút cuối):</b> −50% DEF, né tránh và lượng hồi nhận được (không giải được), hồi cost ×2,5.'],
 mean:['Tank gần như không chết ngay nên trận kéo dài: <b>healer và kỹ năng tính theo % HP</b> (như Eimi) mạnh lên.',
  'Không có vật cản nên hai bên <b>đứng chịu đòn rồi hồi máu</b>; AoE đánh trúng nhiều người cùng lúc rất đáng giá.',
  'Map rộng làm học sinh phụ thuộc tầm bắn, như Shun, khó trúng mục tiêu hơn.']};
// meta S11 (JP season with the same rules): [name, why, top pick]
const PVM=[['Tank',[['Eimi','Tank tốt nhất S11: tự hồi rất nhiều, HP càng cao càng lợi.',1],['Tsubaki','Taunt kéo địch về, hiếm khi chết trước FEVER.'],['Neru (Bunny)','Taunt, chịu đòn tốt.'],['Marina','Đẩy lệch vị trí địch.'],['Tsurugi','Đẩy vị trí, đánh thường trúng hàng sau.'],['Yuuka','Khiên và tự hồi.'],['Hoshino','Cứng nhất nhóm tank DEF.'],['Kanoe','Chuyên chặn Shun.']]],
 ['DPS',[['Hasumi (Swimsuit)','DPS mạnh nhất S11: EX hình quạt tầm 750, thường hạ hàng sau trong một phát.',1],['Iori (Swimsuit)','Gây Chill liên tục, bào máu tank bất kể giáp.'],['Shiroko*Terror','Damage đơn mục tiêu cực lớn, bất tử 15 giây.'],['Hanako (Swimsuit)','AoE 2 cost đánh xuyên qua tank.'],['Hoshino (Armed)','AoE, đặt ở ô số 2.'],['Shun','3,8 cost đầu trận, bắn tỉa hàng sau.'],['Haruna (New Year)','Bắn tỉa hàng sau.'],['Cherino','Đánh dấu Focus Fire lên địch ATK cao nhất.']]],
 ['Special',[['Michiru (Dress)','Special tốt nhất: giảm cost đầu trận, hồi máu 2 cost.',1],['Reisa (Magical)','Mồi nhử HP cao, hồi máu diện rộng.'],['Yakumo','Gom 5 địch vào một chỗ.'],['Iroha','AoE Mystic theo số mục tiêu, phá nhanh Reisa (Magical).'],['Utaha','4 tháp súng làm mồi nhử, kèm damage Piercing.'],['Shiroko (Swimsuit)','Tăng tốc xoay EX, giảm DEF.'],['Atsuko (Swimsuit)','Hồi máu 2 cost.']]]];
// teams built from the player's roster: [title, strikers, specials, why]
const PVT=[
 ['🛡️ Đội thủ',['Eimi','Tsubaki','Hoshino (Armed)','Hanako (Swimsuit)'],['Michiru (Dress)','Reisa (Magical)'],'Hai tank trụ tốt nhất bạn có và hai AoE đánh xuyên tank. Michiru (Dress) cho EX ra sớm, Reisa (Magical) làm mồi nhử và hồi máu. Người chơi JP khuyên luôn có <b>Eimi</b> trong đội thủ để chặn Hasumi (Swimsuit).'],
 ['⚔️ Đánh đội thường',['Eimi','Tsubaki','Kanoe','Hanako (Swimsuit)'],['Michiru (Dress)','Shiroko (Swimsuit)'],'Cùng khung với đội đánh phổ biến nhất S11 JP (Eimi, Tsubaki, Kanoe, Hasumi (Swimsuit) + Yakumo, Michiru (Dress)). Bạn chưa có Hasumi (Swimsuit) và Yakumo nên mình thay bằng Hanako (Swimsuit) và Shiroko (Swimsuit).'],
 ['⚔️ Gặp Special Iroha / Utaha',['Eimi','Tsubaki','Kanoe','Hanako (Swimsuit)'],['Michiru (Dress)','Utaha'],'Như đội trên nhưng đổi sang Utaha: tháp súng hứng đạn pháo của Iroha.'],
 ['⚔️ Gặp đội có Yakumo',['Cherino','Hoshino','Eimi','Shiroko*Terror'],['Iroha','Utaha'],'Nhiều tank nên bị gom vẫn sống; Cherino đánh dấu DPS địch cho cả đội dồn bắn; Iroha và Utaha kéo dài trận. Khung "nhiều tank + Cherino" lấy từ người chơi JP; Eimi và Shiroko*Terror là mình chọn theo roster của bạn.']];
const PVN={n:12,bgm:'Noble Hallway',t:'Trong nhà',jp:'11/11/2026',
 rule:['+200% HP (S11 là +400%); theo wiki EN, đòn <b>không khắc hệ bị giảm 50% damage</b>.','Đầu trận hai đội đứng xa nhau hơn; mỗi bên có một <b>Sweeper</b> với HP tự giảm dần.','FEVER giống S11.'],
 top:['Iroha','Marina','Shiroko*Terror','Shiroko (Swimsuit)','Hasumi (Swimsuit)','Michiru (Dress)'],
 team:[['Shiroko*Terror','Marina','Atsuko','Hasumi (Swimsuit)'],['Iroha','Michiru (Dress)']]};
const pnm=n=>n in OWN?nm(n):`<span class="chip no" data-stu="${n}">${avImg(n,'av-s')}${n}<span class="ue u0">chưa có</span></span>`;
// daily timers in UTC: tickets reset 04:00 server (UTC+9) = 19:00 UTC; daily reward from 14:00 server = 05:00 UTC
let PRW=LS.get('ba_pvp_rw','srv');
function nextUTC(h,now){const t=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate(),h));if(t<=now)t.setUTCDate(t.getUTCDate()+1);return t;}
const vnHM=d=>d.toLocaleTimeString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',hour:'2-digit',minute:'2-digit'});
function renderPvp(){const now=new Date(),s=PVS,run=Math.floor((now-s.S)/864e5),pct=Math.min(100,Math.max(0,(now-s.S)/(s.E-s.S)*100));
 const rw=nextUTC(PRW==='srv'?5:14,now),tk=nextUTC(19,now),over=now>s.E;
 document.getElementById('pgrid').innerHTML=`
 <div class="lc"><div class="mode">MÙA HIỆN TẠI<span class="st ${over?'soon':'on'}">${over?'Có thể đã sang S12':'Đang diễn ra'}</span></div>
  <h3>Season ${s.n} · ${s.t}</h3><div class="row">Nhạc nền "${s.bgm}" · đã chạy ${run} ngày</div>
  <div class="pbar"><i style="width:${pct.toFixed(1)}%"></i></div>
  <div class="when">Bắt đầu: <b>${VN(s.S)}</b><br>Kết thúc (ước tính): <b>${VN(s.E)}</b><br>
   ${over?'Đã qua mốc ước tính. Kiểm tra thông báo trong game.':`Còn khoảng: <span class="cd pcd" data-t="${s.E.getTime()}">${left(s.E-now)}</span>`}</div>
  <div class="row">Chưa có thông báo ngày kết thúc. Mình ước tính theo S10 Global (dài 168 ngày).</div></div>
 <div class="lc"><div class="mode">NHẬN THƯỞNG NGÀY<span class="st soon">Mỗi ngày</span></div>
  <h3>${vnHM(rw)} giờ VN</h3><div class="row">Pyroxene + Tactical Coin theo hạng lúc bạn bấm nhận</div>
  <div class="when">Mốc tiếp theo: <span class="cd pcd" data-t="${rw.getTime()}">${left(rw-now)}</span></div>
  <div class="row">Đánh hết vé để leo hạng rồi mới bấm nhận. ${PRW==='srv'?'Mình đang tính 14:00 giờ server (12:00 VN). Wiki EN ghi 14:00 UTC (21:00 VN).':'Đang tính theo 14:00 UTC (21:00 VN) như wiki EN.'}
   <button class="rwt" id="prw" type="button">${PRW==='srv'?'Game sáng nút lúc 21:00? Đổi':'Đổi về 12:00 VN'}</button></div></div>
 <div class="lc"><div class="mode">VÉ ĐÁNH<span class="st on">5 vé / ngày</span></div>
  <h3>Hồi vé lúc ${vnHM(tk)}</h3><div class="row">04:00 giờ server · nạp thêm 5 vé tốn 60 pyroxene</div>
  <div class="when">Hồi vé sau: <span class="cd pcd" data-t="${tk.getTime()}">${left(tk-now)}</span></div>
  <div class="row">Nhớ bấm nhận credit: kho credit PvP đầy ở 100.000.</div></div>`;
 document.getElementById('pupd').textContent='Giờ Việt Nam (UTC+7) · cập nhật lúc '+now.toLocaleTimeString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'});}
function renderPvpMeta(){const now=new Date(),s=PVS,N=PVN;
 const miss=[...new Set(PVM.flatMap(g=>g[1].map(x=>x[0])))].filter(n=>!(n in OWN)).map(n=>{
  const b=BAN.find(x=>x.E>=now&&x.st.some(z=>z[0]===n));return `<li>${pnm(n)} ${b?`· có banner Global <b>${dshort(b.S)} → ${dshort(b.E)}</b>`:'· chưa có banner trong lịch'}</li>`;}).join('');
 document.getElementById('pmeta').innerHTML=`
 <div class="lc"><h4>📜 Luật Season ${s.n}</h4><ul class="rl">${s.rule.map(x=>`<li>${x}</li>`).join('')}</ul>
  <h4>💡 Nghĩa là gì khi xếp đội</h4><ul class="rl">${s.mean.map(x=>`<li>${x}</li>`).join('')}</ul></div>
 <div class="lc"><h4>🏆 Meta S${s.n} <span class="tierb">· <span class="pstar">★</span> = mạnh nhất mỗi vai trò</span></h4>
  ${PVM.map(([g,L])=>`<div class="ptier"><b>${g}</b><div><div class="chips">${L.map(([n,,t])=>pnm(n)+(t?'<span class="pstar">★</span>':'')).join('')}</div>
   <div class="why">${L.map(([n,w])=>`<b>${n}</b>: ${w}`).join(' ')}</div></div></div>`).join('')}</div>
 <div class="lc wide"><h4>🧩 Đội gợi ý từ roster của bạn</h4>
  ${PVT.map(([t,st,sp,w])=>`<div class="pteam"><div class="k">${t}</div><div class="chips">${st.map(pnm).join('')}<span class="plus">+</span>${sp.map(pnm).join('')}</div><div class="why">${w}</div></div>`).join('')}
  <p class="sub" style="margin:6px 0 0;font-size:12.5px;color:var(--muted)">PvP đánh tự động: EX được dùng lần lượt theo thứ tự ô <b>trái → giữa → phải</b> khi đủ cost, nên xếp người cần ra EX trước vào ô bên trái. Các đội trên là mình ghép từ meta JP S11 và roster của bạn, chưa phải đội đã có người kiểm chứng trên Global. Ở hạng cao, bạn chỉ thấy Striker đầu tiên và 2 Special của đối thủ; xem đủ đội của họ trong lịch sử trận sau khi đánh.</p></div>
 <div class="lc"><h4>🎯 Học sinh meta bạn chưa có</h4><ul class="rl" style="list-style:none;padding:0">${miss}</ul>
  <div class="why" style="font-size:12.6px">Hasumi (Swimsuit) là món đáng giá nhất nếu bạn muốn leo PvP: DPS mạnh nhất S11 và vẫn ở top SS của S12 bên JP.</div></div>
 <div class="lc"><h4>🔭 Mùa tới: Season ${N.n} · ${N.t}</h4><div class="row">JP đã mở ${N.jp} ("${N.bgm}"). Global có thể theo sau khoảng tháng 2/2027.</div>
  <ul class="rl">${N.rule.map(x=>`<li>${x}</li>`).join('')}</ul>
  <div class="k" style="font-size:12px;font-weight:800;color:var(--muted)">Top S12 JP (Game8)</div><div class="chips">${N.top.map(pnm).join('')}</div>
  <div class="k" style="font-size:12px;font-weight:800;color:var(--muted)">Đội mẫu S12 của Game8</div><div class="chips">${N.team[0].map(pnm).join('')}<span class="plus">+</span>${N.team[1].map(pnm).join('')}</div></div>`;}
renderPvp();renderPvpMeta();
document.getElementById('prf').addEventListener('click',renderPvp);
document.getElementById('pgrid').addEventListener('click',e=>{if(!e.target.closest('#prw'))return;
 PRW=PRW==='srv'?'utc':'srv';LS.set('ba_pvp_rw',PRW);renderPvp();});
setInterval(()=>{if(document.hidden||!document.querySelector('#s-pvp.on'))return;const now=Date.now();let flip=false;
 document.querySelectorAll('#pgrid .pcd').forEach(el=>{const ms=+el.dataset.t-now;if(ms<=0)flip=true;el.textContent=left(ms);});
 if(flip)renderPvp();},1000);

// skill & equipment upgrade priority (Game8 早見表, stars 1–3): [EX,BS,ES,SS], [[slot1,★],[slot2,★],[slot3,★]], Game8 UE
const GROW={
 'Hina (Dress)':[[3,2,2,2],[['hat',2],['badge',1],['watch',3]],3],'Hanako (Swimsuit)':[[3,2,2,3],[['hat',2],['hairpin',1],['watch',3]],3],
 'Neru (School)':[[3,2,1,3],[['hat',2],['bag',1],['watch',3]],3],'Hoshino (Armed)':[[3,1,2,3],[['hat',3],['bag',3],['watch',3]],3],
 'Hoshino (Swimsuit)':[[3,1,2,3],[['shoes',2],['bag',3],['charm',1]],2],'Mari (Pop Idol)':[[3,2,2,1],[['shoes',2],['hairpin',1],['necklace',3]],2],
 'Kisaki':[[3,2,1,3],[['shoes',2],['badge',1],['necklace',3]],2],'Rio':[[3,2,1,3],[['shoes',3],['hairpin',2],['watch',1]],2],
 'Shiroko (Swimsuit)':[[2,2,1,3],[['hat',2],['bag',1],['watch',3]],2],
 'Mika':[[3,3,2,2],[['hat',2],['badge',1],['watch',3]],3],'Shiroko*Terror':[[3,3,1,2],[['hat',2],['badge',1],['watch',3]],3],
 'Wakamo':[[3,3,2,2],[['hat',2],['hairpin',1],['watch',3]],3],'Kokona':[[3,3,1,2],[['shoes',1],['hairpin',2],['necklace',3]],2],
 'Fuuka (New Year)':[[3,2,1,3],[['shoes',2],['badge',1],['necklace',3]],2],'Hare (Camp)':[[3,3,2,1],[['hat',2],['hairpin',3],['charm',1]],2],
 'Kayoko (New Year)':[[3,3,1,2],[['shoes',1],['hairpin',3],['charm',2]],2],'Aru (Dress)':[[3,3,1,2],[['hat',2],['hairpin',3],['necklace',1]],1],
 'Seia':[[3,3,1,2],[['shoes',2],['hairpin',3],['necklace',1]],2],'Himari':[[3,1,1,3],[['shoes',3],['hairpin',1],['watch',2]],2],
 'Ako':[[3,2,1,3],[['gloves',1],['badge',2],['necklace',3]],2],
 'Tsubaki':[[2,3,2,1],[['shoes',1],['bag',3],['charm',2]],2],'Koharu':[[3,3,1,2],[['hat',1],['hairpin',2],['necklace',3]],2],
 'Iori':[[3,2,1,2],[['hat',2],['hairpin',1],['watch',3]],2],'Aru':[[3,1,2,2],[['hat',2],['hairpin',1],['watch',3]],2],
 'Maki':[[2,3,1,2],[['gloves',2],['hairpin',1],['watch',3]],2],'Shun':[[1,3,1,2],[['gloves',2],['hairpin',1],['watch',3]],2],
 'Yuuka (Track)':[[3,3,2,1],[['shoes',1],['bag',3],['necklace',2]],2],'Mine':[[3,3,1,2],[['shoes',2],['bag',3],['charm',1]],1],
 'Midori (Maid)':[[3,2,3,1],[['hat',2],['hairpin',1],['watch',3]],2],'Cherino':[[2,1,2,3],[['shoes',3],['badge',1],['watch',2]],1],
 'Kanna (Swimsuit)':[[3,2,1,3],[['shoes',1],['hairpin',3],['charm',2]],2],'Ui':[[3,2,1,1],[['gloves',1],['hairpin',2],['charm',3]],1],
 'Aris (Maid)':[[3,3,2,1],[['hat',2],['hairpin',1],['watch',3]],2],'Atsuko':[[3,2,3,1],[['shoes',1],['badge',2],['necklace',3]],2],
 'Sakurako (Pop Idol)':[[3,1,2,3],[['gloves',2],['hairpin',1],['watch',3]],1],'Yuuka (Pajamas)':[[3,2,1,3],[['shoes',2],['bag',3],['necklace',1]],1],
 'Haruka (New Year)':[[1,2,1,3],[['shoes',3],['bag',2],['watch',1]],1]};
// newer students missing from the 早見表: Game8 individual pages (10–11/2026) give skill stars + equipment slot types only (no equipment stars)
// [EX,BS,ES,SS], slots or null (not listed), UE advice, extra note, Game8 page id
const G2={
 'Mika (Swimsuit)':[[3,2,1,3],['hat','hairpin','watch'],'giá trị rất cao','',706928],'Aris (Armed)':[[3,2,1,3],['hat','hairpin','watch'],'4★','',757167],
 'Kei':[[3,2,1,3],['shoes','hairpin','watch'],'2★','',699441],'Nagisa (Swimsuit)':[[3,2,1,3],['shoes','bag','watch'],'2★','',706927],
 'Himari (Armed)':[[3,2,1,3],['shoes','hairpin','necklace'],'2★ khi cần','',757165],'Michiru (Dress)':[[3,2,1,3],['shoes','hairpin','necklace'],'khi cần','',751066],
 'Iroha (Swimsuit)':[[3,2,1,3],['hat','badge','watch'],'4★','',801837],'Ibuki (Swimsuit)':[[3,2,1,3],['shoes','badge','necklace'],'ít nhất 2★','',801836],
 'Hikari':[[3,3,1,2],['gloves','hairpin','charm'],'2★','',683935],'Satsuki (Swimsuit)':[[3,2,1,3],['gloves','hairpin','necklace'],'khi cần','',801835],
 'Seia (Swimsuit)':[[3,3,2,1],['gloves','hairpin','necklace'],'2★','',706926],'Suzumi (Magical)':[[3,2,1,3],null,'2★ nếu nuôi','',731506],
 'Reisa (Magical)':[[3,3,2,1],null,'khi cần','',731510],'Nozomi':[[3,2,1,3],null,'khi cần','',683934],
 'Rio (Armed)':[[3,2,1,3],null,'4★ cho nội dung khó (khi cần)','',757164],'Kurumi':[[3,2,1,3],['shoes','bag','necklace'],'1★','Game8 khuyên nâng SS trước tiên.',748225],
 'Niko':[[3,2,1,3],null,'2★','',748223],'Makoto (Swimsuit)':[[3,2,1,3],null,'khi cần','',801832],
 'Tsukuyo (Dress)':[[3,2,1,3],null,'khi cần','',751063],'Sena (Casual)':[[3,3,1,2],['gloves','hairpin','necklace'],'khi cần','',670864],
 'Kanoe':[[3,2,1,3],['shoes','bag','charm'],'khi cần','Game8 khuyên nâng SS trước tiên.',710950],'Haruka (Dress)':[[3,2,1,3],null,'từ 2★, lý tưởng 4★ cho Drum','',785273],
 'Takane':[[3,2,1,3],null,'khi cần','',743682],'Misaki (Swimsuit)':[[3,2,1,3],['hat','bag','watch'],'khi cần (Gregorius Lunatic)','',714198]};
const EQ={hat:['Hat','ATK + Crit DMG (tăng damage nhiều nhất)'],gloves:['Gloves','ATK + Crit Rate + Accuracy'],shoes:['Shoes','ATK + HP'],
 bag:['Bag','HP + DEF'],badge:['Badge','HP + lượng hồi máu nhận được + né tránh'],hairpin:['Hairpin','HP + kháng CC + chút Crit Rate'],
 charm:['Charm','kháng chí mạng + chút Crit Rate'],watch:['Watch','Crit Rate + Crit DMG + HP%'],necklace:['Necklace','sức hồi máu + tăng CC + chút ATK']};
const SKN=['EX','BS (Normal)','ES (Passive)','SS (Sub)'];
// Game8 priority (1–3) -> target level. Skill breakpoints: BS/ES/SS Lv8+ and EX Lv5 need tier-4 books, Lv10 needs a Secret Note
const SKMAX=[5,10,10,10],SKLV=[[0,3,4,5],[0,4,7,10]],EQLV=['','T8','T9','T10'];
const PRI=['','Để sau','Nâng vừa','Ưu tiên'];
const skLv=(i,v)=>SKLV[i?1:0][v];
// rows sorted by priority (stable, so EX stays first on ties) with a step number
// from UE 2★ the passive becomes ES+
const skName=(i,u)=>i===2&&u>=2?'ES+ (Passive+)':SKN[i];
// short skill summaries [EX, BS, ES, SS] from Blue Archive Wiki, numbers at max level (EX Lv5, others Lv10)
const SKD={
 'Hina (Dress)':['6 cost. Vào tư thế bắn tập trung 10 giây (đứng yên), bắn 3 phát xuyên thẳng hàng; phát cuối mạnh nhất (1288%), luôn ra đủ damage.','Đầu trận: +65% hiệu quả Explosive và +Accuracy (1 lần mỗi trận).','+16% ATK, +16% tỉ lệ chí mạng.','Khi đang bắn tập trung: +64% hiệu quả Explosive, miễn khiêu khích.'],
 'Hanako (Swimsuit)':['2 cost. Phun nước hình quạt 642%. Còn nước trong thanh thì thẻ EX ở lại trên tay, dùng liền được nhiều lần.','Mỗi 30 giây: AoE tròn 225% và giảm 21% DEF trong 20 giây.','+16% ATK, +16% Crit DMG.','Đồng đội dùng EX thì nạp 40% thanh nước (tối đa 2 lần đầy); mỗi lần đầy +38% ATK 20 giây.'],
 'Neru (School)':['1 cost. Đấu tay đôi với 1 địch 70 giây và rút ngay 1 thẻ; EX đổi thành đòn 4 cost 1469% đơn mục tiêu, mỗi lần dùng +1 Khí thế (tối đa 5).','Mỗi 35 giây: +59% hiệu quả Piercing trong 25 giây.','+100 tầm bắn, +21% ATK.','+24% damage gây ra; mỗi Khí thế làm đòn EX mạnh thêm.'],
 'Hoshino (Armed)':['4 cost (kiểu Tank). Chạy tới chỗ chọn, dựng khiên làm vật cản (69% HP của Hoshino), +156% ATK 40 giây.','Mỗi 40 giây: tấm giáp giảm 24% damage nhận (mất sau 25 đòn).','+16% ATK, +16% HP.','Đánh trúng: 20% cơ hội giảm 19% DEF địch 20 giây.'],
 'Hoshino (Swimsuit)':['6 cost (Lv5 còn 5). Đồng đội quanh Hoshino +39% ATK và +99% hiệu quả Explosive trong 50 giây.','Mỗi 40 giây: bắn 1 địch 454% và tự hồi máu.','+16% DEF, +16% ATK.','Khi EX đang hiệu lực: +684 hồi cost cho đội.'],
 'Mika (Swimsuit)':['Thẻ chọn mục tiêu. Chọn bản thân (2 cost): vào tư thế liên thanh 30 giây, rút ngay thẻ EX. Chọn địch: 1571% 1 mục tiêu; trong tư thế liên thanh thẻ quay lại ngay, cost tăng dần 4 → 6 → 10.','Mỗi 40 giây: +60% hiệu quả Sonic trong 33 giây.','+100 tầm bắn, +21% ATK.','Mọi đòn luôn chí mạng; +49% hiệu quả Sonic.'],
 'Aris (Armed)':['Thẻ chọn mục tiêu, 4 cost. Chọn bản thân: rút ngay thẻ EX và nạp 1 cấp năng lượng (tối đa 2). Chọn địch: 1330% 1 mục tiêu + 200% thẳng hàng phía sau; damage x2 / x3 theo cấp năng lượng.','Hết đạn thì nạp đạn ngay, kèm 1 phát 457% vào 1 địch.','+27% ATK.','Mọi damage tính là damage EX; +40% damage gây ra, +15% damage EX.'],
 'Kei':['2 cost. Đặt máy khuếch đại vùng tròn 25 giây: đồng đội đứng trong vùng +51% ATK, +84% hiệu quả Mystic.','Máy tắt: bắn 1 địch 281% cộng 100% lượng damage máy đã tích (không chí mạng).','+27% Crit DMG.','Máy bật: đồng đội trong vùng +22% tỉ lệ chí mạng; máy tích 10% damage của đồng đội trong vùng.'],
 'Mari (Pop Idol)':['2 cost. Hồi 1 đồng đội 265% sức hồi, tự hồi 121%; hồi dư thành máu ảo (tối đa 50% HP, giảm dần). +1 Fan Service.','Mỗi 30 giây: hồi đồng đội ít máu nhất 136%.','+27% sức hồi máu.','+26% HP. Đủ 3 Fan Service: cả đội (trừ Mari) giảm 1 cost cho lần EX kế tiếp.'],
 'Kisaki':['3 cost. 1 đồng đội +81% damage EX trong 15 giây.','Mỗi 35 giây: khiên 131% sức hồi cho đồng đội ít máu nhất (17 giây).','+27% sức hồi máu.','Cả đội +20% hồi cost.'],
 'Rio':['2 cost. Rút ngay 1 thẻ, rồi chép thẻ EX của 1 đồng đội (dùng 1 lần, rẻ hơn 1 cost) và cho người đó +51% ATK 20 giây.','Mỗi 30 giây: giảm 26% DEF 1 địch 19 giây, kèm 297% damage.','+27% ATK.','Cả đội +17% ATK.'],
 'Nagisa (Swimsuit)':['3 cost. 1 đồng đội được Cost Over 26 giây (dùng EX khi thiếu tới 5 cost, trừ âm) và +79% Crit DMG.','Mỗi 35 giây: giảm 38% kháng Crit DMG của 1 địch 27 giây, kèm 376% damage.','+27% Crit DMG.','Cả đội +17% Crit DMG.'],
 'Himari (Armed)':['3 cost. Gọi xe lăn 30 giây, hồi máu vùng mỗi 3 giây (5 lần).','Khi xe xuất hiện: bắn 329% vào địch nhiều HP nhất; địch giáp Heavy nhận thêm 20% damage 28 giây.','Mỗi 7 giây: 1 đồng đội (ưu tiên người được chọn) +76% damage Piercing 12 giây.','Cả đội +20% hồi cost. Khi dùng EX: 1 đồng đội +15% Crit DMG 30 giây.'],
 'Shiroko (Swimsuit)':['3 cost. Giảm 34% DEF 1 địch 30 giây và gây 1117% damage.','Đầu trận: cả đội +22% tỉ lệ chí mạng 60 giây và giảm 1 cost cho lần EX đầu (1 lần mỗi trận).','+27% ATK.','Cả đội +20% hồi cost.'],
 'Michiru (Dress)':['2 cost. Hồi 290% sức hồi cho 1 đồng đội.','Đầu trận: đồng đội khác +22% ATK 60 giây, lần EX đầu −1 cost (1 lần mỗi trận).','+27% sức hồi máu.','Cả đội +20% hồi cost.'],
 'Iroha (Swimsuit)':['4 cost. Đánh 1674% chắc chắn chí mạng, gắn "Vali" 15 giây: damage của Partner lên địch được tích x1.5 vào vali, hết giờ hoặc EX lần sau thì vali nổ ra damage cố định.','Mỗi 35 giây: Partner và bản thân +26% ATK 30 giây.','+27% Crit DMG.','+25% ATK. Đầu trận chọn 1 Striker Crit DMG cao nhất làm Partner (ưu tiên Attacker).'],
 'Ibuki (Swimsuit)':['0 cost lần đầu: chọn tối đa 2 Striker làm "Bạn", rút ngay 1 thẻ. Sau đó EX thành 3 cost: 2 Bạn +61% Crit DMG 28 giây (có Hoa vỏ sò thì +73%). Bạn tiêu cost thì Ibuki gom vỏ sò để có Hoa.','Mỗi 30 giây buff 2 Bạn theo vai trò (Tank +DEF, Attacker +15% Crit DMG, Support hồi máu, Healer +hồi) 20 giây; 2 Bạn cùng vai trò thì x2.','+27% sức hồi máu.','Cả đội +20% hồi cost.'],
 'Mika':['6 cost. Đánh 1540% 1 địch; địch càng nhiều máu damage càng to (tới x2).','Mỗi 5 phát bắn: 169% damage; cứ 3 lần thì rơi thiên thạch thêm 339%.','+27% ATK.','Mọi đòn đều chí mạng, +24% damage gây ra, −12% damage nhận vào.'],
 'Shiroko*Terror':['3 cost. Gọi drone 40 giây: đòn thường mạnh hơn, +67% tỉ lệ chí mạng và +134% Crit DMG. Tự mất 20% máu (không chết vì cái này).','Mỗi 40 giây ném lựu đạn 704%. Khi đang có drone: mỗi lần dùng EX bắn thêm 902%.','+27% ATK.','+49% hiệu quả damage Mystic. Sắp chết thì trụ lại 15 giây (90 giây/lần).'],
 'Wakamo':['4 cost. Đánh 325% 1 địch, rồi cộng dồn damage cả đội gây lên địch đó trong 10 giây và nổ lại thành damage Mystic (tối đa 1322% ATK).','Mỗi 25 giây: 369% damage 1 địch (có đồ ái lực T2 thì 645%).','+27% ATK.','Đánh Boss: thêm 30% ATK thành damage phụ.'],
 'Kokona':['2 cost. Hồi 290% cho 1 đồng đội, tự hồi 101%. Nhận 1 tem Hanamaru.','Mỗi 100 đòn chí mạng của đội: hồi 107% cho đồng đội ít máu nhất, nhận 1 tem.','+27% sức hồi máu.','Đủ 5 tem: cả đội (trừ Kokona) −1 cost cho lần EX kế tiếp.'],
 'Hikari':['2 cost. 1 đồng đội +93% hiệu quả damage Sonic 32 giây; nếu người đó có EX tốn thêm cost thì giảm 2 cost phụ (1 lần).','Đủ 3 tín hiệu khởi hành: cả Striker +29% hiệu quả Sonic 25 giây.','+27% HP.','Đồng đội dùng 2 lần EX: Hikari +31% tốc đánh 20 giây và nhận 1 tín hiệu.'],
 'Satsuki (Swimsuit)':['2 cost. Hồi 312% cho 1 đồng đội, tự hồi 150%. Nhận 1 kem chống nắng.','Mỗi 30 giây: giảm 26% DEF 1 địch 26 giây + 315% damage. Nhận 1 kem.','+27% sức hồi máu.','Đủ 3 kem: hồi 92% cho cả Striker và +20% ATK 30 giây.'],
 'Fuuka (New Year)':['3 cost (Lv5 còn 2). Giảm tới 50% cost EX kế tiếp của 1 đồng đội và cho người đó +32% Crit DMG 35 giây.','Mỗi 60 giây: khiên 227% sức hồi cho đồng đội ít máu nhất (20 giây).','+27% sức hồi máu.','Cả đội +17% ATK.'],
 'Hare (Camp)':['2 cost. 1 đồng đội +80% ATK 26 giây. Hare nhận 5 khoai nướng (tối đa 15).','Mỗi 50 giây: đồng đội trong vùng tròn +24% ATK 30 giây.','+27% ATK.','Mỗi phát bắn khi còn khoai: thêm 98% ATK damage, tốn 1 khoai.'],
 'Kayoko (New Year)':['2 cost. 1 đồng đội +93% hiệu quả damage Mystic 40 giây và nhận bùa Omamori.','Mỗi 40 giây: 1 đồng đội +40% tỉ lệ chí mạng 25 giây.','+27% ATK.','Đội đủ 200 đòn chí mạng: Kayoko +25% ATK; ai có Omamori thêm +42% hiệu quả Mystic 50 giây.'],
 'Aru (Dress)':['3 cost. 1 đồng đội +83% Crit DMG 30 giây.','Mỗi 50 giây: hồi 151% cho đồng đội ít máu nhất.','+27% ATK.','Đòn thường 30% cơ hội giảm 15% kháng chí mạng của địch 13 giây.'],
 'Seia':['3 cost. Giảm tới 50% cost EX của 1 đồng đội (Lv5: dùng được 2 lần), Seia tự hồi cost nhanh hơn 15 giây.','Mỗi 35 giây: bản thân và 1 đồng đội +50% hiệu quả Piercing 25 giây.','+27% sức hồi máu.','Cứ 3 lần dùng EX: khiên 195% sức hồi cho Seia và người được chọn (25 giây).'],
 'Himari':['3 cost. 1 đồng đội +105% ATK 13 giây.','Mỗi 30 giây: 241% damage 1 địch, giảm 27% né tránh 23 giây.','+27% ATK.','Cả đội +20% hồi cost.'],
 'Ako':['3 cost. 1 đồng đội +40% tỉ lệ chí mạng và +73% Crit DMG trong 16 giây.','Mỗi 45 giây: hồi 245% cho đồng đội ít máu nhất.','+27% sức hồi máu.','Cả đội +17% Crit DMG.'],
 'Tsubaki':['4 cost. +45% DEF 30 giây và khiêu khích địch trong vùng tròn 6 giây.','Máu xuống 30%: tự hồi 663% (1 lần mỗi trận).','+27% DEF.','Đang nạp đạn: giảm 46% damage nhận vào.'],
 'Koharu':['3 cost. Ném lựu đạn vùng tròn: hồi đồng đội 192%, gây 431% cho địch.','Đồng đội dưới 50% máu: hồi 153% (20 giây/lần).','+27% ATK.','Mỗi 30 giây: +41% sức hồi máu 20 giây.'],
 'Iori':['3 cost. Bắn 3 phát vào 1 địch, mỗi phát 666% và lan hình nón ra phía sau.','Mỗi 25 giây: 436% damage 1 địch.','+27% độ chính xác.','Khi không núp sau vật cản: mỗi đòn thêm 43% ATK damage.'],
 'Aru':['4 cost. 521% 1 địch, thêm 554% vùng tròn quanh mục tiêu.','Mỗi 25 giây: 290% 1 địch, 50% cơ hội nổ thêm 476% vùng tròn (đồ ái lực T2: luôn nổ).','+27% Crit DMG.','EX +38% tỉ lệ chí mạng.'],
 'Maki':['5 cost. 1081% 1 địch, bản thân +55% ATK 30 giây.','Mỗi 25 giây: giảm 35% DEF 1 địch và đánh dấu 15 giây.','+27% tốc đánh.','Địch bị đánh dấu nhận thêm 28% ATK của Maki mỗi đòn.'],
 'Shun':['3 cost. 30 giây: đòn thường thành 153% damage, +24% tầm bắn, +50% tỉ lệ chí mạng (đổi lại −19% tốc đánh).','Đầu trận nhận ngay +3.8 cost (1 lần).','+27% ATK.','Đánh địch cỡ vừa: mỗi đòn thêm 96% ATK damage.'],
 'Yuuka (Track)':['3 cost. Chạy tới vị trí chọn, tự nhận khiên 320% Healing 25 giây; cắm cờ cho 3 đồng đội, ai chạy tới cờ cũng nhận khiên như vậy.','Mỗi 30 giây: chưa có khiên thì tạo khiên 220%; đang có khiên thì +23% Healing (cộng dồn 3 lần).','+27% tốc đánh.','Đứng yên: +59% hiệu quả Mystic 20 giây.'],
 'Mine':['4 cost. Nhảy tới vị trí chọn, 196% damage vùng tròn, giảm 13% né tránh và DEF 40 giây (địch cỡ vừa: giảm 33%).','Khi trạng thái "Sẵn sàng cứu hộ" kết thúc: 902% DEF thành damage vùng tròn, giảm 15% né và DEF 30 giây.','+27% HP.','Dùng EX: vào "Sẵn sàng cứu hộ", tự hồi máu liên tục 123% trong 10 giây (nếu đang có thì +37% kháng chí mạng).'],
 'Midori (Maid)':['5 cost. 1738% damage 1 địch.','Mỗi 30 giây: +49% ATK 23 giây.','+27% ATK.','Dùng EX: +57% tỉ lệ chí mạng 10 giây.'],
 'Cherino':['5 cost (7 cost khi EX dưới Lv3). 605% damage vùng tròn.','Mỗi 40 giây: đánh dấu địch ATK cao nhất cho cả đội tập trung bắn, giảm 36% kháng Crit DMG 15 giây.','+27% ATK.','+511 hồi cost, thêm +146 cho mỗi bạn Red Winter khác trong đội (tối đa 3).'],
 'Kanna (Swimsuit)':['2 cost. 927% damage 1 địch, giảm 48% DEF 20 giây.','Mỗi 40 giây: giảm 20% damage nhận vào 30 giây.','+27% HP.','Bản thân và đồng đội giáp Special +31% ATK.'],
 'Ui':['3 cost (5 cost khi EX dưới Lv3). Giảm 50% cost EX của 1 đồng đội trong 2 lần dùng kế tiếp; Ui tự +16% ATK 46 giây.','Mỗi 40 giây: đồng đội trong vùng +26% tỉ lệ chí mạng 33 giây.','+27% tỉ lệ chí mạng.','Dùng EX: +46% tốc đánh 20 giây.'],
 'Aris (Maid)':['4 cost. 1128% damage 1 địch.','Mỗi 15 đòn thường: +38% hiệu quả Mystic và +32% ATK trong 40 giây (đồ ái lực T2: thêm +23% tỉ lệ chí mạng).','+27% Crit DMG.','Đòn thường chỉ bắn 1 mục tiêu nhưng mạnh thêm 30%.'],
 'Atsuko':['4 cost. 30 giây: cứ 5 giây hồi 54% Healing cho đồng đội quanh Atsuko.','Mỗi 30 giây: thả màn khói, đồng đội trong vùng +39% né tránh 20 giây.','+27% né tránh.','Máu dưới 30%: +46% né tránh.'],
 'Sakurako (Pop Idol)':['3 cost. Bản thân và đồng đội giáp Special +24% tỉ lệ chí mạng, +45% Crit DMG trong 17 giây.','Mỗi 35 giây: +30% ATK và +30% tốc đánh 25 giây.','+27% ATK.','Bản thân và đồng đội giáp Special +31% Crit DMG.'],
 'Yuuka (Pajamas)':['2 cost. 887% damage 1 địch, giảm 23% DEF 25 giây (địch giáp Light: giảm 47%).','Mỗi 30 giây: tự hồi 115% Healing.','+27% HP.','Mỗi lần được hồi máu: +7% DEF 30 giây (cộng dồn 7 lần).'],
 'Haruka (New Year)':['4 cost. Giảm 42% kháng chí mạng và kháng Crit DMG của 1 địch trong 50 giây, gây 345% damage.','Mỗi 30 giây: giảm 31% kháng Crit DMG 1 địch 20 giây.','+27% ATK.','Cả đội +20% hồi cost.'],
 'Seia (Swimsuit)':['3 cost. 1 đồng đội khác +74% damage EX trong 25 giây.','Mỗi 12 đòn thường: hồi 103% Healing cho đồng đội ít máu nhất và cho chính mình.','+27% Healing.','Dùng EX: +31% tốc đánh 26 giây.'],
 'Suzumi (Magical)':['5 cost. Cả đội Striker (và vật triệu hồi) +51% ATK, +26% damage đòn thường / BS / SS trong 41 giây.','Mỗi 35 giây: 341% damage 1 địch, giảm 27% né tránh 27 giây.','+27% ATK.','Dùng EX: +690 hồi cost trong 35 giây (lấy lại cost rất nhanh).'],
 'Reisa (Magical)':['4 cost. Triệu hồi "Thermite Pink" ra sân 22 giây (thừa hưởng 56% HP, 43% ATK, 51% Healing của Reisa). Đồng đội quanh Pink +22% ATK và được hồi máu mỗi 4 giây.','Pink cứ 8 giây đấm 265% 1 địch và tự hồi máu; 5 cú đấm = lần EX sau rẻ hơn 3 cost và thêm +16% Crit DMG cho vùng buff.','+27% Healing.','Cả đội +17% ATK.'],
 'Nozomi':['4 cost. 1045% damage mục tiêu + 147% các địch trên đường thẳng; có thể tiêu thêm tối đa 2 cost, mỗi cost +25% damage.','Mỗi 12 đòn thường: +54% hiệu quả Sonic 26 giây.','+27% ATK.','Mọi đòn đều chí mạng; +26% tốc đánh và +26% Crit DMG.'],
 'Rio (Armed)':['4 cost. 2576% damage 1 địch (một phát cực mạnh).','Mỗi 35 giây: +42% Crit DMG 30 giây.','+27% ATK.','Đánh địch giáp Light: 20% cơ hội làm địch nhận thêm 12% damage hiệu quả trong 13 giây.'],
 'Kurumi':['3 cost. Nạp đạn ngay, dựng khiên chiến thuật 430% Healing 10 giây, chuyển sang tư thế phòng thủ (khi hết, khiên còn dư → hồi 50% thành máu).','Khi thoát tư thế phòng thủ: 401% damage 1 địch, giảm 29% kháng Crit DMG 32 giây (và làm choáng 1 địch ~3 giây).','+27% DEF.','+183 hồi cost (thêm +854 khi đang có khiên); giữ khiên ≥5 giây thì khi hết khiên cả đội Striker +34% ATK 35 giây.'],
 'Niko':['4 cost. Gỡ 1 debuff cho 1 đồng đội; đồng đội quanh Niko +49% damage EX trong 35 giây (Attacker được thêm 1 điểm "Spotting", tối đa 6).','Mỗi 35 giây: 432% damage 3 địch + đốt cháy 73% trong 20 giây.','+200 tầm bắn, +21% ATK.','Mỗi điểm Spotting trong đội: buff EX của Niko mạnh thêm 4% (tối đa 6 điểm).'],
 'Makoto (Swimsuit)':['6 cost. 275% 1 địch + nổ vùng tròn: 321% (≤2 địch) hoặc 762% (≥3 địch).','Đầu trận và mỗi 30 giây: +33% ATK 25 giây, vào trạng thái "Charisma".','+27% ATK.','+19% tỉ lệ chí mạng. Đang Charisma mà EX nhắm địch giáp Special: giảm 22% DEF địch 21 giây.'],
 'Tsukuyo (Dress)':['4 cost. Chạy tới vị trí chọn, dựng khiên làm vật cản 40 giây (thêm 40% HP của Tsukuyo); bản thân +43% tốc đánh 30 giây.','Máu dưới 40%: tạo khiên 519% Healing 30 giây (1 lần mỗi trận).','+27% HP.','Khi có khiên: tự hồi máu liên tục 37% Healing.'],
 'Sena (Casual)':['5 cost. Hồi máu liên tục 53% Healing cho đồng đội trong vùng tròn suốt 32 giây.','Mỗi 40 giây: +35% Healing và +35% tốc đánh 30 giây.','+27% ATK.','Đòn thường nổ vùng rộng gấp 2 nhưng còn 84% damage.'],
 'Kanoe':['3 cost. Tự hồi máu liên tục 96% Healing 20 giây, gỡ 1 debuff.','Mỗi 30 giây: 117% damage vùng tròn, giảm 21% kháng chí mạng địch 20 giây.','+27% HP.','+342 hồi cost, thêm +85 cho mỗi Striker giáp Heavy khác trong đội (tối đa 3).'],
 'Haruka (Dress)':['4 cost. 1245% damage 1 địch, bỏ qua 68% DEF địch; tự mất 7% HP tối đa (không làm Haruka gục).','Mỗi 35 giây: +39% ATK 30 giây và tự hồi 129% Healing (máu càng thấp hồi càng nhiều, tối đa x2).','+27% ATK.','Mỗi lần bị đánh: +10% Crit DMG 30 giây (cộng dồn 3 lần, 4 giây/lần).'],
 'Takane':['2 cost. Hồi 310% Healing cho 1 đồng đội khác + tự hồi 124%; nhận "Favorable Review" 30 giây.','Mỗi 25 giây: hồi 68% Healing cho đồng đội dưới 50% máu (máu càng thấp hồi càng nhiều, tới x3).','+27% Healing.','Khi có Favorable Review: đòn đánh +40% damage. 30% cơ hội giảm 13% kháng chí mạng địch 13 giây.'],
 'Misaki (Swimsuit)':['6 cost. Nổ vùng tròn, damage theo số debuff trên mục tiêu: ≤1 → 553%, 2–3 → 1106%, ≥4 → 1653%.','Mỗi 35 giây: 174% damage vùng tròn.','+27% ATK.','Cả đội +30% hiệu quả damage Explosive.'],
 //SKD-END
};
function skRows(s,u,n){const d=SKD[n];return s.map((v,i)=>[v,i]).sort((a,b)=>b[0]-a[0]).map(([v,i],k)=>
 `<div class="grw"><span><b class="stp">${k+1}</b>${skName(i,u)}</span><span class="lv p${v}">Lv ${skLv(i,v)}<small> / ${SKMAX[i]}</small> · ${PRI[v]}</span></div>${d&&d[i]?`<div class="skd">${d[i]}</div>`:''}`).join('');}
const skLine=s=>s.map((v,i)=>[v,i]).sort((a,b)=>b[0]-a[0]).map(([v,i])=>`${SKN[i].split(' ')[0]} Lv${skLv(i,v)}`).join(' → ');
const NAMEOF={};[SSP,SS,S,A,BC].forEach(g=>g.forEach(x=>NAMEOF[x[0].toLowerCase()]=x[0]));
// quick facts at the top of the popup: tier, ammo, slot, armor, best bosses, banner dates
const TIERG=[[SSP,'SS+'],[SS,'SS'],[S,'S'],[A,'A'],[BC,'B–C']];
const BANOF={};BAN.forEach(b=>b.st.forEach(s=>(BANOF[s[0]]=BANOF[s[0]]||[]).push([s,b])));
function stuInfo(n){const own=n in OWN,g=TIERG.find(([a])=>a.some(x=>x[0]===n)),row=g&&g[0].find(x=>x[0]===n);
 const bn=BANOF[n]||[],bs=bn[0]&&bn[0][0],st=STAT[n],T=row&&row[3]?TYPE[row[3]]:st?TYPE[st.a]:bs?TYPE[bs[1]]:null;
 const tags=[own?`<span class="tierb">Tier ${g[1]}</span>${ueChip(OWN[n])}`:`<span class="vd ${bs?bs[7]:'skip'}">Bạn chưa có</span>`,
  T?`<span class="tag ${T[0]}">${T[1]}</span>`:'',
  st?`<span class="slot">${st.k?'Striker':'Special'}</span>${posIc(st.p)}${roleIc(RLV[st.r])}${st.r2?roleIc(RLV[st.r2]):''}`:row&&row[2]?`<span class="slot">${row[2]}</span>`:bs?`<span class="slot">${bs[3]}</span>${roleIc(ROLE[bs[4]])}`:'',
  armChip(n)||(bs?`<span class="ar ${AR[bs[2]][0]}">${AR[bs[2]][1]}</span>`:'')].join(' ');
 const d=row&&row[4]?row[4]:bs?bs[8]:'';
 const ban=bn.map(([s,b])=>`🎟 Banner ${dshort(b.S)} → ${dshort(b.E)}${own?'':` · ${VD[s[7]]}`}`).join('<br>');
 return `<div class="bs ginfo"><div class="nr">${tags}</div>${d?`<div class="why">${d}</div>`:''}${bkLine(n)}${ban?`<div class="why">${ban}</div>`:''}</div>${bioHTML(n)}`;}
function uePick(n){const u=OWN[n],r=rget(n);
 return n in OWN?`<p class="gnote">Lv ${r.l} · ${r.s}★ · Kỹ năng EX ${r.k[0]} / ${r.k[1]} / ${r.k[2]} / ${r.k[3]} · <a href="#roster">sửa trong Roster</a></p>
  <h5>Mốc UE của bạn${n in UEX?' · đã sửa trên máy này':''}</h5><div class="uepick" data-n="${n}">${[0,1,2,3,4].map(v=>
  `<button type="button" data-ue="${v}" class="${v===u?'on':''}">${v?`UE ${v}★`:'Chưa UE'}</button>`).join('')}</div>`:'';}
const starHTML=n=>{if(!(n in OWN))return '<span class="vd skip">Bạn chưa có</span>';const u=OWN[n],r=TIERROW[n];
 return `<span class="st5" title="Mốc UE">${'★'.repeat(u)}${'☆'.repeat(4-u)}</span>${r?`<span class="slot">${r[2].toUpperCase()}</span>`:''}`;};
function growBody(n){const g=GROW[n],u=OWN[n];
 if(!g&&G2[n])return grow2(n,u);
 if(!g)return `<p class="gnote">Bảng Game8 (cập nhật 21/11/2025) chưa có học sinh này, nên mình chưa có thứ tự nâng đáng tin. Nguyên tắc chung: DPS nâng EX trước; buffer, healer nâng EX và skill chứa buff hoặc hồi máu trước.</p>`;
 const ord=g[1].map((x,i)=>[...x,i]).sort((a,b)=>b[1]-a[1]);
 const eq=ord.map(([k,v,i],j)=>`<div class="grw"><span><b class="stp">${j+1}</b>Ô ${i+1} · <b>${EQ[k][0]}</b> <small>${EQ[k][1]}</small></span><span class="lv p${v}">${EQLV[v]}<small> / T10</small> · ${PRI[v]}</span></div>`).join('');
 const why=`Skill: <b>${skLine(g[0])}</b>. Trang bị: <b>${ord.map(([k,v])=>`${EQ[k][0]} ${EQLV[v]}`).join(' → ')}</b>.`;
 const ueNow=u>0?`UE ${u}★`:'chưa mở UE';
 return `<p class="gwhy">${why}</p><h5>Skill · nâng theo số thứ tự</h5>${skRows(g[0],u,n)}<h5>Trang bị (Equipment) · nâng theo số thứ tự</h5>${eq}
  <p class="gnote">Game8 khuyên UE <b>${g[2]}★</b>; bạn đang ${ueNow}.${u<g[2]?' Xem mục ② để biết nên nâng lúc nào.':''}</p>`;}
function grow2(n,u){const [s,e,ue,x,id]=G2[n];
 const eq=e?e.map((k,i)=>`<div class="grw"><span>Ô ${i+1} · <b>${EQ[k][0]}</b> <small>${EQ[k][1]}</small></span><span class="lv p0">nâng đều</span></div>`).join('')
  :`<p class="gnote">Trang Game8 chưa ghi loại trang bị cho học sinh này.</p>`;
 const why=`Skill: <b>${skLine(s)}</b>.${x?' '+x:''}${e?` Trang bị: ${e.map(k=>EQ[k][0]).join(', ')}; nguồn chưa xếp ô nào trước, nên nâng đều cả 3 ô.`:''}`;
 return `<p class="gwhy">${why}</p><h5>Skill · nâng theo số thứ tự</h5>${skRows(s,u,n)}<h5>Trang bị (Equipment)</h5>${eq}
  <p class="gnote">Game8 khuyên UE: <b>${ue}</b>; bạn đang ${u>0?`UE ${u}★`:'chưa mở UE'}.</p>
  <p class="gnote">Học sinh mới, chưa có trong bảng tổng hợp: dữ liệu lấy từ <a href="https://game8.jp/blue-archive/${id}" target="_blank" rel="noopener">trang riêng trên Game8</a> (cập nhật 10–11/2026).</p>`;}
(document.getElementById('q').closest('.tools')||document.getElementById('q')).insertAdjacentHTML('afterend','<p class="ghint">🛠 Bấm vào tên hoặc ảnh của bất kỳ học sinh nào trong report để mở popup. Thẻ có 🛠 có thêm thứ tự nâng skill và trang bị.</p>');
document.querySelectorAll('#tier .scard').forEach(el=>{const n=NAMEOF[el.dataset.n];
 if(GROW[n]||G2[n])el.querySelector('.ph').insertAdjacentHTML('beforeend','<span class="gico" title="Có thứ tự nâng skill & trang bị">🛠</span>');});
document.getElementById('ttabs').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 document.querySelectorAll('#ttabs button').forEach(x=>x.classList.toggle('on',x===b));
 document.querySelectorAll('#tier .tier').forEach((t,i)=>t.style.display=b.dataset.t==='all'||+b.dataset.t===i?'':'none');});
const GM=document.getElementById('gm');
// every student name the report knows: roster + banner students, longest first so "Hina (Dress)" wins over "Hina"
const STU=[...new Set([...Object.keys(OWN),...Object.keys(BANOF)])].sort((a,b)=>b.length-a.length);
const reEsc=s=>s.replace(/[.*+?^$()|[\]\\{}]/g,'\\$&');
const STUSRC='(?<![\\p{L}\\p{N}])(?:'+STU.map(reEsc).join('|')+')(?![\\p{L}\\p{N}])';
const STU1=new RegExp(STUSRC,'u');
function stuOf(t){let el=t.closest('[data-stu]');if(el)return el.dataset.stu;
 el=t.closest('#tier [data-n]');if(el)return NAMEOF[el.dataset.n];
 el=t.closest('.chip,.nm,.calc-row');if(el){const m=el.textContent.match(STU1);return m&&m[0];}
 return null;}
const setGT=t=>{document.querySelector('#gm .gbox').dataset.t=t;
 document.querySelectorAll('#gtabs button[data-t]').forEach(x=>x.classList.toggle('on',x.dataset.t===t));document.querySelector('#gm .gpane').scrollTop=0;};
document.getElementById('gtabs').addEventListener('click',e=>{const b=e.target.closest('button[data-t]');if(b)setGT(b.dataset.t);});
function openStu(n){const gp=document.getElementById('gpor');gp.style.display='';gp.src=`Portrait_Full/${avFile(n)}.webp`;
 // the portrait stands in the room of the screen the sheet was opened from (its background picture)
 const sc=document.querySelector('.screen.on');GM.style.setProperty('--room',sc?getComputedStyle(sc).backgroundImage:'none');
 document.getElementById('gmt').textContent=n;document.getElementById('gstar').innerHTML=starHTML(n);
 document.getElementById('gmb').innerHTML=`<div class="gp-info">${stuInfo(n)}${uePick(n)}</div><div class="gp-grow">${growBody(n)}</div>`;
 setGT('info');GM.classList.add('on');}
document.addEventListener('click',e=>{const t=e.target;
 if(t.closest('.bl')){GM.classList.remove('on');return;}
 if(t.closest('#gm')){if(t===GM||t.closest('#gmx'))GM.classList.remove('on');return;}
 if(t.closest('a,button,input,textarea,select,#aro'))return;
 const n=stuOf(t);if(n)openStu(n);});
// fallback only: the bottom-sheet block below catches Esc first (capture phase) and slides the sheet away
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&GM.classList.contains('on'))GM._animClose?GM._animClose():GM.classList.remove('on');});
// save a new UE level, then reload so every section recomputes from one roster
const saveRoster=m=>{if(!LS.set('ba_ue',m)){alert('Trình duyệt đang chặn lưu dữ liệu, nên mốc UE không được lưu.');return;}
 try{sessionStorage.setItem('ba_y',String(scrollY))}catch(e){}location.reload();};
document.getElementById('gmb').addEventListener('click',e=>{const b=e.target.closest('.uepick button');if(!b)return;
 const n=b.parentElement.dataset.n;saveRoster({...UEX,[n]:+b.dataset.ue});});
try{const y=sessionStorage.getItem('ba_y');if(y!==null){sessionStorage.removeItem('ba_y');addEventListener('load',()=>scrollTo(0,+y));}}catch(e){}
// a link inside the student sheet (e.g. "sửa trong Roster") opens another screen: the sheet must not stay on top of it
addEventListener('hashchange',()=>GM.classList.remove('on'));

// ===== PHONE LOBBY FADE: scrolling down the lobby (≤900px) keeps the room in view and blurs / dims it step by step,
// so the tiles slide over a frosted room instead of a bare sky. Only transform + filter change (no re-layout), one rAF per frame.
(()=>{const mq=matchMedia('(max-width:900px)');let q=0;
 const run=()=>{q=0;const c=document.getElementById('lobbyCast'),h=document.getElementById('home');if(!c)return;
  if(!mq.matches||!h.classList.contains('on')){c.style.transform=c.style.filter='';return;}
  const y=Math.max(0,scrollY),p=Math.min(1,y/(innerHeight*.3));
  c.style.transform=`translateY(${y}px)`;c.style.filter=p?`blur(${(p*18).toFixed(1)}px) brightness(${(1-p*.35).toFixed(2)})`:'';};
 const ask=()=>{if(!q)q=requestAnimationFrame(run);};
 addEventListener('scroll',ask,{passive:true});addEventListener('resize',ask);addEventListener('hashchange',ask);mq.addEventListener('change',ask);})();
// ===== ROSTER screen (#roster): edit owned / stars / UE / level / skills of the 215 default students, then Save = reload =====
// D = the working copy (one entry per student, every field filled); only Save / Import write it to the browser.
(function(){const L=document.getElementById('rlist');if(!L)return;
 const TN=['SS+','SS','S','A','B–C'],D={},dirty=new Set();
 RALL.forEach(([n,,u])=>{const r=rget(n);D[n]={...r,k:[...r.k],u:n in OWN?OWN[n]:u};});
 // the game's rule: UE needs 5★, so stars under 5 force "no UE" and any UE means 5★
 const fix=r=>{if(r.u>0)r.s=5;if(r.s<5)r.u=0;};
 const opt=(a,v)=>a.map(([x,t])=>`<option value="${x}"${x===v?' selected':''}>${t}</option>`).join('');
 const num=(k,v,max,lab)=>`<label>${lab}<input type="number" inputmode="numeric" data-k="${k}" min="1" max="${max}" value="${v}"></label>`;
 const row=([n,t])=>{const r=D[n];return `<div class="rr${r.o?'':' off'}" data-n="${n}">
  <span class="rn">${avImg(n,'av-s')}<b>${n}</b><small>${TN[t]}</small></span>
  <label class="rown"><input type="checkbox" data-k="o"${r.o?' checked':''}>Có</label>
  <select data-k="s" aria-label="Số sao">${opt([1,2,3,4,5].map(x=>[x,x+'★']),r.s)}</select>
  <select data-k="u" aria-label="Mốc UE"${r.s<5?' disabled':''}>${opt([0,1,2,3,4].map(x=>[x,x?`UE ${x}★`:'Chưa UE']),r.u)}</select>
  ${num('l',r.l,90,'Lv')}
  <span class="rsk">${num('k0',r.k[0],5,'EX')}${num('k1',r.k[1],10,'N')}${num('k2',r.k[2],10,'P')}${num('k3',r.k[3],10,'S')}</span></div>`;};
 L.innerHTML=RALL.map(row).join('');
 const save=document.getElementById('rsave'),cnt=document.getElementById('rcnt');
 const count=()=>{const own=RALL.filter(([n])=>D[n].o).length;
  cnt.textContent=`${own}/${RALL.length} học sinh${dirty.size?` · ${dirty.size} em đã sửa, chưa lưu`:''}`;save.disabled=!dirty.size;};
 // one handler for every field; numbers are clamped to the game's limits when you leave the box
 L.addEventListener('change',e=>{const f=e.target,el=f.closest('.rr');if(!el||!f.dataset.k)return;const n=el.dataset.n,r=D[n],k=f.dataset.k;
  if(k==='o')r.o=f.checked?1:0;
  else{const v=Math.round(+f.value)||1,max=+f.max||5,c=Math.min(max,Math.max(+f.min||0,v));f.value=c;
   if(k[0]==='k')r.k[+k[1]]=c;else r[k]=c;}
  fix(r);el.querySelector('[data-k=s]').value=r.s;const us=el.querySelector('[data-k=u]');us.value=r.u;us.disabled=r.s<5;
  el.classList.toggle('off',!r.o);el.classList.add('ed');dirty.add(n);count();});
 // search + quick filters
 const q=document.getElementById('rq'),FB=[...document.querySelectorAll('#rfil button')];let fm='all';
 const show=()=>{const s=q.value.trim().toLowerCase();L.querySelectorAll('.rr').forEach(el=>{const n=el.dataset.n,r=D[n];
  const ok=(!s||n.toLowerCase().includes(s))&&(fm==='all'||(fm==='no'&&!r.o)||(fm==='noue'&&r.o&&!r.u)||(fm==='ed'&&el.classList.contains('ed')));
  el.classList.toggle('hide',!ok);});};
 q.addEventListener('input',show);
 document.getElementById('rfil').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;fm=b.dataset.f;FB.forEach(x=>x.classList.toggle('on',x===b));show();});
 // write a full roster (name -> {o,s,u,l,k}) to the browser: only differences from the defaults are kept, then reload
 const commit=M=>{const R={},U={...UEX};
  RALL.forEach(([n,,u0])=>{const r=M[n];if(!r)return;const d={};
   if(r.o!==1)d.o=0;if(r.s!==5)d.s=r.s;if(r.l!==90)d.l=r.l;if(r.k.some((v,i)=>v!==RDEF.k[i]))d.k=r.k;
   if(Object.keys(d).length)R[n]=d;if(r.u!==u0||n in UEX)U[n]=r.u;});
  if(!LS.set('ba_roster',R)||!LS.set('ba_ue',U)){alert('Trình duyệt đang chặn lưu dữ liệu, nên roster không được lưu.');return;}
  dirty.clear();location.reload();};
 save.addEventListener('click',()=>commit(D));
 // file = the whole roster in plain JSON, readable and editable by hand
 document.getElementById('rexp').addEventListener('click',()=>{
  const out={app:'schale-report',v:1,date:new Date().toISOString().slice(0,10),students:D};
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(out,null,1)],{type:'application/json'}));
  a.download=`roster-${out.date}.json`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);});
 const fin=document.getElementById('rfile');
 document.getElementById('rimp').addEventListener('click',()=>fin.click());
 fin.addEventListener('change',()=>{const f=fin.files[0];fin.value='';if(!f)return;f.text().then(t=>{
  const j=JSON.parse(t),S=j&&j.students;if(!S||typeof S!=='object')throw 0;
  // only known students, every field checked against the game's limits; anything missing keeps its current value
  const cl=(v,a,b,d)=>Number.isFinite(+v)?Math.min(b,Math.max(a,Math.round(+v))):d,M={};let hit=0;
  RALL.forEach(([n])=>{const s=S[n],r=D[n];if(!s){M[n]=r;return;}hit++;
   const k=Array.isArray(s.k)?s.k:r.k;M[n]={o:s.o===0?0:1,s:cl(s.s,1,5,r.s),u:cl(s.u,0,4,r.u),l:cl(s.l,1,90,r.l),k:[cl(k[0],1,5,5),cl(k[1],1,10,10),cl(k[2],1,10,10),cl(k[3],1,10,10)]};fix(M[n]);});
  if(!hit)throw 0;
  if(confirm(`File có ${hit} học sinh khớp với roster. Thay roster trên máy này bằng file?`))commit(M);
 }).catch(()=>alert('File không đọc được. Hãy chọn file .json được xuất từ nút "Xuất file".'));});
 document.getElementById('rreset').addEventListener('click',()=>{
  if(!confirm('Về roster mặc định? Mọi chỉnh sửa roster và mốc UE đã lưu trên máy này sẽ mất (nên Xuất file trước).'))return;
  try{localStorage.removeItem('ba_roster');localStorage.removeItem('ba_ue');}catch(e){}dirty.clear();location.reload();});
 // leaving with unsaved edits asks first
 addEventListener('beforeunload',e=>{if(dirty.size){e.preventDefault();e.returnValue='';}});
 count();})();

// search + filters (role, ammo, armor, slot, position): OR inside one row, AND between rows; empty tiers fold away
const FSEL={r:new Set(),a:new Set(),m:new Set(),k:new Set(),p:new Set()};
document.querySelectorAll('#tier .tier-badge small').forEach(s=>s.dataset.t=s.textContent);
function applyFilter(){const q=document.getElementById('q').value.trim().toLowerCase(),on=Object.values(FSEL).some(s=>s.size);let tot=0;
 document.querySelectorAll('#tier .tier').forEach(t=>{let n=0;const cs=t.querySelectorAll('[data-n]');
  cs.forEach(el=>{const d=el.dataset,mq=!q||d.n.includes(q),
   mf=!on||((!FSEL.r.size||[...FSEL.r].some(v=>(d.r||'').includes(v)))&&['a','m','k','p'].every(g=>!FSEL[g].size||FSEL[g].has(d[g])));
   el.classList.toggle('hide',!(mq&&mf));el.classList.toggle('hit',!!q&&mq&&mf);if(mq&&mf)n++;});
  tot+=n;t.classList.toggle('fempty',(on||!!q)&&!n);
  const s=t.querySelector('.tier-badge small');if(s)s.textContent=on||q?`${n}/${cs.length} em`:s.dataset.t;});
 document.getElementById('fcnt').textContent=on||q?`Hiện ${tot} học sinh`:'';
 document.getElementById('fclr').hidden=!on;}
document.getElementById('q').addEventListener('input',applyFilter);
document.getElementById('sfil').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.id==='fclr'){Object.values(FSEL).forEach(s=>s.clear());document.querySelectorAll('#sfil .fb.on').forEach(x=>x.classList.remove('on'));}
 else{const s=FSEL[b.dataset.g],v=b.dataset.v;s.has(v)?s.delete(v):s.add(v);b.classList.toggle('on',s.has(v));}
 applyFilter();});

// distribution chart
const count=(arr,u)=>arr.filter(x=>x[1]===u).length;
const groups=[SSP,SS,S,A,BC];
const ds=[[3,'UE 3★','#f5b52e'],[2,'UE 2★','#1597f0'],[1,'UE 1★','#21b37f'],[0,'Chưa mở UE','#f3a3b9']].map(([u,l,c])=>({label:l,data:groups.map(g=>count(g,u)),backgroundColor:c,borderRadius:6,borderSkipped:false}));
// label colour follows the theme (the fixed #8a94b8 was only 3:1 on the light card): light #5d7088, dark #9aa0c4.
// It watches <html data-theme>, so the theme button needs no extra code.
// Chart.js (~200 KB, the only chart on the site) is loaded ONLY when this chart comes near the screen: before, a blocking <script>
// in <head> held back the first paint of every page. Dia's CDN first, jsDelivr when opened elsewhere (GitHub Pages).
function drawDist(){const chTx=()=>document.documentElement.dataset.theme==='dark'?'#9aa0c4':'#5d7088';Chart.defaults.color=chTx();
const chart=new Chart(document.getElementById('dist'),{type:'bar',
 data:{labels:groups.map((g,i)=>['SS+','SS','S','A','B–C'][i]+` (${g.length})`),datasets:ds},
 options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,
  scales:{x:{stacked:true,grid:{color:'rgba(21,80,140,.08)'}},y:{stacked:true,grid:{display:false},ticks:{font:{weight:'600'}}}},
  plugins:{legend:{position:'bottom',labels:{usePointStyle:true,pointStyle:'rectRounded'}}}}});
new ResizeObserver(()=>chart.resize()).observe(document.querySelector('.chart-box'));
new MutationObserver(()=>{const c=chTx();Chart.defaults.color=c;const o=chart.options;
 o.scales.x.ticks.color=o.scales.y.ticks.color=o.plugins.legend.labels.color=c;chart.update('none');})
 .observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
}
{const box=document.querySelector('.chart-box');
 const add=(src,ok,no)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=no;document.head.appendChild(s);};
 const get=()=>add('https://artifactcdn.diabrowser.engineering/ajax/libs/Chart.js/chart.umd.js',drawDist,
  ()=>add('https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js',drawDist,()=>box.remove()));
 if(box)new IntersectionObserver((es,o)=>{if(es.some(e=>e.isIntersecting)){o.disconnect();get();}},{rootMargin:'300px'}).observe(box);}

// ===== metrics + stop lanes from the (possibly edited) roster =====
const fmt=n=>n.toLocaleString('vi-VN');
document.getElementById('m1').textContent=`${SSP.filter(x=>x[1]>=2).length} em đã có UE 2★ trở lên`;
document.getElementById('m2').textContent=[...SSP,...SS].filter(x=>!x[1]).length;
{const all=[SSP,SS,S,A,BC].flat(),z0=all.filter(x=>!x[1]).length;
 document.getElementById('m4').textContent=`${z0} em chưa mở UE (${Math.round(z0/all.length*100)}% roster)`;}
document.querySelectorAll('.lane[data-t] .nm').forEach(el=>{const n=el.textContent.trim(),t=+el.closest('.lane').dataset.t;
 if(OWN[n]>=t)el.textContent=n+' ✓';});
document.querySelectorAll('.lane .nm').forEach(el=>{const n=el.textContent.replace(' ✓','').trim();el.insertAdjacentHTML('afterbegin',avImg(n,'av-s'));});

// ===== Eligma plan: cumulative Eligma from 3★ to each UE level =====
const CUM=[0,900,1500,2400,3400];
const PLAN=[['Seia',1,'trước Grand Assault Binah (1/12)'],['Kayoko (New Year)',1,'trước Perorodzilla (15/12)'],['Kokona',2,'healer chính'],
 ['Neru (School)',4,'+10% damage khắc hệ'],['Hina (Dress)',4,'+10% damage khắc hệ'],['Hanako (Swimsuit)',4,'+10% damage khắc hệ'],['Mika',4,'+10% damage khắc hệ'],
 ['Aru (Dress)',1,'buffer Striker'],['Seia (Swimsuit)',1,'buffer Striker']];
function planFor(eli){let left=eli,blocked=false;
 const rows=PLAN.map(([n,t,why])=>{const cur=OWN[n]||0;
  if(cur>=t)return {n,t,why,st:'done',cost:0};
  const cost=CUM[t]-CUM[cur];
  if(!blocked&&left>=cost){left-=cost;return {n,t,why,st:'ok',cost};}
  const short=blocked?0:cost-left;blocked=true;return {n,t,why,st:short?'short':'wait',cost,short};});
 return {rows,left};}
const eliIn=document.getElementById('eli'),pyrIn=document.getElementById('pyr');
eliIn.value=LS.get('ba_eli',2595);pyrIn.value=LS.get('ba_pyr','');
function renderCalc(){const eli=Math.max(0,+eliIn.value||0),pyr=Math.max(0,+pyrIn.value||0),p=planFor(eli);
 LS.set('ba_eli',eli);LS.set('ba_pyr',pyrIn.value===''?'':pyr);
 document.getElementById('cplan').innerHTML=p.rows.map((r,i)=>`<div class="calc-row ${r.st}"><span class="i">${i+1}</span>
  <div><span class="n">${r.n} → UE ${r.t}★</span><small>${r.why}${r.st!=='done'?` · tối đa ${fmt(r.cost)} Eligma`:''}</small></div>
  <span class="k">${r.st==='done'?'✓ Đã xong':r.st==='ok'?'Nâng được':r.st==='short'?`Thiếu ${fmt(r.short)}`:'Chờ'}</span></div>`).join('');
 const nOk=p.rows.filter(r=>r.st==='ok').length;
 document.getElementById('csum').innerHTML=`Với <b>${fmt(eli)}</b> Eligma: nâng được <b>${nOk}</b> bước, còn dư <b>${fmt(p.left)}</b>.`;
 document.getElementById('m3').textContent=fmt(eli);document.getElementById('rEli').textContent=fmt(eli);
 document.getElementById('m3s').textContent=nOk?`đủ cho ${nOk} bước ở mục ②, dư khoảng ${fmt(p.left)}`:'chưa đủ cho bước kế tiếp ở mục ②';
 const pulls=Math.floor(pyr/120),nx=BAN.flatMap(x=>x.E>=new Date()?x.st.filter(s=>!(s[0] in OWN)&&s[7]==='go').map(s=>[s[0],x.S]):[])[0];
 document.getElementById('cpyro').innerHTML=pyrIn.value===''?'Nhập pyroxene để xem bạn quay được bao nhiêu lượt.':
  `${fmt(pyr)} pyroxene = <b>${pulls}</b> lượt quay (120/lượt). Mốc chắc chắn có học sinh là 200 lượt (24.000 pyroxene)${pulls>=200?': bạn đã đủ':`: còn thiếu ${fmt(24000-pyr)}`}.${nx?` Banner nên quay tiếp theo: <b>${nx[0]}</b> (${dshort(nx[1])}).`:''}`;
 if(typeof renderTasks==='function')renderTasks();}
eliIn.addEventListener('input',renderCalc);pyrIn.addEventListener('input',renderCalc);
document.getElementById('cstore').textContent=LS.set('ba_test',1)?'':'(Trình duyệt này đang chặn lưu dữ liệu: thay đổi sẽ mất khi tải lại trang.)';
document.getElementById('ureset').addEventListener('click',()=>{if(confirm('Xoá các mốc UE đã sửa trên máy này và quay về roster gốc?'))saveRoster({});});

// ===== Nhiệm vụ (replaces MomoTalk): to-do list built from the report's live data, tick to complete =====
const dark=()=>document.documentElement.dataset.theme==='dark';
const days=ms=>Math.max(0,Math.ceil(ms/864e5));
// ticks saved per task id; daily ids carry the VN date, so they reset at 0:00 VN
const tkGet=()=>{try{return JSON.parse(localStorage.getItem('ba_tasks'))||{};}catch(e){return {};}};
const tkPut=m=>{try{localStorage.setItem('ba_tasks',JSON.stringify(m));}catch(e){}};
const vnDay=()=>new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Ho_Chi_Minh'});
const TKC={daily:'Hằng ngày',raid:'Raid',banner:'Banner',ue:'Kế hoạch UE',jfd:'Joint Firing Drill'};
function taskList(){const now=new Date(),out=[];
 out.push({id:'pvp-'+vnDay(),c:'daily',t:'Đánh hết 5 vé Tactical Challenge',s:'Trước 12:00 trưa, lúc phát thưởng hạng ngày.',h:'#pvp'});
 // the two daily modes Momoka (GSC Transportation Office) hands to Sensei in the game
 out.push({id:'bounty-'+vnDay(),c:'daily',t:'Truy nã tội phạm (Bounty): dùng hết vé',s:'Momoka giao. Đánh màn cao nhất đã mở, hoặc quét nhanh; nguồn đá nâng cấp vũ khí của học sinh.',h:'#tasks'});
 out.push({id:'comm-'+vnDay(),c:'daily',t:'Ủy thác đặc biệt (Commissions): dùng hết vé',s:'Momoka giao. Ưu tiên màn tín dụng hoặc màn báo cáo kinh nghiệm, tùy bạn đang thiếu thứ nào.',h:'#tasks'});
 MODES.forEach(([md,,lab])=>{const b=pick(md,now);if(!b||now>b.E)return;const k=`${md}-${b.n}-${dshort(b.S)}`;
  if(now<b.S)out.push({id:k+'-prep',c:'raid',t:`Chuẩn bị đội cho ${lab} ${b.n}`,s:`Mở ${dshort(b.S)}, sau ${days(b.S-now)} ngày. Đọc cơ chế boss và cài thẻ mở đầu trước.`,h:'#teams'});
  else out.push({id:k+'-run',c:'raid',t:`Đánh ${lab} ${b.n}`,s:`Đang mở, còn ${days(b.E-now)} ngày.`,h:'#live'});});
 // Joint Firing Drill: only a "prep teams" task while no season is open (the player's choice: no task during the season, the
 // lobby reminds instead); the id carries the season's start date, so the tick belongs to that season only
 {const j=pick('JFD',now,JFD);if(now<j.S)out.push({id:'jfd-'+j.s.slice(0,10)+'-prep',c:'jfd',t:`Chuẩn bị 3 đội cho Joint Firing Drill · ${j.t} Exercise`,
  s:`Mở ${dshort(j.S)}, sau ${days(j.S-now)} ngày${j.p?' (dự đoán theo lịch JP)':''}. Giáp ${AR[j.a][1].replace('Giáp ','')} → mang đạn ${AR[j.a][3]}; địa hình ${JFDG[j.g].toLowerCase()}. 3 màn, mỗi màn một đội riêng.`,h:'#jfd'});}
 const nb=BAN.flatMap(x=>x.E>=now?x.st.filter(s=>!(s[0] in OWN)&&s[7]==='go').map(s=>[s[0],x]):[])[0];
 if(nb)out.push({id:'ban-'+nb[0],c:'banner',t:`Để dành pyroxene cho ${nb[0]}`,
  s:nb[1].S<=now?`Banner đang mở, tới ${dshort(nb[1].E)}.`:`Banner mở ${dshort(nb[1].S)}. Mốc chắc chắn có học sinh là 200 lượt (24.000 pyroxene).`,h:'#banners'});
 // UE steps come straight from the Eligma plan; ones already in the roster show as done and can't be unticked
 planFor(Math.max(0,+eliIn.value||0)).rows.forEach(r=>out.push({id:`ue-${r.n}-${r.t}`,c:'ue',t:`Nâng ${r.n} lên UE ${r.t}★`,ue:[r.n,r.t],lock:r.st==='done',h:'#calc',
  s:r.st==='done'?'Đã có trong roster.':`${r.why} · tối đa ${fmt(r.cost)} Eligma${r.st==='short'?` · còn thiếu ${fmt(r.short)}`:r.st==='wait'?' · chờ bước trước':''}.`}));
 return out;}
let tkCat='all';
function renderTasks(){const list=document.getElementById('tkList');if(!list)return;
 const L=taskList(),m=tkGet(),done=x=>x.lock||!!m[x.id],v=L.filter(x=>tkCat==='all'||x.c===tkCat),n=L.filter(done).length;
 list.innerHTML=v.length?v.map(x=>`<div class="tk${done(x)?' done':''}" data-id="${x.id}">
  <button type="button" class="tk-ck" aria-label="${done(x)?'Bỏ đánh dấu':'Đánh dấu hoàn thành'}"${x.lock?' disabled':''}>✓</button>
  <div class="tk-t"><span class="tk-c">${TKC[x.c]}</span><b>${x.t}</b><small>${x.s}</small></div><a class="tk-go go" href="${x.h}">Đi tới</a></div>`).join('')
  :'<p class="lnote">Mục này không còn việc nào.</p>';
 document.getElementById('tkCnt').textContent=`${n}/${L.length}`;document.getElementById('tkBar').style.width=(L.length?n/L.length*100:0)+'%';
 document.getElementById('rTask').textContent=`${n}/${L.length}`;
 {const d=document.getElementById('dTask');if(d){d.textContent=n<L.length?L.length-n:'';d.title=`Còn ${L.length-n} việc`;}}
 const t=document.getElementById('tTask');t.querySelector('.ttag').textContent=n<L.length?`Còn ${L.length-n} việc`:'Xong hết';
 t.classList.toggle('alert',n<L.length);document.getElementById('tkAll').disabled=v.every(x=>done(x)||x.ue);}
document.getElementById('tkTabs').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;tkCat=b.dataset.c;
 document.querySelectorAll('#tkTabs button').forEach(x=>x.classList.toggle('on',x===b));renderTasks();});
document.getElementById('tkList').addEventListener('click',e=>{const b=e.target.closest('.tk-ck');if(!b||b.disabled)return;
 const id=b.closest('.tk').dataset.id,x=taskList().find(y=>y.id===id);if(!x)return;
 // a UE step is real roster data: ticking it records the new UE level and recomputes the whole report
 if(x.ue){if(confirm(`Đánh dấu ${x.ue[0]} đã lên UE ${x.ue[1]}★?\nRoster và kế hoạch UE sẽ được tính lại.`))saveRoster({...UEX,[x.ue[0]]:x.ue[1]});return;}
 const m=tkGet(),on=!m[id];if(on)m[id]=1;else delete m[id];tkPut(m);renderTasks();window.tkSay&&tkSay(on?'done':'undo',x);});
document.getElementById('tkAll').addEventListener('click',()=>{const m=tkGet(),v=taskList().filter(x=>(tkCat==='all'||x.c===tkCat)&&!x.ue&&!x.lock&&!m[x.id]);
 if(!v.length)return;v.forEach(x=>m[x.id]=1);tkPut(m);renderTasks();window.tkSay&&tkSay('all',v);});
setInterval(renderTasks,60000);
renderCalc();

// ===== theme toggle (Arona light / Plana dark) =====
const thm=document.getElementById('thm');
// the button holds two vector icons (moon / sun); CSS shows the one for the theme you can switch to, so only the labels change here
const setThm=t=>{document.documentElement.dataset.theme=t;const meta=document.querySelector('meta[name="theme-color"]'),scheme=document.querySelector('meta[name="color-scheme"]');if(meta)meta.content=THC[t];if(scheme)scheme.content=t;thm.title=t==='dark'?'Giao diện Arona (sáng)':'Giao diện Plana (tối)';thm.setAttribute('aria-label',thm.title);};
setThm(document.documentElement.dataset.theme);
// the button only swaps for the current shift (not saved: the next load starts from the shift again, see the <head> script)
thm.addEventListener('click',()=>setThm(dark()?'light':'dark'));

// ===== nav: highlight the section on screen, back-to-top =====
const navA=[...document.querySelectorAll('nav.toc a')];
const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting)navA.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+en.target.id));}),{rootMargin:'-45% 0px -50% 0px'});
navA.forEach(a=>{const s=document.querySelector(a.getAttribute('href'));if(s)io.observe(s);});
const tt=document.getElementById('totop');
addEventListener('scroll',()=>tt.classList.toggle('show',scrollY>700),{passive:true});
tt.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

// ===== make student names in plain text clickable (boss guides, notes, PvP, banners...) =====
const STU_SKIP='script,style,a,button,input,textarea,select,svg,canvas,nav,h1,#gm,#aro,[data-stu],.chip,.nm,.sc,.scard,.cast,.topbar,.ttabs,.calc-row,.sources,#bsel,.uepick';
function wrapStu(root){if(!root)return;const re=new RegExp(STUSRC,'gu'),hits=[];
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:x=>{re.lastIndex=0;
  return re.test(x.nodeValue)&&!x.parentElement.closest(STU_SKIP)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});
 while(w.nextNode())hits.push(w.currentNode);
 hits.forEach(x=>{const f=document.createDocumentFragment(),s=x.nodeValue;let i=0;
  for(const m of s.matchAll(re)){f.append(s.slice(i,m.index));
   const sp=document.createElement('span');sp.className='stu';sp.dataset.stu=m[0];sp.textContent=m[0];f.append(sp);i=m.index+m[0].length;}
  f.append(s.slice(i));x.replaceWith(f);});}
wrapStu(document.body);
// parts that re-render: wrap again after each redraw
const stuMO=new MutationObserver(ms=>ms.forEach(m=>wrapStu(m.target)));
['bcard','bpick','cpyro','csum'].forEach(id=>{const el=document.getElementById(id);if(el)stuMO.observe(el,{childList:true});});

// ===== game shell: one screen at a time (hash = screen or a section inside it), student + line on the left =====
const CAST={home:['Hina (Dress)','Chào mừng trở lại, Sensei. Hôm nay mình bắt đầu từ đâu?'],
 raid:['Kisaki','Lịch Total Assault và Grand Assault đã có. Xem cơ chế boss trước khi vào trận nhé.'],
 banner:['Ibuki (Swimsuit)','Banner mới nè Sensei! Xem có nên quay không rồi hẵng tiêu pyroxene nha~'],
 pvp:['Shiroko (Swimsuit)','...Đánh hết 5 vé rồi hãy bấm nhận thưởng ngày.'],
 ue:['Seia','Eligma có hạn, Sensei. Chi theo đúng lịch raid sắp tới.'],
 tasks:['Iwabitsu Ayumu','S-Sensei… danh sách việc cần làm em xếp sẵn rồi ạ. Xong việc nào Sensei cứ bấm dấu tích nhé.'],
 students:['Hanako (Swimsuit)','Cả 215 học sinh đều ở đây. Bấm vào ai cũng xem được hồ sơ ạ.'],
 boss:['Hoshino (Armed)','Đọc kỹ mấy dòng "Bắt buộc" rồi hẵng vào trận nhé~']};
document.querySelectorAll('.screen').forEach(s=>{const k=s.dataset.cast||'home',[n,t]=CAST[k]||[],c=s.querySelector('.cast');
 // TA/GA: Rin, Kế hoạch UE: Aoi (Spine, loaded later) beside the game's dialogue box; the CAST portrait only shows if the Spine files fail
 const TK={raid:'Nanagami Rin',ue:'Oki Aoi',tasks:'Iwabitsu Ayumu',banner:'Sora',pvp:'Yuraki Momoka'}[k];
 if(TK){c.classList.add('talk');c.innerHTML=`<div class="l2d"></div><div class="dlg"><b>${TK}</b><p></p><i>▼</i></div><div class="fx"></div><button type="button" class="l2hint" title="Bấm để hiện / ẩn vùng chạm">👆 Hiện vùng chạm của ${TK.split(' ').pop()}</button>`;return;}
 // screens without a Live2D student on duty (Học sinh, Cơ chế boss, Joint Firing Drill): no static portrait any more, the content takes
 // the full width. To put a student here later: add a Spine entry in CH and the screen's key to TK above.
 if(k!=='home'){s.classList.add('nocast');c.remove();return;}
 c.innerHTML=porImg(n,'cpor')+`<div class="bubble"><b class="stu" data-stu="${n}">${n}</b>${t}</div>`;});
const SCR=[...document.querySelectorAll('.screen')];
// ----- Apple-style zoom between screens -----
// opening: the new screen grows out of the tile / dock icon / top-bar pill that was tapped; closing (back to the lobby):
// it shrinks back into the thing that opened it. The lobby keeps its scroll position so the tile is where it was.
const ZM={orig:{},tap:null,tapT:0,homeY:0,run:[],tok:0};
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(a){ZM.tap=a;ZM.tapT=performance.now();ZM.tapR=a.getBoundingClientRect();}},true);
// jump the page without the CSS smooth scrolling (html{scroll-behavior:smooth}): a page still gliding while the zoom
// measures its start / end boxes made screens opened from a scrolled lobby (PvP, UE...) grow from the middle
function zJump(y,el){const H=document.documentElement,b=H.style.scrollBehavior;H.style.scrollBehavior='auto';
 if(el)el.scrollIntoView({block:'start'});else window.scrollTo(0,y);H.style.scrollBehavior=b;}
const zScrOf=a=>{const t=a&&document.getElementById(decodeURIComponent((a.getAttribute('href')||'').slice(1)));return t&&t.closest('.screen');};
function zVis(a){if(!a||!a.isConnected)return null;const r=a.getBoundingClientRect();
 return r.width>4&&r.height>4&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth?r:null;}
const zCand=sc=>[...document.querySelectorAll('#home .tile,#dock a,.tb-res a')].filter(a=>zScrOf(a)===sc);
function zOrigin(sc){const t=ZM.tap&&performance.now()-ZM.tapT<1200&&zScrOf(ZM.tap)===sc?ZM.tap:null;
 // the tapped element's box taken at the moment of the tap = FLIP "First"
 if(t&&ZM.tapR&&ZM.tapR.width>4){ZM.orig[sc.id]=t;return ZM.tapR;}
 for(const a of [t,...zCand(sc)]){const r=zVis(a);if(r){ZM.orig[sc.id]=a;return r;}}return null;}
// closing: make sure the tile it shrinks into is on screen (scroll the lobby to it if needed), then measure it
function zTarget(sc){const o=ZM.orig[sc.id];let r=zVis(o);
 if(o&&o.isConnected&&!r){const q=o.getBoundingClientRect();if(q.width>4){zJump(scrollY+q.top-innerHeight/2+q.height/2);ZM.homeY=scrollY;r=zVis(o);}}
 if(r)return r;for(const a of zCand(sc))if((r=zVis(a)))return r;return null;}
const ZD=document.createElement('div');ZD.id='zdim';SCR[0].parentNode.appendChild(ZD);
const ZE='cubic-bezier(.32,.72,0,1)';
// TEMP iPhone Safari diagnosis (?dbg=nozoom | ?dbg=cover): measures viewport/layer rects and toggles transition modes.
const DBG=(()=>{const q=new URLSearchParams(location.search).get('dbg');if(!q)return{on:false};
 const s=new Set(q.split(',').map(x=>x.trim().toLowerCase()));
 const el=document.createElement('div');el.id='dbgBox';
 el.style.cssText='position:fixed;top:4px;right:4px;z-index:9999;pointer-events:none;background:rgba(0,0,0,.78);color:#0f0;font:10px/1.3 monospace;padding:4px 6px;border-radius:6px;white-space:pre';
 document.body.appendChild(el);
 const log=(a,b)=>{const vv=window.visualViewport;el.textContent=`dbg:${q} ih:${innerHeight} vv:${vv?Math.round(vv.height)+'+'+Math.round(vv.offsetTop):'-'}\nzf:${a?Math.round(a.getBoundingClientRect().bottom):'-'} zl:${b?Math.round(b.getBoundingClientRect().bottom):'-'}`;};
 return{on:true,nozoom:s.has('nozoom'),cover:s.has('cover'),log};})();
// ends (or aborts) the running zoom: drop every animation, unpin, and give a pinned screen that ended up current its scroll back
function zClean(){const L=ZM.live;ZM.live=null;ZM.run.forEach(a=>{try{a.cancel()}catch(_){}});ZM.run=[];
 (ZM.kids||[]).forEach(c=>c.style.transformOrigin='');ZM.kids=[];
 SCR.forEach(s=>{if((L||s.classList.contains('zleave'))&&s!==curScr)s.classList.remove('on');s.classList.remove('zleave','zmove','zfix');
  s.style.top=s.style.height=s.style.bottom=s.style.transformOrigin='';});
 ZD.classList.remove('z');window.l2dRefit&&l2dRefit();if(L&&L.a===curScr)zJump(L.y);else if(L&&L.fy!=null&&L.b===curScr)zJump(L.fy);}
function zoomScr(prev,sc,from,prevTop,prevY){
 const tb=Math.max(0,document.getElementById('topbar').getBoundingClientRect().bottom),W=innerWidth,Hv=innerHeight-tb,closing=sc.id==='home';
 const cov=DBG.cover&&matchMedia('(max-width:900px)').matches;
 // the old screen stays where it was (pinned, same scroll) while the new one zooms over it, or zooms away over the lobby
 prev.classList.add('on','zleave');prev.style.top=tb+'px';if(cov)prev.style.bottom='0px';else prev.style.height=Hv+'px';prev.scrollTop=Math.max(0,tb-prevTop);
 const mover=closing?prev:sc,back=closing?sc:prev;
 // the opening screen also becomes its own fixed, window-sized layer (like the closing one), on every device: it opens at
 // the top of the window whatever the page scroll was, and the page under it can't scroll while both are pinned
 let fixY=null;
 if(!closing){const t0=mover.getBoundingClientRect().top;fixY=scrollY;
  mover.classList.add('zfix');mover.style.top=tb+'px';if(cov)mover.style.bottom='0px';else mover.style.height=Hv+'px';mover.scrollTop=Math.max(0,tb-t0);}
 mover.classList.add('zmove');if(DBG.on)DBG.log(closing?null:mover,prev);
 const r=(closing?zTarget(prev):from)||{left:W*.3,top:tb+Hv*.35,right:W*.7,bottom:tb+Hv*.65,width:W*.4,height:Hv*.3};
 // NO scale any more: the screen keeps its real size the whole time and only its visible window (clip-path) grows from the
 // tapped tile to the full screen. Nothing is stretched or resized, so the room pictures (fixed backgrounds) stay exactly
 // as they are from the first frame to the last and there is no jump when the animation ends. Corners: clip-path round.
 const mr0=mover.getBoundingClientRect(),bw=mr0.width||W,mb=mr0.bottom||tb+Hv;
 const px=v=>Math.max(0,v).toFixed(1)+'px',rad=Math.min(18,r.height/3,r.width/3);
 let small={clipPath:`inset(${px(r.top-tb)} ${px(bw-r.right)} ${px(mb-r.bottom)} ${px(r.left)} round ${rad}px)`};
 let big={clipPath:'inset(0px 0px 0px 0px round 0px)'};
 // SHAPE MORPH for lobby tiles: the tile's shape layer leans (skewX --sk) with round corners, so the window grows out of that
 // exact rounded parallelogram into the full rectangle. Both ends are polygons with the same 16 points (4 per corner, a curve
 // through each corner; at the open end the 4 points of a corner sit on the corner = radius 0), so the browser morphs point by point.
 const ot=ZM.orig[(closing?prev:sc).id];
 if(ot&&ot.matches&&ot.matches('#home .tile')){
  const mr=mover.getBoundingClientRect(),ox=mr.left,oy=mr.top,skd=parseFloat(getComputedStyle(ot).getPropertyValue('--sk'))||0,
   T=Math.tan(-skd*Math.PI/180)*r.height/2,cr=Math.min(14,r.height/4,r.width/4);
  const poly=(C,R)=>'polygon('+C.map((c,i)=>{const p=C[(i+3)%4],n=C[(i+1)%4],u=(a,b)=>{const d=Math.hypot(b[0]-a[0],b[1]-a[1])||1;return [(b[0]-a[0])/d,(b[1]-a[1])/d];};
    const a=u(c,p),b=u(c,n),P=[c[0]+a[0]*R,c[1]+a[1]*R],Q=[c[0]+b[0]*R,c[1]+b[1]*R];
    return [0,1/3,2/3,1].map(t=>{const s=1-t;return `${(s*s*P[0]+2*s*t*c[0]+t*t*Q[0]-ox).toFixed(1)}px ${(s*s*P[1]+2*s*t*c[1]+t*t*Q[1]-oy).toFixed(1)}px`;}).join(',');}).join(',')+')';
  small={clipPath:poly([[r.left+T,r.top],[r.right+T,r.top],[r.right-T,r.bottom],[r.left-T,r.bottom]],cr)};
  big={clipPath:poly([[ox,oy],[ox+mr.width,oy],[ox+mr.width,oy+mr.height],[ox,oy+mr.height]],0)};}
 // closing runs ~20% faster than opening; opacity steps are linear so the cross-fade lands in the first / last ~120 ms
 const o={duration:closing?330:420,easing:ZE,fill:'both'},ol={...o,easing:'linear'};
 const k=(a,z)=>closing?[z,a]:[a,z],fadeIn=closing?[{opacity:1},{opacity:1,offset:.7},{opacity:0}]:[{opacity:0},{opacity:1,offset:.3},{opacity:1}];
 // the page behind only dims (opacity layer); it is not scaled, so its own fixed room picture can't glitch either
 const A=[mover.animate(k(small,big),o),mover.animate(fadeIn,ol)];
 // "zoom" feel without touching the room picture: the screen box itself never scales (its fixed background stays put), only
 // what stands inside it (student, panels) grows from ZS to full size around the tapped tile; the page behind eases back to ZB
 const ZS=.9,ZB=.96,cxr=(r.left+r.right)/2,cyr=(r.top+r.bottom)/2,kids=[];
 const grow=(s,from,to,ox,oy)=>[...s.children].forEach(c=>{if(c.id==='zdim')return;const q=c.getBoundingClientRect();if(!q.width||!q.height)return;
  c.style.transformOrigin=`${(ox-q.left).toFixed(1)}px ${(oy-q.top).toFixed(1)}px`;kids.push(c);A.push(c.animate(k({transform:`scale(${from})`},{transform:`scale(${to})`}),o));});
 grow(mover,ZS,1,cxr,cyr);grow(back,1,ZB,W/2,tb+Hv/2);ZM.kids=kids;
 ZD.classList.add('z');A.push(ZD.animate(k({opacity:0},{opacity:1}),o));
 // cross-fade: the tapped lobby tile melts away as the screen grows out of it (and comes back as the screen shrinks into it)
 const tile=ZM.orig[mover.id];
 if(tile&&tile.matches('#home .tile'))A.push(tile.animate(closing?[{opacity:0},{opacity:0,offset:.72},{opacity:1}]:[{opacity:1},{opacity:0,offset:.28},{opacity:0}],ol));
 const L={a:prev,b:sc,y:prevY,fy:fixY};ZM.live=L;ZM.run=A;
 A[0].onfinish=()=>{if(ZM.live===L)zClean();};}
// interrupting: tapping back to where the running zoom started turns it around from the exact frame it is on
function zReverse(sc){const L=ZM.live;if(!L||!ZM.run.length||sc!==(curScr===L.b?L.a:L.b))return false;
 ZM.run.forEach(a=>{const r=a.playbackRate>0?-1.25:1;a.updatePlaybackRate?a.updatePlaybackRate(r):(a.playbackRate=r);});
 curScr=sc;window.__scr=sc.id;mDuck(sc.id);return true;}
let curScr=null;
// dragging a desktop window across 900px switches to / from the narrow layout live (Dock, stacked student + panel, lobby crop):
// a running zoom is finished at once and every size-dependent part (Live2D cameras, lobby scene) is re-measured right away
{const mq=matchMedia('(max-width:900px)'),f=()=>{zClean();requestAnimationFrame(()=>dispatchEvent(new Event('resize')));};
 mq.addEventListener?mq.addEventListener('change',f):mq.addListener(f);}
function zUI(sc){document.getElementById('tbTitle').textContent=sc.dataset.title;document.getElementById('tbBack').hidden=sc.id==='home';
 document.querySelectorAll('#dock a').forEach(a=>a.classList.toggle('on',zScrOf(a)===sc));}
function route(){const h=decodeURIComponent(location.hash.slice(1))||'home';let el=document.getElementById(h),sc=el&&el.closest('.screen');
 if(!sc){sc=document.getElementById('home');el=null;}
 if(zReverse(sc)){zUI(sc);return;}
 zClean();
 const prev=curScr,moved=prev&&prev!==sc,skip=ZM.skip;ZM.skip=0;
 const anim=moved&&!skip&&!DBG.nozoom&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
 const from=anim&&sc.id!=='home'?zOrigin(sc):null,prevTop=prev?prev.getBoundingClientRect().top:0,prevY=scrollY;
 if(moved&&prev.id==='home')ZM.homeY=scrollY;
 SCR.forEach(s=>{s.classList.toggle('on',s===sc);if(moved)s.classList.toggle('nz',anim&&s===sc);});curScr=sc;
 window.__scr=sc.id;if(moved)mDuck(sc.id);if(moved&&window.l2dRefit)l2dRefit();
 zUI(sc);
 const first=sc.querySelector('.pane>*'),deep=el&&el!==sc&&el!==first,wantY=sc.id==='home'&&moved?ZM.homeY:0;
 if(moved){if(deep)zJump(0,el);else zJump(wantY);}
 else if(deep)el.scrollIntoView({block:'start',behavior:'smooth'});else scrollTo({top:0,behavior:'smooth'});
 // started in the next frame (still before it is painted), so the other hashchange handlers (lobby voice stop, greetings)
 // first see only the new screen as "on"; the scroll is set again there in case the browser moved it meanwhile
 if(anim)requestAnimationFrame(()=>{if(curScr!==sc||prev.classList.contains('on'))return;
  if(deep)zJump(0,el);else if(Math.abs(scrollY-wantY)>1)zJump(wantY);zoomScr(prev,sc,from,prevTop,prevY);});}
// Esc closes the open screen back into its tile, unless a popup (student card, help) is showing; that one closes first
addEventListener('keydown',e=>{if(e.key!=='Escape'||!curScr||curScr.id==='home')return;
 const pop=[...document.querySelectorAll('body *')].some(d=>{if(d.matches('.screen')||d.closest('#topbar,#dock,#zdim,.cast,#lobbyScene,.totop,.hud-tg'))return false;const c=getComputedStyle(d);
  if(c.position!=='fixed'||c.display==='none'||c.visibility==='hidden'||+c.opacity<.05)return false;const r=d.getBoundingClientRect();
  return r.width*r.height>innerWidth*innerHeight*.12;});
 if(!pop)location.hash='#home';},true);
addEventListener('hashchange',route);
document.getElementById('tbBack').addEventListener('click',()=>{location.hash='#home';});
// lobby tiles and top-bar numbers from the live data
// lobby cards Học sinh / Cơ chế boss: a random owned student and a random boss, drawn once per page load (fillShell re-runs on
// every Eligma keystroke, so the pick is kept). The boss avoids the one on the TA·GA card. A student without a Portrait_Full file
// draws again (5 tries), then the picture is dropped like any missing portrait.
const lbRnd=a=>a[Math.random()*a.length|0],lbPool=Object.keys(OWN);
const lbStu=lbRnd(lbPool)||'Hanako (Swimsuit)';let lbBoss=null;
function lbStuErr(el){const t=+(el.dataset.t||0);if(t>=5){el.remove();return;}el.dataset.t=t+1;el.src=`Portrait_Full/${avFile(lbRnd(lbPool))}.webp`;}
function fillShell(){const now=new Date();
 document.getElementById('rStu').textContent=Object.keys(OWN).length;
 const when=(b,on)=>on?`còn ${days(b.E-now)} ngày`:now<b.S?`mở sau ${days(b.S-now)} ngày`:'đã kết thúc';
 // the raid the lobby card / top bar feature: whichever of TA, GA and Limit Break Raid comes first for the player. Open beats
 // coming, coming beats ended; between two of the same kind, the nearer date wins. The runner-up goes in the card's sub line.
 const rk=(b,on)=>on?[0,b.E]:now<b.S?[1,b.S]:[2,-b.E];
 const RAIDS=MODES.map(([m])=>{const b=pick(m,now);return b&&[b,now>=b.S&&now<=b.E,m];}).filter(Boolean)
  .sort((p,q)=>{const a=rk(p[0],p[1]),c=rk(q[0],q[1]);return a[0]-c[0]||a[1]-c[1];});
 const [fr,fl,fm]=RAIDS[0],other=RAIDS[1],anyOn=RAIDS.some(x=>x[1]);
 document.getElementById('rTA').textContent=`${fm} ${fr.n} · ${when(fr,fl)}`;
 const nb=BAN.flatMap(x=>x.E>=now?x.st.filter(s=>!(s[0] in OWN)&&s[7]==='go').map(s=>[s[0],x]):[])[0];
 document.getElementById('rBan').textContent=nb?`${nb[0]} · ${dshort(nb[1].S)}`:'Chưa cần quay';
 const T=id=>document.getElementById(id),dot=el=>el.querySelector('.dot')||el.insertAdjacentHTML('beforeend','<span class="dot"></span>');
 // fillShell runs on every keystroke in the Eligma box: rebuild a card's picture only when it is a different picture
 // (rewriting innerHTML re-downloads/decodes the images and drops the scene image lobbyBG added)
 const pic=(el,h)=>{const g=el.querySelector('.tbg');if(g.dataset.p!==h){g.dataset.p=h;g.innerHTML=h;}};
 const r=T('tRaid');pic(r,bossLobby(fr.k));
 r.querySelector('.ttag').textContent=fl?`${fm} · còn ${days(fr.E-now)} ngày`:now<fr.S?`${fm} · mở sau ${days(fr.S-now)} ngày`:'';
 r.querySelector('small').textContent=`${fm} ${fr.n}: ${when(fr,fl)}`+(other?` · ${other[2]} ${other[0].n}: ${when(other[0],other[1])}`:'');if(anyOn)dot(r);
 const cb=BAN[curBan(now)],bl=cb.S<=now&&now<=cb.E,top=cb.st.find(s=>!(s[0] in OWN)&&s[7]==='go')||cb.st[0],b=T('tBan');
 pic(b,porImg(top[0],''));b.querySelector('.ttag').textContent=bl?`Còn ${days(cb.E-now)} ngày`:`Mở sau ${days(cb.S-now)} ngày`;
 b.querySelector('small').textContent=cb.st.map(s=>s[0]).join(' · ');if(bl)dot(b);
 // Dock badges (phone): days left of the open raid / banner, roster size
 const dl=RAIDS.filter(x=>x[1]).map(x=>days(x[0].E-now)),sb=(id,v,t)=>{const e=T(id);if(e){e.textContent=v;e.title=t||'';}};
 sb('dTA',dl.length?Math.min(...dl):'',dl.length?`Raid đang mở, còn ${Math.min(...dl)} ngày`:'');
 sb('dBan',bl?days(cb.E-now):'',bl?`Banner đang mở, còn ${days(cb.E-now)} ngày`:'');
 sb('dStu',Object.keys(OWN).length,'Học sinh trong roster');
 const p=T('tPvp');pic(p,porImg('Shiroko*Terror',''));p.querySelector('.ttag').textContent=`Season ${PVS.n}`;
 pic(T('tStu'),`<img class="" src="Portrait_Full/${avFile(lbStu)}.webp" alt="" loading="lazy" onerror="lbStuErr(this)">`);
 const u=T('tUe'),f=planFor(Math.max(0,+eliIn.value||0)).rows.find(x=>x.st==='ok');pic(u,porImg('Seia',''));
 u.querySelector('.ttag').textContent=f?`Tiếp: ${f.n} UE ${f.t}★`:'';
 if(!lbBoss){const o=BOSS_KEYS.filter(k=>k!==fr.k);lbBoss=lbRnd(o.length?o:BOSS_KEYS);}
 pic(T('tBoss'),bossLobby(lbBoss));
 lobbyBG();}
// lobby boss cards: the same Boss_Portrait <img> the rest of the page uses (bossImg, with its own file-name map and fallback),
// tagged class "strip" so the lobby CSS can frame it on the boss's face
function bossLobby(k){return bossImg(k,'Portrait','').replace(/<img\b/,'<img data-strip="1"');}
// scene behind the lobby cards (wiki "Background images"): [day, night]; night shows in dark mode. Local copy BG/<file>.jpg first
// (get_bg.ps1 downloads them, needed for GitHub Pages), the wiki's image server as fallback (hash path read from each file page).
const LBG={tStu:['4/4b/BG_ClassRoom','9/94/BG_ClassRoom_Night'],tBoss:['4/41/BG_AbydosRuinArea','0/04/BG_AbydosRuinArea_Night'],
 tTask:['2/29/BG_CityOffice','c/c7/BG_CityOffice_Night'],tLock:['5/59/BG_183LabRoom_Night_Off'],tOrd:['6/63/BG_Arcade'],tSrv:['4/4b/BG_ClassRoom','9/94/BG_ClassRoom_Night']};
const bgI=(f,c)=>`<img class="bgi${c}" alt="" loading="lazy" decoding="async" src="BG/${f.split('/').pop()}.jpg" onerror="this.onerror=null;this.src='https://static.wikitide.net/bluearchivewiki/${f}.jpg'">`;
function lobbyBG(){for(const id in LBG){const g=document.querySelector('#'+id+' .tbg');if(!g||g.querySelector('.bgi'))continue;
 const[d,n]=LBG[id];g.insertAdjacentHTML('afterbegin',n?bgI(d,' day')+bgI(n,' night'):bgI(d,''));}}
fillShell();eliIn.addEventListener('input',fillShell);
// ===== Joint Firing Drill card on the lobby (the old locked BETA tile); schedule JFD / JFDG is defined next to SCHED =====
// The card follows the real clock: checked every second while the lobby is on screen (so it opens / locks right on time), but the
// DOM is only written when a string changes. The time left is shown to the minute on purpose: the auto-compact and icon scripts
// watch the tiles' text, a per-second number would make them re-measure the lobby every second.
const jfdTile=(()=>{const t=document.getElementById('tLock');if(!t)return ()=>{};const tag=t.querySelector('.ttag'),lab=t.querySelector('.tlab');
 const put=(el,v)=>{if(el&&el.textContent!==v)el.textContent=v;};let key='';
 return ()=>{const now=new Date(),b=pick('JFD',now,JFD),on=now>=b.S&&now<=b.E,soon=now<b.S;
  // rebuild the card only when the season or its state changes
  const k=b.s+(on?1:soon?0:2);
  if(k!==key){key=k;t.classList.toggle('lock',!on);t.classList.toggle('open',on);
   const arm=AR[b.a][1].replace('Giáp ',''),gn=JFDG[b.g],pr=b.p?' (dự đoán theo lịch JP)':'';
   lab.innerHTML=`<b>${on?b.t:'Joint Firing Drill'}</b><small></small>`;
   t.title=on?`Joint Firing Drill · ${b.t} Exercise · giáp ${arm} · ${gn}\n${VN(b.S)} → ${VN(b.E)} (giờ VN)`
    :soon?`Joint Firing Drill · đợt sau: ${b.t} Exercise, mở ${VN(b.S)} (giờ VN)${pr}`:'Joint Firing Drill · chưa có lịch đợt mới';
   tag.textContent=on?'Đang mở':'';
   const d=t.querySelector('.dot');if(on&&!d)t.insertAdjacentHTML('beforeend','<span class="dot"></span>');else if(!on&&d)d.remove();}
  // left() = "6 ngày 17:06:12"; the seconds are cut (see above)
  put(lab.querySelector('small'),on?'còn '+left(b.E-now).slice(0,-3):soon?`mở sau ${days(b.S-now)} ngày`:'chưa có lịch');};})();
jfdTile();
// ===== Joint Firing Drill guide screen (#jfd, opened from the lobby card) =====
// Terrain grade of every roster student: Blue Archive Wiki "Characters" table (read 24/11/2026), wiki names mapped to the Global
// ones used here. 3 letters = Đô thị · Ngoài trời · Trong nhà (the table's three terrain columns, in that order).
const JTR={};('Hina (Dress):DAS|Hanako (Swimsuit):SAD|Neru (School):SAD|Hoshino (Armed):ASD|Hoshino (Swimsuit):SAD|Mika (Swimsuit):SAD|Aris (Armed):SDA|Kei:SDA'
 +'|Mari (Pop Idol):DSB|Kisaki:BDS|Rio:ADS|Nagisa (Swimsuit):SAD|Himari (Armed):BDS|Shiroko (Swimsuit):BSD|Michiru (Dress):DBS|Iroha (Swimsuit):SAD|Ibuki (Swimsuit):SAD'
 +'|Mika:DAS|Shiroko*Terror:DSA|Wakamo:ADS|Kokona:SBD|Hikari:DBS|Satsuki (Swimsuit):SBD|Fuuka (New Year):BDS|Hare (Camp):DSB|Kayoko (New Year):BDS|Aru (Dress):DBS'
 +'|Seia:BDS|Seia (Swimsuit):SBD|Suzumi (Magical):SDB|Himari:SBD|Ako:DBS|Reisa (Magical):SDB'
 +'|Tsubaki:AAD|Koharu:DSB|Iori:CCS|Aru:SBD|Nozomi:DBS|Maki:CSC|Rio (Armed):SBD|Shun:SBD|Kurumi:SBD|Niko:SDB|Makoto (Swimsuit):BDS|Tsukuyo (Dress):DSB|Yuuka (Track):BDS'
 +'|Mine:BSD|Midori (Maid):DSB|Cherino:BSD|Kanna (Swimsuit):DSB|Ui:BSD|Aris (Maid):SBD|Atsuko:BDS|Sakurako (Pop Idol):DSB|Yuuka (Pajamas):DSB|Sena (Casual):SBD|Kanoe:DBS'
 +'|Haruka (Dress):SBD|Haruka (New Year):CSC|Takane:BDS|Misaki (Swimsuit):DBS'
 +'|Yuuka:BBA|Momoi:AAD|Utaha:ADA|Koharu (Swimsuit):BBB|Serina:ACB|Eimi:SBD|Hanako:ADA|Mari:DAA|Ibuki:CBA|Hibiki:SBB|Iroha:DBS|Haruna (New Year):DSB|Tsurugi:DBS'
 +'|Toki (Armed):ABC|Mine (Pop Idol):BBB|Konoka:SBD|Natsu:DBS|Akane:AAD|Kotama:ACB|Shigure (Hot Spring):BDS|Noa:DBS|Kaede:SDB|Saki:SDB|Miyo:SDB|Reisa:DBS|Neru:DSB'
 +'|Miyako:SDB|Miyako (Swimsuit):DBS|Hinata:DSB|Tsukuyo:BDS|Kazusa:SDB|Natsu (Band):BSD|Juri (Part-Timer):BSD|Asuna (School):BSD|Rabu:ABC|Ui (Swimsuit):BDS'
 +'|Saki (Swimsuit):DBS|Eimi (Swimsuit):DSB|Chinatsu (Hot Spring):DBS|Serina (Christmas):DSB|Nodoka (Hot Spring):BDS|Shizuko (Swimsuit):BBB|Atsuko (Swimsuit):BBB'
 +'|Ayane (Swimsuit):CAB|Akari (New Year):BSD|Kirino (Swimsuit):BBB|Karin (School):BAC|Akane (School):SBD|Ichika (Swimsuit):ABC|Erika:SBD|Tomoe (Qipao):DBS|Saya (Casual):DSB'
 +'|Hasumi (Track):BCA|Hifumi:DSB|Mutsuki:AAD|Midori:BSD|Haruka:CBA|Kayoko:ADA|Junko:BAB|Azusa:BDS|Airi:ADA|Yoshimi:BBB|Momiji:AAD|Pina:ABC|Chinatsu:BBB|Chise:ADA'
 +'|Hina:SCC|Hasumi:BAB|Akari:ABB|Fuuka:AAD|Ayane:DAA|Hanae:ADA|Shizuko:AAB|Suzumi:BBB|Sumire:BDS|Serika:ADA|Asuna (Bunny):DBS|Kotori:BBB|Shimiko:CAB|Haruna:SDB'
 +'|Hoshino:DSB|Izuna:SBD|Shun (Small):SDB|Aoba:BCA|Kirino:DAA|Nonomi:AAD|Mimori:SDB|Airi (Band):BAD|Shiroko:SBD|Asuna:BBB|Saori (Swimsuit):DSB|Sena:BSD|Juri:CBA'
 +'|Hare:ABB|Mashiro:BSD|Renge:SBD|Kanna:SDB|Chiaki:SDB|Reijo:DSB|Meru:BSD|Mina:DBS|Rumi:CCS|Nonomi (Swimsuit):SDB|Ichika:SBD|Megu:DSB|Miyu:SBD'
 +'|Kotori (Cheer Squad):DBS|Haruna (Track):SBD|Wakamo (Swimsuit):SDB|Miyu (Swimsuit):CBA|Akane (Bunny):BDS|Izumi:SDB|Junko (New Year):BBB|Kaho:BSD'
 +'|Hiyori (Swimsuit):DSB|Hifumi (Swimsuit):DBS|Toki (Bunny):BSD|Kotama (Camp):BSD|Sakurako:DSB|Nodoka:BBB|Shigure:DSB|Serika (New Year):CCS|Hiyori:BDS'
 +'|Yuzu (Maid):BCA|Saori:BDS|Umika:BSD|Yuzu:SBD|Mimori (Swimsuit):BDS|Saya:BDS|Karin:DSB|Misaki:BDS|Momoi (Maid):DSB|Moe:DBS|Serika (Swimsuit):DBS|Yukari:SBD'
 +'|Tsubaki (Guide):DSB|Saori (Dress):DBS|Shiroko (Cycling):SBD|Aris:BDS|Chihiro:SDB|Yukari (Swimsuit):DBS|Moe (Swimsuit):DBS|Kasumi:SBD|Nagusa:SBD|Koyuki:SDB'
 +'|Utaha (Cheer Squad):DBS|Izumi (Swimsuit):BAC|Tsurugi (Swimsuit):BCA|Tomoe:CBA|Fubuki:ABC|Michiru:BBB|Renge (Swimsuit):ABC|Chiaki (Swimsuit):BAC|Otogi:BBB')
 .split('|').forEach(p=>{const i=p.lastIndexOf(':');JTR[p.slice(0,i)]=p.slice(i+1);});
const JGI={urban:0,outdoor:1,indoor:2},JGR={S:4,A:3,B:2,C:1,D:0},JGE={indoor:'🌙',outdoor:'☀',urban:'🌐'};
// the 4 exercise types (wiki "Exercises" section): [name, Vietnamese name, how it plays]
const JTYPE=[['Shooting','Bắn bia','3 boss xuất hiện lần lượt; hạ con trước mới tới con sau. Cần DPS đơn mục tiêu mạnh.'],
 ['Defense','Phòng thủ','Địch tràn theo từng đợt như màn Ruins của Commissions. Đợt mới tới khi số địch còn ≤ 128, 120, 102, 82, 62 và 40: cần AoE dọn nhanh.'],
 ['Assault','Đột phá','3 đợt địch, mỗi đợt có 1 totem. Hồi máu cho totem để chồng debuff "nhận thêm damage" lên toàn bộ địch (tối đa 10 tầng): cần healer.'],
 ['Escort','Hộ tống','1 đợt địch nhắm vào Avant Garde-kun (robot phe mình). Avant Garde-kun gục là thua màn: cần giữ nó sống và hạ địch thật nhanh.']];
// reward milestones (wiki table): score reached -> coins added; the running total is worked out below
const JRW=[[0,40],[5500,10],[20300,5],[35100,5],[49900,5],[64700,5],[79500,5],[94300,5],[104950,5],[123900,5],[138700,5],[153500,5],[167570,5],
 [170250,5],[197900,5],[212700,5],[227500,5],[236500,5],[239000,5],[241500,5]];
// ammo that hits the season's armor for 200% (Corrosive left out: no student uses it yet)
const jAmmo=a=>Object.keys(MTX).find(k=>k!=='C'&&MTX[k][a]===200);
// suggested team (under the season card): the 6 best roster students per group with grade S / A on the season's terrain; damage dealers and supports must use
// the ammo that counters the armor, tanks / healers only need the terrain. Sorted by grade, then by the season's school bonus.
function jfdTeam(b,am){const gi=JGI[b.g],grade=n=>(JTR[n]||'')[gi]||'',sc=n=>JGR[grade(n)]??-1;
 const sch=n=>{const x=BIO[n.replace(/ \(.*\)$/,'')];return !!(b.sch&&x&&b.sch.includes(x[2]));};
 const L=Object.keys(STAT).filter(n=>n in OWN&&sc(n)>=3),srt=f=>L.filter(f).sort((x,y)=>sc(y)-sc(x)||sch(y)-sch(x)||x.localeCompare(y)).slice(0,6);
 const chip=n=>`<span class="jc">${pnm(n)}<i class="jgr g${grade(n)}" title="Địa hình ${JFDG[b.g]}: ${grade(n)}">${grade(n)}</i>${sch(n)?'<i class="jsb" title="Được buff Mystic ở phase 3–4">+100%</i>':''}</span>`;
 const G=[[`Striker gây damage · <span class="tag ${AM[am][0]}">${AM[am][1]}</span>`,n=>STAT[n].a===am&&STAT[n].k&&STAT[n].r==='A'],
  [`Special gây damage · <span class="tag ${AM[am][0]}">${AM[am][1]}</span>`,n=>STAT[n].a===am&&!STAT[n].k&&STAT[n].r==='A'],
  [`Hỗ trợ cùng hệ · <span class="tag ${AM[am][0]}">${AM[am][1]}</span>`,n=>STAT[n].a===am&&'SX'.includes(STAT[n].r)],
  ['Tank &amp; healer hợp địa hình (mọi hệ đạn)',n=>'TH'.includes(STAT[n].r)]];
 return `<div class="jgrid">${G.map(([h,f])=>{const X=srt(f);return `<div class="jk"><h4>${h}</h4><div class="chips">${X.length?X.map(chip).join(''):'<span class="lnote">Roster chưa có ai hợp.</span>'}</div></div>`;}).join('')}</div>
  <p class="lnote">Lọc tự động từ roster và bảng địa hình của wiki, chưa phải đội đã có người kiểm chứng.${b.u?' Giáp và địa hình của đợt này lấy từ ghi chú bàn giao, chưa kiểm tra: xem lại trong game trước khi xếp đội.':''}</p>`;}
// fills the tabs that depend on the season (on = a season is running, else b = the next one). "Mùa này" = the season card
// (armor, terrain, ammo to bring, phase rules, time limits) with the suggested team right under it
function jfdFill(b,on){const $=id=>document.getElementById(id),am=jAmmo(b.a);
 $('jfdType').innerHTML=JTYPE.map(([k,v,d])=>`<div class="jk${k===b.t?' now':''}"><h4>${k} Exercise · ${v}${k===b.t?` <span class="st ${on?'on':'soon'}">${on?'Đang mở':'Đợt sau'}</span>`:''}</h4><p>${d}</p></div>`).join('')
  +'<div class="jk"><h4>📜 Luật chung</h4><ul><li>Mỗi đợt cố định <b>1 địa hình</b> và <b>1 loại giáp địch</b>.</li><li>Phase càng cao càng có thêm luật đặc biệt (tối đa 2 luật), có thể buff hoặc phạt đội bạn.</li></ul></div>';
 $('jfdNow').innerHTML=`<div class="jk now"><h4>${JGE[b.g]} ${on?'Đang mở':'Đợt sau'}: ${b.t} Exercise${b.n?' '+b.n:''} · <span class="ar ${AR[b.a][0]}">${AR[b.a][1]}</span> · ${JFDG[b.g]}</h4>
   <p>Mang đạn <span class="tag ${AM[am][0]}">${AM[am][1]}</span> (200% lên giáp ${AR[b.a][1].replace('Giáp ','')}) và học sinh bậc <b>S / A</b> ở địa hình ${JFDG[b.g].toLowerCase()}. Cần <b>3 đội riêng</b> cho 3 màn, nên chia đều người mạnh ra 3 đội.</p>
   ${b.r?`<ul>${b.r.map(x=>`<li>${x}</li>`).join('')}</ul>${b.tm?`<p>Giới hạn giờ: phase 1–4 lần lượt <b>${b.tm.join(' · ')}</b>.</p>`:''}`:'<p>Chưa có luật chi tiết của đợt này trên wiki.</p>'}
   ${b.sch?`<p>Ô hồng <i class="jsb">+100%</i> trong đội gợi ý = học sinh ${b.sch.join(' / ')}, được buff Mystic ở phase 3–4.</p>`:''}</div>`;
 $('jfdTeam').innerHTML=on?jfdTeam(b,am):`<div class="jk"><h4>🔒 Chưa có đợt mở</h4><p>Đội gợi ý chỉ hiện khi có đợt đang mở. Đợt sau mở ${VN(b.S)} (giờ VN)${b.p?', dự đoán theo lịch JP':''}.</p></div>`;
 let sum=0;$('jfdRw').innerHTML=`<div class="jgrid"><div class="jk"><h4>🪙 Nhận gì</h4><p>Xong một lượt là nhận <b>Firepower Exercise Coin</b> theo tổng điểm: xong lượt là có ít nhất 40 coin, tối đa <b>140 coin</b> ở 241.500 điểm.</p></div>
  <div class="jk"><h4>🛒 Shop</h4><p>Coin đổi được <b>mảnh (Eleph) của một số học sinh</b>, <b>Tailor Stone</b> và nguyên liệu kỹ năng. Hàng trong shop làm mới mỗi tháng; xem shop trong game để biết học sinh nào đang bán.</p></div></div>
  <div class="jk"><h4>📈 Mốc điểm</h4><div class="tbl-wrap"><table class="jrw"><thead><tr><th>Điểm</th><th>Coin thêm</th><th>Cộng dồn</th></tr></thead><tbody>
   ${JRW.map(([s,c])=>`<tr><td>${fmt(s)}</td><td>+${c}</td><td><b>${sum+=c}</b></td></tr>`).join('')}</tbody></table></div></div>`;}
// the screen: rebuilt when the season or its state changes, the line under the title ticks every second while it is open
const jfdScr=(()=>{const s=document.getElementById('s-jfd');if(!s)return ()=>{};const cd=document.getElementById('jfdCd');let key='';
 const tabs=document.getElementById('jfdTabs'),P=[...s.querySelectorAll('.jp')];
 tabs.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;
  tabs.querySelectorAll('button').forEach(x=>{x.classList.toggle('on',x===t);x.setAttribute('aria-selected',x===t);});
  P.forEach(p=>p.hidden=p.dataset.p!==t.dataset.p);});
 return ()=>{const now=new Date(),b=pick('JFD',now,JFD),on=now>=b.S&&now<=b.E,k=b.s+on;
  if(k!==key){key=k;s.dataset.g=b.g;jfdFill(b,on);}
  const v=on?`${b.t} Exercise đang mở · còn ${left(b.E-now)} · đóng ${VN(b.E)} (giờ VN)`:now<b.S?`Đợt sau: ${b.t} Exercise · mở ${VN(b.S)} (giờ VN) · còn ${days(b.S-now)} ngày`:'Chưa có lịch đợt mới';
  if(cd.textContent!==v)cd.textContent=v;};})();
jfdScr();
setInterval(()=>{if(document.hidden)return;if(document.querySelector('#home.on'))jfdTile();else if(document.querySelector('#s-jfd.on'))jfdScr();},1000);
route();

// ===== lobby student you can touch (static image, so the "pinch" is a squash-and-stretch, not a real Live2D mesh) =====
// z = touch zones as fractions of the portrait image [x1,y1,x2,y2]; lines: game Memorial Lobby lines (translated) + new reactions
const L2D={'Hina (Dress)':{z:{head:[.30,.02,.70,.12],cheek:[.32,.12,.68,.25]},
 login:['Chào Sensei. Có việc gì em giúp được không?'],
 body:['Bộ váy này… là Sensei chọn cho em nhỉ. Đẹp thật đấy, nhưng em vốn không hay mặc—',
  '…Hả? Rất hợp với em… á? S-Sensei đang nói gì vậy…!?',
  'Dạo này em tập piano nhiều lắm. Lâu rồi mới chú tâm vào việc gì khác ngoài Ủy ban Kỷ luật… thấy cũng mới mẻ.',
  'Mặc váy vào là em lại muốn ngồi thẳng lưng. Chắc vì thế mà tim em đập nhanh hơn mọi khi.',
  'Dù mặc váy thì em vẫn là em. Hôm nay em vẫn hỗ trợ công việc bên cạnh Sensei. Nên… đừng hòng trốn nhé.',
  'Bắt đầu từ giờ… em sẽ chơi đàn cho Sensei nghe.',
  'Vậy… Sensei nghe cho kỹ nhé. …Bản nhạc em dành riêng cho Sensei.'],
 pat:['“Nghiêm khắc nhưng Hina vẫn dễ thương” á…? Ư, S-Sensei nói cái gì vậy chứ… …Thì, em cũng vui, n-nhưng mà… thật là.',
  '…Xoa đầu em giữa sảnh thế này, lỡ người trong Ủy ban thấy thì sao, Sensei?',
  'Ư… tóc em chải kỹ lắm mới hợp với bộ váy đấy. …Nhưng thôi, Sensei xoa thêm chút cũng được.'],
 poke:['…Sensei. Chọc má Ủy viên trưởng Kỷ luật là vi phạm đấy.',
  'Hả?! S-Sensei làm gì vậy…!?',
  'Đ-đừng chọc nữa… má em đỏ hết lên rồi.'],
 pinch:['Ư-ưm… Sensei, b-buông ra… em đâu phải bánh mochi…',
  'Kéo má em như thế… em sẽ ghi vào biên bản đấy.',
  '…Lần này em bỏ qua. Chỉ lần này thôi đấy.']}};
// Plana (NPC, no Memorial Lobby in the game): lines written in her style
L2D.Plana={z:{head:[.25,0,.75,.19],cheek:[.33,.19,.67,.29]},
 login:['Sensei. Đã xác nhận đăng nhập. Plana đang chờ chỉ thị.'],
 body:['…Sensei. Có việc gì cần Plana xử lý không?','Senpai Arona lại ngủ quên rồi. Hôm nay Plana trực thay.',
  'Báo cáo: Shittim Chest hoạt động bình thường. Không phát hiện bất thường.',
  'Plana không hiểu lắm, nhưng… ở cạnh Sensei thì không thấy khó chịu.','…Sensei đang nhìn Plana. Có vấn đề gì sao?'],
 pat:['……','…Cảm giác này không có trong dữ liệu. Nhưng… Plana không ghét.','Sensei. Xoa đầu không làm tăng hiệu suất xử lý. …Nhưng xin đừng dừng lại.'],
 poke:['…? Sensei vừa chọc má Plana.','Không hiểu mục đích của hành động này.','…Xin hãy giải thích, Sensei.'],
 pinch:['Sen…sei… xin hãy… buông ra.','…Má Plana không có chức năng co giãn.','Đã ghi nhận. Plana sẽ báo lại với Senpai Arona.']};
// Arona (NPC, day shift): lines written in her style
L2D.Arona={z:{head:[.3,.05,.7,.18],cheek:[.35,.18,.65,.28]},
 login:['Sensei đến rồi! Ca ngày hôm nay Arona trực, có gì cứ hỏi Arona nhé~'],
 body:['Sensei, hôm nay cũng cố lên nha! Arona sẽ hỗ trợ hết sức!','Ehehe… Arona vừa ăn bánh dâu xong, giờ tràn đầy năng lượng rồi ạ!',
  'Plana đang ngủ bù vì trực đêm. Ban ngày cứ để Arona lo ạ!','Sensei nhận phần thưởng đăng nhập chưa? Arona nhắc trước nhé~',
  'Mọi hệ thống của Shittim Chest đều ổn định ạ! …Chắc vậy.'],
 pat:['Ehehe~ Sensei xoa đầu Arona à? Thích quá đi…','Ưm… dễ chịu quá… Arona sắp ngủ mất…','Xoa thêm chút nữa nha Sensei~ Arona sẽ làm việc chăm hơn!'],
 poke:['Ơ?! Sensei vừa chọc má Arona hả?','Hứ, má Arona đâu phải bánh bao ạ!','Đ-đừng chọc nữa mà Sensei~'],
 pinch:['Á á! Sensei, không đau… nhưng mà ngại lắm ạ!','Má Arona dài ra mất thôi…!','Hứ! Arona giận Sensei năm phút đó!']};
// filled by the Spine loader below; static images leave them empty
const HOOK={talk(){},poke(){},pinch(){},patStart(){},patEnd(){},rub(){},voice(){return false;},gaze(){},gazeEnd(){}};
// Browsers keep a page silent until its first click / key press, so greetings at load come out mute.
// A blocked greeting parks its replay here and runs on that first press (capture phase, before the tap's own handler).
const UNLOCK={ok:false,q:null};
['pointerdown','keydown'].forEach(t=>addEventListener(t,()=>{UNLOCK.ok=true;const f=UNLOCK.q;UNLOCK.q=null;f&&f();},{capture:true}));
const blocked=err=>!UNLOCK.ok&&(!err||err.name==='NotAllowedError');
// TEMPORARY (remove once the zones are confirmed): labelled grid over a Spine student, shown with the 👆 zone boxes.
// Cells are 100 skeleton units (not screen pixels), anchored on the head, so a cell name always means the same spot on the body:
// columns A..T left to right, rows 1..16 top to bottom. g = L2D[name].grid() from the Spine loader.
function drawGrid(FX,cast,el,g){if(!g||!el)return;const r=el.getBoundingClientRect(),c=cast.getBoundingClientRect();if(!r.width)return;
 const X=i=>g.X(g.x0+i*g.c),Y=j=>g.Y(g.y0-j*g.c);let s='';
 for(let i=0;i<=g.n;i++)s+=`<line x1="${X(i)}" y1="${Y(0)}" x2="${X(i)}" y2="${Y(g.m)}"/>`;
 for(let j=0;j<=g.m;j++)s+=`<line x1="${X(0)}" y1="${Y(j)}" x2="${X(g.n)}" y2="${Y(j)}"/>`;
 for(let i=0;i<g.n;i++)for(let j=0;j<g.m;j++)s+=`<text x="${(X(i)+X(i+1))/2}" y="${(Y(j)+Y(j+1))/2}">${String.fromCharCode(65+i)}${j+1}</text>`;
 const d=document.createElement('div');d.className='zb zgrid';
 Object.assign(d.style,{left:r.left-c.left+'px',top:r.top-c.top+'px',width:r.width+'px',height:r.height+'px'});
 d.innerHTML=`<svg width="${r.width}" height="${r.height}" aria-hidden="true">${s}</svg>`;FX.prepend(d);}
(function(){const cast=document.getElementById('lobbyCast');let who='Hina (Dress)',P=L2D[who];if(!cast||!P)return;
 cast.innerHTML=`<div class="l2d"></div><div class="fx"></div>
  <button type="button" class="l2hint" title="Bấm để hiện / ẩn vùng chạm">👆 Hiện vùng chạm</button>
  <div class="dlg"><b>Shittim Chest</b><p></p><i>▼</i></div>`;
 const L=cast.querySelector('.l2d'),FX=cast.querySelector('.fx'),dlg=cast.querySelector('.dlg'),dp=dlg.querySelector('p'),img=()=>cast.querySelector('.spn')||cast.querySelector('.cpor'),Z=()=>{let z=null;try{z=P.live&&P.live();}catch(_){}return z||P.z;};
 // reminders taken from the report's live data, mixed into the normal lines
 function remind(){const now=new Date(),out=[],ta=pick('TA',now);
  if(now>=ta.S&&now<=ta.E)out.push(`Total Assault ${ta.n} còn ${days(ta.E-now)} ngày. Sensei đánh chưa? Cơ chế boss em ghi sẵn trong mục Cơ chế boss rồi.`);
  else if(now<ta.S)out.push(`Total Assault ${ta.n} mở sau ${days(ta.S-now)} ngày. Chuẩn bị đội hình từ bây giờ nhé, Sensei.`);
  // Joint Firing Drill: only while a season is open (before it opens, the "prep" task in Nhiệm vụ does the reminding)
  const jf=pick('JFD',now,JFD);
  if(now>=jf.S&&now<=jf.E)out.push(`Joint Firing Drill ${jf.t} Exercise còn ${days(jf.E-now)} ngày, Sensei. Giáp ${AR[jf.a][1].replace('Giáp ','')} nên mang đạn ${AR[jf.a][3]}; đội gợi ý em xếp sẵn trong ô Joint Firing Drill rồi.`);
  const nb=BAN.flatMap(x=>x.E>=now?x.st.filter(s=>!(s[0] in OWN)&&s[7]==='go').map(s=>[s[0],x]):[])[0];
  if(nb)out.push(`Banner có ${nb[0]} mở ngày ${dshort(nb[1].S)}. Sensei nhớ để dành pyroxene nhé.`);
  const e=+(document.getElementById('eli')||{}).value||0;
  if(e)out.push(`Sensei đang có ${e.toLocaleString('vi-VN')} Eligma. Thứ tự nâng UE em xếp sẵn trong Kế hoạch UE rồi.`);
  out.push('Thưởng hạng Tactical Challenge phát lúc 12:00 trưa. Sensei đánh hết vé trước giờ đó nhé.');
  return out;}
 const bag={},draw=k=>{if(!bag[k]||!bag[k].length)bag[k]=(k==='body'?[...P.body,...remind()]:P[k].slice()).sort(()=>Math.random()-.5);return bag[k].pop();};
 let tmr=0,full='';
 function say(t){clearInterval(tmr);full=t;let i=0;dp.textContent='';dlg.classList.remove('done');HOOK.talk(true);
  // reduced motion: the whole line at once, no typewriter
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){dp.textContent=full;dlg.classList.add('done');HOOK.talk(false);return;}
  tmr=setInterval(()=>{dp.textContent=full.slice(0,++i);if(i>=full.length){clearInterval(tmr);dlg.classList.add('done');HOOK.talk(false);}},28);}
 dlg.addEventListener('click',e=>{if(e.target.closest('b'))return;
  if(!dlg.classList.contains('done')){clearInterval(tmr);dp.textContent=full;dlg.classList.add('done');HOOK.talk(false);}else say(draw('body'));});
 // tiny "pop" sound made in the browser, no audio file needed
 let AC;const pop=f=>{try{AC=AC||new AudioContext();const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime;o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*1.6,t+.08);
  g.gain.setValueAtTime(.08,t);g.gain.exponentialRampToValueAtTime(.001,t+.15);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+.16);}catch(_){}};
 function zoneAt(x,y){const r=img().getBoundingClientRect();if(!r.width)return null;const fx=(x-r.left)/r.width,fy=(y-r.top)/r.height;
  for(const k of ['cheek','head']){const [a,b,c,d]=Z()[k];if(fx>=a&&fx<=c&&fy>=b&&fy<=d)return k;}
  return fx>=0&&fx<=1&&fy>=0&&fy<=1?'body':null;}
 function fx(cls,x,y,html){const r=cast.getBoundingClientRect(),el=document.createElement('span');el.className=cls;
  el.style.left=x-r.left+'px';el.style.top=y-r.top+'px';if(html)el.innerHTML=html;FX.appendChild(el);setTimeout(()=>el.remove(),1500);return el;}
 const hearts=(x,y)=>{for(let i=0;i<5;i++){const h=fx('heart',x+Math.random()*60-30,y,'♥');h.style.animationDelay=i*90+'ms';h.style.setProperty('--dx',Math.random()*40-20+'px');}};
 const play=c=>{L.classList.remove('poke','pat','hop');void L.offsetWidth;L.classList.add(c);};
 L.addEventListener('animationend',e=>{if(e.target===L)L.classList.remove('poke','pat','hop');});
 let st=null;
 L.addEventListener('pointerdown',e=>{if(window.sceneWake&&sceneWake())return;const z=zoneAt(e.clientX,e.clientY);if(!z)return;st={x:e.clientX,y:e.clientY,z,drag:false};
  const r=L.getBoundingClientRect();L.style.transformOrigin=`${e.clientX-r.left}px ${e.clientY-r.top}px`;L.classList.remove('spring');
  try{L.setPointerCapture(e.pointerId)}catch(_){}if(z==='head')HOOK.patStart();});
 L.addEventListener('pointermove',e=>{if(st&&st.z==='head'){HOOK.rub(e.movementX);return;}
  if(st&&st.z==='body'){if(!st.drag&&Math.hypot(e.clientX-st.x,e.clientY-st.y)>10)st.drag=true;if(st.drag)HOOK.gaze(e.clientX,e.clientY);return;}
  if(!st||st.z!=='cheek')return;const dx=e.clientX-st.x,dy=e.clientY-st.y;if(Math.hypot(dx,dy)<10)return;
  if(!st.drag){st.drag=true;fx('blush',st.x,st.y);pop(520);}
  const cx=Math.max(-1,Math.min(1,dx/120)),cy=Math.max(-1,Math.min(1,dy/120));
  L.style.transform=`translate(${cx*10}px,${cy*8}px) scale(${1+Math.abs(cx)*.05},${1+Math.abs(cy)*.04-Math.abs(cx)*.02}) skewX(${-cx*3}deg)`;});
 const end=e=>{if(!st)return;const s=st;st=null;L.classList.add('spring');L.style.transform='';if(s.z==='head')HOOK.patEnd();
  if(s.z==='body'&&s.drag){HOOK.gazeEnd();return;}if(e.type==='pointercancel')return;
  if(s.drag){pop(760);HOOK.pinch();say(draw('pinch'));}
  else if(s.z==='cheek'){fx('rip',s.x,s.y);fx('blush',s.x,s.y);play('poke');pop(880);HOOK.poke();say(draw('poke'));}
  else if(s.z==='head'){hearts(s.x,s.y);play('pat');pop(640);say(draw('pat'));}
  else if(!HOOK.voice('talk')){play('hop');pop(560);say(draw('body'));}};
 L.addEventListener('pointerup',end);L.addEventListener('pointercancel',end);
 // hint button toggles dashed boxes over the touch zones, to check they sit on the head / cheeks
 cast.querySelector('.l2hint').addEventListener('click',()=>{const on=cast.classList.toggle('zones');FX.querySelectorAll('.zb').forEach(z=>z.remove());if(!on)return;
  const r=img().getBoundingClientRect(),c=cast.getBoundingClientRect();
  Object.entries(Z()).forEach(([k,[a,b,x2,y2]])=>{const z=document.createElement('span');z.className='zb';z.dataset.k=k==='head'?'Đầu':'Má';
   Object.assign(z.style,{left:r.left-c.left+a*r.width+'px',top:r.top-c.top+b*r.height+'px',width:(x2-a)*r.width+'px',height:(y2-b)*r.height+'px'});FX.appendChild(z);});
  drawGrid(FX,cast,img(),P.grid&&P.grid());});
 // swap the lobby character for a Spine one once it has loaded
 window.lobbySwap=(name,el)=>{who=name;P=L2D[name];for(const k in bag)delete bag[k];
  const n=dlg.querySelector('b');n.textContent=name;n.className='';delete n.dataset.stu;
  L.replaceChildren(el);cast.querySelector('.l2hint').innerHTML=`👆 Chạm vào ${name} · giữ &amp; kéo ở má để véo`;
  cast.classList.remove('zones');FX.querySelectorAll('.zb').forEach(z=>z.remove());say(P.login[0]);};
 window.lobbySay=t=>say(t);
 // neither Arona nor Plana could load: Hina's static portrait covers the lobby
 window.lobbyFallback=()=>{if(L.querySelector('.cpor'))return;L.insertAdjacentHTML('afterbegin',porImg(who,'cpor'));
  const n=dlg.querySelector('b');n.textContent=who;n.className='stu';n.dataset.stu=who;cast.querySelector('.l2hint').innerHTML=`👆 Chạm vào ${who.split(' ')[0]} · giữ &amp; kéo ở má để véo`;say(P.login[0]);};
 say('Đang kết nối Shittim Chest…');
 addEventListener('hashchange',()=>{if(document.getElementById('home').classList.contains('on'))say(draw('body'));});
})();

// ===== Spine (real in-game rig). Arona keeps the day shift (06:00–18:00 VN), Plana the night shift; the theme follows.
//   Spine/spine-player-3.8.js (for 3.8 files) or Spine/spine-player.min.js (4.x)
//   Spine/NP0035/NP0035_spr.* (Plana) · Spine/arona_spr/arona_spr.* (Arona). Missing files: the other one covers, else Hina's static image stays.
// Arona + Plana now come from the Wallpaper Engine item 2959252463 (Xenon257R), copied to Spine/ap_wp: same 3.8.96 rigs,
// plus the game's Work voice lines (mp3). zones = the wallpaper's HITBOX.headpat (screen 1320-1630 × 615-755 → x -120..190,
// y 955..1095); cheek sits just under it, above the voice hitbox (y ≤ 740). vo = [files, lines, faces]: tap = talk, shift start = start.
const AW='Spine/ap_wp/assets/audio/';
// the voice files on disk are all lower case (arona_work_in_1.mp3) inside the folders "Arona" / "NP0035"; Windows doesn't care,
// but GitHub Pages and other web hosts match names exactly, so the file part is lowered here (folder names kept as they are)
const awUrl=f=>{const i=f.lastIndexOf('/');return AW+f.slice(0,i+1)+f.slice(i+1).toLowerCase()+'.mp3';};
const VO_A={start:[[['Arona/Arona_Default_TTS','Arona/Arona_Work_In_1'],['Sensei! Arona đợi Sensei mãi đó!','Sensei! Arona đợi Sensei mãi đó!'],['12','12']],
  [['Arona/Arona_Work_In_2'],['Mình bắt tay vào làm việc thôi!'],['25']],[['Arona/Arona_Work_In_3'],['Sensei có muốn làm việc gì đặc biệt không ạ?'],['31']],
  [['Arona/Arona_Work_In_4'],['Việc gì Arona cũng giúp Sensei được hết!'],['32']]],
 talk:[[['Arona/Arona_Work_Talk_1'],['Sensei quản lý các việc cần làm ở đây nha!'],['00']],
  [['Arona/Arona_Default_TTS','Arona/Arona_Work_Talk_2'],['Sensei! Chọn một việc đi ạ. Arona sẽ hỗ trợ!','Sensei! Chọn một việc đi ạ. Arona sẽ hỗ trợ!'],['25','25']],
  [['Arona/Arona_Work_Talk_3'],['Đây là toàn bộ việc của Sensei đó. Làm người lớn vất vả ghê ha?'],['13']],
  [['Arona/Arona_Work_Talk_4'],['Việc nhiều thật, nhưng Arona biết Sensei làm được mà!'],['12']],
  [['Arona/Arona_Work_Talk_5'],['Sensei cũng phải giữ gìn sức khỏe nữa. Sức khỏe là trên hết ạ!'],['18']],
  [['Arona/Arona_Work_Talk_6'],['Ôi… nhiều việc quá đi…'],['29']],[['Arona/Arona_Work_Talk_7_1'],['Sensei làm được mà!'],['25']]]};
const VO_P={start:[[['NP0035/NP0035_Work_In_1_1','NP0035/NP0035_Default_TTS','NP0035/NP0035_Work_In_1_2'],['Đang kết nối.','Sensei, Plana đã chờ Sensei.','Sensei, Plana đã chờ Sensei.'],['02','03','03']],
  [['NP0035/NP0035_Work_In_2'],['Đã đến giờ làm việc.'],['03']],[['NP0035/NP0035_Work_In_3'],['Sensei muốn bắt đầu với nhiệm vụ nào?'],['00']],
  [['NP0035/NP0035_Work_In_4'],['Đang chờ lệnh. Có rất nhiều nhiệm vụ cần được giải quyết.'],['02']]],
 talk:[[['NP0035/NP0035_Work_Talk_1'],['Sensei có thể thực hiện các nhiệm vụ tại đây.'],['03']],
  [['NP0035/NP0035_Default_TTS','NP0035/NP0035_Work_Talk_2'],['Sensei. Xin hãy chọn nhiệm vụ mà Sensei muốn làm.','Sensei. Xin hãy chọn nhiệm vụ mà Sensei muốn làm.'],['03','03']],
  [['NP0035/NP0035_Work_Talk_3'],['Có nhiều nhiệm vụ cần giải quyết. Vậy, mời Sensei.'],['03']],
  [['NP0035/NP0035_Work_Talk_4'],['Khó hiểu. Đây là hành động vô nghĩa. Xin đừng chọc Plana. Làm vậy sẽ gây hư hại.'],['13']],
  [['NP0035/NP0035_Work_Talk_5'],['Đã hiểu. Hiện tại Sensei không có việc gì đặc biệt, nên Sensei được tự do.'],['12']]]};
// Lobby room scenes from the same wallpaper (arona_workpage_daytime / _nighttime): the game's Work screen. Before Sensei touches,
// Arona (day) or Plana (night) is busy in the flooded classroom; a touch plays its _Touch reaction + an "exit" line, the room
// empties and the standing rig steps in with its greeting. Lines = [files, subtitles, speakers a/p]; index = Idle_0N of the scene.
const SCN_A=[
 {in:[[['Arona/Arona_Work_Sleep_In_1'],['Khò… Sữa dâu… hì hì.'],'a'],[['Arona/Arona_Work_Sleep_In_2'],['Ăn hết chỗ đó á? Không, Arona không ăn nổi đâu…'],'a']],
  exit:[[['Arona/Arona_Work_Sleep_Exit_1'],['Ơ-ơ… hả?'],'a'],[['Arona/Arona_Work_Sleep_Exit_2'],['Á?!'],'a'],[['Arona/Arona_Work_Sleep_Exit_3'],['…Hả?'],'a']],
  talk:[[['Arona/Arona_Work_Sleep_Talk_1'],['Sensei, Sensei đúng là…'],'a'],[['Arona/Arona_Work_Sleep_Talk_2'],['…Hì hì.'],'a'],[['Arona/Arona_Work_Sleep_Talk_3'],['Khò…'],'a'],
   [['Arona/Arona_Work_Sleep_Talk_4'],['Arona á? Ngủ gật á? Không đời nào… Khò…'],'a'],[['Arona/Arona_Work_Sleep_Talk_5'],['Hì hì, ngon quá…'],'a'],[['Arona/Arona_Work_Sleep_Talk_6'],['Không được đâu Sensei… Sensei không được làm thế…'],'a']]},
 {in:[[['Arona/Arona_Work_Watch_In_1'],['Một ngày mới lại là một bầu trời trong.'],'a'],[['Arona/Arona_Work_Watch_In_2'],['Hừm… chắc sắp mưa rồi.'],'a']],
  exit:[[['Arona/Arona_Work_Watch_Exit_1'],['A!'],'a'],[['Arona/Arona_Work_Watch_Exit_2'],['Hả?'],'a']],
  talk:[[['Arona/Arona_Work_Watch_Talk_1'],['Không biết ngoài kia có gì nhỉ…'],'a'],[['Arona/Arona_Work_Watch_Talk_3'],['Hừm…'],'a']]},
 {in:[[['Arona/Arona_Work_Sit_In_1'],['Ưm hửm…♬'],'a']],
  exit:[[['Arona/Arona_Work_Sit_Exit_1'],['Ơ?'],'a'],[['Arona/Arona_Work_Sit_Exit_2'],['Hả?'],'a'],[['Arona/Arona_Work_Sit_Exit_3'],['A!'],'a']],
  talk:[[['Arona/Arona_Work_Sit_Talk_1'],['La, lala, lala! ♪'],'a'],[['Arona/Arona_Work_Sit_Talk_2'],['Hừm hừm hừm… ♩'],'a'],[['Arona/Arona_Work_Sit_Talk_3'],['Ôi, không biết hôm nay sẽ có chuyện gì đây! ♬'],'a']]}];
// day scene 0 (Arona asleep at the desk) also has Plana beside her (the wallpaper's "Enable Plana": Idle_11 sits, Idle_12 peeks)
const SCN_SPOIL=[[[['NP0035/NP0035_Work_AronaSleepSit_In_1_2'],['Sữa dâu…?'],'p'],[['NP0035/NP0035_Work_AronaSleepSit_In_2_2'],['Senpai, chị nên dậy đi thôi.'],'p']],
 [[['NP0035/NP0035_Work_AronaSleepPeek_In_1_2'],['Chị ấy đang ngủ à?'],'p'],[['NP0035/NP0035_Work_AronaSleepPeek_In_2_2'],['Đúng như Plana nghĩ, chị ấy đang ngủ…'],'p']]];
const SCN_P=[
 {in:[[['NP0035/NP0035_Work_Cabinet_In_1'],['Ra là thứ này…'],'p'],[['NP0035/NP0035_Work_Cabinet_In_2'],['…Ra là vậy.'],'p']],
  exit:[[['NP0035/NP0035_Work_Cabinet_Exit_1'],['…A.'],'p']],
  talk:[[['NP0035/NP0035_Work_Cabinet_Talk_1'],['Hừm… Plana hiểu rồi.'],'p'],[['NP0035/NP0035_Work_Cabinet_Talk_1'],['Hừm… Ra là cấu trúc như thế.'],'p']]},
 {in:[[['NP0035/NP0035_Work_Sit_In_1'],['Ưm…'],'p'],[['NP0035/NP0035_Work_Sit_In_2'],['Hừm…'],'p']],
  exit:[[['NP0035/NP0035_Work_Sit_Exit_1'],['A.'],'p']],talk:[[['NP0035/NP0035_Work_Sit_Talk_1'],['…'],'p']]},
 {in:[[['NP0035/NP0035_Work_Umbrella_In_1'],['Nếu trời mưa…'],'p']],
  exit:[[['NP0035/NP0035_Work_Umbrella_Exit_1'],['A.'],'p']],
  talk:[[['NP0035/NP0035_Work_Umbrella_Talk_1'],['Cái này có dùng được không?'],'p'],[['NP0035/NP0035_Work_Umbrella_Talk_2'],['Plana cũng vậy. Cùng nhau.'],'p']]},
 {in:[[['Arona/Arona_Work_PlanaWatchSky_In_1_1','NP0035/NP0035_Work_PlanaWatchSky_In_1_2','Arona/Arona_Work_PlanaWatchSky_In_1_3'],['Plana-chan thấy cái kia không?','Ý senpai là cái đó ạ?','Ừ, cái đó đó!'],'apa']],
  exit:[[['NP0035/NP0035_Work_PlanaWatchSky_Exit_1'],['…A.'],'p']],
  talk:[[['Arona/Arona_Work_PlanaWatchSky_Talk_1_1','NP0035/NP0035_Work_PlanaWatchSky_Talk_1_2'],['Thế còn đằng kia?','Ưm…'],'ap']]},
 // night scene 1 with Arona peeking at Plana (Idle_11): same room, its own lines
 {in:[[['Arona/Arona_Work_PlanaSitPeek_In_1_1','NP0035/NP0035_Work_PlanaSitPeek_In_1_2'],['Nhìn chằm chằm~','Hừm…'],'ap']],
  exit:[[['NP0035/NP0035_Work_PlanaSitPeek_Exit_1'],['A.'],'p']],
  talk:[[['NP0035/NP0035_Work_PlanaSitPeek_Talk_1'],['Plana cảm thấy có ánh mắt đang nhìn mình.'],'p'],[['NP0035/NP0035_Work_PlanaSitPeek_Talk_2'],['Plana gặp rắc rối rồi.'],'p']]}];
// ONE scheduler for every Live2D camera (7 rigs + 2 room scenes). Before: each one had its own resize + hashchange listener,
// ~20 handlers firing on every rotate / screen change, hidden rigs included. Now: any number of requests in a frame = one run,
// and only rigs whose screen is showing are refit (a hidden one is refit the moment its screen opens).
const L2DQ=(()=>{const L=[];let q=0,all=false;
 const vis=el=>{const s=el.closest('.screen');return (!s||s.classList.contains('on'))&&el.offsetWidth>0;};
 const run=()=>{q=0;const f=all;all=false;L.forEach(x=>{if(f||vis(x.el)){try{x.fn();}catch(_){}}});};
 const ask=a=>{if(a)all=true;if(!q)q=requestAnimationFrame(run);};
 addEventListener('resize',()=>ask());addEventListener('hashchange',()=>ask());
 return {add:(el,fn)=>{L.push({el,fn});fn();},ask};})();
(function(){const D='Spine/',WZ={head:[-120,955,190,1095],cheek:[-60,800,130,900]},
  CH={Plana:{dir:D+'ap_wp/assets/',file:'NP0035_spr',zones:WZ,vo:VO_P},Arona:{dir:D+'ap_wp/assets/',file:'arona_spr',zones:WZ,vo:VO_A},
  // not on lobby duty: Rin stands on the TA/GA screen. Rin_raiddungeon = her in-game raid lobby L2D (from the Wallpaper Engine
  // item 2959857072 by Xenon257R): Pat_01 + Touch_Point head pat, Touch_Eye gaze, Start intros, Talk_01..06 voice lines
  // zones = skeleton coords [x1,y1,x2,y2] (y up): head from the wallpaper's HITBOX.headpat (screen 1300-1600 × 350-535 on its
  // 2880×1620 view centred at 0,900 → x -140..160, y 1175..1360); cheek sits between that and the voice hitbox (y ≤ 900)
  Rin:{dir:D+'rin_wp/assets/',file:'Rin_raiddungeon',host:'#s-raid .l2d',zones:{head:[-140,1175,160,1360],cheek:[-95,1005,105,1100]}},
  // Kế hoạch UE: Oki Aoi (GSC Finance Office), Wallpaper Engine item 3120377842 → Spine/aoi_wp. Same rig layout as Rin.
  // head = HITBOX.headpat (screen 1350-1660 × 410-550 → x -90..220, y 1160..1300); cheek just under it, above the voice box (y ≤ 895)
  Aoi:{dir:D+'aoi_wp/assets/',file:'NP0032_npc',host:'.screen[data-cast="ue"] .l2d',zones:{head:[-90,1160,220,1300],cheek:[-35,990,165,1085]}},
  // Nhiệm vụ: Iwabitsu Ayumu (GSC), the game's Tasks screen rig, Wallpaper Engine item 2959862843 → Spine/ayumu_wp. Same hitboxes as Aoi.
  Ayumu:{dir:D+'ayumu_wp/assets/',file:'NP0013_quest',host:'.screen[data-cast="tasks"] .l2d',zones:{head:[-90,1160,220,1300],cheek:[-35,990,165,1085]}},
  // Banner: Sora (Angel 24 part-timer, the game's Shop screen), Wallpaper Engine item 2959260737 → Spine/ws_2959260737.
  // Its wallpaper draws on a plain canvas (no 0,900 camera, bones Touch_Point_Key / Touch_Eye_Key), so no fixed boxes: zones follow the Touch_Point_Key bone.
  Sora:{dir:D+'ws_2959260737/assets/',file:'sora_shop',host:'.screen[data-cast="banner"] .l2d',bg:'BG4',
   // the whole baked-in shop set goes: BG4 room + everything under "00/" (counter, register, burger, desk light, top screen);
   // the light overlays floated as a yellow tint and the counter was cut off once the room became the page background
   hide:/^(BG4|00\/)/,gz:{head:'I2:L3',cheek:'I6:L6'}},
  // PvP: Yuraki Momoka (GSC Transportation Office, hands out Bounty / Commissions), item 2959842788 → Spine/ws_2959842788.
  // Same layout as Rin: head = HITBOX.headpat (screen 1300-1600 × 555-720 → x -140..160, y 990..1155); cheek above the voice box (y ≤ 810)
  Momoka:{dir:D+'ws_2959842788/assets/',file:'Momoka_weekdungeon',host:'.screen[data-cast="pvp"] .l2d',zones:{head:[-140,990,160,1155],cheek:[-90,850,110,945]}}};
 const js=src=>new Promise((ok,no)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=no;document.head.appendChild(s);});
 // the .skel header holds the Spine version as plain text (e.g. "3.8.96"); it decides which player file to load (only one family per page)
 const ver=C=>fetch(C.dir+C.file+'.skel').then(r=>{if(!r.ok)throw 0;return r.arrayBuffer();}).then(b=>{const m=String.fromCharCode(...new Uint8Array(b.slice(0,80))).match(/\d\.\d+\.\d+/);return m?m[0]:'';});
 let LIB=null;
 const lib=v=>{const fam=v.startsWith('3.')?'3':'4';if(LIB)return LIB.fam===fam?LIB.p:Promise.reject('mix');
  LIB={fam,p:js(D+(fam==='3'?'spine-player-3.8.js':'spine-player.min.js'))};return LIB.p;};
 // Soft edges (shading, blush, hair tips) glowed like neon: the 3.8 player drew straight-alpha textures onto a transparent canvas,
 // which the browser reads as premultiplied. Fix: premultiply the texture on upload (only for our Spine canvases) and draw in PMA mode.
 [self.WebGLRenderingContext,self.WebGL2RenderingContext].forEach(G=>{if(!G||G.prototype.__pm)return;const T=G.prototype.texImage2D;G.prototype.__pm=1;
  G.prototype.texImage2D=function(...a){const c=this.canvas,on=c&&c.closest&&c.closest('.spn[data-premul]');
   if(on)this.pixelStorei(this.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);try{return T.apply(this,a);}finally{if(on)this.pixelStorei(this.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);}};});
 // is the .png already premultiplied? (no "pma:" line in these atlases, so look at the semi-transparent pixels: colour never above alpha = premultiplied)
 const pmaFile=(C,atlas)=>{if(/pma:\s*true/i.test(atlas))return Promise.resolve(true);const png=(atlas.match(/^\s*(\S+\.png)\s*$/m)||[])[1];if(!png)return Promise.resolve(false);
  return new Promise(res=>{const im=new Image();im.onload=()=>{try{const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const g=c.getContext('2d');g.drawImage(im,0,0);
    const d=g.getImageData(0,0,c.width,c.height).data;let n=0,over=0;
    for(let i=0;i<d.length;i+=16){const a=d[i+3];if(a>24&&a<200){n++;if(Math.max(d[i],d[i+1],d[i+2])>a+10)over++;}}
    res(n>200&&over/n<.05);}catch(_){res(false);}};im.onerror=()=>res(false);im.src=C.dir+png;});};
 const cache={},made={};let cur=null,pending=null;
 // lobby room layer: behind the whole home screen (tiles float over it, like the game's Campaign / Work screen)
 {const h=document.getElementById('home');if(h&&!document.getElementById('lobbyScene'))h.insertAdjacentHTML('afterbegin','<div id="lobbyScene" aria-hidden="true"></div>');}
 // the wallpaper's camera: a 2880×1620 view centred at (0,900), scaled to COVER the layer (crop the long side)
 // phone (narrow layer): the crop is centred on the student's spot (world x -720) instead of the room's middle, kept inside the room
 function sceneVP(w,h){const a=w/h;if(a>2880/1620)return {x:-1440,width:2880,height:2880/a,y:900-1440/a};const W=1620*a;let x=-W/2;
  if(matchMedia('(max-width:900px)').matches)x=Math.max(-1440,Math.min(1440-W,-720-W/2));return {height:1620,width:W,x,y:90};}
 // the part of the room behind a given element (the lobby student's box), in the student's own coords: the wallpaper draws
 // arona_spr / NP0035_spr with characterOffset.x = -720, so local x = world x + 720. Same camera = same size and spot as in the room.
 // Once the scene is showing, its player's real camera is read back (the 3.8 player fits currentViewport + pads into its canvas,
 // centred, aspect kept), so the student always lines up with what the room actually draws; before that, the planned camera.
 let SCNP=null;
 function sceneView(el){const r=el.getBoundingClientRect();if(!r.width||!r.height)return null;let k,cx,cy;
  const ex=r.left+r.width/2,ey=r.top+r.height/2;
  if(SCNP&&SCNP.p.currentViewport){const v=SCNP.p.currentViewport,c=SCNP.el.getBoundingClientRect();if(!c.width||!c.height)return null;
   const pl=+v.padLeft||0,pr=+v.padRight||0,pt=+v.padTop||0,pb=+v.padBottom||0,W=v.width+pl+pr,Hh=v.height+pt+pb;
   k=Math.min(c.width/W,c.height/Hh);cx=v.x-pl+W/2+(ex-(c.left+c.width/2))/k;cy=v.y-pb+Hh/2-(ey-(c.top+c.height/2))/k;}
  else{const S=document.getElementById('lobbyScene');if(!S)return null;const R=S.getBoundingClientRect();if(!R.width||!R.height)return null;
   const V=sceneVP(R.width,R.height);k=R.width/V.width;cx=V.x+V.width/2+(ex-(R.left+R.width/2))/k;cy=V.y+V.height/2-(ey-(R.top+R.height/2))/k;}
  const w=r.width/k,h=r.height/k;
  return {x:cx+720-w/2,y:cy-h/2,width:w,height:h,padLeft:0,padRight:0,padTop:0,padBottom:0,transitionTime:0};}
 // one voice at a time in the lobby; leaving the lobby screen stops it
 let AU=null,VT=0;const home=()=>{const h=document.getElementById('home');return !!h&&h.classList.contains('on');};
 addEventListener('hashchange',()=>{if(!home()){VT++;mStop(AU);}});
 function load(name){if(cache[name])return cache[name];const C=CH[name];let V='';
  return cache[name]=ver(C).then(v=>{V=v;return lib(v);}).then(()=>fetch(C.dir+C.file+'.atlas').then(r=>{if(!r.ok)throw 0;return r.text();}))
  .then(atlas=>pmaFile(C,atlas).then(pm=>[atlas,pm])).then(([atlas,pm])=>new Promise((ok,no)=>{
   const el=document.createElement('div');el.className='spn';el.style.visibility='hidden';if(!pm)el.dataset.premul='1';
   document.querySelector(C.host||'#lobbyCast .l2d').appendChild(el);
   // 3.8 player reads skelUrl/atlasUrl, 4.x reads skeleton/atlas; both are given
   new spine.SpinePlayer(el,{skelUrl:C.dir+C.file+'.skel',atlasUrl:C.dir+C.file+'.atlas',skeleton:C.dir+C.file+'.skel',atlas:C.dir+C.file+'.atlas',
    showControls:false,interactive:false,alpha:true,backgroundColor:'#00000000',premultipliedAlpha:true,defaultMix:.2,
    success(p){const A=p.skeleton.data.animations.map(a=>a.name),has=n=>A.includes(n),st=p.animationState,sk=p.skeleton;
     // names and tracks follow ba.joexyz.online's Plana (src/lib/plana.ts): idle on 0, face on 1, blink/pat on 2-3, heart halo on 4
     const idle=has('Idle_01')?'Idle_01':A[0],talk=A.find(n=>/^talk/i.test(n)&&!/_[MA]$/.test(n));
     // faces are plain numbers on Plana ("07") but prefixed on other rigs (Rin: "S2_07"); byNum finds either
     const isFace=n=>/^(?:[A-Za-z]\d*_)?\d+$/.test(n)&&!/(^|_)00$/.test(n),nums=A.filter(isFace);
     const byNum=k=>A.find(n=>n===k)||A.find(n=>isFace(n)&&n.endsWith('_'+k));
     const blink=A.find(n=>/^eye_?close/i.test(n));
     st.setAnimation(0,idle,true);
     // rigs with the room baked in (Sora: slot "BG4" = the Angel 24 shop): hide it in the skeleton (setup pose too, so it stays hidden),
     // cut that region out of the atlas texture and use it as the full-screen backdrop instead, like the other screens' room pictures
     if(C.bg){const re=C.hide||new RegExp('^'+C.bg+'$'),nm=a=>a?[a.name,a.path].filter(Boolean):[];
      // slots whose setup or current attachment is part of the shop set; the idle animation can switch them back on,
      // so they are cleared again after every animation update (st.apply wrapped)
      const off=sk.slots.filter(s=>re.test(s.data.attachmentName||'')||nm(s.attachment).some(n=>re.test(n))||re.test(s.data.name));
      off.forEach(s=>{s.data.attachmentName=null;s.setAttachment(null);});
      if(off.length){const ap=st.apply.bind(st);st.apply=s=>{const r=ap(s);off.forEach(x=>{if(x.attachment)x.setAttachment(null);});return r;};}
      const m=atlas.match(new RegExp('^'+C.bg+'\\s*\\n\\s*rotate:\\s*(\\S+)\\s*\\n\\s*xy:\\s*(\\d+),\\s*(\\d+)\\s*\\n\\s*size:\\s*(\\d+),\\s*(\\d+)','m')),png=(atlas.match(/^\s*(\S+\.png)\s*$/m)||[])[1];
      if(m&&png&&m[1]==='false'){const im=new Image();im.onload=()=>{try{const c=document.createElement('canvas');c.width=+m[4];c.height=+m[5];
        c.getContext('2d').drawImage(im,+m[2],+m[3],c.width,c.height,0,0,c.width,c.height);const s=el.closest('.screen');
        if(s)Object.assign(s.style,{backgroundImage:`url(${c.toDataURL('image/jpeg',.9)})`,backgroundSize:'cover',backgroundPosition:'center top',backgroundRepeat:'no-repeat',backgroundAttachment:'fixed'});}catch(_){}};im.src=C.dir+png;}}
     let patting=false,tH=0,tE=0,tX=0;
     const tp=sk.findBone('Touch_Point')||sk.findBone('Touch_Point_Key'),oy=tp?tp.y:0,ox=tp?tp.x:0;
     // rigs without Touch_Point (Rin): sway the head ourselves. Head = a bone named head/face/neck, else the parent of the eye bones.
     // The offset is added after the animation pose every frame (st.apply is wrapped), so the idle keys don't wipe it out.
     const depth=b=>{let d=0;while(b.parent){d++;b=b.parent;}return d;};
     let hb=tp?null:(sk.bones.find(b=>/^(head|face|neck)$/i.test(b.data.name))||((sk.findBone('L_Eye')||sk.findBone('R_Eye')||{}).parent));
     if(hb&&depth(hb)<3)hb=null;
     let sway=0,tilt=0;
     if(hb){const ap=st.apply.bind(st);st.apply=s=>{const r=ap(s);tilt+=((patting?-3:0)-tilt)*.12;sway*=.9;hb.rotation+=tilt+sway;return r;};}
     // touch zones follow the skeleton: head = Touch_Point bone (where the game pats) or the top of the body, cheek = face bone or just below.
     // The player fits the skeleton bounds + 10% padding into the canvas (centered, aspect kept), so world -> screen is computed the same way.
     const fb=sk.bones.find(b=>/cheek/i.test(b.data.name))||sk.bones.find(b=>/face/i.test(b.data.name));
     let BB=null,ZZ=null;
     const bounds=()=>{if(BB)return BB;const o=new spine.Vector2(),s=new spine.Vector2();sk.getBounds(o,s,[]);
      if(!(s.x>0&&s.y>0))return null;BB={x:o.x-s.x*.1,y:o.y-s.y*.1,w:s.x*1.2,h:s.y*1.2,H:s.y,cx:o.x+s.x/2,top:o.y+s.y};return BB;};
     const fine=v=>v.every(n=>isFinite(n)&&n>-.5&&n<1.5);
     // screen rigs (Rin, Aoi, Ayumu, Sora, Momoka) share the game's world scale, but fitting each one's own bounds made them different sizes
     // (Sora / Momoka carry extra parts). So all of them get the same camera instead: the wallpaper's 1620-unit-tall view, anchored on the head
     // (head box centre, or the Touch_Point bone). Same camera = same size on screen, framed head to thighs like in the game.
     // The camera is always 1620 tall and as wide as the box's aspect, so height decides the size: the student stands at the same
     // scale against the full-screen room picture as in the wallpaper (its bg is drawn to the 1620 view height). Refit on resize / screen change.
     if(C.host){const z=C.zones&&C.zones.head;sk.setToSetupPose();sk.updateWorldTransform();
      const hx=z?(z[0]+z[2])/2:(tp?tp.worldX:0),hy=z?(z[1]+z[3])/2:(tp?tp.worldY:900);
      const cam=()=>{const r=el.getBoundingClientRect(),W=r.width>0&&r.height>0?Math.max(700,Math.min(2880,1620*r.width/r.height)):1300;
       const VP={x:hx-W/2,y:hy-1180,width:W,height:1620,padLeft:0,padRight:0,padTop:0,padBottom:0,transitionTime:0};
       if(BB&&Math.abs(BB.w-W)<1)return;BB={x:VP.x,y:VP.y,w:VP.width,h:VP.height,H:VP.height,cx:hx,top:VP.y+VP.height};
       // first fit goes through setAnimation (the player reads config.viewport there); later refits swap the live viewport
       // directly so an intro / voice animation in progress isn't cut off
       try{p.config.viewport=Object.assign(p.config.viewport||{},VP);if(first||!p.currentViewport){first=0;p.setAnimation(idle,true);}else{p.previousViewport=null;p.currentViewport=Object.assign({},VP);}}catch(_){}};
      let first=1;L2DQ.add(el,cam);}
     // lobby rigs (Arona / Plana): camera = the room scene's camera over this box, so they stand where the wallpaper puts them
     else{let firstL=1;const camL=()=>{const v=sceneView(el);if(!v)return;
       if(BB&&Math.abs(BB.x-v.x)<1&&Math.abs(BB.w-v.width)<1&&Math.abs(BB.h-v.height)<1)return;
       BB={x:v.x,y:v.y,w:v.width,h:v.height,H:v.height,cx:v.x+v.width/2,top:v.y+v.height};
       try{p.config.viewport=Object.assign(p.config.viewport||{},v);if(firstL||!p.currentViewport){firstL=0;p.setAnimation(idle,true);}else{p.previousViewport=null;p.currentViewport=Object.assign({},v);}}catch(_){}};
      L2DQ.add(el,camL);}
     (L2D[name]=L2D[name]||{}).live=()=>{try{const r=el.getBoundingClientRect(),b=bounds();if(!b||!r.width||!r.height)return null;
      const k=Math.min(r.width/b.w,r.height/b.h),ox0=(r.width-b.w*k)/2,oy0=(r.height-b.h*k)/2;
      const f=(x,y)=>[(ox0+(x-b.x)*k)/r.width,(oy0+(b.y+b.h-y)*k)/r.height];
      const box=(cx,cy,w,h)=>[...f(cx-w/2,cy+h/2),...f(cx+w/2,cy-h/2)];
      const H=b.H,hx=tp?tp.worldX:b.cx,hy=tp?tp.worldY:b.top-.12*H,cx=fb?fb.worldX:hx,cy=fb?fb.worldY:hy-.09*H;
      const Q=ZZ||C.zones,z=Q?{head:[...f(Q.head[0],Q.head[3]),...f(Q.head[2],Q.head[1])],cheek:[...f(Q.cheek[0],Q.cheek[3]),...f(Q.cheek[2],Q.cheek[1])]}
       :{head:box(hx,hy,.17*H,.09*H),cheek:box(cx,cy,.13*H,.06*H)};
      return fine(z.head)&&fine(z.cheek)?z:null;}catch(_){return null;}};
     // TEMPORARY grid (see drawGrid): world -> pixel inside el, anchored 1000 left of and 400 above the head centre
     {const hz=C.zones&&C.zones.head;sk.setToSetupPose();sk.updateWorldTransform();
      const gx=(hz?(hz[0]+hz[2])/2:(tp?tp.worldX:0))-1000,gy=(hz?(hz[1]+hz[3])/2:(tp?tp.worldY:900))+400;
      L2D[name].grid=()=>{const r=el.getBoundingClientRect(),b=bounds();if(!b||!r.width||!r.height)return null;
       const k=Math.min(r.width/b.w,r.height/b.h),ox0=(r.width-b.w*k)/2,oy0=(r.height-b.h*k)/2;
       return {X:x=>ox0+(x-b.x)*k,Y:y=>oy0+(b.y+b.h-y)*k,x0:gx,y0:gy,c:100,n:20,m:16};};
      // zones picked on that grid (C.gz, e.g. head 'I2:L3' = top-left cell : bottom-right cell) win over C.zones;
      // C.zones still anchors the grid and camera, so the cell names never move
      if(C.gz){const cell=s=>{const m=s.trim().match(/^([A-T])(\d+)$/i);return [m[1].toUpperCase().charCodeAt(0)-65,+m[2]-1];};
       const box=s=>{const [a,b]=s.split(':').map(cell);return [gx+a[0]*100,gy-(b[1]+1)*100,gx+(b[0]+1)*100,gy-a[1]*100];};
       try{ZZ={head:box(C.gz.head),cheek:box(C.gz.cheek)};}catch(_){ZZ=null;}}}
     const play=(t,n,loop)=>{if(has(n))st.setAnimation(t,n,loop);};
     const face=(n,sec)=>{if(!n||!has(n))return;clearTimeout(tX);st.setAnimation(1,n,true);if(sec)tX=setTimeout(()=>st.setEmptyAnimation(1,.25),sec*1000);};
     // Plana's numbers: 07 shocked, 13 confused, 09 sparkly eyes, 03 slight smile / 14 embarrassed, 05 yelling, 20 mad; other rigs fall back to any numbered face
     const pickFace=pref=>{const a=pref.map(byNum).filter(Boolean),src=a.length?a:nums;return src[Math.random()*src.length|0];};
     // rigs without Pat_01 (Rin: only numbered faces): find the faces that shut the eyes by posing each one
     // and counting the visible eye / pupil slots (L_Eye, L_Eye_P_01...). A shut face hides most of them.
     const eyeS=sk.slots.filter(s=>/(^|_)eye$/i.test(s.data.name)||/eye_?p_?\d/i.test(s.data.name));
     const open=n=>{try{const a=sk.data.findAnimation(n);sk.setToSetupPose();a.apply(sk,0,a.duration/2,false,null,1,0,0);
       return eyeS.filter(s=>s.attachment&&s.color.a>.05).length;}catch(_){return -1;}};
     let shut=[];
     if(!has('Pat_01_M')&&eyeS.length){const base=open(idle);if(base>0)shut=nums.filter(n=>{const v=open(n);return v>=0&&v<=base*.34;});sk.setToSetupPose();}
     const shutFace=()=>shut.find(n=>!n.includes('_'))||shut[0]||pickFace(['99','16','03']);
     // no Pat_01 but a blink (Rin): hold the blink on its eyes-shut frame while patting.
     // That frame = where most eyelid / cover slots show; if they never change, the middle of the blink.
     let tShut=0,held=null;
     if(blink&&!has('Pat_01_M')){const a=sk.data.findAnimation(blink),lid=sk.slots.filter(s=>/cover|close|lid/i.test(s.data.name));let hi=-1,lo=1e9;
      for(let i=1;i<20;i++){const t=a.duration*i/20;sk.setToSetupPose();a.apply(sk,0,t,false,null,1,0,0);const v=lid.filter(s=>s.attachment&&s.color.a>.05).length;
       if(v>hi){hi=v;tShut=t;}lo=Math.min(lo,v);}
      if(hi<=lo)tShut=a.duration/2;sk.setToSetupPose();}
     setInterval(()=>{if(cur===name&&!patting&&!gz&&blink)st.setAnimation(2,blink,false);},7000);
     // wallpaper behaviour: drag on the body = eyes follow the cursor (Touch_Eye bone + Look_01_M/A), tap = next voiced line
     const te=sk.findBone('Touch_Eye'),ex=te?te.x:0,ey=te?te.y:0;let gz=0,gb=0,vi=0;
     const face0=n=>{const f=n&&byNum(n);if(f){clearTimeout(tX);st.setAnimation(1,f,true);}};
     const voice=kind=>{const V=C.vo&&C.vo[kind];if(!V||!V.length||!window.lobbySay||!home())return false;
      const [fs,ls,fc]=kind==='talk'?V[vi++%V.length]:V[Math.random()*V.length|0],tok=++VT;let i=0;
      const step=()=>{if(tok!==VT)return;if(i>=fs.length){st.setEmptyAnimation(1,.3);return;}const k=i++;face0(fc[k]);if(ls[k]!==ls[k-1])lobbySay(ls[k]);
       let done=0;const nx=()=>{if(!done){done=1;step();}};
       try{AU&&AU.pause();AU=new Audio(awUrl(fs[k]));AU.volume=.6;AU.onended=nx;AU.onerror=()=>setTimeout(nx,1500);AU.play().catch(er=>{if(k===0&&blocked(er)){VT++;UNLOCK.q=()=>{if(home()&&cur===name)voice(kind);};return;}setTimeout(nx,1800);});}catch(_){setTimeout(nx,1800);}};
      step();return true;};
     const H={sways:!!(hb||tp),busy:()=>patting,voice,
      gaze:(x,y)=>{if(!te)return false;
       if(!gz){gz=1;clearInterval(gb);if(has('Look_01_M')){st.setEmptyAnimation(1,0);st.setEmptyAnimation(2,0);const a=st.addAnimation(1,'Look_01_M',false,0);a.mixDuration=.2;
        if(has('Look_01_A')){const b=st.addAnimation(2,'Look_01_A',false,0);b.mixDuration=.2;}}}
       const r=el.getBoundingClientRect(),ax=(x-r.left)/r.width-.5,ay=(y-r.top)/r.height-.25;
       te.y=Math.max(ey-Math.abs(ax)*300,Math.min(ey+Math.abs(ax)*300,te.y-Math.sign(ax)*10));
       te.x=Math.max(ex-Math.abs(ay)*170,Math.min(ex+Math.abs(ay)*170,te.x-Math.sign(ay)*10));return true;},
      gazeEnd:()=>{if(!gz)return;gz=0;
       if(has('LookEnd_01_M')){const a=st.setAnimation(1,'LookEnd_01_M',false);a.mixDuration=0;st.addEmptyAnimation(1,.3,0);}
       if(has('LookEnd_01_A')){const b=st.setAnimation(2,'LookEnd_01_A',false);b.mixDuration=0;st.addEmptyAnimation(2,.3,0);}
       clearInterval(gb);gb=setInterval(()=>{te.x+=(ex-te.x)*.25;te.y+=(ey-te.y)*.25;if(Math.abs(te.x-ex)+Math.abs(te.y-ey)<1){te.x=ex;te.y=ey;clearInterval(gb);}},20);},
      talk:on=>{if(talk){on?st.setAnimation(5,talk,true):st.setEmptyAnimation(5,.15);}},
      poke:()=>face(pickFace(['07','13','09','03']),2.5),
      pinch:()=>face(pickFace(['14','05','20']),3),
      // hold on the head = eyes close and head leans; keep rubbing 3 s for the heart halo, 6 s and she gets embarrassed
      patStart:()=>{patting=true;if(has('Pat_01_M')){play(2,'Pat_01_M',false);play(3,'Pat_01_A',false);}else if(blink){held=st.setAnimation(2,blink,false);held.mixDuration=.1;held.trackTime=tShut;held.timeScale=0;}else face(shutFace());
       tH=setTimeout(()=>play(4,'Dev_Halo_love',true),3000);tE=setTimeout(()=>face(pickFace(['14'])),6000);},
      rub:dx=>{if(!patting||!dx)return;if(hb){sway=Math.max(-7,Math.min(7,sway+dx*.3));return;}if(!tp)return;tp.y=Math.max(oy-30,Math.min(oy+30,tp.y+(dx>0?-2:2)));},
      patEnd:()=>{if(!patting)return;patting=false;clearTimeout(tH);clearTimeout(tE);if(held){held.timeScale=1;held=null;}
       if(has('PatEnd_01_M')){play(2,'PatEnd_01_M',false);play(3,'PatEnd_01_A',false);st.addEmptyAnimation(2,.1,0);st.addEmptyAnimation(3,.1,0);}
       st.setEmptyAnimation(4,.3);st.setEmptyAnimation(1,.3);
       if(tp){const t=setInterval(()=>{tp.y+=(oy-tp.y)*.2;tp.x+=(ox-tp.x)*.2;if(Math.abs(tp.y-oy)<.5){tp.y=oy;tp.x=ox;clearInterval(t);}},16);}}};
     el.style.visibility='';
     ok(made[name]={el,p,H,info:'Texture: '+(pm?'PMA sẵn':'thường → nhân alpha khi tải')+(has('Pat_01_M')?'\nXoa đầu: Pat_01 của rig':blink?`\nXoa đầu: giữ ${blink} ở giây ${tShut.toFixed(2)} (mắt nhắm)`:'\nXoa đầu dùng mặt: '+shutFace())+(hb?`\nLắc đầu bằng xương: ${hb.data.name}`:'')+'\nChuyển động: '+A.join(', ')+'\nXương: '+sk.bones.map(b=>b.data.name).join(', ')});},
    error(p,why){el.remove();console.warn('Spine '+name+':',why);no(V||'?');}});
  })).catch(v=>{throw {name,V:v==='mix'?'mix':V};});}
 // which one is on duty: by Vietnam time, unless the theme button picked the other one for this shift
 const vnH=()=>+new Date().toLocaleString('en-US',{timeZone:'Asia/Ho_Chi_Minh',hour:'numeric',hour12:false})%24;
 const byTime=()=>{const h=vnH();return h>=6&&h<18?'Arona':'Plana';};
 let manual=null,told=false;
 // ----- the room scene (see SCN_A / SCN_P): one Spine player per scene file, behind the home screen -----
 const SCN={Arona:{file:'arona_workpage_daytime',L:SCN_A,day:1},Plana:{file:'arona_workpage_nighttime',L:SCN_P,day:0}},scn={},scnOn={};
 let SW=null;
 const rnd=n=>Math.random()*n|0;
 function scLoad(name){if(scn[name])return scn[name];const S=SCN[name],dir=D+'ap_wp/assets/',host=document.getElementById('lobbyScene');
  const vp=()=>{const R=host.getBoundingClientRect();return Object.assign(sceneVP(R.width||1600,R.height||900),{padLeft:0,padRight:0,padTop:0,padBottom:0,transitionTime:0});};
  return scn[name]=lib('3.8.99').then(()=>fetch(dir+S.file+'.atlas').then(r=>{if(!r.ok)throw 0;return r.text();})).then(atlas=>pmaFile({dir},atlas)).then(pm=>new Promise((ok,no)=>{
   const el=document.createElement('div');el.className='spn';if(!pm)el.dataset.premul='1';el.style.visibility='hidden';host.appendChild(el);
   new spine.SpinePlayer(el,{skelUrl:dir+S.file+'.skel',atlasUrl:dir+S.file+'.atlas',skeleton:dir+S.file+'.skel',atlas:dir+S.file+'.atlas',
    showControls:false,interactive:false,alpha:true,backgroundColor:'#00000000',premultipliedAlpha:true,defaultMix:.5,viewport:vp(),animation:'Idle_background_00',
    success(p){const fit=()=>{const R=host.getBoundingClientRect();if(!R.width)return;const v=vp();
       try{p.config.viewport=Object.assign(p.config.viewport||{},v);if(p.currentViewport){p.previousViewport=null;p.currentViewport=Object.assign({},v);}}catch(_){}};
     L2DQ.add(host,fit);el.style.visibility='';
     ok(scnOn[name]={p,el,st:p.animationState,A:p.skeleton.data.animations.map(a=>a.name)});},
    error(p,why){el.remove();no(why);}});}));}
 // intro like the wallpaper: random scene (day 0-2, night 0-3), its "in" line, idle lines every 15 s; the standing rig waits hidden
 function sceneIntro(name,o){const S=SCN[name];if(!S)return false;if(SW)SW.stop();
  const tok={};SW=tok;let gen=0,loop=0,au=null;o.el.style.opacity='0';
  const tag=sp=>{const b=document.querySelector('#lobbyCast .dlg b');if(b)b.textContent=sp==='p'?'Plana':'Arona';};
  const seq=(line,done)=>{const g=++gen,[fs,ts,sp]=line;let i=0;
   const step=()=>{if(g!==gen)return;if(i>=fs.length){done&&done();return;}const k=i++;tag(sp[k]||sp[0]);window.lobbySay&&lobbySay(ts[k]);
    let d=0;const nx=()=>{if(!d){d=1;step();}};if(!home()){setTimeout(nx,1500);return;}
    try{au&&au.pause();au=new Audio(awUrl(fs[k]));au.volume=.6;au.onended=nx;au.onerror=()=>setTimeout(nx,1500);au.play().catch(()=>setTimeout(nx,2200));}catch(_){setTimeout(nx,2200);}};
   step();};
  tok.stop=()=>{gen++;clearInterval(loop);au&&au.pause();o.el.style.opacity='';};
  const reveal=()=>{if(SW===tok)SW=null;o.el.style.opacity='';tag(name==='Plana'?'p':'a');o.H.voice('start');};
  scLoad(name).then(sc=>{if(SW!==tok)return;
   for(const n in scnOn){const on=n===name;scnOn[n].el.style.display=on?'':'none';const q=scnOn[n].p;on?(q.play&&q.play()):(q.pause&&q.pause());}
   // the student's camera now follows this scene's real camera (refit once it has drawn a frame)
   SCNP=sc;setTimeout(()=>dispatchEvent(new Event('resize')),120);
   const st=sc.st,has=n=>sc.A.includes(n),k=rnd(S.day?3:4),k2=rnd(2),peek=!S.day&&k===1&&k2===1,ent=S.L[peek?4:k];
   st.clearTracks();st.setAnimation(0,'Idle_background_00',true);if(has(`Idle_0${k}`))st.setAnimation(1,`Idle_0${k}`,true);
   const side=S.day&&k===0?`Idle_1${k2+1}`:peek?'Idle_11':null;if(side&&has(side))st.setAnimation(4,side,true);
   const sel=rnd(ent.in.length);
   seq(ent.in[sel],()=>{if(S.day&&k===0){const sp=SCN_SPOIL[k2];setTimeout(()=>{if(SW===tok&&!tok.out)seq(sp[Math.min(sel,sp.length-1)]);},500);}});
   loop=setInterval(()=>{if(SW===tok&&!tok.out&&home())seq(ent.talk[rnd(ent.talk.length)]);},15000);
   // first touch: the scene's _Touch reaction + an exit line, then the room empties and the standing rig appears with its greeting
   tok.wake=()=>{if(tok.out)return;tok.out=true;clearInterval(loop);au&&au.pause();
    const T=(t,n)=>{if(has(n))st.addAnimation(t,n,false,0);};T(2,`Idle_0${k}_Touch_M`);T(3,`Idle_0${k}_Touch_A`);if(side){T(5,`${side}_Touch_M`);T(6,`${side}_Touch_A`);}
    seq(ent.exit[rnd(ent.exit.length)],()=>{st.setAnimation(0,'Idle_background_00',true);[1,2,3,4,5,6].forEach(t=>st.setEmptyAnimation(t,0));setTimeout(reveal,500);});};})
  .catch(e=>{console.warn('Lobby scene:',e);if(SW===tok)reveal();});
  return true;}
 // lobby touch handler asks first: while a scene intro is waiting, the touch wakes the room instead of the (hidden) student
 window.sceneWake=()=>{if(!SW)return false;if(SW.wake)SW.wake();return true;};
 function show(name,auto){pending=name;
  load(name).then(o=>{pending=null;if(cur===name)return;cur=name;Object.assign(HOOK,o.H);
   Object.keys(made).forEach(k=>{if(CH[k].host)return;const q=made[k].p;if(k===name){q.play&&q.play();}else{q.pause&&q.pause();}});
   lobbySwap(name,o.el);if(!sceneIntro(name,o))o.H.voice('start');document.getElementById('lobbyCast').classList.toggle('day',name==='Arona');document.querySelector('#lobbyCast .l2hint').title=o.info;
   if(auto&&typeof setThm==='function')setThm(name==='Plana'?'dark':'light');})
  .catch(e=>{pending=null;const other=name==='Arona'?'Plana':'Arona';
   if(!made[other]&&cur!==other&&!cache[other+'_tried']){cache[other+'_tried']=1;show(other,auto);}
   else if(!cur&&window.lobbyFallback)lobbyFallback();
   if(told)return;told=true;
   setTimeout(()=>lobbySay(e.V==='mix'?`File Spine của ${name} khác đời thư viện với ${other}, nên ${name} chưa lên ca được, Sensei.`
    :e.V&&e.V!=='?'?`Không mở được file Spine của ${name} (đời ${e.V}). Hôm nay ${cur||'Hina'} trực thay nhé, Sensei.`
    :`Chưa có file Spine của ${name} trong thư mục ${CH[name].dir}, nên ${cur||'Hina'} trực thay ca này, Sensei.`),1500);});}
 function tick(){const t=byTime();if(manual&&manual.slot!==t)manual=null;const want=manual?manual.name:t;
  if(want!==cur&&want!==pending&&!(cache[want+'_tried']&&!made[want]))show(want,!manual);}
 document.getElementById('thm').addEventListener('click',()=>{manual={name:dark()?'Plana':'Arona',slot:byTime()};delete cache[manual.name+'_tried'];tick();});
 tick();setInterval(tick,60000);
 window.spineLoad=load;
 // the window resized while the lobby was hidden (another screen open): its WebGL canvases kept the old size / GL viewport, and
 // GL draws from the bottom-left, so Arona / Plana came back small in the corner by the chat box. Every Live2D host is watched:
 // when its box changes size or shows again, all canvases re-measure (drawing buffer + viewport) and the cameras refit.
 {let q=0;const refit=()=>{cancelAnimationFrame(q);q=requestAnimationFrame(()=>{
   const W=window.spine&&spine.webgl,mode=W&&W.ResizeMode?W.ResizeMode.Expand:1;
   [...Object.values(made),...Object.values(scnOn)].forEach(o=>{const p=o&&o.p,r=p&&p.sceneRenderer,c=p&&p.canvas;
    try{if(c&&c.clientWidth&&c.clientHeight){if(r&&r.resize)r.resize(mode);else{c.width=c.clientWidth*(devicePixelRatio||1);c.height=c.clientHeight*(devicePixelRatio||1);}
     const gl=(p.context&&p.context.gl)||c.getContext('webgl')||c.getContext('webgl2');gl&&gl.viewport(0,0,c.width,c.height);}}catch(_){}});
   L2DQ.ask();});};
  window.l2dRefit=refit;
  if(window.ResizeObserver){const ro=new ResizeObserver(refit);document.querySelectorAll('#lobbyScene,.l2d').forEach(h=>ro.observe(h));}}
})();

// ===== Talk screens: a Spine student beside a game-style dialogue box (TA/GA: Nanagami Rin, Kế hoạch UE: Oki Aoi) =====
// K = per-screen config (stageTalk calls at the end). Spine files missing: the CAST portrait stays with the old line.
function stageTalk(K){const sc=document.querySelector(K.sc),cast=sc&&sc.querySelector('.cast.talk');if(!cast)return;
 const L=cast.querySelector('.l2d'),dlg=cast.querySelector('.dlg'),dp=dlg.querySelector('p'),nm=dlg.querySelector('b'),on=()=>sc.classList.contains('on');
 const LOGIN=K.login,status=K.status,TIPS=K.tips,TOUCH=K.touch;
 let q=[];const next=()=>{if(!q.length)q=[...status(),...TIPS];return q.shift();};
 let H=null,P=null,tmr=0,full='';
 function say(t){clearInterval(tmr);full=t;let i=0;dp.textContent='';dlg.classList.remove('done');H&&H.talk(true);
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){dp.textContent=full;dlg.classList.add('done');H&&H.talk(false);return;}
  tmr=setInterval(()=>{dp.textContent=full.slice(0,++i);if(i>=full.length){clearInterval(tmr);dlg.classList.add('done');H&&H.talk(false);}},26);}
 dlg.addEventListener('click',()=>{if(!dlg.classList.contains('done')){clearInterval(tmr);dp.textContent=full;dlg.classList.add('done');H&&H.talk(false);}else say(next());});
 const PAT=K.pat,POKE=K.poke,PINCH=K.pinch;
 const rnd=a=>a[Math.random()*a.length|0];
 // same touch feedback as the lobby: hearts on a pat, ripple + blush on a poke, the box bounces (poke / pat / hop),
 // a cheek drag stretches it a little and springs back, plus the small "pop" sound made in the browser
 const fxAt=(cls,x,y,html)=>{const r=cast.getBoundingClientRect(),el=document.createElement('span');el.className=cls;
  el.style.left=x-r.left+'px';el.style.top=y-r.top+'px';if(html)el.innerHTML=html;cast.querySelector('.fx').appendChild(el);setTimeout(()=>el.remove(),1500);return el;};
 const hearts=(x,y)=>{for(let i=0;i<5;i++){const h=fxAt('heart',x+Math.random()*60-30,y,'♥');h.style.animationDelay=i*90+'ms';h.style.setProperty('--dx',Math.random()*40-20+'px');}};
 const bounce=c=>{L.classList.remove('poke','pat','hop');void L.offsetWidth;L.classList.add(c);};
 L.addEventListener('animationend',e=>{if(e.target===L)L.classList.remove('poke','pat','hop');});
 let AC;const pop=f=>{try{AC=AC||new AudioContext();const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime;o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*1.6,t+.08);
  g.gain.setValueAtTime(.08,t);g.gain.exponentialRampToValueAtTime(.001,t+.15);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+.16);}catch(_){}};
 // same touch zones as the lobby: head = pat (eyes close if the rig has Pat_01), cheek = poke, drag on cheek = pinch, elsewhere = body
 let E=null;const ZF={head:[.3,.03,.7,.16],cheek:[.35,.16,.65,.26]};
 const zoneAt=(x,y)=>{const t=E||L,r=t.getBoundingClientRect();if(!r.width)return'body';const fx=(x-r.left)/r.width,fy=(y-r.top)/r.height;
  let z=null;try{z=L2D[K.ch]&&L2D[K.ch].live&&L2D[K.ch].live();}catch(_){}z=z||ZF;
  for(const k of ['cheek','head']){const [a,b,c,d]=z[k];if(fx>=a&&fx<=c&&fy>=b&&fy<=d)return k;}return'body';};
 let st=null;
 // Rin's rig has no head bone (eyes hang straight off "scale"), so patting leans the upper body instead: the canvas tilts
 // around the hips, follows the rubbing, and settles back when the mouse stops
 let lean=0,push=0,raf=0;
 const leanLoop=()=>{push*=.9;const want=(st&&st.z==='head'?-1:0)+push;lean+=(want-lean)*.15;
  if(E){E.style.transformOrigin='50% 62%';E.style.transform=`rotate(${lean.toFixed(2)}deg)`;}
  if(Math.abs(lean)>.02||Math.abs(want)>.02)raf=requestAnimationFrame(leanLoop);else{raf=0;if(E)E.style.transform='';}};
 const nudge=d=>{push=Math.max(-2.5,Math.min(2.5,push+d));if(!raf)raf=requestAnimationFrame(leanLoop);};
 // wallpaper rig (Rin_raiddungeon / NP0032_npc), same handling as its js/main.js: drag on the body = eyes follow the cursor
 // (Touch_Eye bone + Look_01), tap = next voiced Talk_0N line, first visit = Start intro. Lines: the game's EN text, translated.
 const RD=K.rd,VO=K.vo,VD=K.vd,IN=K.in,ID=K.id;
 let S=null,AN=[],TE=null,EX=0,EY=0,gz=0,back=0,au=null,vi=0;
 const has2=n=>AN.includes(n);
 // one-shot reaction from the rig (Ayumu: Complete_0N when a task is done, Get_0N when rewards come in): _M on track 1, _A on track 2
 const act=n=>{if(!S||!has2(n+'_M'))return false;S.setEmptyAnimation(1,.1);S.setEmptyAnimation(2,.1);
  S.addAnimation(1,n+'_M',false,0);if(has2(n+'_A'))S.addAnimation(2,n+'_A',false,0);S.addEmptyAnimation(1,.4,0);S.addEmptyAnimation(2,.4,0);return true;};
 const audio=f=>{try{au&&au.pause();au=new Audio(RD+'audio/'+f);au.volume=.6;au.play().catch(er=>{if(blocked(er))UNLOCK.q=()=>{if(on())audio(f);};});}catch(_){}};
 const voice=()=>{if(!S||!has2('Talk_01_M'))return false;const n=vi%VO.length+1;vi++;
  S.setEmptyAnimation(1,.2);S.setEmptyAnimation(2,.2);S.addAnimation(1,`Talk_0${n}_M`,false,0);S.addAnimation(2,`Talk_0${n}_A`,false,0);S.addEmptyAnimation(1,.5,0);S.addEmptyAnimation(2,.5,0);
  setTimeout(()=>{if(on()){audio(K.talkFile(n));say(VO[n-1]);}},VD[n-1]);return true;};
 const gaze=(x,y)=>{if(!S||!TE)return;
  if(!gz){gz=1;clearInterval(back);if(has2('Look_01_M')){S.setEmptyAnimation(1,0);S.setEmptyAnimation(2,0);const a=S.addAnimation(1,'Look_01_M',false,0);a.mixDuration=.2;
   if(K.lookA!==false&&has2('Look_01_A')){const b=S.addAnimation(2,'Look_01_A',false,0);b.mixDuration=.2;}}}
  const r=(E||L).getBoundingClientRect(),ax=(x-r.left)/r.width-.5,ay=(y-r.top)/r.height-.3;
  TE.y=Math.max(EY-Math.abs(ax)*300,Math.min(EY+Math.abs(ax)*300,TE.y-Math.sign(ax)*10));
  TE.x=Math.max(EX-Math.abs(ay)*170,Math.min(EX+Math.abs(ay)*170,TE.x-Math.sign(ay)*10));};
 const gazeEnd=()=>{if(!gz)return;gz=0;
  if(has2('LookEnd_01_M')){const a=S.setAnimation(1,'LookEnd_01_M',false),b=S.setAnimation(2,'LookEnd_01_A',false);a.mixDuration=b.mixDuration=0;S.addEmptyAnimation(1,.3,0);S.addEmptyAnimation(2,.3,0);}
  clearInterval(back);back=setInterval(()=>{TE.x+=(EX-TE.x)*.25;TE.y+=(EY-TE.y)*.25;if(Math.abs(TE.x-EX)+Math.abs(TE.y-EY)<1){TE.x=EX;TE.y=EY;clearInterval(back);}},20);};
 L.addEventListener('pointerdown',e=>{st={x:e.clientX,y:e.clientY,z:zoneAt(e.clientX,e.clientY),drag:false};try{L.setPointerCapture(e.pointerId)}catch(_){}
  const r=L.getBoundingClientRect();L.style.transformOrigin=`${e.clientX-r.left}px ${e.clientY-r.top}px`;L.classList.remove('spring');
  if(st.z==='head'&&H){H.patStart();if(!H.sways)nudge(0);}});
 L.addEventListener('pointermove',e=>{if(!st)return;if(st.z==='head'){if(H){H.rub(e.movementX);if(!H.sways&&e.movementX)nudge(e.movementX*.06);}return;}
  if(st.z==='body'){if(!st.drag&&Math.hypot(e.clientX-st.x,e.clientY-st.y)>10)st.drag=true;if(st.drag)gaze(e.clientX,e.clientY);return;}
  if(st.z!=='cheek')return;const dx=e.clientX-st.x,dy=e.clientY-st.y;if(Math.hypot(dx,dy)<10)return;
  if(!st.drag){st.drag=true;fxAt('blush',st.x,st.y);pop(520);}
  const cx=Math.max(-1,Math.min(1,dx/120)),cy=Math.max(-1,Math.min(1,dy/120));
  L.style.transform=`translate(${cx*10}px,${cy*8}px) scale(${1+Math.abs(cx)*.05},${1+Math.abs(cy)*.04-Math.abs(cx)*.02}) skewX(${-cx*3}deg)`;});
 const end=e=>{if(!st)return;const s=st;st=null;L.classList.add('spring');L.style.transform='';
  if(s.z==='head'&&H)H.patEnd();if(s.z==='body'&&s.drag)gazeEnd();if(e.type==='pointercancel')return;
  if(s.z==='body'){if(!s.drag){bounce('hop');pop(560);if(!voice()){H&&H.poke();say(rnd(TOUCH));}}return;}
  if(s.drag){pop(760);H&&H.pinch();say(rnd(PINCH));}
  else if(s.z==='cheek'){fxAt('rip',s.x,s.y);fxAt('blush',s.x,s.y);bounce('poke');pop(880);H&&H.poke();say(rnd(POKE));}
  else if(s.z==='head'){hearts(s.x,s.y);bounce('pat');pop(640);say(rnd(PAT));}};
 L.addEventListener('pointerup',end);L.addEventListener('pointercancel',end);
 // hint button: dashed boxes over head / cheek (same as the lobby)
 if(!cast.querySelector('.l2hint'))cast.insertAdjacentHTML('beforeend',`<div class="fx"></div><button type="button" class="l2hint" title="Bấm để hiện / ẩn vùng chạm">👆 Hiện vùng chạm của ${K.ch}</button>`);
 const FX=cast.querySelector('.fx'),hint=cast.querySelector('.l2hint');
 const zones=()=>{let z=null;try{z=L2D[K.ch]&&L2D[K.ch].live&&L2D[K.ch].live();}catch(_){}return z||ZF;};
 const draw=()=>{FX.querySelectorAll('.zb').forEach(z=>z.remove());if(!cast.classList.contains('zones'))return;
  const r=(E||L).getBoundingClientRect(),c=cast.getBoundingClientRect();
  Object.entries(zones()).forEach(([k,[a,b,x2,y2]])=>{const z=document.createElement('span');z.className='zb';z.dataset.k=k==='head'?'Đầu':'Má';
   Object.assign(z.style,{left:r.left-c.left+a*r.width+'px',top:r.top-c.top+b*r.height+'px',width:(x2-a)*r.width+'px',height:(y2-b)*r.height+'px'});FX.appendChild(z);});
  drawGrid(FX,cast,E||L,L2D[K.ch]&&L2D[K.ch].grid&&L2D[K.ch].grid());};
 hint.addEventListener('click',()=>{cast.classList.toggle('zones');draw();});
 addEventListener('resize',draw);
 let tried=false,introQ=null;
 // intro like the game: one of the Start animations, then idle, with its voice line. A rig loaded ahead of time (screen not open)
 // keeps its intro for the first time the screen is actually opened.
 const intro=o=>{const st=o.p.animationState,k=Math.random()*IN.length|0;
  if(has2(K.start(k))){st.setAnimation(0,K.start(k),false);st.addAnimation(0,'Idle_01',true,0);
   setTimeout(()=>{if(on()){audio(K.inFile(k+1));say(IN[k]);}},ID[k]);}};
 function wake(){if(P){if(on()){P.play&&P.play();if(introQ){const o=introQ;introQ=null;intro(o);}}return;}if(tried||!window.spineLoad)return;tried=true;
  spineLoad(K.ch).then(o=>{P=o.p;H=o.H;E=o.el;L.querySelectorAll('.cpor').forEach(x=>x.remove());hint.title=o.info+'\n\nBấm để hiện / ẩn vùng chạm';
   const st=o.p.animationState,A=o.p.skeleton.data.animations.map(a=>a.name),blink=A.find(n=>/^eye_?close/i.test(n));
   S=st;AN=A;TE=o.p.skeleton.findBone('Touch_Eye')||o.p.skeleton.findBone('Touch_Eye_Key');if(TE){EX=TE.x;EY=TE.y;}
   if(on())intro(o);else introQ=o;
   setInterval(()=>{if(on()&&blink&&!(st.getCurrent(1))&&!(H.busy&&H.busy()))st.setAnimation(2,blink,false);},6000);
   if(!on())P.pause&&P.pause();window.l2dRefit&&l2dRefit();})
  .catch(e=>{console.warn(K.ch+':',e);L.insertAdjacentHTML('afterbegin',porImg(CAST[K.cast][0],'cpor'));nm.textContent=CAST[K.cast][0];say(CAST[K.cast][1]);});}
 // warm-up: a screen student starts loading the moment a finger / mouse goes DOWN on a tile or Dock icon leading to its screen
 // (a head start before the tap lands), or when the screen opens. The old timed background queue (every student, one each 1.8 s,
 // from 2.5 s after load) is gone: it loaded all the rigs while the player was still scrolling the lobby = lag.
 {const W=window.WARM=window.WARM||[];W.push({sc,go:()=>{if(!P&&!tried)wake();}});
  if(!W.t){W.t=1;
   document.addEventListener('pointerdown',e=>{const a=e.target.closest&&e.target.closest('a[href^="#"]');if(!a)return;
    const t=document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1))),s=t&&t.closest('.screen'),w=s&&W.find(x=>x.sc===s);
    if(w&&!w.done){w.done=1;w.go();}},{capture:true,passive:true});}}
 let seen=false;
 const enter=()=>{if(!on()){P&&P.pause&&P.pause();mStop(au);return;}wake();say(seen?next():LOGIN);seen=true;};
 addEventListener('hashchange',enter);enter();
 return {say,on,act,audio};
}
stageTalk({sc:'#s-raid',cast:'raid',ch:'Rin',rd:'Spine/rin_wp/assets/',
 login:'Sensei, tôi là Nanagami Rin, Trưởng ban Hành chính Hội Học sinh Liên bang. Tôi xin báo cáo lịch Total Assault và Grand Assault.',
 // status lines come from the same schedule as the TA/GA cards
 status:()=>{const now=new Date(),out=[];
  MODES.forEach(([md,,lab])=>{const b=pick(md,now);if(!b)return;
   if(now<b.S)out.push(`${lab} ${b.n} sẽ mở sau ${days(b.S-now)} ngày, vào ngày ${dshort(b.S)}. Xin Sensei chuẩn bị đội hình từ bây giờ.`);
   else if(now<=b.E)out.push(`${lab} ${b.n} đang diễn ra, còn ${days(b.E-now)} ngày. Hội Học sinh Liên bang đề nghị Sensei hoàn thành trước hạn.`);});
  return out;},
 tips:['Cơ chế từng boss tôi đã tổng hợp ở mục Cơ chế boss. Xin Sensei đọc kỹ các dòng "Bắt buộc" trước khi xuất kích.',
  'Thứ tự thẻ mở đầu nên thử ở chế độ luyện tập trước. Không tốn vé.',
  'Đánh đúng hệ giáp thì sát thương gấp đôi. Đó là điều cơ bản, Sensei.',
  'Nếu cần tính lại thời gian theo đồng hồ máy, Sensei bấm nút Refresh ở bảng bên cạnh.'],
 touch:['…Sensei. Xin đừng chạm vào tôi khi đang báo cáo.','Đây là hành vi không cần thiết. Tôi sẽ coi như chưa có chuyện gì.',
  '…Sensei có việc gì cần tôi xử lý sao?','Nếu Sensei rảnh như vậy, tôi có thể gửi thêm hồ sơ.'],
 pat:['……Sensei. Tôi không phải học sinh cần được dỗ dành.','…Lần này tôi bỏ qua. Xin Sensei quay lại với lịch raid.','Tóc tôi sẽ rối mất… Nhưng, tôi không phản đối.'],
 poke:['Sensei. Chọc má Trưởng ban Hành chính không có trong quy trình nào cả.','…? Sensei vừa làm gì vậy?','Xin dừng lại. Tôi đang làm việc.'],
 pinch:['S-Sensei… xin buông ra. Như vậy rất mất thể diện.','…Tôi sẽ ghi việc này vào biên bản.','Má tôi không phải đồ chơi, Sensei.'],
 vo:['Chúng ta bắt đầu thôi.','Những tình huống như thế này lúc nào cũng khó mà chấp nhận được.','Không còn nhiều cách nữa. Schale là lựa chọn duy nhất còn lại.',
  'Tôi biết mình đã làm phiền Sensei rất nhiều.','…Sensei đang làm việc chăm chỉ.','Quan sát cách Sensei làm việc giúp tôi học được khá nhiều điều.'],vd:[1800,1000,1000,1000,1000,1000],
 in:['Tôi đã đợi Sensei.','Sensei biết điều gì khiến tôi vui không? Là Schale lo liệu giúp các vấn đề của Kivotos.'],id:[2500,3500],
 start:k=>`Start0${k+1}_Idle_01`,inFile:n=>`Rin_RaidLobby_In_${n}.ogg`,talkFile:n=>`Rin_RaidLobby_Talk_${n}.ogg`});
// Aoi (GSC Finance Office chief, runs Schale's financial statement in the game): reports from the live Eligma plan
stageTalk({sc:'.screen[data-cast="ue"]',cast:'ue',ch:'Aoi',rd:'Spine/aoi_wp/assets/',lookA:false,
 login:'Sensei, tôi là Oki Aoi, Trưởng phòng Tài chính Hội Học sinh Liên bang. Hôm nay tôi phụ trách quyết toán Eligma của Schale.',
 status:()=>{const e=Math.max(0,+eliIn.value||0),p=planFor(e),ok=p.rows.filter(r=>r.st==='ok'),sh=p.rows.find(r=>r.st==='short');
  const out=[`Số dư hiện tại: ${fmt(e)} Eligma. Theo kế hoạch, Sensei nâng được ${ok.length} bước và còn dư ${fmt(p.left)}.`];
  if(ok[0])out.push(`Khoản chi ưu tiên: ${ok[0].n} lên UE ${ok[0].t}★, tối đa ${fmt(ok[0].cost)} Eligma. Lý do: ${ok[0].why}.`);
  if(sh)out.push(`${sh.n} lên UE ${sh.t}★ còn thiếu ${fmt(sh.short)} Eligma. Khoản này chưa được duyệt.`);
  return out;},
 tips:['Buffer Special như Ibuki (Swimsuit), Ako, Himari không cần UE. Đề xuất chi cho các em ấy sẽ bị bác.',
  'Mỗi mốc UE nên gắn với một trận raid cụ thể. Chi trước lịch raid mới là chi đúng hạn.',
  'Sensei sửa số Eligma ở ô bên cạnh, tôi sẽ đối chiếu lại kế hoạch ngay.',
  'Eligma không tự sinh ra. Xin Sensei đừng chi vượt dự toán.'],
 touch:['…Sensei. Tôi đang đối chiếu sổ sách.','Hành động này không có trong ngân sách, Sensei.',
  'Nếu Sensei rảnh, tôi có thể gửi thêm bảng quyết toán.','…Xin Sensei tập trung vào công việc.'],
 pat:['…Sensei. Tôi đâu phải trẻ con mà cần được xoa đầu.','Ư… tóc tôi rối mất. …Nhưng thôi, để vậy một chút cũng được.','…Khoản này tôi sẽ không ghi vào sổ.'],
 poke:['Sensei. Chọc má Trưởng phòng Tài chính không phải khoản chi hợp lệ.','…? Sensei vừa làm gì vậy?','Xin dừng lại. Tôi đang tính số dư.'],
 pinch:['S-Sensei… buông ra. Như vậy rất mất thể diện.','…Tôi sẽ ghi việc này vào biên bản quyết toán.','Má tôi không co giãn như ngân sách đâu, Sensei.'],
 vo:['Hửm? Có chuyện gì vậy? Nếu có vấn đề gì, Sensei cứ nói với tôi. Tôi ở đây để hỗ trợ Sensei.','Đừng xa cách như vậy chứ. …Tôi cũng biết tổn thương đấy.',
  'Này… tôi ổn mà. Sensei nên kiểm tra chỗ kia thì hơn.','Ừm… tôi ổn.','Sensei tập trung giúp tôi được không? Không, không phải vào tôi… vào công việc ấy.'],vd:[1000,1000,1000,1000,1000],
 in:['Tôi đã đợi Sensei. Không còn thời gian để lãng phí đâu. Chúng ta bắt đầu ngay nhé?','Đây là nội dung công việc hôm nay. Tôi rất mong được thấy Sensei làm việc.'],id:[1500,1600],
 start:k=>`Start01_Idle_0${k+1}`,inFile:n=>`NP0032_MiniEventLogin_${n}.ogg`,talkFile:n=>`NP0032_MiniEventLobby_${n}.ogg`});
// Ayumu (GSC, the game's Tasks screen guide): timid, reads out what's left on the to-do list
const AY=stageTalk({sc:'.screen[data-cast="tasks"]',cast:'tasks',ch:'Ayumu',rd:'Spine/ayumu_wp/assets/',lookA:false,
 login:'S-Sensei, em là Iwabitsu Ayumu, Hội Học sinh Liên bang. Hôm nay em phụ trách danh sách việc cần làm ở Schale ạ.',
 status:()=>{const m=tkGet(),left=taskList().filter(x=>!x.lock&&!m[x.id]);
  return left.length?[`Còn ${left.length} việc chưa xong ạ. Việc tiếp theo là: ${left[0].t}.`,...left.slice(1,3).map(x=>`À… còn việc này nữa ạ: ${x.t}. ${x.s}`)]
   :['Sensei xong hết việc rồi ạ! …Em cũng phải cố gắng được như Sensei mới được.'];},
 tips:['Việc hằng ngày tự làm mới lúc 0:00, Sensei không cần bỏ tích bằng tay đâu ạ.',
  'Tích một bước UE là roster được cập nhật luôn… n-nên Sensei nhớ nâng trong game trước nhé.',
  'Rin-senpai dặn là việc nào có hạn chót thì làm trước ạ.'],
 touch:['Ơ… S-Sensei cần gì ạ?','Em… em chỉ đang kiểm tra lại danh sách thôi ạ.','Xin lỗi, em hơi giật mình…','N-nếu Sensei rảnh thì… còn mấy việc chưa xong đó ạ.'],
 pat:['Ư… S-Sensei… em ngại lắm…','…Được Sensei khen thế này, em sẽ cố gắng hơn ạ.','Rin-senpai mà thấy thì… nhưng mà… thêm một chút nữa cũng được ạ.'],
 poke:['Á! S-Sensei?','Má em… có dính gì sao ạ?','Đ-đừng trêu em mà…'],
 pinch:['S-Sensei… không đau đâu, nhưng mà ngại lắm ạ…','Ư… em đâu phải bánh mochi…','Em… em sẽ không mách Rin-senpai đâu ạ…'],
 vo:['Em mong mình cũng tích lũy được kinh nghiệm như Sensei.','Haa… em thật sự làm được không đây?','C-còn thiếu thông tin gì không ạ?','Nhiều việc quá…',
  'Haa… Rin-senpai giỏi mấy việc này thật. Chị ấy tuyệt quá.'],vd:[1000,1000,1000,1000,1000],
 in:['Đây là những việc Sensei cần hoàn thành ạ.','Những việc này đang chờ Sensei đó… Chúc Sensei may mắn.'],id:[500,2800],
 start:k=>`Start01_Idle_0${k+1}`,inFile:n=>`NP0013_Mission_Login_${n}.ogg`,talkFile:n=>`NP0013_Mission_${n}.ogg`});
// ticking a task: Ayumu plays the game's reward reaction, Get_0N animation with its own voice NP0013_Mission_Get_N.ogg (same N so the
// mouth matches). Last task done = Complete_0N + Mission_Daycomplete_N.ogg (that file is optional: if it isn't there, only the animation plays).
// the 4 Get lines play in turn (1 → 2 → 3 → 4 → 1…), not at random, so every tick sounds different;
// "Hoàn thành tất cả" (the game's Claim All) and the last task use Complete_0N + Mission_Daycomplete_N, also in turn
let AYG=0,AYC=0;
window.tkSay=(kind,x)=>{if(!AY||!AY.on())return;const m=tkGet(),left=taskList().filter(y=>!y.lock&&!m[y.id]).length;
 const pick1=a=>a[Math.random()*a.length|0];
 if(kind!=='undo'){if(kind==='all'||!left){const n=AYC%2+1;AYC++;AY.act(`Complete_0${n}`);AY.audio(`NP0013_Mission_Daycomplete_${n}.ogg`);}
  else{const n=AYG%4+1;AYG++;AY.act(`Get_0${n}`);AY.audio(`NP0013_Mission_Get_${n}.ogg`);}}
 AY.say(kind==='undo'?`Em bỏ dấu tích "${x.t}" rồi ạ.`
  :!left?'X-xong hết rồi ạ! Sensei giỏi quá… em sẽ báo lại với Rin-senpai.'
  :kind==='all'?`Em đánh dấu xong ${x.length} việc rồi ạ. Còn ${left} việc nữa thôi.`
  :/^(bounty|comm)-/.test(x.id)?pick1([`Việc Momoka-senpai giao xong rồi ạ… chắc chị ấy lại đi ăn snack. Còn ${left} việc.`,`Em báo lại với Momoka-senpai rồi ạ. Còn ${left} việc nữa.`])
  :pick1([`Đã xong: ${x.t}. Còn ${left} việc nữa ạ.`,`Em ghi lại rồi ạ! Còn ${left} việc.`,`Sensei nhanh quá… còn ${left} việc thôi ạ.`]));};
// Banner: Sora at the Angel 24 counter, sells the next banner from the live schedule
stageTalk({sc:'.screen[data-cast="banner"]',cast:'banner',ch:'Sora',rd:'Spine/ws_2959260737/assets/',lookA:false,
 login:'H-hoan nghênh quý khách! …À, Sensei! Em là Sora, nhân viên Angel 24. Hôm nay em giới thiệu banner giúp Sensei ạ.',
 status:()=>{const now=new Date(),out=[],cb=BAN[curBan(now)],live=cb.S<=now&&now<=cb.E;
  out.push(live?`Banner đang bán: ${cb.st.map(s=>s[0]).join(', ')}. Còn ${days(cb.E-now)} ngày ạ.`:`Banner kế tiếp mở ngày ${dshort(cb.S)}: ${cb.st.map(s=>s[0]).join(', ')}.`);
  const nb=BAN.flatMap(x=>x.E>=now?x.st.filter(s=>!(s[0] in OWN)&&s[7]==='go').map(s=>[s[0],x]):[])[0];
  out.push(nb?`Món em khuyên mua: ${nb[0]}, mở ngày ${dshort(nb[1].S)}. Sensei để dành pyroxene từ giờ nhé ạ.`:'Hiện chưa có học sinh nào đáng quay, Sensei cứ để dành pyroxene ạ.');
  out.push('Mốc chắc chắn có học sinh là 200 lượt, tức 24.000 pyroxene. Mua sỉ… à không, quay một lèo là lời nhất ạ!');
  return out;},
 tips:['Cửa hàng mở 24/7, nhưng banner thì có hạn đó Sensei.','Học sinh nào Sensei đã có sẵn, em không giới thiệu lại đâu ạ.',
  'Banner Global là dự đoán theo lịch JP, có thể bị gộp hoặc rút ngắn ạ.'],
 touch:['Ơ… Sensei cần mua gì ạ?','S-Sensei nhìn em chằm chằm vậy… em bồn chồn quá…','Hôm nay có khuyến mãi đó ạ!','…Em đang trực quầy mà Sensei.'],
 pat:['Á… S-Sensei… đầu em không phải hàng trưng bày đâu…','…Ehehe, được xoa đầu cũng thích ạ.','Trán! Sensei đừng đụng vào trán em nha!'],
 poke:['Á! Sensei?','Má em không có mã vạch đâu ạ…','Đ-đừng chọc nữa, khách nhìn kìa…'],
 pinch:['Ư… S-Sensei, em không phải bánh mochi trong tủ lạnh đâu…','Buông ra đi mà… em còn phải tính tiền…','Hu… má em dài ra mất…'],
 // the wallpaper's own subtitles, in order of the Talk_0N animation (its playlist runs 7-2-3-4-1-5-6)
 vo:['N-này! Coi chừng cái trán!','Chuẩn bị trước nhiệm vụ thì chẳng thiệt gì đâu ạ!','Thế nên… mua sỉ mới khôn đó! Mua ở đây là lời ngay!',
  'S-Sensei nhìn em chằm chằm… làm em bồn chồn quá…','Thẻ tín dụng… em xem thử được không ạ?','N-nhưng mà… giá ở cửa hàng em CẠNH TRANH lắm đó.','Tụi em mở cửa 24/7. Ngày hay đêm Sensei cứ ghé nhé.'],
 vd:[500,500,500,500,500,500,500],
 in:['Chán quá… Ơ-Ơ! Sensei tới từ lúc nào vậy?','C-c-chào mừng quý khách! …Sensei!'],id:[500,1000],
 start:k=>`Start0${k+1}_Idle_01`,inFile:n=>`Sora_Shop_In_${[2,1][n-1]}.ogg`,talkFile:n=>`Sora_Shop_Talk_${n}.ogg`});
// PvP: Momoka (GSC, lazy, hands Sensei the daily Bounty / Commissions): nags about today's tickets from the to-do list
stageTalk({sc:'.screen[data-cast="pvp"]',cast:'pvp',ch:'Momoka',rd:'Spine/ws_2959842788/assets/',
 login:'Ồ, Sensei tới rồi à. Em là Yuraki Momoka, phòng Giao thông Hội Học sinh Liên bang. Việc hằng ngày em giao sẵn rồi đó~',
 status:()=>{const m=tkGet(),d=vnDay(),L=[['pvp','5 vé Tactical Challenge'],['bounty','vé Truy nã tội phạm'],['comm','vé Ủy thác đặc biệt']].filter(([k])=>!m[k+'-'+d]);
  const h=+new Date().toLocaleString('en-US',{timeZone:'Asia/Ho_Chi_Minh',hour:'numeric',hour12:false});
  return L.length?[`Hôm nay Sensei còn: ${L.map(x=>x[1]).join(', ')}. Làm xong thì nhớ tích ở màn Nhiệm vụ nha.`,
   ...(!m['pvp-'+d]&&h<12?[`Còn ${12-h} tiếng nữa là phát thưởng hạng PvP lúc 12:00. Đánh lẹ đi Sensei, em còn đi ăn trưa~`]:[])]
   :['Xong hết việc hôm nay rồi á? …Vậy em giao thêm việc nhé. Đùa thôi, em đi ăn snack đây~'];},
 tips:['Bảng meta bên cạnh là tổng kết mùa của JP. Global đang chạy đúng luật mùa đó đấy.','Đội phòng thủ cũng quan trọng nha. Đừng để người ta đánh lén lúc ngủ.',
  'Có ai thấy gói snack trứng cá tuyết của em không…?'],
 touch:['Hửm? Có chuyện gì vậy?','Đang giờ nghỉ của em mà Sensei~','Muốn xin snack thì quên đi nhé.','Sensei với Rin đúng là bận rộn ghê.'],
 pat:['Ê ê! Đừng đụng sừng em! Nhạy cảm lắm đó!','…Hừm, xoa đầu thì được. Né cái sừng ra là được.','Sensei tưởng em là con nít hả?'],
 poke:['Ơ? Chọc má em làm gì?','…Sensei rảnh quá ha.','Chọc nữa là em mách Rin-senpai đó.'],
 pinch:['Ư-ư! Buông ra, em đang nhai snack mà!','Má em đâu phải bánh gạo…','Được rồi được rồi, em làm việc đây… buông ra đi~'],
 // the wallpaper's own subtitles for Talk_01..07, translated
 vo:['Hửm? Có chuyện gì vậy?','Không có bánh trứng cá tuyết cho Sensei đâu! Đừng có năn nỉ!','Đừng đụng sừng em! Nhạy cảm lắm đó!','Sensei với Rin đúng là bận rộn ghê.',
  'Sao? Sensei tưởng em chỉ là con nít… đúng không?','Cảm ơn đã xử lý mấy việc này nha. Đây, thêm việc cho Sensei nè.','Hahaha! Phải ngốc lắm mới vì học sinh mà làm tới mức đó.'],
 vd:[500,500,500,500,500,500,500],
 in:['Chào mừng, Sensei.','Haha. Em đợi Sensei nãy giờ đó.'],id:[5000,5800],
 start:k=>`Start0${k+1}_Idle_01`,inFile:n=>`Momoka_WeekDungeon_In_${n}.ogg`,talkFile:n=>`Momoka_WeekDungeon_Talk_${n}.ogg`});
// "?" next to the screen title: short how-to for whichever screen is open (game: mechanic guide button)
(function(){const btn=document.getElementById('tbHelp'),pop=document.getElementById('hpop'),T=document.getElementById('hpopT'),B=document.getElementById('hpopB');if(!btn||!pop)return;
 const HELP={
  home:['Sảnh','Chạm học sinh trực ca: giữ ở đầu để xoa đầu, chạm má để chọc, giữ rồi kéo ở má để véo, kéo trên người để mắt nhìn theo, chạm người để nghe thoại.|Ban ngày là Arona, từ 18:00 đến 6:00 là Plana. Nút 🌙 đổi giao diện sáng / tối.|Bấm một ô để vào màn đó. Nút › ở cạnh phải ẩn toàn bộ ô để ngắm học sinh.|Thanh trên cùng: 💠 Eligma và ⚔️ TA bấm vào là nhảy tới đúng mục. 🏠 luôn đưa bạn về sảnh.'],
  's-raid':['Total Assault · Grand Assault','Mỗi thẻ là boss đang mở hoặc sắp mở, giờ đã đổi sang giờ Việt Nam.|🔄 Refresh tính lại theo đồng hồ máy trên lịch đã lưu sẵn, không tải dữ liệu mới.|Nút vàng đưa bạn tới trang cơ chế và đội hình của boss đó.|Bấm khung hội thoại để Rin báo lịch; chạm Rin như ở sảnh.'],
  's-banner':['Banner Global','Chọn tuần ở hàng nút trên cùng; tuần đã qua mờ đi.|Mỗi học sinh ghi đạn, giáp, tier và đánh giá có nên quay theo roster của bạn.|Lịch Global là dự đoán theo JP, có thể bị gộp hoặc rút ngắn.'],
  's-pvp':['Tactical Challenge · PvP','Đồng hồ mùa tính theo giờ Việt Nam; 🔄 Refresh tính lại theo đồng hồ máy.|Meta và đội gợi ý lấy từ tổng kết mùa của người chơi JP, vì Global đang chạy đúng luật mùa JP đã chơi xong.|Bấm khung hội thoại để Momoka nhắc vé PvP, Truy nã và Ủy thác hôm nay còn chưa đánh.'],
  's-ue':['Kế hoạch UE','Nhập Eligma đang có vào máy tính: kế hoạch tự xếp lại và ghi khoản nào đủ, khoản nào thiếu.|Bấm thẻ học sinh ở màn Học sinh để cập nhật mốc UE vừa nâng; trang tự lưu trên trình duyệt.|Bấm khung hội thoại để Aoi quyết toán số dư; chạm Aoi như ở sảnh.'],
  's-task':['Nhiệm vụ','Danh sách tự lập từ lịch TA/GA, Joint Firing Drill, banner và kế hoạch UE; tab trên cùng lọc theo loại.|Bấm vòng tròn ✓ để đánh dấu xong, bấm lại để bỏ. Việc hằng ngày tự làm mới lúc 0:00 giờ Việt Nam.|Tích một bước UE là ghi luôn mốc UE mới vào roster, rồi cả report tính lại.|Nút vàng hoàn thành mọi việc đang hiện, trừ các bước UE. Ô 📋 trên thanh trên cùng luôn cho biết còn bao nhiêu việc.'],
  's-stu':['Học sinh','Tab SS+ · SS · S · A · B–C lọc theo tier; ô tìm kiếm lọc theo tên.|Góc thẻ là icon hệ đạn, ★ là số mốc UE.|Bấm thẻ để mở hồ sơ: thông tin cơ bản và thứ tự nâng kỹ năng, trang bị.|Cuối màn là danh sách nguồn đầy đủ của cả report.'],
  's-roster':['Roster của tôi','Mỗi hàng một học sinh: dấu "Có", số sao, mốc UE, level và 4 kỹ năng (EX · Normal · Passive · Sub). Hàng đã sửa có vạch màu bên trái.|Bấm Lưu để cả report tính lại theo roster mới; rời trang khi chưa lưu thì trình duyệt hỏi lại.|Dữ liệu chỉ nằm trên trình duyệt này. Xuất file để giữ bản sao hoặc mang sang máy khác, rồi Nhập file ở đó.|Về mặc định xoá mọi chỉnh sửa roster và mốc UE đã lưu trên máy này.'],
  's-boss':['Cơ chế boss · Đội hình','Bảng khắc hệ dùng hai chiều: hàng đạn của DPS khi bạn đánh, hàng đạn của boss khi boss đánh bạn.|Chọn boss bằng tên hoặc nút Boss trước / Boss sau; lọc theo giáp ở hàng nút trên.|Đỏ = Bắt buộc, cam = Cẩn thận, xanh = Mẹo. Chip viền nét đứt là học sinh cần mượn.'],
  's-jfd':['Joint Firing Drill','Tab "Mùa này" mở sẵn: giáp, địa hình, luật từng phase của đợt đang mở và đội gợi ý ngay bên dưới. Các tab sau: Cách chơi, Kiểu đề, Thưởng.|Dòng dưới tiêu đề đếm giờ đợt đang mở (hoặc ngày mở đợt sau) theo giờ Việt Nam; nền đổi theo địa hình của đợt.|Đội gợi ý lọc từ roster của bạn: đúng hệ đạn khắc giáp địch và bậc địa hình S / A, 6 người mỗi nhóm, chỉ hiện khi có đợt đang mở.']};
 const cur=()=>{const s=document.querySelector('.screen.on');return s?s.id:'home';};
 const close=()=>{pop.classList.remove('on');btn.setAttribute('aria-expanded','false');};
 btn.addEventListener('click',e=>{e.stopPropagation();if(pop.classList.contains('on'))return close();
  const h=HELP[cur()]||HELP.home;T.textContent='❔ '+h[0];B.innerHTML=h[1].split('|').map(x=>`<li>${x}</li>`).join('');
  pop.classList.add('on');btn.setAttribute('aria-expanded','true');});
 document.addEventListener('click',e=>{if(!pop.contains(e.target))close();});
 addEventListener('keydown',e=>{if(e.key==='Escape')close();});
 addEventListener('hashchange',close);
})();
// lobby HUD hide: collapse the tiles to look at the Live2D student full width; any other screen brings the HUD back
// (Học sinh tile live line: roster size + how many SS+/SS still have no UE, from the same data as the tier list)
(function(){const t=document.getElementById('tStu');if(!t)return;const n=[SSP,SS,S,A,BC].reduce((a,g)=>a+g.length,0),no=[...SSP,...SS].filter(x=>!x[1]).length;
 t.querySelector('.ttag').textContent=`${n} học sinh`;t.querySelector('small').textContent=`17/17 SS+ · ${no} SS+/SS chưa mở UE`;})();
(function(){const b=document.getElementById('hudTg');if(!b)return;
 const set=off=>{document.body.classList.toggle('hud-off',off);b.textContent=off?'‹':'›';
  b.setAttribute('aria-label',off?'Hiện lại các ô chức năng':'Ẩn các ô chức năng để ngắm học sinh');dispatchEvent(new Event('resize'));};
 b.addEventListener('click',()=>set(!document.body.classList.contains('hud-off')));
 addEventListener('hashchange',()=>{if(document.body.classList.contains('hud-off'))set(false);});
})();
// lobby cards (desktop): every card leans around its own middle, so a tall card and a short one would leave a staircase between
// rows. Shift each card sideways by tan(lean) × (grid middle − card middle): all slanted edges then fall on one straight line.
// One ResizeObserver on the grid (fires on resize, on opening the lobby, on the 900px switch); phones keep --dx = 0.
(function(){const g=document.querySelector('#home .tiles');if(!g||!window.ResizeObserver)return;const mq=matchMedia('(min-width:901px)');let q=0;
 const lay=()=>{q=0;const on=mq.matches&&g.offsetHeight>0,gy=g.offsetHeight/2,
   k=Math.tan(-(parseFloat(getComputedStyle(g).getPropertyValue('--sk'))||0)*Math.PI/180);
  g.querySelectorAll('.tile').forEach(t=>t.style.setProperty('--dx',on?(k*(gy-t.offsetTop-t.offsetHeight/2)).toFixed(1)+'px':'0px'));};
 new ResizeObserver(()=>{if(!q)q=requestAnimationFrame(lay);}).observe(g);})();
// ===== swipe back from the left or right edge (touch): the open screen follows the finger and the screen before it shows
// underneath; let go past a third of the width (or flick) and it slides away = back, otherwise it springs back into place
(function(){
 const HS=[location.hash||'#home'];
 addEventListener('hashchange',()=>{const h=location.hash||'#home',i=HS.lastIndexOf(h);if(i>=0)HS.length=i+1;else HS.push(h);});
 const scrOfH=h=>{const t=document.getElementById(decodeURIComponent((h||'#home').slice(1)));return (t&&t.closest('.screen'))||document.getElementById('home');};
 // where "back" goes: the last earlier entry that is on another screen (else the lobby)
 const backTo=()=>{const cur=curScr;for(let i=HS.length-2;i>=0;i--){const s=scrOfH(HS[i]);if(s!==cur)return {h:HS[i],s,n:HS.length-1-i};}
  return {h:'#home',s:document.getElementById('home'),n:0};};
 const goBack=b=>{if(b.n>0&&history.length>1)history.go(-b.n);else location.hash=b.h;};
 const EDGE=28,popOpen=()=>!!document.querySelector('.gm.on');let g=null;
 const begin=()=>{const cur=curScr,b=backTo(),tgt=b.s;if(!cur||cur===tgt)return false;zClean();
  const tb=Math.max(0,document.getElementById('topbar').getBoundingClientRect().bottom),Hv=innerHeight-tb,top=cur.getBoundingClientRect().top;
  g.y=scrollY;g.cur=cur;g.tgt=tgt;g.b=b;g.W=innerWidth;
  cur.classList.add('zfix','swp');cur.style.top=tb+'px';cur.style.height=Hv+'px';cur.scrollTop=Math.max(0,tb-top);
  tgt.classList.add('on','zleave');tgt.style.top=tb+'px';tgt.style.height=Hv+'px';tgt.scrollTop=tgt.id==='home'?ZM.homeY:0;
  tgt.style.transformOrigin=`50% ${Hv/2}px`;ZD.classList.add('z');return true;};
 const paint=d=>{const p=Math.min(1,Math.max(0,d/g.W));g.cur.style.transform=`translateX(${(g.side*d).toFixed(1)}px)`;
  ZD.style.opacity=(1-p).toFixed(3);g.tgt.style.transform=`translateX(${(-g.side*(1-p)*g.W*.25).toFixed(1)}px) scale(${(.95+.05*p).toFixed(4)})`;};
 const tidy=()=>{const {cur,tgt}=g;[cur,tgt].forEach(s=>{s.style.transform=s.style.transformOrigin='';});cur.classList.remove('swp');ZD.style.opacity='';};
 addEventListener('touchstart',e=>{g=null;if(e.touches.length!==1||!curScr||curScr.id==='home'||popOpen())return;const t=e.touches[0];
  const side=t.clientX<EDGE?1:t.clientX>innerWidth-EDGE?-1:0;if(!side)return;g={x0:t.clientX,y0:t.clientY,side,on:false,t:performance.now(),v:0,lx:t.clientX};},{passive:true});
 addEventListener('touchmove',e=>{if(!g)return;const t=e.touches[0],dx=(t.clientX-g.x0)*g.side,dy=t.clientY-g.y0;
  if(!g.on){if(Math.abs(dy)>12&&Math.abs(dy)>Math.abs(dx)){g=null;return;}if(dx<10)return;if(!begin()){g=null;return;}g.on=true;}
  e.preventDefault();const now=performance.now();g.v=(t.clientX-g.lx)*g.side/Math.max(1,now-g.t);g.t=now;g.lx=t.clientX;paint(Math.max(0,dx-10));},{passive:false});
 const end=e=>{if(!g)return;const s=g;g=null;if(!s.on)return;g=s;
  const d=Math.max(0,(s.lx-s.x0)*s.side-10),go=e.type!=='touchcancel'&&(d>s.W*.33||(s.v>.45&&d>30)),o={duration:go?230:260,easing:'cubic-bezier(.32,.72,0,1)',fill:'forwards'};
  const from=s.cur.style.transform,toX=go?s.side*s.W:0;
  const a=s.cur.animate([{transform:from},{transform:`translateX(${toX}px)`}],o);
  s.tgt.animate([{transform:s.tgt.style.transform},{transform:go?'translateX(0px) scale(1)':`translateX(${-s.side*s.W*.25}px) scale(.95)`}],o);
  ZD.animate([{opacity:ZD.style.opacity||1},{opacity:go?0:1}],o);
  a.onfinish=()=>{const q=s;g=null;q.cur.getAnimations().concat(q.tgt.getAnimations(),ZD.getAnimations()).forEach(x=>x.cancel());
   if(go){q.cur.style.visibility='hidden';tidy.call(null,g=q);g=null;ZM.skip=1;goBack(q.b);
    // the swiped screen stays hidden until the route has switched away from it
    const un=()=>{q.cur.style.visibility='';removeEventListener('hashchange',un);};addEventListener('hashchange',un);setTimeout(un,800);}
   else{g=q;tidy();g=null;q.cur.classList.remove('zfix');q.cur.style.top=q.cur.style.height='';
    q.tgt.classList.remove('on','zleave');q.tgt.style.top=q.tgt.style.height='';ZD.classList.remove('z');zJump(q.y);}};};
 addEventListener('touchend',end);addEventListener('touchcancel',end);
})();
// ===== student profile = iOS-style BOTTOM SHEET (every window size): it rises from the bottom edge and has two resting heights,
// "half" (~2/3 of the window) and "full". Drag the grab bar (or the portrait): up = expand to full, down = back to half, down again
// (or a fast flick) = close. Tap / double-click the bar toggles half ⇄ full. While dragging, the sheet follows the finger 1:1
// (height above the half stop, a slide below it) and the backdrop dims with it; on release it springs to the nearest stop with
// the Apple curve. Reopening always starts at "half".
(function(){
 const EASE='cubic-bezier(.32,.72,0,1)';
 document.querySelectorAll('.gm .gbox').forEach(box=>{const gm=box.closest('.gm');if(box.classList.contains('sheet'))return;
  box.classList.add('sheet');
  if(!box.querySelector('.grab'))box.insertAdjacentHTML('afterbegin','<div class="grab" role="button" tabindex="0" aria-label="Kéo lên để mở rộng, kéo xuống để đóng" title="Kéo lên: mở rộng · Kéo xuống: đóng"><i></i></div>');
  const closeBtn=()=>gm.querySelector('#gmx')||gm.querySelector('.gtop button');
  const dim=k=>gm.style.backgroundColor=`rgba(15,40,70,${(.45*Math.max(0,Math.min(1,k))).toFixed(3)})`;
  // measure both stops with transitions off (a running height transition would report the in-between value)
  const stops=()=>{const tr=box.style.transition;box.style.transition='none';box.style.height='';const was=box.classList.contains('full');
   box.classList.remove('full');const half=box.getBoundingClientRect().height;box.classList.add('full');const full=box.getBoundingClientRect().height;
   box.classList.toggle('full',was);void box.offsetHeight;box.style.transition=tr;return {half,full};};
  const settle=(full)=>{box.style.transition='';void box.offsetHeight;box.classList.toggle('full',full);box.style.height='';box.style.transform='';gm.style.backgroundColor='';};
  // DISMISS animation, shared by every way of closing (drag down, ✕, tap on the backdrop, Esc): the sheet slides down off the
  // screen while the backdrop (#gm scrim) fades to clear, then the page's own close handler runs (via the ✕ button, flagged
  // __pass so it isn't intercepted again). from = how far the sheet is already pulled down (0 for ✕ / backdrop / Esc).
  const close=from=>{if(gm.__anim)return;gm.__anim=1;
   // Esc in the middle of a drag: end the drag and slide on from where the finger left the sheet (no jump back to 0)
   if(d){try{d.el.releasePointerCapture(d.id);}catch(_){}d=null;}
   from=Math.max(from,parseFloat((box.style.transform.match(/translateY\(([-\d.]+)px/)||[])[1])||0);
   const ms=matchMedia('(prefers-reduced-motion: reduce)').matches?1:from?230:300,o={duration:ms,easing:EASE,fill:'forwards'};
   const a=box.animate([{transform:`translateY(${from}px)`},{transform:`translateY(${innerHeight}px)`}],o);
   gm.animate([{backgroundColor:gm.style.backgroundColor||getComputedStyle(gm).backgroundColor},{backgroundColor:'rgba(15,40,70,0)'}],o);
   a.onfinish=()=>{const b=closeBtn();gm.__pass=1;try{b?b.click():gm.classList.remove('on');}finally{gm.__pass=0;gm.__anim=0;}
    box.getAnimations().concat(gm.getAnimations()).forEach(x=>x.cancel());box.style.cssText='';gm.style.backgroundColor='';box.classList.remove('full');};};
  // the same animated close for code outside this block (the page's own Esc handler uses it)
  gm._animClose=()=>close(0);
  // ✕ and a tap on the backdrop itself: play the dismiss first (capture phase, so the instant close doesn't run yet)
  gm.addEventListener('click',e=>{if(gm.__pass||!gm.classList.contains('on'))return;
   if(e.target===gm||e.target.closest('#gmx')){e.preventDefault();e.stopImmediatePropagation();close(0);}},true);
  // Esc while the sheet is open
  document.addEventListener('keydown',e=>{if(e.key!=='Escape'||gm.__pass||!gm.classList.contains('on'))return;
   e.preventDefault();e.stopImmediatePropagation();close(0);},true);
  let d=null;
  const down=e=>{if(e.pointerType==='mouse'&&e.button!==0)return;if(e.target.closest('button:not(.grab),a,input'))return;
   const S=stops(),full=box.classList.contains('full');
   d={y0:e.clientY,y:e.clientY,t:performance.now(),v:0,id:e.pointerId,el:e.currentTarget,moved:false,full,S,h0:full?S.full:S.half};
   try{d.el.setPointerCapture(e.pointerId);}catch(_){}};
  const move=e=>{if(!d||e.pointerId!==d.id)return;const dy=e.clientY-d.y0;if(Math.abs(dy)>4)d.moved=true;if(!d.moved)return;
   const now=performance.now();d.v=(e.clientY-d.y)/Math.max(1,now-d.t);d.t=now;d.y=e.clientY;
   box.style.transition='none';
   // above the half stop the sheet changes height (rubber band past full), below it the half sheet slides down
   let h=d.h0-dy;if(h>d.S.full)h=d.S.full+(h-d.S.full)*.25;
   if(h>=d.S.half){box.style.height=h.toFixed(1)+'px';box.style.transform='';dim(1);}
   else{box.style.height=d.S.half+'px';const off=d.S.half-h;box.style.transform=`translateY(${off.toFixed(1)}px)`;dim(1-off/d.S.half);}};
  const up=e=>{if(!d||e.pointerId!==d.id)return;const s=d;d=null;
   if(!s.moved){if(e.type!=='pointercancel'&&s.el.classList.contains('grab'))settle(!s.full);return;}
   const dy=s.y-s.y0,h=s.h0-dy,fl=s.v;
   if(e.type==='pointercancel')return settle(s.full);
   if(h<s.S.half*.72||(fl>.7&&h<=s.S.half+20))return close(Math.max(0,s.S.half-h));     // pulled well below half, or flicked down from half
   if(fl<-.45||h>(s.S.half+s.S.full)/2)return settle(true);                              // flicked up, or past the middle → full
   settle(false);};                                                                        // otherwise → half
  [box.querySelector('.grab'),box.querySelector('.gl')].filter(Boolean).forEach(h=>{h.addEventListener('pointerdown',down);
   h.addEventListener('pointermove',move);h.addEventListener('pointerup',up);h.addEventListener('pointercancel',up);});
  const gb=box.querySelector('.grab');gb.addEventListener('dblclick',()=>settle(!box.classList.contains('full')));
  gb.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();settle(!box.classList.contains('full'));}});
  // scrolling the text up from the top of a half sheet expands it, like Apple Maps
  const gp=box.querySelector('.gpane');
  if(gp)gp.addEventListener('wheel',e=>{if(!box.classList.contains('full')&&e.deltaY>0&&gp.scrollTop<=0&&gp.scrollHeight>gp.clientHeight+40)settle(true);},{passive:true});
  // pulling the text DOWN while it is already at its top drags the sheet itself (full -> half, half -> close), like iOS.
  // Touch events, because the browser owns vertical panning on the text and would cancel pointer events; same move / up as the bar.
  if(gp){let t=null;
   gp.addEventListener('touchstart',e=>{t=e.touches.length===1&&gp.scrollTop<=0?{y:e.touches[0].clientY,on:false}:null;},{passive:true});
   gp.addEventListener('touchmove',e=>{if(!t)return;const y=e.touches[0].clientY;
    if(!t.on){if(y-t.y<6){if(t.y-y>6)t=null;return;}   // moved up first = normal text scroll, let it go
     const S=stops(),full=box.classList.contains('full');t.on=true;
     d={y0:y,y,t:performance.now(),v:0,id:'tp',el:gp,moved:true,full,S,h0:full?S.full:S.half};}
    e.preventDefault();move({clientY:y,pointerId:'tp'});},{passive:false});
   const end=e=>{if(t&&t.on)up({type:e.type==='touchcancel'?'pointercancel':'pointerup',pointerId:'tp'});t=null;};
   gp.addEventListener('touchend',end);gp.addEventListener('touchcancel',end);}
  // collapsing header: how far the text pane has scrolled (0..1 over the first 140px) drives the portrait band height
  if(gp){let q=0;const sh=()=>{q=0;box.style.setProperty('--sh',Math.min(1,gp.scrollTop/140).toFixed(3));};
   gp.addEventListener('scroll',()=>{if(!q)q=requestAnimationFrame(sh);if(!box.classList.contains('full')&&gp.scrollTop>60)settle(true);},{passive:true});
   new MutationObserver(()=>{if(gm.classList.contains('on')){gm.__anim=0;box.classList.remove('full');box.style.height=box.style.transform='';requestAnimationFrame(sh);}})
    .observe(gm,{attributes:true,attributeFilter:['class']});}});
})();
