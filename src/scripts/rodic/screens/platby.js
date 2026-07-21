/* SCREEN: RODIC_PLATBY – faktury (filtr rok/stav, PDF, neuhrazené rovnou rozevřené s QR) + kulturní fond s QR.
   Desktop: vlevo faktury, vpravo kulturní fond. Faktury i fond jsou per dítě (data.js).
   Žádná samostatná karta „K úhradě" – QR se ukazuje přímo u neuhrazených faktur v seznamu. */
function fakeQR(seed,px){
  const n=25,m=px/n,f=[[0,0],[0,18],[18,0]];
  const inF=(r,c)=>f.some(p=>r>=p[0]&&r<p[0]+7&&c>=p[1]&&c<p[1]+7);
  let s=`<rect width="${px}" height="${px}" fill="#fff"/>`;
  f.forEach(p=>{const x=p[1]*m,y=p[0]*m;s+=`<rect x="${x}" y="${y}" width="${7*m}" height="${7*m}" fill="#111"/><rect x="${x+m}" y="${y+m}" width="${5*m}" height="${5*m}" fill="#fff"/><rect x="${x+2*m}" y="${y+2*m}" width="${3*m}" height="${3*m}" fill="#111"/>`;});
  let h=seed||1;
  for(let r=0;r<n;r++)for(let c=0;c<n;c++){if(inF(r,c))continue;h=(h*1103515245+12345)&0x7fffffff;if((h>>9)&1)s+=`<rect x="${c*m}" y="${r*m}" width="${m}" height="${m}" fill="#111"/>`;}
  return `<svg viewBox="0 0 ${px} ${px}" width="${px}" height="${px}">${s}</svg>`;
}
const faktCena=x=>x.cena-x.sleva;
const vsFmt=v=>String(v).replace(/(\d{4})(\d{2})(\d{2})/,'$1 $2 $3');
const fplural=n=>n===1?'neuhrazená faktura':(n>=2&&n<=4?'neuhrazené faktury':'neuhrazených faktur');

function renderPlatby(){
  const c=cur();
  const unpaid=c.faktury.filter(x=>!x.paid).sort((a,b)=>a.t-b.t);
  const dluh=unpaid.reduce((s,x)=>s+faktCena(x),0);
  const cerpano=fondCerpano(c), zb=c.fond.rocni-cerpano;
  const fondVS=`4920${String(ci+1).padStart(2,'0')}00`;

  let h=`<div class="doch"><div class="page-2col">`;

  /* --- Faktury: filtr rok + stav; neuhrazené rovnou rozevřené s QR --- */
  const roky=[...new Set(c.faktury.map(x=>x.rok))];          // newest-first (pořadí z generátoru)
  if(!roky.includes(faktRok))faktRok=roky[0];
  const list=c.faktury.filter(x=>x.rok===faktRok&&(faktStav==='vse'||(faktStav==='ne'?!x.paid:x.paid)));
  h+=`<div class="tile"><div class="ch">Faktury</div>`;
  if(unpaid.length)h+=`<div class="fakt-due">K úhradě: ${unpaid.length} ${fplural(unpaid.length)} · celkem <b>${kc(dluh)} Kč</b></div>`;
  h+=`<div class="fakt-filter"><select class="pf-in fakt-rok" onchange="setFaktRok(this.value)">${roky.map(r=>`<option${r===faktRok?' selected':''}>${r}</option>`).join('')}</select>`;
  h+=`<div class="filters">${[['vse','Vše',''],['ne','Neuhrazené','danger'],['ano','Uhrazené','']].map(([k,l,cls])=>`<button class="${cls}${faktStav===k?' on':''}" onclick="setFaktStav('${k}')">${l}</button>`).join('')}</div></div>`;
  if(list.length){
    h+=list.map(x=>{
      let r=`<div class="frow${x.paid?'':' frow-due'}"><div class="fL"><div class="fo">Školné · ${x.obdobi}</div><div class="fv">Vystaveno ${x.vystaveno}${x.paid?'':' · splatnost '+x.splatnost}</div></div><div class="fa">${kc(faktCena(x))} Kč</div><span class="ubadge ${x.paid?'ano':'ne'}">${x.paid?'Uhrazeno':'Neuhrazeno'}</span><button class="fbtn" onclick="downloadFaktura('${x.id}')">PDF ↓</button></div>`;
      if(!x.paid){
        r+=`<div class="pay-box"><div class="qrbox">${fakeQR(x.cena,150)}</div><div class="pay-info"><div class="np"><span>Částka</span><b>${kc(faktCena(x))} Kč</b></div><div class="np"><span>Variabilní symbol</span><b>${vsFmt(x.vs)}</b></div><div class="np"><span>Splatnost</span><b>${x.splatnost}</b></div><div class="pay-hint">Naskenujte QR ve své bankovní aplikaci.</div></div></div>`;
      }
      return r;
    }).join('');
  }else{
    h+=`<div class="fempty">V tomto filtru nejsou žádné faktury.</div>`;
  }
  h+=`</div>`;

  /* --- Kulturní fond (rovnou vypsané čerpání + QR pro dobrovolný příspěvek) --- */
  h+=`<div class="tile"><div class="ch">Kulturní fond</div>
    <div class="np"><span>Roční příspěvek</span><b>${kc(c.fond.rocni)} Kč</b></div>
    <div class="np"><span>Vyčerpáno</span><b>${kc(cerpano)} Kč</b></div>
    <div class="np pay"><span>Zbývá</span><b>${kc(zb)} Kč</b></div>
    <div class="fondlab">Z čeho se čerpalo</div>
    ${c.fondlog.map(x=>`<div class="frow"><div class="fL"><div class="fo">${x[0]}</div><div class="fv">${x[1]}</div></div><div class="fa">${kc(x[2])} Kč</div></div>`).join('')}
    <div class="fondlab">Přispět do fondu</div>
    <div class="pay-box"><div class="qrbox">${fakeQR(4242,150)}</div><div class="pay-info"><div class="pay-hint">Chcete přispět víc? Naskenujte a ve své bankovní aplikaci zadejte vlastní částku.</div><div class="np" style="margin-top:6px"><span>Variabilní symbol</span><b>${vsFmt(fondVS)}</b></div></div></div>
    <div class="note2" style="margin-top:12px">Kulturní fond pokrývá divadla, výlety, výtvarný materiál apod. Odečítá se jen za akce, kterých se dítě účastní. Položky jsou demo.</div></div>`;

  return h+`</div></div>`;
}
window.setFaktRok=v=>{faktRok=v;render();};
window.setFaktStav=v=>{faktStav=v;render();};
window.downloadFaktura=id=>{
  const c=cur(), x=c.faktury.find(f=>f.id===id); if(!x)return;
  downloadBlob(dlName('Faktura '+x.obdobi+' '+c.n)+'.pdf',
    makePDF('Faktura - skolne '+x.obdobi,[
      c.n+' '+c.sur,
      'Castka: '+kc(faktCena(x))+' Kc',
      'Variabilni symbol: '+vsFmt(x.vs),
      'Vystaveno: '+x.vystaveno+'   Splatnost: '+x.splatnost,
      x.paid?'Stav: uhrazeno':'Stav: neuhrazeno',
      'Lesni skolka Vhaaji (demo)']),
    'application/pdf');
  showToast('Stahuji fakturu ✓');
};
