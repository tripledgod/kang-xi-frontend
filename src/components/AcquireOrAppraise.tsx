import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import chaseIcon from '../assets/chase.svg';
import letterIcon from '../assets/letter.svg';
import chaseCollection from '../assets/chase_collection.png';
import chaseCollectionMobile from '../assets/chase_collection_mobile.jpg';
import image from '../assets/image.png';
import imageMobile from '../assets/image_mobile.jpg';
import bgButton from '../assets/bg_button.png';
// import Button from './Button';
import { COLORS } from './colors';
import { useNavigate } from 'react-router-dom';
import bgButtonHover from '../assets/bg_button_hover.png';
// import bgButtonMobileHover from '../assets/bg_button_mobile_hover.png';
import bgButtonPressed from '../assets/bg_button_pressed.png';
import bgButtonMobilePressed from '../assets/bg_button_mobile_pressed.png';

export default function AcquireOrAppraise() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Hook to listen for screen size changes
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // The sections array only contains logic, no images
  const sections = [
    {
      icon: chaseIcon,
      title: 'Acquire an item',
      desc: 'Looking to acquire an item from our network of private collectors? Contact us here with your interest.',
      button: t('LEARN_MORE'),
      imageDesktop: chaseCollection,
      imageMobile: chaseCollectionMobile,
      reverse: false,
      link: '/acquire-an-item',
    },
    {
      icon: letterIcon,
      title: 'Appraise an item',
      desc: 'Looking to acquire an item from our network of private collectors? Contact us here with your interest.',
      button: t('LEARN_MORE'),
      imageDesktop: image,
      imageMobile: imageMobile,
      reverse: true,
      link: '/appraise-an-item',
    },
  ];

  const handleAcquireClick = () => {
    navigate('/acquire-an-item');
  };

  const handleAppraiseClick = () => {
    navigate('/appraise-an-item');
  };

  return (
    <div className="w-full">
      {sections.map((section) => (
        <section
          key={section.title}
          className={`w-full flex flex-col md:flex-row ${section.reverse ? 'md:flex-row-reverse' : ''}`}
          style={{ background: COLORS.secondary900 }}
        >
          {/* Mobile: order-2, Desktop: order-1 (content) */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-[45px] md:py-0 md:px-0 text-center order-2 md:order-1">
            <img src={section.icon} alt="icon" className="mb-8 w-16 h-16" />
            {isMobile ? (
              <h5
                className="mb-6 text-2xl md:text-4xl leading-8 md:leading-10"
                style={{ color: '#FAF7F2', fontWeight: 600, letterSpacing: 0 }}
              >
                {section.title}
              </h5>
            ) : (
              <h4
                className="mb-6 text-2xl md:text-4xl leading-8 md:leading-10"
                style={{ color: '#FAF7F2', fontWeight: 600, letterSpacing: 0 }}
              >
                {section.title}
              </h4>
            )}
            <p className="text-base leading-6 text-[#ABAAA7] mb-10 max-w-lg">{section.desc}</p>
            <div className="w-[220px] flex justify-center">
              <button
                className="w-full font-semibold md:w-[189px] h-[48px] flex items-center justify-center text-base shadow-none transition-all px-6 btn-clickable"
                onClick={
                  section.link === '/acquire-an-item' ? handleAcquireClick : handleAppraiseClick
                }
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  if (!isMobile) {
                    target.style.backgroundImage = `url(${bgButtonHover})`;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundImage = `url(${bgButton})`;
                }}
                onMouseDown={(e) => {
                  const target = e.currentTarget;
                  if (isMobile) {
                    target.style.backgroundImage = `url(${bgButtonMobilePressed})`;
                  } else {
                    target.style.backgroundImage = `url(${bgButtonPressed})`;
                  }
                }}
                onMouseUp={(e) => {
                  const target = e.currentTarget;
                  if (!isMobile) {
                    target.style.backgroundImage = `url(${bgButtonHover})`;
                  }
                }}
                onTouchStart={(e) => {
                  e.currentTarget.style.backgroundImage = `url(${bgButtonMobilePressed})`;
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.backgroundImage = `url(${bgButton})`;
                }}
                style={{
                  backgroundImage: `url(${bgButton})`,
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  color: '#fff',
                  border: 'none',
                  padding: 0,
                  minWidth: 0,
                  fontSize: 14,
                  lineHeight: '20px',
                  letterSpacing: '0.5px',
                }}
              >
                {section.button}
              </button>
            </div>
          </div>
          {/* Mobile: order-1, Desktop: order-2 (image) */}
          <div className="flex-1 flex items-center justify-center bg-black order-1 md:order-2">
            <img
              src={isMobile ? section.imageMobile : section.imageDesktop}
              alt={section.title}
              className="w-full h-full object-cover max-h-[400px] md:max-h-[600px]"
            />
          </div>
        </section>
      ))}
    </div>
  );
}
