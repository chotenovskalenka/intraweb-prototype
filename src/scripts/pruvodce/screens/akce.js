/* SCREEN: PRUVODCE_AKCE – datované jednorázové události (výlety, divadla, focení).
   Dřív součást jedné obrazovky „Plán & program"; oddělené od Přípravy, protože jde
   o operativu s dopadem na docházku a kulturní fond, ne o pedagogickou přípravu. */
let akceLoni=false; // náhled loňských akcí (inspirace při plánování)

function renderAkce(){
  // „+ Nová akce" je v topbaru (viz core.js) – konzistentně s Novinkami
  let h=`<div class="akce"><div class="vhead">Akce a výjimky · červen</div>`;
  const sorted=[...AKCE].sort((a,b)=>a.day-b.day);
  if(!sorted.length)return h+`<div class="empty">Zatím žádné akce.</div></div>`;
  // Stejně jako u soupisu dětí: na mobilu karty, na desktopu tabulka. Obojí v DOM, přepíná CSS.
  h+=`<div class="akce-cards">`+sorted.map(a=>akceCard(a,`openAkce('${a.id}')`)).join('')+`</div>`;
  h+=akceTable(sorted,a=>`openAkce('${a.id}')`,dayLbl);
  // Loňské akce – inspirace: klik předvyplní novou akci, datum se doladí v modalu
  h+=`<button class="addbtn" onclick="togAkceLoni()">${akceLoni?'Skrýt loňské akce':'Zobrazit loňské akce (červen 2025)'}</button>`;
  if(akceLoni){
    const lbl=a=>a.dayEnd?`${a.day}.–${a.dayEnd}. 6.`:`${a.day}. 6.`;
    h+=`<div class="vhead">Loňské akce · červen 2025</div><div class="note2">Klepni na akci a založíš letošní s předvyplněnými údaji – zbyde doladit datum.</div>`;
    h+=`<div class="akce-cards">`+AKCE_LONI.map((a,i)=>akceCard(a,`akceFromLoni(${i})`,lbl,true)).join('')+`</div>`;
    h+=akceTable(AKCE_LONI,(a,i)=>`akceFromLoni(${i})`,lbl,true);
  }
  return h+`</div>`;
}
function akceCard(a,klik,lbl,plus){
  const m=[a.time,a.place,a.paid?`${a.paid} Kč/dítě`:'',a.note].filter(Boolean).join(' · ');
  return `<button class="acard" onclick="${klik}"><span class="adate">${(lbl||dayLbl)(a)}</span><span style="flex:1"><span class="aname">${a.name}</span>${m?`<div class="ameta">${m}</div>`:''}</span>${plus?'<span class="aplus">+</span>':''}</button>`;
}
/* Tabulka akcí (desktop). Poznámka je poslední, protože jako jediná zalamuje na víc řádků. */
function akceTable(rows,klik,lbl,plus){
  return `<table class="dtab akce-tab"><thead><tr><th>Datum</th><th>Akce</th><th>Čas</th><th>Místo</th><th>Z fondu</th><th>Poznámka</th></tr></thead><tbody>`+
    rows.map((a,i)=>`<tr onclick="${klik(a,i)}"><td class="dt-date">${(lbl||dayLbl)(a)}</td>`+
      `<td class="nm">${a.name}${plus?' <span class="aplus">+</span>':''}</td>`+
      `<td>${a.time||'<span class="dt-no">–</span>'}</td>`+
      `<td>${a.place||'<span class="dt-no">–</span>'}</td>`+
      `<td class="dt-fond">${a.paid?`${a.paid} Kč/dítě`:'<span class="dt-no">–</span>'}</td>`+
      `<td class="dt-note">${a.note||'<span class="dt-no">–</span>'}</td></tr>`).join('')+
    `</tbody></table>`;
}
window.togAkceLoni=()=>{akceLoni=!akceLoni;render();};
// Loňská akce → nová letošní: převezme vše kromě data (id:null ⇒ uložením vznikne nová akce).
window.akceFromLoni=i=>{const a=AKCE_LONI[i];if(!a)return;
  modal={id:null,name:a.name,day:a.day,dayEnd:a.dayEnd||'',time:a.time||'',place:a.place||'',note:a.note||'',paid:a.paid||''};
  renderModalRoot();};
