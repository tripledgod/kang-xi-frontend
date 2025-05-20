import React, { useEffect, useState } from "react";
import bgDesktop from "../assets/background.png";
import bgMobile from "../assets/background_mobile.png";
import CeramicsByEra from "../components/CeramicsByEra";
import AcquireOrAppraise from "../components/AcquireOrAppraise";
import ArticlesSection from "../components/ArticlesSection";
import Newsletter from "../components/Newsletter";

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

export default function Home() {
  // Define articles state
  const [articles, setArticles] = useState<Article[]>([]);

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

  return (
    <>
      <div className="w-full">
        <img
          src={bgMobile}
          alt="Background Mobile"
          className="block md:hidden w-full h-auto"
        />
        <img
          src={bgDesktop}
          alt="Background Desktop"
          className="hidden md:block w-full h-auto"
        />
      </div>
      <CeramicsByEra />
      <AcquireOrAppraise />
      <ArticlesSection />
    </>
  );
}
