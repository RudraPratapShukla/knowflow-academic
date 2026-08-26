import { Link } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";
import { BookOpen, Zap, Shield, TrendingUp } from "lucide-react";

const features = [
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Smart-Ranked Results",
    description: "Every resource is scored by our credibility algorithm for quality you can trust.",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Verified Sources",
    description: "Curated articles and videos from trusted academic channels and publishers.",
  },
  {
    icon: <TrendingUp className="h-5 w-5" />,
    title: "Community Blogs",
    description: "Learn from peer-reviewed internal blog posts alongside external content.",
  },
];

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="gradient-hero flex flex-col items-center justify-center px-6 py-32 text-center">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="h-8 w-8 text-accent" />
          <span className="text-2xl font-bold text-primary-foreground">KnowFlow</span>
        </div>
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-primary-foreground sm:text-5xl">
          Search Smarter.{" "}
          <span className="gradient-hero-text">Learn Better.</span>
        </h1>
        <p className="mt-4 max-w-lg text-base text-primary-foreground/70">
          An advanced academic search engine that fetches, ranks, and aggregates the best educational content in one place.
        </p>
        <div className="mt-8 w-full max-w-2xl">
          <SearchBar variant="hero" />
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-primary-foreground/50">
          <span>Try:</span>
          {["Operating System Deadlock", "Binary Search Trees", "Machine Learning Basics"].map((t) => (
            <button
              key={t}
              onClick={() => {
                window.location.href = `/search?q=${encodeURIComponent(t)}`;
              }}
              className="rounded-full border border-primary-foreground/10 px-3 py-1 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground/80"
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-background py-20 px-6">
        <div className="container">
          <h2 className="text-center text-2xl font-bold text-foreground">
            Why KnowFlow?
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Quality-first approach to academic content discovery
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex flex-col items-center text-center rounded-xl border bg-card p-6 transition-all duration-200 hover:shadow-card-hover"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  {f.icon}
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8 px-6">
        <div className="container flex items-center justify-between text-xs text-muted-foreground">
          <span>© 2026 KnowFlow.</span>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <span className="hidden sm:inline-block border-l pl-4 border-border">Built by rudra pratap shukla</span>
          </div>
        </div>
        <div className="container mt-4 sm:hidden text-center flex justify-center text-xs text-muted-foreground">
          <span>Built by rudra pratap shukla</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
