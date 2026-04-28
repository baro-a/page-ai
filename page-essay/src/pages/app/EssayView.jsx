import { useState } from 'react';
import useStore from '../../store/useStore';
import { t } from '../../i18n/translations';

export default function EssayView() {
  const { essays, selectedEssayId, setView, deleteEssay, updateEssay, showToast, lang } = useStore();
  const tx = t(lang);
  const essay = essays.find(e => e.id === selectedEssayId);
  const [editTitle, setEditTitle] = useState(essay?.title || '');
  const [editText, setEditText] = useState(essay?.text || '');
  const [shareOpen, setShareOpen] = useState(false);

  if (!essay) {
    return (
      <div style={{textAlign:'center',padding:60}}>
        <p style={{fontFamily:'var(--ar-font-head)',fontStyle:'italic',fontSize:20,color:'var(--ar-text-dim)'}}>에세이를 찾을 수 없어요.</p>
        <button className="btn-s" style={{marginTop:16}} onClick={()=>setView('library')}>← 서재로</button>
      </div>
    );
  }

  const save = () => {
    updateEssay(selectedEssayId, { title: editTitle, text: editText, preview: editText.slice(0,80)+'…' });
    showToast('✓ 저장되었어요!');
  };

  const handleDelete = () => {
    if (!window.confirm('이 에세이를 삭제할까요?')) return;
    deleteEssay(selectedEssayId);
    showToast('삭제되었어요.');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).catch(()=>{});
    showToast('📋 링크가 복사되었어요!');
    setShareOpen(false);
  };

  const exportText = () => {
    const blob = new Blob([`${editTitle}\n\n${editText}`], { type:'text/plain' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `${editTitle}.txt`; a.click();
    showToast('📄 다운로드 시작!');
  };

  return (
    <div>
      <button className="ev-back" onClick={()=>setView('library')}>← {tx.essay?.back || '서재로'}</button>
      <div className="book-spread">
        {/* LEFT: Photo */}
        <div>
          <div className="spread-photo">
            {essay.imagePreview
              ? <img src={essay.imagePreview} alt={essay.title} />
              : <span style={{fontSize:64}}>{essay.imageEmoji || '📖'}</span>
            }
          </div>
          <div style={{marginTop:16}}>
            {essay.emoji && <div className="spread-emo-tag" style={{marginBottom:10}}>{essay.emoji} {essay.emotion}</div>}
            <div className="spread-info">
              <span>📅 {essay.date}</span>
              <span>🏷️ {essay.category}</span>
              <span>📝 {essay.format}</span>
            </div>
          </div>
        </div>
        {/* RIGHT: Text */}
        <div style={{display:'flex',flexDirection:'column'}}>
          <textarea className="essay-title-inp" value={editTitle}
            onChange={e=>setEditTitle(e.target.value)} rows={2} />
          <textarea className="essay-text-inp" value={editText}
            onChange={e=>setEditText(e.target.value)}
            style={{flex:1,minHeight:280}} />
          <div className="ev-actions">
            <button className="ev-btn ev-primary" onClick={save}>저장</button>
            <button className="ev-btn" onClick={exportText}>PDF/텍스트 내보내기</button>
            <button className="ev-btn" onClick={()=>setShareOpen(!shareOpen)}>공유</button>
            <button className="ev-btn" style={{marginLeft:'auto',color:'rgba(231,76,60,0.7)',borderColor:'rgba(231,76,60,0.3)'}}
              onClick={handleDelete}>삭제</button>
          </div>
          {shareOpen && (
            <div style={{marginTop:12,background:'var(--ar-surface-3)',border:'1px solid var(--ar-outline)',borderRadius:'var(--ar-radius-sm)',padding:16,display:'flex',gap:10,flexWrap:'wrap'}}>
              <button className="ev-btn" onClick={copyLink}>🔗 링크 복사</button>
              <button className="ev-btn" onClick={()=>{window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(editTitle)}`,'_blank');setShareOpen(false);}}>𝕏 Twitter</button>
              <button className="ev-btn" onClick={()=>{showToast('인스타그램 앱을 사용해 공유하세요!');setShareOpen(false);}}>📸 Instagram</button>
            </div>
          )}
        </div>
      </div>

      {/* Related essays */}
      <div style={{marginTop:40}}>
        <div className="re-header"><div className="re-title">같은 카테고리 에세이</div></div>
        <div className="re-grid">
          {essays.filter(e => e.category === essay.category && e.id !== essay.id).slice(0,3).map(e => (
            <div key={e.id} className="essay-card" onClick={()=>{ useStore.getState().setSelectedEssay(e.id); }}>
              <div className="ec-img" style={{background:e.color?`${e.color}22`:'var(--ar-surface-3)'}}>{e.imageEmoji||'📖'}</div>
              <div className="ec-body">
                <div className="ec-emo">{e.emoji} {e.emotion}</div>
                <div className="ec-title">{e.title}</div>
                <div className="ec-footer"><span className="ec-date">{e.date}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
