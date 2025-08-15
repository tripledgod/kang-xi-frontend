import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Loading from './Loading';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set loading to true when location changes
    setIsLoading(true);

    // Clear loading after a brief delay for smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Show loading only briefly during navigation
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F3E8]">
        <Loading text="Loading..." size="large" />
      </div>
    );
  }

  // Show content with fade-in animation
  return <div className="animate-fade-in">{children}</div>;
};

export default PageTransition;
