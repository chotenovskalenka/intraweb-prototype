/* SCREEN: RODIC_PREHLED */
function renderDashboard(){
  const c=cur(), td=code(c,dashDay), due=c.faktury.find(f=>!f.paid), ev=EVENTS[dashDay], menu=MENUS[wd(dashDay)];
  let h=`<div class="daybar"><button onclick="stepDay(-1)">‹</button><span class="daypick" onclick="toggleDashPicker()">${dayLabel(dashDay)} ▾</span><button onclick="stepDay(1)">›</button></div>`;
  if(dashPickerOpen){h+=`<div class="daypicker"><div class="dpcal">`;['P','Ú','S','Č','P','S','N'].forEach(x=>h+=`<div class="dph">${x}</div>`);for(let d=1;d<=30;d++){if(isWE(d)){h+=`<div class="dpcell we">${d}</div>`;continue;}h+=`<div class="dpcell${d===TODAY?' today':''}${d===dashDay?' sel':''}" onclick="pickDashDay(${d})">${d}</div>`;}h+=`</div></div>`;}
  h+=`<div class="hero"><button class="hkid" onclick="go('profil')">${avatar(c,34)}<span class="hname">${c.n} ve školce</span><span class="harr">›</span></button><div class="hrow"><span class="hchip">${CODES[td][0]}</span>`;
  h+= editable(dashDay)?`<button class="ed" onclick="toggleDashEdit()">${dashEdit?'Zavřít':'Upravit'}</button>`:(dashDay===TODAY?`<button class="ed" onclick="toggleDashEdit()">${dashEdit?'Zavřít':'Nahlásit absenci'}</button>`:`<span class="edlock">uzavřeno</span>`);
  h+=`</div></div>`;
  // Hlavní akce rodiče: omluvit dítě (Flow 2) + zůstatek náhrad (Flow 3)
  h+=`<button class="omluvbtn" onclick="openOmluvenka()">Omluvit ${c.ak}</button>`;
  {const av=dostupne(c), ne=nextExp(c);
   h+=`<button class="tile nahdash" onclick="go('dochazka')"><div class="ftop"><div><div class="tlab" style="margin:0">Náhrady</div><div class="nahdashn">${av} ${nplural(av)}</div></div><div class="nahdashx">${ne?'nejbližší expirace '+ne+' ›':'›'}</div></div></button>`;}
  if(dashEdit&&(editable(dashDay)||dashDay===TODAY))h+=`<div class="tile dashedit">${editor(dashDay)}</div>`;
  if(due)h+=`<button class="tile neuhr" onclick="go('platby')"><div class="np"><span class="tlab" style="margin:0">Neuhrazeno · ${due.obdobi}</span><b>${kc(due.cena-due.sleva)} Kč ›</b></div></button>`;
  // K úhradě přesunuto úplně dolů
  const nws=NEWS.filter(n=>TODAY<=n.until).slice(0,5);
  if(nws.length){h+=`<div class="tile newsbox"><div class="tlab tlabrow"><button class="tlabbtn" onclick="go('aktuality')">Aktuality<span class="tarr">›</span></button></div>`;
    nws.forEach(n=>{h+=`<button class="newsrow" onclick="go('aktuality')">${n.urgent?'<span class="newsdot"></span>':'<span class="newsdot q"></span>'}<span class="newsline">${n.t}</span></button>`;});
    h+=`<button class="newsmore" onclick="go('aktuality')">Všechny aktuality ›</button></div>`;}
  h+=`<div class="tile"><div class="tlab">Kde ${c.n} začíná den</div>`;
  if(ev){h+=`<div class="ev"><div class="evt">${ev.title}</div><div class="evd">Sraz: <b>${ev.place}</b> · ${ev.time}</div><div class="evd">${ev.note}</div>`;
    if(ev.map)h+=`<a class="maplink" href="${ev.map}" target="_blank" rel="noopener">Otevřít mapu</a>`;
    if(ev.gps)h+=`<div class="gps">${ev.gps}</div>`;if(ev.sbalit)h+=`<div class="sbalit">🎒 Nezapomeňte sbalit: <b>${ev.sbalit}</b></div>`;h+=`</div>`;
  }else{h+=`<div class="ev"><div class="evd" style="font-size:13.5px">${c.n} začíná den ve školce.</div></div>`;}
  h+=`<div class="glab">Kdo ${c.ak} provází</div><div class="gchips">`+GUIDES_TODAY.map(i=>`<button class="gchip" onclick="openGuide(${i})">${avatar(guides[i],26)}<span>${guides[i].abbr}</span>${guides[i].uspava?'<span class="moon">☾</span>':''}</button>`).join('')+`</div>`;
  const u=GUIDES_TODAY.map(i=>guides[i]).find(g=>g.uspava);
  if(u)h+=`<div class="uline">☾ ${c.ak} uspává: <b>${u.n}</b></div>`;
  h+=`</div>`;
  h+=`<div class="tile"><div class="tlab">Co bude ${c.n} jíst · ${DOW[wd(dashDay)]} ${dashDay}. 6.</div>`+menu.map(it=>`<div class="mrow"><span class="mk2">${it[0]}</span><span class="mv">${it[1]}</span>${it[2]?`<span class="alerg">${it[2]}</span>`:''}</div>`).join('')+`</div>`;
  if(dashDay===TODAY&&EVENTS[TODAY+1]){const z=EVENTS[TODAY+1];h+=`<button class="tile zitra" onclick="pickDashDay(${TODAY+1})"><div class="tlab tlabrow">Zítra<span class="tarr">›</span></div><div class="tval"><b>${z.title}</b> · sraz ${z.time}${z.sbalit?` · sbalte ${z.sbalit}`:''}</div></button>`;}
  h+=`<div class="tile"><div class="tlab tlabrow"><button class="tlabbtn" onclick="go('kalendar')">Co ${c.ak} čeká<span class="tarr">›</span></button></div>`+akce.map((a,i)=>`<button class="akce" onclick="openAkce(${i})"><span>${a.title}</span><span class="when">${a.date} ›</span></button>`).join('')+`</div>`;
  return h;
}
window.stepDay=dir=>{let d=dashDay+dir;while(d>=1&&d<=30&&isWE(d))d+=dir;if(d>=1&&d<=30)dashDay=d;render();};
window.toggleDashPicker=()=>{dashPickerOpen=!dashPickerOpen;render();};
window.pickDashDay=d=>{dashDay=d;dashPickerOpen=false;dashEdit=false;render();};
window.toggleDashEdit=()=>{dashEdit=!dashEdit;render();};
