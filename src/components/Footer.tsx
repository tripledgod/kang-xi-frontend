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
    { label: t('ABOUT US'), href: '/about-us' },
  ];
  const navLinksRow2 = [
    { label: t('CONTACT US'), href: '#' },
    { label: t('TERMS & CONDITIONS'), href: '/terms-and-condition' },
  ];

  return (
    <footer className="bg-[#10110C] text-[#FDFBF1] pt-12 pb-6 px-4">
      <div className="flex flex-col items-center">
        <Link to="/">
          <img src={bottomLogo} alt="Kang Xi Logo" className="h-20 mb-2" />
        </Link>
        {/* Two rows for nav links on mobile, single row on desktop */}
        <nav className="w-full flex flex-col items-center gap-y-4 mb-8 mt-8 md:flex-row md:flex-wrap md:justify-center md:gap-x-12 md:gap-y-4">
          <div className="flex flex-col gap-y-4 w-full items-center md:flex-row md:w-auto md:gap-x-12 md:gap-y-0">
            <div className="flex flex-row justify-center gap-x-8 w-full md:w-auto md:gap-x-12">
              {navLinksRow1.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-md font-semibold text-[#FFFFFF] hover:text-[#E6DDC6] transition-colors whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-row justify-center gap-x-8 w-full md:w-auto md:gap-x-12 mt-4 md:mt-0">
              {navLinksRow2.map((link) => {
                // Special handling for Contact Us link
                if (link.label === t('CONTACT US')) {
                  return (
                    <button
                      key={link.label}
                      onClick={handleContactClick}
                      className="text-md font-semibold text-[#FFFFFF] hover:text-[#E6DDC6] transition-colors whitespace-nowrap bg-transparent border-none cursor-pointer"
                    >
                      {link.label}
                    </button>
                  );
                }
                // Regular links
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-md font-semibold text-[#FFFFFF] hover:text-[#E6DDC6] transition-colors whitespace-nowrap"
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
        <div className="w-full border-t border-[#23211C] mb-6"></div>
        <div className="w-full flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between max-w-6xl mx-auto">
          <div className="text-base text-[#FDFBF1] text-center">
            © Kangxi Collection 2020. All rights reserved.
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
