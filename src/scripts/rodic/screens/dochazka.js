/* SCREEN: RODIC_DOCHAZKA */
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
        h+=`<div class="notelab">Důvod absence — nepovinné</div><textarea class="note" placeholder="např. nemoc, rodinný důvod…" oninput="draftNote(${d},this.value)">${note}</textarea>`;
      }
      if(dirty)h+=`<button class="savebtn" onclick="saveDay(${d})">Uložit</button>`;
    }
    return h+'</div>';
  }
  const OPTS=[['D','Dopolední'],['O','Odpolední'],['C','Celodenní'],['OM','Omluvit']];
  let h='<div class="choices">'+OPTS.map(([k,l])=>{const abs=(k==='OM');
    return `<button class="${cd===k?'on':''}${abs?' abs':''}" onclick="draftCode(${d},'${k}')">${l}</button>`;}).join('')+'</div>';
  if(cd==='OM'){h+=`<div class="notelab">Důvod absence — nepovinné</div><textarea class="note" placeholder="např. nemoc, rodinný důvod…" oninput="draftNote(${d},this.value)">${note}</textarea>`;}
  h+=`<button class="savebtn${dirty?'':' dis'}" ${dirty?'':'disabled'} onclick="saveDay(${d})">Uložit</button>`;
  return h;}
function bulkControls(){
  if(!bulk)return `<button class="bulktoggle" onclick="toggleBulk()">Nastavit více dní najednou</button>`;
  let h=`<div class="bulkbar"><div class="top"><span>Hromadné nastavení</span><button class="linkbtn" onclick="toggleBulk()">Hotovo</button></div><div class="bulkactions"><button onclick="selectAll()">Vybrat všechny dny</button><button onclick="clearSel()">Zrušit výběr</button></div>`;
  if(selSet.size){h+=`<div class="selinfo">Vybráno: ${selSet.size} ${plural(selSet.size)} — nastavit na:</div><div class="choices">`+[['D','Dopolední'],['O','Odpolední'],['C','Celodenní'],['OM','Omluvit']].map(([k,l])=>{const abs=(k==='OM');return `<button class="${abs?'abs':''}" onclick="applyBulk('${k}')">${l}</button>`;}).join('')+'</div>';}
  return h+'</div>';}
function renderDen(){return `<div class="vhead">${cur().n} dnes</div><div class="daycard"><div class="dt"><span class="wd">Středa 3. června</span><span class="small">${cur().n}</span></div><div class="editbox">${editor(TODAY)}<div class="deadline">Po 20:00 lze u dnešního dne zadat už jen neomluveno.</div></div></div>`;}
function renderTyden(){let h=`<div class="vhead">Týden ${cur().dat}</div>`+bulkControls();
  for(let d=1;d<=5;d++){const cd=code(cur(),d);const open=!bulk&&sel===d,bs=bulk&&selSet.has(d);
    h+=`<div class="wkrow${d===TODAY?' today':''}${!editable(d)?' locked':''}${open?' open':''}${bs?' bsel':''}"><div class="wkmain" onclick="pick(${d})">`+(bulk?`<span class="bchk ${selSet.has(d)?'on':''}"></span>`:'')+`<span class="d">${DOW[wd(d)]} <span>${d}. 6.</span></span><span class="cur">${!editable(d)?'<span class="lockflag">🔒 uzavřeno</span>':''}${chip(cd)}</span></div><div class="editbox">${open?editor(d):''}</div></div>`;}
  return h;}
function renderMesic(){let h=`<div class="vhead">Červen ${cur().dat}</div>`+bulkControls()+'<div class="cal">';
  DOW.forEach(x=>h+=`<div class="h">${x}</div>`);
  for(let d=1;d<=30;d++){if(isWE(d)){h+=`<div class="cell we"><span class="dnum">${d}</span></div>`;continue;}const cd=code(cur(),d),s=bulk?selSet.has(d):sel===d;
    h+=`<div class="cell${d===TODAY?' today':''}${!editable(d)?' lock':''}${s?' sel':''}" onclick="pick(${d})"><span class="dnum">${d}</span><span class="mk" style="color:${CODES[cd][1]}">${mark(cd)}</span></div>`;}
  h+='</div>';
  if(!bulk&&sel>0&&!isWE(sel))h+=`<div class="daycard" style="margin-top:12px"><div class="dt"><span class="wd">${DOW[wd(sel)]} ${sel}. června</span></div><div class="editbox">${editor(sel)}</div></div>`;
  return h;}
const HINTS={den:'Vyberte docházku na dnešek. Změny na další dny v Týdnu nebo Měsíci.',tyden:'Klepněte na den a vyberte docházku. Pro více dní naráz „Nastavit více dní“.',mesic:'Klepněte na den a vyberte docházku. Pro více dní „Nastavit více dní“. Víkendy školka nemá.'};
function nahRow(n){
  let sub;
  if(n.stav==='nevznikla')sub=`omluva ${n.vznik} · po deadlinu`;
  else{sub=`vznik ${n.vznik}`;if(isFinite(n.expT))sub+=` · expirace ${n.exp}`;
    if(n.stav==='naplanovana'&&n.plan)sub+=` · ${n.plan}`;
    if(n.stav==='vyuzita'&&n.pouzita)sub+=` · využita ${n.pouzita}`;}
  return `<div class="nahrow"><div class="nahL"><div class="naho">${n.puvod}</div><div class="nahv">${sub}</div></div><span class="bdg n-${n.stav}">${NAHLAB[n.stav]}</span></div>`;
}
function renderNahrady(c){
  const av=dostupne(c), ne=nextExp(c);
  let h=`<div class="tile"><div class="ftop"><div><div class="tlab" style="margin:0">Dostupné náhrady</div><div class="nahbig">${av}</div></div><div class="nahexp">${ne?'nejbližší expirace<br>'+ne:''}</div></div>`;
  h+=`<div class="nahsub2">Náhradu lze vyčerpat i na příměstský tábor. Vzniká za každý včas omluvený den.</div>`;
  h+=c.nahrady.length?c.nahrady.map(nahRow).join(''):'<div class="empty">Zatím žádné náhrady. Vzniknou za každý včas omluvený den.</div>';
  return h+`</div>`;
}
function renderOmluvenky(c){
  let h=`<div class="tile"><div class="tlab">Omluvenky</div>`;
  if(!c.omluvenky.length)return h+'<div class="empty">Zatím žádné omluvenky. Omluvit dítě můžete tlačítkem nahoře.</div></div>';
  c.omluvenky.forEach(o=>{
    const canCancel=o.od>NOW.d&&o.stav!=='zrusena';
    h+=`<div class="omrow"><div class="omL"><div class="omo">${fmtRange(o.od,o.do)}</div><div class="omv">${DUVODLAB[o.duvod]||o.duvod}${o.pozn?' · '+escTa(o.pozn):''}</div></div><span class="bdg om-${o.stav}">${OMLAB[o.stav]}</span>${canCancel?`<button class="omx" onclick="omCancel('${o.id}')">Zrušit</button>`:''}</div>`;
  });
  return h+`</div>`;
}
function renderDochazka(){
  const c=cur();
  let h=`<button class="omluvbtn" onclick="openOmluvenka()">Omluvit ${c.ak}</button>`;
  h+=renderNahrady(c);
  h+=renderOmluvenky(c);
  h+=`<div class="vhead" style="margin-top:18px">Kalendář docházky</div>`;
  h+='<div class="switch">'+[['den','Den'],['tyden','Týden'],['mesic','Měsíc']].map(v=>`<button class="${view===v[0]?'on':''}" onclick="setView('${v[0]}')">${v[1]}</button>`).join('')+'</div>';
  h+=view==='den'?renderDen():view==='tyden'?renderTyden():renderMesic();
  h+=`<div class="hint">${HINTS[view]}</div>`;
  return h;
}
window.goEditDay=d=>{section='dochazka';if(d<=5){view='tyden';}else{view='mesic';}sel=d;overlay=null;drawerOpen=false;render();};
window.setView=v=>{view=v;sel=(v==='den')?TODAY:sel;bulk=false;selSet.clear();render();};
window.pick=d=>{if(bulk){if(!editable(d))return;selSet.has(d)?selSet.delete(d):selSet.add(d);render();return;}sel=(sel===d)?-1:d;render();};
window.toggleBulk=()=>{bulk=!bulk;selSet.clear();sel=-1;render();};
window.selectAll=()=>{const days=view==='tyden'?[1,2,3,4,5]:[...Array(30)].map((_,i)=>i+1);days.filter(d=>!isWE(d)&&editable(d)).forEach(d=>selSet.add(d));render();};
window.clearSel=()=>{selSet.clear();render();};
window.applyBulk=k=>{selSet.forEach(d=>{cur().att[d]=k;});selSet.clear();showToast('Docházka uložena');};
window.draftCode=(d,k)=>{draft[d]={...(draft[d]||{}),code:k};render();};
window.draftNote=(d,v)=>{draft[d]={...(draft[d]||{}),note:v};};
window.draftObed=(d,v)=>{draft[d]={...(draft[d]||{}),obed:v};render();};
window.saveDay=d=>{const dr=draft[d]||{};if(dr.code!==undefined)cur().att[d]=dr.code;if(dr.note!==undefined)cur().notes[d]=dr.note;if(dr.obed!==undefined){cur().obed=cur().obed||{};cur().obed[d]=dr.obed;}delete draft[d];dashEdit=false;showToast('Docházka uložena');};
window.setCode=(d,k)=>{cur().att[d]=k;render();};
window.setNote=(d,v)=>{cur().notes[d]=v;};
