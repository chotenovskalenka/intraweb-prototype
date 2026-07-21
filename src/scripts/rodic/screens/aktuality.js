/* SCREEN: RODIC_AKTUALITY — Novinky ze školky.
   Seznam = karty s úvodní fotkou a proklikem na celou novinku (overlay detail
   s celým textem + fotkami). Rodič nevidí autora (jméno průvodce jen v průvodcovské appce).
   Desktop: mřížka karet (.news-grid), mobil: stoh. */
function novinkaExcerpt(n){const p=(n.full||n.t).split('\n')[0];return p.length>140?p.slice(0,140)+'…':p;}
function renderAktuality(){
  let h=`<div class="doch">`;
  h+=`<div class="news-grid">`;
  NEWS.filter(n=>TODAY<=n.until).forEach(n=>{
    h+=`<button class="newscard${n.urgent?' urgent':''}" onclick="openNovinka('${n.id}')">`;
    if(n.img)h+=`<div class="nc-hero" style="background:${n.img}">foto</div>`;
    h+=`<div class="nc-body">${n.urgent?'<span class="newsurg">Důležité</span>':''}<div class="nc-t">${n.t}</div>`;
    h+=`<div class="newsmeta" style="margin-top:3px">${n.date} · platí do ${n.until}. 6.</div>`;
    h+=`<div class="nc-x">${novinkaExcerpt(n)}</div>`;
    h+=`<div class="nc-foot">Celá novinka ›</div></div></button>`;
  });
  h+=`</div>`;
  h+=`<div class="note2">Novinky píší průvodci; důležité mohou zároveň sdílet do WhatsAppu. Po datu platnosti novinka ze seznamu zmizí.</div>`;
  return h+`</div>`;
}
// Detail novinky — overlay do #content jako „článek": omezená čtecí šířka, hero → titulek →
// datum → vlasová linka → text → fotky. Bez boxů (prostor a linky, ne rámečky).
function renderNovinka(){
  const n=NEWS.find(x=>x.id===overlay.id);if(!n)return '';
  let h=`<div class="novdet"><button class="back" onclick="closeOverlay()">← Zpět na novinky</button>`;
  if(n.img)h+=`<div class="nd-hero" style="background:${n.img}">foto</div>`;
  h+=`${n.urgent?'<span class="newsurg">Důležité</span>':''}`;
  h+=`<h1 class="nd-t">${n.t}</h1>`;
  h+=`<div class="newsmeta" style="margin-top:4px">${n.date} · platí do ${n.until}. 6.</div>`;
  h+=`<div class="nd-body">`+(n.full||'').split('\n\n').map(p=>`<p class="nd-p">${p}</p>`).join('')+`</div>`;
  if(n.imgs&&n.imgs.length)h+=`<div class="nd-gal"><div class="ch">Fotky</div><div class="gal">`+n.imgs.map(c=>`<div class="ph" style="background:${c}">foto</div>`).join('')+`</div></div>`;
  return h+`</div>`;
}
window.openNovinka=id=>{overlay={type:'novinka',id};render();};
