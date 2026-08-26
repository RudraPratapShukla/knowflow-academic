import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { CredibilityBadge } from "@/components/CredibilityBadge";
import { getRedditPost } from "@/lib/blogs";
import { BlogResult } from "@/lib/mock-data";
import { ArrowLeft, BadgeCheck, Star, Calendar } from "lucide-react";

export default function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState<BlogResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getRedditPost(id);
        setBlog(data);
      } catch (error) {
        console.error("Failed to fetch blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container max-w-3xl py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="space-y-2 pt-8">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-12 text-center">
          <p className="text-muted-foreground">Blog post not found.</p>
          <Link to="/blogs" className="mt-4 inline-block text-sm text-accent hover:underline">
            ← Back to blogs
          </Link>
        </main>
      </div>
    );
  }

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("### ")) return <h3 key={i} className="mt-6 mb-2 text-lg font-semibold text-foreground">{line.slice(4)}</h3>;
      if (line.startsWith("## ")) return <h2 key={i} className="mt-8 mb-3 text-xl font-bold text-foreground">{line.slice(3)}</h2>;
      if (line.startsWith("# ")) return <h1 key={i} className="mt-8 mb-4 text-2xl font-bold text-foreground">{line.slice(2)}</h1>;
      if (line.trim() === "") return <br key={i} />;
      return <p key={i} className="text-muted-foreground leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container max-w-3xl py-12">
        <Link to="/blogs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to blogs
        </Link>

        <article>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {blog.tags.map((tag) => (
              <span key={tag} className="rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl font-bold text-foreground leading-tight">{blog.title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              {blog.author}
              {blog.isVerified && <BadgeCheck className="h-4 w-4 text-accent" />}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(blog.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-credibility-moderate text-credibility-moderate" />
              {blog.ratings}
            </span>
            <CredibilityBadge score={blog.credibilityScore} size="sm" />
          </div>

          <div className="mt-8 border-t pt-8">
            {renderContent(blog.content)}
          </div>
        </article>
      </main>
    </div>
  );
}
