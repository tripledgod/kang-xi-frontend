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
import { API_URL } from '../utils/constants';
import Popup from '../components/Popup';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { useTranslation } from 'react-i18next';
import happendImg from '../assets/happend.jpg';
import expressImg from '../assets/express.jpg';
import bgButtonMobile from '../assets/bg_button.png';
// import bgButtonMobileHover from '../assets/bg_button_mobile_hover.png';
import bgButtonHover from '../assets/bg_button_hover.png';
import bgButtonPressed from '../assets/bg_button_pressed.png';
import bgButtonMobilePressed from '../assets/bg_button_mobile_pressed.png';

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
    icon: (
      <img src={secureTransactionIcon} alt="Secure Transaction" className="w-12 h-12 mx-auto" />
    ),
    title: 'Secure & Discreet Transaction',
    desc: 'We prioritize confidentiality and ensure that every acquisition is handled with utmost professionalism.',
  },
];

// const countryOptions = [
//   { code: '+65', label: 'Singapore', flag: '🇸🇬' },
//   { code: '+84', label: 'Vietnam', flag: '🇻🇳' },
//   { code: '+86', label: 'China', flag: '🇨🇳' },
// ];

export default function AcquireAnItem() {
  // const [country, setCountry] = useState(countryOptions[0]);
  const [phone, setPhone] = useState('');
  const [acquireForm, setAcquireForm] = useState({
    firstName: '',
    lastName: '',
    itemCode: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    itemCode: '',
    phone: '',
  });
  const navigate = useNavigate();
  const { t } = useTranslation();
  const formRef = React.useRef<HTMLDivElement>(null);

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

      await response.json();
      setShowSuccess(true);
      setAcquireForm({ firstName: '', lastName: '', itemCode: '' });
      setPhone('');
      setErrors({ firstName: '', lastName: '', itemCode: '', phone: '' });
    } catch (error) {
      // Could handle error here if needed
    } finally {
      setIsLoading(false);
    }
  };

  const handleScrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F7F5EA]">
      {/* Show popup when registration is successful */}
      {showSuccess && (
        <Popup
          title={'Thank you for\ncontacting us'}
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
      {/* Hero Section */}
      <div className="w-full bg-[#23211C] py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 items-center">
          {/* Left */}
          <div className="flex-1 text-white mb-8 md:mb-0">
            <h1 className="hidden md:block text-[60px] leading-[72px] font-serif mb-6">
              Reserve a <br />
              Timeless
              <br />
              Treasure
            </h1>
            <h3 className="block md:hidden text-[40px] leading-[48px] font-serif mb-4">
              Reserve a<br /> Timeless
              <br />
              Treasure
            </h3>
            <p className="md:mb-16 mb-8 text-[18px] leading-[26px] text-[#FFFFFF] max-w-[478px] opacity-70">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in
              eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum
              nulla, ut commodo diam libero vitae erat morbi euismod.
            </p>
            <button
              type="submit"
              onClick={handleScrollToForm}
              className="flex h-[48px]   font-semibold w-[189px] items-center justify-center text-[14px] leading-[20px] shadow-none px-6 custom-button cursor-pointer"
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
              ACQUIRE AN ITEM
            </button>
          </div>
          {/* Right: Single image */}
          <div className="flex-1">
            <img
              src={timelessTreasure}
              alt="Timeless Treasure"
              className="w-full h-auto object-cover rounded"
            />
          </div>
        </div>
      </div>

      {/* What Happens Next Section */}
      <div className="w-full pt-16 px-4 md:px-[112px]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-0  md:gap-24 md:py-12">
          {/* Left: Large image */}
          <div className="flex-1 flex items-center justify-center mb-8 md:mb-0 order-1">
            <img
              src={happendImg}
              alt="What Happens Next"
              className="w-full md:h-140 object-cover  h-[400px]"
            />
          </div>
          {/* Right: Steps */}
          <div className="flex-1 order-2">
            <h3 className="hidden md:block  text-[40px] leading-[48px] font-serif text-[#61422D] mb-6 text-left">
              What Happens Next?
            </h3>
            <h4 className="block md:hidden text-[32px] leading-[40px] font-serif text-[#61422D] mb-6 text-left">
              What Happens Next?
            </h4>
            <div className="flex flex-col gap-10">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-start text-left md:flex-row md:items-center md:gap-4"
                >
                  <div className="w-12 h-12 flex items-center justify-center mb-4 md:mb-0 md:mr-4">
                    {step.icon}
                  </div>
                  <div>
                    <h5 className="text-[20px] md:text-[24px] leading-[28px] md:leading-[32px] text-[#61422D] mb-1">
                      {step.title}
                    </h5>
                    <div className="text-base text-[#6D6A66]">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Express Interest Section */}
      <div className="w-full  pt-12 md:pt-16 pb-28 md:pb-16 px-4 md:px-[112px]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center gap-0 md:gap-24 md:pb-16">
          {/* Right: Large image */}
          <div className="flex-1 flex items-center justify-center mb-8 md:mb-0 order-1">
            <img
              src={expressImg}
              alt="Express Your Interest"
              className="w-full md:h-140 object-cover h-[400px]"
            />
          </div>
          {/* Left: Text */}
          <div className="flex-1 order-2">
            <h3 className="hidden md:block text-[40px] leading-[48px] font-serif text-[#61422D] mb-4">
              Express Your Interest in a Piece of History
            </h3>
            <h4 className="block md:hidden text-[32px] leading-[40px] font-serif text-[#61422D] mb-4">
              Express Your Interest in a Piece of History
            </h4>
            <p className="text-[18px] leading-[26px] text-[#6D6A66] mb-5">
              Owning an antique is more than just possession—it is stewardship of history, a
              connection to centuries of artistry, and a tribute to a legacy that endures. If a
              particular piece in our collection has captured your attention, we invite you to take
              the next step.
            </p>
            <p className="text-[18px] leading-[26px] text-[#6D6A66]">
              Each artifact in our curation is unique, often with centuries of history behind it.
              Due to the rarity and exclusivity of these pieces, availability is limited. To ensure
              a seamless acquisition process, kindly fill out the form below to express your
              interest.
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div ref={formRef} className="w-full bg-[#E6DDC6] py-16 px-4">
        <div className="max-w-xl mx-auto">
          <h3 className="hidden md:block text-[40px] leading-[48px] font-serif text-[#61422D] mb-2 text-center">
            Secure Your Piece of History
          </h3>
          <h4 className="block md:hidden text-[32px]  leading-[40px] font-serif text-[#61422D] mb-2 text-center">
            Secure Your Piece of History
          </h4>
          <div className="text-[20px] leading-[28px] text-[#585550] mb-8 text-center">
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
              <label className="block mb-2 text-[#1F1F1F]  text-[14px] leading-[20px]">
                First Name
              </label>
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
              <label className="block mb-2 text-[#1F1F1F]  text-[14px] leading-[20px]">
                Last Name
              </label>
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
              <label className="block mb-2 text-[#1F1F1F]  text-[14px] leading-[20px]">
                Item Code
              </label>
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
      {isLoading && <Loading fullScreen={true} text="Submitting your request..." />}
    </div>
  );
}
