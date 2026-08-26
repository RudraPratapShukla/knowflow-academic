export type CredibilityLevel = "high" | "moderate" | "low";

export interface VideoResult {
  id: string;
  type: "video" | "short";
  title: string;
  channel: string;
  thumbnail: string;
  views: string;
  publishedAt: string;
  summary: string;
  credibilityScore: number;
  url: string;
  tags?: string[];
}

export interface ArticleResult {
  id: string;
  type: "article";
  title: string;
  source: string;
  author: string;
  publishedAt: string;
  summary: string;
  credibilityScore: number;
  url: string;
  isVerified: boolean;
}

export interface BlogResult {
  id: string;
  type: "blog";
  title: string;
  author: string;
  tags: string[];
  publishedAt: string;
  summary: string;
  content: string;
  credibilityScore: number;
  isVerified: boolean;
  ratings: number;
}

export type SearchResult = VideoResult | ArticleResult | BlogResult;

export function getCredibilityLevel(score: number): CredibilityLevel {
  if (score >= 71) return "high";
  if (score >= 41) return "moderate";
  return "low";
}

export function getCredibilityLabel(score: number): string {
  const level = getCredibilityLevel(score);
  return level.charAt(0).toUpperCase() + level.slice(1);
}


import { searchYouTubeVideos, searchYouTubeShorts } from "./youtube";
import { searchCrossrefArticles } from "./articles";
import { searchDevToBlogs } from "./blogs";

export async function searchAll(query: string): Promise<{ videos: VideoResult[]; shorts: VideoResult[]; articles: ArticleResult[]; blogs: BlogResult[] }> {
  // 1. Fetch YouTube Videos first to extract SEO tags
  const videos = await searchYouTubeVideos(query);

  // 2. Extract the top 3-5 tags from the highest-ranked videos
  const extractedTags = new Set<string>();
  for (const video of videos.slice(0, 3)) { // Look at top 3 videos
    if (video.tags && video.tags.length > 0) {
      // Add the first 2 tags from each of the top 3 videos
      video.tags.slice(0, 2).forEach(tag => extractedTags.add(tag));
    }
  }

  // Combine original query with extracted tags for an enriched search
  const tagsString = Array.from(extractedTags).join(" ");
  const expandedQuery = tagsString ? `${query} ${tagsString}` : query;

  console.log("Original Query:", query);
  console.log("Expanded Query for YouTube SEO relevance:", expandedQuery);

  // 3. Execute remaining searches in parallel. 
  // We use the raw query for Wikipedia and HackerNews as they don't need SEO tag injection
  const [shorts, articles, blogs] = await Promise.all([
    searchYouTubeShorts(query),
    searchCrossrefArticles(query),
    searchDevToBlogs(query)
  ]);

  return {
    videos,
    shorts,
    articles,
    blogs,
  };
}
