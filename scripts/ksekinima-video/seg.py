import numpy as np, soundfile as sf, json
x,sr=sf.read('a16.wav'); x=x.astype(np.float32)
hop=int(sr*0.01); win=int(sr*0.025)
n=(len(x)-win)//hop
rms=np.array([np.sqrt(np.mean(x[i*hop:i*hop+win]**2)+1e-12) for i in range(n)])
db=20*np.log10(rms)
floor=np.percentile(db,10); top=np.percentile(db,95)
thr=floor+0.35*(top-floor)
print('floor',floor,'top',top,'thr',thr)
sp=db>thr
# smooth: close gaps <0.12s, drop bursts <0.08s
def runs(m):
    r=[];s=None
    for i,v in enumerate(m):
        if v and s is None:s=i
        if not v and s is not None:r.append([s,i]);s=None
    if s is not None:r.append([s,len(m)])
    return r
R=runs(sp)
M=[]
for a,b in R:
    if M and a-M[-1][1]<12: M[-1][1]=b
    else: M.append([a,b])
M=[[a,b] for a,b in M if b-a>=8]
speech=[(round(a*0.01,2),round(b*0.01,2)) for a,b in M]
json.dump(speech,open('speech.json','w'))
gaps=[(speech[i][1],speech[i+1][0],round(speech[i+1][0]-speech[i][1],2)) for i in range(len(speech)-1)]
print(len(speech),'speech runs; first',speech[0],'last',speech[-1],'dur',len(x)/sr)
print('gaps>=0.5:',[(g[0],g[2]) for g in gaps if g[2]>=0.5])
