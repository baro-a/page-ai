import { useState } from 'react';
import useStore from '../../store/useStore';
import { t } from '../../i18n/translations';

const BOOK_COLORS = ['#c8a84a','#8338ec','#f77f00','#4cc9f0','#2d6a4f','#e63946','#457b9d','#6d6875'];
const BOOK_HEIGHTS = [...Array(12)].map(() => 60 + Math.random() * 30);

export default function LibraryView() {
  const { essays, setSelectedEssay, setView, lang, resetCreate } = useStore();
  const tx = t(lang);
  const [sortBy, setSortBy] = useState('all');

  const cats = ['all', ...[...new Set(essays.map(e => e.category))]];
  const filtered = sortBy === 'all' ? essays : essays.filter(e => e.category === sortBy);

  return (
    <div>
      {/* Header */}
      <div className="lib-header">
        <div className="lib-title">
          {tx.library.title}
          <small>{tx.library.subtitle}</small>
        </div>
        <div className="lib-actions">
          <button className="nbtn ghost-d" onClick={() => { resetCreate(); setView('create'); }}>
            {tx.library.newEssay}
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:24}}>
        {cats.map(c => (
          <button key={c} className={`chip${sortBy===c?' selected':''}`}
            onClick={() => setSortBy(c)}>
            {c === 'all' ? '전체' : c}
          </button>
        ))}
      </div>

      {/* Bookshelf visual */}
      <div className="bookshelf">
        <div style={{fontFamily:'var(--ar-font-body)',fontSize:10,fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'var(--ar-text-subtle)',marginBottom:8}}>BOOKSHELF</div>
        <div className="shelf-books">
          {essays.slice(0,12).map((e, i) => (
            <div key={e.id} className="shelf-book" title={e.title}
              style={{ background:BOOK_COLORS[i%BOOK_COLORS.length], '--h':`${BOOK_HEIGHTS[i]}px` }}
              onClick={() => setSelectedEssay(e.id)} />
          ))}
          {essays.length === 0 && (
            <div style={{fontFamily:'var(--ar-font-body)',fontSize:12,color:'var(--ar-text-subtle)',padding:'16px 0'}}>아직 없어요</div>
          )}
        </div>
        <div className="shelf-line" />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{textAlign:'center',padding:60}}>
          <div style={{fontSize:48,marginBottom:16}}>📚</div>
          <p style={{fontFamily:'var(--ar-font-head)',fontStyle:'italic',fontSize:20,color:'var(--ar-text-dim)',whiteSpace:'pre-line'}}>{tx.library.empty}</p>
          <button className="cta-primary" style={{marginTop:24}} onClick={() => { resetCreate(); setView('create'); }}>
            + 첫 에세이 쓰기
          </button>
        </div>
      ) : (
        <div className="re-grid">
          {filtered.map(essay => (
            <div key={essay.id} className="essay-card" onClick={() => setSelectedEssay(essay.id)}>
              <div className="ec-img" style={{background:essay.color ? `${essay.color}22` : 'var(--ar-surface-3)'}}>
                {essay.imagePreview
                  ? <img src={essay.imagePreview} alt={essay.title} />
                  : <span style={{fontSize:52}}>{essay.imageEmoji || '📖'}</span>
                }
              </div>
              <div className="ec-body">
                <div className="ec-emo">{essay.emoji} {essay.emotion}</div>
                <div className="ec-title">{essay.title}</div>
                <div className="ec-preview">{essay.preview}</div>
                <div className="ec-footer">
                  <span className="ec-date">{essay.date}</span>
                  <span className="ec-cat">{essay.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Archivist suggest */}
      <div className="archivist-suggest">
        <div className="archivist-suggest-icon">✦</div>
        <div className="archivist-suggest-text">
          <h4>The Archivist</h4>
          <p>오늘은 <em>어떤 순간</em>을 기록해보시겠어요? 당신의 이야기를 기다리고 있어요.</p>
        </div>
        <button className="archivist-suggest-btn" onClick={() => { resetCreate(); setView('create'); }}>
          새 에세이 쓰기
        </button>
      </div>
    </div>
  );
}
