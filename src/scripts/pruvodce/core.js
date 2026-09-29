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
/* Docházku zapisuje jen vedoucí průvodce a hospodářka; řadový průvodce ji čte a kontroluje.
   Nález z testování (srpen 2026): prototyp pouštěl zápis dnešního dne i řadovému průvodci,
   což neodpovídá provozu školky – a sám o to právo nestojí („šlo mi to měnit, ale nedělal
   jsem to, protože nemám proč"). Viz docs/vyzkum-testovani-pruvodci.md, Z1. */
const smiZapisovat=()=>role!=='pruvodce';
/* Opravit proběhlý den i naplánovat budoucí je administrativní zásah navíc – jen vedoucí. */
const smiJinyDen=()=>role==='vedouci';
const denEditovatelny=d=>smiZapisovat()&&(d===TODAYD||smiJinyDen());
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
  d.innerHTML=`<div class="dh"><img class="brand-mark" src="${VHAAJI_LOGO}" alt=""><span class="brand-txt">IS Vhaaji</span><button class="dclose" onclick="closeDrawer()" aria-label="Zavřít menu">✕</button></div>`+SECTIONS.filter(s=>sekceVidi(s[0])).map(s=>`<button class="ditem ${section===s[0]?'on':''}" onclick="go('${s[0]}')"><span class="ic">${icon(s[0])||s[2]}</span>${s[1]}</button>`).join('');
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
/* P6 z testování: „Jak se dostanu zpět? Tam není zpět." Systémové zpět (Android, gesto na
   iPhonu) appku rovnou zavíralo – přepínání obrazovek nezapisovalo historii prohlížeče.
   Každý přechod teď zapíše stav a zpět vrací o jednu obrazovku. URL se nemění, role
   zadaná odkazem (?role=…) tak zůstává. */
const navStav=()=>({s:section,dite:detiOpen,fc:fondChild});
function navPush(){const st=navStav(),h=history.state;
  if(h&&h.s===st.s&&h.dite===st.dite&&h.fc===st.fc)return;history.pushState(st,'');}
window.addEventListener('popstate',e=>{const st=e.state||{s:'prehled',dite:-1,fc:-1};
  section=sekceVidi(st.s)?st.s:'prehled';detiOpen=st.dite>=0?st.dite:-1;fondChild=st.fc>=0?st.fc:-1;
  drawerOpen=false;render();});
// z detailu dítěte / fondu jde tlačítko „Zpět" tou samou cestou jako systémové zpět
window.navZpet=()=>{if(history.state&&(history.state.dite>=0||history.state.fc>=0))history.back();
  else{detiOpen=-1;fondChild=-1;render();}};
window.go=s=>{if(!sekceVidi(s))s='prehled';section=s;drawerOpen=false;detiOpen=-1;fondChild=-1;render();navPush();};
window.togHosp=()=>{if(ROLE_PINNED)return;
  const p=['pruvodce','vedouci','hospodarka'];role=p[(p.indexOf(role)+1)%p.length];
  render();showToast('Role: '+ROLE_LABEL[role]);};
window.openDrawer=()=>{drawerOpen=true;render();};
window.closeDrawer=()=>{drawerOpen=false;render();};

history.replaceState(navStav(),'');
renderModalRoot();render();
