import { useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import useStore from './store/useStore';
import Nav from './components/Nav';
import Portal from './components/Portal';
import LoginModal from './components/LoginModal';
import Landing from './pages/Landing';
import AppScreen from './pages/app/index';
import Admin from './pages/Admin';

// Replace with your actual Google OAuth Client ID from Google Cloud Console
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';

function AppContent() {
  const { screen, toast, langOpen, setLangOpen } = useStore();

  // Close lang dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (langOpen && !e.target.closest('.lang-wrap')) setLangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [langOpen, setLangOpen]);

  return (
    <>
      <Nav />
      <Portal />
      <LoginModal />

      {/* Screens */}
      {screen === 'landing' && <Landing />}
      {screen === 'app'     && <AppScreen />}
      {screen === 'admin'   && <Admin />}

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppContent />
    </GoogleOAuthProvider>
  );
}
