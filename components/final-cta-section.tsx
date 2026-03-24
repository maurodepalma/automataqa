import { ArrowRight } from "lucide-react";

import { StrategyCallDialog } from "@/components/strategy-call-dialog";
import { Button } from "@/components/ui/button";

export function FinalCtaSection() {
  return (
    <section id="contact" className="py-16 md:py-24">
      <div className="container">
        <div className="rounded-[1.1rem] bg-accent-gradient p-px">
          <div className="rounded-[1rem] bg-card/95 px-6 py-10 text-center md:px-12 md:py-14">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Ready to scale QA</p>
            <h2 className="mx-auto mt-3 max-w-2xl text-2xl font-semibold tracking-tight md:text-4xl">
              Bring enterprise-grade QA execution to every sprint.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
              Partner with AutomataQA to accelerate release confidence and build a dependable quality
              engine for growth.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <StrategyCallDialog
                trigger={
                  <Button variant="gradient" size="lg" className="inline-flex items-center gap-2">
                    Scale Your QA
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
