/* CORE: PRUVODCE – stav, sekce, drawer, render(), go(), úvodní spuštění */
const SECTIONS=[
  ['prehled','Přehled','⌂'],
  ['dochazka','Docházka','✓'],
  ['jidelnicek','Jídelníček','▯'],
  ['novinky','Novinky','✉'],
  ['akce','Akce','✎'],
  ['priprava','Příprava','▤'],
  ['pruvodci','Docházka průvodců','◷'],
  ['kalendar','Kalendář','▦'],
  ['deti','Děti','☺'],
  ['fond','Kulturní fond','₵'],
  ['kontakty','Kontakty','✆'],
];
const TITLES=Object.fromEntries(SECTIONS.map(s=>[s[0],s[1]]));

let section='prehled', drawerOpen=false, wquery='';
let jidTyden=jidIndex(TODAYD,6);   // vybraný týden jídelníčku (výchozí = aktuální)
let view='den', open=-1, query='', tab='rano';
let rytOpen=-1, modal=null, shiftM=null;
let detiFilter='all', detiQuery='', detiOpen=-1, odQuery='', kalSel=3, cellM=null, detailA=null, monthDay=-1, denDay=3, weekStart=1;

const RENDER={prehled:renderPrehled,dochazka:renderDochazka,novinky:renderNovinky,jidelnicek:renderJidelnicek,akce:renderAkce,priprava:renderPriprava,pruvodci:renderPruvodci,kalendar:renderKalendar,deti:renderDeti,fond:renderFond,kontakty:renderKontakty};

function renderDrawer(){
  const d=document.getElementById('drawer');
  d.classList.toggle('on',drawerOpen);
  document.getElementById('scrim').classList.toggle('on',drawerOpen);
  d.innerHTML=`<div class="dh"><img class="brand-mark" src="${VHAAJI_LOGO}" alt=""><span class="brand-txt">IS Vhaaji</span></div>`+SECTIONS.map(s=>`<button class="ditem ${section===s[0]?'on':''}" onclick="go('${s[0]}')"><span class="ic">${icon(s[0])||s[2]}</span>${s[1]}</button>`).join('');
}
function render(){
  // Nadpis sekce (H1) do topbaru – v řádku s rolí, ne pod ním v obsahu.
  document.getElementById('dashhead').innerHTML = section==='prehled' ? renderPrehledHead()
    : section==='novinky' ? `<h1 class="dh-t">Novinky</h1><button class="btn-primary" onclick="openNovForm()">+ Nová novinka</button>`
    : section==='akce' ? `<h1 class="dh-t">Akce</h1><button class="btn-primary" onclick="openAkce(null)">+ Nová akce</button>`
    // Listování týdny jídelníčku – i do minulosti (svačinářka hlídá, jak často se svačiny opakují)
    : section==='jidelnicek' ? `<h1 class="dh-t">Jídelníček</h1><div class="dh-nav plan-head-nav"><button class="dh-step" onclick="stepJidTyden(-1)" ${jidTyden<=0?'disabled':''} aria-label="Předchozí týden">‹</button><span class="dh-lbl">${jidTydenLabel(JIDELNICEK[jidTyden])}</span><button class="dh-step" onclick="stepJidTyden(1)" ${jidTyden>=JIDELNICEK.length-1?'disabled':''} aria-label="Další týden">›</button></div>`
    : `<h1 class="dh-t">${TITLES[section]}</h1>`;
  document.getElementById('ttl').textContent='';
  renderDrawer();
  document.getElementById('content').innerHTML=RENDER[section]();
}
window.go=s=>{section=s;drawerOpen=false;detiOpen=-1;fondChild=-1;render();};
window.openDrawer=()=>{drawerOpen=true;render();};
window.closeDrawer=()=>{drawerOpen=false;render();};

renderModalRoot();render();
