import { ArrowRight, Clock3, ShieldCheck, Users2 } from "lucide-react";

import { StrategyCallDialog } from "@/components/strategy-call-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedWordHeadline } from "@/components/ui/animated-word-headline";
import { Separator } from "@/components/ui/separator";

const trustLogos = ["Growth SaaS", "FinTech", "HealthTech", "Marketplaces"];

export function HeroSection() {
  return (
    <section className="relative pt-24 md:pt-28 lg:pt-36">
      <div className="container grid items-center gap-10 pb-16 md:grid-cols-[1.1fr_0.9fr] md:pb-24">
        <div className="space-y-6">
          <Badge variant="default" className="w-fit bg-white/6 px-3 py-1">
            QA Built for High-Growth U.S. Engineering Teams
          </Badge>
          <AnimatedWordHeadline
            text="Scale Quality. Accelerate Releases. Reduce Risk."
            replayMs={10000}
            className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl"
          />
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            AutomataQA helps engineering teams ship faster with automation-first testing, rigorous
            manual and mobile coverage, and elite nearshore QA talent fully aligned with U.S.
            product velocity.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <StrategyCallDialog
              trigger={
                <Button variant="gradient" size="lg" className="cta-smooth inline-flex items-center gap-2">
                  <span>Scale Your QA</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              }
            />
          </div>
          <div className="space-y-3 pt-2">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Trusted by product teams across
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {trustLogos.map((logo) => (
                <div
                  key={logo}
                  className="rounded-xl border border-border bg-card/70 px-3 py-2 text-center text-xs text-muted-foreground"
                >
                  {logo}
                </div>
              ))}
            </div>
          </div>
        </div>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-accent-gradient" />
          <CardHeader>
            <CardTitle className="text-lg">Scale Without Friction</CardTitle>
            <CardDescription>Outcome-focused execution from week one.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-background/50 p-4">
                <div className="mb-2 inline-flex rounded-lg bg-white/5 p-2">
                  <Users2 className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm font-medium">Rapid QA Team Expansion</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Elite LATAM engineers integrated in weeks, not months.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-background/50 p-4">
                <div className="mb-2 inline-flex rounded-lg bg-white/5 p-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm font-medium">Higher Release Confidence</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Automation and manual coverage designed to protect every deployment.
                </p>
              </div>
            </div>
            <Separator />
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-2xl font-semibold">2-4 weeks</p>
                <p className="text-xs text-muted-foreground">Ramp-to-impact</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock3 className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Daily overlap with U.S. teams</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
