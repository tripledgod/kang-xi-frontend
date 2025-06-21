// Helper functions để xử lý era mapping

// Era names theo ngôn ngữ
export const ERA_NAMES = {
  en: ['Tang', 'Song', 'Yuan', 'Ming', 'Qing'],
  'zh-CN': ['歌曲', '唐', '元', '明', '清']
};

// Mapping giữa các locale để tìm sản phẩm tương ứng
export const ERA_MAPPING = {
  // Tiếng Anh -> Tiếng Trung
  'Tang': '歌曲',
  'Song': '唐', 
  'Yuan': '元',
  'Ming': '明',
  'Qing': '清',
  // Tiếng Trung -> Tiếng Anh
  '歌曲': 'Tang',
  '唐': 'Song',
  '元': 'Yuan', 
  '明': 'Ming',
  '清': 'Qing'
};

// Function để tìm sản phẩm cho era, với fallback logic
export const findProductForEra = (products: any[], eraName: string, locale: string) => {
  // 1. Tìm exact match trong locale hiện tại
  let found = products.find((p: any) => p.category?.name === eraName);
  
  if (found) {
    return found;
  }
  
  // 2. Nếu không tìm thấy, tìm trong locale khác và map về
  const otherLocale = locale === 'en' ? 'zh-CN' : 'en';
  const mappedEraName = ERA_MAPPING[eraName as keyof typeof ERA_MAPPING];
  
  if (mappedEraName) {
    found = products.find((p: any) => p.category?.name === mappedEraName);
    
    if (found) {
      return found;
    }
  }
  
  // 3. Tìm partial match (case insensitive)
  found = products.find((p: any) => {
    const categoryName = p.category?.name || '';
    return categoryName.toLowerCase().includes(eraName.toLowerCase()) ||
           eraName.toLowerCase().includes(categoryName.toLowerCase());
  });
  
  if (found) {
    return found;
  }
  
  return null;
};

// Function để lấy era names cho locale
export const getEraNamesForLocale = (locale: string) => {
  return ERA_NAMES[locale as keyof typeof ERA_NAMES] || ERA_NAMES.en;
};

// Function để tạo placeholder era
export const createPlaceholderEra = (eraName: string) => {
  return {
    name: eraName,
    years: '',
    desc: `No products available for ${eraName} era`,
    img: '',
    id: `placeholder-${eraName}`,
    slug: `placeholder-${eraName}`,
    isPlaceholder: true
  };
}; 