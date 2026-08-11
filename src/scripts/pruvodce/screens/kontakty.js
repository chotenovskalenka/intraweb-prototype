/* SCREEN: PRUVODCE_KONTAKTY */
function renderKontakty(){
  let h='';
  guides.forEach(g=>{
    const gs=GUIDESHIFT.find(x=>x.n===g.n);
    const days=gs?gs.days.map((d,i)=>serving(d)?DAYS[i]:null).filter(Boolean).join(', '):'';
    const fd=gs?gs.days.find(d=>serving(d)):null;
    const sched=days?`${days}${fd?` · ${fmt(fd.s)}–${fmt(fd.e)}`:''}`:'–';
    h+=`<div class="tile"><div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">${avatar(g,38)}<b style="font-family:var(--font-serif);font-size:16px;color:var(--color-primary-strong)">${g.n} ${g.sur||''}</b></div>`+
      `<div class="np"><span>Telefon</span><a class="clink" href="tel:${g.phone.replace(/ /g,'')}">${g.phone}</a></div>`+
      `<div class="np"><span>E-mail</span><a class="clink" href="mailto:${g.email}">${g.email}</a></div>`+
      `<div class="np"><span>Kdy je vhaaji</span><b style="font-weight:500;text-align:right">${sched}</b></div></div>`;
  });
  h+=`<div class="tile"><div class="ch">${SCHOOL.name}</div><div class="contact"><a class="cbtn" href="tel:${SCHOOL.phone.replace(/ /g,'')}">Zavolat</a><a class="cbtn" href="mailto:${SCHOOL.email}">E-mail</a></div><div class="note2">${SCHOOL.phone} · ${SCHOOL.email}</div></div>`;
  return h;
}
