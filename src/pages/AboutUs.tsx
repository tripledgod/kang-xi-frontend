import React, { useState, useRef } from 'react';
import heroImg from '../assets/about_us_cover.png';
import horseImg from '../assets/horse.png';
import historyImg from '../assets/ceramics.png';
import vaseIcon from '../assets/vase.svg';
import letterIcon from '../assets/letter.svg';
import chaseIcon from '../assets/chase.svg';
import { COLORS } from '../components/colors.ts';

const team = [
  {
    name: 'Ashwin Ilari Singh',
    role: 'Founder & Curator',
    desc: 'Ashwin brings over 25 years of expertise in antique porcelain.',
    img: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Albert Flores',
    role: 'Collection Manager',
    desc: 'Albert thrives oversees the preservation and curation of our collection.',
    img: 'https://randomuser.me/api/portraits/men/44.jpg',
  },
  {
    name: 'Brooklyn Simmons',
    role: 'Art Historian',
    desc: 'Brooklyn Simmons specializes in the history of Chinese ceramics.',
    img: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Wang Li',
    role: 'Research Fellow',
    desc: 'Wang leads our research on provenance and authenticity.',
    img: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
];

export default function AboutUs() {
  const [teamIndex, setTeamIndex] = useState(0);
  const visibleCount = 3;
  const cardWidth = 320;
  const peekWidth = 0.18; // 18% of a card
  const containerRef = useRef<HTMLDivElement>(null);
  const canGoLeft = teamIndex > 0;
  const canGoRight = teamIndex < team.length - visibleCount;

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

  return (
    <div className="w-full min-h-screen bg-[#F7F5EA]">
      {/* Hero Section */}
      <div className="relative w-full h-[260px] md:h-[340px] flex items-center justify-center overflow-hidden mb-12">
        <img
          src={heroImg}
          alt="About Us"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ maxWidth: '100vw' }}
        />
      </div>

      {/* Legacy Section */}
      <div className="max-w-6xl mx-auto px-4 md:flex md:items-center md:gap-12 mb-16">
        <div className="flex-1 mb-8 md:mb-0">
          <div className="text-xs text-[#7B6142] font-semibold uppercase tracking-wider mb-2">
            Heritage
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#61422D] mb-4">
            The Legacy of Kangxi Private Collection
          </h2>
          <div className="text-base text-[#585550] mb-8">
            On this online gallery, we seek to share the beautiful ancient art, lost in time, that
            people all over the world. Our founder has over 25 years of experience collecting
            antiques. We curate these items carefully, but we do not claim to be experts – our
            purpose is to appreciate and share the beauty of Chinese works of art of this part of
            the world.
          </div>
          <div className="flex gap-12">
            <div>
              <div
                className="text-5xl font-medium text-[#7B6142]"
                style={{ fontFamily: 'Source Han Serif SC VF, serif' }}
              >
                25+
              </div>
              <div className="text-xs text-[#585550] mt-1">YEARS EXPERIENCES</div>
            </div>
            <div>
              <div
                className="text-5xl font-medium text-[#7B6142]"
                style={{ fontFamily: 'Source Han Serif SC VF, serif' }}
              >
                100+
              </div>
              <div className="text-xs text-[#585550] mt-1">RARE COLLECTIBLE ITEMS</div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <img src={horseImg} alt="Horse" className="w-full max-w-md rounded" />
        </div>
      </div>

      {/* Journey Section */}
      <div className="w-full bg-[#2E2A24] py-16 mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-white mb-10">
            The Journey of Antique Chinese Porcelain
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center">
              <img src={vaseIcon} alt="Acquisition" className="h-12 mb-4" />
              <h2 className="text-lg font-semibold text-white mb-2">
                Acquisition: Finding Hidden Treasures
              </h2>
              <div className="text-[#A4A7AE] text-sm">
                We source only the finest antiques from trusted networks.
              </div>
            </div>
            <div className="flex flex-col items-center">
              <img src={letterIcon} alt="Authentication" className="h-12 mb-4" />
              <h2 className="text-lg font-semibold text-white mb-2">
                Authentication: Ensuring Genuine Quality
              </h2>
              <div className="text-[#A4A7AE] text-sm">
                Our experts conduct thorough evaluations to confirm authenticity.
              </div>
            </div>
            <div className="flex flex-col items-center">
              <img src={chaseIcon} alt="Selling" className="h-12 mb-4" />
              <h2 className="text-lg font-semibold text-white mb-2">
                Selling: Connecting Collectors with Masterpieces
              </h2>
              <div className="text-[#A4A7AE] text-sm">
                We facilitate seamless transactions for both buyers and sellers.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="max-w-4xl mx-auto px-4 mb-16">
        <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#7B6142] mb-2">
          The History of Ceramics
        </h2>
        <div className="text-base text-[#585550] mb-8">
          China pottery and ceramics has 4200 years of history and it was only after 1700 years
          later were the west able to figure out how to make it.
        </div>
        <img src={historyImg} alt="Ceramics" className="w-full rounded mb-8" />
        <div className="text-[#23211C] text-base space-y-6">
          <p>
            For centuries the true nature of the composition and manufacture of porcelain remained a
            secret. Only in the 18th century did an alchemist in Europe, Friedrich Böttger,
            accidentally discover its composition while trying to turn base metal into gold.
          </p>
          <p>
            The unshaken faith, English, European and American trade market displayed for several
            products from the seventeenth to the nineteenth centuries fostered the continued growth
            of porcelain in the west.
          </p>
          <p>
            The word "china" eventually became the generic name for porcelain, as she successfully
            held its potential as an export trade ware boom exploited by the west at the end of the
            nineteenth century.
          </p>
          <p>
            According to an old Chinese adage and that wise old philosopher Confucius "knowledge
            comes from seeing much". This is a particularly relevant comment for those studying
            Chinese art and, more especially ceramics, which have become known to the wider world
            from the Chinese Tang Dynasty (618 – 907) onward.
          </p>
          <p>
            Authentication of all Chinese ceramics is a very complex and controversial subject, due
            to the secrecy manufacturing techniques, material and great variety of kilns existed in
            different stages and different parts throughout China.
          </p>
          <p>
            For the most part, during the early part of Chinese Dynasties, or the founding of new
            ones, the skills and designs of Chinese ceramics were still developing, to many in China
            it meant official. At all stages there was a great deal of new copying and copying of
            previous dynasty's designs.
          </p>
          <p>
            We do not pretend to be experts on Chinese antiques or ceramics, but we hope our website
            is able to share our contemporary to the cute and the beautiful, and to inspire you to
            learn more. The best our knowledge, part of these ceramics are from our own collection,
            and the purpose of presenting this website is to appreciate and share the variety and
            creativity of the Chinese craftsmen in creating such fine ceramics.
          </p>
        </div>
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
                onClick={() => setTeamIndex(i => Math.max(0, i - 1))}

                disabled={!canGoLeft}
                aria-label="Previous"
              >
                <span className="text-2xl">&#8592;</span>
              </button>
              <button

                className="ticket-rounded w-10 h-10 border border-[#7B6142] rounded-lg flex items-center justify-center bg-transparent text-[#7B6142] hover:bg-[#E6DDC6] transition disabled:opacity-30"
                onClick={() => setTeamIndex(i => Math.min(team.length - visibleCount, i + 1))}

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
            {team.map((member, idx) => (
              <div
                key={idx}
                className="flex flex-col items-start flex-shrink-0"
                style={{
                  width: window.innerWidth < 768 ? mobileCardWidth : cardWidth,
                  minWidth: window.innerWidth < 768 ? mobileCardWidth : cardWidth,
                  marginRight: idx === team.length - 1 ? 0 : 24,
                }}
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-[340px] object-cover rounded mb-6"
                />
                <h2 className="text-2xl font-serif font-semibold text-[#61422D] mb-1 text-left">
                  {member.name}
                </h2>
                <div className="text-base font-bold text-[#61422D] mb-2 text-left">
                  {member.role}
                </div>
                <div className="text-base text-[#585550] text-left">{member.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
