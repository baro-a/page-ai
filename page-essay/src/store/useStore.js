import { create } from 'zustand';

// Sample essays data
const sampleEssays = [
  { id:1, title:'봄비 내리는 오후의 카페', emotion:'평온함', emoji:'😌', category:'일상', format:'감성 에세이', date:'2026.04.10', preview:'빗소리가 창을 두드리는 오후, 나는 낡은 카페의 구석 자리에 앉아 김이 오르는 아메리카노를 감싸 쥐었다.', text:`빗소리가 창을 두드리는 오후, 나는 낡은 카페의 구석 자리에 앉아 김이 오르는 아메리카노를 감싸 쥐었다.\n\n사람들이 분주히 오가는 거리와 달리, 이 좁은 공간만은 시간이 천천히 흐르는 것 같았다. 재즈 선율이 공기에 녹아들고, 빗방울이 창유리 위에서 제각각의 길을 만들어 내려갔다.\n\n이런 날, 나는 존재한다는 것이 이렇게 조용하고 아름다운 일일 수 있다는 걸 새삼 느낀다. 아무것도 하지 않아도 되는 시간. 그저 여기 있어도 되는 시간.`, imageEmoji:'☕', color:'#2d6a4f' },
  { id:2, title:'할머니 손의 온기', emotion:'그리움', emoji:'🥺', category:'가족', format:'자서전', date:'2026.04.07', preview:'할머니의 손은 항상 따뜻했다. 주름진 손등 위로 세월이 새겨져 있었지만, 그 손이 내 머리를 쓰다듬을 때면 세상 모든 걱정이 사라졌다.', text:`할머니의 손은 항상 따뜻했다. 주름진 손등 위로 세월이 새겨져 있었지만, 그 손이 내 머리를 쓰다듬을 때면 세상 모든 걱정이 사라졌다.\n\n돌아가시고 벌써 3년이 지났는데, 아직도 그 온기가 손바닥에 남아있는 것 같다. 기억이란 이렇게 몸 속에 새겨지는 것인가 보다.`, imageEmoji:'👵', color:'#8338ec' },
  { id:3, title:'해질녘 한강에서', emotion:'설렘', emoji:'✨', category:'자연', format:'감성 에세이', date:'2026.04.03', preview:'하늘이 주황빛으로 물들기 시작했다. 자전거 바퀴 아래로 강바람이 스쳐 지나가고, 저 멀리 반짝이는 도시의 불빛들이 하나둘 켜지기 시작했다.', text:`하늘이 주황빛으로 물들기 시작했다. 자전거 바퀴 아래로 강바람이 스쳐 지나가고, 저 멀리 반짝이는 도시의 불빛들이 하나둘 켜지기 시작했다.\n\n한강 둔치를 달리면서, 나는 문득 이 도시가 참 아름답다고 생각했다. 수백만 명의 이야기가 공존하는 이 거대한 흐름 속에서, 나도 작지만 빛나는 한 점으로 존재하고 있었다.`, imageEmoji:'🌅', color:'#f77f00' },
  { id:4, title:'첫 눈 내리던 날', emotion:'여유로움', emoji:'🌿', category:'일상', format:'일기체', date:'2026.03.28', preview:'창밖으로 하얀 눈이 内려쌓이기 시작했다. 도시의 소음이 솜뭉치에 흡수되듯 조용해지고, 세상이 잠시 숨을 멈춘 것 같았다.', text:`창밖으로 하얀 눈이 내려쌓이기 시작했다. 도시의 소음이 솜뭉치에 흡수되듯 조용해지고, 세상이 잠시 숨을 멈춘 것 같았다.\n\n핫초코를 한 모금 마시며 나는 그냥 그 광경을 바라보았다. 아무것도 하지 않는 이 순간이, 삶에서 가장 사치스러운 시간일지도 모른다.`, imageEmoji:'❄️', color:'#4cc9f0' },
];

const _savedUser = (() => { try { const u = localStorage.getItem('page_user'); return u ? JSON.parse(u) : null; } catch { return null; } })();

const useStore = create((set) => ({
  // Auth
  user: _savedUser,
  isPremium: _savedUser?.isPremium || false,
  loginModalOpen: false,
  setLoginModalOpen: (v) => set({ loginModalOpen: v }),
  login: (userData) => {
    const u = { ...userData, isPremium: false };
    localStorage.setItem('page_user', JSON.stringify(u));
    set({ user: u, isPremium: u.isPremium, loginModalOpen: false, screen: 'app', view: 'library' });
  },
  logout: () => {
    localStorage.removeItem('page_user');
    set({ user: null, isPremium: false, screen: 'landing' });
  },

  // Screen: 'landing' | 'app' | 'admin'
  screen: _savedUser ? 'app' : 'landing',
  setScreen: (screen) => set({ screen }),

  // App view: 'library' | 'create' | 'essay' | 'persona' | 'settings'
  view: 'library',
  setView: (view) => set({ view }),

  // Language
  lang: localStorage.getItem('page_lang') || 'ko',
  setLang: (lang) => {
    localStorage.setItem('page_lang', lang);
    set({ lang });
  },

  // Theme
  darkMode: true,
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

  // Portal overlay
  portalOpen: false,
  setPortalOpen: (v) => set({ portalOpen: v }),

  // Lang dropdown
  langOpen: false,
  setLangOpen: (v) => set({ langOpen: v }),

  // Essays
  essays: sampleEssays,
  selectedEssayId: null,
  setSelectedEssay: (id) => set({ selectedEssayId: id, view: 'essay' }),
  addEssay: (essay) => set((s) => ({ essays: [{ ...essay, id: Date.now() }, ...s.essays] })),
  updateEssay: (id, data) => set((s) => ({ essays: s.essays.map(e => e.id === id ? { ...e, ...data } : e) })),
  deleteEssay: (id) => set((s) => ({ essays: s.essays.filter(e => e.id !== id), view: 'library' })),

  // Create wizard
  createStep: 0,
  setCreateStep: (step) => set({ createStep: step }),
  createData: { image: null, imagePreview: null, emotion: '', format: '', context: '', category: '일상' },
  setCreateData: (data) => set((s) => ({ createData: { ...s.createData, ...data } })),
  resetCreate: () => set({ createStep: 0, createData: { image: null, imagePreview: null, emotion: '', format: '', context: '', category: '일상' } }),

  // AI Loading
  aiLoading: false,
  setAiLoading: (v) => set({ aiLoading: v }),
  generatedEssay: null,
  setGeneratedEssay: (e) => set({ generatedEssay: e }),

  // Persona
  activePersona: 0,
  setActivePersona: (i) => set({ activePersona: i }),

  // Settings
  settings: {
    apiKey: localStorage.getItem('page_api_key') || '',
    notifications: true,
  },
  saveSettings: (s) => {
    localStorage.setItem('page_api_key', s.apiKey || '');
    set({ settings: s });
  },

  // Toast
  toast: null,
  showToast: (msg, duration = 2500) => {
    set({ toast: msg });
    setTimeout(() => set({ toast: null }), duration);
  },
}));

export default useStore;
