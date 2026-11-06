/* SCREEN: RODIC_KONTAKTY – tým (průvodci a zázemí), WhatsApp skupiny, dole kontakt na školku
   s maskotem Dubánkem a dokumenty. */
/* Kontakty jako u průvodců (6. 11. 2026): desktop tabulka, mobil seznam s větší fotkou a akcemi
   pod jménem. Průvodci zvlášť, zázemí zvlášť (dřív byli vedení, kuchyň a účetnictví mezi
   průvodci). Rodič vidí, kdo je dnes ve školce. Pracovní e-maily tým nemá. */
const ktJmeno=g=>`${g.plne||g.n} ${g.sur}${g.uspava?' <span class="moon">☾</span>':''}`;
const ktDnes=g=>{const i=guides.indexOf(g);return GUIDES_TODAY.includes(i)&&g.h?`dnes ${g.h}`:'';};
function ktRadky(nazev,lide){
  return `<tr class="kt-skup"><th colspan="4" scope="colgroup">${nazev}</th></tr>`+lide.map(g=>{const dn=ktDnes(g);
    return `<tr><th scope="row"><span class="kt-kdo">${avatar(g,44)}<span><b>${ktJmeno(g)}</b>${g.fce?`<span class="kt-fce">${g.fce}</span>`:''}</span></span></th>`
      +`<td>${dn||'<span class="dt-no">–</span>'}</td><td><a class="kt-link" href="tel:${telnum(g.phone)}">${g.phone}</a></td>`
      +`<td class="kt-akce"><a class="cbtn" href="sms:${telnum(g.phone)}">Napsat</a></td></tr>`;}).join('');
}
function ktSeznam(nazev,lide){
  return `<div class="k-sec">${nazev}</div><div class="tile kt-list">`+lide.map(g=>`<div class="kt-r">${avatar(g,52)}<div class="kt-r-t"><b>${ktJmeno(g)}</b>`
    +[g.fce,ktDnes(g)].filter(Boolean).map(x=>`<span class="kt-fce">${x}</span>`).join('')
    +`<div class="contact"><a class="cbtn" href="tel:${telnum(g.phone)}">Zavolat</a><a class="cbtn" href="sms:${telnum(g.phone)}">Napsat</a></div></div></div>`).join('')+`</div>`;
}
function waCard(name,sub,photo,link){
  return `<a class="gcard wa-card" href="${link}" target="_blank" rel="noopener"><div class="gcard-top"><span class="av" style="width:42px;height:42px"><img src="${photo}" alt=""></span><div class="gcard-id"><div class="gcard-n">${name}</div><div class="wa-sub">${sub}</div></div></div>
    <span class="wa-open">Otevřít ve WhatsAppu ↗</span></a>`;
}
const SKOLNI_DOKUMENTY=['Školní vzdělávací program','Školní a provozní řád'];
function renderKontakty(){
  const c=cur();
  const pru=guides.filter(g=>!g.zaz).sort((a,b)=>(b.fce?1:0)-(a.fce?1:0)), zaz=guides.filter(g=>g.zaz);
  let h=`<div class="doch kt">`;
  h+=`<div class="kt-desk tile"><table class="kt-tab"><thead><tr><th scope="col">Kdo</th><th scope="col">Ve školce</th><th scope="col">Telefon</th><th scope="col"><span class="vh">Napsat zprávu</span></th></tr></thead><tbody>`
    +ktRadky('Průvodci',pru)+ktRadky('Zázemí',zaz)+`</tbody></table></div>`;
  h+=`<div class="kt-mob">${ktSeznam('Průvodci',pru)}${ktSeznam('Zázemí',zaz)}</div>`;
  h+=`<div class="k-sec">WhatsApp skupiny</div><div class="gcards">`
    +waCard('Rodiče vhaaji 🌳','Společná skupina všech rodičů',WA_SKUPINA,SCHOOL.wa)
    +waCard(`${c.n} ${c.sur} – vhaaji`,'Třídní skupina',PHOTOS[c.n]||WA_SKUPINA,c.wa)
    +`</div>`;
  h+=`<div class="k-bottom">`;
  h+=`<div class="tile skolka"><img class="dubanek-pop" src="${DUBANEK}" alt="Dubánek"><div class="skolka-info"><div class="gcard-n">${SCHOOL.name}</div>
    <div class="contact skolka-contact"><a class="cbtn" href="tel:${telnum(SCHOOL.phone)}">Zavolat</a><a class="cbtn" href="mailto:${SCHOOL.email}">E-mail</a></div>
    <div class="cinfo">${SCHOOL.phone}, ${SCHOOL.email}<br>${SCHOOL.adresa}</div></div></div>`;
  h+=`<div class="tile k-docs"><div class="ch">Dokumenty ke stažení</div>`+SKOLNI_DOKUMENTY.map((t,i)=>`<button class="doc doc-dl" onclick="downloadSkolniDoc(${i})"><span>${t}</span><span class="pdf">PDF ↓</span></button>`).join('')+`</div>`;
  h+=`</div>`;
  return h+`</div>`;
}
window.downloadSkolniDoc=i=>{const t=SKOLNI_DOKUMENTY[i];downloadBlob(dlName(t)+'.pdf',makePDF(t),'application/pdf');showToast('Stahuji '+t+' ✓');};
