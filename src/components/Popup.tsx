import React from 'react';
import Button from './Button';
import { COLORS } from './colors.ts';

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
          <Button
            text={buttonText}
            onClick={onButtonClick}
            className="max-w-2xl w-full text-xl md:text-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Popup;
