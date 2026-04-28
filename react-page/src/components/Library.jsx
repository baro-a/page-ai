import React, { useState, useMemo } from 'react'
import { loadEssays, deleteEssay } from '../utils/storage'

export default function Library({onEdit, onView}){
  const essays = loadEssays();
  const [query, setQuery] = useState('')
  const [catFilter, setCatFilter] = useState('')

  const categories = useMemo(()=>{
    const s = new Set();
    essays.forEach(e=>{ if(e.category) s.add(e.category) });
    return Array.from(s);
  }, [essays]);

  const filtered = essays.filter(e=>{
    if(catFilter && (!e.category || e.category !== catFilter)) return false;
    if(query){
      const q = query.toLowerCase();
      return (e.title||'').toLowerCase().includes(q) || (e.body||'').toLowerCase().includes(q) || (e.category||'').toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">서재</h3>
          <span className="text-sm text-gray-500">총 {essays.length}편</span>
        </div>

        <div className="mt-3 flex gap-2">
          <input className="flex-1 p-2 border rounded" placeholder="검색 (제목/내용/카테고리)" value={query} onChange={e=>setQuery(e.target.value)} />
          <select className="p-2 border rounded" value={catFilter} onChange={e=>setCatFilter(e.target.value)}>
            <option value=''>전체 카테고리</option>
            {categories.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="px-3 py-2 bg-gray-100 rounded" onClick={()=>{ setQuery(''); setCatFilter(''); }}>초기화</button>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length===0 && <div className="text-sm text-gray-500">검색 결과가 없습니다.</div>}
        {filtered.map(e=> (
          <div key={e.id} className="p-3 border rounded flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="font-medium">{e.title}</div>
                {e.emotion && <div className="text-sm text-yellow-600">{e.emotion}</div>}
                {e.category && <div className="text-xs text-gray-500 px-2 py-1 border rounded">#{e.category}</div>}
              </div>
              <div className="text-sm text-gray-600 mt-2">{(e.body||'').slice(0,120)}</div>
            </div>
            <div className="flex gap-2">
              <button className="px-2 py-1 bg-blue-600 text-white rounded" onClick={()=>onView?.(e.id)}>보기</button>
              <button className="px-2 py-1 bg-indigo-600 text-white rounded" onClick={()=>onEdit(e.id)}>편집</button>
              <button className="px-2 py-1 bg-red-100 text-red-700 rounded" onClick={()=>{ if(confirm('삭제하시겠습니까?')){ deleteEssay(e.id); window.location.reload(); } }}>삭제</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
