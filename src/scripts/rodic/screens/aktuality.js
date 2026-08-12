/* SCREEN: RODIC_AKTUALITY – Novinky ze školky.
   Platnost (n.until) řídí jen to, kdy novinka ze seznamu zmizí – rodiče to datum nezajímá,
   proto se nikde nezobrazuje (jen v průvodcovské appce, kde ho průvodce nastavuje).
   Důležité novinky = velké karty s fotkou (.news-grid), zbytek kompaktní řádky (.newsrow) –
   při delším provozu se jich nastřádá hodně a karty by zabíraly zbytečně moc místa.
   Rodič nevidí autora (jméno průvodce jen v průvodcovské appce). */
function novinkaExcerpt(n){const p=(n.full||n.t).split('\n')[0];return p.length>140?p.slice(0,140)+'…':p;}
// Náhled fotky v kompaktním řádku. Vpravo před šipkou – vlevo by řádky s fotkou a bez ní
// měly text odsazený jinak. Placeholder (barva) se vykreslí bez popisku, na 52 px by se nevešel.
function novThumb(img){
  return img.slice(0,5)==='data:'
    ? `<span class="newsthumb"><img src="${img}" alt=""></span>`
    : `<span class="newsthumb" style="background:${img}"></span>`;
}
const NOV_STRANKA=6;   // řádků na stránku u neduležitých novinek
function renderAktuality(){
  const vsechny=NEWS.filter(n=>TODAY<=n.until), dulezite=vsechny.filter(n=>n.urgent), ostatni=vsechny.filter(n=>!n.urgent);
  const stran=Math.max(1,Math.ceil(ostatni.length/NOV_STRANKA));
  if(novStrana>stran)novStrana=stran;
  const zacatek=(novStrana-1)*NOV_STRANKA, stranka=ostatni.slice(zacatek,zacatek+NOV_STRANKA);
  let h=`<div class="doch">`;
  if(dulezite.length){
    h+=`<div class="news-grid">`;
    dulezite.forEach(n=>{
      h+=`<button class="newscard urgent" onclick="openNovinka('${n.id}')">`;
      if(n.img)h+=photoBox('nc-hero',n.img);
      h+=`<div class="nc-body"><span class="newsurg">Důležité</span><div class="nc-t">${n.t}</div>`;
      h+=`<div class="newsmeta" style="margin-top:3px">${n.date}</div>`;
      h+=`<div class="nc-x">${novinkaExcerpt(n)}</div>`;
      h+=`<div class="nc-foot">Celá novinka ›</div></div></button>`;
    });
    h+=`</div>`;
  }
  if(ostatni.length){
    h+=`<div class="tile newsbox">`+stranka.map(n=>`<button class="newsrow${n.img?' has-thumb':''}" onclick="openNovinka('${n.id}')"><span class="newsdate">${n.date}</span><span class="newsline">${n.t}</span>${n.img?novThumb(n.img):''}<span class="newsarr">›</span></button>`).join('')+`</div>`;
    if(stran>1){
      h+=`<div class="dh-nav novstep"><button class="dh-step" onclick="stepNovStrana(-1)" ${novStrana<=1?'disabled':''} aria-label="Předchozí strana">‹</button><span class="dh-lbl">Strana ${novStrana} z ${stran}</span><button class="dh-step" onclick="stepNovStrana(1)" ${novStrana>=stran?'disabled':''} aria-label="Další strana">›</button></div>`;
    }
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
