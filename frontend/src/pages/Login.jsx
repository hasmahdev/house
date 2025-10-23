import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { logoUrl } from '../data/site';
import { Loader2 } from 'lucide-react';
import PasswordInput from '../components/PasswordInput';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(t('login.error'));
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-background p-4 font-arabic">
      <div className="w-full max-w-4xl mx-auto bg-black/20 border border-brand-border rounded-20 shadow-card overflow-hidden md:grid md:grid-cols-2">
        {/* Visual/Branding side */}
        <div className="hidden md:flex flex-col items-center justify-center p-12 bg-black/30 text-center">
          <img src={logoUrl} alt="Ghars Logo" className="w-24 h-24 rounded-full object-cover mb-6 animate-float" />
          <h1 className="text-4xl font-bold text-brand-primary mb-2 text-shadow-soft">{t('common.ghars')}</h1>
          <p className="text-brand-secondary">{t('login.tagline')}</p>
        </div>

        {/* Form side */}
        <div className="p-8 md:p-12">
          <div className="md:hidden text-center mb-8">
            <img src={logoUrl} alt="Ghars Logo" className="w-20 h-20 rounded-full object-cover mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-brand-primary">{t('common.ghars')}</h1>
          </div>

          <h2 className="text-2xl font-bold text-brand-primary mb-6 text-center">{t('login.title')}</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-brand-secondary mb-2">{t('login.username')}</label>
              <input
                type="text"
                id="username"
                name="username"
                autoComplete="username"
                required
                className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password"className="block text-sm font-medium text-brand-secondary mb-2">{t('login.password')}</label>
              <PasswordInput
                id="password"
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-primary text-brand-background font-bold py-3 px-5 rounded-lg hover:bg-opacity-90 transition-all duration-200 transform active:scale-95 flex items-center justify-center"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : t('login.submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
