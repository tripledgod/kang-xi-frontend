import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { getArticleBySlug, getRelatedArticles, Article } from '../api/articles';
import { API_URL } from '../utils/constants';
import Loading from '../components/Loading';
import { useLanguage } from '../contexts/LanguageContext';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function RelatedArticles({ related }: { related: Article[] }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="w-full py-16 px-4">
      <h2 className="text-4xl font-serif font-medium text-[#61422D] mb-12 text-center">
        Related Articles
      </h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {related.map((article) => (
          <div key={article.id} className="flex flex-col">
            <div className="bg-[#E6DDC6] aspect-square w-full flex items-center justify-center overflow-hidden mb-4">
              <img
                src={`${API_URL}${article.cover.formats.medium.url}`}
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
          text={t('VIEW ALL ARTICLES')}
          variant="outline"
          onClick={() => navigate('/articles')}
        />
      </div>
    </section>
  );
}

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { locale } = useLanguage();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
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

        setArticle(articleData);
        const id = articleData.id;
        const related = await getRelatedArticles(id, 3, locale);
        setRelatedArticles(related.data);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Không thể tải bài viết');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug, locale]); // Re-fetch when locale changes

  if (loading || !article) {
    return (
      <div className="min-h-screen bg-[#F7F5EA] flex items-center justify-center">
        <Loading fullScreen text="Loading article..." />
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
        <img
          src={`${API_URL}${article.cover.formats.large.url}`}
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
