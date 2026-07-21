/* CORE: RODIC – stav, sekce, drawer/hlavička, render(), go(), toast, úvodní spuštění */
const SECTIONS=[['prehled','Přehled','◆'],['aktuality','Novinky','▲'],['dochazka','Docházka a náhrady','✓'],['profil','Profil dítěte','☺'],['platby','Platby','₵'],
  ['kalendar','Kalendář','▦'],['plan','Tématický plán','✎'],['fotky','Fotky','▢'],['kontakty','Kontakty','✆']];
const TITLES=Object.fromEntries(SECTIONS.map(s=>[s[0],s[1]]));

let ci=0, section='prehled', view='tyden', sel=-1, bulk=false, selSet=new Set(), overlay=null, drawerOpen=false, dashDay=TODAY, kalSel=TODAY, weekStart=1;
let kalY=2026, kalM=5;
let kidMenuOpen=false;
let dashEdit=false;
let draft={};   // {den: {code, note}}
let dashPickerOpen=false;
let pfEdit=null;   // rozpracovaná editace profilu (overlay 'profedit')
let faktRok='2025/26', faktStav='vse';   // filtr faktur (rok/stav)
let planIdx=9;   // vybraný měsíc v tématickém plánu (index do TEMA_MESICE; 9 = červen)
let novStrana=1;   // stránka v seznamu ostatních (neduležitých) novinek

const RENDER={prehled:renderDashboard,aktuality:renderAktuality,dochazka:renderDochazka,profil:renderProfil,platby:renderPlatby,kalendar:renderKalendar,plan:renderPlan,fotky:renderFotky,kontakty:renderKontakty};

function renderDrawer(){
  const d=document.getElementById('drawer');
  d.classList.toggle('on',drawerOpen);
  document.getElementById('scrim').classList.toggle('on',drawerOpen);
  d.innerHTML=`<div class="dh"><img class="brand-mark" src="${VHAAJI_LOGO}" alt=""><span class="brand-txt">IS Vhaaji</span></div>`+SECTIONS.map(s=>`<button class="ditem ${section===s[0]?'on':''}" onclick="go('${s[0]}')"><span class="ic">${icon(s[0])||s[2]}</span>${s[1]}</button>`).join('')
    +`<div class="dfoot"><button class="ditem" onclick="openUcet()"><span class="dfoot-acc">${ACCOUNT.jmeno}<small>Nastavení účtu</small></span></button>
      <button class="ditem" onclick="showToast('Odhlášení – jen náhled, v prototypu nefunguje')"><span class="ic">${icon('odhlasit')||'⏻'}</span>Odhlásit se</button></div>`;
}
/* Nadpis sekce (H1) se renderuje do topbaru (v řádku s přepínačem dítěte), ne do obsahu. */
const PAGEH={dochazka:'Docházka a náhrady',platby:'Platby',kalendar:'Kalendář',plan:'Tématický plán',fotky:'Fotky',aktuality:'Novinky ze školky',kontakty:'Kontakty'};
function renderHead(){
  const dh=document.getElementById('dashhead');
  dh.innerHTML = overlay ? ''
    : section==='prehled' ? renderDashHead()
    : section==='profil'  ? `<h1 class="dh-t">Profil dítěte</h1><button class="dh-edit" onclick="openProfEdit()">Upravit údaje</button>`
    : section==='plan'    ? `<h1 class="dh-t">Tématický plán</h1><div class="dh-nav plan-head-nav"><button class="dh-step" onclick="stepPlan(-1)" ${planIdx<=0?'disabled':''} aria-label="Předchozí měsíc">‹</button><span class="dh-lbl">${planLabel()}</span><button class="dh-step" onclick="stepPlan(1)" ${planIdx>=TEMA_MESICE.length-1?'disabled':''} aria-label="Další měsíc">›</button></div>`
    : `<h1 class="dh-t">${PAGEH[section]||''}</h1>`;
  const el=document.getElementById('kidsel');
  if(overlay){el.style.display='none';return;}
  el.style.display='block';
  const c=cur();
  let h=`<button class="kbtn" onclick="toggleKidMenu(event)">${avatar(c,24)}<span>${c.n}</span><span class="kcaret">▾</span></button>`;
  if(kidMenuOpen){h+=`<div class="kmenu">`+children.map((k,i)=>`<button class="kitem${i===ci?' on':''}" onclick="pickKid(${i})">${avatar(k,24)}<span>${k.n}</span>${i===ci?'<span class="kchk">✓</span>':''}</button>`).join('')+`</div>`;}
  el.innerHTML=h;
}
function render(){
  /* Každá sekce má vlastní velký nadpis (h1.dh-t) → v topbaru ho neopakujeme.
     Titulek zůstává jen u overlayů, které vlastní nadpis nemají. */
  document.getElementById('ttl').textContent=overlay?(overlay.type==='menu'?'Jídelníček':overlay.type==='omluvenka'?'Omluvenka':overlay.type==='novinka'?'Novinka':(overlay.type==='profedit'||overlay.type==='ucet')?'':'Akce'):'';
  renderHead();renderDrawer();
  document.getElementById('modalRoot').innerHTML = (typeof absModal!=='undefined'&&absModal)?renderAbsModal():((typeof dayModal!=='undefined'&&dayModal!=null)?renderDayModal():'');
  document.getElementById('content').innerHTML = overlay?(overlay.type==='menu'?renderMenuDetail():overlay.type==='omluvenka'?renderOmluvenka():overlay.type==='novinka'?renderNovinka():overlay.type==='profedit'?renderProfEdit():overlay.type==='ucet'?renderUcet():renderAkceDetail(overlay.idx)):RENDER[section]();
}
window.go=s=>{section=s;overlay=null;drawerOpen=false;render();};
window.openDrawer=()=>{drawerOpen=true;render();};
window.toggleKidMenu=e=>{e.stopPropagation();kidMenuOpen=!kidMenuOpen;render();};
window.pickKid=i=>{ci=i;kidMenuOpen=false;render();};
window.closeDrawer=()=>{drawerOpen=false;render();};
document.addEventListener('click',()=>{if(kidMenuOpen||dashPickerOpen){kidMenuOpen=false;dashPickerOpen=false;render();}});

render();
