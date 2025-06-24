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
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  className = '',
  type = 'button',
  variant = 'filled',
  disabled = false,
}) => {
  const isOutline = variant === 'outline';
  const btnRef = useRef<HTMLButtonElement>(null);
  const [isWide, setIsWide] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (btnRef.current && !isMobile) {
      const width = btnRef.current.offsetWidth;
      setIsWide(width > 400);
    }
  }, [text, className, isMobile]);

  // Choose the right background
  let backgroundImage = '';
  if (isOutline) {
    backgroundImage = bgButtonOutline;
  } else if (isMobile) {
    backgroundImage = bgButtonMobile;
  } else if (isWide) {
    backgroundImage = bgButtonSubmitForm;
  } else {
    backgroundImage = bgButton;
  }

  return (
    <button
      ref={btnRef}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full  md:w-[222px] h-[64px] md:h-[48px] flex items-center justify-center text-base font-semibold shadow-none transition-all px-6 ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        color: isOutline ? '#7B6142' : '#fff',
        border: 'none',
        padding: 0,
        minWidth: 0,
      }}
    >
      <span
        className="w-full h-full flex items-center justify-center font-semibold text-base md:text-lg"
        style={{
          color: isOutline ? '#7B6142' : '#fff',
          fontWeight: 500,
          fontSize: 14,
        }}
      >
        {text}
      </span>
    </button>
  );
};

export default Button;
