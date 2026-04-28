import { useEffect, useRef } from 'react';
import useStore from '../store/useStore';

// Pre-computed particle positions - deterministic at module load
const PARTICLES = [...Array(12)].map((_, i) => ({
  id: i,
  top: 30 + Math.random() * 40,
  left: 30 + Math.random() * 40,
  px: (Math.random() - 0.5) * 200,
  py: (Math.random() - 0.5) * 200,
}));

export default function Portal() {
  const { portalOpen } = useStore();
  const bookRef = useRef(null);

  useEffect(() => {
    if (!portalOpen) return;
    const book = bookRef.current;
    if (!book) return;
    // Animate book entrance
    book.style.opacity = '0';
    book.style.transform = 'perspective(800px) translateZ(-400px) rotateY(30deg)';
    requestAnimationFrame(() => {
      book.style.transition = 'all 0.8s cubic-bezier(0.34,1.56,0.64,1)';
      book.style.opacity = '1';
      book.style.transform = 'perspective(800px) translateZ(0) rotateY(0deg)';
    });
    // Then zoom in
    setTimeout(() => {
      book.style.transition = 'all 0.7s ease-in';
      book.style.transform = 'perspective(800px) translateZ(800px) scale(3)';
      book.style.opacity = '0';
    }, 900);
  }, [portalOpen]);

  return (
    <div className={`portal-overlay${portalOpen ? ' active' : ''}`} style={{opacity: portalOpen ? 1 : 0, transition:'opacity .4s'}}>
      {/* Particles */}
      {portalOpen && PARTICLES.map((p) => (
        <div key={p.id} style={{
          position:'absolute', width:3, height:3,
          background:'#E8CF80', borderRadius:'50%',
          top:`${p.top}%`, left:`${p.left}%`,
          animation:`particleFly${p.id} 1.2s ease-out forwards`,
          '--px': `${p.px}px`,
          '--py': `${p.py}px`,
        }} />
      ))}
      <style>{`
        @keyframes particleBurst {
          0% { transform:translate(0,0) scale(1); opacity:1; }
          100% { transform:translate(var(--px,50px),var(--py,-80px)) scale(0); opacity:0; }
        }
      `}</style>
      <div ref={bookRef} className="portal-book" style={{willChange:'transform,opacity'}}>
        <div className="portal-cover">
          <div className="portal-spine" />
          <div className="portal-title">Page</div>
          <div className="portal-subtitle">Your Life Library</div>
        </div>
      </div>
    </div>
  );
}
