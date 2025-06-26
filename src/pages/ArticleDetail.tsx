import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { getArticleBySlug, getRelatedArticles, Article } from '../api/articles';
import { API_URL } from '../utils/constants';
import { getImageUrl } from '../utils';
import Loading from '../components/Loading';
import { useLanguage } from '../contexts/LanguageContext';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

  return <img src={imageUrl} alt={alt} className={className} onError={handleImageError} />;
};

function RelatedArticles({ related }: { related: Article[] }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleArticleClick = (slug: string) => {
    // Scroll to top before navigating
    window.scrollTo(0, 0);
    navigate(`/article/${slug}`);
  };

  return (
    <section className="w-full py-16 px-4">
      <h2 className="text-4xl font-serif font-medium text-[#61422D] mb-12 text-center">
        Related Articles
      </h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {related.map((article) => (
          <div
            key={article.id}
            className="flex flex-col  cursor-pointer transition-transform duration-200 hover:scale-105"
            onClick={() => handleArticleClick(article.slug)}
          >
            <div className="bg-[#E6DDC6] aspect-square w-full flex items-center justify-center overflow-hidden mb-4">
              <ArticleImage
                cover={article.cover}
                alt={article.title}
                className="object-cover w-full h-full"
              />
            </div>

            <h2
              className="text-xl font-serif font-medium text-[#61422D] mb-2 leading-snug line-clamp-2"
              style={{
                fontFamily: 'Source Han Serif SC VF, serif',
                fontWeight: 600,
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
              className="font-pingfang text-base font-normal leading-6 mb-4 line-clamp-3"
              style={{ color: '#342216' }}
            >
              {article.description}
            </div>
            <div className="text-xs text-[#585550] font-semibold uppercase tracking-wider">
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </div>
          </div>
        ))}
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
  const { locale } = useLanguage();
  const [error, setError] = useState<string | null>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5EA] flex items-center justify-center">
        <Loading fullScreen={true} text="Loading..." />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-[#F7F5EA] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-semibold text-[#61422D] mb-4">
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
        <div className="text-xs text-[#7B6142] font-semibold uppercase tracking-wider mb-2">
          {new Date(article.publishedAt).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-semibold text-[#61422D] mb-2 leading-tight">
          {article.title}
        </h1>
        <div className="text-base text-[#585550] mb-4">by Kangxi Finder</div>
        <ArticleImage
          cover={article.cover}
          alt={article.title}
          className="w-full h-auto rounded mb-8"
        />
        <div className="prose max-w-none text-[#23211C]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.description}</ReactMarkdown>
        </div>
      </div>
      <RelatedArticles related={relatedArticles} />
    </div>
  );
}
