import React, { useState, useEffect } from 'react'

const G_KEY = 'gemma_api_key'
const HF_KEY = 'hf_token'
const C_KEY = 'claude_api_key'

export default function ApiKeySettings(){
  const [gemma, setGemma] = useState('')
  const [hf, setHf] = useState('')
  const [claude, setClaude] = useState('')

  useEffect(()=>{
    setGemma(localStorage.getItem(G_KEY) || '')
    setHf(localStorage.getItem(HF_KEY) || '')
    setClaude(localStorage.getItem(C_KEY) || '')
  },[])

  function save(){
    if(gemma) localStorage.setItem(G_KEY, gemma); else localStorage.removeItem(G_KEY)
    if(hf) localStorage.setItem(HF_KEY, hf); else localStorage.removeItem(HF_KEY)
    if(claude) localStorage.setItem(C_KEY, claude); else localStorage.removeItem(C_KEY)
    alert('저장되었습니다')
  }
  function clearAll(){ if(confirm('API 키를 모두 삭제합니까?')){ localStorage.removeItem(G_KEY); localStorage.removeItem(HF_KEY); localStorage.removeItem(C_KEY); setGemma(''); setHf(''); setClaude(''); alert('삭제되었습니다') } }
  function masked(s){ if(!s) return '미설정'; return s.slice(0,8) + '...' }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h3 className="text-lg font-semibold mb-3">🔑 API 키 설정</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm">Gemma 4 키</label>
          <input className="w-full p-2 border rounded mt-1" placeholder="Gemma API Key" value={gemma} onChange={e=>setGemma(e.target.value)} />
          <div className="text-xs text-gray-500 mt-1">현재: {masked(localStorage.getItem(G_KEY)||gemma)}</div>
        </div>
        <div>
          <label className="block text-sm">HuggingFace 토큰 (이미지)</label>
          <input className="w-full p-2 border rounded mt-1" placeholder="HF Token" value={hf} onChange={e=>setHf(e.target.value)} />
          <div className="text-xs text-gray-500 mt-1">현재: {masked(localStorage.getItem(HF_KEY)||hf)}</div>
        </div>
        <div>
          <label className="block text-sm">Anthropic / Claude 키</label>
          <input className="w-full p-2 border rounded mt-1" placeholder="Claude API Key" value={claude} onChange={e=>setClaude(e.target.value)} />
          <div className="text-xs text-gray-500 mt-1">현재: {masked(localStorage.getItem(C_KEY)||claude)}</div>
        </div>
        <div className="flex gap-2 mt-2">
          <button className="px-3 py-2 bg-indigo-600 text-white rounded" onClick={save}>저장</button>
          <button className="px-3 py-2 bg-red-100 text-red-700 rounded" onClick={clearAll}>전체삭제</button>
        </div>
      </div>
    </div>
  )
}
