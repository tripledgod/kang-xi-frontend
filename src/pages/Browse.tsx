import React, { useState, useEffect } from 'react';
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

  // Cuộn lên đầu trang mỗi khi URL thay đổi
  useEffect(() => {
    window.scrollTo(0, 400);
  }, [searchParams]);

  // Chuyển đổi categories thành eras
  const eras: Era[] = flattenedCategories.map((category) => ({
    key: category.slug,
    label: category.name,
  }));

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories(locale);
        console.log('API categories data:', categoriesData);
        if (categoriesData && categoriesData.length > 0) {
          setCategories(categoriesData);
          const flattened = categoriesData.map((cat) => flattenCategory(cat));
          setFlattenedCategories(flattened);

          const eraFromUrl = searchParams.get('era');
          const categoryExists = flattened.find(cat => cat.slug === eraFromUrl);

          if (eraFromUrl && categoryExists) {
            setActiveEra(eraFromUrl);
          } else if (flattened.length > 0) {
            setActiveEra(flattened[0].slug);
          }
        } else {
          setError('Không có categories nào được tìm thấy');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Không thể tải danh mục');
      }
    };

    withCategoriesLoading(fetchCategories);
  }, [locale, searchParams]);

  useEffect(() => {
    if (!activeEra || flattenedCategories.length === 0) return;
    const category = flattenedCategories.find((cat) => cat.slug === activeEra);
    if (!category) return;

    const fetchProducts = async () => {
      try {
        setErrorProducts(null);
        const productsData = await getProductsByCategory(category.id, locale);
        console.log('API products data:', productsData);

        if (productsData && productsData.length > 0) {
          const flattened = productsData.map((prod) => flattenProduct(prod));
          setProducts(flattened);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setErrorProducts('Không thể tải danh sách sản phẩm');
      }
    };

    withProductsLoading(fetchProducts);
  }, [activeEra, flattenedCategories, locale]);

  const handleEraClick = (eraSlug: string) => {
    setActiveEra(eraSlug);
    navigate(`/browse?era=${eraSlug}`, { replace: true });
  };

  // Component ProductCard để quản lý state ảnh cho từng sản phẩm
  const ProductCard: React.FC<{ product: any; navigate: any }> = ({ product, navigate }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageError, setImageError] = useState(false);

    // Lấy ảnh chính từ mảng images
    let imageUrl = '';
    let fallbackUrls: string[] = [];

    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0];

      // Tạo danh sách fallback URLs theo thứ tự ưu tiên
      const rawUrls = [
        firstImage.formats?.medium?.url,
        firstImage.formats?.small?.url,
        firstImage.formats?.thumbnail?.url,
        firstImage.url,
      ].filter(Boolean); // Loại bỏ undefined/null

      // Xử lý URL - nối với API_URL nếu là đường dẫn tương đối
      fallbackUrls = rawUrls.map((url) => {
        if (url && url.startsWith('/uploads/')) {
          return `${API_URL}${url}`;
        }
        return url;
      });

      // URL đầu tiên làm primary
      imageUrl = fallbackUrls[0] || '';
    }

    return (
      <div
        key={product.id}
        className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow rounded"
        onClick={() => navigate(`/products/${product.slug}`)}
      >
        <div className="bg-[#E6DDC6] aspect-square w-full flex items-center justify-center overflow-hidden mb-4">
          {imageUrl && !imageError ? (
            <img
              src={fallbackUrls[currentImageIndex] || imageUrl}
              alt={product.title || 'Product Image'}
              className="object-contain w-full h-full"
              onError={(e) => {
                // Thử ảnh tiếp theo trong danh sách fallback
                if (currentImageIndex < fallbackUrls.length - 1) {
                  setCurrentImageIndex((prev) => prev + 1);
                } else {
                  // Đã thử hết tất cả ảnh, hiển thị placeholder
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
        <h2 className="text-[24px] font-medium text-[#61422D] mb-2 leading-[32px] tracking-[0px]">
          {product.title}
        </h2>
        {product.description && (
          <div className="text-base text-[#585550] mb-4 line-clamp-3">{product.description}</div>
        )}
        {/* Thanh kẻ mờ */}
        <div className="border-t-2 border-[#E5E1D7] opacity-80 my-3"></div>
        <div className="flex flex-row justify-between text-xs text-[#23211C] font-semibold">
          <span>
            {product.ageFrom} - {product.ageTo}
          </span>
          <span>ITEM {product.itemCode || product.documentId}</span>
        </div>
      </div>
    );
  };

  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-[#F7F5EA] flex items-center justify-center">
        <Loading fullScreen text="Loading categories..." />
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
        <div className="max-w-6xl mx-auto px-4 pt-4 md:pt-20 overflow-x-auto whitespace-nowrap">
          <div className="inline-flex items-center gap-x-2 justify-start pl-[64px] uppercase">
            {eras.map((era, idx) => (
              <React.Fragment key={era.key}>
                <button
                  className={`pb-2 transition-colors uppercase ${activeEra === era.key ? 'border-b-2 border-[#23211C] text-[#23211C]' : 'text-[#23211C] border-b-0'}`}
                  onClick={() => handleEraClick(era.key)}
                  style={era.style}
                >
                  {era.label}
                </button>
                {idx < eras.length - 1 && (
                  <span className="text-[#D6C7A1] text-lg mx-2 flex items-center select-none">
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
            <Loading size="large" text="Loading products..." />
          </div>
        ) : errorProducts ? (
          <div className="text-center py-16">
            <p className="text-[#61422D] text-lg mb-4">{errorProducts}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#7B6142] text-white rounded hover:bg-[#6a5437]"
            >
              Try Again
            </button>
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
