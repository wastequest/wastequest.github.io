/* Eco-Match — memory game: flip cards to pair each WASTE with the waste-to-wealth PRODUCT it becomes.
   Every pair links to its hands-on lab (#/lab/<id>). Kids 6 pairs, others 8, Hard 10. */
// SOURCES:
// - Food 30.6% and textiles 2.3% of Malaysian household waste: SWCorp via The Star, 2 Jan 2024 (see SPEC.md).
// - Eco-enzyme 1 : 3 : 10 (sugar : fruit/vegetable waste : water), ~3 months fermentation: Arun & Sivashanmugam (2015),
//   Process Safety and Environmental Protection 94:471–478 ("garbage enzyme"); same recipe used by Malaysian eco-enzyme groups.
// - Red cabbage anthocyanin colours (red/pink acid, purple neutral, blue-green to yellow alkali): Royal Society of Chemistry,
//   "Red cabbage indicator" practical (edu.rsc.org).
// - Wick / capillary self-watering and coffee-ground odour absorption: standard school science; no figures quoted.
(() => {
const T={
 en:{waste:"Waste",prod:"Product",pairs:n=>`${n} pairs`,hard:"Hard",moves:"Moves",time:"Time",found:"Pairs",
  hint:"Flip two cards. Find a waste and the useful product it becomes!",match:"It's a match!",lab:"Try this lab →",
  card:"Card",down:"face down",endT:"All pairs matched!",endS:(m,t)=>`You finished in ${m} moves and ${t}.`,learned:"What you learned",
  again:"Play again",harder:"Try a harder level",map:"All games",best:"Best",
  tip:"Teaching tip: project the game and let teams take turns. After each match ask: what makes this waste valuable? Then open the linked lab."},
 bm:{waste:"Sisa",prod:"Produk",pairs:n=>`${n} pasangan`,hard:"Sukar",moves:"Langkah",time:"Masa",found:"Pasangan",
  hint:"Terbalikkan dua kad. Cari sisa dan produk berguna yang dihasilkan daripadanya!",match:"Padan!",lab:"Cuba makmal ini →",
  card:"Kad",down:"tertutup",endT:"Semua pasangan dipadankan!",endS:(m,t)=>`Anda selesai dalam ${m} langkah dan ${t}.`,learned:"Apa yang anda pelajari",
  again:"Main lagi",harder:"Cuba tahap lebih sukar",map:"Semua permainan",best:"Terbaik",
  tip:"Tip pengajaran: tayangkan permainan dan biar kumpulan bergilir-gilir. Selepas setiap padanan, tanya: apakah yang menjadikan sisa ini bernilai? Kemudian buka makmal yang dipautkan."}
};
// [lab id, waste emoji, waste en, waste bm, product emoji, product en, product bm, kids fact en, kids fact bm, teen/adult fact en, teen/adult fact bm]
const P=[
 ["candle","🍳","Used cooking oil","Minyak masak terpakai","🕯️","Scented candle","Lilin wangi",
  "Used cooking oil + wax = a scented candle! Never pour oil down the sink: it blocks drains. Hot wax is for adults only.",
  "Minyak masak terpakai + lilin = lilin wangi! Jangan tuang minyak ke dalam sinki: ia menyumbat longkang. Lilin panas untuk orang dewasa sahaja.",
  "Filtered used cooking oil can replace part of the paraffin wax in a candle. That keeps oil out of drains, where it clogs pipes and pollutes rivers. Hot oil and wax need adult supervision.",
  "Minyak masak terpakai yang ditapis boleh menggantikan sebahagian lilin parafin. Ini menghalang minyak masuk ke longkang, yang boleh menyumbat paip dan mencemarkan sungai. Minyak dan lilin panas memerlukan pengawasan orang dewasa."],
 ["enzyme","🍊","Fruit peels","Kulit buah","🧪","Eco-enzyme","Eko-enzim",
  "Fruit peels + brown sugar + water, left for 3 months, make eco-enzyme: a natural cleaning liquid.",
  "Kulit buah + gula perang + air, dibiarkan selama 3 bulan, menjadi eko-enzim: cecair pembersih semula jadi.",
  "Eco-enzyme is 1 part brown sugar (or molasses), 3 parts fruit or vegetable peels and 10 parts water, fermented for about 3 months. Microbes turn the sugar into organic acids.",
  "Eko-enzim ialah 1 bahagian gula perang (atau molases), 3 bahagian kulit buah atau sayur dan 10 bahagian air, ditapai selama kira-kira 3 bulan. Mikrob menukar gula kepada asid organik."],
 ["odour","☕","Coffee grounds","Hampas kopi","👃","Odour neutraliser","Penyerap bau",
  "Dry used coffee grounds, put them in a small cloth bag, and they soak up smells in the fridge or in shoes.",
  "Keringkan hampas kopi, masukkan ke dalam uncang kain kecil, dan ia menyerap bau dalam peti sejuk atau kasut.",
  "Dried coffee grounds are porous, so smelly molecules stick to them. Dry them completely first, or they will grow mould.",
  "Hampas kopi kering berliang, jadi molekul berbau melekat padanya. Keringkan sepenuhnya dahulu, jika tidak ia akan berkulat."],
 ["watering","🧴","Plastic bottle","Botol plastik","🪴","Self-watering planter","Pasu siram sendiri",
  "Cut a plastic bottle in two (ask an adult!), add a cloth wick, and water climbs up to the plant by itself.",
  "Potong botol plastik kepada dua (minta bantuan orang dewasa!), letakkan sumbu kain, dan air naik sendiri ke pokok.",
  "A cloth wick pulls water up into the soil by capillary action, so the plant gets a steady supply and less water is wasted. Cutting plastic needs care with sharp tools.",
  "Sumbu kain menarik air ke dalam tanah melalui tindakan kapilari, jadi pokok mendapat bekalan air yang tetap dan kurang air dibazirkan. Berhati-hati dengan alat tajam semasa memotong plastik."],
 ["ecobrick","🍬","Plastic wrappers","Pembalut plastik","🧱","Eco-brick","Bata eko",
  "Stuff clean, dry plastic wrappers tightly into a bottle to make an eco-brick for building benches.",
  "Padatkan pembalut plastik yang bersih dan kering ke dalam botol untuk membuat bata eko bagi membina bangku.",
  "Eco-bricks lock away soft plastics that are hard to recycle and turn them into blocks for benches and garden beds. The plastic must be clean, dry and packed hard.",
  "Bata eko menyimpan plastik lembut yang sukar dikitar semula dan menjadikannya blok untuk bangku dan batas taman. Plastik mesti bersih, kering dan dipadatkan dengan keras."],
 ["compost","🍌","Food scraps","Sisa makanan","🌱","Compost","Kompos",
  "Food is the biggest part of Malaysian household rubbish (30.6%). Compost turns it into food for the soil!",
  "Makanan ialah bahagian terbesar sampah rumah di Malaysia (30.6%). Kompos menukarnya menjadi makanan untuk tanah!",
  "Food is 30.6% of Malaysian household waste (SWCorp, 2024). Composting it with oxygen makes a soil conditioner instead of methane in a landfill.",
  "Makanan merangkumi 30.6% sisa domestik Malaysia (SWCorp, 2024). Mengkompos sisa ini dengan oksigen menghasilkan bahan penyubur tanah, bukannya metana di tapak pelupusan."],
 ["petfood","🐟","Fish waste","Sisa ikan","🐾","Pet food","Makanan haiwan peliharaan",
  "Fish heads, bones and skin are full of protein. Cooked and ground by an adult, they can become pet food.",
  "Kepala, tulang dan kulit ikan kaya dengan protein. Selepas dimasak dan dikisar oleh orang dewasa, ia boleh dijadikan makanan haiwan peliharaan.",
  "Fish heads, bones and skin are rich in protein and minerals. Cooked thoroughly and ground, they can become pet food instead of rotting waste. Heat and blades need adult supervision.",
  "Kepala, tulang dan kulit ikan kaya dengan protein dan mineral. Selepas dimasak sepenuhnya dan dikisar, ia boleh dijadikan makanan haiwan peliharaan dan tidak menjadi sisa yang reput. Haba dan pisau memerlukan pengawasan orang dewasa."],
 ["treasure","👕","Old T-shirt","Baju-T lama","👜","Tote bag","Beg tote",
  "Cut and tie an old T-shirt into a tote bag. No sewing needed! Ask an adult to help with the scissors.",
  "Gunting dan ikat baju-T lama menjadi beg tote. Tak perlu menjahit! Minta orang dewasa membantu menggunting.",
  "Textiles are 2.3% of Malaysian household waste. Turning an old T-shirt into a tote bag gives it a second life and replaces a plastic bag.",
  "Tekstil merangkumi 2.3% sisa domestik Malaysia. Menukar baju-T lama menjadi beg tote memberinya hayat kedua dan menggantikan beg plastik."],
 ["bioplastic","🌽","Cornstarch + vinegar","Kanji jagung + cuka","🧫","Bioplastic","Bioplastik",
  "Cornstarch, water and vinegar, heated by an adult, make a bendy plastic that comes from plants!",
  "Kanji jagung, air dan cuka, dipanaskan oleh orang dewasa, menghasilkan plastik lentur daripada tumbuhan!",
  "Heating cornstarch with water, vinegar and glycerol makes a simple starch bioplastic. It comes from plants, not petroleum, but it still needs proper disposal. Heating needs adult supervision.",
  "Memanaskan kanji jagung bersama air, cuka dan gliserol menghasilkan bioplastik kanji yang ringkas. Ia berasal daripada tumbuhan, bukan petroleum, tetapi masih perlu dilupuskan dengan betul. Pemanasan memerlukan pengawasan orang dewasa."],
 ["litmus","🥬","Red cabbage","Kubis ungu","🌈","pH indicator","Penunjuk pH",
  "Red cabbage juice is a colour-changing detective: pink in vinegar, green-blue in soapy water!",
  "Jus kubis ungu ialah detektif penukar warna: merah jambu dalam cuka, hijau kebiruan dalam air sabun!",
  "Red cabbage contains anthocyanin pigments: red-pink in acids, purple near neutral (pH 7), blue-green to yellow in alkalis. A free pH indicator from the kitchen.",
  "Kubis ungu mengandungi pigmen antosianin: merah jambu dalam asid, ungu pada pH neutral (pH 7), biru-hijau hingga kuning dalam alkali. Penunjuk pH percuma dari dapur."]
];
const LEVELS=[6,8,10];
let n=0, deck=[], up=[], moves=0, t0=0, tEnd=0, last=-1, done=false, wait=null;

WQ.css("match",`
.mm-bar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:4px 0 14px}
.mm-lv{display:flex;gap:8px;flex-wrap:wrap}.mm-lv button{background:#fff;border-radius:999px;padding:6px 14px;font-weight:800;box-shadow:var(--shadow)}
.mm-lv button[aria-pressed=true]{background:var(--grass);color:#fff}
.mm-grid{display:grid;grid-template-columns:repeat(var(--c,4),1fr);margin:0 auto}
.mm-card{position:relative;aspect-ratio:4/5;perspective:900px;padding:0;border-radius:16px;min-width:0}
.mm-in{position:absolute;inset:0;transform-style:preserve-3d;transition:transform .5s cubic-bezier(.3,1.4,.5,1)}
.mm-card.up .mm-in{transform:rotateY(180deg)}
.mm-f{position:absolute;inset:0;border-radius:16px;backface-visibility:hidden;-webkit-backface-visibility:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:var(--shadow);overflow:hidden}
.mm-back{background:radial-gradient(circle at 30% 25%,#7bd66a,var(--grass) 55%,var(--grass-d));border:3px solid rgba(255,255,255,.6)}
.mm-logo{display:grid;place-items:center;width:58%;aspect-ratio:1;border-radius:50%;background:#fff;font-size:clamp(1.2rem,3.6vw,2rem);box-shadow:0 3px 0 rgba(0,0,0,.12);position:relative;z-index:1}
.mm-back:after{content:"";position:absolute;inset:7px;border:2px dashed rgba(255,255,255,.45);border-radius:11px}
.mm-card:hover:not(.up) .mm-back{filter:brightness(1.08)}
.mm-face{transform:rotateY(180deg);background:#fff;padding:22px 5px 6px;gap:4px;text-align:center;border:3px solid var(--line)}
.mm-face.w{border-color:#f4c48f}.mm-face.p{border-color:#9fd98f}
.mm-k{position:absolute;top:0;left:0;right:0;font-size:.62rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;padding:3px 0;color:#fff}
.mm-face.w .mm-k{background:var(--orange)}.mm-face.p .mm-k{background:var(--grass-d)}
.mm-em{font-size:clamp(1.9rem,4.6vw,2.6rem);line-height:1}.mm-em.purple{filter:hue-rotate(160deg) saturate(1.4)}
.mm-nm{font-weight:800;font-size:clamp(.66rem,1.1vw + .35rem,.9rem);line-height:1.12;overflow-wrap:anywhere;hyphens:auto}
.mm-card.got .mm-face{border-color:var(--gold);box-shadow:0 0 0 3px var(--gold),var(--shadow)}
.mm-card.got .mm-face:after{content:"✔";position:absolute;bottom:3px;right:6px;color:var(--grass-d);font-weight:800;font-size:.8rem}
.mm-fact{margin:16px auto 0;max-width:760px;background:#fff;border-radius:16px;padding:12px 16px;box-shadow:var(--shadow);border-left:8px solid var(--blue);min-height:64px}
.mm-fact.ok{border-left-color:var(--grass)}.mm-fact h3{font-size:1.15rem;margin-bottom:2px}.mm-fact p{margin:4px 0}
.mm-fact a{font-weight:800}
.mm-end{max-width:760px;margin:0 auto;text-align:center}.mm-stars{font-size:3rem;letter-spacing:6px}
.mm-list{display:grid;gap:10px;grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr));text-align:left;margin:14px 0}
.mm-li{background:var(--soft);border-radius:14px;padding:10px 12px}.mm-li b{display:block;font-family:"Baloo 2";font-size:1.05rem}
.mm-li p{margin:4px 0;font-size:.92rem}.mm-li a{font-weight:800;font-size:.9rem}
@media (max-width:600px){.mm-lv button{padding:5px 11px;font-size:.92rem}.mm-bar .pill{padding:5px 11px}}
`);

WQ.registerGame("match",{order:2,kind:"game",icon:"🃏",ages:"7+",
  title:{en:"Eco-Match",bm:"Padanan Eko"},
  desc:{en:"Flip the cards. Match each waste with the useful product it becomes.",bm:"Terbalikkan kad. Padankan setiap sisa dengan produk berguna yang dihasilkan daripadanya."},
  badge:{icon:"🃏",name:{en:"Eco-Matcher",bm:"Pemadan Eko"},desc:{en:"Finish a game of Eco-Match",bm:"Tamatkan satu permainan Padanan Eko"}},
  mount(el,{relang}){
    const L=()=>T[WQ.lang], $=s=>el.querySelector(s), bm=WQ.lang==="bm", kids=WQ.aud==="kids";
    const wName=p=>bm?p[3]:p[2], pName=p=>bm?p[6]:p[5], fact=p=>kids?(bm?p[8]:p[7]):(bm?p[10]:p[9]);
    const mmss=ms=>{const s=Math.floor(ms/1000);return `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;};
    const elapsed=()=>t0?(done?tEnd:Date.now())-t0:0;
    el.innerHTML=WQ.head("🃏",this.title,this.desc)+`
      ${WQ.aud==="teacher"?`<p class="note small">${L().tip}</p>`:""}
      <div class="mm-bar"><div class="mm-lv" role="group" aria-label="Level">${LEVELS.map(k=>`<button data-n="${k}">${k===10?"🔥 "+L().hard+" · ":""}${L().pairs(k)}</button>`).join("")}</div>
      <span class="spacer"></span><span class="pill" title="${L().moves}">🔄 <span id="mmMoves"></span></span><span class="pill" title="${L().time}">⏱️ <span id="mmTime"></span></span><span class="pill" title="${L().found}">✅ <span id="mmFound"></span></span></div>
      <div id="mmPlay"><div class="mm-grid" id="mmGrid"></div><div class="mm-fact" id="mmFact" role="status" aria-live="polite"></div></div>
      <div id="mmEnd" hidden></div>`;
    el.querySelectorAll("[data-n]").forEach(b=>b.onclick=()=>{n=+b.dataset.n;start();});
    function start(){
      if(!LEVELS.includes(n)) n=kids?6:8;
      const ps=WQ.shuffle(P.map((_,i)=>i)).slice(0,n);
      deck=WQ.shuffle(ps.flatMap(p=>[{p,s:0,m:false},{p,s:1,m:false}]));
      clearTimeout(wait);wait=null;up=[];moves=0;t0=0;tEnd=0;last=-1;done=false;render();
    }
    function label(d,i){const p=P[d.p];return d.m||up.includes(i)?`${d.s?L().prod:L().waste}: ${d.s?pName(p):wName(p)}`:`${L().card} ${i+1}, ${L().down}`;}
    function render(){
      el.querySelectorAll("[data-n]").forEach(b=>b.setAttribute("aria-pressed",+b.dataset.n===n));
      $("#mmPlay").hidden=done;$("#mmEnd").hidden=!done;stats();
      if(done) return showEnd();
      $("#mmGrid").innerHTML=deck.map((d,i)=>{const p=P[d.p],w=!d.s;
        return `<button class="mm-card${d.m||up.includes(i)?" up":""}${d.m?" got":""}" data-i="${i}" aria-label="${WQ.esc(label(d,i))}"><span class="mm-in">
        <span class="mm-f mm-back" aria-hidden="true"><span class="mm-logo">♻️</span></span>
        <span class="mm-f mm-face ${w?"w":"p"}" aria-hidden="true"><span class="mm-k">${w?L().waste:L().prod}</span><span class="mm-em${w&&p[0]==="litmus"?" purple":""}">${w?p[1]:p[4]}</span><span class="mm-nm">${w?wName(p):pName(p)}</span></span></span></button>`;}).join("");
      $("#mmGrid").querySelectorAll(".mm-card").forEach(b=>b.onclick=()=>flip(+b.dataset.i));
      fit();showFact();
    }
    function paint(i){const b=$(`.mm-card[data-i="${i}"]`),d=deck[i];if(!b)return;
      b.classList.toggle("up",d.m||up.includes(i));b.classList.toggle("got",d.m);b.setAttribute("aria-label",label(d,i));}
    function stats(){$("#mmMoves").textContent=moves;$("#mmTime").textContent=mmss(elapsed());$("#mmFound").textContent=`${deck.filter(d=>d.m).length/2}/${n}`;}
    function showFact(){
      const f=$("#mmFact");if(!f)return;
      if(last<0){f.className="mm-fact";f.innerHTML=`<p>💡 ${L().hint}</p>`;return;}
      const p=P[last];f.className="mm-fact ok";
      f.innerHTML=`<h3>✅ ${L().match} ${p[1]} ${WQ.esc(wName(p))} → ${p[4]} ${WQ.esc(pName(p))}</h3><p>${WQ.esc(fact(p))}</p><a href="#/lab/${p[0]}">${L().lab}</a>`;
    }
    function unflip(){clearTimeout(wait);wait=null;const ids=up;up=[];ids.forEach(paint);}
    function flip(i){
      if(done)return; if(wait)unflip();
      const d=deck[i]; if(d.m||up.includes(i))return;
      if(!t0)t0=Date.now();
      up.push(i);paint(i);
      if(up.length<2)return;
      moves++;const [a,b]=up.map(k=>deck[k]);
      if(a.p===b.p){
        a.m=b.m=true;const ids=up;up=[];ids.forEach(k=>{paint(k);WQ.anim($(`.mm-card[data-i="${k}"]`),"pop");});
        last=a.p;WQ.beep(true);showFact();
        if(deck.every(x=>x.m)){done=true;tEnd=Date.now();
          const stars=moves<=Math.round(n*1.75)?3:moves<=Math.round(n*2.5)?2:1;WQ.best("match"+n,stars);
          setTimeout(()=>{if(!el.isConnected)return;if(!WQ.award("match"))WQ.confetti();render();},900);}
      }else wait=setTimeout(()=>{if(el.isConnected)unflip();},1000);
      stats();
    }
    function showEnd(){
      const l=L(), stars=moves<=Math.round(n*1.75)?3:moves<=Math.round(n*2.5)?2:1, nx=LEVELS[LEVELS.indexOf(n)+1];
      const seen=[...new Set(deck.map(d=>d.p))];
      $("#mmEnd").innerHTML=`<div class="card mm-end"><h2>🎉 ${l.endT}</h2><div class="mm-stars" aria-label="${stars}/3">${"⭐".repeat(stars)}${"☆".repeat(3-stars)}</div>
        <p>${l.endS(moves,mmss(elapsed()))} ${l.best}: ${"⭐".repeat(WQ.best("match"+n))}</p>
        <h3 style="margin-top:14px">${l.learned}</h3><div class="mm-list">${seen.map(i=>{const p=P[i];return `<div class="mm-li"><b>${p[1]} ${WQ.esc(wName(p))} → ${p[4]} ${WQ.esc(pName(p))}</b><p>${WQ.esc(fact(p))}</p><a href="#/lab/${p[0]}">${l.lab}</a></div>`;}).join("")}</div>
        <div class="row" style="justify-content:center"><button class="btn" id="mmA">${l.again}</button>${nx?`<button class="btn blue" id="mmN">${l.harder}</button>`:""}<a class="btn alt" href="#/games">${l.map}</a></div></div>`;
      $("#mmA").onclick=start; if($("#mmN")) $("#mmN").onclick=()=>{n=nx;start();};
    }
    // pick a column count that keeps rows even and cards >= 70px wide; cap card width at 150px for projectors
    function fit(){
      const g=$("#mmGrid");if(!g||!deck.length)return;
      const W=el.clientWidth||320, gap=W<600?8:12, opts={12:[6,4,3],16:[8,4],20:[10,5,4]}[deck.length];
      const c=opts.find(k=>(W-(k-1)*gap)/k>=70)||opts[opts.length-1];
      g.style.setProperty("--c",c);g.style.gap=gap+"px";g.style.maxWidth=(c*150+(c-1)*gap)+"px";
    }
    const tick=setInterval(()=>{if(el.isConnected&&t0&&!done)stats();},1000);
    window.addEventListener("resize",fit);
    if(relang&&deck.length) render(); else start();
    return ()=>{clearInterval(tick);window.removeEventListener("resize",fit);if(wait)unflip();};
  }});
})();
