import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <span className={cn("flex items-center leading-none", className)}>
      <img
        src="automata-qa-logo.svg"
        alt="AutomataQA"
        width={300}
        height={52}
        className="block h-10 w-auto"
      />
    </span>
  );
}
