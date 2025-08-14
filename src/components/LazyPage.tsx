import React, { Suspense } from 'react';
import Loading from './Loading';

interface LazyPageProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const LazyPage: React.FC<LazyPageProps> = ({
  children,
  fallback = <Loading fullScreen={true} text="Loading page..." size="large" />,
}) => {
  return <Suspense fallback={fallback}>{children}</Suspense>;
};

export default LazyPage;
