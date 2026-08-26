import { ArticleResult } from "@/lib/mock-data";
import { CredibilityBadge } from "./CredibilityBadge";
import { ExternalLink, BadgeCheck } from "lucide-react";

export function ArticleCard({ article }: { article: ArticleResult }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-card-hover hover:border-accent/20"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-foreground leading-snug line-clamp-2 group-hover:text-accent transition-colors">
          {article.title}
        </h3>
        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
      </div>
      <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
        <span>{article.source}</span>
        {article.isVerified && (
          <span className="inline-flex items-center gap-0.5 text-accent">
            <BadgeCheck className="h-3 w-3" />
            Verified
          </span>
        )}
        <span>· {article.author}</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{article.summary}</p>
      <div className="mt-auto pt-3">
        <CredibilityBadge score={article.credibilityScore} size="sm" />
      </div>
    </a>
  );
}
