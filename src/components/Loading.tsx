import React from 'react';
import { COLORS } from './colors';

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
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  const spinnerSizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
  };

  const LoadingSpinner = () => (
    <div className={`${sizeClasses[size]} relative`}>
      <div
        className={`${spinnerSizeClasses[size]} border-2 border-transparent border-t-current rounded-full animate-spin`}
        style={{ borderTopColor: COLORS.brown }}
      />
    </div>
  );

  const LoadingContent = () => (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <LoadingSpinner />
      {text && (
        <p 
          className="text-sm font-medium"
          style={{ color: COLORS.brown }}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ backgroundColor: 'rgba(247, 245, 234, 0.9)' }}
      >
        <LoadingContent />
      </div>
    );
  }

  return <LoadingContent />;
};

export default Loading; 