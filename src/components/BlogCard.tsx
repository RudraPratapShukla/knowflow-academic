import { BlogResult } from "@/lib/mock-data";
import { CredibilityBadge } from "./CredibilityBadge";
import { Link } from "react-router-dom";
import { BadgeCheck, Star } from "lucide-react";

export function BlogCard({ blog }: { blog: BlogResult }) {
  return (
    <Link
      to={`/blog/${blog.id}`}
      className="group flex flex-col rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-card-hover hover:border-accent/20"
    >
      <h3 className="font-medium text-foreground leading-snug line-clamp-2 group-hover:text-accent transition-colors">
        {blog.title}
      </h3>
      <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
        <span>{blog.author}</span>
        {blog.isVerified && (
          <span className="inline-flex items-center gap-0.5 text-accent">
            <BadgeCheck className="h-3 w-3" />
          </span>
        )}
        <span className="inline-flex items-center gap-0.5">
          <Star className="h-3 w-3 fill-credibility-moderate text-credibility-moderate" />
          {blog.ratings}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{blog.summary}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {blog.tags.map((tag) => (
          <span key={tag} className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-auto pt-3">
        <CredibilityBadge score={blog.credibilityScore} size="sm" />
      </div>
    </Link>
  );
}
