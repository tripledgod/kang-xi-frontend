import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollRestoration = () => {
  const { pathname } = useLocation();
  const scrollPositions = useRef<Map<string, number>>(new Map());
  const isInitialLoad = useRef(true);
  const prevPathname = useRef<string>();

  useEffect(() => {
    // Save current scroll position before navigation
    if (prevPathname.current) {
      scrollPositions.current.set(prevPathname.current, window.scrollY);
    }

    if (isInitialLoad.current) {
      // Initial page load - scroll to top instantly
      window.scrollTo({ top: 0, behavior: 'instant' });
      isInitialLoad.current = false;
    } else {
      // Check if we're navigating to a previously visited page (back navigation)
      const hasVisited = scrollPositions.current.has(pathname);
      
      if (hasVisited) {
        // Back navigation - restore scroll position smoothly
        const savedPosition = scrollPositions.current.get(pathname);
        if (savedPosition !== undefined) {
          // Use setTimeout to ensure DOM is fully rendered
          setTimeout(() => {
            window.scrollTo({ top: savedPosition, behavior: 'smooth' });
          }, 50);
        }
      } else {
        // New page - scroll to top instantly for better UX
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    }

    prevPathname.current = pathname;
  }, [pathname]);

  return {
    saveScrollPosition: (path: string) => {
      scrollPositions.current.set(path, window.scrollY);
    },
    getScrollPosition: (path: string) => {
      return scrollPositions.current.get(path) || 0;
    }
  };
};





