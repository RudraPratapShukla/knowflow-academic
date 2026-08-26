import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { VideoCard } from "@/components/VideoCard";
import { ArticleCard } from "@/components/ArticleCard";
import { BlogCard } from "@/components/BlogCard";
import { ResultSection } from "@/components/ResultSection";
import { SkeletonCard } from "@/components/SkeletonCard";
import { searchAll, VideoResult, ArticleResult, BlogResult } from "@/lib/mock-data";
import { Play, Smartphone, FileText, BookOpen, SearchX } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<{
    videos: VideoResult[];
    shorts: VideoResult[];
    articles: ArticleResult[];
    blogs: BlogResult[];
  }>({ videos: [], shorts: [], articles: [], blogs: [] });

  const [videoPage, setVideoPage] = useState(1);
  const [shortsPage, setShortsPage] = useState(1);
  const [articlePage, setArticlePage] = useState(1);
  const [blogPage, setBlogPage] = useState(1);
  const VIDEOS_PER_PAGE = 8;
  const SHORTS_PER_PAGE = 12;
  const ARTICLES_PER_PAGE = 8;
  const BLOGS_PER_PAGE = 8;

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setVideoPage(1);
    setShortsPage(1);
    setArticlePage(1);
    setBlogPage(1);

    // Create an async function inside the effect
    const performSearch = async () => {
      try {
        const data = await searchAll(query);
        setResults(data);
      } catch (error) {
        console.error("Failed to search:", error);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query]);

  const totalResults = results.videos.length + results.shorts.length + results.articles.length + results.blogs.length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8">
        {query && (
          <p className="mb-6 text-sm text-muted-foreground">
            {loading ? "Searching..." : `${totalResults} results for`}{" "}
            <span className="font-medium text-foreground">"{query}"</span>
          </p>
        )}

        {loading ? (
          <div className="space-y-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-5 w-32 rounded bg-muted animate-pulse" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              </div>
            ))}
          </div>
        ) : totalResults === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <SearchX className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h2 className="text-lg font-semibold text-foreground">No results found</h2>
            <p className="mt-1 text-sm text-muted-foreground">Try a different search term or browse our blog posts.</p>
          </div>
        ) : (
          <Tabs defaultValue="videos" className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="videos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Play className="h-4 w-4 mr-2" /> Videos
              </TabsTrigger>
              <TabsTrigger value="shorts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Smartphone className="h-4 w-4 mr-2" /> Shorts
              </TabsTrigger>
              <TabsTrigger value="articles" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <FileText className="h-4 w-4 mr-2" /> Articles
              </TabsTrigger>
              <TabsTrigger value="blogs" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <BookOpen className="h-4 w-4 mr-2" /> Web Logs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="videos" className="mt-0 outline-none">
              <ResultSection title="Top Videos" count={results.videos.length} icon={<Play className="h-5 w-5" />}>
                <div className="space-y-3">
                  {[...results.videos]
                    .sort((a, b) => b.credibilityScore - a.credibilityScore)
                    .slice((videoPage - 1) * VIDEOS_PER_PAGE, videoPage * VIDEOS_PER_PAGE)
                    .map((v) => (
                      <VideoCard key={v.id} video={v} />
                    ))}
                </div>
                {Math.ceil(results.videos.length / VIDEOS_PER_PAGE) > 1 && (
                  <div className="mt-8">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setVideoPage(p => Math.max(1, p - 1))}
                            className={videoPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        <PaginationItem>
                          <span className="text-sm font-medium text-muted-foreground mx-4">
                            Page {videoPage} of {Math.ceil(results.videos.length / VIDEOS_PER_PAGE)}
                          </span>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setVideoPage(p => Math.min(Math.ceil(results.videos.length / VIDEOS_PER_PAGE), p + 1))}
                            className={videoPage === Math.ceil(results.videos.length / VIDEOS_PER_PAGE) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </ResultSection>
            </TabsContent>

            <TabsContent value="shorts" className="mt-0 outline-none">
              <ResultSection title="Top Shorts" count={results.shorts.length} icon={<Smartphone className="h-5 w-5" />}>
                <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {[...results.shorts]
                    .sort((a, b) => b.credibilityScore - a.credibilityScore)
                    .slice((shortsPage - 1) * SHORTS_PER_PAGE, shortsPage * SHORTS_PER_PAGE)
                    .map((s) => (
                      <VideoCard key={s.id} video={s} />
                    ))}
                </div>
                {Math.ceil(results.shorts.length / SHORTS_PER_PAGE) > 1 && (
                  <div className="mt-8">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setShortsPage(p => Math.max(1, p - 1))}
                            className={shortsPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        <PaginationItem>
                          <span className="text-sm font-medium text-muted-foreground mx-4">
                            Page {shortsPage} of {Math.ceil(results.shorts.length / SHORTS_PER_PAGE)}
                          </span>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setShortsPage(p => Math.min(Math.ceil(results.shorts.length / SHORTS_PER_PAGE), p + 1))}
                            className={shortsPage === Math.ceil(results.shorts.length / SHORTS_PER_PAGE) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </ResultSection>
            </TabsContent>

            <TabsContent value="articles" className="mt-0 outline-none">
              <ResultSection title="Verified Articles" count={results.articles.length} icon={<FileText className="h-5 w-5" />}>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[...results.articles]
                    .sort((a, b) => b.credibilityScore - a.credibilityScore)
                    .slice((articlePage - 1) * ARTICLES_PER_PAGE, articlePage * ARTICLES_PER_PAGE)
                    .map((a) => (
                      <ArticleCard key={a.id} article={a} />
                    ))}
                </div>
                {Math.ceil(results.articles.length / ARTICLES_PER_PAGE) > 1 && (
                  <div className="mt-8">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setArticlePage(p => Math.max(1, p - 1))}
                            className={articlePage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        <PaginationItem>
                          <span className="text-sm font-medium text-muted-foreground mx-4">
                            Page {articlePage} of {Math.ceil(results.articles.length / ARTICLES_PER_PAGE)}
                          </span>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setArticlePage(p => Math.min(Math.ceil(results.articles.length / ARTICLES_PER_PAGE), p + 1))}
                            className={articlePage === Math.ceil(results.articles.length / ARTICLES_PER_PAGE) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </ResultSection>
            </TabsContent>

            <TabsContent value="blogs" className="mt-0 outline-none">
              <ResultSection title="Web Logs (Blogs)" count={results.blogs.length} icon={<BookOpen className="h-5 w-5" />}>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[...results.blogs]
                    .sort((a, b) => b.credibilityScore - a.credibilityScore)
                    .slice((blogPage - 1) * BLOGS_PER_PAGE, blogPage * BLOGS_PER_PAGE)
                    .map((b) => (
                      <BlogCard key={b.id} blog={b} />
                    ))}
                </div>
                {Math.ceil(results.blogs.length / BLOGS_PER_PAGE) > 1 && (
                  <div className="mt-8">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setBlogPage(p => Math.max(1, p - 1))}
                            className={blogPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        <PaginationItem>
                          <span className="text-sm font-medium text-muted-foreground mx-4">
                            Page {blogPage} of {Math.ceil(results.blogs.length / BLOGS_PER_PAGE)}
                          </span>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setBlogPage(p => Math.min(Math.ceil(results.blogs.length / BLOGS_PER_PAGE), p + 1))}
                            className={blogPage === Math.ceil(results.blogs.length / BLOGS_PER_PAGE) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </ResultSection>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
