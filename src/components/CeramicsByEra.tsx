import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// import icLeft from '../assets/ic_left.svg';
// import icRight from '../assets/ic_right.svg';
import { COLORS } from './colors.ts';
import Button from './Button.tsx';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getCategories, flattenCategory } from '../api/categories';
import { API_URL } from '../utils/constants';

const CARD_WIDTH = 320;
const CARD_GAP = 32;
const DESKTOP_VISIBLE = 3;
// const DESKTOP_PEEK = 0.3; // 30% of 4th card
// const MOBILE_VISIBLE = 1;
// const MOBILE_PEEK = 0.2;

export default function CeramicsByEra() {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [eras, setEras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { locale } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch categories and build eras
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        // Get categories from API
        const categoriesData = await getCategories(locale);

        if (categoriesData && categoriesData.length > 0) {
          // Flatten categories and build eras data
          const erasData = categoriesData.map((cat) => {
            const category = flattenCategory(cat);

            // Handle image from category.image
            let imageUrl = '';
            if (category.image) {
              const rawUrl =
                category.image.formats?.medium?.url ||
                category.image.formats?.small?.url ||
                category.image.formats?.thumbnail?.url ||
                category.image.url ||
                '';

              // Handle URL - concatenate with API_URL if relative path
              imageUrl = rawUrl.startsWith('/uploads/') ? `${API_URL}${rawUrl}` : rawUrl;
            }

            // Create years string from ageFrom and ageTo
            const years =
              category.ageFrom && category.ageTo ? `${category.ageFrom}—${category.ageTo}` : '';

            // Use description from category or fallback
            const description = category.description || `Explore ${category.name} era ceramics`;

            return {
              name: category.name,
              years: years,
              desc: description,
              img: imageUrl,
              id: category.id,
              slug: category.slug,
              isPlaceholder: !imageUrl, // Mark as placeholder if no image
              ageFrom: category.ageFrom ? parseInt(category.ageFrom) : 0, // Add ageFrom for sorting
            };
          });

          // Sort by year ascending (ageFrom)
          const sortedErasData = erasData.sort((a, b) => {
            // If both have ageFrom, sort by number
            if (a.ageFrom && b.ageFrom) {
              return a.ageFrom - b.ageFrom;
            }
            // If only one has ageFrom, put it first
            if (a.ageFrom && !b.ageFrom) return -1;
            if (!a.ageFrom && b.ageFrom) return 1;
            // If neither has ageFrom, keep original order
            return 0;
          });

          setEras(sortedErasData);
        } else {
          setEras([]);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setEras([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [locale]); // Re-fetch when locale changes

  // Scroll to the correct position when index changes (desktop only)
  useEffect(() => {
    if (!isMobile && containerRef.current) {
      containerRef.current.scrollTo({
        left: index * (CARD_WIDTH + CARD_GAP),
        behavior: 'smooth',
      });
    }
  }, [index, isMobile]);

  const canGoLeft = index > 0;
  const canGoRight = index < eras.length - DESKTOP_VISIBLE;

  // Container width
  // const containerWidth = isMobile
  //   ? CARD_WIDTH * (MOBILE_VISIBLE + MOBILE_PEEK) + CARD_GAP * MOBILE_VISIBLE
  //   : CARD_WIDTH * (DESKTOP_VISIBLE + DESKTOP_PEEK) + CARD_GAP * DESKTOP_VISIBLE;

  return (
    <section className="w-full bg-[#F7F5EA] px-4 py-12 md:pt-21 md:pb-19">
      <div className="max-w-7xl mx-auto md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-12">
          {isMobile ? (
            <h4 className="text-4xl md:text-5xl md:mb-0" style={{ color: COLORS.secondary900 }}>
              Ceramics by Era
            </h4>
          ) : (
            <h2 className="text-4xl md:text-5xl md:mb-0" style={{ color: COLORS.secondary900 }}>
              Ceramics by Era
            </h2>
          )}
          <div className="hidden md:flex items-center gap-4 self-end md:self-auto">
            <button
              className="ticket-rounded w-12 h-12 border-2 border-[#DAC497] rounded-lg flex items-center justify-center bg-transparent text-[#93633B] hover:bg-[#E6DDC6] transition btn-clickable"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={!canGoLeft}
              aria-label="Previous"
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#DAC497';
              }}
              onMouseUp={(e) => {
                // Clear inline style so Tailwind hover can take effect
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '';
              }}
              onTouchStart={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#DAC497';
              }}
              onTouchEnd={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '';
              }}
            >
              <span className="text-[20px] text-[#93633B]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                  />
                </svg>
              </span>
            </button>
            <button
              className="ticket-rounded w-12 h-12 border-2 border-[#DAC497] rounded-lg flex items-center justify-center bg-transparent text-[#93633B] hover:bg-[#E6DDC6] transition btn-clickable"
              onClick={() => setIndex((i) => Math.min(eras.length - DESKTOP_VISIBLE, i + 1))}
              disabled={!canGoRight}
              aria-label="Next"
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#DAC497';
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '';
              }}
              onTouchStart={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#DAC497';
              }}
              onTouchEnd={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '';
              }}
            >
              <span className="text-[20px] text-[#93633B]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </span>
            </button>
            <Button
              text={t('VIEW_ALL_COLLECTION')}
              onClick={() => {
                navigate('/browse');
              }}
              className="ml-4 md:w-[218px]"
            />
          </div>
        </div>

        {/* Mobile: vertical stack */}
        <div className="flex flex-col gap-8 mt-4 md:hidden">
          {loading ? (
            <div className="flex justify-center items-center py-16 w-full">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-2 border-[#61422D] border-t-transparent rounded-full animate-spin mb-4"></div>
                <span className="text-[#61422D] text-base font-medium">Loading...</span>
              </div>
            </div>
          ) : (
            eras.map((era) => (
              <div
                key={era.name}
                className="flex flex-col bg-transparent cursor-pointer"
                onClick={() => {
                  navigate(`/browse?era=${era.slug}`);
                }}
              >
                <div className="bg-[#E6DDC6] aspect-square w-full flex items-center justify-center overflow-hidden mb-4">
                  {era.img ? (
                    <img src={era.img} alt={era.name} className="object-cover w-full h-full" />
                  ) : (
                    <div className="text-[#61422D] text-center p-4">
                      <div className="text-6xl mb-3 opacity-50">🏺</div>
                      <div className="text-sm font-medium">No Image</div>
                      <div className="text-xs opacity-70 mt-1">Ceramic Art</div>
                    </div>
                  )}
                </div>
                <h4
                  className="text-2xl mb-6"
                  style={{
                    color: COLORS.primary900,
                    // fontWeight: 500,
                    fontSize: 32,
                    lineHeight: '40px',
                    letterSpacing: 0,
                  }}
                >
                  {era.name}
                </h4>
                <div className="text-base  border-t border-[#C7C7B9] pt-4 text-[#2E2A24] mb-1">
                  {era.years}
                </div>
                <div
                  className="text-base pt-2  "
                  style={{
                    fontSize: 16,
                    lineHeight: 1.5,
                    letterSpacing: 0,
                    wordSpacing: '2px',
                    color: '#6D6A66',
                  }}
                >
                  {era.desc}
                </div>
              </div>
            ))
          )}
          <div className="mt-6">
            <Button text={t('VIEW_ALL_COLLECTION')} onClick={() => navigate('/browse')} />
          </div>
        </div>
        {/* Desktop: horizontal scroll carousel */}
        <div
          ref={containerRef}
          className="hidden md:flex gap-8 mt-4 md:overflow-x-hidden"
          // style={{ width: containerWidth, maxWidth: '100%' }}
        >
          {loading ? (
            <div className="flex justify-center items-center py-16 w-full">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-2 border-[#61422D] border-t-transparent rounded-full animate-spin mb-4"></div>
                <span className="text-[#61422D] text-base font-medium">Loading...</span>
              </div>
            </div>
          ) : (
            eras.map((era) => (
              <div
                key={era.name}
                className="flex flex-col flex-shrink-0 bg-transparent cursor-pointer"
                style={{ width: CARD_WIDTH, minWidth: CARD_WIDTH }}
                onClick={() => {
                  navigate(`/browse?era=${era.slug}`);
                }}
              >
                <div className="bg-[#E6DDC6] aspect-square w-full flex items-center justify-center overflow-hidden mb-4">
                  {era.img ? (
                    <img src={era.img} alt={era.name} className="object-cover w-full h-full" />
                  ) : (
                    <div className="text-[#61422D] text-center p-4">
                      <div className="text-6xl mb-3 opacity-50">🏺</div>
                      <div className="text-sm font-medium">No Image</div>
                      <div className="text-xs opacity-70 mt-1">Ceramic Art</div>
                    </div>
                  )}
                </div>
                <h4
                  className="text-2xl font-serif text-[#61422D] mb-6 "
                  style={{
                    fontWeight: 600,
                    fontSize: 32,
                    lineHeight: '40px',
                    letterSpacing: 0,
                  }}
                >
                  {era.name}
                </h4>
                <div className="text-base  border-t border-[#C7C7B9] pt-4 text-[#2E2A24] mb-1  font-semibold">
                  {era.years}
                </div>
                <div
                  className="text-base pt-2 line-clamp-3 "
                  style={{
                    fontSize: 16,
                    lineHeight: 1.5,
                    letterSpacing: 0,
                    wordSpacing: '2px',
                    color: '#6D6A66',
                  }}
                >
                  {era.desc}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
