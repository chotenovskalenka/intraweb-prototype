let dochSeznam='all';   // P4: filtr soupisu podle seznamu dětí
/* SCREEN: PRUVODCE_DOCHAZKA */
const SPECIAL={4:'hor',14:'pred',15:'pred',16:'pred'}; // v ostré verzi odvozeno z akcí v IS
let mode=SPECIAL[3]||'bezny';
const onTrip=c=>mode==='pred'?c.predskolak:mode==='hor'?c.lez:false;
const inTab=(c,t)=>{
  if(t==='rano')return here(c);
  if(t==='skolka')return here(c)&&!onTrip(c);
  if(t==='vyprava')return here(c)&&onTrip(c);
  if(t==='obed')return here(c);
  if(t==='spi')return staysPM(c)&&c.spi&&!onTrip(c);
  if(t==='poobede')return here(c)&&c.plan==='dopolední';
  /* Podle kódu dne, ne podle plánu: celodenní plán je mimo úterý odpolední docházka (baseCode → 'O').
     Dřív se počítal jen plán „odpolední" a ve středu tu stálo 3 místo 20. */
  if(t==='odpoledni')return here(c)&&baseCode(c,TODAYD)==='O';
  if(t==='celodenni')return here(c)&&baseCode(c,TODAYD)==='C';   // jen v úterý (jinak je to 'O')
  if(t==='neprit')return !here(c);
};
/* Pojmenování stavů drží jeden slovník napříč appkou: přítomni · dopolední · odpolední · absence.
   „Ráno" bylo matoucí (číslo platí celý den, ne jen ráno) a „Po obědě" popisovalo důsledek
   místo režimu docházky. Viz docs/vyzkum-testovani-pruvodci.md, P2.
   Záložka „Spí" zůstává – spáči v maringotce jsou provozní fakt, ne režim docházky.
   Pořadí jako dlaždice na přehledu: přítomni, absence, pak rozpad přítomných a spáči na konci. */
const TABS_BEZNY=[['rano','Přítomni'],['neprit','Absence'],['poobede','Dopolední'],['odpoledni','Odpolední'],['spi','Spí']];
const TABS_SPEC=g=>[['skolka','Školka ráno'],['vyprava',g],['obed','Oběd'],['spi','Spí'],['neprit','Absence']];
const TABS_BY=()=>mode==='bezny'?(wd(TODAYD)===1?[...TABS_BEZNY.slice(0,4),['celodenni','Celodenní'],TABS_BEZNY[4]]:TABS_BEZNY):TABS_SPEC(mode==='pred'?'Předškoláci':'Lezci');
const CTX={rano:['Kdo dnes přišel',''],
  skolka:['Ráno ve školce',''],
  vyprava:['Na výpravě',''],
  obed:['Oběd – všichni',''],
  spi:['Spáči v maringotce','Zaškrtnuté dítě je ve školce. Odškrtnutím ho zapíšeš jako absenci – zaškrtnutím ho vrátíš zpět.'],
  poobede:['Dopolední docházka','Tyhle děti odcházejí po obědě.'],
  celodenni:['Celodenní docházka','Úterní dlouhý den – tyhle děti zůstávají až do 17:00.'],
  odpoledni:['Odpolední docházka','Tyhle děti zůstávají i odpoledne (do 15:00).'],
  neprit:['Absence','']};
function counts(){const o={};TABS_BY().forEach(([k])=>o[k]=data.filter(c=>inTab(c,k)).length);o.pres=data.filter(here).length;return o;}
/* Jeden štítek režimu na řádek, vždy podle KÓDU DNE (ne přihlášeného plánu): celodenní plán je
   mimo úterý odpolední docházka. Dřív dnešek ukazoval plán („celodenní") a jiný den kód
   („odpolední") – stejné dítě tak měnilo režim podle toho, který den se zrovna listoval.
   Barvy jako dlaždice: dopolední modrá, odpolední okrová, celodenní světle okrová, absence růžová. */
function rezimPill(c,d){
  const k=getCode(c,d);
  if(k==='C')return '<span class="pill p-cel">celodenní</span>';
  if(k==='D')return '<span class="pill p-dop">dopolední</span>';
  if(k==='O')return '<span class="pill p-odp">odpolední</span>';
  if(k==='OM')return '<span class="pill p-abs">omluveno</span>';
  return `<span class="pill p-abs">${d===TODAYD&&c.status==='neomluveno'?'nepřišlo':'absence'}</span>`;
}
function cellMark(code){if(!code)return '<span class="wc c-N">N</span>';if(code==='OM')return '<span class="bdg al" style="font-size:9px">om</span>';return `<span class="wc c-${code}">${code}</span>`;}
function codeLabel(code){const M={C:['celodenní',CODES.C[1]],D:['dopolední',CODES.D[1]],O:['odpolední',CODES.O[1]],OM:['omluveno',CODES.OM[1]]};const m=M[code];return m?`<span style="color:${m[1]}">${m[0]}</span>`:'<span style="color:var(--color-text-hint)">absence</span>';}
/* Doplněk k režimu jako obyčejný šedý text, ne další štítek: „spí" (odpoledne v maringotce)
   a dnes „na výpravě". Omluveno/nepřišlo nese štítek režimu, „po obědě domů" říká už „dopolední"
   a „nespí" je výchozí stav – řádek je tak čitelný jedním pohledem. */
function doplnek(c,d){
  if(d===TODAYD&&here(c)&&onTrip(c))return '<span class="r-dopl">na výpravě</span>';
  const k=getCode(c,d);
  return (k==='O'||k==='C')&&c.spi?'<span class="r-dopl">spí</span>':'';
}
function editPanel(c,i){
  const seg=(arr,cur,fn)=>arr.map(o=>`<button class="${cur===o[0]?'on':''}" onclick="${fn}(${i},'${o[0]}')">${o[1]}</button>`).join('');
  let h=`<div class="field"><div class="l">Docházka</div><div class="mini">${seg([['dopolední','Dopol.'],['odpolední','Odpol.'],['celodenní','Celodenní']],c.plan,'setPlan')}</div></div>`;
  h+=`<div class="field"><div class="l">Stav</div><div class="mini warn">${seg([['pritomen','Přítomen'],['omluveno','Omluveno'],['neomluveno','Nepřišlo']],c.status,'setStatus')}</div></div>`;
  /* Uzavření absence vedoucím: dokud to nikdo neudělá, dítě se počítá jako přítomné (vaří se
     mu oběd). Důvod je povinný stejně jako u rodiče – „omluveno" bez důvodu by byla výmluva
     za rodinu, o které nic nevíme. Vzniklá omluvenka je vždy bez náhrady (po 8:30). */
  if(c.status!=='pritomen'&&!c.parentExcuse){
    const cur=c.guideExcuse?c.guideExcuse.reason:'';
    h+=`<div class="field"><div class="l">Uzavřít jako omluveno bez náhrady</div>`
      +`<select class="pin" onchange="setGuideReason(${i},this.value)">`
      +`<option value=""${cur?'':' selected'}>Vyberte důvod…</option>`
      +DUVODY_P.map(([k,l])=>`<option value="${k}"${cur===k?' selected':''}>${l}</option>`).join('')+`</select>`
      +`<textarea class="pta" style="margin-top:8px" placeholder="Co ti rodič řekl (nepovinné)" oninput="setGuidePozn(${i},this.value)">${c.guideExcuse?esc(c.guideExcuse.pozn||''):''}</textarea></div>`;
  }
  if(c.guideExcuse)h+=`<div class="field"><div class="l">Omluveno vedoucí – po 8:30, bez náhrady</div><div class="pnote">${guideExcuseDetail(c)}</div></div>`;
  if(c.parentExcuse)h+=`<div class="field"><div class="l">Omluvenka od rodiče</div><div class="pnote">${c.parentExcuse.reason} (${c.parentExcuse.time})${c.parentExcuse.pozn?`<div class="pn-pozn">${esc(c.parentExcuse.pozn)}</div>`:''}</div></div>`;
  {const zpr=(c.zpravy||[]).filter(z=>z.den===TODAYD);
   if(zpr.length)h+=`<div class="field"><div class="l">Vzkazy od rodičů dnes</div>`
     +zpr.map(z=>`<div class="pnote">${zpravaShrnuti(z)}<div class="pn-pozn">odesláno ${z.odeslano}</div></div>`).join('')+`</div>`;}
  if(staysPM(c))h+=`<div class="field"><div class="l">Odpoledne</div><div class="mini">${seg([[true,'Spí'],[false,'Nespí']],c.spi,'setSpi')}</div></div>`;
  return h;
}
// dnes je u dítěte co číst: vzkaz z rodičovské appky, poznámka z omluvenky, omluva od vedoucí
const maPoznDnes=c=>!!((c.parentExcuse&&c.parentExcuse.pozn)||c.guideExcuse||(c.zpravy||[]).some(z=>z.den===TODAYD));
/* Všechno, co dnes přišlo od rodiče, na jednom místě u dítěte: vzkazy z rodičovské appky
   (kdo vyzvedne, pozdější příchod, lék), volný text z omluvenky a omluva zapsaná vedoucí.
   Vzkazy jsou provozní (neutrální), poznámka a omluvenka nesou zdravotní/absenční
   kontext – proto zůstávají v danger tónu .rnote. Na mobilu pod řádkem dítěte, na desktopu
   v panelu „Dnes k řešení" vedle soupisu. */
function poznamkyDne(c){
  // dlouhý vzkaz se krátí stejně jako na přehledu – jinak jeden odstavec odtlačí
  // pod okraj obrazovky celý zbytek soupisu
  let h=(c.zpravy||[]).filter(z=>z.den===TODAYD).map(z=>{
    const dlouhy=(z.text||'').length>ZP_DELKA, rozbalen=zpRozbalene.has(z.id);
    return `<div class="rnote rnote-info"><span class="${dlouhy&&!rozbalen?'zp-clamp':''}">${zpravaShrnuti(z)}</span> <span class="rn-cas">${z.odeslano}</span>`
      +(dlouhy?`<button class="zp-vic" onclick="event.stopPropagation();zpToggle('${z.id}')">${rozbalen?'zkrátit ›':'celý vzkaz ›'}</button>`:'')+`</div>`;
  }).join('');
  /* Poznámku z omluvenky uvozuje důvod, který rodič vybral (nemoc / rodinné důvody / jiné) –
     „K omluvence" nic neříkalo, přitom příznak omluvenka nese a na řádku jinak není vidět. */
  if(c.parentExcuse&&c.parentExcuse.pozn){const d=c.parentExcuse.reason||'omluvenka';
    h+=`<div class="rnote"><b>${d.charAt(0).toUpperCase()+d.slice(1)}:</b> ${esc(c.parentExcuse.pozn)} <span class="rn-cas">${c.parentExcuse.time}</span></div>`;}
  if(c.guideExcuse)h+=`<div class="rnote">${guideExcuseDetail(c)}</div>`;
  return h;
}
/* Filtr dlaždic pro libovolný den. Dnešek bere živý stav (inTab), ostatní dny kód dne. */
function inTabD(c,t,d){
  if(d===TODAYD)return inTab(c,t);
  const k=getCode(c,d),pr=!!k&&k!=='OM';
  if(t==='rano')return pr;
  if(t==='neprit')return !pr;
  if(t==='poobede')return k==='D';
  if(t==='odpoledni')return k==='O';
  if(t==='celodenni')return k==='C';
  if(t==='spi')return (k==='O'||k==='C')&&!!c.spi;
  return pr;
}
const tabsDne=d=>d===TODAYD?TABS_BY():(wd(d)===1?[...TABS_BEZNY.slice(0,4),['celodenni','Celodenní'],TABS_BEZNY[4]]:TABS_BEZNY);
/* Řádek dítěte je stejný každý den: zaškrtávátko, dítě, tečka vzkazu, jeden štítek režimu,
   šedý doplněk. Den, který role nesmí měnit, má zaškrtávátko neaktivní (stav je vidět, nejde
   klepnout). Dnešek rozbaluje řádek s úpravami, jiný den otevře volbu kódu (openCell). */
function rosterHTML(d=denDay){
  const dnes=d===TODAYD, zapis=denEditovatelny(d);
  let out='',shown=0;
  // nahoru děti, u kterých je dnes co číst; jinak abecedně – ať děti při listování nemění místo
  const maPozn=c=>dnes&&maPoznDnes(c)?0:1;
  const lst=data.map((c,i)=>({c,i})).sort((a,b)=>{const an=maPozn(a.c),bn=maPozn(b.c);if(an!==bn)return an-bn;return byAlpha(a,b);});
  lst.forEach(({c,i})=>{
    const match=(query?norm(full(c)).includes(norm(query)):inTabD(c,tab,d))&&(dochSeznam==='all'||veSeznamu(c,i,dochSeznam));
    if(!match)return;shown++;
    const noteLine=dnes?poznamkyDne(c):'';
    const k=getCode(c,d),pr=!!k&&k!=='OM';
    const klik=!zapis?'':dnes?`toggle(${i})`:`openCell(${i},${d})`;
    // skutečná tlačítka – na desktopu se docházka dá projít i klávesnicí (Tab, mezerník)
    const chk=`<button type="button" class="chk${pr?' on':''}${zapis?'':' ro'}" role="checkbox" aria-checked="${pr}"${zapis?'':' disabled'} aria-label="${full(c)} ${pr?'je':'není'} ve školce"`
      +(zapis?` title="${pr?'Ve školce – odškrtnutím zapíšeš absenci':'Absence – zaškrtnutím vrátíš do školky'}" onclick="event.stopPropagation();${dnes?`presence(${i})`:`presenceD(${i},${d})`}"`:'')
      +`>${pr?'✓':''}</button>`;
    out+=`<div class="row${pr?'':' absent'}${dnes&&open===i?' open':''}" id="r${i}"><div class="rmain"${klik?` onclick="${klik}" role="button"${dnes?` aria-expanded="${open===i}"`:''} ${KLAV}`:' style="cursor:default"'}>`
      +`${avatar(c,30)}<span class="nm">${full(c)}</span>`
      +(noteLine?'<span class="r-tecka" role="img" aria-label="má vzkaz od rodiče" title="Vzkaz od rodiče"></span>':'')
      +rezimPill(c,d)+doplnek(c,d)+chk+`</div>`
      +noteLine
      +(dnes?`<div class="edit" style="display:${open===i&&zapis?'block':'none'}">${open===i&&zapis?editPanel(c,i):''}</div>`:'')+`</div>`;
  });
  if(!shown)out='<div class="empty">'+(tab==='neprit'?(dnes?'Všichni dorazili. Všichni jsme Vhaaji.':'Nikdo nechybí.'):(query?'Nic nenalezeno.':'Nic tu není.'))+'</div>';
  return out;
}
function renderDochazka(){
  // Desktop: hlavička (nadpis + sloučené pole datum+Den/Týden) + dva panely (styl Přehledu). Mobil: stoh.
  // Měsíc záměrně jen v rodičovské/admin appce (přehled, hromadné omluvy, statistiky) – průvodce řeší den a týden.
  let h=`<div class="doch">`;   // přepínač Den/Týden + datum je v hlavičce (core.js render)
  h+=(view==='tyden')?renderTydenD():renderDen();
  return h+`</div>`;
}
// Sloučené pole: přepínač Den/Týden + listování data (den nebo týdenní rozsah) v jednom.
function renderDochNav(){
  const tog=`<div class="switch dsw">`+[['den','Den'],['tyden','Týden']].map(v=>`<button class="${view===v[0]?'on':''}" onclick="setDView('${v[0]}')">${v[1]}</button>`).join('')+`</div>`;
  let label,prev,next,pdis,ndis;
  if(view==='tyden'){label=`${weekStart}.–${Math.min(weekStart+4,30)}. 6.`;prev='stepWeek(-1)';next='stepWeek(1)';pdis=weekStart<=1;ndis=weekStart+7>30;}
  else{label=`${DOW[wd(denDay)]} ${denDay}. 6.${denDay===TODAYD?' (dnes)':''}`;prev='stepDen(-1)';next='stepDen(1)';pdis=denDay<=1;ndis=denDay>=30;}
  return `<div class="dfield">${tog}<div class="dnav"><button onclick="${prev}" ${pdis?'disabled':''} aria-label="Předchozí">‹</button><span>${label}</span><button onclick="${next}" ${ndis?'disabled':''} aria-label="Další">›</button></div></div>`;
}
/* Jedna kostra pro každý den (sjednoceno 28. 10. 2026 po UX revizi): dlaždice s počty jako
   filtry, seznam + hledání, soupis vlevo, panel vpravo. Mění se jen data a to, jestli jde den
   měnit – dřív měl jiný den úplně jinou obrazovku (bez počtů, filtrů a zaškrtávátek). */
function renderDen(){
  const d=denDay,dnes=d===TODAYD,tabs=tabsDne(d);
  if(!tabs.some(([k])=>k===tab))tab='rano';
  // počty se počítají ze stejného výběru jako soupis (celá školka, nebo seznam)
  const vSez=data.map((x,i)=>({x,i})).filter(({x,i})=>dochSeznam==='all'||veSeznamu(x,i,dochSeznam));
  const cnt={};tabs.forEach(([k])=>cnt[k]=vSez.filter(({x})=>inTabD(x,k,d)).length);
  // celkový počet („21/25") nese první dlaždice – samostatné „přítomno 21 / 25" nad seznamem ho jen opakovalo
  // dlaždice nesou barvu stavu (k-…) a rozpad přítomných uvozuje „Z přítomných" – stejně jako na přehledu
  const side=`<div class="tabs wrap doch-counts">`+tabs.map(([k,l])=>((!dnes||mode==='bezny')&&k==='poobede'?'<div class="c-cap">Z přítomných</div>':'')
    +`<button type="button" class="tab k-${k}${tab===k?' on':''}${(k==='rano'||k==='skolka')?' lead':''}${k==='neprit'&&!cnt[k]?' zero':''}" aria-pressed="${tab===k}" onclick="setTab('${k}')"><span class="num">${cnt[k]}${(k==='rano'||k==='skolka')?`<span class="num-z">/${vSez.length}</span>`:''}</span><span class="lab">${l}</span></button>`).join('')+`</div>`;
  const titul=tab==='rano'?(dnes?'Kdo dnes přišel':d<TODAYD?'Kdo přišel':'Kdo přijde'):CTX[tab][0];
  /* Jiný den: co s ním role smí, rovnou za nadpisem („Kdo přijde – jako vedoucí můžeš docházku
     naplánovat"). Zvlášť řádek „Budoucí den – …" opakoval, co říká už nadpis (designérka 28. 10. 2026). */
  const locked=!denEditovatelny(d),minuly=d<TODAYD;
  const pozn=dnes||!smiZapisovat()?''
    :locked?(minuly?'opravit ho může vedoucí průvodce':'plánuje ho vedoucí průvodce')
    :(minuly?'jako vedoucí ji můžeš opravit':'jako vedoucí můžeš docházku naplánovat');
  let main=`<div class="ctxhead"><span class="t">${titul}${pozn?`<span class="t-pozn"> – ${pozn}</span>`:''}</span></div>`;
  /* P4: seznam jako druhý filtr k dlaždici – „Absence" × „Předškoláci" odpoví na otázku
     z testování, kdo z nepřítomných je předškolák. */
  main+=`<div class="doch-filtry"><div class="dsez"><label class="pl" for="dsez">Seznam</label><select class="pin" id="dsez" onchange="setDochSeznam(this.value)">`
    +`<option value="all"${dochSeznam==='all'?' selected':''}>Všechny děti</option>`
    +SEZNAMY.map(s=>`<option value="${s.id}"${dochSeznam===s.id?' selected':''}>${s.nazev}</option>`).join('')+`</select></div>`
    +`<input class="search" id="search" placeholder="Najít dítě…" value="${esc(query)}" oninput="onSearch(this.value)"></div>`;
  // vysvětlivka: dnes k záložce (jen zapisující role); jiný den jen roli, která docházku nezapisuje
  const tip=dnes?(smiZapisovat()?(CTX[tab][1]||''):'')
    :!smiZapisovat()?'Docházku zapisuje vedoucí průvodce – tady ji jen kontroluješ.':'';
  if(tip)main+=`<div class="sectip">${tip}</div>`;
  // zvláštní den na mobilu nad soupisem (na desktopu je v panelu)
  const spec=specialKarta(d);
  if(spec)main+=`<div class="doch-spec-m">${spec}</div>`;
  main+=`<div class="rosterbox"><div id="roster">${rosterHTML(d)}</div></div>`;
  /* Panel vpravo (desktop): dnes „Dnes k řešení" (co přišlo od rodičů), v den výpravy či
     horolezení karta zvláštního dne. Klepnutí na dítě v panelu skočí na jeho řádek.
     Porce pro kuchyň tu nejsou – řeší je kuchyň (Ksenia) na svém přehledu, průvodce nezajímají
     (designérka 28. 10. 2026). Na mobilu je panel skrytý – poznámky jsou pod řádky. */
  let aside='';
  if(dnes){const sPozn=data.map((x,i)=>({x,i})).filter(({x})=>maPoznDnes(x));
    aside+=`<div class="tile doch-panel"><div class="ch">Dnes k řešení${sPozn.length?`<span class="c-badge">${sPozn.length}</span>`:''}</div>`
      +(sPozn.length?sPozn.map(({x,i})=>`<div class="dp-item"><button class="dp-who" onclick="dochUkaz(${i})">${avatar(x,24)}<span>${kratke(x)}</span><span class="dp-stav">${here(x)?'ve školce':'nepřijde'}</span></button>${poznamkyDne(x)}</div>`).join('')
        :'<div class="dp-prazdno">Od rodičů dnes nic nepřišlo.</div>')+`</div>`;}
  aside+=spec;
  return `<div class="doch-today">${side}<div class="doch-body"><div class="doch-main">${main}</div><aside class="doch-aside">${aside}</aside></div></div>`;
}
/* Zvláštní den (výprava předškoláků, horolezení) jako karta panelu: nadpis a čísla v dlaždičkách. */
function specialKarta(d){
  if(!SPECIAL[d])return '';
  const kind=SPECIAL[d], lab=kind==='pred'?'předškoláci':'lezci', name=kind==='pred'?'Výjezd předškoláků':'Horolezení';
  const pres=data.filter(c=>{const k=getCode(c,d);return k&&k!=='OM';});
  const vyp=pres.filter(c=>kind==='pred'?c.predskolak:c.lez).length;
  return `<div class="tile doch-panel doch-spec"><div class="ch">${name}</div><div class="dp-porce dp-2"><div><b>${vyp}</b><span>${lab}</span></div><div><b>${pres.length-vyp}</b><span>ve školce</span></div></div></div>`;
}
function specialBar(d){
  if(!SPECIAL[d])return '';
  const kind=SPECIAL[d], lab=kind==='pred'?'Předškoláci':'Lezci', name=kind==='pred'?'Výjezd předškoláků':'Horolezení';
  const pres=data.filter(c=>{const k=getCode(c,d);return k&&k!=='OM';});
  const trip=c=>kind==='pred'?c.predskolak:c.lez;
  const vyp=pres.filter(trip).length, skl=pres.length-vyp;
  return `<div class="specbar"><div class="spectit">Zvláštní den: ${name}</div><div class="specnums"><span><b>${skl}</b> školka ráno</span><span><b>${vyp}</b> ${lab.toLowerCase()}</span><span><b>${pres.length}</b> oběd</span></div></div>`;
}
const dlegend=`<div class="legend"><span><b style="color:${CODES.C[1]}">C</b> celodenní</span><span><b style="color:${CODES.D[1]}">D</b> dopolední</span><span><b style="color:${CODES.O[1]}">O</b> odpolední</span><span><b style="color:${CODES.OM[1]}">om</b> omluveno</span><span><b style="color:${CODES.NE[1]}">N</b> absence</span></div>`;
function renderTydenD(){
  let h=dlegend;// listování týdne je nahoře ve sloučeném poli
  h+=`<input class="search" placeholder="Najít dítě…" value="${esc(wquery)}" oninput="onWSearch(this.value)">`;
  h+=`<div class="weekbox"><table class="wt"><thead><tr><th class="who">Dítě</th>`+DAYS.map((dn,j)=>`<th class="${weekStart+j===TODAYD?'today':''}">${dn}</th>`).join('')+`</tr></thead><tbody>`;
  const tot=[0,0,0,0,0];
  data.forEach((c,ci)=>{if(wquery&&!norm(full(c)).includes(norm(wquery)))return;h+=`<tr><td class="who">${avatar(c,18)}${full(c)}</td>`;
    for(let j=0;j<5;j++){const d=weekStart+j;if(d>30){h+=`<td></td>`;continue;}const code=getCode(c,d);if(code&&code!=='OM')tot[j]++;const ed=denEditovatelny(d),today=d===TODAYD;
      h+=`<td class="${today?'today':''}${d<TODAYD?' pastc':''}${ed?' ced':''}" ${ed?`onclick="openCell(${ci},${d})"`:''}>${cellMark(code)}</td>`;}
    h+=`</tr>`;});
  h+=`</tbody><tfoot><tr><td class="who">Přítomno</td>`+tot.map((n,j)=>{const d=weekStart+j;return `<td class="${d===TODAYD?'today':''}">${d>30?'':n}</td>`;}).join('')+`</tr></tfoot></table></div>`;
  h+=`<div class="hint">${!smiZapisovat()?'Docházku zapisuje vedoucí průvodce – tady ji jen kontroluješ.':smiJinyDen()?'Jako vedoucí průvodce můžeš měnit i proběhlé a budoucí dny.':'Klepni na buňku dneška a zapiš docházku. Ostatní dny mění vedoucí průvodce.'}</div>`;
  return h;
}
function renderDenRoster(d){
  const locked=!denEditovatelny(d),minuly=d<TODAYD;
  let h=`<button class="back" onclick="closeMonthDay()">← Zpět na měsíc</button>`+specialBar(d);
  h+=`<div class="ctxhead"><span class="t">${DOW[wd(d)]} ${d}. června</span><span class="pres">přítomno <b>${presentCount(d)}</b> / ${data.length}</span></div>`;
  h+=`<div class="sectip">${!smiZapisovat()?'Docházku zapisuje vedoucí průvodce – tady ji jen kontroluješ.':locked?(minuly?'Proběhlý den – mění ho vedoucí průvodce.':'Budoucí den – plánuje ho vedoucí průvodce.'):(d===TODAYD?'Klepni na dítě a zapiš dnešní docházku.':minuly?'Proběhlý den – jako vedoucí ho můžeš opravit.':'Budoucí den – jako vedoucí můžeš docházku naplánovat.')}</div>`;
  h+=`<div class="rosterbox">`+data.map((c,ci)=>{const code=getCode(c,d);
    return `<div class="row"><div class="rmain" ${locked?'style="cursor:default"':`onclick="openCell(${ci},${d})"`}>${avatar(c,30)}<span class="nm">${full(c)}</span><span class="ind" style="margin-left:auto;font-weight:500">${codeLabel(code)}</span></div></div>`;}).join('')+`</div>`;
  return h;
}
window.setDView=v=>{view=v;open=-1;query='';monthDay=-1;if(v==='den')denDay=TODAYD;if(v==='tyden')weekStart=1;render();};
// render() přepíše obsah – fokus se vrací na prvek, který akci spustil (ovládání klávesnicí)
const vratFokus=sel=>{const e=document.querySelector(sel);if(e)e.focus({preventScroll:true});};
/* Zaškrtávátko: odškrtnuté dítě ze záložky přítomných zmizí – fokus pak dostane zaškrtávátko,
   které je na jeho místě (dá se pokračovat dalším dítětem). */
const poziceChk=i=>[...document.querySelectorAll('#roster .chk')].findIndex(e=>e.closest('.row').id==='r'+i);
const vratFokusChk=(i,pos)=>{const e=document.querySelector(`#r${i} .chk`)||document.querySelectorAll('#roster .chk')[pos]||[...document.querySelectorAll('#roster .chk')].pop();
  if(e)e.focus({preventScroll:true});};
window.setTab=k=>{tab=k;open=-1;render();vratFokus('.doch-counts .k-'+k);};
// jiný den (jen vedoucí): zaškrtávátko přepíná přítomen podle plánu ↔ absence; jemnější volba je v openCell
window.presenceD=(i,d)=>{if(!denEditovatelny(d))return;const pos=poziceChk(i);const c=data[i],k=getCode(c,d),pr=!!k&&k!=='OM';
  c.att[d]=pr?'':baseCode(c,d);render();vratFokusChk(i,pos);showToast(pr?`${full(c)} → absence`:`${full(c)} → ve školce`);};
// z panelu „Dnes k řešení": přepne na záložku, kde dítě je, rozbalí ho (kdo zapisuje) a doroluje k němu
window.dochUkaz=i=>{const c=data[i];query='';if(!inTab(c,tab))tab=here(c)?(mode==='bezny'?'rano':'skolka'):'neprit';
  open=smiZapisovat()?i:-1;render();const r=document.getElementById('r'+i);if(r)r.scrollIntoView({behavior:'smooth',block:'center'});};
window.toggle=i=>{if(!smiZapisovat())return;open=open===i?-1:i;document.getElementById('roster').innerHTML=rosterHTML();vratFokus(`#r${i} .rmain`);};
window.onSearch=v=>{query=v;document.getElementById('roster').innerHTML=rosterHTML();};
window.presence=i=>{if(!smiZapisovat())return;const pos=poziceChk(i);const c=data[i];const bylTu=here(c);c.status=bylTu?'neomluveno':'pritomen';
  render();vratFokusChk(i,pos);showToast(bylTu?`${full(c)} → absence`:`${full(c)} → ve školce`);};
window.setPlan=(i,v)=>{if(!smiZapisovat())return;data[i].plan=v;render();showToast('Docházka uložena ✓');};
window.setStatus=(i,v)=>{if(!smiZapisovat())return;const c=data[i];c.status=v;
  if(v==='pritomen')delete c.guideExcuse;   // vrácení do školky ruší i ruční omluvenku
  render();showToast('Docházka uložena ✓');};
/* Vedoucí uzavírá absenci: důvod → vznikne ruční omluvenka (vždy bez náhrady) a stav omluveno. */
window.setGuideReason=(i,v)=>{if(!smiZapisovat())return;const c=data[i];
  if(!v){delete c.guideExcuse;c.status='neomluveno';render();return;}
  c.guideExcuse={by:role==='hospodarka'?ja().n:'Táňa',time:TEDCAS,reason:v,pozn:(c.guideExcuse&&c.guideExcuse.pozn)||''};
  c.status='omluveno';render();showToast(`${kratke(c)} → omluveno bez náhrady`);};
window.setGuidePozn=(i,v)=>{const c=data[i];if(c.guideExcuse)c.guideExcuse.pozn=v;};
window.onWSearch=v=>{wquery=v;renderKeepFocus();};
window.setDochSeznam=v=>{dochSeznam=v;render();};
window.setSpi=(i,v)=>{if(!smiZapisovat())return;data[i].spi=(v==='true');render();showToast('Uloženo ✓');};
window.openMonthDay=d=>{if(isWE(d))return;denDay=d;view='den';render();};
window.closeMonthDay=()=>{monthDay=-1;render();};
window.stepDen=dir=>{let d=denDay+dir;while(d>=1&&d<=30&&isWE(d))d+=dir;if(d>=1&&d<=30)denDay=d;render();};
window.stepWeek=dir=>{let w=weekStart+dir*7;if(w<1)w=1;if(w>29)w=29;weekStart=w;render();};
