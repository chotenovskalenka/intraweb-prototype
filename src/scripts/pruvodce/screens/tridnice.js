/* SCREEN: PRUVODCE_TRIDNICE – denní zápis (třídní kniha). Tři pohledy:
     Den   – zápis jednoho dne; každé pole se ukládá samo a nese „kdo a kdy doplnil".
             Pod ním blok „K dětem" (jen pro tým) – jediné místo, kde se poznámky k dětem
             píšou: zápis dne se píše po odchodu dětí, takže i poznámky vznikají v tomtéž
             sezení, ne v telefonu u dětí.
     Týden – téma a pohádka týdne, stav dnů, uzavření týdne, úkoly „je třeba zařídit"
     Děti  – týdenní přehled poznámek k dětem a kdo je zatím bez ní (jen čtení; psaní vede
             do zápisu dne). P1 + legislativa: jména dětí do veřejné části nepatří.
   Žádné „Odeslat": třídnice se píše zpětně a víc lidmi (výzkum), formulář, který se odešle
   a zavře, to neunese. Psaní nevolá render() – kurzor v poli musí zůstat; přepisuje se jen
   podpis pole a stav dne přímo v DOM. Data a stavy jsou v data.js (TR_*). */
let trView='den', trDay=TR_DNES, trWeek=trTydenOd(TR_DNES), trOpenDite=-1;   // den = klíč RRRRMMDD
// formulář poznámky k dítěti v zápisu dne; rozepsaný text přežije render() (třeba klik na poučení)
let trNoteForm=false, trNoteChild=-1, trNoteDraft='';
// úprava / mazání jedné poznámky: {i: dítě, j: pozice v jeho poli}
let trUprava=null, trUpravaDraft='', trMazani=null;
// průzkum vzoru zápisu dne: ?trv=seznam | osa (bez parametru formulář) a právě rozbalené pole
const TR_VAR=(new URLSearchParams(location.search).get('trv')||'pole');
let trOtevrenePole=null, trPisu=null, trInfoOtevreno=false;
// otevřené dny školního roku, které už začaly, a jejich týdny (kalendář je v tridnice-data.js)
const trDny=()=>TR_DNY;
const trTydny=()=>TR_TYDNY_SEZ;
// podpis pole: kdo a kdy – u starších zápisů datum, ať je vidět, že se psalo třeba až druhý den
const trKdyLbl=z=>{if(!z)return '';const x=trInfo(z.den);
  return `${z.kdo} (${z.den===TR_DNES?'dnes':z.den===trPredchozi(TR_DNES)?'včera':x?`${x.d}. ${x.m}.`:''} ${z.cas})`;};
const trBdg=s=>`<span class="bdg st-${s.cls}">${s.lab}</span>`;
// kdo ten den slouží – v červnu z rozpisu služeb (stejný zdroj jako dashboard), dřív ze základní roty
const trSluzba=k=>{const x=trInfo(k);
  return (x.y===2026&&x.m===6?shiftProDen(x.d):SHIFT_ROTA).filter(g=>serving(g.days[x.dow])).map(g=>g.n);};

/* Přepínač Den/Týden/Děti, listování a skok na měsíc – v řádku nadpisu jako u Docházky
   (core.js render). Dřív tři řádky ovládání nad obsahem (převod do vzhledu C, 28. 10. 2026). */
function trHlavicka(){
  const nav=trView==='den'
    ? trNav(trDenLbl(trDay)+(trDay===TR_DNES?'<i class="dn-cur"> (dnes)</i>':''),'trStepDay',trDny().indexOf(trDay),trDny().length)
    : trNav(trTydenLbl(trWeek)+(trWeek===trTydenOd(TR_DNES)?'<i class="dn-cur"> (tento týden)</i>':''),'trStepWeek',trTydny().indexOf(trWeek),trTydny().length);
  // skok na měsíc – školní rok má přes 180 dnů, po jednom se k září nikdo nedoklikne
  const ym=Math.floor((trView==='den'?trDay:trWeek)/100);
  const mesic=`<select class="pin tr-mesic" aria-label="Přejít na měsíc" onchange="trMesic(+this.value)">`
    // jen název měsíce – školní rok (září–červen) má každý měsíc jednou, rok by jen zabíral místo
    +TR_MESICE.map(x=>`<option value="${x.ym}"${x.ym===ym?' selected':''}>${x.lab.replace(/ \d{4}$/,'')}</option>`).join('')+`</select>`;
  return `<div class="dfield"><div class="switch dsw">`
    +[['den','Den'],['tyden','Týden'],['deti','Děti']].map(v=>`<button class="${trView===v[0]?'on':''}" onclick="trSetView('${v[0]}')">${v[1]}</button>`).join('')
    +`</div>${nav}${mesic}</div>`;
}
function renderTridnice(){
  let h=`<div class="tr">`;
  h+=trView==='den'?trRenderDen():trView==='tyden'?trRenderTyden():trRenderDeti();
  return h+`</div>`;
}
function trNav(lbl,fn,i,n){
  return `<div class="dnav"><button onclick="${fn}(-1)" ${i<=0?'disabled':''} aria-label="Předchozí">‹</button><span>${lbl}</span><button onclick="${fn}(1)" ${i>=n-1?'disabled':''} aria-label="Další">›</button></div>`;
}

/* ---- Den ---- */
function trRenderDen(){
  const d=trDay, x=trInfo(d), z=trDen(d), sl=trSluzba(d);
  // datum nese listování v hlavičce – karta dne říká jen stav, kdo slouží a kdo píše.
  // Návod k psaní je schovaný pod „?" (designérka 28. 10. 2026) – klepnutím, ne najetím: na mobilu hover není.
  let h=`<div class="tile tr-meta"><div class="tr-meta-r"><div class="tval">Ve službě: <b>${sl.join(', ')||'nikdo'}</b>. Píše <b>${TR_ZAPISUJE[x.dow]}</b>.</div>`
    +`<span id="tr-stav">${trBdg(trStav(d))}</span><button class="tr-info" onclick="trInfoToggle()" aria-expanded="${trInfoOtevreno}" aria-controls="tr-info-t" aria-label="Jak se třídnice píše">?</button></div>`
    +(trInfoOtevreno?`<div class="tr-info-t" id="tr-info-t" role="note">Ukládá se samo při psaní. Doplnit může kdokoli z týmu, klidně až večer nebo druhý den. Jména dětí sem nepiš – patří do části <a class="tr-inl" href="#tr-kdetem">K dětem</a> pod zápisem, kterou vidí jen tým.</div>`:'')+`</div>`;
  h+=TR_VAR==='seznam'?trDenSeznam(z):TR_VAR==='osa'?trDenOsa(z):trDenPole(z);
  return h+trRenderKDetem(d);
}
window.trInfoToggle=()=>{trInfoOtevreno=!trInfoOtevreno;render();const b=document.querySelector('.tr-info');if(b)b.focus({preventScroll:true});};
/* Příspěvky pole: první zápis a doplňky dalších průvodců (`dop`, viz tridnice-data.js).
   Každý píše a upravuje jen svůj příspěvek – cizí text se čte, nepřepisuje. */
const trPrisp=(z,k)=>{const v=z.pole[k];return v?[v,...(v.dop||[])]:[];};
const trMuj=(z,k)=>trPrisp(z,k).find(x=>x.kdo===ja().n);
const trCizi=(z,k)=>trPrisp(z,k).filter(x=>x.kdo!==ja().n);
const trPrispHTML=x=>`<div class="tr-pr"><div class="tr-pr-t">${escTa(x.t)}</div><div class="tr-kdo">${trKdyLbl(x)}</div></div>`;
/* Psací pole pro MŮJ příspěvek. Když už někdo psal, je to „doplnit"; podpis a „Uloženo" se mění
   při psaní (trSet), bez překreslení – kurzor zůstane v poli. */
function trPoleVstup(p,z){
  const muj=trMuj(z,p.k), doplnek=trCizi(z,p.k).length>0, ph=doplnek?'Doplnit…':p.ph;
  const vstup=p.kratke
    ? `<input class="pin" id="trf-${p.k}" value="${esc(muj?muj.t:'')}" placeholder="${ph}" aria-label="${p.lab}${doplnek?' – doplnit':''}" oninput="trSet('${p.k}',this.value)">`
    : `<textarea class="pta" id="trf-${p.k}" placeholder="${ph}" aria-label="${p.lab}${doplnek?' – doplnit':''}" oninput="trSet('${p.k}',this.value)">${escTa(muj?muj.t:'')}</textarea>`;
  return vstup+`<div class="tr-psani"><span class="tr-kdo" id="trk-${p.k}">${muj?trKdyLbl(muj):''}</span>`
    +`<span class="tr-ulozeno" id="trs-${p.k}" aria-live="polite">${muj?'Uloženo':''}</span>`
    +`<button class="cardlink tr-hotovo" onclick="trHotovo()">Hotovo</button></div>`;
}
/* Obsah pole – stejný ve všech variantách (liší se jen obal: karta, rozbalený řádek, osa):
   cizí příspěvky ke čtení, můj příspěvek jako hotový zápis s „Upravit", nebo psací pole,
   nebo „+ napsat / + doplnit". Poučení o pravidlech patří k „Kam jsme šli" – sada podle místa, jako v Jaatě. */
function trPrispevky(p,z){
  const muj=trMuj(z,p.k), nekdo=trPrisp(z,p.k).length>0;
  let h=trCizi(z,p.k).map(trPrispHTML).join('');
  if(trPisu===p.k)h+=trPoleVstup(p,z);
  else if(muj)h+=`<div class="tr-pr tr-pr-muj"><div class="tr-pr-t">${escTa(muj.t)}</div><div class="tr-pr-f"><span class="tr-kdo">${trKdyLbl(muj)}</span>`
    +`<button class="tr-upravit" onclick="trPsat('${p.k}')" aria-label="Upravit svůj zápis: ${p.lab}">Upravit</button></div></div>`;
  else h+=`<button class="trv-plus" onclick="trPsat('${p.k}')">${nekdo?'+ doplnit':'+ napsat'}</button>`;
  if(p.k==='kde')h+=`<div class="pl">Poučení o pravidlech</div><div class="pchips">`
    +TR_POUCENI.map(([k,l])=>`<button class="${z.pouceni.includes(k)?'on':''}" aria-pressed="${z.pouceni.includes(k)}" onclick="trPouceni('${k}')">${l}</button>`).join('')+`</div>`;
  return h;
}
const trPoleLbl=p=>`${p.lab}${p.volitelne?' <span class="tr-vol">nepovinné</span>':''}`;
/* Varianta „pole" (výchozí): všechna pole jako karty pod sebou. */
function trDenPole(z){
  let h=`<div class="tr-pole">`;
  TR_POLE.forEach(p=>{
    h+=`<div class="tile tr-f${p.siroke?' tr-f-wide':''}"><div class="tr-fh"><span class="tr-fl">${trPoleLbl(p)}</span></div>${trPrispevky(p,z)}</div>`;
  });
  return h+`</div>`;
}
/* PRŮZKUM VZORU (28. 10. 2026) – varianty zápisu dne k porovnání, přepínají se v URL: ?trv=seznam | ?trv=osa
   (srovnávací stránka docs/tridnice-varianty.html). Rozhodne designérka, pak zůstane jedna. */
/* Varianta „seznam": řádek na pole se stavem, náhledem prvního zápisu a počtem zápisů; klepnutím se rozbalí. */
function trDenSeznam(z){
  let h=`<div class="tile trv-seznam">`;
  TR_POLE.forEach(p=>{
    const pr=trPrisp(z,p.k),on=trOtevrenePole===p.k||trPisu===p.k;
    h+=`<div class="trv-r${on?' on':''}${pr.length?' ok':''}"><button class="trv-h" onclick="trPoleOtevri('${p.k}')" aria-expanded="${on}">`
      +`<span class="trv-st" aria-hidden="true">${pr.length?'✓':''}</span><span class="trv-l">${trPoleLbl(p)}</span>`
      +`<span class="trv-n">${pr.length?escTa(pr[0].t):p.volitelne?'':'chybí'}</span>`
      +(pr.length>1?`<span class="trv-pocet" aria-label="${pr.length} zápisy">${pr.length}</span>`:'')
      +`<span class="trv-arr" aria-hidden="true">${on?'⌃':'›'}</span></button>`;
    if(on)h+=`<div class="trv-b">${trPrispevky(p,z)}</div>`;
    h+=`</div>`;
  });
  return h+`</div>`;
}
/* Varianta „osa": den jako deník podél svislé čáry, příspěvky pod sebou jako zápisy v sešitě. */
function trDenOsa(z){
  let h=`<div class="tile trv-osa">`;
  TR_POLE.forEach(p=>{
    const pr=trPrisp(z,p.k);
    h+=`<div class="trv-u${pr.length?' ok':''}${trPisu===p.k?' on':''}"><span class="trv-bod" aria-hidden="true"></span><div class="trv-obs">`
      +`<div class="trv-oh"><span class="tr-fl">${trPoleLbl(p)}</span></div>${trPrispevky(p,z)}</div></div>`;
  });
  return h+`</div>`;
}
// seznam: rozbalit / sbalit řádek (psaní v něm zavře)
window.trPoleOtevri=k=>{const zavrit=trOtevrenePole===k||trPisu===k;trOtevrenePole=zavrit?null:k;trPisu=null;render();};
// psát / upravit vlastní příspěvek; „Hotovo" ho ukáže jako hotový zápis
window.trPsat=k=>{trPisu=k;trOtevrenePole=k;render();const e=document.getElementById('trf-'+k);if(e){e.focus();const n=e.value.length;e.setSelectionRange&&e.setSelectionRange(n,n);}};
window.trHotovo=()=>{const k=trPisu;trPisu=null;render();
  const b=document.querySelector(`[onclick="trPsat('${k}')"]`);if(b)b.focus({preventScroll:true});};
/* K dětem – poznámky toho dne. Jaata je píše na týž list jako den, jen do vlastní části;
   tady stejně: pod zápisem, ale v interní zóně, která se nikdy netiskne. Po uložení zůstane
   formulář otevřený pro další dítě – v Jaatě vzniká u dne poznámek několik naráz. */
function trRenderKDetem(d){
  const poz=trDetiDen(d).sort((a,b)=>byAlpha({c:data[a.i]},{c:data[b.i]}));
  const maDnes=new Set(poz.map(x=>x.i));
  let h=`<div class="zona zona-int tr-kdetem" id="tr-kdetem"><div class="zona-h"><span class="zona-t">K dětem</span>`
    +`<span class="zona-s">Jen pro tým – rodiče to nevidí a do tisku třídnice to nejde.</span></div><div class="tile">`;
  h+=poz.length?poz.map(trRenderPozn).join('')
    :`<div class="empty" style="padding:4px 0 8px;text-align:left">K tomuhle dni zatím žádná poznámka.</div>`;
  if(trNoteForm){
    const deti=data.map((c,i)=>({c,i})).sort(byAlpha);
    h+=`<div class="tr-kd-form"><label class="pl" for="trn-dite">Dítě</label>`
      +`<select class="pin" id="trn-dite" onchange="trNoteChild=+this.value"><option value="-1">Vyber dítě…</option>`
      +deti.map(({c,i})=>`<option value="${i}"${trNoteChild===i?' selected':''}>${full(c)}${maDnes.has(i)?' (už má poznámku)':''}</option>`).join('')+`</select>`
      +`<label class="pl" for="trn-text">Poznámka</label><textarea class="pta" id="trn-text" placeholder="Nálada, vztahy, co se povedlo, zdraví…" oninput="trNoteDraft=this.value">${escTa(trNoteDraft)}</textarea>`
      +`<div class="tr-kd-act"><button class="btn-ghost" onclick="trNoteZavri()">Hotovo</button><button class="btn-primary" onclick="trNoteUloz()">Uložit a další</button></div></div>`;
  }else{
    h+=`<button class="addbtn" onclick="trNoteOtevri(-1)">+ Poznámka k dítěti</button>`;
  }
  return h+`</div></div>`;
}
/* Jedna poznámka: čtení, nebo úprava v místě, nebo potvrzení smazání. Upravit a smazat smí
   kdokoli z týmu – stejně jako psát; po úpravě je u poznámky vidět, kdo ji změnil.
   Smazání se potvrzuje přímo v řádku, protože nejde vrátit. */
function trRenderPozn(x){
  const c=data[x.i], ja_=trUprava&&trUprava.i===x.i&&trUprava.j===x.j, maz=trMazani&&trMazani.i===x.i&&trMazani.j===x.j;
  let h=`<div class="tr-kd${ja_||maz?' tr-kd-on':''}">${avatar(c,28)}<div class="tr-kd-b"><div class="tr-kd-h"><b>${full(c)}</b>`
    +`<span class="tr-kdo">${esc(x.kdo)}${x.upr&&x.upr!==x.kdo?` (upraveno: ${esc(x.upr)})`:''}</span></div>`;
  if(ja_){
    h+=`<textarea class="pta" id="tre-text" aria-label="Upravit poznámku k ${full(c)}" oninput="trUpravaDraft=this.value">${escTa(trUpravaDraft)}</textarea>`
      +`<div class="tr-kd-act"><button class="btn-ghost" onclick="trUpravZrus()">Zrušit</button><button class="btn-primary" onclick="trUpravUloz()">Uložit změnu</button></div>`;
  }else{
    h+=`<div class="tval">${esc(x.t)}</div>`;
    h+=maz
      ? `<div class="tr-kd-maz" role="alert">Smazat poznámku k ${kratke(c)}? Nejde to vrátit.`
        +`<span class="tr-kd-act"><button class="btn-ghost" onclick="trSmazZrus()">Nechat</button><button class="btn-primary tr-btn-danger" onclick="trSmazAno()">Smazat</button></span></div>`
      : `<div class="tr-kd-ops"><button class="zsdil" onclick="trUprav(${x.i},${x.j})" aria-label="Upravit poznámku k ${full(c)}">Upravit</button>`
        +`<button class="zsdil" onclick="trSmaz(${x.i},${x.j})" aria-label="Smazat poznámku k ${full(c)}">Smazat</button></div>`;
  }
  return h+`</div></div>`;
}
// poznámka se hledá v týdnu zobrazeného dne podle dítěte a pozice
const trPozn=(i,j)=>(trDetiTyden(trTydenOd(trDay))[i]||[])[j];
window.trUprav=(i,j)=>{trUprava={i,j};trUpravaDraft=trPozn(i,j).t;trMazani=null;render();
  const t=document.getElementById('tre-text');if(t){t.focus();t.setSelectionRange(t.value.length,t.value.length);}};
window.trUpravZrus=()=>{trUprava=null;trUpravaDraft='';render();};
window.trUpravUloz=()=>{
  if(!trUpravaDraft.trim()){showToast('Prázdnou poznámku smaž tlačítkem Smazat');document.getElementById('tre-text').focus();return;}
  const p=trPozn(trUprava.i,trUprava.j);p.t=trUpravaDraft.trim();p.upr=ja().n;
  trUprava=null;trUpravaDraft='';render();showToast('Poznámka upravena ✓');};
window.trSmaz=(i,j)=>{trMazani={i,j};trUprava=null;render();};
window.trSmazZrus=()=>{trMazani=null;render();};
window.trSmazAno=()=>{
  const poz=trDetiTyden(trTydenOd(trDay)),{i,j}=trMazani;
  poz[i].splice(j,1);if(!poz[i].length)delete poz[i];
  trMazani=null;render();showToast('Poznámka smazána');};
window.trNoteOtevri=i=>{trNoteForm=true;trNoteChild=i;trNoteDraft='';render();
  const el=document.getElementById(i>=0?'trn-text':'trn-dite');if(el){el.focus();el.scrollIntoView({block:'center'});}};
window.trNoteZavri=()=>{trNoteForm=false;trNoteChild=-1;trNoteDraft='';render();};
window.trNoteUloz=()=>{
  if(trNoteChild<0){showToast('Vyber dítě');document.getElementById('trn-dite').focus();return;}
  if(!trNoteDraft.trim()){document.getElementById('trn-text').focus();return;}
  const poz=trDetiTyden(trTydenOd(trDay));
  (poz[trNoteChild]||(poz[trNoteChild]=[])).push({d:trDay,t:trNoteDraft.trim(),kdo:ja().n});
  poz[trNoteChild].sort((a,b)=>a.d-b.d);
  const jm=kratke(data[trNoteChild]);
  trNoteChild=-1;trNoteDraft='';render();showToast('Poznámka k '+jm+' uložena ✓');
  const s=document.getElementById('trn-dite');if(s)s.focus();
};
/* Píše se vždy MŮJ příspěvek: první zápis pole, nebo můj doplněk k cizímu. Smazáním textu příspěvek
   zmizí; když zmizí první zápis, nastoupí za něj nejstarší doplněk. */
window.trSet=(k,v)=>{
  const z=trDen(trDay),me=ja().n,prvni=z.pole[k],novy={t:v,kdo:me,cas:TEDCAS,den:TR_DNES};
  if(!prvni){if(v.trim())z.pole[k]=novy;}
  else if(prvni.kdo===me){
    if(v.trim())Object.assign(prvni,{t:v,cas:TEDCAS,den:TR_DNES});
    else{const [dalsi,...zbytek]=prvni.dop||[];if(dalsi)z.pole[k]=zbytek.length?Object.assign(dalsi,{dop:zbytek}):dalsi;else delete z.pole[k];}
  }else{
    const dop=prvni.dop||(prvni.dop=[]),i=dop.findIndex(x=>x.kdo===me);
    if(v.trim()){if(i>=0)Object.assign(dop[i],{t:v,cas:TEDCAS,den:TR_DNES});else dop.push(novy);}
    else if(i>=0)dop.splice(i,1);
    if(!dop.length)delete prvni.dop;
  }
  const kdo=document.getElementById('trk-'+k);if(kdo)kdo.textContent=v.trim()?trKdyLbl(novy):'';
  const ul=document.getElementById('trs-'+k);if(ul)ul.textContent=v.trim()?'Uloženo':'';
  const st=document.getElementById('tr-stav');if(st)st.innerHTML=trBdg(trStav(trDay));
};
window.trPouceni=k=>{const z=trDen(trDay),i=z.pouceni.indexOf(k);i>=0?z.pouceni.splice(i,1):z.pouceni.push(k);render();};

/* ---- Týden ---- */
function trRenderTyden(){
  const po=trWeek, t=trTyden(po), dny=trDnyTydne(po), otevr=dny.filter(k=>!trInfo(k).zav), konec=otevr[otevr.length-1]<=TR_DNES;
  let h=`<div class="tr-tyden"><div class="tr-col">`;
  h+=`<div class="tile"><div class="ch">Týden</div>`
    +`<label class="pl" for="trt-tema">Téma týdne</label><input class="pin" id="trt-tema" value="${esc(t.tema)}" placeholder="např. Kytičky a věneček" oninput="trSetT('tema',this.value)">`
    +`<label class="pl" for="trt-poh">Pohádka týdne</label><input class="pin" id="trt-poh" value="${esc(t.pohadka)}" placeholder="název, případně jak jsme ji hráli" oninput="trSetT('pohadka',this.value)">`
    +`</div>`;
  h+=`<div class="tile"><div class="ch">Dny</div>`;
  dny.forEach(d=>{
    // co chybí, jen u proběhlých dnů – dnešek ještě běží
    const s=trStav(d), jde=d<=TR_DNES&&s.k!=='zavreno', chybi=d<TR_DNES&&s.k==='rozepsano'?trChybi(d):[];
    h+=`<button class="tr-den" onclick="trGoDay(${d})" ${jde?'':'disabled'}><span class="tr-den-d">${trDenLbl(d)}</span>`
      +`<span class="tr-den-m">${trBdg(s)}${chybi.length?`<span class="tr-chybi">chybí: ${chybi.join(', ')}</span>`:''}</span>`
      +(jde?`<span class="tr-arr" aria-hidden="true">›</span>`:'')+`</button>`;
  });
  h+=`</div></div><div class="tr-col">`;
  // uzavření týdne – Jaata ho má vyplněné ve 100 % týdnů; píše se po posledním dni
  const u=t.uzavreni;
  h+=`<div class="tile"><div class="tr-fh"><label class="ch" for="trt-uz">Uzavření týdne</label><span class="tr-kdo" id="trk-uz">${trKdyLbl(u)}</span></div>`
    +(konec||u
      ? `<textarea class="pta" id="trt-uz" placeholder="Co se za týden povedlo, co příště jinak, na co se připravit dřív." oninput="trSetUz(this.value)">${escTa(u?u.t:'')}</textarea>`
      : `<div class="empty" style="padding:6px 0 0;text-align:left">Píše se po posledním dni týdne.</div>`)
    +`</div>`;
  // úkoly – v Jaatě sloupec „Je třeba zařídit + kdo to udělá"
  const lidi=[...guides,...ZAZEMI].map(g=>g.n);
  h+=`<div class="tile"><div class="ch">Je třeba zařídit</div>`;
  if(!t.ukoly.length)h+=`<div class="empty" style="padding:4px 0 8px;text-align:left">Zatím nic.</div>`;
  t.ukoly.forEach((u,i)=>{
    h+=`<div class="tr-ukol${u.done?' done':''}"><button class="chk${u.done?' on':''}" onclick="trUkol(${i})" aria-pressed="${u.done}" aria-label="${u.done?'Označit jako nehotové':'Označit jako hotové'}">${u.done?'✓':''}</button>`
      +`<span class="tr-ukol-t">${esc(u.t)}</span><span class="tr-ukol-k">${esc(u.kdo)}</span></div>`;
  });
  h+=`<div class="tr-add"><input class="pin" id="tru-t" placeholder="Co je potřeba zařídit…" aria-label="Nový úkol">`
    +`<select class="pin" id="tru-k" aria-label="Kdo to udělá">${lidi.map(n=>`<option${n===ja().n?' selected':''}>${n}</option>`).join('')}</select>`
    +`<button class="btn-ghost" onclick="trUkolAdd()">Přidat</button></div>`;
  h+=`</div></div></div>`;
  return h;
}
window.trSetT=(k,v)=>{trTyden(trWeek)[k]=v;};
window.trSetUz=v=>{const t=trTyden(trWeek);t.uzavreni=v.trim()?{t:v,kdo:ja().n,cas:TEDCAS,den:TR_DNES}:null;
  const k=document.getElementById('trk-uz');if(k)k.textContent=trKdyLbl(t.uzavreni);};
window.trUkol=i=>{const u=trTyden(trWeek).ukoly[i];u.done=!u.done;render();};
window.trUkolAdd=()=>{const t=document.getElementById('tru-t'),k=document.getElementById('tru-k');
  if(!t.value.trim()){t.focus();return;}
  trTyden(trWeek).ukoly.push({t:t.value.trim(),kdo:k.value,done:false});render();showToast('Úkol přidán ✓');};
window.trGoDay=d=>{trDay=d;trView='den';render();};

/* ---- Děti (jen pro tým) ---- */
function trRenderDeti(){
  const po=trWeek, poz=trDetiTyden(po), dny=trDnyTydne(po).filter(k=>k<=TR_DNES&&!trInfo(k).zav);
  const kDni=dny[dny.length-1];   // psát se dá k poslednímu proběhlému dni týdne (dnes, nebo pátek)
  const sPoz=data.filter((c,i)=>(poz[i]||[]).length).length;
  let h=`<div class="zona zona-int tr-deti"><div class="zona-h"><span class="zona-t">Poznámky k dětem</span>`
    +`<span class="zona-s">Jen pro tým – rodiče je nevidí a do tisku třídnice nejdou.</span></div>`;
  h+=`<div class="tile"><div class="tval">Tento týden poznámka u <b>${sPoz} z ${data.length}</b> dětí.</div>`
    +`<div class="note2">Dítě bez poznámky je vidět hned – ať za týden nikdo nezapadne.</div></div>`;
  h+=`<div class="tile tr-dlist">`;
  data.map((c,i)=>({c,i})).sort(byAlpha).forEach(({c,i})=>{
    const n=poz[i]||[], open=trOpenDite===i;
    h+=`<div class="tr-dite${open?' open':''}"><button class="tr-dite-h" onclick="trDite(${i})" aria-expanded="${open}">${avatar(c,28)}<span class="tr-dite-n">${full(c)}</span>`
      +`<span class="tr-dite-s">${n.length?`${n.length} ${n.length===1?'poznámka':n.length<5?'poznámky':'poznámek'}`:'<i>zatím bez poznámky</i>'}</span></button>`;
    if(open){
      h+=`<div class="tr-dite-b">`;
      n.forEach(x=>{h+=`<div class="rozh"><div class="rozhd">${trDenLbl(x.d)} – ${esc(x.kdo)}</div>${esc(x.t)}</div>`;});
      // psaní vede do zápisu dne – jedno místo, kde poznámky vznikají
      h+=`<div class="tr-dite-act"><button class="btn-ghost" onclick="trNapsat(${i},${kDni})">Napsat k ${kDni===TR_DNES?'dnešku':trDenLbl(kDni)}</button>`
        +`<button class="cardlink tr-rok-link" onclick="trRok(${i})">Celý rok v profilu dítěte ›</button></div></div>`;
    }
    h+=`</div>`;
  });
  return h+`</div></div>`;
}
window.trDite=i=>{trOpenDite=trOpenDite===i?-1:i;render();};
// z týdenního přehledu do zápisu dne s předvybraným dítětem
window.trNapsat=(i,d)=>{trDay=d;trWeek=trTydenOd(d);trView='den';if(section!=='tridnice')go('tridnice');trNoteOtevri(i);};
window.trRok=i=>{go('deti');openDite(i);
  const el=document.getElementById('tr-rok');if(el)el.scrollIntoView({block:'start'});};

/* ---- přepínání ---- */
// rozepsaná poznámka patří ke dni – při odchodu z něj se formulář zavře
const trNoteReset=()=>{trOtevrenePole=null;trPisu=null;trNoteForm=false;trNoteChild=-1;trNoteDraft='';trUprava=null;trUpravaDraft='';trMazani=null;};
window.trSetView=v=>{if(v!=='den')trWeek=trTydenOd(trDay);trView=v;trOpenDite=-1;trNoteReset();render();};
window.trStepDay=dir=>{const ds=trDny(),i=ds.indexOf(trDay)+dir;if(i>=0&&i<ds.length){trDay=ds[i];trWeek=trTydenOd(trDay);trNoteReset();render();}};
window.trStepWeek=dir=>{const ws=trTydny(),i=ws.indexOf(trWeek)+dir;if(i>=0&&i<ws.length){trWeek=ws[i];trOpenDite=-1;render();}};
// skok na měsíc: den = první otevřený den měsíce, týden = jeho týden
window.trMesic=ym=>{const k=TR_DNY.find(x=>Math.floor(x/100)===ym);if(!k)return;
  trDay=k;trWeek=trTydenOd(k);trOpenDite=-1;trNoteReset();render();};
// vstup z přehledu: rovnou na daný den
window.trOtevrit=d=>{trDay=d;trWeek=trTydenOd(d);trView='den';trNoteReset();go('tridnice');};
