/* SCREEN: PRUVODCE_PREHLED — dashboard: dnešek jedním pohledem, jedním klikem do docházky */
function renderPrehled(){
  const c=counts();
  // hlavička: dnešní datum + kdo slouží/otevírá (odvozeno z GUIDESHIFT jako sekce Průvodci)
  const todays=GUIDESHIFT.map((g,i)=>({g,i})).filter(x=>serving(x.g.days[TODAY]));
  const opener=todays.slice().sort((a,b)=>startMin(a.g.days[TODAY])-startMin(b.g.days[TODAY]))[0];
  const servingTxt=todays.length?todays.map(x=>`${x.g.n}${opener&&x.i===opener.i?' <b style="color:var(--color-primary)">otevírá</b>':''}`).join(' · '):'nikdo nemá službu';
  let h=`<div class="tile"><div class="tlab" style="margin-bottom:4px">${DOW[wd(TODAYD)]} ${TODAYD}. června 2026 · dnes</div><div class="tval" style="font-size:13.5px">Slouží: ${servingTxt}</div></div>`;

  // 1) počty dětí dnes — odvozené z counts() (stejný zdroj jako docházka)
  const strip=[['Přítomno',c.pres,'rano'],['Obědy',c.pres,'rano'],['Spí',c.spi,'spi'],['Po obědě',c.poobede,'poobede'],['Nepřítomní',c.neprit,'neprit']];
  h+=`<div class="tabs">`+strip.map(([lab,n,k])=>`<div class="tab" onclick="goDochTab('${k}')"><div class="num">${n}</div><div class="lab">${lab}</div></div>`).join('')+`</div>`;

  // 2) rychlý vstup do docházky
  h+=`<button class="addbig" style="margin-top:11px" onclick="go('dochazka')">Otevřít dnešní docházku →</button>`;

  // 3) kdo dnes nepřijde — jmenovitě, s důvodem (u rodičovské omluvenky čas + důvod)
  const absent=data.map((c,i)=>({c,i})).filter(x=>x.c.status!=='pritomen');
  h+=`<div class="tile"><div class="tlab">Kdo dnes nepřijde</div>`;
  if(absent.length){
    absent.forEach(({c})=>{
      const r=c.parentExcuse?parentExcuseLine(c):(c.status==='omluveno'?'omluveno':'neomluveno');
      h+=`<button class="prehl-abs" onclick="goDochTab('neprit')">${avatar(c,24)}<span class="pa-nm">${full(c)}</span><span class="pa-r">${r}</span></button>`;
    });
  }else{
    h+=`<div class="empty" style="padding:6px">Dnes dorazí všichni. Všichni jsme Vhaaji.</div>`;
  }
  h+=`</div>`;

  // 4) básnička a písnička aktuálního týdne (odvozeno z TODAYD; 3. 6. = 1. týden)
  const wk=TEMA.tydny[Math.floor((TODAYD-1)/7)];
  h+=`<button class="tile prehl-tema" onclick="go('plan')"><div class="tlab" style="margin:0">Básnička a písnička týdne <span class="pa-arr">›</span></div>`;
  if(wk&&(wk.b||wk.p)){
    if(wk.b)h+=`<div class="pa-cap">Básnička</div><div class="tval">${wk.b}</div>`;
    if(wk.p)h+=`<div class="pa-cap" style="margin-top:8px">Písnička</div><div class="tval">${wk.p}</div>`;
  }else{
    h+=`<div class="empty" style="padding:6px 0 0;text-align:left;font-style:normal">Pro tento týden zatím nevyplněno — otevřít tématický plán ›</div>`;
  }
  h+=`</button>`;

  // 5) zdravotní / provozní poznámky (děti s poznámkou od rodičů)
  const notes=data.filter(c=>c.note);
  if(notes.length){
    h+=`<div class="tile"><div class="tlab">Zdravotní a provozní poznámky</div>`;
    notes.forEach(c=>{h+=`<div class="rnote" style="margin:6px 0 0">✉️ <b>${c.n}:</b> ${c.note}</div>`;});
    h+=`</div>`;
  }

  // 6) dnešní akce (pokud na dnešek nějaká je) — proklik na detail
  const akToday=[...AKCE].filter(a=>a.day<=TODAYD&&(a.dayEnd?a.dayEnd>=TODAYD:a.day===TODAYD)).sort((a,b)=>a.day-b.day);
  if(akToday.length){
    h+=`<div class="tile"><div class="tlab">Dnešní akce</div>`;
    akToday.forEach(a=>{const m=[a.time,a.place].filter(Boolean).join(' · ');h+=`<button class="acard" style="margin:6px 0 0" onclick="openAkceDetail('${a.id}')"><span class="adate">${dayLbl(a)}</span><span style="flex:1"><span class="aname">${a.name}</span>${m?`<div class="ameta">${m}</div>`:''}</span></button>`;});
    h+=`</div>`;
  }
  return h;
}
window.goDochTab=k=>{tab=k;view='den';denDay=TODAYD;open=-1;query='';go('dochazka');};
