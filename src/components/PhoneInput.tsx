import React, { useState, useEffect } from 'react';
import PhoneInputLib from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import getCountryFlag from 'country-flag-icons/unicode';
import '../styles/phone-input.css';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  country?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
  label?: string;
  labelClassName?: string;
  onBlur?: () => void;
  onFocus?: () => void;
}

// Danh sách quốc gia đầy đủ với mã điện thoại
const COUNTRIES_DATA = [
  { code: 'sg', iso: 'SG', name: 'Singapore', dialCode: '+65' },
  { code: 'vn', iso: 'VN', name: 'Vietnam', dialCode: '+84' },
  { code: 'cn', iso: 'CN', name: 'China', dialCode: '+86' },
  { code: 'us', iso: 'US', name: 'United States', dialCode: '+1' },
  { code: 'gb', iso: 'GB', name: 'United Kingdom', dialCode: '+44' },
  { code: 'au', iso: 'AU', name: 'Australia', dialCode: '+61' },
  { code: 'ca', iso: 'CA', name: 'Canada', dialCode: '+1' },
  { code: 'jp', iso: 'JP', name: 'Japan', dialCode: '+81' },
  { code: 'kr', iso: 'KR', name: 'South Korea', dialCode: '+82' },
  { code: 'th', iso: 'TH', name: 'Thailand', dialCode: '+66' },
  { code: 'my', iso: 'MY', name: 'Malaysia', dialCode: '+60' },
  { code: 'id', iso: 'ID', name: 'Indonesia', dialCode: '+62' },
  { code: 'ph', iso: 'PH', name: 'Philippines', dialCode: '+63' },
  { code: 'in', iso: 'IN', name: 'India', dialCode: '+91' },
  { code: 'de', iso: 'DE', name: 'Germany', dialCode: '+49' },
  { code: 'fr', iso: 'FR', name: 'France', dialCode: '+33' },
  { code: 'it', iso: 'IT', name: 'Italy', dialCode: '+39' },
  { code: 'es', iso: 'ES', name: 'Spain', dialCode: '+34' },
  { code: 'nl', iso: 'NL', name: 'Netherlands', dialCode: '+31' },
  { code: 'be', iso: 'BE', name: 'Belgium', dialCode: '+32' },
  { code: 'ch', iso: 'CH', name: 'Switzerland', dialCode: '+41' },
  { code: 'at', iso: 'AT', name: 'Austria', dialCode: '+43' },
  { code: 'se', iso: 'SE', name: 'Sweden', dialCode: '+46' },
  { code: 'no', iso: 'NO', name: 'Norway', dialCode: '+47' },
  { code: 'dk', iso: 'DK', name: 'Denmark', dialCode: '+45' },
  { code: 'fi', iso: 'FI', name: 'Finland', dialCode: '+358' },
  { code: 'pl', iso: 'PL', name: 'Poland', dialCode: '+48' },
  { code: 'cz', iso: 'CZ', name: 'Czech Republic', dialCode: '+420' },
  { code: 'hu', iso: 'HU', name: 'Hungary', dialCode: '+36' },
  { code: 'ro', iso: 'RO', name: 'Romania', dialCode: '+40' },
  { code: 'bg', iso: 'BG', name: 'Bulgaria', dialCode: '+359' },
  { code: 'hr', iso: 'HR', name: 'Croatia', dialCode: '+385' },
  { code: 'si', iso: 'SI', name: 'Slovenia', dialCode: '+386' },
  { code: 'sk', iso: 'SK', name: 'Slovakia', dialCode: '+421' },
  { code: 'ee', iso: 'EE', name: 'Estonia', dialCode: '+372' },
  { code: 'lv', iso: 'LV', name: 'Latvia', dialCode: '+371' },
  { code: 'lt', iso: 'LT', name: 'Lithuania', dialCode: '+370' },
  { code: 'ie', iso: 'IE', name: 'Ireland', dialCode: '+353' },
  { code: 'pt', iso: 'PT', name: 'Portugal', dialCode: '+351' },
  { code: 'gr', iso: 'GR', name: 'Greece', dialCode: '+30' },
  { code: 'cy', iso: 'CY', name: 'Cyprus', dialCode: '+357' },
  { code: 'mt', iso: 'MT', name: 'Malta', dialCode: '+356' },
  { code: 'lu', iso: 'LU', name: 'Luxembourg', dialCode: '+352' },
  { code: 'is', iso: 'IS', name: 'Iceland', dialCode: '+354' },
  { code: 'nz', iso: 'NZ', name: 'New Zealand', dialCode: '+64' },
  { code: 'br', iso: 'BR', name: 'Brazil', dialCode: '+55' },
  { code: 'ar', iso: 'AR', name: 'Argentina', dialCode: '+54' },
  { code: 'mx', iso: 'MX', name: 'Mexico', dialCode: '+52' },
  { code: 'cl', iso: 'CL', name: 'Chile', dialCode: '+56' },
  { code: 'co', iso: 'CO', name: 'Colombia', dialCode: '+57' },
  { code: 'pe', iso: 'PE', name: 'Peru', dialCode: '+51' },
  { code: 've', iso: 'VE', name: 'Venezuela', dialCode: '+58' },
  { code: 'uy', iso: 'UY', name: 'Uruguay', dialCode: '+598' },
  { code: 'py', iso: 'PY', name: 'Paraguay', dialCode: '+595' },
  { code: 'bo', iso: 'BO', name: 'Bolivia', dialCode: '+591' },
  { code: 'ec', iso: 'EC', name: 'Ecuador', dialCode: '+593' },
  { code: 'za', iso: 'ZA', name: 'South Africa', dialCode: '+27' },
  { code: 'eg', iso: 'EG', name: 'Egypt', dialCode: '+20' },
  { code: 'ng', iso: 'NG', name: 'Nigeria', dialCode: '+234' },
  { code: 'ke', iso: 'KE', name: 'Kenya', dialCode: '+254' },
  { code: 'gh', iso: 'GH', name: 'Ghana', dialCode: '+233' },
  { code: 'ug', iso: 'UG', name: 'Uganda', dialCode: '+256' },
  { code: 'tz', iso: 'TZ', name: 'Tanzania', dialCode: '+255' },
  { code: 'et', iso: 'ET', name: 'Ethiopia', dialCode: '+251' },
  { code: 'ma', iso: 'MA', name: 'Morocco', dialCode: '+212' },
  { code: 'dz', iso: 'DZ', name: 'Algeria', dialCode: '+213' },
  { code: 'tn', iso: 'TN', name: 'Tunisia', dialCode: '+216' },
  { code: 'ly', iso: 'LY', name: 'Libya', dialCode: '+218' },
  { code: 'sd', iso: 'SD', name: 'Sudan', dialCode: '+249' },
  { code: 'sa', iso: 'SA', name: 'Saudi Arabia', dialCode: '+966' },
  { code: 'ae', iso: 'AE', name: 'United Arab Emirates', dialCode: '+971' },
  { code: 'qa', iso: 'QA', name: 'Qatar', dialCode: '+974' },
  { code: 'kw', iso: 'KW', name: 'Kuwait', dialCode: '+965' },
  { code: 'bh', iso: 'BH', name: 'Bahrain', dialCode: '+973' },
  { code: 'om', iso: 'OM', name: 'Oman', dialCode: '+968' },
  { code: 'jo', iso: 'JO', name: 'Jordan', dialCode: '+962' },
  { code: 'lb', iso: 'LB', name: 'Lebanon', dialCode: '+961' },
  { code: 'sy', iso: 'SY', name: 'Syria', dialCode: '+963' },
  { code: 'iq', iso: 'IQ', name: 'Iraq', dialCode: '+964' },
  { code: 'ir', iso: 'IR', name: 'Iran', dialCode: '+98' },
  { code: 'tr', iso: 'TR', name: 'Turkey', dialCode: '+90' },
  { code: 'il', iso: 'IL', name: 'Israel', dialCode: '+972' },
  { code: 'pk', iso: 'PK', name: 'Pakistan', dialCode: '+92' },
  { code: 'bd', iso: 'BD', name: 'Bangladesh', dialCode: '+880' },
  { code: 'lk', iso: 'LK', name: 'Sri Lanka', dialCode: '+94' },
  { code: 'np', iso: 'NP', name: 'Nepal', dialCode: '+977' },
  { code: 'mm', iso: 'MM', name: 'Myanmar', dialCode: '+95' },
  { code: 'kh', iso: 'KH', name: 'Cambodia', dialCode: '+855' },
  { code: 'la', iso: 'LA', name: 'Laos', dialCode: '+856' },
  { code: 'mn', iso: 'MN', name: 'Mongolia', dialCode: '+976' },
  { code: 'kz', iso: 'KZ', name: 'Kazakhstan', dialCode: '+7' },
  { code: 'uz', iso: 'UZ', name: 'Uzbekistan', dialCode: '+998' },
  { code: 'kg', iso: 'KG', name: 'Kyrgyzstan', dialCode: '+996' },
  { code: 'tj', iso: 'TJ', name: 'Tajikistan', dialCode: '+992' },
  { code: 'tm', iso: 'TM', name: 'Turkmenistan', dialCode: '+993' },
  { code: 'af', iso: 'AF', name: 'Afghanistan', dialCode: '+93' },
  { code: 'ru', iso: 'RU', name: 'Russia', dialCode: '+7' },
  { code: 'ua', iso: 'UA', name: 'Ukraine', dialCode: '+380' },
  { code: 'by', iso: 'BY', name: 'Belarus', dialCode: '+375' },
  { code: 'md', iso: 'MD', name: 'Moldova', dialCode: '+373' },
  { code: 'ge', iso: 'GE', name: 'Georgia', dialCode: '+995' },
  { code: 'am', iso: 'AM', name: 'Armenia', dialCode: '+374' },
  { code: 'az', iso: 'AZ', name: 'Azerbaijan', dialCode: '+994' },
];

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  country = 'sg',
  placeholder = '123-456-789',
  disabled = false,
  required = false,
  error,
  className = '',
  label,
  labelClassName = 'block mb-2 text-[#1F1F1F] font-normal text-[14px] leading-[20px]',
  onBlur,
  onFocus,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(country);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Extract phone number without country code
  useEffect(() => {
    if (value) {
      // Remove country code from the beginning
      const countryCode = getCountryCode(selectedCountry);
      const numberWithoutCode = value.replace(countryCode, '');
      setPhoneNumber(numberWithoutCode);
    } else {
      setPhoneNumber('');
    }
  }, [value, selectedCountry]);

  const getCountryCode = (countryCode: string) => {
    const country = COUNTRIES_DATA.find(c => c.code === countryCode);
    return country ? country.dialCode : '+65';
  };

  const getCountryFlagIcon = (countryCode: string) => {
    const country = COUNTRIES_DATA.find(c => c.code === countryCode);
    if (!country) return '🇸🇬';

    try {
      // Try to use the flag library first
      const flag = getCountryFlag(country.iso);
      if (flag) return flag;
    } catch (error) {
      // Fallback to emoji if flag library fails
    }
    
    // Fallback to emoji flags for common countries
    const emojiFlags: { [key: string]: string } = {
      sg: '🇸🇬', vn: '🇻🇳', cn: '🇨🇳', us: '🇺🇸', gb: '🇬🇧', au: '🇦🇺', ca: '🇨🇦',
      jp: '🇯🇵', kr: '🇰🇷', th: '🇹🇭', my: '🇲🇾', id: '🇮🇩', ph: '🇵🇭', in: '🇮🇳',
      de: '🇩🇪', fr: '🇫🇷', it: '🇮🇹', es: '🇪🇸', nl: '🇳🇱', be: '🇧🇪', ch: '🇨🇭',
      at: '🇦🇹', se: '🇸🇪', no: '🇳🇴', dk: '🇩🇰', fi: '🇫🇮', pl: '🇵🇱', cz: '🇨🇿',
      hu: '🇭🇺', ro: '🇷🇴', bg: '🇧🇬', hr: '🇭🇷', si: '🇸🇮', sk: '🇸🇰', ee: '🇪🇪',
      lv: '🇱🇻', lt: '🇱🇹', ie: '🇮🇪', pt: '🇵🇹', gr: '🇬🇷', cy: '🇨🇾', mt: '🇲🇹',
      lu: '🇱🇺', is: '🇮🇸', nz: '🇳🇿', br: '🇧🇷', ar: '🇦🇷', mx: '🇲🇽', cl: '🇨🇱',
      co: '🇨🇴', pe: '🇵🇪', ve: '🇻🇪', uy: '🇺🇾', py: '🇵🇾', bo: '🇧🇴', ec: '🇪🇨',
      za: '🇿🇦', eg: '🇪🇬', ng: '🇳🇬', ke: '🇰🇪', gh: '🇬🇭', ug: '🇺🇬', tz: '🇹🇿',
      et: '🇪🇹', ma: '🇲🇦', dz: '🇩🇿', tn: '🇹🇳', ly: '🇱🇾', sd: '🇸🇩', sa: '🇸🇦',
      ae: '🇦🇪', qa: '🇶🇦', kw: '🇰🇼', bh: '🇧🇭', om: '🇴🇲', jo: '🇯🇴', lb: '🇱🇧',
      sy: '🇸🇾', iq: '🇮🇶', ir: '🇮🇷', tr: '🇹🇷', il: '🇮🇱', pk: '🇵🇰', bd: '🇧🇩',
      lk: '🇱🇰', np: '🇳🇵', mm: '🇲🇲', kh: '🇰🇭', la: '🇱🇦', mn: '🇲🇳', kz: '🇰🇿',
      uz: '🇺🇿', kg: '🇰🇬', tj: '🇹🇯', tm: '🇹🇲', af: '🇦🇫', ru: '🇷🇺', ua: '🇺🇦',
      by: '🇧🇾', md: '🇲🇩', ge: '🇬🇪', am: '🇦🇲', az: '🇦🇿',
    };
    return emojiFlags[countryCode] || '🇸🇬';
  };

  const getCountryFlagElement = (countryCode: string) => {
    // Try emoji first
    const emojiFlag = getCountryFlagIcon(countryCode);
    
    // If emoji doesn't render properly (shows as box or question mark), use CSS flag
    if (emojiFlag.length === 2 && emojiFlag.charCodeAt(0) === 55356) {
      // This is likely a valid emoji, use it
      return <span className="flag bg-[#E3E3E3]" role="img" aria-label={`Flag of ${getCountryName(countryCode)}`}>
        {emojiFlag}
      </span>;
    } else {
      // Use CSS flag as fallback
      return <span className={`flag flag-css ${countryCode}`} role="img" aria-label={`Flag of ${getCountryName(countryCode)}`}></span>;
    }
  };

  const getCountryName = (countryCode: string) => {
    const country = COUNTRIES_DATA.find(c => c.code === countryCode);
    return country ? country.name : 'Singapore';
  };

  const handleCountryChange = (newCountry: string) => {
    setSelectedCountry(newCountry);
    setIsDropdownOpen(false);
    const newCountryCode = getCountryCode(newCountry);
    const newFullNumber = newCountryCode + phoneNumber;
    onChange(newFullNumber);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = e.target.value;
    setPhoneNumber(newPhoneNumber);
    const countryCode = getCountryCode(selectedCountry);
    const newFullNumber = countryCode + newPhoneNumber;
    onChange(newFullNumber);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className={labelClassName}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className={`phone-input-custom-container ${disabled ? 'disabled' : ''}`}>
        {/* Custom Country Selector */}
        <div className="phone-input-custom-button-wrapper">
          <div className="relative">
            <button
              type="button"
              onClick={toggleDropdown}
              disabled={disabled}
              className={`phone-input-custom-button ${error ? 'border-red-500' : ''}`}
            >
              {getCountryFlagElement(selectedCountry)}
              <span className="dial-code">{getCountryCode(selectedCountry)}</span>
              <svg
                className={`arrow ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="phone-input-custom-dropdown">
                {COUNTRIES_DATA.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountryChange(country.code)}
                    className="country-option"
                  >
                    {getCountryFlagElement(country.code)}
                    <span className="dial-code">{country.dialCode}</span>
                    <span className="country-name">{country.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Custom Phone Number Input */}
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder={placeholder}
          disabled={disabled}
          onBlur={onBlur}
          onFocus={onFocus}
          className={`phone-input-custom-input ${error ? 'border-red-500' : ''}`}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default PhoneInput;