import { useRef, useState, useEffect } from 'react';
import useStore from '../../store/useStore';
import { t } from '../../i18n/translations';

// Simulated AI essay generation
async function callAI(data) {
  await new Promise(r => setTimeout(r, 2500));
  const emotions = { '평온함':'고요한','그리움':'그리운','설렘':'설레는','쓸쓸함':'쓸쓸한','여유로움':'여유로운','행복함':'행복한','우울함':'무거운','의욕':'활기찬', 'Peaceful':'peaceful', 'Nostalgic':'nostalgic', 'Excited':'exciting' };
  const em = emotions[data.emotion] || '감성적인';
  const templates = {
    '감성 에세이': `그 순간, 시간이 잠시 멈춘 것 같았다.\n\n${data.context || '오늘의 기억'} — 이 작은 조각이 언젠가 큰 그림의 일부가 될 것이라는 걸, 나는 직감적으로 알았다.\n\n${em} 공기 속에서 나는 숨을 고르며, 지금 이 순간이 영원히 기억될 것이라 느꼈다. 모든 것이 선명하게 빛나는 순간들 — 그것이 바로 살아있다는 증거다.\n\n당신이 남긴 이 찰나의 감정은, 언젠가 당신을 다시 이 자리로 데려다 줄 것이다.`,
    '일기체': `오늘 하루를 돌아보면, 이 순간이 가장 먼저 떠오른다.\n\n${data.context || '별것 아닌 것 같지만'}, 돌이켜보면 이런 작은 순간들이 삶을 채운다는 걸 새삼 깨닫는다. ${em} 하루였지만, 마음 한구석이 따뜻하다.\n\n내일도 이런 순간들을 놓치지 않고 기록해야겠다.`,
    '브이로그': `안녕하세요! 오늘은 ${data.context || '특별한 하루'}를 함께 나눠요 🎬\n\n이곳에 오게 된 건 정말 우연이었는데, 와보니까 너무 좋더라고요! 분위기가 ${em}해서 그냥 셔터를 눌렀어요.\n\n여러분도 이런 순간 있지 않으세요? 그냥 멈추고 싶은 그 찰나요. 오늘도 좋은 기억 하나 쌓아갑니다 ✨`,
    '자서전': `그 날을 기억한다. ${data.context || '삶의 어느 지점'}에서 나는 문득 멈춰 섰다.\n\n세상은 여전히 빠르게 돌아가고 있었지만, 그 순간만큼은 ${em}게 느껴졌다. 훗날 이 기억을 꺼내볼 때, 나는 이 선택을 잘 했다고 생각할 것이다.\n\n삶이란 이렇게 한 페이지씩 쓰여지는 것이다.`,
    '편지체': `사랑하는 나에게,\n\n오늘 이 순간을 꼭 기억해둬. ${data.context || '지금 네가 느끼는 것'} — 이 감정이 ${em}더라도, 그게 바로 너야.\n\n10년 후의 나에게 이 편지가 닿을 때, 너는 분명 미소 짓게 될 거야. 지금 이 순간을 충분히 느끼고 있어. 잘하고 있어.\n\n사랑을 담아, 오늘의 나로부터`,
    '시적 산문': `기억이란 빛의 각도다.\n\n${em}—\n그 단어만으로도 가슴 한켠이 출렁인다.\n\n${data.context || '이 순간'}, 세상은 아무 말 없이\n나에게 무언가를 건넨다.\n\n나는 받는다,\n조용히,\n온전히.`,
  };
  const text = templates[data.format] || templates['감성 에세이'];
  const titles = ['빛이 머문 자리', '조용한 여백', '순간의 온도', '기억의 결', '시간이 멈춘 곳', '마음의 지도'];
  return {
    title: titles[Math.floor(Math.random() * titles.length)],
    text,
    date: new Date().toLocaleDateString('ko-KR', {year:'numeric',month:'2-digit',day:'2-digit'}).replace(/\. /g,'.').replace('.','.'),
    preview: text.slice(0,80) + '…',
  };
}

export default function CreateView() {
  const { lang, createStep, setCreateStep, createData, setCreateData, aiLoading, setAiLoading, generatedEssay, setGeneratedEssay, addEssay, setView, showToast, isPremium } = useStore();
  const tx = t(lang);
  const cr = tx.create;
  const fileRef = useRef();
  const [drag, setDrag] = useState(false);

  const steps = cr.steps || t('ko').create.steps;
  const emotions = cr.emotions || t('ko').create.emotions;
  const formats = cr.formats || t('ko').create.formats;

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setCreateData({ image: file, imagePreview: e.target.result });
    reader.readAsDataURL(file);
  };

  const [loadingIdx, setLoadingIdx] = useState(0);

  // Update loading index every second without impure render calls
  useEffect(() => {
    if (!aiLoading) return;
    const interval = setInterval(() => {
      setLoadingIdx(i => (i + 1) % 3);
    }, 1000);
    return () => clearInterval(interval);
  }, [aiLoading]);

  const generate = async () => {
    setAiLoading(true);
    setCreateStep(4);
    try {
      const result = await callAI(createData);
      setGeneratedEssay(result);
    } catch {
      showToast('오류가 발생했어요. 다시 시도해주세요.');
    }
    setAiLoading(false);
  };

  const saveEssay = () => {
    if (!generatedEssay) return;
    addEssay({
      ...generatedEssay,
      emotion: createData.emotion,
      emoji: (emotions.find(e=>e.label===createData.emotion)||{emoji:'✨'}).emoji,
      category: createData.category,
      format: createData.format,
      imagePreview: createData.imagePreview,
      imageEmoji: createData.imagePreview ? null : '📖',
      color: null,
    });
    showToast('✓ 서재에 저장되었어요!');
    setView('library');
  };

  return (
    <div className="create-wrap">
      {/* Step pills */}
      <div className="step-pills">
        {steps.map((s,i) => (
          <div key={i} className={`step-pill${createStep===i?' active':createStep>i?' done':''}`}>{i+1}. {s}</div>
        ))}
      </div>

      {/* STEP 0: PHOTO */}
      {createStep === 0 && (
        <div className="c-card">
          <h3>📸 {steps[0]}</h3>
          <p className="c-hint">{cr.upload || cr.uploadSub}</p>
          <div className={`upload-zone${drag?' drag-over':''}${createData.imagePreview?' has-file':''}`}
            onClick={() => fileRef.current.click()}
            onDragOver={e=>{e.preventDefault();setDrag(true)}}
            onDragLeave={()=>setDrag(false)}
            onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0])}}>
            {createData.imagePreview ? (
              <img src={createData.imagePreview} alt="preview" style={{maxHeight:240,borderRadius:8,objectFit:'cover'}} />
            ) : (
              <>
                <span className="upload-icon">🖼️</span>
                <div className="upload-label">{cr.upload}</div>
                <div className="upload-sub">{cr.uploadSub}</div>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>handleFile(e.target.files[0])} />

          {/* AI Image Generation — Premium only notice */}
          {!isPremium && (
            <div className="premium-notice">
              <span className="premium-notice-icon">✨</span>
              <div>
                <div className="premium-notice-title">AI 이미지 생성은 프리미엄 전용</div>
                <div className="premium-notice-desc">사진 없이도 AI가 감성적인 일러스트를 자동으로 생성해드려요. 프리미엄으로 업그레이드하면 이용 가능합니다.</div>
              </div>
              <button className="premium-notice-btn" onClick={() => {}}>업그레이드 →</button>
            </div>
          )}

          <div className="nav-btns">
            {createData.imagePreview && <button className="btn-s" onClick={()=>setCreateData({image:null,imagePreview:null})}>다시 선택</button>}
            <button className="btn-p" disabled={!createData.imagePreview} onClick={()=>setCreateStep(1)}>다음 →</button>
          </div>
        </div>
      )}

      {/* STEP 1: EMOTION */}
      {createStep === 1 && (
        <div className="c-card">
          <h3>💭 {steps[1]}</h3>
          <p className="c-hint">{cr.emo}</p>
          <div className="emo-grid">
            {emotions.map((e,i) => (
              <div key={i} className={`emo-btn${createData.emotion===e.label?' selected':''}`}
                onClick={()=>setCreateData({emotion:e.label})}>
                <span className="emo-emoji">{e.emoji}</span>
                <div className="emo-label">{e.label}</div>
              </div>
            ))}
          </div>
          <div className="nav-btns">
            <button className="btn-s" onClick={()=>setCreateStep(0)}>← 이전</button>
            <button className="btn-p" disabled={!createData.emotion} onClick={()=>setCreateStep(2)}>다음 →</button>
          </div>
        </div>
      )}

      {/* STEP 2: FORMAT */}
      {createStep === 2 && (
        <div className="c-card">
          <h3>🎨 {steps[2]}</h3>
          <p className="c-hint">{cr.fmt}</p>
          <div className="fmt-grid">
            {formats.map((f,i) => (
              <div key={i} className={`fmt-btn${createData.format===f.name?' selected':''}`}
                onClick={()=>setCreateData({format:f.name})}>
                <span className="fmt-icon">{f.icon}</span>
                <div className="fmt-name">{f.name}</div>
              </div>
            ))}
          </div>
          <div className="nav-btns">
            <button className="btn-s" onClick={()=>setCreateStep(1)}>← 이전</button>
            <button className="btn-p" disabled={!createData.format} onClick={()=>setCreateStep(3)}>다음 →</button>
          </div>
        </div>
      )}

      {/* STEP 3: CONTEXT */}
      {createStep === 3 && (
        <div className="c-card">
          <h3>📝 {steps[3]}</h3>
          <p className="c-hint">{cr.ctxLabel}</p>
          <textarea className="ctx-area" rows={4} placeholder={cr.ctxPlaceholder}
            value={createData.context}
            onChange={e=>setCreateData({context:e.target.value})} />
          <div className="ctx-tags">
            {(cr.ctxTags||t('ko').create.ctxTags).map((tag,i) => (
              <span key={i} className="ctx-tag" onClick={()=>setCreateData({context:(createData.context?createData.context+' ':'')+tag})}>{tag}</span>
            ))}
          </div>
          <div style={{marginTop:20}}>
            <div style={{fontFamily:'var(--ar-font-body)',fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--ar-text-subtle)',marginBottom:8}}>{cr.catLabel}</div>
            <div className="cat-chips">
              {(cr.cats||t('ko').create.cats).map((c,i) => (
                <span key={i} className={`chip${createData.category===c?' selected':''}`} onClick={()=>setCreateData({category:c})}>{c}</span>
              ))}
            </div>
          </div>
          {/* Summary */}
          <div style={{marginTop:20}}>
            <div style={{fontFamily:'var(--ar-font-body)',fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--ar-text-subtle)',marginBottom:8}}>{cr.summary}</div>
            <div className="summary-box">
              {[['감정',createData.emotion||'—'],['형식',createData.format||'—'],['카테고리',createData.category]].map(([k,v],i)=>(
                <div key={i} className="summary-row"><span className="s-label">{k}</span><span className="s-val">{v}</span></div>
              ))}
            </div>
          </div>
          <div className="nav-btns">
            <button className="btn-s" onClick={()=>setCreateStep(2)}>← 이전</button>
            <button className="gen-btn" onClick={generate}>{cr.generate}</button>
          </div>
        </div>
      )}

      {/* STEP 4: LOADING / RESULT */}
      {createStep === 4 && (
        aiLoading ? (
          <div className="ai-loading-box">
            <div className="ai-orb" />
            <div className="loader-txt">{(cr.loading||t('ko').create.loading)[loadingIdx]}</div>
            <div className="loader-sub">AI가 당신만의 에세이를 만들고 있어요...</div>
          </div>
        ) : generatedEssay ? (
          <div className="c-card">
            <h3>✨ {steps[4]}</h3>
            <div style={{fontFamily:'var(--ar-font-head)',fontStyle:'italic',fontSize:22,color:'var(--ar-text)',marginBottom:16,fontWeight:300}}>{generatedEssay.title}</div>
            <div style={{fontFamily:'var(--ar-font-head)',fontStyle:'italic',fontSize:15,color:'rgba(232,225,221,0.8)',lineHeight:2,whiteSpace:'pre-line',marginBottom:24,maxHeight:320,overflow:'auto'}}>{generatedEssay.text}</div>
            <div className="nav-btns" style={{justifyContent:'space-between'}}>
              <button className="btn-s" onClick={()=>{setGeneratedEssay(null);setCreateStep(3);}}>다시 생성</button>
              <button className="gen-btn" onClick={saveEssay}>서재에 저장 →</button>
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}
