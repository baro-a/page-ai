import React, { useRef, useState } from 'react'

export default function Camera({onCapture}){
  const videoRef = useRef(null)
  const [streaming, setStreaming] = useState(false)
  const [stream, setStream] = useState(null)

  async function start(){
    try{
      const s = await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'}, audio:false});
      videoRef.current.srcObject = s;
      await videoRef.current.play();
      setStream(s); setStreaming(true);
    }catch(e){ alert('카메라 접근 실패: '+e.message) }
  }

  function stop(){
    if(stream){ stream.getTracks().forEach(t=>t.stop()); setStream(null); }
    setStreaming(false);
  }

  function capture(){
    const v = videoRef.current;
    if(!v) return;
    const c = document.createElement('canvas');
    c.width = v.videoWidth || 640; c.height = v.videoHeight || 480;
    const ctx = c.getContext('2d'); ctx.drawImage(v,0,0,c.width,c.height);
    const data = c.toDataURL('image/jpeg', 0.8);
    onCapture && onCapture(data);
  }

  return (
    <div>
      {!streaming ? (
        <button className="px-3 py-2 bg-gray-800 text-white rounded" onClick={start}>카메라 켜기</button>
      ) : (
        <div className="space-y-2">
          <video ref={videoRef} className="w-48 h-32 bg-black rounded" playsInline />
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={capture}>촬영</button>
            <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={stop}>끄기</button>
          </div>
        </div>
      )}
    </div>
  )
}
