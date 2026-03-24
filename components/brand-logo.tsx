import Image from "next/image";

import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <span className={cn("flex items-center leading-none", className)}>
      <Image
        src="/automata-qa-logo.svg"
        alt="AutomataQA"
        width={300}
        height={52}
        className="block h-10 w-auto"
        priority
      />
    </span>
  );
}
