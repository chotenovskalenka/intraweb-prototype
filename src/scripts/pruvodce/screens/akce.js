/* SCREEN: PRUVODCE_AKCE – datované jednorázové události (výlety, divadla, focení).
   Dřív součást jedné obrazovky „Plán & program"; oddělené od Přípravy, protože jde
   o operativu s dopadem na docházku a kulturní fond, ne o pedagogickou přípravu. */
let akceLoni=false; // náhled loňských akcí (inspirace při plánování)

function renderAkce(){
  // „+ Nová akce" je v topbaru (viz core.js) – konzistentně s Novinkami
  let h=`<div class="vhead">Akce a výjimky · červen</div>`;
  const sorted=[...AKCE].sort((a,b)=>a.day-b.day);
  h+= sorted.length? sorted.map(akceCard).join('') : `<div class="empty">Zatím žádné akce.</div>`;
  // Loňské akce – inspirace: klik předvyplní novou akci, datum se doladí v modalu
  h+=`<button class="addbtn" onclick="togAkceLoni()">${akceLoni?'Skrýt loňské akce':'Zobrazit loňské akce (červen 2025)'}</button>`;
  if(akceLoni){h+=`<div class="tile"><div class="ch">Loňské akce · červen 2025</div><div class="note2">Klepni na akci a založíš letošní s předvyplněnými údaji – zbyde doladit datum.</div>`;
    h+=AKCE_LONI.map((a,i)=>{const m=[a.time,a.place,a.paid?`${a.paid} Kč/dítě`:'',a.note].filter(Boolean).join(' · ');
      return `<button class="acard" onclick="akceFromLoni(${i})"><span class="adate">${a.dayEnd?`${a.day}.–${a.dayEnd}. 6.`:`${a.day}. 6.`}</span><span style="flex:1"><span class="aname">${a.name}</span>${m?`<div class="ameta">${m}</div>`:''}</span><span class="aplus">+</span></button>`;}).join('');
    h+=`</div>`;}
  return h;
}
function akceCard(a){
  const m=[a.time,a.place,a.paid?`${a.paid} Kč/dítě`:'',a.note].filter(Boolean).join(' · ');
  return `<button class="acard" onclick="openAkce('${a.id}')"><span class="adate">${dayLbl(a)}</span><span style="flex:1"><span class="aname">${a.name}</span>${m?`<div class="ameta">${m}</div>`:''}</span></button>`;
}
window.togAkceLoni=()=>{akceLoni=!akceLoni;render();};
// Loňská akce → nová letošní: převezme vše kromě data (id:null ⇒ uložením vznikne nová akce).
window.akceFromLoni=i=>{const a=AKCE_LONI[i];if(!a)return;
  modal={id:null,name:a.name,day:a.day,dayEnd:a.dayEnd||'',time:a.time||'',place:a.place||'',note:a.note||'',paid:a.paid||''};
  renderModalRoot();};
