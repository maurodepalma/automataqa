"use client";

import { Code2, Layers } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import {
  SiAppium,
  SiCypress,
  SiGithub,
  SiJira,
  SiLighthouse,
  SiNodedotjs,
  SiOpenai,
  SiOllama,
  SiPostman,
  SiSelenium,
  SiSlack,
  SiTypescript,
  SiTestrail
} from "react-icons/si";

import { FloatingDock } from "@/components/ui/floating-dock";

type StackTool = {
  title: string;
  icon: React.ReactNode;
};

const tools: StackTool[] = [
  {
    title: "Playwright",
    icon: <Code2 className="h-full w-full text-muted-foreground" />
  },
  {
    title: "Cypress",
    icon: <SiCypress className="h-full w-full text-[#69D3A7]" />
  },
  {
    title: "Appium",
    icon: <SiAppium className="h-full w-full text-[#A4C639]" />
  },
  {
    title: "Ollama",
    icon: <SiOllama className="h-full w-full text-[#E6EAF2]" />
  },
  {
    title: "GitHub",
    icon: <SiGithub className="h-full w-full text-muted-foreground" />
  },
  {
    title: "OpenAI",
    icon: <SiOpenai className="h-full w-full text-[#E6EAF2]" />
  },
  {
    title: "Node.js",
    icon: <SiNodedotjs className="h-full w-full text-[#68A063]" />
  },
  {
    title: "TypeScript",
    icon: <SiTypescript className="h-full w-full text-[#3178C6]" />
  },
  {
    title: "Jira",
    icon: <SiJira className="h-full w-full text-[#3B82F6]" />
  },
  {
    title: "BrowserStack",
    icon: <Layers className="h-full w-full text-[#F97316]" />
  },
  {
    title: "TestRail",
    icon: <SiTestrail className="h-full w-full text-[#65B741]" />
  },
  {
    title: "Postman",
    icon: <SiPostman className="h-full w-full text-[#FF6C37]" />
  },
  {
    title: "Selenium",
    icon: <SiSelenium className="h-full w-full text-[#43B02A]" />
  },
  {
    title: "Lighthouse",
    icon: <SiLighthouse className="h-full w-full text-[#F44B21]" />
  },
  {
    title: "Slack",
    icon: <SiSlack className="h-full w-full text-[#E01E5A]" />
  }
];

function MobileToolsCarousel({ items }: { items: StackTool[] }) {
  const reduceMotion = useReducedMotion();
  const marqueeItems = [...items, ...items];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-card/50 py-4">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent" />
      <motion.div
        className="flex w-max gap-3 px-3"
        animate={reduceMotion ? { x: 0 } : { x: ["0%", "-50%"] }}
        transition={
          reduceMotion
            ? undefined
            : {
                duration: 28,
                ease: "linear",
                repeat: Infinity
              }
        }
      >
        {marqueeItems.map((tool, index) => (
          <div
            key={`${tool.title}-${index}`}
            aria-label={tool.title}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-background/75 text-foreground/90 transition-colors hover:bg-background"
          >
            <span className="h-5 w-5">{tool.icon}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function TechStackSection() {
  return (
    <section id="tech-stack" className="py-16 md:py-20">
      <div className="container">
        <div className="mx-auto mb-8 max-w-3xl text-center md:mb-10">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Tech Stack & Tools</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            We plug into your existing QA ecosystem across automation, test management, issue
            tracking, and CI/CD workflows.
          </p>
        </div>

        <div className="hidden items-center justify-center md:flex">
          <FloatingDock items={tools} />
        </div>
        <div className="md:hidden">
          <MobileToolsCarousel items={tools} />
        </div>
      </div>
    </section>
  );
}
