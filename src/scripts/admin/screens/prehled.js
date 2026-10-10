/* SCREEN: ADMIN_PREHLED – co vyžaduje akci tento týden (draft-admin 4.1).
   BRIEF chce na dashboardu kapacity, platby, upozornění, náhrady, úkoly, porady a chybějící
   data. Výzkum dává jiné kritérium: dashboard ukazuje, co je potřeba udělat, ne všechno, co
   existuje. Proto: dnes ve školkách (Terčin dohled) · platby k řešení · výkyvy náhrad ·
   chybějící data · kapacity. Provozní úkoly (ve výzkumu je nikdo nezmínil) a poslední porady
   (mají vlastní sekci) z přehledu vypadly. */
function renderPrehled(){
  let h=`<div class="dash-head">${DOW[wd(TODAYD)]} ${TODAYD}. června 2026 · přehled všech školek</div>`;

  // (a) dnes ve školkách – jeden řádek na školku; nevyřešená absence je úkol pro vedoucí
  h+=`<div class="tile"><div class="ch">Dnes ve školkách</div>`;
  SKOLKY.forEach(s=>{const d=DNES_SKOLKY[s.id],zap=obsazeno(s);
    h+=`<div class="ds-row"><span class="ds-nm">${s.nazev}</span>`
      +`<span class="ds-n"><b>${d.pritomno}</b> z ${zap} dětí</span>`
      +`<span class="ds-x">${d.omluveno} omluveno${d.nevyreseno?` · <b class="ds-warn">${d.nevyreseno} nevyřešeno</b>`:''}</span>`
      +`<span class="ds-p">${d.pruvodci} průvodci</span></div>`;});
  const nev=SKOLKY.reduce((n,s)=>n+DNES_SKOLKY[s.id].nevyreseno,0);
  if(nev)h+=`<div class="note2" style="margin-top:8px">Nevyřešená absence = dítě nepřišlo a nikdo ho neomluvil. Uzavírá ji vedoucí průvodce jako omluveno bez náhrady.</div>`;
  h+=`</div>`;

  h+=`<div class="dash2">`;
  // (b) platby k řešení – jen po splatnosti a čekající na spárování (ne všechny neuhrazené)
  const kResi=platbyKResi().sort((a,b)=>b.poDnu-a.poDnu);
  const suma=kResi.reduce((s,p)=>s+(p.castka-(p.uhrazeno||0)),0);
  h+=`<button class="tile dash-link" onclick="go('platby')"><div class="ch">Platby k řešení <span class="dl-arr">›</span></div>`
    +`<div class="dl-big">${kResi.length}<span>· ${kc(suma)} Kč</span></div>`;
  kResi.slice(0,4).forEach(p=>{const st=PLATBASTAVY[p.stav];
    h+=`<div class="pay-row"><div class="pay-main"><div class="pay-nm">${p.dite} <span class="pay-sk">· ${p.skolka}</span></div><div class="pay-sub">${p.obdobi}</div></div>`
      +`<div class="pay-right"><span class="pay-amt">${kc(p.castka-(p.uhrazeno||0))} Kč</span><span class="bdg ${st.cls}">${st.lab}</span></div></div>`;});
  h+=`</button>`;

  // (c) náhrady – výkyvy: zápory a čerpání výrazně nad průměrem (Evička si toho všímá
  // „ve druhém nebo třetím měsíci" – appka to má vidět hned)
  const z=c=>pripsanoPlatne(c)-c.cerpanoH;
  const minus=NAHRADY_DETI.filter(c=>z(c)<0).sort((a,b)=>z(a)-z(b));
  const prum=NAHRADY_DETI.reduce((s,c)=>s+c.cerpanoH,0)/NAHRADY_DETI.length;
  const nad=NAHRADY_DETI.filter(c=>c.cerpanoH>2*prum&&z(c)>=0);
  const kCerp=NAHRADY_DETI.reduce((s,c)=>s+Math.max(0,z(c)),0);
  h+=`<button class="tile dash-link" onclick="goNahradyMinus()"><div class="ch">Náhrady – výkyvy <span class="dl-arr">›</span></div>`
    +`<div class="dl-big nh-minus">${minus.length}<span>dětí v záporu</span></div>`
    +minus.slice(0,3).map(c=>`<div class="np"><span>${c.n} ${c.sur} <span class="dt-no">· ${c.skN}</span></span><b class="nh-minus">${fmtHod(z(c))} h</b></div>`).join('')
    +(nad.length?`<div class="np"><span>Čerpání víc než dvojnásobek průměru</span><b>${nad.length} dětí</b></div>`:'')
    +`<div class="np"><span>Nevyčerpáno, propadne 30. 6.</span><b>${fmtHod(kCerp)} h</b></div></button>`;
  h+=`</div>`;

  // (d) chybějící data a upozornění
  h+=`<div class="tile"><div class="ch">Chybějící data a upozornění</div>`;
  UPOZORNENI.forEach(u=>{
    const ic=u.typ==='data'?'⚠':u.typ==='provoz'?'●':'✓';
    h+=`<div class="al-row al-${u.typ}"><span class="al-ic">${ic}</span><span class="al-tx">${u.text}${u.skolka?` <span class="al-sk">· ${u.skolka}</span>`:''}</span></div>`;
  });
  h+=`</div>`;

  // (e) kapacity – ponechané, fungují
  h+=`<div class="tile"><div class="ch">Kapacity školek</div><div class="caps">`;
  SKOLKY.forEach(s=>{
    const obs=obsazeno(s), pct=Math.round(obs/s.kapacita*100), full=obs>=s.kapacita;
    const tridy=s.tridy.length>1?s.tridy.map(t=>`${t.n} ${t.obs}/${t.kap}`).join(' · '):'';
    h+=`<div class="cap"><div class="cap-top"><span class="cap-nm">${s.nazev}</span><span class="cap-n ${full?'is-full':''}">${obs}/${s.kapacita}${full?' · plno':''}</span></div>`
      +`<div class="cap-bar"><span class="cap-fill ${full?'is-full':''}" style="width:${pct}%"></span></div>`
      +(tridy?`<div class="cap-sub">${tridy}</div>`:'')+`</div>`;
  });
  h+=`</div></div>`;
  return h;
}
const kc=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
window.goNahradyMinus=()=>{nhSkolka='vse';nhJenMinus=true;nhJenBez=false;nhOpen=null;go('nahrady');};
