const { chromium } = require(process.env.PW); const fs=require('fs');
(async()=>{
  const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1920,height:1080}});
  p.on('pageerror',e=>console.log('ERR',e.message)); p.on('console',m=>{if(m.type()==='error')console.log('CON',m.text())});
  await p.goto('http://localhost:8771/index.html'); await p.waitForFunction(()=>window.ready&&window.ready()); await p.evaluate(()=>document.fonts.ready);
  const mode=process.argv[2];
  if(mode==='stills'){ for(const t of process.argv.slice(3).map(Number)){ await p.evaluate(T=>window.setT(T),t-0.35); await p.screenshot({path:`st/o_${t}.png`,omitBackground:true}); } }
  else { const N=+process.argv[3]; let prev=null,pf=null,u=0; const t0=Date.now();
    for(let n=0;n<N;n++){ const k=await p.evaluate(T=>window.setT(T),n/30); const f=`fr/o_${String(n).padStart(5,'0')}.png`;
      if(k===prev){ fs.linkSync(pf,f) } else { await p.screenshot({path:f,omitBackground:true}); prev=k; pf=f; u++ }
      if(n%300===0)console.log(n,u,((Date.now()-t0)/1000).toFixed(0)+'s'); }
    console.log('done',u); }
  await b.close();
})();
