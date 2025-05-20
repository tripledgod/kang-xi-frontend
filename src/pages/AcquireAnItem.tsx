import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import '../styles/phone-input.css';
import '../styles/submit-form-button.css';
import timelessTreasure from '../assets/timeless_treasure.png';
import Button from '../components/Button';
import customerSupportIcon from '../assets/customer_support.svg';
import privateViewingIcon from '../assets/private_viewing.svg';
import secureTransactionIcon from '../assets/secure_transaction.svg';

const steps = [
  {
    icon: <img src={customerSupportIcon} alt="Customer Support" className="w-12 h-12 mx-auto" />,
    title: 'Personalized Assistance',
    desc: 'Our team will reach out to discuss details, provenance, and any questions you may have.',
  },
  {
    icon: <img src={privateViewingIcon} alt="Private Viewing" className="w-12 h-12 mx-auto" />,
    title: 'Private Viewing & Consultation',
    desc: 'For select pieces, we may arrange a private consultation or viewing session.',
  },
  {
    icon: <img src={secureTransactionIcon} alt="Secure Transaction" className="w-12 h-12 mx-auto" />,
    title: 'Secure & Discreet Transaction',
    desc: 'We prioritize confidentiality and ensure that every acquisition is handled with utmost professionalism.',
  },
];

const countryOptions = [
  { code: '+65', label: 'Singapore', flag: '🇸🇬' },
  { code: '+84', label: 'Vietnam', flag: '🇻🇳' },
  { code: '+86', label: 'China', flag: '🇨🇳' },
];

export default function AcquireAnItem() {
  const [country, setCountry] = useState(countryOptions[0]);
  const [phone, setPhone] = useState('');

  return (
    <div className="w-full min-h-screen bg-[#F7F5EA]">
      {/* Hero Section */}
      <div className="w-full bg-[#23211C] py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-center">
          {/* Left */}
          <div className="flex-1 text-white mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-6">Reserve a Timeless Treasure</h1>
            <p className="mb-6 text-base md:text-lg max-w-md">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat morbi euismod.</p>
            <Button text="ACQUIRE AN ITEM" />
          </div>
          {/* Right: Single image */}
          <div className="flex-1">
            <img src={timelessTreasure} alt="Timeless Treasure" className="w-full h-auto object-cover rounded" />
          </div>
        </div>
      </div>

      {/* What Happens Next Section */}
      <div className="max-w-6xl mx-auto py-16 px-4 flex flex-col md:flex-row gap-10 items-center">
        {/* Left: Large image */}
        <div className="flex-1 mb-8 md:mb-0">
          <img src={timelessTreasure} alt="Timeless Treasure" className="w-full h-80 object-cover rounded" />
        </div>
        {/* Right: Steps */}
        <div className="flex-1">
          <h2 className="text-3xl font-serif font-semibold text-[#7B6142] mb-6 text-left">What Happens Next?</h2>
          <div className="flex flex-col gap-10">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="flex flex-col items-start text-left md:flex-row md:items-center md:gap-4"
              >
                <div className="w-12 h-12 flex items-center justify-center mb-4 md:mb-0 md:mr-4">{step.icon}</div>
                <div>
                  <div className="text-lg font-semibold text-[#7B6142] mb-1">{step.title}</div>
                  <div className="text-base text-[#585550]">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Express Interest Section */}
      <div className="max-w-6xl mx-auto py-16 px-4 flex flex-col md:flex-row gap-10 items-center">
        {/* Left: Text */}
        <div className="flex-1 mb-8 md:mb-0">
          <h2 className="text-3xl font-serif font-semibold text-[#7B6142] mb-4">Express Your Interest in a Piece of History</h2>
          <p className="text-base text-[#23211C] mb-4">Owning an antique is more than just possession—it is stewardship of history, a connection to centuries of artistry, and a tribute to a legacy that endures. If a particular piece in our collection has captured your attention, we invite you to take the next step.</p>
          <p className="text-base text-[#23211C]">Each artifact in our curation is unique, often with centuries of history behind it. Due to the rarity and exclusivity of these pieces, availability is limited. To ensure a seamless acquisition process, kindly fill out the form below to express your interest.</p>
        </div>
        {/* Right: Large image */}
        <div className="flex-1">
          <img src={timelessTreasure} alt="Timeless Treasure" className="w-full h-80 object-cover rounded" />
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full bg-[#E6DDC6] py-16 px-4">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-serif font-semibold text-[#7B6142] mb-2 text-center">Secure Your Piece of History</h2>
          <div className="text-base text-[#585550] mb-8 text-center">Fill in your details below, and we will be in touch with you shortly.</div>
          <form className="space-y-6">
            <div>
              <label className="block mb-2 text-[#7B6142] font-semibold">First Name</label>
              <input type="text" className="w-full rounded border border-[#C7C7B9] px-4 py-3 bg-[#F7F5EA] text-[#23211C]" placeholder="Enter your first name" />
            </div>
            <div>
              <label className="block mb-2 text-[#7B6142] font-semibold">Last Name</label>
              <input type="text" className="w-full rounded border border-[#C7C7B9] px-4 py-3 bg-[#F7F5EA] text-[#23211C]" placeholder="Enter your last name" />
            </div>
            <div>
              <label className="block mb-2 text-[#7B6142] font-semibold">Item Code</label>
              <input type="text" className="w-full rounded border border-[#C7C7B9] px-4 py-3 bg-[#F7F5EA] text-[#23211C]" placeholder="Enter item code" />
            </div>
            <div>
              <label className="block mb-2 text-[#7B6142] font-semibold">Contact Number</label>
              <PhoneInput
                country={'sg'}
                value={phone}
                onChange={phone => setPhone(phone)}
                inputClass="w-full rounded border border-[#C7C7B9] px-4 py-3 bg-[#F7F5EA] text-[#23211C]"
                buttonClass="rounded-l border border-[#C7C7B9] bg-[#F7F5EA]"
                dropdownClass="bg-[#F7F5EA] text-[#23211C]"
                searchClass="bg-[#F7F5EA] text-[#23211C] border border-[#C7C7B9]"
                containerClass="phone-input-container"
              />
            </div>
            <div className="w-full">
              <Button
                text="SUBMIT FORM"
                type="submit"
                className="submit-form-btn"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
 