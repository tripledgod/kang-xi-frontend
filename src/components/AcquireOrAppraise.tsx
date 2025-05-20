import React from 'react';
import chaseIcon from '../assets/chase.svg';
import letterIcon from '../assets/letter.svg';
import chaseCollection from '../assets/chase_collection.png';
import Button from './Button';
import { COLORS } from './colors';
import { useNavigate } from 'react-router-dom';

const sections = [
  {
    icon: chaseIcon,
    title: 'Acquire an item',
    desc: 'Looking to acquire an item from our network of private collectors? Contact us here with your interest.',
    button: 'LEARN MORE',
    image: chaseCollection,
    reverse: false,
    link: '/acquire-an-item',
  },
  {
    icon: letterIcon,
    title: 'Appraise an item',
    desc: 'Looking to acquire an item from our network of private collectors? Contact us here with your interest.',
    button: 'LEARN MORE',
    image: chaseCollection,
    reverse: true,
    link: '/appraise-an-item',
  },
];

export default function AcquireOrAppraise() {
  const navigate = useNavigate();
  return (
    <div className="w-full">
      {sections.map((section, idx) => (
        <section
          key={section.title}
          className={`w-full flex flex-col md:flex-row ${section.reverse ? 'md:flex-row-reverse' : ''}`}
          style={{ background: COLORS.secondary900 }}
        >
          {/* Left: Content */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 md:py-0 md:px-0 text-center">
            <img src={section.icon} alt="icon" className="mb-8 w-16 h-16" />
            <h2 className="text-4xl md:text-5xl font-serif font-semibold text-white mb-6">{section.title}</h2>
            <p className="text-lg md:text-xl text-[#A4A7AE] mb-10 max-w-lg">{section.desc}</p>
            <div className="w-[220px] flex justify-center">
              <Button
                text={section.button}
                onClick={section.link ? () => navigate(section.link) : undefined}
                className="w-full md:w-[220px]"
              />
            </div>
          </div>
          {/* Right: Image */}
          <div className="flex-1 flex items-center justify-center bg-black">
            <img src={section.image} alt={section.title} className="w-full h-full object-cover max-h-[400px] md:max-h-[600px]" />
          </div>
        </section>
      ))}
    </div>
  );
}
