/* MODALS: RODIC – překryvné obrazovky (overlay) a jejich handlery.
   Kulturní fond už není overlay – vypisuje se rovnou na kartě v sekci Platby (viz platby.js). */
function renderAkceDetail(i){const a=akce[i];
  return `<button class="back" onclick="closeOverlay()">← Zpět</button><div class="pname">${a.title}</div><div class="pfull">${a.date}</div>
   <div class="tile"><div class="np"><span>Kdy</span><b>${a.time}</b></div><div class="np"><span>Kde</span><b>${a.place}</b></div></div>
   <div class="tile"><div class="tlab">Info</div><div class="tval">${a.note}</div></div>`;
}
window.openAkce=i=>{overlay={type:'akce',idx:i};render();};
window.closeOverlay=()=>{overlay=null;render();};

/* --- NASTAVENÍ ÚČTU (dole v menu) --- overlay řízený stavem ucetEdit.
   Telefon i e-mail jsou společné pro domácnost (ACCOUNT.telMatka/telOtec/emailMatka/emailOtec) –
   propisují se do profilu obou dětí (PROFIL.*.matka/otec je nedrží). Heslo je jen demo formulář,
   nic reálně neukládá/neověřuje. */
let ucetEdit=null;
function renderUcet(){
  const d=ucetEdit;
  const row=(lbl,f,type)=>`<label class="pf-row"><span class="pf-lbl">${lbl}</span><input class="pf-in" type="${type||'text'}" value="${esc(d[f])}" oninput="ucetSet('${f}',this.value)"></label>`;
  let h=`<div class="pf-head"><button class="back" onclick="ucetCancel()">← Zpět</button><h1 class="dh-t">Nastavení účtu</h1><div class="dh-sub">${ACCOUNT.jmeno}</div></div>`;

  h+=`<div class="tile"><div class="ch">Změna telefonu</div>
    ${row('Telefon – matka','telMatka','tel')}${row('Telefon – otec','telOtec','tel')}
    <div class="note2">Společné pro domácnost – projeví se v profilu obou dětí.</div>
    <button class="btn-primary" onclick="ucetSaveTel()">Uložit telefon</button></div>`;

  h+=`<div class="tile"><div class="ch">Změna e-mailu</div>
    ${row('E-mail – matka','emailMatka')}${row('E-mail – otec','emailOtec')}
    <div class="note2">Společné pro domácnost – projeví se v profilu obou dětí.</div>
    <button class="btn-primary" onclick="ucetSaveEmail()">Uložit e-mail</button></div>`;

  h+=`<div class="tile"><div class="ch">Změna hesla</div>
    ${row('Současné heslo','hesloSoucasne','password')}${row('Nové heslo','hesloNove','password')}${row('Heslo pro kontrolu','hesloKontrola','password')}
    <button class="btn-primary" style="margin-top:10px" onclick="ucetSaveHeslo()">Změnit heslo</button></div>`;
  return h;
}
window.openUcet=()=>{
  ucetEdit={telMatka:ACCOUNT.telMatka,telOtec:ACCOUNT.telOtec,
    emailMatka:ACCOUNT.emailMatka,emailOtec:ACCOUNT.emailOtec,
    hesloSoucasne:'',hesloNove:'',hesloKontrola:''};
  drawerOpen=false;overlay={type:'ucet'};render();
};
window.ucetSet=(f,v)=>{ucetEdit[f]=v;};
window.ucetCancel=()=>{ucetEdit=null;overlay=null;render();};
window.ucetSaveTel=()=>{
  ACCOUNT.telMatka=ucetEdit.telMatka;ACCOUNT.telOtec=ucetEdit.telOtec;
  showToast('Telefon uložen ✓');render();
};
window.ucetSaveEmail=()=>{
  ACCOUNT.emailMatka=ucetEdit.emailMatka;ACCOUNT.emailOtec=ucetEdit.emailOtec;
  showToast('E-mail uložen ✓');render();
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
  if(late.length)h+=`<div class="omdrow bad">⚠ Omluva na ${late.map(d=>d+'. 6.').join(', ')} je po deadlinu – <b>náhrada nevznikne</b>. Dítě je omluvené.</div>`;
  return h+`</div>`;
}
/* Omluvenka jako modal nad tím, kde rodič právě je. Dřív to byl overlay přes celý obsah –
   respondenti po odeslání nevěděli, kde skončili. Uložením se modal zavře a nový stav je
   rovnou vidět pod ním (na dashboardu i v sekci Docházka). */
function renderOmluvenka(){
  const c=cur();
  let h=`<div class="modal-scrim" onclick="if(event.target===this)closeOmluvenka()"><div class="modal modal-wide">`;
  h+=`<h3>Omluvit ${c.ak}</h3><div class="abs-sub">Vyberte dny, kdy ${c.n} nebude ve školce</div>`;
  h+=`<div class="notelab">Od</div>${omGrid('od')}`;
  h+=`<div class="notelab">Do</div>${omGrid('do')}`;
  h+=`<div class="notelab">Důvod</div><div class="pchips">`+[['nemoc','Nemoc'],['rodinné důvody','Rodinné důvody'],['jiné','Jiné']].map(([k,l])=>`<button class="${omDraft.duvod===k?'on':''}" onclick="omReason('${k}')">${l}</button>`).join('')+`</div>`;
  h+=`<textarea class="note" placeholder="Poznámka pro průvodce (nepovinné)" oninput="omNote(this.value)">${escTa(omDraft.pozn)}</textarea>`;
  h+=omDeadline();
  h+=`<div class="mbtns"><button class="btn-ghost" onclick="closeOmluvenka()">Zrušit</button><button class="btn-primary" onclick="omSubmit()">Odeslat omluvenku</button></div>`;
  return h+`</div></div>`;
}
/* Volitelný prefill dne (z dashboardu). Bez argumentu předvyplní nejbližší omluvitelný den. */
window.openOmluvenka=day=>{let t;if(day>NOW.d&&day<=30&&!isWE(day)){t=day;}else{t=NOW.d+1;while(t<=30&&isWE(t))t++;}
  omDraft={od:t,do:t,duvod:'nemoc',pozn:''};omModal=true;render();};
window.closeOmluvenka=()=>{omModal=false;render();};
window.omPick=(which,d)=>{omDraft[which]=d;if(which==='od'&&omDraft.do<d)omDraft.do=d;if(which==='do'&&d<omDraft.od)omDraft.od=d;render();};
window.omReason=k=>{omDraft.duvod=k;render();};
window.omNote=v=>{omDraft.pozn=v;};
window.omSubmit=()=>{
  const c=cur(), days=omDays(); if(!days.length)return;
  const timely=days.filter(beforeDeadline), late=days.filter(d=>!beforeDeadline(d));
  const om={id:uid(),od:omDraft.od,do:omDraft.do,duvod:omDraft.duvod,pozn:omDraft.pozn,
    stav:beforeDeadline(omDraft.od)?'vcas':'po-deadlinu',nahradaIds:[]};
  // po termínu je dítě taky omluvené – liší se jen tím, že nevznikne náhrada
  days.forEach(d=>{c.att[d]='OM';if(omDraft.pozn)c.notes[d]=omDraft.pozn;});
  timely.forEach(d=>{const n=nahFrom(juneDate(d),'dostupna',{den:d,omId:om.id});c.nahrady.push(n);om.nahradaIds.push(n.id);});
  late.forEach(d=>{const n=nahFrom(juneDate(d),'nevznikla',{den:d,omId:om.id,exp:'–',expT:Infinity});c.nahrady.push(n);om.nahradaIds.push(n.id);});
  c.omluvenky.unshift(om);
  // na dashboardu přepneme na první omluvený den, ať je nový stav vidět bez hledání
  if(section==='prehled')dashDay=days[0];
  omModal=false;render();
  showToast(timely.length?`Omluvenka odeslána · vznikl${timely.length===1?'a':'y'} ${timely.length} ${nplural(timely.length)}`
    :'Omluvenka odeslána · náhrada nevznikla (po termínu)');
};
window.omCancel=id=>{
  const c=cur(), om=c.omluvenky.find(o=>o.id===id); if(!om)return;
  om.stav='zrusena';
  for(let d=om.od;d<=om.do;d++){if(c.att[d]==='OM')delete c.att[d];}
  c.nahrady=c.nahrady.filter(n=>!(om.nahradaIds||[]).includes(n.id));
  render();showToast('Omluvenka zrušena, náhrady odečteny');
};

/* --- Modal: Nahlásit dnešní absenci (po termínu → omluveno, ale bez náhrady) --- */
let absModal=null;
window.openAbsDnes=()=>{absModal={obed:null,pozn:''};render();};
window.absObed=v=>{absModal.obed=v;render();};
window.absPozn=v=>{absModal.pozn=v;};
window.absClose=()=>{absModal=null;render();};
window.absSubmit=()=>{
  const c=cur();
  c.att[TODAY]='OM'; if(absModal.pozn)c.notes[TODAY]=absModal.pozn;
  c.obed=c.obed||{}; c.obed[TODAY]=absModal.obed===true;
  const om={id:uid(),od:TODAY,do:TODAY,duvod:'jiné',pozn:absModal.pozn,stav:'po-deadlinu',nahradaIds:[]};
  const n=nahFrom(juneDate(TODAY),'nevznikla',{den:TODAY,omId:om.id,exp:'–',expT:Infinity});
  c.nahrady.push(n); om.nahradaIds.push(n.id); c.omluvenky.unshift(om);
  absModal=null; showToast('Absence nahlášena'); render();
};
function renderAbsModal(){
  const c=cur(), menu=jidelnicekDen(TODAY)||[];
  const obedy=menu.filter(it=>/pol|hlavn/i.test(it[0]));
  let h=`<div class="modal-scrim" onclick="absClose()"><div class="modal" onclick="event.stopPropagation()">`;
  h+=`<h3>Nahlásit dnešní absenci</h3><div class="abs-sub">${c.n} · středa 3. 6.</div>`;
  h+=`<div class="abs-warn">⚠ Je po termínu (20:00 včera). ${c.n} bude <b>omluvená</b>, ale <b>náhrada za tento den nevznikne</b>.</div>`;
  h+=`<div class="notelab">Důvod absence – nepovinné</div><textarea class="note" placeholder="např. nemoc, rodinný důvod…" oninput="absPozn(this.value)">${escTa(absModal.pozn)}</textarea>`;
  h+=`<div class="notelab">Vyzvednete si oběd?</div>`;
  h+=`<div class="abs-menu">`+obedy.map(it=>`<div class="mrow"><span class="mk2">${it[0]}</span><span class="mv">${it[1]}</span></div>`).join('')+`</div>`;
  h+=`<div class="choices"><button class="${absModal.obed===true?'on':''}" onclick="absObed(true)">Ano, vyzvedneme</button><button class="${absModal.obed===false?'on':''}" onclick="absObed(false)">Ne</button></div>`;
  h+=`<div class="abs-hint">Nevyzvednutý oběd propadá.</div>`;
  h+=`<div class="mbtns"><button class="btn-ghost" onclick="absClose()">Zrušit</button><button class="omluvbtn danger" style="margin:0" onclick="absSubmit()">Nahlásit absenci</button></div>`;
  return h+`</div></div>`;
}
