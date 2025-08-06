import React, { useEffect, useState } from 'react';
import termsConditionImg from '../assets/terms_condition.png';
import termsConditionMobileImg from '../assets/terms_condition_mobile.png';
import { API_URL } from '../utils/constants';
import { TermsAndConditionResponse } from '../types';
import { useLoading } from '../hooks/useLoading';
import Loading from '../components/Loading';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLanguage } from '../contexts/LanguageContext';

export default function TermsAndCondition() {
  const [content, setContent] = useState<string>('');
  const { loading, withLoading } = useLoading(true);
  const { locale } = useLanguage();

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/terms-and-condition?populate=*&locale=${locale}`
        );
        const data: TermsAndConditionResponse = await response.json();
        setContent(data.data.content || '');
      } catch (error) {
        setContent('Unable to load terms of use.');
      }
    };
    withLoading(fetchTerms);
  }, [withLoading, locale]);

  if (loading) {
    return <Loading text="Loading..." fullScreen={true} />;
  }

  return (
    <div className="bg-[#F7F5EA] min-h-screen w-full">
      {/* Hero Section */}
      <div className="relative w-full h-[220px] md:h-[320px] flex items-center justify-center overflow-hidden">
        <img
          src={termsConditionMobileImg}
          alt="Terms and Conditions Mobile"
          className="block md:hidden absolute inset-0 w-full h-full object-cover object-center"
          style={{ maxWidth: '100vw' }}
        />
        <img
          src={termsConditionImg}
          alt="Terms and Conditions"
          className="hidden md:block absolute inset-0 w-full h-full object-cover object-center"
          style={{ maxWidth: '100vw' }}
        />
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        {/* Overlay text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <h3 className="block md:hidden text-white font-serif text-[40px] leading-[48px] drop-shadow-lg text-center m-4">
            Terms and <br />
            Conditions
          </h3>
          <h1 className="hidden md:block text-white font-serif text-[60px] leading-[72px] drop-shadow-lg text-center mb-4 mx-4">
            Terms and Conditions
          </h1>
          <div className="text-white text-[18px] md:text-[20px] md:leading-[28px] leading-[26px] text-center drop-shadow-lg">
            Updated 12/04/2025
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-2xl mx-auto px-4 md:px-0 py-10 text-[#2E2A24] text-base prose mb-5 ">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ node, ...props }) => (
              <p
                {...props}
                style={{
                  marginBottom: '20px',
                }}
              />
            ),
            img: ({ node, ...props }) => (
              <img
                {...props}
                className="mx-auto"
                style={{ display: 'block', marginTop: 16, marginBottom: 16 }}
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
