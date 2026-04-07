import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoIcon from '../components/LogoIcon';

export default function RegisterPage() {
  const { register } = useAuth();
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
      await register(username, password);
      navigate('/catalog');
    } catch (err) {
      setError(err.message || 'Register failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registerLayout">
      <div className="registerCard">
        <Link to="/" className="registerBrandLink">
          <div className="registerBrandBadge"><LogoIcon /></div>
          <span className="grad-text registerBrandText">CINETRACK</span>
        </Link>

        <h2 className="authCardTitle">Create account</h2>
        <p className="authCardSubtitle authCardSubtitleSpaced">Start tracking your shows today</p>

        {error && <div className="authErrorBox authErrorBoxSmall">{error}</div>}

        <form onSubmit={handleSubmit}>
          {[['USERNAME', 'text', username, setUsername, 'Choose a username'], ['PASSWORD', 'password', password, setPassword, 'Create a password']].map(([label, type, val, set, placeholder]) => (
            <div key={label} className="authInputGroup authInputGroupCompact">
              <label className="authInputLabel authInputLabelCompact">{label}</label>
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
            {loading ? 'Creating...' : 'Create Account →'}
          </button>
        </form>

        <p className="authFooterText authFooterTextTop">
          Already have an account? <Link to="/" className="grad-text authFooterLink">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
