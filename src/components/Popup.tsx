import React from 'react';
import Button from './Button';

import { COLORS } from './colors.ts';
import bgButtonSubmitForm from '../assets/bg_button_submit_form.png';
import bgButtonMobile from '../assets/bg_button_mobile.png';

interface PopupProps {
  title: string;
  content: string;
  buttonText: string;
  onButtonClick?: () => void;
  onClose?: () => void;
  titleClassName?: string;
  containerClassName?: string;
}

const Popup: React.FC<PopupProps> = ({
  title,
  content,
  buttonText,
  onButtonClick,
  onClose,
  titleClassName,
  containerClassName,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={`relative bg-[#F7F5EA] shadow-xl md:p-10 px-4  py-10 md:max-w-[592px] max-w-[343px] w-full    flex flex-col items-center ${containerClassName || ''}`}
      >
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
          <h4
            className={`text-center mb-4  ${titleClassName || ''}`}
            style={{
              fontWeight: 600,
              color: COLORS.primary900,
            }}
          >
            {title.split('\n').map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                {idx !== title.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </h4>
        </div>
        {/* Content */}
        <div
          className="text-center mb-8 md:mb-8  md:leading-[28px] md:text[20px] text-[18px] leading-[26px]"
          style={{ color: COLORS.secondary600 }}
        >
          {content}
        </div>
        {/* Button */}
        <div className="w-full flex justify-center mx-auto">
          <button
            className="w-full h-[48px]  items-center justify-center text-[14px] leading-[24px]  shadow-none transition-all    hidden md:block mx-5 btn-clickable"
            style={{
              backgroundImage: `url(${bgButtonSubmitForm})`,
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
            className="w-full  h-[48px] flex items-center justify-center text-[14px] leading-[24px]  shadow-none transition-all     md:hidden btn-clickable"
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
        </div>
      </div>
    </div>
  );
};

export default Popup;
