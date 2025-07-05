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
        const response = await fetch(`${API_URL}/api/terms-and-condition?populate=*&locale=${locale}`);
        const data: TermsAndConditionResponse = await response.json();
        setContent(data.data.content || '');
      } catch (error) {
        setContent('Không thể tải điều khoản sử dụng.');
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
      </div>

      {/* Content Section */}
      <div
        className="max-w-2xl mx-auto px-4 md:px-0 py-10 text-[#2E2A24] text-base prose "
        style={{
          fontFamily:
            'Noto Sans SC, Source Han Sans, Helvetica Neue, Arial, Hiragino Sans GB, Microsoft YaHei, 微软雅黑, STHeiti, SimSun, sans-serif',
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
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
