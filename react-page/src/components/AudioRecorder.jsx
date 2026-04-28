import React, { useState, useRef } from 'react'

export default function AudioRecorder({onRecorded, initialDataUrl}){
  const [recording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState(initialDataUrl || '')
  const mediaRef = useRef(null)
  const chunksRef = useRef([])
  const recorderRef = useRef(null)

  async function start(){
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
      return alert('이 브라우저는 녹음을 지원하지 않습니다');
    }
    try{
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      recorderRef.current = new MediaRecorder(stream)
      chunksRef.current = []
      recorderRef.current.ondataavailable = e => { if(e.data && e.data.size) chunksRef.current.push(e.data) }
      recorderRef.current.onstop = async ()=>{
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        // convert to data URL
        const reader = new FileReader()
        reader.onload = ()=>{
          const dataUrl = reader.result
          setAudioUrl(dataUrl)
          onRecorded && onRecorded(dataUrl)
        }
        reader.readAsDataURL(blob)
        // stop tracks
        stream.getTracks().forEach(t=>t.stop())
      }
      recorderRef.current.start()
      setRecording(true)
    }catch(e){ alert('녹음 실패: '+e.message) }
  }

  function stop(){
    if(recorderRef.current && recorderRef.current.state !== 'inactive'){
      recorderRef.current.stop()
      setRecording(false)
    }
  }

  function clear(){
    setAudioUrl('')
    onRecorded && onRecorded('')
  }

  return (
    <div className="p-2 border rounded bg-white dark:bg-gray-800">
      <div className="flex items-center gap-2">
        {!recording ? (
          <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={start}>녹음 시작</button>
        ) : (
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={stop}>녹음 중지</button>
        )}
        <button className="px-3 py-1 bg-gray-100 rounded" onClick={clear}>삭제</button>
      </div>
      {audioUrl && (
        <div className="mt-2">
          <audio controls src={audioUrl}></audio>
        </div>
      )}
    </div>
  )
}
