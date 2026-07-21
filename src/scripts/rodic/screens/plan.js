/* SCREEN: RODIC_PLAN — tématický plán měsíce: reálné plakáty (nástěnka) + písničky s odkazy.
   Desktop: vlevo téma + písničky/básničky (proklik na YouTube), vpravo plakáty. */
function renderPlan(){
  const song=s=>`<div class="song"><div class="song-h"><span class="song-t">${s.t}</span><span class="song-tag">${s.typ}</span><a class="song-yt" href="${s.yt}" target="_blank" rel="noopener">▶ Poslech</a></div><div class="song-week">${s.tyd}</div><div class="song-tx">${s.txt}</div></div>`;
  let h=`<div class="doch"><div class="page-2col"><div class="pcol">`;
  h+=`<div class="tile"><div class="ch">Téma června · nadšení</div><div class="tval">Radujeme se ze slunečních dnů, sklízíme první jahody, hrášek, třešně, poznáváme sílu bylinek. Při pletení věnečků se těšíme na závěrečnou svatojánskou slavnost.</div></div>`;
  h+=`<div class="tile"><div class="ch">Písničky a básničky</div><div class="note2" style="margin:0 0 8px">Klepnutím na „Poslech" se přehraje na YouTube — můžete si je zazpívat i doma.</div>${PISNE_CERVEN.map(song).join('')}</div>`;
  h+=`</div><div class="pcol">`;
  h+=`<div class="tile"><div class="ch">Plán měsíce · nástěnka</div><div class="note2" style="margin:0 0 10px">Tak, jak ho průvodci vyrábějí a věší ve školce.</div>`+TEMA_POSTERS.map(p=>`<img class="tema-poster" src="${p}" alt="Tématický plán červen" loading="lazy">`).join('')+`</div>`;
  h+=`</div></div></div>`;
  return h;
}
