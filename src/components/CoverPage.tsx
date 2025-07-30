import React from 'react';
import heroImg from '../assets/hero_image.png';

import { Cover } from '../types';
import { getImageUrl } from '../utils';

interface CoverPageProps {
  cover?: Cover;
}

const CoverPage: React.FC<CoverPageProps> = ({ cover }) => {
  const imageUrl = getImageUrl(cover?.image);

  return (
    <div className="relative w-full h-[260px] md:h-[340px] flex items-center justify-center overflow-hidden mb-12">
      <img
        src={heroImg || imageUrl}
        alt={cover?.title || 'About Us'}
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ maxWidth: '100vw' }}
      />
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
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
      </div>
    </div>
  );
};

export default CoverPage;
