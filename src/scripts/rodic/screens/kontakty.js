/* SCREEN: RODIC_KONTAKTY — průvodci rovnou rozbalení v mřížce karet (bez vnějšího boxu),
   dole kontakt na školku s maskotem Dubánkem. */
function guideCard(g){
  return `<div class="gcard"><div class="gcard-top">${avatar(g,42)}<div class="gcard-id"><div class="gcard-n">${g.n} ${g.sur}${g.uspava?' <span class="moon">☾</span>':''}</div></div></div>
    <div class="contact"><a class="cbtn" href="tel:${telnum(g.phone)}">Zavolat</a><a class="cbtn" href="sms:${telnum(g.phone)}">Napsat</a><a class="cbtn" href="mailto:${g.email}">E-mail</a></div>
    <div class="cinfo">${g.phone} · ${g.email}</div></div>`;
}
const SKOLNI_DOKUMENTY=['Školní vzdělávací program','Školní a provozní řád'];
function renderKontakty(){
  let h=`<div class="doch"><div class="k-sec">Průvodci</div><div class="gcards">`+guides.map(guideCard).join('')+`</div>`;
  h+=`<div class="tile skolka"><img class="dubanek-img" src="${DUBANEK}" alt="Dubánek"><div class="skolka-info"><div class="gcard-n">${SCHOOL.name}</div>
    <div class="contact skolka-contact"><a class="cbtn" href="tel:${telnum(SCHOOL.phone)}">Zavolat</a><a class="cbtn" href="mailto:${SCHOOL.email}">E-mail</a></div>
    <div class="cinfo">${SCHOOL.phone} · ${SCHOOL.email}<br>${SCHOOL.adresa}</div></div></div>`;
  h+=`<div class="tile"><div class="ch">Dokumenty ke stažení</div>`+SKOLNI_DOKUMENTY.map((t,i)=>`<button class="doc doc-dl" onclick="downloadSkolniDoc(${i})"><span>${t}</span><span class="pdf">PDF ↓</span></button>`).join('')+`</div>`;
  return h+`</div>`;
}
window.downloadSkolniDoc=i=>{const t=SKOLNI_DOKUMENTY[i];downloadBlob(dlName(t)+'.pdf',makePDF(t),'application/pdf');showToast('Stahuji '+t+' ✓');};
