/* SCREEN: RODIC_AKTUALITY */
function renderAktuality(){
  let h='';
  NEWS.filter(n=>TODAY<=n.until).forEach(n=>{
    h+=`<div class="newsitem${n.urgent?' urgent':''}">${n.urgent?'<span class="newsurg">Důležité</span>':''}<div class="newstext">${n.t}</div><div class="newsmeta">${n.from} · ${n.date} · platí do ${n.until}. 6.</div></div>`;
  });
  h+=`<div class="note2">Aktuality píší průvodci do intrawebu; důležité mohou zároveň sdílet do WhatsAppu. Po datu platnosti aktualita zmizí.</div>`;
  return h;
}
