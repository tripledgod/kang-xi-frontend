import React, { useEffect, useState } from 'react';

import { Cover } from '../types';
import { getImageUrl } from '../utils';
import ShimmerSkeleton from './ShimmerSkeleton';

interface CoverPageProps {
  cover?: Cover;
}

const CoverPage: React.FC<CoverPageProps> = ({ cover }) => {
  const imageUrl = getImageUrl(cover?.image);
  const [imageLoaded, setImageLoaded] = useState(false);
  const hasText = Boolean(cover?.title || cover?.subTitle);

  // Reset shimmer when image URL changes (e.g., switching locale)
  useEffect(() => {
    if (imageUrl) {
      setImageLoaded(false);
    }
  }, [imageUrl]);

  return (
    <div className="relative w-full h-[260px] md:h-[340px] flex items-center justify-center overflow-hidden mb-12">
      {!imageLoaded && imageUrl && (
        <ShimmerSkeleton
          variant="rectangular"
          height="100%"
          className="absolute inset-0 w-full h-full"
          theme="image"
        />
      )}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={cover?.title || 'About Us'}
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ maxWidth: '100vw' }}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
        />
      )}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        {hasText ? (
          <>
            <h1
              className="hidden md:block text-white text-[60px] leading-[72px]  drop-shadow-lg text-center"
              style={{ letterSpacing: '-0.02em' }}
            >
              {cover?.title || 'About Us'}
            </h1>
            <h3
              className="text-white text-[40px] leading-[48px]  drop-shadow-lg text-center md:hidden"
              style={{ letterSpacing: '-0.01em' }}
            >
              {cover?.title || 'About Us'}
            </h3>
            <p className="text-white md:hidden drop-shadow-lg  text-[18px] leading-[26px] mt-4">
              {cover?.subTitle || 'Appreciating Chinese Works of Art'}
            </p>
            <p className="text-white hidden md:block drop-shadow-lg text-[20px] leading-[28px] mt-5">
              {cover?.subTitle || 'Appreciating Chinese Works of Art'}
            </p>
          </>
        ) : (
          <>
            {/* Desktop title skeleton */}
            <div className="hidden md:flex w-full justify-center">
              <ShimmerSkeleton
                variant="text"
                height="72px"
                className="w-3/5 max-w-[720px]"
                theme="light"
              />
            </div>
            {/* Mobile title skeleton */}
            <div className="md:hidden w-full flex justify-center">
              <ShimmerSkeleton
                variant="text"
                height="48px"
                className="w-4/5 max-w-[320px]"
                theme="light"
              />
            </div>
            {/* Mobile subtitle skeleton */}
            <div className="md:hidden w-full flex justify-center mt-4">
              <ShimmerSkeleton
                variant="text"
                height="26px"
                className="w-3/4 max-w-[280px]"
                theme="light"
              />
            </div>
            {/* Desktop subtitle skeleton */}
            <div className="hidden md:flex w-full justify-center mt-5">
              <ShimmerSkeleton
                variant="text"
                height="28px"
                className="w-2/5 max-w-[520px]"
                theme="light"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CoverPage;
