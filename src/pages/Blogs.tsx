import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { BlogCard } from "@/components/BlogCard";
import { BlogResult } from "@/lib/mock-data";
import { searchDevToBlogs } from "@/lib/blogs";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopBlogs = async () => {
      try {
        setLoading(true);
        // Fetch generic popular tech blogs when no query is provided
        const results = await searchDevToBlogs("software engineering", 21); // Fetch 21 for a nice grid
        setBlogs(results);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopBlogs();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-12">
        <h1 className="text-2xl font-bold text-foreground">Top Web Logs (Blogs)</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Community-written, credibility-scored technical content continuously curated from Dev.to.
        </p>

        {loading ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
