import { useEffect } from 'react';

export const useScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (isLocked) {
      // Save current scroll position
      const scrollY = window.scrollY;

      // Add style to disable scrolling
      const style = document.createElement('style');
      style.id = 'scroll-lock-style';
      style.innerHTML = `
        body {
          position: fixed;
          top: -${scrollY}px;
          left: 0;
          right: 0;
          overflow: hidden;
        }
      `;
      document.head.appendChild(style);

      // Cleanup function
      return () => {
        const styleElement = document.getElementById('scroll-lock-style');
        if (styleElement) {
          document.head.removeChild(styleElement);
        }
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isLocked]);
};
