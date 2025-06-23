import React, { useEffect, useState } from 'react';
import bgDesktop from '../assets/background.png';
import bgMobile from '../assets/background_mobile.png';
import CeramicsByEra from '../components/CeramicsByEra';
import AcquireOrAppraise from '../components/AcquireOrAppraise';
import ArticlesSection from '../components/ArticlesSection';
import Newsletter from '../components/Newsletter';
import { useLanguage } from '../contexts/LanguageContext';
import { getArticles, Article } from '../api/articles';
import axios from 'axios';
import { API_URL } from '../utils/constants.ts';

export default function Home() {
  // Define articles state
  const [articles, setArticles] = useState<Article[]>([]);
  const { locale } = useLanguage();

  // fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/articles`, {
          params: {
            'pagination[pageSize]': 3,
            locale: locale,
            populate: '*',
          },
        });

        let data = response.data.data || response.data;

        // Handle Strapi v4 structure
        if (Array.isArray(data) && data[0]?.attributes) {
          data = data.map((article: any) => ({
            ...article.attributes,
            id: article.id,
          }));
        }

        setArticles(data);
      } catch (err) {
        console.error('Error fetching articles:', err);
      }
    };

    fetchArticles();
  }, [locale]); // Re-fetch when locale changes

  // Format date
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  return (
    <>
      <div className="w-full">
        <img src={bgMobile} alt="Background Mobile" className="block md:hidden w-full h-auto" />
        <img src={bgDesktop} alt="Background Desktop" className="hidden md:block w-full h-auto" />
      </div>
      <CeramicsByEra />
      <AcquireOrAppraise />
      <ArticlesSection />
    </>
  );
}
