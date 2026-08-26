import { Link, useLocation } from "react-router-dom";
import { SearchBar } from "./SearchBar";
import { BookOpen } from "lucide-react";

export function Header() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
      <div className="container flex h-14 items-center gap-6">
        <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
          <BookOpen className="h-5 w-5 text-accent" />
          <span>KnowFlow</span>
        </Link>

        {!isHome && (
          <div className="flex-1 max-w-lg">
            <SearchBar variant="compact" initialQuery={new URLSearchParams(location.search).get("q") || ""} />
          </div>
        )}

        <nav className="ml-auto flex items-center gap-1">
          <Link
            to="/add-blog"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
          >
            Add Blog
          </Link>
          <Link
            to="/about"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
