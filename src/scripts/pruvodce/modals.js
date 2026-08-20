/* MODALS: PRUVODCE – renderModalRoot + HTML modálů a jejich handlery */
function d2date(day){return day?`2026-06-${String(day).padStart(2,'0')}`:'';}
function renderModalRoot(){
  const r=document.getElementById('modalRoot');
  if(modal){r.innerHTML=akceModalHTML();return;}
  if(shiftM){r.innerHTML=shiftModalHTML();return;}
  if(fondM){r.innerHTML=fondModalHTML();return;}
  if(cellM){r.innerHTML=cellModalHTML();return;}
  if(detailA){r.innerHTML=akceDetailHTML();return;}
  if(novM){r.innerHTML=novModalHTML();return;}
  if(novForm){r.innerHTML=novFormHTML();return;}
  r.innerHTML='';
}
function akceDetailHTML(){
  const a=AKCE.find(x=>x.id===detailA);if(!a)return '';
  const rows=[['Datum',dayLbl(a)],['Čas',a.time],['Místo',a.place],['Cena z fondu',a.paid?`${a.paid} Kč/dítě`:''],['Poznámka',a.note]].filter(r=>r[1]);
  return `<div class="modal-scrim" onclick="if(event.target===this)closeAkceDetail()"><div class="modal">
    <h3>${a.name}</h3>
    ${rows.map(r=>`<div class="np"><span>${r[0]}</span><b style="font-weight:500;text-align:right;max-width:62%">${r[1]}</b></div>`).join('')}
    <div class="mbtns"><button class="btn-ghost" onclick="closeAkceDetail()">Zavřít</button><button class="btn-primary" onclick="editFromDetail()">Upravit</button></div>
  </div></div>`;
}
function cellModalHTML(){
  const c=data[cellM.ci],d=cellM.d,today=d===TODAYD;
  // dnešek se řídí stavem (přítomen/omluven/neomluven); budoucí dny plánovaným kódem docházky
  const opts=today?[['pritomen','Přítomen'],['omluveno','Omluven'],['neomluveno','Neomluven']]
    :[['C','Celodenní'],['D','Dopolední'],['O','Odpolední'],['OM','Omluven'],['','Nepřítomen']];
  const cur=today?c.status:getCode(c,d);
  return `<div class="modal-scrim" onclick="if(event.target===this)closeCell()"><div class="modal">
    <h3>Docházka – ${c.n}</h3><div class="pl" style="margin-top:-2px">${DOW[wd(d)]} ${d}. 6.${today?' · dnes':''}</div>${d<TODAYD?'<div class="note2 note-info" style="padding:8px 11px;border-radius:var(--radius-sm);border:1px solid var(--edge-primary)">Zpětná oprava uzavřeného dne – vidí ji vedení.</div>':''}
    <div class="pchips">${opts.map(o=>`<button class="${cur===o[0]?'on':''}" onclick="setCell('${o[0]}')">${o[1]}</button>`).join('')}</div>
    <div class="mbtns"><button class="btn-ghost" onclick="closeCell()">Zavřít</button></div>
  </div></div>`;
}
function akceModalHTML(){
  return `<div class="modal-scrim" onclick="if(event.target===this)closeModal()"><div class="modal">
    <h3>${modal.id?'Upravit akci':'Nová akce'}</h3>
    <label class="pl">Název akce</label><input class="pin" value="${esc(modal.name)}" oninput="setMF('name',this.value)" placeholder="napiš název akce…">
    <label class="pl">Datum (od – do)</label><div class="mrow2"><input class="pin" type="date" min="2026-06-01" max="2026-06-30" value="${d2date(modal.day)}" oninput="setMDate('day',this.value)"><input class="pin" type="date" min="2026-06-01" max="2026-06-30" value="${d2date(modal.dayEnd)}" oninput="setMDate('dayEnd',this.value)"></div>
    <label class="pl">Čas</label><input class="pin" value="${esc(modal.time)}" oninput="setMF('time',this.value)" placeholder="nepovinné, např. 15:30">
    <label class="pl">Místo</label><input class="pin" value="${esc(modal.place)}" oninput="setMF('place',this.value)" placeholder="nepovinné">
    <label class="pl">Cena z fondu (Kč/dítě)</label><input class="pin" type="number" min="0" value="${modal.paid||''}" oninput="setMF('paid',this.value)" placeholder="nepovinné – když je akce placená">
    <label class="pl">Poznámka</label><textarea class="pta" oninput="setMF('note',this.value)" placeholder="nepovinné">${escTa(modal.note)}</textarea>
    <div class="mbtns"><button class="btn-ghost" onclick="closeModal()">Zrušit</button><button class="btn-primary" onclick="saveAkce()">Uložit</button></div>
    ${modal.id?`<button class="btn-del" onclick="delAkce()">Smazat akci</button>`:''}
  </div></div>`;
}
function shiftModalHTML(){
  const m=shiftM,g=shiftTyden(shiftT)[m.gi];
  return `<div class="modal-scrim" onclick="if(event.target===this)closeShift()"><div class="modal">
    <h3>Služba – ${g.n}</h3><div class="pl" style="margin-top:-2px">${DOW[m.di]} ${SHIFT_TYDNY[shiftT].od+m.di}. ${SHIFT_TYDNY[shiftT].m}.</div>
    <div class="mini" style="margin-bottom:6px"><button class="${m.on?'on':''}" onclick="setShiftOn(true)">Slouží</button><button class="${!m.on?'on':''}" onclick="setShiftOn(false)">Neslouží</button></div>
    ${m.on?`<label class="pl">Příchod</label><input class="pin" type="time" value="${m.s}" oninput="setShiftF('s',this.value)"><label class="pl">Odchod</label><input class="pin" type="time" value="${m.e}" oninput="setShiftF('e',this.value)">`
    :`<label class="pl">Důvod (nepovinné)</label><select class="selin" style="width:100%" onchange="setShiftF('reason',this.value)"><option value="">–</option>${OFFREASONS.map(o=>`<option value="${o}" ${m.reason===o?'selected':''}>${o}</option>`).join('')}</select>`}
    <div class="mbtns"><button class="btn-ghost" onclick="closeShift()">Zrušit</button><button class="btn-primary" onclick="saveShift()">Uložit</button></div>
  </div></div>`;
}
/* Ruční čerpání z fondu. V modalu, a ne rozbalené v obsahu: je to úkon (vyplnit + vybrat
   komu + potvrdit), ne něco k prohlížení, a rozbalený formulář odtlačil zůstatky dětí pryč. */
function fondModalHTML(){
  const m=fondM,castka=Number(m.amt)||0;
  return `<div class="modal-scrim" onclick="if(event.target===this)closeFond()"><div class="modal modal-wide">
    <h3>Ruční čerpání z fondu</h3>
    <div class="fond-form">
      <div><label class="pl">Co se čerpalo</label><input class="pin" value="${esc(m.name)}" oninput="setFondDraft('name',this.value)" placeholder="např. Výtvarný materiál"></div>
      <div><label class="pl">Kdy</label><select class="pin" onchange="setFondDraft('date',this.value)">${MESICE_ROKU.map(x=>`<option value="${x}" ${m.date===x?'selected':''}>${x}</option>`).join('')}</select></div>
      <div><label class="pl">Částka na dítě (Kč)</label><input class="pin" type="number" min="0" value="${m.amt}" oninput="setFondDraft('amt',this.value)" placeholder="0"></div>
    </div>
    <label class="pl">Komu strhnout</label>
    ${pickerHTML(data.map((c,i)=>({c,i})),m.sel,m.group,'setFondGroup','togFondChild',m.q,'onFondQ')}
    ${souhrnHTML(m.sel.size,castka,'Strhne se celkem','')}
    <div class="mbtns"><button class="btn-ghost" onclick="closeFond()">Zrušit</button><button class="btn-primary" onclick="addFond()">Strhnout vybraným</button></div>
  </div></div>`;
}
window.togFond=()=>{fondM={name:'',date:MESIC_TED,amt:'',sel:new Set(data.map((c,i)=>i)),group:'vse',q:''};renderModalRoot();};
window.closeFond=()=>{fondM=null;renderModalRoot();};
// částka mění souhrn → překreslit; text ne, jinak by utekl kurzor
window.setFondDraft=(f,v)=>{fondM[f]=v;if(f==='amt')renderModalRoot();};
window.setFondGroup=g=>{if(g==='vse')fondM.sel=new Set(data.map((c,i)=>i));
  else if(g==='pre')fondM.sel=new Set(data.map((c,i)=>i).filter(i=>data[i].predskolak));
  fondM.group=g;renderModalRoot();};
window.togFondChild=i=>{fondM.group='vlastni';fondM.sel.has(i)?fondM.sel.delete(i):fondM.sel.add(i);renderModalRoot();};
// hledání uvnitř modalu – vlastní obdoba renderKeepFocus (ta míří na #content)
window.onFondQ=v=>{const a=document.activeElement,pos=a&&a.selectionStart;fondM.q=v;renderModalRoot();
  const inp=document.querySelector('#modalRoot .search');if(inp){inp.focus();try{inp.setSelectionRange(pos,pos);}catch(e){}}};
window.addFond=()=>{
  const m=fondM,n=m.name.trim(),d=m.date.trim(),amt=Number(m.amt)||0;
  if(!n){showToast('Napiš, co se čerpalo');return;}
  if(!m.sel.size){showToast('Vyber, komu se má strhnout');return;}
  const idxs=[...m.sel];
  idxs.forEach(i=>{data[i].fond-=amt;data[i].fondLog.unshift({name:n,date:d||'–',amt});});
  FONDHIST.unshift({id:Date.now(),name:n,amt,n:idxs.length,idxs,akceId:null});
  fondM=null;renderModalRoot();render();showToast('Strženo '+pocetDeti(idxs.length)+' ✓');
};

window.openAkce=id=>{
  if(id){const a=AKCE.find(x=>x.id===id);modal={id:a.id,name:a.name,day:a.day,dayEnd:a.dayEnd||'',time:a.time||'',place:a.place||'',note:a.note||'',paid:a.paid||''};}
  else{modal={id:null,name:'',day:8,dayEnd:'',time:'',place:'',note:'',paid:''};}
  renderModalRoot();
};
window.closeModal=()=>{modal=null;renderModalRoot();};
window.setMF=(f,v)=>{modal[f]=v;};
window.setMDate=(f,v)=>{modal[f]=v?Number(v.slice(8,10)):'';};
window.saveAkce=()=>{
  if(!modal.name.trim()){showToast('Napiš název akce');return;}
  const prev=modal.id?AKCE.find(x=>x.id===modal.id):null;
  const a={id:modal.id||('a'+(uid++)),name:modal.name.trim(),day:Number(modal.day)||1,dayEnd:modal.dayEnd?Number(modal.dayEnd):null,time:(modal.time||'').trim(),place:(modal.place||'').trim(),note:(modal.note||'').trim(),paid:modal.paid?Number(modal.paid):0,done:prev?prev.done:false};
  if(modal.id){const k=AKCE.findIndex(x=>x.id===modal.id);if(k>=0)AKCE[k]=a;}else{AKCE.push(a);}
  modal=null;renderModalRoot();render();showToast('Uloženo ✓');
};
window.delAkce=()=>{AKCE=AKCE.filter(x=>x.id!==modal.id);modal=null;renderModalRoot();render();showToast('Akce smazána');};
window.openShift=(gi,di)=>{const d=shiftTyden(shiftT)[gi].days[di];shiftM={gi,di,on:serving(d)||!d,s:d&&d.s?d.s:'07:30',e:d&&d.e?d.e:'16:00',reason:d&&d.off?d.off:''};renderModalRoot();};
window.closeShift=()=>{shiftM=null;renderModalRoot();};
window.setShiftOn=b=>{shiftM.on=b;renderModalRoot();};
window.setShiftF=(f,v)=>{shiftM[f]=v;};
window.saveShift=()=>{const m=shiftM;shiftTyden(shiftT)[m.gi].days[m.di]=m.on?{s:m.s,e:m.e}:(m.reason?{off:m.reason}:null);shiftM=null;renderModalRoot();render();showToast('Uloženo ✓');};
window.openAkceDetail=id=>{detailA=id;renderModalRoot();};
window.closeAkceDetail=()=>{detailA=null;renderModalRoot();};
window.editFromDetail=()=>{const id=detailA;detailA=null;openAkce(id);};
window.openCell=(ci,d)=>{if(d<TODAYD&&!smiZpetne())return;cellM={ci,d};renderModalRoot();};
window.closeCell=()=>{cellM=null;renderModalRoot();};
window.setCell=code=>{const d=cellM.d;if(d===TODAYD)data[cellM.ci].status=code;else data[cellM.ci].att[d]=code;cellM=null;renderModalRoot();render();showToast('Docházka uložena ✓');};
