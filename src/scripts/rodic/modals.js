/* MODALS: RODIC — překryvné obrazovky (overlay) a jejich handlery */
function renderFond(){
  const c=cur(), f=c.fond, zb=f.rocni-f.cerpano;
  let h=`<button class="back" onclick="closeOverlay()">← Zpět</button><div class="pname">Kulturní fond</div><div class="pfull">${c.n}</div>`;
  h+=`<div class="tile"><div class="np"><span>Roční příspěvek</span><b>${kc(f.rocni)} Kč</b></div><div class="np"><span>Vyčerpáno</span><b>${kc(f.cerpano)} Kč</b></div><div class="np" style="border-top:1px solid var(--color-border);margin-top:4px;padding-top:8px"><span>Zbývá</span><b style="color:var(--color-primary)">${kc(zb)} Kč</b></div></div>`;
  h+=`<div class="tile"><div class="tlab">Z čeho se čerpalo</div>`+FONDLOG.map(x=>`<div class="frow"><div class="fL"><div class="fo">${x[0]}</div><div class="fv">${x[1]}</div></div><div class="fa">${kc(x[2])} Kč</div></div>`).join('')+`</div>`;
  h+=`<div class="note2">Kulturní fond pokrývá divadla, výlety, výtvarný materiál apod. Položky jsou demo.</div>`;
  return h;
}
function renderMenuDetail(){
  let h=`<button class="back" onclick="closeOverlay()">← Zpět</button><div class="pname">Jídelníček</div><div class="pfull">tento týden</div>`;
  for(let d=1;d<=5;d++){
    h+=`<div class="tile"><div class="tlab">${DOW[wd(d)]} ${d}. 6.${d===TODAY?' · dnes':''}</div>`+MENUS[wd(d)].map(it=>`<div class="mrow"><span class="mk2">${it[0]}</span><span class="mv">${it[1]}</span>${it[2]?`<span class="alerg">${it[2]}</span>`:''}</div>`).join('')+`</div>`;
  }
  h+=`<div class="tile"><div class="tlab">Stravné</div><div class="np"><span>Dopolední svačina</span><b>20 Kč</b></div><div class="np"><span>Oběd</span><b>80 Kč</b></div><div class="np"><span>Odpolední svačina</span><b>15 Kč</b></div></div>`;
  h+=`<div class="note2">Alergeny jsou uvedené čísly dle přílohy vyhlášky. Jídelníček dodává Mamafood. Při omluvě do 20:00 předchozího dne se stravné nepočítá.</div>`;
  return h;
}
function renderGuide(i){const g=guides[i];
  return `<button class="back" onclick="closeOverlay()">← Zpět</button><div class="pav">${avatar(g,76)}</div><div class="pname">${g.n}${g.uspava?' ☾':''}</div><div class="pfull">průvodce${g.uspava?' · dnes uspává':''}</div>
   <div class="tile"><div class="tlab">Kdy je ve školce</div><div class="tval">${g.schedule}</div></div>
   <div class="tile"><div class="tlab">Kontakt</div><div class="contact"><a class="cbtn" href="tel:${telnum(g.phone)}">Zavolat</a><a class="cbtn" href="sms:${telnum(g.phone)}">Napsat</a><a class="cbtn" href="mailto:${g.email}">E-mail</a></div><div class="cinfo">${g.phone} · ${g.email}</div></div>`;
}
function renderAkceDetail(i){const a=akce[i];
  return `<button class="back" onclick="closeOverlay()">← Zpět</button><div class="pname">${a.title}</div><div class="pfull">${a.date}</div>
   <div class="tile"><div class="np"><span>Kdy</span><b>${a.time}</b></div><div class="np"><span>Kde</span><b>${a.place}</b></div></div>
   <div class="tile"><div class="tlab">Info</div><div class="tval">${a.note}</div></div>`;
}
window.openGuide=i=>{overlay={type:'guide',idx:i};render();};
window.openAkce=i=>{overlay={type:'akce',idx:i};render();};
window.openFond=()=>{overlay={type:'fond'};render();};
window.openMenu=()=>{overlay={type:'menu'};render();};
window.closeOverlay=()=>{overlay=null;render();};

/* --- OMLUVENKA (Flow 2) --- overlay řízený stavem omDraft */
let omDraft=null;
const omDays=()=>{const a=[];for(let d=omDraft.od;d<=omDraft.do;d++)if(!isWE(d))a.push(d);return a;};
function omGrid(which){
  let h=`<div class="dpcal">`;['P','Ú','S','Č','P','S','N'].forEach(x=>h+=`<div class="dph">${x}</div>`);
  for(let d=1;d<=30;d++){
    if(isWE(d)||d<NOW.d){h+=`<div class="dpcell we">${d}</div>`;continue;}
    const sel=omDraft[which]===d, rng=d>=omDraft.od&&d<=omDraft.do;
    h+=`<div class="dpcell${sel?' sel':rng?' rng':''}${d===TODAY?' today':''}" onclick="omPick('${which}',${d})">${d}</div>`;
  }
  return h+`</div>`;
}
function omDeadline(){
  const days=omDays(), timely=days.filter(beforeDeadline), late=days.filter(d=>!beforeDeadline(d));
  let h=`<div class="tile note-info"><div class="tlab" style="color:var(--color-primary);margin-bottom:5px">Než odešleš</div>`;
  h+=`<div class="omdrow">Omluvit lze do <b>20:00 předchozího dne</b>.</div>`;
  if(timely.length)h+=`<div class="omdrow ok">✓ Vznikne <b>${timely.length} ${nplural(timely.length)}</b> (za ${timely.length} včas omluvený ${plural(timely.length)}).</div>`;
  if(late.length)h+=`<div class="omdrow bad">⚠ Omluva na ${late.map(d=>d+'. 6.').join(', ')} je po deadlinu — <b>náhrada nevznikne</b>. Dítě je omluvené.</div>`;
  return h+`</div>`;
}
function renderOmluvenka(){
  const c=cur();
  let h=`<button class="back" onclick="closeOverlay()">← Zpět</button><div class="pname">Omluvit ${c.ak}</div>`;
  if(omDraft.step==='done')return h+renderOmluvenkaDone(c);
  h+=`<div class="pfull">Vyber dny, kdy ${c.n} nebude ve školce</div>`;
  h+=`<div class="tile"><div class="tlab">Od</div>${omGrid('od')}</div>`;
  h+=`<div class="tile"><div class="tlab">Do</div>${omGrid('do')}</div>`;
  h+=`<div class="tile"><div class="tlab">Důvod</div><div class="pchips">`+[['nemoc','Nemoc'],['rodinné důvody','Rodinné důvody'],['jiné','Jiné']].map(([k,l])=>`<button class="${omDraft.duvod===k?'on':''}" onclick="omReason('${k}')">${l}</button>`).join('')+`</div>`;
  h+=`<textarea class="note" placeholder="Poznámka pro průvodce (nepovinné)" oninput="omNote(this.value)">${escTa(omDraft.pozn)}</textarea></div>`;
  h+=omDeadline();
  h+=`<button class="omluvbtn" onclick="omSubmit()">Odeslat omluvenku</button>`;
  return h;
}
function renderOmluvenkaDone(c){
  const r=omDraft.result;
  let h=`<div class="tile omdone"><div class="omcheck">✓</div><div class="omdt">Omluvenka odeslána</div><div class="omsub">${c.n} · ${fmtRange(omDraft.od,omDraft.do)} · ${DUVODLAB[omDraft.duvod]}</div>`;
  if(r.timely)h+=`<div class="omres ok">Vznikl${r.timely===1?'a':'y'} <b>${r.timely} ${nplural(r.timely)}</b> — najdeš ${r.timely===1?'ji':'je'} níže v Docházce a náhradách.</div>`;
  if(r.late)h+=`<div class="omres bad">Za ${r.late} ${plural(r.late)} po deadlinu <b>náhrada nevznikla</b>.</div>`;
  h+=`<div class="omnext">Průvodci teď vidí, že ${c.n} nebude ve školce. Docházku v těchto dnech jsme označili jako omluvenou (OM).</div></div>`;
  h+=`<button class="omluvbtn" onclick="go('dochazka')">Zobrazit náhrady</button>`;
  h+=`<button class="omdonebtn" onclick="closeOverlay()">Hotovo</button>`;
  return h;
}
window.openOmluvenka=()=>{let t=NOW.d+1;while(t<=30&&isWE(t))t++;omDraft={od:t,do:t,duvod:'nemoc',pozn:'',step:'form',result:null};overlay={type:'omluvenka'};render();};
window.omPick=(which,d)=>{omDraft[which]=d;if(which==='od'&&omDraft.do<d)omDraft.do=d;if(which==='do'&&d<omDraft.od)omDraft.od=d;render();};
window.omReason=k=>{omDraft.duvod=k;render();};
window.omNote=v=>{omDraft.pozn=v;};
window.omSubmit=()=>{
  const c=cur(), days=omDays(); if(!days.length)return;
  const timely=days.filter(beforeDeadline), late=days.filter(d=>!beforeDeadline(d));
  const om={id:uid(),od:omDraft.od,do:omDraft.do,duvod:omDraft.duvod,pozn:omDraft.pozn,
    stav:beforeDeadline(omDraft.od)?'vcas':'po-deadlinu',nahradaIds:[]};
  days.forEach(d=>{c.att[d]='OM';if(omDraft.pozn)c.notes[d]=omDraft.pozn;});
  timely.forEach(d=>{const n=nahFrom(juneDate(d),'dostupna',{den:d,omId:om.id});c.nahrady.push(n);om.nahradaIds.push(n.id);});
  late.forEach(d=>{const n=nahFrom(juneDate(d),'nevznikla',{den:d,omId:om.id,exp:'—',expT:Infinity});c.nahrady.push(n);om.nahradaIds.push(n.id);});
  c.omluvenky.unshift(om);
  omDraft.step='done';omDraft.result={timely:timely.length,late:late.length};
  render();
};
window.omCancel=id=>{
  const c=cur(), om=c.omluvenky.find(o=>o.id===id); if(!om)return;
  om.stav='zrusena';
  for(let d=om.od;d<=om.do;d++){if(c.att[d]==='OM')delete c.att[d];}
  c.nahrady=c.nahrady.filter(n=>!(om.nahradaIds||[]).includes(n.id));
  render();showToast('Omluvenka zrušena, náhrady odečteny');
};
