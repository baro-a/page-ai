import React from 'react'

export default function WebtoonViewer({panels}){
  if(!panels || panels.length===0) return <div className="text-sm text-gray-500">웹툰 패널이 없습니다.</div>
  return (
    <div className="space-y-6">
      {panels.map((p, i)=> (
        <div key={i} className="bg-white dark:bg-gray-800 p-3 rounded shadow">
          {p.image ? <img src={p.image} alt={`panel-${i}`} className="w-full object-cover rounded mb-2" /> : null}
          {p.text ? <div className="text-sm text-gray-700 dark:text-gray-300">{p.text}</div> : null}
        </div>
      ))}
    </div>
  )
}
