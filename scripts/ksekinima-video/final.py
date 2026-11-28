import cv2, numpy as np, subprocess, os, sys
N=4389; out=sys.argv[1]; crf=sys.argv[2] if len(sys.argv)>2 else '21'
cap=cv2.VideoCapture('base.mp4')
ff=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','bgr24','-s','1920x1080','-r','30','-i','-','-i','mix.wav',
 '-c:v','libx264','-preset','slow','-crf',crf,'-pix_fmt','yuv420p','-profile:v','high','-g','60','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709',
 '-af','volume=-1dB','-c:a','aac','-b:a','160k','-movflags','+faststart','-shortest',out],stdin=subprocess.PIPE)
last=None; cache=None
for n in range(N):
    ok,f=cap.read()
    if not ok: f=prev
    prev=f
    p=f'fr/o_{n:05d}.png'; ino=os.stat(p).st_ino
    if ino!=last:
        o=cv2.imread(p,cv2.IMREAD_UNCHANGED); last=ino
        if o.shape[2]==3: cache=('full',o)
        else:
            a=o[...,3]; ys,xs=np.where(a>0)
            if len(ys)==0: cache=('none',)
            else:
                y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
                al=(a[y0:y1,x0:x1,None].astype(np.float32)/255.0); cache=('part',y0,y1,x0,x1,o[y0:y1,x0:x1,:3].astype(np.float32)*al,1-al)
    if cache[0]=='full': f=cache[1]
    elif cache[0]=='part':
        _,y0,y1,x0,x1,pre,inv=cache; f=f.copy(); f[y0:y1,x0:x1]=(f[y0:y1,x0:x1].astype(np.float32)*inv+pre+0.5).astype(np.uint8)
    if n<9: f=(f.astype(np.float32)*((n+1)/10)).astype(np.uint8)
    ff.stdin.write(f.tobytes())
    if n%600==0: print(n,flush=True)
ff.stdin.close(); ff.wait(); print('done')
