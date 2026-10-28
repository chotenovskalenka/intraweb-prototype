/* SCREEN: PRUVODCE_PREHLED – „soupis dne" dle priorit průvodce, vzhled C · Deník z háje
   (Figma „Vhaaji – design systém" → „C · původní rozložení" a „C · desktop", decision-log
   27. 10. 2026). Pořadí v DOM = pořadí na mobilu: docházka → informace od rodičů → kdo
   nepřijde (ranní řada, na desktopu jedna plocha) → třídnice → akce → jídlo → básnička → průvodci.
   Na desktopu skládá spodní část mřížka (.dash-c): průvodci + akce | básnička + jídlo | třídnice. */
/* Dlouhé vzkazy se krátí na tři řádky. Jeden ukecaný rodič jinak zdvojnásobí výšku celé
   ranní řady (měřeno: 287 → 550 px) a průvodce při předávání dítěte potřebuje hlavně vědět,
   že něco přišlo a od koho. Práh je na délce textu, ne na změřeném přetečení – render()
   staví HTML jako řetězec, takže v tu chvíli není co měřit. */
const ZP_DELKA=140;
let zpRozbalene=new Set();
window.zpToggle=id=>{zpRozbalene.has(id)?zpRozbalene.delete(id):zpRozbalene.add(id);render();};
// spící děti se ukážou jménem až po rozkliknutí dlaždice (potřebují je nahnat do maringotky)
let spiOtevreno=false;
window.spiToggle=()=>{spiOtevreno=!spiOtevreno;render();};
const PDOWFULL=['pondělí','úterý','středa','čtvrtek','pátek','sobota','neděle'];
const minOf=d=>{const [h,m]=d.s.split(':').map(Number);return h*60+m;};
const jmena=a=>a.length<2?a.join(''):a.slice(0,-1).join(', ')+' a '+a[a.length-1];

/* Hlavička dashboardu – renderuje se do topbaru (viz core.js). Tři řádky dne:
   kdo otevírá (dvě vlny podle příchodu, bez časů – ty jsou v kartě Průvodci), program dne
   a kroužek. Ptáček se mění s ročním obdobím, je jen dekorace. */
function renderPrehledHead(){
  const den=PDOWFULL[wd(TODAYD)];
  const todays=GUIDESHIFT.map((g,i)=>({g,i})).filter(x=>serving(x.g.days[TODAY])).sort((a,b)=>minOf(a.g.days[TODAY])-minOf(b.g.days[TODAY]));
  const prvni=todays.length?minOf(todays[0].g.days[TODAY]):0;
  const vlna1=todays.filter(x=>minOf(x.g.days[TODAY])===prvni).map(x=>x.g.n), dal=todays.filter(x=>minOf(x.g.days[TODAY])!==prvni).map(x=>x.g.n);
  const ryt=RYTMUS[wd(TODAYD)];
  const radky=[];
  if(todays.length)radky.push(`${vlna1.length>1?'Otevírají':'Otevírá'} ${jmena(vlna1)}${dal.length?`, dál ${jmena(dal)}`:''}`);
  else radky.push('Dnes nikdo nemá službu');
  if(ryt)radky.push(`Dnes je <b>${ryt.prog}</b>`);
  if(ryt&&ryt.krouzek)radky.push(esc(ryt.krouzek));
  return `<div class="dash-head c-head"><h1 class="dh-t">${den.charAt(0).toUpperCase()+den.slice(1)} ${TODAYD}. 6. 2026</h1>`
    +`<ul class="c-lines">${radky.map(r=>`<li>${kresba('odrazka')}<span>${r}</span></li>`).join('')}</ul>`
    +kresbaPtacek(6,'c-bird')+`</div>`;
}
function renderPrehled(){
  const c=counts();
  const todays=GUIDESHIFT.map((g,i)=>({g,i})).filter(x=>serving(x.g.days[TODAY])).sort((a,b)=>minOf(a.g.days[TODAY])-minOf(b.g.days[TODAY]));
  const prvni=todays.length?minOf(todays[0].g.days[TODAY]):0;
  const usIdx=todays.some(x=>x.i===uspavaToday)?uspavaToday:(todays[0]?todays[0].i:-1);
  const utery=wd(TODAYD)===1;

  /* ── Docházka: počty jako skvrny ──
     Přítomni + Absence = všechny děti. Pod nimi „z přítomných": dopolední, odpolední
     (v úterý i celodenní – jinak se celodenní plán počítá do odpoledních) a spí. Spí není
     stav docházky (P2 z testování), proto je dlaždice čárkovaná a po klepnutí ukáže jména. */
  const spici=data.filter(x=>inTab(x,'spi'));
  const dl=(cls,n,lab,click,extra='')=>`<button class="c-tile ${cls}" onclick="${click}" ${extra}><span class="num">${n}</span><span class="lab">${lab}</span></button>`;
  let blkDochazka=`<div class="tile"><div class="ch">Děti</div><div class="c-counts">`
    +dl('t-pri',c.pres,'Přítomni',"goDochTab('rano')")
    +dl('t-abs'+(c.neprit?'':' zero'),c.neprit,'Absence',"goDochTab('neprit')")
    +`<div class="c-cap">Z nich</div>`
    +dl('t-dop',c.poobede,'Dopolední',"goDochTab('poobede')")
    +dl('t-odp',c.odpoledni,'Odpolední',"goDochTab('odpoledni')")
    +(utery?dl('t-cel',data.filter(x=>inTab(x,'celodenni')).length,'Celodenní',"goDochTab('celodenni')"):'')
    +dl('t-spi','☾ '+spici.length,'Odpoledne spí','spiToggle()',`aria-expanded="${spiOtevreno}" aria-controls="spi-list"`)
    +(spiOtevreno?`<div class="c-spi-list" id="spi-list">${spici.map(x=>`<span>${kratke(x)}</span>`).join('')||'<span>Odpoledne nikdo nespí.</span>'}</div>`:'')
    +`</div><button class="addbig" onclick="go('dochazka')">${smiZapisovat()?'Zapsat docházku':'Zobrazit docházku'} →</button></div>`;

  /* Vzkazy od rodičů na dnešek, od nejnovějšího. Typ vzkazu tučně na začátku – vyzvednutí
     jiným a zdravotní informace se tak najdou okem, bez barev a stavů. Zakládá je rodič ve své
     appce, tady jsou jen ke čtení (appky spolu data nesdílejí). */
  let blkZpravy='';
  {const zpr=[];zpravyDnes().forEach(({c})=>c.zpravy.filter(z=>z.den===TODAYD).forEach(z=>zpr.push({c,z})));
   const min=s=>{const [h,m]=String(s).split(':').map(Number);return h*60+(m||0);};
   zpr.sort((a,b)=>min(b.z.odeslano)-min(a.z.odeslano));
   if(zpr.length){
     blkZpravy=`<div class="tile"><div class="ch">Vzkazy od rodičů<span class="c-badge">${zpr.length}</span></div><div class="dash-scroll">`;
     zpr.forEach(({c,z})=>{
       const p=zpPotrebuje(z.typ), cas=String(z.cas||'').replace(/^0/,'');
       const typ=p==='kdo'?`<span class="zp-typ">${ZPLAB[z.typ]}:</span> <b>${esc(z.kdo)}</b>.`
         :p==='cas'?`<span class="zp-typ">${ZPLAB[z.typ]}</span> – <b>${esc(cas)}</b>.`
         :`<span class="zp-typ">${ZPLAB[z.typ]}:</span>`;
       const t=typ+(z.text?' '+esc(z.text):'');
       const dlouhy=(z.text||'').length>ZP_DELKA, open=zpRozbalene.has(z.id);
       blkZpravy+=`<div class="zprow">${avatar(c,28)}<span class="zp-txt"><span class="zp-head"><b>${kratke(c)}</b><span class="zp-cas">${z.odeslano}</span></span>`
         +`<span class="zp-who${dlouhy&&!open?' zp-clamp':''}">${t}</span>`
         +(dlouhy?`<button class="zp-vic" onclick="zpToggle('${z.id}')">${open?'zkrátit ›':'celý vzkaz ›'}</button>`:'')
         +`</span></div>`;
     });
     blkZpravy+=`</div></div>`;
   }}

  /* Kdo dnes nepřijde – nevyřešené (neomluveno) nahoře, omluvené pod nimi.
     Červená jen u toho, kde má průvodce jednat. */
  const absent=data.filter(x=>x.status!=='pritomen');
  const otevrene=x=>!x.parentExcuse&&!x.guideExcuse&&x.status!=='omluveno';
  absent.sort((a,b)=>otevrene(b)-otevrene(a));
  let blkNeprijde=`<div class="tile"><div class="ch">Nepřijdou</div><div class="dash-scroll">`;
  if(absent.length){
    absent.forEach(x=>{
      // z pohledu průvodce: kdo o absenci ví; „zatím bez omluvy" zní jako úkol (zjistit), ne jako přestupek
      const r=x.parentExcuse?'omluva od rodiče':x.guideExcuse?'omluva zapsaná vedoucí':(x.status==='omluveno'?'omluva zapsaná v docházce':'zatím bez omluvy');
      const e=x.parentExcuse||x.guideExcuse;
      const det=e?`<b>${(e.reason||'').replace(/^./,m=>m.toUpperCase())}</b>`+(e.pozn?`: ${esc(e.pozn)}`:'')
        +(x.guideExcuse?` (${esc(e.by)} ${e.time})`:` (${e.time})`):'';   // náhrady řeší vedení a rodiče, ne průvodce
      blkNeprijde+=`<button class="prehl-abs" onclick="goDochTab('neprit')">${avatar(x,24)}<span class="pa-nm">${kratke(x)}</span><span class="pa-r${otevrene(x)?'':' ok'}">${r}</span>`
        +(det?`<span class="pa-pozn">${det}</span>`:'')+`</button>`;
    });
  }else{
    blkNeprijde+=`<div class="empty" style="padding:6px">Dorazí všichni. Všichni jsme Vhaaji.</div>`;
  }
  blkNeprijde+=`</div></div>`;

  /* Třídnice: všechny nedoplněné dny za poslední 3 týdny (zápis se dopisuje zpětně), nejvýš
     tři + „a další", pak kdo píše dnes. Bez štítků „rozepsáno N z 8" – „Chybí: …" řekne víc. */
  const nedopl=[];{let k=TR_DNES;for(let i=0;i<15;i++){k=trPredchozi(k);if(!k)break;const st=trStav(k).k;if(st==='rozepsano'||st==='chybi')nedopl.push(k);}}
  const vcera=trPredchozi(TR_DNES);
  let blkTridnice=`<div class="tile has-kresba t-tri">${kresba('tridnice','kresba-k')}<div class="ch">Třídnici píše: ${TR_ZAPISUJE[trInfo(TR_DNES).dow]}</div>`;   // kdo píše rovnou v nadpisu (designérka 28. 10. 2026)
  if(nedopl.length){
    blkTridnice+=`<div class="tr-dash-cap">Chybí doplnit</div>`;
    nedopl.slice(0,3).forEach(k=>{const ch=trChybi(k);
      blkTridnice+=`<button class="tr-dash" onclick="trOtevrit(${k})"><span class="tr-dash-d">${k===vcera?'Včera – ':''}${trDenLbl(k)}</span>`
        +`<span class="tr-dash-c">${trStav(k).k==='chybi'?'Chybí celý zápis':'Chybí: '+ch.join(', ')}</span>`+`</button>`;});
    if(nedopl.length>3)blkTridnice+=`<div class="tr-dash-dalsi">a další ${nedopl.length-3} ›</div>`;
  }else blkTridnice+=`<div class="tr-dash-dalsi">Všechny zápisy jsou hotové.</div>`;
  blkTridnice+=`<button class="cardlink" onclick="trOtevrit(${TR_DNES})">Otevřít třídnici →</button></div>`;

  // básnička celá (do ranního kruhu), písnička jen prvním veršem – celá je v tématickém plánu
  const wk=TEMA.tydny[Math.floor((TODAYD-1)/7)];
  let blkBasnicka=`<div class="tile has-kresba t-bas">${kresba('basnicka','kresba-k')}<div class="ch">Básnička a písnička týdne</div>`;
  if(wk&&(wk.b||wk.p)){
    if(wk.b)blkBasnicka+=`<div class="pa-cap">Básnička</div><div class="c-basen">${wk.b}</div>`;
    if(wk.p){const vers=(wk.p.match(/^[^.!?]*?,[^,.!?]*/)||[wk.p])[0];
      blkBasnicka+=`<div class="pa-cap" style="margin-top:8px">Písnička</div><div class="c-basen">${vers}${vers.length<wk.p.length?'…':''}</div>`;}
  }else{
    blkBasnicka+=`<div class="empty" style="padding:6px 0 0;text-align:left;font-style:normal">Pro tento týden zatím nevyplněno.</div>`;
  }
  blkBasnicka+=`<button class="cardlink" onclick="go('priprava')">Celý plán týdne →</button></div>`;

  // dnešní akce (pokud na dnešek nějaká je) – proklik na detail
  let blkAkce='';
  {const akToday=[...AKCE].filter(a=>a.day<=TODAYD&&(a.dayEnd?a.dayEnd>=TODAYD:a.day===TODAYD)).sort((a,b)=>a.day-b.day);
   if(akToday.length){
     blkAkce=`<div class="tile has-kresba t-akc">${kresba('akce','kresba-k')}<div class="ch">${akToday.some(a=>a.dayEnd)?'Probíhá':'Akce'}</div>`;
     akToday.forEach(a=>{const m=[a.time,a.place].filter(Boolean).join(', ');blkAkce+=`<button class="acard" onclick="openAkceDetail('${a.id}')"><span class="adate">${dayLbl(a)}</span><span style="flex:1"><span class="aname">${a.name}</span>${m?`<div class="ameta">${m}</div>`:''}</span></button>`;});
     blkAkce+=`<button class="cardlink" onclick="go('akce')">Všechny akce →</button></div>`;
   }}

  // dnešní jídlo – na přehledu, ne v jídelníčku (designérka 28. 10. 2026); porce bez alergenu u jídla
  let blkJidlo='';
  {const den=jidelnicekDen(TODAYD,6);
   if(den&&den.some(it=>it[1])){
     blkJidlo=`<div class="tile t-jid"><div class="ch">K jídlu</div>${den.map(it=>jidChodHTML(it,false)).join('')}`
       +`<button class="cardlink" onclick="go('jidelnicek')">Celý jídelníček →</button></div>`;
   }}

  // „dnes" je jen v hlavičce u data – v nadpisech karet se opakovalo (designérka 28. 10. 2026)
  // průvodci dnes podle příchodu; kdo otevírá (první vlna) a kdo uspává, drobně pod jménem
  let blkPruvodci=`<div class="tile t-pru"><div class="ch">Kdo je tu</div>`;
  if(todays.length){
    // role pod jménem drobně, čas vpravo vždy na jednom řádku – v úzkém sloupci se „(otevírá)" a ☾ lámaly do času
    todays.forEach(x=>{const d=x.g.days[TODAY], role=[minOf(d)===prvni?'otevírá':'',x.i===usIdx?'uspává':''].filter(Boolean).join(', ');
      blkPruvodci+=`<div class="np"><span class="np-n">${x.g.n}${role?`<span class="np-r">${role}</span>`:''}</span><b>${fmt(d.s)}–${fmt(d.e)}</b></div>`;});
  }else{blkPruvodci+=`<div class="empty" style="padding:6px">Nikdo nemá službu.</div>`;}
  blkPruvodci+=`<button class="cardlink" onclick="go('pruvodci')">Celý rozpis →</button></div>`;

  /* Ranní trojice: na mobilu tři karty pod sebou, na desktopu jedna plocha přes celou šířku
     (je to jeden okamžik dne). Pod ní zbytek dne v pořadí mobilu; desktop ho skládá mřížkou. */
  let h=`<div class="dash-row">${blkDochazka}${blkZpravy}${blkNeprijde}</div>`;
  h+=`<div class="dash-c">${blkTridnice}${blkAkce}${blkJidlo}${blkBasnicka}${blkPruvodci}</div>`;
  return h;
}
window.goDochTab=k=>{tab=k;view='den';denDay=TODAYD;open=-1;query='';go('dochazka');};
