/* DATA: PRUVODCE_TRIDNICE – třídní kniha za celý školní rok 2025/26.
   ===== Rozhodnutí 10. 10. 2026 (viz decision-log „Třídnice v IS") =====
   Předloha: reálná třídní kniha Jaaty 2024/25 (Google tabulka, 43 vyplněných týdnů).
   Kostra je zkrácená na řádky, které Jaata opravdu psala (kolem 90 % dnů); vypadly podřádky
   „povedlo/nepovedlo" a „cíle/posuny" (4–36 %) – slily se do jednoho „Jak to šlo".
   Výzkum: třídnice „žije ze čtení všech, ale padá na zápisu" – píše se zpětně, po kouskách
   a víc lidmi. Proto žádné odeslání ani uzavření: každé pole se ukládá samo a pamatuje si,
   kdo ho naposledy doplnil. Jména dětí do veřejné části nepatří (legislativa, P1) – k dětem
   je samostatná interní část TR_DETI.
   ===== Celý rok (rozhodnutí 11. 10. 2026) =====
   Třídnice sahá od 1. 9. 2025 do dneška, ne jen přes červen jako zbytek prototypu. Den má
   proto klíč podle data (RRRRMMDD, např. 20251014), ne „den v červnu". Minulost je
   vygenerovaná deterministicky (každé načtení ukáže totéž) z témat roku, týdenního rytmu
   Vhaaji a zásobníků textů níže, s mezerami jako v Jaatě: většina dnů zapsaná, občas
   rozepsaný den nebo chybějící evaluace, část zápisů až druhý den ráno. Týden 1.–5. 6.
   je ručně psaný (sedí s adminem a s demem). Načítá se po data.js (bere RYTMUS, SHIFT_ROTA,
   TEMA_ARCHIV, data). */

const TR_POLE=[
  {k:'prichod',lab:'Příchod',ph:'Jak proběhlo předání dětí – v pořádku, nebo co se dělo.'},
  {k:'kruh',lab:'Ranní kruh',ph:'Průběh, básničky, písničky, hry.'},
  {k:'aktivita',lab:'Aktivita dne',ph:'Co jsme dělali.'},
  {k:'jakslo',lab:'Jak to šlo',ph:'Co se povedlo, co příště jinak, posun dětí.'},
  {k:'kde',lab:'Kam jsme šli',ph:'Zahrada, les, město – a co se tam dělo.'},
  {k:'odpocinek',lab:'Odpočinek',ph:'Co jsme četli, jak proběhl klid.'},
  {k:'predskolaci',lab:'Předškoláci',ph:'Jen když měli vlastní program.',volitelne:true},
  {k:'pocasi',lab:'Počasí',ph:'např. slunečno, 22 °C',kratke:true},
  {k:'evaluace',lab:'Evaluace dne',ph:'Jak den plynul jako celek.',siroke:true},
];
const TR_POVINNE=TR_POLE.filter(p=>!p.volitelne).length;
// Sady pravidel bezpečnosti – Jaata je má ve třídnici jako číslované seznamy podle místa.
const TR_POUCENI=[['skolka','Školka a zahrada'],['les','Les'],['mesto','Město a MHD']];
/* Kdo který den třídnici píše – v Jaatě je to sloupec rozvrhu týdne. Odpovídá službám
   v SHIFT_ROTA (zapisuje někdo, kdo ten den slouží). Psát smí kdokoli z týmu. */
const TR_ZAPISUJE=['Darča','Gabča','Honza','Gabča','Honza'];

/* ---- Kalendář školního roku ---- */
const trKey=(y,m,d)=>y*10000+m*100+d;
const TR_DNES=trKey(2026,6,TODAYD);
// dny, kdy je školka zavřená – zobrazí se v týdnu, ale nepíše se do nich
const TR_ZAVRENO={20251028:'státní svátek',20251117:'státní svátek',20260403:'Velký pátek',
  20260406:'Velikonoční pondělí',20260501:'svátek práce',20260508:'Den vítězství'};
[20251222,20251223,20251224,20251225,20251226,20251229,20251230,20251231,20260101,20260102]
  .forEach(k=>{TR_ZAVRENO[k]='vánoční zavření';});
// všechny pracovní dny 1. 9. 2025 – 30. 6. 2026: {k,y,m,d,dow,po,zav}
const TR_KAL=(()=>{
  const out=[], t=new Date(Date.UTC(2025,8,1)), konec=Date.UTC(2026,5,30);
  const k=x=>trKey(x.getUTCFullYear(),x.getUTCMonth()+1,x.getUTCDate());
  while(t.getTime()<=konec){
    const dow=(t.getUTCDay()+6)%7;
    if(dow<5){const p=new Date(t.getTime());p.setUTCDate(p.getUTCDate()-dow);
      out.push({k:k(t),y:t.getUTCFullYear(),m:t.getUTCMonth()+1,d:t.getUTCDate(),dow,po:k(p),zav:TR_ZAVRENO[k(t)]||''});}
    t.setUTCDate(t.getUTCDate()+1);
  }
  return out;
})();
const TR_KAL_K=Object.fromEntries(TR_KAL.map(x=>[x.k,x]));
const trInfo=k=>TR_KAL_K[k];
const trTydenOd=k=>trInfo(k).po;                                   // pondělí týdne
const trDnyTydne=po=>TR_KAL.filter(x=>x.po===po).map(x=>x.k);      // Po–Pá včetně zavřených
// otevřené dny, které už začaly – jen do nich se píše a jen mezi nimi se listuje
const TR_DNY=TR_KAL.filter(x=>!x.zav&&x.k<=TR_DNES).map(x=>x.k);
const TR_TYDNY_SEZ=[...new Set(TR_DNY.map(trTydenOd))];
const trPredchozi=k=>{const i=TR_DNY.indexOf(k);return i>0?TR_DNY[i-1]:null;};
const trDalsi=k=>{const i=TR_DNY.indexOf(k);return i>=0&&i<TR_DNY.length-1?TR_DNY[i+1]:null;};
const trDenLbl=k=>{const x=trInfo(k);return `${DOW[x.dow]} ${x.d}. ${x.m}.`;};
const trDatum=k=>{const x=trInfo(k);return `${x.d}. ${x.m}. ${x.y}`;};
const trTydenLbl=po=>{const ds=trDnyTydne(po).map(trInfo),a=ds[0],b=ds[ds.length-1];
  return a.m===b.m?`${a.d}.–${b.d}. ${b.m}.`:`${a.d}. ${a.m}.–${b.d}. ${b.m}.`;};

/* ---- Zásobníky textů pro vygenerovanou minulost ---- */
// deterministický generátor (Park–Miller) – každé načtení dá stejná data
// Seed se nejdřív zamíchá (Wangův hash): sousední data by jinak dala skoro stejné první
// číslo a všechny dny by začínaly stejným textem.
function trRnd(seed){
  let h=seed|0;h=(h^61)^(h>>>16);h=h+(h<<3);h=h^(h>>>4);h=Math.imul(h,0x27d4eb2d);h=h^(h>>>15);
  let s=((h>>>0)%2147483646)+1;const r=()=>(s=s*16807%2147483647)/2147483647;r();r();return r;}
const TRG={
  temata:['Vítání','Sklizeň – jablíčko','Úroda – dýně','Svatý Václav','Svatý Michael – odvaha a síla',
    'Kaštánky a lístečky','Draku, draku, vyleť výše','Zvířátka na podzim','Svatý Martin – příprava','Svatý Martin – slavnost',
    'Skřítci a obři','Pozdní podzim','1. adventní týden','2. adventní týden','3. adventní týden – adventní spirála',
    'Tři králové','Sněhová vločka','Mráz a sníh','Ptáčci v zimě','Na Hromnice o hodinu více',
    'Předmasopustní veselí','Masopust','Předjaří – sněženka','Předjaří – sluníčko','Semínko, dobrý den',
    'Vynášíme Moranu','Jaro – píšťalka','Velikonoce','Jaro – zajíček','Jaro – brouček','Svátek ohňů',
    'Věneček kytiček','Májový deštíček','Studánko, hlubánko','Studánková slavnost','Žába a rybníček','Zvířátka mají mláďátka','Motýl'],
  pohadky:['O Budulínkovi','Kuřátko a obilí','O veliké řepě','O Smolíčkovi','Hrnečku, vař!','O kohoutkovi a slepičce',
    'Perníková chaloupka','O Palečkovi','O dvanácti měsíčkách','Paní Zima','O zlaté rybce','Tři prasátka','O Popelce',
    'Dlouhý, Široký a Bystrozraký','O neposlušných kůzlátkách','Jak šlo vejce na vandr','O hloupé Hance','O statečném krejčíkovi',
    'Sůl nad zlato','O princezně na hrášku'],
  prichod:['Klidné předání, všichni se rozloučili bez slz.','Vše v pořádku.','Jedno delší loučení – pomohlo krmení slepic.',
    'Dvě děti přišly po deváté (hlášeno předem).','Ranní pláč u jednoho dítěte, po svačině v pohodě.',
    'Rodiče dnes déle na zahradě, rozloučení se táhlo – příště připomenout rituál u branky.','Klidné ráno, děti hned u zvířátek.',
    'Jedno dítě bez holinek – půjčili jsme z rezervy.','Předání rychlé, rodiče spěchali kvůli dopravě.',
    'Klidné, většina dětí byla na místě do 8:15.','Rodičům připomenuto: zítra náhradní oblečení navíc.','Vše v pohodě, podání ruky u branky u všech.'],
  prichodZima:['Mráz, předání uvnitř u kamen.','Děti promrzlé, nejdřív čaj u kamen, pak ven.','Kluzká cesta k maringotce – rodiče doprovázeli až ke dveřím.'],
  kruhStart:['Přivítání, kalendář, svíčka.','Kruh venku pod velkým dubem.','Přivítání a zapálení svíčky, kdo dnes chybí.','Kruh na louce, přivítání sluníčka.'],
  kruhStartZima:['Kruh v maringotce u kamen, svíčka.','Přivítání uvnitř, venku moc fouká.'],
  kruhMid:['rytmická říkadla s dřívky','pohybová hra „Na medvěda"','hádanky k tématu týdne','prstová říkadla','hra „Kdo chybí"','zpívání s bubínky'],
  rytmika:['Rytmika s Niki – tanečky v kruhu, střídání rychle a pomalu.','Rytmika – hra na tělo, tleskání a dupání do rytmu.',
    'Rytmika s dřívky a bubínky, ozvěna rytmu.','Tanečky v kruhu s písničkou týdne.','Rytmika – chůze po čáře do rytmu, zastavení na signál.'],
  putovani:[['k Ďáblické hvězdárně',0],['k rybníku Pod Hájem',0],['na vrch Ládví',0],['do Čimického háje',0],['do Drahaňského údolí',1],
    ['přes Bohnické louky',0],['ke starému lomu',0],['k velkému dubu za skládkou dřeva',0],['tramvají do Troje k řece',1],['k hasičské zbrojnici',1]],
  pohyb:['Pohybovka – kláda, přeskoky snožmo, podlézání.','Překážková dráha v lese.','Hry s padákem na louce.',
    'Lezení na laně mezi stromy.','Běh v hadovi po zahradě, přeskoky přes klacky.','Pohybové hry „Rybičky, rybičky" a „Molekuly".'],
  tvorba:{9:['Malování jablíček akvarelem.','Navlékání korálků na drátky.','Otisky listů na papír.'],
    10:['Draci z papíru a provázku.','Ježci ze šišek a modelíny.','Kaštanová zvířátka.'],
    11:['Lampiony na Martinskou slavnost.','Plstění z rouna – ovečky.','Kreslení svatého Martina na koni.'],
    12:['Svíčky ze včelího vosku.','Adventní věneček ze smrčku.','Ozdoby z vizovického těsta.'],
    1:['Vločky z hedvábného papíru.','Krmítka pro ptáčky z šišek a loje.','Akvarel – sněhová pokrývka.'],
    2:['Masky na masopust.','Modelování z vosku – sněženky.','Tkaní na stávkách.'],
    3:['Setí řeřichy do skořápek.','Morana ze slámy a hadříků.','Píšťalky z vrbového proutí (s pomocí).'],
    4:['Zdobení vajíček voskem.','Pečení jidášů.','Malování broučků na kamínky.'],
    5:['Věnečky z lučních kytiček.','Malování mokrým do mokrého – deštík.','Studánka z kamínků a mechu.'],
    6:['Malování motýlů – symetrie.','Pečení jahodových koláčků.']},
  pohadka:['Divadýlko s loutkami: „{p}".','Kreslení předobědové pohádky „{p}" voskovými bločky.','Hrajeme pohádku „{p}" – děti v rolích.','Vyprávění pohádky „{p}" s ručními loutkami.'],
  kde:['Zahrada – bahenní kuchyně, pískoviště, houpačky.','Les nad maringotkou, stavba domečků z klacků.','Zahrada, štípání a nošení dřeva.',
    'Zahrada a pak les – lano mezi stromy, šplhání.','Les u potoka, stavba hráze z kamenů.','Zahrada – zalévání záhonku, krmení zvířat.'],
  kdeZima:['Zahrada – sáňkování z kopečka.','Les – stopování zvířat ve sněhu.','Zahrada, stavění sněhuláka, pak k kamnům.','Les, krmení ptáčků v krmítkách.'],
  jakslo:['Bavilo všechny, zopakovat.','Menší děti potřebovaly pomoc, starší pracovaly samostatně.','Povedlo se, příště víc času na úklid.',
    'Těžší téma, příště rozdělit do dvou dnů.','Děti vydržely soustředěné skoro celou dobu.','Cesta zpět dlouhá – příště kratší okruh nebo delší svačinová pauza.',
    'Nejmenší odpadly brzy, starší pokračovali – příště nabídnout zjednodušenou variantu.','Velký posun oproti minulému týdnu, děti už vědí, co mají dělat.',
    'Málo materiálu pro všechny, připravit dopředu.','Krásné soustředění, ticho při práci.','Hodně hluku, příště menší skupinky.','Povedlo se – děti samy chtěly pokračovat i odpoledne.'],
  knihy:{9:'Pohádky o mašinkách',10:'Ferda Mravenec',11:'Kubula a Kuba Kubikula',12:'Vánoční pohádky',1:'Dášeňka',2:'Mach a Šebestová',
    3:'Pohádky z mechu a kapradí',4:'Děti z Bullerbynu',5:'Krtek a jeho svět',6:'Kubula a Kuba Kubikula'},
  klid:['Klid, usnula většina.','Neklidnější, dvě děti nemohly usnout.','Nespavci kreslili u stolu.','Klid, nespavci poslouchali audiopohádku.',
    'Rychle klid, venku byli všichni unavení.','Klid, usnuli skoro všichni.'],
  predskolaci:['Grafomotorické listy – oblouky a vlnovky.','Stříhání podle čáry.','Počítání do deseti s kamínky.','První hláska ve slově – hra „Co začíná na…".',
    'Skládání obrázků podle velikosti.','Psaní vlastního jména.','Pomáhali s přípravou stolu k obědu.','Rýmy a slabikování jmen.','Nošení dřeva a skládání do bedýnky.','Tkaní – dokončení podložek.'],
  evaluace:['Klidný, pěkně plynoucí den.','Dobrá nálada, den plynul.','Náročnější den, děti unavené po výletu.','Hodně venku a v bahně – potřeba víc času na převlékání.',
    'Pohodový den, děti hodně spolupracovaly.','Neklidné dopoledne, po obědě se uklidnilo.','Krásný den, ze kterého jsme měli radost.','Málo dětí (rýma), program zkrácen.',
    'Den bez zádrhelů, rytmus dne funguje.','Hodně konfliktů na pískovišti – sledovat, téma na poradu.','Dlouhý den, ale děti nadšené.','Pěkný den, hodně volné hry venku.'],
  uzavreni:['Týden se povedl, téma děti chytlo. Příště připravit materiál dřív.','Deštivé dny zatěžují převlékání – víc spolupráce při svlékání, boty čistit před maringotkou.',
    'Klidný týden. Ranní kruh venku pod dubem se osvědčil, pokračovat.','Hodně dětí chybělo (rýma), program jsme zkrátili. Téma protáhnout do příštího týdne.',
    'Putování bylo nejsilnější zážitek týdne – děti o něm mluví celý týden.','Konflikty u houpaček – zavést pravidlo střídání po deseti.',
    'Předškoláci potřebují víc vlastního programu, rozmyslet na poradě.','Téma týdne bylo spíš teoretické, počasí nepřálo.',
    'Pěkný týden, nové dítě se dobře adaptuje.','Hodně venku, děti spokojené. Doplnit náhradní oblečení v boxech.','Slavnost se povedla, rodiče nadšení. Příště víc pomocníků na úklid.',
    'Unavující týden pro průvodce – na poradu probrat rozdělení odpolední služby.'],
  ukoly:[['Dokoupit čtvrtky A3','Míša'],['Opravit povolené lano v lese','Honza'],['Doplnit náhradní oblečení do boxů','Darča'],['Objednat seno pro kozy','Míša'],
    ['Na poradu: rozdělení odpolední služby','Táňa'],['Vyprat ručníky a povlečení','Gabča'],['Naštípat dřevo do zásoby','Honza'],['Doplnit lékárničku','Táňa'],
    ['Napsat rodičům kvůli holinkám','Darča'],['Opravit dvířka u kurníku','Honza'],['Koupit vosk na svíčky','Gabča'],['Zkontrolovat hasicí přístroj v maringotce','Táňa'],
    ['Odvézt posekanou trávu na kompost','Honza'],['Připravit lampiony na slavnost','Gabča'],['Domluvit divadlo na příští měsíc','Míša']],
  // zima: prosinec–únor; počasí po měsících [popisy, teplota od, do]
  pocasi:{9:[['slunečno','polojasno','přeháňky'],12,24],10:[['zataženo','mlha, pak slunce','déšť','slunečno'],6,16],
    11:[['mlha','zataženo','déšť','vítr'],1,9],12:[['zataženo','sníh','mráz, jasno'],-3,4],1:[['mráz, jasno','sněží','zataženo'],-7,2],
    2:[['zataženo','obleva, bláto','sníh'],-3,7],3:[['slunečno','vítr','přeháňky'],2,13],4:[['slunečno','přeháňky','polojasno'],6,18],
    5:[['slunečno','bouřky odpoledne','polojasno'],11,24],6:[['slunečno','vedro'],18,28]},
};
/* Poznámky k dětem – {a} = koncovka minulého času (-/a), {ý} = ý/á, {sam} = sám/sama.
   Bez jmen jiných dětí: skloňování by se v generátoru nedalo pohlídat. */
const TRG_DETI=['Ráno delší loučení, po svačině už v pohodě.','Celý den veselá nálada, hodně se smál{a}.','Dnes tišší, víc se držel{a} u dospělých. Sledovat.',
  'Dorazil{a} rozespal{ý}, po kruhu se rozjel{a}.','Odpoledne unaven{ý}, usnul{a} hned při čtení.','Neusnul{a}, při odpočinku si potichu prohlížel{a} knížky.',
  'Celé dopoledne ve dvojici u stavění, hezky se domlouvali.','Spor o lopatku na pískovišti – vyřešil{a} rozhovorem, bez pomoci.','Ujal{a} se nejmenších, pomáhal{a} jim s holinkami.',
  'Dnes si hrál{a} hodně {sam} u potoka, spokojeně.','Ve hře na rodinu převzal{a} vedení, ostatní poslouchali.','Strkání ve frontě na oběd, promluvili jsme si, omluvil{a} se.',
  'U tkaní vydržel{a} dlouho, velký posun v soustředění.','Stříhání zatím s pomocí, úchop nůžek trénovat.','Poprvé {sam} zapaloval{a} svíčku v kruhu, velká radost.',
  'Na kládě přejde {sam} celou délku, dřív potřeboval{a} ruku.','Kresba pohádky – hodně detailů, poprvé nakreslil{a} postavu s rukama.','Zná už celou básničku týdne, říkal{a} ji ostatním.',
  'Při putování vydržel{a} celou cestu bez stížností.','Při tvoření rychle hotov{ý}, pak pomáhal{a} uklízet.','Lezení na laně – odvaha roste, dnes až do poloviny.',
  'Pečení: zadělával{a} těsto, vydržel{a} až do konce.','Vyprávěl{a} celou pohádku vlastními slovy, s dějem i postavami.','Oblékl{a} se do bláta {sam}, i holinky a kalhoty.',
  'Odřené koleno v lese – ošetřeno, rodičům řečeno při vyzvednutí.','Rýma a kašel, odpoledne teplota 37,8 – volali jsme rodičům, vyzvedli dřív.',
  'Spadl{a} z houpačky – bez následků, rodičům řečeno.','Málo pil{a}, připomínat čaj.','Oběd snědl{a} celý, i polévku, kterou dřív odmítal{a}.',
  'Oběd skoro nejedl{a}, jen chleba. Zmínit rodičům.','Mokré ponožky – v batohu chyběly náhradní, napsat rodičům.','Hodně otázek o zvířatech, vydržel{a} dlouho u kurníku.',
  'Dnes poprvé řekl{a} v kruhu, co se mu/jí doma stalo – velký krok.','Unavený den, vyzvedli dřív.','Pomáhal{a} nosit dřevo, ve skupině starších dětí.'];
const TRG_DETI_PRE=['Předškoláci: počítání do deseti zvládá, čísla po deseti ještě plete.','Předškoláci: napsal{a} své jméno tiskacím písmem.',
  'Grafomotorika: oblouky plynule, úchop tužky správně.','Rozpozná první hlásku ve slově, rýmy zatím ne.'];
// k měsíci, ne ke konkrétnímu dni (adaptace v září, sauna v zimě…)
const TRG_DETI_MES={9:['Adaptace: rozloučení u branky bez slz, hned k zvířátkům.'],1:['Sauna – po první vodě slzy, napotřetí smích.'],
  2:['Sauna zvládnutá, ledovou vodu už bez slz.'],5:['Upletl{a} věneček z pampelišek, nosil{a} ho celý den.']};
/* Slavnosti roku – mají svůj den: zápis toho dne o nich mluví a poznámky k dětem o slavnosti
   padnou jen na něj (dřív se „Martinská slavnost" objevovala v poznámkách celý týden). */
const TRG_UDALOSTI={
  20250901:{akt:'První den – vítání, prohlídka zahrady a zvířátek, každé dítě si vybralo háček.',deti:'První den: rozloučení u branky bez slz, hned k zvířátkům.'},
  20250926:{akt:'Svatováclavská slavnost a pasování předškoláků.',deti:'Při pasování na předškoláky stál{a} rovně jako rytíř, velká hrdost.',pre:true},
  20251010:{akt:'Michaelská stezka odvahy v lese – úkoly na stanovištích.',kde:'Les nad maringotkou, stezka s fáborky.',pouceni:['les'],deti:'Na stezce odvahy prošel{a} i tmavou část lesa {sam}.'},
  20251111:{akt:'Martinská slavnost – průvod s lampiony, rohlíčky pro všechny.',kde:'Průvod s lampiony lesem k potoku, rodiče s námi.',pouceni:['les'],deti:'Martinská slavnost – nesl{a} lampion celou cestu {sam}, hrd{ý}.'},
  20251210:{akt:'Adventní spirála – každé dítě zapálilo svou svíčku.',kde:'Maringotka, spirála ze smrčku na zemi.',deti:'Na adventní spirále kráčel{a} pomalu a soustředěně, krásná chvíle.'},
  20251219:{akt:'Vánoční besídka s rodiči, zpívání koled a dárky pro zvířátka.',deti:'Na besídce zpíval{a} nahlas, rodiče dojatí.'},
  20260106:{akt:'Tři králové – koledování s papírovými korunami.',deti:'Jako král nesl{a} hvězdu v čele průvodu.'},
  20260217:{akt:'Masopustní průvod v maskách po okolí.',kde:'Průvod přes louky k hasičárně a zpět.',pouceni:['les','mesto'],deti:'Na masopustu v masce, celý průvod ve své roli.'},
  20260320:{akt:'Vynášení Morany k potoku, cestou zpět nesení líta.',kde:'Les k potoku a zpět.',pouceni:['les'],deti:'Moranu pomáhal{a} nést až k potoku.'},
  20260401:{akt:'Velikonoční tvoření a hledání vajíček na zahradě.',deti:'Zdobení vajíček – trpělivě, každé jiné.'},
  20260430:{akt:'Svátek ohňů – opékání a tanec kolem ohně.',kde:'Zahrada, ohniště.',deti:'U ohně opatrně, opékání buřtu zvládl{a} {sam}.'},
  20260520:{akt:'Studánková slavnost – čištění studánky a zpívání.',kde:'Les ke studánce a zpět.',pouceni:['les'],deti:'Při čištění studánky vydržel{a} lovit listí nejdéle.'},
};
const trZena=c=>/á$/.test(c.sur);
const trRod=(c,t)=>{const z=trZena(c);return t.replace(/\{a\}/g,z?'a':'').replace(/\{ý\}/g,z?'á':'ý').replace(/\{sam\}/g,z?'sama':'sám').replace('mu/jí',z?'jí':'mu');};

/* ---- Ručně psaný týden 1.–5. 6. (sedí s adminem a s demem) ---- */
/* Pole = první zápis {t,kdo,cas,den} a volitelně doplňky dalších průvodců `dop` (stejný tvar).
   Třídnici dopisuje víc lidí – každý svůj příspěvek, cizí text se nepřepisuje (designérka 28. 10. 2026).
   Stav dne (trStav) i čtení `.t`/`.kdo` dál berou první zápis. */
const trPole=(t,kdo,cas,den,dop)=>dop?{t,kdo,cas,den,dop}:{t,kdo,cas,den};
let TRIDNICE={
  20260601:{pouceni:['skolka','les'],pole:{
    prichod:trPole('Klidné ráno, předání u branky bez slz. Dvě děti přišly až po deváté (hlášeno).','Darča','15:20',20260601),
    kruh:trPole('Přivítání, kalendář, nová básnička „Uvijeme věneček". Na rytmiku bubínky a dřívka.','Darča','15:20',20260601),
    aktivita:trPole('Rytmika s Niki – tanečky v kruhu, střídání rychle/pomalu.','Darča','15:22',20260601),
    jakslo:trPole('Tanečky bavily i nejmenší. Střídání tempa zvládne asi polovina, zítra zopakovat.','Darča','15:24',20260601),
    kde:trPole('Zahrada a pak les nad maringotkou – stavba domečků z klacků, lano mezi stromy.','Táňa','15:40',20260601),
    odpocinek:trPole('S Táňou „Kubula a Kuba Kubikula", dočteno do str. 34. Klid, usnuli skoro všichni.','Táňa','15:41',20260601),
    pocasi:trPole('slunečno, 24 °C','Darča','15:20',20260601),
    evaluace:trPole('Pohodový začátek týdne, děti dobře naladěné. V lese potřeba víc hlídat hranici u potoka.','Darča','15:30',20260601),
  }},
  20260602:{pouceni:['les'],pole:{
    prichod:trPole('Vše v pořádku, jedno delší loučení s maminkou – pomohlo krmení slepic.','Gabča','16:05',20260602),
    kruh:trPole('Básnička týdne, pohybová hra „Na medvěda".','Gabča','16:05',20260602),
    aktivita:trPole('Putování k Ďáblické hvězdárně, cestou sbírání šišek na výrobu ježků.','Gabča','16:08',20260602),
    jakslo:trPole('Cesta tam v pohodě, zpátky únava – příště kratší okruh nebo delší svačinová pauza.','Gabča','16:10',20260602,
      [trPole('Doplňuji z odpoledne: po přeháňce došlo suché oblečení, příště přibalit náhradní ponožky.','Táňa','18:10',20260602)]),
    kde:trPole('Les, hvězdárna a zpět. Svačina na louce.','Gabča','16:06',20260602),
    predskolaci:trPole('Počítali šišky do desíti a třídili podle velikosti.','Táňa','16:30',20260602),
    pocasi:trPole('polojasno, odpoledne přeháňka','Gabča','16:06',20260602),
  }},
  20260603:{pouceni:['skolka'],pole:{
    prichod:trPole('Klidné, jen jedno dítě přišlo s rodičem až v 9:30 (hlášeno ráno).','Honza','9:40',20260603),
    kruh:trPole('Narozeninový kruh – svíčka, přání, písnička „Šel zahradník".','Honza','9:42',20260603,
      [trPole('Přání vyrobily děti samy z vylisovaných kytek, zpívali i nejmenší.','Darča','9:55',20260603)]),
  }},
};
/* Týdenní část: téma, pohádka týdne (Jaata ji píše jednou týdně), uzavření týdne a úkoly
   „je třeba zařídit + kdo". Klíč = pondělí týdne. */
let TR_TYDNY={
  20260601:{tema:'Kytičky a věneček',pohadka:'O Budulínkovi (divadýlko s loutkami)',uzavreni:null,ukoly:[
    {t:'Dokoupit čtvrtky A3 na kreslení',kdo:'Míša',done:true},
    {t:'Opravit povolené lano mezi stromy v lese',kdo:'Honza',done:false},
    {t:'Na poradu: kdo hlídá hranici u potoka',kdo:'Táňa',done:false},
  ]},
};
/* Poznámky k dětem – vždy jen pro tým, do tisku třídnice nejdou. Jaata je píše týden co
   týden u téměř všech dětí (19 z 23 v průměru), proto po dnech a dohromady za týden.
   Klíč = pondělí týdne → index dítěte → [{d,t,kdo}] (d = klíč dne). Píšou se v zápisu dne
   (blok „K dětem"), čtou se po dnech, za týden (záložka Děti) i za rok v profilu dítěte. */
let TR_DETI={20260601:{
  // Eliška je jediné dítě společné s adminem – tam vedení čte tutéž poznámku
  3:[{d:20260602,t:'Odpoledne vyzvedla babička, loučení v pohodě. Celý den hodně povídala o hvězdárně.',kdo:'Gabča'}],
  18:[{d:20260603,t:'Narozeninový kruh – sama zapálila svíčku, celé dopoledne zářila.',kdo:'Honza'}],
  0:[{d:20260601,t:'Celé dopoledne s Toničkou u tanečků, odpoledne unavená.',kdo:'Darča'}],
  4:[{d:20260601,t:'Postavil s Vojtou největší domeček, ostatní ho obdivovali.',kdo:'Táňa'},{d:20260602,t:'Cestou zpět bolely nohy, chvíli nesen.',kdo:'Gabča'}],
  7:[{d:20260602,t:'Šišky třídil s velkým zaujetím, vydržel u toho nejdéle ze všech.',kdo:'Gabča'}],
  12:[{d:20260602,t:'Ráno dlouhé loučení s maminkou, pak v pohodě. Sledovat (maminka psala do vzkazů).',kdo:'Gabča'}],
  14:[{d:20260601,t:'Při rytmice se drží stranou, zkusit jí dát roli (bubínek).',kdo:'Darča'}],
  21:[{d:20260601,t:'Odřené koleno u potoka – ošetřeno, rodičům řečeno při vyzvednutí.',kdo:'Táňa'}],
}};
// ručně psané poznámky z dřívějška – přepíšou vygenerované u téhož dítěte v tom týdnu
const TR_DETI_RUCNE=[
  [4,20250912,'Adaptace bez slz, hned v klučičí partě u klacků.','Táňa'],[4,20251111,'Martinská slavnost – nesl lampion celou cestu sám, hrdý.','Darča'],
  [4,20260212,'Při stříhání ještě potřebuje pomoc, úchop nůžek trénovat.','Gabča'],[4,20260423,'Velký posun ve stříhání, vločku zvládl skoro sám.','Gabča'],
  [14,20251015,'Drží se hlavně dospělých, s dětmi zatím málo.','Darča'],[14,20260310,'Začíná si hrát ve dvojici s Bárou, hezky se doplňují.','Táňa'],
  [12,20251120,'Ranní loučení delší, pomáhá krmení slepic.','Gabča'],[0,20260128,'Sauna poprvé – po první vodě slzy, napotřetí smích.','Honza'],
];

/* ---- Generátor minulosti (1. 9. 2025 – 29. 5. 2026) ---- */
(()=>{
  const PORADI=['prichod','kruh','aktivita','kde','pocasi','jakslo','odpocinek','evaluace'];
  const rota=dow=>SHIFT_ROTA.filter(g=>serving(g.days[dow])).map(g=>g.n);
  const zima=m=>m===12||m===1||m===2;
  const cas=(r,od,rozsah)=>{const min=od+Math.floor(r()*rozsah);return `${Math.floor(min/60)}:${String(min%60).padStart(2,'0')}`;};
  const tydny=TR_TYDNY_SEZ.filter(po=>po<20260601);
  tydny.forEach((po,wi)=>{
    const rw=trRnd(po), pickW=a=>a[Math.floor(rw()*a.length)];
    const tema=TRG.temata[Math.min(wi,TRG.temata.length-1)], pohadka=TRG.pohadky[wi%TRG.pohadky.length];
    const otevrene=trDnyTydne(po).filter(k=>!trInfo(k).zav);
    // ---- dny ----
    otevrene.forEach(k=>{
      const x=trInfo(k), r=trRnd(k), pick=a=>a[Math.floor(r()*a.length)];
      const prog=(RYTMUS[x.dow]||{}).prog||'';
      const sluzba=rota(x.dow), pise=r()<.85?TR_ZAPISUJE[x.dow]:pick(sluzba);
      // zápis většinou týž den odpoledne, asi pětina až druhý den ráno (jako v Jaatě)
      const pozde=r()<.2&&trDalsi(k), den=pozde?trDalsi(k):k, od=pozde?460:870;
      const arch=TEMA_ARCHIV.find(a=>a.key===`${x.y}-${String(x.m).padStart(2,'0')}`);
      const tyd=arch?arch.tydny[Math.min(3,Math.floor((x.d-1)/7))]:null;
      const basen=tyd&&tyd.b?`básnička „${tyd.b.split(' ').slice(0,4).join(' ').replace(/[,.]$/,'')}…"`:pick(TRG.kruhMid);
      const ud=TRG_UDALOSTI[k];
      let akt, kde, pouceni=['skolka'];
      if(prog==='Putování'){const [cil,mhd]=pick(TRG.putovani);akt=`Putování ${cil}.`;kde=`Cesta ${cil} a zpět, svačina venku.`;pouceni=mhd?['les','mesto']:['les'];}
      else{
        akt=prog==='Rytmika'?pick(TRG.rytmika):prog==='Pohyb'?pick(TRG.pohyb):prog==='Tvorba'?pick(TRG.tvorba[x.m]||TRG.tvorba[9])
          :pick(TRG.pohadka).replace('{p}',pohadka);
        kde=pick(zima(x.m)&&r()<.6?TRG.kdeZima:TRG.kde);
        if(/[Ll]es/.test(kde))pouceni=['skolka','les'];
      }
      if(ud){akt=ud.akt;if(ud.kde)kde=ud.kde;if(ud.pouceni)pouceni=ud.pouceni;}
      const [popisy,tOd,tDo]=TRG.pocasi[x.m];
      const ctenar=pick(sluzba.length?sluzba:[pise]);
      const texty={
        prichod:pick(zima(x.m)&&r()<.4?TRG.prichodZima:TRG.prichod),
        kruh:`${pick(zima(x.m)?TRG.kruhStartZima:TRG.kruhStart)} ${basen.charAt(0).toUpperCase()+basen.slice(1)}${r()<.5?', '+pick(TRG.kruhMid):''}.`,
        aktivita:akt, kde, jakslo:pick(TRG.jakslo),
        odpocinek:`S ${ctenar==='Honza'?'Honzou':ctenar.replace(/a$/,'ou')} „${TRG.knihy[x.m]}", dočteno do str. ${4+Math.floor((x.d-1)*3.2)}. ${pick(TRG.klid)}`,
        pocasi:`${pick(popisy)}, ${tOd+Math.floor(r()*(tDo-tOd+1))} °C`,
        evaluace:pick(TRG.evaluace),
      };
      // mezery: 80 % zapsáno, 10 % chybí jedno pole, 6 % rozepsáno, 4 % nic
      const q=ud?0:r(); let pole=PORADI.slice();   // slavnost se zapíše vždy celá
      if(q>=.8&&q<.9)pole=pole.filter(p=>p!==(r()<.6?'evaluace':'odpocinek'));
      else if(q>=.9&&q<.96)pole=pole.slice(0,3+Math.floor(r()*3));
      else if(q>=.96)pole=[];
      const z={pouceni:pole.length?pouceni:[],pole:{}};
      pole.forEach((p,i)=>{z.pole[p]={t:texty[p],kdo:p==='odpocinek'?ctenar:pise,cas:cas(r,od+i*2,40),den};});
      if(pole.length&&r()<.55)z.pole.predskolaci={t:pick(TRG.predskolaci),kdo:pick(sluzba.length?sluzba:[pise]),cas:cas(r,od+20,30),den};
      TRIDNICE[k]=z;
    });
    // ---- týden ----
    const posl=otevrene[otevrene.length-1];
    const uz=rw()<.88?{t:pickW(TRG.uzavreni),kdo:rw()<.6?'Táňa':TR_ZAPISUJE[trInfo(posl).dow],cas:'16:'+String(10+Math.floor(rw()*40)),den:rw()<.75?posl:(trDalsi(posl)||posl)}:null;
    const ukoly=[];const n=1+Math.floor(rw()*3);
    for(let i=0;i<n;i++){const [t,kdo]=pickW(TRG.ukoly);if(!ukoly.some(u=>u.t===t))ukoly.push({t,kdo,done:rw()<.9});}
    TR_TYDNY[po]={tema,pohadka,uzavreni:uz,ukoly};
    // ---- poznámky k dětem (asi u 19 z 25 dětí týdně) ----
    const sZapisem=otevrene.filter(k=>Object.keys(TRIDNICE[k].pole).length);
    if(!sZapisem.length)return;
    const poz={};
    data.forEach((c,i)=>{
      const r=trRnd(po*31+i*7919), pick=a=>a[Math.floor(r()*a.length)];
      if(r()>.76)return;
      const pocet=r()<.3?2:1, out=[];
      for(let j=0;j<pocet;j++){
        const k=pick(sZapisem); if(out.some(o=>o.d===k))continue;
        const x=trInfo(k), zas=r()<.2&&TRG_DETI_MES[x.m]?TRG_DETI_MES[x.m]:c.predskolak&&r()<.25?TRG_DETI_PRE:TRG_DETI;
        const pisatel=(TRIDNICE[k].pole.evaluace||TRIDNICE[k].pole.prichod||{kdo:TR_ZAPISUJE[x.dow]}).kdo;
        out.push({d:k,t:trRod(c,pick(zas)),kdo:pisatel});
      }
      poz[i]=out.sort((a,b)=>a.d-b.d);
    });
    // slavnost v týdnu: zhruba polovina dětí má poznámku právě z ní
    sZapisem.filter(k=>TRG_UDALOSTI[k]).forEach(k=>{const u=TRG_UDALOSTI[k],x=trInfo(k);
      data.forEach((c,i)=>{const r=trRnd(k*13+i*101);if(r()>.5||(u.pre&&!c.predskolak))return;
        const a=poz[i]||(poz[i]=[]);if(a.some(o=>o.d===k))return;
        a.push({d:k,t:trRod(c,u.deti),kdo:TRIDNICE[k].pole.evaluace.kdo});a.sort((p,q)=>p.d-q.d);});});
    TR_DETI[po]=poz;
  });
  // ruční poznámky z dřívějška – nahradí vygenerované u téhož dítěte v daném týdnu
  TR_DETI_RUCNE.forEach(([i,k,t,kdo])=>{const po=trTydenOd(k),poz=TR_DETI[po]||(TR_DETI[po]={});
    poz[i]=[{d:k,t,kdo}];});
})();

/* ---- Pomocné funkce pro obrazovky ---- */
function trDen(k){return TRIDNICE[k]||(TRIDNICE[k]={pouceni:[],pole:{}});}
function trTyden(po){return TR_TYDNY[po]||(TR_TYDNY[po]={tema:'',pohadka:'',uzavreni:null,ukoly:[]});}
function trDetiTyden(po){return TR_DETI[po]||(TR_DETI[po]={});}
// poznámky k dítěti v jednom dni; j = pozice v poli dítěte – podle ní se poznámka upravuje a maže
const trDetiDen=k=>{const poz=TR_DETI[trTydenOd(k)]||{};
  return Object.keys(poz).flatMap(i=>poz[i].map((x,j)=>({...x,i:+i,j})).filter(x=>x.d===k));};
/* Celý rok jednoho dítěte, nejnovější nahoře – v Jaatě to sbírá list „Listy dětí" (vzorce
   z týdenních listů) a čte se před pohovory s rodiči. */
function trDetiRok(i){
  return Object.keys(TR_DETI).flatMap(po=>(TR_DETI[po][i]||[]).map(x=>({srt:x.d,datum:trDatum(x.d),t:x.t,kdo:x.kdo})))
    .sort((a,b)=>b.srt-a.srt);
}
const trVyplneno=k=>TR_POLE.filter(p=>!p.volitelne&&((TRIDNICE[k]||{pole:{}}).pole[p.k]||{}).t).length;
/* Stav dne: zavřeno / budoucí se nepíše; jinak chybí / rozepsáno n z 8 / zapsáno.
   Dnešek bez zápisu není chyba – den ještě běží. */
function trStav(k){
  const x=trInfo(k);
  if(x&&x.zav)return {k:'zavreno',lab:'zavřeno · '+x.zav,cls:'muted'};
  if(k>TR_DNES)return {k:'budouci',lab:'ještě neproběhl',cls:'muted'};
  const n=trVyplneno(k);
  if(n>=TR_POVINNE)return {k:'hotovo',lab:'zapsáno',cls:'ok'};
  if(!n)return k===TR_DNES?{k:'prazdne',lab:'zatím nic',cls:'muted'}:{k:'chybi',lab:'chybí zápis',cls:'danger'};
  return {k:'rozepsano',lab:`rozepsáno ${n} z ${TR_POVINNE}`,cls:'warn'};
}
// co v proběhlém dni chybí (názvy polí malými písmeny)
const trChybi=k=>TR_POLE.filter(p=>!p.volitelne&&!((TRIDNICE[k]||{pole:{}}).pole[p.k]||{}).t).map(p=>p.lab.toLowerCase());
