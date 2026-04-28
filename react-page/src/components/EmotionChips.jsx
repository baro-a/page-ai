import React from 'react'

const DEFAULTS = [
  {emoji:'😊', label:'기쁨'},
  {emoji:'😢', label:'슬픔'},
  {emoji:'😡', label:'분노'},
  {emoji:'🤔', label:'생각'},
  {emoji:'❤️', label:'사랑'},
  {emoji:'✍️', label:'기록'}
]

export default function EmotionChips({selected, onSelect, options}){
  const opts = options || DEFAULTS
  return (
    <div className="flex gap-2 flex-wrap">
      {opts.map(o=> (
        <button key={o.label} onClick={()=>onSelect(o)} className={`px-2 py-1 rounded-md border ${selected?.label===o.label? 'bg-yellow-100 border-yellow-400':'bg-white dark:bg-gray-800'}`}>
          <span className="mr-1">{o.emoji}</span>{o.label}
        </button>
      ))}
    </div>
  )
}
