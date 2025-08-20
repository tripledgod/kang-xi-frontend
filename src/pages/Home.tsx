import CeramicsByEra from '../components/CeramicsByEra';
import AcquireOrAppraise from '../components/AcquireOrAppraise';
import ArticlesSection from '../components/ArticlesSection';
import CoverPageHome from '../components/CoverPageHome';

export default function Home() {
  return (
    <>
      <CoverPageHome />
      <CeramicsByEra />
      <AcquireOrAppraise />
      <ArticlesSection />
    </>
  );
}
