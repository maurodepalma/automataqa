"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

interface AnimatedWordHeadlineProps {
  text: string;
  className?: string;
  replayMs?: number;
}

export function AnimatedWordHeadline({
  text,
  className,
  replayMs = 10000
}: AnimatedWordHeadlineProps) {
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (replayMs <= 0) return;

    const interval = window.setInterval(() => {
      setCycle((current) => current + 1);
    }, replayMs);

    return () => {
      window.clearInterval(interval);
    };
  }, [replayMs]);

  return (
    <h1 className={cn(className)}>
      {text.split(" ").map((word, index) => (
        <motion.span
          key={`${cycle}-${word}-${index}`}
          initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{
            duration: 0.3,
            delay: index * 0.08,
            ease: "easeInOut"
          }}
          className="mr-2 inline-block"
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
}
