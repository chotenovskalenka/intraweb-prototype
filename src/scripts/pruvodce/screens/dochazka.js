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
  if(t==='odpoledni')return here(c)&&c.plan==='odpolední';
  if(t==='neprit')return !here(c);
};
/* Pojmenování stavů drží jeden slovník napříč appkou: přítomni · dopolední · odpolední · absence.
   „Ráno" bylo matoucí (číslo platí celý den, ne jen ráno) a „Po obědě" popisovalo důsledek
   místo režimu docházky. Viz docs/vyzkum-testovani-pruvodci.md, P2.
   Záložka „Spí" zůstává – spáči v maringotce jsou provozní fakt, ne režim docházky. */
const TABS_BEZNY=[['rano','Přítomni'],['spi','Spí'],['poobede','Dopolední'],['odpoledni','Odpolední'],['neprit','Absence']];
const TABS_SPEC=g=>[['skolka','Školka ráno'],['vyprava',g],['obed','Oběd'],['spi','Spí'],['neprit','Absence']];
const TABS_BY=()=>mode==='bezny'?TABS_BEZNY:TABS_SPEC(mode==='pred'?'Předškoláci':'Lezci');
const CTX={rano:['Kdo dnes přišel',''],
  skolka:['Ráno ve školce',''],
  vyprava:['Na výpravě',''],
  obed:['Oběd – všichni',''],
  spi:['Maringotka · spáči','Zaškrtnuté dítě je ve školce. Odškrtnutím ho zapíšeš jako absenci – zaškrtnutím ho vrátíš zpět.'],
  poobede:['Dopolední docházka','Tyhle děti odcházejí po obědě.'],
  odpoledni:['Odpolední docházka','Tyhle děti přicházejí až po obědě.'],
  neprit:['Absence','']};
function counts(){const o={};TABS_BY().forEach(([k])=>o[k]=data.filter(c=>inTab(c,k)).length);o.pres=data.filter(here).length;return o;}
function planPill(c){return c.plan==='celodenní'?'<span class="pill p-cel">celodenní</span>':c.plan==='dopolední'?'<span class="pill p-dop">dopolední</span>':'<span class="pill p-odp">odpolední</span>';}
function cellMark(code){if(!code)return '<span class="wc c-N">N</span>';if(code==='OM')return '<span class="bdg al" style="font-size:9px">om</span>';return `<span class="wc c-${code}">${code}</span>`;}
function codeLabel(code){const M={C:['celodenní',CODES.C[1]],D:['dopolední',CODES.D[1]],O:['odpolední',CODES.O[1]],OM:['omluveno',CODES.OM[1]]};const m=M[code];return m?`<span style="color:${m[1]}">${m[0]}</span>`:'<span style="color:var(--color-text-hint)">absence</span>';}
/* Stav dítěte (spí / omluveno / na výpravě…). Sedí hned za chipem docházky – u pravého
   okraje vedle zaškrtávátka to čtlo, jako by se odškrtávalo zrovna „spí" nebo „omluveno".
   Proto ind-inline: ruší margin-left:auto, kterým se .ind jinde tlačí doprava. */
function indicator(c){
  const cls='ind ind-inline';
  if(here(c)&&onTrip(c))return`<span class="${cls} awake" style="color:var(--color-accent-ink)">na výpravě</span>`;
  if(c.status==='omluveno')return`<span class="${cls} off">omluveno</span>`;
  if(c.status==='neomluveno')return`<span class="${cls} off">neomluveno</span>`;
  if(c.plan==='dopolední')return`<span class="${cls}">po obědě domů</span>`;
  return c.spi?`<span class="${cls} sleep">spí</span>`:`<span class="${cls} awake">nespí</span>`;
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
  if(c.parentExcuse)h+=`<div class="field"><div class="l">Omluvenka od rodiče</div><div class="pnote">${c.parentExcuse.time} · ${c.parentExcuse.reason}${c.parentExcuse.pozn?`<div class="pn-pozn">${esc(c.parentExcuse.pozn)}</div>`:''}</div></div>`;
  {const zpr=(c.zpravy||[]).filter(z=>z.den===TODAYD);
   if(zpr.length)h+=`<div class="field"><div class="l">Vzkazy od rodičů dnes</div>`
     +zpr.map(z=>`<div class="pnote">${zpravaShrnuti(z)}<div class="pn-pozn">odesláno ${z.odeslano}</div></div>`).join('')+`</div>`;}
  if(c.note)h+=`<div class="field"><div class="l">Poznámka od rodiče</div><div class="pnote">${c.note}</div></div>`;
  if(staysPM(c))h+=`<div class="field"><div class="l">Odpoledne</div><div class="mini">${seg([[true,'Spí'],[false,'Nespí']],c.spi,'setSpi')}</div></div>`;
  return h;
}
function rosterHTML(){
  let out='',shown=0;
  // nahoru děti, u kterých je dnes co číst (vzkaz, poznámka z omluvenky, trvalá poznámka)
  const maPozn=c=>(c.note||(c.parentExcuse&&c.parentExcuse.pozn)||(c.zpravy||[]).some(z=>z.den===TODAYD))?0:1;
  const lst=data.map((c,i)=>({c,i})).sort((a,b)=>{const an=maPozn(a.c),bn=maPozn(b.c);if(an!==bn)return an-bn;return byAlpha(a,b);});
  lst.forEach(({c,i})=>{
    const match=query?norm(full(c)).includes(norm(query)):inTab(c,tab);
    if(!match)return;shown++;
    /* Všechno, co dnes přišlo od rodiče, na jednom místě u dítěte: vzkazy z rodičovské appky
       (kdo vyzvedne, pozdější příchod, lék), volný text z omluvenky a trvalá poznámka.
       Vzkazy jsou provozní (neutrální), poznámka a omluvenka nesou zdravotní/absenční
       kontext – proto zůstávají v danger tónu .rnote. */
    // dlouhý vzkaz se krátí stejně jako na přehledu – jinak jeden odstavec odtlačí
    // pod okraj obrazovky celý zbytek soupisu
    let noteLine=(c.zpravy||[]).filter(z=>z.den===TODAYD).map(z=>{
      const dlouhy=(z.text||'').length>ZP_DELKA, rozbalen=zpRozbalene.has(z.id);
      return `<div class="rnote rnote-info"><span class="${dlouhy&&!rozbalen?'zp-clamp':''}">${zpravaShrnuti(z)}</span> <span class="rn-cas">${z.odeslano}</span>`
        +(dlouhy?`<button class="zp-vic" onclick="event.stopPropagation();zpToggle('${z.id}')">${rozbalen?'zkrátit ›':'celý vzkaz ›'}</button>`:'')+`</div>`;
    }).join('');
    /* Poznámku z omluvenky uvozuje důvod, který rodič vybral (nemoc / rodinné důvody / jiné) –
       „K omluvence" nic neříkalo, přitom příznak omluvenka nese a na řádku jinak není vidět. */
    if(c.parentExcuse&&c.parentExcuse.pozn){const d=c.parentExcuse.reason||'omluvenka';
      noteLine+=`<div class="rnote"><b>${d.charAt(0).toUpperCase()+d.slice(1)}</b> · ${esc(c.parentExcuse.pozn)} <span class="rn-cas">${c.parentExcuse.time}</span></div>`;}
    if(c.guideExcuse)noteLine+=`<div class="rnote">${guideExcuseDetail(c)}</div>`;
    if(c.note)noteLine+=`<div class="rnote">${c.note}</div>`;
    // řadový průvodce docházku jen čte – žádné zaškrtávátko, řádek se nerozklikává (Z1)
    const zapis=smiZapisovat();
    const chk=zapis
      ? `<span class="chk ${here(c)?'on':''}" role="checkbox" aria-checked="${here(c)}" aria-label="${full(c)} je ve školce" title="${here(c)?'Je ve školce – odškrtnutím zapíšeš absenci':'Zapsáno jako absence – zaškrtnutím vrátíš do školky'}" onclick="event.stopPropagation();presence(${i})">${here(c)?'✓':''}</span>`
      : `<span class="ind ${here(c)?'awake':'off'}" style="margin-left:auto">${here(c)?'ve školce':'absence'}</span>`;
    out+=`<div class="row${c.status!=='pritomen'?' absent':''}${open===i?' open':''}"><div class="rmain"${zapis?` onclick="toggle(${i})"`:' style="cursor:default"'}>`+
      `${avatar(c,30)}<span class="nm">${full(c)}</span>${planPill(c)}${indicator(c)}`+
      chk+`</div>`+
      noteLine+
      `<div class="edit" style="display:${open===i&&zapis?'block':'none'}">${open===i&&zapis?editPanel(c,i):''}</div></div>`;
  });
  if(!shown)out='<div class="empty">'+(tab==='neprit'?'Všichni dorazili. Všichni jsme Vhaaji.':(query?'Nic nenalezeno.':'Nic tu není.'))+'</div>';
  return out;
}
function renderDochazka(){
  // Desktop: hlavička (nadpis + sloučené pole datum+Den/Týden) + dva panely (styl Přehledu). Mobil: stoh.
  // Měsíc záměrně jen v rodičovské/admin appce (přehled, hromadné omluvy, statistiky) – průvodce řeší den a týden.
  let h=`<div class="doch">${renderDochNav()}`;
  h+=(view==='tyden')?renderTydenD():renderDen();
  return h+`</div>`;
}
// Sloučené pole: přepínač Den/Týden + listování data (den nebo týdenní rozsah) v jednom.
function renderDochNav(){
  const tog=`<div class="switch dsw">`+[['den','Den'],['tyden','Týden']].map(v=>`<button class="${view===v[0]?'on':''}" onclick="setDView('${v[0]}')">${v[1]}</button>`).join('')+`</div>`;
  let label,prev,next,pdis,ndis;
  if(view==='tyden'){label=`${weekStart}.–${Math.min(weekStart+4,30)}. 6.`;prev='stepWeek(-1)';next='stepWeek(1)';pdis=weekStart<=1;ndis=weekStart+7>30;}
  else{label=`${DOW[wd(denDay)]} ${denDay}. 6.${denDay===TODAYD?' · dnes':''}`;prev='stepDen(-1)';next='stepDen(1)';pdis=denDay<=1;ndis=denDay>=30;}
  return `<div class="dfield">${tog}<div class="dnav"><button onclick="${prev}" ${pdis?'disabled':''} aria-label="Předchozí">‹</button><span>${label}</span><button onclick="${next}" ${ndis?'disabled':''} aria-label="Další">›</button></div></div>`;
}
function renderDen(){return denDay===TODAYD?todayRoster():dayRoster(denDay);}
function todayRoster(){
  const c=counts();
  // počty (zároveň filtry) – vodorovná řada nad seznamem; listování dne je nahoře ve sloučeném poli
  let side=`<div class="tabs wrap doch-counts">`+TABS_BY().map(([k,l])=>`<div class="tab${tab===k?' on':''}${(k==='rano'||k==='skolka')?' lead':''}" onclick="setTab('${k}')"><div class="num">${c[k]}</div><div class="lab">${l}</div></div>`).join('')+`</div>`;
  // pod řadou: kontext + hledání + roster + souhrn jídel na plnou šířku
  let main=`<div class="ctxhead"><span class="t">${CTX[tab][0]}</span><span class="pres">přítomno <b>${c.pres}</b> / ${data.length}</span></div>`;
  main+=`<div class="sectip">${smiZapisovat()?(CTX[tab][1]||''):'Docházku zapisuje vedoucí průvodce – tady ji jen kontroluješ.'}</div>`;
  main+=`<input class="search" id="search" placeholder="Najít dítě…" value="${esc(query)}" oninput="onSearch(this.value)">`;
  main+=`<div class="rosterbox"><div id="roster">${rosterHTML()}</div></div>`;
  main+=`<div class="doch-mealsfoot"><span class="meals">Obědy <b>${c.pres}</b> · svačiny <b>${c.pres}</b></span><span class="pwa">nainstalovatelné · offline (PWA)</span></div>`;
  return `<div class="doch-today">${side}<div class="doch-main">${main}</div></div>`;
}
function specialBar(d){
  if(!SPECIAL[d])return '';
  const kind=SPECIAL[d], lab=kind==='pred'?'Předškoláci':'Lezci', name=kind==='pred'?'Výjezd předškoláků':'Horolezení';
  const pres=data.filter(c=>{const k=getCode(c,d);return k&&k!=='OM';});
  const trip=c=>kind==='pred'?c.predskolak:c.lez;
  const vyp=pres.filter(trip).length, skl=pres.length-vyp;
  return `<div class="specbar"><div class="spectit">Zvláštní den · ${name}</div><div class="specnums"><span><b>${skl}</b> školka ráno</span><span><b>${vyp}</b> ${lab.toLowerCase()}</span><span><b>${pres.length}</b> oběd</span></div></div>`;
}
function dayRoster(d){
  // dnešek zapisuje každý; proběhlý i budoucí den mění jen vedoucí průvodce
  const locked=!denEditovatelny(d);
  const jiny=d!==TODAYD&&smiJinyDen();
  const minuly=d<TODAYD;
  // levý panel: zvláštní den + souhrn; pravý: roster dne (listování dne je nahoře ve sloučeném poli)
  let side=specialBar(d);
  side+=`<div class="tile doch-info"><div class="np"><span>Přítomno</span><b>${presentCount(d)} / ${data.length}</b></div><div class="pwa" style="margin-top:6px">${locked?(minuly?'Proběhlý den – mění ho vedoucí průvodce.':'Budoucí den – plánuje ho vedoucí průvodce.'):jiny?(minuly?'Proběhlý den – zpětná oprava.':'Budoucí den – plánování.'):(smiZapisovat()?'Dnešek – zapisuješ docházku.':'Dnešek – jen ke čtení.')}</div></div>`;
  let main=`<div class="ctxhead"><span class="t">Docházka dne</span><span class="pres">přítomno <b>${presentCount(d)}</b> / ${data.length}</span></div>`;
  main+=`<div class="sectip">${!smiZapisovat()?'Docházku zapisuje vedoucí průvodce – tady ji jen kontroluješ.':locked?(minuly?'Proběhlý den – jen ke čtení. Opravit ho může vedoucí průvodce.':'Budoucí den – jen ke čtení. Plánuje ho vedoucí průvodce.'):jiny?(minuly?'Proběhlý den – jako vedoucí ho můžeš opravit.':'Budoucí den – jako vedoucí můžeš docházku naplánovat.'):'Klepni na dítě a zapiš dnešní docházku.'}</div>`;
  main+=`<div class="rosterbox">`+data.map((c,ci)=>{const code=getCode(c,d);return `<div class="row"><div class="rmain" ${locked?'style="cursor:default"':`onclick="openCell(${ci},${d})"`}>${avatar(c,30)}<span class="nm">${full(c)}</span><span class="ind" style="margin-left:auto;font-weight:500">${codeLabel(code)}</span></div></div>`;}).join('')+`</div>`;
  return `<div class="doch-den"><aside class="doch-side">${side}</aside><div class="doch-main">${main}</div></div>`;
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
window.setTab=k=>{tab=k;open=-1;render();};
window.toggle=i=>{if(!smiZapisovat())return;open=open===i?-1:i;document.getElementById('roster').innerHTML=rosterHTML();};
window.onSearch=v=>{query=v;document.getElementById('roster').innerHTML=rosterHTML();};
window.presence=i=>{if(!smiZapisovat())return;const c=data[i];const bylTu=here(c);c.status=bylTu?'neomluveno':'pritomen';
  render();showToast(bylTu?`${full(c)} → absence`:`${full(c)} → ve školce`);};
window.setPlan=(i,v)=>{if(!smiZapisovat())return;data[i].plan=v;render();showToast('Docházka uložena ✓');};
window.setStatus=(i,v)=>{if(!smiZapisovat())return;const c=data[i];c.status=v;
  if(v==='pritomen')delete c.guideExcuse;   // vrácení do školky ruší i ruční omluvenku
  render();showToast('Docházka uložena ✓');};
/* Vedoucí uzavírá absenci: důvod → vznikne ruční omluvenka (vždy bez náhrady) a stav omluveno. */
window.setGuideReason=(i,v)=>{if(!smiZapisovat())return;const c=data[i];
  if(!v){delete c.guideExcuse;c.status='neomluveno';render();return;}
  c.guideExcuse={by:role==='hospodarka'?'Míša':'Táňa',time:TEDCAS,reason:v,pozn:(c.guideExcuse&&c.guideExcuse.pozn)||''};
  c.status='omluveno';render();showToast(`${kratke(c)} → omluveno bez náhrady`);};
window.setGuidePozn=(i,v)=>{const c=data[i];if(c.guideExcuse)c.guideExcuse.pozn=v;};
window.onWSearch=v=>{wquery=v;renderKeepFocus();};
window.setSpi=(i,v)=>{if(!smiZapisovat())return;data[i].spi=(v==='true');render();showToast('Uloženo ✓');};
window.openMonthDay=d=>{if(isWE(d))return;denDay=d;view='den';render();};
window.closeMonthDay=()=>{monthDay=-1;render();};
window.stepDen=dir=>{let d=denDay+dir;while(d>=1&&d<=30&&isWE(d))d+=dir;if(d>=1&&d<=30)denDay=d;render();};
window.stepWeek=dir=>{let w=weekStart+dir*7;if(w<1)w=1;if(w>29)w=29;weekStart=w;render();};
