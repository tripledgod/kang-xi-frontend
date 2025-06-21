import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import icLeft from '../assets/ic_left.svg';
import icRight from '../assets/ic_right.svg';
import bgButton from '../assets/bg_button.png';
import bgButtonMobile from '../assets/bg_button_mobile.png';
import { COLORS } from './colors.ts';
import Button from './Button.tsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { useLanguage } from '../contexts/LanguageContext';
import { getImageUrl } from '../utils';
import { 
  getEraNamesForLocale, 
  findProductForEra, 
  createPlaceholderEra 
} from '../utils/eraHelpers';

const CARD_WIDTH = 320;
const CARD_GAP = 32;
const DESKTOP_VISIBLE = 3;
const DESKTOP_PEEK = 0.3; // 30% of 4th card
const MOBILE_VISIBLE = 1;
const MOBILE_PEEK = 0.2; // 20% of 2nd card

export default function CeramicsByEra() {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [eras, setEras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { locale } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch products and build eras
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/products`, {
          params: {
            'populate': '*',
            'pagination[pageSize]': 100,
            'locale': locale
          }
        });
        
        let products = response.data.data || response.data;
        
        // Nếu là Strapi v4, products là mảng trong data với attributes
        if (Array.isArray(products) && products[0]?.attributes) {
          products = products.map((p: any) => ({ 
            ...p.attributes, 
            id: p.id,
            // Đảm bảo category được populate đúng cách
            category: p.attributes.category?.data ? {
              ...p.attributes.category.data.attributes,
              id: p.attributes.category.data.id
            } : p.attributes.category
          }));
        }
        
        // Lấy era names theo locale hiện tại
        const currentEraNames = getEraNamesForLocale(locale);
        
        // Lọc ra sản phẩm đầu tiên cho từng era
        const erasData = currentEraNames.map((eraName) => {
          const found = findProductForEra(products, eraName, locale);
          
          if (!found) {
            // Trả về placeholder thay vì null để hiển thị era name
            return createPlaceholderEra(eraName);
          }
          
          // Lấy ảnh đầu tiên
          let imageUrl = '';
          if (found.images && found.images.length > 0) {
            const firstImage = found.images[0];
            imageUrl = getImageUrl(firstImage);
          }
          
          return {
            name: found.category?.name || eraName,
            years: found.ageFrom && found.ageTo ? `${found.ageFrom}—${found.ageTo}` : '',
            desc: found.description,
            img: imageUrl,
            id: found.id,
            slug: found.slug,
            isPlaceholder: false
          };
        });
        
        setEras(erasData);
      } catch (err) {
        console.error('Error fetching products:', err);
        setEras([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [locale]); // Re-fetch when locale changes

  // Scroll to the correct position when index changes (desktop only)
  useEffect(() => {
    if (!isMobile && containerRef.current) {
      containerRef.current.scrollTo({
        left: index * (CARD_WIDTH + CARD_GAP),
        behavior: 'smooth',
      });
    }
  }, [index, isMobile]);

  const canGoLeft = index > 0;
  const canGoRight = index < eras.length - DESKTOP_VISIBLE;

  // Container width
  const containerWidth = isMobile
    ? CARD_WIDTH * (MOBILE_VISIBLE + MOBILE_PEEK) + CARD_GAP * MOBILE_VISIBLE
    : CARD_WIDTH * (DESKTOP_VISIBLE + DESKTOP_PEEK) + CARD_GAP * DESKTOP_VISIBLE;

  if (loading) return <div className="w-full py-12 text-center">Đang tải...</div>;

  return (
    <section className="w-full bg-[#F7F5EA] px-4 py-12 md:pt-21 md:pb-19">
      <div className="max-w-7xl md:pl-8 ">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 md:mb-12">
          <h2
            className="text-4xl md:text-5xl font-serif font-medium mb-6 md:mb-0"
            style={{ color: COLORS.secondary900 }}
          >
            Ceramics by Era
          </h2>
          <div className="hidden md:flex items-center gap-4 self-end md:self-auto">
            <button
              className="w-10 h-10 flex items-center justify-center text-base font-medium shadow-none transition-all rounded-[6px] border border-[#C7B08A] bg-[#F7F3E8] hover:border-[#86684A]"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={!canGoLeft}
              style={{
                color: '#C7B08A',
                border: '1px solid #C7B08A',
                background: '#F7F3E8',
                padding: 0,
                minWidth: 0,
                opacity: !canGoLeft ? 0.5 : 1,
              }}
            >
              <img
                src={icLeft}
                alt="left"
                className="w-6 h-6"
                style={{ display: 'inline-block', filter: 'none', color: '#C7B08A' }}
              />
            </button>
            <button
              className="w-10 h-10 flex items-center justify-center text-base font-medium shadow-none transition-all rounded-[6px] border border-[#C7B08A] bg-[#F7F3E8] hover:border-[#86684A]"
              onClick={() => setIndex((i) => Math.min(eras.length - DESKTOP_VISIBLE, i + 1))}
              disabled={!canGoRight}
              style={{
                color: '#C7B08A',
                border: '1px solid #C7B08A',
                background: '#F7F3E8',
                padding: 0,
                minWidth: 0,
                opacity: !canGoRight ? 0.5 : 1,
              }}
            >
              <img
                src={icRight}
                alt="right"
                className="w-6 h-6"
                style={{ display: 'inline-block', filter: 'none', color: '#C7B08A' }}
              />
            </button>
            <button
              className="ml-4 w-[218px] h-[48px] flex items-center justify-center text-base font-medium shadow-none transition-all px-6"
              onClick={() => navigate('/browse')}
              style={{
                backgroundImage: `url(${bgButton})`,
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                color: '#fff',
                border: 'none',
                padding: 0,
                minWidth: 0,
              }}
            >
              {t('VIEW ALL COLLECTION')}
            </button>
          </div>
        </div>
      </div>
      {/* Content with padding top to account for fixed header */}
      <div className=" mx-auto md:pl-8 ">
        {/* Mobile: vertical stack */}
        <div className="flex flex-col gap-8 mt-4 md:hidden">
          {eras.map((era, idx) => (
            <div key={era.name} className="flex flex-col bg-transparent">
              <div className="bg-[#E6DDC6] aspect-square w-full flex items-center justify-center overflow-hidden mb-4">
                {era.img ? (
                  <img src={era.img} alt={era.name} className="object-cover w-full h-full" />
                ) : (
                  <div className="text-[#61422D] text-center p-4">
                    <div className="text-6xl mb-3 opacity-50">🏺</div>
                    <div className="text-sm font-medium">No Image</div>
                    <div className="text-xs opacity-70 mt-1">Ceramic Art</div>
                  </div>
                )}
              </div>
              <h4
                className="text-2xl font-serif mb-6 font-semibold uppercase"
                style={{ color: COLORS.primary900, fontWeight: 500, fontSize: 32, lineHeight: '40px', letterSpacing: 0 }}
              >
                {era.name}
              </h4>
              <div className="text-base font-semibold border-t border-[#C7C7B9] pt-4 text-[#2E2A24] mb-1">
                {era.years}
              </div>
              <div className="text-base pt-2  " style={{ fontFamily: 'PingFang SC, Arial, sans-serif', fontWeight: 400, fontSize: 16, lineHeight: '24px', letterSpacing: 0, color: '#342216' }}>
                {era.desc}
              </div>
            </div>
          ))}
          <div className="mt-6">
            <Button text={t('VIEW ALL COLLECTION')} onClick={() => navigate('/browse')} />
          </div>
        </div>
        {/* Desktop: horizontal scroll carousel */}
        <div
          ref={containerRef}
          className="hidden md:flex gap-8 mt-4 md:overflow-x-hidden"
          // style={{ width: containerWidth, maxWidth: '100%' }}
        >
          {eras.map((era, idx) => (
            <div
              key={era.name}
              className="flex flex-col flex-shrink-0 bg-transparent"
              style={{ width: CARD_WIDTH, minWidth: CARD_WIDTH }}
            >
              <div className="bg-[#E6DDC6] aspect-square w-full flex items-center justify-center overflow-hidden mb-4">
                {era.img ? (
                  <img src={era.img} alt={era.name} className="object-cover w-full h-full" />
                ) : (
                  <div className="text-[#61422D] text-center p-4">
                    <div className="text-6xl mb-3 opacity-50">🏺</div>
                    <div className="text-sm font-medium">No Image</div>
                    <div className="text-xs opacity-70 mt-1">Ceramic Art</div>
                  </div>
                )}
              </div>
              <h4 className="text-2xl font-serif text-[#86684A] mb-6 font-semibold uppercase" style={{ fontFamily: 'Source Han Serif SC VF, serif', fontWeight: 600, fontSize: 32, lineHeight: '40px', letterSpacing: 0 }}>
                {era.name}
              </h4>
              <div className="text-base font-semibold border-t border-[#C7C7B9] pt-4 text-[#2E2A24] mb-1">
                {era.years}
              </div>
              <div className="text-base pt-2 line-clamp-3 " style={{ fontFamily: 'PingFang SC, Arial, sans-serif', fontWeight: 400, fontSize: 16, lineHeight: '24px', letterSpacing: 0, color: '#342216' }}>
                {era.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
