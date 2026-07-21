/* SCREEN: RODIC_KONTAKTY — průvodci rovnou rozbalení (bez prokliku) + kontakt na školku.
   Desktop: karty průvodců v mřížce (je na to místo), pod tím školka. */
function guideCard(g){
  return `<div class="gcard"><div class="gcard-top">${avatar(g,42)}<div class="gcard-id"><div class="gcard-n">${g.n}${g.uspava?' <span class="moon">☾</span>':''}</div><div class="gcard-sch">${g.schedule}</div></div></div>
    <div class="contact"><a class="cbtn" href="tel:${telnum(g.phone)}">Zavolat</a><a class="cbtn" href="sms:${telnum(g.phone)}">Napsat</a><a class="cbtn" href="mailto:${g.email}">E-mail</a></div>
    <div class="cinfo">${g.phone} · ${g.email}</div></div>`;
}
function renderKontakty(){
  let h=`<div class="doch">`;
  h+=`<div class="tile"><div class="ch">Průvodci</div><div class="gcards">`+guides.map(guideCard).join('')+`</div></div>`;
  h+=`<div class="tile"><div class="ch">${SCHOOL.name}</div><div class="contact"><a class="cbtn" href="tel:${telnum(SCHOOL.phone)}">Zavolat</a><a class="cbtn" href="mailto:${SCHOOL.email}">E-mail</a></div><div class="cinfo">${SCHOOL.phone} · ${SCHOOL.email}<br>${SCHOOL.adresa}</div></div>`;
  return h+`</div>`;
}
