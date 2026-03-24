"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type CursorStyle = "line" | "block";

interface TypingAnimationProps {
  children: string;
  className?: string;
  duration?: number;
  delay?: number;
  startOnView?: boolean;
  showCursor?: boolean;
  cursorStyle?: CursorStyle;
  onComplete?: () => void;
}

export function TypingAnimation({
  children,
  className,
  duration = 16,
  delay = 0,
  startOnView = false,
  showCursor = true,
  cursorStyle = "line",
  onComplete
}: TypingAnimationProps) {
  const [typedText, setTypedText] = useState("");
  const [started, setStarted] = useState(!startOnView);
  const [finished, setFinished] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const completionCalled = useRef(false);

  const text = useMemo(() => (typeof children === "string" ? children : String(children)), [children]);
  const stepMs = Math.max(8, duration);

  useEffect(() => {
    if (!startOnView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!started) return;

    let index = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let interval: ReturnType<typeof setInterval> | undefined;

    setTypedText("");
    setFinished(false);
    completionCalled.current = false;

    timer = setTimeout(() => {
      interval = setInterval(() => {
        index += 1;
        setTypedText(text.slice(0, index));
        if (index >= text.length) {
          if (interval) clearInterval(interval);
          setFinished(true);
          if (!completionCalled.current) {
            completionCalled.current = true;
            onComplete?.();
          }
        }
      }, stepMs);
    }, Math.max(0, delay));

    return () => {
      if (timer) clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, [delay, onComplete, started, stepMs, text]);

  return (
    <div ref={ref} className={cn(className)}>
      {typedText}
      {showCursor && !finished && (
        <span
          aria-hidden
          className={cn(
            "ml-0.5 inline-block align-[-0.08em] animate-pulse",
            cursorStyle === "block" ? "h-[1em] w-[0.6ch] bg-foreground/85" : "h-[1em] w-px bg-foreground/85"
          )}
        />
      )}
    </div>
  );
}
