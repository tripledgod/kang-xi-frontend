import React from 'react';
import heroImg from '../assets/about_us_cover.png';

import { getImageUrl } from '../utils';

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

        src={imageUrl || heroImg}

        alt={cover?.title || 'About Us'}
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ maxWidth: '100vw' }}
      />
      <div className="absolute inset-0 bg-opacity-40 flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl md:text-4xl font-serif font-medium mb-2">
          {cover?.title || 'About Us'}
        </h1>
        <p className="text-lg md:text-xl">
          {cover?.subTitle || 'Appreciating Chinese Works of Art'}
        </p>
      </div>
    </div>
  );
};

export default CoverPage;
