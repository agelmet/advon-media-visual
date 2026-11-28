import sherpa_onnx, soundfile as sf, json, sys, numpy as np
name=sys.argv[1]; d=sys.argv[2]; pre=sys.argv[3]
rec=sherpa_onnx.OfflineRecognizer.from_whisper(encoder=f'{d}/{pre}-encoder.int8.onnx',decoder=f'{d}/{pre}-decoder.int8.onnx',tokens=f'{d}/{pre}-tokens.txt',language='el',task='transcribe',num_threads=2)
x,sr=sf.read('a16.wav',dtype='float32'); x=x*8  # quiet recording
sp=json.load(open('speech.json'))
# chunks: join runs until >9s, split at next gap
ch=[];cur=[sp[0][0],sp[0][1]]
for a,b in sp[1:]:
    if b-cur[0]>7 or (a-cur[1]>=0.22 and cur[1]-cur[0]>2.5): ch.append(cur);cur=[a,b]
    else: cur[1]=b
ch.append(cur)
out=[]
for a,b in ch:
    s=rec.create_stream(); s.accept_waveform(sr,np.concatenate([x[int(max(0,a-0.15)*sr):int((b+0.2)*sr)],np.zeros(int(sr*14),dtype=np.float32)])); rec.decode_stream(s)
    r=s.result; out.append({'a':a,'b':b,'text':r.text.strip()})
    print(f'{a:7.2f} {b:7.2f}  {r.text.strip()}',flush=True)
json.dump(out,open(f'asr_{name}.json','w'),ensure_ascii=False,indent=1)
