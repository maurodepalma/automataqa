"use client";

import { useState } from "react";
import { BadgeCheck, Check, Copy, Sparkles } from "lucide-react";

import AnimatedTooltipPreview from "@/components/animated-tooltip-demo";
import { Button } from "@/components/ui/button";

const CAREERS_EMAIL = "careers@automataqa.com";
const whatWereLookingFor = [
  "QA engineers with strong experience in manual testing, automation, or both",
  "Ownership mindset over product quality and user experience",
  "Experience working with U.S.-based teams or fast-paced environments",
  "Comfortable with modern QA tools and AI-assisted workflows"
];

const whatYoullGet = [
  "Work directly with U.S.-based product and engineering teams",
  "Real ownership over product quality and decisions",
  "Fully remote, flexible work environment",
  "Competitive compensation in USD"
];

export function QACareersSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CAREERS_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="careers" className="relative py-16 md:py-20">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-10 h-44 w-44 -translate-x-1/2 rounded-full bg-[#5B8CFF]/14 blur-[90px]" />
        <div className="absolute bottom-6 right-[8%] h-52 w-52 rounded-full bg-[#7A5CFF]/10 blur-[110px]" />
      </div>
      <div className="container">
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-card/65 px-3 py-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Careers at AutomataQA
            </div>
            <h2 className="mx-auto mt-4 max-w-3xl text-2xl font-semibold tracking-tight md:text-4xl">
              We are hiring QA engineers.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
              Join our LATAM QA team and work directly with U.S. product and engineering teams. Own
              quality end-to-end - from test automation and exploratory testing to modern product
              validation across web and mobile.
            </p>
            <p className="mx-auto mt-4 inline-flex items-center rounded-full border border-border/80 bg-card/65 px-3 py-1.5 text-xs text-muted-foreground">
              Remote-first • LATAM talent • Daily U.S. collaboration
            </p>

            <div className="mx-auto mt-10 max-w-3xl">
              <AnimatedTooltipPreview />
            </div>

            <div className="mt-8 flex flex-col items-center gap-3">
              <p className="text-sm font-medium text-foreground">Apply to join our team</p>
              <Button
                type="button"
                variant="gradient"
                size="lg"
                className="inline-flex h-auto items-center gap-2 rounded-full px-6 py-3"
                onClick={handleCopyEmail}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? "Email copied to clipboard" : CAREERS_EMAIL}</span>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="relative overflow-hidden rounded-2xl border border-border bg-card/75 p-5 md:h-full md:p-6">
              <div className="absolute inset-x-0 top-0 h-1 bg-accent-gradient" />
              <h3 className="text-lg font-semibold">What we're looking for</h3>
              <ul className="mt-4 space-y-2.5">
                {whatWereLookingFor.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 rounded-xl border border-white/8 bg-background/40 px-3 py-2.5 text-sm text-muted-foreground"
                  >
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="relative overflow-hidden rounded-2xl border border-border bg-card/75 p-5 md:h-full md:p-6">
              <div className="absolute inset-x-0 top-0 h-1 bg-accent-gradient" />
              <h3 className="text-lg font-semibold">What you'll get</h3>
              <ul className="mt-4 space-y-2.5">
                {whatYoullGet.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 rounded-xl border border-white/8 bg-background/40 px-3 py-2.5 text-sm text-muted-foreground"
                  >
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
