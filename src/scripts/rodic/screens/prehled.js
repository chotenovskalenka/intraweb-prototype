/* SCREEN: RODIC_PREHLED — „soupis dne" dle priorit rodiče:
   1) faktura po splatnosti  2) docházka (stav, spinkání, poznámka) + nahlášení absence
   3) dnešek (program, jídlo, básnička)  4) výhled (měsíční program, aktuality školky).
   Sloupec 1 nese i Průvodce (pod docházkou). Desktop: .dash3 grid, mobil: stoh. */
const DOWFULL=['pondělí','úterý','středa','čtvrtek','pátek','sobota','neděle'];
function renderDashboard(){
  const c=cur(), td=code(c,dashDay), due=c.faktury.find(f=>!f.paid), ev=EVENTS[dashDay], menu=MENUS[wd(dashDay)];
  const today=dashDay===TODAY, absent=(td==='OM'||td==='NE');
  // Hlavička — velké jméno + datum, hned vedle listování ‹ ▾ › (jeden vizuální pattern)
  let h=`<div class="dash-head">
    <h1 class="dh-t">${c.n} · ${DOWFULL[wd(dashDay)]} ${dashDay}. 6.</h1>
    <div class="dh-nav"><button class="dh-step" onclick="stepDay(-1)" aria-label="Předchozí den">‹</button><button class="dh-step" onclick="toggleDashPicker()" aria-label="Vybrat den">▾</button><button class="dh-step" onclick="stepDay(1)" aria-label="Další den">›</button>${today?'':`<button class="dh-today" onclick="pickDashDay(TODAY)">dnes</button>`}</div>
  </div>`;
  if(dashPickerOpen){h+=`<div class="daypicker"><div class="dpcal">`;['P','Ú','S','Č','P','S','N'].forEach(x=>h+=`<div class="dph">${x}</div>`);for(let d=1;d<=30;d++){if(isWE(d)){h+=`<div class="dpcell we">${d}</div>`;continue;}h+=`<div class="dpcell${d===TODAY?' today':''}${d===dashDay?' sel':''}" onclick="pickDashDay(${d})">${d}</div>`;}h+=`</div></div>`;}
  // 1) Faktura po splatnosti — plná šířka, nejvyšší priorita
  if(due)h+=`<button class="tile neuhr" onclick="go('platby')"><div class="np"><span class="tlab" style="margin:0"><span class="nwarn">⚠</span>Faktura po splatnosti · ${due.obdobi}</span><b>${kc(due.cena-due.sleva)} Kč ›</b></div></button>`;
  h+=`<div class="dash3">`;
  // 2) Sloupec 1 — docházka + průvodci
  h+=`<div class="dcol"><div class="tile"><div class="ch">Docházka</div>`;
  h+=`<div class="doch-line"><span class="doch-code" style="color:${CODES[td][1]}">${CODES[td][0]}</span>${today?'<span class="doch-day">dnes</span>':''}</div>`;
  if(!absent){const us=guides.find(g=>g.uspava);
    h+=`<div class="doch-sleep">${c.spi?`☾ Spinká${us?` · uspává <b>${us.n}</b>`:''}`:'Nespinká'}</div>`;}
  if(c.notes[dashDay])h+=`<div class="doch-pozn">Poznámka: ${escTa(c.notes[dashDay])}</div>`;
  if(c.obed&&c.obed[dashDay]!==undefined&&absent)h+=`<div class="doch-sleep">Oběd: ${c.obed[dashDay]?'vyzvednete si':'propadá'}</div>`;
  if(today&&td!=='NE')h+=`<button class="omluvbtn" onclick="openAbsDnes()">Nahlásit dnešní absenci</button>`;
  else if(!today&&editable(dashDay)&&!absent)h+=`<button class="omluvbtn" onclick="openOmluvenka(${dashDay})">Omluvit na ${DOW[wd(dashDay)]} ${dashDay}. 6.</button>`;
  else if(!today&&!editable(dashDay))h+=`<div class="edlock">Proběhlý den — jen ke čtení</div>`;
  if(!today&&editable(dashDay)&&!absent)h+=`<div class="doch-note">V omluvence můžete vybrat i více dní.</div>`;
  h+=`<button class="cardlink" onclick="go('dochazka')">Docházka a náhrady ›</button></div>`;
  h+=`<div class="tile"><div class="ch">Průvodci dnes</div><div class="glist">`+GUIDES_TODAY.map(i=>{const g=guides[i];return `<button class="grow" onclick="openGuide(${i})">${avatar(g,30)}<span class="grow-n">${g.n}${g.uspava?' <span class="moon">☾</span>':''}</span><span class="grow-h">${g.h||''}</span></button>`;}).join('')+`</div>`;
  if(guides.some(g=>g.uspava))h+=`<div class="doch-note" style="margin-top:8px">☾ = dnes uspává</div>`;
  h+=`</div>`;
  h+=`</div>`;
  // 3) Sloupec 2 — dnešek: program, jídlo, básnička+písnička
  h+=`<div class="dcol">`;
  h+=`<div class="tile"><div class="ch">Program dne</div>`;
  h+=`<div class="prog-day">${DENNI[wd(dashDay)]||'Volný program'}</div>`;
  if(ev){h+=`<div class="ev"><div class="evt">${ev.title}</div><div class="evd">Sraz: <b>${ev.place}</b> · ${ev.time}</div><div class="evd">${ev.note}</div>`;
    if(ev.map)h+=`<a class="maplink" href="${ev.map}" target="_blank" rel="noopener">Otevřít mapu</a>`;
    if(ev.gps)h+=`<div class="gps">${ev.gps}</div>`;if(ev.sbalit)h+=`<div class="sbalit">🎒 Nezapomeňte sbalit: <b>${ev.sbalit}</b></div>`;h+=`</div>`;}
  h+=`</div>`;
  h+=`<div class="tile"><div class="ch">Co bude ${c.n} jíst</div>`+menu.map(it=>`<div class="mrow"><span class="mk2">${it[0]}</span><span class="mv">${it[1]}</span>${it[2]?`<span class="alerg">${it[2]}</span>`:''}</div>`).join('')+`</div>`;
  h+=`<div class="tile"><div class="ch">Básnička a písnička týdne</div>
    <div class="bp"><div class="bp-k">Básnička</div><div class="bp-t">${TYDEN.basnicka.t}</div><a class="bp-link" href="${TYDEN.basnicka.url}" target="_blank" rel="noopener">▶ Poslechnout na YouTube ›</a></div>
    <div class="bp"><div class="bp-k">Písnička</div><div class="bp-t">${TYDEN.pisnicka.t}</div><a class="bp-link" href="${TYDEN.pisnicka.url}" target="_blank" rel="noopener">▶ Přehrát na YouTube ›</a></div></div>`;
  h+=`</div>`;
  // 4) Sloupec 3 — výhled: měsíční program (bez narozenin) + aktuality školky
  h+=`<div class="dcol">`;
  {const rows=[];Object.keys(EVMAP).map(Number).sort((a,b)=>a-b).forEach(d=>{EVMAP[d].forEach(e=>{if(e.type!=='naro')rows.push([d,e.t]);});});
   h+=`<div class="tile"><div class="ch"><button class="tlabbtn" onclick="go('kalendar')">Měsíční program<span class="tarr">›</span></button></div>`
     +rows.map(([d,t])=>`<button class="akce" onclick="go('kalendar')"><span>${t}</span><span class="when">${d}. 6. ›</span></button>`).join('')+`</div>`;}
  const nws=NEWS.filter(n=>TODAY<=n.until).slice(0,5);
  if(nws.length){h+=`<div class="tile newsbox"><div class="ch"><button class="tlabbtn" onclick="go('aktuality')">Aktuality školky<span class="tarr">›</span></button></div>`;
    nws.forEach(n=>{h+=`<button class="newsrow" onclick="go('aktuality')"><span class="newsdate">${n.date}</span><span class="newsline">${n.t}</span><span class="newsarr">›</span></button>`;});
    h+=`<button class="newsmore" onclick="go('aktuality')">Všechny aktuality ›</button></div>`;}
  h+=`</div></div>`;
  return h;
}
window.stepDay=dir=>{let d=dashDay+dir;while(d>=1&&d<=30&&isWE(d))d+=dir;if(d>=1&&d<=30)dashDay=d;render();};
window.toggleDashPicker=()=>{dashPickerOpen=!dashPickerOpen;render();};
window.pickDashDay=d=>{dashDay=d;dashPickerOpen=false;dashEdit=false;render();};
