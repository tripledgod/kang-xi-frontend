import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImg from '../assets/ceramic_cover.png';
import heroImgMobile from '../assets/ceramic_cover_mobile.png';
import AcquireOrAppraise from '../components/AcquireOrAppraise';

const eras = [
  { key: 'tang', label: 'TANG' },
  { key: 'song', label: 'SONG' },
  { key: 'yuan', label: 'YUAN' },
  { key: 'ming', label: 'MING' },
  { key: 'qing', label: 'QING' },
];

const ceramics = [
  {
    era: 'tang',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    title: 'A White Glazed Kundika, Late Tang / Five Dynasties Period',
    desc: 'The globular body supported on a slightly spreading foot, rising to a tall waisted neck collared by a flange and surmounted by a long tapering tubular mouth.',
    years: '618 – 960',
    item: 'T302602',
  },
  {
    era: 'tang',
    image:
      'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    title: 'A Changsha Straw Glazed Pottery Ewer, Tang Dynasty',
    desc: 'A Tang Dynasty brownish green glazed pottery cover Ewer, of globular form set on a short foot; with moulded handle and sprout.',
    years: '618 – 907',
    item: 'T302601',
  },
  {
    era: 'tang',
    image:
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    title: 'Large Sancai Gazed Peony Plate, Liao Dynasty',
    desc: 'The Thickly potted sancai plate is a superb example of Liao Dynasty pottery. The plate interior is decorated with a chrysanthemum flower.',
    years: '916–1125',
    item: 'L302601',
  },
  {
    era: 'tang',
    image:
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    title: 'A Rare Bottom Filling Water Olive Green Glazed Teapot, Five Dynasties of the Period',
    desc: 'The globular body supported on a slightly spreading foot, rising to a tall waisted neck collared by a flange and surmounted by a long tapering tubular mouth.',
    years: '907 – 960',
    item: 'L302602',
  },
  {
    era: 'tang',
    image:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80',
    title: 'A Large Painted Pottery Figure of a Pranking Horse, Tang Dynasty',
    desc: 'Horses in Tang–dynasty China were admired for their speed, with strength and intelligence, and not only were they important in the realms of travel and war.',
    years: '618 – 917',
    item: 'T302603',
  },
];

export default function Browse() {
  const [activeEra, setActiveEra] = useState('tang');
  const filteredCeramics = ceramics.filter((c) => c.era === activeEra);
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-[#F7F5EA]">
      {/* Hero Section */}
      <div className="w-full relative">
        <img
          src={heroImgMobile}
          alt="Ceramic by Era Mobile"
          className="block md:hidden w-full h-[320px] object-contain bg-[#F7F5EA]"
        />
        <img
          src={heroImg}
          alt="Ceramic by Era"
          className="hidden md:block w-full h-[420px] object-cover object-center"
        />
      </div>

      {/* Era Tabs */}
      <div className="w-full sticky top-[0px] z-30 bg-[#F7F5EA]">
        <div className="max-w-6xl mx-auto px-4 pt-4 md:pt-20 overflow-x-auto whitespace-nowrap">
          <div className="inline-flex items-center gap-x-2 justify-start">
            {eras.map((era, idx) => (
              <React.Fragment key={era.key}>
                <button
                  className={`pb-2 text-lg font-serif font-semibold transition-colors ${activeEra === era.key ? 'border-b-2 border-[#23211C] text-[#23211C] font-bold' : 'text-[#23211C] font-normal border-b-0'}`}
                  onClick={() => setActiveEra(era.key)}
                >
                  {era.label}
                </button>
                {idx < eras.length - 1 && (
                  <span className="text-[#D6C7A1] text-lg mx-2 flex items-center select-none">
                    +
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Ceramics Grid */}
      <div className="w-full max-w-6xl mx-auto px-4 mt-10 grid grid-cols-1 md:grid-cols-3 gap-10">
        {filteredCeramics.map((ceramic, idx) => (
          <div
            key={idx}
            className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow rounded"
            onClick={() => navigate(`/product/${ceramic.item}`)}
          >
            <div className="bg-[#E6DDC6] aspect-square w-full flex items-center justify-center overflow-hidden mb-4">
              <img
                src={ceramic.image}
                alt={ceramic.title}
                className="object-contain w-full h-full"
              />
            </div>
            <div className="text-xl font-serif font-semibold text-[#7B6142] mb-2 leading-snug">
              {ceramic.title}
            </div>
            <div className="text-base text-[#585550] mb-4 line-clamp-3">{ceramic.desc}</div>
            <div className="flex flex-row justify-between text-xs text-[#23211C] font-semibold">
              <span>{ceramic.years}</span>
              <span>ITEM {ceramic.item}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Acquire or Appraise Section */}
      <div className="mt-20">
        <AcquireOrAppraise />
      </div>
    </div>
  );
}
