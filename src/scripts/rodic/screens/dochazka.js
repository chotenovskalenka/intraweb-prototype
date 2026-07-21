/* SCREEN: RODIC_DOCHAZKA */
let bulkCode=null; // vybraný kód pro hromadné uložení (aplikuje se až tlačítkem Uložit)
let dayModal=null; // den otevřený v modalu docházky/omluvy (null = zavřeno)
function editor(d){const c=cur();
  const dr=draft[d]||{};
  const cd=dr.code!==undefined?dr.code:code(c,d);
  const note=dr.note!==undefined?dr.note:(c.notes[d]||'');
  const dirty=dr.code!==undefined||dr.note!==undefined||dr.obed!==undefined;
  if(!editable(d)){
    const isNE=cd==='NE';
    let h=`<div class="lockwrap"><span class="chip" style="background:${CODES[code(c,d)][2]};color:${CODES[code(c,d)][1]}">${CODES[code(c,d)][0]}</span><div class="lockmsg">🔒 Změna byla možná do 20:00 předchozího dne, nyní je možné pouze neomluveno.</div>`;
    if(d===TODAY){
      h+=`<div class="choices"><button class="abs ${isNE?'on':''}" onclick="draftCode(${d},'NE')">Neomluveno</button></div>`;
      if(isNE){
        const ob=dr.obed!==undefined?dr.obed:(c.obed&&c.obed[d]);
        h+=`<div class="notelab">Vyzvednete si oběd?</div><div class="choices"><button class="${ob===true?'on':''}" onclick="draftObed(${d},true)">Ano</button><button class="${ob===false?'on':''}" onclick="draftObed(${d},false)">Ne</button></div>`;
        h+=`<div class="notelab">Důvod absence – nepovinné</div><textarea class="note" placeholder="např. nemoc, rodinný důvod…" oninput="draftNote(${d},this.value)">${note}</textarea>`;
      }
      if(dirty)h+=`<button class="savebtn" onclick="saveDay(${d})">Uložit</button>`;
    }
    return h+'</div>';
  }
  const OPTS=[['D','Dopolední'],['O','Odpolední'],['C','Celodenní'],['OM','Omluvit']];
  let h='<div class="choices">'+OPTS.map(([k,l])=>{const abs=(k==='OM');
    return `<button class="${cd===k?'on':''}${abs?' abs':''}" onclick="draftCode(${d},'${k}')">${l}</button>`;}).join('')+'</div>';
  if(cd==='OM'){h+=`<div class="notelab">Důvod absence – nepovinné</div><textarea class="note" placeholder="např. nemoc, rodinný důvod…" oninput="draftNote(${d},this.value)">${note}</textarea>`;}
  h+=`<button class="savebtn${dirty?'':' dis'}" ${dirty?'':'disabled'} onclick="saveDay(${d})">Uložit</button>`;
  return h;}
function bulkControls(){
  if(!bulk)return `<button class="bulktoggle" onclick="toggleBulk()">Nastavit více dní najednou</button>`;
  let h=`<div class="bulkbar"><div class="top"><span>Hromadné nastavení</span><button class="linkbtn" onclick="toggleBulk()">Hotovo</button></div><div class="bulkactions"><button onclick="selectAll()">Vybrat všechny dny</button><button onclick="clearSel()">Zrušit výběr</button></div>`;
  if(selSet.size){
    h+=`<div class="selinfo">Vybráno: ${selSet.size} ${plural(selSet.size)} – nastavit na:</div>`;
    h+=`<div class="choices">`+[['D','Dopolední'],['O','Odpolední'],['C','Celodenní'],['OM','Omluvit']].map(([k,l])=>{const abs=(k==='OM');return `<button class="${bulkCode===k?'on':''}${abs?' abs':''}" onclick="pickBulkCode('${k}')">${l}</button>`;}).join('')+`</div>`;
    h+=`<button class="savebtn${bulkCode?'':' dis'}" ${bulkCode?'':'disabled'} onclick="saveBulk()">Uložit ${selSet.size} ${plural(selSet.size)}</button>`;
  }
  return h+'</div>';}
function renderDen(){const c=cur();return `<div class="vhead">Denní přehled</div><button class="daycard daycard-btn" onclick="pick(${TODAY})"><div class="dt"><span class="wd">Středa 3. června</span>${chip(code(c,TODAY))}</div><div class="dm-open">Upravit docházku / omluvit ›</div></button>`;}
function renderTyden(){
  const wend=Math.min(weekStart+4,30);
  let h=`<div class="vhead vhrow"><span>Týdenní přehled</span><div class="dh-nav"><button class="dh-step" onclick="stepWeek(-1)" ${weekStart<=1?'disabled':''} aria-label="Předchozí týden">‹</button><span class="dh-lbl">${weekStart}.–${wend}. 6.</span><button class="dh-step" onclick="stepWeek(1)" ${weekStart+7>30?'disabled':''} aria-label="Další týden">›</button></div></div>`;
  h+=bulkControls();
  for(let i=0;i<5;i++){const d=weekStart+i;if(d>30)break;const cd=code(cur(),d);const bs=bulk&&selSet.has(d);
    h+=`<div class="wkrow${d===TODAY?' today':''}${!editable(d)?' locked':''}${bs?' bsel':''}"><div class="wkmain" onclick="pick(${d})">`+(bulk?`<span class="bchk ${selSet.has(d)?'on':''}"></span>`:'')+`<span class="d">${DOW[wd(d)]} <span>${d}. 6.</span></span><span class="cur">${!editable(d)?'<span class="lockflag">🔒 uzavřeno</span>':''}${chip(cd)}</span></div></div>`;}
  return h;}
function renderMesic(){let h=`<div class="vhead vhrow"><span>Měsíční přehled</span><div class="dh-nav"><button class="dh-step" onclick="stepMonth(-1)" aria-label="Předchozí měsíc">‹</button><span class="dh-lbl">Červen 2026</span><button class="dh-step" onclick="stepMonth(1)" aria-label="Další měsíc">›</button></div></div>`+bulkControls()+'<div class="cal">';
  DOW.forEach(x=>h+=`<div class="h">${x}</div>`);
  for(let d=1;d<=30;d++){if(isWE(d)){h+=`<div class="cell we"><span class="dnum">${d}</span></div>`;continue;}const cd=code(cur(),d),s=bulk?selSet.has(d):sel===d;
    h+=`<div class="cell${d===TODAY?' today':''}${!editable(d)?' lock':''}${s?' sel':''}" onclick="pick(${d})"><span class="dnum">${d}</span><span class="mk" style="color:${CODES[cd][1]}">${CODES[cd][0].toLowerCase()}</span></div>`;}
  h+='</div>';
  return h;}
// Modal docházky/omluvy pro vybraný den (editor je uvnitř). Otevírá se z kalendáře přes pick(d).
function renderDayModal(){
  const d=dayModal, c=cur();
  let h=`<div class="modal-scrim" onclick="closeDayModal()"><div class="modal" onclick="event.stopPropagation()">`;
  h+=`<h3>Docházka a omluva</h3><div class="abs-sub">${c.n} · ${DOWFULL[wd(d)]} ${d}. 6.</div>`;
  h+=`<div class="dm-editor">${editor(d)}</div>`;
  h+=`<div class="mbtns"><button class="btn-ghost" onclick="closeDayModal()">Zavřít</button></div>`;
  return h+`</div></div>`;}
function nahRow(n){
  // bez stavů a bez expirace – jen původ + kdy náhrada vznikla
  return `<div class="nahrow"><div class="nahL"><div class="naho">${n.puvod}</div><div class="nahv">vznik ${n.vznik}</div></div></div>`;
}
function renderNahrady(c){
  const av=dostupne(c);
  let h=`<div class="tile"><div class="ch">Dostupné náhrady</div><div class="nahbig">${av}</div>`;
  h+=`<div class="nahsub2">Náhradu lze vyčerpat i na příměstský tábor. Vzniká za každý včas omluvený den.</div>`;
  const avail=c.nahrady.filter(n=>n.stav==='dostupna');
  h+=avail.length?avail.map(nahRow).join(''):'<div class="empty">Zatím žádné náhrady. Vzniknou za každý včas omluvený den.</div>';
  return h+`</div>`;
}
function renderOmluvenky(c){
  let h=`<div class="tile"><div class="ch">Omluvenky</div>`;
  if(!c.omluvenky.length)return h+'<div class="empty">Zatím žádné omluvenky. Dítě omluvíte výběrem dne v kalendáři.</div></div>';
  c.omluvenky.forEach(o=>{
    const canCancel=o.od>NOW.d&&o.stav!=='zrusena';
    h+=`<div class="omrow"><div class="omL"><div class="omo">${fmtRange(o.od,o.do)}</div><div class="omv">${DUVODLAB[o.duvod]||o.duvod}${o.pozn?' · '+escTa(o.pozn):''}</div></div><span class="bdg om-${o.stav}">${OMLAB[o.stav]}</span>${canCancel?`<button class="omx" onclick="omCancel('${o.id}')">Zrušit</button>`:''}</div>`;
  });
  return h+`</div>`;
}
function renderDochazka(){
  const c=cur();
  // Desktop: velký nadpis + dva sloupce – vlevo kalendář docházky, vpravo náhrady/omluvenky. Mobil: stoh.
  // Omlouvání probíhá přímo v kalendáři (výběr dne/týdne/měsíce → omluva); samostatné tlačítko zrušeno.
  let h=`<div class="doch">`;
  h+=`<div class="doch-den">`;
  h+=`<div class="doch-main"><div class="ch">Kalendář docházky</div>`;
  h+=`<div class="switch">`+[['den','Den'],['tyden','Týden'],['mesic','Měsíc']].map(v=>`<button class="${view===v[0]?'on':''}" onclick="setView('${v[0]}')">${v[1]}</button>`).join('')+`</div>`;
  h+=view==='den'?renderDen():view==='tyden'?renderTyden():renderMesic();
  h+=`</div>`;
  h+=`<aside class="doch-side">${renderNahrady(c)}${renderOmluvenky(c)}</aside>`;
  h+=`</div></div>`;
  return h;
}
window.goEditDay=d=>{section='dochazka';if(d<=5){view='tyden';}else{view='mesic';}sel=d;overlay=null;drawerOpen=false;render();};
window.setView=v=>{view=v;sel=(v==='den')?TODAY:sel;bulk=false;selSet.clear();bulkCode=null;render();};
window.pick=d=>{if(bulk){if(!editable(d))return;selSet.has(d)?selSet.delete(d):selSet.add(d);render();return;}if(editable(d)||d===TODAY){dayModal=d;render();}};
window.closeDayModal=()=>{dayModal=null;render();};
window.stepWeek=dir=>{let w=weekStart+dir*7;if(w<1)w=1;if(w>29)w=29;weekStart=w;render();};
window.stepMonth=dir=>{showToast('Prototyp pracuje jen s červnem 2026');};
window.toggleBulk=()=>{bulk=!bulk;selSet.clear();bulkCode=null;sel=-1;render();};
window.selectAll=()=>{const days=view==='tyden'?[1,2,3,4,5]:[...Array(30)].map((_,i)=>i+1);days.filter(d=>!isWE(d)&&editable(d)).forEach(d=>selSet.add(d));render();};
window.clearSel=()=>{selSet.clear();bulkCode=null;render();};
window.pickBulkCode=k=>{bulkCode=(bulkCode===k?null:k);render();};
window.saveBulk=()=>{if(!bulkCode||!selSet.size)return;const n=selSet.size;selSet.forEach(d=>{cur().att[d]=bulkCode;});selSet.clear();bulkCode=null;render();showToast('Docházka uložena · '+n+' '+plural(n)+' ✓');};
window.draftCode=(d,k)=>{draft[d]={...(draft[d]||{}),code:k};render();};
window.draftNote=(d,v)=>{draft[d]={...(draft[d]||{}),note:v};};
window.draftObed=(d,v)=>{draft[d]={...(draft[d]||{}),obed:v};render();};
window.saveDay=d=>{const dr=draft[d]||{};if(dr.code!==undefined)cur().att[d]=dr.code;if(dr.note!==undefined)cur().notes[d]=dr.note;if(dr.obed!==undefined){cur().obed=cur().obed||{};cur().obed[d]=dr.obed;}delete draft[d];dayModal=null;render();showToast('Docházka uložena ✓');};
window.setCode=(d,k)=>{cur().att[d]=k;render();};
window.setNote=(d,v)=>{cur().notes[d]=v;};
