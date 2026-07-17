/* CORE: ADMIN — stav, sekce, sidebar, render(), go(), úvodní spuštění.
   Desktopový shell: stálý levý sidebar místo mobilního draweru. */
const SECTIONS=[
  ['prehled','Přehled','⌂'],
  ['aktuality','Aktuality','✉'],
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
const RENDER={prehled:renderPrehled,aktuality:renderAktuality,porady:renderPlaceholder,platby:renderPlaceholder,nahrady:renderPlaceholder};

function renderSidebar(){
  const el=document.getElementById('sidebar');
  el.innerHTML=`<div class="sb-brand">Vhaaji<small>vedení a administrativa</small></div>`
    +`<div class="sb-nav">`+SECTIONS.map(s=>`<button class="sb-item ${section===s[0]?'on':''}" onclick="go('${s[0]}')"><span class="ic">${s[2]}</span>${s[1]}</button>`).join('')+`</div>`;
}
function render(){
  document.getElementById('ttl').textContent=TITLES[section];
  renderSidebar();
  document.getElementById('content').innerHTML=RENDER[section]();
}
window.go=s=>{section=s;if(s!=='aktuality')akView='list';render();};

render();
