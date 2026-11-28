import cv2, numpy as np
def make_luts():
    x=np.arange(256)/255.0
    y=np.power(x,0.95)                       # lift mids
    y=y+0.035*np.sin(2*np.pi*(y-0.5))   # gentle S (darken shadows, lift highs)
    y=np.clip(y,0,1)
    b=np.clip(y*0.985,0,1); g=y; r=np.clip(y*1.012,0,1)
    return [ (c*255+0.5).astype(np.uint8) for c in (b,g,r) ]
LUT=make_luts()
def light_mask(w=1920,h=1080,cx=950,cy=600):
    yy,xx=np.mgrid[0:h,0:w].astype(np.float32)
    d=np.sqrt(((xx-cx)/520)**2+((yy-cy)/430)**2)
    key=1+0.11*np.exp(-d*d*1.1)               # soft key light on the face
    v=np.sqrt(((xx-w/2)/(w/2))**2+((yy-h/2)/(h/2))**2)
    vig=1-0.16*np.clip(v-0.55,0,1)**1.6/0.45**1.6*0.45**1.6 # corners
    vig=1-0.20*np.clip((v-0.6)/0.8,0,1)**1.5
    return (key*vig).astype(np.float32)
MASK=None
def grade(img):
    global MASK
    if MASK is None: MASK=light_mask(img.shape[1],img.shape[0])
    den=cv2.bilateralFilter(img,5,18,3)       # light denoise, keeps edges
    f=den.astype(np.float32)*MASK[...,None]
    f=np.clip(f,0,255).astype(np.uint8)
    b,g,r=cv2.split(f); f=cv2.merge([cv2.LUT(b,LUT[0]),cv2.LUT(g,LUT[1]),cv2.LUT(r,LUT[2])])
    hsv=cv2.cvtColor(f,cv2.COLOR_BGR2HSV).astype(np.float32); hsv[...,1]=np.clip(hsv[...,1]*1.14,0,255); f=cv2.cvtColor(hsv.astype(np.uint8),cv2.COLOR_HSV2BGR)
    bl=cv2.GaussianBlur(f,(0,0),1.6); f=cv2.addWeighted(f,1.35,bl,-0.35,0)
    return f
if __name__=='__main__':
    im=cv2.imread('f20.jpg'); g=grade(im)
    # framing A crop zoom 1.2
    def fr(img,z,x0,y0):
        w=int(1920/z);h=int(1080/z); return cv2.resize(img[y0:y0+h,x0:x0+w],(1920,1080),interpolation=cv2.INTER_LANCZOS4)
    A=fr(g,1.2,145,170); C=fr(g,1.24,20,195); B=fr(g,1.3,206,205)
    s=lambda i:cv2.resize(i,(960,540))
    top=np.hstack([s(im),s(g)]); bot=np.hstack([s(A),s(C)])
    cv2.imwrite('grade_test.jpg',np.vstack([top,bot]),[cv2.IMWRITE_JPEG_QUALITY,88]); cv2.imwrite('B.jpg',s(B))
