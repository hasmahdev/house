import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, Home, LogOut } from 'lucide-react';
import { logoUrl } from '../../data/site.js';

const MobileAdminSidebar = ({ isOpen, onClose, user, navLinks, handleLogout }) => {
  const { t } = useTranslation();

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-black/50 backdrop-blur-lg border-l border-brand-border z-50 transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ willChange: 'transform' }} // Animation optimization
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-brand-border flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src={logoUrl} alt="Logo" className="h-8 w-8 rounded-full object-cover" />
              <span className="font-bold text-lg text-brand-primary">{user?.name}</span>
            </Link>
            <button onClick={onClose} className="text-brand-secondary hover:text-brand-primary">
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <Link
              to="/"
              className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 text-brand-secondary hover:bg-brand-primary/5 hover:text-brand-primary"
              onClick={handleLinkClick}
            >
              <Home className="h-5 w-5 ml-3" />
              {t('admin.nav.home')}
            </Link>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive ? 'bg-brand-primary/10 text-brand-primary' : 'text-brand-secondary hover:bg-brand-primary/5 hover:text-brand-primary'
                  }`
                }
                onClick={handleLinkClick}
              >
                <link.icon className="h-5 w-5 ml-3" />
                {link.text}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-brand-border">
            <button
              onClick={() => {
                handleLinkClick();
                handleLogout();
              }}
              className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-brand-secondary hover:bg-brand-primary/5 hover:text-brand-primary rounded-lg transition-colors duration-200"
            >
              <LogOut className="h-5 w-5 ml-3" />
              {t('Logout')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileAdminSidebar;
