/* SCREEN: ADMIN_PREHLED – dashboard vedení (BRIEF kap. 1):
   kapacity školek, chybějící platby, systémová upozornění, souhrn náhrad,
   provozní úkoly, poslední porady/evaluace. */
function renderPrehled(){
  let h=`<div class="dash-head">${DOW[wd(TODAYD)]} ${TODAYD}. června 2026 · přehled všech školek</div>`;

  // (a) kapacity školek – obsazeno / kapacita, vizuální pruh; u jednoskupinové školky
  // se rozpis tříd neduplikuje
  h+=`<div class="tile"><div class="ch">Kapacity školek</div><div class="caps">`;
  SKOLKY.forEach(s=>{
    const obs=obsazeno(s), pct=Math.round(obs/s.kapacita*100), full=obs>=s.kapacita;
    const tridy=s.tridy.length>1?s.tridy.map(t=>`${t.n} ${t.obs}/${t.kap}`).join(' · '):'';
    h+=`<div class="cap">`
      +`<div class="cap-top"><span class="cap-nm">${s.nazev}</span><span class="cap-n ${full?'is-full':''}">${obs}/${s.kapacita}${full?' · plno':''}</span></div>`
      +`<div class="cap-bar"><span class="cap-fill ${full?'is-full':''}" style="width:${pct}%"></span></div>`
      +(tridy?`<div class="cap-sub">${tridy}</div>`:'')
      +`</div>`;
  });
  h+=`</div></div>`;

  // (b) chybějící platby – kdo, částka, po splatnosti (badge stavů); řeší se mimo appku
  h+=`<div class="tile"><div class="ch">Chybějící platby</div>`;
  PLATBY.forEach(p=>{
    const st=PLATBASTAVY[p.stav];
    const dodat=p.stav==='po-splatnosti'?`po splatnosti ${p.poDnu} dní`
      :p.stav==='castecne'?`uhrazeno ${kc(p.uhrazeno)} z ${kc(p.castka)} Kč`
      :p.stav==='ceka'?'platba přišla, čeká na spárování':`splatnost prošla před ${p.poDnu} dny`;
    h+=`<div class="pay-row"><div class="pay-main"><div class="pay-nm">${p.dite} <span class="pay-sk">· ${p.skolka}</span></div>`
      +`<div class="pay-sub">${p.obdobi} – ${dodat}</div></div>`
      +`<div class="pay-right"><span class="pay-amt">${kc(p.castka)} Kč</span><span class="bdg ${st.cls}">${st.lab}</span></div></div>`;
  });
  h+=`<div class="note2">Fakturaci školka řeší mimo appku – zde jen přehled.</div></div>`;

  // (c) systémová upozornění vč. chybějících dat
  h+=`<div class="tile"><div class="ch">Systémová upozornění</div>`;
  UPOZORNENI.forEach(u=>{
    const ic=u.typ==='data'?'⚠':u.typ==='provoz'?'●':'✓';
    h+=`<div class="al-row al-${u.typ}"><span class="al-ic">${ic}</span><span class="al-tx">${u.text}${u.skolka?` <span class="al-sk">· ${u.skolka}</span>`:''}</span></div>`;
  });
  h+=`</div>`;

  // (d) souhrn náhrad – dostupné celkem, kolik brzy expiruje, naplánované
  h+=`<button class="tile dash-link" onclick="go('nahrady')"><div class="ch" style="margin:0">Náhrady <span class="dl-arr">›</span></div>`
    +`<div class="nh-grid">`
    +`<div class="nh-cell"><div class="nh-num">${NAHRADY_SUM.dostupne}</div><div class="nh-lab">dostupných</div></div>`
    +`<div class="nh-cell"><div class="nh-num warn">${NAHRADY_SUM.expiruje}</div><div class="nh-lab">propadne 30. 6. (konec šk. roku)</div></div>`
    +`<div class="nh-cell"><div class="nh-num">${NAHRADY_SUM.naplanovane}</div><div class="nh-lab">naplánovaných</div></div>`
    +`</div></button>`;

  // (e) provozní úkoly – checklist, odškrtávání v paměti
  const hotovo=UKOLY.filter(u=>u.done).length;
  h+=`<div class="tile"><div class="ch">Provozní úkoly <span class="tl-count">${hotovo}/${UKOLY.length}</span></div>`;
  UKOLY.forEach((u,i)=>{
    h+=`<button class="task ${u.done?'done':''}" onclick="toggleUkol(${i})"><span class="task-box">${u.done?'✓':''}</span><span class="task-t">${u.t}</span></button>`;
  });
  h+=`</div>`;

  // (f) poslední porady / evaluace – titulky (odvozené ze ZAPISY), proklik do sekce porad
  h+=`<button class="tile dash-link" onclick="go('porady')"><div class="ch" style="margin:0">Poslední porady a evaluace <span class="dl-arr">›</span></div>`;
  ZAPISY.slice().sort((a,b)=>b.dt-a.dt).slice(0,3).forEach(p=>{
    h+=`<div class="por-row"><span class="por-d">${p.datum}</span><span class="por-t">${p.nazev}<span class="por-sk"> · ${p.skolka}</span></span><span class="por-typ ${p.typ}">${p.typ==='porada'?'porada':'evaluace'}</span></div>`;
  });
  h+=`</button>`;

  return h;
}
const kc=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
window.toggleUkol=i=>{UKOLY[i].done=!UKOLY[i].done;render();};
