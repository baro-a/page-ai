import useStore from '../../store/useStore';
import { t } from '../../i18n/translations';

export default function PersonaView() {
  const { activePersona, setActivePersona, lang, showToast } = useStore();
  const tx = t(lang);
  const personas = tx.personas || t('ko').personas;

  return (
    <div className="persona-wrap">
      <div className="re-header">
        <div className="re-title">글쓰기 페르소나</div>
      </div>
      <p style={{fontFamily:'var(--ar-font-body)',fontSize:13,color:'var(--ar-text-dim)',marginBottom:24,lineHeight:1.7}}>
        AI가 에세이를 생성할 때 사용할 글쓰기 스타일을 선택해주세요.
      </p>
      {personas.map((p, i) => (
        <div key={i} className={`p-item${activePersona===i?' active':''}`} onClick={()=>{setActivePersona(i);showToast(`✓ "${p.name}" 페르소나가 선택되었어요`);}}>
          <div>
            <h4>{p.name}</h4>
            <p>{p.desc}</p>
          </div>
          <div className={`p-badge${activePersona===i?' active':''}`}>
            {activePersona===i ? '✓ 사용중' : '선택'}
          </div>
        </div>
      ))}
      {/* Persona preview */}
      {personas[activePersona] && (
        <div style={{marginTop:24,background:'var(--ar-surface-2)',border:'1px solid var(--ar-gold-border)',borderRadius:'var(--ar-radius)',padding:24}}>
          <div style={{fontFamily:'var(--ar-font-body)',fontSize:10,fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'var(--ar-gold)',marginBottom:12}}>미리보기</div>
          <div style={{fontFamily:'var(--ar-font-head)',fontStyle:'italic',fontSize:15,color:'var(--ar-text-dim)',lineHeight:2}}>
            {[
              '빗소리가 창을 두드리는 오후, 나는 낡은 카페의 구석 자리에 앉아 김이 오르는 아메리카노를 감싸 쥐었다.',
              '오늘 카페에 갔다. 비가 왔다. 커피를 마셨다. 이런 날이 좋다.',
              '안녕! 오늘은 비 오는 카페에서 글을 써봤어요. 분위기 너무 좋지 않나요? ☔',
              '그 날의 기억은 빗소리와 함께 시작된다. 커피 한 잔을 손에 쥐고 앉아, 나는 시간의 흐름을 생각했다.',
            ][activePersona]}
          </div>
        </div>
      )}
    </div>
  );
}
