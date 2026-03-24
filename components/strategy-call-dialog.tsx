"use client";

import { CalendarClock, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

interface StrategyCallDialogProps {
  trigger: React.ReactNode;
  title?: string;
  description?: string;
  bullets?: string[];
  founderNote?: string;
  ctaLabel?: string;
  ctaHref?: string;
  footnote?: string;
}

export function StrategyCallDialog({
  trigger,
  title = "Book a QA Strategy Call",
  description = "Get a clear plan to scale your QA without slowing down your team.",
  bullets = [
    "Identify bottlenecks in your current QA process.",
    "Define automation priorities and coverage gaps.",
    "Outline the right team setup for the next 90 days."
  ],
  founderNote = "30-minute call with the founder, 8+ years in QA working with U.S. teams",
  ctaLabel = "Get My QA Plan",
  ctaHref = "https://calendly.com/maurodepalma94/30min?month=2026-03",
  footnote = "No commitment. Just a clear plan."
}: StrategyCallDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 rounded-xl border border-border bg-background/60 p-4">
          {bullets.map((bullet) => (
            <div key={bullet} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
              {bullet}
            </div>
          ))}
          <div className="pt-1 text-sm text-foreground">{founderNote}</div>
        </div>
        <div className="mt-2 flex flex-col items-stretch gap-2">
          <Button className="w-full" variant="gradient" asChild>
            <a href={ctaHref} target="_blank" rel="noreferrer">
              {ctaLabel}
            </a>
          </Button>
          <p className="text-center text-xs text-muted-foreground">{footnote}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
