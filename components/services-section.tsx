"use client";

import { useEffect, useState } from "react";
import {
  Accessibility,
  Check,
  Gauge,
  ShieldAlert,
  Smartphone,
  TestTube2,
  Users2
} from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const serviceContent = {
  automation: {
    tab: "Automation",
    title: "Automation Testing",
    icon: TestTube2,
    summary:
      "Build scalable, maintainable test coverage integrated directly into your CI/CD pipeline to support faster, safer releases.",
    deliverables: [
      "End-to-end and integration automation for web and API layers",
      "Risk-prioritized regression suites aligned with release scope",
      "CI/CD integration with automated quality gates",
      "Maintainable frameworks designed for long-term ownership"
    ],
    detailBlocks: [
      {
        label: "Core Stack",
        tags: ["Playwright", "Cypress", "API Testing", "CI/CD Pipelines"]
      },
      { label: "Time to Impact", text: "2-4 weeks to first production-ready CI-integrated suite" },
      {
        label: "How We Integrate",
        text:
          "Integrated into your CI/CD pipelines with automated quality gates, structured reporting, and maintainable test architecture."
      }
    ]
  },
  manual: {
    tab: "Manual",
    title: "Manual Testing",
    icon: Gauge,
    summary:
      "Structured manual validation that protects every release and reduces production risk.",
    deliverables: [
      "Feature-level validation aligned with product requirements",
      "Full regression cycles before release",
      "Exploratory testing to surface edge cases",
      "Clear defect reporting with reproduction steps and impact analysis"
    ],
    detailBlocks: [
      {
        label: "Focus Areas",
        tags: ["Feature validation", "Regression coverage", "Exploratory testing"]
      },
      { label: "How We Integrate", text: "Aligned with your sprint cadence and release milestones" }
    ]
  },
  mobile: {
    tab: "Mobile",
    title: "Mobile Testing (iOS & Android)",
    icon: Smartphone,
    summary:
      "Comprehensive mobile validation across devices, OS versions, and real-world conditions.",
    deliverables: [
      "iOS and Android functional testing",
      "Device matrix regression coverage",
      "Appium-based automation pathways (when required)",
      "Performance and usability validation"
    ],
    detailBlocks: [
      { label: "Core Stack", tags: ["Appium", "Real Devices", "Emulators", "Device Labs"] },
      { label: "Time to Impact", text: "Mobile regression coverage established within 2-4 weeks" },
      {
        label: "How We Integrate",
        text: "Coordinated with mobile release cycles and app store deployments"
      }
    ]
  },
  accessibility: {
    tab: "Accessibility",
    title: "Accessibility Audits",
    icon: Accessibility,
    summary:
      "Identify and remediate accessibility gaps to improve usability and reduce compliance risk.",
    deliverables: [
      "WCAG-based accessibility audits",
      "Screen reader and keyboard navigation validation",
      "Automated and manual accessibility testing",
      "Actionable remediation reports for engineering teams"
    ],
    detailBlocks: [
      { label: "Standards Alignment", tags: ["WCAG 2.1", "ADA considerations"] },
      { label: "Outcome", text: "Improved inclusivity and reduced compliance exposure" }
    ]
  },
  security: {
    tab: "Security",
    title: "Security & Penetration Testing",
    icon: ShieldAlert,
    summary:
      "Proactively identify vulnerabilities before they impact customers or compliance requirements.",
    deliverables: [
      "Application vulnerability assessments",
      "Penetration testing for web and API layers",
      "Authentication and authorization testing",
      "Actionable remediation reports with severity prioritization"
    ],
    detailBlocks: [
      { label: "Methodologies", tags: ["OWASP Top 10", "Security best practices"] },
      { label: "Outcome", text: "Reduced security risk and stronger production resilience" }
    ]
  },
  scaling: {
    tab: "Staff Aug",
    title: "Staff Augmentation (Nearshore LATAM QA Engineers)",
    icon: Users2,
    summary:
      "Scale your QA capacity with experienced engineers embedded directly into your team without operational overhead.",
    deliverables: [
      "Senior QA engineers aligned to your tech stack",
      "Automation, manual, or mobile expertise",
      "U.S. timezone overlap for real-time collaboration",
      "Structured onboarding and delivery ownership"
    ],
    detailBlocks: [
      {
        label: "Zero Operational Overhead",
        text: "We handle hiring, payroll, equipment, support, and replacements so your team can focus on shipping."
      },
      { label: "Time to Ramp", text: "2-4 weeks to fully embedded QA contributor" },
      {
        label: "Engagement Models",
        tags: [
          "Dedicated QA",
          "Pod-based support",
          "Hybrid (automation + manual mix)"
        ]
      }
    ]
  }
} as const;

export function ServicesSection() {
  type ServiceKey = keyof typeof serviceContent;
  const searchParams = useSearchParams();
  const serviceFromUrl = searchParams.get("service");
  const isServiceKey = (value: string | null): value is ServiceKey =>
    value !== null && value in serviceContent;

  const [activeTab, setActiveTab] = useState<ServiceKey>(
    isServiceKey(serviceFromUrl) ? serviceFromUrl : "automation"
  );

  useEffect(() => {
    if (isServiceKey(serviceFromUrl)) {
      setActiveTab(serviceFromUrl);
      return;
    }
    setActiveTab("automation");
  }, [serviceFromUrl]);

  return (
    <section id="qa-services" className="py-16 md:py-20">
      <div className="container">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Services</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            Flexible QA execution models aligned to your release cadence, quality goals, and
            engineering workflow.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ServiceKey)} className="w-full">
          <TabsList className="justify-center">
            {(
              Object.entries(serviceContent) as Array<
                [keyof typeof serviceContent, (typeof serviceContent)[keyof typeof serviceContent]]
              >
            ).map(([key, service]) => (
              <TabsTrigger key={key} value={key}>
                {service.tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {(
            Object.entries(serviceContent) as Array<
              [keyof typeof serviceContent, (typeof serviceContent)[keyof typeof serviceContent]]
            >
          ).map(([key, service]) => (
            <TabsContent value={key} key={key}>
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-4">
                  <div className="inline-flex rounded-xl bg-white/5 p-2">
                    <service.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                    {service.summary}
                  </p>

                  <div className="space-y-3 pt-2">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      What We Deliver
                    </p>
                    <ul className="space-y-2">
                      {service.deliverables.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  {service.detailBlocks.map((block) => (
                    <div key={block.label} className="rounded-xl border border-border bg-background/40 p-4">
                      <p className="mb-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                        {block.label}
                      </p>

                      {"tags" in block ? (
                        <div className="flex flex-wrap gap-2">
                          {block.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="px-3 py-1">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm leading-relaxed text-foreground">{block.text}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
