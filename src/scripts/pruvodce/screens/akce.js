/* SCREEN: PRUVODCE_AKCE – datované jednorázové události (výlety, divadla, focení).
   Listuje se po měsících: zpět do loňska (odkud se plány přebírají) i dopředu na plánování.
   Minulé měsíce jsou jen ke čtení a řádek z nich jde jedním klepnutím převzít do běžícího
   měsíce – to nahradilo dřívější přepínač „Zobrazit loňské akce". */
function renderAkce(){
  const o=AKCE_MESICE[akceM], rows=[...akceMesic(akceM)].sort((a,b)=>a.day-b.day), minuly=akceM<AKCE_AKT;
  let h=`<div class="akce"><div class="vhead-row"><div class="vhead">Akce a výjimky</div><div class="vhead-act">`+
    `<div class="dnav"><button onclick="stepAkceM(-1)" ${akceM<=0?'disabled':''} aria-label="Předchozí měsíc">‹</button>`+
    `<span>${o.label}${akceM===AKCE_AKT?'<i class="dn-cur"> · aktuální</i>':''}</span>`+
    `<button onclick="stepAkceM(1)" ${akceM>=AKCE_MESICE.length-1?'disabled':''} aria-label="Další měsíc">›</button></div></div></div>`;
  if(minuly)h+=`<div class="note2">Minulý měsíc – klepnutím na akci ji založíš znovu do června 2026 s předvyplněnými údaji.</div>`;
  if(!rows.length)return h+`<div class="empty">V ${o.label.toLowerCase()} zatím žádné akce.</div></div>`;
  const klik=minuly?(a,i)=>`akceZnovu('${o.key}',${i})`:(a)=>`openAkce('${a.id}')`;
  const lbl=a=>(a.dayEnd&&a.dayEnd!==a.day)?`${a.day}.–${a.dayEnd}. ${o.m}.`:`${a.day}. ${o.m}.`;
  // Stejně jako u soupisu dětí: na mobilu karty, na desktopu tabulka. Obojí v DOM, přepíná CSS.
  h+=`<div class="akce-cards">`+rows.map((a,i)=>akceCard(a,klik(a,i),lbl,minuly)).join('')+`</div>`;
  h+=akceTable(rows,(a,i)=>klik(a,i),lbl,minuly);
  return h+`</div>`;
}
function akceCard(a,klik,lbl,plus){
  const m=[a.time,a.place,a.paid?`${a.paid} Kč/dítě`:'',a.note].filter(Boolean).join(' · ');
  return `<button class="acard" onclick="${klik}"><span class="adate">${(lbl||dayLbl)(a)}</span><span style="flex:1"><span class="aname">${a.name}</span>${m?`<div class="ameta">${m}</div>`:''}</span>${plus?'<span class="aplus">+</span>':''}</button>`;
}
/* Tabulka akcí (desktop). Poznámka je poslední, protože jako jediná zalamuje na víc řádků. */
function akceTable(rows,klik,lbl,plus){
  return `<table class="dtab akce-tab"><thead><tr>`+['Datum','Akce','Čas','Místo','Z fondu','Poznámka'].map(x=>`<th><span>${x}</span></th>`).join('')+`</tr></thead><tbody>`+
    rows.map((a,i)=>`<tr onclick="${klik(a,i)}"><td class="dt-date">${(lbl||dayLbl)(a)}</td>`+
      `<td class="nm">${a.name}${plus?' <span class="aplus">+</span>':''}</td>`+
      `<td>${a.time||'<span class="dt-no">–</span>'}</td>`+
      `<td>${a.place||'<span class="dt-no">–</span>'}</td>`+
      `<td class="dt-fond">${a.paid?`${a.paid} Kč/dítě`:'<span class="dt-no">–</span>'}</td>`+
      `<td class="dt-note">${a.note||'<span class="dt-no">–</span>'}</td></tr>`).join('')+
    `</tbody></table>`;
}
window.stepAkceM=d=>{akceM=Math.max(0,Math.min(AKCE_MESICE.length-1,akceM+d));render();};
// Akce z minulého měsíce → nová v běžícím měsíci (id:null ⇒ uložením vznikne nová).
window.akceZnovu=(key,i)=>{const a=akceMesic(AKCE_MESICE.findIndex(x=>x.key===key))[i];if(!a)return;
  modal={id:null,name:a.name,day:a.day,dayEnd:a.dayEnd||'',time:a.time||'',place:a.place||'',note:a.note||'',paid:a.paid||''};
  renderModalRoot();};
