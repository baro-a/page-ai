import React from 'react'

const DEFAULT_CATS = ['일상','여행','기억','사건','생각','감상']

export default function CategoryChips({selected, onSelect, options}){
  const opts = options || DEFAULT_CATS
  return (
    <div className="flex gap-2 flex-wrap">
      {opts.map(o=> (
        <button key={o} onClick={()=>onSelect(o)} className={`px-2 py-1 rounded-md border ${selected===o? 'bg-indigo-100 border-indigo-400':'bg-white dark:bg-gray-800'}`}>
          {o}
        </button>
      ))}
    </div>
  )
}
