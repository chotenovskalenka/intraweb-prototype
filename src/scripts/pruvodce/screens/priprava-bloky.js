/* SCREEN: PRUVODCE_PRIPRAVA – varianty podle nového RVP PV (29. 10. 2026, k porovnání, ?ppv=a|b|c).
   Nový RVP PV (závazný od 1. 9. 2027): obsah se plánuje v integrovaných blocích, které nejsou
   ukotvené v čase – pořadí i délku volí průvodci podle dětí. Blok má název, smysl a očekávané
   výsledky ve čtyřech vzdělávacích oblastech; ŠVP stojí na osmi klíčových kompetencích.
   Z testování (Táňa): „zásobník nápadů", „přidá se podkolonka, abychom věděli, že si vše
   plníme", a pro rodiče zachovat hodnoty. Básnička a písnička týdne zůstávají z TEMA (čte je
   přehled i rodiče). Tři důrazy: A běžící blok, B zásobník, C co plníme. Data jsou ukázková. */
const PPV=(new URLSearchParams(location.search).get('ppv')||'').toLowerCase();
const IB_OBLASTI=[['telo','Dítě a jeho tělo'],['psych','Dítě a jeho psychika'],['spol','Dítě, ten druhý a společnost'],['svet','Dítě a svět']];
const IB_KOMP=[['uc','k učení'],['pr','k řešení problémů'],['kom','komunikační'],['ob','k občanství a udržitelnosti'],
  ['os','osobnostní a sociální'],['pod','k podnikavosti a pracovní'],['dig','digitální'],['kul','kulturní']];
const IB_OBL_LBL=Object.fromEntries(IB_OBLASTI), IB_KOMP_LBL=Object.fromEntries(IB_KOMP);
// zásobník integrovaných bloků ŠVP (celá školka); letos = kdy ho třída letos žila
let IB_ZASOBNIK=[
  {id:'b1',nazev:'Kdo jsem a kam patřím',smysl:'Poznat sebe, kamarády a život skupiny v lese.',obl:['telo','psych','spol'],komp:['os','kom'],
   napady:['Kruh se jmény a gesty','Mapa našeho háje','Pravidla u ohniště spolu s dětmi'],letos:'září 2025'},
  {id:'b2',nazev:'Co nám dává les',smysl:'Zkoumat les všemi smysly a brát si z něj s úctou.',obl:['svet','telo'],komp:['uc','ob'],
   napady:['Stopy zvířat v blátě','Stavba bunkru','Sušení hub a šípků'],letos:'říjen – listopad 2025'},
  {id:'b3',nazev:'Světlo a tma',smysl:'Prožít krátké dny, světýlka a čekání na slunovrat.',obl:['psych','spol','svet'],komp:['kul','os'],
   napady:['Lucerny z dýní','Martinská slavnost','Stínové divadlo'],letos:'prosinec 2025'},
  {id:'b4',nazev:'Voda, sníh a led',smysl:'Pozorovat, jak se voda mění, a hýbat se v zimě venku.',obl:['svet','telo'],komp:['pr','uc'],
   napady:['Ledové mandaly','Měření sněhu','Stopování na sněhu'],letos:'leden – únor 2026'},
  {id:'b5',nazev:'Řemesla a lidé kolem nás',smysl:'Poznat práci lidí a zkusit si ji vlastníma rukama.',obl:['spol','psych'],komp:['pod','kom'],
   napady:['Návštěva truhláře','Pečení chleba','Výroba píšťalky'],letos:'březen 2026'},
  {id:'b6',nazev:'Co roste a klíčí',smysl:'Zasít, pečovat a čekat – od semínka po záhon.',obl:['svet','telo','psych'],komp:['ob','uc'],
   napady:['Klíčení fazolí','Vlastní záhon','Deník rostlinky'],letos:'duben – květen 2026'},
  {id:'b7',nazev:'Na louce a u vody',smysl:'Zkoumat život na louce a u potoka, pečovat o to, co jsme zaseli.',obl:['svet','telo','spol'],komp:['uc','ob','kom'],
   napady:['Lupy a hledání broučků','Stavba hráze na potoce','Sušení bylinek na čaj','Věneček z lučních kytek'],letos:'od 25. 5. 2026'},
  {id:'b8',nazev:'Cesta za pohádkou',smysl:'Vyprávět, hrát a vymýšlet vlastní příběhy.',obl:['psych','spol'],komp:['kom','kul'],
   napady:['Pohádkový kufr','Loutky z větviček','Kreslený příběh na pokračování'],letos:''},
  {id:'b9',nazev:'Moje tělo umí',smysl:'Objevovat, co tělo zvládne, a starat se o něj.',obl:['telo','psych'],komp:['os','pr'],
   napady:['Překážková dráha v lese','Tep po běhu','Co jíme, když jdeme daleko'],letos:''},
];
let IB_BEZI='b7', IB_DALSI=['b8'], ibFiltr='vse';
const ib=id=>IB_ZASOBNIK.find(b=>b.id===id);
const ibTyden=()=>Math.floor((TODAYD-1)/7);
const ibChips=b=>`<span class="ib-chips">${b.obl.map(o=>`<span class="ib-chip">${IB_OBL_LBL[o]}</span>`).join('')}</span>`;
// básnička a písnička aktuálního týdne – stejný zdroj jako přehled („Verše týdne")
function ibVerse(){
  const w=TEMA.tydny[ibTyden()]||{};
  return `<div class="tile"><div class="ch">Tento týden</div>`
    +(w.b?`<div class="tlab">Básnička</div><div class="tval">${w.b}</div>`:'')
    +(w.p?`<div class="tlab" style="margin-top:10px">Písnička</div><div class="tval">${w.p}</div>`:'')
    +(!w.b&&!w.p?`<div class="note2">Básnička ani písnička zatím nejsou.</div>`:'')
    +`<button class="btn-ghost" style="margin-top:12px" onclick="showToast('V prototypu jen náhled')">Upravit verše</button></div>`;
}
function ibRodice(){
  return `<div class="tile"><div class="ch">Rodiče vidí</div><div class="tlab">Hodnota měsíce</div><div class="tval">${TEMA.hodnota||'–'}</div>`
    +(TEMA.intro?`<div class="tval" style="margin-top:8px">${TEMA.intro}</div>`:'')+`</div>`;
}

/* A – Běžící blok: jako dnes jedna věc, kterou třída teď žije; délka podle dětí, ne podle kalendáře. */
function ppvA(){
  const b=ib(IB_BEZI);
  let h=`<div class="ib ib-a"><div class="ib-main">`;
  h+=`<div class="tile ib-hero"><div class="tlab">Teď žijeme blokem</div><div class="ib-nazev">${b.nazev}</div>`
    +`<div class="ib-kdy">${b.letos}${b.id==='b7'?', 2. týden':', 1. týden'}</div><div class="tval">${b.smysl}</div>${ibChips(b)}`
    +`<div class="ib-akce"><button class="btn-ghost" onclick="showToast('V prototypu jen náhled')">Upravit blok</button><button class="btn-ghost" onclick="ibUkoncit()">Ukončit a začít další</button></div></div>`;
  h+=`<div class="tile"><div class="ch">Nápady k bloku</div>${b.napady.map(n=>`<div class="ib-napad">${n}</div>`).join('')}</div>`;
  h+=`</div><div class="ib-side">${ibVerse()}${ibRodice()}`;
  h+=`<div class="tile"><div class="ch">Další na řadě</div>`+(IB_DALSI.length?IB_DALSI.map(id=>`<div class="ib-napad"><b>${ib(id).nazev}</b></div>`).join(''):`<div class="note2">Zatím nic. Vyber ze zásobníku.</div>`)
    +`<div class="tlab" style="margin-top:12px">Letos jsme nepoužili</div>`+IB_ZASOBNIK.filter(x=>!x.letos&&!IB_DALSI.includes(x.id)).map(x=>
      `<div class="ib-napad ib-row"><span>${x.nazev}</span><button class="zsdil" onclick="ibZaradit('${x.id}')">Zařadit</button></div>`).join('')+`</div>`;
  h+=`</div></div>`;
  h+=`<div class="ib-osa"><div class="tlab">Letos</div>`+IB_ZASOBNIK.filter(x=>x.letos).map(x=>`<span class="ib-osa-b${x.id===IB_BEZI?' on':''}"><b>${x.nazev}</b> (${x.letos})</span>`).join('')+`</div>`;
  return h;
}
/* B – Zásobník: knihovna bloků ze ŠVP, filtr podle oblasti; běžící blok je jen proužek nahoře. */
function ppvB(){
  const b=ib(IB_BEZI);
  let h=`<div class="ib ib-b"><div class="tile ib-pruh"><span><span class="tlab">Teď</span> <b>${b.nazev}</b> (${b.letos})</span>`
    +(IB_DALSI.length?`<span><span class="tlab">Další</span> ${IB_DALSI.map(id=>ib(id).nazev).join(', ')}</span>`:'')+`</div>`;
  h+=`<div class="filters">`+[['vse','Všechny'],...IB_OBLASTI].map(([k,l])=>`<button class="${ibFiltr===k?'on':''}" aria-pressed="${ibFiltr===k}" onclick="ibSetFiltr('${k}')">${l}</button>`).join('')+`</div>`;
  h+=`<div class="ib-grid">`+IB_ZASOBNIK.filter(x=>ibFiltr==='vse'||x.obl.includes(ibFiltr)).map(x=>{
    const stav=x.id===IB_BEZI?'<span class="bdg st-ok">právě běží</span>':IB_DALSI.includes(x.id)?'<span class="bdg st-warn">další na řadě</span>'
      :x.letos?`<span class="bdg st-muted">letos: ${x.letos}</span>`:'<span class="bdg pre">letos nepoužitý</span>';
    return `<div class="tile ib-karta"><div class="ib-k-top">${stav}</div><div class="ch">${x.nazev}</div><div class="tval">${x.smysl}</div>${ibChips(x)}`
      +`<div class="ib-k-nap">${x.napady.join(', ')}</div>`
      +(x.id!==IB_BEZI&&!IB_DALSI.includes(x.id)?`<button class="cardlink" onclick="ibZaradit('${x.id}')">Zařadit jako další<span class="cl-sip" aria-hidden="true">→</span></button>`:'')+`</div>`;
  }).join('')+`</div>`;
  h+=`<div class="ib-b-dole">${ibVerse()}${ibRodice()}</div></div>`;
  return h;
}
/* C – Co plníme: rok jako tabulka bloků × oblasti, pod tím kompetence a mezery. */
function ppvC(){
  const rok=IB_ZASOBNIK.filter(x=>x.letos);
  let h=`<div class="ib ib-c"><div class="ib-main"><div class="tile"><div class="ch">Letošní bloky a oblasti</div><div class="ib-tab-wrap"><table class="ib-tab"><thead><tr><th scope="col">Blok</th>`
    +IB_OBLASTI.map(([k,l])=>`<th scope="col">${l}</th>`).join('')+`</tr></thead><tbody>`
    +rok.map(x=>`<tr class="${x.id===IB_BEZI?'on':''}"><th scope="row"><b>${x.nazev}</b><span class="ib-kdy">${x.letos}</span></th>`
      +IB_OBLASTI.map(([k,l])=>`<td>${x.obl.includes(k)?'<span class="ib-tecka" aria-label="ano">●</span>':'<span class="dt-no" aria-label="ne">–</span>'}</td>`).join('')+`</tr>`).join('')
    +`<tr class="ib-sum"><th scope="row">Celkem bloků</th>`+IB_OBLASTI.map(([k])=>`<td>${rok.filter(x=>x.obl.includes(k)).length}</td>`).join('')+`</tr>`
    +`</tbody></table></div></div>`;
  const kc=IB_KOMP.map(([k,l])=>({k,l,n:rok.filter(x=>x.komp.includes(k)).length}));
  h+=`<div class="tile"><div class="ch">Klíčové kompetence za rok</div>`+kc.map(x=>`<div class="ib-komp${x.n?'':' mezera'}"><span>${x.l}</span><span>${x.n?`${x.n} ${x.n===1?'blok':x.n<5?'bloky':'bloků'}`:'zatím v žádném bloku'}</span></div>`).join('')
    +`<div class="note2">Digitální kompetence je v RVP nová. Hodí se ji zařadit do některého z příštích bloků.</div></div>`;
  h+=`</div><div class="ib-side">${ibVerse()}${ibRodice()}</div></div>`;
  return h;
}
function renderPripravaVarianta(){
  return PPV==='b'?ppvB():PPV==='c'?ppvC():ppvA();
}
window.ibSetFiltr=k=>{ibFiltr=k;render();};
window.ibZaradit=id=>{if(!IB_DALSI.includes(id))IB_DALSI.push(id);render();showToast(`${ib(id).nazev}: zařazeno jako další`);};
window.ibUkoncit=()=>{
  if(!IB_DALSI.length){showToast('Nejdřív zařaď další blok');return;}
  const st=ib(IB_BEZI);st.letos='25. 5. – 3. 6. 2026';IB_BEZI=IB_DALSI.shift();ib(IB_BEZI).letos='od 3. 6. 2026';render();showToast(`Začíná blok ${ib(IB_BEZI).nazev}`);
};
