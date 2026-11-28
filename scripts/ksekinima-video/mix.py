import numpy as np, soundfile as sf
from scipy.signal import resample_poly
DUR=146.3; SR=48000; N=int(DUR*SR)
v,sr=sf.read('voice.wav',dtype='float32'); assert sr==SR
v=v[:N]; voice=np.zeros(N,np.float32); voice[:len(v)]=v
# fade the room tone out after the last word
e=int(142.95*SR); f=int(0.35*SR); voice[e:e+f]*=np.linspace(1,0,f); voice[e+f:]=0
m,ms=sf.read('music_raw.wav',dtype='float32'); m=resample_poly(m,160,147,axis=0)[:N].astype(np.float32)
t=np.arange(N)/SR
pts=[(0,-60),(0.6,-22),(27.3,-22),(27.9,-18.5),(34.6,-18.5),(35.2,-22),(142.7,-22),(143.7,-9.5),(144.9,-9.5),(146.25,-60)]
g=np.interp(t,[p[0] for p in pts],[p[1] for p in pts]); gain=(10**(g/20)).astype(np.float32)
mix=np.stack([voice,voice],1)+m*gain[:,None]
pk=np.abs(mix).max(); print('peak',pk)
if pk>0.94: mix*=0.94/pk
sf.write('mix.wav',mix,SR,subtype='PCM_16')
