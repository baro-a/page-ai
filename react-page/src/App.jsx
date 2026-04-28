import React, { useState } from 'react'
import Hero from './components/Hero'
import Editor from './components/Editor'
import Library from './components/Library'
import ApiKeySettings from './components/ApiKeySettings'
import PageEssay from './pages/PageEssay'
import Portal from './components/Portal'
import EssayViewer from './components/EssayViewer'

export default function App(){
  const [view, setView] = useState('home') // home | write | library | demo
  const [editingId, setEditingId] = useState(null)
  const [portalOpen, setPortalOpen] = useState(false)

  function startCreate(arg){
    if(arg === 'openPortal'){ setPortalOpen(true); return }
    setEditingId(null); setView('write')
  }
  function openEdit(id){ setEditingId(id); setView('write') }
  function openView(id){ setEditingId(id); setView('view') }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="max-w-4xl mx-auto p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Page — React 샘플</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">원본 파일은 보존됩니다. 원하는 기능을 옮겨보세요.</p>
        </div>
        <nav className="flex gap-2">
          <button className="px-3 py-1 rounded bg-white" onClick={()=>setView('home')}>홈</button>
          <button className="px-3 py-1 rounded bg-indigo-600 text-white" onClick={()=>startCreate()}>작성</button>
          <button className="px-3 py-1 rounded bg-gray-100" onClick={()=>setView('library')}>서재</button>
          <button className="px-3 py-1 rounded bg-transparent" onClick={()=>setView('demo')}>Demo</button>
          <button className="px-3 py-1 rounded bg-gray-50" onClick={()=>setView('settings')}>설정</button>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {view==='home' && <Hero onCreate={startCreate} />}
        {view==='write' && <Editor editingId={editingId} onSaved={(id)=>{ setView('library'); setEditingId(null); }} />}
        {view==='library' && <Library onEdit={openEdit} onView={openView} />}
        {view==='view' && <EssayViewer id={editingId} onEdit={openEdit} onBack={()=>setView('library')} />}
        {view==='demo' && <PageEssay />}
        {view==='settings' && <ApiKeySettings />}
      </main>
      <Portal open={portalOpen} onClose={()=>setPortalOpen(false)} />
    </div>
  )
}
