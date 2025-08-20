import React, { useState, useRef, useEffect } from 'react';
import Loading from '../components/Loading';
import { useLoading } from '../hooks/useLoading';
import heroImg from '../assets/about_us_cover.png';
import { API_URL } from '../utils/constants.ts';
import { AboutResponse } from '../types.ts';
import CoverPage from '../components/CoverPage';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getImageUrl } from '../utils';

// Customize the component for <img> tag in markdown
const MarkdownComponents = {
  img: ({ node, ...props }: any) => (
    <div className="my-6 flex justify-center">
      <img {...props} className="rounded-lg shadow-md max-w-full h-auto" />
    </div>
  ),
};

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
  // const mobilePeek = 0.18;
  // const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5EA] flex items-center justify-center">
        <Loading fullScreen={true} text="Loading..." />
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
            className="px-4 py-2 bg-[#7B6142] text-white rounded hover:bg-[#6a5437] btn-clickable"
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
          <div className="text-[14px] leading-[20px] text-[#585550] uppercase font-semibold tracking-wider mb-2">
            Heritage
          </div>
          <h3 className="hidden md:block text-[40px] leading-[48px] font-serif  text-[#61422D] mb-4">
            {aboutData?.heritage?.title || 'The Legacy of Kangxi Private Collection'}
          </h3>
          <h4 className="block md:hidden text-[32px] leading-[40px] font-serif  text-[#61422D] mb-4">
            {aboutData?.heritage?.title || 'The Legacy of Kangxi Private Collection'}
          </h4>
          <div className="text-[18px] leading-[26px] text-[#585550] mb-5">
            {aboutData?.heritage?.body || 'Loading...'}
          </div>
          <div className="h-[1px] bg-[#D5D4D3] w-full my-4 md:mt-8"></div>
          <div className="flex gap-12 ">
            <div>
              <h2 style={{ letterSpacing: '-1%' }} className="text-5xl font-medium text-[#61422D]">
                {aboutData?.heritage?.yearsExp || '25'}+
              </h2>
              <div
                style={{ letterSpacing: '0.5px' }}
                className="text-[14px] leading-[20px] text-[#585550] font-semibold mt-2"
              >
                YEARS EXPERIENCES
              </div>
            </div>
            <div>
              <h2 style={{ letterSpacing: '-1%' }} className="text-5xl font-medium text-[#61422D]">
                {aboutData?.heritage?.rareCollectibleItems || '100'}+
              </h2>
              <div
                style={{ letterSpacing: '0.5px' }}
                className="text-[14px] leading-[20px] text-[#585550] font-semibold mt-2"
              >
                RARE COLLECTIBLE ITEMS
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <img
            src={getImageUrl(aboutData?.heritage?.image) || heroImg}
            alt="Horse"
            className="w-full max-w-md"
          />
        </div>
      </div>

      {/* Journey Section */}
      <div className="w-full bg-[#2E2A24] py-16 mb-16 md:mt-8">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="hidden md:block text-[40px] leading-[48px] font-serif text-white mb-16">
            The Journey of Antique Chinese Porcelain
          </h3>
          <h4 className="block md:hidden text-[32px] leading-[40px]font-serif text-white mb-10">
            Our Services
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {aboutData?.journey?.map((item) => (
              <div key={item.id} className="flex flex-col items-center">
                <img src={getImageUrl(item.icon)} alt={item.title} className="h-12 mb-4" />
                <h5 className="text-[20px] md:text-[24px] leading-[28px] md:leading-[32px] text-[#FAF7F2] mb-2">
                  {item.title}
                </h5>
                <div className="text-[#ABAAA7] text-[16px] leading-[24px]">{item.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="max-w-6xl mx-auto px-4 mb-16">
        <h3 className="hidden md:block text-[40px] leading-[48px] font-serif text-[#61422D] mb-2">
          {aboutData?.title || 'The History of Ceramics'}
        </h3>
        <h4 className="block md:hidden text-[32px] leading-[40px] font-serif text-[#61422D] mb-2">
          {aboutData?.title || 'The History of Ceramics'}
        </h4>

        <div className="my-5 prose prose-lg max-w-none text-[20px] leading-[28px] [&_img]:my-3 md:[&_img]:my-11 text-[#585550]">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
            {aboutData.mainContent}
          </ReactMarkdown>
        </div>
      </div>

      <div className="h-[1px] max-w-[382px] md:max-w-[1120px] mx-auto bg-[#D5D4D3]  opacity-50 w-full md:my-8 my-0 mt-8 px-4"></div>

      {/* Team Section */}
      <div className="w-full bg-[#F7F5EA] md:py-16 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="hidden md:block text-[40px] leading-[48px] font-serif text-[#61422D] mb-4 text-left">
                Meet Our Team
              </h3>
              <h4 className="block md:hidden text-2xl font-serif text-[#61422D] mb-4 md:mb-5 text-left">
                Meet Our Team
              </h4>
              <div className="text-[20px] leading-[28px] text-[#585550] md:mb-8 mb-0 text-left">
                Meet the dedicated professionals behind our collection.
              </div>
            </div>
            {/* Desktop arrows only */}
            <div className="hidden md:flex gap-4">
              <button
                className="ticket-rounded w-12 h-12 border-2 border-[#DAC497] rounded-lg flex items-center justify-center bg-transparent text-[#93633B] hover:bg-[#E6DDC6] transition btn-clickable"
                onClick={() => setTeamIndex((i) => Math.max(0, i - 1))}
                disabled={!canGoLeft}
                aria-label="Previous"
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
                      d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                    />
                  </svg>
                </span>
              </button>
              <button
                className="ticket-rounded w-12 h-12 border-2 border-[#DAC497] rounded-lg flex items-center justify-center bg-transparent text-[#93633B] hover:bg-[#E6DDC6] transition btn-clickable"
                onClick={() =>
                  setTeamIndex((i) =>
                    Math.min((aboutData?.team?.length ?? 0) - visibleCount, i + 1)
                  )
                }
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
            </div>
          </div>
          <div
            ref={containerRef}
            className="flex gap-4 md:gap-8 mt-8 overflow-x-auto scrollbar-hide pr-12"
            style={{
              width: `calc(100vw - 2rem)`,
              maxWidth: `${cardWidth * (visibleCount + peekWidth) + 24 * visibleCount}px`,
            }}
          >
            {aboutData?.team?.map((member) => (
              <div
                key={member.id}
                className="flex flex-col items-start flex-shrink-0"
                style={{
                  width: window.innerWidth < 768 ? mobileCardWidth : cardWidth,
                  minWidth: window.innerWidth < 768 ? mobileCardWidth : cardWidth,
                }}
              >
                <img
                  src={getImageUrl(member.image) || heroImg}
                  alt={member.name}
                  className="w-full h-[340px] object-cover mb-6"
                />
                <h5 className="text-2xl font-serif text-[#61422D] mb-1 text-left">{member.name}</h5>
                <div className="text-base text-[#61422D] mb-2 text-left">{member.position}</div>
                <div className="text-base text-[#585550] text-left">{member.bio}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
