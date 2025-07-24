import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Loading from '../components/Loading';
import { useLoading } from '../hooks/useLoading';
import { useLanguage } from '../contexts/LanguageContext';
import heroImg from '../assets/ceramic_cover.png';
import heroImgMobile from '../assets/ceramic_cover_mobile.png';
import AcquireOrAppraise from '../components/AcquireOrAppraise';
import {
  getCategories,
  getProductsByCategory,
  flattenCategory,
  flattenProduct,
  Category,
  Product,
} from '../api/categories';
import { API_URL } from '../utils/constants';

interface Era {
  key: string;
  label: string;
  style?: React.CSSProperties;
}

const Browse: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [flattenedCategories, setFlattenedCategories] = useState<any[]>([]);
  const { loading: categoriesLoading, withLoading: withCategoriesLoading } = useLoading(true);
  const [error, setError] = useState<string | null>(null);
  const [activeEra, setActiveEra] = useState<string>('');
  const [products, setProducts] = useState<any[]>([]);
  const { loading: productsLoading, withLoading: withProductsLoading } = useLoading(false);
  const [errorProducts, setErrorProducts] = useState<string | null>(null);
  const navigate = useNavigate();
  const { locale } = useLanguage();
  const [searchParams] = useSearchParams();
  const eraTabRef = useRef<HTMLDivElement>(null);
  const eraTabWrapperRef = useRef<HTMLDivElement>(null);
  const eraButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Scroll to top when URL changes
  useEffect(() => {
    window.scrollTo(0, 400);
  }, [searchParams]);

  // Danh sách slug era chuẩn, chỉ hiển thị đúng 5 era này và đúng thứ tự
  const eraOrder = ['tang', 'song', 'yuan', 'ming', 'quing'];

  // Lọc và sắp xếp flattenedCategories theo thứ tự chuẩn
  const filteredSortedCategories = flattenedCategories
    .filter((cat) => eraOrder.includes(cat.slug))
    .sort((a, b) => eraOrder.indexOf(a.slug) - eraOrder.indexOf(b.slug));

  // Convert categories to eras (chỉ lấy 5 era chuẩn, đúng thứ tự)
  const eras: Era[] = filteredSortedCategories.map((category) => ({
    key: category.slug,
    label: category.name,
  }));

  // Khai báo cứng 5 era
  const eraTabs = [
    { slug: 'tang', name: 'TANG' },
    { slug: 'song', name: 'SONG' },
    { slug: 'yuan', name: 'YUAN' },
    { slug: 'ming', name: 'MING' },
    { slug: 'quing', name: 'QUING' },
  ];

  // Khi load trang, nếu không có activeEra, set mặc định là 'tang'
  useEffect(() => {
    if (!activeEra) {
      setActiveEra('tang');
    }
  }, [activeEra]);

  // Fetch categories từ API để lấy id cho từng era
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories(locale);
        if (categoriesData && categoriesData.length > 0) {
          setCategories(categoriesData);
        } else {
          setError('No categories found');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Unable to load categories');
      }
    };
    withCategoriesLoading(fetchCategories);
  }, [locale]);

  // Fetch sản phẩm theo activeEra (dùng categories để lấy id)
  useEffect(() => {
    if (!activeEra || categories.length === 0) return;
    // Tìm category theo slug
    const category = categories
      .map((cat) => flattenCategory(cat))
      .find((cat) => cat.slug === activeEra);
    if (!category) {
      setProducts([]);
      setErrorProducts('No data for this era');
      return;
    }
    const fetchProducts = async () => {
      try {
        setErrorProducts(null);
        const productsData = await getProductsByCategory(category.id, locale);
        if (productsData && productsData.length > 0) {
          const flattened = productsData.map((prod) => flattenProduct(prod));
          setProducts(flattened);
        } else {
          setProducts([]);
          setErrorProducts('No data for this era');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setErrorProducts('Unable to load product list');
      }
    };
    withProductsLoading(fetchProducts);
  }, [activeEra, categories, locale]);

  const handleEraClick = (eraSlug: string) => {
    if (eraSlug !== activeEra) {
      setActiveEra(eraSlug);
      navigate(`/browse?era=${eraSlug}`, { replace: true });
    }
  };

  // Component ProductCard to manage image state for each product
  const ProductCard: React.FC<{ product: any; navigate: any }> = ({ product, navigate }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageError, setImageError] = useState(false);

    // Get main image from images array
    let imageUrl = '';
    let fallbackUrls: string[] = [];

    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0];

      // Create fallback URL list in priority order
      const rawUrls = [
        firstImage.formats?.medium?.url,
        firstImage.formats?.small?.url,
        firstImage.formats?.thumbnail?.url,
        firstImage.url,
      ].filter(Boolean); // Remove undefined/null

      // Handle URL - concatenate with API_URL if relative path
      fallbackUrls = rawUrls.map((url) => {
        if (url && url.startsWith('/uploads/')) {
          return `${API_URL}${url}`;
        }
        return url;
      });

      // First URL as primary
      imageUrl = fallbackUrls[0] || '';
    }

    return (
      <div
        key={product.id}
        className="flex flex-col cursor-pointer rounded"
        onClick={() => navigate(`/products/${product.slug}`)}
      >
        <div className="bg-[#E6DDC6] aspect-square w-full flex items-center justify-center overflow-hidden mb-4">
          {imageUrl && !imageError ? (
            <img
              src={fallbackUrls[currentImageIndex] || imageUrl}
              alt={product.title || 'Product Image'}
              className="object-contain w-full h-full"
              onError={(e) => {
                // Try next image in fallback list
                if (currentImageIndex < fallbackUrls.length - 1) {
                  setCurrentImageIndex((prev) => prev + 1);
                } else {
                  // Tried all images, show placeholder
                  setImageError(true);
                  e.currentTarget.style.display = 'none';
                }
              }}
            />
          ) : (
            <div className="text-[#61422D] text-center p-4">
              <div className="text-6xl mb-3 opacity-50">🏺</div>
              <div className="text-sm font-medium">No Image Available</div>
              <div className="text-xs opacity-70 mt-1">Ceramic Art</div>
            </div>
          )}
        </div>
        <h5 className="md:text-[24px] text-[20px] font-medium text-[#61422D] mb-2 leading-[28px] md:leading-[32px] tracking-[0px] line-clamp-2 min-h-[64px]">
          {product.title}
        </h5>
        <div className="text-base text-[#585550] mb-4 line-clamp-3 min-h-[72px]">
          {product.description}
        </div>
        <div className="border-t-2 border-[#E5E1D7] opacity-80 my-3"></div>
        <div className="flex flex-row justify-between text-[14px] leading-[20px] text-[#585550] font-semibold">
          <span>
            {product.ageFrom} - {product.ageTo}
          </span>
          <span>ITEM {product.itemCode || product.documentId}</span>
        </div>
      </div>
    );
  };

  // When changing activeEra, if the active era is hidden, scrollIntoView (inline: 'nearest')
  useEffect(() => {
    const idx = eras.findIndex((e) => e.key === activeEra);
    const tabContainer = eraTabRef.current;
    const btn = eraButtonRefs.current[idx];
    if (tabContainer && btn) {
      const containerRect = tabContainer.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      if (btnRect.left < containerRect.left || btnRect.right > containerRect.right) {
        btn.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeEra, eras]);

  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-[#F7F5EA] flex items-center justify-center">
        <Loading fullScreen={true} text="Loading..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F7F5EA] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#61422D] text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#7B6142] text-white rounded hover:bg-[#6a5437]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F7F5EA]">
      {/* Hero Section */}
      <div className="w-full relative">
        <img
          src={heroImgMobile}
          alt="Ceramic by Era Mobile"
          className="block md:hidden w-full h-[320px] object-contain bg-[#F7F5EA]"
        />
        <img
          src={heroImg}
          alt="Ceramic by Era"
          className="hidden md:block w-full h-[420px] object-cover object-center"
        />
      </div>
      {/* Era Tabs */}
      <div className="w-full sticky top-[0px] z-30 bg-[#F7F5EA]">
        <div className="max-w-6xl mx-auto px-4 pt-4 md:pt-20 overflow-x-auto scrollbar-hide">
          <div
            ref={eraTabRef}
            className="inline-flex items-center gap-x-[18px] md:gap-x-2 justify-start pl-[10px] md:pl-[64px] uppercase whitespace-nowrap"
          >
            {eraTabs.map((era, idx) => (
              <React.Fragment key={era.slug}>
                <button
                  ref={(el) => {
                    eraButtonRefs.current[idx] = el;
                  }}
                  className={`pb-2 transition-colors uppercase text-[17px] relative ${activeEra === era.slug ? 'border-b-2 border-[#23211C] text-[#23211C] font-semibold opacity-90 z-20' : 'text-[#23211C] border-b-0'}`}
                  onClick={() => handleEraClick(era.slug)}
                >
                  {era.name}
                </button>
                {idx < eraTabs.length - 1 && (
                  <span className="text-[#D6C7A1] text-lg mx-2 flex justify-center select-none">
                    +
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="w-full max-w-6xl mx-auto px-4 mt-10 grid grid-cols-1 md:grid-cols-3 gap-10 md:pl-[80px] pl-[20px]">
        {productsLoading ? (
          <div className="flex justify-center py-16">
            <Loading size="large" text="Loading..." />
          </div>
        ) : errorProducts ? (
          <div className="text-center py-16">
            <p className="text-[#61422D] text-lg mb-4">{errorProducts}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#61422D] text-lg">No data</p>
          </div>
        ) : (
          products.map((product: any) => (
            <ProductCard key={product.id} product={product} navigate={navigate} />
          ))
        )}
      </div>

      {/* Acquire or Appraise Section */}
      <div className="mt-20">
        <AcquireOrAppraise />
      </div>
    </div>
  );
};

export default Browse;
