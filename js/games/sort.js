/* Sort It Out! — drag waste into Malaysian SWCorp colour bins (blue paper / orange plastic & metal / brown glass)
   Level 2 adds compost, general and hazardous waste. */
(() => {
const T={
 en:{hint:"Drag the item into a bin, or tap a bin.",l1:"Level 1 · 3 bins",l2:"Level 2 · 6 bins",
  good:["Great job!","Correct!","Well sorted!","Super!"],bad:"Not quite, try another bin!",was:"It goes in:",
  endT:"Round complete!",endS:(s,n)=>`You sorted ${s} of ${n} items right on the first try.`,again:"Play again",next:"Try Level 2",map:"All games",best:"Best"},
 bm:{hint:"Seret barang ke dalam tong, atau tekan tong.",l1:"Tahap 1 · 3 tong",l2:"Tahap 2 · 6 tong",
  good:["Bagus!","Betul!","Hebat!","Syabas!"],bad:"Belum tepat, cuba tong lain!",was:"Ia masuk ke:",
  endT:"Pusingan tamat!",endS:(s,n)=>`Anda mengasingkan ${s} daripada ${n} barang dengan betul pada cubaan pertama.`,again:"Main lagi",next:"Cuba Tahap 2",map:"Semua permainan",best:"Terbaik"}
};
const BINS={
 blue:{i:"📄",en:["Blue bin","Paper"],bm:["Tong biru","Kertas"]},
 orange:{i:"🥫",en:["Orange bin","Plastic & metal"],bm:["Tong oren","Plastik & logam"]},
 brown:{i:"🫙",en:["Brown bin","Glass"],bm:["Tong coklat","Kaca"]},
 green:{i:"🌱",en:["Compost","Food & garden waste"],bm:["Kompos","Sisa makanan & taman"]},
 grey:{i:"🗑️",en:["General waste","Cannot be recycled"],bm:["Sisa am","Tidak boleh dikitar"]},
 red:{i:"⚠️",en:["Hazardous","Special drop-off"],bm:["Berbahaya","Pusat kutipan khas"]}
};
// [emoji, bin, level, en name, bm name, en fact, bm fact]
const ITEMS=[
 ["📰","blue",1,"Old newspaper","Surat khabar lama","Paper can be recycled 5–7 times before the fibres get too short.","Kertas boleh dikitar semula 5–7 kali sebelum seratnya terlalu pendek."],
 ["📦","blue",1,"Cardboard box","Kotak kadbod","Flatten boxes first so they take less space in the bin.","Leperkan kotak dahulu supaya tidak memenuhkan tong."],
 ["📓","blue",1,"Used exercise book","Buku latihan terpakai","Remove plastic covers. The paper inside is recyclable.","Buang sampul plastik. Kertas di dalamnya boleh dikitar."],
 ["✉️","blue",1,"Envelope","Sampul surat","Envelopes go with paper, even the ones with windows.","Sampul surat masuk bersama kertas."],
 ["🧴","orange",1,"Shampoo bottle (rinsed)","Botol syampu (dibilas)","Rinse plastic bottles so they don't make other recyclables dirty.","Bilas botol plastik supaya tidak mengotorkan bahan kitar semula lain."],
 ["🥫","orange",1,"Food tin can","Tin makanan","Metal cans can be recycled again and again without losing quality.","Tin logam boleh dikitar berulang kali tanpa hilang kualiti."],
 ["🛍️","orange",1,"Clean plastic bag","Beg plastik bersih","Better still: bring your own reusable bag!","Lebih baik lagi: bawa beg guna semula sendiri!"],
 ["🪣","orange",1,"Broken plastic pail","Baldi plastik pecah","Hard plastics can be shredded and made into new products.","Plastik keras boleh dicincang dan dijadikan produk baharu."],
 ["🫙","brown",1,"Glass jam jar","Balang kaca jem","Glass can be recycled endlessly. Remove the lid first.","Kaca boleh dikitar tanpa had. Tanggalkan penutupnya dahulu."],
 ["🍶","brown",1,"Glass sauce bottle","Botol kicap kaca","Rinse it. Glass bottles become new bottles.","Bilas dahulu. Botol kaca dijadikan botol baharu."],
 ["🍌","green",2,"Banana peel","Kulit pisang","Food is the biggest part of Malaysian household waste (30.6%). Compost it!","Makanan ialah komponen terbesar sisa domestik Malaysia (30.6%). Kompos!"],
 ["🥚","green",2,"Eggshells","Kulit telur","Crushed eggshells add calcium to compost.","Kulit telur yang dihancurkan menambah kalsium dalam kompos."],
 ["☕","green",2,"Used coffee grounds","Hampas kopi","Waste-to-wealth: dried coffee grounds make an odour neutraliser (Lab 5).","Sisa kepada kekayaan: hampas kopi kering jadi penyerap bau (Makmal 5)."],
 ["🍂","green",2,"Dry leaves","Daun kering","Dry leaves are 'browns'. Compost needs browns and greens.","Daun kering ialah bahan 'perang'. Kompos perlukan bahan perang dan hijau."],
 ["🍊","green",2,"Fruit peels","Kulit buah","Waste-to-wealth: fruit peels + sugar + water = eco-enzyme (Lab 7).","Sisa kepada kekayaan: kulit buah + gula + air = eko-enzim (Makmal 7)."],
 ["😷","grey",2,"Used face mask","Pelitup muka terpakai","Masks are mixed materials and unhygienic, so they cannot be recycled.","Pelitup muka diperbuat daripada bahan campuran dan tidak bersih, jadi tidak boleh dikitar."],
 ["🧻","grey",2,"Used tissue","Tisu terpakai","Dirty tissue paper fibres are too short and soiled to recycle.","Tisu kotor mempunyai serat terlalu pendek dan tercemar untuk dikitar."],
 ["🪞","grey",2,"Broken mirror","Cermin pecah","Tricky! Mirror glass has a coating, so it is NOT put with bottles and jars. Wrap it safely.","Helah! Kaca cermin bersalut, jadi TIDAK dicampur dengan botol dan balang. Balut dengan selamat."],
 ["🥡","grey",2,"Oily food container","Bekas makanan berminyak","Food-soiled containers spoil recycling. Clean ones are better!","Bekas tercemar makanan merosakkan kitar semula. Bekas bersih lebih baik!"],
 ["🔋","red",2,"Old battery","Bateri lama","Batteries contain heavy metals. Take them to an e-waste collection point.","Bateri mengandungi logam berat. Hantar ke pusat kutipan e-sisa."],
 ["📱","red",2,"Old phone","Telefon lama","E-waste contains valuable metals, and toxic ones too. Use an e-waste drop-off.","E-sisa mengandungi logam berharga dan juga toksik. Hantar ke pusat e-sisa."],
 ["💊","red",2,"Expired medicine","Ubat tamat tempoh","Return expired medicine to a pharmacy or clinic. Never flush it.","Pulangkan ubat tamat tempoh ke farmasi atau klinik. Jangan buang ke tandas."],
 ["💡","red",2,"Fluorescent lamp","Lampu kalimantang","Fluorescent lamps contain mercury. Handle with care!","Lampu kalimantang mengandungi merkuri. Kendalikan dengan berhati-hati!"]
];
const ROUND=10, LV_BINS={1:["blue","orange","brown"],2:["blue","orange","brown","green","grey","red"]};
let lvl=1, deck=[], idx=0, score=0, tries=0, firstTry=0, busy=false, done=false;

WQ.css("sort",`
.sg-bar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:4px 0 12px}
.sg-lv{display:flex;gap:8px}.sg-lv button{background:#fff;border-radius:999px;padding:6px 14px;font-weight:800;box-shadow:var(--shadow)}
.sg-lv button[aria-pressed=true]{background:var(--grass);color:#fff}
.sg-stage{min-height:230px;display:grid;place-items:center}
.sg-item{touch-action:none;user-select:none;background:#fff;border-radius:28px;box-shadow:var(--shadow);padding:16px 22px;text-align:center;cursor:grab;width:min(260px,80vw);position:relative;z-index:5}
.sg-item .em{font-size:5rem;line-height:1.1}.sg-item .nm{font-family:"Baloo 2";font-weight:800;font-size:1.35rem}
.sg-item.drag{cursor:grabbing;box-shadow:0 18px 40px rgba(29,53,87,.3);transition:none}.sg-item.snap{transition:transform .25s}
.sg-hint{color:var(--muted);text-align:center;margin:8px 0 14px;font-weight:600}
.sg-bins{display:grid;gap:12px;grid-template-columns:repeat(var(--n,3),1fr)}
.sg-bin{border-radius:18px 18px 26px 26px;color:#fff;padding:14px 8px 16px;text-align:center;min-height:130px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:4px;box-shadow:inset 0 -10px 0 rgba(0,0,0,.15),var(--shadow);position:relative;transition:transform .12s}
.sg-bin:before{content:"";position:absolute;top:-10px;left:6%;right:6%;height:16px;border-radius:10px;background:inherit;filter:brightness(.85)}
.sg-bin .bi{font-size:1.8rem}.sg-bin .bl{font-family:"Baloo 2";font-weight:800;font-size:1.05rem;line-height:1.1}.sg-bin .bs{font-size:.78rem;line-height:1.15}
.sg-bin.hover{transform:scale(1.07)}
.b-blue{background:var(--blue)}.b-orange{background:var(--orange)}.b-brown{background:var(--brown)}.b-green{background:var(--green)}.b-grey{background:var(--grey)}.b-red{background:var(--red)}
.sg-toast{min-height:64px;margin:14px auto 0;max-width:640px;background:#fff;border-radius:16px;padding:12px 16px;box-shadow:var(--shadow);display:flex;gap:10px;align-items:flex-start;font-weight:600;opacity:0;transition:opacity .2s}
.sg-toast.on{opacity:1}.sg-toast .ti{font-size:1.6rem;line-height:1}
.sg-toast.good{border-left:8px solid var(--grass)}.sg-toast.bad{border-left:8px solid var(--red)}
.sg-end{text-align:center;max-width:520px;margin:0 auto}.sg-stars{font-size:3rem;letter-spacing:6px}
@media (max-width:700px){.sg-bins{grid-template-columns:repeat(3,1fr)}.sg-bin{min-height:110px}.sg-bin .bs{display:none}.sg-item .em{font-size:4rem}}
`);

WQ.registerGame("sort",{order:1,kind:"game",icon:"🗑️",ages:"7+",
  title:{en:"Sort It Out!",bm:"Asingkan Sampah!"},
  desc:{en:"Drag each item into the right Malaysian recycling bin.",bm:"Seret setiap barang ke tong kitar semula yang betul."},
  badge:{icon:"🗑️",name:{en:"Sorting Star",bm:"Bintang Pengasing"},desc:{en:"3 stars in Sort It Out",bm:"3 bintang dalam Asingkan Sampah"}},
  mount(el,{relang}){
    const L=()=>T[WQ.lang], $=s=>el.querySelector(s);
    el.innerHTML=WQ.head("🗑️",this.title,this.desc)+`
      <div class="sg-bar"><div class="sg-lv" role="group" aria-label="Level"><button data-lvl="1"></button><button data-lvl="2"></button></div>
      <span class="spacer"></span><span class="pill">⭐ <span id="sgScore">0</span></span><span class="pill">📦 <span id="sgProg"></span></span></div>
      <div id="sgPlay"><div class="sg-stage"><div class="sg-item" id="sgItem" tabindex="0"><div class="em" id="sgEm"></div><div class="nm" id="sgNm"></div></div></div>
      <p class="sg-hint">${L().hint}</p><div class="sg-bins" id="sgBins"></div>
      <div class="sg-toast" id="sgToast" role="status" aria-live="polite"><span class="ti" id="sgTi"></span><span id="sgTt"></span></div></div>
      <div id="sgEnd" hidden></div>`;
    el.querySelectorAll("[data-lvl]").forEach(b=>{b.textContent=L()["l"+b.dataset.lvl];b.onclick=()=>{lvl=+b.dataset.lvl;start();};});
    function start(){
      const pool=ITEMS.filter(it=>LV_BINS[lvl].includes(it[1])&&(lvl===2||it[2]===1));
      const mix=WQ.shuffle(pool), firsts=LV_BINS[lvl].map(b=>mix.find(it=>it[1]===b));
      deck=WQ.shuffle(firsts.concat(mix.filter(it=>!firsts.includes(it))).slice(0,ROUND));
      idx=0;score=0;firstTry=0;tries=0;busy=false;done=false;render();
    }
    function render(){
      el.querySelectorAll("[data-lvl]").forEach(b=>b.setAttribute("aria-pressed",+b.dataset.lvl===lvl));
      $("#sgPlay").hidden=done;$("#sgEnd").hidden=!done;
      if(done) return showEnd();
      const ids=LV_BINS[lvl], box=$("#sgBins"); box.style.setProperty("--n",ids.length);
      box.innerHTML=ids.map((id,n)=>{const b=BINS[id][WQ.lang];return `<button class="sg-bin b-${id}" data-bin="${id}" aria-label="${n+1}. ${b[0]}: ${b[1]}"><span class="bi">${BINS[id].i}</span><span class="bl">${b[0]}</span><span class="bs">${b[1]}</span></button>`}).join("");
      box.querySelectorAll(".sg-bin").forEach(b=>b.onclick=()=>drop(b.dataset.bin));
      const it=deck[idx];$("#sgEm").textContent=it[0];$("#sgNm").textContent=WQ.lang==="en"?it[3]:it[4];
      $("#sgItem").setAttribute("aria-label",$("#sgNm").textContent);
      $("#sgScore").textContent=score;$("#sgProg").textContent=`${idx+1}/${deck.length}`;
    }
    function drop(bin){
      if(busy||done) return; const it=deck[idx], binEl=$(`.sg-bin[data-bin="${bin}"]`), t=$("#sgToast"), fact=WQ.lang==="en"?it[5]:it[6];
      if(bin===it[1]){
        busy=true;WQ.beep(true);WQ.anim(binEl,"pop");
        if(tries===0){score+=10;firstTry++;}else score+=5;
        const g=L().good;t.className="sg-toast on good";$("#sgTi").textContent="✅";$("#sgTt").textContent=g[Math.floor(Math.random()*g.length)]+" "+fact;
        $("#sgScore").textContent=score;
        setTimeout(()=>{if(!el.isConnected)return;tries=0;idx++;busy=false;t.className="sg-toast";if(idx>=deck.length){done=true;WQ.best("sort"+lvl,score);if(firstTry>=9)WQ.award("sort");else if(firstTry>=8)WQ.confetti();}render();},1400);
      }else{
        tries++;WQ.beep(false);WQ.anim($("#sgItem"),"shake");t.className="sg-toast on bad";$("#sgTi").textContent="🤔";
        $("#sgTt").textContent=tries>=2?`${L().was} ${BINS[it[1]][WQ.lang][0]} (${BINS[it[1]][WQ.lang][1]}). ${fact}`:L().bad;
      }
    }
    function showEnd(){
      const n=deck.length, stars=firstTry>=9?3:firstTry>=7?2:1, l=L();
      $("#sgEnd").innerHTML=`<div class="card sg-end"><h2>${l.endT}</h2><div class="sg-stars" aria-label="${stars}/3">${"⭐".repeat(stars)}${"☆".repeat(3-stars)}</div>
        <p>${l.endS(firstTry,n)}</p><p><b>⭐ ${score}</b> · ${l.best}: ${WQ.best("sort"+lvl)}</p>
        <div class="row" style="justify-content:center"><button class="btn" id="sgA">${l.again}</button>${lvl===1?`<button class="btn blue" id="sgN">${l.next}</button>`:""}<a class="btn alt" href="#/games">${l.map}</a></div></div>`;
      $("#sgA").onclick=start; if($("#sgN")) $("#sgN").onclick=()=>{lvl=2;start();};
    }
    // drag with pointer events (mouse + touch); tapping a bin also works; number keys pick a bin
    const item=$("#sgItem"); let sx,sy,on=false,over=null;
    const binAt=(x,y)=>{item.style.visibility="hidden";const b=document.elementFromPoint(x,y);item.style.visibility="";return b&&b.closest(".sg-bin");};
    item.addEventListener("pointerdown",e=>{if(busy)return;on=true;sx=e.clientX;sy=e.clientY;item.setPointerCapture(e.pointerId);item.classList.add("drag");item.classList.remove("snap");});
    item.addEventListener("pointermove",e=>{if(!on)return;item.style.transform=`translate(${e.clientX-sx}px,${e.clientY-sy}px) rotate(${(e.clientX-sx)/20}deg)`;
      const b=binAt(e.clientX,e.clientY);if(b!==over){over&&over.classList.remove("hover");over=b;over&&over.classList.add("hover");}});
    const end=()=>{if(!on)return;on=false;item.classList.remove("drag");item.classList.add("snap");item.style.transform="";if(over){over.classList.remove("hover");drop(over.dataset.bin);over=null;}};
    item.addEventListener("pointerup",end);item.addEventListener("pointercancel",end);
    const key=e=>{const n=+e.key, ids=LV_BINS[lvl]; if(n>=1&&n<=ids.length) drop(ids[n-1]);};
    document.addEventListener("keydown",key);
    if(relang&&deck.length) render(); else start();
    return ()=>document.removeEventListener("keydown",key);
  }});
})();
