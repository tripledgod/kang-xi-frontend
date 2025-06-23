import React, { useRef, useEffect, useState } from 'react';
import bgButton from '../assets/bg_button.png';
import bgButtonMobile from '../assets/bg_button_mobile.png';
import bgButtonOutline from '../assets/bg_button_outline.png';
import bgButtonSubmitForm from '../assets/bg_button_submit_form.png';

interface ButtonProps {
  text: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'filled' | 'outline';
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  className = '',
  type = 'button',
  variant = 'filled',
}) => {
  const isOutline = variant === 'outline';
  const btnRef = useRef<HTMLButtonElement>(null);
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    if (btnRef.current) {
      const width = btnRef.current.offsetWidth;
      setIsWide(width > 400);
    }
  }, [text, className]);

  return (
    <button
      ref={btnRef}
      type={type}
      onClick={onClick}
      className={`w-full  md:w-[222px] h-[64px] md:h-[48px] flex items-center justify-center text-base font-semibold shadow-none transition-all px-6 ${className}`}
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
          style={{ color: '#7B6142', fontWeight: 500, fontSize: 14 }}
        >
          {text}
        </span>
      ) : (
        <span
          className="hidden md:block w-full h-full md:w-[222px] md:h-[48px]"
          style={{
            backgroundImage: `url(${isWide ? bgButtonSubmitForm : bgButton})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            color: '#fff',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 500,
            fontSize: 14,
          }}
        >
          {text}
        </span>
      )}
    </button>
  );
};

export default Button;
