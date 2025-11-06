import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Benefits from '@/components/Benefits';
import HowItWorks from '@/components/HowItWorks';
import UploadForm from '@/components/UploadForm';
import Calculator from '@/components/Calculator';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Benefits />
      <HowItWorks />
      <UploadForm />
      <Calculator />
      <CTA />
      <Footer />
    </main>
  );
}
