/* SCREEN: ADMIN_PORADY – Flow 5: vedení hledá podklady pro inspekci.
   Seznam zápisů (filtr školka/typ) · detail se štítky u odstavců ·
   filtrovaný výpis (štítek + období) napříč zápisy · export do tisku. */

let poView='zapisy';   // 'zapisy' | 'vypis'
let poOpen=null;       // id otevřeného zápisu (detail), null = seznam
let poNew=false;       // formulář nového zápisu
let fSkolka='vse', fTyp='vse';         // filtry seznamu
let vStitek='hygiena', vObdobi='vse';  // filtry výpisu
let newZ=null;         // {nazev,typ,skolka,text,stitky:[]}

function renderPorady(){
  if(poNew)return renderPoForm();
  if(poOpen)return renderPoDetail();
  let h=`<div class="switch">`
    +`<button class="${poView==='zapisy'?'on':''}" onclick="poGo('zapisy')">Zápisy</button>`
    +`<button class="${poView==='vypis'?'on':''}" onclick="poGo('vypis')">Výpis podle štítku</button></div>`;
  h+=poView==='vypis'?renderPoVypis():renderPoList();
  return h;
}

/* ---- seznam zápisů ---- */
function renderPoList(){
  let h=`<button class="addbig no-print" onclick="poNewZ()">+ Nový zápis</button>`;
  // filtry
  h+=`<div class="filters no-print">`
    +chip('fSkolka','vse','Všechny školky',fSkolka)
    +SKOLKY.map(s=>chip('fSkolka',s.nazev,s.nazev,fSkolka)).join('')
    +`</div>`;
  h+=`<div class="filters no-print">`
    +chip('fTyp','vse','Vše',fTyp)+chip('fTyp','porada','Porady',fTyp)+chip('fTyp','evaluace','Evaluace',fTyp)
    +`</div>`;
  const list=ZAPISY.slice().sort((a,b)=>b.dt-a.dt)
    .filter(z=>(fSkolka==='vse'||z.skolka===fSkolka)&&(fTyp==='vse'||z.typ===fTyp));
  if(!list.length)h+=`<div class="tile"><div class="ph-d">Žádné zápisy pro zvolený filtr.</div></div>`;
  list.forEach(z=>{
    const tags=[...new Set(z.odstavce.flatMap(o=>o.stitky))];
    h+=`<button class="tile za-item" onclick="poShow('${z.id}')">`
      +`<div class="ak-top"><span class="por-typ ${z.typ}">${z.typ}</span><span class="za-sk">${z.skolka}</span><span class="ak-date">${z.datum}</span></div>`
      +`<div class="za-nz">${escTa(z.nazev)}</div>`
      +`<div class="za-tags">${tags.map(t=>`<span class="stitek">${t}</span>`).join('')}</div>`
      +`</button>`;
  });
  return h;
}

/* ---- detail zápisu ---- */
function renderPoDetail(){
  const z=ZAPISY.find(x=>x.id===poOpen);
  let h=`<button class="back no-print" onclick="poBack()">‹ Zpět na seznam</button>`;
  h+=`<div class="tile">`
    +`<div class="ak-top"><span class="por-typ ${z.typ}">${z.typ}</span><span class="za-sk">${z.skolka}</span><span class="ak-date">${z.datum}</span></div>`
    +`<div class="za-nz za-nz-lg">${escTa(z.nazev)}</div>`
    +`<div class="za-ucast">Účastníci: ${z.ucastnici.join(', ')}</div>`;
  z.odstavce.forEach((o,i)=>{
    h+=`<div class="odst"><div class="odst-tx">${escTa(o.text)}</div>`
      +`<div class="pchips odst-chips no-print">`
      +STITKY.map(t=>`<button class="${o.stitky.indexOf(t)>=0?'on':''}" onclick="poToggleStitek('${z.id}',${i},'${t}')">${t}</button>`).join('')
      +`</div>`
      // v tisku se místo přepínačů ukážou jen aktivní štítky
      +`<div class="za-tags print-only">${o.stitky.map(t=>`<span class="stitek">${t}</span>`).join('')}</div>`
      +`</div>`;
  });
  h+=`<div class="note2 no-print">Štítek u odstavce přidáte/odeberete klepnutím – takto se odstavce zpřístupní filtrovanému výpisu.</div>`;
  h+=`</div>`;
  return h;
}

/* ---- filtrovaný výpis (jádro Flow 5) ---- */
function renderPoVypis(){
  const ob=OBDOBI.find(o=>o.k===vObdobi);
  // posbírej odstavce s vybraným štítkem v období, napříč zápisy
  const hits=[];
  ZAPISY.slice().sort((a,b)=>b.dt-a.dt).forEach(z=>{
    if(z.dt<ob.from||z.dt>ob.to)return;
    z.odstavce.forEach(o=>{if(o.stitky.indexOf(vStitek)>=0)hits.push({z,o});});
  });
  let h=`<div class="filters no-print">`
    +STITKY.map(t=>chip('vStitek',t,t,vStitek)).join('')+`</div>`;
  h+=`<div class="filters no-print">`
    +OBDOBI.map(o=>chip('vObdobi',o.k,o.label,vObdobi)).join('')+`</div>`;
  // hlavička výpisu (užitečná i na papíře)
  h+=`<div class="vypis-head"><div class="vh-t">Výpis zápisů – štítek „${vStitek}"</div>`
    +`<div class="vh-s">${ob.label} · ${hits.length} ${hits.length===1?'odstavec':(hits.length>=2&&hits.length<=4?'odstavce':'odstavců')}</div></div>`;
  h+=`<button class="btn-s primary no-print" style="margin-bottom:12px" onclick="window.print()">Exportovat výpis (tisk / PDF)</button>`;
  if(!hits.length){
    h+=`<div class="tile"><div class="ph-d">Pro tento štítek a období nejsou žádné odstavce.</div></div>`;
    return h;
  }
  hits.forEach(({z,o})=>{
    h+=`<div class="tile vy-item"><div class="ak-top"><span class="por-typ ${z.typ}">${z.typ}</span><span class="za-sk">${z.skolka}</span><span class="ak-date">${z.datum}</span></div>`
      +`<div class="vy-nz">${escTa(z.nazev)}</div>`
      +`<div class="odst-tx">${escTa(o.text)}</div>`
      +`<div class="za-tags">${o.stitky.map(t=>`<span class="stitek ${t===vStitek?'hi':''}">${t}</span>`).join('')}</div>`
      +`<button class="vy-link no-print" onclick="poShow('${z.id}')">→ celý zápis</button></div>`;
  });
  return h;
}

/* ---- nový zápis (minimální: titulek + text + štítky) ---- */
function renderPoForm(){
  const f=newZ;
  let h=`<button class="back" onclick="poCancel()">‹ Zpět na seznam</button>`;
  h+=`<div class="tile">`
    +`<div class="field"><div class="l">Název zápisu</div><input class="pin" id="nzNazev" value="${esc(f.nazev)}" placeholder="Např. Provozní porada – červen"></div>`;
  h+=`<div class="field"><div class="l">Typ</div><div class="pchips">`
    +`<button class="${f.typ==='porada'?'on':''}" onclick="poFType('porada')">Porada</button>`
    +`<button class="${f.typ==='evaluace'?'on':''}" onclick="poFType('evaluace')">Evaluace</button></div></div>`;
  h+=`<div class="field"><div class="l">Školka</div><div class="pchips">`
    +SKOLKY.map(s=>`<button class="${f.skolka===s.nazev?'on':''}" onclick="poFSkolka('${s.nazev}')">${s.nazev}</button>`).join('')+`</div></div>`;
  h+=`<div class="field"><div class="l">Text</div><textarea class="pta" id="nzText" placeholder="Zápis z porady…">${escTa(f.text)}</textarea></div>`;
  h+=`<div class="field"><div class="l">Štítky</div><div class="pchips">`
    +STITKY.map(t=>`<button class="${f.stitky.indexOf(t)>=0?'on':''}" onclick="poFStitek('${t}')">${t}</button>`).join('')+`</div></div>`;
  const ok=f.nazev.trim()&&f.text.trim();
  h+=`<div class="mbtns"><button class="btn-ghost" onclick="poCancel()">Zrušit</button>`
    +(ok?`<button class="btn-primary" onclick="poSave()">Uložit zápis</button>`:`<button class="btn-primary" disabled>Uložit zápis</button>`)+`</div>`;
  if(!ok)h+=`<div class="note2">Vyplňte název a text zápisu.</div>`;
  h+=`</div>`;
  return h;
}

/* ---- helpery / handlery ---- */
function chip(varName,val,label,cur){return `<button class="${cur===val?'on':''}" onclick="poFilter('${varName}','${val}')">${label}</button>`;}

window.poGo=v=>{poView=v;render();};
window.poShow=id=>{poOpen=id;poNew=false;render();};
window.poBack=()=>{poOpen=null;render();};
window.poFilter=(v,val)=>{if(v==='fSkolka')fSkolka=val;else if(v==='fTyp')fTyp=val;else if(v==='vStitek')vStitek=val;else if(v==='vObdobi')vObdobi=val;render();};

// přidání/odebrání štítku odstavci v detailu
window.poToggleStitek=(zid,i,t)=>{const o=ZAPISY.find(z=>z.id===zid).odstavce[i];const k=o.stitky.indexOf(t);if(k>=0)o.stitky.splice(k,1);else o.stitky.push(t);render();};

// nový zápis
window.poNewZ=()=>{newZ={nazev:'',typ:'porada',skolka:SKOLKY[0].nazev,text:'',stitky:[]};poNew=true;render();};
function nzSync(){const n=document.getElementById('nzNazev'),t=document.getElementById('nzText');if(newZ){if(n)newZ.nazev=n.value;if(t)newZ.text=t.value;}}
window.poFType=v=>{nzSync();newZ.typ=v;render();};
window.poFSkolka=v=>{nzSync();newZ.skolka=v;render();};
window.poFStitek=t=>{nzSync();const k=newZ.stitky.indexOf(t);if(k>=0)newZ.stitky.splice(k,1);else newZ.stitky.push(t);render();};
window.poCancel=()=>{poNew=false;newZ=null;render();};
window.poSave=()=>{nzSync();if(!newZ.nazev.trim()||!newZ.text.trim())return;
  const d=TODAYD, dt=20260600+d, datum=`${d}. 6. 2026`;
  ZAPISY.unshift({id:'z'+(zapisUid++),dt,datum,typ:newZ.typ,skolka:newZ.skolka,nazev:newZ.nazev.trim(),ucastnici:['vedení'],odstavce:[{text:newZ.text.trim(),stitky:newZ.stitky.slice()}]});
  poNew=false;newZ=null;showToast('Zápis uložen');render();};
