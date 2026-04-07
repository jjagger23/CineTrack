import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoIcon from '../components/LogoIcon';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/catalog');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authLayout">
      <div className="loginHeroPanel">
        <div className="loginBrandWrap">
          <div className="loginBrandRow">
            <div className="loginBrandBadge"><LogoIcon /></div>
            <span className="grad-text loginBrandText">CINETRACK</span>
          </div>
        </div>

        <h1 className="loginHeroTitle">
          Track every show<br />you&apos;ve <span className="grad-text">ever watched.</span>
        </h1>

        <p className="loginHeroDescription">
          Build your watchlist, rate what you&apos;ve seen, and discover what&apos;s worth watching next.
        </p>

        <div className="loginFeatureList">
          {['🎬 Track Shows', '⭐ Rate & Review', '📋 Watchlist', '🔍 Discover'].map(feature => (
            <span key={feature} className="loginFeatureChip">{feature}</span>
          ))}
        </div>
      </div>

      <div className="loginFormPanel">
        <div className="loginFormWrap">
          <h2 className="authCardTitle">Welcome back</h2>
          <p className="authCardSubtitle">Sign in to your CineTrack account</p>

          {error && <div className="authErrorBox">{error}</div>}

          <form onSubmit={handleSubmit}>
            {[['USERNAME', 'text', username, setUsername, 'Enter your username'], ['PASSWORD', 'password', password, setPassword, 'Enter your password']].map(([label, type, val, set, placeholder]) => (
              <div key={label} className="authInputGroup">
                <label className="authInputLabel">{label}</label>
                <input
                  className="ct-input"
                  type={type}
                  value={val}
                  onChange={e => set(e.target.value)}
                  placeholder={placeholder}
                  required
                />
              </div>
            ))}

            <div className="authInputSpacer" />
            <button type="submit" className="btn-primary authSubmitButton" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div className="authOrDivider">
            <div className="authOrLine" />
            <span className="authOrText">or</span>
          </div>

          <p className="authFooterText">
            New to CineTrack? <Link to="/register" className="grad-text authFooterLink">Create account</Link>
          </p>

          <div className="authDemoCard">
            <div className="authDemoTitle">Demo accounts</div>
            <div className="authDemoText">
              Admin: <code className="authCode authCodeAdmin">admin / admin123</code><br />
              User: <code className="authCode">any username + any password</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
