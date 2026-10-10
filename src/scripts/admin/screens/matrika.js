/* SCREEN: ADMIN_MATRIKA – děti napříč školkami, kompletnost matriky, export pro MŠMT.
   Terka: výkazy pro MŠMT 4× ročně „mě štvou"; údaje o dítěti na třech místech; přihláška
   je papírová a přepisuje se; nápad „rodiče vyplní dotazník a rovnou se to přepíše".
   Správa uživatelských účtů (525 řádků, hesla, blokace) sem nepatří – to je Patova administrace. */
let mtSkolka='vse', mtPre=false, mtAl=false, mtNekompl=false, mtQuery='', mtOpen=null, mtPozvano=new Set();
function mtList(){
  return NAHRADY_DETI.filter(c=>mtSkolka==='vse'||c.skolka===mtSkolka)
    .filter(c=>!mtPre||c.predskolak).filter(c=>!mtAl||c.alergie).filter(c=>!mtNekompl||matrikaChybi(c).length)
    .filter(c=>!mtQuery||norm(c.n+' '+c.sur).includes(norm(mtQuery)))
    .sort((a,b)=>(a.sur+a.n).localeCompare(b.sur+b.n,'cs'));
}
function renderMatrika(){
  if(mtOpen)return renderMatrikaDite(NAHRADY_DETI.find(c=>c.id===mtOpen));
  const vse=NAHRADY_DETI.filter(c=>mtSkolka==='vse'||c.skolka===mtSkolka), nekompl=vse.filter(c=>matrikaChybi(c).length);
  let h=`<div class="nh-sum">`
    +`<div class="tile nh-k"><div class="nh-l">Dětí</div><div class="nh-n">${vse.length}</div><div class="nh-s">${mtSkolka==='vse'?'ve 4 školkách':SKOLKY.find(s=>s.id===mtSkolka).nazev}</div></div>`
    +`<div class="tile nh-k"><div class="nh-l">Předškoláci</div><div class="nh-n">${vse.filter(c=>c.predskolak).length}</div><div class="nh-s">nástup do ZŠ 2026</div></div>`
    +`<div class="tile nh-k"><div class="nh-l">Alergici</div><div class="nh-n">${vse.filter(c=>c.alergie).length}</div><div class="nh-s">pro kuchyň a výlety</div></div>`
    +`<div class="tile nh-k"><div class="nh-l">Neúplná matrika</div><div class="nh-n ${nekompl.length?'nh-minus':''}">${nekompl.length}</div><div class="nh-s">${nekompl.length?'chybí údaje pro výkaz':'vše vyplněno'}</div></div>`
    +`</div>`;
  h+=`<div class="filters">`+[['vse','Všechny školky'],...SKOLKY.map(s=>[s.id,s.nazev])].map(([k,l])=>
      `<button class="${mtSkolka===k?'on':''}" onclick="mtSkolka='${k}';render()" aria-pressed="${mtSkolka===k}">${l} <span class="cnt">${NAHRADY_DETI.filter(c=>k==='vse'||c.skolka===k).length}</span></button>`).join('')+`</div>`;
  h+=`<div class="nh-bar"><input class="search" placeholder="Najít dítě…" value="${esc(mtQuery)}" oninput="onMtSearch(this.value)">`
    +[['mtPre','Předškoláci',mtPre],['mtAl','Alergici',mtAl],['mtNekompl','Neúplná matrika',mtNekompl]].map(([k,l,on])=>
      `<label class="nh-chk"><input type="checkbox" ${on?'checked':''} onchange="setMt('${k}',this.checked)"> ${l}</label>`).join('')
    +(nekompl.length?`<button class="btn-ghost mt-pozvat" onclick="mtPozvat()">Pozvat rodiče k doplnění (${nekompl.filter(c=>!mtPozvano.has(c.id)).length})</button>`:'')+`</div>`;
  const list=mtList();
  if(!list.length)return h+`<div class="empty">Nikdo neodpovídá filtru.</div>`;
  h+=`<div class="dtab-wrap"><table class="dtab mt-tab"><thead><tr>`+['Dítě','Školka · třída','Narozen','Docházka','Předškolák','Alergie','Matrika'].map(x=>`<th><span>${x}</span></th>`).join('')+`</tr></thead><tbody>`
    +list.map(c=>{const ch=matrikaChybi(c);return `<tr onclick="openMt('${c.id}')"><td class="nm">${c.n} ${c.sur}</td><td>${c.skN}${c.trida!==c.skN?` <span class="dt-no">· ${c.trida}</span>`:''}</td>`
      +`<td>${c.narozen}</td><td>${REZIM_LAB[c.rezim]}</td><td>${c.predskolak?'<span class="bdg ok">ano</span>':'<span class="dt-no">–</span>'}</td>`
      +`<td>${c.alergie?`<span class="mt-al">${c.alergie}</span>`:'<span class="dt-no">–</span>'}</td>`
      +`<td>${ch.length?`<span class="bdg part">chybí: ${ch.join(', ')}</span>${mtPozvano.has(c.id)?' <span class="dt-no">· pozváno</span>':''}`:'<span class="bdg ok">kompletní</span>'}</td></tr>`;}).join('')
    +`</tbody></table></div>`;
  h+=`<div class="nh-cards">`+list.map(c=>{const ch=matrikaChybi(c);return `<button class="acard" onclick="openMt('${c.id}')"><span style="flex:1"><span class="aname">${c.n} ${c.sur}</span><div class="ameta">${c.skN} · ${c.narozen}${c.predskolak?' · předškolák':''}${c.alergie?' · '+c.alergie:''}</div></span>${ch.length?'<span class="bdg part">chybí údaje</span>':''}</button>`;}).join('')+`</div>`;
  h+=`<div class="note2">Export pro MŠMT stáhne výkaz za vybrané školky (v ostrém provozu ZIP po školkách k 30. 9.). Děti s neúplnou matrikou ve výkazu chybět nesmí – proto je jde přímo odsud pozvat k doplnění.</div>`;
  return h;
}
function renderMatrikaDite(c){
  const ch=matrikaChybi(c), z=pripsanoPlatne(c)-c.cerpanoH, dluh=FAKTURY.filter(f=>f.ditId===c.id).reduce((s,f)=>s+kZaplate(f),0);
  const row=(k,v)=>`<div class="np"><span>${k}</span><b>${v||'<span class="nh-minus">chybí</span>'}</b></div>`;
  let h=`<button class="back" onclick="mtOpen=null;render()">← Zpět na děti</button>`;
  h+=`<div class="nh-dh"><div><div class="pname">${c.n} ${c.sur}</div><div class="pfull">${c.skN}${c.trida!==c.skN?' · '+c.trida:''} · ${REZIM_LAB[c.rezim]} docházka${c.predskolak?' · předškolák':''}</div></div>`
    +`<div>${ch.length?`<span class="bdg part">chybí ${ch.length} ${ch.length===1?'údaj':'údaje'}</span>`:'<span class="bdg ok">matrika kompletní</span>'}</div></div>`;
  h+=`<div class="nh-2">`;
  h+=`<div class="tile"><div class="ch">Kmenová data</div>${row('Narozen',c.narozen)}${row('Rodné číslo',c.rc)}${row('Bydliště',c.adresa)}${row('Pojišťovna',c.pojistovna)}${row('Alergie',c.alergie||'žádné')}</div>`;
  h+=`<div class="tile"><div class="ch">Zákonní zástupci</div>`+(c.zz.length?c.zz.map(p=>`${row(p.role,p.jm)}${row('Telefon',p.tel)}${row('E-mail',p.mail)}`).join(''):`<div class="nh-varov">Chybí kontakt na zákonného zástupce – bez něj nejde dítě ve výkazu ani v krizi nikam hlásit.</div>`)+`</div>`;
  h+=`<div class="tile"><div class="ch">Dokumenty</div>${row('GDPR souhlas',c.gdpr?'podepsáno':'')}${row('Potvrzení od lékaře',c.lekar?'doloženo':'')}</div>`;
  // propojení s ostatními sekcemi – jedno dítě, jeden záznam (dnes tři místa)
  h+=`<div class="tile"><div class="ch">Jinde v systému</div>`
    +`<button class="mt-link" onclick="nhOpen='${c.id}';go('nahrady')"><span>Náhrady</span><b class="${z<0?'nh-minus':''}">zbývá ${fmtHod(z)} h ›</b></button>`
    +`<button class="mt-link" onclick="goPlatbyDite('${c.id}')"><span>Platby</span><b class="${dluh?'nh-minus':''}">${dluh?'k úhradě '+kc(dluh)+' Kč':'vše uhrazeno'} ›</b></button></div>`;
  h+=`</div>`;
  if(ch.length)h+=`<button class="btn-primary" onclick="mtPozvat('${c.id}')">${mtPozvano.has(c.id)?'Pozvat znovu':'Pozvat rodiče k doplnění'}</button>`;
  return h;
}
window.setMt=(k,v)=>{({mtPre:()=>mtPre=v,mtAl:()=>mtAl=v,mtNekompl:()=>mtNekompl=v})[k]();render();};
window.onMtSearch=v=>{mtQuery=v;renderKeepFocus();};
window.openMt=id=>{mtOpen=id;render();window.scrollTo(0,0);};
/* Terčin nápad: rodiče vyplní dotazník a údaje se rovnou přepíšou. V rodičovské appce by se
   rodině objevil formulář jen s chybějícími poli; tady se jen eviduje, že pozvánka odešla. */
window.mtPozvat=id=>{const cil=id?[NAHRADY_DETI.find(c=>c.id===id)]:NAHRADY_DETI.filter(c=>(mtSkolka==='vse'||c.skolka===mtSkolka)&&matrikaChybi(c).length);
  cil.forEach(c=>mtPozvano.add(c.id));render();
  showToast(`Pozvánka odeslána ${cil.length} ${cil.length===1?'rodině':'rodinám'} · v aplikaci jim přijde formulář jen s chybějícími údaji`);};
window.exportMsmt=()=>{const l=mtList();
  stahniCSV('vykaz-msmt-2025-26.csv',['Příjmení','Jméno','Datum narození','Rodné číslo','Bydliště','Školka','Třída','Druh docházky','Předškolák','Zdravotní pojišťovna'],
    l.map(c=>[c.sur,c.n,c.narozen,c.rc,c.adresa,c.skN,c.trida,REZIM_LAB[c.rezim],c.predskolak?'ano':'ne',c.pojistovna]));
  const nk=l.filter(c=>matrikaChybi(c).length).length;
  showToast(`Výkaz stažen · ${l.length} dětí${nk?` · ${nk} s neúplnými údaji`:''}`);};
window.goPlatbyDite=id=>{const c=NAHRADY_DETI.find(x=>x.id===id),dl=FAKTURY.filter(f=>f.ditId===id&&kZaplate(f)>0);
  plQuery=c.n+' '+c.sur;plSkolka='vse';plDruh='vse';plStav=dl.length?'k-reseni':'vse';if(dl.length)plMesic=dl[dl.length-1].mesic;go('platby');};
