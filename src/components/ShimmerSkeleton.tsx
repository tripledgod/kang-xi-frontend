import React from 'react';

interface ShimmerSkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular' | 'card';
  lines?: number;
  animation?: 'wave' | 'pulse';
  theme?: 'default' | 'image' | 'light';
}

const ShimmerSkeleton: React.FC<ShimmerSkeletonProps> = ({
  width = '100%',
  height = '20px',
  className = '',
  variant = 'rectangular',
  lines = 1,
  animation = 'wave',
  theme = 'default',
}) => {
  const getThemeClasses = () => {
    switch (theme) {
      case 'image':
        return 'bg-gradient-to-r from-[#E6DDC6] via-[#F0E8D0] to-[#E6DDC6]';
      case 'light':
        return 'bg-gradient-to-r from-[#FAF7F2] via-[#F5F2E8] to-[#FAF7F2]';
      default:
        return 'bg-gradient-to-r from-[#F7F5EA] via-[#F0EDE0] to-[#F7F5EA]';
    }
  };

  const baseClasses = `
    ${getThemeClasses()}
    bg-[length:200%_100%]
    ${animation === 'wave' ? 'animate-shimmer-wave' : 'animate-pulse'}
    ${variant === 'circular' ? 'rounded-full' : variant === 'card' ? 'rounded-lg' : 'rounded'}
  `;

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${index === lines - 1 ? 'w-3/4' : 'w-full'}`}
            style={{
              width: index === lines - 1 ? '75%' : '100%',
              height,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${className}`}
      style={{
        width,
        height,
      }}
    />
  );
};

// Predefined skeleton components for common use cases
export const CeramicCardSkeleton: React.FC = () => (
  <div className="flex flex-col bg-transparent cursor-pointer">
    {/* Image placeholder - aspect-square */}
    <div className="bg-[#E6DDC6] aspect-square w-full flex items-center justify-center overflow-hidden mb-4">
      <ShimmerSkeleton
        variant="rectangular"
        height="100%"
        className="w-full h-full"
        theme="image"
      />
    </div>
    
    {/* Title - text-2xl font-serif text-[#61422D] mb-6 */}
    <div className="text-2xl font-serif text-[#61422D] mb-6">
      <ShimmerSkeleton
        variant="text"
        height="32px"
        className="w-3/4"
        theme="light"
      />
    </div>
    
    {/* Years - text-base border-t border-[#C7C7B9] pt-4 text-[#2E2A24] mb-1 font-semibold */}
    <div className="text-base border-t border-[#C7C7B9] pt-4 text-[#2E2A24] mb-1 font-semibold">
      <ShimmerSkeleton
        variant="text"
        height="16px"
        className="w-1/3"
        theme="light"
      />
    </div>
    
    {/* Description - text-base pt-2 text-[#6D6A66] line-clamp-3 */}
    <div className="text-base pt-2 text-[#6D6A66] line-clamp-3">
      <ShimmerSkeleton
        variant="text"
        height="16px"
        className="mb-2"
        theme="light"
      />
      <ShimmerSkeleton
        variant="text"
        height="16px"
        className="mb-2 w-5/6"
        theme="light"
      />
      <ShimmerSkeleton
        variant="text"
        height="16px"
        className="w-4/5"
        theme="light"
      />
    </div>
  </div>
);

export const ArticleCardSkeleton: React.FC = () => (
  <div className="flex flex-col">
    <div className="bg-[#E6DDC6] aspect-square w-full flex items-center justify-center overflow-hidden mb-4">
      <ShimmerSkeleton
        variant="rectangular"
        height="100%"
        className="w-full h-full"
        theme="image"
      />
    </div>
    <ShimmerSkeleton
      variant="text"
      height="24px"
      className="mb-2"
    />
    <ShimmerSkeleton
      variant="text"
      lines={3}
      height="16px"
      className="mb-4"
    />
    <ShimmerSkeleton
      variant="text"
      height="14px"
      className="w-1/3"
    />
  </div>
);

// ProductCardSkeleton for Browse page (responsive)
export const ProductCardSkeleton: React.FC = () => (
  <div className="flex flex-col cursor-pointer rounded">
    {/* Image placeholder - aspect-square */}
    <div className="bg-[#E6DDC6] aspect-square w-full flex items-center justify-center overflow-hidden mb-4">
      <ShimmerSkeleton
        variant="rectangular"
        height="100%"
        className="w-full h-full"
        theme="image"
      />
    </div>
    
    {/* Title - 2 lines with min-height */}
    <div className="md:text-[24px] text-[20px] font-medium text-[#61422D] mb-2 leading-[28px] md:leading-[32px] tracking-[0px] line-clamp-2 min-h-[64px]">
      <ShimmerSkeleton
        variant="text"
        height="20px"
        className="mb-2 md:hidden"
        theme="light"
      />
      <ShimmerSkeleton
        variant="text"
        height="20px"
        className="mb-2 md:hidden w-4/5"
        theme="light"
      />
      <ShimmerSkeleton
        variant="text"
        height="24px"
        className="mb-2 hidden md:block"
        theme="light"
      />
      <ShimmerSkeleton
        variant="text"
        height="24px"
        className="mb-2 hidden md:block w-4/5"
        theme="light"
      />
    </div>
    
    {/* Description - 3 lines with min-height */}
    <div className="text-base text-[#585550] mb-4 line-clamp-3 min-h-[72px]">
      <ShimmerSkeleton
        variant="text"
        height="16px"
        className="mb-2"
        theme="light"
      />
      <ShimmerSkeleton
        variant="text"
        height="16px"
        className="mb-2 w-5/6"
        theme="light"
      />
      <ShimmerSkeleton
        variant="text"
        height="16px"
        className="mb-2 w-4/5"
        theme="light"
      />
    </div>
    
    {/* Border */}
    <div className="border-t-2 border-[#E5E1D7] opacity-80 my-3"></div>
    
    {/* Age and Item Code */}
    <div className="flex flex-row justify-between text-[14px] leading-[20px] text-[#585550] font-semibold">
      <ShimmerSkeleton
        variant="text"
        height="14px"
        className="w-20"
        theme="light"
      />
      <ShimmerSkeleton
        variant="text"
        height="14px"
        className="w-24"
        theme="light"
      />
    </div>
  </div>
);

// ProductCardSkeleton320 for "You might be interested" section (fixed 320px width)
export const ProductCardSkeleton320: React.FC = () => (
  <div className="w-[320px] flex flex-col cursor-pointer rounded flex-shrink-0">
    <div className="bg-[#E6DDC6] aspect-square w-full flex items-center justify-center overflow-hidden mb-4">
      <ShimmerSkeleton
        variant="rectangular"
        height="100%"
        className="w-full h-full"
        theme="image"
      />
    </div>
    <ShimmerSkeleton
      variant="text"
      height="14px"
      className="mb-2 w-1/2 uppercase"
      theme="light"
    />
    <div className="h-[110px] md:h-[128px] flex items-start mb-4 md:pb-8 pb-7">
      <ShimmerSkeleton
        variant="text"
        lines={3}
        height="20px"
        className="w-full text-[20px] md:text-[24px] md:leading-[32px] leading-snug"
        theme="light"
      />
    </div>
    <div className="border-t-2 border-[#E5E1D7] opacity-80 mb-2"></div>
    <div className="flex flex-col gap-1 text-[14px] leading-[20px]">
      <div className="flex flex-row justify-between">
        <ShimmerSkeleton variant="text" height="14px" className="w-1/3" theme="light" />
        <ShimmerSkeleton variant="text" height="14px" className="w-1/4" theme="light" />
      </div>
    </div>
  </div>
);

export const TeamCardSkeleton: React.FC = () => (
  <div className="flex flex-col items-start flex-shrink-0" style={{ width: 320, minWidth: 320 }}>
    {/* Image - w-full h-[340px] object-cover mb-6 */}
    <div className="w-full h-[340px] bg-[#E6DDC6] rounded mb-6 animate-pulse"></div>
    
    {/* Name - text-2xl font-serif text-[#61422D] mb-1 text-left */}
    <div className="text-2xl font-serif text-[#61422D] mb-1 text-left w-full">
      <div className="h-8 w-3/4 bg-[#E6DDC6] rounded animate-pulse"></div>
    </div>
    
    {/* Position - text-base text-[#61422D] mb-2 text-left */}
    <div className="text-base text-[#61422D] mb-2 text-left w-full">
      <div className="h-4 w-1/2 bg-[#E6DDC6] rounded animate-pulse"></div>
    </div>
    
    {/* Bio - text-base text-[#585550] text-left */}
    <div className="text-base text-[#585550] text-left w-full">
      <div className="space-y-2">
        <div className="h-4 w-full bg-[#E6DDC6] rounded animate-pulse"></div>
        <div className="h-4 w-5/6 bg-[#E6DDC6] rounded animate-pulse"></div>
        <div className="h-4 w-4/5 bg-[#E6DDC6] rounded animate-pulse"></div>
      </div>
    </div>
  </div>
);

export const FeaturedArticleSkeleton: React.FC<{ isFirst?: boolean }> = ({ isFirst = false }) => (
  <div className={`w-full ${isFirst ? 'flex-2' : 'flex-1'}`}>
    {/* Mobile Layout */}
    <div className="block lg:hidden">
      <div className="relative h-[343px] overflow-hidden w-full transition-all duration-300 cursor-pointer bg-[#E6DDC6]">
        <ShimmerSkeleton
          variant="rectangular"
          height="100%"
          className="absolute inset-0"
          theme="image"
        />
        {/* Mobile Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-30">
          {/* Title - 2 lines */}
          <div className="mb-2">
            <ShimmerSkeleton
              variant="text"
              height="20px"
              className="mb-1 w-full"
              theme="light"
            />
            <ShimmerSkeleton
              variant="text"
              height="20px"
              className="w-4/5"
              theme="light"
            />
          </div>
          {/* Description - 1 line */}
          <ShimmerSkeleton
            variant="text"
            height="16px"
            className="mb-3 w-full"
            theme="light"
          />
          {/* Date - 1 line */}
          <ShimmerSkeleton
            variant="text"
            height="12px"
            className="w-1/3"
            theme="light"
          />
        </div>
      </div>
    </div>

    {/* Desktop Layout */}
    <div className="hidden lg:block relative h-[480px] overflow-hidden group flex-shrink-0 transition-all duration-300 w-full cursor-pointer bg-[#E6DDC6]">
      <ShimmerSkeleton
        variant="rectangular"
        height="100%"
        className="absolute inset-0"
        theme="image"
      />
      {/* Desktop Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 md:p-6 p-4 z-30">
        {/* Title - 2 lines */}
        <div className="mb-2">
          <ShimmerSkeleton
            variant="text"
            height="20px"
            className="mb-1 w-full md:hidden"
            theme="light"
          />
          <ShimmerSkeleton
            variant="text"
            height="20px"
            className="w-4/5 md:hidden"
            theme="light"
          />
          <ShimmerSkeleton
            variant="text"
            height="24px"
            className="mb-1 w-full hidden md:block"
            theme="light"
          />
          <ShimmerSkeleton
            variant="text"
            height="24px"
            className="w-4/5 hidden md:block"
            theme="light"
          />
        </div>
        {/* Description - 1 line */}
        <ShimmerSkeleton
          variant="text"
          height="16px"
          className="mb-3 w-full"
          theme="light"
        />
        {/* Date - 1 line */}
        <ShimmerSkeleton
          variant="text"
          height="12px"
          className="w-1/3 md:hidden"
          theme="light"
        />
        <ShimmerSkeleton
          variant="text"
          height="14px"
          className="w-1/3 hidden md:block"
          theme="light"
        />
      </div>
    </div>
  </div>
);

export const LatestArticleSkeleton: React.FC<{ isLast?: boolean }> = ({ isLast = false }) => (
  <div className="w-full">
    {/* Mobile Card Layout */}
    <div className="block md:hidden p-0 w-full">
      <div className="w-full flex flex-col h-full">
        <div className="w-full h-48 overflow-hidden mb-4 bg-[#E6DDC6] flex items-center justify-center">
          <ShimmerSkeleton
            variant="rectangular"
            height="100%"
            className="w-full h-full"
            theme="image"
          />
        </div>
        <h5 className="text-2xl font-serif mb-2 line-clamp-2 leading-snug" style={{ fontWeight: 600, fontSize: 20, lineHeight: '28px', letterSpacing: 0, textAlign: 'left', color: '#61422D' }}>
          <ShimmerSkeleton
            variant="text"
            height="20px"
            className="mb-2 w-3/4"
            theme="light"
          />
        </h5>
        <div className="text-base text-[#585550] mb-3 line-clamp-3 text-left">
          <ShimmerSkeleton
            variant="text"
            height="16px"
            className="mb-2 w-full"
            theme="light"
          />
          <ShimmerSkeleton
            variant="text"
            height="16px"
            className="mb-2 w-5/6"
            theme="light"
          />
          <ShimmerSkeleton
            variant="text"
            height="16px"
            className="w-4/5"
            theme="light"
          />
        </div>
        <div className="flex-1"></div>
        <div className="text-xs font-semibold text-[#7B6142] md:pb-6 pb-0 uppercase tracking-wider text-left">
          <ShimmerSkeleton
            variant="text"
            height="12px"
            className="w-1/3"
            theme="light"
          />
        </div>
      </div>
    </div>

    {/* Desktop Grid Layout */}
    <div className="hidden md:grid grid-cols-[1fr_238px] gap-6 w-full">
      <div className="flex flex-col h-full min-w-0">
        <h5 className="text-2xl font-serif mb-2 leading-snug line-clamp-2" style={{ fontWeight: 600, fontSize: 24, lineHeight: '32px', letterSpacing: 0, textAlign: 'left', color: '#61422D' }}>
          <ShimmerSkeleton
            variant="text"
            height="24px"
            className="mb-2 w-3/4"
            theme="light"
          />
        </h5>
        <div className="text-base text-[#585550] mb-3 line-clamp-3 text-left">
          <ShimmerSkeleton
            variant="text"
            height="16px"
            className="mb-2 w-full"
            theme="light"
          />
          <ShimmerSkeleton
            variant="text"
            height="16px"
            className="mb-2 w-5/6"
            theme="light"
          />
          <ShimmerSkeleton
            variant="text"
            height="16px"
            className="w-4/5"
            theme="light"
          />
        </div>
        <div className="flex-1"></div>
        <div className="text-[14px] font-semibold leading-[20px] text-[#585550] uppercase tracking-wider text-left">
          <ShimmerSkeleton
            variant="text"
            height="14px"
            className="w-1/3"
            theme="light"
          />
        </div>
      </div>
      <div className="w-[238px] h-[180px] flex-shrink-0 overflow-hidden bg-[#E6DDC6] flex items-center justify-center">
        <ShimmerSkeleton
          variant="rectangular"
          height="100%"
          className="w-full h-full"
          theme="image"
        />
      </div>
    </div>
    
    {/* Faded divider under each article (except last) */}
    {!isLast && (
      <div className="border-t-2 border-[#E5E1D7] opacity-80 mt-8"></div>
    )}
  </div>
);

export const RelatedArticleSkeleton: React.FC = () => (
  <div className="flex flex-col cursor-pointer">
    {/* Image placeholder - aspect-square */}
    <div className="bg-[#E6DDC6] aspect-square w-full flex items-center justify-center overflow-hidden mb-4">
      <ShimmerSkeleton
        variant="rectangular"
        height="100%"
        className="w-full h-full"
        theme="image"
      />
    </div>

    {/* Title - 2 lines with fixed height */}
    <div className="mb-2">
      <ShimmerSkeleton
        variant="text"
        height="20px"
        className="mb-1 w-full md:hidden"
        theme="light"
      />
      <ShimmerSkeleton
        variant="text"
        height="24px"
        className="mb-1 w-full hidden md:block"
        theme="light"
      />
      <ShimmerSkeleton
        variant="text"
        height="20px"
        className="w-4/5 md:hidden"
        theme="light"
      />
      <ShimmerSkeleton
        variant="text"
        height="24px"
        className="w-4/5 hidden md:block"
        theme="light"
      />
    </div>

    {/* Description - 3 lines with fixed height */}
    <div className="md:h-20 mb-4">
      <ShimmerSkeleton
        variant="text"
        height="16px"
        className="mb-2 w-full"
        theme="light"
      />
      <ShimmerSkeleton
        variant="text"
        height="16px"
        className="mb-2 w-5/6"
        theme="light"
      />
      <ShimmerSkeleton
        variant="text"
        height="16px"
        className="w-4/5"
        theme="light"
      />
    </div>

    {/* Date */}
    <div className="text-[14px] leading-[20px] text-[#585550] uppercase font-semibold tracking-wider mt-auto">
      <ShimmerSkeleton
        variant="text"
        height="14px"
        className="w-1/3"
        theme="light"
      />
    </div>
  </div>
);

export default ShimmerSkeleton;
