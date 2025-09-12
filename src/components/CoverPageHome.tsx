import React, { useEffect, useState } from 'react';
import heroImg from '../assets/hero_image.png';
import mouseImg from '../assets/gg_mouse.png';
import { getImageUrl } from '../utils';
import { API_URL } from '../utils/constants';
import { useLanguage } from '../contexts/LanguageContext';
import ShimmerSkeleton from './ShimmerSkeleton';

// Small utility component to reduce repeated skeleton classes
const SkeletonBlock: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`rounded animate-pulse bg-white ${className}`}></div>
);

interface HomeCoverState {
  title?: string;
  subTitle?: string;
  image?: any;
  note?: string;
}

const CoverPageHome: React.FC = () => {
  const { locale } = useLanguage();
  const [cover, setCover] = useState<HomeCoverState | null>(null);
  const [loading, setLoading] = useState(true);

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
        const subTitle =
          root?.subTitle || root?.subtitle || root?.cover?.subTitle || root?.cover?.subtitle;
        const note = root?.note;

        setCover({ title, subTitle, image, note });
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch home cover:', error);
        setLoading(false);
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
        {loading ? (
          // Shimmer effect
          <>
            {/* Background shimmer */}
            <ShimmerSkeleton
              variant="rectangular"
              height="100%"
              className="absolute inset-0 w-full h-full"
              theme="image"
            />

            {/* Text layer shimmer */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="w-full flex flex-col items-center justify-center">
                {/* Title shimmer */}
                <div className="flex items-center justify-center text-center w-full">
                  {/* Desktop title shimmer - 2 lines with first line longer - text-[72px] leading-[88px] */}
                  <div className="hidden md:block flex flex-col items-center justify-center w-full">
                    <SkeletonBlock className="w-[897px] h-[88px] mb-4 mx-auto" />
                    <SkeletonBlock className="w-[720px] h-[88px] mx-auto" />
                  </div>
                  {/* Mobile title shimmer - 4 lines - text-[40px] leading-[48px] */}
                  <div className="block md:hidden px-4 flex flex-col items-center justify-center w-full">
                    <SkeletonBlock className="w-[100px] h-[48px] mb-2 mx-auto" />
                    <SkeletonBlock className="w-[180px] h-[48px] mb-2 mx-auto" />
                    <SkeletonBlock className="w-[190px] h-[48px] mb-2 mx-auto" />
                    <SkeletonBlock className="w-[100px] h-[48px] mx-auto" />
                  </div>
                </div>

                {/* Larger spacing between title and subtitle */}
                <div className="h-8" aria-hidden="true" />

                {/* Subtitle shimmer */}
                <div className="flex items-center justify-center text-center w-full md:px-[88.5px]">
                  {/* Mobile subtitle shimmer - 5 lines - text-[18px] leading-[26px] */}
                  <div className="md:hidden px-2 flex flex-col items-center justify-center w-full">
                    <SkeletonBlock className="w-[250px] h-[26px] mb-1 mx-auto" />
                    <SkeletonBlock className="w-[220px] h-[26px] mb-1 mx-auto" />
                    <SkeletonBlock className="w-[230px] h-[26px] mb-1 mx-auto" />
                    <SkeletonBlock className="w-[200px] h-[26px] mb-1 mx-auto" />
                    <SkeletonBlock className="w-[180px] h-[26px] mx-auto" />
                  </div>
                  {/* Desktop subtitle shimmer - 3 lines with different widths - text-[20px] leading-[28px] */}
                  <div className="hidden md:block px-15 flex flex-col items-center justify-center w-full">
                    <SkeletonBlock className="w-[680px] h-[28px] mb-1 mx-auto" />
                    <SkeletonBlock className="w-[720px] h-[28px] mb-1 mx-auto" />
                    <SkeletonBlock className="w-[250px] h-[28px] mx-auto" />
                  </div>
                </div>
              </div>
            </div>

            {/* Note shimmer at bottom */}
            <div className="absolute inset-x-0 bottom-6 md:bottom-14 z-20 text-center">
              <div className="inline-flex items-center gap-2 pl-3 py-1">
                <SkeletonBlock className="w-5 h-5" />
                <SkeletonBlock className="w-32 h-5" />
              </div>
            </div>
          </>
        ) : (
          // Actual content
          <>
            <img
              src={imageUrl || ''}
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
                    className="text-white text-[40px] leading-[48px] drop-shadow-lg text-center md:hidden px-4"
                    style={{ letterSpacing: '-0.01em' }}
                  >
                    {title}
                  </h3>
                </div>

                {/* Spacing 16px between title and subtitle */}
                <div className="h-4" aria-hidden="true" />

                {/* Subtitle block: centered */}
                <div className="flex items-center justify-center text-center md:px-[88.5px]">
                  <p className="text-white md:hidden drop-shadow-lg text-[18px] leading-[26px] text-center px-2">
                    {subTitle}
                  </p>
                  <p className="text-white hidden md:block drop-shadow-lg text-[20px] leading-[28px] text-center px-15">
                    {subTitle}
                  </p>
                </div>
              </div>
            </div>
            {/* Note at bottom */}
            {note && (
              <div className="absolute inset-x-0 bottom-6 md:bottom-14 z-20 text-center">
                <div
                  className="inline-flex items-center gap-2 pl-3 py-1 text-[#EAEAE9] text-[14px] leading-[20px] tracking-widest"
                  style={{ fontWeight: 350 }}
                >
                  <img src={mouseImg} alt="mouse" className="w-5 h-5" />
                  <span>{note}</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CoverPageHome;
