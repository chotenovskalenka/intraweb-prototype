/* CORE: RODIC — stav, sekce, drawer/hlavička, render(), go(), toast, úvodní spuštění */
const SECTIONS=[['prehled','Přehled','◆'],['aktuality','Novinky','▲'],['dochazka','Docházka a náhrady','✓'],['profil','Profil dítěte','☺'],['platby','Platby','₵'],
  ['kalendar','Kalendář','▦'],['plan','Tématický plán','✎'],['fotky','Fotky','▢'],['kontakty','Kontakty','✆']];
const TITLES=Object.fromEntries(SECTIONS.map(s=>[s[0],s[1]]));
const PERCHILD=['prehled','dochazka','profil','platby','fotky'];

let ci=0, section='prehled', view='tyden', sel=-1, bulk=false, selSet=new Set(), overlay=null, drawerOpen=false, dashDay=TODAY, kalSel=TODAY, weekStart=1;
let kalY=2026, kalM=5;
let kidMenuOpen=false;
let dashEdit=false;
let draft={};   // {den: {code, note}}
let dashPickerOpen=false;
let pfEdit=null;   // rozpracovaná editace profilu (overlay 'profedit')
let faktRok='2025/26', faktStav='vse';   // filtr faktur (rok/stav)

const RENDER={prehled:renderDashboard,aktuality:renderAktuality,dochazka:renderDochazka,profil:renderProfil,platby:renderPlatby,kalendar:renderKalendar,plan:renderPlan,fotky:renderFotky,kontakty:renderKontakty};

function renderDrawer(){
  const d=document.getElementById('drawer');
  d.classList.toggle('on',drawerOpen);
  document.getElementById('scrim').classList.toggle('on',drawerOpen);
  d.innerHTML=`<div class="dh"><img class="brand-mark" src="${VHAAJI_LOGO}" alt=""><span class="brand-txt">IS Vhaaji</span></div>`+SECTIONS.map(s=>`<button class="ditem ${section===s[0]?'on':''}" onclick="go('${s[0]}')"><span class="ic">${icon(s[0])||s[2]}</span>${s[1]}</button>`).join('');
}
/* Nadpis sekce (H1) se renderuje do topbaru (v řádku s přepínačem dítěte), ne do obsahu. */
const PAGEH={dochazka:'Docházka a náhrady',platby:'Platby',kalendar:'Kalendář',plan:'Tématický plán',fotky:'Fotky',aktuality:'Novinky ze školky',kontakty:'Kontakty'};
function renderHead(){
  const dh=document.getElementById('dashhead');
  dh.innerHTML = overlay ? ''
    : section==='prehled' ? renderDashHead()
    : section==='profil'  ? `<h1 class="dh-t">Profil dítěte</h1><button class="dh-edit" onclick="openProfEdit()">Upravit údaje</button>`
    : `<h1 class="dh-t">${PAGEH[section]||''}</h1>`;
  const el=document.getElementById('kidsel');
  if(!PERCHILD.includes(section)||overlay){el.style.display='none';return;}
  el.style.display='block';
  const c=cur();
  let h=`<button class="kbtn" onclick="toggleKidMenu(event)">${avatar(c,24)}<span>${c.n}</span><span class="kcaret">▾</span></button>`;
  if(kidMenuOpen){h+=`<div class="kmenu">`+children.map((k,i)=>`<button class="kitem${i===ci?' on':''}" onclick="pickKid(${i})">${avatar(k,24)}<span>${k.n}</span>${i===ci?'<span class="kchk">✓</span>':''}</button>`).join('')+`</div>`;}
  el.innerHTML=h;
}
function render(){
  /* Každá sekce má vlastní velký nadpis (h1.dh-t) → v topbaru ho neopakujeme.
     Titulek zůstává jen u overlayů, které vlastní nadpis nemají. */
  document.getElementById('ttl').textContent=overlay?(overlay.type==='guide'?'Průvodce':overlay.type==='menu'?'Jídelníček':overlay.type==='omluvenka'?'Omluvenka':overlay.type==='novinka'?'Novinka':overlay.type==='profedit'?'':'Akce'):'';
  renderHead();renderDrawer();
  document.getElementById('modalRoot').innerHTML = (typeof absModal!=='undefined'&&absModal)?renderAbsModal():((typeof dayModal!=='undefined'&&dayModal!=null)?renderDayModal():'');
  document.getElementById('content').innerHTML = overlay?(overlay.type==='guide'?renderGuide(overlay.idx):overlay.type==='menu'?renderMenuDetail():overlay.type==='omluvenka'?renderOmluvenka():overlay.type==='novinka'?renderNovinka():overlay.type==='profedit'?renderProfEdit():renderAkceDetail(overlay.idx)):RENDER[section]();
}
window.go=s=>{section=s;overlay=null;drawerOpen=false;if(!PERCHILD.includes(s)){} render();};
window.openDrawer=()=>{drawerOpen=true;render();};
window.toggleKidMenu=e=>{e.stopPropagation();kidMenuOpen=!kidMenuOpen;render();};
window.pickKid=i=>{ci=i;kidMenuOpen=false;render();};
window.closeDrawer=()=>{drawerOpen=false;render();};
document.addEventListener('click',()=>{if(kidMenuOpen||dashPickerOpen){kidMenuOpen=false;dashPickerOpen=false;render();}});

render();
