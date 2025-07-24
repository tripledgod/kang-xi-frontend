import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import bottomLogo from '../assets/bottom_logo.png';
import facebook from '../assets/facebook.svg';
import instagram from '../assets/instagram.svg';

export default function Footer() {
  const { t } = useTranslation();

  // Function to handle WhatsApp redirect
  const handleContactClick = () => {
    // You can customize the phone number and message
    const phoneNumber = '+1234567890'; // Replace with actual phone number
    const message = 'Hello! I would like to contact Kangxi Collection.'; // Customize message
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Split nav links for mobile two-row layout
  const navLinksRow1 = [
    { label: t('BROWSE'), href: '/browse' },
    { label: t('ARTICLES'), href: '/articles' },
    { label: t('ABOUT_US'), href: '/about-us' },
  ];
  const navLinksRow2 = [{ label: t('TERMS_AND_CONDITIONS'), href: '/terms-and-condition' }];

  return (
    <footer className="bg-[#201F1C] text-[#FDFBF1] pt-12 pb-12 px-4">
      <div className="flex flex-col items-center">
        <Link to="/">
          <img src={bottomLogo} alt="Kang Xi Logo" className="h-20 mb-2" />
        </Link>
        {/* Two rows for nav links on mobile, single row on desktop */}
        <nav className="w-full flex flex-col items-center gap-y-4 md:mb-16 mb-12 mt-8 md:flex-row md:flex-wrap md:justify-center md:gap-x-12 md:gap-y-4">
          <div className="flex flex-col gap-y-4 w-full items-center md:flex-row md:w-auto md:gap-x-12 md:gap-y-0">
            <div className="flex flex-row justify-center gap-x-8 w-full md:w-auto md:gap-x-12">
              {navLinksRow1.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-[14px] leading-[20px] font-semibold text-[#FFFFFF] hover:text-[#E6DDC6] transition-colors whitespace-nowrap opacity-80"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-row justify-center gap-x-8 w-full md:w-auto md:gap-x-12 mt-4 md:mt-0">
              {navLinksRow2.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-[14px] leading-[20px] font-semibold text-[#FFFFFF] hover:text-[#E6DDC6] transition-colors whitespace-nowrap opacity-80 "
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
        {/* Faint divider line */}
        <div
          className="w-full max-w-[341px] mx-auto border-t border-[#FDFBF1]/20 opacity-50 md:mb-6 mb-8 md:max-w-7xl"
          style={{ borderTopWidth: '1px' }}
        ></div>
        <div className="w-full max-w-[341px] flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between md:max-w-7xl md:mx-[112px] mx-17px">
          <div className="text-base text-[#FFFFFF] text-center opacity-80">
            © Kangxi Collection {new Date().getFullYear()}. All rights reserved.
          </div>
          <div className="flex gap-8 justify-center">
            <a href="#" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <img src={facebook} alt="Facebook" className="h-7 w-7" />
            </a>
            <a href="#" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <img src={instagram} alt="Instagram" className="h-7 w-7" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
