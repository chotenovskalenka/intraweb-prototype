/* SCREEN: RODIC_AKTUALITY – Novinky ze školky.
   Zobrazení převzato z průvodcovské appky: VŠECHNY novinky jsou karty s úvodní fotkou
   (.news-grid, 1/2/3 sloupce), ne jen ty důležité. Dřív šly nedůležité do kompaktních řádků –
   jenže „je důležitá" a „má fotku" jsou nezávislé věci, takže fotky končily v textovém seznamu
   a obrazovka působila mrtvě. Objem řeší stránkování níž, ne skrývání fotek.

   Rodičovská specifika proti průvodci (vědomá, viz decision-log):
   – bez autora (jméno průvodce jen v průvodcovské appce),
   – bez data platnosti (n.until řídí jen to, kdy novinka zmizí – rodiče nezajímá),
   – bez sdílení do WhatsAppu (to je akce průvodce),
   – klik otevírá článkový detail (čtecí šířka), ne modal. */
function novinkaExcerpt(n){const p=(n.full||n.t).split('\n')[0];return p.length>140?p.slice(0,140)+'…':p;}
const NOV_STRANKA=9;   // karet na stránku (3 řady po třech na širokém okně)
function renderAktuality(){
  const vsechny=NEWS.filter(n=>TODAY<=n.until);
  // důležité napřed, zbytek za nimi – pořadí v rámci skupin drží seed (nejnovější první)
  const serazene=[...vsechny.filter(n=>n.urgent),...vsechny.filter(n=>!n.urgent)];
  const stran=Math.max(1,Math.ceil(serazene.length/NOV_STRANKA));
  if(novStrana>stran)novStrana=stran;
  const zacatek=(novStrana-1)*NOV_STRANKA, stranka=serazene.slice(zacatek,zacatek+NOV_STRANKA);
  let h=`<div class="doch"><div class="news-grid">`;
  stranka.forEach(n=>{
    h+=`<button class="newscard${n.urgent?' urgent':''}" onclick="openNovinka('${n.id}')">`;
    if(n.img)h+=photoBox('nc-hero',n.img);
    h+=`<div class="nc-body">${n.urgent?'<span class="newsurg">Důležité</span>':''}<div class="nc-t">${n.t}</div>`;
    h+=`<div class="newsmeta">${n.date}</div>`;
    h+=`<div class="nc-x">${novinkaExcerpt(n)}</div>`;
    h+=`<div class="nc-foot">Celá novinka ›</div></div></button>`;
  });
  h+=`</div>`;
  if(stran>1){
    h+=`<div class="dnav novstep"><button onclick="stepNovStrana(-1)" ${novStrana<=1?'disabled':''} aria-label="Předchozí strana">‹</button><span>Strana ${novStrana} z ${stran}</span><button onclick="stepNovStrana(1)" ${novStrana>=stran?'disabled':''} aria-label="Další strana">›</button></div>`;
  }
  h+=`<div class="note2">Novinky píší průvodci; důležité mohou zároveň sdílet do WhatsAppu.</div>`;
  return h+`</div>`;
}
window.stepNovStrana=d=>{novStrana=Math.max(1,novStrana+d);render();};
// Detail novinky – overlay do #content jako „článek": omezená čtecí šířka, hero → titulek →
// datum → vlasová linka → text → fotky. Bez boxů (prostor a linky, ne rámečky).
function renderNovinka(){
  const n=NEWS.find(x=>x.id===overlay.id);if(!n)return '';
  let h=`<div class="novdet"><button class="back" onclick="closeOverlay()">← Zpět na novinky</button>`;
  if(n.img)h+=photoBox('nd-hero',n.img);
  h+=`${n.urgent?'<span class="newsurg">Důležité</span>':''}`;
  h+=`<h1 class="nd-t">${n.t}</h1>`;
  h+=`<div class="newsmeta" style="margin-top:4px">${n.date}</div>`;
  h+=`<div class="nd-body">`+(n.full||'').split('\n\n').map(p=>`<p class="nd-p">${p}</p>`).join('')+`</div>`;
  if(n.imgs&&n.imgs.length)h+=`<div class="nd-gal"><div class="ch">Fotky</div><div class="gal">`+n.imgs.map(c=>photoBox('ph',c)).join('')+`</div></div>`;
  return h+`</div>`;
}
window.openNovinka=id=>{overlay={type:'novinka',id};render();};
