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
  let blkDochazka=`<div class="tile"><div class="ch">Docházka dnes</div><div class="c-counts">`
    +dl('t-pri',c.pres,'Přítomni',"goDochTab('rano')")
    +dl('t-abs'+(c.neprit?'':' zero'),c.neprit,'Absence',"goDochTab('neprit')")
    +`<div class="c-cap">Z přítomných</div>`
    +dl('t-dop',c.poobede,'Dopolední',"goDochTab('poobede')")
    +dl('t-odp',c.odpoledni,'Odpolední',"goDochTab('odpoledni')")
    +(utery?dl('t-cel',data.filter(x=>inTab(x,'celodenni')).length,'Celodenní',"goDochTab('celodenni')"):'')
    +dl('t-spi','☾ '+spici.length,'Odpoledne spí','spiToggle()',`aria-expanded="${spiOtevreno}" aria-controls="spi-list"`)
    +(spiOtevreno?`<div class="c-spi-list" id="spi-list">${spici.map(x=>`<span>${kratke(x)}</span>`).join('')||'<span>Dnes odpoledne nikdo nespí.</span>'}</div>`:'')
    +`</div><button class="addbig" onclick="go('dochazka')">${smiZapisovat()?'Otevřít dnešní docházku':'Zobrazit docházku'} →</button></div>`;

  /* Vzkazy od rodičů na dnešek, od nejnovějšího. Typ vzkazu tučně na začátku – vyzvednutí
     jiným a zdravotní informace se tak najdou okem, bez barev a stavů. Zakládá je rodič ve své
     appce, tady jsou jen ke čtení (appky spolu data nesdílejí). */
  let blkZpravy='';
  {const zpr=[];zpravyDnes().forEach(({c})=>c.zpravy.filter(z=>z.den===TODAYD).forEach(z=>zpr.push({c,z})));
   const min=s=>{const [h,m]=String(s).split(':').map(Number);return h*60+(m||0);};
   zpr.sort((a,b)=>min(b.z.odeslano)-min(a.z.odeslano));
   if(zpr.length){
     blkZpravy=`<div class="tile"><div class="ch">Informace od rodičů<span class="c-badge">${zpr.length}</span></div><div class="dash-scroll">`;
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
  let blkNeprijde=`<div class="tile"><div class="ch">Kdo dnes nepřijde</div><div class="dash-scroll">`;
  if(absent.length){
    absent.forEach(x=>{
      const r=x.parentExcuse?'omluveno rodičem':x.guideExcuse?'omluveno vedoucí':(x.status==='omluveno'?'omluveno průvodcem':'neomluveno');
      const e=x.parentExcuse||x.guideExcuse;
      const det=e?`<b>${(e.reason||'').replace(/^./,m=>m.toUpperCase())}</b>`+(e.pozn?`: ${esc(e.pozn)}`:'')
        +(x.guideExcuse?` Zapsala ${esc(e.by)} ${e.time}, bez náhrady.`:` (${e.time})`):'';
      blkNeprijde+=`<button class="prehl-abs" onclick="goDochTab('neprit')">${avatar(x,24)}<span class="pa-nm">${kratke(x)}</span><span class="pa-r${otevrene(x)?'':' ok'}">${r}</span>`
        +(det?`<span class="pa-pozn">${det}</span>`:'')+`</button>`;
    });
  }else{
    blkNeprijde+=`<div class="empty" style="padding:6px">Dnes dorazí všichni. Všichni jsme Vhaaji.</div>`;
  }
  blkNeprijde+=`</div></div>`;

  /* Třídnice: všechny nedoplněné dny za poslední 3 týdny (zápis se dopisuje zpětně), nejvýš
     tři + „a další", pak kdo píše dnes. Bez štítků „rozepsáno N z 8" – „Chybí: …" řekne víc. */
  const nedopl=[];{let k=TR_DNES;for(let i=0;i<15;i++){k=trPredchozi(k);if(!k)break;const st=trStav(k).k;if(st==='rozepsano'||st==='chybi')nedopl.push(k);}}
  const vcera=trPredchozi(TR_DNES);
  let blkTridnice=`<div class="tile has-kresba t-tri">${kresba('tridnice','kresba-k')}<div class="ch">Třídnice</div>`;
  if(nedopl.length){
    blkTridnice+=`<div class="tr-dash-cap">Nedoplněné dny – poslední 3 týdny</div>`;
    nedopl.slice(0,3).forEach(k=>{const ch=trChybi(k);
      blkTridnice+=`<button class="tr-dash" onclick="trOtevrit(${k})"><span class="tr-dash-d">${k===vcera?'Včera – ':''}${trDenLbl(k)}</span>`
        +`<span class="tr-dash-c">${trStav(k).k==='chybi'?'Chybí celý zápis':'Chybí: '+ch.join(', ')}</span>`+`</button>`;});
    if(nedopl.length>3)blkTridnice+=`<div class="tr-dash-dalsi">a další ${nedopl.length-3} ›</div>`;
  }else blkTridnice+=`<div class="tr-dash-dalsi">Všechny zápisy jsou hotové.</div>`;
  blkTridnice+=`<button class="tr-dash today" onclick="trOtevrit(${TR_DNES})"><span class="tr-dash-d">Dnes píše ${TR_ZAPISUJE[trInfo(TR_DNES).dow]}</span></button>`;
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
  blkBasnicka+=`<button class="cardlink" onclick="go('priprava')">Otevřít tématický plán →</button></div>`;

  // dnešní akce (pokud na dnešek nějaká je) – proklik na detail
  let blkAkce='';
  {const akToday=[...AKCE].filter(a=>a.day<=TODAYD&&(a.dayEnd?a.dayEnd>=TODAYD:a.day===TODAYD)).sort((a,b)=>a.day-b.day);
   if(akToday.length){
     blkAkce=`<div class="tile has-kresba t-akc">${kresba('akce','kresba-k')}<div class="ch">Dnešní akce</div>`;
     akToday.forEach(a=>{const m=[a.time,a.place].filter(Boolean).join(', ');blkAkce+=`<button class="acard" onclick="openAkceDetail('${a.id}')"><span class="adate">${dayLbl(a)}</span><span style="flex:1"><span class="aname">${a.name}</span>${m?`<div class="ameta">${m}</div>`:''}</span></button>`;});
     blkAkce+=`<button class="cardlink" onclick="go('akce')">Všechny akce →</button></div>`;
   }}

  // dnešní jídlo – na přehledu, ne v jídelníčku (designérka 28. 10. 2026); porce bez alergenu u jídla
  let blkJidlo='';
  {const den=jidelnicekDen(TODAYD,6);
   if(den&&den.some(it=>it[1])){
     blkJidlo=`<div class="tile t-jid"><div class="ch">Dnes se jí</div>${den.map(it=>jidChodHTML(it,false)).join('')}`
       +`<button class="cardlink" onclick="go('jidelnicek')">Jídelníček na další dny →</button></div>`;
   }}

  // průvodci dnes podle příchodu; kdo otevírá (první vlna) zeleně, kdo uspává = ☾
  let blkPruvodci=`<div class="tile t-pru"><div class="ch">Průvodci dnes</div>`;
  if(todays.length){
    todays.forEach(x=>{const d=x.g.days[TODAY];blkPruvodci+=`<div class="np"><span>${x.g.n}${x.i===usIdx?' ☾':''}${minOf(d)===prvni?' <b style="color:var(--color-primary)">(otevírá)</b>':''}</span><b>${fmt(d.s)}–${fmt(d.e)}</b></div>`;});
  }else{blkPruvodci+=`<div class="empty" style="padding:6px">Dnes nikdo nemá službu.</div>`;}
  blkPruvodci+=`<button class="cardlink" onclick="go('pruvodci')">Služby a rozpis →</button></div>`;

  /* Ranní trojice: na mobilu tři karty pod sebou, na desktopu jedna plocha přes celou šířku
     (je to jeden okamžik dne). Pod ní zbytek dne v pořadí mobilu; desktop ho skládá mřížkou. */
  const bloky={blkDochazka,blkZpravy,blkNeprijde,blkTridnice,blkAkce,blkJidlo,blkBasnicka,blkPruvodci};
  if(DB_VAR==='den')return dbDenShoraDolu(bloky,{spici,absent,otevrene,c});
  if(DB_VAR==='resit')return dbCoResit(bloky,{absent,otevrene,nedopl,vcera});
  if(DB_VAR==='dlazdice')return dbDlazdice({c,spici,absent,otevrene,nedopl,todays,prvni,wk});
  let h=`<div class="dash-row">${blkDochazka}${blkZpravy}${blkNeprijde}</div>`;
  h+=`<div class="dash-c">${blkTridnice}${blkAkce}${blkJidlo}${blkBasnicka}${blkPruvodci}</div>`;
  return h;
}

/* PRŮZKUM VZORU (28. 10. 2026) – jiné vzory přehledu k porovnání, přepínají se v URL:
   ?dbv=den | resit | dlazdice (srovnávací stránka docs/prehled-varianty.html). Bez parametru
   současný „soupis dne". Hlavička (datum, kdo otevírá, program) je ve všech stejná. */
const DB_VAR=(new URLSearchParams(location.search).get('dbv')||'soupis');
const dbMin=s=>{const [h,m]=String(s).split(':').map(Number);return h*60+(m||0);};

/* Varianta „den": den shora dolů po částech. Hranice jsou známé časy provozu, ne vymyšlené časy
   jídel: program začíná 8:30, dopolední docházka končí 13:00, odpolední 15:00. Probíhající část
   je otevřená a zvýrazněná, ostatní sbalené s jednou větou shrnutí. */
const DB_FAZE=[['rano','Ráno',0,510],['dopo','Dopoledne',510,780],['odpo','Odpoledne',780,900],['konec','Konec dne',900,1440]];
let dbOtevreneFaze=null;   // null = jen probíhající část
window.dbFaze=k=>{const s=dbOtevreneFaze||new Set([dbTedFaze()]);s.has(k)?s.delete(k):s.add(k);dbOtevreneFaze=s;render();};
const dbTedFaze=()=>{const t=dbMin(TEDCAS);return (DB_FAZE.find(f=>t>=f[2]&&t<f[3])||DB_FAZE[0])[0];};
function dbDenShoraDolu(b,x){
  const ted=dbTedFaze(), otevr=dbOtevreneFaze||new Set([ted]), ti=DB_FAZE.findIndex(f=>f[0]===ted);
  const den=jidelnicekDen(TODAYD,6)||[], chod=re=>den.filter(it=>re.test(it[0])&&it[1]);
  const jidlo=(nadpis,its)=>its.length?`<div class="tile"><div class="ch">${nadpis}</div>${its.map(it=>jidChodHTML(it,false)).join('')}</div>`:'';
  const nZpr=zpravyDnes().length, nOtevr=x.absent.filter(x.otevrene).length;
  const obsah={
    rano:{shrnuti:`Přítomno ${x.c.pres} dětí, nepřijde ${x.absent.length}${nOtevr?` (${nOtevr} neomluveno)`:''}. Vzkazy od rodičů: ${nZpr}.`,
      html:b.blkDochazka+b.blkZpravy+b.blkNeprijde},
    dopo:{shrnuti:[b.blkAkce?'Dnešní akce':'',chod(/dopolední|polévka|hlavní/i).length?'svačina a oběd':'','básnička'].filter(Boolean).join(', ').replace(/^./,m=>m.toUpperCase())+'.',
      html:b.blkAkce+jidlo('Svačina a oběd',chod(/dopolední|polévka|hlavní/i))+b.blkBasnicka},
    odpo:{shrnuti:`Odpoledne spí ${x.spici.length} dětí, odpolední docházka ${x.c.odpoledni}.`,
      html:`<div class="tile"><div class="ch">Odpoledne</div><div class="c-counts">`
        +`<button class="c-tile t-odp" onclick="goDochTab('odpoledni')"><span class="num">${x.c.odpoledni}</span><span class="lab">Odpolední</span></button>`
        +`<button class="c-tile t-spi" onclick="goDochTab('spi')"><span class="num">☾ ${x.spici.length}</span><span class="lab">Odpoledne spí</span></button></div></div>`
        +jidlo('Odpolední svačina',chod(/odpolední/i))},
    konec:{shrnuti:`Třídnici dnes píše ${TR_ZAPISUJE[trInfo(TR_DNES).dow]}.`,html:b.blkTridnice+b.blkPruvodci}
  };
  return `<div class="db-den">`+DB_FAZE.map(([k,lab],i)=>{const on=otevr.has(k), o=obsah[k];
    return `<section class="db-faze${k===ted?' ted':''}${i<ti?' bylo':''}${on?' on':''}">`
      +`<button class="db-faze-h" onclick="dbFaze('${k}')" aria-expanded="${on}"><span class="db-bod" aria-hidden="true"></span>`
      +`<span class="db-faze-t">${lab}${k===ted?' <span class="bdg st-ok">teď</span>':''}</span>`
      +(on?'':`<span class="db-faze-s">${o.shrnuti}</span>`)+`<span class="db-faze-a" aria-hidden="true">${on?'⌃':'›'}</span></button>`
      +(on?`<div class="db-faze-b">${o.html}</div>`:'')+`</section>`;}).join('')+`</div>`;
}

/* Varianta „řešit": nahoře jen to, co čeká na průvodce (každá položka jedním klepnutím),
   pod tím klidné informace ke čtení. Když není co řešit, je to tam napsané. */
function dbCoResit(b,x){
  const ukoly=[];
  x.absent.filter(x.otevrene).forEach(d=>ukoly.push({t:`<b>${kratke(d)}</b>: neomluvená absence`,d:'zjistit u rodičů',on:"goDochTab('neprit')",s:'danger'}));
  const nZpr=zpravyDnes().reduce((n,{c})=>n+c.zpravy.filter(z=>z.den===TODAYD).length,0);
  if(nZpr)ukoly.push({t:`<b>${nZpr}</b> ${nZpr===1?'informace':nZpr<5?'informace':'informací'} od rodičů na dnešek`,d:'přečíst',on:"dbSkok('db-zpr')",s:'info'});
  const den=jidelnicekDen(TODAYD,6)||[];
  den.forEach(it=>porceBez(it[2]).forEach(([n,k])=>ukoly.push({t:`${it[0]}: <b>${porceBezLbl(n,k)}</b>`,d:'ohlídat při výdeji',on:"go('jidelnicek')",s:'warn'})));
  x.nedopl.slice(0,2).forEach(k=>ukoly.push({t:`Třídnice ${k===x.vcera?'včera – ':''}${trDenLbl(k)}: ${trStav(k).k==='chybi'?'chybí celý zápis':'chybí '+trChybi(k).join(', ')}`,d:'doplnit',on:`trOtevrit(${k})`,s:'warn'}));
  let h=`<div class="tile db-resit"><div class="ch">Co řešit teď${ukoly.length?`<span class="c-badge">${ukoly.length}</span>`:''}</div>`;
  h+=ukoly.length?ukoly.map(u=>`<button class="db-ukol" onclick="${u.on}"><span class="db-tecka s-${u.s}" aria-hidden="true"></span><span class="db-ukol-t">${u.t}<span class="db-ukol-d">${u.d}</span></span><span class="db-ukol-a" aria-hidden="true">›</span></button>`).join('')
    :`<div class="empty" style="text-align:left;padding:6px 0">Všechno je vyřízené.</div>`;
  h+=`</div><div class="db-cist-h">Ke čtení</div><div class="db-cist">${b.blkDochazka}${b.blkZpravy?`<div id="db-zpr">${b.blkZpravy}</div>`:''}${b.blkAkce}${b.blkJidlo}${b.blkBasnicka}${b.blkPruvodci}</div>`;
  return h;
}
window.dbSkok=id=>{const e=document.getElementById(id);if(e)e.scrollIntoView({behavior:'smooth',block:'start'});};

/* Varianta „dlaždice": celý den na jeden pohled – každá dlaždice nese jeden údaj, klepnutím detail. */
function dbDlazdice(x){
  const den=jidelnicekDen(TODAYD,6)||[], hl=den.find(it=>/hlavní/i.test(it[0])), nOtevr=x.absent.filter(x.otevrene).length;
  const nZpr=zpravyDnes().reduce((n,{c})=>n+c.zpravy.filter(z=>z.den===TODAYD).length,0);
  const ak=[...AKCE].find(a=>a.day<=TODAYD&&(a.dayEnd?a.dayEnd>=TODAYD:a.day===TODAYD));
  const alg=den.reduce((n,it)=>n+porceBez(it[2]).length,0);
  const otv=x.todays.filter(t=>minOf(t.g.days[TODAY])===x.prvni).map(t=>t.g.n);
  const dl=(cls,velke,lab,on,pozn='')=>`<button class="db-dl ${cls}" onclick="${on}"><span class="db-dl-l">${lab}</span><span class="db-dl-v">${velke}</span>${pozn?`<span class="db-dl-p">${pozn}</span>`:''}</button>`;
  return `<div class="db-dlazdice">`
    +dl('t-green db-num',x.c.pres,'Přítomni',"goDochTab('rano')",`z ${data.length} dětí`)
    +dl((x.absent.length?'t-rose':'t-neutral')+' db-num',x.absent.length,'Nepřijde',"goDochTab('neprit')",nOtevr?`${nOtevr} neomluveno`:'všichni omluveni')
    +dl('t-blue db-num',nZpr,'Vzkazy od rodičů',"go('dochazka')",nZpr?'na dnešek':'nic nového')
    +dl('t-spi db-num','☾ '+x.spici.length,'Odpoledne spí',"goDochTab('spi')")
    +(hl?dl('t-ochre db-txt db-wide',esc(hl[1]),'Oběd',"go('jidelnicek')",alg?`porce bez alergenu: ${alg}`:''):'')
    +(ak?dl('t-green db-txt',esc(ak.name),'Dnešní akce',`openAkceDetail('${ak.id}')`,[ak.time,ak.place].filter(Boolean).join(', ')):'')
    +(x.wk&&x.wk.b?dl('t-blue db-txt db-hand',esc(x.wk.b.split(/[.!?]/)[0])+'…','Básnička týdne',"go('priprava')"):'')
    +dl((x.nedopl.length?'t-ochre':'t-green')+' db-txt',x.nedopl.length?`Chybí ${x.nedopl.length} ${x.nedopl.length===1?'den':x.nedopl.length<5?'dny':'dní'}`:'Hotovo','Třídnice',`trOtevrit(${x.nedopl[0]||TR_DNES})`,`dnes píše ${TR_ZAPISUJE[trInfo(TR_DNES).dow]}`)
    +dl('t-rose db-txt',jmena(otv)||'nikdo',otv.length>1?'Otevírají':'Otevírá',"go('pruvodci')",`ve službě ${x.todays.length}`)
    +`</div>`;
}
window.goDochTab=k=>{tab=k;view='den';denDay=TODAYD;open=-1;query='';go('dochazka');};
