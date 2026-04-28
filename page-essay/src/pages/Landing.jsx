import useStore from '../store/useStore';
import { t } from '../i18n/translations';

const BOOKS = ['📖','📕','📗','📘','📙','📓','📔','📒','📃','📜'];

// Pre-compute deterministic random values at module level for static animations
const MOTES = [...Array(18)].map((_,i) => ({
  top: `${10 + Math.random()*80}%`, left: `${5 + Math.random()*90}%`,
  dur: `${5+Math.random()*6}s`, delay: `${Math.random()*4}s`, id: i,
}));
const FLYING = [...Array(8)].map((_,i) => ({
  emoji: BOOKS[Math.floor(Math.random()*BOOKS.length)],
  top: `${15 + Math.random()*60}%`, left: `${10 + Math.random()*80}%`,
  rot: `${(Math.random()-0.5)*30}deg`,
  sz: `${28 + Math.random()*24}px`,
  dur: `${3.5 + Math.random()*3}s`,
  delay: `${Math.random()*3}s`,
  id: i,
}));

// Pre-computed SVG stars and animate values
const STAR_DOTS = [...Array(40)].map((_,i) => ({
  id: i,
  cx: `${Math.random()*100}%`,
  cy: `${Math.random()*100}%`,
  r: Math.random() < 0.3 ? 1.5 : 0.8,
  fill: `rgba(243,190,85,${0.2+Math.random()*0.5})`,
  animValues: `${0.2+Math.random()*0.3};${0.6+Math.random()*0.4};${0.2+Math.random()*0.3}`,
  animDur: `${2+Math.random()*4}s`,
}));

export default function Landing() {
  const { setScreen, setView, lang, setPortalOpen } = useStore();
  const tx = t(lang);

  const triggerPortal = () => {
    setPortalOpen(true);
    setTimeout(() => { setPortalOpen(false); setScreen('app'); setView('create'); }, 1800);
  };

  return (
    <div id="landing">
      {/* HERO */}
      <section className="hero">
        <div className="hero-overlay" />
        {/* Flying books */}
        {FLYING.map(b => (
          <div key={b.id} className="flying-book" style={{ top:b.top, left:b.left, '--rot':b.rot, '--sz':b.sz, '--dur':b.dur, '--delay':b.delay }}>
            {b.emoji}
          </div>
        ))}
        {/* Dust motes */}
        {MOTES.map(m => (
          <div key={m.id} className="mote" style={{ top:m.top, left:m.left, '--dur':m.dur, '--delay':m.delay }} />
        ))}
        {/* SVG stars */}
        <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:2}} aria-hidden>
          {STAR_DOTS.map(s => (
            <circle key={s.id} cx={s.cx} cy={s.cy} r={s.r} fill={s.fill}>
              <animate attributeName="opacity" values={s.animValues} dur={s.animDur} repeatCount="indefinite"/>
            </circle>
          ))}
        </svg>

        <div className="hero-content">
          <div className="hero-eyebrow">{tx.hero.badge}</div>
          <h1 className="hero-title">
            {tx.hero.t1}<br/>
            <em>{tx.hero.t2}</em><br/>
            {tx.hero.t3}
          </h1>
          <p className="hero-sub" style={{whiteSpace:'pre-line'}}>{tx.hero.sub}</p>
          <div className="hero-cta">
            <button className="cta-primary" onClick={triggerPortal}>{tx.hero.cta1}</button>
            <button className="cta-secondary" onClick={() => { setScreen('app'); setView('library'); }}>
              {tx.hero.cta2}
            </button>
          </div>
        </div>
        <div className="hero-scroll" onClick={() => document.getElementById('features')?.scrollIntoView({behavior:'smooth'})}>
          <div className="scroll-line"/>
          <span>SCROLL</span>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="section" style={{background:'var(--ar-surface)'}}>
        <div className="sec-label">{tx.features.label}</div>
        <h2 className="sec-title" style={{whiteSpace:'pre-line'}}>{tx.features.title}</h2>
        <p className="sec-sub">{tx.features.sub}</p>
        <div className="feat-grid">
          {(tx.features.cards.length ? tx.features.cards : t('ko').features.cards).map((c,i) => (
            <div key={i} className="feat-card">
              <span className="feat-icon">{c.icon}</span>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW */}
      <section className="section" style={{background:'linear-gradient(to bottom,var(--ar-bg),var(--ar-surface))'}}>
        <div className="sec-label">{tx.how.label}</div>
        <h2 className="sec-title">{tx.how.title}</h2>
        <div className="steps">
          {(tx.how.steps.length ? tx.how.steps : t('ko').how.steps).map((s,i) => (
            <div key={i} className="step">
              <div className="step-num">{s.icon}</div>
              <h4>{s.title}</h4>
              <p style={{whiteSpace:'pre-line'}}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="section" style={{background:'var(--ar-surface)'}}>
        <div className="sec-label">{tx.pricing.label}</div>
        <h2 className="sec-title">{tx.pricing.title}</h2>
        <div className="plan-grid">
          {(tx.pricing.plans.length ? tx.pricing.plans : t('ko').pricing.plans).map((p,i) => (
            <div key={i} className={`plan${p.featured?' featured':''}`}>
              {p.featured && <div className="plan-badge">{tx.pricing.popular}</div>}
              <div className="plan-name">{p.name}</div>
              <div className="plan-desc">{p.desc}</div>
              <div className="plan-price">{p.price}<span>{p.period}</span></div>
              <ul className="plan-features">
                {p.features.map((f,j) => <li key={j}>{f}</li>)}
              </ul>
              <button className="plan-btn" onClick={triggerPortal}>{p.cta}</button>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="footer-cta">
        <h2 style={{whiteSpace:'pre-line'}}>{tx.footer.title}</h2>
        <p>{tx.footer.sub}</p>
        <button className="cta-primary" onClick={triggerPortal}>{tx.footer.cta}</button>
      </section>
    </div>
  );
}
