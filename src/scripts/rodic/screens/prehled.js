/* SCREEN: RODIC_PREHLED – „soupis dne" dle priorit rodiče:
   1) faktura po splatnosti  2) docházka (stav, spinkání, poznámka) + nahlášení absence
   3) dnešek (program, jídlo, básnička)  4) výhled (měsíční program, aktuality školky).
   Desktop: .dash3 grid (3 sloupce, ≥1200px; 2 sloupce 900–1199px). Mobil: .dcol bloky
   se stohují v pořadí, v jakém jsou vykreslené – proto jsou seskupené přesně tak,
   aby zřetězení sloupců A→B→C dalo požadované mobilní pořadí (viz komentáře u bloků). */
const DOWFULL=['pondělí','úterý','středa','čtvrtek','pátek','sobota','neděle'];
function renderDashboard(){
  const c=cur(), td=code(c,dashDay), unpaid=c.faktury.filter(f=>!f.paid), ev=EVENTS[dashDay], menu=jidelnicekDen(dashDay);
  const today=dashDay===TODAY, absent=(td==='OM'||td==='NE');
  // Hlavička (avatar + jméno/datum + listování ‹ ▾ ›) se vykresluje do topbaru na úroveň přepínače dětí
  // → renderDashHead() volané z renderHead(). Tady začínáme rovnou fakturou.
  let h='';
  // 1) Faktury po splatnosti – plná šířka, nejvyšší priorita (souhrn shodný s Platbami)
  if(unpaid.length){
    const dluh=unpaid.reduce((s,f)=>s+(f.cena-f.sleva),0);
    const lbl=unpaid.length===1?`Faktura po splatnosti · ${unpaid[0].obdobi}`:`${unpaid.length} ${unpaid.length<5?'faktury':'faktur'} po splatnosti`;
    h+=`<button class="tile neuhr" onclick="go('platby')"><div class="np"><span class="tlab" style="margin:0"><span class="nwarn">⚠</span>${lbl}</span><b>${kc(dluh)} Kč ›</b></div></button>`;
  }

  // Docházka (mobil: 1.)
  let blkDochazka=`<div class="tile"><div class="ch">${c.n} dnes</div>`;
  blkDochazka+=`<div class="doch-line"><span class="doch-code" style="color:${CODES[td][1]}">${CODES[td][0]}</span>${today?'<span class="doch-day">dnes</span>':''}</div>`;
  if(!absent){const us=guides.find(g=>g.uspava);
    blkDochazka+=`<div class="doch-sleep">${c.spi?`☾ Spinká${us?` · uspává <b>${us.n}</b>`:''}`:'Nespinká'}</div>`;}
  if(c.notes[dashDay])blkDochazka+=`<div class="doch-pozn">Poznámka: ${escTa(c.notes[dashDay])}</div>`;
  if(c.obed&&c.obed[dashDay]!==undefined&&absent)blkDochazka+=`<div class="doch-sleep">Oběd: ${c.obed[dashDay]?'vyzvednete si':'propadá'}</div>`;
  if(today&&td!=='NE')blkDochazka+=`<button class="omluvbtn" onclick="openAbsDnes()">Nahlásit dnešní absenci</button>`;
  else if(!today&&editable(dashDay)&&!absent)blkDochazka+=`<button class="omluvbtn" onclick="goEditDay(${dashDay})">Omluvit na ${DOW[wd(dashDay)]} ${dashDay}. 6.</button>`;
  else if(!today&&!editable(dashDay))blkDochazka+=`<div class="edlock">Proběhlý den – jen ke čtení</div>`;
  if(!today&&editable(dashDay)&&!absent)blkDochazka+=`<div class="doch-note">V omluvence můžete vybrat i více dní.</div>`;
  blkDochazka+=`<button class="cardlink" onclick="go('dochazka')">Docházka a náhrady ›</button></div>`;

  // Co bude dělat (mobil: 2.)
  let blkDela=`<div class="tile"><div class="ch">Co bude ${c.n} dělat</div>`;
  blkDela+=`<div class="prog-day">${DENNI[wd(dashDay)]||'Volný program'}</div>`;
  if(ev){blkDela+=`<div class="ev"><div class="evt">${ev.title}</div><div class="evd">Sraz: <b>${ev.place}</b> · ${ev.time}</div><div class="evd">${ev.note}</div>`;
    if(ev.map)blkDela+=`<a class="maplink" href="${ev.map}" target="_blank" rel="noopener">Otevřít mapu</a>`;
    if(ev.gps)blkDela+=`<div class="gps">${ev.gps}</div>`;if(ev.sbalit)blkDela+=`<div class="sbalit">🎒 Nezapomeňte sbalit: <b>${ev.sbalit}</b></div>`;blkDela+=`</div>`;}
  blkDela+=`</div>`;

  // Co bude jíst (mobil: 3.)
  let blkJist=`<div class="tile"><div class="ch">Co bude ${c.n} jíst</div>`;
  if(menu){blkJist+=menu.map(it=>`<div class="mrow"><span class="mk2">${it[0]}</span><span class="mv">${it[1]}</span>${it[2]?`<span class="alerg">${it[2]}</span>`:''}</div>`).join('')+alergenyLegenda(menu);}
  else blkJist+=`<div class="empty">Jídelníček pro tento den zatím není k dispozici.</div>`;
  blkJist+=`<button class="cardlink" onclick="go('jidelnicek')">Celý jídelníček ›</button></div>`;

  // Průvodci dnes (mobil: 4.)
  let blkPruvodci=`<div class="tile"><div class="ch">Průvodci dnes</div><div class="glist">`+GUIDES_TODAY.map(i=>{const g=guides[i];return `<button class="grow" onclick="go('kontakty')">${avatar(g,30)}<span class="grow-n">${g.n}${g.uspava?' <span class="moon">☾</span>':''}</span><span class="grow-h">${g.h||''}</span></button>`;}).join('')+`</div>`;
  if(guides.some(g=>g.uspava))blkPruvodci+=`<div class="doch-note" style="margin-top:8px">☾ = dnes uspává</div>`;
  blkPruvodci+=`</div>`;

  // Básnička a písnička týdne (mobil: 5.)
  const blkBasnicky=`<div class="tile"><div class="ch">Básnička a písnička týdne</div>
    <div class="bp"><div class="bp-k">Básnička</div><div class="bp-t">${TYDEN.basnicka.t}</div><a class="bp-link" href="${TYDEN.basnicka.url}" target="_blank" rel="noopener">▶ Poslechnout na YouTube ›</a></div>
    <div class="bp"><div class="bp-k">Písnička</div><div class="bp-t">${TYDEN.pisnicka.t}</div><a class="bp-link" href="${TYDEN.pisnicka.url}" target="_blank" rel="noopener">▶ Přehrát na YouTube ›</a></div></div>`;

  // Novinky ze školky (mobil: 6.)
  let blkNovinky='';
  {const nws=NEWS.filter(n=>TODAY<=n.until).slice(0,5);
   if(nws.length){blkNovinky=`<div class="tile newsbox"><div class="ch"><button class="tlabbtn" onclick="go('aktuality')">Novinky ze školky<span class="tarr">›</span></button></div>`;
     nws.forEach(n=>{blkNovinky+=`<button class="newsrow" onclick="go('aktuality')"><span class="newsdate">${n.date}</span><span class="newsline">${n.t}</span><span class="newsarr">›</span></button>`;});
     blkNovinky+=`<button class="newsmore" onclick="go('aktuality')">Všechny novinky ›</button></div>`;}}

  // Měsíční program – bez narozenin (mobil: 7.)
  let blkMesicni='';
  {const rows=[];Object.keys(EVMAP).map(Number).sort((a,b)=>a-b).forEach(d=>{EVMAP[d].forEach(e=>{if(e.type!=='naro')rows.push([d,e.t]);});});
   // řádek: datum · čas · název aktuality (čas se odděluje z názvu, pokud v něm je „ · HH:MM")
   blkMesicni=`<div class="tile"><div class="ch"><button class="tlabbtn" onclick="go('kalendar')">Co se děje v ${MONTHS_V[TODAY_M]}<span class="tarr">›</span></button></div>`
     +rows.map(([d,t])=>{const m=t.match(/^(.*?) · (\d{1,2}:\d{2})$/);const nm=m?m[1]:t,tm=m?m[2]:'';return `<button class="newsrow" onclick="go('kalendar')"><span class="newsdate">${d}. 6.</span><span class="newsline">${tm?`<b>${tm}</b> · `:''}${nm}</span><span class="newsarr">›</span></button>`;}).join('')+`</div>`;}

  // Narozeniny tento měsíc (mobil: 8., poslední)
  let blkNarozeniny='';
  {const vekLab=n=>n===1?'rok':(n>=2&&n<=4?'roky':'let');
   const bday=[];Object.keys(EVMAP).map(Number).sort((a,b)=>a-b).forEach(d=>{EVMAP[d].forEach(e=>{if(e.type==='naro')bday.push([d,e]);});});
   if(bday.length){blkNarozeniny=`<div class="tile"><div class="ch">Narozeniny v ${MONTHS_V[TODAY_M]}</div>`
     +bday.map(([d,e])=>{const jmeno=e.t.split(' – ')[1]||e.t;return `<div class="mrow"><span class="mk2">${d}. 6.</span><span class="mv">${jmeno} · ${e.vek} ${vekLab(e.vek)}</span></div>`;}).join('')+`</div>`;}}

  // Sloupce (mobil stohuje A, pak B, pak C → dá přesně požadované pořadí 1–8 výše).
  h+=`<div class="dash3">`;
  h+=`<div class="dcol">${blkDochazka}${blkDela}${blkJist}</div>`;
  h+=`<div class="dcol">${blkPruvodci}${blkBasnicky}${blkNovinky}</div>`;
  h+=`<div class="dcol">${blkMesicni}${blkNarozeniny}</div>`;
  h+=`</div>`;
  return h;
}
// Hlavička dashboardu v topbaru (na úrovni přepínače dětí): avatar + jméno/datum + listování ‹ ▾ ›.
function renderDashHead(){
  const c=cur(), today=dashDay===TODAY;
  return `${avatar(c,44)}<h1 class="dh-t">${c.n} · ${DOWFULL[wd(dashDay)]} ${dashDay}. 6.</h1>`
    +(today?`<span class="dh-today">dnes</span>`:'')
    +`<div class="dh-nav"><button class="dh-step" onclick="stepDay(-1)" aria-label="Předchozí den">‹</button>`
    +`<button class="dh-step" onclick="toggleDashPicker(event)" aria-label="Vybrat den">▾</button>`
    +`<button class="dh-step" onclick="stepDay(1)" aria-label="Další den">›</button>`
    +(dashPickerOpen?renderDayPicker():'')+`</div>`;
}
// ▾ otevře kompaktní kalendář-dropdown pod šipkami (u datumového nadpisu).
function renderDayPicker(){
  // Šipky měsíců: prototyp má data jen pro červen 2026 → posun dá toast (stejně jako v Docházce).
  let h=`<div class="daypicker" onclick="event.stopPropagation()"><div class="dp-head"><button class="dp-nav" onclick="stepPickMonth(-1)" aria-label="Předchozí měsíc">‹</button><div class="dp-title">červen 2026</div><button class="dp-nav" onclick="stepPickMonth(1)" aria-label="Další měsíc">›</button></div><div class="dpcal">`;
  ['P','Ú','S','Č','P','S','N'].forEach(x=>h+=`<div class="dph">${x}</div>`);
  for(let d=1;d<=30;d++){if(isWE(d)){h+=`<div class="dpcell we">${d}</div>`;continue;}h+=`<div class="dpcell${d===TODAY?' today':''}${d===dashDay?' sel':''}" onclick="pickDashDay(${d})">${d}</div>`;}
  return h+`</div></div>`;
}
window.stepDay=dir=>{let d=dashDay+dir;while(d>=1&&d<=30&&isWE(d))d+=dir;if(d>=1&&d<=30)dashDay=d;render();};
window.toggleDashPicker=e=>{e&&e.stopPropagation();dashPickerOpen=!dashPickerOpen;render();};
window.stepPickMonth=dir=>{showToast('Prototyp pracuje jen s červnem 2026');};
window.pickDashDay=d=>{dashDay=d;dashPickerOpen=false;dashEdit=false;render();};
