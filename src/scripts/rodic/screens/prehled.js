/* SCREEN: RODIC_PREHLED — „soupis dne" dle priorit rodiče:
   1) faktura po splatnosti  2) docházka + omluvení  3) dnešek (program, průvodci, jídlo)
   4) výhled (co dítě čeká, aktuality). Desktop: 3 sloupce (.dash3), mobil: stoh v pořadí priorit. */
const DOWFULL=['pondělí','úterý','středa','čtvrtek','pátek','sobota','neděle'];
function renderDashboard(){
  const c=cur(), td=code(c,dashDay), due=c.faktury.find(f=>!f.paid), ev=EVENTS[dashDay], menu=MENUS[wd(dashDay)];
  const today=dashDay===TODAY;
  // Hlavička — velké jméno + datum (datum otevírá výběr dne), listování ‹ ›
  let h=`<div class="dash-head">
    <h1 class="dh-t">${c.n} · <button class="dh-date" onclick="toggleDashPicker()">${DOWFULL[wd(dashDay)]} ${dashDay}. 6.<span class="dh-car">▾</span></button></h1>
    <div class="dh-nav">${today?'':`<button class="dh-today" onclick="pickDashDay(TODAY)">dnes</button>`}<button class="dh-step" onclick="stepDay(-1)">‹</button><button class="dh-step" onclick="stepDay(1)">›</button></div>
  </div>`;
  if(dashPickerOpen){h+=`<div class="daypicker"><div class="dpcal">`;['P','Ú','S','Č','P','S','N'].forEach(x=>h+=`<div class="dph">${x}</div>`);for(let d=1;d<=30;d++){if(isWE(d)){h+=`<div class="dpcell we">${d}</div>`;continue;}h+=`<div class="dpcell${d===TODAY?' today':''}${d===dashDay?' sel':''}" onclick="pickDashDay(${d})">${d}</div>`;}h+=`</div></div>`;}
  // 1) Faktura po splatnosti — plná šířka, nejvyšší priorita
  if(due)h+=`<button class="tile neuhr" onclick="go('platby')"><div class="np"><span class="tlab" style="margin:0"><span class="nwarn">⚠</span>Po splatnosti · ${due.obdobi}</span><b>${kc(due.cena-due.sleva)} Kč ›</b></div></button>`;
  h+=`<div class="dash3">`;
  // 2) Sloupec 1 — docházka zobrazeného dne + omluvení (jedna akce, přizpůsobuje se dni)
  h+=`<div class="dcol"><div class="tile"><div class="ch">Docházka</div>`;
  h+=`<div class="doch-line"><span class="doch-code" style="color:${CODES[td][1]}">${CODES[td][0]}</span>${today?'<span class="doch-day">dnes</span>':''}</div>`;
  if(today)h+=`<button class="omluvbtn" onclick="openOmluvenka(${TODAY})">Nahlásit absenci dnes</button>`;
  else if(editable(dashDay))h+=`<button class="omluvbtn" onclick="openOmluvenka(${dashDay})">Omluvit na ${DOW[wd(dashDay)]} ${dashDay}. 6.</button>`;
  else h+=`<div class="edlock">Proběhlý den — jen ke čtení</div>`;
  if(today||editable(dashDay))h+=`<div class="doch-note">V omluvence můžete vybrat i více dní.</div>`;
  h+=`<button class="cardlink" onclick="go('dochazka')">Docházka a náhrady ›</button></div></div>`;
  // 3) Sloupec 2 — dnešek: program, průvodci, jídlo
  h+=`<div class="dcol">`;
  h+=`<div class="tile"><div class="ch">${today?'Dnešní program':'Program dne'}</div>`;
  if(ev){h+=`<div class="ev"><div class="evt">${ev.title}</div><div class="evd">Sraz: <b>${ev.place}</b> · ${ev.time}</div><div class="evd">${ev.note}</div>`;
    if(ev.map)h+=`<a class="maplink" href="${ev.map}" target="_blank" rel="noopener">Otevřít mapu</a>`;
    if(ev.gps)h+=`<div class="gps">${ev.gps}</div>`;if(ev.sbalit)h+=`<div class="sbalit">🎒 Nezapomeňte sbalit: <b>${ev.sbalit}</b></div>`;h+=`</div>`;
  }else{h+=`<div class="ev"><div class="evd" style="font-size:13.5px">${c.n} začíná den ve školce.</div></div>`;}
  h+=`</div>`;
  h+=`<div class="tile"><div class="ch">Průvodci</div><div class="gchips">`+GUIDES_TODAY.map(i=>`<button class="gchip" onclick="openGuide(${i})">${avatar(guides[i],26)}<span>${guides[i].abbr}</span>${guides[i].uspava?'<span class="moon">☾</span>':''}</button>`).join('')+`</div>`;
  const u=GUIDES_TODAY.map(i=>guides[i]).find(g=>g.uspava);
  if(u)h+=`<div class="uline">☾ ${c.ak} uspává: <b>${u.n}</b></div>`;
  h+=`</div>`;
  h+=`<div class="tile"><div class="ch">Co bude ${c.n} jíst</div>`+menu.map(it=>`<div class="mrow"><span class="mk2">${it[0]}</span><span class="mv">${it[1]}</span>${it[2]?`<span class="alerg">${it[2]}</span>`:''}</div>`).join('')+`</div>`;
  h+=`</div>`;
  // 4) Sloupec 3 — výhled: co dítě čeká + aktuality
  h+=`<div class="dcol">`;
  h+=`<div class="tile"><div class="ch"><button class="tlabbtn" onclick="go('kalendar')">Co ${c.ak} čeká<span class="tarr">›</span></button></div>`+akce.map((a,i)=>`<button class="akce" onclick="openAkce(${i})"><span>${a.title}</span><span class="when">${a.date} ›</span></button>`).join('')+`</div>`;
  const nws=NEWS.filter(n=>TODAY<=n.until).slice(0,5);
  if(nws.length){h+=`<div class="tile newsbox"><div class="ch"><button class="tlabbtn" onclick="go('aktuality')">Aktuality<span class="tarr">›</span></button></div>`;
    nws.forEach(n=>{h+=`<button class="newsrow" onclick="go('aktuality')"><span class="newsdate">${n.date}</span><span class="newsline">${n.t}</span><span class="newsarr">›</span></button>`;});
    h+=`<button class="newsmore" onclick="go('aktuality')">Všechny aktuality ›</button></div>`;}
  h+=`</div></div>`;
  return h;
}
window.stepDay=dir=>{let d=dashDay+dir;while(d>=1&&d<=30&&isWE(d))d+=dir;if(d>=1&&d<=30)dashDay=d;render();};
window.toggleDashPicker=()=>{dashPickerOpen=!dashPickerOpen;render();};
window.pickDashDay=d=>{dashDay=d;dashPickerOpen=false;dashEdit=false;render();};
