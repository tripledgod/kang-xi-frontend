import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { useLoading } from '../hooks/useLoading';
import { useLanguage } from '../contexts/LanguageContext';
import heroImg from '../assets/ceramic_cover.png';
import heroImgMobile from '../assets/ceramic_cover_mobile.png';
import AcquireOrAppraise from '../components/AcquireOrAppraise';
import { API_URL } from '../utils/constants';
import axios from 'axios';
import { getImageUrl } from "../types/category";
import { getCategories, Category } from '../api/categories';

interface Era {
  key: string;
  label: string;
  style?: React.CSSProperties;
}

const Browse: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const { loading: categoriesLoading, withLoading: withCategoriesLoading } = useLoading(true);
  const [error, setError] = useState<string | null>(null);
  const [activeEra, setActiveEra] = useState<string>('');
  const [products, setProducts] = useState<any[]>([]);
  const { loading: productsLoading, withLoading: withProductsLoading } = useLoading(false);
  const [errorProducts, setErrorProducts] = useState<string | null>(null);
  const navigate = useNavigate();
  const { locale } = useLanguage();

  // Chuyển đổi categories thành eras
  const eras: Era[] = categories.map(category => ({
    key: category.slug,
    label: category.name,
  }));

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories(locale);
        console.log("API categories data:", categoriesData);
        if (categoriesData) {
          setCategories(categoriesData);
          // Set activeEra mặc định là category đầu tiên
          if (categoriesData.length > 0) {
            setActiveEra(categoriesData[0].slug);
          }
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      }
    };

    withCategoriesLoading(fetchCategories);
  }, [locale]); // Re-fetch when locale changes

  useEffect(() => {
    if (!activeEra || categories.length === 0) return;
    const category = categories.find((cat) => cat.slug === activeEra);
    if (!category) return;
    
    const fetchProducts = async () => {
      try {
        setErrorProducts(null);
        
        // Gọi API lấy sản phẩm theo category_id với locale
        const response = await axios.get(`${API_URL}/api/products`, {
          params: {
            'filters[category][id][$eq]': category.id,
            'locale': locale,
            'populate': '*'
          }
        });
        
        let data = response.data.data || response.data;
        
        // Xử lý cấu trúc Strapi v4
        if (Array.isArray(data) && data[0]?.attributes) {
          data = data.map((p: any) => ({ 
            ...p.attributes, 
            id: p.id,
            // Đảm bảo images được populate đúng cách
            images: p.attributes.images?.data ? 
              p.attributes.images.data.map((img: any) => ({
                ...img.attributes,
                id: img.id
              })) : p.attributes.images
          }));
        }
        
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setErrorProducts('Không thể tải danh sách sản phẩm');
      }
    };
    
    withProductsLoading(fetchProducts);
  }, [activeEra, categories, locale]); // Re-fetch when locale changes

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
      fallbackUrls = [
        firstImage.formats?.medium?.url,
        firstImage.formats?.small?.url,
        firstImage.formats?.thumbnail?.url,
        firstImage.url
      ].filter(Boolean); // Loại bỏ undefined/null
      
      // URL đầu tiên làm primary
      imageUrl = fallbackUrls[0] || '';
      
      // Chỉ nối API_URL khi URL là đường dẫn tương đối (bắt đầu bằng /uploads/)
      if (imageUrl && imageUrl.startsWith('/uploads/')) {
        imageUrl = API_URL + imageUrl;
        fallbackUrls = fallbackUrls.map(url => 
          url && url.startsWith('/uploads/') ? API_URL + url : url
        );
      }
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
                  setCurrentImageIndex(prev => prev + 1);
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
          <div className="text-base text-[#585550] mb-4 line-clamp-3">
            {product.description}
          </div>
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
                  onClick={() => setActiveEra(era.key)}
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
            <p className="text-[#61422D] text-lg">Không có sản phẩm nào cho era này.</p>
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
