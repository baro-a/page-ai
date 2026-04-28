import { useState } from 'react';
import useStore from '../../store/useStore';
import { t } from '../../i18n/translations';

const LANGS = [{code:'ko',flag:'🇰🇷',name:'한국어'},{code:'en',flag:'🇺🇸',name:'English'},{code:'ja',flag:'🇯🇵',name:'日本語'},{code:'zh',flag:'🇨🇳',name:'中文'}];

export default function SettingsView() {
  const { lang, setLang, darkMode, toggleDarkMode, settings, saveSettings, showToast, essays } = useStore();
  const tx = t(lang);
  const [apiKey, setApiKey] = useState(settings.apiKey || '');
  const [notif, setNotif] = useState(settings.notifications);

  const save = () => {
    saveSettings({ apiKey, notifications: notif });
    showToast('✓ 설정이 저장되었어요!');
  };

  return (
    <div style={{maxWidth:600}}>
      <div className="re-header" style={{marginBottom:24}}>
        <div className="re-title">{tx.settings?.title || '설정'}</div>
      </div>

      {/* Theme */}
      <div className="settings-section">
        <h4>🎨 테마 & 언어</h4>
        <div className="settings-row">
          <span className="settings-label">다크 모드</span>
          <button className={`toggle-sw${darkMode?' on':''}`} onClick={toggleDarkMode} />
        </div>
        <div className="settings-row">
          <span className="settings-label">언어 / Language</span>
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            {LANGS.map(l => (
              <span key={l.code} className={`chip${lang===l.code?' selected':''}`} style={{padding:'5px 12px',fontSize:11}}
                onClick={()=>setLang(l.code)}>{l.flag} {l.name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="settings-section">
        <h4>📊 나의 통계</h4>
        <div className="stat-grid">
          <div className="stat-card"><div className="stat-num">{essays.length}</div><div className="stat-label">전체 에세이</div></div>
          <div className="stat-card"><div className="stat-num">{[...new Set(essays.map(e=>e.category))].length}</div><div className="stat-label">카테고리</div></div>
          <div className="stat-card"><div className="stat-num">{essays.filter(e=>e.date?.startsWith('2026')).length}</div><div className="stat-label">올해 기록</div></div>
          <div className="stat-card"><div className="stat-num">{essays.reduce((a,e)=>a+(e.text?.split(' ').length||0),0)}</div><div className="stat-label">총 단어수</div></div>
        </div>
      </div>

      {/* API */}
      <div className="settings-section">
        <h4>🤖 AI 설정</h4>
        <div className="settings-row" style={{flexDirection:'column',alignItems:'flex-start',gap:10}}>
          <span className="settings-label">{tx.settings?.apiKey || 'OpenAI API 키'}</span>
          <input type="password" value={apiKey} onChange={e=>setApiKey(e.target.value)}
            placeholder="sk-..." style={{width:'100%',background:'var(--ar-surface-3)',border:'1px solid var(--ar-outline)',borderRadius:'var(--ar-radius-sm)',color:'var(--ar-text)',padding:'10px 14px',fontFamily:'var(--ar-font-body)',fontSize:13,outline:'none'}} />
          <span style={{fontFamily:'var(--ar-font-body)',fontSize:11,color:'var(--ar-text-subtle)'}}>
            OpenAI API 키를 입력하면 실제 AI가 에세이를 생성합니다 (없으면 시뮬레이션)
          </span>
        </div>
        <div className="settings-row">
          <span className="settings-label">알림</span>
          <button className={`toggle-sw${notif?' on':''}`} onClick={()=>setNotif(!notif)} />
        </div>
      </div>

      {/* Data */}
      <div className="settings-section">
        <h4>💾 데이터</h4>
        <div className="settings-row">
          <span className="settings-label">저장 공간</span>
          <span className="settings-value">브라우저 로컬</span>
        </div>
        <div className="settings-row">
          <span className="settings-label">데이터 내보내기</span>
          <button className="ev-btn" style={{fontSize:11,padding:'6px 14px'}} onClick={()=>{
            const blob = new Blob([JSON.stringify(essays, null, 2)], {type:'application/json'});
            const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
            a.download = 'page-essays.json'; a.click();
            showToast('📦 내보내기 완료!');
          }}>JSON 내보내기</button>
        </div>
      </div>

      <button className="gen-btn" style={{marginTop:8}} onClick={save}>✓ 저장</button>
    </div>
  );
}
