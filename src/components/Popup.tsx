import React from 'react';
import Button from './Button';
<<<<<<< HEAD
import {COLORS} from "./colors.ts";
import bgButton from '../assets/bg_button.png';
import bgButtonMobile from '../assets/bg_button_mobile.png';
=======
import { COLORS } from './colors.ts';

>>>>>>> d1039e37f8430577e372faae951abc59c9de56ee
interface PopupProps {
  title: string;
  content: string;
  buttonText: string;
  onButtonClick?: () => void;
  onClose?: () => void;
}

const Popup: React.FC<PopupProps> = ({ title, content, buttonText, onButtonClick, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-[#F7F5EA] shadow-xl w-full max-w-2xl mx-4 md:mx-0 px-4 py-10 flex flex-col items-center">
        {/* Close icon */}
        <button
          className="absolute top-4 right-4 text-4xl text-[#A4A7AE] hover:text-[#86684A] focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {/* Title */}
        <div className="w-full flex flex-col items-center">
          <h2
            className="text-center mb-6 md:mb-8 leading-tight"
            style={{
              fontWeight: 600,
              fontSize: 30,
              color: COLORS.primary900,
              fontFamily: 'serif',
              marginTop: '24px',
            }}
          >
            {title}
          </h2>
        </div>
        {/* Content */}
        <div
          className="text-center mb-10 md:mb-14 font-normal"
          style={{ fontSize: 18, fontWeight: 400, color: COLORS.secondary600 }}
        >
          {content}
        </div>
        {/* Button */}
        <div className="w-full flex justify-center">
<<<<<<< HEAD
        <button
            className=" w-[220px] h-[64px] flex items-center justify-center text-base font-medium shadow-none transition-all px-6 text-xl md:text-2xl max-w-2xl hidden  md:block"
            style={{
              backgroundImage: `url(${bgButton})`,
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              color: '#fff',
              border: 'none',
              padding: 0,
              minWidth: 0,
            }}
            onClick={onButtonClick}
          >
            {buttonText}
          </button>
          <button
            className="w-full  h-[64px] flex items-center justify-center text-base font-medium shadow-none transition-all px-6 text-xl md:text-2xl max-w-2xl md:hidden"
            style={{
              backgroundImage: `url(${bgButtonMobile})`,
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              color: '#fff',
              border: 'none',
              padding: 0,
              minWidth: 0,
            }}
            onClick={onButtonClick}
          >
            {buttonText}
          </button>
=======
          <Button
            text={buttonText}
            onClick={onButtonClick}
            className="max-w-2xl w-full text-xl md:text-2xl"
          />
>>>>>>> d1039e37f8430577e372faae951abc59c9de56ee
        </div>
      </div>
    </div>
  );
};

export default Popup;
