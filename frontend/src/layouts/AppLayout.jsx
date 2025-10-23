import React, { useState, useEffect, useContext } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, Video, Star, LogOut, PanelLeft, Menu, Home, BarChart, BookOpen, Trophy } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';
import { logoUrl } from '../data/site.js';

const AppLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileSidebarOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileSidebarOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/weeks', text: t('weeks.title'), icon: BookOpen, show: true },
    { to: '/leaderboard', text: t('leaderboard.title'), icon: Trophy, show: true },
    { to: '/dashboard', text: t('dashboard.title'), icon: Home, show: !!user },
  ];

  const getNavLinkClasses = (isOpen) => (to) => {
    const isActive = location.pathname.startsWith(to);
    return `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive ? 'bg-brand-primary/10 text-brand-primary' : 'text-brand-secondary hover:bg-brand-primary/5 hover:text-brand-primary'
    } ${!isOpen ? 'justify-center' : ''}`;
  };

  const SidebarContent = ({ isOpen }) => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-brand-border flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logoUrl} alt="Logo" className="h-8 w-8 rounded-full object-cover" />
          {isOpen && <span className="font-bold text-lg text-brand-primary">{t('common.ghars')}</span>}
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navLinks.filter(link => link.show).map((link) => (
          <NavLink key={link.to} to={link.to} className={getNavLinkClasses(isOpen)(link.to)}>
            <link.icon className={`h-5 w-5 ${isOpen ? 'mr-3' : ''}`} />
            {isOpen && link.text}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-brand-border">
        {user ? (
          <div className="flex items-center justify-between">
             {isOpen && (
               <div className="text-sm">
                <div className="font-bold text-brand-primary">{user.name}</div>
                <div className="text-brand-secondary">{user.role}</div>
              </div>
             )}
            <button onClick={handleLogout} className="text-brand-secondary hover:text-brand-primary transition-colors p-2">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <NavLink to="/login" className={getNavLinkClasses(isOpen)('/login')}>
            <Users className={`h-5 w-5 ${isOpen ? 'mr-3' : ''}`} />
            {isOpen && t('common.login')}
          </NavLink>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-brand-background text-brand-primary">
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity duration-300 ${isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileSidebarOpen(false)}></div>
      <div className={`fixed top-0 right-0 h-full w-64 bg-black/50 backdrop-blur-lg border-l border-brand-border z-50 transition-transform duration-300 ease-in-out md:hidden ${isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <SidebarContent isOpen={true} />
      </div>

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col bg-brand-background border-r border-brand-border transition-all duration-300 ${isDesktopSidebarOpen ? 'w-64' : 'w-20'}`}>
        <SidebarContent isOpen={isDesktopSidebarOpen} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 border-b border-brand-border md:justify-end">
          <button onClick={() => setIsMobileSidebarOpen(true)} className="md:hidden text-brand-secondary hover:text-brand-primary">
            <Menu className="h-6 w-6" />
          </button>
          <button onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)} className="hidden md:block text-brand-secondary hover:text-brand-primary">
            <PanelLeft className="h-6 w-6" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
