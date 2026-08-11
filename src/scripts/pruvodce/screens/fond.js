/* SCREEN: PRUVODCE_FOND */
let FONDHIST=[];
let fondFormOpen=false, odecet=null, fondChild=-1;

function spanDay(a){let d=a.day;const end=a.dayEnd||a.day;while(d<=end&&isWE(d))d++;return d;}
function presentIdx(a){const d=spanDay(a);if(isWE(d))return [];return data.map((c,i)=>i).filter(i=>{const k=getCode(data[i],d);return k&&k!=='OM';});}
function renderFond(){
  if(odecet)return renderOdecet();
  if(fondChild>=0)return renderFondChild(fondChild);
  const paidAkce=[...AKCE].filter(a=>a.paid>0).sort((a,b)=>a.day-b.day);
  let h=`<div class="doch">`;
  h+=`<div class="vhead">Placené akce</div>`;
  h+= paidAkce.length? `<div class="fond-akce">`+paidAkce.map(a=>`<div class="frow"><span class="adate">${dayLbl(a)}</span><div style="flex:1"><div class="aname">${a.name}</div><div class="ameta">${a.paid} Kč/dítě</div></div>${a.done?'<span class="bdg pre" style="padding:6px 10px">odečteno ✓</span>':`<button class="odbtn" onclick="startOdecet('${a.id}')">Odečíst</button>`}</div>`).join('')+`</div>` : `<div class="empty">Žádné placené akce. Cenu nastavíš u akce v Plán &amp; program.</div>`;
  h+=`<div class="vhead">Ruční čerpání (celá třída)</div>`;
  h+=`<button class="addbig" onclick="togFond()">+ Přidat čerpání (např. materiál)</button>`;
  if(fondFormOpen)h+=`<div class="tile"><label class="pl">Co se čerpalo</label><input class="pin" id="f-name" placeholder="např. Výtvarný materiál"><label class="pl">Kdy</label><input class="pin" id="f-date" placeholder="např. červen 2026"><label class="pl">Částka na dítě (Kč)</label><input class="pin" id="f-amt" type="number" placeholder="0"><div class="mbtns"><button class="btn-ghost" onclick="togFond()">Zrušit</button><button class="btn-primary" onclick="addFond()">Strhnout celé třídě</button></div></div>`;
  h+=`<div class="vhead">Zůstatky dětí</div>`;
  h+=`<div class="fond-grid">`+data.map((c,i)=>({c,i})).sort(byAlpha).map(({c,i})=>`<div class="row"><div class="rmain" onclick="openFondChild(${i})">${avatar(c,26)}<span class="nm">${full(c)}</span><span class="ind" style="color:${c.fond<300?'var(--color-danger)':'var(--color-primary)'};font-weight:600">${c.fond.toLocaleString('cs-CZ')} Kč ›</span></div></div>`).join('')+`</div>`;
  if(FONDHIST.length){h+=`<div class="vhead">Historie čerpání</div>`;
    FONDHIST.forEach(x=>{h+=`<div class="frow"><div style="flex:1"><div class="aname">${x.name}</div><div class="ameta">${x.n}× ${x.amt} Kč = ${(x.n*x.amt).toLocaleString('cs-CZ')} Kč</div></div><button class="odbtn ghostred" onclick="stornoFond(${x.id})">Vrátit</button></div>`;});
    h+=`<div class="note2">Spletl/a ses? „Vrátit" čerpání stornuje – částka se dětem přičte zpět.</div>`;}
  return h+`</div>`;
}
// Detail fondu konkrétního dítěte – zůstatek + historie odečtů (c.fondLog).
function renderFondChild(i){
  const c=data[i];
  let h=`<div class="doch"><button class="back" onclick="closeFondChild()">← Zpět na fond</button>`;
  h+=`<div class="dite-head"><div class="pav">${avatar(c,64)}</div><div class="pname">${full(c)}</div><div class="pfull">Kulturní fond</div></div>`;
  h+=`<div class="fond-detail">`;
  h+=`<div class="tile"><div class="tlab">Zůstatek</div><div class="fond-big" style="color:${c.fond<300?'var(--color-danger)':'var(--color-primary-strong)'}">${c.fond.toLocaleString('cs-CZ')} Kč</div><div class="note2" style="margin:8px 0 0">Fond je veden per dítě. Po akci se strhne jen dětem, které ten den přišly a šly na akci.</div></div>`;
  h+=`<div class="tile"><div class="tlab">Historie čerpání</div>`+(c.fondLog&&c.fondLog.length?c.fondLog.map(l=>`<div class="np"><span>${l.name} · ${l.date}</span><b style="color:var(--color-danger)">−${l.amt} Kč</b></div>`).join(''):`<div class="empty">Zatím se nic nečerpalo.</div>`)+`</div>`;
  h+=`</div>`;
  return h+`</div>`;
}
function renderOdecet(){
  const a=AKCE.find(x=>x.id===odecet.akceId), d=spanDay(a), wdi=wd(d);
  const present=isWE(d)?[]:data.map((c,i)=>({c,i})).filter(x=>{const k=getCode(x.c,d);return k&&k!=='OM';});
  let h=`<button class="back" onclick="cancelOdecet()">← Zpět na fond</button>`;
  h+=`<div class="tile"><div class="tlab">Odečet po akci</div><div style="font-family:var(--font-serif);font-size:17px;color:var(--color-primary-strong)">${a.name}</div><div class="ameta">${dayLbl(a)} · ${a.paid} Kč/dítě</div></div>`;
  h+=`<div class="note2" style="margin:0 2px 8px">Přítomných ${d}. 6.: <b>${present.length}</b>. Vyber, kdo se akce zúčastnil – strhne se jen jim.</div>`;
  h+=`<div class="filters">`+[['vse','Celá třída'],['pre','Jen předškoláci'],['vlastni','Vlastní výběr']].map(g=>`<button class="${odecet.group===g[0]?'on':''}" onclick="setOdGroup('${g[0]}')">${g[1]}</button>`).join('')+`</div>`;
  h+=`<input class="search" placeholder="Najít dítě…" value="${esc(odQuery)}" oninput="onOdSearch(this.value)">`;
  h+=`<div class="rosterbox">`+(present.length?present.filter(x=>!odQuery||norm(full(x.c)).includes(norm(odQuery))).sort(byAlpha).map(x=>`<div class="row"><div class="rmain" onclick="togOdChild(${x.i})"><span class="chk ${odecet.sel.has(x.i)?'on':''}">${odecet.sel.has(x.i)?'✓':''}</span>${avatar(x.c,26)}<span class="nm">${full(x.c)}</span>${x.c.predskolak?'<span class="bdg pre">předšk.</span>':''}<span class="ind" style="color:var(--color-text-muted)">${x.c.fond.toLocaleString('cs-CZ')} Kč</span></div></div>`).join('') : '<div class="empty">Ten den nikdo nepřišel.</div>')+`</div>`;
  const n=odecet.sel.size, tot=n*a.paid;
  h+=`<div class="tile" style="margin-top:11px"><div class="np"><span>Vybráno dětí</span><b>${n}</b></div><div class="np"><span>Strhne se celkem</span><b>${tot.toLocaleString('cs-CZ')} Kč</b></div></div>`;
  h+=`<button class="btn-primary btn-block" onclick="confirmOdecet()">Strhnout z fondu</button>`;
  return h;
}
window.openFondChild=i=>{fondChild=i;render();};
window.closeFondChild=()=>{fondChild=-1;render();};
window.onOdSearch=v=>{odQuery=v;renderKeepFocus();};
window.togFond=()=>{fondFormOpen=!fondFormOpen;render();};
window.addFond=()=>{const n=document.getElementById('f-name').value.trim(),d=document.getElementById('f-date').value.trim(),amt=Number(document.getElementById('f-amt').value)||0;if(!n){showToast('Napiš, co se čerpalo');return;}const idxs=data.map((c,i)=>i);idxs.forEach(i=>{data[i].fond-=amt;data[i].fondLog.unshift({name:n,date:d||'–',amt});});FONDHIST.unshift({id:Date.now(),name:n,amt,n:idxs.length,idxs,akceId:null});fondFormOpen=false;render();showToast('Strženo celé třídě ✓');};
window.stornoFond=id=>{const k=FONDHIST.findIndex(x=>x.id===id);if(k<0)return;const x=FONDHIST[k];x.idxs.forEach(i=>{data[i].fond+=x.amt;const li=data[i].fondLog.findIndex(l=>l.name===x.name&&l.amt===x.amt);if(li>=0)data[i].fondLog.splice(li,1);});if(x.akceId){const a=AKCE.find(y=>y.id===x.akceId);if(a)a.done=false;}FONDHIST.splice(k,1);render();showToast('Čerpání vráceno ✓');};
window.startOdecet=id=>{const a=AKCE.find(x=>x.id===id);odecet={akceId:id,group:'vse',sel:new Set(presentIdx(a))};render();};
window.cancelOdecet=()=>{odecet=null;render();};
window.setOdGroup=g=>{const a=AKCE.find(x=>x.id===odecet.akceId),pres=presentIdx(a);if(g==='vse')odecet.sel=new Set(pres);else if(g==='pre')odecet.sel=new Set(pres.filter(i=>data[i].predskolak));odecet.group=g;render();};
window.togOdChild=i=>{odecet.group='vlastni';odecet.sel.has(i)?odecet.sel.delete(i):odecet.sel.add(i);render();};
window.confirmOdecet=()=>{const a=AKCE.find(x=>x.id===odecet.akceId);if(!odecet.sel.size){showToast('Nikdo nevybrán');return;}const n=odecet.sel.size;const idxs=[...odecet.sel];idxs.forEach(i=>{data[i].fond-=a.paid;data[i].fondLog.unshift({name:a.name,date:dayLbl(a),amt:a.paid});});a.done=true;FONDHIST.unshift({id:Date.now(),name:a.name,amt:a.paid,n,idxs,akceId:a.id});odecet=null;odQuery='';render();showToast('Strženo '+n+'× '+a.paid+' Kč ✓');};
