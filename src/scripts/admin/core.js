/* CORE: ADMIN – stav, sekce, sidebar, render(), go(), úvodní spuštění.
   Desktopový shell: stálý levý sidebar místo mobilního draweru. */
const SECTIONS=[
  ['prehled','Přehled','⌂'],
  ['aktuality','Novinky','✉'],
  ['porady','Porady a evaluace','▤'],
  ['platby','Platby','₵'],
  ['nahrady','Náhrady','↻'],
];
const TITLES=Object.fromEntries(SECTIONS.map(s=>[s[0],s[1]]));

let section='prehled';

// Sekce mimo 3.1 zatím renderují decentní placeholder (navigace nevede do prázdna).
function renderPlaceholder(){
  return `<div class="tile ph-tile"><div class="ph-ic">🌿</div><div class="ph-t">${TITLES[section]}</div>`
    +`<div class="ph-d">Tato sekce se připravuje v další fázi prototypu.</div></div>`;
}
const RENDER={prehled:renderPrehled,aktuality:renderAktuality,porady:renderPorady,platby:renderPlaceholder,nahrady:renderPlaceholder};

function renderSidebar(){
  const el=document.getElementById('sidebar');
  el.innerHTML=`<div class="sb-brand"><img class="brand-mark" src="${VHAAJI_LOGO}" alt=""><span class="brand-txt">IS Vhaaji</span></div>`
    +`<div class="sb-nav">`+SECTIONS.map(s=>`<button class="sb-item ${section===s[0]?'on':''}" onclick="go('${s[0]}')"><span class="ic">${icon(s[0])||s[2]}</span>${s[1]}</button>`).join('')+`</div>`;
}
// Primární akce sekce – v topbaru vedle nadpisu, stejně jako v průvodcovské appce.
// Dřív to byl pruh .addbig přes celou šířku obsahu; táž akce tak vypadala v každé appce jinak.
const TOPACT={
  aktuality:`<button class="btn-primary" onclick="akNew()">+ Nová novinka</button>`,
  porady:`<button class="btn-primary no-print" onclick="poNewZ()">+ Nový zápis</button>`,
};
function render(){
  document.getElementById('ttl').textContent=TITLES[section];
  document.getElementById('topact').innerHTML=TOPACT[section]||'';
  renderSidebar();
  document.getElementById('content').innerHTML=RENDER[section]();
}
window.go=s=>{section=s;if(s!=='aktuality')akView='list';if(s!=='porady'){poOpen=null;poNew=false;}render();};

render();
