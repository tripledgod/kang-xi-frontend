// Import React hooks
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useParams } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Newsletter from './components/Newsletter';
import Loading from './components/Loading';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Articles from './pages/Articles.tsx';
import AboutUs from './pages/AboutUs';
import TermsAndCondition from './pages/TermsAndCondition';
import ArticleDetail from './pages/ArticleDetail';
import AcquireAnItem from './pages/AcquireAnItem.tsx';
import ProductDetail from './pages/ProductDetail';
import AppraiseAnItem from './pages/AppraiseAnItem.tsx';
import { useLoading } from './hooks/useLoading';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { getArticles, Article } from './api/articles';

// import { API_URL } from './utils/constants.ts';

import { API_URL } from './utils/constants.ts';

// Create a wrapper component to access location
function AppContent() {
  const location = useLocation();
  const [articles, setArticles] = useState<Article[]>([]);
  const { slug } = useParams();
  const { loading, withLoading } = useLoading(true);
  const { locale } = useLanguage();

  // fetch articles
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

  useEffect(() => {
    withLoading(getArticlesData);
  }, [locale]); // Re-fetch when locale changes

  // Array of paths where Newsletter should be hidden
  const hideNewsletterPaths = ['/acquire-an-item', '/appraise-an-item'];
  const shouldShowNewsletter = !hideNewsletterPaths.includes(location.pathname);

  if (loading) {
    return <Loading fullScreen text="Loading articles..." />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
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
