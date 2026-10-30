/* SCREEN: PRUVODCE_PRUVODCI */
function startMin(d){return serving(d)?(+d.s.split(':')[0])*60+(+d.s.split(':')[1]):9999;}
/* P6 z testování: rozpis nevyznačoval, kdo ve škole není – den bez směny byl jen tečka. Slovo
   „neslouží" v půlce buněk ale dělalo šum (designérka 30. 10. 2026: „slouží je divný"), takže
   den bez směny je tlumená pomlčka, důvod nepřítomnosti zůstává slovem. Čas na jeden řádek
   (7:30–16:00); na úzkém mobilu se sám zalomí za pomlčkou. */
function shiftCell(d,otevira){
  if(!d)return '<span class="sh-off" aria-label="není">–</span>';
  if(d.off)return `<span class="sh-off sh-duvod">${d.off}</span>`;
  return `<span class="sh-cas">${fmt(d.s)}–${fmt(d.e)}</span>`+(otevira?'<span class="sh-otv">otevírá</span>':'');
}
function shiftHlavicka(){
  const t=SHIFT_TYDNY[shiftT];
  return `<div class="dfield"><div class="dnav"><button onclick="stepShiftT(-1)" ${shiftT<=0?'disabled':''} aria-label="Předchozí týden">‹</button>`+
    `<span>${shiftLabel(t)}${shiftT===SHIFT_AKT?' (tento týden)':''}</span>`+
    `<button onclick="stepShiftT(1)" ${shiftT>=SHIFT_TYDNY.length-1?'disabled':''} aria-label="Další týden">›</button></div></div>`;
}
/* Karta „Dnes ve školce" zmizela – zdvojovala dnešní sloupec tabulky i kartu Sestava na přehledu
   (30. 10. 2026). Dnešek je zvýrazněný celým sloupcem, „otevírá" je v buňce, kdo uspává pod
   tabulkou. Listování týdny je v hlavičce jako u Docházky. */
function renderPruvodci(){
  const todays=GUIDESHIFT.map((g,i)=>({g,i})).filter(x=>serving(x.g.days[TODAY]));
  const opener=todays.slice().sort((a,b)=>startMin(a.g.days[TODAY])-startMin(b.g.days[TODAY]))[0];
  if(todays.length&&!todays.some(x=>x.i===uspavaToday))uspavaToday=todays[0].i;
  // Týden rozpisu se listuje a je vždycky datovaný – jinak není poznat, na který týden
  // se člověk dívá. Minulé týdny jsou jen ke čtení, stejně jako minulé dny v docházce.
  const t=SHIFT_TYDNY[shiftT], rows=shiftTyden(shiftT), minuly=shiftT<SHIFT_AKT, akt=shiftT===SHIFT_AKT;
  // wt-sm = tabulka s krátkými jmény → na mobilu užší první sloupec, aby buňky měly 44 px
  let h=`<div class="weekbox wt-sest"><table class="wt wt-sm"><thead><tr><th class="who">Průvodce</th>`+
    DAYS.map((d,j)=>{const den=t.od+j, jeDnes=akt&&j===TODAY;
      return den>t.do?`<th></th>`:`<th class="${jeDnes?'today':''}">${d} <span class="wt-dt">${den}.</span>${jeDnes?' <span class="wt-dnes">dnes</span>':''}</th>`;}).join('')+`</tr></thead><tbody>`;
  rows.forEach((g,gi)=>{h+=`<tr><td class="who">${g.n}</td>`+g.days.map((d,di)=>{
      const jeDnes=akt&&di===TODAY;
      if(t.od+di>t.do)return `<td class="pastc"></td>`;
      const bunka=shiftCell(d,jeDnes&&opener&&rows===GUIDESHIFT&&gi===opener.i);
      return minuly? `<td class="pastc">${bunka}</td>`
        : `<td class="ced${jeDnes?' today':''}" onclick="openShift(${gi},${di})" ${KLAV}>${bunka}</td>`;
    }).join('')+`</tr>`;});
  h+=`</tbody></table></div>`;
  h+=`<div class="sh-pata">`;
  if(akt&&todays.length)h+=`<label class="sh-usp"><span>Dnes uspává</span><select class="selin" onchange="setUspava(this.value)">`+todays.map(x=>`<option value="${x.i}" ${x.i===uspavaToday?'selected':''}>${x.g.n}</option>`).join('')+`</select></label>`;
  h+=`<div class="hint">${minuly?'Minulý týden – jen k nahlédnutí.':'Klepni na buňku a uprav, kdy kdo přijde a odejde, nebo že nepřijde.'}</div></div>`;
  return h;
}
window.stepShiftT=d=>{shiftT=Math.max(0,Math.min(SHIFT_TYDNY.length-1,shiftT+d));render();};
window.setUspava=v=>{uspavaToday=Number(v);};
