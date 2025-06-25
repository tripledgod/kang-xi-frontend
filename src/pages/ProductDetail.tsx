import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { useLoading } from '../hooks/useLoading';
import { useLanguage } from '../contexts/LanguageContext';
import AcquireOrAppraise from '../components/AcquireOrAppraise';
import zoomInIcon from '../assets/zoom_in.svg';
import icCircleLeft from '../assets/ic_circle_left.svg';
import icCircleRight from '../assets/ic_circle_right.svg';
import copyIcon from '../assets/copy.svg';
import closeIcon from '../assets/close.svg';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import '../styles/phone-input.css';

import axios from 'axios';
import { API_URL } from '../utils/constants.ts';
import { getImageUrl, getImagesUrls } from '../utils';
import Popup from '../components/Popup.tsx';

export default function ProductDetail() {
  const { slug } = useParams();
  const [mainImg, setMainImg] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [descWidth, setDescWidth] = useState<number | undefined>(undefined);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const descRef = useRef<HTMLDivElement>(null);
  const [showAcquireModal, setShowAcquireModal] = useState(false);
  const [phone, setPhone] = useState('');
  const { loading, withLoading } = useLoading(true);
  const [error, setError] = useState<string | null>(null);
  const [productDetail, setProductDetail] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [acquireForm, setAcquireForm] = useState({
    firstName: '',
    lastName: '',
    itemCode: '',
  });
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const navigate = useNavigate();
  const { locale } = useLanguage();
  const { t } = useTranslation();
  console.log('ACQUIRE_THIS_ITEM:', t('ACQUIRE_THIS_ITEM'));
  const [descLineCount, setDescLineCount] = useState(0);
  
  // Add validation and loading states
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    itemCode: '',
    phone: '',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Call API to get product detail by slug with locale
        const response = await axios.get(`${API_URL}/api/products`, {
          params: {
            'filters[slug][$eq]': slug,
            locale: locale,
            populate: '*',
          },
        });

        if (response.data && response.data.data && response.data.data.length > 0) {
          const product = response.data.data[0];
          setProductDetail(product);

          // Get main image from images array
          if (product.images && product.images.length > 0) {
            const firstImage = product.images[0];
            const imageUrl = getImageUrl(firstImage);
            setMainImg(imageUrl);
          }

          // Get related products with locale
          let relatedProductsData = [];

          if (product.category?.id || product.category?.data?.id || product.category_id) {
            // If has category, get products from same category
            const categoryId =
              product.category?.id || product.category?.data?.id || product.category_id;

            const relatedResponse = await axios.get(`${API_URL}/api/products`, {
              params: {
                'filters[category][$eq]': categoryId,
                'pagination[pageSize]': 4,
                locale: locale,
                populate: '*',
              },
            });

            if (relatedResponse.data && relatedResponse.data.data) {
              relatedProductsData = relatedResponse.data.data.filter(
                (p: any) => p.id !== product.id
              );
            }
          } else {
            // If no category, get random products
            const randomResponse = await axios.get(`${API_URL}/api/products`, {
              params: {
                'pagination[pageSize]': 4,
                locale: locale,
                populate: '*',
                sort: 'createdAt:desc', // Get latest products
              },
            });

            if (randomResponse.data && randomResponse.data.data) {
              relatedProductsData = randomResponse.data.data.filter(
                (p: any) => p.id !== product.id
              );
            }
          }

          setRelatedProducts(relatedProductsData);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      }
    };

    if (slug) {
      withLoading(fetchProduct);
    }
  }, [slug, locale]); // Re-fetch when locale changes

  useEffect(() => {
    if (descRef.current) {
      setDescWidth(descRef.current.offsetWidth);
      // Đo số dòng thực tế của desc sau khi render
      setTimeout(() => {
        const el = descRef.current;
        if (el) {
          const lineHeight = parseFloat(getComputedStyle(el).lineHeight || '24');
          const lines = Math.round(el.scrollHeight / lineHeight);
          setDescLineCount(lines);
          console.log('descLineCount:', lines, 'desc length:', productDetail?.description?.length);
        }
      }, 0);
    }
  }, [productDetail?.description, isDescriptionExpanded]);

  const openModal = (idx: number) => {
    setModalIndex(idx);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const prevImg = () => {
    const images = productDetail?.images || [];
    setModalIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const nextImg = () => {
    const images = productDetail?.images || [];
    setModalIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  // Swipe handlers for mobile gallery
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      const images = productDetail?.images || [];
      setMobileIndex((i) => (i === images.length - 1 ? 0 : i + 1));
    },
    onSwipedRight: () => {
      const images = productDetail?.images || [];
      setMobileIndex((i) => (i === 0 ? images.length - 1 : i - 1));
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  // Copy to clipboard
  const handleCopy = () => {
    const itemCode = productDetail?.itemCode || productDetail?.documentId || '';

    // Reset both states when starting new copy operation
    setCopied(false);
    setCopyError(null);

    if (navigator.clipboard && window.isSecureContext) {
      // Modern clipboard API
      navigator.clipboard
        .writeText(itemCode)
        .then(() => {
          // Show success message for modern API
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        })
        .catch((err) => {
          console.error('Modern clipboard API failed:', err);
          // Don't show error here, let fallback handle it
          // Fallback to old method
          fallbackCopyTextToClipboard(itemCode);
        });
    } else {
      // Fallback for older browsers
      fallbackCopyTextToClipboard(itemCode);
    }
  };

  const validateForm = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      itemCode: '',
      phone: '',
    };

    if (!acquireForm.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!acquireForm.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!acquireForm.itemCode.trim()) {
      newErrors.itemCode = 'Item code is required';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Contact number is required';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  const submitForm = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/form-acquire`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            firstName: acquireForm.firstName,
            lastName: acquireForm.lastName,
            itemCode: acquireForm.itemCode,
            contactNumber: `+${phone}`,
          },
        }),
      });

      const data = await response.json();
      setShowSuccess(true);
      setShowAcquireModal(false);
      setAcquireForm({ firstName: '', lastName: '', itemCode: '' });
      setPhone('');
      setErrors({ firstName: '', lastName: '', itemCode: '', phone: '' });
    } catch (error) {
      // Could handle error here if needed
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback copy method
  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      } else {
        console.error('Fallback copy failed');
        setCopyError('Copy failed');
        setTimeout(() => setCopyError(null), 3000);
      }
    } catch (err) {
      console.error('Fallback copy error:', err);
      setCopyError('Copy failed');
      setTimeout(() => setCopyError(null), 3000);
    }

    document.body.removeChild(textArea);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5EA] flex items-center justify-center">
        <Loading fullScreen text="Loading..." />
      </div>
    );
  }

  if (error || !productDetail) {
    return (
      <div className="min-h-screen bg-[#F7F5EA] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#61422D] text-lg mb-4">{error || 'Product not found'}</p>
          <button
            onClick={() => navigate('/browse')}
            className="px-4 py-2 bg-[#7B6142] text-white rounded hover:bg-[#6a5437]"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  // Get images for gallery
  const images = productDetail.images || [];
  const imageUrls = getImagesUrls(images);

  return (
    <div className="w-full min-h-screen bg-[#F7F5EA]">
      {/* Show popup when registration is successful */}
      {showSuccess && (
        <Popup
          title="Thank you for contacting us!"
          content="We will  be in  touch with you  shortly."
          buttonText="BACK TO HOMEPAGE"
          onButtonClick={() => {
            setShowSuccess(false);
            navigate('/');
          }}
          onClose={() => setShowSuccess(false)}
        />
      )}
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 pt-6 text-xs text-[#888] mb-4">
        <span>Home</span> <span className="mx-1">&gt;</span> <span>Browse</span>{' '}
        <span className="mx-1">&gt;</span>{' '}
        <span className="text-[#201F1C]">{productDetail.title}</span>
      </div>
      {/* Main Section */}
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-10 items-start">
        {/* Left: Gallery */}
        {/* Mobile: Slideshow */}
        <div className="block md:hidden w-full">
          <div className="relative w-full" {...swipeHandlers}>
            <img
              src={imageUrls[mobileIndex] || mainImg}
              alt={productDetail.title}
              className="object-contain w-full max-h-[340px] bg-white rounded cursor-pointer"
              onClick={() => openModal(mobileIndex)}
            />
            {/* Pagination dots - now positioned over the image */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center gap-2">
              {imageUrls.map((_: string, idx: number) => (
                <button
                  key={idx}
                  className={`w-2 h-2 rounded-full ${mobileIndex === idx ? 'bg-[#7B6142]' : 'bg-white'} transition`}
                  onClick={(e: React.MouseEvent) => {
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
        <div className="hidden md:flex flex-col md:flex-row gap-4 md:w-1/2 h-[400px] flex-shrink-0">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-2 md:gap-4 md:w-24">
            {imageUrls.map((img: string, idx: number) => (
              <img
                key={idx}
                src={img}
                alt={`Gallery Thumb ${idx + 1}`}
                className={`w-16 h-16 md:w-20 md:h-20 object-cover rounded cursor-pointer border border-[#7B6142]`}
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
                alt={productDetail.title}
                className="object-contain w-full max-h-[400px] bg-white rounded"
              />
              <button
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:scale-110 transition"
                onClick={() => openModal(0)}
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
            <span>
              {productDetail.ageFrom} - {productDetail.ageTo}
              {productDetail.category?.name && (
                <span> ({productDetail.category.name})</span>
              )}
            </span>
            <span className="flex items-center gap-1">
              ITEM CODE {productDetail.itemCode || productDetail.documentId}
              <button
                onClick={handleCopy}
                className="ml-1 p-1 hover:bg-[#E6DDC6] rounded transition-colors duration-200"
                aria-label="Copy Item Code"
                title="Copy item code to clipboard"
              >
                <img src={copyIcon} alt="Copy" className="w-4 h-4" />
              </button>
              {copied && <span className="text-xs text-green-600 ml-1 font-medium">Copied!</span>}
              {copyError && !copied && (
                <span className="text-xs text-red-600 ml-1 font-medium">{copyError}</span>
              )}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-medium text-[#61422D] mb-2 leading-tight">
            {productDetail.title}
          </h1>
          <div className="max-w-xl">
            <div className="text-base text-[#2E2A24] font-bold mb-1">Description</div>
            <div
              ref={descRef}
              className={`text-lg text-[#585550] mb-4 whitespace-pre-line ${
                !isDescriptionExpanded ? 'line-clamp-6' : ''
              }`}
            >
              {productDetail.description}
            </div>
            {productDetail.description && (descLineCount > 6 || productDetail.description.length > 300) && (
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="text-[#7B6142] font-medium hover:text-[#61422D] transition-colors mb-4"
              >
                {isDescriptionExpanded ? t('READ_LESS') : t('READ_MORE')}
              </button>
            )}
            <Button
              text={t('ACQUIRE_THIS_ITEM')}
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
              {modalIndex + 1}/{imageUrls.length}
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
              src={imageUrls[modalIndex]}
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
      {(() => {
        return relatedProducts.length > 0;
      })() && (
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
                {t('VIEW_ALL')}
              </button>
            </div>
            <div className="relative">
              {/* Carousel Arrows */}
              <button className="absolute -left-6 top-3/8 -translate-y-1/2 rounded-full  p-2  z-10 hidden md:block">
                <img src={icCircleLeft} alt="Previous" className="w-8 h-8" />
              </button>
              <div className="overflow-x-auto">
                <div className="flex gap-8">
                  {relatedProducts.map((item: any, idx: number) => {
                    const relatedImageUrl =
                      item.images && item.images.length > 0 ? getImageUrl(item.images[0]) : '';
                    return (
                      <div
                        key={item.id}
                        className="min-w-[260px] max-w-xs flex flex-col cursor-pointer hover:shadow-lg transition-shadow rounded"
                        onClick={() => navigate(`/products/${item.slug}`)}
                      >
                        <div className="bg-[#E6DDC6] aspect-square w-full flex items-center justify-center overflow-hidden mb-4">
                          {relatedImageUrl ? (
                            <img
                              src={relatedImageUrl}
                              alt={item.title}
                              className="object-contain w-full h-full"
                            />
                          ) : (
                            <div className="text-[#61422D] text-center">
                              <div className="text-4xl mb-2 opacity-50">🏺</div>
                              <div className="text-xs">No Image</div>
                            </div>
                          )}
                        </div>
                        <h2 className="text-base font-serif font-semibold text-[#61422D] mb-2 leading-snug line-clamp-3 min-h-[72px]">
                          {item.title}
                        </h2>
                        <div className="border-t-2 border-[#E5E1D7] opacity-80 my-3"></div>
                        <div className="flex flex-row justify-between text-xs text-[#585550] font-semibold">
                          <span>
                            {item.ageFrom} - {item.ageTo}
                          </span>
                          <span>ITEM {item.itemCode || item.documentId}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <button className="absolute -right-6 top-3/8 -translate-y-1/2 rounded-full  p-2 z-10 hidden md:block">
                <img src={icCircleRight} alt="Next" className="w-8 h-8" />
              </button>
            </div>
          </div>
        </div>
      )}
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
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  submitForm();
                }}
              >
                <div>
                  <label className="block mb-2 text-[#1F1F1F] font-medium">First Name</label>
                  <input
                    type="text"
                    className={`w-full rounded border px-4 py-3 bg-white text-[#23211C] ${
                      errors.firstName ? 'border-red-500' : 'border-[#C7C7B9]'
                    }`}
                    placeholder="Enter your first name"
                    value={acquireForm.firstName}
                    onChange={(e) => {
                      setAcquireForm((f) => ({ ...f, firstName: e.target.value }));
                      if (errors.firstName) {
                        setErrors((prev) => ({ ...prev, firstName: '' }));
                      }
                    }}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block mb-2 text-[#1F1F1F] font-medium">Last Name</label>
                  <input
                    type="text"
                    className={`w-full rounded border px-4 py-3 bg-white text-[#23211C] ${
                      errors.lastName ? 'border-red-500' : 'border-[#C7C7B9]'
                    }`}
                    placeholder="Enter your last name"
                    value={acquireForm.lastName}
                    onChange={(e) => {
                      setAcquireForm((f) => ({ ...f, lastName: e.target.value }));
                      if (errors.lastName) {
                        setErrors((prev) => ({ ...prev, lastName: '' }));
                      }
                    }}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
                <div>
                  <label className="block mb-2 text-[#1F1F1F] font-medium">Item Code</label>
                  <input
                    type="text"
                    className={`w-full rounded border px-4 py-3 bg-white text-[#23211C] ${
                      errors.itemCode ? 'border-red-500' : 'border-[#C7C7B9]'
                    }`}
                    placeholder="Enter item code"
                    value={acquireForm.itemCode}
                    onChange={(e) => {
                      setAcquireForm((f) => ({ ...f, itemCode: e.target.value }));
                      if (errors.itemCode) {
                        setErrors((prev) => ({ ...prev, itemCode: '' }));
                      }
                    }}
                  />
                  {errors.itemCode && <p className="text-red-500 text-sm mt-1">{errors.itemCode}</p>}
                </div>
                <div>
                  <label className="block mb-2 text-[#1F1F1F] font-medium">Contact Number</label>
                  <PhoneInput
                    country={'sg'}
                    value={phone}
                    onChange={(value) => {
                      setPhone(value);
                      if (errors.phone) {
                        setErrors((prev) => ({ ...prev, phone: '' }));
                      }
                    }}
                    inputClass={`w-full rounded border px-4 py-3 bg-white text-[#23211C] ${
                      errors.phone ? 'border-red-500' : 'border-[#C7C7B9]'
                    }`}
                    buttonClass="rounded-l border border-[#C7C7B9] bg-white"
                    dropdownClass="bg-white text-[#23211C]"
                    searchClass="bg-white text-[#23211C] border border-[#C7C7B9]"
                    containerClass="phone-input-container"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div className="w-full pt-2">
                  <Button
                    text={isLoading ? t('SUBMITTING') : t('SUBMIT_FORM')}
                    type="submit"
                    className="submit-form-btn"
                    disabled={isLoading}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {isLoading && <Loading fullScreen={true} text="Submitting your request..." />}
    </div>
  );
}
