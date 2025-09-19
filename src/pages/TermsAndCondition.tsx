import { useEffect, useState } from 'react';
import { API_URL } from '../utils/constants';
import { type Cover, TermsAndConditionResponse } from '../types';
import { useLoading } from '../hooks/useLoading';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLanguage } from '../contexts/LanguageContext';
import ShimmerSkeleton from '../components/ShimmerSkeleton';
import CoverPage from '../components/CoverPage.tsx';

export default function TermsAndCondition() {
  const [content, setContent] = useState<string>('');
  const { loading, withLoading } = useLoading(true);
  const { locale } = useLanguage();
  const [cover, setCover] = useState<Cover | undefined>(undefined);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/terms-and-condition?populate=*&locale=${locale}`
        );
        const data: TermsAndConditionResponse = await response.json();
        setContent(data.data.content || '');
        setCover(data.data.cover || '');
      } catch (error) {
        setContent('Unable to load terms of use.');
      }
    };
    withLoading(fetchTerms);
  }, [withLoading, locale]);

  return (
    <div className="bg-[#F7F5EA] min-h-screen w-full">
      {loading ? (
        <>
          {/* Hero Section */}
          <CoverPage cover={cover} />

          {/* Content Section Shimmer */}
          <div className="max-w-2xl mx-auto px-4 md:px-0 py-10 text-[#2E2A24] text-base prose mb-5">
            <div className="space-y-4">
              {/* Multiple paragraphs shimmer */}
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <ShimmerSkeleton variant="text" height="16px" className="w-full" theme="image" />
                  <ShimmerSkeleton variant="text" height="16px" className="w-5/6" theme="image" />
                  <ShimmerSkeleton variant="text" height="16px" className="w-4/5" theme="image" />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Hero Section */}
          <CoverPage cover={cover} />
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
        </>
      )}
    </div>
  );
}
