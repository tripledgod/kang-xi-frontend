import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import { useLoading } from '../hooks/useLoading';
import { useLanguage } from '../contexts/LanguageContext';
import articlesCover from '../assets/hero_image.png';
import heroMobileImage from '../assets/hero_mobile_image.png';
import { getArticles, getHeaderArticle, getArticlesByIds, Article } from '../api/articles';
import { getCoverUrl } from '../utils';
import { useScrollToTop } from '../hooks/useScrollToTop';

const ARTICLES_PER_PAGE = 5;

export default function Articles() {
  const [page, setPage] = useState(1);
  const [articles, setArticles] = useState<Article[]>([]);
  const [headerArticles, setHeaderArticles] = useState<Article[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const { loading, withLoading } = useLoading(true);
  const { locale } = useLanguage();
  const scrollToTop = useScrollToTop();

  const featuredArticles = headerArticles.length > 0
    ? [
        ...headerArticles,
        ...articles.filter((a) => !headerArticles.some((h) => h.id === a.id)).slice(0, Math.max(0, 2 - headerArticles.length)),
      ].slice(0, 2)
    : articles.slice(0, 2);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Fetch header featured article on locale change
  useEffect(() => {
    const fetchHeader = async () => {
      try {
        const response = await getHeaderArticle(locale);
        let headerList = response.data?.articles || [];

        // If covers are missing, enrich by fetching full articles by ids
        const hasCover = (a: Article) => Boolean((a as any)?.cover);
        if (headerList.length && headerList.some((a) => !hasCover(a))) {
          const ids = headerList.map((a) => a.id);
          const enriched = await getArticlesByIds(ids, locale);
          // Keep backend order by mapping back
          const byId = new Map(enriched.data.map((a) => [a.id, a] as const));
          headerList = headerList.map((a) => byId.get(a.id) || a);
        }

        setHeaderArticles(headerList);
      } catch (error) {
        console.error('Error fetching header article:', error);
        setHeaderArticles([]);
      }
    };

    withLoading(fetchHeader);
  }, [locale]);

  // Scroll to top when page changes
  useEffect(() => {
    if (page > 1) {
      scrollToTop();
    }
  }, [page, scrollToTop]);

  const getPageNumbers = (current: number, total: number, isMobile: boolean = false) => {
    if (isMobile) {
      // Mobile: show 2 pages at start, 2 pages at end, with ... in between
      const range = [];

      if (total <= 6) {
        // If total pages <= 6, show all pages
        for (let i = 1; i <= total; i++) {
          range.push(i);
        }
      } else {
        // Show first 2 pages
        range.push(1, 2);

        if (current <= 3) {
          // If current page is in first 3 pages, show next 2 pages
          range.push(3, 4);
          if (total > 4) range.push('...');
        } else if (current >= total - 2) {
          // If current page is in last 3 pages, show previous 2 pages
          if (current > total - 2) range.push('...');
          range.push(total - 3, total - 2);
        } else {
          // Show ... and current page with neighbors
          range.push('...');
          range.push(current - 1, current, current + 1);
          range.push('...');
        }

        // Show last 2 pages
        if (total > 2) {
          range.push(total - 1, total);
        }
      }

      return range;
    } else {
      // Desktop: show 3 pages at start, 3 pages at end, with ... in between
      const range = [];

      if (total <= 8) {
        // If total pages <= 8, show all pages
        for (let i = 1; i <= total; i++) {
          range.push(i);
        }
      } else {
        // Show first 3 pages
        range.push(1, 2, 3);

        if (current <= 4) {
          // If current page is in first 4 pages, show next 3 pages
          range.push(4, 5, 6);
          if (total > 6) range.push('...');
        } else if (current >= total - 3) {
          // If current page is in last 4 pages, show previous 3 pages
          if (current > total - 3) range.push('...');
          range.push(total - 5, total - 4, total - 3);
        } else {
          // Show ... and current page with neighbors
          range.push('...');
          range.push(current - 1, current, current + 1);
          range.push('...');
        }

        // Show last 3 pages
        if (total > 3) {
          range.push(total - 2, total - 1, total);
        }
      }

      return range;
    }
  };

  const pageNumbers = getPageNumbers(page, totalPages, isMobile); // Determine if mobile

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-[#F7F3E8] flex items-center justify-center">
  //       <Loading fullScreen={true} text="Loading..." />
  //     </div>
  //   );
  // }

  return (
    <div className="w-full min-h-screen md:pb-24 pb-12 bg-[#F7F3E8] ">
      {loading && <Loading fullScreen={true} size="large" />}
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
      <div className="md:px-28  px-4 w-full mx-auto flex flex-col md:gap-12 gap-6 md:mt-24">
        {/* Featured Articles */}
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8 mx-auto w-full transition-all duration-300">
          {featuredArticles.map((article, idx) => {
            const imageUrl = getCoverUrl(article.cover);

            // Function to handle scroll to top before page navigation
            const handleFeaturedArticleClick = () => {
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
                        height: '100%',
                      }}
                    />
                    <div className="absolute inset-0 bg-black opacity-40 z-20"></div>
                    {/* Mobile Content Overlay on Image */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-30">
                      <h5 className="text-[20px] leading-[28px] text-white mb-2 line-clamp-2 drop-shadow-lg">
                        {article.title}
                      </h5>
                      <div className="text-base text-white mb-3 line-clamp-2 drop-shadow-lg">
                        {article.shortDescription || article.description}
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
                      height: '100%',
                    }}
                  />
                  <div className="absolute inset-0 bg-black opacity-40 z-20"></div>
                  {/* Overlay title/desc/date always white and clear */}
                  <div className="absolute bottom-0 left-0 right-0 md:p-6 p-4 z-30">
                    <h5 className="text-[20px] md:text-[24px] leading-[28px] md:leading-[32px] text-white mb-2 line-clamp-2 drop-shadow-lg">
                      {article.title}
                    </h5>
                    <div className="text-base text-white mb-3 line-clamp-2 drop-shadow-lg">
                      {article.shortDescription || article.description}
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
                  const handleArticleClick = () => {
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
                              loading={'lazy'}
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
                            {article.shortDescription || article.description}
                          </div>
                          <div className="flex-1"></div>
                          <div className="text-xs font-semibold text-[#7B6142] md:pb-6 pb-0 uppercase tracking-wider text-left">
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
                            {article.shortDescription || article.description}
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
                            loading={'lazy'}
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
          <div className="flex justify-center items-center gap-2 md:mt-12 mt-6 mb-6 select-none">
            <button
              className="ticket-rounded px-2 py-1 text-[#414651]  rounded-lg btn-clickable"
              disabled={page === 1}
              onClick={() => {
                setPage(page - 1);
                // Immediate scroll to top for better UX
                if (page > 1) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              &lt;
            </button>
            {pageNumbers.map((num, idx) =>
              typeof num === 'number' ? (
                <button
                  key={num}
                  className={`ticket-rounded w-9 h-9 rounded-lg flex items-center justify-center text-[#535862] btn-clickable ${
                    page === num ? 'bg-[#83644B] text-white' : ''
                  }`}
                  onClick={() => {
                    setPage(num);
                    // Immediate scroll to top for better UX
                    if (num !== page) {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
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
              onClick={() => {
                setPage(page + 1);
                // Immediate scroll to top for better UX
                if (page < totalPages) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
