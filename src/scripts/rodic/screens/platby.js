/* SCREEN: RODIC_PLATBY */
function fakeQR(seed,px){
  const n=25,m=px/n,f=[[0,0],[0,18],[18,0]];
  const inF=(r,c)=>f.some(p=>r>=p[0]&&r<p[0]+7&&c>=p[1]&&c<p[1]+7);
  let s=`<rect width="${px}" height="${px}" fill="#fff"/>`;
  f.forEach(p=>{const x=p[1]*m,y=p[0]*m;s+=`<rect x="${x}" y="${y}" width="${7*m}" height="${7*m}" fill="#111"/><rect x="${x+m}" y="${y+m}" width="${5*m}" height="${5*m}" fill="#fff"/><rect x="${x+2*m}" y="${y+2*m}" width="${3*m}" height="${3*m}" fill="#111"/>`;});
  let h=seed||1;
  for(let r=0;r<n;r++)for(let c=0;c<n;c++){if(inF(r,c))continue;h=(h*1103515245+12345)&0x7fffffff;if((h>>9)&1)s+=`<rect x="${c*m}" y="${r*m}" width="${m}" height="${m}" fill="#111"/>`;}
  return `<svg viewBox="0 0 ${px} ${px}" width="${px}" height="${px}">${s}</svg>`;
}
function renderPlatby(){
  const c=cur(), f=c.fond, zb=f.rocni-f.cerpano, due=c.faktury.find(x=>!x.paid);
  let h='';
  if(due){
    h+=`<div class="tile qrtile"><div class="tlab">K úhradě</div><div class="qramt">${kc(due.cena-due.sleva)} Kč</div><div class="qrsub">Školné · ${due.obdobi} · splatnost ${due.due}</div><div class="qrbox">${fakeQR(due.cena,184)}</div><div class="qrhint">Naskenujte QR ve své bankovní aplikaci.<br>Variabilní symbol 49 20 0${ci+1}</div></div>`;
  }else{
    h+=`<div class="tile"><div class="tlab">Platby</div><div class="tval">Vše uhrazeno. Děkujeme 🌿</div></div>`;
  }
  h+=`<button class="tile fondbtn" onclick="openFond()"><div class="ftop"><span class="tlab" style="margin:0">Kulturní fond</span><span class="more">Detail ›</span></div><div class="np" style="margin-top:6px"><span>Zbývá</span><b style="color:var(--forest)">${kc(zb)} Kč</b></div></button>`;
  h+=`<div class="tile"><div class="tlab">Faktury</div>`+c.faktury.map(x=>`<div class="frow"><div class="fL"><div class="fo">Školné · ${x.obdobi}</div><div class="fv">Vystaveno ${x.vystaveno}</div></div><div class="fa">${kc(x.cena-x.sleva)} Kč</div><span class="ubadge ${x.paid?'ano':'ne'}">${x.paid?'Uhrazeno':'Neuhrazeno'}</span><span class="pdf">PDF</span></div>`).join('')+`</div>`;
  return h;
}
