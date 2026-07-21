/* SCREEN: PRUVODCE_PREHLED — „soupis dne" dle priorit průvodce (stejný přístup jako rodič):
   velký datumový nadpis, prioritní sloupce (.dash3), nadpisy karet .ch.
   Sloupec 1 docházka (počty, akce, kdo nepřijde, zdravotní/provozní poznámky) · sloupec 2 dnešek
   (program, básnička, akce) · sloupec 3 tým (průvodci dnes). */
const PDOWFULL=['pondělí','úterý','středa','čtvrtek','pátek','sobota','neděle'];
// Hlavička dashboardu (datum + kdo dnes slouží) — renderuje se do topbaru (viz core.js).
function renderPrehledHead(){
  const den=PDOWFULL[wd(TODAYD)];
  const todays=GUIDESHIFT.map((g,i)=>({g,i})).filter(x=>serving(x.g.days[TODAY]));
  const opener=todays.slice().sort((a,b)=>startMin(a.g.days[TODAY])-startMin(b.g.days[TODAY]))[0];
  return `<h1 class="dh-t">${den.charAt(0).toUpperCase()+den.slice(1)} ${TODAYD}. června 2026</h1><div class="dh-sub">Dnes ve školce · ${todays.length?todays.map(x=>`${x.g.n}${opener&&x.i===opener.i?' (otevírá)':''}`).join(' · '):'nikdo nemá službu'}</div>`;
}
function renderPrehled(){
  const c=counts();
  const todays=GUIDESHIFT.map((g,i)=>({g,i})).filter(x=>serving(x.g.days[TODAY]));
  const usIdx=todays.some(x=>x.i===uspavaToday)?uspavaToday:(todays[0]?todays[0].i:-1);
  let h=`<div class="dash3">`;

  // ── Sloupec 1: docházka (počty + akce + kdo nepřijde) ──
  h+=`<div class="dcol">`;
  // počty dětí dnes — odvozené z counts() (stejný zdroj jako docházka)
  h+=`<div class="tile"><div class="ch">Docházka dnes</div>`;
  const strip=[['Přítomno',c.pres,'rano'],['Obědy',c.pres,'rano'],['Spí',c.spi,'spi'],['Po obědě',c.poobede,'poobede'],['Nepřítomní',c.neprit,'neprit']];
  h+=`<div class="tabs wrap">`+strip.map(([lab,n,k])=>`<div class="tab" onclick="goDochTab('${k}')"><div class="num">${n}</div><div class="lab">${lab}</div></div>`).join('')+`</div>`;
  h+=`<button class="addbig" style="margin-top:11px" onclick="go('dochazka')">Otevřít dnešní docházku →</button>`;
  h+=`</div>`;
  // kdo dnes nepřijde — jmenovitě, s důvodem (barva i text, ne jen barva)
  const absent=data.map((c,i)=>({c,i})).filter(x=>x.c.status!=='pritomen');
  h+=`<div class="tile"><div class="ch">Kdo dnes nepřijde</div>`;
  if(absent.length){
    absent.forEach(({c})=>{
      const r=c.parentExcuse?parentExcuseLine(c):(c.status==='omluveno'?'omluveno':'neomluveno');
      h+=`<button class="prehl-abs" onclick="goDochTab('neprit')">${avatar(c,24)}<span class="pa-nm">${full(c)}</span><span class="pa-r">${r}</span></button>`;
    });
  }else{
    h+=`<div class="empty" style="padding:6px">Dnes dorazí všichni. Všichni jsme Vhaaji.</div>`;
  }
  h+=`</div>`;
  // zdravotní / provozní poznámky (děti s poznámkou od rodičů) — sloupec 1, pod docházkou
  {const notes=data.filter(c=>c.note);
   if(notes.length){
     h+=`<div class="tile"><div class="ch">Zdravotní a provozní poznámky</div>`;
     notes.forEach(c=>{h+=`<div class="rnote" style="margin:6px 0 0">✉️ <b>${c.n}:</b> ${c.note}</div>`;});
     h+=`</div>`;
   }}
  h+=`</div>`;

  // ── Sloupec 2: dnešek (program dne, básnička/písnička, dnešní akce) ──
  h+=`<div class="dcol">`;
  // program dne — činnost dle dne v týdnu (RYTMUS) + případný kroužek
  const ryt=RYTMUS[wd(TODAYD)];
  h+=`<div class="tile"><div class="ch">Program dne</div>`;
  h+=`<div class="prog-day">${ryt?ryt.prog:'Volný program'}</div>`;
  if(ryt&&ryt.krouzek)h+=`<div class="tval" style="font-size:13.5px">Kroužek: <b>${ryt.krouzek}</b></div>`;
  h+=`<button class="cardlink" onclick="go('plan')">Tématický plán ›</button></div>`;
  // básnička a písnička aktuálního týdne (3. 6. = 1. týden)
  const wk=TEMA.tydny[Math.floor((TODAYD-1)/7)];
  h+=`<div class="tile"><div class="ch">Básnička a písnička týdne</div>`;
  if(wk&&(wk.b||wk.p)){
    if(wk.b)h+=`<div class="pa-cap">Básnička</div><div class="tval">${wk.b}</div>`;
    if(wk.p)h+=`<div class="pa-cap" style="margin-top:8px">Písnička</div><div class="tval">${wk.p}</div>`;
  }else{
    h+=`<div class="empty" style="padding:6px 0 0;text-align:left;font-style:normal">Pro tento týden zatím nevyplněno.</div>`;
  }
  h+=`<button class="cardlink" onclick="go('plan')">Otevřít tématický plán ›</button></div>`;
  // dnešní akce (pokud na dnešek nějaká je) — proklik na detail
  const akToday=[...AKCE].filter(a=>a.day<=TODAYD&&(a.dayEnd?a.dayEnd>=TODAYD:a.day===TODAYD)).sort((a,b)=>a.day-b.day);
  if(akToday.length){
    h+=`<div class="tile"><div class="ch">Dnešní akce</div>`;
    akToday.forEach(a=>{const m=[a.time,a.place].filter(Boolean).join(' · ');h+=`<button class="acard" style="margin:6px 0 0" onclick="openAkceDetail('${a.id}')"><span class="adate">${dayLbl(a)}</span><span style="flex:1"><span class="aname">${a.name}</span>${m?`<div class="ameta">${m}</div>`:''}</span></button>`;});
    h+=`</div>`;
  }
  h+=`</div>`;

  // ── Sloupec 3: tým a provoz (průvodci dnes, zdravotní/provozní poznámky) ──
  h+=`<div class="dcol">`;
  // průvodci dnes s hodinami (řádky .np jako v sekci Průvodci) + kdo uspává
  h+=`<div class="tile"><div class="ch">Průvodci dnes</div>`;
  if(todays.length){
    todays.forEach(x=>{const d=x.g.days[TODAY];h+=`<div class="np"><span>${x.g.n}${opener&&x.i===opener.i?' · <b style="color:var(--color-primary)">otevírá</b>':''}${x.i===usIdx?' <span style="color:var(--color-info)">☾</span>':''}</span><b>${fmt(d.s)}–${fmt(d.e)}</b></div>`;});
    if(usIdx>=0)h+=`<div class="doch-note" style="margin-top:8px">☾ dnes uspává ${GUIDESHIFT[usIdx].n}</div>`;
  }else{h+=`<div class="empty" style="padding:6px">Dnes nikdo nemá službu.</div>`;}
  h+=`<button class="cardlink" onclick="go('pruvodci')">Služby a rozpis ›</button></div>`;
  h+=`</div>`;

  h+=`</div>`;// .dash3
  return h;
}
window.goDochTab=k=>{tab=k;view='den';denDay=TODAYD;open=-1;query='';go('dochazka');};
