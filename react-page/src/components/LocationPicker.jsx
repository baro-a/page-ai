import React, { useState, useEffect } from 'react'
import { requestLocation, getSavedLocation } from '../utils/location'

export default function LocationPicker({onInsert}){
  const [loc, setLoc] = useState(getSavedLocation().label || '')
  const [status, setStatus] = useState('')

  useEffect(()=>{
    const s = getSavedLocation(); if(s.label) setLoc(s.label);
  },[])

  async function fetchLoc(){
    setStatus('위치 가져오는 중...');
    try{
      const r = await requestLocation(); setLoc(r.label); setStatus('저장됨: '+r.label);
      setTimeout(()=>setStatus(''), 2000);
    }catch(e){ setStatus('오류: '+e.message); setTimeout(()=>setStatus(''),2000); }
  }

  function insert(){
    if(!loc) return alert('저장된 위치가 없습니다');
    onInsert && onInsert('장소: ' + loc + '\n');
  }

  return (
    <div className="p-3 bg-white dark:bg-gray-800 rounded shadow">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">현재 저장된 위치</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{loc || '없음'}</div>
        </div>
        <div className="flex flex-col gap-2">
          <button className="px-3 py-2 bg-indigo-600 text-white rounded" onClick={fetchLoc}>위치 저장</button>
          <button className="px-3 py-2 bg-gray-100 rounded" onClick={insert}>본문에 삽입</button>
        </div>
      </div>
      {status && <div className="mt-2 text-xs text-gray-500">{status}</div>}
    </div>
  )
}
