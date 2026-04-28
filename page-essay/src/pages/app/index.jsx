import { useEffect } from 'react';
import useStore from '../../store/useStore';
import { t } from '../../i18n/translations';
import LibraryView from './LibraryView';
import CreateView from './CreateView';
import EssayView from './EssayView';
import PersonaView from './PersonaView';
import SettingsView from './SettingsView';

const NAV_ITEMS = [
  { view:'library', icon:'📚', label:'서재' },
  { view:'create', icon:'✍️', label:'쓰기' },
  { view:'persona', icon:'🎭', label:'페르소나' },
  { view:'settings', icon:'⚙️', label:'설정' },
];

export default function AppScreen() {
  const { view, setView, lang, essays, resetCreate, setScreen, user, logout, setLoginModalOpen } = useStore();

  // Auth guard: redirect unauthenticated users to landing and open login modal
  useEffect(() => {
    if (!user) {
      setScreen('landing');
      setLoginModalOpen(true);
    }
  }, [user, setScreen, setLoginModalOpen]);

  if (!user) return null;
  const tx = t(lang);
  const sb = tx.sidebar || {};

  const sideItems = [
    { view:'library', icon:'📚', label: sb.library || '서재' },
    { view:'create',  icon:'✍️', label: sb.create  || '새 에세이' },
    { view:'persona', icon:'🎭', label: sb.persona  || '페르소나' },
    { view:'settings',icon:'⚙️', label: sb.settings || '설정' },
  ];

  const handleNav = (v) => {
    if (v === 'create') resetCreate();
    setView(v);
  };

  const ViewMap = {
    library: <LibraryView />,
    create:  <CreateView />,
    essay:   <EssayView />,
    persona: <PersonaView />,
    settings:<SettingsView />,
  };

  return (
    <div className="app-screen">
      {/* ── Sidebar ── */}
      <div className="sidebar">
        <div className="sb-user">
          {user?.picture
            ? <img src={user.picture} alt={user.name} className="sb-user-avatar" style={{width:40,height:40,borderRadius:'50%',objectFit:'cover'}} />
            : <div className="sb-user-avatar">{user?.name?.[0] || '📖'}</div>
          }
          <div className="sb-user-name">{user?.name || '나의 서재'}</div>
          <div className="sb-user-role">Personal Archivist · {essays.length} essays</div>
        </div>

        <div className="sidebar-section">NAVIGATION</div>
        {sideItems.map(item => (
          <button key={item.view}
            className={`sidebar-item${view === item.view ? ' active' : ''}`}
            onClick={() => handleNav(item.view)}>
            <span className="icon">{item.icon}</span>
            {item.label}
          </button>
        ))}

        <div className="sidebar-section" style={{marginTop:16}}>MORE</div>
        <button className="sidebar-item" onClick={() => setScreen('landing')}>
          <span className="icon">🏠</span> 홈으로
        </button>
        <button className="sidebar-item" onClick={() => setScreen('admin')}>
          <span className="icon">🔧</span> 관리자
        </button>

        <div className="sb-bottom">
          <button className="sb-action-btn" onClick={() => handleNav('create')}>
            ✦ 새 에세이 쓰기
          </button>
          <button className="sidebar-item" style={{marginTop:8,opacity:.6,fontSize:12}} onClick={logout}>
            <span className="icon">🚪</span> 로그아웃
          </button>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="app-main">
        {ViewMap[view] || <LibraryView />}
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <div className="mobile-bottom-nav">
        {NAV_ITEMS.map(item => (
          <button key={item.view}
            className={`mbn-item${view === item.view ? ' active' : ''}`}
            onClick={() => handleNav(item.view)}>
            <span className="mbn-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
