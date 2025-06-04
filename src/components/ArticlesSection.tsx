import React from 'react';
import Button from './Button';
import bowl from '../assets/tang.png'; // Placeholder, replace with real images
import horse from '../assets/chase_collection.png'; // Placeholder, replace with real images
import blueWhite from '../assets/chase_collection.png';
import bgButton from '../assets/bg_button.png';
import {useNavigate} from "react-router-dom"; // Placeholder, replace with real images

const articles = [
  {
    image: bowl,
    title: 'Introduction to Song Dynasty five Great Kiln and Song Cera...',
    desc: 'The depiction of the Song Dynasty (960—1279) five great kilns was widely reported as a result of Song ceramic wares gaining fame among Chinese...',
    date: '12 DEC 2024',
  },
  {
    image: horse,
    title: 'The Beauty of the Tang Three-Color (Sancai) Glazed Ceramic...',
    desc: 'Sancai, or "Three-Color" is a term generally used to refer to multicolored or poly–chrome lead glazed earthen wear. Even though the "Three" is i...',
    date: '12 DEC 2024',
  },
  {
    image: blueWhite,
    title: 'They used to say that Yuan Blue-White Ceramics do not exist...',
    desc: 'This pair of Yuan Blue–white porcelain, perhaps you may know its story, origin and even legend, but it is more likely most people don\'t. What is its sig...',
    date: '12 DEC 2024',
  },
];

export default function ArticlesSection() {
  const navigate = useNavigate();
  return (
    <section className="w-full bg-[#F7F5EA] px-4 py-16">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h2 className="text-5xl font-serif font-semibold text-[#7B6142] mb-2 text-center">Our Articles</h2>
        <div className="text-[14px] font-semibold leading-[20px] mb-12 text-center" style={{ color: '#342216' }}>Feature articles of the month</div>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {articles.map((article, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="bg-[#E6DDC6] aspect-square w-full flex items-center justify-center overflow-hidden mb-4">
                <img src={article.image} alt={article.title} className="object-cover w-full h-full" />
              </div>
              <div className="mb-2 leading-snug  line-clamp-2" style={{ fontFamily: 'Source Han Serif SC VF, serif', fontWeight: 600, fontSize: 24, lineHeight: '32px', letterSpacing: 0, textAlign: 'left', color: '#4A2A1A' }}>
                {article.title}
              </div>
              <div className="font-pingfang text-base font-normal leading-6 mb-4 line-clamp-3" style={{ color: '#585550' }}>{article.desc}</div>
              <div className="text-[14px] font-semibold leading-[20px] line-clamp-2" style={{ color: '#585550' }}>{article.date}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-center w-full max-w-6xl  mx-auto ">
          <Button text="VIEW ALL ARTICLES" variant="outline" onClick={() => navigate('/articles')}/>
        </div>
      </div>
    </section>
  );
}
