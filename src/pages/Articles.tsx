import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import { useLoading } from '../hooks/useLoading';
import { useLanguage } from '../contexts/LanguageContext';
import tang from '../assets/tang.png';
import horse from '../assets/horse.png';
import ceramics from '../assets/ceramics.png';
import chaseCollection from '../assets/chase_collection.png';
import ceramicsMobile from '../assets/ceramics_mobile.png';
import ourArticles from '../assets/our_articles.png';
import articlesCover from '../assets/articles_cover.png';
import bigLeft from '../assets/big_left_article.png';
import bigRight from '../assets/big_right_article.png';
import { getArticles, Article } from '../api/articles';
import { getCoverUrl } from '../utils';

const ARTICLES_PER_PAGE = 5;

export default function Articles() {
  const [page, setPage] = useState(1);
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const { loading, withLoading } = useLoading(true);
  const { locale } = useLanguage();

  const featuredArticles = articles.slice(0, 2);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await getArticles(page, ARTICLES_PER_PAGE, locale);
        setArticles(response.data);
        setTotalPages(response.meta.pagination.pageCount);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    withLoading(fetchArticles);
  }, [page, locale]); // Re-fetch when locale changes

  const getPageNumbers = (current: number, total: number) => {
    const delta = 2;
    const range = [];
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }
    if (current - delta > 2) range.unshift('...');
    if (current + delta < total - 1) range.push('...');
    range.unshift(1);
    if (total > 1) range.push(total);
    return range;
  };

  const pageNumbers = getPageNumbers(page, totalPages);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5EA] flex items-center justify-center">
        <Loading fullScreen={true} text="Loading..." />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pb-24 bg-[#F7F5EA] ">
      {/* Hero Image */}
      <div className="relative w-full h-[220px] md:h-[320px] flex items-center justify-center overflow-hidden mb-8">
        <img
          src={articlesCover}
          alt={articles[0]?.title || 'Articles Cover'}
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ maxWidth: '100vw' }}
        />
      </div>
      {/* Featured Articles Section */}
      <div className="max-w-7xl mx-auto w-full pl-6 pr-6  flex flex-col gap-12 md:mt-30">
        {/* Featured Articles */}
        <div className="flex flex-col md:flex-row gap-8">
          {featuredArticles.map((article, idx) => {
            const imageUrl = getCoverUrl(article.cover);

            return (
              <div
                key={article.id}
                className={`relative h-[340px] md:h-[400px] rounded overflow-hidden group w-full ${idx === 0 ? 'md:w-4/5' : 'md:w-2/5'}`}
              >
                <img
                  src={imageUrl || articlesCover}
                  alt={article.title}
                  className="absolute inset-0 w-full h-full object-cover object-center z-0"
                  onError={(e) => {
                    console.error('Image failed to load:', imageUrl);
                    e.currentTarget.src = articlesCover;
                  }}
                />
                {/* Could add overlay title/desc/date if needed */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  <h5 className="text-[20px] md:text-[24px] leading-[28px] md:leading-[32px] font-semibold text-white mb-2 line-clamp-2">
                    {article.title}
                  </h5>
                  <div className="text-base text-white mb-3 line-clamp-2">
                    {article.description}
                  </div>
                  <div className="text-xs text-white font-semibold uppercase tracking-wider">
                    {new Date(article.publishedAt).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Latest Articles */}
        <div className="flex flex-col md:flex-row gap-8 w-full md:mt-12">
          <div className="w-full md:w-4/5">
            <h3 className="hidden md:block text-[40px] leading-[48px]font-serif font-semibold text-[#61422D] mb-8 text-left">
              Latest Articles
            </h3>
            <h5 className="block md:hidden text-[32px] leading-[40px] font-serif font-semibold text-[#61422D] mb-8 text-left">
              Latest Articles
            </h5>
            <div className="flex flex-col gap-8 items-start">
              {articles.map((article, idx) => {
                const imageUrl = getCoverUrl(article.cover);

                return (
                  <Link
                    key={article.id}
                    to={`/article/${article.slug}`}
                    className="w-full"
                    style={{ textDecoration: 'none' }}
                  >
                    {/* Mobile Card Layout */}
                    <div className="block md:hidden p-0 w-full transition-colors hover:bg-[#f3efe2]">
                      <div className="w-full">
                        <div className="w-full h-48 overflow-hidden mb-4 bg-[#E6DDC6] flex items-center justify-center">
                          <img
                            src={imageUrl || articlesCover}
                            alt={article.title}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              console.error('Image failed to load:', imageUrl);
                              e.currentTarget.src = articlesCover;
                            }}
                          />
                        </div>
                        <h5
                          className="text-2xl font-serif font-semibold mb-2 leading-snug"
                          style={{
                            fontWeight: 600,
                            fontSize: 20,
                            lineHeight: '28px',
                            letterSpacing: 0,
                            textAlign: 'left',
                            color: '#61422D',
                          }}
                        >
                          {article.title}
                        </h5>
                        <div className="text-base text-[#585550] mb-3 line-clamp-2 text-left">
                          {article.description}
                        </div>
                        <div className="text-xs text-[#7B6142] pb-6 font-semibold uppercase tracking-wider text-left">
                          {new Date(article.publishedAt).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                    {/* Desktop Grid Layout */}
                    <div className="hidden md:grid grid-cols-[1fr_238px] gap-6 pb-6 w-full hover:bg-[#f3efe2] transition-colors">
                      <div>
                        <h5
                          className="text-2xl font-serif font-semibold mb-2 leading-snug"
                          style={{
                            fontWeight: 600,
                            fontSize: 24,
                            lineHeight: '32px',
                            letterSpacing: 0,
                            textAlign: 'left',
                            color: '#61422D',
                          }}
                        >
                          {article.title}
                        </h5>
                        <div className="text-base text-[#585550] mb-3 line-clamp-2 text-left">
                          {article.description}
                        </div>
                        <div className="text-[14px] leading-[20px] text-[#585550] font-semibold uppercase tracking-wider text-left">
                          {new Date(article.publishedAt).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                      <div className="w-[238px] h-[180px] flex-shrink-0 rounded overflow-hidden bg-[#E6DDC6] flex items-center justify-center md:justify-end">
                        <img
                          src={imageUrl || articlesCover}
                          alt={article.title}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            console.error('Image failed to load:', imageUrl);
                            e.currentTarget.src = articlesCover;
                          }}
                        />
                      </div>
                    </div>
                    {/* Faded divider under each article */}
                    {idx !== articles.length - 1 && (
                      <div className="border-t-2 border-[#E5E1D7] opacity-80 my-6"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="hidden md:block md:w-2/5"></div>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12 select-none">
            <button
              className="ticket-rounded px-2 py-1 text-[#7B6142] disabled:opacity-30 rounded-lg"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              &lt;
            </button>
            {pageNumbers.map((num, idx) =>
              typeof num === 'number' ? (
                <button
                  key={num}
                  className={`ticket-rounded w-9 h-9 rounded-lg flex items-center justify-center font-semibold text-[#7B6142] ${
                    page === num ? 'bg-[#83644B] text-white' : ''
                  }`}
                  onClick={() => setPage(num)}
                >
                  {num}
                </button>
              ) : (
                <span key={idx} className="w-8 h-8 flex items-center justify-center text-[#7B6142]">
                  {num}
                </span>
              )
            )}
            <button
              className="ticket-rounded px-2 py-1 text-[#7B6142] disabled:opacity-30 rounded-lg"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
