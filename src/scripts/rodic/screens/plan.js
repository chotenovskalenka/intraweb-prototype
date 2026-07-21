/* SCREEN: RODIC_PLAN — tématický plán: navigace po měsících (jen aktuální školní rok),
   plný obsah (plakát + písničky) má v prototypu jen červen; plakát lze zvětšit i stáhnout.
   Desktop: vlevo téma + písničky (proklik na YouTube), vpravo plakáty. */
function renderPlan(){
  const t=TEMA_MESICE[planIdx], mName=MONTHS[t.m-1], cap=mName.charAt(0).toUpperCase()+mName.slice(1);
  const song=s=>`<div class="song"><div class="song-h"><span class="song-t">${s.t}</span><span class="song-tag">${s.typ}</span><a class="song-yt" href="${s.yt}" target="_blank" rel="noopener">▶ Poslech</a></div><div class="song-week">${s.tyd}</div><div class="song-tx">${s.txt}</div></div>`;

  // stepper měsíců (Září 2025 → Červen 2026), plná šířka
  let h=`<div class="doch"><div class="dh-nav planstep"><button class="dh-step" onclick="stepPlan(-1)" ${planIdx<=0?'disabled':''} aria-label="Předchozí měsíc">‹</button><span class="dh-lbl">${cap} ${t.y}</span><button class="dh-step" onclick="stepPlan(1)" ${planIdx>=TEMA_MESICE.length-1?'disabled':''} aria-label="Další měsíc">›</button></div>`;
  h+=`<div class="page-2col"><div class="pcol">`;
  h+=`<div class="tile"><div class="ch">Téma měsíce · ${t.hodnota}</div>${t.full?`<div class="tval">${t.intro}</div>`:`<div class="note2" style="margin:0">Hodnota měsíce: <b>${t.hodnota}</b>.</div>`}</div>`;

  if(t.full){
    h+=`<div class="tile"><div class="ch">Písničky a básničky</div><div class="note2" style="margin:0 0 8px">Klepnutím na „Poslech" se přehraje na YouTube — můžete si je zazpívat i doma.</div>${PISNE_CERVEN.map(song).join('')}</div>`;
    h+=`</div><div class="pcol">`;
    h+=`<div class="tile"><div class="ch">Plán měsíce · nástěnka</div><div class="note2" style="margin:0 0 10px">Tak, jak ho průvodci vyrábějí a věší ve školce. Klepnutím plakát zvětšíte nebo stáhnete.</div>`+TEMA_POSTERS.map((p,i)=>`<button class="poster-btn" onclick="openPoster(${i})" aria-label="Zvětšit plakát"><img class="tema-poster" src="${p}" alt="Tématický plán ${cap}" loading="lazy"><span class="poster-zoom">⤢</span></button>`).join('')+`</div>`;
  }else{
    h+=`</div><div class="pcol">`;
    h+=`<div class="tile"><div class="ch">Plán měsíce · nástěnka</div><div class="empty" style="margin:0">Plakát a písničky pro ${mName} ${t.y} nejsou v prototypu k dispozici — ukázku najdete na červnu.</div></div>`;
  }
  h+=`</div></div></div>`;
  return h;
}
window.stepPlan=d=>{planIdx=Math.max(0,Math.min(TEMA_MESICE.length-1,planIdx+d));render();};
