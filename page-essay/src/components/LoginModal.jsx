import { useGoogleLogin } from '@react-oauth/google';
import useStore from '../store/useStore';

export default function LoginModal() {
  const { loginModalOpen, setLoginModalOpen, login, showToast } = useStore();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const profile = await res.json();
        login({ name: profile.name, email: profile.email, picture: profile.picture });
        showToast(`✓ ${profile.name}님, 환영합니다!`);
      } catch {
        showToast('로그인 중 오류가 발생했어요.');
      }
    },
    onError: () => showToast('Google 로그인에 실패했어요. 다시 시도해주세요.'),
  });

  if (!loginModalOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => setLoginModalOpen(false)}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setLoginModalOpen(false)}>✕</button>
        <div className="modal-logo">📖</div>
        <h2 className="modal-title">Page에 오신 것을 환영합니다</h2>
        <p className="modal-sub">당신만의 감성 서재를 시작해보세요</p>
        <button className="google-login-btn" onClick={() => googleLogin()}>
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Google로 계속하기
        </button>
        <p className="modal-terms">로그인하면 <a href="#">서비스 약관</a> 및 <a href="#">개인정보 처리방침</a>에 동의하게 됩니다.</p>
      </div>
    </div>
  );
}
