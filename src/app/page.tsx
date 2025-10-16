'use client';

import Header from '@/components/landing/header';
import HeroSection from '@/components/landing/hero';
import Footer from '@/components/landing/footer';
import { ProjectLaunchesLanding } from '@/components/landing/ProjectLaunchesLanding';
import { BrandSliding } from '@/components/landing/BrandSliding';
import { About3 } from '@/components/landing/about3';
import FAQSection from '@/components/landing/faq-section';

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Header />
      <main className="w-full">
        <HeroSection />
        <BrandSliding />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProjectLaunchesLanding />
          <About3 />
          <FAQSection />
        </div>
        <Footer />
      </main>
    </div>
  );
}
