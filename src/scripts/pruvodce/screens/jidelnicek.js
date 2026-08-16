/* SCREEN: PRUVODCE_JIDELNICEK – jídelníček pro průvodce a svačinářku.
   Data jsou sdílená v shared.js (týž dodavatel jako u rodičů, jeden zdroj).

   Dva rozdíly proti rodičovské appce, oba vycházejí z toho, kdo obrazovku používá:

   1) ALERGENY JAKO JMÉNA DĚTÍ. Rodiče zajímá číslo alergenu u vlastního dítěte;
      svačinářku zajímá, KOHO se to týká. Čísla se proto překládají přes ALERGENY_NAZVY
      na děti, které tu alergii mají. Když se jídlo nikoho netýká, nezobrazí se nic –
      obrazovka je tím tišší než rodičovská, ne hlučnější.

   2) LISTOVÁNÍ DO HISTORIE + OPAKOVÁNÍ. Svačinářka chystá svačiny a potřebuje vědět,
      jak často se opakují. Samotné tlačítko „zpět" by ji nutilo pamatovat si, co kde bylo,
      proto se u svačin rovnou počítá výskyt napříč všemi týdny (↻ 3×). */

/* Děti dotčené alergeny jednoho jídla. Vrací křestní jména – na mobilu se příjmení nevejdou
   a v rámci třídy jsou křestní jména jednoznačná. */
function detiSAlergii(kody){
  if(!kody)return [];
  const nazvy=kody.split(',').map(c=>ALERGENY_NAZVY[Number(c.trim())]).filter(Boolean);
  if(!nazvy.length)return [];
  return data.filter(c=>c.alergie&&nazvy.some(n=>c.alergie.toLowerCase().includes(n)))
             .map(c=>c.n);
}

/* Kolikrát se totéž jídlo objeví napříč všemi týdny v datech. Počítá se jen u svačin –
   ty svačinářka plánuje; u obědů skladbu určuje dodavatel. */
function pocetVyskytu(nazev){
  let n=0;
  JIDELNICEK.forEach(t=>t.dny.forEach(den=>den.forEach(it=>{if(it[1]===nazev)n++;})));
  return n;
}

function renderJidelnicek(){
  const t=JIDELNICEK[jidTyden];
  let h=`<div class="doch">`;
  t.dny.forEach((den,i)=>{
    const d=t.od+i, dnes=(d===TODAYD&&t.m===6);
    h+=`<div class="tile"><div class="ch">${DOW[wd(d)]} ${d}. ${t.m}.${dnes?' · dnes':''}</div>`;
    den.forEach(it=>{
      const svacina=it[0].indexOf('Svačinka')===0;
      const deti=detiSAlergii(it[2]);
      const kolik=svacina?pocetVyskytu(it[1]):0;
      // Jména jdou dovnitř .mv, aby seděla POD názvem jídla. Vedle textu je nelze dát:
      // u pěti dětí (mléko) si chip ukousl 40 % šířky a název jídla se rozpadl na pět řádků.
      h+=`<div class="mrow"><span class="mk2">${it[0]}</span><span class="mv">${it[1]}`;
      if(kolik>1)h+=`<span class="jid-op" title="Tato svačina je v datech ${kolik}×">↻ ${kolik}×</span>`;
      if(deti.length)h+=`<span class="jid-alerg">${deti.join(', ')}</span>`;
      h+=`</span></div>`;
    });
    h+=`</div>`;
  });
  h+=`<div class="note2">Jídelníček dodává Mamafood. U jídla svítí jména dětí, které na některou jeho surovinu mají alergii – vychází z jejich karet v sekci Děti. ↻ ukazuje, kolikrát je svačina v jídelníčku celkem.</div>`;
  return h+`</div>`;
}
window.stepJidTyden=d=>{jidTyden=Math.max(0,Math.min(JIDELNICEK.length-1,jidTyden+d));render();};
