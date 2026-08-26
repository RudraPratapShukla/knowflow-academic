import { BlogResult } from "./mock-data";

const HN_API_BASE_URL = "https://hn.algolia.com/api/v1";

interface HNStory {
    objectID: string;
    title: string;
    author: string;
    created_at: string;
    points: number;
    num_comments: number;
    url?: string;
    story_text?: string;
    _tags?: string[];
}

/**
 * Maps HackerNews score to our 1-5 rating visual system
 */
function calculateRating(score: number): number {
    if (score >= 90) return 5;
    if (score >= 75) return 4.5;
    if (score >= 60) return 4;
    if (score >= 40) return 3.5;
    if (score >= 20) return 3;
    return 2;
}

/**
 * Calculates credibility score based on HN engagement metrics.
 */
function calculateCredibilityScore(points: number, comments: number): number {
    // HN points are highly regulated by the community. 250 points is very high.
    const pointsScore = Math.min((points / 250) * 100, 100) * 0.60;

    // Comments indicate active discussion. 150 comments is massive.
    const commentScore = Math.min((comments / 150) * 100, 100) * 0.40;

    const totalScore = Math.round(pointsScore + commentScore);

    return Math.max(10, Math.min(totalScore, 100));
}

export async function searchDevToBlogs(query: string, maxResults = 30): Promise<BlogResult[]> {
    try {
        // We use tags=story to ensure we only get top-level posts, not individual comments
        const searchRes = await fetch(
            `${HN_API_BASE_URL}/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=${maxResults}`
        );

        if (!searchRes.ok) {
            throw new Error(`HackerNews API error: ${searchRes.status}`);
        }

        const searchData = await searchRes.json();

        if (!searchData.hits || searchData.hits.length === 0) return [];

        return searchData.hits
            .map((item: HNStory): BlogResult => {
                const score = calculateCredibilityScore(item.points || 0, item.num_comments || 0);
                const rating = calculateRating(score);

                // Convert ISO date
                const publishedAt = item.created_at.split("T")[0];

                // Create a clean summary
                let summary = "";
                if (item.story_text) {
                    summary = item.story_text.replace(/<[^>]*>?/gm, '').substring(0, 150) + "...";
                } else if (item.url) {
                    summary = `Discussion linking to: ${item.url}`;
                } else {
                    summary = "Community discussion thread.";
                }

                // Extract a tag if possible
                const tags = ["HackerNews"];

                return {
                    id: item.objectID,
                    type: "blog",
                    title: item.title || "Untitled Discussion",
                    author: item.author,
                    tags,
                    publishedAt,
                    summary,
                    content: item.story_text || `Link: ${item.url}`,
                    credibilityScore: score,
                    isVerified: score > 75, // Verify highly upvoted posts
                    ratings: rating,
                };
            })
            // Filter out zero engagement posts
            .filter((b: BlogResult) => b.credibilityScore >= 20)
            .sort((a: BlogResult, b: BlogResult) => b.credibilityScore - a.credibilityScore);

    } catch (error) {
        console.error("Error fetching HackerNews posts:", error);
        return [];
    }
}

export async function getRedditPost(id: string): Promise<BlogResult | null> {
    try {
        const res = await fetch(`${HN_API_BASE_URL}/items/${id}`);
        if (!res.ok) return null;

        const data: HNStory = await res.json();

        const score = calculateCredibilityScore(data.points || 0, data.num_comments || 0);
        const rating = calculateRating(score);

        const publishedAt = data.created_at.split("T")[0];

        return {
            id: data.objectID,
            type: "blog",
            title: data.title,
            author: data.author,
            tags: ["HackerNews"],
            publishedAt,
            summary: data.story_text ? data.story_text.replace(/<[^>]*>?/gm, '').substring(0, 150) + "..." : (data.url || ""),
            content: data.story_text || `Link: ${data.url}`,
            credibilityScore: score,
            isVerified: score > 75,
            ratings: rating,
        };
    } catch (error) {
        console.error("Error fetching individual HackerNews post:", error);
        return null;
    }
}
