# original calm bed (synthesised here, no samples): warm pad + soft keys + sub, D major, 80 bpm
import numpy as np, soundfile as sf
from scipy.signal import fftconvolve, butter, sosfilt
SR=44100; DUR=147.5; N=int(SR*DUR); rng=np.random.default_rng(7)
L=np.zeros(N); R=np.zeros(N)
def hz(m): return 440*2**((m-69)/12)
BEAT=60/80; BAR=4*BEAT
# two-bar chords (6 s): Dmaj9 | Bm7 | Gmaj7 | Asus2 -> A
CH=[([50,57,61,64,66],38),([47,54,57,62,66],35),([43,50,54,59,62],31),([45,52,57,59,64],33)]
def add(buf,start,sig):
    a=int(start*SR); b=min(N,a+len(sig))
    if a<N: buf[a:b]+=sig[:b-a]
def pad(notes,dur):
    n=int((dur+3.0)*SR); t=np.arange(n)/SR; s=np.zeros(n)
    for m in notes:
        f=hz(m)
        for det,amp in ((-0.35,.5),(0.3,.5),(0,.6)):
            ph=rng.uniform(0,6.28)
            s+=amp*np.sin(2*np.pi*f*(1+det/100)*t+ph)+0.18*amp*np.sin(2*np.pi*2*f*(1+det/100)*t+ph)+0.05*amp*np.sin(2*np.pi*3*f*t)
    env=np.minimum(1,t/1.8)*np.minimum(1,np.maximum(0,(dur+3.0-t)/3.0))
    trem=1+0.05*np.sin(2*np.pi*0.21*t+rng.uniform(0,6))
    return s*env*trem/len(notes)
def key(m,vel=1.0,dec=1.4):
    n=int(3.2*SR); t=np.arange(n)/SR; f=hz(m)
    s=np.sin(2*np.pi*f*t)+0.42*np.sin(2*np.pi*2*f*t)*np.exp(-t*2.2)+0.16*np.sin(2*np.pi*3*f*t)*np.exp(-t*4)+0.05*np.sin(2*np.pi*4.01*f*t)*np.exp(-t*7)
    env=(1-np.exp(-t*220))*np.exp(-t/dec)
    return vel*s*env
def sub(m,dur):
    n=int(dur*SR); t=np.arange(n)/SR; f=hz(m)
    env=np.minimum(1,t/0.25)*np.minimum(1,np.maximum(0,(dur-t)/0.6))
    return (np.sin(2*np.pi*f*t)+0.2*np.sin(2*np.pi*2*f*t))*env
t0=0.0; ci=0
pat=[0,2,4,3, 1,4,2,3]           # indices into upper chord tones, eighth notes
while t0<DUR:
    notes,bass=CH[ci%4]; d=2*BAR
    p=pad(notes,d); add(L,t0,p*0.9); add(R,t0+0.012,p*0.9)
    sb=sub(bass,d); add(L,t0,sb*0.42); add(R,t0,sb*0.42)
    up=[m+12 for m in notes]
    for k in range(16):                    # eighths over two bars
        if k%2==1 and rng.random()<0.45: continue
        if rng.random()<0.12: continue
        m=up[pat[k%8]%len(up)]
        if k%8==0: m=up[0]
        v=(0.55 if k%4==0 else 0.36)*rng.uniform(0.8,1.1)
        s=key(m,v); pan=0.5+0.32*np.sin(k*1.7+ci)
        tt=t0+k*BEAT/2+rng.uniform(-0.006,0.006)
        add(L,tt,s*(1-pan)*1.25); add(R,tt,s*pan*1.25)
    if ci%4==3:                            # a little rising answer at the end of each 4-chord turn
        for j,m in enumerate([76,78,81]):
            s=key(m,0.3,1.8); add(L,t0+d-1.5+j*BEAT/2,s*0.6); add(R,t0+d-1.5+j*BEAT/2,s*0.7)
    t0+=d; ci+=1
x=np.stack([L,R],1)
# reverb: decaying filtered noise impulse
irn=int(2.6*SR); ti=np.arange(irn)/SR
ir=np.stack([rng.standard_normal(irn),rng.standard_normal(irn)],1)*np.exp(-ti/0.75)[:,None]
sos=butter(2,[250,5200],'bandpass',fs=SR,output='sos'); ir=sosfilt(sos,ir,axis=0); ir/=np.sqrt((ir**2).sum(0))
wet=np.stack([fftconvolve(x[:,0],ir[:,0])[:N],fftconvolve(x[:,1],ir[:,1])[:N]],1)
y=x*0.8+wet*0.5
sos=butter(2,7500,'low',fs=SR,output='sos'); y=sosfilt(sos,y,axis=0)
sos=butter(2,34,'high',fs=SR,output='sos'); y=sosfilt(sos,y,axis=0)
y/=np.abs(y).max()/0.7
sf.write('music_raw.wav',y.astype(np.float32),SR)
print('ok',y.shape)
