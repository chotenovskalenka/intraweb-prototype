/* SCREEN: RODIC_FOTKY — galerie ze školky. Desktop: širší mřížka (3–4 sloupce). */
const FOTKY=['var(--photo-1)','var(--photo-2)','var(--photo-3)','var(--photo-4)','var(--photo-5)','var(--photo-2)'];
function renderFotky(){
  let h=`<div class="doch">`;
  h+=`<div class="gal gal-wide">`+FOTKY.map(c=>`<div class="ph" style="background:${c}">foto</div>`).join('')+`</div>`;
  h+=`<div class="note2">Galerie ze školky. Fotky vkládají průvodci; v ostré verzi reálné fotky se souhlasem rodičů, viditelné jen rodičům dané třídy.</div>`;
  return h+`</div>`;
}
