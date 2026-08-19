/* SCREEN: RODIC_JIDELNICEK – celý jídelníček, navigace po týdnech (JIDELNICEK v data.js).
   H1 + stepper týdnů se renderuje do topbaru (core.js renderHead, stejný vzor jako Tématický plán).
   Řádkově: dny pod sebou v chronologickém pořadí (ne mřížka/sloupce – ty řadí dny nepřehledně). */
function jidLabel(){return jidTydenLabel(JIDELNICEK[jidTyden]);}
function renderJidelnicek(){
  const t=JIDELNICEK[jidTyden];
  let h=`<div class="doch">`;
  t.dny.forEach((den,i)=>{
    // „dnes" jen když sedí i měsíc – v květnové historii by se jinak označil špatný den
    const d=t.od+i, dnes=(d===TODAY&&t.m===6);
    h+=`<div class="tile"><div class="tlab">${DOW[i]} ${d}. ${t.m}.${dnes?' · dnes':''}</div>`
      +den.map(it=>`<div class="mrow"><span class="mk2">${it[0]}</span><span class="mv">${it[1]}</span>${it[2]?`<span class="alerg">${it[2]}</span>`:''}</div>`).join('')
      +`</div>`;
  });
  const vsechnyDny=t.dny.flat();
  h+=`<div class="tile"><div class="tlab">Stravné</div><div class="np"><span>Dopolední svačina</span><b>20 Kč</b></div><div class="np"><span>Oběd</span><b>80 Kč</b></div><div class="np"><span>Odpolední svačina</span><b>15 Kč</b></div></div>`;
  h+=alergenyLegenda(vsechnyDny);
  h+=`<div class="note2">Jídelníček dodává Mamafood. Alergeny jsou uvedené čísly dle přílohy vyhlášky. Při omluvě do 20:00 předchozího dne se stravné nepočítá.</div>`;
  return h+`</div>`;
}
window.stepJidTyden=d=>{jidTyden=Math.max(0,Math.min(JIDELNICEK.length-1,jidTyden+d));render();};
