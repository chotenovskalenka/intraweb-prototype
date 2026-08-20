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
  ['fotky','Fotky','▣'],
  ['fond','Kulturní fond','₵'],
  ['kontakty','Kontakty','✆'],
];
const TITLES=Object.fromEntries(SECTIONS.map(s=>[s[0],s[1]]));
// Sekce viditelné pro aktuální roli. Kulturní fond vede hospodářka – řadový průvodce
// ani vedoucí ho v menu nemají (a přímý go('fond') je vrátí na přehled).
const SEKCE_ROLE={fond:()=>jeHospodar()};
const sekceVidi=k=>!SEKCE_ROLE[k]||SEKCE_ROLE[k]();

let section='prehled', drawerOpen=false, wquery='';
/* Role průvodce. Všichni dělají tutéž práci, liší se jedním právem navíc – proto jedna appka
   se třemi stavy, ne tři appky:
     pruvodce    – běžný; minulé dny docházky jsou zamčené
     vedouci     – vedoucí průvodce (Táňa); smí opravit docházku zpětně
     hospodarka  – hospodářka (Míša); kmenová data dětí a čerpání fondu
   Pro testování se role bere z URL (?role=vedouci) – respondent si ji nemá jak přepnout.
   Bez parametru je štítek v topbaru přepínač, aby šly stavy ukázat při moderaci. */
const ROLE_LABEL={pruvodce:'Průvodce',vedouci:'Průvodce · vedoucí',hospodarka:'Průvodce · hospodářka'};
const ROLE_URL=(new URLSearchParams(location.search).get('role')||'').toLowerCase();
const ROLE_PINNED=Object.prototype.hasOwnProperty.call(ROLE_LABEL,ROLE_URL);
let role=ROLE_PINNED?ROLE_URL:'hospodarka';
// odvozená práva – obrazovky se ptají na právo, ne na roli
const jeHospodar=()=>role==='hospodarka';
/* Řadový průvodce zapisuje jen dnešek. Opravit proběhlý den i naplánovat budoucí je
   administrativní zásah – dělá ho vedoucí průvodce (v ostré verzi i vedení).
   Pozn.: dřív se jmenovalo smiZpetne() a hlídalo jen minulost; budoucí dny byly volné. */
const smiJinyDen=()=>role==='vedouci';
const denEditovatelny=d=>d===TODAYD||smiJinyDen();
let jidTyden=jidIndex(TODAYD,6);   // vybraný týden jídelníčku (výchozí = aktuální)
let view='den', open=-1, query='', tab='rano';
let modal=null, shiftM=null, fondM=null, galM=null;
let shiftT=SHIFT_AKT;
let akceM=AKCE_AKT;   // listovaný měsíc akcí   // listovaný týden rozpisu služeb
let detiFilter='all', detiQuery='', detiOpen=-1, odQuery='', kalSel=3, kalY=2026, kalM=5, cellM=null, detailA=null, monthDay=-1, denDay=3, weekStart=1;

const RENDER={prehled:renderPrehled,dochazka:renderDochazka,novinky:renderNovinky,jidelnicek:renderJidelnicek,akce:renderAkce,priprava:renderPriprava,pruvodci:renderPruvodci,kalendar:renderKalendar,deti:renderDeti,fotky:renderFotky,fond:renderFond,kontakty:renderKontakty};

function renderDrawer(){
  const d=document.getElementById('drawer');
  d.classList.toggle('on',drawerOpen);
  document.getElementById('scrim').classList.toggle('on',drawerOpen);
  d.innerHTML=`<div class="dh"><img class="brand-mark" src="${VHAAJI_LOGO}" alt=""><span class="brand-txt">IS Vhaaji</span></div>`+SECTIONS.filter(s=>sekceVidi(s[0])).map(s=>`<button class="ditem ${section===s[0]?'on':''}" onclick="go('${s[0]}')"><span class="ic">${icon(s[0])||s[2]}</span>${s[1]}</button>`).join('');
}
function render(){
  // Nadpis sekce (H1) do topbaru – v řádku s rolí, ne pod ním v obsahu.
  document.getElementById('dashhead').innerHTML = section==='prehled' ? renderPrehledHead()
    : section==='novinky' ? `<h1 class="dh-t">Novinky</h1><button class="btn-primary" onclick="openNovForm()">+ Nová novinka</button>`
    : section==='fond' ? `<h1 class="dh-t">Kulturní fond</h1>${jeHospodar()?'<button class="btn-primary" onclick="togFond()">+ Přidat čerpání</button>':''}`
    // Listování týdny jídelníčku – i do minulosti (svačinářka hlídá, jak často se svačiny opakují)
    : section==='jidelnicek' ? `<h1 class="dh-t">Jídelníček</h1>`
    : `<h1 class="dh-t">${TITLES[section]}</h1>`;
  document.getElementById('ttl').textContent='';
  const rc=document.getElementById('rolechip');
  if(rc){rc.textContent=ROLE_LABEL[role];rc.classList.toggle('role-ro',role==='pruvodce');
    rc.disabled=ROLE_PINNED;rc.title=ROLE_PINNED?'Role je daná odkazem':'Přepnout roli (prototyp)';}
  renderDrawer();
  if(!sekceVidi(section))section='prehled';
  document.getElementById('content').innerHTML=RENDER[section]();
}
window.go=s=>{if(!sekceVidi(s))s='prehled';section=s;drawerOpen=false;detiOpen=-1;fondChild=-1;render();};
window.togHosp=()=>{if(ROLE_PINNED)return;
  const p=['pruvodce','vedouci','hospodarka'];role=p[(p.indexOf(role)+1)%p.length];
  render();showToast('Role: '+ROLE_LABEL[role]);};
window.openDrawer=()=>{drawerOpen=true;render();};
window.closeDrawer=()=>{drawerOpen=false;render();};

renderModalRoot();render();
