import { ClipboardCheck, Gauge, Radar, Workflow } from "lucide-react";

import { StrategyCallDialog } from "@/components/strategy-call-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const workflowSteps = [
  {
    step: "01",
    icon: Radar,
    title: "Discovery & Risk Mapping",
    description:
      "We review your release cadence, stack, and defect patterns to surface the highest-risk areas first.",
    bullets: [
      "Stack + CI/CD review",
      "Risk area identification",
      "Regression scope definition",
      "Success metrics aligned to delivery"
    ]
  },
  {
    step: "02",
    icon: ClipboardCheck,
    title: "Plan & Scope",
    description:
      "We define a 30-60 day roadmap with clear ownership and measurable outcomes.",
    bullets: [
      "Automation + manual strategy",
      "Coverage targets",
      "Execution cadence",
      "Reporting format + SLAs (if applicable)"
    ]
  },
  {
    step: "03",
    icon: Workflow,
    title: "Execute & Deliver",
    description:
      "We build and run testing that integrates cleanly with your workflow.",
    bullets: [
      "E2E + integration automation",
      "Manual feature + regression cycles",
      "Mobile validation when needed",
      "CI reliability + maintainability"
    ]
  },
  {
    step: "04",
    icon: Gauge,
    title: "Measure & Optimize",
    description:
      "We track outcomes and continuously improve speed and release confidence.",
    bullets: [
      "Defect leakage reduction",
      "Coverage growth tracking",
      "Bottleneck removal",
      "Continuous process refinement"
    ]
  }
];

function WorkflowStepCard({ step }: { step: (typeof workflowSteps)[number] }) {
  return (
    <Card className="h-full border-border bg-card shadow-none transition-colors duration-300 hover:border-white/15">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground">
            {step.step}
          </p>
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
            <step.icon className="h-4 w-4 text-primary" />
          </div>
        </div>
        <CardTitle className="text-lg">{step.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
        <ul className="space-y-2">
          {step.bullets.map((bullet) => (
            <li key={bullet} className="text-sm text-muted-foreground">
              • {bullet}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function ValuePropsSection() {
  return (
    <section id="how-we-work" className="py-16 md:py-20">
      <div className="container">
        <div className="mx-auto mb-10 max-w-3xl text-center lg:mb-12">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            How We Deliver Managed QA
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            We embed structured quality systems into your engineering workflow fast, measurable, and
            aligned with your release cadence.
          </p>
        </div>

        <div className="md:hidden">
          <div className="mb-3 px-1 text-right text-xs text-muted-foreground">Swipe</div>
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {workflowSteps.map((step) => (
              <div key={step.title} className="w-[88%] min-w-[88%] shrink-0 snap-center">
                <WorkflowStepCard step={step} />
              </div>
            ))}
          </div>
        </div>

        <div className="hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-4">
          {workflowSteps.map((step) => (
            <WorkflowStepCard key={step.title} step={step} />
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <StrategyCallDialog
            trigger={
              <Button variant="gradient" size="lg">
                Scale Your QA
              </Button>
            }
          />
        </div>
      </div>
    </section>
  );
}
