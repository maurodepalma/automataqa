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
}

export function StrategyCallDialog({ trigger }: StrategyCallDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-primary" />
            Book a QA Strategy Call
          </DialogTitle>
          <DialogDescription>
            Get a clear plan to scale your QA without slowing down your team.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 rounded-xl border border-border bg-background/60 p-4">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
            Identify bottlenecks in your current QA process.
          </div>
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
            Define automation priorities and coverage gaps.
          </div>
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
            Outline the right team setup for the next 90 days.
          </div>
          <div className="pt-1 text-sm text-foreground">
            30-minute call with the founder, 8+ years in QA working with U.S. teams
          </div>
        </div>
        <div className="mt-2 flex flex-col items-stretch gap-2">
          <Button className="w-full" variant="gradient">
            Get My QA Plan
          </Button>
          <p className="text-center text-xs text-muted-foreground">No commitment. Just a clear plan.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
