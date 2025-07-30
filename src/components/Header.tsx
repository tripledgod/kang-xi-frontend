import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import logo from '../assets/logo.png';
import logoMobile from '../assets/logo_mobile.png';
import plus from '../assets/plus.svg';
import english from '../assets/english.svg';
import chinese from '../assets/chinese.svg';
import menu from '../assets/menu.svg';
import close from '../assets/close.svg';

function LanguageSwitcher({ className = '' }) {
  const { locale, setLocale } = useLanguage();
  const isChinese = locale === 'zh-CN';

  return (
    <div
      className={`flex border-2 border-[#E6DDC6] rounded-[8px] overflow-hidden w-[120px] h-[48px] bg-[#FDFBF1] ${className}`}
      style={{ boxSizing: 'border-box' }}
    >
      <button
        className={`ticket-rounded flex-1 flex items-center justify-center transition-all duration-200 btn-clickable ${!isChinese ? 'bg-[#E6DDC6]' : 'bg-[#FDFBF1]'} ${!isChinese ? 'rounded-lg' : 'rounded-l-lg'} z-10`}
        style={{ outline: 'none', border: 'none', padding: '12px 10px' }}
        onClick={() => setLocale('en')}
        aria-label="Switch to English"
      >
        <img src={english} alt="English" className="w-12 h-8 object-cover rounded-lg" />
      </button>
      <button
        className={`ticket-rounded flex-1 flex items-center justify-center transition-all duration-200 btn-clickable ${isChinese ? 'bg-[#E6DDC6]' : 'bg-[#FDFBF1]'} ${isChinese ? 'rounded-lg' : 'rounded-r-lg'} z-10`}
        style={{ outline: 'none', border: 'none', padding: '12px 10px' }}
        onClick={() => setLocale('zh-CN')}
        aria-label="Switch to Chinese"
      >
        <img src={chinese} alt="Chinese" className="w-12 h-8 object-cover rounded-lg" />
      </button>
    </div>
  );
}

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { t } = useTranslation();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [drawerOpen]);

  const navLinks = [
    { label: t('BROWSE'), href: '/browse' },
    { label: t('ARTICLES'), href: '/articles' },
    { label: t('ABOUT_US'), href: '/about-us' },
  ];

  return (
    <header className="w-full bg-[#F7F5EA] relative flex items-center px-4 md:px-16 lg:px-28 py-4">
      {/* Logo and Title */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <Link to="/">
          <img src={logoMobile} alt="Kang Xi Logo Mobile" className="h-12 block lg:hidden" />
          <img src={logo} alt="Kang Xi Logo" className="h-16 hidden lg:block" />
        </Link>
        <div className="text-left"></div>
      </div>
      {/* Centered navLinks (desktop only) */}
      <nav className="hidden xl:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8">
        {navLinks.map((link, idx) => (
          <React.Fragment key={link.label}>
            {idx > 0 && <img src={plus} alt="plus" className="h-3 w-3 mx-2 opacity-40" />}
            <Link
              to={link.href}
              className="text-lg font-medium text-gray-800 link-clickable"
            >
              {link.label}
            </Link>
          </React.Fragment>
        ))}
      </nav>
      {/* Language Switcher (desktop only) */}
      <div className="hidden xl:flex items-center ml-auto">
        <LanguageSwitcher />
      </div>
      {/* Mobile Hamburger Menu (mobile and tablet) */}
      {!drawerOpen && (
        <button
          className="ml-auto block xl:hidden z-40 btn-clickable"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
        >
          <img src={menu} alt="Menu" className="h-8 w-8" />
        </button>
      )}
      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 bg-[#F7F5EA] z-50 flex flex-col h-full w-full transition-all duration-300 overflow-hidden touch-none">
          {/* Header with logo and close icon */}
          <div className="flex items-center justify-between px-4 pt-6">
            <div className="flex items-center gap-4">
              <Link to="/" onClick={() => setDrawerOpen(false)} className="link-clickable">
                <img src={logoMobile} alt="Kang Xi Logo Mobile" className="h-12 block lg:hidden" />
                <img src={logo} alt="Kang Xi Logo" className="h-16 hidden lg:block" />
              </Link>
              <div className="text-left"></div>
            </div>
            <button
              className="p-2 z-50 btn-clickable"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
            >
              <img src={close} alt="Close" className="h-5 w-5" />
            </button>
          </div>
          {/* Nav links centered vertically */}
          <div className="flex-1 flex flex-col items-center justify-center gap-10">
            {navLinks.map((link, idx) => (
              <React.Fragment key={link.label}>
                {idx > 0 && (
                  <img src={plus} alt="plus" className="h-4 w-4 mx-auto opacity-30 mb-2" />
                )}
                <Link
                  to={link.href}
                  className="text-3xl font-medium text-[#23211C] tracking-wide link-clickable"
                  onClick={() => setDrawerOpen(false)}
                >
                  {link.label}
                </Link>
              </React.Fragment>
            ))}
          </div>
          {/* Language Switcher at the bottom */}
          <div className="flex justify-center pb-8">
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
