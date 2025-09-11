// Import React hooks
import { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useParams } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Newsletter from './components/Newsletter';
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition';
import { useLoading } from './hooks/useLoading';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { getArticles, Article } from './api/articles';

// Lazy load all pages
const Home = lazy(() => import('./pages/Home'));
const Browse = lazy(() => import('./pages/Browse'));
const Articles = lazy(() => import('./pages/Articles'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const TermsAndCondition = lazy(() => import('./pages/TermsAndCondition'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const AcquireAnItem = lazy(() => import('./pages/AcquireAnItem'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const AppraiseAnItem = lazy(() => import('./pages/AppraiseAnItem'));

// import { API_URL } from './utils/constants.ts';
import { API_URL } from './utils/constants.ts';

// Create a wrapper component to access location
function AppContent() {
  const location = useLocation();
  const [articles, setArticles] = useState<Article[]>([]);
  const { slug } = useParams();
  const { loading, withLoading } = useLoading(false);
  const { locale } = useLanguage();

  // Fetch articles data
  const getArticlesData = async () => {
    try {
      const response = await getArticles(1, 5, locale);
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles([]);
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  // Array of paths where Newsletter should be hidden
  const hideNewsletterPaths = ['/acquire-an-item', '/appraise-an-item'];
  const shouldShowNewsletter = !hideNewsletterPaths.includes(location.pathname);

  // if (loading) {
  //   return <Loading fullScreen={true} size="large" />;
  // }

  return (
    <div className="min-h-screen flex flex-col">
      {/*<ScrollToTop />*/}
      <Header />
      <main className="flex-grow">
        <PageTransition>
          <Suspense fallback={<div className="min-h-screen bg-[#F7F5EA]" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/article/:slug" element={<ArticleDetail />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/terms-and-condition" element={<TermsAndCondition />} />
              <Route path="/acquire-an-item" element={<AcquireAnItem />} />
              <Route path="/appraise-an-item" element={<AppraiseAnItem />} />
            </Routes>
          </Suspense>
        </PageTransition>
      </main>
      {shouldShowNewsletter && <Newsletter />}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <AppContent />
      </Router>
    </LanguageProvider>
  );
}
