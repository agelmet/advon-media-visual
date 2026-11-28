import cv2,sys,numpy as np
cap=cv2.VideoCapture('base.mp4'); out=[]
for t in sys.argv[1:]:
    T=float(t)-0.35; cap.set(cv2.CAP_PROP_POS_FRAMES,int(T*30)); ok,f=cap.read()
    o=cv2.imread(f'st/o_{t}.png',cv2.IMREAD_UNCHANGED); a=(o[...,3:4]/255.0 if o.shape[2]==4 else 1.0); c=(f*(1-a)+o[...,:3]*a).astype(np.uint8)
    cv2.imwrite(f'st/c_{t}.jpg',c,[cv2.IMWRITE_JPEG_QUALITY,90]); out.append(cv2.resize(c,(960,540)))
for i in range(0,len(out),6):
    grp=out[i:i+6]
    while len(grp)<6: grp.append(np.zeros_like(out[0]))
    cv2.imwrite(f'st/sheet{i//6}.jpg',np.vstack([np.hstack(grp[0:2]),np.hstack(grp[2:4]),np.hstack(grp[4:6])]),[cv2.IMWRITE_JPEG_QUALITY,85])
