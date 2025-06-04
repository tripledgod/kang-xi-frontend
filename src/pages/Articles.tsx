import { useState } from 'react';
import { Link } from 'react-router-dom';
import tang from '../assets/tang.png';
import horse from '../assets/horse.png';
import ceramics from '../assets/ceramics.png';
import chaseCollection from '../assets/chase_collection.png';
import ceramicsMobile from '../assets/ceramics_mobile.png';
import ourArticles from '../assets/our_articles.png';
import articlesCover from '../assets/articles_cover.png';
import bigLeft from '../assets/big_left_article.png';
import bigRight from '../assets/big_right_article.png';

const ARTICLES_PER_PAGE = 5;

const featuredArticles = [
  {
    image: bigLeft,
    title: 'Introduction to Song Dynasty five Great Kiln and Song Ceramic Characteristics',
    desc: 'The depiction of the Song Dynasty (960—1279) five great kilns was widely reported as a result of Song ceramic wares gaining fame among Chinese and foreign collectors. Song Dynasty ceramic ware...',
    date: '12 DEC 2024',
  },
  {
    image: bigRight,
    title: 'Introduction to Song Dynasty five Great Kiln and Song Ceramic Characteristics',
    desc: 'The depiction of the Song Dynasty (960—1279) five great kilns was widely reported as a result of Song ceramic wares gaining fame among Chinese and foreign collectors. Song Dynasty ceramic ware...',
    date: '12 DEC 2024',
  },
];

const articles = [
  {
    image: tang,
    title: 'Introduction to Song Dynasty five Great Kiln and Song Ceramic Characteristics',
    desc: 'The depiction of the Song Dynasty (960—1279) five great kilns was widely reported as a result of Song ceramic wares gaining fame among Chinese and foreign collectors. Song Dynasty ceramic ware...',
    date: '12 DEC 2024',
  },
  {
    image: horse,
    title: 'Introduction to Song Dynasty five Great Kiln and Song Ceramic Characteristics',
    desc: 'The depiction of the Song Dynasty (960—1279) five great kilns was widely reported as a result of Song ceramic wares gaining fame among Chinese and foreign collectors. Song Dynasty ceramic ware...',
    date: '12 DEC 2024',
  },
  {
    image: ceramics,
    title: 'Introduction to Song Dynasty five Great Kiln and Song Ceramic Characteristics',
    desc: 'The depiction of the Song Dynasty (960—1279) five great kilns was widely reported as a result of Song ceramic wares gaining fame among Chinese and foreign collectors. Song Dynasty ceramic ware...',
    date: '12 DEC 2024',
  },
  {
    image: chaseCollection,
    title: 'Introduction to Song',
    desc: 'The depiction of the Song Dynasty (960—1279) five great kilns was widely reported as a result of Song ceramic wares gaining fame among Chinese and foreign collectors. Song Dynasty ceramic ware...',
    date: '12 DEC 2024',
  },
  {
    image: ceramicsMobile,
    title: 'Introduction to Song Dynasty five Great Kiln and Song Ceramic Characteristics',
    desc: 'The depiction of the Song Dynasty (960—1279) five great kilns was widely reported as a result of Song ceramic wares gaining fame among Chinese and foreign collectors. Song Dynasty ceramic ware...',
    date: '12 DEC 2024',
  },
  {
    image: ourArticles,
    title: 'Introduction to Song Dynasty five Great Kiln and Song Ceramic Characteristics',
    desc: 'The depiction of the Song Dynasty (960—1279) five great kilns was widely reported as a result of Song ceramic wares gaining fame among Chinese and foreign collectors. Song Dynasty ceramic ware...',
    date: '12 DEC 2024',
  },
  // Add more articles here to test pagination
];

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

export default function Articles() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(articles.length / ARTICLES_PER_PAGE);
  const pagedArticles = articles.slice((page - 1) * ARTICLES_PER_PAGE, page * ARTICLES_PER_PAGE);
  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="w-full min-h-screen pb-24 bg-[#F7F5EA]">
      {/* Hero Image */}
      <div className="relative w-full h-[220px] md:h-[320px] flex items-center justify-center overflow-hidden mb-8">
        <img
          src={articlesCover}
          alt="Articles Cover"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ maxWidth: '100vw' }}
        />
      </div>
      {/* Featured Articles Section */}
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-8 mb-16 px-7">
        <div className="relative h-[340px] md:h-[400px] rounded overflow-hidden group w-full md:w-4/5">
          <img
            src={featuredArticles[0].image}
            alt={featuredArticles[0].title}
            className="absolute inset-0 w-full h-full object-cover object-center z-0"
          />
          {/* <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="relative z-20 flex flex-col justify-end h-full p-6">
            <div className="text-2xl md:text-2xl font-serif font-semibold text-white mb-2 leading-snug line-clamp-2">
              {featuredArticles[0].title}
            </div>
            <div className="text-base text-white mb-3 line-clamp-2">
              {featuredArticles[0].desc}
            </div>
            <div className="text-xs text-white font-semibold uppercase tracking-wider">
              {featuredArticles[0].date}
            </div>
          </div> */}
        </div>
        <div className="relative h-[340px] md:h-[400px] rounded overflow-hidden group w-full md:w-2/5">
          <img
            src={featuredArticles[1].image}
            alt={featuredArticles[1].title}
            className="absolute inset-0 w-full h-full object-cover object-center z-0"
          />
          {/* <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="relative z-20 flex flex-col justify-end h-full p-6">
            <div className="text-2xl md:text-2xl font-serif font-semibold text-white mb-2 leading-snug line-clamp-2">
              {featuredArticles[1].title}
            </div>
            <div className="text-base text-white mb-3 line-clamp-2">
              {featuredArticles[1].desc}
            </div>
            <div className="text-xs text-white font-semibold uppercase tracking-wider">
              {featuredArticles[1].date}
            </div>
          </div> */}
        </div>
      </div>
      <div className="max-w-4xl px-4 md:px-24 pt-0">
        <h1 className="text-4xl font-serif font-semibold text-[#7B6142] mb-8 text-left">
          Latest Articles
        </h1>
        <div className="flex flex-col gap-8 items-start">
          {pagedArticles.map((article, idx) => {
            const articleIndex = (page - 1) * ARTICLES_PER_PAGE + idx;
            return (
              <Link
                key={idx}
                to={`/article/${articleIndex}`}
                className="w-full"
                style={{ textDecoration: 'none' }}
              >
                {/* Mobile Card Layout */}
                <div className="block md:hidden p-0 w-full transition-colors hover:bg-[#f3efe2]">
                  <div
                    className={`${idx !== pagedArticles.length - 1 ? 'border-b border-[#E6DDC6]' : ''}`}
                  >
                    <div className="w-full h-48 overflow-hidden mb-4 bg-[#E6DDC6] flex items-center justify-center">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="text-2xl font-serif font-semibold text-[#7B6142] mb-2 leading-snug line-clamp-2">
                      {article.title}
                    </div>
                    <div className="text-base text-[#585550] mb-3 line-clamp-2">{article.desc}</div>
                    <div className="text-xs text-[#7B6142] pb-6 font-semibold uppercase tracking-wider">
                      {article.date}
                    </div>
                  </div>
                </div>
                {/* Desktop Row Layout */}
                <div className="hidden md:flex flex-row gap-6 border-b border-[#E6DDC6] pb-6 last:border-b-0 last:pb-0 w-full hover:bg-[#f3efe2] transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="text-xl font-serif font-semibold text-[#2E2A24] mb-2 leading-snug text-left">
                      {article.title}
                    </div>
                    <div className="text-base text-[#585550] mb-3 line-clamp-2 text-left">
                      {article.desc}
                    </div>
                    <div className="text-xs text-[#7B6142] font-semibold uppercase tracking-wider text-left">
                      {article.date}
                    </div>
                  </div>
                  <div className="w-40 h-28 flex-shrink-0 rounded overflow-hidden bg-[#E6DDC6] flex items-center justify-center">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12 select-none">
            <button
              className="px-2 py-1 text-[#7B6142] disabled:opacity-30"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              &lt;
            </button>
            {pageNumbers.map((num, idx) =>
              typeof num === 'number' ? (
                <button
                  key={num}
                  className={`w-9 h-9 rounded-md flex items-center justify-center font-semibold text-[#7B6142] ${page === num ? 'bg-[#83644B] text-white' : ''}`}
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
              className="px-2 py-1 text-[#7B6142] disabled:opacity-30"
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
