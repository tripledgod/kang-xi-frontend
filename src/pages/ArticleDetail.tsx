import React from 'react';
import mainImg from '../assets/our_articles.png';
import authorImg from '../assets/horse.png';
import related1 from '../assets/tang.png';
import related2 from '../assets/horse.png';
import related3 from '../assets/chase_collection.png';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

interface RelatedArticle {
  image: string;
  title: string;
  desc: string;
  date: string;
}

const relatedArticles: RelatedArticle[] = [
  {
    image: related1,
    title: 'Introduction to Song Dynasty five Great Kiln and Song Ceramic Characteristics',
    desc: 'The depiction of the Song Dynasty (960-1279) five great kilns was widely reported as a result of Song ceramic wares gaining fame among Chinese and foreign collectors. Song Dynasty ceramic ware...',
    date: '12 DEC 2024',
  },
  {
    image: related2,
    title: 'The Beauty of the Tang Three-Color (Sancai) Glazed Ceramic...',
    desc: 'Sancai, or "Three-Color" is a term generally used to refer to multicolored or poly-chrome lead glazed earthen wear. Even though the "Three" is i...',
    date: '12 DEC 2024',
  },
  {
    image: related3,
    title: 'Song Ru-Ware antiques – Are they really the rarest and mos...',
    desc: 'A preview by Sotheby\'s  "Chinese Art" autumn auction was held in Hong Kong on August 24 2017. The Northern Song Ru-type sky blue glaze wash...',
    date: '12 DEC 2024',
  },
];

function RelatedArticles({ related }: { related: RelatedArticle[] }) {
  const navigate = useNavigate();
  return (
    <section className="w-full py-16 px-4">
      <h2 className="text-4xl font-serif font-medium text-[#7B6142] mb-12 text-center">
        Related Articles
      </h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {related.map((article, idx) => (
          <div key={idx} className="flex flex-col">
            <div className="bg-[#E6DDC6] aspect-square w-full flex items-center justify-center overflow-hidden mb-4">
              <img src={article.image} alt={article.title} className="object-cover w-full h-full" />
            </div>
            <div className="text-xl font-serif font-medium text-[#61422D] mb-2 leading-snug line-clamp-2">
              {article.title}
            </div>
            <div className="text-base text-[#585550] mb-4 line-clamp-2">{article.desc}</div>
            <div className="text-xs text-[#585550] font-semibold uppercase tracking-wider">
              {article.date}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <Button text="VIEW ALL ARTICLES" variant="outline" onClick={() => navigate('/articles')} />
      </div>
    </section>
  );
}

export default function ArticleDetail() {
  return (
    <div className="w-full min-h-screen bg-[#F7F5EA]">
      <div className="max-w-2xl mx-auto px-4 pt-8">
        <div className="text-xs text-[#7B6142] font-semibold uppercase tracking-wider mb-2">
          JULY 4, 2024
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-semibold text-[#2E2A24] mb-2 leading-tight">
          They used to say that Yuan Blue-White Ceramics don't exist. How was it then discovered?
        </h1>
        <div className="text-base text-[#585550] mb-4">by Kangxi Finder</div>
        <img src={mainImg} alt="Main" className="w-full h-auto rounded mb-8" />
        <h2 className="text-xl font-serif font-semibold text-[#2E2A24] mb-2 mt-8">
          Chinese ceramics and the world of arts
        </h2>
        <p className="mb-6 text-[#23211C]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, urna eu
          tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa nisl quis neque. Etiam
          euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa nisl
          quis neque.
        </p>
        <img src={authorImg} alt="Author" className="w-full h-auto rounded mb-8" />
        <p className="mb-6 text-[#23211C]">
          Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
          Pellentesque euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam
          massa nisl quis neque. Etiam euismod, urna eu tincidunt consectetur, nisi nisl aliquam
          nunc, eget aliquam massa nisl quis neque.
        </p>
        <img src={related1} alt="Section" className="w-full h-auto rounded mb-8" />
        <img src={related2} alt="Section" className="w-full h-auto rounded mb-8" />
        <img src={related3} alt="Section" className="w-full h-auto rounded mb-8" />
        <p className="mb-6 text-[#23211C]">
          Aliquam erat volutpat. Pellentesque euismod, urna eu tincidunt consectetur, nisi nisl
          aliquam nunc, eget aliquam massa nisl quis neque. Etiam euismod, urna eu tincidunt
          consectetur, nisi nisl aliquam nunc, eget aliquam massa nisl quis neque.
        </p>
      </div>
      <RelatedArticles related={relatedArticles} />
    </div>
  );
}
