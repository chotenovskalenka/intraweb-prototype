/* MODALS: PRUVODCE — renderModalRoot + HTML modálů a jejich handlery */
function d2date(day){return day?`2026-06-${String(day).padStart(2,'0')}`:'';}
function renderModalRoot(){
  const r=document.getElementById('modalRoot');
  if(modal){r.innerHTML=akceModalHTML();return;}
  if(shiftM){r.innerHTML=shiftModalHTML();return;}
  if(cellM){r.innerHTML=cellModalHTML();return;}
  if(detailA){r.innerHTML=akceDetailHTML();return;}
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
  const c=data[cellM.ci],d=cellM.d,cur=getCode(c,d);
  const opts=[['C','Celodenní'],['D','Dopolední'],['O','Odpolední'],['OM','Omluven'],['','Nepřítomen']];
  return `<div class="modal-scrim" onclick="if(event.target===this)closeCell()"><div class="modal">
    <h3>Docházka — ${c.n}</h3><div class="pl" style="margin-top:-2px">${DOW[wd(d)]} ${d}. 6.</div>
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
    <label class="pl">Cena z fondu (Kč/dítě)</label><input class="pin" type="number" min="0" value="${modal.paid||''}" oninput="setMF('paid',this.value)" placeholder="nepovinné — když je akce placená">
    <label class="pl">Poznámka</label><textarea class="pta" oninput="setMF('note',this.value)" placeholder="nepovinné">${escTa(modal.note)}</textarea>
    <div class="mbtns"><button class="btn-ghost" onclick="closeModal()">Zrušit</button><button class="btn-primary" onclick="saveAkce()">Uložit</button></div>
    ${modal.id?`<button class="btn-del" onclick="delAkce()">Smazat akci</button>`:''}
  </div></div>`;
}
function shiftModalHTML(){
  const m=shiftM,g=GUIDESHIFT[m.gi];
  return `<div class="modal-scrim" onclick="if(event.target===this)closeShift()"><div class="modal">
    <h3>Služba — ${g.n}, ${DOW[m.di]}</h3>
    <div class="mini" style="margin-bottom:6px"><button class="${m.on?'on':''}" onclick="setShiftOn(true)">Slouží</button><button class="${!m.on?'on':''}" onclick="setShiftOn(false)">Neslouží</button></div>
    ${m.on?`<label class="pl">Příchod</label><input class="pin" type="time" value="${m.s}" oninput="setShiftF('s',this.value)"><label class="pl">Odchod</label><input class="pin" type="time" value="${m.e}" oninput="setShiftF('e',this.value)">`
    :`<label class="pl">Důvod (nepovinné)</label><select class="selin" style="width:100%" onchange="setShiftF('reason',this.value)"><option value="">—</option>${OFFREASONS.map(o=>`<option value="${o}" ${m.reason===o?'selected':''}>${o}</option>`).join('')}</select>`}
    <div class="mbtns"><button class="btn-ghost" onclick="closeShift()">Zrušit</button><button class="btn-primary" onclick="saveShift()">Uložit</button></div>
  </div></div>`;
}
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
window.openShift=(gi,di)=>{const d=GUIDESHIFT[gi].days[di];shiftM={gi,di,on:serving(d)||!d,s:d&&d.s?d.s:'07:30',e:d&&d.e?d.e:'16:00',reason:d&&d.off?d.off:''};renderModalRoot();};
window.closeShift=()=>{shiftM=null;renderModalRoot();};
window.setShiftOn=b=>{shiftM.on=b;renderModalRoot();};
window.setShiftF=(f,v)=>{shiftM[f]=v;};
window.saveShift=()=>{const m=shiftM;GUIDESHIFT[m.gi].days[m.di]=m.on?{s:m.s,e:m.e}:(m.reason?{off:m.reason}:null);shiftM=null;renderModalRoot();render();showToast('Uloženo ✓');};
window.openAkceDetail=id=>{detailA=id;renderModalRoot();};
window.closeAkceDetail=()=>{detailA=null;renderModalRoot();};
window.editFromDetail=()=>{const id=detailA;detailA=null;openAkce(id);};
window.openCell=(ci,d)=>{if(d<=TODAYD)return;cellM={ci,d};renderModalRoot();};
window.closeCell=()=>{cellM=null;renderModalRoot();};
window.setCell=code=>{data[cellM.ci].att[cellM.d]=code;cellM=null;renderModalRoot();render();showToast('Docházka uložena ✓');};
