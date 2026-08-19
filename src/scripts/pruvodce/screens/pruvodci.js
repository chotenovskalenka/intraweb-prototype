/* SCREEN: PRUVODCE_PRUVODCI */
function startMin(d){return serving(d)?(+d.s.split(':')[0])*60+(+d.s.split(':')[1]):9999;}
function shiftCell(d){
  if(!d)return '<span class="wc e">·</span>';
  if(d.off)return `<span class="bdg al" style="font-size:9px">${d.off}</span>`;
  return `<div style="line-height:1.25"><div style="color:var(--color-primary);font-weight:600;font-size:10.5px">${fmt(d.s)}</div><div style="color:var(--color-text-muted);font-size:10px">${fmt(d.e)}</div></div>`;
}
function renderPruvodci(){
  const todays=GUIDESHIFT.map((g,i)=>({g,i})).filter(x=>serving(x.g.days[TODAY]));
  const opener=todays.slice().sort((a,b)=>startMin(a.g.days[TODAY])-startMin(b.g.days[TODAY]))[0];
  if(todays.length&&!todays.some(x=>x.i===uspavaToday))uspavaToday=todays[0].i;
  let h='';
  h+=`<div class="tile"><div class="ch">Dnes ve školce · středa</div>`;
  h+= todays.length? todays.map(x=>{const d=x.g.days[TODAY];return `<div class="np"><span>${x.g.n}${opener&&x.i===opener.i?' · <b style="color:var(--color-primary)">otevírá</b>':''}</span><b>${fmt(d.s)}–${fmt(d.e)}</b></div>`;}).join('') : '<div class="empty">Dnes nikdo nemá službu.</div>';
  if(todays.length)h+=`<div class="np" style="border-top:1px solid var(--color-border);margin-top:6px;padding-top:9px"><span>Dnes uspává</span><select class="selin" onchange="setUspava(this.value)">`+todays.map(x=>`<option value="${x.i}" ${x.i===uspavaToday?'selected':''}>${x.g.n}</option>`).join('')+`</select></div>`;
  h+=`</div>`;
  // Týden rozpisu se listuje a je vždycky datovaný – jinak není poznat, na který týden
  // se člověk dívá. Minulé týdny jsou jen ke čtení, stejně jako minulé dny v docházce.
  const t=SHIFT_TYDNY[shiftT], rows=shiftTyden(shiftT), minuly=shiftT<SHIFT_AKT;
  h+=`<div class="vhead-row"><div class="vhead">Týden · služby</div><div class="vhead-act">`+
    `<div class="dnav"><button onclick="stepShiftT(-1)" ${shiftT<=0?'disabled':''} aria-label="Předchozí týden">‹</button>`+
    `<span>${shiftLabel(t)}${shiftT===SHIFT_AKT?'<i class="dn-cur"> · tento týden</i>':''}</span>`+
    `<button onclick="stepShiftT(1)" ${shiftT>=SHIFT_TYDNY.length-1?'disabled':''} aria-label="Další týden">›</button></div></div></div>`;
  // wt-sm = tabulka s krátkými jmény → na mobilu užší první sloupec, aby buňky měly 44 px
  h+=`<div class="weekbox"><table class="wt wt-sm"><thead><tr><th class="who">Průvodce</th>`+
    DAYS.map((d,j)=>{const den=t.od+j, jeDnes=shiftT===SHIFT_AKT&&j===TODAY;
      return den>t.do?`<th></th>`:`<th class="${jeDnes?'today':''}">${d} <span class="wt-dt">${den}.</span></th>`;}).join('')+`</tr></thead><tbody>`;
  rows.forEach((g,gi)=>{h+=`<tr><td class="who">${g.n}</td>`+g.days.map((d,di)=>{
      const jeDnes=shiftT===SHIFT_AKT&&di===TODAY;
      if(t.od+di>t.do)return `<td class="pastc"></td>`;
      return minuly? `<td class="pastc">${shiftCell(d)}</td>`
        : `<td class="ced${jeDnes?' today':''}" onclick="openShift(${gi},${di})">${shiftCell(d)}</td>`;
    }).join('')+`</tr>`;});
  h+=`</tbody></table></div><div class="hint">${minuly?'Minulý týden – jen k nahlédnutí.':'Klepni na buňku a uprav službu (příchod, odchod, nebo nepřítomnost).'}</div>`;
  return h;
}
window.stepShiftT=d=>{shiftT=Math.max(0,Math.min(SHIFT_TYDNY.length-1,shiftT+d));render();};
window.setUspava=v=>{uspavaToday=Number(v);};
