import React, { Suspense } from 'react';

interface LazyPageProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const LazyPage: React.FC<LazyPageProps> = ({
  children,
  fallback = <div className="min-h-screen bg-[#F7F5EA]" />,
}) => {
  return <Suspense fallback={fallback}>{children}</Suspense>;
};

export default LazyPage;
