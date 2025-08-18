import React, { useEffect, useState } from 'react';
import heroImg from '../assets/hero_image.png';
import mouseImg from '../assets/gg_mouse.png';
import { getImageUrl } from '../utils';
import { API_URL } from '../utils/constants';
import { useLanguage } from '../contexts/LanguageContext';

interface HomeCoverState {
  title?: string;
  subTitle?: string;
  image?: any;
  note?: string;
}

const CoverPageHome: React.FC = () => {
  const { locale } = useLanguage();
  const [cover, setCover] = useState<HomeCoverState | null>(null);

  useEffect(() => {
    const fetchHomeCover = async () => {
      try {
        const requestUrl = `${API_URL}/api/home?populate=*`;
        console.log('[HomeCover] Requesting:', requestUrl);
        const res = await fetch(requestUrl);
        const json = await res.json();
        console.log('[HomeCover] Raw /api/home response:', json);

        const root = json?.data?.attributes || json?.data || json || {};
        console.log('[HomeCover] Parsed root:', root);
        console.log('[HomeCover] root.cover:', root?.cover);

        // Best-effort image extraction across common keys
        const candidateImages: any[] = [
          root?.cover?.image,
          root?.coverImage,
          root?.image,
          root?.hero?.image,
          root?.banner?.image,
          root?.cover?.data,
          root?.cover?.data?.attributes,
          root?.cover,
          root?.hero,
          root?.banner,
          Array.isArray(root?.images) ? root?.images?.[0] : undefined,
        ].filter(Boolean);

        let image = candidateImages.find((c) => !!c) || undefined;
        console.log('[HomeCover] Candidate images (first shown):', candidateImages.slice(0, 3));
        // Log resolved URL preview for debugging
        try {
          const previewUrl = getImageUrl(image);
          console.log('[HomeCover] Resolved image URL:', previewUrl);
        } catch (e) {
          console.log('[HomeCover] Failed to resolve image URL:', e);
        }

        const title = root?.title || root?.cover?.title;
        const subTitle = root?.subTitle || root?.subtitle || root?.cover?.subTitle || root?.cover?.subtitle;
        const note = root?.note;

        setCover({ title, subTitle, image, note });
      } catch (error) {
        console.error('Failed to fetch home cover:', error);
      }
    };

    fetchHomeCover();
  }, [locale]);

  const imageUrl = getImageUrl(cover?.image);
  const title = cover?.title || 'Home';
  const subTitle = cover?.subTitle || 'Appreciating Chinese Works of Art';
  const note = cover?.note;

  return (
    <div className="w-full flex justify-center ">
      <div className="relative w-full h-[675px] md:h-[872px] overflow-hidden">
        <img
          src={imageUrl || heroImg}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Overlay layer */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        {/* Text layer */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-full mx-4 md:mx-[272px] flex flex-col items-center justify-center">
            {/* Title block: centered */}
            <div className="flex items-center justify-center text-center">
              <h1
                className="hidden md:block text-white text-[72px] leading-[88px] drop-shadow-lg text-center"
                style={{ letterSpacing: '-0.02em' }}
              >
                {title}
              </h1>
              <h3
                className="text-white text-[40px] leading-[48px] drop-shadow-lg text-center md:hidden"
                style={{ letterSpacing: '-0.01em' }}
              >
                {title}
              </h3>
            </div>

            {/* Spacing 16px between title and subtitle */}
            <div className="h-4" aria-hidden="true" />

            {/* Subtitle block: centered */}
            <div className="flex items-center justify-center text-center md:px-[88.5px]">
              <p className="text-white md:hidden drop-shadow-lg text-[18px] leading-[26px] text-center">{subTitle}</p>
              <p className="text-white hidden md:block drop-shadow-lg text-[20px] leading-[28px] text-center">{subTitle}</p>
            </div>
          </div>
        </div>
        {/* Note at bottom */}
        {note && (
          <div className="absolute inset-x-0 bottom-6 md:bottom-14 z-20 text-center">
            <div className="inline-flex items-center gap-2 pl-3 py-1 text-[#EAEAE9] text-[14px] leading-[20px] tracking-widest" style={{ fontWeight: 350 }}>
              <img src={mouseImg} alt="mouse" className="w-5 h-5" />
              <span>{note}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverPageHome;


