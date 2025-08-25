import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import '../styles/phone-input.css';
import '../styles/submit-form-button.css';
import Button from '../components/Button';
import Loading from '../components/Loading';
import customerSupportIcon from '../assets/customer_support.svg';
import privateViewingIcon from '../assets/private_viewing.svg';
import secureTransactionIcon from '../assets/secure_transaction.svg';
// import timelessTreasure from '../assets/timeless_treasure.png';
import bgButtonMobile from '../assets/bg_button.png';
import verifyLegacy from '../assets/verify_legacy.png';
import verifyLegacyMobile from '../assets/verify_legacy_mobile.png';
import logoWhite from '../assets/logo_white.png';
import icUpload from '../assets/ic_upload.svg';
import closeCircleBorder from '../assets/close_circle_border.svg';
import Popup from '../components/Popup';
import { ACCESS_TOKEN, API_URL } from '../utils/constants';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import terracotaImg from '../assets/terracota.jpg';
import bgButtonHover from '../assets/bg_button_hover.png';
import bgButtonPressed from '../assets/bg_button_pressed.png';
import bgButtonMobilePressed from '../assets/bg_button_mobile_pressed.png';

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
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [appraiseForm, setAppraiseForm] = useState({
    firstName: '',
    lastName: '',
    itemCode: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    itemCode: '',
    phone: '',
    images: '',
  });

  const formRef = React.useRef<HTMLDivElement>(null);

  const handleScrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const validateImageFile = (file: File): string | null => {
    // Check file format
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/gif', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return 'Only JPG, GIF or PNG files are allowed';
    }

    // Check file size (800KB = 800 * 1024 bytes)
    const maxSize = 800 * 1024; // 800KB
    if (file.size > maxSize) {
      return 'File size must be less than 800KB';
    }

    return null;
  };

  const validateForm = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      itemCode: '',
      phone: '',
      images: '',
    };

    if (!appraiseForm.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!appraiseForm.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!appraiseForm.itemCode.trim()) {
      newErrors.itemCode = 'Item code is required';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Contact number is required';
    }

    if (images.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  const submitForm = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSubmitError('');

    try {
      // 1. Upload images
      const bodyFormData = new FormData();
      images.forEach((img) => {
        bodyFormData.append('files', img);
      });
      bodyFormData.append('ref', 'api::submissions.submissions');
      bodyFormData.append('field', 'images');

      const responseUploadImage = await axios({
        method: 'post',
        url: `${API_URL}/api/upload`,
        data: bodyFormData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      });

      const images1 = responseUploadImage.data.map((i: any) => i['id']);

      // 2. Submit form data with image IDs
      const submissionData = {
        data: {
          firstName: appraiseForm.firstName,
          lastName: appraiseForm.lastName,
          itemCode: appraiseForm.itemCode,
          images: images1,
          contactNumber: `+${phone}`,
        },
      };

      await axios(`${API_URL}/api/submission`, {
        method: 'POST',
        data: submissionData,
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      });

      setShowSuccess(true);
      setAppraiseForm({ firstName: '', lastName: '', itemCode: '' });
      setPhone('');
      setImages([]);
      setErrors({ firstName: '', lastName: '', itemCode: '', phone: '', images: '' });
    } catch (err) {
      console.error('=== SUBMISSION ERROR ===');
      console.error('Error details:', err);
      if (axios.isAxiosError(err)) {
        console.error('Response status:', err.response?.status);
        console.error('Response data:', err.response?.data);
        console.error('Request config:', err.config);
      }
      setSubmitError(
        err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F7F5EA] flex flex-col">
      {/* Hero Section */}
      <div className="w-full  bg-[#23211C] flex flex-col items-center justify-center relative">
        <img
          src={verifyLegacyMobile}
          alt="Appraise Hero Mobile"
          className="w-full object-cover h-[675px] object-center block md:hidden"
        />
        <img
          src={verifyLegacy}
          alt="Appraise Hero"
          className="w-full object-cover object-center hidden md:block"
        />
        <div className="absolute inset-0 bg-black opacity-40 z-10"></div>
        {/* Overlay content: Title & Description */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center md:px-4 px-6 pointer-events-none z-10">
          <h3 className="block md:hidden text-white font-serif text-[40px] leading-[48px] mb-5 pointer-events-auto">
            Verify the <br /> Legacy of Your <br /> Antique
          </h3>
          <h1 className="hidden md:block text-white font-serif text-[60px] leading-[72px] drop-shadow-lg mb-5 pointer-events-auto">
            Verify the Legacy of
            <br />
            Your Antique
          </h1>
          <p className="text-white text-[18px] leading-[26px] max-w-2xl md:max-w-[664px] mx-auto opacity-90 mb-5 pointer-events-auto">
            Antiques carry history, but true value lies in authenticity. Whether you have inherited
            a piece, discovered a rare find, or wish to confirm the provenance of your artifact,
            Kangxis offers expert authentication services to help you uncover the true story behind
            your antique
          </p>
          <div className="pointer-events-auto md:mt-7 mt-12">
            <button
              type="submit"
              onClick={handleScrollToForm}
              className="flex h-[48px] font-semibold w-[189px] items-center justify-center text-[14px] leading-[20px] shadow-none px-6 custom-button cursor-pointer"
              onMouseEnter={(e) => {
                // Desktop hover only
                e.currentTarget.style.backgroundImage = `url(${bgButtonHover})`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundImage = `url(${bgButtonMobile})`;
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.backgroundImage = `url(${bgButtonPressed})`;
              }}
              onMouseUp={(e) => {
                // Return to default on mouse up to avoid hover state on touch devices
                e.currentTarget.style.backgroundImage = `url(${bgButtonMobile})`;
              }}
              onTouchStart={(e) => {
                e.currentTarget.style.backgroundImage = `url(${bgButtonMobilePressed})`;
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.backgroundImage = `url(${bgButtonMobile})`;
              }}
              style={{
                backgroundImage: `url(${bgButtonMobile})`,
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                color: '#fff',
              }}
            >
              APPRAISE AN ITEM
            </button>
          </div>
        </div>
      </div>
      {/* Our Services Section */}
      <div className="w-full bg-[#23211C] py-16 flex flex-col items-center justify-center text-center px-4">
        <div className="text-[#F7F3E8] text-[14px] leading-[20px] mb-2 tracking-widest  font-semibold">
          OUR SERVICES
        </div>
        <h4 className="hidden md:block text-[32px]  leading-[40px] font-serif text-white mb-6 max-w-2xl mx-auto">
          With a network of specialists in Chinese antiquities, we provide a meticulous evaluation
          of your piece—examining craftsmanship, materials, historical context, and provenance to
          determine its authenticity and significance.
        </h4>
        <h5 className="block md:hidden text-[24px]  leading-[32px]  font-serif text-white mb-6 max-w-2xl mx-auto">
          With a network of specialists in Chinese antiquities, we provide a meticulous evaluation
          of your piece—examining craftsmanship, materials, historical context, and provenance to
          determine its authenticity and significance.
        </h5>
        <div className="flex flex-col items-center">
          <img src={logoWhite} alt="Kangxi Collection Logo" className="h-14 md:h-20" />
        </div>
      </div>
      {/* Why Authenticate Section */}
      <div className="w-full bg-[#F7F5EA] py-12 px-4 md:py-28">
        <h3 className="hidden md:block text-[40px] leading-[48px] font-serif text-[#61422D] mb-10 text-left max-w-7xl mx-auto">
          Why Authenticate with Kangxis?
        </h3>
        <h4 className="block md:hidden text-[32px] leading-[40px] font-serif text-[#61422D] mb-10 text-left max-w-7xl mx-auto">
          Why Authenticate with Kangxis?
        </h4>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mb-12 md:mb-28">
          {whyItems.map((item, idx) => (
            <div key={idx} className="flex flex-col items-left text-left">
              {item.icon}
              <h5 className="text-[24px] leading-[32px] text-[#61422D] mt-4 mb-2">{item.title}</h5>
              <div className="text-base text-[#6D6A66]">{item.desc}</div>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto">
          <img
            src={terracotaImg}
            alt="Terracotta Army"
            className="w-full md:h-140 h-[229px] object-cover "
          />
        </div>
      </div>
      {/* Submit Form Section */}
      <div ref={formRef} className="w-full bg-[#E6DDC6] py-16 px-4">
        <div className="max-w-xl mx-auto">
          <h3 className="hidden md:block text-[40px] leading-[48px]  font-serif text-[#61422D] mb-2 text-center">
            Submit Your Antique for Authentication
          </h3>
          <h4 className="block md:hidden text-[32px] leading-[40px] font-serif text-[#61422D] mb-2 text-center">
            Submit Your Antique for Authentication
          </h4>
          <div className="text-[20px] leading-[28px] text-[#585550] mb-8 text-center">
            To begin the authentication process, kindly provide the details below. Our team will
            review your submission and reach out with the next steps.
          </div>
          <form className="space-y-6" onSubmit={submitForm}>
            <div>
              <label className="block mb-2 text-[#1F1F1F]  text-[14px] leading-[20px] ">
                First Name
              </label>
              <input
                type="text"
                className={`w-full rounded border px-4 py-3 bg-[#F7F5EA] text-[#23211C] ${
                  errors.firstName ? 'border-red-500' : 'border-[#C7C7B9]'
                }`}
                placeholder="Enter your first name"
                value={appraiseForm.firstName}
                onChange={(e) => {
                  setAppraiseForm((f) => ({ ...f, firstName: e.target.value }));
                  if (errors.firstName) {
                    setErrors((prev) => ({ ...prev, firstName: '' }));
                  }
                }}
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block mb-2 text-[#1F1F1F]  text-[14px] leading-[20px] ">
                Last Name
              </label>
              <input
                type="text"
                className={`w-full rounded border px-4 py-3 bg-[#F7F5EA] text-[#23211C] ${
                  errors.lastName ? 'border-red-500' : 'border-[#C7C7B9]'
                }`}
                placeholder="Enter your last name"
                value={appraiseForm.lastName}
                onChange={(e) => {
                  setAppraiseForm((f) => ({ ...f, lastName: e.target.value }));
                  if (errors.lastName) {
                    setErrors((prev) => ({ ...prev, lastName: '' }));
                  }
                }}
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
            <div>
              <label className="block mb-2 text-[#1F1F1F]  text-[14px] leading-[20px] ">
                Item Code
              </label>
              <input
                type="text"
                className={`w-full rounded border px-4 py-3 bg-[#F7F5EA] text-[#23211C] ${
                  errors.itemCode ? 'border-red-500' : 'border-[#C7C7B9]'
                }`}
                placeholder="Enter item code"
                value={appraiseForm.itemCode}
                onChange={(e) => {
                  setAppraiseForm((f) => ({ ...f, itemCode: e.target.value }));
                  if (errors.itemCode) {
                    setErrors((prev) => ({ ...prev, itemCode: '' }));
                  }
                }}
              />
              {errors.itemCode && <p className="text-red-500 text-sm mt-1">{errors.itemCode}</p>}
            </div>
            <div>
              <label className="block mb-2 text-[#1F1F1F]  text-[14px] leading-[20px]">
                Contact Number
              </label>
              <PhoneInput
                country={'sg'}
                value={phone}
                onChange={(value) => {
                  setPhone(value);
                  if (errors.phone) {
                    setErrors((prev) => ({ ...prev, phone: '' }));
                  }
                }}
                inputClass={`w-full rounded border px-4 py-3 bg-[#F7F5EA] text-[#23211C] ${
                  errors.phone ? 'border-red-500' : 'border-[#C7C7B9]'
                }`}
                buttonClass="rounded-l border border-[#C7C7B9] bg-[#F7F5EA]"
                dropdownClass="bg-[#F7F5EA] text-[#23211C]"
                searchClass="bg-[#F7F5EA] text-[#23211C] border border-[#C7C7B9]"
                containerClass="phone-input-container"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block mb-2 text-[#1F1F1F]  text-[14px] leading-[20px]">
                Upload Image
              </label>
              <div
                className={`w-full bg-[#FDFBF1] border-2 border-dashed rounded-lg flex flex-col items-center justify-center py-8 cursor-pointer transition hover:border-[#7B6142] ${
                  errors.images ? 'border-red-500' : 'border-[#C7C7B9]'
                }`}
                onClick={() => document.getElementById('file-upload')?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  const files = Array.from(e.dataTransfer.files);
                  if (files.length > 0) {
                    const invalidFiles: string[] = [];

                    // Validate each file
                    files.forEach((file) => {
                      const error = validateImageFile(file);
                      if (error) {
                        invalidFiles.push(`${file.name}: ${error}`);
                      }
                    });

                    if (invalidFiles.length > 0) {
                      // Show error for invalid files
                      setErrors((prev) => ({
                        ...prev,
                        images: invalidFiles.join('; '),
                      }));
                      return;
                    }

                    // Add valid files
                    setImages((prev) => [...prev, ...files]);
                    if (errors.images) {
                      setErrors((prev) => ({ ...prev, images: '' }));
                    }
                  }
                }}
              >
                <img src={icUpload} alt="Upload" className="w-[19px] h-[23px] mb-2" />
                <div className="text-[#2E2A24] text-[14px] leading-[20px] text-center">
                  Drag &amp; Drop or{' '}
                  <span
                    className="text-[#BE9051] underline cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById('file-upload')?.click();
                    }}
                  >
                    Choose file
                  </span>{' '}
                  to upload
                </div>
                <div className="text-xs text-[#6D6A66] mt-2 text-center">
                  JPG, GIF or PNG. Max size of 800Kb
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      const fileArray = Array.from(files);
                      const invalidFiles: string[] = [];

                      // Validate each file
                      fileArray.forEach((file) => {
                        const error = validateImageFile(file);
                        if (error) {
                          invalidFiles.push(`${file.name}: ${error}`);
                        }
                      });

                      if (invalidFiles.length > 0) {
                        // Show error for invalid files
                        setErrors((prev) => ({
                          ...prev,
                          images: invalidFiles.join('; '),
                        }));
                        return;
                      }

                      // Add valid files
                      setImages((prev) => [...prev, ...fileArray]);
                      if (errors.images) {
                        setErrors((prev) => ({ ...prev, images: '' }));
                      }
                    }
                  }}
                />
              </div>
              {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
              {images.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-40 h-40">
                      <img
                        src={URL.createObjectURL(img)}
                        loading={'lazy'}
                        alt={`Preview ${idx + 1}`}
                        className="w-40 h-40 object-contain rounded border border-[#C7C7B9] bg-white"
                      />
                      <button
                        type="button"
                        className="absolute -top-3 -right-4 z-10 m-1 p-0 bg-transparent rounded-full hover:scale-110 transition-transform"
                        onClick={() => {
                          const newImages = images.filter((_, i) => i !== idx);
                          setImages(newImages);
                          if (newImages.length === 0 && errors.images === '') {
                            setErrors((prev) => ({
                              ...prev,
                              images: 'At least one image is required',
                            }));
                          }
                        }}
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
                text={isLoading ? 'SUBMITTING...' : 'SUBMIT FORM'}
                type="submit"
                className="submit-form-btn"
                disabled={isLoading}
              />
            </div>
            {submitError && (
              <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Submission Failed</h3>
                    <div className="mt-2 text-sm text-red-700">{submitError}</div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
      {showSuccess && (
        <Popup
          title={'Thank you for\nyour submission'}
          titleClassName="md:text-[40px] md:leading-[48px] text-[30px] leading-[36px]"
          containerClassName=" md:h-[300px] h-[274px] "
          content="We have received your request and will contact you soon."
          buttonText="BACK TO HOMEPAGE"
          onButtonClick={() => {
            setShowSuccess(false);
            navigate('/');
          }}
          onClose={() => setShowSuccess(false)}
        />
      )}
      {isLoading && <Loading fullScreen={true} text="Submitting your request..." />}
    </div>
  );
}
