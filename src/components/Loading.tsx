import React from 'react';
import { useScrollLock } from '../hooks/useScrollLock';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  text = 'Loading...',
  className = '',
  fullScreen = false,
}) => {
  useScrollLock(fullScreen);

  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  const spinnerSizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  const LoadingSpinner = () => (
    <div className={`${sizeClasses[size]} relative`}>
      {/* Outer ring */}
      <div
        className={`${spinnerSizeClasses[size]} border-2 border-[#E6DDC6] rounded-full animate-pulse`}
      />
      {/* Inner spinning ring */}
      <div
        className={`${spinnerSizeClasses[size]} border-2 border-transparent border-t-[#61422D] rounded-full animate-spin absolute inset-0`}
        style={{ animationDuration: '1s' }}
      />
    </div>
  );

  const LoadingContent = () => (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <LoadingSpinner />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-1050 flex items-center justify-center bg-amber-50 opacity-50 pointer-events-auto">
        <div className="">
          <LoadingContent />
        </div>
      </div>
    );
  }

  return <LoadingContent />;
};

export default Loading;
