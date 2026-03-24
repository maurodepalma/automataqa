"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";
import { StrategyCallDialog } from "@/components/strategy-call-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const links = [
  { href: "#how-we-work", label: "How We Work" },
  { href: "#qa-services", label: "QA Services" },
  { href: "#ai-powered-qa", label: "AI-Powered QA" },
  { href: "#latam-qa-engineers", label: "LATAM QA Engineers" },
  { href: "#careers", label: "Careers" },
  { href: "#faq", label: "FAQ" }
];

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-3">
      <div className="container">
        <div className="flex h-16 items-center justify-between rounded-[1.25rem] border border-white/[0.05] bg-background/72 px-4 ring-1 ring-white/[0.03] shadow-soft backdrop-blur-md md:px-6">
          <Link href="/" aria-label="AutomataQA home" className="flex items-center">
            <BrandLogo />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <StrategyCallDialog
              trigger={
                <Button variant="gradient">
                  Scale Your QA
                </Button>
              }
            />
          </div>

          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Open Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="lg:hidden">
              <SheetHeader>
                <SheetTitle>
                  <BrandLogo />
                </SheetTitle>
              </SheetHeader>
              <Separator />
              <nav className="flex flex-col gap-4">
                {links.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link href={item.href} className="text-sm text-muted-foreground hover:text-foreground">
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-3">
                <StrategyCallDialog
                  trigger={
                    <Button variant="gradient" className="w-full">
                      Scale Your QA
                    </Button>
                  }
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
