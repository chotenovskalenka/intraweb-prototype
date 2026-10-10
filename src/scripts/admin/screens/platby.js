/* SCREEN: ADMIN_PLATBY – faktury napříč školkami (draft-admin 4.2).
   Výzkum: Radka vede splatnosti v tabulce, neplatičům píše e-maily ručně a další upomínka
   „jde zase za měsíc", stahuje faktury pro účetní ručně, stravné je pokaždé jiné; rodiče
   píšou, že nemají zaplaceno, i když mají – párování s bankou neběží.
   Tady: měsíc, souhrn, filtry, tabulka, a akce jako tlačítka se simulovaným výsledkem.
   Fakturační modul (editor faktury, číselné řady, účty) ani párování s bankou se NEDĚLÁ –
   to je Patova infrastruktura; v prototypu je jen stav „čeká na spárování" a ruční označení. */
let plMesic='2026-06', plSkolka='vse', plDruh='vse', plStav='vse', plQuery='', plSel=new Set(), plNahled=null;
const plMes=()=>FAKT_MESICE_A.find(m=>m.key===plMesic);
const kZaplate=f=>f.stav==='uhrazeno'||f.stav==='storno'||f.stav==='preplatek'?0:f.castka-(f.uhrazeno||0);
function plList(){
  return FAKTURY.filter(f=>f.mesic===plMesic)
    .filter(f=>plSkolka==='vse'||f.skolkaId===plSkolka)
    .filter(f=>plDruh==='vse'||f.druh===plDruh)
    .filter(f=>plStav==='vse'||(plStav==='k-reseni'?kZaplate(f)>0:f.stav===plStav))
    .filter(f=>!plQuery||norm(f.dite).includes(norm(plQuery)))
    .sort((a,b)=>kZaplate(b)-kZaplate(a)||a.dite.localeCompare(b.dite,'cs'));
}
function renderPlatby(){
  const m=plMes(), mesic=FAKTURY.filter(f=>f.mesic===plMesic&&(plSkolka==='vse'||f.skolkaId===plSkolka));
  const sum=a=>a.reduce((s,f)=>s+f.castka,0);
  const uhr=mesic.filter(f=>f.stav==='uhrazeno'), kZ=mesic.filter(f=>kZaplate(f)>0), poSpl=mesic.filter(f=>f.stav==='po-splatnosti');
  const i=FAKT_MESICE_A.findIndex(x=>x.key===plMesic);
  let h=`<div class="vhead-row"><div class="vhead">Faktury</div><div class="vhead-act"><div class="dnav">`
    +`<button onclick="stepPlMesic(-1)" ${i<=0?'disabled':''} aria-label="Předchozí měsíc">‹</button><span>${m.lab}</span>`
    +`<button onclick="stepPlMesic(1)" ${i>=FAKT_MESICE_A.length-1?'disabled':''} aria-label="Další měsíc">›</button></div></div></div>`;
  h+=`<div class="nh-sum">`
    +`<div class="tile nh-k"><div class="nh-l">Vystaveno</div><div class="nh-n">${kc(sum(mesic))} Kč</div><div class="nh-s">${mesic.length} faktur · vystaveno ${m.vyst}</div></div>`
    +`<div class="tile nh-k"><div class="nh-l">Uhrazeno</div><div class="nh-n">${kc(sum(uhr))} Kč</div><div class="nh-s">${uhr.length} faktur</div></div>`
    +`<div class="tile nh-k"><div class="nh-l">K úhradě</div><div class="nh-n">${kc(kZ.reduce((s,f)=>s+kZaplate(f),0))} Kč</div><div class="nh-s">${kZ.length} faktur · splatnost ${m.spl}</div></div>`
    +`<div class="tile nh-k"><div class="nh-l">Po splatnosti</div><div class="nh-n ${poSpl.length?'nh-minus':''}">${poSpl.length}</div><div class="nh-s">${poSpl.length?'poslat upomínku':'nic po splatnosti'}</div></div>`
    +`</div>`;
  // vystavení – dvě akce jako v dnešním intrawebu, ale s náhledem dřív, než se něco stane
  h+=`<div class="tile pl-akce"><div class="ch">Vystavit</div><div class="pl-akce-r">`
    +(STRAVNE_KVETEN_VYST?`<span class="pl-hotovo">✓ Stravné za květen vystaveno</span>`:`<button class="btn-primary" onclick="plNahledStravne()">Vystavit stravné za květen</button>`)
    +`<button class="btn-ghost" onclick="showToast('Školné na červenec se vystaví 27. 6. – v prototypu jen náhled')">Vystavit školné na červenec</button>`
    +`</div>`;
  if(plNahled)h+=plNahled;
  h+=`</div>`;
  // filtry
  h+=`<div class="filters">`+[['vse','Všechny školky'],...SKOLKY.map(s=>[s.id,s.nazev])].map(([k,l])=>
      `<button class="${plSkolka===k?'on':''}" onclick="setPl('plSkolka','${k}')" aria-pressed="${plSkolka===k}">${l}</button>`).join('')+`</div>`;
  h+=`<div class="nh-bar"><input class="search" placeholder="Najít dítě…" value="${esc(plQuery)}" oninput="onPlSearch(this.value)">`
    +`<label class="nh-pr">Druh <select class="pin" onchange="setPl('plDruh',this.value)">${[['vse','Vše'],['skolne','Školné'],['stravne','Stravné']].map(([k,l])=>`<option value="${k}"${plDruh===k?' selected':''}>${l}</option>`).join('')}</select></label>`
    +`<label class="nh-pr">Stav <select class="pin" onchange="setPl('plStav',this.value)">${[['vse','Vše'],['k-reseni','K úhradě'],...Object.entries(PLATBASTAVY).map(([k,v])=>[k,v.lab])].map(([k,l])=>`<option value="${k}"${plStav===k?' selected':''}>${l}</option>`).join('')}</select></label></div>`;
  const list=plList();
  // hromadné akce nad vybranými
  if(plSel.size)h+=`<div class="pl-bulk"><span>Vybráno <b>${plSel.size}</b></span>`
    +`<button class="btn-primary" onclick="plUpominka()">Poslat upomínku</button>`
    +`<button class="btn-ghost" onclick="plUhrazeno()">Označit jako uhrazeno</button>`
    +`<button class="nh-zpet" onclick="plSel.clear();render()">Zrušit výběr</button></div>`;
  if(!list.length)return h+`<div class="empty">Nic neodpovídá filtru.</div>`;
  const vse=list.every(f=>plSel.has(f.id));
  h+=`<div class="dtab-wrap"><table class="dtab pl-tab"><thead><tr><th class="pl-ck"><span><input type="checkbox" ${vse?'checked':''} onchange="plVybratVse(this.checked)" aria-label="Vybrat vše"></span></th>`
    +['Dítě','Školka','Období','Částka','K úhradě','Splatnost','Stav'].map(x=>`<th><span>${x}</span></th>`).join('')+`</tr></thead><tbody>`
    +list.map(f=>{const st=PLATBASTAVY[f.stav];return `<tr onclick="plTog('${f.id}')"><td class="pl-ck"><input type="checkbox" ${plSel.has(f.id)?'checked':''} onclick="event.stopPropagation();plTog('${f.id}')" aria-label="Vybrat ${f.dite}"></td>`
      +`<td class="nm">${f.dite}</td><td>${f.skolka}</td><td>${f.obdobi}</td><td>${kc(f.castka)} Kč</td>`
      +`<td>${kZaplate(f)?`<b>${kc(kZaplate(f))} Kč</b>`:'<span class="dt-no">–</span>'}</td>`
      +`<td>${f.spl}${f.poDnu?` <span class="dt-no">· ${f.poDnu} dní po</span>`:''}</td>`
      +`<td><span class="bdg ${st.cls}">${st.lab}</span>${f.upominka?` <span class="dt-no">· upomínka ${f.upominka}</span>`:''}${f.rucne?' <span class="dt-no">· spárováno ručně</span>':''}</td></tr>`;}).join('')
    +`</tbody></table></div>`;
  h+=`<div class="nh-cards">`+list.map(f=>{const st=PLATBASTAVY[f.stav];return `<button class="acard" onclick="plTog('${f.id}')"><span class="pl-ckm">${plSel.has(f.id)?'☑':'☐'}</span><span style="flex:1"><span class="aname">${f.dite}</span><div class="ameta">${f.skolka} · ${f.obdobi} · ${kc(f.castka)} Kč</div></span><span class="bdg ${st.cls}">${st.lab}</span></button>`;}).join('')+`</div>`;
  h+=`<div class="note2">Párování plateb s bankou zatím neběží – stav „čeká na spárování" znamená, že platba na účtu je, ale nikdo ji nepřiřadil. Fakturační modul (editor, číselné řady, účty) je mimo prototyp.</div>`;
  return h;
}
const plVybrane=()=>FAKTURY.filter(f=>plSel.has(f.id));
window.stepPlMesic=d=>{const i=FAKT_MESICE_A.findIndex(x=>x.key===plMesic);plMesic=FAKT_MESICE_A[Math.max(0,Math.min(FAKT_MESICE_A.length-1,i+d))].key;plSel.clear();plNahled=null;render();};
window.setPl=(k,v)=>{({plSkolka:()=>plSkolka=v,plDruh:()=>plDruh=v,plStav:()=>plStav=v})[k]();plSel.clear();render();};
window.onPlSearch=v=>{plQuery=v;renderKeepFocus();};
window.plTog=id=>{plSel.has(id)?plSel.delete(id):plSel.add(id);render();};
window.plVybratVse=on=>{plList().forEach(f=>on?plSel.add(f.id):plSel.delete(f.id));render();};
window.plUpominka=()=>{const v=plVybrane().filter(f=>kZaplate(f)>0);
  if(!v.length){showToast('Vybrané faktury jsou uhrazené – upomínka není potřeba');return;}
  v.forEach(f=>f.upominka='3. 6.');plSel.clear();render();showToast(`Upomínka odeslána ${v.length} ${v.length===1?'rodině':'rodinám'} · e-mailem podle šablony`);};
window.plUhrazeno=()=>{const v=plVybrane().filter(f=>kZaplate(f)>0);
  v.forEach(f=>{f.stav='uhrazeno';f.uhrazeno=0;f.poDnu=0;f.rucne=true;});plSel.clear();render();
  showToast(`${v.length} ${v.length===1?'faktura označena':'faktury označeny'} jako uhrazené · spárováno ručně`);};
/* Stravné za květen z docházky – náhled napřed, jak to chtěla Radka: kolik faktur, a děti
   s poznámkou „odchod před obědem", u kterých se oběd účtovat nemá. */
window.plNahledStravne=()=>{
  const deti=NAHRADY_DETI, pred=deti.filter((c,i)=>i%11===4).slice(0,3);
  plNahled=`<div class="pl-nahled"><b>Vystaví se ${deti.length} faktur stravného za květen</b> podle snědených jídel v docházce`
    +` (dopolední 100 Kč/den, ostatní 125 Kč/den; omluvené dny se neúčtují).`
    +`<div class="pl-pozn">${pred.length} děti mají v docházce poznámku <b>„odchod před obědem“</b> – oběd se jim v ty dny neúčtuje: `
    +pred.map(c=>c.n+' '+c.sur).join(', ')+`.</div>`
    +`<div class="pl-akce-r"><button class="btn-primary" onclick="plVystavitStravne()">Vystavit ${deti.length} faktur</button><button class="btn-ghost" onclick="plNahled=null;render()">Zrušit</button></div></div>`;
  render();};
window.plVystavitStravne=()=>{
  let id=FAKTURY.length;NAHRADY_DETI.forEach((c,i)=>{const dny=14+(i*7)%8, sk=SKOLKY.find(s=>s.id===c.skolka).nazev;
    FAKTURY.push({id:'fs'+(++id),dite:c.n+' '+c.sur,ditId:c.id,skolka:sk,skolkaId:c.skolka,mesic:'2026-05',druh:'stravne',obdobi:`Stravné · Květen 2026 (${dny} dní)`,
      castka:dny*STRAVNE_DEN[c.rezim],stav:'neuhrazeno',uhrazeno:0,poDnu:0,vyst:'3. 6. 2026',spl:'17. 6. 2026',odeslano:true});});
  STRAVNE_KVETEN_VYST=true;plNahled=null;plMesic='2026-05';plDruh='stravne';render();
  showToast(`Vystaveno a odesláno ${NAHRADY_DETI.length} faktur stravného za květen`);};
window.exportPlatby=()=>{const l=plList();
  stahniCSV(`platby-${plMesic}.csv`,['Dítě','Školka','Druh','Období','Částka (Kč)','K úhradě (Kč)','Splatnost','Stav'],
    l.map(f=>[f.dite,f.skolka,f.druh==='skolne'?'školné':'stravné',f.obdobi,f.castka,kZaplate(f),f.spl,PLATBASTAVY[f.stav].lab]));
  showToast('Staženo pro účetní · '+l.length+' faktur');};
