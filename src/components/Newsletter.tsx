import React, { useState } from 'react';
import { COLORS } from './colors';
import bgButton from '../assets/bg_button.png';
import bgButtonMobile from '../assets/bg_button_mobile.png';
import Popup from './Popup';
import Button from './Button';

export default function Newsletter() {
  const [showPopup, setShowPopup] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPopup(true);
  };

  const handleClosePopup = () => setShowPopup(false);

  return (
    <section className="w-full py-12 px-4 bg-[#E8DBC0]">
      <div className="max-w-6xl mx-auto w-full flex flex-col md:grid md:grid-cols-2 md:gap-8 items-center">
        {/* Left column: Title and description */}
        <div className="flex flex-col items-start w-full mb-8 md:mb-0">
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
          <p className="text-xl font-normal mb-8" style={{ color: COLORS.secondary700 }}>
            Subscribe to get our 2020 catalog as well as get exclusive invites to our private events
          </p>
        </div>
        {/* Right column: Input and button */}
        <form
          onSubmit={handleSubscribe}
          className="w-full flex flex-col md:flex-row md:items-center md:justify-end md:gap-0 md:space-x-4 md:mt-0"
        >
          <input
            type="text"
            placeholder="Enter your first name"
            className="w-full md:w-[350px] rounded-lg border px-6 py-4 text-lg focus:outline-none focus:ring-2"
            style={{
              borderColor: COLORS.border,
              background: COLORS.beigeLight,
              color: COLORS.textDark,
              boxShadow: 'none',
            }}
          />
          <Button text="SUBSCRIBE" type="submit" className="mt-6 md:mt-0" />
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
