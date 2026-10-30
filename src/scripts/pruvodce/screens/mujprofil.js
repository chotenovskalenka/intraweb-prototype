/* SCREEN: PRUVODCE_MUJPROFIL – profil přihlášeného průvodce s výkazem hodin.
   P6 z testování: „Já tu nemám ani odhlášení… Informace o sobě tu zatím nejsou." a navazující
   přání profilu s výkazem hodin. Není v menu mezi sekcemi – otevírá se z paty menu (jméno),
   stejně jako Nastavení účtu v rodičovské appce. Kdo je „já", určuje role z odkazu. */
/* Hospodářka je v prototypu role bez konkrétního člověka – kdo ji ve Vhaaji dělá, zatím nevíme
   (Míša je průvodkyně, designérka 30. 10. 2026). Nemá telefon ani řádek v rozpisu sestavy. */
const JA_PODLE_ROLE={pruvodce:'Darča',vedouci:'Táňa',kuchyn:'Ksenia'};
const JA_HOSPODARKA={n:'Hospodářka',sur:'',fce:'kmenová data a fond',phone:''};
const ja=()=>role==='hospodarka'?JA_HOSPODARKA:([...guides,...ZAZEMI].find(g=>g.n===JA_PODLE_ROLE[role])||guides[0]);
// délka služby v hodinách ("07:30"–"16:00" → 8,5)
const hodinySluzby=d=>{if(!serving(d))return 0;const m=t=>(+t.split(':')[0])*60+(+t.split(':')[1]);return (m(d.e)-m(d.s))/60;};
const fmtH=h=>(Math.round(h*10)/10).toLocaleString('cs-CZ')+' h';
function renderMujProfil(){
  const g=ja();
  let h=`<div class="dite-head"><div class="pav">${avatar(g,72)}</div><div class="pname">${g.n} ${g.sur}</div><div class="pfull">${!g.fce?'průvodce':g===JA_HOSPODARKA||/průvodce/.test(g.fce)?g.fce:`průvodce (${g.fce})`}</div></div>`;
  if(g.phone)h+=`<div class="tile"><div class="ch">Kontakt</div><div class="np"><span>Telefon</span><b>${g.phone}</b></div></div>`;
  // Výkaz: týdny června z rozpisu služeb. Minulé a běžný týden = odpracováno, další = plán.
  let odpr=0, plan=0;
  const radky=SHIFT_TYDNY.map((t,ti)=>({t,ti})).filter(({t})=>t.m===6).map(({t,ti})=>{
    const r=shiftTyden(ti).find(x=>x.n===g.n); if(!r)return '';
    const dnu=t.do-t.od+1, sl=r.days.slice(0,dnu);
    const hod=sl.reduce((s,d)=>s+hodinySluzby(d),0), volno=sl.filter(d=>d&&d.off).map(d=>d.off);
    const budouci=ti>SHIFT_AKT; budouci?plan+=hod:odpr+=hod;
    return `<div class="np"><span>${shiftLabel(t)}${ti===SHIFT_AKT?' (tento týden)':''}${volno.length?` <span class="sh-off sh-duvod">${volno.join(', ')}</span>`:''}</span><b${budouci?' class="vyk-plan"':''}>${fmtH(hod)}</b></div>`;
  }).join('');
  // zázemí (kuchyň) v rozpisu služeb není – výkaz z něj pak nemá z čeho vzniknout
  if(radky)h+=`<div class="tile"><div class="ch">Výkaz hodin (červen 2026)</div>${radky}`
    +`<div class="np vyk-suma"><span>Odpracováno do tohoto týdne</span><b>${fmtH(odpr)}</b></div>`
    +`<div class="np"><span>Naplánováno na zbytek června</span><b class="vyk-plan">${fmtH(plan)}</b></div>`
    +`<button class="cardlink" onclick="go('pruvodci')">Rozpis služeb ›</button></div>`;
  h+=`<button class="btn-ghost btn-block" onclick="showToast('Odhlášení – jen náhled, v prototypu nefunguje')">Odhlásit se</button>`;
  return h;
}
