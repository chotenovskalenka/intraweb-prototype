/* SCREEN: PRUVODCE_KONTAKTY – stejné karty jako u rodičů (komponenta .gcard* v components.css).
   Průvodce navíc vidí u kolegy, kdy je ve školce – vyplývá to z rozpisu služeb. */
const SKOLNI_DOKUMENTY=['Školní vzdělávací program','Školní a provozní řád'];
function guideCard(g){
  const gs=GUIDESHIFT.find(x=>x.n===g.n);
  const days=gs?gs.days.map((d,i)=>serving(d)?DAYS[i]:null).filter(Boolean).join(', '):'';
  const fd=gs?gs.days.find(d=>serving(d)):null;
  // podřádek: funkce (má-li ji) + kdy je ve školce, což plyne z rozpisu služeb
  const kdy=days?`${days}${fd?` · ${fmt(fd.s)}–${fmt(fd.e)}`:''}`:'';
  const sched=[g.fce,kdy].filter(Boolean).join(' · ')||'ve školce podle potřeby';
  return `<div class="gcard"><div class="gcard-top">${avatar(g,42)}<div class="gcard-id"><div class="gcard-n">${g.n} ${g.sur||''}${g.uspava?' <span class="moon">☾</span>':''}</div><div class="gcard-sch">${sched}</div></div></div>
    <div class="contact"><a class="cbtn" href="tel:${telnum(g.phone)}">Zavolat</a><a class="cbtn" href="sms:${telnum(g.phone)}">Napsat</a><a class="cbtn" href="mailto:${g.email}">E-mail</a></div>
    <div class="cinfo">${g.phone} · ${g.email}</div></div>`;
}
function renderKontakty(){
  let h=`<div class="doch"><div class="k-sec">Průvodci</div><div class="gcards">`+guides.map(guideCard).join('')+`</div>`;
  h+=`<div class="k-sec">Zázemí</div><div class="gcards">`+ZAZEMI.map(guideCard).join('')+`</div>`;
  h+=`<div class="k-bottom">`;
  h+=`<div class="tile skolka"><img class="dubanek-pop" src="${DUBANEK}" alt="Dubánek"><div class="skolka-info"><div class="gcard-n">${SCHOOL.name}</div>
    <div class="contact skolka-contact"><a class="cbtn" href="tel:${telnum(SCHOOL.phone)}">Zavolat</a><a class="cbtn" href="mailto:${SCHOOL.email}">E-mail</a></div>
    <div class="cinfo">${SCHOOL.phone} · ${SCHOOL.email}<br>${SCHOOL.adresa}</div></div></div>`;
  h+=`<div class="tile k-docs"><div class="ch">Dokumenty ke stažení</div>`+SKOLNI_DOKUMENTY.map((t,i)=>`<button class="doc doc-dl" onclick="downloadSkolniDoc(${i})"><span>${t}</span><span class="pdf">PDF ↓</span></button>`).join('')+`</div>`;
  h+=`</div>`;
  return h+`</div>`;
}
window.downloadSkolniDoc=i=>{const t=SKOLNI_DOKUMENTY[i];downloadBlob(dlName(t)+'.pdf',makePDF(t),'application/pdf');showToast('Stahuji '+t+' ✓');};
