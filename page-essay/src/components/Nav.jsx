import { useState } from 'react';
import useStore from '../store/useStore';
import { t } from '../i18n/translations';

const LANGS = [
  { code:'ko', flag:'🇰🇷', name:'한국어' },
  { code:'en', flag:'🇺🇸', name:'English' },
  { code:'ja', flag:'🇯🇵', name:'日本語' },
  { code:'zh', flag:'🇨🇳', name:'中文' },
];

export default function Nav() {
  const { setScreen, lang, setLang, langOpen, setLangOpen, setPortalOpen, setView, user, logout, setLoginModalOpen } = useStore();
  const tx = t(lang);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const triggerPortal = () => {
    if (!user) { setLoginModalOpen(true); return; }
    setPortalOpen(true);
    setTimeout(() => {
      setPortalOpen(false);
      setScreen('app');
      setView('create');
    }, 1800);
  };

  const handleLibrary = () => {
    if (!user) { setLoginModalOpen(true); return; }
    setScreen('app');
    setView('library');
  };

  const curLang = LANGS.find(l => l.code === lang) || LANGS[0];

  return (
    <nav className="nav">
      <div className="nav-logo" onClick={() => setScreen('landing')}>Page</div>
      <div className="nav-links">
        <button className="nbtn ghost-d" onClick={() => setScreen('landing')}>{tx.nav.intro}</button>
        <button className="nbtn ghost-d" onClick={handleLibrary}>{tx.nav.library}</button>
        <button className="nbtn ghost-d" onClick={() => setScreen('admin')}>{tx.nav.admin}</button>
        <button className="nbtn solid" onClick={triggerPortal}>{tx.nav.write}</button>
        {/* Lang */}
        <div className="lang-wrap">
          <button className="lang-btn" onClick={() => setLangOpen(!langOpen)}>
            <span>{curLang.flag}</span>
            <span>{curLang.name}</span>
            <span style={{fontSize:10,opacity:.6}}>▾</span>
          </button>
          <div className={`lang-dropdown${langOpen ? ' open' : ''}`}>
            {LANGS.map(l => (
              <button key={l.code} className={`lang-option${lang === l.code ? ' active' : ''}`}
                onClick={() => { setLang(l.code); setLangOpen(false); }}>
                <span>{l.flag}</span> {l.name}
              </button>
            ))}
          </div>
        </div>
        {/* Auth */}
        {user ? (
          <div className="user-wrap" style={{position:'relative'}}>
            <button className="user-avatar-btn" onClick={() => setUserMenuOpen(v => !v)}>
              {user.picture
                ? <img src={user.picture} alt={user.name} style={{width:32,height:32,borderRadius:'50%',objectFit:'cover'}} />
                : <span style={{width:32,height:32,borderRadius:'50%',background:'var(--ar-gold)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700}}>{user.name?.[0]}</span>
              }
            </button>
            {userMenuOpen && (
              <div className="user-menu" onClick={() => setUserMenuOpen(false)}>
                <div className="user-menu-info">
                  <div style={{fontWeight:600,fontSize:13}}>{user.name}</div>
                  <div style={{fontSize:11,opacity:.6}}>{user.email}</div>
                </div>
                <button className="user-menu-item" onClick={() => { setScreen('app'); setView('library'); }}>📚 내 서재</button>
                <button className="user-menu-item" onClick={logout}>로그아웃</button>
              </div>
            )}
          </div>
        ) : (
          <button className="nbtn ghost-d login-btn" onClick={() => setLoginModalOpen(true)}>
            <span style={{marginRight:4}}>👤</span> 로그인
          </button>
        )}
      </div>
    </nav>
  );
}
