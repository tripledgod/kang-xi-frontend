import React, { useState, useRef, useEffect } from 'react';
import Loading from '../components/Loading';
import { useLoading } from '../hooks/useLoading';
import heroImg from '../assets/about_us_cover.png';
import { API_URL } from '../utils/constants.ts';
import { AboutResponse } from '../types.ts';
import CoverPage from '../components/CoverPage';

export default function AboutUs() {
  const [teamIndex, setTeamIndex] = useState(0);
  const [aboutData, setAboutData] = useState<AboutResponse['data'] | null>(null);
  const { loading, withLoading } = useLoading(true);
  const visibleCount = 3;
  const cardWidth = 320;
  const peekWidth = 0.18; // 18% of a card
  const containerRef = useRef<HTMLDivElement>(null);
  const canGoLeft = teamIndex > 0;
  const canGoRight = teamIndex < (aboutData?.team?.length ?? 0) - visibleCount;

  // Fetch about data
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/about?populate=*`);
        const data: AboutResponse = await response.json();
        setAboutData(data.data);
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    };

    withLoading(fetchAboutData);
  }, []);

  // Scroll to the correct position when teamIndex changes (desktop only)
  React.useEffect(() => {
    if (containerRef.current && window.innerWidth >= 768) {
      containerRef.current.scrollTo({
        left: teamIndex * cardWidth,
        behavior: 'smooth',
      });
    }
  }, [teamIndex]);

  // Responsive card/container width
  const mobileCardWidth = 320;
  const mobilePeek = 0.18;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5EA] flex items-center justify-center">
        <Loading fullScreen text="Loading about us..." />
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div className="min-h-screen bg-[#F7F5EA] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#61422D] text-lg mb-4">Failed to load about us data</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#7B6142] text-white rounded hover:bg-[#6a5437]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F7F5EA]">
      {/* Hero Section */}
      <CoverPage cover={aboutData?.cover} />

      {/* Legacy Section */}
      <div className="max-w-6xl mx-auto px-4 md:flex md:items-center md:gap-12 mb-16">
        <div className="flex-1 mb-8 md:mb-0">
          <div className="text-xs text-[#7B6142] font-semibold uppercase tracking-wider mb-2">
            Heritage
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#61422D] mb-4">
            {aboutData?.heritage?.title || 'The Legacy of Kangxi Private Collection'}
          </h2>
          <div className="text-base text-[#585550] mb-8">
            {aboutData?.heritage?.body || 'Loading...'}
          </div>
          <div className="flex gap-12">
            <div>
              <div
                className="text-5xl font-medium text-[#7B6142]"
                style={{ fontFamily: 'Source Han Serif SC VF, serif' }}
              >
                {aboutData?.heritage?.yearsExp || '25'}+
              </div>
              <div className="text-xs text-[#585550] mt-1">YEARS EXPERIENCES</div>
            </div>
            <div>
              <div
                className="text-5xl font-medium text-[#7B6142]"
                style={{ fontFamily: 'Source Han Serif SC VF, serif' }}
              >
                {aboutData?.heritage?.rareCollectibleItems || '100'}+
              </div>
              <div className="text-xs text-[#585550] mt-1">RARE COLLECTIBLE ITEMS</div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <img
            src={aboutData?.heritage?.image?.formats?.medium?.url 
              ? `${API_URL}${aboutData.heritage.image.formats.medium.url.startsWith('/') ? '' : '/'}${aboutData.heritage.image.formats.medium.url}`
              : heroImg}
            alt="Horse"
            className="w-full max-w-md"
          />
        </div>
      </div>

      {/* Journey Section */}
      <div className="w-full bg-[#2E2A24] py-16 mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-white mb-10">
            The Journey of Antique Chinese Porcelain
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {aboutData?.journey?.map((item) => (
              <div key={item.id} className="flex flex-col items-center">
                <img src={`${API_URL}${item.icon.url}`} alt={item.title} className="h-12 mb-4" />
                <div className="text-lg font-semibold text-white mb-2">{item.title}</div>
                <div className="text-[#A4A7AE] text-sm">{item.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="max-w-4xl mx-auto px-4 mb-16">
        <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#7B6142] mb-2">
          {aboutData?.title || 'The History of Ceramics'}
        </h2>
        <div 
          className="text-base text-[#585550] mb-8"
          dangerouslySetInnerHTML={{ __html: aboutData?.mainContent || 'Loading...' }}
        />
      </div>

      {/* Team Section */}
      <div className="w-full bg-[#F7F5EA] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-4xl font-serif font-semibold text-[#7B6142] mb-2 text-left">
                Meet Our Team
              </h2>
              <div className="text-base text-[#585550] mb-0 text-left">
                Meet the dedicated professionals behind our collection.
              </div>
            </div>
            {/* Desktop arrows only */}
            <div className="hidden md:flex gap-2">
              <button
                className="ticket-rounded w-10 h-10 border border-[#7B6142] rounded-lg flex items-center justify-center bg-transparent text-[#7B6142] hover:bg-[#E6DDC6] transition disabled:opacity-30"
                onClick={() => setTeamIndex((i) => Math.max(0, i - 1))}
                disabled={!canGoLeft}
                aria-label="Previous"
              >
                <span className="text-2xl">&#8592;</span>
              </button>
              <button
                className="w-10 h-10 border border-[#7B6142] rounded flex items-center justify-center bg-transparent text-[#7B6142] hover:bg-[#E6DDC6] transition disabled:opacity-30"
                onClick={() =>
                  setTeamIndex((i) =>
                    Math.min((aboutData?.team?.length ?? 0) - visibleCount, i + 1)
                  )
                }
                disabled={!canGoRight}
                aria-label="Next"
              >
                <span className="text-2xl">&#8594;</span>
              </button>
            </div>
          </div>
          <div
            ref={containerRef}
            className="flex gap-8 mt-8 overflow-x-auto scrollbar-hide pr-12"
            style={{
              width: `calc(100vw - 2rem)`,
              maxWidth: `${cardWidth * (visibleCount + peekWidth) + 24 * visibleCount}px`,
            }}
          >
            {aboutData?.team?.map((member, idx) => (
              <div
                key={member.id}
                className="flex flex-col items-start flex-shrink-0"
                style={{
                  width: window.innerWidth < 768 ? mobileCardWidth : cardWidth,
                  minWidth: window.innerWidth < 768 ? mobileCardWidth : cardWidth,
                  marginRight: idx === (aboutData?.team?.length ?? 0) - 1 ? 0 : 24,
                }}
              >
                <img
                  src={`${API_URL}${member.image.formats.medium.url}`}
                  alt={member.name}
                  className="w-full h-[340px] object-cover mb-6"
                />
                <div className="text-2xl font-serif font-semibold text-[#7B6142] mb-1 text-left">
                  {member.name}
                </div>
                <div className="text-base font-bold text-[#7B6142] mb-2 text-left">
                  {member.position}
                </div>
                <div className="text-base text-[#585550] text-left">{member.bio}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
