import json,sys,glob,os
# reads the match logs (data only), prints a per-match summary of his side (side 0)
for f in sorted(sys.argv[1:]):
    L=json.load(open(f)); R=L['rows']; cols=L['cols']; n=len(R)
    print('\n==',os.path.basename(f),'| version',L.get('version'),'| seed',L.get('seed'),'| land',L.get('land'),'| rows',n,'| mail lines',len(L.get('mail',[])))
    def me(r): return r['s'][0]
    ages={}
    for p in range(4):
        a=[]; last=0
        for r in R:
            s=r['s'][p]
            if s and s[0]>last: a.append(r['m']); last=s[0]
        ages[p]=a
    print(' ages at minute:',ages)
    # villagers waiting / idle
    w=[(r['m'],r.get('vil',{}).get('wait',0),r.get('vil',{}).get('idle',0),sum(r.get('vil',{}).values())) for r in R if me(r)]
    mw=max(w,key=lambda x:x[1]); mi=max(w,key=lambda x:x[2])
    tot=sum(x[3] for x in w) or 1
    print(' wait: peak %d of %d at m%d; villager-minutes on wait %.0f%%, idle %.0f%%'%(mw[1],mw[3],mw[0],100*sum(x[1] for x in w)/tot,100*sum(x[2] for x in w)/tot))
    odd=set()
    for r in R: odd|=set(r.get('vil',{}).keys())
    print(' job names seen:',sorted(odd))
    # food zero minutes, gold low
    fi=cols.index('food'); gi=cols.index('gold')
    fz=[r['m'] for r in R if me(r) and me(r)[fi]<60]
    print(' food<60 minutes:',len(fz),' gold<100 minutes:',len([1 for r in R if me(r) and me(r)[gi]<100]))
    # villager drops with food ok
    drops=[]
    for a,b in zip(R,R[1:]):
        if me(a) and me(b) and me(b)[1]<me(a)[1]-2: drops.append((b['m'],me(a)[1],me(b)[1],me(b)[fi]))
    print(' villager drops >2 in a minute:',len(drops),drops[:6])
    # army wipes
    wipes=[]
    for a,b in zip(R,R[1:]):
        if me(a) and me(b) and me(a)[2]>=15 and me(b)[2]<=me(a)[2]*0.6: wipes.append((b['m'],me(a)[2],me(b)[2]))
    print(' army lost 40%+ in a minute:',wipes[:8])
    # peaks
    for p in range(4):
        v=[r['s'][p] for r in R if r['s'][p]]
        if not v: print('  side',p,'no rows'); continue
        gone=next((r['m'] for r in R if r['s'][p] is None),None)
        print('  side',p,'peak vil',max(x[1] for x in v),'peak army',max(x[2] for x in v),'peak gold',max(x[gi] for x in v),'peak food',max(x[fi] for x in v),'fell at',gone)
    # ledger last row
    led=R[-1].get('led')
    if led:
        i,o=led
        top=lambda d: sorted(((k,(v if isinstance(v,(int,float)) else sum(v.values()))) for k,v in d.items()),key=lambda x:-x[1])[:6]
        print(' in:',top(i)); print(' out:',top(o))
    print(' mail:',[m for m in L.get('mail',[])][:6])
