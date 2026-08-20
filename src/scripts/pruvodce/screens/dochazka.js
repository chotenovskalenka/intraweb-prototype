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
  if(t==='neprit')return !here(c);
};
const TABS_BEZNY=[['rano','Ráno'],['spi','Spí'],['poobede','Po obědě'],['neprit','Nepřítomní']];
const TABS_SPEC=g=>[['skolka','Školka ráno'],['vyprava',g],['obed','Oběd'],['spi','Spí'],['neprit','Nepřítomní']];
const TABS_BY=()=>mode==='bezny'?TABS_BEZNY:TABS_SPEC(mode==='pred'?'Předškoláci':'Lezci');
const CTX={rano:['Kdo dnes přišel',''],
  skolka:['Ráno ve školce',''],
  vyprava:['Na výpravě',''],
  obed:['Oběd – všichni',''],
  spi:['Maringotka · spáči',''],
  poobede:['Po obědě domů','Dopolední děti – odcházejí po obědě.'],
  neprit:['Nepřítomní','']};
function counts(){const o={};TABS_BY().forEach(([k])=>o[k]=data.filter(c=>inTab(c,k)).length);o.pres=data.filter(here).length;return o;}
function planPill(c){return c.plan==='celodenní'?'<span class="pill p-cel">celodenní</span>':c.plan==='dopolední'?'<span class="pill p-dop">dopolední</span>':'<span class="pill p-odp">odpolední</span>';}
function cellMark(code){if(!code)return '<span class="wc c-N">N</span>';if(code==='OM')return '<span class="bdg al" style="font-size:9px">om</span>';return `<span class="wc c-${code}">${code}</span>`;}
function codeLabel(code){const M={C:['celodenní',CODES.C[1]],D:['dopolední',CODES.D[1]],O:['odpolední',CODES.O[1]],OM:['omluven',CODES.OM[1]]};const m=M[code];return m?`<span style="color:${m[1]}">${m[0]}</span>`:'<span style="color:var(--color-text-hint)">nepřítomen</span>';}
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
  h+=`<div class="field"><div class="l">Stav</div><div class="mini warn">${seg([['pritomen','Přítomen'],['omluveno','Omluveno'],['neomluveno','Neomluveno']],c.status,'setStatus')}</div></div>`;
  if(c.parentExcuse)h+=`<div class="field"><div class="l">Omluvenka od rodiče</div><div class="pnote">${c.parentExcuse.time} · ${c.parentExcuse.reason}</div></div>`;
  if(c.note)h+=`<div class="field"><div class="l">Poznámka od rodiče</div><div class="pnote">${c.note}</div></div>`;
  if(staysPM(c))h+=`<div class="field"><div class="l">Odpoledne</div><div class="mini">${seg([[true,'Spí'],[false,'Nespí']],c.spi,'setSpi')}</div></div>`;
  return h;
}
function rosterHTML(){
  let out='',shown=0;
  const lst=data.map((c,i)=>({c,i})).sort((a,b)=>{const an=a.c.note?0:1,bn=b.c.note?0:1;if(an!==bn)return an-bn;return byAlpha(a,b);});
  lst.forEach(({c,i})=>{
    const match=query?norm(full(c)).includes(norm(query)):inTab(c,tab);
    if(!match)return;shown++;
    const noteLine=c.note?`<div class="rnote">✉️ ${c.note}</div>`:'';
    out+=`<div class="row${c.status!=='pritomen'?' absent':''}${open===i?' open':''}"><div class="rmain" onclick="toggle(${i})">`+
      `${avatar(c,30)}<span class="nm">${full(c)}</span>${planPill(c)}${indicator(c)}`+
      `<span class="chk ${here(c)?'on':''}" onclick="event.stopPropagation();presence(${i})">${here(c)?'✓':''}</span></div>`+
      noteLine+
      `<div class="edit" style="display:${open===i?'block':'none'}">${open===i?editPanel(c,i):''}</div></div>`;
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
  main+=`<div class="sectip">${CTX[tab][1]||''}</div>`;
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
  // proběhlý den smí opravit jen vedoucí průvodce – ostatní ho mají jen ke čtení
  const locked=d<TODAYD&&!smiZpetne();
  const zpetne=d<TODAYD&&smiZpetne();
  // levý panel: zvláštní den + souhrn; pravý: roster dne (listování dne je nahoře ve sloučeném poli)
  let side=specialBar(d);
  side+=`<div class="tile doch-info"><div class="np"><span>Přítomno</span><b>${presentCount(d)} / ${data.length}</b></div><div class="pwa" style="margin-top:6px">${locked?'Proběhlý den – opravit ho může vedoucí průvodce.':zpetne?'Proběhlý den – zpětná oprava.':'Budoucí den – editovatelný.'}</div></div>`;
  let main=`<div class="ctxhead"><span class="t">Docházka dne</span><span class="pres">přítomno <b>${presentCount(d)}</b> / ${data.length}</span></div>`;
  main+=`<div class="sectip">${locked?'Proběhlý den – jen ke čtení. Opravit ho může vedoucí průvodce.':zpetne?'Proběhlý den – jako vedoucí ho můžeš zpětně opravit.':'Klepni na dítě a nastav docházku na tento den.'}</div>`;
  main+=`<div class="rosterbox">`+data.map((c,ci)=>{const code=getCode(c,d);return `<div class="row"><div class="rmain" ${locked?'style="cursor:default"':`onclick="openCell(${ci},${d})"`}>${avatar(c,30)}<span class="nm">${full(c)}</span><span class="ind" style="margin-left:auto;font-weight:500">${codeLabel(code)}</span></div></div>`;}).join('')+`</div>`;
  return `<div class="doch-den"><aside class="doch-side">${side}</aside><div class="doch-main">${main}</div></div>`;
}
const dlegend=`<div class="legend"><span><b style="color:${CODES.C[1]}">C</b> celodenní</span><span><b style="color:${CODES.D[1]}">D</b> dopolední</span><span><b style="color:${CODES.O[1]}">O</b> odpolední</span><span><b style="color:${CODES.OM[1]}">om</b> omluven</span><span><b style="color:${CODES.NE[1]}">N</b> nepřítomen</span></div>`;
function renderTydenD(){
  let h=dlegend;// listování týdne je nahoře ve sloučeném poli
  h+=`<input class="search" placeholder="Najít dítě…" value="${esc(wquery)}" oninput="onWSearch(this.value)">`;
  h+=`<div class="weekbox"><table class="wt"><thead><tr><th class="who">Dítě</th>`+DAYS.map((dn,j)=>`<th class="${weekStart+j===TODAYD?'today':''}">${dn}</th>`).join('')+`</tr></thead><tbody>`;
  const tot=[0,0,0,0,0];
  data.forEach((c,ci)=>{if(wquery&&!norm(full(c)).includes(norm(wquery)))return;h+=`<tr><td class="who">${avatar(c,18)}${full(c)}</td>`;
    for(let j=0;j<5;j++){const d=weekStart+j;if(d>30){h+=`<td></td>`;continue;}const code=getCode(c,d);if(code&&code!=='OM')tot[j]++;const ed=d>=TODAYD||smiZpetne(),today=d===TODAYD;
      h+=`<td class="${today?'today':''}${d<TODAYD?' pastc':''}${ed?' ced':''}" ${ed?`onclick="openCell(${ci},${d})"`:''}>${cellMark(code)}</td>`;}
    h+=`</tr>`;});
  h+=`</tbody><tfoot><tr><td class="who">Přítomno</td>`+tot.map((n,j)=>{const d=weekStart+j;return `<td class="${d===TODAYD?'today':''}">${d>30?'':n}</td>`;}).join('')+`</tr></tfoot></table></div>`;
  h+=`<div class="hint">${smiZpetne()?'Jako vedoucí průvodce můžeš opravit i uzavřené dny.':'Klepni na buňku dneška nebo budoucího dne a změň docházku. Minulé dny jsou uzavřené.'}</div>`;
  return h;
}
function renderDenRoster(d){
  const locked=d<=TODAYD&&!(d<TODAYD&&smiZpetne());
  let h=`<button class="back" onclick="closeMonthDay()">← Zpět na měsíc</button>`+specialBar(d);
  h+=`<div class="ctxhead"><span class="t">${DOW[wd(d)]} ${d}. června</span><span class="pres">přítomno <b>${presentCount(d)}</b> / ${data.length}</span></div>`;
  h+=`<div class="sectip">${locked?'Tento den už nelze měnit (uzávěrka). Opravit ho může vedoucí průvodce.':(d<TODAYD?'Uzavřený den – jako vedoucí ho můžeš zpětně opravit.':'Klepni na dítě a nastav docházku na tento den.')}</div>`;
  h+=`<div class="rosterbox">`+data.map((c,ci)=>{const code=getCode(c,d);
    return `<div class="row"><div class="rmain" ${locked?'style="cursor:default"':`onclick="openCell(${ci},${d})"`}>${avatar(c,30)}<span class="nm">${full(c)}</span><span class="ind" style="margin-left:auto;font-weight:500">${codeLabel(code)}</span></div></div>`;}).join('')+`</div>`;
  return h;
}
window.setDView=v=>{view=v;open=-1;query='';monthDay=-1;if(v==='den')denDay=TODAYD;if(v==='tyden')weekStart=1;render();};
window.setTab=k=>{tab=k;open=-1;render();};
window.toggle=i=>{open=open===i?-1:i;document.getElementById('roster').innerHTML=rosterHTML();};
window.onSearch=v=>{query=v;document.getElementById('roster').innerHTML=rosterHTML();};
window.presence=i=>{data[i].status=here(data[i])?'neomluveno':'pritomen';render();showToast('Docházka uložena ✓');};
window.setPlan=(i,v)=>{data[i].plan=v;render();showToast('Docházka uložena ✓');};
window.setStatus=(i,v)=>{data[i].status=v;render();showToast('Docházka uložena ✓');};
window.onWSearch=v=>{wquery=v;renderKeepFocus();};
window.setSpi=(i,v)=>{data[i].spi=(v==='true');render();showToast('Uloženo ✓');};
window.openMonthDay=d=>{if(isWE(d))return;denDay=d;view='den';render();};
window.closeMonthDay=()=>{monthDay=-1;render();};
window.stepDen=dir=>{let d=denDay+dir;while(d>=1&&d<=30&&isWE(d))d+=dir;if(d>=1&&d<=30)denDay=d;render();};
window.stepWeek=dir=>{let w=weekStart+dir*7;if(w<1)w=1;if(w>29)w=29;weekStart=w;render();};
