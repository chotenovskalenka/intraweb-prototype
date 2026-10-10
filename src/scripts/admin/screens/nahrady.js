/* SCREEN: ADMIN_NAHRADY – Radčina tabulka náhrad, ale spočítaná appkou (draft-admin 4.3).
   Nejsilněji doložená bolest výzkumu (5 hlasů): náhrady nikdo nepočítá – kromě Radky ručně;
   rodič neví, kolik jich má; systém dovolil čerpat i dítěti, které nárok nemělo.
   Per dítě: připsáno (z omluvených hodin podle pravidla školky) · čerpáno · zbývá, v hodinách.
   Detail ukazuje, z čeho náhrada vznikla a jak se čerpala – to je ta „validace", kterou
   vedení chce, a stejná data, jaká potřebuje rodič (Flow 3).
   Náhled pravidla přepočítá zůstatky jiným pravidlem na stejných datech – Terka chce
   rozhodnout mezi 20 % a paušálem a vidět dopad dřív, než se něco změní. Nic se neukládá. */
let nhSkolka='vse', nhJenMinus=false, nhJenBez=false, nhQuery='', nhSort='zbyva', nhDir=1, nhNahled='platne', nhOpen=null;
// typografické minus (−), ne spojovník – u záporných hodin je to číslo, ne pomlčka
const fmtHod=h=>(Math.round(h*10)/10).toLocaleString('cs-CZ').replace('-','−');
// pravidlo, podle kterého se dítě počítá (platné, nebo náhled)
function nhPravidlo(c){
  if(nhNahled==='procento')return {typ:'procento',p:.2};
  if(nhNahled==='pausal')return {typ:'pausal',h:NAHR_PAUSAL};
  return NAHR_PRAVIDLA[c.skolka];
}
const pripsano=(c,pr)=>{pr=pr||nhPravidlo(c);return pr.typ==='procento'?c.omluvenoH*pr.p:pr.h[c.rezim];};
const pripsanoPlatne=c=>pripsano(c,NAHR_PRAVIDLA[c.skolka]);
const zbyva=c=>pripsano(c)-c.cerpanoH;
const pravidloKr=(pr,c)=>pr.typ==='procento'?`${Math.round(pr.p*100)} %`:`paušál ${pr.h[c?c.rezim:'O']} h`;
const pravidloTxt=(pr,c)=>pr.typ==='procento'?`${Math.round(pr.p*100)} % z omluvených hodin`:`paušál ${pr.h[c?c.rezim:'O']} h za rok`;
function nhList(){
  return NAHRADY_DETI
    .filter(c=>nhSkolka==='vse'||c.skolka===nhSkolka)
    .filter(c=>!nhJenMinus||zbyva(c)<0)
    .filter(c=>!nhJenBez||c.cerpanoH===0)
    .filter(c=>!nhQuery||norm(c.n+' '+c.sur).includes(norm(nhQuery)))
    .sort((a,b)=>{const v={dite:x=>x.sur+x.n,skolka:x=>x.skN+x.trida,pripsano:x=>pripsano(x),cerpano:x=>x.cerpanoH,zbyva:x=>zbyva(x)}[nhSort];
      const A=v(a),B=v(b);return (typeof A==='string'?A.localeCompare(B,'cs'):A-B)*nhDir;});
}
function renderNahrady(){
  if(nhOpen)return renderNahradaDite(NAHRADY_DETI.find(c=>c.id===nhOpen));
  const vse=NAHRADY_DETI.filter(c=>nhSkolka==='vse'||c.skolka===nhSkolka);
  // „k čerpání" sčítá jen kladné zůstatky – zápor jednoho dítěte nesníží nárok jiného
  const minus=vse.filter(c=>zbyva(c)<0), kCerpani=vse.reduce((s,c)=>s+Math.max(0,zbyva(c)),0), bez=vse.filter(c=>c.cerpanoH===0);
  const minusH=minus.reduce((s,c)=>s-zbyva(c),0), cerpano=vse.reduce((s,c)=>s+c.cerpanoH,0);
  const nahled=nhNahled!=='platne';
  let h='';
  if(nahled)h+=`<div class="nh-nahled">Náhled: <b>${nhNahled==='procento'?'20 % z omluvených hodin ve všech školkách':'paušál hodin podle docházky ve všech školkách (30 / 80 / 100 h)'}</b> – nic se neukládá, platná pravidla se nemění. <button class="nh-zpet" onclick="setNhNahled('platne')">Zpět na platná pravidla</button></div>`;
  // souhrn – čtyři čísla, na která se vedení ptá
  h+=`<div class="nh-sum">`
    +`<div class="tile nh-k"><div class="nh-l">K čerpání</div><div class="nh-n">${fmtHod(kCerpani)} h</div><div class="nh-s">co se nevyčerpá, propadne ${NAHR_EXP} (za ${NAHR_DNU_DO_EXP} dní)</div></div>`
    +`<div class="tile nh-k"><div class="nh-l">V záporu</div><div class="nh-n nh-minus">${minus.length} dětí</div><div class="nh-s">vyčerpaly o ${fmtHod(minusH)} h víc, než měly nárok</div></div>`
    +`<div class="tile nh-k"><div class="nh-l">Čerpáno letos</div><div class="nh-n">${fmtHod(cerpano)} h</div><div class="nh-s">${vse.length} dětí</div></div>`
    +`<div class="tile nh-k"><div class="nh-l">Bez čerpání</div><div class="nh-n">${bez.length}</div><div class="nh-s">za celý rok nic nevyčerpaly</div></div>`
    +`</div>`;
  // filtry: školka (záložky) + dva přepínače + hledání + náhled pravidla
  h+=`<div class="filters">`+[['vse','Všechny školky'],...SKOLKY.map(s=>[s.id,s.nazev])].map(([k,l])=>
      `<button class="${nhSkolka===k?'on':''}" onclick="setNhSkolka('${k}')" aria-pressed="${nhSkolka===k}">${l} <span class="cnt">${NAHRADY_DETI.filter(c=>k==='vse'||c.skolka===k).length}</span></button>`).join('')+`</div>`;
  h+=`<div class="nh-bar"><input class="search" placeholder="Najít dítě…" value="${esc(nhQuery)}" oninput="onNhSearch(this.value)">`
    +`<label class="nh-chk"><input type="checkbox" ${nhJenMinus?'checked':''} onchange="nhJenMinus=this.checked;render()"> Jen v záporu</label>`
    +`<label class="nh-chk"><input type="checkbox" ${nhJenBez?'checked':''} onchange="nhJenBez=this.checked;render()"> Jen bez čerpání</label>`
    +`<label class="nh-pr">Náhled pravidla <select class="pin" onchange="setNhNahled(this.value)">`
      +[['platne','Platná (podle školek)'],['procento','20 % všude'],['pausal','Paušál všude']].map(([k,l])=>`<option value="${k}"${nhNahled===k?' selected':''}>${l}</option>`).join('')
    +`</select></label></div>`;
  const list=nhList();
  if(!list.length)return h+`<div class="empty">Nikdo neodpovídá filtru.</div>`;
  const col=(k,l)=>{const on=nhSort===k;return `<th class="${on?'srt':''}" aria-sort="${on?(nhDir>0?'ascending':'descending'):'none'}"><button onclick="setNhSort('${k}')">${l}<span class="arw">${on?(nhDir>0?'▲':'▼'):'⇅'}</span></button></th>`;};
  // desktop: tabulka; mobil: karty (admin je desktop-first, ale na telefonu se nesmí rozpadnout)
  h+=`<table class="dtab nh-tab"><thead><tr>${col('dite','Dítě')}${col('skolka','Školka · třída')}<th><span>Docházka</span></th><th><span>Pravidlo</span></th>`
    +`<th><span>Omluveno</span></th>${col('pripsano','Připsáno')}${col('cerpano','Čerpáno')}${col('zbyva','Zbývá')}${nahled?'<th><span>Změna</span></th>':''}</tr></thead><tbody>`
    +list.map(c=>{const pr=nhPravidlo(c),z=zbyva(c),d=pripsano(c)-pripsanoPlatne(c);
      return `<tr onclick="openNahrada('${c.id}')"><td class="nm">${c.n} ${c.sur}</td><td>${c.skN}${c.trida!==c.skN?` <span class="dt-no">· ${c.trida}</span>`:''}</td><td>${REZIM_LAB[c.rezim]}</td>`
        +`<td>${pravidloKr(pr,c)}${!nahled&&!NAHR_PRAVIDLA[c.skolka].overeno?' <span class="bdg part" title="Pravidlo této školky není v podkladech – převzato z Vhaaji">ověřit</span>':''}</td>`
        +`<td>${fmtHod(c.omluvenoH)} h</td><td>${fmtHod(pripsano(c))} h</td><td>${fmtHod(c.cerpanoH)} h</td>`
        +`<td class="${z<0?'nh-minus':''}"><b>${fmtHod(z)} h</b></td>${nahled?`<td class="${d<0?'nh-minus':d>0?'nh-plus':''}">${d?(d>0?'+':'')+fmtHod(d)+' h':'–'}</td>`:''}</tr>`;}).join('')
    +`</tbody></table>`;
  h+=`<div class="nh-cards">`+list.map(c=>{const z=zbyva(c);return `<button class="acard" onclick="openNahrada('${c.id}')"><span style="flex:1"><span class="aname">${c.n} ${c.sur}</span><div class="ameta">${c.skN} · ${REZIM_LAB[c.rezim]} · připsáno ${fmtHod(pripsano(c))} h · čerpáno ${fmtHod(c.cerpanoH)} h</div></span><b class="${z<0?'nh-minus':''}">${fmtHod(z)} h</b></button>`;}).join('')+`</div>`;
  h+=`<div class="note2">Náhrada vzniká jen z absence omluvené do 20:00 předchozího dne. Čerpá se odpoledne navíc nebo úterní docházkou do 17:00; děti s plnou docházkou mohou čerpat i 2 týdny příměstských táborů. Hodiny propadají ${NAHR_EXP}.</div>`;
  return h;
}
function renderNahradaDite(c){
  const pr=NAHR_PRAVIDLA[c.skolka], z=pripsanoPlatne(c)-c.cerpanoH;
  let h=`<button class="back" onclick="closeNahrada()">← Zpět na náhrady</button>`;
  h+=`<div class="nh-dh"><div><div class="pname">${c.n} ${c.sur}</div><div class="pfull">${c.skN}${c.trida!==c.skN?' · '+c.trida:''} · ${REZIM_LAB[c.rezim]} docházka (${REZIM_H[c.rezim]} h denně)</div></div>`
    +`<div class="nh-dz"><span>Zbývá</span><b class="${z<0?'nh-minus':''}">${fmtHod(z)} h</b></div></div>`;
  // výpočet napsaný slovy – ať se dá zkontrolovat proti Radčině tabulce
  h+=`<div class="tile"><div class="ch">Jak se to spočítalo</div>`
    +`<div class="np"><span>Pravidlo ${c.skN}</span><b>${pravidloTxt(pr,c)}${pr.overeno?'':' <span class="bdg part">ověřit</span>'}</b></div>`
    +`<div class="np"><span>Omluveno do 20:00 předchozího dne</span><b>${fmtHod(c.omluvenoH)} h</b></div>`
    +`<div class="np"><span>Připsáno</span><b>${fmtHod(pripsanoPlatne(c))} h</b></div>`
    +`<div class="np"><span>Čerpáno</span><b>− ${fmtHod(c.cerpanoH)} h</b></div>`
    +`<div class="np vyk-suma"><span>Zbývá · propadne ${NAHR_EXP}</span><b class="${z<0?'nh-minus':''}">${fmtHod(z)} h</b></div>`
    +(z<0?`<div class="nh-varov">Dítě vyčerpalo o ${fmtHod(-z)} h víc, než mělo nárok.${c.cerp.some(x=>x.typ==='tabor')?' Většinu spotřeboval příměstský tábor.':''}</div>`:'')
    +`</div>`;
  h+=`<div class="nh-2">`;
  h+=`<div class="tile"><div class="ch">Vznik · z omluvených absencí</div>`
    +c.vznik.map(v=>`<div class="np"><span>${v.mes} <span class="dt-no">· omluveno ${fmtHod(v.omluvenoH)} h</span></span><b>${pr.typ==='procento'?'+ '+fmtHod(v.omluvenoH*pr.p)+' h':'<span class="dt-no">–</span>'}</b></div>`).join('')
    +(pr.typ==='pausal'?`<div class="note2" style="margin-top:6px">Maata má pevný roční balík ${pr.h[c.rezim]} h – omluvy ho nezvyšují, jen se evidují.</div>`:'')+`</div>`;
  h+=`<div class="tile"><div class="ch">Čerpání</div>`
    +(c.cerp.length?c.cerp.map(x=>`<div class="np"><span>${x.datum} · ${x.popis}<span class="nh-kdo">zadal(a) ${x.kdo}${x.obs?` · obsazenost třídy ${x.obs}`:''}</span></span><b>− ${fmtHod(x.h)} h</b></div>`).join('')
      :`<div class="empty-l">Za celý rok nic nevyčerpáno.</div>`)+`</div>`;
  h+=`</div>`;
  return h;
}
window.setNhSkolka=k=>{nhSkolka=k;render();};
window.setNhNahled=v=>{nhNahled=v;render();};
window.setNhSort=k=>{if(nhSort===k)nhDir=-nhDir;else{nhSort=k;nhDir=k==='zbyva'?1:-1;}render();};
window.onNhSearch=v=>{nhQuery=v;renderKeepFocus();};
window.openNahrada=id=>{nhOpen=id;render();window.scrollTo(0,0);};
window.closeNahrada=()=>{nhOpen=null;render();};
window.exportNahrady=()=>{
  stahniCSV('nahrady-2025-26.csv',['Jméno','Školka','Třída','Docházka','Pravidlo','Omluveno (h)','Připsáno (h)','Čerpáno (h)','Zbývá (h)'],
    nhList().map(c=>[c.n+' '+c.sur,c.skN,c.trida,REZIM_LAB[c.rezim],pravidloTxt(nhPravidlo(c),c),fmtHod(c.omluvenoH),fmtHod(pripsano(c)),fmtHod(c.cerpanoH),fmtHod(zbyva(c))]));
  showToast('Staženo · '+nhList().length+' dětí');};
