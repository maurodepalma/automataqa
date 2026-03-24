import { Suspense } from "react";

import { AIQaSection } from "@/components/ai-qa-section";
import { FaqSection } from "@/components/faq-section";
import { FinalCtaSection } from "@/components/final-cta-section";
import { HeroSection } from "@/components/hero-section";
import { ProcessSection } from "@/components/process-section";
import { QACareersSection } from "@/components/qa-careers-section";
import { ServicesSection } from "@/components/services-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TechStackSection } from "@/components/tech-stack-section";
import { ValuePropsSection } from "@/components/value-props-section";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="hero-glow absolute inset-0" />
        <div className="faint-grid absolute inset-0 opacity-70" />
        <div className="absolute -left-44 -top-32 h-[30rem] w-[30rem] rounded-full bg-[#5B8CFF]/14 blur-[130px]" />
        <div className="absolute -right-40 top-[24%] h-[26rem] w-[26rem] rounded-full bg-[#7A5CFF]/12 blur-[130px]" />
        <div className="absolute bottom-[-14rem] left-[24%] h-[24rem] w-[24rem] rounded-full bg-[#5B8CFF]/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_36%,rgba(10,12,16,0.28)_78%,rgba(10,12,16,0.62)_100%)]" />
      </div>

      <SiteHeader />
      <main>
        <HeroSection />
        <ValuePropsSection />
        <Suspense fallback={null}>
          <ServicesSection />
        </Suspense>
        <TechStackSection />
        <AIQaSection />
        <ProcessSection />
        <QACareersSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
