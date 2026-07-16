/* SCREEN: RODIC_KONTAKTY */
function renderKontakty(){
  let h=`<div class="tile"><div class="tlab">Průvodci</div>`+guides.map((g,i)=>`<button class="akce" onclick="openGuide(${i})"><span style="display:flex;align-items:center;gap:9px">${avatar(g,26)}${g.n}</span><span class="when">${g.abbr} ›</span></button>`).join('')+`</div>`;
  h+=`<div class="tile"><div class="tlab">${SCHOOL.name}</div><div class="contact"><a class="cbtn" href="tel:${telnum(SCHOOL.phone)}">Zavolat</a><a class="cbtn" href="mailto:${SCHOOL.email}">E-mail</a></div><div class="cinfo">${SCHOOL.phone} · ${SCHOOL.email}<br>${SCHOOL.adresa}</div></div>`;
  return h;
}
