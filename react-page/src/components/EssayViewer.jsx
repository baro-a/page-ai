import React from 'react'
import { loadEssays, deleteEssay } from '../utils/storage'
import { buildEssayCanvasDataUrl } from '../utils/canvas'

export default function EssayViewer({id, onEdit, onBack}){
  const essays = loadEssays();
  const e = essays.find(x=>x.id===id);
  if(!e) return <div className="p-4 bg-white dark:bg-gray-800 rounded">에세이를 찾을 수 없습니다.</div>

  function onDelete(){ if(confirm('삭제하시겠습니까?')){ deleteEssay(id); onBack && onBack(); }}

  function downloadText(){
    const blob = new Blob([`# ${e.title}\n\n${e.body}`], {type:'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = (e.title||'essay') + '.txt'; a.click(); URL.revokeObjectURL(url);
  }

  function downloadImage(){
    // buildEssayCanvasDataUrl is async
    buildEssayCanvasDataUrl({title:e.title, body:e.body, image:e.image}).then(data=>{
      const a = document.createElement('a'); a.href = data; a.download = (e.title||'essay') + '.png'; a.click();
    }).catch(err=>{ alert('이미지 생성 실패: '+err.message) });
  }

  async function shareImage(){
    try{
      const dataUrl = await buildEssayCanvasDataUrl({title:e.title, body:e.body, image:e.image});
      if(navigator.canShare && navigator.canShare()){
        // convert to blob
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], (e.title||'essay') + '.png', { type: blob.type });
        await navigator.share({ files:[file], title: e.title, text: e.body.slice(0,200) });
        return;
      }
      // fallback: open image in new tab
      const w = window.open('about:blank','_blank');
      const img = w.document.createElement('img'); img.src = dataUrl; img.style.maxWidth='100%'; w.document.body.appendChild(img);
    }catch(err){ alert('공유 실패: '+err.message) }
  }

  function shareToX(){
    const text = `${e.title}\n\n${(e.body||'').slice(0,200)}`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }

  function shareToFacebook(){
    const pageUrl = window.location.href;
    const quote = `${e.title} - ${(e.body||'').slice(0,200)}`;
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}&quote=${encodeURIComponent(quote)}`;
    window.open(shareUrl, '_blank', 'width=600,height=500');
  }

  async function copyText(){
    try{
      await navigator.clipboard.writeText(`# ${e.title}\n\n${e.body}`);
      alert('텍스트가 복사되었습니다');
    }catch(err){ alert('클립보드 복사 실패: '+err.message) }
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{e.title}</h2>
          <div className="text-sm text-gray-500 mt-1">저장 ID: {e.id}</div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-gray-100 rounded" onClick={onBack}>뒤로</button>
          <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={()=>onEdit(id)}>편집</button>
          <button className="px-3 py-1 bg-red-100 text-red-700 rounded" onClick={onDelete}>삭제</button>
        </div>
      </div>

      {e.image && <img src={e.image} alt="essay-img" className="w-full object-cover rounded" />}

      <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">{e.body}</div>

        <div className="flex gap-2">
          <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={downloadText}>텍스트 다운로드</button>
          <button className="px-3 py-2 bg-yellow-600 text-white rounded" onClick={downloadImage}>이미지로 내보내기</button>
          <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={shareImage}>기기 공유</button>
          <button className="px-3 py-2 bg-sky-600 text-white rounded" onClick={shareToX}>트위터로</button>
          <button className="px-3 py-2 bg-fb text-white rounded" style={{background:'#1877F2'}} onClick={shareToFacebook}>페북으로</button>
          <button className="px-3 py-2 bg-gray-200 rounded" onClick={copyText}>텍스트 복사</button>
        </div>
    </div>
  )
}
