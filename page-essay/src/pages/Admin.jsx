import useStore from '../store/useStore';

const STATS = [
  { num:'2,847', label:'총 에세이' },
  { num:'1,203', label:'활성 유저' },
  { num:'98.3%', label:'AI 성공률' },
  { num:'4.9★', label:'평균 평점' },
];

const FAKE_USERS = [
  { name:'김민수', email:'minsu@example.com', plan:'프리미엄', essays:24, joined:'2026.01.15' },
  { name:'이지은', email:'jieun@example.com', plan:'프로', essays:87, joined:'2026.02.03' },
  { name:'박서준', email:'seojun@example.com', plan:'무료', essays:5, joined:'2026.03.20' },
  { name:'최유나', email:'yuna@example.com', plan:'프리미엄', essays:41, joined:'2026.03.28' },
  { name:'정하늘', email:'haneul@example.com', plan:'프로', essays:132, joined:'2026.01.05' },
];

export default function Admin() {
  const { setScreen, essays } = useStore();

  return (
    <div className="app-screen">
      {/* Admin Sidebar */}
      <div className="sidebar">
        <div className="sb-user">
          <div className="sb-user-avatar">🔧</div>
          <div className="sb-user-name">관리자</div>
          <div className="sb-user-role">Page Admin Dashboard</div>
        </div>
        <div className="sidebar-section">ADMIN</div>
        {['대시보드','사용자 관리','에세이 관리','AI 설정','수익 분석'].map((l,i) => (
          <button key={i} className={`sidebar-item${i===0?' active':''}`}>
            <span className="icon">{['📊','👥','📝','🤖','💰'][i]}</span>{l}
          </button>
        ))}
        <div className="sb-bottom">
          <button className="sb-action-btn" onClick={()=>setScreen('landing')}>← 홈으로</button>
        </div>
      </div>

      {/* Admin Main */}
      <div className="app-main">
        <div className="re-header" style={{marginBottom:24}}>
          <div className="re-title">관리자 대시보드</div>
          <span style={{fontFamily:'var(--ar-font-body)',fontSize:11,color:'var(--ar-text-subtle)'}}>
            마지막 업데이트: {new Date().toLocaleString('ko-KR')}
          </span>
        </div>

        {/* Stats */}
        <div className="admin-section">
          <h3>📊 전체 현황</h3>
          <div className="stat-grid">
            {[...STATS, { num:essays.length+2847, label:'총 에세이(실시간)' }].map((s,i) => (
              <div key={i} className="stat-card">
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Users table */}
        <div className="admin-section">
          <h3>👥 최근 사용자</h3>
          <table className="utbl">
            <thead>
              <tr>
                <th>이름</th><th>이메일</th><th>플랜</th><th>에세이</th><th>가입일</th><th>관리</th>
              </tr>
            </thead>
            <tbody>
              {FAKE_USERS.map((u,i) => (
                <tr key={i}>
                  <td style={{color:'var(--ar-text)'}}>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span style={{
                      padding:'3px 10px',borderRadius:100,fontSize:10,fontWeight:700,
                      background:u.plan==='프로'?'rgba(243,190,85,0.15)':u.plan==='프리미엄'?'rgba(76,175,80,0.15)':'rgba(232,225,221,0.08)',
                      color:u.plan==='프로'?'var(--ar-gold)':u.plan==='프리미엄'?'#81C784':'var(--ar-text-subtle)',
                      border:`1px solid ${u.plan==='프로'?'var(--ar-gold-border)':'rgba(232,225,221,0.1)'}`,
                    }}>{u.plan}</span>
                  </td>
                  <td>{u.essays}</td>
                  <td>{u.joined}</td>
                  <td>
                    <button className="ev-btn" style={{fontSize:10,padding:'4px 12px'}}>편집</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Settings */}
        <div className="admin-section">
          <h3>🤖 AI 사용 현황</h3>
          <div className="stat-grid">
            <div className="stat-card"><div className="stat-num">GPT-4o</div><div className="stat-label">활성 모델</div></div>
            <div className="stat-card"><div className="stat-num">$48.20</div><div className="stat-label">이번달 API 비용</div></div>
            <div className="stat-card"><div className="stat-num">12,430</div><div className="stat-label">토큰 사용량</div></div>
            <div className="stat-card"><div className="stat-num">2.3s</div><div className="stat-label">평균 응답시간</div></div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="admin-section">
          <h3>⚡ 빠른 작업</h3>
          <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            {['캐시 초기화','DB 백업','알림 발송','AI 모델 변경','구독 관리'].map((a,i)=>(
              <button key={i} className="ev-btn" style={{padding:'10px 20px'}} onClick={()=>alert(`"${a}" 기능은 실제 백엔드 연동이 필요합니다.`)}>{a}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
