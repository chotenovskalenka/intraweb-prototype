/* SCREEN: PRUVODCE_PREHLED – „soupis dne" dle priorit průvodce (stejný přístup jako rodič):
   velký datumový nadpis, prioritní sloupce (.dash3), nadpisy karet .ch.
   Na desktopu nahoře ranní řada (.dash-row): počty docházky · informace od rodičů ·
   kdo nepřijde. Pod ní kontext dne ve sloupcích (.dash3): program + dnešní akce ·
   básnička a písnička · průvodci ve službě. Na mobilu se všechno stohuje v tomto pořadí. */
/* Dlouhé vzkazy se krátí na tři řádky. Jeden ukecaný rodič jinak zdvojnásobí výšku celé
   ranní řady (měřeno: 287 → 550 px) a průvodce při předávání dítěte potřebuje hlavně vědět,
   že něco přišlo a od koho. Práh je na délce textu, ne na změřeném přetečení – render()
   staví HTML jako řetězec, takže v tu chvíli není co měřit. */
const ZP_DELKA=140;
let zpRozbalene=new Set();
window.zpToggle=id=>{zpRozbalene.has(id)?zpRozbalene.delete(id):zpRozbalene.add(id);render();};
const PDOWFULL=['pondělí','úterý','středa','čtvrtek','pátek','sobota','neděle'];
// Hlavička dashboardu (datum + kdo dnes slouží) – renderuje se do topbaru (viz core.js).
function renderPrehledHead(){
  const den=PDOWFULL[wd(TODAYD)];
  const todays=GUIDESHIFT.map((g,i)=>({g,i})).filter(x=>serving(x.g.days[TODAY]));
  const opener=todays.slice().sort((a,b)=>startMin(a.g.days[TODAY])-startMin(b.g.days[TODAY]))[0];
  return `<h1 class="dh-t">${den.charAt(0).toUpperCase()+den.slice(1)} ${TODAYD}. června 2026</h1><div class="dh-sub">Dnes ve školce: ${todays.length?todays.map(x=>`${x.g.n}${opener&&x.i===opener.i?' (otevírá)':''}`).join(', '):'nikdo nemá službu'}</div>`;
}
function renderPrehled(){
  const c=counts();
  const todays=GUIDESHIFT.map((g,i)=>({g,i})).filter(x=>serving(x.g.days[TODAY]));
  /* Kdo dnes otevírá. Dřív tu proměnná chyběla úplně a výraz `opener` sahal na window.opener
     (standardní globál, normálně null) – značka „otevírá" se proto v seznamu nikdy neukázala. */
  const opener=todays.slice().sort((a,b)=>startMin(a.g.days[TODAY])-startMin(b.g.days[TODAY]))[0];
  const usIdx=todays.some(x=>x.i===uspavaToday)?uspavaToday:(todays[0]?todays[0].i:-1);

  // ── Ranní řada: počty · vzkazy od rodičů · kdo nepřijde ──
  // stejný slovník jako v Docházce: přítomni · dopolední · odpolední · absence (P2)
  /* Bez „Obědů": dlaždice ukazovala počet přítomných (c.pres), ne počet obědů – v běžném
     režimu se obědy vůbec nepočítají. Souhrn pro kuchyni (obědy, svačiny) dostane vlastní
     roli s vlastním pohledem, ne dlaždici v průvodcovském přehledu. Zbylá čtyři čísla
     odpovídají záložkám v Docházce i slovníku z testování (P2). */
  /* Pořadí: nahoře dvě čísla, na která se průvodce ptá ráno jako první (kolik jich je,
     kolik chybí), pod nimi rozpad dne. Barva nese význam: absence je stav, který vyžaduje
     pozornost (danger), dopolední/odpolední jsou jen rozvrh (neutral). */
  const strip=[['Přítomni',c.pres,'rano',''],['Absence',c.neprit,'neprit','num-danger'],
    ['Dopolední',c.poobede,'poobede','num-neutral'],['Odpolední',c.odpoledni,'odpoledni','num-neutral']];
  let blkDochazka=`<div class="tile"><div class="ch">Docházka dnes</div>`
    +`<div class="tabs wrap dash-counts">`+strip.map(([lab,n,k,cls])=>`<div class="tab ${cls}" onclick="goDochTab('${k}')"><div class="num">${n}</div><div class="lab">${lab}</div></div>`).join('')+`</div>`
    /* Spinkání není stav docházky, ale informace k odpoledni (kolik lehátek v maringotce) –
       proto řádek, ne pátá stejně velká dlaždice. */
    +`<button class="dash-spi" onclick="goDochTab('spi')">☾ Spí dnes <b>${c.spi}</b> ${c.spi===1?'dítě':(c.spi>=2&&c.spi<=4?'děti':'dětí')} ›</button>`
    +`<button class="addbig" style="margin-top:11px" onclick="go('dochazka')">Otevřít dnešní docházku →</button></div>`;

  /* Vzkazy od rodičů na dnešek. Zakládá je rodič ve své appce, tady jsou jen ke čtení
     (appky spolu data nesdílejí). Trvalejší poznámky o dítěti sem nepatří – ty jsou
     u dítěte v Docházce a v profilu. */
  let blkZpravy='';
  {const zpr=zpravyDnes();
   if(zpr.length){
     blkZpravy=`<div class="tile"><div class="ch">Informace od rodičů</div><div class="dash-scroll">`;
     zpr.forEach(({c})=>{c.zpravy.filter(z=>z.den===TODAYD).forEach(z=>{
       const dlouhy=(z.text||'').length>ZP_DELKA, open=zpRozbalene.has(z.id);
       blkZpravy+=`<div class="zprow">${avatar(c,24)}<span class="zp-txt"><b>${kratke(c)}</b>`
         +`<span class="zp-who${dlouhy&&!open?' zp-clamp':''}">${zpravaShrnuti(z)}</span>`
         +(dlouhy?`<button class="zp-vic" onclick="zpToggle('${z.id}')">${open?'zkrátit ›':'celý vzkaz ›'}</button>`:'')
         +`</span><span class="zp-cas">${z.odeslano}</span></div>`;
     });});
     blkZpravy+=`</div></div>`;
   }}

  // kdo dnes nepřijde – jmenovitě, s důvodem (barva i text, ne jen barva)
  const absent=data.map((x,i)=>({c:x,i})).filter(x=>x.c.status!=='pritomen');
  let blkNeprijde=`<div class="tile"><div class="ch">Kdo dnes nepřijde</div><div class="dash-scroll">`;
  if(absent.length){
    absent.forEach(({c})=>{
      const r=c.parentExcuse?parentExcuseLine(c):(c.status==='omluveno'?'omluveno průvodcem':'absence bez omluvy');
      blkNeprijde+=`<button class="prehl-abs" onclick="goDochTab('neprit')">${avatar(c,24)}<span class="pa-nm">${kratke(c)}</span><span class="pa-r">${r}</span></button>`;
    });
  }else{
    blkNeprijde+=`<div class="empty" style="padding:6px">Dnes dorazí všichni. Všichni jsme Vhaaji.</div>`;
  }
  blkNeprijde+=`</div></div>`;

  // ── Pod řadou: dnešek a tým ──
  const ryt=RYTMUS[wd(TODAYD)];
  let blkProgram=`<div class="tile"><div class="ch">Program dne</div>`
    +`<div class="prog-day">${ryt?ryt.prog:'Volný program'}</div>`
    +(ryt&&ryt.krouzek?`<div class="tval" style="font-size:13.5px">Kroužek: <b>${ryt.krouzek}</b></div>`:'')
    +`<button class="cardlink" onclick="go('priprava')">Tématický plán ›</button></div>`;

  // básnička a písnička aktuálního týdne (3. 6. = 1. týden)
  const wk=TEMA.tydny[Math.floor((TODAYD-1)/7)];
  let blkBasnicka=`<div class="tile"><div class="ch">Básnička a písnička týdne</div>`;
  if(wk&&(wk.b||wk.p)){
    if(wk.b)blkBasnicka+=`<div class="pa-cap">Básnička</div><div class="tval">${wk.b}</div>`;
    if(wk.p)blkBasnicka+=`<div class="pa-cap" style="margin-top:8px">Písnička</div><div class="tval">${wk.p}</div>`;
  }else{
    blkBasnicka+=`<div class="empty" style="padding:6px 0 0;text-align:left;font-style:normal">Pro tento týden zatím nevyplněno.</div>`;
  }
  blkBasnicka+=`<button class="cardlink" onclick="go('priprava')">Otevřít tématický plán ›</button></div>`;

  // dnešní akce (pokud na dnešek nějaká je) – proklik na detail
  let blkAkce='';
  {const akToday=[...AKCE].filter(a=>a.day<=TODAYD&&(a.dayEnd?a.dayEnd>=TODAYD:a.day===TODAYD)).sort((a,b)=>a.day-b.day);
   if(akToday.length){
     blkAkce=`<div class="tile"><div class="ch">Dnešní akce</div>`;
     akToday.forEach(a=>{const m=[a.time,a.place].filter(Boolean).join(' · ');blkAkce+=`<button class="acard" style="margin:6px 0 0" onclick="openAkceDetail('${a.id}')"><span class="adate">${dayLbl(a)}</span><span style="flex:1"><span class="aname">${a.name}</span>${m?`<div class="ameta">${m}</div>`:''}</span></button>`;});
     blkAkce+=`<button class="cardlink" onclick="go('akce')">Všechny akce ›</button></div>`;
   }}

  // průvodci dnes s hodinami (řádky .np jako v sekci Průvodci); kdo uspává = ☾ u jména
  let blkPruvodci=`<div class="tile"><div class="ch">Průvodci dnes</div>`;
  if(todays.length){
    todays.forEach(x=>{const d=x.g.days[TODAY];blkPruvodci+=`<div class="np"><span>${x.g.n}${opener&&x.i===opener.i?' · <b style="color:var(--color-primary)">otevírá</b>':''}${x.i===usIdx?' <span style="color:var(--color-info)">☾</span>':''}</span><b>${fmt(d.s)}–${fmt(d.e)}</b></div>`;});
  }else{blkPruvodci+=`<div class="empty" style="padding:6px">Dnes nikdo nemá službu.</div>`;}
  blkPruvodci+=`<button class="cardlink" onclick="go('pruvodci')">Služby a rozpis ›</button></div>`;

  /* Na desktopu je ranní trojice v jedné řadě přes celou šířku – je to jeden okamžik dne
     (kolik jich je · co vzkázali rodiče · kdo nepřijde) a průvodce ho má přečíst najednou.
     Pod ní teprve kontext dne. Na mobilu se .dash-row stohuje, takže pořadí zůstává stejné. */
  let h=`<div class="dash-row">${blkDochazka}${blkZpravy}${blkNeprijde}</div>`;
  h+=`<div class="dash3">`;
  h+=`<div class="dcol">${blkProgram}${blkAkce}</div>`;
  h+=`<div class="dcol">${blkBasnicka}</div>`;
  h+=`<div class="dcol">${blkPruvodci}</div>`;
  h+=`</div>`;
  return h;
}
window.goDochTab=k=>{tab=k;view='den';denDay=TODAYD;open=-1;query='';go('dochazka');};
