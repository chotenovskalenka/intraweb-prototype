/* SCREEN: PRUVODCE_PRIPRAVA – varianty podle nového RVP PV (29. 10. 2026, k porovnání, ?ppv=a|b|c).
   Nový RVP PV (závazný od 1. 9. 2027): obsah se plánuje v integrovaných blocích, které nejsou
   ukotvené v čase – pořadí i délku volí průvodci podle dětí. Blok má název, smysl a očekávané
   výsledky ve čtyřech vzdělávacích oblastech; ŠVP stojí na osmi klíčových kompetencích.
   Z testování (Táňa): „zásobník nápadů", „přidá se podkolonka, abychom věděli, že si vše
   plníme", a pro rodiče zachovat hodnoty. Básnička a písnička týdne zůstávají z TEMA (čte je
   přehled i rodiče). Tři důrazy: A běžící blok, B zásobník činností, C co plníme. Bloky jsou
   skutečné ze ŠVP Vhaaji 2023 (designérka 30. 10. 2026), stav letošního roku je ukázkový. */
const PPV=(new URLSearchParams(location.search).get('ppv')||'').toLowerCase();
/* Integrované bloky přímo ze ŠVP Vhaaji 2023 (kap. 6.1, veřejný na vhaaji.cz): název, hodnoty,
   časová dotace, úvod (první dvě věty), vzdělávací nabídka a dílčí cíle. ŠVP je ještě podle
   starého RVP – bloky jsou vázané na roční dobu a oblasti ani kompetence nového RVP k nim
   zatím přiřazené nejsou, doplní je až přepis ŠVP. `letos` a `hotovo` (které činnosti z
   nabídky třída letos zkusila) jsou ukázková data. */
let IB_ZASOBNIK=[
  {"id": "b1", "nazev": "Naše zahrada, babí léto", "hodnoty": ["vděčnost"], "dotace": "září", "letos": "září 2025", "smysl": "První měsíc školního roku je adaptačním obdobím. Seznamujeme se spolu navzájem, s prostorem školky a zahrady, kde s vděčností sklízíme jablka a hrušky.", "nabidka": ["Seznamovací hry", "Hudebně pohybové hry – imaginativní tematické hry", "Jednoduché pracovní činnosti - sběr a krájení jablek a hrušek, ukládání do bedýnek, louskání ořechů", "Sebeobslužné činnosti - obsluha a věšení batohu na háček, oblečení, obouvání", "Kooperativní činnosti – pomoc starších dětí při jídelním rituálu, procházce, péče o zvířata", "Pozorování přírodních jevů v okolí", "Objevování míst v lese", "Tvůrčí aktivity – společná kresba, malba, modelování z bláta, vosku, navlékání drobných plodů", "Četba, recitace, zpěv, dramatizace"], "cile": ["Seznamování s prostředím školky a jejího okolí a vytváření pozitivního vztahu k němu", "Posilování psychické odolnosti – upevnění rituálu a zvládnutí odloučení od rodičů", "Posilování prosociálního chování, budování důvěry v průvodce", "Spoluvytváření a poznávání pravidel společenství školky", "Rozvíjení schopnosti vytvářet citové vztahy, získávání sebedůvěry", "Seznamování se a osvojování chování ve vztahu k druhému", "Rozvoj fyzické zdatnosti (hrubá, jemná motorika, koordinace ruky a oka)", "Osvojování si dovedností potřebných k vykonávání jednoduchých činností", "Vytváření elementárního povědomí o proměnách přírody v daném ročním období"], "hotovo": [1, 2, 3, 4, 6, 7, 8]},
  {"id": "b2", "nazev": "Podzim v přírodě, chystání se na zimu, Svatomartinská doba", "hodnoty": ["respekt", "dobrotivost"], "dotace": "říjen – listopad", "letos": "říjen – listopad 2025", "smysl": "Radujeme se z darů podzimu, obdivujeme odstíny, kterými se barví listí stromů. Proletíme se s vyrobenými draky a na vlastní kůži zažíváme sílu větru v přírodě.", "nabidka": ["Výroba a pouštění draků – hra s větrem", "Malba a modelování zvířat", "Stavba domečků pro zvířátka a skřítky", "Příprava na Svatomartinský průvod – výroba lucerny", "Kreativní činnosti s přírodninami", "Lokomoční pohybové činnosti, posilování obratnosti s využitím lana", "Hudebně pohybové hry a dramatizace pohádek", "Příprava ohniště, dřeva na oheň a jeho zapálení", "Práce se zahradním nářadím, vyřezávacím nožem, sekyrou – příprava dřeva na oheň, nošení dřeva ke kamnům", "Četba pohádek – vyprávění tematických příběhů", "Recitace, zpěv, vokální činnosti", "Svatomartinský průvod s lucernami"], "cile": ["Poznávání a prožívání cyklických změn v přírodě – koloběh ročních období", "Uvědomění si vlastního těla a působení větru na něj – užívání všech smyslů", "Rozvoj dovedností umožňujících získané zážitky slovně vyjádřit", "Vytvoření povědomí o mezilidských morálních hodnotách – odvaha, dobro, pomoc druhému", "Učení se přizpůsobovat změnám vnějšího prostředí", "Zdokonalování v oblasti hrubé i jemné motoriky", "Vytváření zdravých životních návyků – překonávání nepříjemných pocitů spojených s nepřízní počasí"], "hotovo": [0, 1, 3, 4, 5, 6, 8, 9, 10, 11]},
  {"id": "b3", "nazev": "Doba adventní", "hodnoty": ["pokora"], "dotace": "prosinec", "letos": "prosinec 2025", "smysl": "Čas ztišení a očekávání. Slunečních paprsků je stále málo, dny jsou krátké a tak se trpělivě snažíme uchovávat světlo, které jsme v sobě rozsvítili na Svatého Martina.", "nabidka": ["Poslech čtených a vyprávěných adventních příběhů", "Dramatizace adventního příběhu", "Zpívání adventních písní", "Tvorba adventních věnců", "Adventní rituál – zapalování svíčky na adventním věnci, úkoly v adventním kalendáři", "„pečení“ nepečeného cukroví, zdobení perníčků", "Výzdoba zázemí – tvořivé činnosti", "Výlet za kulturou – adventní divadelní představení", "Sáňkování, bobování (pokud je sníh)", "Vánoční nadílka pro zvířata v lese", "Adventní znění – setkání s rodiči a andělem na zahradě – výroba vánočních ozdob, zpívání koled"], "cile": ["Rozvoj paměti a pozornosti, představivosti a fantazie", "Rozvoj pozitivních citů ve vztahu k sobě, posílení schopnosti sebeovládání", "Rozvíjení schopnosti plně prožívat city", "Posílení kooperativních dovedností", "Seznamování se světem lidí, kultury – se základními kulturně společenskými postoji, návyky, tradicemi", "Vytváření povědomí o mezilidských morálních hodnotách", "Rozvoj receptivních dovedností a kultivovaného projevu", "Rozvoj tvořivosti"], "hotovo": [0, 1, 2, 3, 5, 6, 7, 8, 10]},
  {"id": "b4", "nazev": "Doba Tříkrálová, mrazivá krajina", "hodnoty": ["vzájemnost", "trpělivost"], "dotace": "leden – začátek února", "letos": "leden – únor 2026", "smysl": "Vánoční znovu zrozené světlo s námi zůstává i po svátcích, tentokrát v podobě tříkrálové hvězdy, kdy se i my vydáváme na cestu po jejich stopách. Stopujeme ale i zvířata, která bydlí kolem nás.", "nabidka": ["Tříkrálová stezka lesem", "Tvoření počátečních písmen Tří králů, korun z přírodnin", "Pohybově-rytmické hry s dřívky i bez nich – ťukání do rytmu, na dřívko kamaráda vedle sebe, změna intenzity, rychlosti, vytleskávání slov po slabikách", "Kresba nejvzácnějšího daru od nás pro Ježíška", "Výroba krmítek pro ptáčky a instalace v lese", "Posílení jemné motoriky – úchopu – hry s kolíčky/zobáčky, malování do sněhu", "Posílení hrubé motoriky – bobování, stavění sněhuláků, dolování tunelů, nošení dřeva, překonávání překážek v lese, balanc na kládách, běh, lezení a seskok z výšky s dopomocí průvodce, válení „sudů“, skluz na ledu", "Stopovací bojovka, hledání a odlévání stop"], "cile": ["Rozvoj pohybových schopností – hrubá i jemná motorika", "Rozvoj fyzické i psychické zdatnosti", "Osvojení si dovedností předcházejících čtení a psaní", "Posilování přirozených poznávacích citů – zvídavosti, radosti z objevování", "Podpora a rozvoj zájmu o učení", "Získání schopnosti záměrně řídit svoje chování a ovlivňovat situaci", "Rozvoj interaktivních komunikativních dovedností", "Ochrana osobního soukromí a bezpečí ve vztazích s druhými dětmi i průvodci", "Vytváření povědomí o existenci ostatních kultur a národnosti", "Pochopení, že změny, způsobené lidskou činností mohou prostředí chránit, ale také poškozovat"], "hotovo": [0, 2, 3, 4, 5, 7]},
  {"id": "b5", "nazev": "Doba Masopustní, loučení se zimou", "hodnoty": ["trpělivost", "spravedlnost"], "dotace": "polovina února – polovina března", "letos": "únor – březen 2026", "smysl": "Zima se ubírá ke konci, prověřila naši odolnost a trpělivost a nastává čas slavení a karnevalu – Masopust. Kým bychom si přáli se stát alespoň na jeden den?", "nabidka": ["Výroba hudebních nástrojů – řezání, stříhání, omotávání, vázání uzlů, navlékání", "Práce s těstem a smažení koblih", "Pohybové koordinační aktivity – běh, balanc, lezení, slaňování, houpání", "Kimova hra na téma Masopust", "Masopustní průvod – zpívání masopustních písní, hudebně pohybové hry", "Dramatizace předobědových pohádek", "Výroba a zdobení Morany – řezání, stříhání, svazování, navlékání", "Zpěv písní k vynášení Morany"], "cile": ["Zdokonalování dovedností hrubé a jemné motoriky", "Uvědomění si vlastního těla – poznatků o těle a jeho zdraví", "Poznávání sebe sama, rozvoj dovedností umožňujících získané dojmy a prožitky vyjádřit", "Posilování prosociálního chování", "Rozvoj interaktivních a komunikativních dovedností", "Rozvoj schopnosti projevovat se autenticky", "Rozvoj společenského i estetického vkusu", "Vytváření povědomí o širším přírodním a kulturním prostředí, vývoji a neustálých změnách"], "hotovo": [0, 1, 2, 4, 5, 6, 7]},
  {"id": "b6", "nazev": "Příchod jara, Velikonoce", "hodnoty": ["odpovědnost", "čestnost"], "dotace": "konec března – duben", "letos": "březen – duben 2026", "smysl": "Vynášíme Moranu a s ní odplave všechno, co až do další zimy nechceme. Postní doba očisty v sobě nese esenci očekávání vítání života v novém cyklu.", "nabidka": ["Vynesení Morany s Jaatou", "Hudebně pohybové činnosti – písničky s ukazováním, pohybem", "Pohybové aktivity pro rozvoj koordinace, síly, výdrže", "Práce se dřevem", "Osení", "Probouzení stromů s básničkou", "Nazdobení kvetoucího stromku na zahradě – Líto (symbol jara)", "Pletení pomlázky", "Dramatizace předobědových pohádek", "Rytmizace s ozvučnými dřívky, tleskání v kruhu, ortofaciální gymnastika", "Sázení rostlin a péče o ně", "Společná kresba růstu semínka", "Slavnost ohně"], "cile": ["Osvojení si věku přiměřených praktických dovedností", "Rozvoj paměti a pozornosti, přechod od bezděčných forem těchto funkcí k úmyslným", "Rozvoj schopnosti sebeovládání", "Rozvoj prosociálních postojů a kooperativních dovedností", "Ochrana bezpečí ve vztazích s druhými", "Budování povědomí o mezilidských morálních hodnotách", "Budování povědomí o vývoji a proměnách přírody a schopnost se jim přizpůsobovat", "Rozvoj úcty k životu ve všech jeho formách", "Vytvoření si aktivního postoje ke světu, životu, přírodě"], "hotovo": [1, 2, 3, 4, 6, 7, 8, 9, 11, 12]},
  {"id": "b7", "nazev": "Tvořivá síla přírody, Letnice, Slunovrat", "hodnoty": ["tvořivost", "nadšení"], "dotace": "květen – červen", "letos": "od 4. 5. 2026", "smysl": "Slunce nabírá na síle a příroda je v plném květu. Jejich vůně láká včely a motýly.", "nabidka": ["Výroba dárku/překvapení pro maminky", "Malování kamínků", "Sběr bylinek a sušení", "Pletení věnečků z pampelišek nebo z bylinek", "Výroba bezinkového sirupu", "Vyřezávání lodiček z kůry a posílání je po proudu", "Pokusy s vodou", "Společná recitace a dramatizace předobědových pohádek", "Imaginativní hry", "Oromotorika, napodobování zvuků přírody", "Cvičení jógy, synchronizace pohybu ve skupině", "Pohybové aktivity v lese – síla, vytrvalost, balanc", "Trénink prostorové orientace během výprav", "Výlet na farmu a do Botanické zahrady", "Divadelní představení", "Péče o zahradu a zvířata"], "cile": ["Osvojení si poznatků a dovedností důležitých k podpoře zdraví, bezpečí, osobní pohody i pohody prostředí", "Pochopení, že změny způsobené lidskou činností mohou prostředí chránit, ale i poškozovat", "Rozvoj úcty k životu ve všech jeho formách", "Vytvoření povědomí o sounáležitosti se světem, s živou i neživou přírodou, s lidmi, společností, s planetou Zemí", "Poznávání sebe sama, rozvoj pozitivních citů ve vztahu k sobě", "Rozvoj řečových schopností – mluvního projevu, vyjadřování", "Rozvoj společenského i estetického vkusu"], "hotovo": [0, 1, 3]}
];
let IB_BEZI='b7', ibFiltr='vse';
const ib=id=>IB_ZASOBNIK.find(b=>b.id===id);
const ibIdx=id=>IB_ZASOBNIK.findIndex(b=>b.id===id);
// blok po běžícím v pořadí ŠVP; po Slunovratu začíná nový rok Naší zahradou
const ibDalsi=()=>IB_ZASOBNIK[(ibIdx(IB_BEZI)+1)%IB_ZASOBNIK.length];
const ibChips=b=>`<span class="ib-chips">${b.hodnoty.map(o=>`<span class="ib-chip">${o}</span>`).join('')}</span>`;
const ibPocet=b=>`${b.hotovo.length} z ${b.nabidka.length}`;
// básnička a písnička aktuálního týdne – stejný zdroj jako přehled („Verše týdne")
function ibVerse(){
  const w=TEMA.tydny[Math.floor((TODAYD-1)/7)]||{};
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
// činnost z nabídky bloku jako zaškrtávátko – co jsme letos s dětmi zkusili
const ibCinnost=(b,k)=>{const on=b.hotovo.includes(k);
  return `<button class="ib-cin${on?' on':''}" aria-pressed="${on}" onclick="ibToggle('${b.id}',${k})"><span class="ib-cin-z" aria-hidden="true">${on?'✓':''}</span><span>${b.nabidka[k]}</span></button>`;};

/* A – Běžící blok: jedna věc, kterou třída teď žije, a její nabídka činností (nezkoušené nahoře). */
function ppvA(){
  const b=ib(IB_BEZI), d=ibDalsi(), idx=b.nabidka.map((_,k)=>k);
  let h=`<div class="ib ib-a"><div class="ib-main">`;
  h+=`<div class="tile ib-hero"><div class="tlab">Teď žijeme blokem</div><div class="ib-nazev">${b.nazev}</div>`
    +`<div class="ib-kdy">Letos ${b.letos}${b.id==='b7'?', 5. týden':''}. Podle ŠVP ${b.dotace}.</div><div class="tval">${b.smysl}</div>${ibChips(b)}`
    +`<div class="ib-akce"><button class="btn-ghost" onclick="showToast('V prototypu jen náhled')">Upravit blok</button><button class="btn-ghost" onclick="ibUkoncit()">Ukončit a začít další</button></div></div>`;
  h+=`<div class="tile"><div class="ch">Nabídka činností<span class="c-badge">${ibPocet(b)}</span></div>`
    +`<div class="tlab">Letos jsme ještě nezkusili</div>`+idx.filter(k=>!b.hotovo.includes(k)).map(k=>ibCinnost(b,k)).join('')
    +`<div class="tlab" style="margin-top:12px">Už jsme zkusili</div>`+idx.filter(k=>b.hotovo.includes(k)).map(k=>ibCinnost(b,k)).join('')+`</div>`;
  h+=`</div><div class="ib-side">${ibVerse()}${ibRodice()}`;
  h+=`<div class="tile"><div class="ch">Další na řadě</div><div class="ib-napad"><b>${d.nazev}</b></div><div class="note2">Hodnoty ${d.hodnoty.join(', ')}. Podle ŠVP ${d.dotace}.</div></div>`;
  h+=`</div></div>`;
  h+=`<div class="ib-osa"><div class="tlab">Letos</div>`+IB_ZASOBNIK.map(x=>`<span class="ib-osa-b${x.id===IB_BEZI?' on':''}"><b>${x.nazev}</b> (${x.hodnoty.join(', ')})</span>`).join('')+`</div>`;
  return h;
}
/* B – Zásobník: všech sedm bloků ŠVP s nabídkou činností; filtr ukáže jen to, co letos zůstalo
   nevyzkoušené (Táňino „sáhnout po skrytých věcech, které jsme nepoužili"). */
function ppvB(){
  const b=ib(IB_BEZI), jen=ibFiltr==='nove';
  let h=`<div class="ib ib-b"><div class="tile ib-pruh"><span><span class="tlab">Teď</span> <b>${b.nazev}</b> (letos ${b.letos})</span><span><span class="tlab">Další</span> ${ibDalsi().nazev}</span></div>`;
  h+=`<div class="filters">`+[['vse','Všechny činnosti'],['nove','Letos nevyzkoušené']].map(([k,l])=>`<button class="${ibFiltr===k?'on':''}" aria-pressed="${ibFiltr===k}" onclick="ibSetFiltr('${k}')">${l}</button>`).join('')+`</div>`;
  h+=`<div class="ib-grid">`+IB_ZASOBNIK.map(x=>{
    const stav=x.id===IB_BEZI?'<span class="bdg st-ok">právě běží</span>':`<span class="bdg st-muted">letos: ${x.letos}</span>`;
    const ks=x.nabidka.map((_,k)=>k).filter(k=>!jen||!x.hotovo.includes(k));
    return `<div class="tile ib-karta"><div class="ib-k-top">${stav}</div><div class="ch">${x.nazev}</div>${ibChips(x)}`
      +`<div class="tlab" style="margin-top:12px">${jen?`Nevyzkoušené (${ks.length})`:`Nabídka (${ibPocet(x)} letos)`}</div>`
      +(ks.length?ks.map(k=>ibCinnost(x,k)).join(''):`<div class="note2">Všechno jsme letos zkusili.</div>`)+`</div>`;
  }).join('')+`</div>`;
  h+=`<div class="ib-b-dole">${ibVerse()}${ibRodice()}</div></div>`;
  return h;
}
/* C – Co plníme: rok jako tabulka bloků (hodnoty, kdy, kolik z nabídky), pod tím dílčí cíle
   běžícího bloku ze ŠVP. Oblasti a kompetence nového RVP v ŠVP 2023 nejsou – jen místo pro ně. */
let IB_CILE=new Set([0,2,4]);
function ppvC(){
  const b=ib(IB_BEZI);
  let h=`<div class="ib ib-c"><div class="ib-main"><div class="tile"><div class="ch">Rok v blocích</div><div class="ib-tab-wrap"><table class="ib-tab"><thead><tr>`
    +['Blok','Hodnoty','Letos','Z nabídky'].map(x=>`<th scope="col">${x}</th>`).join('')+`</tr></thead><tbody>`
    +IB_ZASOBNIK.map(x=>`<tr class="${x.id===IB_BEZI?'on':''}"><th scope="row"><b>${x.nazev}</b><span class="ib-kdy">podle ŠVP ${x.dotace}</span></th>`
      +`<td>${x.hodnoty.join(', ')}</td><td>${x.letos}</td><td>${ibPocet(x)}</td></tr>`).join('')
    +`</tbody></table></div></div>`;
  h+=`<div class="tile"><div class="ch">Co plníme v bloku ${b.nazev}</div><div class="tlab">Dílčí cíle ze ŠVP</div>`
    +b.cile.map((c,k)=>{const on=IB_CILE.has(k);return `<button class="ib-cin${on?' on':''}" aria-pressed="${on}" onclick="ibCil(${k})"><span class="ib-cin-z" aria-hidden="true">${on?'✓':''}</span><span>${c}</span></button>`;}).join('')
    +`<div class="note2">ŠVP 2023 je ještě podle starého RVP. Až se přepíše, přibudou sem u každého bloku čtyři vzdělávací oblasti a osm klíčových kompetencí nového RVP.</div></div>`;
  h+=`</div><div class="ib-side">${ibVerse()}${ibRodice()}</div></div>`;
  return h;
}
function renderPripravaVarianta(){
  return PPV==='b'?ppvB():PPV==='c'?ppvC():ppvA();
}
window.ibSetFiltr=k=>{ibFiltr=k;render();};
window.ibToggle=(id,k)=>{const b=ib(id),i=b.hotovo.indexOf(k);i<0?b.hotovo.push(k):b.hotovo.splice(i,1);render();};
window.ibCil=k=>{IB_CILE.has(k)?IB_CILE.delete(k):IB_CILE.add(k);render();};
window.ibUkoncit=()=>{const st=ib(IB_BEZI);st.letos='4. 5. – 3. 6. 2026';const d=ibDalsi();IB_BEZI=d.id;d.letos='od 3. 6. 2026';d.hotovo=[];render();showToast(`Začíná blok ${d.nazev}`);};
