/* SCREEN: RODIC_FOTKY */
function renderFotky(){
  let h=`<div class="gal">`;
  ['#E3D9C6','#DCE3D6','#D8E0E4','#E8DCD2','#E7E0CE','#DCE3D6'].forEach(()=>h+=`<div class="ph" style="background:#E3D9C6">foto</div>`);
  h+=`</div><div class="note2">Galerie ze školky. Fotky vkládají průvodci; v ostré verzi reálné fotky se souhlasem rodičů, viditelné jen rodičům dané třídy.</div>`;
  return h;
}
