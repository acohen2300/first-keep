import asyncio, json, sys
from playwright.async_api import async_playwright
HTML=sys.argv[1]; SEEDS=[int(x) for x in sys.argv[2].split(',')]; MIN=int(sys.argv[3])
JS="""([seed, minutes]) => {
 const F=window.__fk, CV=Object.keys(F.CIVS); F.SET.diff='normal'; F.SET.fog=false; F.SET.civ=CV[seed%CV.length]; F.newGame(seed); F.act('close'); F.setPause(false);
 const G=F.G,P0=G.P[0]; P0.pers='bal'; P0.ai.t=1;
 const snap=(p)=>JSON.parse(JSON.stringify({by:p.spentBy||{},inn:(p.ledger||{}).in||{},res:p.res}));
 const S=[0,1,2,3].map(()=>({})), ACC=[0,1,2,3].map(()=>({})), LAST=[null,null,null,null], GIN=[0,1,2,3].map(()=>({})), jobs=[0,1,2,3].map(()=>({n:0,food:0,wood:0,gold:0,stone:0,iron:0,none:0,idle:0,army:0,vils:0}));
 for(let sec=0;sec<minutes*60;sec++){ for(let i=0;i<30;i++){ F.step(1/30); if(G.over==='lost')G.over=null; if(P0.alive){P0.ai.t-=1/30; if(P0.ai.t<=0){P0.ai.t=F.react();F.think(P0);}}}
  if(G.over)break;
  for(const s of [0,1,2,3]){ const p=G.P[s]; if(!p.alive)continue;
   if(p.age===2&&!S[s].a) S[s].a={t:G.t,...snap(p)};
   if(p.age===3&&!S[s].b) S[s].b={t:G.t,...snap(p)};
   if(p.age===2&&p.orateBy!==LAST[s]){ LAST[s]=p.orateBy; for(const k in p.orateBy) for(const w in p.orateBy[k]){ const A=ACC[s][k]||(ACC[s][k]={}); A[w]=(A[w]||0)+p.orateBy[k][w]; } for(const k in (p.rate||{})) GIN[s][k]=(GIN[s][k]||0)+p.rate[k]; }
   if(p.age===2&&sec%10===0){ const J=jobs[s]; J.n++; for(const u of G.units){ if(u.owner!==s)continue; if(u.kind==='vil'){J.vils++; J[u.job||'none']=(J[u.job||'none']||0)+1; if(u.job&&!u.node&&!u.hunt&&!u.inside&&!u.wait)J.idle++;} else if(F.UNIT[u.kind].cls==='army')J.army++; } }
  } }
 for(const s of [0,1,2,3]) if(S[s].a&&!S[s].b) S[s].b={t:G.t,...snap(G.P[s]),open:true};
 return {pers:G.P.slice(0,4).map(p=>p.pers),S,jobs,ACC,GIN}; }"""
async def main():
  async with async_playwright() as pw:
    br=await pw.chromium.launch(); pg=await br.new_page(viewport={'width':390,'height':844})
    await pg.goto('file://'+HTML); await pg.wait_for_timeout(400)
    out={}
    for s in SEEDS: out[s]=await pg.evaluate(JS,[s,MIN]); print('seed',s,'done',flush=True)
    json.dump(out,open(sys.argv[4],'w'))
asyncio.run(main())
