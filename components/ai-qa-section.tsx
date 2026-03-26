"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Bug, Check, FileCode2, GitBranch, RotateCcw, Search, Sparkles, Terminal, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Tabs, TabsContent } from "@/components/ui/tabs";

function highlightLine(line: string): ReactNode[] {
  const regex =
    /(\/\/.*$)|("([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`)|\b(import|from|const|await|async|export|function|return|if|else|type)\b|\b(test|expect|describe)\b|\b(goto|getByRole|fill|click|toBeVisible|newContext|storageState)\b|(@playwright\/test)/g;

  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(<span key={`plain-${key++}`}>{line.slice(lastIndex, match.index)}</span>);
    }

    const value = match[0];
    let className = "text-[#D4D4D4]";

    if (match[1]) className = "text-[#6A9955]";
    else if (match[2]) className = "text-[#CE9178]";
    else if (match[7]) className = "text-[#C586C0]";
    else if (match[8]) className = "text-[#DCDCAA]";
    else if (match[9]) className = "text-[#4FC1FF]";
    else if (match[10]) className = "text-[#4EC9B0]";

    nodes.push(
      <span key={`tok-${key++}`} className={className}>
        {value}
      </span>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < line.length) {
    nodes.push(<span key={`tail-${key++}`}>{line.slice(lastIndex)}</span>);
  }

  return nodes;
}

function renderEditorLines(
  code: string,
  startLine = 1,
  dim = false,
  ghost = false,
  highlightLineNumbers: number[] = []
): ReactNode[] {
  const lines = code.split("\n");

  return lines.map((line, index) => {
    const lineNumber = startLine + index;
    const isHighlighted = highlightLineNumbers.includes(lineNumber);

    return (
      <div
        key={`${lineNumber}-${line}-${dim ? "dim" : "base"}-${ghost ? "ghost" : "solid"}-${
          isHighlighted ? "hl" : "plain"
        }`}
        className={`grid grid-cols-[2.25rem_1fr] ${dim ? "opacity-45" : ""} ${
          isHighlighted ? "rounded bg-[#3A1D22]/65" : ""
        }`}
      >
        <span className={`select-none pr-3 text-right ${isHighlighted ? "text-[#FFA198]" : "text-[#6E7681]"}`}>
          {lineNumber}
        </span>
        <span className={`whitespace-pre ${ghost ? "text-transparent" : ""}`}>{highlightLine(line)}</span>
      </div>
    );
  });
}

function renderTypingLines(code: string, startLine = 1, showCursor = false): ReactNode[] {
  const lines = code.split("\n");

  return lines.map((line, index) => {
    const isLastLine = index === lines.length - 1;

    return (
      <div key={`${startLine + index}-${line}-typed`} className="grid grid-cols-[2.25rem_1fr]">
        <span className="select-none pr-3 text-right text-[#6E7681]">{startLine + index}</span>
        <span className="whitespace-pre">
          {highlightLine(line)}
          {showCursor && isLastLine ? (
            <span
              aria-hidden
              className="ml-0.5 inline-block h-[1em] w-px animate-pulse bg-foreground/85 align-[-0.08em]"
            />
          ) : null}
        </span>
      </div>
    );
  });
}

function renderDiffLines(code: string, startLine = 1): ReactNode[] {
  const lines = code.split("\n");

  return lines.map((line, index) => {
    const isAddition = line.startsWith("+");
    const isRemoval = line.startsWith("-");
    const content = isAddition || isRemoval ? line.slice(1) : line;

    return (
      <div
        key={`${startLine + index}-${line}-diff`}
        className={`grid grid-cols-[2.25rem_1fr] ${
          isAddition
            ? "bg-[#132D1A]"
            : isRemoval
              ? "bg-[#341A20]"
              : ""
        }`}
      >
        <span className="select-none pr-3 text-right text-[#6E7681]">{startLine + index}</span>
        <span className={`whitespace-pre ${isAddition ? "text-[#7EE787]" : isRemoval ? "text-[#FFA198]" : ""}`}>
          {isAddition || isRemoval ? (
            <span className="mr-1 text-[#9DA5B4]">{line[0]}</span>
          ) : null}
          {highlightLine(content)}
        </span>
      </div>
    );
  });
}

const promptingChatInput = `You are a senior QA engineer.

Task:
1) Produce Playwright tests using page objects.
2) Use role-based selectors (getByRole) where possible.
3) Include: happy path, invalid token, expired token, weak password, rate limiting.
4) Add CI notes: retries, trace on failure, parallelization.
5) Output:
- Test plan table
- Playwright spec file
- Selector strategy`;

const sampleCode = `import { test, expect } from "@playwright/test";

test.describe("Password reset", () => {
  test("happy path: reset password and login", async ({ page }) => {
    await page.goto("/forgot-password");
    await page.getByRole("textbox", { name: /email/i }).fill("user@example.com");
    await page.getByRole("button", { name: /send reset link/i }).click();

    // In real env: fetch token from test mailbox or API
    const token = "TEST_TOKEN";
    await page.goto(\`/reset?token=\${token}\`);

    await page.getByRole("textbox", { name: /new password/i }).fill("Str0ng!Passw0rd");
    await page.getByRole("textbox", { name: /confirm password/i }).fill("Str0ng!Passw0rd");
    await page.getByRole("button", { name: /reset password/i }).click();

    await expect(page.getByText(/password updated/i)).toBeVisible();
  });
});`;
const sampleCodeTotalLines = sampleCode.split("\n").length;

const assistantDraftCode = `import type { Page } from "@playwright/test";

export async function loginWithUi(page: Page, role: "admin" | "member") {
  await page.goto("/login");
  await page.getByRole("textbox", { name: /email/i }).fill(role + "@example.com");
  await page.getByRole("textbox", { name: /password/i }).fill(process.env.E2E_PASSWORD!);
  await page.getByRole("button", { name: /sign in/i }).click();
}`;

const assistantSuggestionCode = `// AI autocomplete suggestion:
await page.context().storageState({ path: "auth/" + role + ".json" });

// Optional helper:
export async function assertDashboardLoaded(page: Page) {
  await page.goto("/dashboard");
  await page.getByRole("heading", { name: /dashboard/i }).isVisible();
}`;
const assistantSuggestionPlaceholder = assistantSuggestionCode
  .split("\n")
  .map(() => " ")
  .join("\n");
const assistantDraftLines = assistantDraftCode.split("\n");
const assistantTypedStartLine = 7;
const assistantDraftStaticHead = assistantDraftLines.slice(0, assistantTypedStartLine - 1).join("\n");
const assistantDraftTypingTail = assistantDraftLines.slice(assistantTypedStartLine - 1).join("\n");
const assistantDraftTypingTailTotalLines = assistantDraftTypingTail.split("\n").length;

const assistantFinalCode = `${assistantDraftCode}\n\n${assistantSuggestionCode}`;

const prReviewDiff = `- await page.click("button[type=submit]");
+ await page.getByRole("button", { name: /sign in/i }).click();

- await expect(page.locator(".dashboard-title")).toBeVisible();
+ await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible();

// TODO: flaky in CI under parallel workers
await page.waitForTimeout(1000);
const toast = page.getByTestId("login-toast");
await expect(toast).toContainText("Welcome back");
`;

const prReviewFindings = [
  {
    severity: "High",
    title: "Replace fixed timeout with deterministic wait",
    body: "Avoid `waitForTimeout(1000)`. Wait for API response or toast visibility to reduce flaky CI runs."
  },
  {
    severity: "Medium",
    title: "Strengthen post-login assertion",
    body: "Validate URL change and auth cookie/storage state in addition to heading text for stronger signal."
  },
  {
    severity: "Low",
    title: "Promote selector consistency",
    body: "Good migration to `getByRole`. Apply same pattern to toast access to avoid test-id drift."
  }
];

const debugFlakyCode = `test('should sign in with valid credentials', async ({ page }) => {
  const testEmail = process.env.E2E_USER_EMAIL ?? '';
  const testPassword = process.env.E2E_USER_PASSWORD ?? '';

  await page.goto('/login');
  await page.fill('[name="email"]', testEmail);
  await page.fill('[name="password"]', testPassword);
  await page.locator('.btn-primary').click();
  await expect(page).toHaveURL('/dashboard');
});`;

const debugFixedCode = `test('should sign in with valid credentials', async ({ page }) => {
  const testEmail = process.env.E2E_USER_EMAIL ?? '';
  const testPassword = process.env.E2E_USER_PASSWORD ?? '';

  await page.goto('/login');
  await page.fill('[name="email"]', testEmail);
  await page.fill('[name="password"]', testPassword);
  await page.getByTestId('sign-in').click();
  await expect(page).toHaveURL('/dashboard');
});`;

const debugSuggestedDiff = `- await page.locator('.btn-primary').click();
+ await page.getByTestId('sign-in').click();`;

const debugTerminalFailureOutput = [
  { text: "$ npx playwright test", tone: "command" },
  { text: "Running 25 tests using 4 workers", tone: "neutral" },
  { text: "✓ checkout.spec.ts › should complete purchase", tone: "pass" },
  { text: "✓ profile.spec.ts › should update account details", tone: "pass" },
  { text: "✕ login.spec.ts › should sign in with valid credentials", tone: "fail" },
  { text: "Error: locator('.btn-primary') resolved to 0 elements", tone: "error" },
  { text: "24 passed", tone: "pass" },
  { text: "1 failed", tone: "fail" }
] as const;

const debugTerminalRecoveryOutput = [
  { text: "Applying AI patch suggestion...", tone: "neutral" },
  { text: "Re-running affected test in CI", tone: "neutral" },
  { text: "✓ login.spec.ts › should sign in with valid credentials", tone: "pass" },
  { text: "25 passed", tone: "pass" },
  { text: "Recovered · patch suggested for review", tone: "info" }
] as const;

const aiGeneratedPrompt =
  "Create a Playwright test for user login, dashboard access, and logout flow";

const aiGeneratedCode = `import { test, expect } from '@playwright/test';

test('user can login and logout', async ({ page }) => {
  const testEmail = process.env.E2E_USER_EMAIL ?? '';
  const testPassword = process.env.E2E_USER_PASSWORD ?? '';

  await page.goto('https://app.example.com/login');

  await page.getByLabel('Email').fill(testEmail);
  await page.getByLabel('Password').fill(testPassword);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByText('Welcome back')).toBeVisible();

  await page.getByRole('button', { name: 'Profile' }).click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();

  await expect(page).toHaveURL(/login/);
});`;
const aiGeneratedCodeLines = aiGeneratedCode.split("\n");

const exampleItems = [
  {
    label: "Prompt-Driven Test Design",
    description: "Generate Playwright tests directly from product requirements and user flows.",
    demo: "prompting"
  },
  {
    label: "AI-Assisted Test Authoring",
    description: "Speed up test creation with intelligent inline suggestions in your editor.",
    demo: "assistant"
  },
  {
    label: "AI-Powered PR QA Reviews",
    description: "Automatically review test changes for coverage gaps, risks, and improvements.",
    demo: "pr-review"
  },
  {
    label: "AI Flake Detection & Auto-Recovery",
    description: "Detect flaky tests in CI and automatically debug or patch failures.",
    demo: "debug-fix"
  }
] as const;

export function AIQaSection() {
  type ExampleDemo = (typeof exampleItems)[number]["demo"];
  type DemoTab = ExampleDemo | "ai-generated";
  type PromptingStage = "idle" | "generating" | "code";
  type AssistantStage = "typing" | "suggestion" | "decision" | "accepted" | "rejected";
  type PrReviewStage = "idle" | "reviewing" | "done";
  type DebugStage = "running" | "failed" | "analyzing" | "suggested" | "fixed";
  type AiGeneratedStage = "prompting" | "editor" | "coding" | "done";

  const [activeDemo, setActiveDemo] = useState<DemoTab>("ai-generated");
  const [examplesModalOpen, setExamplesModalOpen] = useState(false);
  const [promptingStage, setPromptingStage] = useState<PromptingStage>("idle");
  const [promptingTypedText, setPromptingTypedText] = useState("");
  const [assistantStage, setAssistantStage] = useState<AssistantStage>("typing");
  const [assistantRunKey, setAssistantRunKey] = useState(0);
  const [assistantTypedText, setAssistantTypedText] = useState("");
  const [assistantSuggestionVisible, setAssistantSuggestionVisible] = useState(false);
  const [prReviewStage, setPrReviewStage] = useState<PrReviewStage>("idle");
  const [prVisibleFindings, setPrVisibleFindings] = useState(0);
  const [debugRunKey, setDebugRunKey] = useState(0);
  const [debugStage, setDebugStage] = useState<DebugStage>("running");
  const [debugVisibleTerminalLines, setDebugVisibleTerminalLines] = useState(0);
  const [debugShowSuggestion, setDebugShowSuggestion] = useState(false);
  const [debugFixApplied, setDebugFixApplied] = useState(false);
  const [aiGeneratedRunKey, setAiGeneratedRunKey] = useState(0);
  const [aiGeneratedStage, setAiGeneratedStage] = useState<AiGeneratedStage>("prompting");
  const [aiGeneratedPromptTyped, setAiGeneratedPromptTyped] = useState("");
  const [aiGeneratedVisibleLines, setAiGeneratedVisibleLines] = useState(0);
  const promptingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const promptingInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const assistantTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const assistantInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const assistantFrame = useRef<number | null>(null);
  const prReviewTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prReviewInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const debugTimers = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const debugLogScrollRef = useRef<HTMLDivElement | null>(null);
  const aiGeneratedPromptTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aiGeneratedPromptInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const aiGeneratedCodeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aiGeneratedCodeInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const debugTerminalLines = [...debugTerminalFailureOutput, ...debugTerminalRecoveryOutput];

  const clearPromptingFlowSchedulers = () => {
    if (promptingTimeout.current) clearTimeout(promptingTimeout.current);
    if (promptingInterval.current) clearInterval(promptingInterval.current);
  };

  const clearAssistantFlowSchedulers = () => {
    if (assistantTimeout.current) clearTimeout(assistantTimeout.current);
    if (assistantInterval.current) clearInterval(assistantInterval.current);
    if (assistantFrame.current) cancelAnimationFrame(assistantFrame.current);
  };

  const clearPrReviewFlowSchedulers = () => {
    if (prReviewTimeout.current) clearTimeout(prReviewTimeout.current);
    if (prReviewInterval.current) clearInterval(prReviewInterval.current);
  };

  const clearDebugFlowSchedulers = () => {
    debugTimers.current.forEach((timer) => clearTimeout(timer));
    debugTimers.current = [];
  };

  const clearAiGeneratedFlowSchedulers = () => {
    if (aiGeneratedPromptTimeout.current) clearTimeout(aiGeneratedPromptTimeout.current);
    if (aiGeneratedPromptInterval.current) clearInterval(aiGeneratedPromptInterval.current);
    if (aiGeneratedCodeTimeout.current) clearTimeout(aiGeneratedCodeTimeout.current);
    if (aiGeneratedCodeInterval.current) clearInterval(aiGeneratedCodeInterval.current);
  };

  useEffect(() => {
    return () => {
      clearPromptingFlowSchedulers();
      clearAssistantFlowSchedulers();
      clearPrReviewFlowSchedulers();
      clearDebugFlowSchedulers();
      clearAiGeneratedFlowSchedulers();
    };
  }, []);

  const restartPromptingFlow = () => {
    clearPromptingFlowSchedulers();
    setPromptingTypedText("");
    setPromptingStage("idle");
  };

  const restartAssistantFlow = () => {
    clearAssistantFlowSchedulers();
    setAssistantTypedText("");
    setAssistantSuggestionVisible(false);
    setAssistantStage("typing");
    setAssistantRunKey((current) => current + 1);
  };

  const restartPrReviewFlow = () => {
    clearPrReviewFlowSchedulers();
    setPrVisibleFindings(0);
    setPrReviewStage("idle");
  };

  const restartDebugFlow = () => {
    clearDebugFlowSchedulers();
    setDebugVisibleTerminalLines(0);
    setDebugShowSuggestion(false);
    setDebugFixApplied(false);
    setDebugStage("running");
    setDebugRunKey((current) => current + 1);
  };

  const restartAiGeneratedFlow = () => {
    clearAiGeneratedFlowSchedulers();
    setAiGeneratedPromptTyped("");
    setAiGeneratedVisibleLines(0);
    setAiGeneratedStage("prompting");
    setAiGeneratedRunKey((current) => current + 1);
  };

  const handleTabChange = (value: string) => {
    const nextTab = value as DemoTab;
    clearPromptingFlowSchedulers();
    clearAssistantFlowSchedulers();
    clearPrReviewFlowSchedulers();
    clearDebugFlowSchedulers();
    clearAiGeneratedFlowSchedulers();
    setActiveDemo(nextTab);
    if (nextTab === "prompting") {
      restartPromptingFlow();
      return;
    }
    if (nextTab === "assistant") {
      restartAssistantFlow();
      return;
    }
    if (nextTab === "pr-review") {
      restartPrReviewFlow();
      return;
    }
    if (nextTab === "debug-fix") {
      restartDebugFlow();
      return;
    }
    if (nextTab === "ai-generated") {
      restartAiGeneratedFlow();
    }
  };

  const openExampleModal = (demo: ExampleDemo) => {
    handleTabChange(demo);
    setExamplesModalOpen(true);
  };

  const handleExamplesModalOpenChange = (open: boolean) => {
    setExamplesModalOpen(open);
    if (!open) {
      handleTabChange("ai-generated");
    }
  };

  const goToNextExample = () => {
    const examples = exampleItems.map((item) => item.demo) as ExampleDemo[];
    const currentIndex = examples.indexOf(activeDemo as ExampleDemo);
    const next = examples[(Math.max(currentIndex, 0) + 1) % examples.length];
    handleTabChange(next);
  };

  const sendPrompt = () => {
    clearPromptingFlowSchedulers();
    setPromptingTypedText("");
    setPromptingStage("generating");

    let codeCharIndex = 0;
    promptingTimeout.current = setTimeout(() => {
      promptingInterval.current = setInterval(() => {
        codeCharIndex += 1;
        setPromptingTypedText(sampleCode.slice(0, codeCharIndex));

        if (codeCharIndex >= sampleCode.length) {
          if (promptingInterval.current) clearInterval(promptingInterval.current);
          setPromptingStage("code");
        }
      }, 8);
    }, 120);
  };

  const runPrReview = () => {
    clearPrReviewFlowSchedulers();
    setPrVisibleFindings(0);
    setPrReviewStage("reviewing");

    let visible = 0;
    prReviewTimeout.current = setTimeout(() => {
      prReviewInterval.current = setInterval(() => {
        visible += 1;
        setPrVisibleFindings(Math.min(visible, prReviewFindings.length));

        if (visible >= prReviewFindings.length) {
          if (prReviewInterval.current) clearInterval(prReviewInterval.current);
          setPrReviewStage("done");
        }
      }, 680);
    }, 260);
  };

  useEffect(() => {
    if (activeDemo !== "assistant") return;
    clearAssistantFlowSchedulers();

    if (assistantStage === "typing") {
      let charIndex = 0;
      setAssistantTypedText("");
      setAssistantSuggestionVisible(false);

      assistantTimeout.current = setTimeout(() => {
        assistantInterval.current = setInterval(() => {
          charIndex += 1;
          setAssistantTypedText(assistantDraftTypingTail.slice(0, charIndex));

          if (charIndex >= assistantDraftTypingTail.length) {
            if (assistantInterval.current) clearInterval(assistantInterval.current);
            assistantTimeout.current = setTimeout(() => {
              setAssistantStage("suggestion");
            }, 90);
          }
        }, 10);
      }, 150);
      return;
    }

    if (assistantStage === "suggestion") {
      assistantFrame.current = requestAnimationFrame(() => setAssistantSuggestionVisible(true));
      assistantTimeout.current = setTimeout(() => {
        setAssistantStage("decision");
      }, 760);
      return;
    }
  }, [activeDemo, assistantRunKey, assistantStage]);

  useEffect(() => {
    if (activeDemo !== "debug-fix") return;
    clearDebugFlowSchedulers();
    setDebugVisibleTerminalLines(0);
    setDebugShowSuggestion(false);
    setDebugFixApplied(false);
    setDebugStage("running");

    const scheduleDebug = (fn: () => void, delay: number) => {
      const timer = setTimeout(fn, delay);
      debugTimers.current.push(timer);
    };

    const failureLineDelay = 320;
    const flowStart = 140;

    debugTerminalFailureOutput.forEach((_, index) => {
      scheduleDebug(() => {
        setDebugVisibleTerminalLines(index + 1);
        if (index === 4) {
          setDebugStage("failed");
        }
      }, flowStart + index * failureLineDelay);
    });

    const failureSequenceEnd = flowStart + debugTerminalFailureOutput.length * failureLineDelay;

    scheduleDebug(() => {
      setDebugStage("analyzing");
    }, failureSequenceEnd + 220);

    scheduleDebug(() => {
      setDebugShowSuggestion(true);
      setDebugStage("suggested");
    }, failureSequenceEnd + 1180);

    scheduleDebug(() => {
      setDebugFixApplied(true);
      setDebugStage("fixed");
    }, failureSequenceEnd + 2240);

    debugTerminalRecoveryOutput.forEach((_, index) => {
      scheduleDebug(() => {
        setDebugVisibleTerminalLines(debugTerminalFailureOutput.length + index + 1);
      }, failureSequenceEnd + 2400 + index * 280);
    });

    return () => {
      clearDebugFlowSchedulers();
    };
  }, [activeDemo, debugRunKey]);

  useEffect(() => {
    if (activeDemo !== "debug-fix") return;
    if (!debugLogScrollRef.current) return;
    const hasOverflow = debugLogScrollRef.current.scrollHeight > debugLogScrollRef.current.clientHeight + 1;
    if (hasOverflow) {
      debugLogScrollRef.current.scrollTop = debugLogScrollRef.current.scrollHeight;
    }
  }, [activeDemo, debugVisibleTerminalLines, debugRunKey]);

  useEffect(() => {
    if (activeDemo !== "ai-generated") return;
    clearAiGeneratedFlowSchedulers();
    setAiGeneratedPromptTyped("");
    setAiGeneratedVisibleLines(0);
    setAiGeneratedStage("prompting");

    let promptCharIndex = 0;
    aiGeneratedPromptTimeout.current = setTimeout(() => {
      aiGeneratedPromptInterval.current = setInterval(() => {
        promptCharIndex += 1;
        setAiGeneratedPromptTyped(aiGeneratedPrompt.slice(0, promptCharIndex));

        if (promptCharIndex >= aiGeneratedPrompt.length) {
          if (aiGeneratedPromptInterval.current) clearInterval(aiGeneratedPromptInterval.current);
          setAiGeneratedStage("editor");

          aiGeneratedCodeTimeout.current = setTimeout(() => {
            setAiGeneratedStage("coding");
            let visibleLineIndex = 0;
            aiGeneratedCodeInterval.current = setInterval(() => {
              visibleLineIndex += 1;
              setAiGeneratedVisibleLines(Math.min(visibleLineIndex, aiGeneratedCodeLines.length));

              if (visibleLineIndex >= aiGeneratedCodeLines.length) {
                if (aiGeneratedCodeInterval.current) clearInterval(aiGeneratedCodeInterval.current);
                setAiGeneratedStage("done");
              }
            }, 150);
          }, 260);
        }
      }, 14);
    }, 120);

    return () => {
      clearAiGeneratedFlowSchedulers();
    };
  }, [activeDemo, aiGeneratedRunKey]);

  useEffect(() => {
    if (activeDemo !== "ai-generated" || examplesModalOpen) return;

    const replayTimer = setTimeout(() => {
      restartAiGeneratedFlow();
    }, 10000);

    return () => {
      clearTimeout(replayTimer);
    };
  }, [activeDemo, aiGeneratedRunKey, examplesModalOpen]);

  const acceptAssistantSuggestion = () => {
    setAssistantStage("accepted");
    setAssistantSuggestionVisible(true);
  };

  const rejectAssistantSuggestion = () => {
    setAssistantStage("rejected");
    setAssistantSuggestionVisible(false);
  };

  const activeExample = exampleItems.find((item) => item.demo === activeDemo) ?? exampleItems[0];

  const replayActiveExample = () => {
    if (activeDemo === "prompting") {
      restartPromptingFlow();
      return;
    }
    if (activeDemo === "assistant") {
      restartAssistantFlow();
      return;
    }
    if (activeDemo === "pr-review") {
      restartPrReviewFlow();
      return;
    }
    if (activeDemo === "debug-fix") {
      restartDebugFlow();
      return;
    }
    restartAiGeneratedFlow();
  };

  return (
    <section id="ai-powered-qa" className="py-16 md:py-20">
      <div className="container">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge variant="default" className="bg-white/8">
              AI + QA
            </Badge>
            <Badge variant="default" className="gap-1 bg-transparent text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              AI-assisted workflow
            </Badge>
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
            From user story to CI-ready tests
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            See how we use AI to turn requirements into Playwright tests, improve coverage, and
            reduce flakiness, without slowing down your team.
          </p>
        </div>

        <Card className="rounded-2xl p-6 md:p-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[40%_60%]">
            <div className="space-y-5">
              <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
                We integrate AI into every stage of modern QA
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                We use AI to turn requirements into tests faster, improve coverage, and
                automatically detect and fix flaky tests, so your team can ship with confidence.
              </p>
              <div className="space-y-2.5">
                {exampleItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => openExampleModal(item.demo)}
                    className="flex w-full items-start rounded-lg border border-white/8 bg-card/70 px-3 py-2.5 text-left transition-colors hover:border-white/15 hover:bg-card"
                  >
                    <span className="flex gap-2 pr-3">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7AA2F7]" />
                      <span>
                        <span className="block text-sm text-foreground">{item.label}</span>
                        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                          {item.description}
                        </span>
                      </span>
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex justify-center pt-2 lg:justify-start">
                <Button variant="gradient" onClick={() => openExampleModal("prompting")}>
                  See how it works
                </Button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-[#30363D] bg-[#0D1117] p-4">
              <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#5B8CFF]/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 left-0 h-40 w-40 rounded-full bg-[#7A5CFF]/20 blur-3xl" />

              <div className="relative space-y-4">
                <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-3">
                  <p className="mb-2 text-[11px] uppercase tracking-[0.12em] text-[#8B949E]">Prompt</p>
                  <div className="rounded-lg border border-[#30363D] bg-[#0D1117] px-3 py-2 font-mono text-[12px] text-[#C9D1D9]">
                    <span className="mr-2 text-[#7AA2F7]">{">"}</span>
                    <span>{aiGeneratedPromptTyped}</span>
                    {aiGeneratedStage === "prompting" ? (
                      <span
                        aria-hidden
                        className="ml-0.5 inline-block h-[1em] w-px animate-pulse bg-[#DCE2EF] align-[-0.08em]"
                      />
                    ) : null}
                  </div>
                </div>

                <div
                  className={`overflow-hidden rounded-xl border border-[#30363D] bg-[#0D1117] transition-all duration-500 ${
                    aiGeneratedStage === "prompting"
                      ? "translate-y-2 opacity-0"
                      : "translate-y-0 opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-[#30363D] bg-[#161B22] px-3 py-2 text-[11px]">
                    <div className="flex items-center gap-2 text-[#C9D1D9]">
                      <FileCode2 className="h-3.5 w-3.5" />
                      <span>login.spec.ts</span>
                    </div>
                    <Badge className="border border-[#58A6FF]/35 bg-[#1F6FEB]/15 text-[#9CC3FF]">
                      Generated with AI
                    </Badge>
                  </div>
                  <div className="overflow-x-auto">
                    <div className="min-h-[360px] min-w-[620px] p-4 font-mono text-[12px] leading-relaxed text-[#D4D4D4] sm:min-w-0">
                      {aiGeneratedVisibleLines > 0
                        ? renderEditorLines(
                            aiGeneratedCodeLines.slice(0, aiGeneratedVisibleLines).join("\n"),
                            1,
                            false
                          )
                        : null}

                      {(() => {
                        const remainingLines = Math.max(0, aiGeneratedCodeLines.length - aiGeneratedVisibleLines);
                        const showCursor = aiGeneratedStage === "coding" && remainingLines > 0;
                        const ghostLines = Math.max(0, remainingLines - (showCursor ? 1 : 0));
                        const ghostPlaceholder = Array.from({ length: ghostLines }, () => " ").join("\n");
                        const nextCursorLine = aiGeneratedVisibleLines + 1;
                        const ghostStartLine = showCursor ? nextCursorLine + 1 : nextCursorLine;

                        return (
                          <>
                            {showCursor ? (
                              <div className="grid grid-cols-[2.25rem_1fr]">
                                <span className="select-none pr-3 text-right text-[#6E7681]">
                                  {nextCursorLine}
                                </span>
                                <span aria-hidden className="inline-block h-[1em] w-px animate-pulse bg-[#9CC3FF]" />
                              </div>
                            ) : null}
                            {ghostLines > 0
                              ? renderEditorLines(ghostPlaceholder, ghostStartLine, false, true)
                              : null}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Dialog open={examplesModalOpen} onOpenChange={handleExamplesModalOpenChange}>
          <DialogContent className="h-[90dvh] max-h-[90vh] max-w-[1200px] overflow-hidden p-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-0">
            <DialogHeader className="border-b border-border px-6 py-4">
              <DialogTitle>{activeExample.label}</DialogTitle>
              <DialogDescription>{activeExample.description}</DialogDescription>
            </DialogHeader>
            <Tabs
              value={activeDemo}
              onValueChange={handleTabChange}
              className="min-h-0 overflow-y-auto p-4 md:p-6 space-y-4"
            >

            <TabsContent
              value="prompting"
              className="mt-0 rounded-none border-0 bg-transparent p-0 px-1 focus-visible:outline-none space-y-4"
            >
              <div className="overflow-hidden rounded-2xl border border-[#30363D] bg-[#0D1117]">
                <div className="flex items-center justify-between border-b border-[#30363D] bg-[#161B22] px-3 py-1.5 text-[11px] text-[#9DA5B4]">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
                    <span className="ml-2">Cursor</span>
                  </div>
                  <div className="hidden items-center gap-2 text-[#8B949E] sm:flex">
                    <span className="rounded bg-white/5 px-2 py-0.5">Claude Sonnet</span>
                    <span>agent mode</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.33fr)_minmax(0,0.67fr)]">
                  <div className="border-b border-[#30363D] bg-[#11161E] p-4 lg:border-b-0 lg:border-r">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-xs uppercase tracking-[0.12em] text-[#8B949E]">Agent Chat</p>
                      <Badge className="border border-white/15 bg-white/10 text-[#C9D1D9]">Prompt</Badge>
                    </div>
                    <div className="rounded-xl border border-[#30363D] bg-[#161B22] px-4 py-3 text-sm leading-relaxed text-[#DCE2EF]">
                      <p className="whitespace-pre-wrap">{promptingChatInput}</p>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button
                        type="button"
                        size="sm"
                        onClick={sendPrompt}
                        disabled={promptingStage === "generating"}
                        className="h-8 rounded-lg border border-[#58A6FF]/35 bg-[#2F81F7] px-3 text-white hover:bg-[#1F6FEB]"
                      >
                        {promptingStage === "generating"
                          ? "Generating..."
                          : promptingStage === "code"
                            ? "Send Again"
                            : "Send Prompt"}
                      </Button>
                    </div>
                  </div>

                  <div className="bg-[#0D1117]">
                    <div className="flex items-center border-b border-[#30363D] bg-[#161B22] text-xs">
                      <div className="flex items-center gap-2 border-r border-[#30363D] bg-[#0D1117] px-3 py-2 text-[#C9D1D9]">
                        <FileCode2 className="h-3.5 w-3.5" />
                        <span>playwright-reset-password.spec.ts</span>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <div className="min-w-[620px] p-4 font-mono text-[12px] leading-relaxed text-[#D4D4D4] sm:min-w-0">
                        {promptingTypedText.length > 0
                          ? renderTypingLines(promptingTypedText, 1, promptingStage === "generating")
                          : null}
                        {(() => {
                          const typedLines = promptingTypedText.length > 0 ? promptingTypedText.split("\n").length : 0;
                          const remainingLines = Math.max(0, sampleCodeTotalLines - typedLines);
                          const remainingPlaceholder = Array.from({ length: remainingLines }, () => " ").join("\n");

                          return remainingLines > 0
                            ? renderEditorLines(remainingPlaceholder, typedLines + 1, false, true)
                            : null;
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </TabsContent>

            <TabsContent
              value="assistant"
              className="mt-0 rounded-none border-0 bg-transparent p-0 px-1 focus-visible:outline-none space-y-4"
            >
              <div className="overflow-hidden rounded-2xl border border-[#30363D] bg-[#0D1117]">
                <div className="flex items-center justify-between border-b border-[#30363D] bg-[#161B22] px-3 py-1.5 text-[11px] text-[#9DA5B4]">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
                    <span className="ml-2">Visual Studio Code</span>
                  </div>
                  <span className="hidden sm:inline text-[#8B949E]">automata-qa / auth-flow.ts</span>
                </div>

                <div className="flex min-h-[420px]">
                  <aside className="hidden w-10 shrink-0 flex-col items-center gap-3 border-r border-[#30363D] bg-[#11161E] py-3 md:flex">
                    <FileCode2 className="h-4 w-4 text-[#C9D1D9]" />
                    <Search className="h-4 w-4 text-[#8B949E]" />
                    <GitBranch className="h-4 w-4 text-[#8B949E]" />
                    <Bug className="h-4 w-4 text-[#8B949E]" />
                    <Terminal className="h-4 w-4 text-[#8B949E]" />
                  </aside>

                  <aside className="hidden w-52 shrink-0 border-r border-[#30363D] bg-[#161B22] lg:block">
                    <div className="border-b border-[#30363D] px-3 py-2 text-[11px] uppercase tracking-wide text-[#8B949E]">
                      Explorer
                    </div>
                    <div className="space-y-1 px-2 py-2 text-xs text-[#8B949E]">
                      <p className="px-1">AUTOMATA-QA</p>
                      <div className="rounded-md bg-[#1F242D] px-2 py-1 text-[#C9D1D9]">auth-flow.ts</div>
                      <div className="px-2 py-1">login.spec.ts</div>
                    </div>
                  </aside>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-center border-b border-[#30363D] bg-[#161B22] text-xs">
                      <div className="flex items-center gap-2 border-r border-[#30363D] bg-[#0D1117] px-3 py-2 text-[#C9D1D9]">
                        <FileCode2 className="h-3.5 w-3.5" />
                        <span>auth-flow.ts</span>
                      </div>
                      <div className="hidden px-3 py-2 text-[#8B949E] sm:block">login.spec.ts</div>
                    </div>

                    <div className="flex-1 overflow-x-auto">
                      <div className="min-w-[620px] p-4 font-mono text-[12px] leading-relaxed text-[#D4D4D4] sm:min-w-0">
                        {renderEditorLines(assistantDraftStaticHead, 1, false)}
                        {assistantStage === "typing"
                          ? (() => {
                              const typedLines = assistantTypedText.split("\n").length;
                              const remainingLines = Math.max(
                                0,
                                assistantDraftTypingTailTotalLines - typedLines
                              );
                              const remainingPlaceholder = Array.from({ length: remainingLines }, () => " ")
                                .join("\n");

                              return (
                                <>
                                  {renderTypingLines(assistantTypedText, assistantTypedStartLine, true)}
                                  {remainingLines > 0
                                    ? renderEditorLines(
                                        remainingPlaceholder,
                                        assistantTypedStartLine + typedLines,
                                        false,
                                        true
                                      )
                                    : null}
                                </>
                              );
                            })()
                          : renderEditorLines(assistantDraftTypingTail, assistantTypedStartLine, false)}

                        {assistantStage === "typing" || assistantStage === "rejected" ? (
                          renderEditorLines(
                            assistantSuggestionPlaceholder,
                            assistantDraftCode.split("\n").length + 1,
                            false,
                            true
                          )
                        ) : (
                          <div
                            className={`transition-opacity duration-700 ease-out ${
                              assistantStage === "accepted" || assistantSuggestionVisible
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          >
                            {renderEditorLines(
                              assistantSuggestionCode,
                              assistantDraftCode.split("\n").length + 1,
                              assistantStage === "suggestion" || assistantStage === "decision"
                            )}
                          </div>
                        )}

                      </div>
                    </div>

                    {(assistantStage === "decision" ||
                      assistantStage === "accepted" ||
                      assistantStage === "rejected") && (
                      <div className="border-t border-[#30363D] px-4 py-3">
                        <div className="ml-auto flex w-fit gap-2 font-sans">
                          <Button
                            type="button"
                            size="sm"
                            onClick={acceptAssistantSuggestion}
                            disabled={assistantStage === "accepted"}
                            className={`h-7 border px-2.5 text-xs ${
                              assistantStage === "accepted"
                                ? "border-emerald-400/45 bg-emerald-500 text-white hover:bg-emerald-500"
                                : "border-emerald-300/30 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20"
                            }`}
                          >
                            <Check className="h-3.5 w-3.5" />
                            {assistantStage === "accepted" ? "Accepted" : "Accept"}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            onClick={rejectAssistantSuggestion}
                            disabled={assistantStage === "rejected"}
                            variant="outline"
                            className={`h-7 px-2.5 text-xs ${
                              assistantStage === "rejected"
                                ? "border-white/15 bg-white/10 text-foreground"
                                : "border-white/12 bg-white/5 text-muted-foreground hover:bg-white/10"
                            }`}
                          >
                            <X className="h-3.5 w-3.5" />
                            {assistantStage === "rejected" ? "Rejected" : "Reject"}
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t border-[#30363D] bg-[#161B22] px-3 py-1 text-[11px] text-[#C9D1D9]">
                      <div className="flex items-center gap-3">
                        <span>TypeScript</span>
                        <span>UTF-8</span>
                        <span>LF</span>
                      </div>
                      <div className="hidden items-center gap-3 text-[#9DA5B4] sm:flex">
                        <span>Ln 14, Col 1</span>
                        <span>Spaces: 2</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </TabsContent>

            <TabsContent
              value="pr-review"
              className="mt-0 rounded-none border-0 bg-transparent p-0 px-1 focus-visible:outline-none space-y-4"
            >
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.33fr)_minmax(0,0.67fr)]">
                <div className="rounded-2xl border border-[#30363D] bg-[#0D1117] p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2 border-b border-[#30363D] pb-3">
                      <p className="text-xs uppercase tracking-[0.15em] text-[#8B949E]">
                        Pull Request
                      </p>
                      <Badge className="border border-emerald-400/35 bg-emerald-500/15 text-emerald-200">
                        OPEN
                      </Badge>
                    </div>
                    <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-3">
                      <p className="text-sm font-medium text-[#C9D1D9]">
                        PR #482 · Harden login flow selectors for CI reliability
                      </p>
                      <p className="mt-1 text-xs text-[#8B949E]">
                        Files changed: 2 · +31 / -14 · Author: frontend-platform
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={runPrReview}
                      disabled={prReviewStage === "reviewing"}
                      className="w-full border border-[#3FB950]/35 bg-[#238636] text-white hover:bg-[#2EA043]"
                    >
                      {prReviewStage === "reviewing"
                        ? "Copilot Reviewing..."
                        : prReviewStage === "done"
                          ? "Run Review Again"
                          : "Run Copilot PR Review"}
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-[#30363D] bg-[#0D1117]">
                  <div className="flex items-center gap-2 border-b border-[#30363D] bg-[#161B22] px-4 py-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
                    <span className="ml-2 text-[11px] text-[#8B949E]">
                      tests/e2e/login.spec.ts · unified diff
                    </span>
                  </div>
                  <div className="min-w-[620px] p-4 font-mono text-[12px] leading-relaxed text-[#C9D1D9] sm:min-w-0">
                    {renderDiffLines(prReviewDiff, 118)}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#30363D] bg-[#0D1117] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-[#C9D1D9]">Copilot Review Findings</p>
                  <span className="text-xs text-[#8B949E]">
                    {prVisibleFindings}/{prReviewFindings.length} surfaced
                  </span>
                </div>

                {prReviewStage === "idle" ? (
                  <p className="text-sm text-[#8B949E]">
                    Run review to surface AI findings on reliability, selector quality, and CI risk.
                  </p>
                ) : (
                  <div className="space-y-3">
                    <Accordion type="multiple" className="space-y-2">
                      {prReviewFindings.slice(0, prVisibleFindings).map((finding, index) => (
                        <AccordionItem
                          key={finding.title}
                          value={`finding-${index}`}
                          className="overflow-hidden rounded-lg border border-[#30363D] bg-[#161B22] px-0"
                        >
                          <AccordionTrigger className="px-3 py-3 hover:bg-[#1F242D] hover:no-underline">
                            <div className="flex w-full items-center justify-between gap-2 pr-2 text-left">
                              <p className="text-sm font-medium text-[#C9D1D9]">{finding.title}</p>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${
                                  finding.severity === "High"
                                    ? "border border-[#F85149]/35 bg-[#F85149]/10 text-[#FFA198]"
                                    : finding.severity === "Medium"
                                      ? "border border-[#D29922]/35 bg-[#D29922]/10 text-[#E3B341]"
                                      : "border border-[#58A6FF]/35 bg-[#58A6FF]/10 text-[#79C0FF]"
                                }`}
                              >
                                {finding.severity}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="border-t border-[#30363D] px-3 pb-3 pt-2 text-xs leading-relaxed text-[#8B949E]">
                            <p>{finding.body}</p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>

                    {prReviewStage === "reviewing" && (
                      <div className="inline-flex items-center gap-1.5 text-xs text-[#8B949E]">
                        <span>Reviewing changed lines</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/80 animate-pulse [animation-delay:0ms]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/80 animate-pulse [animation-delay:180ms]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/80 animate-pulse [animation-delay:360ms]" />
                      </div>
                    )}
                  </div>
                )}
              </div>

            </TabsContent>

            <TabsContent
              value="debug-fix"
              className="mt-0 rounded-none border-0 bg-transparent p-0 px-1 focus-visible:outline-none space-y-4"
            >
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]">
                <div className="order-2 h-[380px] overflow-hidden rounded-2xl border border-[#30363D] bg-[#0D1117]">
                  <div className="flex items-center justify-between border-b border-[#30363D] bg-[#161B22] px-3 py-1.5 text-[11px] text-[#9DA5B4]">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
                      <span className="ml-2">Visual Studio Code</span>
                    </div>
                    <span className="hidden text-[#8B949E] sm:inline">automata-qa / tests/e2e/login.spec.ts</span>
                  </div>

                  <div className="flex h-full">
                    <aside className="hidden w-10 shrink-0 flex-col items-center gap-3 border-r border-[#30363D] bg-[#11161E] py-3 md:flex">
                      <FileCode2 className="h-4 w-4 text-[#C9D1D9]" />
                      <Search className="h-4 w-4 text-[#8B949E]" />
                      <GitBranch className="h-4 w-4 text-[#8B949E]" />
                      <Bug className="h-4 w-4 text-[#8B949E]" />
                      <Terminal className="h-4 w-4 text-[#8B949E]" />
                    </aside>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-center border-b border-[#30363D] bg-[#161B22] text-xs">
                        <div className="flex items-center gap-2 border-r border-[#30363D] bg-[#0D1117] px-3 py-2 text-[#C9D1D9]">
                          <FileCode2 className="h-3.5 w-3.5" />
                          <span>login.spec.ts</span>
                        </div>
                        <div className="hidden px-3 py-2 text-[#8B949E] sm:block">tests/e2e</div>
                        <div className="ml-auto px-3 py-2 text-[#8B949E]">
                          {debugFixApplied ? "Patch applied" : "Patch pending"}
                        </div>
                      </div>

                      <div className="flex-1 overflow-x-auto">
                        <div className="min-w-[620px] p-4 font-mono text-[12px] leading-relaxed text-[#C9D1D9] sm:min-w-0">
                          {renderEditorLines(
                            debugFixApplied ? debugFixedCode : debugFlakyCode,
                            1,
                            false,
                            false,
                            debugFixApplied ? [] : [5]
                          )}

                          <div
                            className={`mt-4 overflow-hidden rounded-lg border border-[#30363D] bg-[#161B22] transition-all duration-500 ${
                              debugShowSuggestion ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 border-b border-[#30363D] px-3 py-2">
                              <span className="text-[11px] text-[#9DA5B4]">Suggested repair</span>
                              <span className={`text-[11px] ${debugFixApplied ? "text-[#7EE787]" : "text-[#9CC3FF]"}`}>
                                {debugFixApplied ? "Applied" : "AI suggestion"}
                              </span>
                            </div>
                            <div className="p-3 font-mono text-[12px] leading-relaxed">
                              {debugSuggestedDiff.split("\n").map((line) => {
                                const isAddition = line.startsWith("+");
                                const isRemoval = line.startsWith("-");

                                return (
                                  <p
                                    key={line}
                                    className={
                                      isAddition
                                        ? "text-[#7EE787]"
                                        : isRemoval
                                          ? "text-[#FFA198]"
                                          : "text-[#C9D1D9]"
                                    }
                                  >
                                    {line}
                                  </p>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-[#30363D] bg-[#161B22] px-3 py-1 text-[11px] text-[#C9D1D9]">
                        <div className="flex items-center gap-3">
                          <span>TypeScript</span>
                          <span>UTF-8</span>
                          <span>LF</span>
                        </div>
                        <div className="hidden items-center gap-3 text-[#9DA5B4] sm:flex">
                          <span>Ln 5, Col 9</span>
                          <span>Spaces: 2</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="order-1 flex h-[380px] flex-col overflow-hidden rounded-2xl border border-[#30363D] bg-[#0D1117]">
                  <div className="flex items-center justify-between gap-2 border-b border-[#30363D] bg-[#161B22] px-4 py-2">
                    <div className="flex items-center gap-2 text-[11px] text-[#C9D1D9]">
                      <GitBranch className="h-3.5 w-3.5 text-[#8B949E]" />
                      <span>.github/workflows/e2e-tests.yml</span>
                    </div>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${
                        debugStage === "fixed"
                          ? "border-[#3FB950]/35 bg-[#238636]/15 text-[#86B994]"
                          : debugStage === "failed"
                            ? "border-[#F85149]/35 bg-[#F85149]/10 text-[#D79999]"
                            : debugStage === "analyzing" || debugStage === "suggested"
                              ? "border-[#58A6FF]/35 bg-[#1F6FEB]/15 text-[#9CC3FF]"
                              : "border-white/15 bg-white/5 text-[#9DA5B4]"
                      }`}
                    >
                      {debugStage === "running"
                        ? "Running"
                        : debugStage === "failed"
                          ? "Failed"
                          : debugStage === "analyzing"
                            ? "AI analyzing"
                            : debugStage === "suggested"
                              ? "Patch ready"
                              : "Recovered"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#30363D] bg-[#11161E] px-4 py-2 text-[11px] text-[#8B949E]">
                    <span>qa-e2e / Pull Request #482</span>
                    <span>run #142</span>
                  </div>
                  <div
                    ref={debugLogScrollRef}
                    className="min-h-0 flex-1 overflow-y-auto p-4 font-mono text-[12px] leading-relaxed"
                  >
                    <div className="space-y-1.5">
                    {debugTerminalLines.slice(0, debugVisibleTerminalLines).map((line, index) => (
                      <div key={line.text} className="grid grid-cols-[1.9rem_1fr] gap-x-2">
                        <span className="select-none text-right text-[#6E7681]">{index + 1}</span>
                        <span
                          className={
                            line.tone === "pass"
                              ? "text-[#86B994]"
                              : line.tone === "fail"
                                ? "text-[#D79999]"
                                : line.tone === "error"
                                  ? "pt-1 text-[#E6A6A6]"
                                  : line.tone === "command"
                                    ? "text-[#C9D1D9]"
                                    : line.tone === "info"
                                      ? "text-[#9CC3FF]"
                                      : "text-[#9DA5B4]"
                          }
                        >
                          {line.text}
                        </span>
                      </div>
                    ))}

                    {(debugStage === "running" || debugStage === "analyzing") && (
                      <div className="inline-flex items-center gap-1.5 pl-[2.15rem] pt-1 text-xs text-[#8B949E]">
                        <span>{debugStage === "running" ? "Executing test suite" : "Analyzing failure"}</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/80 animate-pulse [animation-delay:0ms]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/80 animate-pulse [animation-delay:180ms]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/80 animate-pulse [animation-delay:360ms]" />
                      </div>
                    )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#30363D] bg-[#11161E] px-4 py-2 text-[11px] text-[#8B949E]">
                    <span>Recovered after AI patch</span>
                    <span className="uppercase tracking-wide">GitHub Actions log</span>
                  </div>
                </div>
              </div>

            </TabsContent>

          </Tabs>
          <div className="border-t border-border bg-card/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={replayActiveExample}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Replay
              </Button>
              <Button variant="outline" size="sm" onClick={goToNextExample}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
