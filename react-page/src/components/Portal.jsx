import React, { useEffect } from 'react'

export default function Portal({open, onClose}){
  useEffect(()=>{
    function onKey(e){ if(e.key==='Escape') onClose && onClose(); }
    if(open) document.addEventListener('keydown', onKey);
    else document.removeEventListener('keydown', onKey);
    return ()=> document.removeEventListener('keydown', onKey);
  },[open])

  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center portal-overlay" onClick={()=>onClose && onClose()}>
      <div className="portal-content" onClick={(e)=>e.stopPropagation()}>
        <div className="portal-circle" />
        <div className="portal-box">
          <h3 className="text-xl font-bold">포털</h3>
          <p className="text-sm mt-2">포털 애니메이션 샘플입니다. 클릭 또는 ESC로 닫기</p>
          <div className="mt-4">
            <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={()=>onClose && onClose()}>닫기</button>
          </div>
        </div>
      </div>
    </div>
  )
}
