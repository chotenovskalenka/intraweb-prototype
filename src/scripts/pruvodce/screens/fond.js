/* SCREEN: PRUVODCE_FOND */
let FONDHIST=[];
let fondFormOpen=false, odecet=null, fondChild=-1;
let fondQuery='', fondSort='nm', fondDir=1;
// rozepsané ruční čerpání: údaje + výběr dětí (drží se i mezi překreslením)
let fondDraft={name:'',date:'',amt:''}, fondSel=new Set(), fondGroup='vse', fondQ='';
const FOND_SLOUPCE=[['nm','Dítě'],['fond','Zůstatek'],['predskolak','Předškolák'],['cerpani','Čerpání']];
// pod 300 Kč je zůstatek varovný – rodiče je potřeba vyzvat k doplnění
const fondBarva=c=>c.fond<300?'var(--color-danger)':'var(--color-primary)';
function fondList(){
  return data.map((c,i)=>({c,i}))
    .filter(x=>!fondQuery||norm(full(x.c)).includes(norm(fondQuery)))
    .sort((a,b)=>{
      let r=0;
      if(fondSort==='fond')r=a.c.fond-b.c.fond;
      else if(fondSort==='predskolak')r=(a.c.predskolak?1:0)-(b.c.predskolak?1:0);
      else if(fondSort==='cerpani')r=(a.c.fondLog||[]).length-(b.c.fondLog||[]).length;
      else r=a.c.n.localeCompare(b.c.n,'cs');
      return r*fondDir || a.c.n.localeCompare(b.c.n,'cs');
    });
}

/* Výběr dětí – stejná komponenta pro odečet po akci i pro ruční čerpání. Peníze se nikdy
   nestrhávají naslepo celé třídě: skupinové zkratky jen předvyberou, doladit jde po dětech. */
function pickerHTML(pool,sel,group,fnGroup,fnTog,query,fnQuery){
  let h=`<div class="filters">`+[['vse','Celá třída'],['pre','Jen předškoláci'],['vlastni','Vlastní výběr']]
    .map(g=>`<button class="${group===g[0]?'on':''}" onclick="${fnGroup}('${g[0]}')">${g[1]}</button>`).join('')+`</div>`;
  h+=`<input class="search" placeholder="Najít dítě…" value="${esc(query)}" oninput="${fnQuery}(this.value)">`;
  const vidno=pool.filter(x=>!query||norm(full(x.c)).includes(norm(query))).sort(byAlpha);
  h+=`<div class="rosterbox">`+(vidno.length?vidno.map(x=>`<div class="row"><div class="rmain" onclick="${fnTog}(${x.i})"><span class="chk ${sel.has(x.i)?'on':''}">${sel.has(x.i)?'✓':''}</span>${avatar(x.c,26)}<span class="nm">${full(x.c)}</span>${x.c.predskolak?'<span class="bdg pre">předšk.</span>':''}<span class="ind" style="color:var(--color-text-muted)">${x.c.fond.toLocaleString('cs-CZ')} Kč</span></div></div>`).join('') : '<div class="empty">Nikdo neodpovídá hledání.</div>')+`</div>`;
  return h;
}
function souhrnHTML(n,castka,popisek,akce){
  return `<div class="tile" style="margin-top:11px"><div class="np"><span>Vybráno dětí</span><b>${n}</b></div>`+
    `<div class="np"><span>${popisek}</span><b>${(n*castka).toLocaleString('cs-CZ')} Kč</b></div></div>`+akce;
}
function spanDay(a){let d=a.day;const end=a.dayEnd||a.day;while(d<=end&&isWE(d))d++;return d;}
function presentIdx(a){const d=spanDay(a);if(isWE(d))return [];return data.map((c,i)=>i).filter(i=>{const k=getCode(data[i],d);return k&&k!=='OM';});}
function renderFond(){
  if(odecet)return renderOdecet();
  if(fondChild>=0)return renderFondChild(fondChild);
  const paidAkce=[...AKCE].filter(a=>a.paid>0).sort((a,b)=>a.day-b.day);
  let h=`<div class="doch">`;
  h+=`<div class="vhead">Placené akce</div>`;
  h+= paidAkce.length? `<div class="fond-akce">`+paidAkce.map(a=>`<div class="frow"><span class="adate">${dayLbl(a)}</span><div style="flex:1"><div class="aname">${a.name}</div><div class="ameta">${a.paid} Kč/dítě</div></div>${a.done?'<span class="bdg pre" style="padding:6px 10px">odečteno ✓</span>':(hospodar?`<button class="odbtn" onclick="startOdecet('${a.id}')">Odečíst</button>`:'<span class="dt-no">čeká na hospodářku</span>')}</div>`).join('')+`</div>` : `<div class="empty">Žádné placené akce. Cenu nastavíš u akce v Plán &amp; program.</div>`;
  // „+ Přidat čerpání" je v topbaru (core.js) – stejně jako „+ Nová akce" a „+ Nová novinka"
  if(fondFormOpen)h+=`<div class="vhead">Ruční čerpání</div>`;
  if(fondFormOpen){
    h+=`<div class="tile"><div class="fond-form">`+
      `<div><label class="pl">Co se čerpalo</label><input class="pin" id="f-name" value="${esc(fondDraft.name)}" oninput="setFondDraft('name',this.value)" placeholder="např. Výtvarný materiál"></div>`+
      `<div><label class="pl">Kdy</label><input class="pin" id="f-date" value="${esc(fondDraft.date)}" oninput="setFondDraft('date',this.value)" placeholder="např. červen 2026"></div>`+
      `<div><label class="pl">Částka na dítě (Kč)</label><input class="pin" id="f-amt" type="number" min="0" value="${fondDraft.amt||''}" oninput="setFondDraft('amt',this.value)" placeholder="0"></div>`+
      `</div></div>`;
    h+=`<div class="note2">Vyber, komu se má strhnout – materiál se často pořizuje jen pro část třídy.</div>`;
    h+=pickerHTML(data.map((c,i)=>({c,i})),fondSel,fondGroup,'setFondGroup','togFondChild',fondQ,'onFondQ');
    h+=souhrnHTML(fondSel.size,Number(fondDraft.amt)||0,'Strhne se celkem',
      `<div class="mbtns"><button class="btn-ghost" onclick="togFond()">Zrušit</button><button class="btn-primary" onclick="addFond()">Strhnout vybraným</button></div>`);
  }
  h+=`<div class="vhead">Zůstatky dětí</div>`;
  const list=fondList();
  h+=`<div class="deti-bar"><input class="search" placeholder="Najít dítě…" value="${esc(fondQuery)}" oninput="onFondSearch(this.value)">`+
    `<button class="btn-ghost deti-exp" onclick="exportFond()">Stáhnout jako CSV</button></div>`;
  if(!list.length)h+=`<div class="empty">Nikdo neodpovídá hledání.</div>`;
  else{
    // stejný vzor jako soupis dětí: na mobilu karty, na desktopu tabulka
    h+=`<div class="deti-cards">`+list.map(({c,i})=>`<div class="row"><div class="rmain" onclick="openFondChild(${i})">${avatar(c,26)}<span class="nm">${full(c)}</span><span class="ind" style="color:${fondBarva(c)};font-weight:600">${c.fond.toLocaleString('cs-CZ')} Kč ›</span></div></div>`).join('')+`</div>`;
    h+=`<table class="dtab"><thead><tr>`+FOND_SLOUPCE.map(([k,lab])=>{
      const on=fondSort===k;
      return `<th class="${on?'srt':''}" aria-sort="${on?(fondDir>0?'ascending':'descending'):'none'}"><button onclick="setFondSort('${k}')">${lab}<span class="arw">${on?(fondDir>0?'▲':'▼'):'⇅'}</span></button></th>`;
    }).join('')+`</tr></thead><tbody>`+
      list.map(({c,i})=>`<tr onclick="openFondChild(${i})"><td class="nm">${avatar(c,28)}${full(c)}</td>`+
        `<td class="dt-fond" style="color:${fondBarva(c)};font-weight:600">${c.fond.toLocaleString('cs-CZ')} Kč</td>`+
        `<td>${c.predskolak?'<span class="bdg pre">ano</span>':'<span class="dt-no">–</span>'}</td>`+
        `<td>${c.fondLog&&c.fondLog.length?`${c.fondLog.length}× · naposled ${c.fondLog[0].name}`:'<span class="dt-no">zatím nic</span>'}</td></tr>`).join('')+
      `</tbody></table>`;
  }
  if(FONDHIST.length){h+=`<div class="vhead">Historie čerpání</div>`;
    FONDHIST.forEach(x=>{h+=`<div class="frow"><div style="flex:1"><div class="aname">${x.name}</div><div class="ameta">${x.n}× ${x.amt} Kč = ${(x.n*x.amt).toLocaleString('cs-CZ')} Kč</div></div>${hospodar?`<button class="odbtn ghostred" onclick="stornoFond(${x.id})">Vrátit</button>`:''}</div>`;});
    h+=`<div class="note2">Spletl/a ses? „Vrátit" čerpání stornuje – částka se dětem přičte zpět.</div>`;}
  return h+`</div>`;
}
// Detail fondu konkrétního dítěte – zůstatek + historie odečtů (c.fondLog).
function renderFondChild(i){
  const c=data[i];
  let h=`<div class="doch"><button class="back" onclick="closeFondChild()">← Zpět na fond</button>`;
  h+=`<div class="dite-head"><div class="pav">${avatar(c,64)}</div><div class="pname">${full(c)}</div><div class="pfull">Kulturní fond</div></div>`;
  h+=`<div class="fond-detail">`;
  h+=`<div class="tile"><div class="ch">Zůstatek</div><div class="fond-big" style="color:${c.fond<300?'var(--color-danger)':'var(--color-primary-strong)'}">${c.fond.toLocaleString('cs-CZ')} Kč</div><div class="note2">Fond je veden per dítě. Po akci se strhne jen dětem, které ten den přišly a šly na akci.</div></div>`;
  h+=`<div class="tile"><div class="ch">Historie čerpání</div>`+(c.fondLog&&c.fondLog.length?c.fondLog.map(l=>`<div class="np"><span>${l.name} · ${l.date}</span><b style="color:var(--color-danger)">−${l.amt} Kč</b></div>`).join(''):`<div class="empty">Zatím se nic nečerpalo.</div>`)+`</div>`;
  h+=`</div>`;
  return h+`</div>`;
}
function renderOdecet(){
  const a=AKCE.find(x=>x.id===odecet.akceId), d=spanDay(a), wdi=wd(d);
  const present=isWE(d)?[]:data.map((c,i)=>({c,i})).filter(x=>{const k=getCode(x.c,d);return k&&k!=='OM';});
  let h=`<div class="doch"><button class="back" onclick="cancelOdecet()">← Zpět na fond</button>`;
  h+=`<div class="tile"><div class="ch">Odečet po akci</div><div class="aname" style="font-size:var(--text-title)">${a.name}</div>`+
    `<div class="ameta">${dayLbl(a)} · ${a.paid} Kč/dítě</div>`+
    `<div class="np" style="border-top:1px solid var(--color-border);margin-top:8px;padding-top:9px"><span>Přítomných ${d}. 6.</span><b>${present.length}</b></div></div>`;
  h+=pickerHTML(present,odecet.sel,odecet.group,'setOdGroup','togOdChild',odQuery,'onOdSearch');
  h+=souhrnHTML(odecet.sel.size,a.paid,'Strhne se celkem',
    `<button class="btn-primary tema-save" onclick="confirmOdecet()">Strhnout z fondu</button>`);
  return h+`</div>`;
}
window.onFondSearch=v=>{fondQuery=v;renderKeepFocus();};
window.setFondSort=k=>{if(fondSort===k)fondDir=-fondDir;else{fondSort=k;fondDir=1;}render();};
window.exportFond=()=>{
  const list=fondList();
  stahniCSV('kulturni-fond-vhaaji-2026-06.csv',['Jméno','Zůstatek (Kč)','Předškolák','Počet čerpání'],
    list.map(({c})=>[full(c),c.fond,c.predskolak?'ano':'',(c.fondLog||[]).length]));
  showToast('Staženo '+pocetDeti(list.length)+' ✓');
};
window.openFondChild=i=>{fondChild=i;render();};
window.closeFondChild=()=>{fondChild=-1;render();};
window.onOdSearch=v=>{odQuery=v;renderKeepFocus();};
window.togFond=()=>{fondFormOpen=!fondFormOpen;
  if(fondFormOpen){fondDraft={name:'',date:'',amt:''};fondSel=new Set(data.map((c,i)=>i));fondGroup='vse';fondQ='';}
  render();};
window.setFondDraft=(f,v)=>{fondDraft[f]=v;if(f==='amt')render();};   // částka mění souhrn, text ne (kurzor)
window.setFondGroup=g=>{if(g==='vse')fondSel=new Set(data.map((c,i)=>i));
  else if(g==='pre')fondSel=new Set(data.map((c,i)=>i).filter(i=>data[i].predskolak));
  fondGroup=g;render();};
window.togFondChild=i=>{fondGroup='vlastni';fondSel.has(i)?fondSel.delete(i):fondSel.add(i);render();};
window.onFondQ=v=>{fondQ=v;renderKeepFocus();};
window.addFond=()=>{
  const n=fondDraft.name.trim(),d=fondDraft.date.trim(),amt=Number(fondDraft.amt)||0;
  if(!n){showToast('Napiš, co se čerpalo');return;}
  if(!fondSel.size){showToast('Vyber, komu se má strhnout');return;}
  const idxs=[...fondSel];
  idxs.forEach(i=>{data[i].fond-=amt;data[i].fondLog.unshift({name:n,date:d||'–',amt});});
  FONDHIST.unshift({id:Date.now(),name:n,amt,n:idxs.length,idxs,akceId:null});
  fondFormOpen=false;render();showToast('Strženo '+pocetDeti(idxs.length)+' ✓');
};
window.stornoFond=id=>{const k=FONDHIST.findIndex(x=>x.id===id);if(k<0)return;const x=FONDHIST[k];x.idxs.forEach(i=>{data[i].fond+=x.amt;const li=data[i].fondLog.findIndex(l=>l.name===x.name&&l.amt===x.amt);if(li>=0)data[i].fondLog.splice(li,1);});if(x.akceId){const a=AKCE.find(y=>y.id===x.akceId);if(a)a.done=false;}FONDHIST.splice(k,1);render();showToast('Čerpání vráceno ✓');};
window.startOdecet=id=>{const a=AKCE.find(x=>x.id===id);odecet={akceId:id,group:'vse',sel:new Set(presentIdx(a))};render();};
window.cancelOdecet=()=>{odecet=null;render();};
window.setOdGroup=g=>{const a=AKCE.find(x=>x.id===odecet.akceId),pres=presentIdx(a);if(g==='vse')odecet.sel=new Set(pres);else if(g==='pre')odecet.sel=new Set(pres.filter(i=>data[i].predskolak));odecet.group=g;render();};
window.togOdChild=i=>{odecet.group='vlastni';odecet.sel.has(i)?odecet.sel.delete(i):odecet.sel.add(i);render();};
window.confirmOdecet=()=>{const a=AKCE.find(x=>x.id===odecet.akceId);if(!odecet.sel.size){showToast('Nikdo nevybrán');return;}const n=odecet.sel.size;const idxs=[...odecet.sel];idxs.forEach(i=>{data[i].fond-=a.paid;data[i].fondLog.unshift({name:a.name,date:dayLbl(a),amt:a.paid});});a.done=true;FONDHIST.unshift({id:Date.now(),name:a.name,amt:a.paid,n,idxs,akceId:a.id});odecet=null;odQuery='';render();showToast('Strženo '+n+'× '+a.paid+' Kč ✓');};
