/* MODALS: RODIC — překryvné obrazovky (overlay) a jejich handlery.
   Kulturní fond už není overlay — vypisuje se rovnou na kartě v sekci Platby (viz platby.js). */
function renderMenuDetail(){
  let h=`<button class="back" onclick="closeOverlay()">← Zpět</button><div class="pname">Jídelníček</div><div class="pfull">tento týden</div>`;
  for(let d=1;d<=5;d++){
    h+=`<div class="tile"><div class="tlab">${DOW[wd(d)]} ${d}. 6.${d===TODAY?' · dnes':''}</div>`+MENUS[wd(d)].map(it=>`<div class="mrow"><span class="mk2">${it[0]}</span><span class="mv">${it[1]}</span>${it[2]?`<span class="alerg">${it[2]}</span>`:''}</div>`).join('')+`</div>`;
  }
  h+=`<div class="tile"><div class="tlab">Stravné</div><div class="np"><span>Dopolední svačina</span><b>20 Kč</b></div><div class="np"><span>Oběd</span><b>80 Kč</b></div><div class="np"><span>Odpolední svačina</span><b>15 Kč</b></div></div>`;
  h+=`<div class="note2">Alergeny jsou uvedené čísly dle přílohy vyhlášky. Jídelníček dodává Mamafood. Při omluvě do 20:00 předchozího dne se stravné nepočítá.</div>`;
  return h;
}
function renderAkceDetail(i){const a=akce[i];
  return `<button class="back" onclick="closeOverlay()">← Zpět</button><div class="pname">${a.title}</div><div class="pfull">${a.date}</div>
   <div class="tile"><div class="np"><span>Kdy</span><b>${a.time}</b></div><div class="np"><span>Kde</span><b>${a.place}</b></div></div>
   <div class="tile"><div class="tlab">Info</div><div class="tval">${a.note}</div></div>`;
}
window.openAkce=i=>{overlay={type:'akce',idx:i};render();};
window.openMenu=()=>{overlay={type:'menu'};render();};
window.closeOverlay=()=>{overlay=null;render();};

/* --- NASTAVENÍ ÚČTU (dole v menu) --- overlay řízený stavem ucetEdit.
   Telefon je společný pro domácnost (ACCOUNT.telMatka/telOtec) — propisuje se do profilu obou dětí
   (PROFIL.*.matka/otec už tel nedrží). E-mail a heslo jsou jen demo formuláře, nic reálně neukládají/neověřují. */
let ucetEdit=null;
function renderUcet(){
  const d=ucetEdit;
  const row=(lbl,f,type)=>`<label class="pf-row"><span class="pf-lbl">${lbl}</span><input class="pf-in" type="${type||'text'}" value="${esc(d[f])}" oninput="ucetSet('${f}',this.value)"></label>`;
  let h=`<div class="pf-head"><button class="back" onclick="ucetCancel()">← Zpět</button><h1 class="dh-t">Nastavení účtu</h1><div class="dh-sub">${ACCOUNT.jmeno}</div></div>`;

  h+=`<div class="tile"><div class="ch">Změna telefonu</div>
    ${row('Telefon — matka','telMatka','tel')}${row('Telefon — otec','telOtec','tel')}
    <div class="note2" style="margin:8px 0 10px">Společné pro domácnost — projeví se v profilu obou dětí.</div>
    <button class="btn-primary" onclick="ucetSaveTel()">Uložit telefon</button></div>`;

  h+=`<div class="tile"><div class="ch">Změna e-mailu</div>
    <label class="pf-row"><span class="pf-lbl">Současný e-mail</span><span class="pf-static">${esc(ACCOUNT.email)}</span></label>
    <label class="pf-row"><span class="pf-lbl">Nový e-mail</span><input class="pf-in" value="${esc(d.novyEmail)}" placeholder="e-mail" oninput="ucetSet('novyEmail',this.value)"></label>
    <button class="btn-primary" style="margin-top:10px" onclick="ucetSaveEmail()">Změnit e-mail</button></div>`;

  h+=`<div class="tile"><div class="ch">Změna hesla</div>
    ${row('Současné heslo','hesloSoucasne','password')}${row('Nové heslo','hesloNove','password')}${row('Heslo pro kontrolu','hesloKontrola','password')}
    <button class="btn-primary" style="margin-top:10px" onclick="ucetSaveHeslo()">Změnit heslo</button></div>`;
  return h;
}
window.openUcet=()=>{
  ucetEdit={telMatka:ACCOUNT.telMatka,telOtec:ACCOUNT.telOtec,novyEmail:'',hesloSoucasne:'',hesloNove:'',hesloKontrola:''};
  drawerOpen=false;overlay={type:'ucet'};render();
};
window.ucetSet=(f,v)=>{ucetEdit[f]=v;};
window.ucetCancel=()=>{ucetEdit=null;overlay=null;render();};
window.ucetSaveTel=()=>{
  ACCOUNT.telMatka=ucetEdit.telMatka;ACCOUNT.telOtec=ucetEdit.telOtec;
  showToast('Telefon uložen ✓');render();
};
window.ucetSaveEmail=()=>{
  if(!ucetEdit.novyEmail.trim()){showToast('Zadejte nový e-mail');return;}
  ACCOUNT.email=ucetEdit.novyEmail.trim();ucetEdit.novyEmail='';
  showToast('E-mail změněn ✓');render();
};
window.ucetSaveHeslo=()=>{
  if(!ucetEdit.hesloSoucasne||!ucetEdit.hesloNove||!ucetEdit.hesloKontrola){showToast('Vyplňte všechna pole');return;}
  if(ucetEdit.hesloNove!==ucetEdit.hesloKontrola){showToast('Nové heslo se neshoduje s kontrolou');return;}
  ucetEdit.hesloSoucasne='';ucetEdit.hesloNove='';ucetEdit.hesloKontrola='';
  showToast('Heslo změněno ✓');render();
};

/* --- OMLUVENKA (Flow 2) --- overlay řízený stavem omDraft */
let omDraft=null;
const omDays=()=>{const a=[];for(let d=omDraft.od;d<=omDraft.do;d++)if(!isWE(d))a.push(d);return a;};
function omGrid(which){
  let h=`<div class="dpcal">`;['P','Ú','S','Č','P','S','N'].forEach(x=>h+=`<div class="dph">${x}</div>`);
  for(let d=1;d<=30;d++){
    if(isWE(d)||d<=NOW.d){h+=`<div class="dpcell we">${d}</div>`;continue;}
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
  h+=`<div class="pfull">Vyberte dny, kdy ${c.n} nebude ve školce</div>`;
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
  h+=`<div class="omnext">Průvodci teď vidí, že ${c.n} nebude ve školce. ${r.timely?'Včas omluvené dny jsme označili jako omluvené (OM).':''}${r.late?' Dny po deadlinu jsou neomluvené (NE).':''}</div></div>`;
  h+=`<button class="omluvbtn" onclick="go('dochazka')">Zobrazit náhrady</button>`;
  h+=`<button class="omdonebtn" onclick="closeOverlay()">Hotovo</button>`;
  return h;
}
/* Volitelný prefill dne (z dashboardu: dnešek = pozdní omluva, budoucí den = včasná).
   Bez argumentu (sekce Docházka) předvyplní nejbližší omluvitelný den. */
window.openOmluvenka=day=>{let t;if(day>NOW.d&&day<=30&&!isWE(day)){t=day;}else{t=NOW.d+1;while(t<=30&&isWE(t))t++;}omDraft={od:t,do:t,duvod:'nemoc',pozn:'',step:'form',result:null};overlay={type:'omluvenka'};render();};
window.omPick=(which,d)=>{omDraft[which]=d;if(which==='od'&&omDraft.do<d)omDraft.do=d;if(which==='do'&&d<omDraft.od)omDraft.od=d;render();};
window.omReason=k=>{omDraft.duvod=k;render();};
window.omNote=v=>{omDraft.pozn=v;};
window.omSubmit=()=>{
  const c=cur(), days=omDays(); if(!days.length)return;
  const timely=days.filter(beforeDeadline), late=days.filter(d=>!beforeDeadline(d));
  const om={id:uid(),od:omDraft.od,do:omDraft.do,duvod:omDraft.duvod,pozn:omDraft.pozn,
    stav:beforeDeadline(omDraft.od)?'vcas':'po-deadlinu',nahradaIds:[]};
  timely.forEach(d=>{c.att[d]='OM';});late.forEach(d=>{c.att[d]='NE';});
  days.forEach(d=>{if(omDraft.pozn)c.notes[d]=omDraft.pozn;});
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

/* --- Modal: Nahlásit dnešní absenci (po deadlinu → neomluveno, bez náhrady) --- */
let absModal=null;
window.openAbsDnes=()=>{absModal={obed:null,pozn:''};render();};
window.absObed=v=>{absModal.obed=v;render();};
window.absPozn=v=>{absModal.pozn=v;};
window.absClose=()=>{absModal=null;render();};
window.absSubmit=()=>{
  const c=cur();
  c.att[TODAY]='NE'; if(absModal.pozn)c.notes[TODAY]=absModal.pozn;
  c.obed=c.obed||{}; c.obed[TODAY]=absModal.obed===true;
  const om={id:uid(),od:TODAY,do:TODAY,duvod:'jiné',pozn:absModal.pozn,stav:'po-deadlinu',nahradaIds:[]};
  const n=nahFrom(juneDate(TODAY),'nevznikla',{den:TODAY,omId:om.id,exp:'—',expT:Infinity});
  c.nahrady.push(n); om.nahradaIds.push(n.id); c.omluvenky.unshift(om);
  absModal=null; showToast('Absence nahlášena'); render();
};
function renderAbsModal(){
  const c=cur(), menu=MENUS[wd(TODAY)];
  const obedy=menu.filter(it=>/pol|hlavn/i.test(it[0]));
  let h=`<div class="modal-scrim" onclick="absClose()"><div class="modal" onclick="event.stopPropagation()">`;
  h+=`<h3>Nahlásit dnešní absenci</h3><div class="abs-sub">${c.n} · středa 3. 6.</div>`;
  h+=`<div class="abs-warn">⚠ Je po deadlinu (20:00 včera). Den bude <b>neomluvený</b> a náhrada nevznikne.</div>`;
  h+=`<div class="notelab">Důvod absence — nepovinné</div><textarea class="note" placeholder="např. nemoc, rodinný důvod…" oninput="absPozn(this.value)">${escTa(absModal.pozn)}</textarea>`;
  h+=`<div class="notelab">Vyzvednete si oběd?</div>`;
  h+=`<div class="abs-menu">`+obedy.map(it=>`<div class="mrow"><span class="mk2">${it[0]}</span><span class="mv">${it[1]}</span></div>`).join('')+`</div>`;
  h+=`<div class="choices"><button class="${absModal.obed===true?'on':''}" onclick="absObed(true)">Ano, vyzvedneme</button><button class="${absModal.obed===false?'on':''}" onclick="absObed(false)">Ne</button></div>`;
  h+=`<div class="abs-hint">Nevyzvednutý oběd propadá.</div>`;
  h+=`<div class="mbtns"><button class="btn-ghost" onclick="absClose()">Zrušit</button><button class="omluvbtn danger" style="margin:0" onclick="absSubmit()">Nahlásit neomluvenou absenci</button></div>`;
  return h+`</div></div>`;
}
