/* SCREEN: PRUVODCE_KONTAKTY – průvodce u kolegy vidí i to, kdy je ve školce (z rozpisu sestavy).
   Rodičovská appka má dál karty .gcard*. */
const SKOLNI_DOKUMENTY=['Školní vzdělávací program','Školní a provozní řád'];
/* Kontakty jako tabulka (designérka 30. 10. 2026: „je to hodně boxů"). Desktop: jeden řádek na
   člověka – kdo, kdy je ve školce, telefon a akce (e-maily tým nemá). Mobil: seznam řádků
   s větší fotkou a dvěma akcemi pod jménem. Obojí v DOM, přepíná CSS (jako Akce). Bez „·": kdy je ve školce
   jako „Po, St, Pá (7:30–16:00)". */
function ktKdy(g){
  const gs=GUIDESHIFT.find(x=>x.n===g.n);
  if(!gs)return '';
  const days=gs.days.map((d,i)=>serving(d)?DAYS[i]:null).filter(Boolean).join(', ');
  const fd=gs.days.find(d=>serving(d));
  return days?`${days}${fd?` <span class="kt-nw">(${fmt(fd.s)}–${fmt(fd.e)})</span>`:''}`:'';
}
const ktJmeno=g=>`${g.n} ${g.sur||''}${g.uspava?' <span class="moon">☾</span>':''}`;
const ktAkce=g=>`<a class="cbtn" href="tel:${telnum(g.phone)}">Zavolat</a><a class="cbtn" href="sms:${telnum(g.phone)}">Napsat</a>`;
function ktTabulka(nazev,lide,skupina){
  let h=`<tr class="kt-skup"><th colspan="4" scope="colgroup">${nazev}</th></tr>`;
  lide.forEach(g=>{const kdy=skupina==='pru'?ktKdy(g):'';
    h+=`<tr><th scope="row"><span class="kt-kdo">${avatar(g,44)}<span><b>${ktJmeno(g)}</b>${g.fce?`<span class="kt-fce">${g.fce}</span>`:''}</span></span></th>`
      +`<td>${kdy||'<span class="dt-no">–</span>'}</td><td><a class="kt-link" href="tel:${telnum(g.phone)}">${g.phone}</a></td><td class="kt-akce"><a class="cbtn" href="sms:${telnum(g.phone)}">Napsat</a></td></tr>`;});
  return h;
}
function ktSeznam(nazev,lide,skupina){
  return `<div class="k-sec">${nazev}</div><div class="tile kt-list">`+lide.map(g=>{const kdy=skupina==='pru'?ktKdy(g):'';
    return `<div class="kt-r">${avatar(g,52)}<div class="kt-r-t"><b>${ktJmeno(g)}</b>`
      +[g.fce,kdy].filter(Boolean).map(x=>`<span class="kt-fce">${x}</span>`).join('')
      +`<div class="contact">${ktAkce(g)}</div></div></div>`;}).join('')+`</div>`;
}
function renderKontakty(){
  let h=`<div class="doch kt">`;
  h+=`<div class="kt-desk tile"><table class="kt-tab"><thead><tr><th scope="col">Kdo</th><th scope="col">Ve školce</th><th scope="col">Telefon</th><th scope="col"><span class="vh">Napsat zprávu</span></th></tr></thead><tbody>`
    +ktTabulka('Průvodci',guides,'pru')+ktTabulka('Zázemí',ZAZEMI,'zaz')+`</tbody></table></div>`;
  h+=`<div class="kt-mob">${ktSeznam('Průvodci',guides,'pru')}${ktSeznam('Zázemí',ZAZEMI,'zaz')}</div>`;
  h+=`<div class="k-bottom">`;
  h+=`<div class="tile k-docs"><div class="ch">Dokumenty ke stažení</div>`+SKOLNI_DOKUMENTY.map((t,i)=>`<button class="doc doc-dl" onclick="downloadSkolniDoc(${i})"><span>${t}</span><span class="pdf">PDF ↓</span></button>`).join('')+`</div>`;
  h+=`</div>`;
  return h+`</div>`;
}
window.downloadSkolniDoc=i=>{const t=SKOLNI_DOKUMENTY[i];downloadBlob(dlName(t)+'.pdf',makePDF(t),'application/pdf');showToast('Stahuji '+t+' ✓');};
