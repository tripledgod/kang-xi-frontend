import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import '../styles/phone-input.css';
import '../styles/submit-form-button.css';
import Button from '../components/Button';
import customerSupportIcon from '../assets/customer_support.svg';
import privateViewingIcon from '../assets/private_viewing.svg';
import secureTransactionIcon from '../assets/secure_transaction.svg';
import timelessTreasure from '../assets/timeless_treasure.png';
import verifyLegacy from '../assets/verify_legacy.png';
import verifyLegacyMobile from '../assets/verify_legacy_mobile.png';
import logoWhite from '../assets/logo_white.png';
import icUpload from '../assets/ic_upload.svg';
import closeCircleBorder from '../assets/close_circle_border.svg';

const whyItems = [
  {
    icon: <img src={customerSupportIcon} alt="Expert Assessment" className="w-12 h-12" />,
    title: 'Expert Assessment',
    desc: 'Our specialists provide a professional evaluation backed by historical research and market knowledge.',
  },
  {
    icon: <img src={privateViewingIcon} alt="Provenance Verification" className="w-12 h-12" />,
    title: 'Provenance Verification',
    desc: 'Confirm the history, origin, and chain of your antique.',
  },
  {
    icon: <img src={secureTransactionIcon} alt="Valuation & Advisory" className="w-12 h-12" />,
    title: 'Valuation & Advisory',
    desc: 'Understand the market value of your piece and explore potential opportunities for listing or acquisition.',
  },
];

export default function AppraiseAnItem() {
  const [phone, setPhone] = useState('');
  const [images, setImages] = useState<File[]>([]);

  return (
    <div className="w-full min-h-screen bg-[#F7F5EA] flex flex-col">
      {/* Hero Section */}
      <div className="w-full bg-[#23211C] flex flex-col items-center justify-center relative">
        <img src={verifyLegacyMobile} alt="Appraise Hero Mobile" className="w-full object-cover object-center block md:hidden" />
        <img src={verifyLegacy} alt="Appraise Hero" className="w-full object-cover object-center hidden md:block" />
      </div>
      {/* Our Services Section */}
      <div className="w-full bg-[#23211C] py-16 flex flex-col items-center justify-center text-center px-4">
        <div className="text-[#E6DDC6] text-xs mb-2 tracking-widest">OUR SERVICES</div>
        <h2 className="text-2xl md:text-3xl font-serif font-semibold text-white mb-6 max-w-2xl mx-auto">With a network of specialists in Chinese antiquities, we provide a meticulous evaluation of your piece—examining craftsmanship, materials, historical context, and provenance to determine its authenticity and significance.</h2>
        <div className="flex flex-col items-center">
          <img src={logoWhite} alt="Kangxi Collection Logo" className="h-14 md:h-20" />
        </div>
      </div>
      {/* Why Authenticate Section */}
      <div className="w-full bg-[#F7F5EA] py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#7B6142] mb-10 text-left max-w-6xl mx-auto">Why Authenticate with Kangxis?</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {whyItems.map((item, idx) => (
            <div key={idx} className="flex flex-col items-left text-left">
              {item.icon}
              <div className="text-lg font-semibold text-[#7B6142] mt-4 mb-2">{item.title}</div>
              <div className="text-base text-[#585550]">{item.desc}</div>
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto">
          <img src={timelessTreasure} alt="Terracotta Army" className="w-full h-80 object-cover rounded" />
        </div>
      </div>
      {/* Submit Form Section */}
      <div className="w-full bg-[#E6DDC6] py-16 px-4">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#7B6142] mb-2 text-center">Submit Your Antique for Authentication</h2>
          <div className="text-base text-[#585550] mb-8 text-center">To begin the authentication process, kindly provide the details below. Our team will review your submission and reach out with the next steps.</div>
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
            <div>
              <label className="block mb-2 text-[#7B6142] font-semibold">Upload Image</label>
              <div
                className="w-full bg-[#FDFBF1] border-2 border-dashed border-[#C7C7B9] rounded-lg flex flex-col items-center justify-center py-8 cursor-pointer transition hover:border-[#7B6142]"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <img src={icUpload} alt="Upload" className="w-8 h-8 mb-2" />
                <div className="font-semibold text-[#23211C] text-center">
                  Drag &amp; Drop or <span className="text-[#83644B] underline cursor-pointer" onClick={e => { e.stopPropagation(); document.getElementById('file-upload')?.click(); }}>Choose file</span> to upload
                </div>
                <div className="text-xs text-[#585550] mt-2 text-center">JPG, GIF or PNG. Max size of 800K</div>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={e => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      setImages(prev => [...prev, ...Array.from(files)]);
                    }
                  }}
                />
              </div>
              {images.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-40 h-40">
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Preview ${idx + 1}`}
                        className="w-40 h-40 object-contain rounded border border-[#C7C7B9] bg-white"
                      />
                      <button
                        type="button"
                        className="absolute -top-3 -right-4 z-10 m-1 p-0 bg-transparent rounded-full hover:scale-110 transition-transform"
                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                        aria-label="Remove image"
                      >
                        <img src={closeCircleBorder} alt="Remove" className="w-6 h-6" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
