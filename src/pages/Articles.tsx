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
import articlesCover from '../assets/hero_image.png';
import heroMobileImage from '../assets/hero_mobile_image.png';
import bigLeft from '../assets/big_left_article.png';
import bigRight from '../assets/big_right_article.png';
import { getArticles, Article } from '../api/articles';
import { getCoverUrl } from '../utils';
import { useScrollToTop } from '../hooks/useScrollToTop';

const ARTICLES_PER_PAGE = 5;

export default function Articles() {
  const [page, setPage] = useState(1);
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const { loading, withLoading } = useLoading(true);
  const { locale } = useLanguage();
  const scrollToTop = useScrollToTop();

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
      <div className="min-h-screen bg-[#F7F3E8] flex items-center justify-center">
        <Loading fullScreen={true} text="Loading..." />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pb-24 bg-[#F7F3E8] ">
      {/* Hero Image */}
      <div className="relative w-full h-[220px] md:h-[312px] flex items-center justify-center overflow-hidden mb-6 md:pt-[96px] md:pb-[96px]">
        {/* Mobile Hero Image */}
        <img
          src={heroMobileImage}
          alt="Articles Cover"
          className="absolute inset-0 w-full h-full object-cover object-center md:hidden"
          style={{ maxWidth: '100vw' }}
        />
        {/* Desktop Hero Image */}
        <img
          src={articlesCover}
          alt="Articles Cover"
          className="absolute inset-0 w-full h-full object-cover object-center hidden md:block"
          style={{ maxWidth: '100vw' }}
        />
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        {/* Add prominent title on hero image if needed */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <h3
            className="text-white text-[40px] leading-[48px] drop-shadow-lg text-center md:hidden"
            style={{ letterSpacing: '-0.01em' }}
          >
            Articles
          </h3>
          <h1
            className="hidden md:block text-white text-[60px] leading-[72px] drop-shadow-lg text-center"
            style={{ letterSpacing: '-0.02em' }}
          >
            Articles
          </h1>
          <p className="text-white md:hidden drop-shadow-lg  text-[18px] leading-[26px] mt-4">
            Appreciating Chinese Works of Art
          </p>
          <p className="text-white hidden md:block drop-shadow-lg text-[20px] leading-[28px] mt-5  ">
            Appreciating Chinese Works of Art
          </p>
        </div>
      </div>
      {/* Featured Articles Section */}
      <div className="md:px-28  px-4 w-full mx-auto flex flex-col gap-12 md:mt-24">
        {/* Featured Articles */}
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8 mx-auto w-full transition-all duration-300">
          {featuredArticles.map((article, idx) => {
            const imageUrl = getCoverUrl(article.cover);

            // Function to handle scroll to top before page navigation
            const handleFeaturedArticleClick = (e: React.MouseEvent) => {
              scrollToTop();
            };

            return (
              <Link
                key={article.id}
                to={`/article/${article.slug}`}
                className={`w-full ${idx === 0 ? 'flex-2' : 'flex-1'}`}
                style={{ textDecoration: 'none' }}
                onClick={handleFeaturedArticleClick}
              >
                {/* Mobile Layout */}
                <div className="block lg:hidden">
                  <div
                    className="relative h-[343px] overflow-hidden w-full transition-all duration-300 cursor-pointer"
                    style={{ backgroundColor: '#E6DDC6' }}
                  >
                    <img
                      src={imageUrl || articlesCover}
                      alt={article.title}
                      className="absolute inset-0 w-full h-full object-cover object-center z-0"
                      loading="eager"
                      onError={(e) => {
                        console.error('Featured image failed to load:', imageUrl);
                        e.currentTarget.src = articlesCover;
                      }}
                      style={{ 
                        minHeight: '343px',
                        width: '100%',
                        height: '100%'
                      }}
                    />
                    <div className="absolute inset-0 bg-black opacity-40 z-20"></div>
                    {/* Mobile Content Overlay on Image */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-30">
                      <h5 className="text-[20px] leading-[28px] text-white mb-2 line-clamp-2 drop-shadow-lg">
                        {article.title}
                      </h5>
                      <div className="text-base text-white mb-3 line-clamp-2 drop-shadow-lg">
                        {article.description}
                      </div>
                      <div className="text-xs text-white uppercase font-semibold tracking-wider drop-shadow-lg">
                        {new Date(article.publishedAt)
                          .toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                          .replace(/\b([a-z]{3})\b/i, (m) => m.toUpperCase())}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div
                  className="hidden lg:block relative h-[480px] overflow-hidden group flex-shrink-0 transition-all duration-300 w-full cursor-pointer"
                  style={{ backgroundColor: '#E6DDC6' }}
                >
                  <img
                    src={imageUrl || articlesCover}
                    alt={article.title}
                    className="absolute inset-0 w-full h-full object-cover object-center z-0"
                    loading="eager"
                    onError={(e) => {
                      console.error('Featured image failed to load:', imageUrl);
                      e.currentTarget.src = articlesCover;
                    }}
                    style={{ 
                      minHeight: '480px',
                      width: '100%',
                      height: '100%'
                    }}
                  />
                  <div className="absolute inset-0 bg-black opacity-40 z-20"></div>
                  {/* Overlay title/desc/date always white and clear */}
                  <div className="absolute bottom-0 left-0 right-0 md:p-6 p-4 z-30">
                    <h5 className="text-[20px] md:text-[24px] leading-[28px] md:leading-[32px] text-white mb-2 line-clamp-2 drop-shadow-lg">
                      {article.title}
                    </h5>
                    <div className="text-base text-white mb-3 line-clamp-2 drop-shadow-lg">
                      {article.description}
                    </div>
                    <div className="text-[14px]  leading-[20px] text-white uppercase tracking-wider font-semibold drop-shadow-lg">
                      {new Date(article.publishedAt)
                        .toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                        .replace(/\b([a-z]{3})\b/i, (m) => m.toUpperCase())}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        {/* Latest Articles */}
        <div className="flex flex-col lg:flex-row gap-8 md:mt-12 transition-all duration-300">
          <div className="w-full lg:w-2/3">
            <div className="md:pr-6">
            <h3 className="hidden md:block text-[40px] leading-[48px]font-serif text-[#61422D] mb-8 text-left">
              Latest Articles
            </h3>
            <h5 className="block md:hidden text-[32px] leading-[40px] font-serif text-[#61422D] mb-8 text-left">
              Latest Articles
            </h5>
            <div className="flex flex-col gap-8 items-start">
              {articles.map((article, idx) => {
                const imageUrl = getCoverUrl(article.cover);

                // Function to handle scroll to top before page navigation
                const handleArticleClick = (e: React.MouseEvent) => {
                  scrollToTop();
                };

                return (
                  <Link
                    key={article.id}
                    to={`/article/${article.slug}`}
                    className="w-full"
                    style={{ textDecoration: 'none' }}
                    onClick={handleArticleClick}
                  >
                    {/* Mobile Card Layout */}
                    <div className="block md:hidden p-0 w-full">
                      <div className="w-full flex flex-col h-full">
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
                          className="text-2xl font-serif mb-2 line-clamp-2 leading-snug"
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
                        <div className="text-base text-[#585550] mb-3 line-clamp-3 text-left">
                          {article.description}
                        </div>
                        <div className="flex-1"></div>
                        <div className="text-xs font-semibold text-[#7B6142] pb-6 uppercase tracking-wider text-left">
                          {new Date(article.publishedAt)
                            .toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                            .replace(/\b([a-z]{3})\b/i, (m) => m.toUpperCase())}
                        </div>
                      </div>
                    </div>
                    {/* Desktop Grid Layout */}
                    <div className="hidden md:grid grid-cols-[1fr_238px] gap-6 w-full">
                      <div className="flex flex-col h-full min-w-0">
                        <h5
                          className="text-2xl font-serif mb-2 leading-snug line-clamp-2"
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
                        <div className="text-base text-[#585550] mb-3 line-clamp-3 text-left">
                          {article.description}
                        </div>
                        <div className="flex-1"></div>
                        <div className="text-[14px] font-semibold leading-[20px] text-[#585550] uppercase tracking-wider text-left">
                          {new Date(article.publishedAt)
                            .toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                            .replace(/\b([a-z]{3})\b/i, (m) => m.toUpperCase())}
                        </div>
                      </div>
                      <div className="w-[238px] h-[180px] flex-shrink-0 overflow-hidden bg-[#E6DDC6] flex items-center justify-center">
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
                      <div className="border-t-2 border-[#E5E1D7] opacity-80 mt-8"></div>
                    )}
                  </Link>
                );
              })}
            </div>
            </div>
          </div>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12 select-none">
            <button
              className="ticket-rounded px-2 py-1 text-[#414651]  rounded-lg btn-clickable"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              &lt;
            </button>
            {pageNumbers.map((num, idx) =>
              typeof num === 'number' ? (
                <button
                  key={num}
                  className={`ticket-rounded w-9 h-9 rounded-lg flex items-center justify-center text-[#535862] btn-clickable ${
                    page === num ? 'bg-[#133A4A] text-white' : ''
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
              className="ticket-rounded px-2 py-1 text-[#414651]  rounded-lg btn-clickable"
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
