import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from './Button';
import Loading from './Loading';
import { useNavigate } from 'react-router-dom';
import { getArticles, Article } from '../api/articles';
import { useLoading } from '../hooks/useLoading';
import { useLanguage } from '../contexts/LanguageContext';
import { getCoverUrl } from '../utils';

export default function ArticlesSection() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const { loading, withLoading } = useLoading(true);
  const { locale } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await getArticles(1, 3, locale); // Get 3 latest articles per month
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    withLoading(fetchArticles);
  }, [locale]); // Re-fetch when locale changes

  const handleArticleClick = (slug: string) => {
    navigate(`/article/${slug}`);
  };

  return (
    <section className="w-full bg-[#F7F5EA] px-4 py-16">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h2 className="text-[32px] leading-[40px] md:text-[48px] md:leading-[58px] font-semibold text-[#61422D] mb-2 text-center">
          Our Articles
        </h2>
        <div className="text-[18px] leading-[26px] mb-12 text-center font-normal text-[#342216]">
          Feature articles of the month
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {loading ? (
            <div className="col-span-3 flex justify-center py-8">
              <Loading size="large" text="Loading articles..." />
            </div>
          ) : (
            articles.map((article) => {
              const imageUrl = getCoverUrl(article.cover);

              return (
                <div
                  key={article.id}
                  className="flex flex-col cursor-pointer transition-transform duration-200 hover:scale-105"
                  onClick={() => handleArticleClick(article.slug)}
                >
                  <div className="bg-[#E6DDC6] aspect-square w-full flex items-center justify-center overflow-hidden mb-4">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={article.title}
                        className="object-cover w-full h-full"
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
                  <h2
                    className="mb-2 leading-snug line-clamp-2"
                    style={{
                      fontWeight: 500,
                      fontSize: 24,
                      lineHeight: '32px',
                      letterSpacing: 0,
                      textAlign: 'left',
                      color: '#61422D',
                    }}
                  >
                    {article.title}
                  </h2>
                  <div
                    className="font-pingfang text-[16px] leading-[24px] font-normal mb-4 line-clamp-3"
                    style={{ color: '#585550' }}
                  >
                    {article.description}
                  </div>
                  <div
                    className="text-[14px] font-semibold leading-[20px] line-clamp-2"
                    style={{ color: '#585550' }}
                  >
                    {new Date(article.publishedAt).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="flex justify-center w-full max-w-6xl  mx-auto ">
          <Button
            text={t('VIEW ALL ARTICLES')}
            variant="outline"
            onClick={() => navigate('/articles')}
          />
        </div>
      </div>
    </section>
  );
}
