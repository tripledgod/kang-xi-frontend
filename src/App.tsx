// Import React hooks
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Newsletter from "./components/Newsletter";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Articles from "./pages/Articles.tsx";
import AboutUs from "./pages/AboutUs";
import TermsAndCondition from "./pages/TermsAndCondition";
import ArticleDetail from "./pages/ArticleDetail";
import AcquireAnItem from "./pages/AcquireAnItem.tsx";
import ProductDetail from "./pages/ProductDetail";
import AppraiseAnItem from "./pages/AppraiseAnItem.tsx";

// Create Articles Interface
export interface Article {
    id: string;
    title: string;
    description: string;
    cover: any;
    publishedAt: Date;
}

// Define Strapi URL
const STRAPI_URL = "http://localhost:1337";

// Create a wrapper component to access location
function AppContent() {
    const location = useLocation();
    const [articles, setArticles] = useState<Articles[]>([]);

    // fetch articles
    const getArticles = async () => {
        const response = await fetch(`${STRAPI_URL}/api/articles?populate=*`);
        const data = await response.json();
        console.log(data.data)
        setArticles(data.data);
    };

    // Format date
    const formatDate = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        };
        return new Date(date).toLocaleDateString("en-US", options);
    };

    useEffect(() => {
        getArticles();
    }, []);

    // Array of paths where Newsletter should be hidden
    const hideNewsletterPaths = ['/acquire-an-item', '/appraise-an-item'];
    const shouldShowNewsletter = !hideNewsletterPaths.includes(location.pathname);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/browse" element={<Browse />} />
                    <Route path="/articles" element={<Articles />} />
                    <Route path="/article/:id" element={<ArticleDetail />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
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
        <Router>
            <AppContent />
        </Router>
    );
}
