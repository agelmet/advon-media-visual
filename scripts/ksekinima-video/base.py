# picture pass: grade + reframe (3 framings, slow push-in) -> base.mp4 (no sound)
import cv2, numpy as np, subprocess, sys
from grade import grade
OFF=0.35; FPS=30; DUR=146.3; N=int(DUR*FPS)
FR={'A':(1.12,103,116),'B':(1.24,186,190),'C':(1.14,0,133)}
SHOTS=[(0,'A'),(9.25,'C'),(58.0,'B'),(66.75,'C'),(79.2,'A'),(81.7,'C'),(104.7,'B'),(107.7,'C'),(135.55,'A'),(138.65,'C'),(1e9,'')]
def view(t):
    for i in range(len(SHOTS)-1):
        if SHOTS[i][0]<=t<SHOTS[i+1][0]:
            t0,k=SHOTS[i]; z,x0,y0=FR[k]; w=1920/z;h=1080/z; cx=x0+w/2; cy=y0+h/2
            zz=z*(1+min(0.04,0.0022*(t-t0)))
            w2=1920/zz;h2=1080/zz
            x=min(max(cx-w2/2,0),1920-w2); y=min(max(cy-h2/2,0),1080-h2)
            return zz,x,y
cap=cv2.VideoCapture('raw.mov')
ff=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','bgr24','-s','1920x1080','-r',str(FPS),'-i','-','-c:v','libx264','-preset','veryfast','-crf','13','-pix_fmt','yuv420p','base.mp4'],stdin=subprocess.PIPE)
src=-1; frame=None; last=None
for n in range(N):
    t=n/FPS+OFF; want=int(round(t*FPS))
    while src<want:
        ok,f=cap.read()
        if not ok: break
        frame=f; src+=1
    if frame is not last:
        g=grade(frame); last=frame
    zz,x,y=view(min(t,143.3))
    M=np.float32([[zz,0,-x*zz],[0,zz,-y*zz]])
    out=cv2.warpAffine(g,M,(1920,1080),flags=cv2.INTER_CUBIC,borderMode=cv2.BORDER_REPLICATE)
    ff.stdin.write(out.tobytes())
    if n%300==0: print(n,N,flush=True)
ff.stdin.close(); ff.wait(); print('done')
