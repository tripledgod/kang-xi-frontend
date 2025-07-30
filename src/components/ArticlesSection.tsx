import  { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import { getArticles, Article } from '../api/articles';
import { useLanguage } from '../contexts/LanguageContext';
import { getCoverUrl } from '../utils';

export default function ArticlesSection() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { locale } = useLanguage();
  const { t } = useTranslation();

  // Responsive
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const response = await getArticles(1, 3, locale);
        setArticles(response.data || []);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, [locale]);

  const handleArticleClick = (slug: string) => {
    navigate(`/article/${slug}`);
  };

  return (
    <section className="w-full bg-[#F7F5EA] px-4 py-16">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {isMobile ? (
          <h4 className="text-[32px] leading-[40px]  font-semibold text-[#61422D] mb-2 text-center">
            Our Articles
          </h4>
        ) : (
          <h2 className="text-[48px] leading-[58px]  font-semibold text-[#61422D] mb-2 text-center">
            Our Articles
          </h2>
        )}
        <div
          className="text-[18px] leading-[26px] mb-12 text-center  text-[#342216]"
          style={{
            
            fontSize: 18,
            lineHeight: '26px',
            letterSpacing: 0,
            wordSpacing: '2px',
            opacity: 0.8,
          }}
        >
          Feature articles of the month
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 min-h-[320px] flex-1">
          {isLoading ? (
            <div className="col-span-3 flex justify-center items-center py-16 w-full">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-2 border-[#61422D] border-t-transparent rounded-full animate-spin mb-4"></div>
                <span className="text-[#61422D] text-base font-medium">Loading...</span>
              </div>
            </div>
          ) : (
            articles.map((article) => {
              const imageUrl = getCoverUrl(article.cover);
              return (
                <div
                  key={article.id}
                  className="flex flex-col cursor-pointer"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'auto' });
                    handleArticleClick(article.slug);
                  }}
                >
                  <div className="bg-[#E6DDC6] aspect-square w-full flex items-center justify-center overflow-hidden mb-4">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={article.title}
                        className="object-cover w-full h-full"
                        loading="lazy"
                        onError={(e) => {
                          console.error('Image failed to load:', imageUrl);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="text-[#61422D] text-center p-4">
                        <div className="text-6xl mb-3 opacity-50">📄</div>
                        <div className="text-sm font-medium">No Image</div>
                      </div>
                    )}
                  </div>
                  <h5
                    className="mb-2 font-serif font-medium text-[#61422D] md:h-16 overflow-hidden line-clamp-2 text-[20px] md:text-[24px] leading-[28px] md:leading-[32px]"
                    style={{
                      fontWeight: 600,
                      letterSpacing: '0.2px',
                      wordSpacing: '2px',
                      textAlign: 'left',
                      color: '#61422D',
                    }}
                  >
                    {article.title}
                  </h5>
                  <div
                    className="font-pingfang  mb-4 text-base leading-6 md:h-[72px] overflow-hidden line-clamp-3"
                    style={{
                      color: '#585550',
                      fontSize: 16,
                      letterSpacing: '0.2px',
                      wordSpacing: '2px',
                    }}
                  >
                    {article.description}
                  </div>
                  <div
                    className="text-[14px] font-semibold leading-[20px] line-clamp-2 uppercase"
                    style={{ color: '#585550' }}
                  >
                    {new Date(article.publishedAt)
                      .toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                      .replace(/\b([a-z]{3})\b/i, (m) => m.toUpperCase())}
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="flex justify-center w-full max-w-6xl  mx-auto ">
          <Button
            text={t('VIEW_ALL_ARTICLES')}
            variant="outline"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'auto' });
              navigate('/articles');
            }}
          />
        </div>
      </div>
    </section>
  );
}
