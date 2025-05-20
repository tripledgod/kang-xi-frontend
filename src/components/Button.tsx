import React from 'react';
import bgButton from '../assets/bg_button.png';
import bgButtonMobile from '../assets/bg_button_mobile.png';
import bgButtonOutline from '../assets/bg_button_outline.png';

interface ButtonProps {
  text: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'filled' | 'outline';
}

const Button: React.FC<ButtonProps> = ({ text, onClick, className = '', type = 'button', variant = 'filled' }) => {
  const isOutline = variant === 'outline';
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full md:w-[220px] h-[64px] flex items-center justify-center text-base font-semibold shadow-none transition-all px-6 ${className}`}
      style={
        isOutline
          ? {
              backgroundImage: `url(${bgButtonOutline})`,
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              color: '#7B6142',
              border: 'none',
              padding: 0,
              minWidth: 0,
            }
          : {
              backgroundImage: `url(${bgButtonMobile})`,
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              color: '#fff',
              border: 'none',
              padding: 0,
              minWidth: 0,
            }
      }
    >
      {isOutline ? (
        <span
          className="w-full h-full flex items-center justify-center font-semibold text-base md:text-lg"
          style={{ color: '#7B6142', fontWeight: 600, fontSize: 18 }}
        >
          {text}
        </span>
      ) : (
        <span
          className="hidden md:block w-full h-full"
          style={{
            backgroundImage: `url(${bgButton})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            color: '#fff',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            fontSize: 18,
          }}
        >
          {text}
        </span>
      )}
    </button>
  );
};

export default Button;
 