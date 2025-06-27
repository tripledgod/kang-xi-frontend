import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { COLORS } from './colors';
import bgButton from '../assets/bg_button.png';
import bgButtonMobile from '../assets/bg_button_mobile.png';
import Popup from './Popup';
import Button from './Button';
import { subscribe } from '../api/newsletter';

export default function Newsletter() {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const validateEmail = (email: string) => {
    // Simple validation, can be replaced with better regex if needed
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await subscribe(email);
      setShowPopup(true);
      setEmail('');
    } catch (err: any) {
      // Handle Strapi error
      if (err?.response?.data?.error?.details?.errors) {
        const errors = err.response.data.error.details.errors;
        const emailError = errors.find((e: any) => e.path.includes('email'));
        if (emailError) {
          if (emailError.message.includes('unique')) {
            setError('This email has already been registered');
          } else {
            setError(emailError.message);
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
        <div className="flex flex-col items-center w-full mb-8 md:mb-0 md:grid md:grid-cols-3">
          <div className="w-full md:col-span-2">
            <h2
              className="mb-4 font-medium"
              style={{
                fontSize: 32,
                color: COLORS.secondary900,
                fontFamily: 'Source Han Serif SC VF, serif',
              }}
            >
              GET THE LATEST NEW
            </h2>
            <p
              className="font-pingfang text-[18px] leading-[26px] tracking-[0px] text-left mb-8"
              style={{ color: COLORS.secondary700 }}
            >
              Subscribe to get our 2020 catalog as well as get exclusive invites to our private
              events
            </p>
          </div>
        </div>
        {/* Right column: Input and button */}
        <form
          onSubmit={handleSubscribe}
          className="w-full flex flex-col md:flex-row md:items-center md:justify-end gap-4.5 md:gap-x-4 md:mt-0"
        >
          <div className="w-full">
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
              className="w-full md:flex-2/3 h-[64px] md:h-[48px]  rounded-lg border px-6 text-lg focus:outline-none focus:ring-2"
              style={{
                borderColor: COLORS.border,
                background: COLORS.beigeLight,
                color: COLORS.textDark,
                boxShadow: 'none',
              }}
            />
            {error && (
              <div className="text-red-600 text-sm mt-1">{error}</div>
            )}
          </div>
          <div className="w-[189px] h-[48px] justify-center md:block hidden">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex-1/3 h-full items-center justify-center text-base font-medium shadow-none transition-all px-6"
              style={{
                backgroundImage: `url(${bgButton})`,
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
          <div className="w-full h-[64px] justify-center md:hidden">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-full items-center justify-center text-base font-medium shadow-none transition-all px-6"
              style={{
                backgroundImage: `url(${bgButtonMobile})`,
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                color: '#fff',
                border: 'none',
                padding: 0,
                minWidth: 0,
                fontSize: '18px',
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
          content="We will be in touch with you shortly."
          buttonText="BACK TO HOMEPAGE"
          onButtonClick={handleClosePopup}
          onClose={handleClosePopup}
        />
      )}
    </section>
  );
}
