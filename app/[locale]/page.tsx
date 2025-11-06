import Hero from '@/components/Hero';
import Benefits from '@/components/Benefits';
import HowItWorks from '@/components/HowItWorks';
import Calculator from '@/components/Calculator';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Benefits />
      <HowItWorks />
      <Calculator />
      <CTA />
      <Footer />
    </main>
  );
}
