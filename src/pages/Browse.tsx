import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { useLoading } from '../hooks/useLoading';
import { useLanguage } from '../contexts/LanguageContext';

import AcquireOrAppraise from '../components/AcquireOrAppraise';
import { ProductCardSkeleton } from '../components/ShimmerSkeleton';
import {
  getCategories,
  getProductsByCategory,
  flattenCategory,
  flattenProduct,
  Category,
} from '../api/categories';
import CoverPage from '../components/CoverPage';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import type { Cover } from '../types';
import { useTranslation } from 'react-i18next';

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
  const {t} = useTranslation();
  // Products state - no cache, always fetch fresh data
  const [products, setProducts] = useState<any[]>([]);
  const { loading: productsLoading, withLoading: withProductsLoading } = useLoading(false);
  const [errorProducts, setErrorProducts] = useState<string | null>(null);

  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [productsCache, setProductsCache] = useState<Record<string, any[]>>({});
  const navigate = useNavigate();
  const { locale } = useLanguage();
  const [searchParams] = useSearchParams();
  const eraTabRef = useRef<HTMLDivElement>(null);
  const eraButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  const lastEraChange = useRef<number>(0);
  const pendingRequests = useRef<Record<string, Promise<any>>>({});
  const [enablePreloading] = useState(false); // Set to false for better performance
  const [cover, setCover] = useState<Cover | undefined>(undefined);

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
    if (eraFromUrl && eraTabs.some((era) => era.slug === eraFromUrl)) {
      setActiveEra(eraFromUrl);
      // Scroll to top when era changes via URL
      const isMobile = window.innerWidth < 768; // md breakpoint
      window.scrollTo({
        top: isMobile ? 0 : 400,
        behavior: 'smooth',
      });
    } else if (!activeEra && eraTabs.length > 0) {
      setActiveEra(eraTabs[0].slug);
    }
  }, [eraTabs, searchParams, activeEra]);

// Ensure active era stays valid when locale/categories change
useEffect(() => {
  // Reset caches when locale switches
  setProducts([]);
  setErrorProducts(null);
  setProductsCache({});
  pendingRequests.current = {};

  if (!sortedCategories.length) {
    setActiveEra('');
    return;
  }

  if (activeEra) {
    const exists = sortedCategories.some((cat) => cat.slug === activeEra);
    if (exists) {
      return;
    }
  }

  const firstEraSlug = sortedCategories[0]?.slug;
  if (firstEraSlug && firstEraSlug !== activeEra) {
    setActiveEra(firstEraSlug);
    navigate(`/browse?era=${firstEraSlug}`, { replace: true });
  }
}, [locale, sortedCategories, activeEra, navigate]);

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

  // Fetch cover for Browse page from header-browse API (no fallback)
  useEffect(() => {
    const fetchCover = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/header-browse`, {
          params: { 'populate[cover][populate]': '*', populate: '*', locale },
        });
        const root = response?.data?.data?.attributes || response?.data?.data || response?.data || {};
        const c = root?.cover as Cover | undefined;
        setCover(c);
      } catch (e) {
        console.error('Error fetching header-browse cover:', e);
        setCover(undefined);
      }
    };
    fetchCover();
  }, [locale]);

  // Update flattenedCategories when categories change
  useEffect(() => {
    if (categories.length > 0) {
      const flattened = categories.map((cat) => flattenCategory(cat));
      setFlattenedCategories(flattened);
      // Clear products cache when categories change
      setProductsCache({});
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
    let abortController = new AbortController();

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
        setErrorProducts(t('NO_DATA_FOR_THIS_ERA'));
      }
      return;
    }

    const fetchProducts = async () => {
      try {
        if (isMounted) {
          setErrorProducts(null);
          setProducts([]); // Clear previous products immediately
        }

        // Check cache first
        const cacheKey = `${category.slug}-${locale}`;
        if (productsCache[cacheKey]) {
          if (isMounted) {
            setProducts(productsCache[cacheKey]);
          }
          return;
        }

        // Check if there's already a pending request for this data
        if (pendingRequests.current[cacheKey] !== undefined) {
          try {
            const productsData = await pendingRequests.current[cacheKey];
            if (!isMounted) return;

            if (productsData && productsData.length > 0) {
              const flattened = productsData
                .map((prod: any) => flattenProduct(prod))
                .filter((prod) => {
                  const productSlug = prod.category?.slug;
                  return !productSlug || productSlug === category.slug;
                });
              setProducts(flattened);
            } else {
              setProducts([]);
              setErrorProducts(t('NO_DATA_FOR_THIS_ERA'));
            }
          } catch (err) {
            if (!isMounted) return;
            console.error('Error from pending request:', err);
            setErrorProducts('Unable to load product list');
            setProducts([]);
          }
          return;
        }

        // Create new request and store it
        const requestPromise = (async () => {
          return getProductsByCategory(category.slug, locale);
        })();
        pendingRequests.current[cacheKey] = requestPromise;

        // Always fetch fresh data from API
        const productsData = await requestPromise;

        // Clean up the pending request
        delete pendingRequests.current[cacheKey];

        if (!isMounted) return; // Check if component is still mounted

        if (productsData && productsData.length > 0) {
          const flattened = productsData
            .map((prod) => flattenProduct(prod))
            .filter((prod) => {
              const productSlug = prod.category?.slug;
              return !productSlug || productSlug === category.slug;
            });
          setProducts(flattened);
          // Cache the results
          setProductsCache((prev) => ({ ...prev, [cacheKey]: flattened }));
        } else {
          setProducts([]);
          setErrorProducts(t('NO_DATA_FOR_THIS_ERA'));
        }
      } catch (err) {
        // Clean up the pending request on error
        const cacheKey = `${category.slug}-${locale}`;
        delete pendingRequests.current[cacheKey];

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
      abortController.abort();
      // Clean up any pending requests
      const cacheKey = `${category.slug}-${locale}`;
      delete pendingRequests.current[cacheKey];
    };
  }, [activeEra, sortedCategories, locale, withProductsLoading]);

  // Lazy load products only when needed - no aggressive preloading
  useEffect(() => {
    // Only preload if enabled (disabled by default for better performance)
    if (!enablePreloading || !sortedCategories.length || !activeEra) return;

    const currentIndex = sortedCategories.findIndex((cat) => cat.slug === activeEra);
    if (currentIndex !== -1) {
      const nextEra = sortedCategories[currentIndex + 1];
      const prevEra = sortedCategories[currentIndex - 1];

      // Preload only adjacent eras (optional - can be removed for even better performance)
      const erasToPreload = [nextEra, prevEra].filter(Boolean);

      erasToPreload.forEach(async (era) => {
        if (era && !productsCache[`${era.slug}-${locale}`]) {
          try {
            const productsData = await getProductsByCategory(era.slug, locale);
            if (productsData && productsData.length > 0) {
              const flattened = productsData
                .map((prod: any) => flattenProduct(prod))
                .filter((prod) => {
                  const productSlug = prod.category?.slug;
                  return !productSlug || productSlug === era.slug;
                });
              setProductsCache((prev) => ({ ...prev, [`${era.slug}-${locale}`]: flattened }));
            }
          } catch (err) {
            console.warn(`Failed to preload products for ${era.slug}:`, err);
          }
        }
      });
    }

    // Cleanup function to clear pending requests when component unmounts
    return () => {
      // Clear all pending requests
      Object.keys(pendingRequests.current).forEach((key) => {
        delete pendingRequests.current[key];
      });
    };
  }, [activeEra, sortedCategories, locale, productsCache, enablePreloading]);

  const handleEraClick = useCallback(
    (eraSlug: string) => {
      if (eraSlug !== activeEra) {
        // Debounce rapid successive clicks (300ms)
        const now = Date.now();
        if (now - lastEraChange.current < 300) {
          return;
        }
        lastEraChange.current = now;

        // Clear current products immediately when switching
        setProducts([]);
        setErrorProducts(null);
        setActiveEra(eraSlug);
        navigate(`/browse?era=${eraSlug}`, { replace: true });

        // Scroll to top of the page when switching era
        const isMobile = window.innerWidth < 768; // md breakpoint
        window.scrollTo({
          top: isMobile ? 0 : 400,
          behavior: 'smooth',
        });
      }
    },
    [activeEra, navigate]
  );

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
      <div className="w-full min-h-screen bg-[#F7F5EA]">
        {/* Hero Section Skeleton */}
        <div className="w-full relative">
          <div className="block md:hidden w-full h-[218px] bg-[#E6DDC6] animate-pulse"></div>
          <div className="hidden md:block w-full h-[420px] bg-[#E6DDC6] animate-pulse"></div>
        </div>

        {/* Era Tabs Skeleton */}
        <div className="w-full bg-[#F7F3E8]">
          <div className="max-w-7xl mx-auto px-4 md:px-0 pt-4 md:pt-24 pb-3 md:pb-5">
            <div className="flex items-center gap-x-4 md:gap-x-2 justify-start pl-[10px] md:pl-0">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="h-4 w-10 md:w-14 bg-[#E6DDC6] rounded animate-pulse"></div>
                  {idx < 4 && <div className="text-[#E6DDC6] text-lg font-bold">+</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="w-full max-w-7xl mx-auto px-4 mt-10 grid grid-cols-1 md:grid-cols-3 gap-10 md:pl-0 pl-[20px]">
          {Array.from({ length: 6 }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))}
        </div>

        {/* Acquire or Appraise Section Skeleton */}
        <div className="mt-20">
          <div className="w-full h-32 bg-[#E6DDC6] animate-pulse"></div>
        </div>
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
        <CoverPage
          cover={
            cover ?? {
              id: 0,
              title: 'Browse',
              subTitle: 'Appreciating Chinese Works of Art',
              image: (cover as any)?.image,
            }
          }
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
              <div className="inline-flex items-center gap-x-[16px] md:gap-x-2 justify-start pl-[10px] md:pl-0 uppercase whitespace-nowrap">
                {eraTabs.map((era, idx) => (
                  <React.Fragment key={era.slug}>
                    <button
                      className={` transition-colors uppercase  text-[16px] relative pb-3 btn-clickable ${activeEra === era.slug ? 'border-b-2 border-[#23211C]  text-[#23211C] opacity-90 z-20 font-semibold' : 'text-[#23211C] border-b-0 '}`}
                      onClick={() => handleEraClick(era.slug)}
                    >
                      {era.name}
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
          Array.from({ length: 6 }).map((_, idx) => <ProductCardSkeleton key={idx} />)
        ) : errorProducts ? (
          <div className="text-center py-16">
            <p className="text-[#61422D] text-lg mb-4">{errorProducts}</p>
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
