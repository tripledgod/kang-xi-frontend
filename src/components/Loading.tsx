import React from 'react';
import { COLORS } from './colors';
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
      {/* Center dot */}
      <div
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="w-1 h-1 bg-[#61422D] rounded-full animate-pulse" />
      </div>
    </div>
  );

  const LoadingContent = () => (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <LoadingSpinner />
      {text && (
        <div className="text-center">
          <p className="text-base font-medium text-[#61422D] mb-1">
            {text}
          </p>
          <div className="flex space-x-1 justify-center">
            <div className="w-1 h-1 bg-[#61422D] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1 h-1 bg-[#61422D] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1 h-1 bg-[#61422D] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#F7F3E8]"
        style={{ 
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(247, 243, 232, 0.95) 0%, rgba(230, 221, 198, 0.1) 100%)'
        }}
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-[#E6DDC6]/50">
          <LoadingContent />
        </div>
      </div>
    );
  }

  return <LoadingContent />;
};

export default Loading;
