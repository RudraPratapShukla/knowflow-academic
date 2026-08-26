import { useState, FormEvent } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  variant?: "hero" | "compact";
  initialQuery?: string;
  className?: string;
}

export function SearchBar({ variant = "hero", initialQuery = "", className }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)}>
      <div
        className={cn(
          "relative flex items-center rounded-xl border bg-card transition-all duration-200",
          "focus-within:ring-2 focus-within:ring-accent/30 focus-within:border-accent/50",
          variant === "hero"
            ? "shadow-elevated max-w-2xl mx-auto h-14 px-5"
            : "h-10 px-3"
        )}
      >
        <Search
          className={cn(
            "shrink-0 text-muted-foreground",
            variant === "hero" ? "h-5 w-5" : "h-4 w-4"
          )}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topics, concepts, or keywords..."
          className={cn(
            "flex-1 bg-transparent outline-none placeholder:text-muted-foreground/60",
            variant === "hero" ? "ml-3 text-base" : "ml-2 text-sm"
          )}
        />
        <button
          type="submit"
          className={cn(
            "shrink-0 rounded-lg bg-accent font-medium text-accent-foreground transition-colors hover:bg-accent/90",
            variant === "hero" ? "px-5 py-2 text-sm" : "px-3 py-1.5 text-xs"
          )}
        >
          Search
        </button>
      </div>
    </form>
  );
}
