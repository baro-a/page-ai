import React, { useState, useEffect, useRef } from 'react'
import { loadEssays, saveEssay, updateEssay } from '../utils/storage'
import Camera from './Camera'
import WebtoonViewer from './WebtoonViewer'
import AudioRecorder from './AudioRecorder'
import EmotionChips from './EmotionChips'
import CategoryChips from './CategoryChips'
import { generateEssay } from '../services/ai'
import { compressDataUrl } from '../utils/image'
import LocationPicker from './LocationPicker'
import { parseWebtoon } from '../utils/webtoon'

export default function Editor({editingId, onSaved}){
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [image, setImage] = useState(null)
  const [audio, setAudio] = useState(null)
  const [emotion, setEmotion] = useState(null)
  const [category, setCategory] = useState('')
  const [format, setFormat] = useState('일반')
  const [isWebtoon, setIsWebtoon] = useState(false)
  const [webtoonRaw, setWebtoonRaw] = useState('')
  const [webtoonPanels, setWebtoonPanels] = useState([])
  const [loadingAi, setLoadingAi] = useState(false)

  useEffect(()=>{
    if(editingId){
      const essays = loadEssays();
      const e = essays.find(x=>x.id===editingId);
      if(e){ setTitle(e.title); setBody(e.body || ''); setImage(e.image || null); setAudio(e.audio || null); setEmotion(e.emotion || null); setCategory(e.category || ''); setFormat(e.format || '일반'); }
    } else {
      setTitle(''); setBody(''); setImage(null);
    }
  },[editingId])

  const textareaRef = useRef(null)

  async function onCapture(base64){
    // 기본적으로 캡처된 이미지는 압축
    try{ const c = await compressDataUrl(base64); setImage(c); }catch(e){ setImage(base64) }
  }

  function insertAtCursor(text){
    const ta = textareaRef.current;
    if(!ta) { setBody(prev => prev + '\n' + text); return; }
    const start = ta.selectionStart || 0;
    const end = ta.selectionEnd || 0;
    const before = body.slice(0, start);
    const after = body.slice(end);
    const next = before + text + after;
    setBody(next);
    // set cursor after inserted text
    requestAnimationFrame(()=>{
      ta.focus();
      const pos = start + text.length;
      ta.selectionStart = ta.selectionEnd = pos;
    });
  }

  function onSave(){
    if(!title && !body) return alert('제목 또는 내용을 입력하세요');
    const item = { id: editingId || Date.now().toString(), title, body, image, audio, emotion: emotion ? (emotion.emoji+' '+emotion.label) : '', category, format }
    saveEssay(item);
    onSaved && onSaved(item.id);
  }

  async function onGenerate(){
    setLoadingAi(true);
    try{
      const text = await generateEssay({title, context:body});
      setBody(prev => prev + '\n\n' + text);
    }catch(e){ alert('AI 생성 실패: '+e.message) }
    setLoadingAi(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input className="flex-1 p-2 border rounded" placeholder="제목" value={title} onChange={e=>setTitle(e.target.value)} />
        <button className="px-3 py-2 bg-indigo-600 text-white rounded" onClick={onSave}>저장</button>
        <button className="px-3 py-2 bg-gray-200 rounded" onClick={()=>{ setTitle(''); setBody(''); setImage(null); }}>초기화</button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <EmotionChips selected={emotion} onSelect={(e)=>{ setEmotion(e); insertAtCursor(e.emoji + ' ' + e.label + '\n'); }} />
          </div>
          <div className="ml-4 flex items-center gap-2">
            <CategoryChips selected={category} onSelect={(c)=>{ setCategory(c); insertAtCursor('#' + c + ' '); }} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 bg-gray-100 rounded" onClick={()=>{ const now=new Date(); insertAtCursor(now.toLocaleDateString('ko-KR',{year:'numeric',month:'long',day:'numeric'}) + ' ' + now.toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'}) + '\n'); }}>날짜 삽입</button>
          <select className="p-1 border rounded" value={format} onChange={e=>setFormat(e.target.value)}>
            <option>일반</option>
            <option>단상</option>
            <option>편지</option>
          </select>
        </div>
        <textarea ref={textareaRef} className="w-full p-3 h-48 border rounded" value={body} onChange={e=>setBody(e.target.value)} />
      </div>

      <div className="flex gap-4 items-start">
        <div>
          <div className="mb-2 font-medium">사진</div>
          {image ? (
            <img src={image} alt="preview" className="w-48 h-32 object-cover rounded shadow" />
          ) : (
            <div className="w-48 h-32 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">미리보기 없음</div>
          )}
          <div className="mt-2">
            <input type="file" accept="image/*" onChange={async (e)=>{
              const f = e.target.files?.[0];
              if(!f) return;
              const r = await new Promise((res,rej)=>{
                const fr=new FileReader(); fr.onload=() => res(fr.result); fr.onerror=rej; fr.readAsDataURL(f);
              });
              try{ const compressed = await compressDataUrl(r); setImage(compressed); }catch(err){ setImage(r); }
            }} />
          </div>
          <div className="mt-2">
            <Camera onCapture={onCapture} />
          </div>
          <div className="mt-3">
            <div className="mb-2 font-medium">오디오 녹음</div>
            <AudioRecorder onRecorded={(d)=>setAudio(d)} initialDataUrl={audio} />
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-2 font-medium">AI 도우미</div>
          <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={onGenerate} disabled={loadingAi}>{loadingAi ? '생성 중...' : 'AI로 내용 생성'}</button>
          <div className="mt-3">
            <LocationPicker onInsert={(txt)=> setBody(prev => prev + '\n' + txt)} />
          </div>
          <div className="mt-3">
            <label className="inline-flex items-center gap-2"><input type="checkbox" className="form-checkbox" checked={isWebtoon} onChange={e=>setIsWebtoon(e.target.checked)} /> 웹툰 보기 모드</label>
          </div>
          {isWebtoon && (
            <div className="mt-3">
              <div className="text-sm mb-1">웹툰 JSON 붙여넣기 (또는 패널 배열)</div>
              <textarea className="w-full p-2 border rounded h-32" value={webtoonRaw} onChange={e=>setWebtoonRaw(e.target.value)} placeholder='[ { "image":"data:...","text":"..." }, ... ]' />
              <div className="mt-2 flex gap-2">
                <button className="px-3 py-2 bg-indigo-600 text-white rounded" onClick={()=>{
                  try{
                    const panels = parseWebtoon(webtoonRaw || webtoonRaw);
                    setWebtoonPanels(panels);
                  }catch(e){ alert('웹툰 파싱 오류: '+e.message) }
                }}>파싱 및 보기</button>
                <button className="px-3 py-2 bg-gray-200 rounded" onClick={()=>{ setWebtoonRaw(''); setWebtoonPanels([]); }}>초기화</button>
              </div>
              <div className="mt-4">
                <WebtoonViewer panels={webtoonPanels} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
