import sherpa_onnx, soundfile as sf, json, numpy as np
d='models/sherpa-onnx-whisper-turbo';pre='turbo'
rec=sherpa_onnx.OfflineRecognizer.from_whisper(encoder=f'{d}/{pre}-encoder.int8.onnx',decoder=f'{d}/{pre}-decoder.int8.onnx',tokens=f'{d}/{pre}-tokens.txt',language='el',task='transcribe',num_threads=2)
x,sr=sf.read('a16.wav',dtype='float32'); x=x*8
def tr(a,b):
    s=rec.create_stream(); s.accept_waveform(sr,np.concatenate([np.zeros(int(sr*.3),dtype=np.float32),x[int(max(0,a-0.1)*sr):int((b+0.12)*sr)],np.zeros(int(sr*10),dtype=np.float32)])); rec.decode_stream(s); return s.result.text.strip()
sp=json.load(open('speech.json'))
out=[]
for a,b in sp:
    t=tr(a,b); out.append({'a':a,'b':b,'text':t}); print(f'{a:7.2f} {b:7.2f} {t}',flush=True)
json.dump(out,open('asr_fine.json','w'),ensure_ascii=False,indent=1)
print('--- probes')
for a,b in [(36.5,42.2),(38.0,41.4),(35.4,44.0),(94.6,104.4),(126.5,133.0),(17.5,23.5),(27.5,35)]:
    print(a,b,tr(a,b),flush=True)
