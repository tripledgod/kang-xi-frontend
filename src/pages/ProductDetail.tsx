import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import Button from '../components/Button';
import AcquireOrAppraise from '../components/AcquireOrAppraise';
import zoomInIcon from '../assets/zoom_in.svg';
import icCircleLeft from '../assets/ic_circle_left.svg';
import icCircleRight from '../assets/ic_circle_right.svg';
import copyIcon from '../assets/copy.svg';
import closeIcon from '../assets/close.svg';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import '../styles/phone-input.css';

// Mock images for gallery
const gallery = [
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80',
];

const product = {
  title: 'Large Sancai Gazed Peony Plate, Liao Dynasty',
  years: '960 – 1279 (TANG)',
  itemCode: 'T3026023',
  desc: `The Liao Dynasty 907–1125, was an empire in East Asia that ruled over the regions of Manchuria, Mongolia, and parts of northern China proper. It was founded by the Yelü clan of the Khitan people in the same year as Tang Dynasty collapsed (907), even though its first ruler, Yelü Abaoji, did not declare an era name until 916.\n\nAlthough it was originally known as the Empire of the Khitan, the Emperor Yelü Ruan officially adopted the name "Liao" (formally "Great Liao") in 947 (938?). The name "Liao" was dropped in 983, but readopted in 1066. Another name for China in English...`,
};

const relatedProducts = [
  {
    era: 'TANG',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    title: 'A White Glazed Kundika, Late Tang / Five Dynasties Period',
    years: '618 – 960',
    item: 'T302602',
  },
  {
    era: 'TANG',
    image:
      'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    title: 'A Changsha Straw Glazed Pottery Ewer, Tang Dynasty',
    years: '618 – 907',
    item: 'T302601',
  },
  {
    era: 'TANG',
    image:
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    title: 'A Rare Bottom Filling Water Olive Green Glazed Teapot, Five Dynasties of the Period',
    years: '916–1125',
    item: 'L302601',
  },
  {
    era: 'TANG',
    image:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80',
    title: 'A Large Painted Pottery Figure of a Pranking Horse, Tang Dynasty',
    years: '916–1125',
    item: 'L302601',
  },
];

export default function ProductDetail() {
  const { id } = useParams();
  const [mainImg, setMainImg] = useState(gallery[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [descWidth, setDescWidth] = useState<number | undefined>(undefined);
  const descRef = useRef<HTMLDivElement>(null);
  const [showAcquireModal, setShowAcquireModal] = useState(false);
  const [acquireForm, setAcquireForm] = useState({
    firstName: '',
    lastName: '',
    itemCode: product.itemCode,
  });
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (descRef.current) {
      setDescWidth(descRef.current.offsetWidth);
    }
  }, [product.desc]);

  const openModal = (idx: number) => {
    setModalIndex(idx);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const prevImg = () => setModalIndex((i) => (i === 0 ? gallery.length - 1 : i - 1));
  const nextImg = () => setModalIndex((i) => (i === gallery.length - 1 ? 0 : i + 1));

  // Swipe handlers for mobile gallery
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setMobileIndex((i) => (i === gallery.length - 1 ? 0 : i + 1)),
    onSwipedRight: () => setMobileIndex((i) => (i === 0 ? gallery.length - 1 : i - 1)),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(product.itemCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="w-full min-h-screen bg-[#F7F5EA]">
      {/* Show product id for confirmation */}
      <div className="max-w-6xl mx-auto px-4 pt-2 text-xs text-[#888] mb-2">Product ID: {id}</div>
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 pt-6 text-xs text-[#888] mb-4">
        <span>Home</span> <span className="mx-1">&gt;</span> <span>Browse</span>{' '}
        <span className="mx-1">&gt;</span> <span className="text-[#201F1C]">{product.title}</span>
      </div>
      {/* Main Section */}
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-10">
        {/* Left: Gallery */}
        {/* Mobile: Slideshow */}
        <div className="block md:hidden w-full">
          <div className="relative w-full" {...swipeHandlers}>
            <img
              src={gallery[mobileIndex]}
              alt="Main"
              className="object-contain w-full max-h-[340px] bg-white rounded cursor-pointer"
              onClick={() => openModal(mobileIndex)}
            />
            {/* Pagination dots - now positioned over the image */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center gap-2">
              {gallery.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-2 h-2 rounded-full ${mobileIndex === idx ? 'bg-[#7B6142]' : 'bg-white'} transition`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent image click when clicking dots
                    setMobileIndex(idx);
                  }}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
        {/* Desktop: Thumbnails + Main Image */}
        <div className="hidden md:flex flex-col md:flex-row gap-4 md:w-1/2">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-2 md:gap-4 md:w-24">
            {gallery.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="Gallery Thumb"
                className={`w-16 h-16 md:w-20 md:h-20 object-cover rounded cursor-pointer border ${mainImg === img ? 'border-[#7B6142]' : 'border-transparent'}`}
                onClick={() => setMainImg(img)}
                onDoubleClick={() => openModal(idx)}
              />
            ))}
          </div>
          {/* Main Image with Zoom Button */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-full">
              <img
                src={mainImg}
                alt="Main"
                className="object-contain w-full max-h-[400px] bg-white rounded"
              />
              <button
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:scale-110 transition"
                onClick={() => openModal(gallery.indexOf(mainImg))}
                aria-label="Zoom in"
              >
                <img src={zoomInIcon} alt="Zoom In" className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
        {/* Right: Info */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-row justify-between text-xs text-[#23211C] font-semibold items-center">
            <span>{product.years}</span>
            <span className="flex items-center gap-1">
              ITEM CODE {product.itemCode}
              <button
                onClick={handleCopy}
                className="ml-1 p-1 hover:bg-[#E6DDC6] rounded"
                aria-label="Copy Item Code"
              >
                <img src={copyIcon} alt="Copy" className="w-4 h-4" />
              </button>
              {copied && <span className="text-xs text-green-600 ml-1">Copied!</span>}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-medium text-[#61422D] mb-2 leading-tight">
            {product.title}
          </h1>
          <div className="max-w-xl">
            <div className="text-base text-[#2E2A24] font-bold mb-1">Description</div>
            <div
              ref={descRef}
              className="text-lg text-[#585550] mb-4 whitespace-pre-line line-clamp-6"
            >
              {product.desc}
            </div>
            <Button
              text="ACQUIRE THIS ITEM"
              className="submit-form-btn"
              onClick={() => setShowAcquireModal(true)}
            />
          </div>
        </div>
      </div>
      {/* Modal/Lightbox */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          {/* Top center: index */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-60">
            <span className="text-white text-base bg-black/50 rounded px-3 py-1">
              {modalIndex + 1}/{gallery.length}
            </span>
          </div>
          {/* Top right: close button */}
          <div className="absolute top-4 right-4 z-60">
            <button
              className="text-white text-3xl font-bold"
              onClick={closeModal}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          <button
            className="absolute left-8 top-1/2 -translate-y-1/2 bg-transparent rounded-full shadow-none p-2 z-60"
            onClick={prevImg}
            aria-label="Previous"
          >
            <img src={icCircleLeft} alt="Previous" className="w-10 h-10" />
          </button>
          <div className="flex flex-col items-center">
            <img
              src={gallery[modalIndex]}
              alt="Zoomed"
              className="max-h-[90vh] max-w-[98vw] rounded shadow-lg"
            />
          </div>
          <button
            className="absolute right-8 top-1/2 -translate-y-1/2 bg-transparent rounded-full shadow-none p-2 z-60"
            onClick={nextImg}
            aria-label="Next"
          >
            <img src={icCircleRight} alt="Next" className="w-10 h-10" />
          </button>
        </div>
      )}
      {/* Related Products Carousel */}
      <div className="w-full bg-[#F7F5EA] py-16 mt-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-row justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-medium text-[#201F1C]">
              You might be interested
            </h2>
            <button
              className="text-[#020202] text-sm font-semibold hidden md:flex"
              onClick={() => navigate('/browse')}
            >
              VIEW ALL
            </button>
          </div>
          <div className="relative">
            {/* Carousel Arrows */}
            <button className="absolute -left-6 top-3/8 -translate-y-1/2 shadow p-2 z-10 hidden md:block">
              <img src={icCircleLeft} alt="Previous" className="w-8 h-8" />
            </button>
            <div className="overflow-x-auto">
              <div className="flex gap-8">
                {relatedProducts.map((item, idx) => (
                  <div key={idx} className="min-w-[260px] max-w-xs flex flex-col">
                    <div className="bg-[#E6DDC6] aspect-square w-full flex items-center justify-center overflow-hidden mb-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div className="text-xs text-[#7B6142] font-semibold mb-2">{item.era}</div>
                    <div className="text-base font-serif font-medium text-[#61422D] mb-2 leading-snug line-clamp-2 pb-8">
                      {item.title}
                    </div>
                    <div className="flex flex-row justify-between text-xs text-[#585550] font-semibold border-t pt-2 border-[#C7C7B9]">
                      <span>{item.years}</span>
                      <span>ITEM {item.item}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button className="absolute -right-6 top-3/8 -translate-y-1/2 shadow p-2 z-10 hidden md:block">
              <img src={icCircleRight} alt="Next" className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>
      {/* Acquire or Appraise Section */}
      <div className="mt-20">
        <AcquireOrAppraise />
      </div>
      {/* Right-side Acquire Modal */}
      {showAcquireModal && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 transition-opacity duration-300"
            onClick={() => setShowAcquireModal(false)}
          />
          {/* Drawer with slide-in animation */}
          <div className="ml-auto h-full w-full max-w-xl bg-[#F7F5EA] shadow-xl flex flex-col relative transition-transform duration-300 animate-slide-in-right">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 z-10 text-2xl text-[#A4A7AE] hover:text-[#86684A] focus:outline-none"
              onClick={() => setShowAcquireModal(false)}
              aria-label="Close"
            >
              <img src={closeIcon} alt="Close" className="w-4 h-4" />
            </button>
            {/* Form Content */}
            <div className="flex-1 flex flex-col justify-center px-6 py-10">
              <h2 className="text-4xl font-serif font-medium text-[#61422D] mb-4 text-center">
                Secure Your Piece of History
              </h2>
              <div className="text-base text-[#585550] mb-8 text-center">
                Fill in your details below, and we will be in touch with you shortly.
              </div>
              <form className="space-y-6">
                <div>
                  <label className="block mb-2 text-[#1F1F1F] font-medium">First Name</label>
                  <input
                    type="text"
                    className="w-full rounded border border-[#C7C7B9] px-4 py-3 bg-white text-[#23211C]"
                    placeholder="Enter your first name"
                    value={acquireForm.firstName}
                    onChange={(e) => setAcquireForm((f) => ({ ...f, firstName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-[#1F1F1F] font-medium">Last Name</label>
                  <input
                    type="text"
                    className="w-full rounded border border-[#C7C7B9] px-4 py-3 bg-white text-[#23211C]"
                    placeholder="Enter your last name"
                    value={acquireForm.lastName}
                    onChange={(e) => setAcquireForm((f) => ({ ...f, lastName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-[#1F1F1F] font-medium">Item Code</label>
                  <input
                    type="text"
                    className="w-full rounded border border-[#C7C7B9] px-4 py-3 bg-white text-[#23211C]"
                    placeholder="Enter item code"
                    value={acquireForm.itemCode}
                    onChange={(e) => setAcquireForm((f) => ({ ...f, itemCode: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-[#1F1F1F] font-medium">Contact Number</label>
                  <PhoneInput
                    country={'sg'}
                    value={phone}
                    onChange={setPhone}
                    inputClass="w-full rounded border border-[#C7C7B9] px-4 py-3 bg-white text-[#23211C]"
                    buttonClass="rounded-l border border-[#C7C7B9] bg-white"
                    dropdownClass="bg-white text-[#23211C]"
                    searchClass="bg-white text-[#23211C] border border-[#C7C7B9]"
                    containerClass="phone-input-container"
                  />
                </div>
                <div className="w-full pt-2">
                  <Button text="SUBMIT FORM" type="submit" className="submit-form-btn" />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
