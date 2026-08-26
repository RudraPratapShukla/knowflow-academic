import { getCredibilityLevel, getCredibilityLabel } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Shield, ShieldCheck, ShieldAlert } from "lucide-react";

interface CredibilityBadgeProps {
  score: number;
  showScore?: boolean;
  size?: "sm" | "md";
}

const icons = {
  high: ShieldCheck,
  moderate: Shield,
  low: ShieldAlert,
};

export function CredibilityBadge({ score, showScore = true, size = "md" }: CredibilityBadgeProps) {
  const level = getCredibilityLevel(score);
  const label = getCredibilityLabel(score);
  const Icon = icons[level];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        level === "high" && "bg-credibility-high/10 text-credibility-high",
        level === "moderate" && "bg-credibility-moderate/10 text-credibility-moderate",
        level === "low" && "bg-credibility-low/10 text-credibility-low"
      )}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      {showScore && <span>{score}</span>}
      <span>{label}</span>
    </span>
  );
}
