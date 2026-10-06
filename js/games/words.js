/* Word games: "Let's Cross Together!" crossword (generated each round) and "Fun Puzzle" word search.
   Both use the same bilingual word lists: EN and BM answers are separate words, kids vs teens/adults lists. */
// SOURCES:
// - SWCorp bin colours, Act 672 separation at source in adopting states: SPEC.md (SWCorp via The Star, 2 Jan 2024).
// - Microplastic = plastic piece smaller than 5 mm: NOAA Marine Debris Program definition (Arthur et al., 2009).
// - Resin identification code (the number in the recycling triangle): ASTM D7611.
// - Methane forms when food rots without oxygen (anaerobic decomposition in landfills): US EPA, "Basic Information about Landfill Gas".
// - Red cabbage anthocyanin as a pH indicator: Royal Society of Chemistry, "Red cabbage indicator" practical.
(() => {
// [ANSWER (A–Z only), clue in the same language]
const WORDS={
 en:{k:[
  ["COMPOST","Rotting food and leaves turn into this rich food for soil."],
  ["RECYCLE","Make old things into new things."],
  ["PLASTIC","Bottles and wrappers for the orange bin are made of this."],
  ["PAPER","The blue recycling bin is for this."],
  ["GLASS","The brown recycling bin is for jars and bottles made of this."],
  ["REUSE","Use something again instead of throwing it away."],
  ["REDUCE","Make less rubbish in the first place."],
  ["WORM","A wriggly helper that eats food scraps in compost."],
  ["CANDLE","Used cooking oil can become a scented ____."],
  ["BIN","A container you put rubbish in."],
  ["TIN","A metal food can. It goes in the orange bin."],
  ["EARTH","The planet we must take care of."],
  ["TREE","Paper is made from the wood of this."],
  ["SOIL","Plants grow in this."],
  ["PEEL","The skin of a banana or an orange."],
  ["BATTERY","Never put an old one in the normal bin. Take it to an e-waste drop-off."],
  ["LITTER","Rubbish dropped on the ground."],
  ["ENZYME","Fruit peels + sugar + water make eco-____."],
  ["CABBAGE","Red ____ juice changes colour in vinegar and in soapy water."],
  ["COFFEE","Dried ____ grounds soak up bad smells."],
  ["BOTTLE","A plastic ____ can become a self-watering planter."],
  ["TOTE","An old T-shirt can become a ____ bag."]],
 o:[
  ["LANDFILL","A site where waste is buried in the ground."],
  ["METHANE","Strong greenhouse gas made when food rots without oxygen."],
  ["CIRCULAR","____ economy: keep materials in use and design out waste."],
  ["ANTHOCYANIN","Red cabbage pigment that changes colour with pH."],
  ["FERMENT","Microbes ____ sugar and peels to make eco-enzyme."],
  ["LEACHATE","Polluted liquid that drains out of waste in a landfill."],
  ["UPCYCLE","Turn waste into a product of higher value."],
  ["POLYMER","A long-chain molecule. Plastics are made of these."],
  ["BIOPLASTIC","Plastic made from plant starch instead of petroleum."],
  ["CAPILLARY","____ action pulls water up a wick in a self-watering planter."],
  ["AEROBIC","Composting with plenty of oxygen is an ____ process."],
  ["INDICATOR","A substance whose colour shows if a solution is acidic or alkaline."],
  ["ECOBRICK","A plastic bottle packed hard with clean, dry plastic waste."],
  ["RESIN","The number in the recycling triangle is the ____ identification code."],
  ["SWCORP","Short name of Malaysia's solid waste management and public cleansing corporation."],
  ["HUMUS","Dark, stable organic matter in finished compost."],
  ["SEPARATION","Act 672 makes ____ of waste at source compulsory in the states that adopted it."],
  ["BIODIESEL","Fuel that can be made from used cooking oil."],
  ["MICROPLASTIC","A piece of plastic smaller than 5 mm."],
  ["GREENWASHING","Misleading claims that a product is greener than it really is."],
  ["COMPOST","Soil conditioner made by microbes breaking down organic waste."]]},
 bm:{k:[
  ["KOMPOS","Sisa makanan dan daun yang reput menjadi baja ini."],
  ["KITAR","____ semula: jadikan barang lama sesuatu yang baharu."],
  ["PLASTIK","Botol dan pembalut untuk tong oren diperbuat daripada bahan ini."],
  ["KERTAS","Tong kitar semula biru adalah untuk ____."],
  ["KACA","Tong coklat adalah untuk balang dan botol ____."],
  ["TONG","Bekas untuk membuang sampah."],
  ["SAMPAH","Barang yang dibuang; juga dipanggil sisa."],
  ["CACING","Haiwan kecil yang membantu menghasilkan kompos."],
  ["LILIN","Minyak masak terpakai boleh dijadikan ____ wangi."],
  ["TANAH","Tumbuhan hidup di dalam ____."],
  ["POKOK","Kertas dibuat daripada kayu ____."],
  ["BUMI","Planet yang perlu kita jaga."],
  ["BATERI","Jangan buang ____ lama ke dalam tong biasa. Hantar ke pusat kutipan e-sisa."],
  ["KULIT","____ pisang boleh dijadikan kompos."],
  ["ENZIM","Kulit buah + gula + air menghasilkan eko-____."],
  ["KOPI","Hampas ____ kering menyerap bau busuk."],
  ["KUBIS","Jus ____ ungu berubah warna dalam cuka dan air sabun."],
  ["TIN","Bekas logam untuk makanan. Ia masuk ke tong oren."],
  ["LOGAM","Tin minuman aluminium diperbuat daripada ____."],
  ["BOTOL","____ plastik boleh dijadikan pasu siram sendiri."],
  ["GUNA","____ semula: gunakan barang sekali lagi."],
  ["BEG","Bawa ____ sendiri apabila membeli-belah."]],
 o:[
  ["PELUPUSAN","Tapak ____ ialah tempat sisa ditanam di dalam tanah."],
  ["METANA","Gas rumah hijau kuat yang terhasil apabila makanan reput tanpa oksigen."],
  ["KITARAN","Ekonomi ____: mengekalkan bahan dalam penggunaan dan mereka bentuk tanpa sisa."],
  ["ANTOSIANIN","Pigmen kubis ungu yang berubah warna mengikut pH."],
  ["PENAPAIAN","Eko-enzim dihasilkan melalui proses ____ oleh mikrob."],
  ["POLIMER","Molekul rantai panjang yang membentuk plastik."],
  ["BIOPLASTIK","Plastik yang dibuat daripada kanji tumbuhan, bukan petroleum."],
  ["KAPILARI","Tindakan ____ menarik air naik melalui sumbu dalam pasu siram sendiri."],
  ["AEROBIK","Pengomposan dengan banyak oksigen ialah proses ____."],
  ["PENUNJUK","Bahan yang warnanya menunjukkan sama ada larutan berasid atau beralkali."],
  ["ASID","Cuka ialah sejenis ____."],
  ["ALKALI","Air sabun bersifat ____."],
  ["HUMUS","Bahan organik gelap yang stabil dalam kompos matang."],
  ["RESIN","Nombor dalam segi tiga kitar semula ialah kod pengenalan ____."],
  ["SWCORP","Nama ringkas perbadanan yang mengurus sisa pepejal dan pembersihan awam di Malaysia."],
  ["MAMPAN","Boleh berterusan tanpa merosakkan alam sekitar; lestari."],
  ["PENGASINGAN","Akta 672 mewajibkan ____ sisa di punca di negeri yang menerima pakai akta itu."],
  ["BIODIESEL","Bahan api yang boleh dihasilkan daripada minyak masak terpakai."],
  ["MIKROPLASTIK","Kepingan plastik yang lebih kecil daripada 5 mm."],
  ["KOMPOS","Bahan penyubur tanah hasil penguraian sisa organik oleh mikrob."]]}
};
const LANGN={en:{en:"English",bm:"Bahasa Melayu"},bm:{en:"bahasa Inggeris",bm:"Bahasa Melayu"}};
const T={
 en:{across:"Across",down:"Down",check:"✔ Check",rl:"💡 Reveal letter",ra:"👀 Reveal all",neu:"🔄 New puzzle",
  tap:"Tap a square or a clue, then type. On a computer, use the arrow keys.",wrong:n=>`${n} letter${n>1?"s":""} to fix. ${n>1?"They are":"It is"} marked in red.`,
  ok:"All correct so far!",full:"Almost! Some letters are wrong. Press Check.",solved:"Solved!",solvedS:(t,r)=>`Time: ${t} · Letters revealed: ${r}`,
  shown:"Here are all the answers. Try a new puzzle to earn the badge!",raQ:"Show all the answers? You won't get the badge for this puzzle.",
  inLang:l=>`This puzzle is in ${l}.`,newIn:"New puzzle in English",map:"All games",
  find:"Find these words",hint:"💡 Hint",how:"Drag from the first letter to the last. Or tap the first letter, then the last.",
  dK:"Words go → ↓ ↘ ↗",dO:"Words can go in all 8 directions, even backwards!",foundN:(a,b)=>`${a}/${b} found`,wsDone:"You found them all! 🎉",wsDoneS:t=>`Time: ${t}`,
  cwTip:"Teaching tip: let pairs solve together, then use the answers to introduce key terms before the hands-on labs.",
  wsTip:"Teaching tip: a calm starter or early-finisher task. Ask students to explain each word they find."},
 bm:{across:"Melintang",down:"Menegak",check:"✔ Semak",rl:"💡 Dedah huruf",ra:"👀 Dedah semua",neu:"🔄 Teka-teki baharu",
  tap:"Tekan petak atau petunjuk, kemudian taip. Pada komputer, guna kekunci anak panah.",wrong:n=>`${n} huruf perlu dibetulkan. Ia ditanda merah.`,
  ok:"Semua betul setakat ini!",full:"Hampir! Ada huruf yang salah. Tekan Semak.",solved:"Selesai!",solvedS:(t,r)=>`Masa: ${t} · Huruf didedahkan: ${r}`,
  shown:"Ini semua jawapannya. Cuba teka-teki baharu untuk mendapatkan lencana!",raQ:"Tunjukkan semua jawapan? Anda tidak akan mendapat lencana untuk teka-teki ini.",
  inLang:l=>`Teka-teki ini dalam ${l}.`,newIn:"Teka-teki baharu dalam Bahasa Melayu",map:"Semua permainan",
  find:"Cari perkataan ini",hint:"💡 Petunjuk",how:"Seret dari huruf pertama ke huruf terakhir. Atau tekan huruf pertama, kemudian huruf terakhir.",
  dK:"Perkataan ke arah → ↓ ↘ ↗",dO:"Perkataan boleh ke semua 8 arah, malah terbalik!",foundN:(a,b)=>`${a}/${b} dijumpai`,wsDone:"Anda menjumpai semuanya! 🎉",wsDoneS:t=>`Masa: ${t}`,
  cwTip:"Tip pengajaran: biar murid menyelesaikan secara berpasangan, kemudian guna jawapan untuk memperkenalkan istilah penting sebelum makmal amali.",
  wsTip:"Tip pengajaran: aktiviti permulaan yang tenang atau untuk murid yang siap awal. Minta murid menerangkan setiap perkataan yang dijumpai."}
};
const lvlKey=()=>WQ.aud==="kids"?"k":"o";
const mmss=ms=>{const s=Math.floor(ms/1000);return `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;};
const langNote=(puzLang,id)=>puzLang===WQ.lang?"":`<p class="note warn row">${T[WQ.lang].inLang(LANGN[WQ.lang][puzLang])} <button class="btn alt" id="${id}">${T[WQ.lang].newIn}</button></p>`;

/* ---------- crossword generator ----------
   Greedy: place words one at a time at the crossing with most intersections (smallest box breaks ties),
   repeat with many random orders, keep the layout with most words, then the densest. */
const MAXW=12, MAXH=12;
function genCross(list,maxWords){
  let best=null, bestScore=-1;
  for(let t=0;t<250;t++){
    const order=WQ.shuffle(list), cells=new Map(), placed=[], K=(r,c)=>r+","+c, occ=(r,c)=>cells.has(K(r,c));
    let r0=0,r1=0,c0=0,c1=0;
    const put=(w,r,c,d)=>{const L=w[0].length;for(let k=0;k<L;k++){const key=K(r+d*k,c+(1-d)*k),x=cells.get(key)||{ch:w[0][k]};x[d?"d":"a"]=placed.length;cells.set(key,x);}
      placed.push({ans:w[0],clue:w[1],r,c,d});r0=Math.min(r0,r);c0=Math.min(c0,c);r1=Math.max(r1,r+d*(L-1));c1=Math.max(c1,c+(1-d)*(L-1));};
    const fits=(w,r,c,d)=>{
      const L=w.length, dr=d, dc=1-d;
      if(occ(r-dr,c-dc)||occ(r+dr*L,c+dc*L)) return -1;
      let inter=0;
      for(let k=0;k<L;k++){const rr=r+dr*k, cc=c+dc*k, x=cells.get(K(rr,cc));
        if(x){if(x.ch!==w[k]||x[d?"d":"a"]!=null) return -1; inter++;}
        else if(occ(rr+dc,cc+dr)||occ(rr-dc,cc-dr)) return -1;}
      if(!inter) return -1;
      const h=Math.max(r1,r+dr*(L-1))-Math.min(r0,r)+1, wd=Math.max(c1,c+dc*(L-1))-Math.min(c0,c)+1;
      if(h>MAXH||wd>MAXW) return -1;
      return inter*1000-h*wd+Math.random();
    };
    put(order[0],0,0,Math.random()<.5?0:1);
    for(const w of order.slice(1)){
      if(placed.length>=maxWords) break;
      let cand=null, cs=-1;
      for(const [key,x] of cells){
        if(x.a!=null&&x.d!=null) continue;
        const [rr,cc]=key.split(",").map(Number), d=x.a!=null?1:0;
        for(let k=0;k<w[0].length;k++){ if(w[0][k]!==x.ch) continue;
          const r=d?rr-k:rr, c=d?cc:cc-k, s=fits(w[0],r,c,d); if(s>cs){cs=s;cand=[r,c,d];} }
      }
      if(cand) put(w,...cand);
    }
    const area=(r1-r0+1)*(c1-c0+1), score=placed.length*1000+cells.size/area*100;
    if(score>bestScore){bestScore=score;best={W:c1-c0+1,H:r1-r0+1,words:placed.map(p=>({...p,r:p.r-r0,c:p.c-c0}))};}
  }
  // number the start squares in reading order
  const starts=[...new Set(best.words.map(w=>w.r*100+w.c))].sort((a,b)=>a-b);
  best.words.forEach(w=>w.num=starts.indexOf(w.r*100+w.c)+1);
  best.words.sort((a,b)=>a.d-b.d||a.num-b.num);
  best.cells={};
  best.words.forEach((w,i)=>{for(let k=0;k<w.ans.length;k++){const key=(w.r+w.d*k)+","+(w.c+(1-w.d)*k),x=best.cells[key]||(best.cells[key]={ch:w.ans[k]});x[w.d?"d":"a"]=i;}});
  return best;
}

/* ---------- word search generator ---------- */
const DIRS_K=[[0,1],[1,0],[1,1],[-1,1]], DIRS_O=[[0,1],[1,0],[1,1],[-1,1],[0,-1],[-1,0],[-1,-1],[1,-1]];
function genSearch(list,N,dirs,count){
  let best=null;
  for(let t=0;t<40;t++){
    const g=[...Array(N)].map(()=>Array(N).fill("")), words=[];
    for(const w of WQ.shuffle(list.map(x=>x[0]).filter(x=>x.length>=3&&x.length<=N)).sort((a,b)=>b.length-a.length)){
      if(words.length>=count) break;
      if(words.some(o=>o.ans.includes(w)||w.includes(o.ans))) continue;
      const L=w.length;
      for(let a=0;a<200;a++){
        const [dr,dc]=dirs[Math.floor(Math.random()*dirs.length)];
        const rlo=dr<0?L-1:0, rhi=dr>0?N-L:N-1, clo=dc<0?L-1:0, chi=dc>0?N-L:N-1;
        const r=rlo+Math.floor(Math.random()*(rhi-rlo+1)), c=clo+Math.floor(Math.random()*(chi-clo+1)), cells=[];
        let ok=true, shared=0;
        for(let k=0;k<L&&ok;k++){const rr=r+dr*k, cc=c+dc*k, ch=g[rr][cc]; if(ch&&ch!==w[k]) ok=false; else {if(ch)shared++; cells.push([rr,cc]);}}
        if(!ok||shared===L) continue;
        cells.forEach(([rr,cc],k)=>g[rr][cc]=w[k]); words.push({ans:w,cells}); break;
      }
    }
    if(!best||words.length>best.words.length) best={N,g,words};
    if(words.length>=count) break;
  }
  const AZ="ABCDEFGHIJKLMNOPRSTUWY"; // ponytail: plain random fill; rare letters (Q,V,X,Z) left out so fill looks like real words
  best.g.forEach(row=>row.forEach((ch,i)=>{if(!ch)row[i]=AZ[Math.floor(Math.random()*AZ.length)];}));
  return best;
}

/* ================= CROSSWORD ================= */
let cw=null, ent={}, rev=new Set(), bad=new Set(), sel=null, usedAll=false, cwDone=false, cwT0=0, cwTEnd=0, cwMsg="";
WQ.css("words",`
.cw-wrap{display:grid;gap:18px;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);align-items:start}
.cw-cur{background:var(--ink);color:#fff;border-radius:14px;padding:10px 14px;font-weight:700;min-height:48px}
.cw-cur b{color:var(--gold);margin-right:6px}
.cw-board{position:relative;margin:0 auto;width:min(100%,calc(var(--cols)*42px))}
.cw-grid{display:grid;grid-template-columns:repeat(var(--cols),1fr);gap:2px;touch-action:manipulation;user-select:none}
.cw-c,.cw-x{aspect-ratio:1;border-radius:5px;min-width:0}
.cw-c{position:relative;background:#fff;box-shadow:0 0 0 2px var(--ink);display:grid;place-items:center;cursor:pointer;font-family:"Baloo 2";font-weight:800;font-size:clamp(.85rem,3.4vw,1.45rem);text-transform:uppercase;line-height:1}
.cw-c.word{background:#fff4c7}.cw-c.cur{background:var(--gold)}
.cw-c.bad{color:var(--red);background:#fde3e6}.cw-c.bad.cur{background:#ffc2c9}
.cw-c.rev:after{content:"";position:absolute;top:0;right:0;border:5px solid transparent;border-top-color:var(--blue);border-right-color:var(--blue);border-radius:0 5px 0 0}
.cw-solved .cw-c{background:#e3f7dc;color:var(--grass-d)}
.cw-n{position:absolute;top:1px;left:3px;font-family:Nunito,sans-serif;font-size:clamp(.45rem,1.6vw,.66rem);font-weight:800;color:var(--muted)}
.cw-in{position:absolute;opacity:0;font-size:16px;border:0;padding:0;caret-color:transparent;color:transparent;background:transparent;pointer-events:none}
.cw-tools{margin:0 0 14px}.cw-tools .btn{padding:9px 16px;font-size:.95rem}
.cw-msg{text-align:center;font-weight:700;min-height:1.5em;margin:6px 0;font-size:.95rem}
.cw-msg:empty:before{content:"\\a0"}
#cwEnd .card{margin-top:16px}
.cw-clues h3{font-size:1.2rem;margin:4px 0 6px}.cw-clues ol{list-style:none;margin:0 0 12px;padding:0}
.cw-clues button{display:flex;gap:8px;width:100%;text-align:left;padding:6px 10px;border-radius:10px;font-weight:600;line-height:1.3}
.cw-clues button b{min-width:1.6em}.cw-clues button:hover{background:var(--soft)}.cw-clues button.on{background:#fff4c7}
.ws-wrap{display:grid;gap:18px;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);align-items:start}
.ws-grid{display:grid;grid-template-columns:repeat(var(--n),1fr);gap:2px;width:min(100%,560px);margin:0 auto;touch-action:none;user-select:none;-webkit-user-select:none;container-type:inline-size;background:#fff;border-radius:16px;padding:8px;box-shadow:var(--shadow)}
.ws-c{aspect-ratio:1;display:grid;place-items:center;border-radius:50%;font-family:"Baloo 2";font-weight:800;font-size:1rem;font-size:calc(100cqw / var(--n) * .52);cursor:pointer;line-height:1;transition:background .15s}
.ws-c.sel{background:var(--gold)!important;transform:scale(1.06)}.ws-c.start{box-shadow:0 0 0 3px var(--blue) inset}
.ws-c.hint{animation:wsHint .5s 3}@keyframes wsHint{50%{background:var(--orange);color:#fff}}
.ws-list{display:flex;flex-wrap:wrap;gap:8px;list-style:none;padding:0;margin:8px 0 12px}
.ws-list li{background:#fff;border-radius:999px;padding:5px 12px;font-weight:800;box-shadow:var(--shadow);letter-spacing:.04em}
.ws-list li.got{text-decoration:line-through 3px;color:var(--muted);box-shadow:none;background:var(--h)}
.wd-end{text-align:center}.wd-end h2{margin-bottom:4px}
@media (max-width:760px){.cw-wrap,.ws-wrap{grid-template-columns:1fr}.cw-tools{gap:8px}.cw-tools .btn{padding:7px 11px;font-size:.85rem}.cw-tools .spacer{display:none}.ws-bar .btn{padding:7px 12px;font-size:.88rem}.ws-grid{padding:4px;gap:1px}}
`);

WQ.registerGame("crossword",{order:3,kind:"game",icon:"✏️",ages:"8+",
  title:{en:"Let's Cross Together!",bm:"Jom Silang Kata!"},
  desc:{en:"Solve a waste-to-wealth crossword. A new puzzle every time.",bm:"Selesaikan silang kata sisa kepada kekayaan. Teka-teki baharu setiap kali."},
  badge:{icon:"✏️",name:{en:"Word Wizard",bm:"Pakar Silang Kata"},desc:{en:"Solve a crossword without Reveal all",bm:"Selesaikan silang kata tanpa Dedah semua"}},
  mount(el,{relang}){
    const L=()=>T[WQ.lang], $=s=>el.querySelector(s), key=(r,c)=>r+","+c;
    function start(){
      const lv=lvlKey();cw=genCross(WORDS[WQ.lang][lv],lv==="k"?8:11);cw.lang=WQ.lang;cw.lv=lv;
      ent={};rev=new Set();bad=new Set();usedAll=false;cwDone=false;cwT0=Date.now();cwTEnd=0;cwMsg=L().tap;
      const w=cw.words[0];sel={r:w.r,c:w.c,d:w.d};build();
    }
    function build(){
      el.innerHTML=WQ.head("✏️",this_.title,this_.desc)+`
        ${WQ.aud==="teacher"?`<p class="note small">${L().cwTip}</p>`:""}${langNote(cw.lang,"cwLang")}
        <div class="row cw-tools"><span class="pill">⏱️ <span id="cwTime"></span></span><button class="btn" id="cwChk">${L().check}</button><button class="btn blue" id="cwRl">${L().rl}</button><button class="btn red" id="cwRa">${L().ra}</button><span class="spacer"></span><button class="btn alt" id="cwNew">${L().neu}</button></div>
        <div class="cw-wrap"><div>
          <div class="cw-cur" id="cwCur" aria-live="polite"></div><div class="cw-msg" id="cwMsg" role="status" aria-live="polite"></div>
          <div class="cw-board" style="--cols:${cw.W}"><div class="cw-grid" id="cwGrid" style="--cols:${cw.W}"></div>
            <input class="cw-in" id="cwIn" aria-label="${L().tap}" autocomplete="off" autocorrect="off" autocapitalize="characters" spellcheck="false" enterkeyhint="next"></div>
          <div id="cwEnd"></div></div>
          <div class="cw-clues card">${[0,1].map(d=>`<h3>${d?L().down:L().across}</h3><ol>${cw.words.map((w,i)=>w.d===d?`<li><button data-w="${i}"><b>${w.num}</b><span>${WQ.esc(w.clue)} (${w.ans.length})</span></button></li>`:"").join("")}</ol>`).join("")}</div></div>`;
      $("#cwNew").onclick=start; if($("#cwLang")) $("#cwLang").onclick=start;
      $("#cwChk").onclick=check; $("#cwRl").onclick=revealLetter; $("#cwRa").onclick=revealAll;
      el.querySelectorAll("[data-w]").forEach(b=>b.onclick=()=>{const w=cw.words[+b.dataset.w];
        const k=[...Array(w.ans.length).keys()].map(i=>key(w.r+w.d*i,w.c+(1-w.d)*i)).find(k=>!ent[k])||key(w.r,w.c);
        const [r,c]=k.split(",").map(Number);sel={r,c,d:w.d};paint();focus();});
      $("#cwGrid").onclick=e=>{const c=e.target.closest(".cw-c");if(!c)return;const [r,cc]=c.dataset.k.split(",").map(Number),x=cw.cells[c.dataset.k];
        if(sel&&sel.r===r&&sel.c===cc&&x.a!=null&&x.d!=null) sel.d=1-sel.d; else sel={r,c:cc,d:x[sel&&sel.d?"d":"a"]!=null?(sel?sel.d:0):(x.a!=null?0:1)};
        paint();focus();};
      const inp=$("#cwIn"), PAD=" "; inp.value=PAD;
      inp.addEventListener("keydown",e=>{const k=e.key;
        if(k==="Backspace"){e.preventDefault();back();}
        else if(k==="Delete"){e.preventDefault();if(!cwDone){delete ent[key(sel.r,sel.c)];paint();}}
        else if(k.startsWith("Arrow")){e.preventDefault();arrow(k);}
        else if(k==="Enter"){e.preventDefault();nextWord(e.shiftKey?-1:1);}
        else if(k===" "){e.preventDefault();const x=cw.cells[key(sel.r,sel.c)];if(x.a!=null&&x.d!=null){sel.d=1-sel.d;paint();}}
        else if(/^[a-z]$/i.test(k)&&!e.ctrlKey&&!e.metaKey&&!e.altKey){e.preventDefault();type(k.toUpperCase());}});
      // phone keyboards: keep one padding char so Backspace still fires an input event
      inp.addEventListener("input",e=>{const v=inp.value;inp.value=PAD;try{inp.setSelectionRange(1,1);}catch(er){}
        if((e.inputType||"").startsWith("delete")||v.length<PAD.length){back();return;}
        const ch=v.replace(/[^a-z]/gi,"").slice(-1).toUpperCase();if(ch)type(ch);});
      paint();
      if(matchMedia("(pointer:fine)").matches) focus();
    }
    const this_=this;
    const focus=()=>{const i=$("#cwIn");if(i&&!cwDone){i.focus({preventScroll:true});}};
    const wordOf=()=>{const x=cw.cells[key(sel.r,sel.c)];return cw.words[x[sel.d?"d":"a"]];};
    const cellsOf=w=>[...Array(w.ans.length).keys()].map(i=>key(w.r+w.d*i,w.c+(1-w.d)*i));
    function paint(){
      if(!$("#cwGrid")) return;
      const w=wordOf(), wc=new Set(cellsOf(w)), cur=key(sel.r,sel.c);
      let h="";
      for(let r=0;r<cw.H;r++) for(let c=0;c<cw.W;c++){const k=key(r,c),x=cw.cells[k];
        if(!x){h+=`<div class="cw-x"></div>`;continue;}
        const num=cw.words.find(o=>o.r===r&&o.c===c);
        h+=`<div class="cw-c${wc.has(k)?" word":""}${k===cur?" cur":""}${bad.has(k)?" bad":""}${rev.has(k)?" rev":""}" data-k="${k}">${num?`<span class="cw-n">${num.num}</span>`:""}${ent[k]||""}</div>`;}
      const g=$("#cwGrid");g.innerHTML=h;g.classList.toggle("cw-solved",cwDone&&!usedAll);
      const i=$("#cwIn");i.style.left=sel.c/cw.W*100+"%";i.style.top=sel.r/cw.H*100+"%";i.style.width=100/cw.W+"%";i.style.height=100/cw.H+"%";
      $("#cwCur").innerHTML=`<b>${w.num} ${w.d?L().down:L().across}</b>${WQ.esc(w.clue)} (${w.ans.length})`;
      el.querySelectorAll("[data-w]").forEach(b=>b.classList.toggle("on",cw.words[+b.dataset.w]===w));
      $("#cwMsg").textContent=cwMsg; $("#cwTime").textContent=mmss((cwDone?cwTEnd:Date.now())-cwT0);
      ["#cwChk","#cwRl","#cwRa"].forEach(s=>$(s).disabled=cwDone);
      $("#cwEnd").innerHTML=cwDone?`<div class="card wd-end"><h2>${usedAll?"👀":"🎉 "+L().solved}</h2><p>${usedAll?L().shown:L().solvedS(mmss(cwTEnd-cwT0),rev.size)}</p>
        <div class="row" style="justify-content:center"><button class="btn" id="cwAgain">${L().neu}</button><a class="btn alt" href="#/games">${L().map}</a></div></div>`:"";
      if($("#cwAgain")) $("#cwAgain").onclick=start;
    }
    function step(dr,dc){let r=sel.r+dr,c=sel.c+dc;while(r>=0&&c>=0&&r<cw.H&&c<cw.W){if(cw.cells[key(r,c)]){sel.r=r;sel.c=c;return true;}r+=dr;c+=dc;}return false;}
    function type(ch){
      if(cwDone) return; const k=key(sel.r,sel.c); ent[k]=ch; bad.delete(k);
      const w=wordOf(), cs=cellsOf(w), i=cs.indexOf(k);
      if(i<cs.length-1){const [r,c]=cs[i+1].split(",").map(Number);sel.r=r;sel.c=c;}
      cwMsg="";isSolved();paint();
    }
    function back(){
      if(cwDone) return; const k=key(sel.r,sel.c);
      if(ent[k]){delete ent[k];bad.delete(k);}
      else{const cs=cellsOf(wordOf()), i=cs.indexOf(k); if(i>0){const [r,c]=cs[i-1].split(",").map(Number);sel.r=r;sel.c=c;delete ent[cs[i-1]];bad.delete(cs[i-1]);}}
      paint();
    }
    function arrow(k){
      const d=k==="ArrowLeft"||k==="ArrowRight"?0:1, x=cw.cells[key(sel.r,sel.c)];
      if(sel.d!==d&&x[d?"d":"a"]!=null){sel.d=d;paint();return;}
      const m={ArrowLeft:[0,-1],ArrowRight:[0,1],ArrowUp:[-1,0],ArrowDown:[1,0]}[k];
      if(step(...m)){const y=cw.cells[key(sel.r,sel.c)];if(y[sel.d?"d":"a"]==null)sel.d=1-sel.d;}
      paint();
    }
    function nextWord(s){const i=(cw.words.indexOf(wordOf())+s+cw.words.length)%cw.words.length,w=cw.words[i];sel={r:w.r,c:w.c,d:w.d};paint();}
    function isSolved(){
      const ks=Object.keys(cw.cells);
      if(ks.some(k=>!ent[k])) return false;
      if(ks.every(k=>ent[k]===cw.cells[k].ch)){
        cwDone=true;cwTEnd=Date.now();cwMsg="";
        if(!usedAll){WQ.beep(true);if(!WQ.award("crossword"))WQ.confetti();}
        const i=$("#cwIn"); if(i) i.blur(); return true;
      }
      cwMsg=L().full; return false;
    }
    function check(){
      bad=new Set(Object.keys(cw.cells).filter(k=>ent[k]&&ent[k]!==cw.cells[k].ch));
      cwMsg=bad.size?L().wrong(bad.size):L().ok; WQ.beep(!bad.size); if(bad.size) WQ.anim($("#cwGrid"),"shake");
      paint(); focus();
    }
    function revealLetter(){const k=key(sel.r,sel.c);ent[k]=cw.cells[k].ch;rev.add(k);bad.delete(k);cwMsg="";type(ent[k]);focus();}
    function revealAll(){if(!confirm(L().raQ))return;usedAll=true;Object.keys(cw.cells).forEach(k=>{if(ent[k]!==cw.cells[k].ch){ent[k]=cw.cells[k].ch;rev.add(k);}});bad.clear();isSolved();paint();}
    const tick=setInterval(()=>{if(el.isConnected&&cw&&!cwDone&&$("#cwTime"))$("#cwTime").textContent=mmss(Date.now()-cwT0);},1000);
    if(relang&&cw) build(); else start();
    return ()=>clearInterval(tick);
  }});

/* ================= WORD SEARCH ================= */
let ws=null, found=[], wsT0=0, wsTEnd=0, wsDone=false, pend=null;
WQ.registerGame("wordsearch",{order:4,kind:"game",icon:"🔎",ages:"7+",
  title:{en:"Fun Puzzle: Word Search",bm:"Teka-teki Seronok: Cari Kata"},
  desc:{en:"Find the hidden waste-to-wealth words in the grid.",bm:"Cari perkataan sisa kepada kekayaan yang tersembunyi dalam grid."},
  badge:{icon:"🔎",name:{en:"Word Hunter",bm:"Pemburu Kata"},desc:{en:"Find every word in a word search",bm:"Cari semua perkataan dalam Cari Kata"}},
  mount(el,{relang}){
    const L=()=>T[WQ.lang], $=s=>el.querySelector(s), self=this;
    const HUES=[48,130,200,280,330,20,170,90,240,0,300,60];
    function start(){
      const kids=WQ.aud==="kids";
      ws=genSearch(WORDS[WQ.lang][kids?"k":"o"],kids?10:12,kids?DIRS_K:DIRS_O,kids?8:10);ws.lang=WQ.lang;ws.kids=kids;
      found=[];wsT0=Date.now();wsTEnd=0;wsDone=false;pend=null;build();
    }
    function build(){
      el.innerHTML=WQ.head("🔎",self.title,self.desc)+`
        ${WQ.aud==="teacher"?`<p class="note small">${L().wsTip}</p>`:""}${langNote(ws.lang,"wsLang")}
        <div class="row ws-bar" style="margin:0 0 12px"><span class="pill">⏱️ <span id="wsTime"></span></span><span class="pill">🔎 <span id="wsCount"></span></span><span class="spacer"></span>
          <button class="btn blue" id="wsHint">${L().hint}</button><button class="btn alt" id="wsNew">${L().neu}</button></div>
        <div class="ws-wrap"><div><div class="ws-grid" id="wsGrid" style="--n:${ws.N}"></div></div>
          <div class="card"><h3>${L().find}</h3><p class="small muted">${L().how} ${ws.kids?L().dK:L().dO}</p><ul class="ws-list" id="wsList" aria-live="polite"></ul><div id="wsEnd"></div></div></div>`;
      $("#wsNew").onclick=start; if($("#wsLang")) $("#wsLang").onclick=start; $("#wsHint").onclick=hint;
      const g=$("#wsGrid");
      g.innerHTML=ws.g.map((row,r)=>row.map((ch,c)=>`<div class="ws-c" data-r="${r}" data-c="${c}">${ch}</div>`).join("")).join("");
      // pointer drag from first to last letter; a tap without moving sets/uses a start letter
      let drag=null;
      const cellAt=e=>{const t=document.elementFromPoint(e.clientX,e.clientY);const c=t&&t.closest(".ws-c");return c&&g.contains(c)?{r:+c.dataset.r,c:+c.dataset.c}:null;};
      g.addEventListener("pointerdown",e=>{if(wsDone)return;const c=cellAt(e);if(!c)return;e.preventDefault();try{g.setPointerCapture(e.pointerId);}catch(er){}
        drag={...c,cur:c,moved:false};mark(line(c,c));});
      g.addEventListener("pointermove",e=>{if(!drag)return;const c=cellAt(e);if(!c)return;
        if(c.r!==drag.r||c.c!==drag.c)drag.moved=true;drag.cur=c;mark(line(drag,c));});
      const up=()=>{if(!drag)return;const s=drag;drag=null;
        if(!s.moved){if(pend&&(pend.r!==s.r||pend.c!==s.c)){const p=pend;pend=null;test(line(p,s));}else{pend=pend?null:{r:s.r,c:s.c};mark([]);}}
        else{pend=null;test(line(s,s.cur));}
        paint();};
      g.addEventListener("pointerup",up);g.addEventListener("pointercancel",()=>{drag=null;mark([]);});
      paint();
    }
    // cells from a to b, snapped to the nearest of the 8 directions and kept inside the grid
    function line(a,b){
      let dr=b.r-a.r, dc=b.c-a.c; const ar=Math.abs(dr), ac=Math.abs(dc);
      if(ar&&ac&&ar!==ac){ if(Math.min(ar,ac)/Math.max(ar,ac)<.5){ if(ar>ac)dc=0; else dr=0; } }
      const n=Math.max(Math.abs(dr),Math.abs(dc)), sr=Math.sign(dr), sc=Math.sign(dc), out=[];
      for(let k=0;k<=n;k++){const r=a.r+sr*k, c=a.c+sc*k; if(r<0||c<0||r>=ws.N||c>=ws.N)break; out.push([r,c]);}
      return out;
    }
    function mark(cells){const s=new Set(cells.map(([r,c])=>r*100+c));
      el.querySelectorAll(".ws-c").forEach(d=>{d.classList.toggle("sel",s.has(+d.dataset.r*100+ +d.dataset.c));d.classList.toggle("start",!!pend&&pend.r===+d.dataset.r&&pend.c===+d.dataset.c);});}
    function test(cells){
      mark([]); if(cells.length<2) return;
      const s=cells.map(([r,c])=>ws.g[r][c]).join(""), rs=[...s].reverse().join("");
      const w=ws.words.find(w=>!found.includes(w.ans)&&(w.ans===s||w.ans===rs));
      if(!w){WQ.beep(false);return;}
      w.cells=cells.slice(); if(w.ans===rs) w.cells.reverse();
      found.push(w.ans);WQ.beep(true);
      if(found.length===ws.words.length){wsDone=true;wsTEnd=Date.now();if(!WQ.award("wordsearch"))WQ.confetti();}
    }
    function hint(){
      const left=ws.words.filter(w=>!found.includes(w.ans)); if(!left.length) return;
      const w=left[Math.floor(Math.random()*left.length)], [r,c]=w.cells[0], d=$(`.ws-c[data-r="${r}"][data-c="${c}"]`);
      WQ.anim(d,"hint");
    }
    function paint(){
      if(!$("#wsGrid")) return;
      const col={};
      ws.words.forEach((w,i)=>{if(found.includes(w.ans)) w.cells.forEach(([r,c])=>col[r*100+c]=`hsl(${HUES[i%HUES.length]} 85% 78%)`);});
      el.querySelectorAll(".ws-c").forEach(d=>{d.style.background=col[+d.dataset.r*100+ +d.dataset.c]||"";});
      mark([]);
      $("#wsList").innerHTML=ws.words.map((w,i)=>`<li class="${found.includes(w.ans)?"got":""}" style="--h:hsl(${HUES[i%HUES.length]} 85% 85%)">${w.ans}</li>`).join("");
      $("#wsCount").textContent=L().foundN(found.length,ws.words.length);
      $("#wsTime").textContent=mmss((wsDone?wsTEnd:Date.now())-wsT0);
      $("#wsHint").disabled=wsDone;
      $("#wsEnd").innerHTML=wsDone?`<div class="wd-end"><h2>${L().wsDone}</h2><p>${L().wsDoneS(mmss(wsTEnd-wsT0))}</p>
        <div class="row" style="justify-content:center"><button class="btn" id="wsAgain">${L().neu}</button><a class="btn alt" href="#/games">${L().map}</a></div></div>`:"";
      if($("#wsAgain")) $("#wsAgain").onclick=start;
    }
    const tick=setInterval(()=>{if(el.isConnected&&ws&&!wsDone&&$("#wsTime"))$("#wsTime").textContent=mmss(Date.now()-wsT0);},1000);
    if(relang&&ws) build(); else start();
    return ()=>clearInterval(tick);
  }});
})();
