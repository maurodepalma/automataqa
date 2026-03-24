import Link from "next/link";
import { BriefcaseBusiness, Cog, SearchCode, UsersRound } from "lucide-react";

import { StrategyCallDialog } from "@/components/strategy-call-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import WorldMapDemo from "@/components/world-map-demo";

const steps = [
  {
    step: "01",
    title: "Discovery & Role Definition",
    icon: SearchCode,
    description:
      "We align on the exact QA profile, seniority, responsibilities, tooling fit across Playwright/Cypress/API/Mobile, timezone overlap, and delivery ownership with clear DoD.",
    bullets: []
  },
  {
    step: "02",
    title: "Talent Match & Vetting",
    icon: UsersRound,
    description:
      "We shortlist vetted LATAM QAs who match your engineering needs.",
    bullets: [
      "Technical evaluation",
      "English fluency validation",
      "Culture fit screening",
      "Fast shortlist turnaround"
    ]
  },
  {
    step: "03",
    title: "Embed Into Your Pods",
    icon: BriefcaseBusiness,
    description:
      "Your QA joins ceremonies and ships with the team from week one through Agile ritual onboarding, repo and environment setup, test strategy alignment, and immediate delivery ownership.",
    bullets: []
  },
  {
    step: "04",
    title: "Operate With Zero Friction",
    icon: Cog,
    description: "We manage the operational layer so you don't have to.",
    bullets: [
      "Hiring + payroll",
      "Equipment provisioning",
      "Ongoing support",
      "Replacements if needed"
    ]
  }
];

export function ProcessSection() {
  return (
    <section id="latam-qa-engineers" className="py-16 md:py-20">
      <div className="container">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <Badge variant="default" className="mx-auto w-fit bg-white/6 px-3 py-1">
            Nearshore Talent Model
          </Badge>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
            How Our QA Engineers Join Your Team
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            Scale QA capacity without operational overhead. We handle hiring, equipment, payroll,
            and support — your team focuses on shipping.
          </p>
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl bg-background/35 p-4 md:p-6 lg:p-8">
            <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
              <div>
                <WorldMapDemo />
              </div>

              <div className="lg:pl-8">
                <p className="mb-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  4-Step Workflow
                </p>
                <Accordion type="single" collapsible defaultValue="step-01" className="space-y-0">
                  {steps.map((step) => (
                    <AccordionItem
                      key={step.step}
                      value={`step-${step.step}`}
                      className="rounded-none border-0 bg-transparent px-0"
                    >
                      <AccordionTrigger>
                        <div className="flex items-center gap-3 pr-2">
                          <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-white/8 px-2 text-xs font-medium text-muted-foreground">
                            {step.step}
                          </span>
                          <step.icon className="h-4 w-4 shrink-0 text-primary" />
                          <span className="text-sm font-semibold text-foreground">{step.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                          {step.description}
                        </p>
                        {step.bullets.length > 0 && (
                          <ul className="grid gap-2 sm:grid-cols-2">
                            {step.bullets.map((bullet) => (
                              <li key={bullet} className="text-sm text-muted-foreground">
                                • {bullet}
                              </li>
                            ))}
                          </ul>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-primary/30 bg-primary/8 p-6 text-center md:p-8">
            <h3 className="text-lg font-semibold">Zero Operational Overhead</h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Get senior QA capacity with U.S. timezone overlap without managing recruiting, HR, or
              logistics.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <StrategyCallDialog
                title="Book a Talent Strategy Call"
                description="Hire the right LATAM QA engineers without the overhead or hiring friction."
                bullets={[
                  "Define the ideal QA profile for your team and product",
                  "Identify gaps in coverage, automation, and ownership",
                  "Outline a clear plan to onboard and scale your QA capacity"
                ]}
                founderNote="30-minute call with the founder, 8+ years working with U.S. teams"
                ctaLabel="Get My Hiring Plan"
                ctaHref="https://calendly.com/maurodepalma94/30-minute-meeting-clone?month=2026-03"
                footnote="No commitment. Just a clear plan."
                trigger={
                  <Button variant="gradient" size="lg">
                    Scale Your QA
                  </Button>
                }
              />
              <Button variant="ghost" size="lg" asChild>
                <Link href="/?service=scaling#qa-services">Learn About Staff Augmentation</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
