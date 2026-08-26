import { ArticleResult } from "./mock-data";

const WIKI_API_BASE_URL = "https://en.wikipedia.org/w/api.php";

interface WikiSearchResult {
    title: string;
    pageid: number;
    size: number;
    wordcount: number;
    snippet: string;
    timestamp: string;
}

// Strip HTML tags from Wikipedia snippets
function stripHtmlTags(html: string): string {
    const doc = new DOMParser().parseDocumentFromString(html, 'text/html');
    return doc.body.textContent || "";
}

// DOMParser is not available in all environments (like Node.js tests), so a fallback is good.
// The browser has it natively.
function safeStripHtmlTags(html: string): string {
    try {
        const temp = document.createElement("div");
        temp.innerHTML = html;
        return temp.textContent || temp.innerText || "";
    } catch (e) {
        return html.replace(/<[^>]*>?/gm, '');
    }
}

/**
 * Calculates credibility score based on article word count as a proxy for depth/detail.
 */
function calculateCredibilityScore(wordcount: number): number {
    // A 3000-word Wikipedia article is extremely detailed and long. We'll use this as our max score baseline.
    const maxExpectedWords = 3000;
    const normalizedScore = Math.min((wordcount / maxExpectedWords) * 100, 100);

    // Give Wikipedia a massive structural baseline since it's an encyclopedia.
    const baseline = 65;
    const finalScore = Math.round(baseline + (normalizedScore * 0.35));

    return Math.max(10, Math.min(finalScore, 100));
}

export async function searchCrossrefArticles(query: string, maxResults = 30): Promise<ArticleResult[]> {
    try {
        // We use origin=* to bypass CORS issues on localhost
        const searchRes = await fetch(
            `${WIKI_API_BASE_URL}?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&origin=*&srlimit=${maxResults}`
        );

        if (!searchRes.ok) {
            throw new Error(`Wikipedia API error: ${searchRes.status}`);
        }

        const searchData = await searchRes.json();

        if (!searchData.query || !searchData.query.search) return [];

        return searchData.query.search
            .map((item: WikiSearchResult): ArticleResult => {
                const score = calculateCredibilityScore(item.wordcount);

                let publishedAt = "Unknown Date";
                if (item.timestamp) {
                    publishedAt = item.timestamp.split("T")[0];
                }

                return {
                    id: item.pageid.toString(),
                    type: "article",
                    title: item.title,
                    source: "Wikipedia",
                    author: "Wikipedia Contributors",
                    publishedAt,
                    summary: safeStripHtmlTags(item.snippet) + "...",
                    credibilityScore: score,
                    url: `https://en.wikipedia.org/?curid=${item.pageid}`,
                    isVerified: true, // Wikipedia is considered a verified encyclopedia baseline
                };
            })
            .filter((a: ArticleResult) => a.credibilityScore >= 70)
            .sort((a: ArticleResult, b: ArticleResult) => b.credibilityScore - a.credibilityScore);

    } catch (error) {
        console.error("Error fetching Wikipedia articles:", error);
        return [];
    }
}
