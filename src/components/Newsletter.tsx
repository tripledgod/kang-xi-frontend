import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { COLORS } from './colors';
import bgButton from '../assets/bg_button.png';
import bgButtonMobile from '../assets/bg_button_mobile.png';
import Popup from './Popup';
// import Button from './Button';
import { subscribe } from '../api/newsletter';
import bgButtonHover from '../assets/bg_button_hover.png';
import bgButtonMobileHover from '../assets/bg_button_mobile_hover.png';
import bgButtonPressed from '../assets/bg_button_pressed.png';
import bgButtonMobilePressed from '../assets/bg_button_mobile_pressed.png';

export default function Newsletter() {
  const [showPopup, setShowPopup] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset error message when location changes (user navigates to different page)
  useEffect(() => {
    setError('');
    setFirstName('');
    setShowPopup(false);
    setLoading(false);
  }, [location.pathname]);

  const validateFirstName = (name: string) => {
    return name.trim().length > 0;
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFirstName(firstName)) {
      setError('Please enter your first name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await subscribe(firstName);
      setShowPopup(true);
      setFirstName('');
    } catch (err: any) {
      // Handle Strapi error
      if (err?.response?.data?.error?.details?.errors) {
        const errors = err.response.data.error.details.errors;
        const nameError = errors.find(
          (e: any) => e.path.includes('email') || e.path.includes('firstName')
        );
        if (nameError) {
          if (nameError.message.includes('unique')) {
            setError('This name has already been registered');
          } else {
            setError(nameError.message);
          }
        } else {
          setError('An error occurred, please try again.');
        }
      } else if (err?.response?.data?.error?.message) {
        setError(err.response.data.error.message);
      } else {
        setError('An error occurred, please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => setShowPopup(false);

  return (
    <section className="w-full py-12 px-4 bg-[#E8DBC0]">
      <div className="max-w-6xl mx-auto w-full flex flex-col md:grid md:grid-cols-2 md:gap-18 items-center">
        {/* Left column: Title and description */}
        <div className="w-full flex flex-col items-center md:items-start mb-8 md:mb-0">
          <div className="w-full md:w-[420px]">
            {isMobile ? (
              <h5
                className="mb-4 "
                style={{
                  fontSize: 24,
                  color: COLORS.secondary900,
                  fontWeight: 600,
                  lineHeight: '32px',
                  letterSpacing: 0,
                }}
              >
                GET THE LATEST NEWS
              </h5>
            ) : (
              <h4
                className="mb-4 "
                style={{
                  fontSize: 32,
                  color: COLORS.secondary900,
                  fontWeight: 600,
                  lineHeight: '40px',
                  letterSpacing: 0,
                }}
              >
                GET THE LATEST NEWS
              </h4>
            )}
            <p
              className="font-pingfang text-[18px] leading-[26px] tracking-[0px] text-left mb-8 md:w-[400px]"
              style={{
                color: COLORS.secondary700,

                fontSize: 18,
                lineHeight: '26px',
                letterSpacing: 0,
                opacity: 0.8,
              }}
            >
              Subscribe to get our {new Date().getFullYear()} catalog as well as get exclusive
              invites to our private events
            </p>
          </div>
        </div>
        {/* Right column: Input and button */}
        <form
          onSubmit={handleSubscribe}
          className="w-full flex flex-col md:flex-row md:items-center md:justify-end gap-4.5 md:gap-x-4 md:mt-0"
        >
          <div className="w-full md:w-2/3 relative">
            <input
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                // Clear error message when user starts typing
                if (error) {
                  setError('');
                }
              }}
              onFocus={() => {
                // Clear error message when user focuses on input
                if (error) {
                  setError('');
                }
              }}
              disabled={loading}
              className="w-full h-[48px] rounded-lg border px-6 text-lg focus:outline-none focus:ring-2 text-[16px] leading-[24px]"
              style={{
                borderColor: COLORS.border,
                background: COLORS.beigeLight,
                color: COLORS.textDark,
                boxShadow: 'none',
              }}
            />
            <div
              className="text-red-600 text-sm mt-1 absolute left-0 top-full w-full"
              style={{ minHeight: 0 }}
            >
              {error || ''}
            </div>
          </div>
          <div
            className={`w-full justify-center md:w-1/3 h-[48px] flex items-center ${error ? 'mt-4' : ''} md:mt-0`}
          >
            {/* Button desktop */}
            <button
              type="submit"
              disabled={loading}
              className="hidden md:flex w-full h-full items-center justify-center text-[16px] leading-[20px] font-medium shadow-none transition-all px-6"
              onMouseEnter={(e) => {
                // No hover effect on mobile; desktop-only visual cue
                if (!loading) e.currentTarget.style.backgroundImage = `url(${bgButtonHover})`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundImage = `url(${bgButton})`;
              }}
              onMouseDown={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundImage = `url(${bgButtonPressed})`;
                }
              }}
              onMouseUp={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundImage = `url(${bgButtonHover})`;
                }
              }}
              onTouchStart={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundImage = `url(${bgButtonPressed})`;
                }
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
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: '0.5px',
              }}
            >
              {loading ? 'SENDING...' : t('SUBSCRIBE')}
            </button>
            {/* Button mobile */}
            <button
              type="submit"
              disabled={loading}
              className="flex md:hidden w-full h-full items-center justify-center text-[16px] leading-[24px] font-medium shadow-none transition-all px-6"
              onMouseEnter={() => {
                // Skip hover visuals on mobile; rely on pressed/touch feedback
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundImage = `url(${bgButtonMobile})`;
              }}
              onMouseDown={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundImage = `url(${bgButtonMobilePressed})`;
                }
              }}
              onMouseUp={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundImage = `url(${bgButtonMobileHover})`;
                }
              }}
              onTouchStart={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundImage = `url(${bgButtonMobilePressed})`;
                }
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.backgroundImage = `url(${bgButtonMobile})`;
              }}
              style={{
                backgroundImage: `url(${bgButtonMobile})`,
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                color: '#fff',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'SENDING...' : t('SUBSCRIBE')}
            </button>
          </div>
        </form>
      </div>
      {showPopup && (
        <Popup
          title="Thanks for subscribing!"
          titleClassName="md:text-[32px] md:leading-[40px] text-[30px] leading-[36px]"
          containerClassName=" md:h-[244px] h-[274px] "
          content="We will be in touch with you shortly."
          buttonText="BACK TO HOMEPAGE"
          onButtonClick={handleClosePopup}
          onClose={handleClosePopup}
        />
      )}
    </section>
  );
}
