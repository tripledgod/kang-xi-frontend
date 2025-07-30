import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import Button from '../components/Button';
import Loading from '../components/Loading';
import PhoneInput from '../components/PhoneInput';
import { useLoading } from '../hooks/useLoading';
import { useLanguage } from '../contexts/LanguageContext';
import AcquireOrAppraise from '../components/AcquireOrAppraise';
import zoomInIcon from '../assets/zoom_in.svg';
import icCircleLeft from '../assets/ic_circle_left.svg';
import icCircleRight from '../assets/ic_circle_right.svg';
import copyIcon from '../assets/copy.svg';
import closeIcon from '../assets/close.svg';
import '../styles/phone-input.css';

import axios from 'axios';
import { API_URL } from '../utils/constants.ts';
import { getImageUrl, getImagesUrls, validatePhoneNumber } from '../utils';
import Popup from '../components/Popup.tsx';
import logo from '../assets/logo.png';

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
  const [descLineCount, setDescLineCount] = useState(0);
  const [showReadMore, setShowReadMore] = useState(false);

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

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [slug]);

  // Measure description lines only when description changes
  useEffect(() => {
    if (descRef.current) {
      const el = descRef.current;
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight || '24');
      const lines = Math.round(el.scrollHeight / lineHeight);
      setDescLineCount(lines);
      setShowReadMore(lines > 9);
    } else {
      setShowReadMore(false);
    }
    setIsDescriptionExpanded(false); // Reset expand state when product changes
  }, [productDetail?.description]);

  // Auto-fill Item Code when opening Acquire form or when productDetail changes
  useEffect(() => {
    if (showAcquireModal && productDetail) {
      setAcquireForm((prev) => ({
        ...prev,
        itemCode: productDetail.itemCode || productDetail.documentId || '',
      }));
    }
  }, [showAcquireModal, productDetail]);

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
    } else {
      // Validate phone number format using utility function
      if (!validatePhoneNumber(phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  const submitForm = async () => {
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    setIsLoading(true);
    console.log('Submitting form with data:', {
      firstName: acquireForm.firstName,
      lastName: acquireForm.lastName,
      itemCode: acquireForm.itemCode,
      contactNumber: phone,
    });

    try {
      const requestBody = {
        data: {
          firstName: acquireForm.firstName,
          lastName: acquireForm.lastName,
          itemCode: acquireForm.itemCode,
          contactNumber: phone, // Phone already includes country code from PhoneInput
        },
      };

      console.log('Sending request to:', `${API_URL}/api/form-acquire`);
      console.log('Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(`${API_URL}/api/form-acquire`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('API Success Response:', data);
      
      setShowSuccess(true);
      setShowAcquireModal(false);
      setAcquireForm({ firstName: '', lastName: '', itemCode: '' });
      setPhone('');
      setErrors({ firstName: '', lastName: '', itemCode: '', phone: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      // Show error message to user
      alert(`Failed to submit form: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

  // Render description as paragraphs to preserve spacing
  const renderDescriptionParagraphs = (desc: string) => {
    const paragraphs = desc.split(/\n|\r\n/);
    return paragraphs.map((para, idx) => (
      <p key={idx} style={{ marginBottom: 12 }}>
        {para}
      </p>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5EA] flex items-center justify-center">
        <Loading fullScreen={true} text="Loading..." />
      </div>
    );
  }

  if (error || !productDetail) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
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

  // Show only the first 500 characters of description if not expanded
  const MAX_DESCRIPTION_LENGTH = 500;
  const description = productDetail?.description || '';
  const isLongDescription = description.length > MAX_DESCRIPTION_LENGTH;
  const displayedDescription =
    !isDescriptionExpanded && isLongDescription
      ? description.slice(0, MAX_DESCRIPTION_LENGTH) + '...'
      : description;

  return (
    <div className="w-full min-h-screen bg-[#F7F3E8]  ">
      {/* Show popup when registration is successful */}
      {showSuccess && (
        <Popup
          title={`Thank you for\n contacting us`}
          titleClassName="md:text-[40px] md:leading-[48px] text-[30px] leading-[36px]"
          containerClassName=" md:h-[300px] h-[274px] "
          content="We will  be in  touch with you  shortly."
          buttonText="BACK TO HOMEPAGE"
          onButtonClick={() => {
            setShowSuccess(false);
            navigate('/');
          }}
          onClose={() => setShowSuccess(false)}
        />
      )}

      <div className="w-full border-t border-[#E8DBC0]" />
      {/* Breadcrumb */}
      <div className="w-full px-4 pt-6 text-xs text-[#817F7C] pb-5 md:px-[112px]  md:pb-[48px] font-semibold">
        <span 
          className="cursor-pointer hover:text-[#61422D] transition-colors"
          onClick={() => navigate('/')}
        >
          Home
        </span> <span className="mx-1">&gt;</span> <span 
          className="cursor-pointer hover:text-[#61422D] transition-colors"
          onClick={() => navigate('/browse')}
        >
          Browse
        </span>{' '}
        <span className="mx-1">&gt;</span>{' '}
        <span className="text-[#201F1C] truncate max-w-[220px] md:max-w-full md:truncate-none inline-block align-bottom">
          {productDetail.title}
        </span>
      </div>
      {/* Main Section */}
      <div className="w-full flex flex-col md:flex-row gap-10 md:items-start items-start md:px-[112px] pb-8 md:pb-22">
        {/* Thumbnails (desktop only) */}
        <div className="hidden md:flex flex-col gap-4 w-[109px] flex-shrink-0">
          {imageUrls.map((img: string, idx: number) => (
            <img
              key={idx}
              src={img}
              alt={`Gallery Thumb ${idx + 1}`}
              className={`w-[109px] h-[109px] object-cover cursor-pointer ${mainImg === img ? 'border border-[1px] border-[#61422D]' : 'border-none'}`}
              onClick={() => setMainImg(img)}
              onDoubleClick={() => openModal(idx)}
            />
          ))}
        </div>
        {/* Main Image */}
        <div className="md:flex-shrink-0 md:flex md:items-start md:justify-center md:w-[539px] md:h-[636px] w-full">
          <div className="relative bg-[#F7F3E8] w-full md:h-full flex items-start justify-center">
            <img
              src={mainImg}
              alt={productDetail.title}
              className="object-contain object-top w-full md:h-full"
            />
            {/* Pagination dots for mobile - overlay on image */}
            <div className="md:hidden absolute left-1/2 -translate-x-1/2 bottom-2 flex flex-row gap-2 z-10 pb-1 items-center">
              {imageUrls.map((_, idx) => (
                <button
                  key={idx}
                  className={`rounded-full transition ${mainImg === imageUrls[idx] ? 'w-2 h-2 bg-[#61422D] opacity-100' : 'w-1.5 h-1.5 bg-[#201F1C] opacity-40'}`}
                  onClick={() => setMainImg(imageUrls[idx])}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
            <button
              className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:scale-110 transition md:block hidden"
              onClick={() => openModal(0)}
              aria-label="Zoom in"
            >
              <img src={zoomInIcon} alt="Zoom In" className="w-6 h-6" />
            </button>
          </div>
        </div>
        {/* Product content, always visible */}
        <div className="flex-1 md:pl-12 flex flex-col gap-4 md:min-h-[636px] md:px-0 px-4">
          <div className="flex flex-row justify-between text-[14px]  text-[#585550] leading-[20px] font-semibold items-center">
            <span>
              {productDetail.ageFrom} - {productDetail.ageTo}
              {productDetail.category?.name && (
                <span className="uppercase"> ({productDetail.category.name})</span>
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
          <h4 className="text-[26px] md:text-[32px] leading-[34px] md:leading-[40px] font-serif font-medium text-[#61422D] pb-1 ">
            {productDetail.title}
          </h4>
          <div className="max-w-xl">
            <div className="text-[14px] leading-[20px] text-[#2E2A24] font-semibold mb-2">
              Description
            </div>
            <div id="product-description" className="text-[16px] leading-[24px] text-[#585550]">
              {renderDescriptionParagraphs(displayedDescription)}
            </div>
            {isLongDescription && (
              <button
                onClick={() => setIsDescriptionExpanded((prev) => !prev)}
                className="text-[#201F1C] uppercase  text-[14px] leading-[20px] font-semibold"
              >
                {isDescriptionExpanded ? 'Read Less' : 'Read More'}
              </button>
            )}
            <Button
              text={t('ACQUIRE_THIS_ITEM')}
              className="submit-form-btn mt-[34px] md:mt-10"
              onClick={() => setShowAcquireModal(true)}
            />
          </div>
        </div>
      </div>
      {/* Modal/Lightbox */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={closeModal}>
          {/* Top center: index */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-60">
            <span className="text-white text-base bg-black/50 rounded px-3 py-1">
              {modalIndex + 1}/{imageUrls.length}
            </span>
          </div>
          {/* Top right: close button */}
          <div className="absolute top-4 right-4 z-60">
            <button
              className="text-white text-3xl font-semibold"
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
          <div className="flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
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
        <div className="w-full bg-[#FAF7F2] py-8 md:py-20 ">
          <div className="w-full md:px-[112px] px-4">
            <div className="flex flex-row justify-between items-center mb-8">
              <h4 className="text-[26px] md:text-[32px] leading-[34px] md:leading-[40px] font-serif font-semibold text-[#201F1C]  md:pb-4 md:pt-0">
                You might be interested
              </h4>
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
                        <div className="text-[#585550] text-[14px] leading-[20px] font-semibold uppercase mb-2">
                          {item.category.name}
                        </div>
                        <h5 className="text-[20px]  md:text-[24px] md:leading-[32px] leading-[28px]font-serif font-semibold text-[#61422D] mb-4 md:pb-8 pb-7 leading-snug line-clamp-3 min-h-[72px]">
                          {item.title}
                        </h5>
                        <div className="border-t-2 border-[#E5E1D7] opacity-80 mb-2"></div>
                        <div className="flex flex-col gap-1 text-[14px] leading-[20px] text-[#585550] font-semibold">
                          <div className="flex flex-row justify-between">
                            <span>
                              {item.ageFrom} - {item.ageTo}
                            </span>
                            <span>ITEM {item.itemCode || item.documentId}</span>
                          </div>
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
      <div className="mt-8 md:mt-0">
        <AcquireOrAppraise />
      </div>
      {/* Right-side Acquire Modal */}
      {showAcquireModal && (
        <>
          {/* Backdrop for mobile */}
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setShowAcquireModal(false)} />
          
          {/* Modal for mobile, sidebar for desktop */}
          <div className="fixed inset-0 z-50 flex md:inset-auto md:right-0 md:top-0 md:bottom-0 md:w-auto">
            {/* Modal Header with Logo for mobile */}
            <div className="w-full max-w-xl bg-[#F7F5EA] shadow-xl flex flex-col relative h-full ml-auto">
              <button
                className="hidden md:block absolute top-4 right-4 p-2 z-20 hover:bg-[#E6DDC6] rounded transition-colors"
                onClick={() => setShowAcquireModal(false)}
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-[#A4A7AE]"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex items-center justify-between px-4 py-3 h-16 md:hidden bg-[#F7F5EA] sticky top-0 z-10">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-10 w-[193px]"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/')}
                />
                <button className="p-2" onClick={() => setShowAcquireModal(false)} aria-label="Close">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-[#101828]"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Scrollable form content for mobile */}
              <div className="flex-1 overflow-y-auto px-6 py-10">
                <h3 className=" font-serif text-[28px] leading-[32px] md:text-[40px] md:leading-[48px] font-semibold text-[#61422D] mb-4 text-center">
                  Secure Your Piece of History
                </h3>
                <div className="text-[20px] leading-[28px] text-[#6D6A66] mb-8 text-center font-normal">
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
                    <label className="block mb-2 text-[#1F1F1F] font-normal text-[14px] leading-[20px]">
                      First Name
                    </label>
                    <input
                      type="text"
                      className={`w-full rounded-lg border px-4 py-3 bg-[#FCFAF2] text-[#23211C] ${
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
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 text-[#1F1F1F] font-normal text-[14px] leading-[20px]">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className={`w-full rounded-lg border px-4 py-3 bg-[#FCFAF2] text-[#23211C] ${
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
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 text-[#1F1F1F] font-normal text-[14px] leading-[20px]">
                      Item Code
                    </label>
                    <input
                      type="text"
                      className={`w-full rounded-lg border px-4 py-3 bg-[#FCFAF2] text-[#23211C] ${
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
                    {errors.itemCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.itemCode}</p>
                    )}
                  </div>
                  <div>
                    <PhoneInput
                      label="Contact Number"
                      country="sg"
                      value={phone}
                      onChange={(value) => {
                        setPhone(value);
                        if (errors.phone) {
                          setErrors((prev) => ({ ...prev, phone: '' }));
                        }
                      }}
                      error={errors.phone}
                      required
                      placeholder="Enter your contact number"
                    />
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
        </>
      )}
      {isLoading && <Loading fullScreen={true} text="Submitting your request..." />}
    </div>
  );
}
