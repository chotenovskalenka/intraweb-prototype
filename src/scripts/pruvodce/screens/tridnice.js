/* SCREEN: PRUVODCE_TRIDNICE – denní zápis (třídní kniha). Tři pohledy:
     Den   – zápis jednoho dne; každé pole se ukládá samo a nese „kdo a kdy doplnil"
     Týden – téma a pohádka týdne, stav dnů, uzavření týdne, úkoly „je třeba zařídit"
     Děti  – poznámky k dětem, jen pro tým (P1 + legislativa: jména dětí do veřejné části nepatří)
   Žádné „Odeslat": třídnice se píše zpětně a víc lidmi (výzkum), formulář, který se odešle
   a zavře, to neunese. Psaní nevolá render() – kurzor v poli musí zůstat; přepisuje se jen
   podpis pole a stav dne přímo v DOM. Data a stavy jsou v data.js (TR_*). */
let trView='den', trDay=TODAYD, trWeek=trTydenOd(TODAYD), trOpenDite=-1, trNoteDay=TODAYD;
const TR_DOW=['pondělí','úterý','středa','čtvrtek','pátek'];
// pracovní dny června, které už začaly (budoucí se nepíšou ani neprocházejí)
const trDny=()=>Array.from({length:TODAYD},(_,i)=>i+1).filter(d=>!isWE(d));
const trTydny=()=>[...new Set(trDny().map(trTydenOd))];
const trKdyLbl=z=>!z?'':`${z.kdo} · ${z.den===TODAYD?'dnes':z.den===TODAYD-1?'včera':z.den+'. 6.'} ${z.cas}`;
const trBdg=s=>`<span class="bdg st-${s.cls}">${s.lab}</span>`;
const trDenLbl=d=>`${DOW[wd(d)]} ${d}. 6.`;
const trTydenLbl=po=>{const dny=trDnyTydne(po);return `${dny[0]}.–${dny[dny.length-1]}. 6.`;};
// kdo ten den slouží – z rozpisu služeb (stejný zdroj jako dashboard)
const trSluzba=d=>shiftProDen(d).filter(g=>serving(g.days[wd(d)])).map(g=>g.n);

function renderTridnice(){
  const nav=trView==='den'
    ? trNav(trDenLbl(trDay)+(trDay===TODAYD?'<i class="dn-cur"> · dnes</i>':''),'trStepDay',trDny().indexOf(trDay),trDny().length)
    : trNav(trTydenLbl(trWeek)+(trWeek===trTydenOd(TODAYD)?'<i class="dn-cur"> · tento týden</i>':''),'trStepWeek',trTydny().indexOf(trWeek),trTydny().length);
  let h=`<div class="tr"><div class="dfield"><div class="switch dsw">`
    +[['den','Den'],['tyden','Týden'],['deti','Děti']].map(v=>`<button class="${trView===v[0]?'on':''}" onclick="trSetView('${v[0]}')">${v[1]}</button>`).join('')
    +`</div>${nav}</div>`;
  h+=trView==='den'?trRenderDen():trView==='tyden'?trRenderTyden():trRenderDeti();
  return h+`</div>`;
}
function trNav(lbl,fn,i,n){
  return `<div class="dnav"><button onclick="${fn}(-1)" ${i<=0?'disabled':''} aria-label="Předchozí">‹</button><span>${lbl}</span><button onclick="${fn}(1)" ${i>=n-1?'disabled':''} aria-label="Další">›</button></div>`;
}

/* ---- Den ---- */
function trRenderDen(){
  const d=trDay, z=trDen(d), sl=trSluzba(d);
  let h=`<div class="tile tr-meta"><div class="tr-meta-r"><span class="tlab">${TR_DOW[wd(d)].replace(/^./,m=>m.toUpperCase())} ${d}. června</span><span id="tr-stav">${trBdg(trStav(d))}</span></div>`
    +`<div class="tval">Ve službě: <b>${sl.join(', ')||'nikdo'}</b> · píše <b>${TR_ZAPISUJE[wd(d)]}</b></div>`
    +`<div class="note2">Ukládá se samo při psaní. Doplnit může kdokoli z týmu, klidně až večer nebo druhý den. Jména dětí sem nepiš – patří do záložky <button class="tr-inl" onclick="trSetView('deti')">Děti</button>, kterou vidí jen tým.</div></div>`;
  h+=`<div class="tr-pole">`;
  TR_POLE.forEach(p=>{
    const v=z.pole[p.k];
    h+=`<div class="tile tr-f${p.siroke?' tr-f-wide':''}"><div class="tr-fh"><label class="tlab" for="trf-${p.k}">${p.lab}${p.volitelne?' <span class="tr-vol">nepovinné</span>':''}</label>`
      +`<span class="tr-kdo" id="trk-${p.k}">${trKdyLbl(v)}</span></div>`
      +(p.kratke
        ? `<input class="pin" id="trf-${p.k}" value="${esc(v?v.t:'')}" placeholder="${p.ph}" oninput="trSet('${p.k}',this.value)">`
        : `<textarea class="pta" id="trf-${p.k}" placeholder="${p.ph}" oninput="trSet('${p.k}',this.value)">${escTa(v?v.t:'')}</textarea>`);
    // poučení o pravidlech patří k místu, kam se šlo – sada podle místa, jako v Jaatě
    if(p.k==='kde')h+=`<div class="pl">Poučení o pravidlech</div><div class="pchips">`
      +TR_POUCENI.map(([k,l])=>`<button class="${z.pouceni.includes(k)?'on':''}" aria-pressed="${z.pouceni.includes(k)}" onclick="trPouceni('${k}')">${l}</button>`).join('')+`</div>`;
    h+=`</div>`;
  });
  return h+`</div>`;
}
window.trSet=(k,v)=>{
  const z=trDen(trDay);
  if(v.trim())z.pole[k]={t:v,kdo:ja().n,cas:TEDCAS,den:TODAYD};else delete z.pole[k];
  const kdo=document.getElementById('trk-'+k);if(kdo)kdo.textContent=trKdyLbl(z.pole[k]);
  const st=document.getElementById('tr-stav');if(st)st.innerHTML=trBdg(trStav(trDay));
};
window.trPouceni=k=>{const z=trDen(trDay),i=z.pouceni.indexOf(k);i>=0?z.pouceni.splice(i,1):z.pouceni.push(k);render();};

/* ---- Týden ---- */
function trRenderTyden(){
  const po=trWeek, t=trTyden(po), dny=trDnyTydne(po), konec=dny[dny.length-1]<=TODAYD;
  let h=`<div class="tr-tyden"><div class="tr-col">`;
  h+=`<div class="tile"><div class="ch">Týden</div>`
    +`<label class="pl" for="trt-tema">Téma týdne</label><input class="pin" id="trt-tema" value="${esc(t.tema)}" placeholder="např. Kytičky a věneček" oninput="trSetT('tema',this.value)">`
    +`<label class="pl" for="trt-poh">Pohádka týdne</label><input class="pin" id="trt-poh" value="${esc(t.pohadka)}" placeholder="název, případně jak jsme ji hráli" oninput="trSetT('pohadka',this.value)">`
    +`</div>`;
  h+=`<div class="tile"><div class="ch">Dny</div>`;
  dny.forEach(d=>{
    // co chybí, jen u proběhlých dnů – dnešek ještě běží
    const s=trStav(d), chybi=d<TODAYD?TR_POLE.filter(p=>!p.volitelne&&!(trDen(d).pole[p.k]||{}).t).map(p=>p.lab.toLowerCase()):[];
    h+=`<button class="tr-den" onclick="trGoDay(${d})" ${d>TODAYD?'disabled':''}><span class="tr-den-d">${trDenLbl(d)}</span>`
      +`<span class="tr-den-m">${trBdg(s)}${chybi.length&&s.k==='rozepsano'?`<span class="tr-chybi">chybí: ${chybi.join(', ')}</span>`:''}</span>`
      +(d<=TODAYD?`<span class="tr-arr" aria-hidden="true">›</span>`:'')+`</button>`;
  });
  h+=`</div></div><div class="tr-col">`;
  // uzavření týdne – Jaata ho má vyplněné ve 100 % týdnů; píše se po posledním dni
  const u=t.uzavreni;
  h+=`<div class="tile"><div class="tr-fh"><label class="ch" for="trt-uz">Uzavření týdne</label><span class="tr-kdo" id="trk-uz">${trKdyLbl(u)}</span></div>`
    +(konec||u
      ? `<textarea class="pta" id="trt-uz" placeholder="Co se za týden povedlo, co příště jinak, na co se připravit dřív." oninput="trSetUz(this.value)">${escTa(u?u.t:'')}</textarea>`
      : `<div class="empty" style="padding:6px 0 0;text-align:left">Píše se po posledním dni týdne.</div>`)
    +`</div>`;
  // úkoly – v Jaatě sloupec „Je třeba zařídit + kdo to udělá"
  const lidi=[...guides,...ZAZEMI].map(g=>g.n);
  h+=`<div class="tile"><div class="ch">Je třeba zařídit</div>`;
  if(!t.ukoly.length)h+=`<div class="empty" style="padding:4px 0 8px;text-align:left">Zatím nic.</div>`;
  t.ukoly.forEach((u,i)=>{
    h+=`<div class="tr-ukol${u.done?' done':''}"><button class="chk${u.done?' on':''}" onclick="trUkol(${i})" aria-pressed="${u.done}" aria-label="${u.done?'Označit jako nehotové':'Označit jako hotové'}">${u.done?'✓':''}</button>`
      +`<span class="tr-ukol-t">${esc(u.t)}</span><span class="tr-ukol-k">${esc(u.kdo)}</span></div>`;
  });
  h+=`<div class="tr-add"><input class="pin" id="tru-t" placeholder="Co je potřeba zařídit…" aria-label="Nový úkol">`
    +`<select class="pin" id="tru-k" aria-label="Kdo to udělá">${lidi.map(n=>`<option${n===ja().n?' selected':''}>${n}</option>`).join('')}</select>`
    +`<button class="btn-ghost" onclick="trUkolAdd()">Přidat</button></div>`;
  h+=`</div></div></div>`;
  return h;
}
window.trSetT=(k,v)=>{trTyden(trWeek)[k]=v;};
window.trSetUz=v=>{const t=trTyden(trWeek);t.uzavreni=v.trim()?{t:v,kdo:ja().n,cas:TEDCAS,den:TODAYD}:null;
  const k=document.getElementById('trk-uz');if(k)k.textContent=trKdyLbl(t.uzavreni);};
window.trUkol=i=>{const u=trTyden(trWeek).ukoly[i];u.done=!u.done;render();};
window.trUkolAdd=()=>{const t=document.getElementById('tru-t'),k=document.getElementById('tru-k');
  if(!t.value.trim()){t.focus();return;}
  trTyden(trWeek).ukoly.push({t:t.value.trim(),kdo:k.value,done:false});render();showToast('Úkol přidán ✓');};
window.trGoDay=d=>{trDay=d;trView='den';render();};

/* ---- Děti (jen pro tým) ---- */
function trRenderDeti(){
  const po=trWeek, poz=trDetiTyden(po), dny=trDnyTydne(po).filter(d=>d<=TODAYD);
  if(!dny.includes(trNoteDay))trNoteDay=dny[dny.length-1];
  const sPoz=data.filter((c,i)=>(poz[i]||[]).length).length;
  let h=`<div class="zona zona-int tr-deti"><div class="zona-h"><span class="zona-t">Poznámky k dětem</span>`
    +`<span class="zona-s">Jen pro tým – rodiče je nevidí a do tisku třídnice nejdou.</span></div>`;
  h+=`<div class="tile"><div class="tval">Tento týden poznámka u <b>${sPoz} z ${data.length}</b> dětí.</div>`
    +`<div class="note2">Dítě bez poznámky je vidět hned – ať za týden nikdo nezapadne.</div></div>`;
  h+=`<div class="tile tr-dlist">`;
  data.map((c,i)=>({c,i})).sort(byAlpha).forEach(({c,i})=>{
    const n=poz[i]||[], open=trOpenDite===i;
    h+=`<div class="tr-dite${open?' open':''}"><button class="tr-dite-h" onclick="trDite(${i})" aria-expanded="${open}">${avatar(c,28)}<span class="tr-dite-n">${full(c)}</span>`
      +`<span class="tr-dite-s">${n.length?`${n.length} ${n.length===1?'poznámka':n.length<5?'poznámky':'poznámek'}`:'<i>zatím bez poznámky</i>'}</span></button>`;
    if(open){
      h+=`<div class="tr-dite-b">`;
      n.forEach(x=>{h+=`<div class="rozh"><div class="rozhd">${trDenLbl(x.d)} · ${esc(x.kdo)}</div>${esc(x.t)}</div>`;});
      h+=`<div class="pl">Nová poznámka k</div><div class="pchips">`
        +dny.map(d=>`<button class="${trNoteDay===d?'on':''}" onclick="trNoteDen(${d})">${trDenLbl(d)}</button>`).join('')+`</div>`
        +`<textarea class="pta" id="trdn" style="margin-top:8px" placeholder="Nálada, vztahy, co se povedlo, zdraví…" aria-label="Poznámka k dítěti ${full(c)}"></textarea>`
        +`<button class="btn-primary tr-dite-add" onclick="trNoteAdd(${i})">Uložit poznámku</button></div>`;
    }
    h+=`</div>`;
  });
  return h+`</div></div>`;
}
window.trDite=i=>{trOpenDite=trOpenDite===i?-1:i;render();};
// výběr dne nesmí smazat rozepsaný text – přenese ho do nového renderu
window.trNoteDen=d=>{const t=document.getElementById('trdn'),v=t?t.value:'';trNoteDay=d;render();const n=document.getElementById('trdn');if(n)n.value=v;};
window.trNoteAdd=i=>{const t=document.getElementById('trdn');if(!t||!t.value.trim()){if(t)t.focus();return;}
  const poz=trDetiTyden(trWeek);(poz[i]||(poz[i]=[])).push({d:trNoteDay,t:t.value.trim(),kdo:ja().n});
  poz[i].sort((a,b)=>a.d-b.d);render();showToast('Poznámka uložena ✓');};

/* ---- přepínání ---- */
window.trSetView=v=>{if(v!=='den')trWeek=trTydenOd(trDay);trView=v;trOpenDite=-1;render();};
window.trStepDay=dir=>{const ds=trDny(),i=ds.indexOf(trDay)+dir;if(i>=0&&i<ds.length){trDay=ds[i];trWeek=trTydenOd(trDay);render();}};
window.trStepWeek=dir=>{const ws=trTydny(),i=ws.indexOf(trWeek)+dir;if(i>=0&&i<ws.length){trWeek=ws[i];trOpenDite=-1;render();}};
// vstup z přehledu: rovnou na daný den
window.trOtevrit=d=>{trDay=d;trWeek=trTydenOd(d);trView='den';go('tridnice');};
