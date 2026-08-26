import { ReactNode } from "react";

interface ResultSectionProps {
  title: string;
  count: number;
  icon: ReactNode;
  children: ReactNode;
}

export function ResultSection({ title, count, icon, children }: ResultSectionProps) {
  if (count === 0) return null;

  return (
    <section className="animate-fade-in">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-accent">{icon}</span>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {count}
        </span>
      </div>
      {children}
    </section>
  );
}
