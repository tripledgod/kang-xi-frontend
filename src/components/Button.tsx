import React, { useRef, useEffect, useState } from 'react';
import bgButton from '../assets/bg_button.png';
import bgButtonMobile from '../assets/bg_button_mobile.png';
import bgButtonOutline from '../assets/bg_button_outline.png';
import bgButtonSubmitForm from '../assets/bg_button_submit_form1.png';
import bgButtonHover from '../assets/bg_button_hover.png';
// Outline hover will use pressed background as well
import bgButtonSubmitFormHover from '../assets/bg_button_submit_form_hover.png';
import bgButtonPressed from '../assets/bg_button_pressed.png';
import bgButtonMobilePressed from '../assets/bg_button_mobile_pressed.png';
import bgButtonSubmitFormPressed from '../assets/bg_button_submitt_form_pressed.png';
import bgButtonOutlinePressed from '../assets/bg_button_outline_pressed.png';

interface ButtonProps {
  text: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'filled' | 'outline';
  disabled?: boolean;
  forceMobile?: boolean; // add this prop
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  className = '',
  type = 'button',
  variant = 'filled',
  disabled = false,
  forceMobile = false, // add default value
}) => {
  const isOutline = variant === 'outline';
  const btnRef = useRef<HTMLButtonElement>(null);
  const [isWide, setIsWide] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    if (forceMobile) {
      setIsMobile(true);
      return;
    }
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [forceMobile]);

  useEffect(() => {
    if (btnRef.current && !isMobile) {
      const width = btnRef.current.offsetWidth;
      setIsWide(width > 400);
    }
  }, [text, className, isMobile]);

  // Choose the right background
  let backgroundImage = '';
  if (isOutline) {
    backgroundImage = isHovered || isPressed ? bgButtonOutlinePressed : bgButtonOutline;
  } else if (isPressed) {
    if (isMobile) {
      backgroundImage = bgButtonMobilePressed;
    } else if (isWide) {
      backgroundImage = bgButtonSubmitFormPressed;
    } else {
      backgroundImage = bgButtonPressed;
    }
  } else if (isHovered) {
    // Use specific hover backgrounds based on button type
    if (isWide) {
      backgroundImage = bgButtonSubmitFormHover;
    } else {
      backgroundImage = bgButtonHover;
    }
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
      onMouseEnter={() => {
        if (!isMobile) setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className={`group relative w-full md:w-[189px] h-[48px] flex items-center justify-center text-base shadow-none transition-all px-6 overflow-hidden before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100 btn-clickable ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      style={{
        color: isOutline ? (isHovered || isPressed ? '#676767' : '#020202') : '#fff',
        border: 'none',
        padding: 0,
        minWidth: 0,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <span
        className="relative  z-10 w-full h-full flex items-center justify-center leading-[24px] md:leading-[20px]"
        style={{
          color: isOutline ? (isHovered || isPressed ? '#676767' : '#020202') : '#fff',
          fontWeight: 600,
          fontSize: 14,
          letterSpacing: 0,
          wordSpacing: '2px',
          ...(typeof window !== 'undefined' && window.innerWidth >= 768
            ? { letterSpacing: '0.5px' }
            : {}),
        }}
      >
        {text}
      </span>
    </button>
  );
};

export default Button;
