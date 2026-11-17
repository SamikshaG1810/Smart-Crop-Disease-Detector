import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, ArrowRight, Menu, X, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../api/client';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-11 h-11 rounded-2xl bg-brand-dark flex items-center justify-center text-white shadow-soft-sm group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6 text-brand-sage" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-brand-dark">
              Agro<span className="text-brand-sage">Scan</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-textMuted -mt-1">
              {t('Precision Crop Health')}
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-textDark/80">
          <Link to="/#features" className="hover:text-brand-dark transition-colors">{t('Features')}</Link>
          <Link to="/#how-it-works" className="hover:text-brand-dark transition-colors">{t('How It Works')}</Link>
          <Link to="/crops-library" className="hover:text-brand-dark transition-colors">{t('Crop Library')}</Link>
          <a href={`${API_BASE_URL}/docs`} target="_blank" rel="noreferrer" className="hover:text-brand-dark transition-colors flex items-center">
            {t('API Docs')}
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <LanguageSwitcher />
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-brand-dark hover:bg-brand-forest text-white text-sm font-semibold shadow-soft-sm transition-all hover:shadow-soft-md"
            >
              {t('Dashboard')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-textDark hover:text-black hover:bg-gray-100 transition-colors"
              >
                {t('Log In')}
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center px-5 py-2.5 rounded-full bg-brand-dark hover:bg-brand-forest text-white text-sm font-semibold shadow-soft-sm transition-all hover:shadow-soft-md hover:scale-[1.02]"
              >
                {t('Get Started')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageSwitcher compact />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? t('Close menu') : t('Open menu')}
            aria-expanded={mobileMenuOpen}
            className="p-2 rounded-xl text-slate-textMuted hover:text-black hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-100 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-textDark"
          >
            {t('Features')}
          </Link>
          <Link
            to="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-textDark"
          >
            {t('How It Works')}
          </Link>
          <Link
            to="/crops-library"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-textDark"
          >
            {t('Crop Library')}
          </Link>
          <div className="pt-4 border-t border-gray-100 flex flex-col space-y-2">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full bg-brand-dark text-white font-semibold text-sm"
              >
                {t('Go to Dashboard')}
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full border border-gray-200 text-slate-textDark font-medium text-sm"
                >
                  {t('Log In')}
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full bg-brand-dark text-white font-semibold text-sm"
                >
                  {t('Sign Up')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
