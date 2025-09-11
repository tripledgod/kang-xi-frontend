import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { getArticleBySlug, getRelatedArticles, Article } from '../api/articles';
import { API_URL } from '../utils/constants';
import { getImageUrl } from '../utils';
import { useLanguage } from '../contexts/LanguageContext';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { RelatedArticleSkeleton } from '../components/ShimmerSkeleton';

// Image component with error handling and fallback
const ArticleImage = ({
  cover,
  alt,
  className = '',
}: {
  cover: any;
  alt: string;
  className?: string;
}) => {
  const [imageError, setImageError] = useState<boolean>(false);
  const imageUrl = getImageUrl(cover);

  const handleImageError = () => {
    setImageError(true);
  };

  if (!cover || imageError || !imageUrl) {
    return (
      <div className={`bg-[#E6DDC6] flex items-center justify-center ${className}`}>
        <div className="text-center text-[#7B6142]">
          <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm">No image available</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      loading={'lazy'}
      alt={alt}
      className={className}
      onError={handleImageError}
    />
  );
};

function RelatedArticles({ related, loading }: { related: Article[], loading: boolean }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleArticleClick = (slug: string) => {
    navigate(`/article/${slug}`);
  };

  return (
    <section className="w-full py-24 px-4">
      <h2 className="text-4xl text-[#61422D] mb-16 text-center">Related Articles</h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 md:mb-16">
        {loading ? (
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <RelatedArticleSkeleton key={index} />
            ))}
          </>
        ) : (
          related.map((article) => (
          <div
            key={article.id}
            className="flex flex-col cursor-pointer"
            onClick={() => handleArticleClick(article.slug)}
          >
            <div className="bg-[#E6DDC6] aspect-square w-full flex items-center justify-center overflow-hidden mb-4">
              <ArticleImage
                cover={article.cover}
                alt={article.title}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Title with fixed height of 2 lines only on desktop */}
            <div>
              <h5
                className="md:text-[24px] md:leading-[32px] text-20[px] leading[28px] text-[#61422D] mb-[8px] md:mb-[9px]"
                style={{
                  // fontFamily: 'Noto Serif SC, serif',
                  // fontWeight: 600,

                  letterSpacing: 0,
                  textAlign: 'left',
                  color: '#1E1E1E',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {article.title}
              </h5>
            </div>

            {/* Description with fixed height of 3 lines only on desktop */}
            <div className="md:h-20 mb-4">
              <div
                className="font-pingfang text-base leading-6 overflow-hidden"
                style={{
                  color: '#585550',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {article.description}
              </div>
            </div>

            <div className="text-[14px] leading-[20px] text-[#585550] uppercase  font-semibold tracking-wider mt-auto">
              {new Date(article.publishedAt)
                .toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
                .toUpperCase()
                .replace(/,/g, '')}
            </div>
          </div>
          ))
        )}
      </div>
      <div className="flex justify-center">
        <Button
          text={t('VIEW_ALL_ARTICLES')}
          variant="outline"
          onClick={() => navigate('/articles')}
        />
      </div>
    </section>
  );
}

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const { locale } = useLanguage();
  const [error, setError] = useState<string | null>(null);

  // Scroll to top when slug changes (every time article changes)
  // Removed - handled by global ScrollToTop component

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/api/articles`, {
          params: {
            'filters[slug][$eq]': slug,
            locale: locale,
            populate: '*',
          },
        });

        let articleData = response.data.data || response.data;

        // Handle Strapi v4 structure
        if (Array.isArray(articleData) && articleData[0]?.attributes) {
          articleData = articleData[0].attributes;
          articleData.id = response.data.data[0].id;
        } else if (Array.isArray(articleData)) {
          articleData = articleData[0];
        }

        if (!articleData) {
          throw new Error('Article not found');
        }

        
        setArticle(articleData);
        const id = articleData.id;
        
        const related = await getRelatedArticles(id, 3, locale);
        setRelatedArticles(related.data);
        setRelatedLoading(false);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Unable to load article');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug, locale]); // Re-fetch when locale changes

  if (error || (!loading && !article)) {
    return (
      <div className="min-h-screen bg-[#F7F5EA] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-[#61422D] mb-4">
            {error || 'Article not found'}
          </h1>
          <Button text="Back to Articles" onClick={() => navigate('/articles')} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F7F5EA]">
      <div className="max-w-2xl mx-auto px-4 pt-8">
        {loading ? (
          <>
            {/* Date shimmer */}
            <div className="text-[14px] leading-[20px] text-[#6D6A66] uppercase font-semibold tracking-wider mb-2">
              <div className="h-4 w-32 bg-[#E6DDC6] rounded animate-pulse"></div>
            </div>
            
            {/* Title shimmer */}
            <div className="hidden md:block text-[40px] leading-[48px] text-[#61422D] mb-2">
              <div className="h-12 w-full bg-[#E6DDC6] rounded animate-pulse mb-2"></div>
              <div className="h-12 w-4/5 bg-[#E6DDC6] rounded animate-pulse"></div>
            </div>
            <div className="block md:hidden text-[32px] leading-[40px] text-[#61422D] mb-2">
              <div className="h-10 w-full bg-[#E6DDC6] rounded animate-pulse mb-2"></div>
              <div className="h-10 w-4/5 bg-[#E6DDC6] rounded animate-pulse"></div>
            </div>
            
            {/* Short description shimmer */}
            <div className="text-[20px] leading-[28px] text-[#585550] mt-6">
              <div className="h-7 w-full bg-[#E6DDC6] rounded animate-pulse mb-2"></div>
              <div className="h-7 w-5/6 bg-[#E6DDC6] rounded animate-pulse"></div>
            </div>
            
            {/* Main image shimmer */}
            <div className="w-full h-64 md:h-96 bg-[#E6DDC6] rounded md:my-16 my-8 animate-pulse"></div>
            
            {/* Main content shimmer */}
            <div className="prose max-w-none text-[#585550] text-[16px] md:text-[18px] leading-[24px] md:leading-[26px]">
              <div className="space-y-3">
                <div className="h-6 w-full bg-[#E6DDC6] rounded animate-pulse"></div>
                <div className="h-6 w-full bg-[#E6DDC6] rounded animate-pulse"></div>
                <div className="h-6 w-5/6 bg-[#E6DDC6] rounded animate-pulse"></div>
                <div className="h-6 w-full bg-[#E6DDC6] rounded animate-pulse"></div>
                <div className="h-6 w-4/5 bg-[#E6DDC6] rounded animate-pulse"></div>
                <div className="h-6 w-full bg-[#E6DDC6] rounded animate-pulse"></div>
                <div className="h-6 w-3/4 bg-[#E6DDC6] rounded animate-pulse"></div>
                <div className="h-6 w-full bg-[#E6DDC6] rounded animate-pulse"></div>
                <div className="h-6 w-5/6 bg-[#E6DDC6] rounded animate-pulse"></div>
                <div className="h-6 w-4/5 bg-[#E6DDC6] rounded animate-pulse"></div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Actual content */}
            <div className="text-[14px] leading-[20px] text-[#6D6A66] uppercase font-semibold tracking-wider mb-2">
              {new Date(article.publishedAt)
                .toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
                .toUpperCase()
                .replace(/,/g, '')}
            </div>
            <h3 className="hidden md:block text-[40px] leading-[48px] text-[#61422D] mb-2">
              {article.title}
            </h3>
            <h4 className="block md:hidden text-[32px] leading-[40px] text-[#61422D] mb-2">
              {article.title}
            </h4>
            {article.shortDescription && (
              <div className="text-[20px] leading-[28px] text-[#585550] mt-6">
                {article.shortDescription}
              </div>
            )}
            <ArticleImage
              cover={article.cover}
              alt={article.title}
              className="w-full h-auto rounded md:my-16 my-8"
            />
            <div className="prose max-w-none text-[#585550] text-[16px] md:text-[18px] leading-[24px] md:leading-[26px] [&_img]:my-8 md:[&_img]:my-12 [&_img]:mx-auto [&_img]:block">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.description}</ReactMarkdown>
            </div>
          </>
        )}
      </div>
      <RelatedArticles related={relatedArticles} loading={relatedLoading} />
    </div>
  );
}
