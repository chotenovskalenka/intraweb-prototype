/* SHARED: helpery sdílené oběma appkami */
const norm=s=>s.toLowerCase();
const esc=s=>(s||'').replace(/"/g,'&quot;');
const escTa=s=>(s||'').replace(/</g,'&lt;');
const fmt=t=>t?t.replace(/^0(\d:)/,'$1'):t;

function avHash(s){let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h;}
function avatar(c,size){
  var SKIN=['#F2C9A0','#E8B07D','#C98A5E','#A56A40','#8A5A3B','#F5D6B8'],HAIR=['#3B2A20','#6B4423','#A6702E','#1F1B17','#C9A24B','#7A4A2A'],BG=['#E7E0CE','#DCE3D6','#E3D9C6','#D8E0E4','#E8DCD2'];
  var h=avHash(c.n+(c.sur||'')),skin=SKIN[h%6],hair=HAIR[(h>>3)%6],bg=BG[(h>>6)%5],st=h%4;
  var hcy=[53,50,54,56][st],hr=[30,31,30,29][st],bun=st===2?'<circle cx="50" cy="26" r="7" fill="'+hair+'"/>':'';
  var svg='<svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"><rect width="100" height="100" fill="'+bg+'"/>'+bun+'<circle cx="50" cy="'+hcy+'" r="'+hr+'" fill="'+hair+'"/><circle cx="50" cy="62" r="24" fill="'+skin+'"/><circle cx="42" cy="60" r="2.6" fill="#3a2f28"/><circle cx="58" cy="60" r="2.6" fill="#3a2f28"/><path d="M43 69 Q50 75 57 69" stroke="#3a2f28" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>';
  return '<span class="av" style="width:'+size+'px;height:'+size+'px">'+svg+'</span>';
}
function renderKeepFocus(){const a=document.activeElement;const pos=a&&a.selectionStart;render();const inp=document.querySelector('#content .search');if(inp){inp.focus();try{inp.setSelectionRange(pos,pos);}catch(e){}}}
function showToast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('on');clearTimeout(window._tt);window._tt=setTimeout(()=>t.classList.remove('on'),1500);}
