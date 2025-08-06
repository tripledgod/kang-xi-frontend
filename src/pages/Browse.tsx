import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Loading from '../components/Loading';
import Header from '../components/Header';
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
  
  // Products state - no cache, always fetch fresh data
  const [products, setProducts] = useState<any[]>([]);
  const { loading: productsLoading, withLoading: withProductsLoading } = useLoading(false);
  const [errorProducts, setErrorProducts] = useState<string | null>(null);
  const [preloadingProgress, setPreloadingProgress] = useState<Record<string, boolean>>({});
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const navigate = useNavigate();
  const { locale } = useLanguage();
  const [searchParams] = useSearchParams();
  const eraTabRef = useRef<HTMLDivElement>(null);
  const eraTabWrapperRef = useRef<HTMLDivElement>(null);
  const eraButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);

  // Memoize sorted categories to prevent unnecessary recalculations
  const sortedCategories = useMemo(() => {
    return flattenedCategories.sort((a, b) => a.order - b.order);
  }, [flattenedCategories]);

  // Memoize eras to prevent unnecessary recalculations
  const eras: Era[] = useMemo(() => {
    return sortedCategories.map((category) => ({
      key: category.slug,
      label: category.name,
    }));
  }, [sortedCategories]);

  // Memoize era tabs to prevent unnecessary recalculations
  const eraTabs = useMemo(() => {
    return sortedCategories.length > 0 
      ? sortedCategories.map((category) => ({
          slug: category.slug,
          name: category.name.toUpperCase(),
        }))
      : [];
  }, [sortedCategories]);

  // When loading page, check URL params first, then set default era
  useEffect(() => {
    const eraFromUrl = searchParams.get('era');
    if (eraFromUrl && eraTabs.some(era => era.slug === eraFromUrl)) {
      setActiveEra(eraFromUrl);
      // Scroll to top when era changes via URL
      const isMobile = window.innerWidth < 768; // md breakpoint
      window.scrollTo({ 
        top: isMobile ? 0 : 400, 
        behavior: 'smooth' 
      });
    } else if (!activeEra && eraTabs.length > 0) {
      setActiveEra(eraTabs[0].slug);
    }
  }, [eraTabs, searchParams, activeEra]);

  // Handle scroll to show/hide sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        setShowStickyHeader(heroBottom <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update flattenedCategories when categories change
  useEffect(() => {
    if (categories.length > 0) {
      const flattened = categories.map((cat) => flattenCategory(cat));
      setFlattenedCategories(flattened);
    }
  }, [categories]);

  // Fetch categories from API to get id for each era
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
  }, [locale, withCategoriesLoading]);

  // Fetch products by activeEra (no cache, always fresh data)
  useEffect(() => {
    let isMounted = true;
    
    if (!activeEra || sortedCategories.length === 0) {
      // Clear products when no active era or no categories
      if (isMounted) {
        setProducts([]);
        setErrorProducts(null);
      }
      return;
    }
    
    // Find category by slug
    const category = sortedCategories.find((cat) => cat.slug === activeEra);
    if (!category) {
      if (isMounted) {
        setProducts([]);
        setErrorProducts('No data for this era');
      }
      return;
    }
    
    const fetchProducts = async () => {
      try {

        if (isMounted) {
          setErrorProducts(null);
          setProducts([]); // Clear previous products immediately
        }
        
        // Always fetch fresh data from API
        const productsData = await getProductsByCategory(category.id, locale);
        
        if (!isMounted) return; // Check if component is still mounted
        
        if (productsData && productsData.length > 0) {
          const flattened = productsData.map((prod) => flattenProduct(prod));
          setProducts(flattened);
        } else {
          setProducts([]);
          setErrorProducts('No data for this era');
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching products:', err);
        setErrorProducts('Unable to load product list');
        setProducts([]);
      }
    };
    
    withProductsLoading(fetchProducts);
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [activeEra, sortedCategories, locale, withProductsLoading]);

  // Preload products for all eras when categories are available (no cache, just preload)
  useEffect(() => {
    let isMounted = true;
    
    if (sortedCategories.length > 0) {
      // Preload products for all eras in background
      const preloadAllProducts = async () => {
        const eraSlugs = sortedCategories.map(cat => cat.slug);
        
        for (const eraSlug of eraSlugs) {
          if (!isMounted) break; // Stop if component unmounted
          
          // Skip if this is the currently active era (already being fetched)
          if (eraSlug === activeEra) continue;
          
          // Mark as preloading
          if (isMounted) {
            setPreloadingProgress(prev => ({ ...prev, [eraSlug]: true }));
          }
          
          const category = sortedCategories.find((cat) => cat.slug === eraSlug);
          if (category) {
            try {
              // Always fetch fresh data, no cache
              const productsData = await getProductsByCategory(category.id, locale);

            } catch (err) {
              if (isMounted) {
                console.warn(`Failed to preload products for ${eraSlug}:`, err);
              }
            }
          }
          
          // Mark as completed
          if (isMounted) {
            setPreloadingProgress(prev => ({ ...prev, [eraSlug]: false }));
          }
        }
      };
      
      // Start preloading in background (don't await)
      preloadAllProducts();
    }
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [sortedCategories, locale, activeEra]);



    const handleEraClick = useCallback((eraSlug: string) => {
    if (eraSlug !== activeEra) {
 
      // Clear current products immediately when switching
      setProducts([]);
      setErrorProducts(null);
      setActiveEra(eraSlug);
      navigate(`/browse?era=${eraSlug}`, { replace: true });
      
      // Scroll to top of the page when switching era
      const isMobile = window.innerWidth < 768; // md breakpoint
      window.scrollTo({ 
        top: isMobile ? 0 : 400, 
        behavior: 'smooth' 
      });
    }
  }, [activeEra, navigate]);

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
        onClick={() => {
          navigate(`/products/${product.slug}`);
        }}
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
        btn.scrollIntoView({ behavior: 'instant', inline: 'center', block: 'nearest' });
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
      <div ref={heroRef} className="w-full relative">
        <img
          src={heroImgMobile}
          alt="Ceramic by Era Mobile"
          className="block md:hidden w-full h-[218px]  object-cover bg-[#F7F5EA] pb-8"
        />
        <img
          src={heroImg}
          alt="Ceramic by Era"
          className="hidden md:block w-full h-[420px] object-cover object-center"
        />
      </div>
      
      {/* Era Tabs - Original (non-sticky) - Only show when NOT scrolled */}
      {!showStickyHeader && (
        <div className="w-full bg-[#F7F3E8]">
          <div className="max-w-7xl mx-auto px-4 md:px-0 pt-4 md:pt-24 pb-3 md:pb-5 overflow-x-auto scrollbar-hide">
            <div
              ref={eraTabRef}
              className="inline-flex items-center gap-x-[16px] md:gap-x-2 justify-start pl-[10px] md:pl-0 uppercase whitespace-nowrap"
            >
              {eraTabs.map((era, idx) => (
                <React.Fragment key={era.slug}>
                  <button
                    ref={(el) => {
                      eraButtonRefs.current[idx] = el;
                    }}
                    className={` transition-colors uppercase text-[16px] relative pb-3 btn-clickable ${activeEra === era.slug ? 'border-b-2 border-[#23211C] text-[#23211C] opacity-90 z-20 font-semibold' : 'text-[#23211C] border-b-0'}`}
                    onClick={() => handleEraClick(era.slug)}
                  >
                    {era.name}
                    {/* {preloadingProgress[era.slug] && ( // Removed preloading state
                      <span className="ml-1 text-xs text-[#7B6142]">●</span>
                    )} */}
                  </button>
                  {idx < eraTabs.length - 1 && (
                    <span className="text-[#D6C7A1] text-lg mx-2 flex items-center select-none mb-[5px] pb-3">
                      +
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Navigation Container - Only show when scrolled past hero */}
      {showStickyHeader && (
        <div className="w-full sticky top-0 z-40 bg-[#F7F5EA]">
          {/* Header */}
          <Header />
          
          {/* Era Tabs */}
          <div className="w-full border-b border-[#C0BFBD]">
            <div className="max-w-7xl mx-auto px-4 md:px-0 pt-4 md:pt-6  overflow-x-auto scrollbar-hide">
              <div
                className="inline-flex items-center gap-x-[16px] md:gap-x-2 justify-start pl-[10px] md:pl-0 uppercase whitespace-nowrap"
              >
                {eraTabs.map((era, idx) => (
                  <React.Fragment key={era.slug}>
                    <button
                      className={` transition-colors uppercase  text-[16px] relative pb-3 btn-clickable ${activeEra === era.slug ? 'border-b-2 border-[#23211C]  text-[#23211C] opacity-90 z-20 font-semibold' : 'text-[#23211C] border-b-0 '}`}
                      onClick={() => handleEraClick(era.slug)}
                    >
                      {era.name}
                      {/* {preloadingProgress[era.slug] && ( // Removed preloading state
                        <span className="ml-1 text-xs text-[#7B6142]">●</span>
                      )} */}
                    </button>
                    {idx < eraTabs.length - 1 && (
                      <span className="text-[#D6C7A1] text-lg mx-2 flex items-center select-none mb-[5px] pb-3">
                        +
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="w-full max-w-7xl mx-auto px-4 mt-10 grid grid-cols-1 md:grid-cols-3 gap-10 md:pl-0 pl-[20px]">
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
