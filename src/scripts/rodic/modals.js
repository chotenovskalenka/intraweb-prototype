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
  // povinný výběr z číselníku (DUVODY); bez předvolby, ať se neodešle „Nemoc" omylem
  h+=`<div class="notelab">Důvod</div>${duvodSelect(omDraft.duvod,'omReason(this.value)')}`;
  h+=`<div class="notelab">Poznámka pro průvodce – nepovinné</div>`;
  h+=`<textarea class="note" placeholder="Co mají průvodci vědět" oninput="omNote(this.value)">${escTa(omDraft.pozn)}</textarea>`;
  h+=omDeadline();
  h+=`<div class="mbtns"><button class="btn-ghost" onclick="closeOmluvenka()">Zrušit</button><button class="btn-primary" onclick="omSubmit()">Odeslat omluvenku</button></div>`;
  return h+`</div></div>`;
}
/* Volitelný prefill dne (z dashboardu). Bez argumentu předvyplní nejbližší omluvitelný den. */
window.openOmluvenka=day=>{let t;if(day>NOW.d&&day<=30&&!isWE(day)){t=day;}else{t=NOW.d+1;while(t<=30&&isWE(t))t++;}
  omDraft={od:t,do:t,duvod:'',pozn:''};omModal=true;render();};
window.closeOmluvenka=()=>{omModal=false;render();};
window.omPick=(which,d)=>{omDraft[which]=d;if(which==='od'&&omDraft.do<d)omDraft.do=d;if(which==='do'&&d<omDraft.od)omDraft.od=d;render();};
window.omReason=k=>{omDraft.duvod=k;render();};
window.omNote=v=>{omDraft.pozn=v;};
window.omSubmit=()=>{
  const c=cur(), days=omDays(); if(!days.length)return;
  if(!omDraft.duvod){showToast('Vyberte důvod absence');return;}
  const timely=days.filter(beforeDeadline), late=days.filter(d=>!beforeDeadline(d));
  const om={id:uid(),od:omDraft.od,do:omDraft.do,duvod:omDraft.duvod,pozn:omDraft.pozn,
    stav:beforeDeadline(omDraft.od)?'vcas':'po-deadlinu',nahradaIds:[]};
  // po termínu je dítě taky omluvené – liší se jen tím, že nevznikne náhrada
  days.forEach(d=>{c.att[d]='OM';c.duvody[d]=omDraft.duvod;if(omDraft.pozn)c.notes[d]=omDraft.pozn;});
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
window.openAbsDnes=()=>{absModal={obed:null,duvod:'',pozn:''};render();};
window.absObed=v=>{absModal.obed=v;render();};
window.absDuvod=v=>{absModal.duvod=v;render();};
window.absPozn=v=>{absModal.pozn=v;};
window.absClose=()=>{absModal=null;render();};
window.absSubmit=()=>{
  const c=cur();
  if(!absModal.duvod){showToast('Vyberte důvod absence');return;}
  c.att[TODAY]='OM'; c.duvody[TODAY]=absModal.duvod; if(absModal.pozn)c.notes[TODAY]=absModal.pozn;
  c.obed=c.obed||{}; c.obed[TODAY]=absModal.obed===true;
  const om={id:uid(),od:TODAY,do:TODAY,duvod:absModal.duvod,pozn:absModal.pozn,stav:'po-deadlinu',nahradaIds:[]};
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
  h+=`<div class="notelab">Důvod absence</div>${duvodSelect(absModal.duvod,'absDuvod(this.value)')}`;
  h+=`<div class="notelab">Podrobnosti – nepovinné</div><textarea class="note" placeholder="Co mají průvodci vědět" oninput="absPozn(this.value)">${escTa(absModal.pozn)}</textarea>`;
  h+=`<div class="notelab">Vyzvednete si oběd?</div>`;
  h+=`<div class="abs-menu">`+obedy.map(it=>`<div class="mrow"><span class="mk2">${it[0]}</span><span class="mv">${it[1]}</span></div>`).join('')+`</div>`;
  h+=`<div class="choices"><button class="${absModal.obed===true?'on':''}" onclick="absObed(true)">Ano, vyzvedneme</button><button class="${absModal.obed===false?'on':''}" onclick="absObed(false)">Ne</button></div>`;
  h+=`<div class="abs-hint">Nevyzvednutý oběd propadá.</div>`;
  h+=`<div class="mbtns"><button class="btn-ghost" onclick="absClose()">Zrušit</button><button class="omluvbtn danger" style="margin:0" onclick="absSubmit()">Nahlásit absenci</button></div>`;
  return h+`</div></div>`;
}

/* --- INFORMACE PRO PRŮVODCE --- modal, stejný vzorec jako omluvenka:
   otevře se nad tím, kde rodič právě je, a po odeslání je nový stav rovnou vidět pod ním.
   Na rozdíl od omluvenky tu není deadline – vzkaz na dnešek dává smysl i v 7:50 ráno. */
let zpDraft=null;
function renderZprava(){
  const c=cur(), p=zpPotrebuje(zpDraft.typ);
  let h=`<div class="modal-scrim" onclick="if(event.target===this)closeZprava()"><div class="modal modal-wide">`;
  h+=`<h3>Informace pro průvodce</h3><div class="abs-sub">${c.n} · uvidí to průvodci ve službě na svém přehledu dne</div>`;
  h+=`<div class="notelab">Čeho se to týká</div><select class="pin" onchange="zpTyp(this.value)">`
    +`<option value=""${zpDraft.typ?'':' selected'}>Vyberte…</option>`
    +ZPRAVA_TYPY.map(([k,l])=>`<option value="${k}"${zpDraft.typ===k?' selected':''}>${l}</option>`).join('')+`</select>`;
  /* Navazující pole se objeví teprve po výběru – prázdný formulář se šesti poli
     nutí rodiče přečíst všechno, než pochopí, že polovina se ho netýká. */
  if(zpDraft.typ){
    if(p==='kdo')h+=`<div class="notelab">Kdo ${c.ak} vyzvedne</div><input class="pin" value="${esc(zpDraft.kdo)}" placeholder="jméno a vztah – např. babička Jana Nováková" oninput="zpSet('kdo',this.value)">`;
    if(p==='cas')h+=`<div class="notelab">V kolik hodin</div><input class="pin" type="time" value="${esc(zpDraft.cas)}" oninput="zpSet('cas',this.value)">`;
    h+=`<div class="notelab">Podrobnosti${p?' – nepovinné':''}</div>`;
    h+=`<textarea class="note" placeholder="Co mají průvodci vědět" oninput="zpSet('text',this.value)">${escTa(zpDraft.text)}</textarea>`;
    h+=`<div class="notelab">Na který den</div><input class="pin" type="date" value="${zpISO(zpDraft.den)}" min="${zpISO(NOW.d)}" max="${zpISO(30)}" onchange="zpDatum(this.value)">`;
  }
  h+=`<div class="mbtns"><button class="btn-ghost" onclick="closeZprava()">Zrušit</button><button class="btn-primary" onclick="zpSubmit()">Odeslat průvodcům</button></div>`;
  return h+`</div></div>`;
}
// Prototyp žije v červnu 2026 – převod den ↔ hodnota <input type="date">.
const zpISO=d=>`2026-06-${String(d).padStart(2,'0')}`;
window.openZprava=day=>{const d=(day>=NOW.d&&day<=30&&!isWE(day))?day:TODAY;
  zpDraft={den:d,typ:'',kdo:'',cas:'',text:''};zpModal=true;render();};
window.closeZprava=()=>{zpModal=false;render();};
/* Datum z nativního pickeru. Víkend jde v pickeru vybrat (zakázat konkrétní dny neumí),
   proto se odmítá tady – s vysvětlením, ne tichým přeskočením. */
window.zpDatum=v=>{const d=+String(v).slice(-2);
  if(!d||d<NOW.d||d>30){showToast('Vyberte den v červnu, ode dneška dál');render();return;}
  if(isWE(d)){showToast('O víkendu se do školky nechodí');render();return;}
  zpDraft.den=d;render();};
window.zpTyp=k=>{zpDraft.typ=k;render();};
/* Bez render() – překreslení by zničilo <input> a rodič by přišel o kurzor uprostřed psaní
   (týž důvod, proč hledání používá renderKeepFocus). */
window.zpSet=(f,v)=>{zpDraft[f]=v;};
window.zpSubmit=()=>{
  const c=cur(), p=zpPotrebuje(zpDraft.typ);
  if(!zpDraft.typ){showToast('Vyberte, čeho se to týká');return;}
  if(p==='kdo'&&!zpDraft.kdo.trim()){showToast('Doplňte, kdo dítě vyzvedne');return;}
  if(p==='cas'&&!zpDraft.cas.trim()){showToast('Doplňte čas');return;}
  if(!p&&!zpDraft.text.trim()){showToast('Napište, co mají průvodci vědět');return;}
  c.zpravy.unshift({id:uid(),den:zpDraft.den,typ:zpDraft.typ,kdo:zpDraft.kdo.trim(),
    cas:zpDraft.cas.trim(),text:zpDraft.text.trim(),odeslano:zpDraft.den===TODAY?'dnes':`${zpDraft.den}. 6.`});
  // ať je nový vzkaz vidět bez hledání – dashboard přepneme na den, kterého se týká
  if(section==='prehled')dashDay=zpDraft.den;
  zpModal=false;render();
  showToast('Informace odeslána průvodcům');
};
window.zpSmazat=id=>{const c=cur();c.zpravy=c.zpravy.filter(z=>z.id!==id);render();showToast('Informace stažena');};
